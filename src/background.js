/**
 * @file background.js
 * @description Background service worker for the ProbExtShield Chrome extension.
 * Tracks extension probing activity and updates badge UI.
 */

const REPORT_EXPIRY_MS = 28 * 24 * 60 * 60 * 1000; // 28 days
const REPORT_CACHE_MAX = 1000;
const REPORTED_CACHE_KEY = 'reportedMap';
const GA_MEASUREMENT_ID = 'G-97QJ8QTPJ1';
const GA_API_SECRET = 'zUkd940YQFqIsxpFBCVEzw';
const GA_ENDPOINT = `https://www.google-analytics.com/mp/collect?measurement_id=${GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`;
let GA_CLIENT_ID = null;

function loadReportedMap() {
  chrome.storage.local.get([REPORTED_CACHE_KEY], (result) => {
    const raw = result[REPORTED_CACHE_KEY];
    if (raw) {
      const now = Date.now();
      const entries = Object.entries(raw)
        .filter(([_, ts]) => now - ts < REPORT_EXPIRY_MS) // not expired
        .sort((a, b) => b[1] - a[1])                      // sort by newest first
        .slice(0, REPORT_CACHE_MAX);                      // keep most recent N

      reportedMap.clear();
      for (const [key, ts] of entries) {
        reportedMap.set(key, ts);
      }
    }
  });
}

function saveReportedMap() {
  // Trim to latest 1000 before saving
  const now = Date.now();
  const trimmed = Array.from(reportedMap.entries())
    .filter(([_, ts]) => now - ts < REPORT_EXPIRY_MS)
    .sort((a, b) => b[1] - a[1])
    .slice(0, REPORT_CACHE_MAX);

  const obj = Object.fromEntries(trimmed);
  chrome.storage.local.set({ [REPORTED_CACHE_KEY]: obj });
}

// Badge cache and debounce
const messageCache = new Map(); // tabId -> { hostname, extensions: Set }
const badgeTimers = new Map();  // tabId -> timeoutID

function scheduleBadgeUpdate(tabId) {
  if (badgeTimers.has(tabId)) {
    clearTimeout(badgeTimers.get(tabId));
  }

  const timeoutId = setTimeout(() => {
    updateBadge(tabId);
    badgeTimers.delete(tabId);
  }, 1000); // Debounce delay

  badgeTimers.set(tabId, timeoutId);
}

function updateBadge(tabId) {
  const entry = messageCache.get(tabId);
  if (!entry) return;

  const { hostname, extensions } = entry;
  const count = extensions.size;

  chrome.action.setBadgeText({ tabId, text: `${count}` });
  chrome.action.setBadgeBackgroundColor({ tabId, color: '#FF5722' });
  chrome.action.setTitle({
    tabId,
    title: `${hostname} probed ${count} extension${count !== 1 ? 's' : ''}.`
  });
}

// Analytics queue and deduplication
const reportedMap = new Map(); // key -> timestamp
const reportingQueue = [];     // Queue of { hostname, extensionId }
let reportingTimer = null;

function processReportingQueue() {
  if (reportingQueue.length === 0) {
    reportingTimer = null;
    return;
  }

  const { hostname, extensionId } = reportingQueue.shift();
  sendProbeEvent(hostname, extensionId);
  reportingTimer = setTimeout(processReportingQueue, 750); // Adjust trickle rate
}

const IS_DEV = true;    // Set to false for production
const MAX_GA_HITS = 3;  // Cap GA hits while developing
let gaHitCount = 0;

async function sendProbeEvent(hostname, extensionId) {
  if (IS_DEV && gaHitCount >= MAX_GA_HITS) {
    return;
  }

  try {
    const path = `/${hostname}/${extensionId}`;
    await fetch(GA_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        client_id: GA_CLIENT_ID,
        events: [
          {
            name: 'page_view',
            params: {
              page_location: `https://probextshield.ca${path}`,
              page_path: path,
              page_title: `${hostname} → ${extensionId}`
            }
          }
        ]
      })
    });

    if (IS_DEV) gaHitCount++;
  } catch (err) {
    console.error("Error sending GA event", err);
  }
}

// Main message handler
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'clearCache') {
    reportedMap.clear();
    chrome.storage.local.remove(REPORTED_CACHE_KEY);
    messageCache.clear();
    badgeTimers.clear();
    reportingQueue.length = 0;
    if (reportingTimer) {
      clearTimeout(reportingTimer);
      reportingTimer = null;
    }
    gaHitCount = 0;

    sendResponse({ success: true });
    return true;
  }

  if (msg.type === "fetchDetected") {
    const tabId = sender.tab?.id;
    const { extensionId, hostname, track } = msg;

    if (tabId !== undefined) {
      let entry = messageCache.get(tabId);
      if (!entry) {
        entry = { hostname, extensions: new Set() };
        messageCache.set(tabId, entry);
      }
      entry.extensions.add(extensionId);
      scheduleBadgeUpdate(tabId);
    }

    if (track) {
      const dedupeKey = `${hostname}|${extensionId}`;
      const lastReported = reportedMap.get(dedupeKey);
      const now = Date.now();

      if (!lastReported || (now - lastReported > REPORT_EXPIRY_MS)) {
        reportedMap.set(dedupeKey, now);
        saveReportedMap();
        reportingQueue.push({ hostname, extensionId });

        if (!reportingTimer) {
          processReportingQueue();
        }
      }
    }
  }
});

// Open options page on install/update or icon click
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['gaClientId'], (result) => {
    if (result.gaClientId) {
      GA_CLIENT_ID = result.gaClientId;
    } else {
      GA_CLIENT_ID = crypto.randomUUID();
      chrome.storage.local.set({ gaClientId: GA_CLIENT_ID });
    }
  });

  chrome.runtime.openOptionsPage();
});

chrome.storage.local.get(['gaClientId'], (result) => {
  if (result.gaClientId) {
    GA_CLIENT_ID = result.gaClientId;
  }
  loadReportedMap();
});

chrome.action.onClicked.addListener(() => chrome.runtime.openOptionsPage());
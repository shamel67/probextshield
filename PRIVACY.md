# 🛡️ Privacy Policy – ProbExtShield

Last updated: 2025-03-28

This Chrome extension is built with privacy-first principles and is designed specifically to protect users from websites that attempt to detect installed browser extensions.

---

## 🔍 What ProbExtShield Does

- Monitors websites for attempts to access known `chrome-extension://` paths
- Detects when a site probes for the presence of specific Chrome extensions and block them (optional)
- Alerts users via a badge indicator
- Optionally sends anonymized analytics to collectively identify websites abusing of this technique (optional)

---

## ✅ What We Collect

If enabled (via the **Options page**), ProbExtShield may send **anonymized analytics events** to Google Analytics 4 (GA4) to help monitor which sites are performing extension probing.

Each event includes:

- A **randomly generated client ID** (stored only on your machine)
- The **hostname** of the probing website (e.g., `linkedin.com`)
- The **extension ID** that was being probed
- A synthetic pageview sent to a fake domain (e.g., `https://probextshield.ca/linkedin.com/abcdefg1234`)

---

## ❌ What We Do NOT Collect

We do **not** collect or store any of the following:

- Your IP address (GA4 is configured to anonymize IPs)
- Cookies or persistent browser identifiers
- Any data about your browsing history or installed extensions
- Any personal or sensitive information

---

## 🗂️ Local Storage

We use `chrome.storage.local` to:

- Persist a random GA client ID for deduplication
- Cache detection events (hostname + extension ID) for up to 28 days
- Limit analytics reporting to avoid flooding

All data is stored locally in your browser and can be deleted via the extension’s **Options page**.

---

## 📡 Analytics

Analytics are:

- **Optional**: Controlled by the extension’s internal `track` setting
- **Anonymous**: No user-identifying data is sent
- **Throttled**: Only one event per hostname+extensionId per 28-day window
- **Privacy-Scoped**: Events are sent as fake pageviews to a non-existent domain

---

## ⚙️ User Controls

- Clear analytics cache from the Options page at any time
- Badge indicators show probing activity in real-time
- Extension behavior is visible, inspectable, and fully open source

---

## 🔒 Summary

ProbExtShield is designed to enhance your privacy. It does not collect personal information, does not share personal data with third parties, and operates in a transparent and user-respecting manner.

For questions, concerns, or permission to use ProbExtShield commercially, contact:

**Stéphane Hamel**  
shamel67@gmail.com
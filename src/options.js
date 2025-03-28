/**
 * @file options.js
 * @description 
 * Options page logic for ProbExtShield. Initializes and renders the UI,
 * loads and stores user preferences.
 */

document.addEventListener('DOMContentLoaded', () => {
  const optInCheckbox = document.getElementById('optInTracking');
  const blockExtProbing = document.getElementById('blockExtProbing');

  // Load the saved value
  chrome.storage.local.get(null, (result) => {
    optInCheckbox.checked = result.optInTracking || false;
    blockExtProbing.checked = result.blockExtProbing || true;
  });

  // Save the value when toggled
  optInCheckbox.addEventListener('change', () => {
    chrome.storage.local.set({ optInTracking: optInCheckbox.checked });
  });
  // Save the value when toggled
  blockExtProbing.addEventListener('change', () => {
    chrome.storage.local.set({ blockExtProbing: blockExtProbing.checked });
  });

  document.getElementById('clearCache').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'clearCache' }, (response) => {
      if (response?.success) {
        const msgDiv = document.getElementById('cacheMessage');
        msgDiv.textContent = '✅ Cache cleared!';
        msgDiv.classList.add('visible');

        setTimeout(() => {
          msgDiv.classList.remove('visible');
        }, 2000);
      }
    });
  });
});
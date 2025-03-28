/**
 * @file privacy.js
 * @description 
 * Conditionally injects `probe.js` into the page to prevent malicious probing 
 * of extensions via `fetch()` or similar APIs.
 * 
 * This script checks if CleanedIn is enabled and if the probing protection option is active.
 * If so, it injects a script tag referencing `probe.js` and removes it after execution.
 */

// Inject probing protection in the page
(async () => {
	const storage = await chrome.storage.local.get(["blockExtProbing", "optInTracking"]);

	const config = {
		block: storage.blockExtProbing ?? true,
		track: storage.optInTracking ?? false
	};

	const script = document.createElement("script");
	script.src = chrome.runtime.getURL("probe.js");
	script.type = "application/javascript";
	script.dataset.config = JSON.stringify(config);
	document.documentElement.appendChild(script);
	script.onload = () => script.remove();

	window.addEventListener("message", (event) => {
	  if (
	    event.source !== window ||
	    event.data?.source !== "ProbExtShield" ||
	    event.data?.type !== "fetchDetected"
	  ) return;

	  chrome.runtime.sendMessage({
	    type: "fetchDetected",
	    extensionId: event.data.extensionId,
	    hostname: event.data.hostname,
	    track: config.track
	  });
	});
})();
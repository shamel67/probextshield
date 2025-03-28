/**
 * @file probe.js
 * @description 
 * Protects the user's privacy by preventing extensions from being probed or fetched by 
 * external scripts via `fetch()`. If a request attempts to access 
 * `chrome-extension://` URLs, it is intercepted and blocked with a 
 * 403 Forbidden response.
 */

(() => {
    if (window.__pesProbingBlocked) return;
    window.__pesProbingBlocked = true;

    const currentScript = document.currentScript;
    const config = JSON.parse(currentScript?.dataset?.config || "{}");
    const originalFetch = window.fetch;

    function blockedFetch(resource, options) {
        const url = typeof resource === "string" ? resource : resource?.url;
        const isProbing = url?.startsWith("chrome-extension://");

        if (isProbing) {
            const extId = url.split("/")[2];
            const hostname = location.hostname;

            // Notify content script
            window.postMessage({
                source: "ProbExtShield",
                type: "fetchDetected",
                extensionId: extId,
                hostname
            }, "*");

            if (config.block) {
                return new Response(null, { status: 403, statusText: "Forbidden" });
            }
        }

    return originalFetch.apply(window, arguments);
    }

    window.fetch = blockedFetch;
})();
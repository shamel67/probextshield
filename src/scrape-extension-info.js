// scrape-extension-info.js
(() => {
  const title = document.querySelector('meta[name="og:title"]')?.content || "Unknown Extension";
  const icon = document.querySelector('meta[name="image"]')?.content || "";

  chrome.runtime.sendMessage({
    type: "scrapedExtensionInfo",
    data: { title, icon }
  });
})();
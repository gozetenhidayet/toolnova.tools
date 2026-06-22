// Context menu — right click options
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "toolnova-qr",
    title: "📱 Generate QR Code for this page",
    contexts: ["page", "link"]
  });
  chrome.contextMenus.create({
    id: "toolnova-wordcount",
    title: "📝 Count selected words",
    contexts: ["selection"]
  });
  chrome.contextMenus.create({
    id: "toolnova-home",
    title: "🌐 Open toolnova.tools",
    contexts: ["page"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "toolnova-qr") {
    const url = info.linkUrl || tab.url;
    chrome.tabs.create({
      url: `https://toolnova.tools/qr-code-generator.html?url=${encodeURIComponent(url)}`
    });
  }
  if (info.menuItemId === "toolnova-wordcount") {
    chrome.tabs.create({ url: "https://toolnova.tools/word-counter.html" });
  }
  if (info.menuItemId === "toolnova-home") {
    chrome.tabs.create({ url: "https://toolnova.tools" });
  }
});

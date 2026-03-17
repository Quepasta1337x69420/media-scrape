document.getElementById("scrapeBtn").addEventListener("click", async () => {

  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true
  });

  const tab = tabs[0];

  await browser.tabs.sendMessage(tab.id, {
    action: "scrapeVideos"
  });

});

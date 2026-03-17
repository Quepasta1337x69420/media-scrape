browser.runtime.onMessage.addListener((msg) => {

  if (msg.action !== "scrapeVideos") return;

  console.log("🔵 Scraping media links...");

  const videoRegex = /\.(png|gif|jpg|jpeg|mp4|webm|mkv|mov|ogg|ogv|m3u8)(\?|$)/i;

  const links = [...document.querySelectorAll("a")]
    .map(a => a.href)
    .filter(h => videoRegex.test(h))
    .slice(0,100);

  const videoTags = [...document.querySelectorAll("video source, video")]
    .map(v => v.src)
    .filter(Boolean);

  const all = [...new Set([...links, ...videoTags])];

  if (!all.length) {
    alert("No media links found.");
    return;
  }

  console.log(`🟢 Found ${all.length} videos`);

  let playlist = "#Playlist\n";

  all.forEach(url=>{
    playlist += url + "\n";
  });

  const blob = new Blob([playlist], {type:"text/plain"});
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `media_${Date.now()}.txt`;
  a.click();
  alert("Downloaded playlist!");

  URL.revokeObjectURL(url);

});

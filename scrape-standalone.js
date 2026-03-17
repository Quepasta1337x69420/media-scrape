// 🔍 QUICK LINK SCRAPER - CONSOLE TEST MODE 🔍
(function() {
  const scrapeLinks = async () => {
    try {
      console.log('🔵 Starting link extraction...');
      
      // Extract all <a> tags and filter out internal links
      const rawLinks = Array.from(document.querySelectorAll('a'));
      console.log(`🟠 Found ${rawLinks.length} <a> tags on page`);
      
      const links = rawLinks.map(a => ({
        text: a.textContent.trim(),
        url: a.href,
        title: a.title || '',
        target: a.target || '_self',
        rel: a.rel || ''
      })).filter(link => {
        const isExternal = 
          link.url && 
          !link.url.startsWith('#') && 
          !link.url.startsWith('javascript:') &&
          !link.url.startsWith('blob:') &&
          !link.url.includes('about:');
        
        return isExternal;
      }).slice(0, 100);
      
      console.log(`🟠 Filtered to ${links.length} external links`);

      if (links.length === 0) {
        throw new Error('No valid links found on this page');
      }

      // Format for mpv playlist (.m3u format)
      let playlistContent = `#EXTM3U\n`;
      
      const baseDomain = window.location.origin;
      
      links.forEach(link => {
        const absoluteUrl = link.url.startsWith('http') 
          ? link.url 
          : `${baseDomain}${link.url}`;
        
        playlistContent += `#EXTINF:-1,t="${encodeURIComponent(link.text)}"\n`;
        playlistContent += `${absoluteUrl}\n`;
      });

      console.log(`🟠 Playlist size: ${playlistContent.length} bytes`);
      console.log(`🟠 First 5 links:\n${links.slice(0, 5).map(l => `  - ${l.text}: ${l.url}`).join('\n')}`);

      // Create download
      const filename = `links_${Date.now()}.m3u`;
      
      console.log(`🟠 Preparing download: ${filename}`);
      
      if (browser && browser.downloads && browser.downloads.save) {
        await browser.downloads.save({
          url: 'data:text/plain;charset=utf-8,' + encodeURIComponent(playlistContent),
          filename,
          saveAs: true,
          conflictAction: 'conflict_rename'
        });

        console.log(`✅ Saved ${links.length} links to ${filename}`);
        
        // Show notification
        try {
          browser.notifications.create({
            type: 'basic',
            title: '🎉 Links Saved!',
            message: `Saved ${links.length} links to mpv playlist!`,
            iconUrl: '/home/spencer/.openclaw/workspace/link-scrapers/icon48.png'
          });
        } catch (e) {}
      } else {
        console.warn('⚠️ browser.downloads API not available in console mode');
        console.log(`📄 Here's your playlist (copy it):\n${playlistContent.substring(0, 500)}...`);
      }

      return { success: true, count: links.length };
    } catch (e) {
      console.error('❌ Error:', e.message);
      throw e;
    }
  };

  // Wait for browser API to be available
  if (!browser) {
    console.warn('⚠️ This test needs an extension to run. Use the full extension instead.');
    console.log('Run this from within the Link Scrapper extension popup');
    return;
  }

  scrapeLinks();
})();
// === END SCRIPT ===
// Type: scrape() in console to run it!

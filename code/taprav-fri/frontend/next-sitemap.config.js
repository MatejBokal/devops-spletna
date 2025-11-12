// next-sitemap.config.js
/** @type {import('next-sitemap').IConfig} */

async function getEventSlugs() {
  try {
    // Call your public events API endpoint (which returns JSON { success, events: [ { slug, … }, … ] })
    const res = await fetch("http://localhost/taprav-fri/api/events_list.php");
    const json = await res.json();
    if (!json.success || !Array.isArray(json.events)) return [];
    // Map each event to its relative path
    return json.events.map((evt) => `/dogodki/${evt.slug}`);
  } catch {
    return [];
  }
}

module.exports = {
  // 1) Your production domain (or local dev if testing): 
  siteUrl: process.env.SITE_URL || "https://www.test-matejbokal.si",

  // 2) Output the sitemap.xml directly into /public 
  outDir: "./public",


  // 3) Inject all dynamic event URLs under /dogodki/[slug]
  additionalPaths: async (config) => {
    const slugs = await getEventSlugs();
    return slugs.map((url) => ({
      loc: url,                    
      changefreq: config.changefreq,
      priority: config.priority,
    }));
  },
};

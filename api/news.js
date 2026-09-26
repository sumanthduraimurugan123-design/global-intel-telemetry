/**
 * Vercel Serverless Function — /api/news
 * Fetches live news from RSS feeds and returns JSON.
 * This runs server-side so no CORS issues with RSS feeds.
 */

const RSS_FEEDS = {
  global: [
    { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC News' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', source: 'New York Times' },
    { url: 'https://www.theguardian.com/world/rss', source: 'The Guardian' },
    { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera' },
  ],
  india: [
    { url: 'https://feeds.bbci.co.uk/news/world/asia/india/rss.xml', source: 'BBC News' },
    { url: 'https://www.theguardian.com/world/asia/rss', source: 'The Guardian' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/AsiaPacific.xml', source: 'New York Times' },
  ],
  us: [
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/US.xml', source: 'New York Times' },
    { url: 'https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml', source: 'BBC News' },
    { url: 'https://feeds.npr.org/1004/rss.xml', source: 'NPR News' },
  ],
  uk: [
    { url: 'https://feeds.bbci.co.uk/news/uk/rss.xml', source: 'BBC News' },
    { url: 'https://www.theguardian.com/uk/rss', source: 'The Guardian' },
  ],
  china: [
    { url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml', source: 'BBC News' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/AsiaPacific.xml', source: 'New York Times' },
  ],
  russia: [
    { url: 'https://feeds.bbci.co.uk/news/world/europe/rss.xml', source: 'BBC News' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Europe.xml', source: 'New York Times' },
  ],
  ukraine: [
    { url: 'https://feeds.bbci.co.uk/news/world/europe/rss.xml', source: 'BBC News' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Europe.xml', source: 'New York Times' },
  ],
  israel: [
    { url: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml', source: 'BBC News' },
    { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera' },
  ],
  iran: [
    { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera' },
    { url: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml', source: 'BBC News' },
  ],
};

function decode(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(c));
}

function parseRss(xml, source, country) {
  const items = [];
  const itemRx = /<item>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = itemRx.exec(xml)) !== null && items.length < 15) {
    const b = m[1];
    const titleM = b.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/i) || b.match(/<title>(.*?)<\/title>/i);
    let title = titleM ? decode(titleM[1].trim()) : '';
    if (!title) continue;
    title = title.split(' - ')[0].trim();

    const descM = b.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/i) || b.match(/<description>(.*?)<\/description>/i);
    let desc = descM ? decode(descM[1].replace(/<[^>]*>/gm, '').trim()) : '';
    if (desc.includes('news.google.com') || desc.includes('target=')) desc = '';

    const linkM = b.match(/<link>(.*?)<\/link>/i) || b.match(/<guid[^>]*>(.*?)<\/guid>/i);
    const url = linkM ? linkM[1].trim().split('?')[0] : '';
    if (!url || !url.startsWith('http')) continue;
    const ul = url.toLowerCase();
    if (ul.endsWith('.com') || ul.endsWith('/world') || ul.endsWith('/news') || ul.endsWith('/rss') || ul.endsWith('.co.uk')) continue;

    const dateM = b.match(/<pubDate>(.*?)<\/pubDate>/i);
    const created_at = dateM ? new Date(dateM[1]).toISOString() : new Date().toISOString();

    items.push({ id: `${Date.now()}-${items.length}`, title, description: desc.substring(0, 250), url, source, country, topic: 'Geopolitics', sentiment: 'Neutral', created_at });
  }
  return items;
}

async function fetchFeed(feedUrl, source, country) {
  try {
    const res = await fetch(feedUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 GlobalIntelBot/1.0', 'Accept': 'application/rss+xml, text/xml, */*' },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRss(xml, source, country);
  } catch {
    return [];
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const country = (req.query.country || 'global').toLowerCase().replace(/[^a-z]/g, '');
  const feeds = RSS_FEEDS[country] || RSS_FEEDS.global;

  // Fetch all feeds in parallel
  const results = await Promise.allSettled(feeds.map(f => fetchFeed(f.url, f.source, country)));

  let articles = [];
  for (const r of results) {
    if (r.status === 'fulfilled') articles = articles.concat(r.value);
  }

  // If country feeds gave nothing, fallback to global
  if (articles.length === 0 && country !== 'global') {
    const globalResults = await Promise.allSettled(RSS_FEEDS.global.map(f => fetchFeed(f.url, f.source, country)));
    for (const r of globalResults) {
      if (r.status === 'fulfilled') articles = articles.concat(r.value);
    }
  }

  // Deduplicate by URL
  const seen = new Set();
  const unique = articles.filter(a => {
    if (seen.has(a.url)) return false;
    seen.add(a.url);
    return true;
  });

  unique.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return res.status(200).json({
    source: 'vercel_serverless_rss',
    count: unique.length,
    country,
    news: unique.slice(0, 30),
  });
}

import { XMLParser } from 'fast-xml-parser';
import { supabase, isSupabaseConfigured } from './supabaseClient.js';
import { evaluateNewsForAlerts, persistAlert } from './alertEngine.js';
import { classifyCountry, COUNTRY_LEXICON } from './countryClassifier.js';
import { resolveGeoHierarchy, GLOBAL_COUNTRIES, INDIA_STATES, US_STATES, INTL_REGIONS, CHENNAI_MICRO_AREAS } from './geoHierarchy.js';

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  processEntities: false,
  attributeNamePrefix: '@_'
});

// In-memory cache with TTL to store freshly aggregated authentic dispatches and prevent rate-limiting
let memoryNewsCache = [];
const cacheByRegion = new Map(); // key -> { timestamp: number, data: [] }
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes TTL for fresh dispatches

let lastSyncTimestamp = new Date().toISOString();

// Direct authoritative publisher RSS feeds
const FEED_REGISTRY = {
  'global': [
    { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC News' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', source: 'The New York Times' },
    { url: 'https://www.theguardian.com/world/rss', source: 'The Guardian' },
    { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera' }
  ],
  'us': [
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/US.xml', source: 'The New York Times' },
    { url: 'https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml', source: 'BBC News' },
    { url: 'https://feeds.npr.org/1004/rss.xml', source: 'NPR News' }
  ],
  'canada': [
    { url: 'https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml', source: 'BBC News' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Americas.xml', source: 'The New York Times' }
  ],
  'brazil': [
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Americas.xml', source: 'The New York Times' },
    { url: 'https://www.theguardian.com/world/americas/rss', source: 'The Guardian' }
  ],
  'uk': [
    { url: 'https://feeds.bbci.co.uk/news/uk/rss.xml', source: 'BBC News' },
    { url: 'https://www.theguardian.com/uk/rss', source: 'The Guardian' }
  ],
  'ukraine': [
    { url: 'https://feeds.bbci.co.uk/news/world/europe/rss.xml', source: 'BBC News' },
    { url: 'https://www.theguardian.com/world/europe-news/rss', source: 'The Guardian' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Europe.xml', source: 'The New York Times' }
  ],
  'russia': [
    { url: 'https://feeds.bbci.co.uk/news/world/europe/rss.xml', source: 'BBC News' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Europe.xml', source: 'The New York Times' },
    { url: 'https://www.theguardian.com/world/europe-news/rss', source: 'The Guardian' }
  ],
  'germany': [
    { url: 'https://feeds.bbci.co.uk/news/world/europe/rss.xml', source: 'BBC News' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Europe.xml', source: 'The New York Times' }
  ],
  'france': [
    { url: 'https://www.france24.com/en/rss', source: 'France 24' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Europe.xml', source: 'The New York Times' }
  ],
  'china': [
    { url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml', source: 'BBC News' },
    { url: 'https://www.theguardian.com/world/asia/rss', source: 'The Guardian' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/AsiaPacific.xml', source: 'The New York Times' }
  ],
  'taiwan': [
    { url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml', source: 'BBC News' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/AsiaPacific.xml', source: 'The New York Times' }
  ],
  'india': [
    { url: 'https://feeds.bbci.co.uk/news/world/asia/india/rss.xml', source: 'BBC News' },
    { url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml', source: 'BBC News' },
    { url: 'https://www.theguardian.com/world/asia/rss', source: 'The Guardian' }
  ],
  'japan': [
    { url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml', source: 'BBC News' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/AsiaPacific.xml', source: 'The New York Times' }
  ],
  'australia': [
    { url: 'https://www.theguardian.com/australia-news/rss', source: 'The Guardian Australia' },
    { url: 'https://feeds.bbci.co.uk/news/world/asia/rss.xml', source: 'BBC News' }
  ],
  'israel': [
    { url: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml', source: 'BBC News' },
    { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/MiddleEast.xml', source: 'The New York Times' }
  ],
  'iran': [
    { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera' },
    { url: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml', source: 'BBC News' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/MiddleEast.xml', source: 'The New York Times' }
  ],
  'syria': [
    { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera' },
    { url: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml', source: 'BBC News' }
  ],
  'africa': [
    { url: 'https://feeds.bbci.co.uk/news/world/africa/rss.xml', source: 'BBC News Africa' },
    { url: 'https://www.theguardian.com/world/africa/rss', source: 'The Guardian' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Africa.xml', source: 'The New York Times' }
  ],
  'cyber': [
    { url: 'https://feeds.arstechnica.com/arstechnica/index', source: 'Ars Technica' },
    { url: 'https://www.wired.com/feed/category/security/latest/rss', source: 'Wired Security' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml', source: 'The New York Times' }
  ],
  'economy': [
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml', source: 'The New York Times' },
    { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', source: 'BBC News' }
  ]
};

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(code));
}

function cleanArticleUrl(rawUrl) {
  if (!rawUrl) return '';
  try {
    return rawUrl.split('?')[0];
  } catch (e) {
    return rawUrl;
  }
}

function isDiscreteHeadlineArticle(url, title) {
  if (!url || typeof url !== 'string') return false;
  const u = url.toLowerCase().split('?')[0];
  const t = (title || '').toLowerCase();

  if (u.endsWith('.com') || u.endsWith('.org') || u.endsWith('.co.uk') || u.endsWith('.net') || u.endsWith('/')) return false;
  if (u.endsWith('/news') || u.endsWith('/world') || u.endsWith('/politics') || u.endsWith('/business') || u.endsWith('/technology') || u.endsWith('/sport')) return false;
  if (u.endsWith('/all.xml') || u.endsWith('/rss.xml') || u.endsWith('/rss')) return false;

  if (u.includes('/live/') || u.includes('/liveblog/') || u.includes('/gallery/') || u.includes('/interactive/')) return false;
  if (t.startsWith('live:') || t.startsWith('live updates:') || t.includes(' - live') || t.includes('rolling coverage')) return false;

  const isBbc = u.includes('bbc.co.uk/news/articles/') || u.includes('bbc.com/news/articles/');
  const isNyt = u.includes('nytimes.com/') && u.endsWith('.html');
  const isGuardian = u.includes('theguardian.com/') && u.split('/').length >= 6;
  const isAlJazeera = u.includes('aljazeera.com/news/') || u.includes('aljazeera.com/opinions/') || u.includes('aljazeera.com/features/');
  const isNpr = u.includes('npr.org/') && /\/\d{4}\/\d{2}\/\d{2}\//.test(u);
  const isGoogleNews = u.includes('news.google.com/rss/articles/') || u.includes('news.google.com/articles/');
  const isFrance24 = u.includes('france24.com/en/');
  const hasSlug = u.split('/').pop().includes('-');

  return isBbc || isNyt || isGuardian || isAlJazeera || isNpr || isGoogleNews || isFrance24 || hasSlug;
}

/**
 * Build dynamic Google News RSS URL with high precision for countries, states, and cities
 */
function buildGoogleNewsFeedUrl({ queryText, countryIso = 'US', language = 'en', timeWindow = '7d' }) {
  let hl = 'en-US';
  let gl = countryIso || 'US';
  let ceid = `${countryIso}:en`;

  if (language === 'ta') {
    hl = 'ta';
    gl = 'IN';
    ceid = 'IN:ta';
  } else if (language === 'hi') {
    hl = 'hi';
    gl = 'IN';
    ceid = 'IN:hi';
  } else if (language === 'te') {
    hl = 'te';
    gl = 'IN';
    ceid = 'IN:te';
  } else if (language === 'bn') {
    hl = 'bn';
    gl = 'IN';
    ceid = 'IN:bn';
  } else if (language === 'mr') {
    hl = 'mr';
    gl = 'IN';
    ceid = 'IN:mr';
  } else if (countryIso === 'IN') {
    hl = 'en-IN';
    gl = 'IN';
    ceid = 'IN:en';
  } else if (countryIso === 'GB') {
    hl = 'en-GB';
    gl = 'GB';
    ceid = 'GB:en';
  } else if (countryIso === 'AU') {
    hl = 'en-AU';
    gl = 'AU';
    ceid = 'AU:en';
  } else if (countryIso === 'CA') {
    hl = 'en-CA';
    gl = 'CA';
    ceid = 'CA:en';
  }

  const encodedQuery = encodeURIComponent(queryText.trim());
  return {
    url: `https://news.google.com/rss/search?q=${encodedQuery}+when:${timeWindow}&hl=${hl}&gl=${gl}&ceid=${ceid}`,
    source: 'Google News Live'
  };
}

/**
 * Determine category (economy, risk, supply, climate, cyber, defense, geopolitics)
 */
function determineCategory(text) {
  const t = text.toLowerCase();
  if (t.includes('cyclone') || t.includes('flood') || t.includes('rain') || t.includes('monsoon') || t.includes('earthquake') || t.includes('climate') || t.includes('heatwave') || t.includes('storm') || t.includes('pollution') || t.includes('air quality')) return 'climate';
  if (t.includes('chip') || t.includes('semiconductor') || t.includes('supply chain') || t.includes('port') || t.includes('cargo') || t.includes('freight') || t.includes('logistics') || t.includes('shortage') || t.includes('shipping') || t.includes('tsmc')) return 'supply';
  if (t.includes('economy') || t.includes('inflation') || t.includes('market') || t.includes('tariff') || t.includes('trade') || t.includes('gdp') || t.includes('bank') || t.includes('stock') || t.includes('rupee') || t.includes('dollar') || t.includes('interest rate')) return 'economy';
  if (t.includes('cyber') || t.includes('hacked') || t.includes('malware') || t.includes('ransomware') || t.includes('data breach') || t.includes('telecom') || t.includes('outage')) return 'cyber';
  if (t.includes('military') || t.includes('missile') || t.includes('defense') || t.includes('army') || t.includes('navy') || t.includes('strike') || t.includes('weapon') || t.includes('warfare')) return 'defense';
  if (t.includes('crisis') || t.includes('threat') || t.includes('attack') || t.includes('alert') || t.includes('explosion') || t.includes('conflict') || t.includes('sanctions')) return 'risk';
  return 'geopolitics';
}

function analyzeSentiment(text) {
  const lower = text.toLowerCase();
  const negativeWords = ['crisis', 'war', 'attack', 'conflict', 'decline', 'drop', 'inflation', 'sanctions', 'casualty', 'disaster', 'threat', 'tensions', 'blast', 'strikes', 'panic', 'flood', 'warning'];
  const positiveWords = ['growth', 'peace', 'agreement', 'recovery', 'treaty', 'breakthrough', 'gains', 'alliance', 'stability', 'surplus', 'accord', 'relief'];

  let score = 0;
  for (const w of negativeWords) if (lower.includes(w)) score -= 1;
  for (const w of positiveWords) if (lower.includes(w)) score += 1;

  if (score < -1) return 'Hostile / Risk';
  if (score < 0) return 'Tense';
  if (score > 1) return 'Positive / Stable';
  if (score > 0) return 'Constructive';
  return 'Neutral';
}

/**
 * Fetch and parse a single RSS feed safely
 */
async function fetchSingleFeed(feedMeta, geoContext) {
  try {
    const res = await fetch(feedMeta.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      }
    });

    if (!res.ok) return [];

    const xml = await res.text();
    const parsed = xmlParser.parse(xml);
    const rawItems = parsed?.rss?.channel?.item || [];
    const itemsArray = Array.isArray(rawItems) ? rawItems : [rawItems];

    const results = [];
    for (const item of itemsArray.slice(0, 15)) {
      if (!item.title) continue;

      let rawLink = typeof item.link === 'string'
        ? item.link
        : item.guid?.['#text'] || item.guid || '';

      if (!rawLink || rawLink.startsWith('urn:')) {
        if (typeof item.link === 'object' && item.link?.['#text']) {
          rawLink = item.link['#text'];
        }
      }

      if (!rawLink || !rawLink.startsWith('http')) continue;

      const directUrl = cleanArticleUrl(rawLink);
      if (!isDiscreteHeadlineArticle(directUrl, item.title)) continue;

      let articleTitle = decodeHtmlEntities(String(item.title).trim());
      let articleSource = feedMeta.source || 'Verified Source';

      if (item.source) {
        if (typeof item.source === 'string') {
          articleSource = decodeHtmlEntities(item.source.trim());
        } else if (item.source?.['#text']) {
          articleSource = decodeHtmlEntities(item.source['#text'].trim());
        }
        if (articleTitle.toLowerCase().endsWith(` - ${articleSource.toLowerCase()}`)) {
          articleTitle = articleTitle.slice(0, -(articleSource.length + 3)).trim();
        }
      } else if (articleTitle.includes(' - ')) {
        const parts = articleTitle.split(' - ');
        if (parts.length > 1) {
          articleSource = parts.pop().trim();
          articleTitle = parts.join(' - ').trim();
        }
      }

      let cleanDesc = item.description || '';
      if (typeof cleanDesc !== 'string') {
        cleanDesc = cleanDesc['#text'] || cleanDesc.a?.['#text'] || '';
      }
      cleanDesc = String(cleanDesc)
        .replace(/&lt;[^>]*&gt;/gi, ' ')
        .replace(/<[^>]*>/gi, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/\s+/g, ' ')
        .trim();

      if (cleanDesc.includes('news.google.com') || cleanDesc.includes('target="_blank"') || cleanDesc.includes('<a href=')) {
        cleanDesc = '';
      }

      const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();
      const combinedText = `${articleTitle} ${cleanDesc}`;
      const category = determineCategory(combinedText);
      const sentiment = analyzeSentiment(combinedText);

      // Resolve country metadata
      const classified = classifyCountry(articleTitle, cleanDesc, geoContext?.countryId || 'global');

      const newsEntity = {
        title: articleTitle,
        description: cleanDesc,
        url: directUrl,
        country: geoContext?.countryId || classified.id,
        country_name: geoContext?.country || classified.name,
        country_flag: geoContext?.countryFlag || classified.flag,
        region: geoContext?.state || geoContext?.city || classified.region,
        location: geoContext?.city || geoContext?.state || null,
        geo: {
          lat: geoContext?.lat || (classified.id === 'india' ? 20.5937 : 20.0),
          lng: geoContext?.lng || (classified.id === 'india' ? 78.9629 : 0.0),
          level: geoContext?.level || 'country',
          country: geoContext?.country || classified.name,
          state: geoContext?.state || null,
          city: geoContext?.city || null
        },
        topic: category.charAt(0).toUpperCase() + category.slice(1),
        category,
        source: articleSource,
        sentiment,
        created_at: pubDate
      };

      results.push(newsEntity);

      // Evaluate for security alerts
      const potentialAlert = evaluateNewsForAlerts(newsEntity);
      if (potentialAlert) {
        persistAlert(potentialAlert);
      }
    }

    return results;
  } catch (err) {
    return [];
  }
}

/**
 * Optional GNews API fetcher if key provided in process.env
 */
async function fetchFromGNewsApi(query, language = 'en') {
  const apiKey = process.env.GNEWS_API_KEY;
  if (!apiKey) return [];
  try {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=${language}&token=${apiKey}&max=10`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data.articles)) return [];
    return data.articles.map(a => ({
      title: a.title,
      description: a.description || '',
      url: a.url,
      source: a.source?.name || 'GNews Provider',
      created_at: a.publishedAt || new Date().toISOString()
    }));
  } catch (e) {
    return [];
  }
}

/**
 * Optional NewsAPI fetcher if key provided in process.env
 */
async function fetchFromNewsApi(query, countryCode = null) {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return [];
  try {
    const queryParam = query ? `q=${encodeURIComponent(query)}&` : '';
    const countryParam = countryCode && countryCode.length === 2 ? `country=${countryCode}&` : '';
    const url = `https://newsapi.org/v2/top-headlines?${queryParam}${countryParam}apiKey=${apiKey}&pageSize=10`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data.articles)) return [];
    return data.articles.map(a => ({
      title: a.title,
      description: a.description || '',
      url: a.url,
      source: a.source?.name || 'NewsAPI Provider',
      created_at: a.publishedAt || new Date().toISOString()
    }));
  } catch (e) {
    return [];
  }
}

/**
 * Multi-Source Live News Ingestion with Smart Geographic Fallback
 * 
 * Hierarchy:
 * Level 1: Micro-location / City (e.g., Velachery, Dallas, Munich)
 * Level 2: State / Province (e.g., Tamil Nadu, Texas, Bavaria)
 * Level 3: Country (e.g., India, US, Germany)
 * Level 4: Global
 */
export async function fetchLiveNews(country = 'global', topic = 'all', location = null, language = 'en', state = null, city = null) {
  const rawTarget = (city || location || state || country || 'global').trim();
  const geoResolved = resolveGeoHierarchy(rawTarget, country);

  const cacheKey = `${geoResolved.countryId}_${geoResolved.state || ''}_${geoResolved.city || ''}_${topic}_${language}`;

  // Check TTL cache
  const cached = cacheByRegion.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS) && cached.data.length > 0) {
    return cached.data;
  }

  let finalArticles = [];
  let fallbackMeta = {
    fallbackLevel: 'direct',
    fallbackMessage: null,
    targetLocation: geoResolved.displayName,
    resolvedHierarchy: geoResolved
  };

  // STEP 1: Direct Fetch for Target Micro-Location / City
  if (geoResolved.level === 'city') {
    const cityQuery = `${geoResolved.city} ${geoResolved.state || ''} ${geoResolved.country}`;
    const targetFeeds = [
      buildGoogleNewsFeedUrl({ queryText: cityQuery, countryIso: geoResolved.countryId === 'india' ? 'IN' : 'US', language, timeWindow: '7d' })
    ];

    const feedResults = await Promise.allSettled(targetFeeds.map(f => fetchSingleFeed(f, geoResolved)));
    for (const res of feedResults) {
      if (res.status === 'fulfilled' && Array.isArray(res.value)) {
        finalArticles = finalArticles.concat(res.value);
      }
    }

    // If 0 direct articles found, initiate Smart Fallback to State / Metro
    if (finalArticles.length === 0 && geoResolved.state) {
      fallbackMeta.fallbackLevel = 'state_fallback';
      fallbackMeta.fallbackMessage = `No direct news for ${geoResolved.city} → Showing nearest regional intelligence from ${geoResolved.state} & ${geoResolved.country}`;

      const stateQuery = `${geoResolved.state} news`;
      const stateFeeds = [
        buildGoogleNewsFeedUrl({ queryText: stateQuery, countryIso: geoResolved.countryId === 'india' ? 'IN' : 'US', language, timeWindow: '5d' })
      ];

      const stateResults = await Promise.allSettled(stateFeeds.map(f => fetchSingleFeed(f, {
        ...geoResolved,
        level: 'state',
        displayName: `${geoResolved.state}, ${geoResolved.country}`
      })));

      for (const res of stateResults) {
        if (res.status === 'fulfilled' && Array.isArray(res.value)) {
          finalArticles = finalArticles.concat(res.value);
        }
      }
    }
  }

  // STEP 2: State / Province Level Fetch (e.g. Tamil Nadu, California, Bavaria)
  if (geoResolved.level === 'state' || (geoResolved.level === 'city' && finalArticles.length === 0)) {
    const stateName = geoResolved.state || rawTarget;
    const query = `${stateName} news`;
    const stateFeeds = [
      buildGoogleNewsFeedUrl({ queryText: query, countryIso: geoResolved.countryId === 'india' ? 'IN' : 'US', language, timeWindow: '5d' })
    ];

    const feedResults = await Promise.allSettled(stateFeeds.map(f => fetchSingleFeed(f, geoResolved)));
    for (const res of feedResults) {
      if (res.status === 'fulfilled' && Array.isArray(res.value)) {
        finalArticles = finalArticles.concat(res.value);
      }
    }

    // Check optional external APIs for the state
    const [gnewsArticles, newsApiArticles] = await Promise.all([
      fetchFromGNewsApi(query, language),
      fetchFromNewsApi(query, geoResolved.countryId === 'india' ? 'in' : 'us')
    ]);

    for (const item of [...gnewsArticles, ...newsApiArticles]) {
      if (!finalArticles.some(a => a.url === item.url)) {
        const cat = determineCategory(item.title + ' ' + item.description);
        finalArticles.push({
          ...item,
          country: geoResolved.countryId,
          country_name: geoResolved.country,
          country_flag: geoResolved.countryFlag || '🌐',
          region: geoResolved.state,
          location: geoResolved.state,
          geo: {
            lat: geoResolved.lat,
            lng: geoResolved.lng,
            level: 'state',
            country: geoResolved.country,
            state: geoResolved.state
          },
          topic: cat.charAt(0).toUpperCase() + cat.slice(1),
          category: cat,
          sentiment: analyzeSentiment(item.title + ' ' + item.description)
        });
      }
    }
  }

  // STEP 3: Country Level or Fallback to Country
  if (finalArticles.length === 0 || geoResolved.level === 'country' || geoResolved.level === 'global') {
    if (geoResolved.level !== 'country' && geoResolved.level !== 'global') {
      fallbackMeta.fallbackLevel = 'country_fallback';
      fallbackMeta.fallbackMessage = `No direct news for ${rawTarget} → Showing sovereign intelligence from ${geoResolved.country}`;
    }

    const cId = geoResolved.countryId || 'global';
    let countryFeeds = [...(FEED_REGISTRY[cId] || FEED_REGISTRY['global'])];

    const cQuery = geoResolved.country && geoResolved.country !== 'Global' ? `${geoResolved.country} news` : 'world geopolitics';
    countryFeeds.push(buildGoogleNewsFeedUrl({ queryText: cQuery, countryIso: cId === 'india' ? 'IN' : 'US', language, timeWindow: '3d' }));

    const feedResults = await Promise.allSettled(countryFeeds.map(f => fetchSingleFeed(f, geoResolved)));
    for (const res of feedResults) {
      if (res.status === 'fulfilled' && Array.isArray(res.value)) {
        finalArticles = finalArticles.concat(res.value);
      }
    }
  }

  // Deduplicate articles by URL and Title
  const seenUrls = new Set();
  const seenTitles = new Set();
  const uniqueArticles = [];

  for (const item of finalArticles) {
    const normTitle = item.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!seenUrls.has(item.url) && !seenTitles.has(normTitle)) {
      seenUrls.add(item.url);
      seenTitles.add(normTitle);
      uniqueArticles.push({
        ...item,
        fallbackMeta: fallbackMeta.fallbackLevel !== 'direct' ? fallbackMeta : null
      });
    }
  }

  // Sort by publication date descending
  uniqueArticles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const output = uniqueArticles.slice(0, 40);

  lastSyncTimestamp = new Date().toISOString();

  // Save in TTL cache
  cacheByRegion.set(cacheKey, { timestamp: Date.now(), data: output });

  // Update global memory cache
  for (const item of output) {
    if (!memoryNewsCache.some(m => m.url === item.url)) {
      memoryNewsCache.unshift(item);
    }
  }
  if (memoryNewsCache.length > 500) memoryNewsCache = memoryNewsCache.slice(0, 500);

  // Persist to Supabase if configured
  if (isSupabaseConfigured && supabase && output.length > 0) {
    try {
      await supabase
        .from('news')
        .upsert(
          output.map(n => ({
            title: n.title,
            description: n.description,
            url: n.url,
            country: n.country,
            topic: n.topic,
            source: n.source,
            sentiment: n.sentiment,
            created_at: n.created_at
          })),
          { onConflict: 'url', ignoreDuplicates: true }
        );
    } catch (e) {
      // Non-blocking
    }
  }

  return output.length > 0 ? output : memoryNewsCache.slice(0, 30);
}

/**
 * Categorize worldwide news into sovereign countries
 */
export async function fetchWorldwideNewsCategorized() {
  if (memoryNewsCache.length < 25) {
    await fetchLiveNews('global', 'all');
  }

  const groups = {};
  for (const item of memoryNewsCache) {
    const cId = item.country || 'global';
    if (!groups[cId]) {
      const cMeta = GLOBAL_COUNTRIES.find(c => c.id === cId) || COUNTRY_LEXICON.find(c => c.id === cId);
      groups[cId] = {
        id: cId,
        name: cMeta?.name || item.country_name || cId.toUpperCase(),
        flag: cMeta?.flag || item.country_flag || '🌐',
        region: cMeta?.region || item.region || 'International',
        count: 0,
        articles: []
      };
    }
    groups[cId].count++;
    groups[cId].articles.push(item);
  }

  const countriesArray = Object.values(groups).sort((a, b) => b.count - a.count);

  return {
    totalArticles: memoryNewsCache.length,
    countriesCount: countriesArray.length,
    lastUpdated: lastSyncTimestamp,
    countries: countriesArray
  };
}

export function getLastSyncTimestamp() {
  return lastSyncTimestamp;
}

export { COUNTRY_LEXICON, GLOBAL_COUNTRIES, INDIA_STATES, US_STATES, INTL_REGIONS, CHENNAI_MICRO_AREAS };

import { supabase, isConfigured, logTelemetryAction } from './supabaseClient';

// Use relative /api path so it works on Vercel without any env vars; override with VITE_API_BASE_URL if set
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Fetch real news stream directly from Express backend (which aggregates verified deep-links)
 * with multi-tier failovers to Supabase or direct RSS stream.
 */
/**
 * Fetch real news stream directly from Express backend (which aggregates verified deep-links)
 * with multi-tier failovers to Supabase or direct RSS stream.
 */
export async function fetchNewsStream(country = 'global', topic = 'all', forceRefresh = false, location = null, language = 'en', state = null, city = null) {
  const timestamp = Date.now();
  const locParam = location ? `&location=${encodeURIComponent(location)}` : '';
  const stateParam = state ? `&state=${encodeURIComponent(state)}` : '';
  const cityParam = city ? `&city=${encodeURIComponent(city)}` : '';
  const langParam = language ? `&language=${encodeURIComponent(language)}` : '';
  const queryParams = `country=${encodeURIComponent(country)}&topic=${encodeURIComponent(topic)}&refresh=${forceRefresh}${locParam}${stateParam}${cityParam}${langParam}&_t=${timestamp}`;

  // 1. Primary: Backend API (relative /api path works on Vercel)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(`${API_BASE}/news?${queryParams}`, {
      cache: 'no-store',
      signal: controller.signal,
      headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' }
    });
    clearTimeout(timeoutId);
    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      const data = await response.json();
      if (Array.isArray(data.news) && data.news.length > 0) {
        const validArticles = data.news.filter(n => n.url && n.url.startsWith('http'));
        if (validArticles.length > 0) {
          return { news: validArticles, geoInfo: data.geoInfo || null, fallbackDetails: data.fallbackDetails || null };
        }
      }
    }
  } catch (err) { /* proceed to fallbacks */ }

  // 2. Secondary: Direct Supabase query if credentials configured
  if (isConfigured && supabase) {
    try {
      let query = supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (country && country !== 'global') {
        query = query.eq('country', country.toLowerCase());
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return { news: data, geoInfo: null, fallbackDetails: null };
      }
    } catch (e) {
      console.warn('Supabase direct query failed:', e);
    }
  }

  // 3. Tertiary: Multi-feed RSS fallback via CORS proxies
  const RSS_FEEDS = [
    { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC News' },
    { url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', source: 'The New York Times' },
    { url: 'https://www.theguardian.com/world/rss', source: 'The Guardian' },
    { url: 'https://www.aljazeera.com/xml/rss/all.xml', source: 'Al Jazeera' },
  ];
  const CORS_PROXIES = [
    (u) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    (u) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
    (u) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
  ];

  const parseRssXml = (xml, feedSource, countryId) => {
    const items = [];
    const itemRegex = /<item>([\ \S]*?)<\/item>/gi;
    let match;
    while ((match = itemRegex.exec(xml)) !== null && items.length < 20) {
      const block = match[1];
      const titleMatch = block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/i) || block.match(/<title>(.*?)<\/title>/i);
      let title = titleMatch ? titleMatch[1].trim() : '';
      title = title.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').split(' - ')[0].trim();
      if (!title) continue;
      const descMatch = block.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/i) || block.match(/<description>(.*?)<\/description>/i);
      let desc = descMatch ? descMatch[1].replace(/<[^>]*>?/gm, '').trim() : '';
      desc = desc.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
      if (desc.includes('news.google.com') || desc.includes('target="_blank"')) desc = '';
      const linkMatch = block.match(/<link>(.*?)<\/link>/i) || block.match(/<guid[^>]*>(.*?)<\/guid>/i);
      const articleUrl = linkMatch ? linkMatch[1].trim().split('?')[0] : '';
      if (!articleUrl || !articleUrl.startsWith('http')) continue;
      const urlLower = articleUrl.toLowerCase();
      if (urlLower.endsWith('.com') || urlLower.endsWith('/world') || urlLower.endsWith('/news') || urlLower.endsWith('/rss')) continue;
      const pubDateMatch = block.match(/<pubDate>(.*?)<\/pubDate>/i);
      const pubDate = pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString();
      items.push({ id: `wire-${Date.now()}-${items.length}`, title, description: desc.substring(0, 200), url: articleUrl, source: feedSource, country: countryId, topic: 'Geopolitics', sentiment: 'Neutral', created_at: pubDate });
    }
    return items;
  };

  for (const feed of RSS_FEEDS) {
    for (const makeProxy of CORS_PROXIES) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(makeProxy(feed.url), { cache: 'no-store', signal: controller.signal });
        clearTimeout(timeoutId);
        const xml = await res.text();
        if (!xml || xml.trim().startsWith('{')) continue;
        const items = parseRssXml(xml, feed.source, country.toLowerCase());
        if (items.length > 0) {
          return { news: items, geoInfo: null, fallbackDetails: { fallbackMessage: `Live RSS from ${feed.source}` } };
        }
      } catch (e) { /* try next */ }
    }
  }

  return { news: [], geoInfo: null, fallbackDetails: null };
}

/**
 * Fetch complete geographic hierarchy directory for UI dropdowns and search
 */
export async function fetchGeoDirectory() {
  const endpoints = [
    `${API_BASE}/news/geo-hierarchy`,
    'http://localhost:5000/api/news/geo-hierarchy',
    '/api/news/geo-hierarchy'
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, { cache: 'default' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data;
      }
    } catch (e) {
      // try next
    }
  }
  return null;
}

/**
 * Fetch smart plain-language news explanation and everyday impact
 */
export async function fetchNewsExplanation(title, description, language = 'en') {
  const endpoints = [
    `${API_BASE}/news/explain`,
    'http://localhost:5000/api/news/explain',
    '/api/news/explain'
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, language })
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {
      // try next
    }
  }

  // Fallback client-side explanation
  return {
    success: true,
    title,
    category: 'general',
    explanation: language === 'ta' 
      ? 'இது ஒரு முக்கியமான நடப்பு செய்தி.' 
      : (language === 'hi' ? 'यह एक महत्वपूर्ण समाचार है।' : 'This is a notable news update.'),
    impact: language === 'ta'
      ? 'தகவல்களைத் தெரிந்து கொண்டு விழிப்புடன் இருக்கவும்.'
      : (language === 'hi' ? 'घटनाक्रम से अवगत रहें और जागरूक रहें।' : 'Stay informed of regional developments.'),
    simpleText: `${title}. ${description || ''}`,
    language
  };
}

/**
 * Fetch personalized AI-based opinion tailored to the active persona
 */
export async function fetchPersonalizedOpinion(title, description, persona = 'Casual user', language = 'en') {
  const endpoints = [
    `${API_BASE}/news/opinion`,
    'http://localhost:5000/api/news/opinion',
    '/api/news/opinion'
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, persona, language })
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {
      // try next
    }
  }

  // Dynamic headline-aware persona analysis
  const cleanTitle = (title || '').split(' - ')[0].trim();
  const fullText = (title + ' ' + (description || '')).toLowerCase();
  const lang = (language || 'en').toLowerCase();

  const isAgri = /crop|farm|wheat|rice|mandi|paddy|soil|rain|flood|drought|monsoon|fertilizer|diesel|sugar|harvest|agri|kisan|grain|irrigation|cotton|livestock|vegetable|onion|potato|milk|land|loan|subsidy/i.test(fullText);
  const isWeather = /weather|rain|flood|storm|cyclone|heatwave|drought|monsoon|snow|temperature|cloud|wind|disaster|typhoon/i.test(fullText);
  const isEcon = /price|tax|market|inflation|cost|bank|rbi|rupee|dollar|economy|budget|trade|tariff|stock|share|loan|interest|gdp|finance|export|import/i.test(fullText);
  const isGeo = /war|strike|missile|military|army|defense|border|treaty|sanction|russia|ukraine|israel|gaza|iran|china|us|trump|biden|putin|modi|minister|election|politic|protest|security|un|nato/i.test(fullText);
  const isTech = /cyber|ai|hack|tech|chip|data|software|app|digital|cloud|google|apple|microsoft|openai|bot|internet|phone|network|battery/i.test(fullText);
  const isTransit = /traffic|road|bridge|metro|bus|train|flight|airline|airport|port|freight|shipping|ship|canal|railway|highway/i.test(fullText);

  const topicSnippet = cleanTitle.length > 55 ? cleanTitle.substring(0, 52) + '...' : cleanTitle;
  const pLower = (persona || '').toLowerCase();

  let badge = 'Citizen AI Perspective';
  let opinion = `Headline Intel: "${topicSnippet}" - Relevant community update.`;
  let keyTakeaway = 'Stay informed with verified news.';

  if (pLower.includes('farmer') || pLower.includes('kisan')) {
    badge = lang === 'ta' ? '🌾 உழவர் வேளாண் ஆலோசனை' : (lang === 'hi' ? '🌾 किसान कृषि सलाह' : '🌾 Kisan Agrarian Advisory');
    if (isAgri || isWeather) {
      opinion = lang === 'ta' ? `வேளாண் எச்சரிக்கை: "${topicSnippet}" விளைபொருட்கள் மற்றும் அறுவடை திட்டங்களை நேரடியாக பாதிக்கலாம்.` : (lang === 'hi' ? `कृषि अलर्ट: "${topicSnippet}" फसल कटाई और मंडी भाव को प्रभावित कर सकता है।` : `Direct Agrarian Impact: "${topicSnippet}" may affect crop harvesting, soil moisture, or Mandi sales.`);
      keyTakeaway = lang === 'ta' ? 'வயல் வடிகால் மற்றும் அறுவடை தானியங்களை பாதுகாக்கவும்.' : (lang === 'hi' ? 'खेतों की जल निकासी और कटी फसल सुरक्षित करें।' : 'Check field drainage and store harvested grain safely.');
    } else if (isEcon) {
      opinion = lang === 'ta' ? `சந்தை எச்சரிக்கை: "${topicSnippet}" உரம், டீசல் கட்டணம் மற்றும் உள்ளூர் மண்டி விலையில் மாற்றத்தை ஏற்படுத்தலாம்.` : (lang === 'hi' ? `बाजार अलर्ट: "${topicSnippet}" डीजल, खाद की लागत और मंडी दामों को प्रभावित कर सकता है।` : `Input Cost Alert: "${topicSnippet}" could influence diesel prices, fertilizer rates, or regional crop valuation.`);
      keyTakeaway = lang === 'ta' ? 'கொள்முதல் விலைகளை ஒப்பிட்டு விற்கவும்.' : (lang === 'hi' ? 'मंडी भाव और सरकारी खरीद केंद्रों की तुलना करें।' : 'Compare local Mandi rates before selling your produce.');
    } else {
      opinion = lang === 'ta' ? `பொது செய்தி: "${topicSnippet}" செய்தி உழவர் குடும்பங்களின் அன்றாட வாழ்கைக்கு மறைமுக தகவலாகும்.` : (lang === 'hi' ? `ग्रामीण सूचना: "${topicSnippet}" का कृषि कार्यों पर सीधा प्रभाव नहीं है, पर ग्रामीण जनजीवन से जुड़ा है।` : `General Rural Overview: "${topicSnippet}" carries general rural interest and family context.`);
      keyTakeaway = lang === 'ta' ? 'அன்றாட விவசாய பணிகளை தொடரவும்.' : (lang === 'hi' ? 'नियमित खेती-किसानी कार्य सुचारू रखें।' : 'Continue routine farm management as planned.');
    }
  } else if (pLower.includes('student')) {
    badge = lang === 'ta' ? '🎓 மாணவர் கல்வி உளவு' : (lang === 'hi' ? '🎓 छात्र शैक्षणिक दृष्टिकोण' : '🎓 Student Perspective');
    opinion = lang === 'ta' ? `கல்விசார் குறிப்பு: "${topicSnippet}" போட்டித் தேர்வுகள் மற்றும் நடப்பு நிகழ்வுகளுக்கு முக்கிய தலைப்பாகும்.` : (lang === 'hi' ? `करेंट अफेयर्स बिंदु: "${topicSnippet}" प्रतियोगी परीक्षाओं और सामान्य अध्ययन के लिए उपयोगी है।` : `Academic Relevance: "${topicSnippet}" is a valuable case study for current affairs and competitive exam prep.`);
    keyTakeaway = lang === 'ta' ? 'தேர்வு குறிப்புகளில் இந்த நிகழ்வை குறித்துக் கொள்ளுங்கள்.' : (lang === 'hi' ? 'परीक्षा के दृष्टिकोण से मुख्य बिंदु नोट करें।' : 'Note key dates and geopolitical terms for exam prep.');
  } else if (pLower.includes('business')) {
    badge = lang === 'ta' ? '💼 நிறுவன வணிக உளவு' : (lang === 'hi' ? '💼 व्यापारिक जोखिम विश्लेषण' : '💼 Business Intel');
    opinion = lang === 'ta' ? `வர்த்தக தாக்கம்: "${topicSnippet}" விநியோக சங்கிலி மற்றும் செயல்பாட்டு செலவை பாதிக்கலாம்.` : (lang === 'hi' ? `व्यापारिक प्रभाव: "${topicSnippet}" सप्लाई चेन और परिचालन लागत को प्रभावित कर सकता है।` : `Enterprise Impact: "${topicSnippet}" signals supply chain friction, freight surcharge risk, or input price shifts.`);
    keyTakeaway = lang === 'ta' ? 'சரக்கு இருப்பை திட்டமிட்டு விநியோக வழிகளை சரிபார்க்கவும்.' : (lang === 'hi' ? 'इन्वेंट्री बफर रखें और सप्लायर अनुबंध जांचें।' : 'Buffer inventory and review vendor lead-times.');
  } else if (pLower.includes('analyst')) {
    badge = '🛡️ Strategic Intel Assessment';
    opinion = `Strategic Telemetry: "${topicSnippet}" analyzed. Assessment indicates localized policy or geopolitical ripple vectors with monitored operational risk index.`;
    keyTakeaway = 'Monitored dispatch; threat vectors evaluated for systemic stability.';
  } else if (pLower.includes('accessibility')) {
    badge = lang === 'ta' ? '🔊 எளிய குரல் விளக்கம்' : (lang === 'hi' ? '🔊 सरल आवाज सलाह' : '🔊 Simple Voice Guidance');
    opinion = lang === 'ta' ? `செய்தி சுருக்கம்: "${topicSnippet}". இது ஒரு முக்கியமான தகவல்.` : (lang === 'hi' ? `समाचार सारांश: "${topicSnippet}"। यह एक जरूरी जानकारी है।` : `News Summary: "${topicSnippet}". Important update for awareness.`);
    keyTakeaway = lang === 'ta' ? 'பாதுகாப்பாக விழிப்புடன் இருங்கள்.' : (lang === 'hi' ? 'सतर्क और सुरक्षित रहें।' : 'Stay safe and informed.');
  } else {
    badge = lang === 'ta' ? '🏡 பொதுமக்கள் பார்வை' : (lang === 'hi' ? '🏡 नागरिक एआई राय' : '🏡 Everyday Citizen Advice');
    opinion = lang === 'ta' ? `அன்றாட பார்வை: "${topicSnippet}" தகவல் குடும்ப செலவு அல்லது உள்ளூர் பயணத்தை பாதிக்கலாம்.` : (lang === 'hi' ? `नागरिक राय: "${topicSnippet}" आपकी दैनिक दिनचर्या या यात्रा को प्रभावित कर सकता है।` : `Citizen View: "${topicSnippet}" affects daily routine, local transit, or household budget decisions.`);
    keyTakeaway = lang === 'ta' ? 'உள்ளூர் நேரலை தகவல்களை அறிந்து செயல்படுங்கள்.' : (lang === 'hi' ? 'स्थानीय अपडेट देखकर योजना बनाएं।' : 'Plan daily routine with verified local facts.');
  }

  return {
    success: true,
    title,
    persona,
    badge,
    opinion,
    keyTakeaway,
    speechText: `${badge}: ${opinion} ${keyTakeaway}`
  };
}

/**
 * Fetch active alerts from backend or Supabase
 */
export async function fetchActiveAlerts(country = null) {
  const timestamp = Date.now();
  const q = country && country !== 'global' ? `?country=${encodeURIComponent(country)}&_t=${timestamp}` : `?_t=${timestamp}`;
  
  const endpoints = [
    `${API_BASE}/alerts${q}`,
    `http://localhost:5000/api/alerts${q}`,
    `/api/alerts${q}`
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, { cache: 'no-store' });
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const data = await res.json();
        return data.alerts || [];
      }
    } catch (e) {
      // continue
    }
  }

  if (isConfigured && supabase) {
    const { data } = await supabase.from('alerts').select('*').order('created_at', { ascending: false }).limit(20);
    return data || [];
  }

  return [];
}

/**
 * Fetch logs for auditing
 */
export async function fetchSystemLogs() {
  const endpoints = [
    `${API_BASE}/logs?_t=${Date.now()}`,
    `http://localhost:5000/api/logs?_t=${Date.now()}`,
    `/api/logs?_t=${Date.now()}`
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, { cache: 'no-store' });
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const data = await res.json();
        return data.logs || [];
      }
    } catch (e) {
      // continue
    }
  }

  if (isConfigured && supabase) {
    const { data } = await supabase.from('logs').select('*').order('timestamp', { ascending: false }).limit(30);
    return data || [];
  }

  return [];
}

/**
 * Speech Synthesis Helper (Web Speech API)
 */
let currentSpeechUtterance = null;

export function speakText(text, onEndCallback = null) {
  if (!('speechSynthesis' in window)) {
    alert('Text-to-speech is not supported in your browser.');
    return;
  }

  window.speechSynthesis.cancel();
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.lang = 'en-US';

  utterance.onend = () => {
    currentSpeechUtterance = null;
    if (onEndCallback) onEndCallback();
  };

  utterance.onerror = () => {
    currentSpeechUtterance = null;
    if (onEndCallback) onEndCallback();
  };

  currentSpeechUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentSpeechUtterance = null;
  }
}

/**
 * Fetch Future Impact Simulation generated from real news data
 * Requirement 7: GET /api/future-impact?location=...&persona=...
 */
export async function fetchFutureImpact(location = 'global', persona = 'Common Person') {
  const timestamp = Date.now();
  const q = `location=${encodeURIComponent(location)}&persona=${encodeURIComponent(persona)}&_t=${timestamp}`;

  const endpoints = [
    `${API_BASE}/future-impact?${q}`,
    `${API_BASE}/news/future-impact?${q}`,
    `http://localhost:5000/api/future-impact?${q}`,
    `/api/future-impact?${q}`
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, { cache: 'no-store' });
      const ct = res.headers.get('content-type') || '';
      if (res.ok && ct.includes('application/json')) {
        const data = await res.json();
        return data;
      }
    } catch (e) {
      // try next candidate
    }
  }

  // Basic fallback return if server offline
  return {
    location,
    persona,
    totalArticlesAnalyzed: 0,
    predictions: []
  };
}


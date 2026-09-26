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

  // Fallback client-side opinion tailored to persona
  const isTa = language === 'ta';
  const isHi = language === 'hi';
  const pLower = (persona || '').toLowerCase();

  let badge = 'Citizen AI Perspective';
  let opinion = 'This development affects local routines, transit routes, or neighborhood activities.';
  let keyTakeaway = 'Stay informed and plan your schedule accordingly.';

  if (pLower.includes('analyst')) {
    badge = isTa ? 'மூலோபாய உளவு மதிப்பீடு' : (isHi ? 'रणनीतिक खुफिया आकलन' : 'Strategic Intel Assessment');
    opinion = 'Intelligence telemetry indicates regional policy and civic transit implications. Local administrative impact expected.';
    keyTakeaway = 'High monitoring priority; supply & transit latency possible.';
  } else if (pLower.includes('farmer') || pLower.includes('kisan')) {
    badge = isTa ? 'உழவர் வேளாண் வழிகாட்டல்' : (isHi ? 'किसान कृषि सलाह' : 'Kisan Agrarian Advisory');
    opinion = isTa 
      ? 'வானிலை, உரம் மற்றும் மண்டி கொள்முதல் விலையை கவனித்து பயிர் பாதுகாப்பை உறுதி செய்யவும்.' 
      : (isHi ? 'मौसम, खाद और मंडी भाव पर नजर रखें और फसलों की सुरक्षा सुनिश्चित करें।' : 'Monitor weather changes, fertilizer availability, and Mandi rates to protect crops.');
    keyTakeaway = isTa ? 'மழை மற்றும் உரம் விலையை கவனிக்கவும்.' : (isHi ? 'मौसम और मंडी भाव पर नजर रखें।' : 'Check field drainage and local Mandi prices.');
  } else if (pLower.includes('student')) {
    badge = isTa ? 'மாணவர் கல்வி ஆலோசனை' : (isHi ? 'छात्र शैक्षणिक सलाह' : 'Student Academic Brief');
    opinion = isTa 
      ? 'கல்லூரி பயணம், தேர்வுகள் அல்லது கணினி சாதன செலவுகளில் சிறு தாக்கம் ஏற்படலாம்.' 
      : (isHi ? 'कॉलेज यात्रा, परीक्षाओं और डिजिटल डिवाइस पर असर हो सकता है।' : 'May affect college transit routes, exam commute, or gadget purchase budgets.');
    keyTakeaway = isTa ? 'தேர்வுகளுக்கு முன்கூட்டியே செல்லவும்.' : (isHi ? 'परीक्षाओं के लिए समय से निकलें।' : 'Leave early for classes and backup digital notes.');
  } else if (pLower.includes('business')) {
    badge = isTa ? 'நிறுவன வர்த்தக உளவு' : (isHi ? 'व्यापारिक जोखिम विश्लेषण' : 'Enterprise Risk Brief');
    opinion = isTa 
      ? 'விநியோக சங்கிலி, சரக்கு போக்குவரத்து மற்றும் மூலப்பொருள் விலைகளில் மாற்றங்கள் ஏற்படலாம்.' 
      : (isHi ? 'सप्लाई चेन, माल ढुलाई और कच्चे माल की लागत पर प्रभाव पड़ सकता है।' : 'Supply chain lead-times and component input pricing may experience friction.');
    keyTakeaway = isTa ? 'சரக்கு இருப்பை முன்கூட்டியே திட்டமிடுங்கள்.' : (isHi ? 'इन्वेंट्री की अग्रिम योजना बनाएं।' : 'Buffer inventory and review vendor logistics.');
  } else if (pLower.includes('accessibility')) {
    badge = isTa ? 'எளிய குரல் வழிகாட்டல்' : (isHi ? 'सरल आवाज सलाह' : 'Simple Voice Guidance');
    opinion = isTa ? 'இது ஒரு முக்கியமான செய்தி. கவனமாக இருங்கள்.' : (isHi ? 'यह जरूरी खबर है। सुरक्षित रहें।' : 'This is an important update. Stay informed.');
    keyTakeaway = isTa ? 'பாதுகாப்பாக இருங்கள்.' : (isHi ? 'सुरक्षित रहें।' : 'Stay safe and informed.');
  } else {
    // Common Person
    badge = isTa ? 'மக்களுக்கான பார்வை' : (isHi ? 'नागरिक एआई राय' : 'Everyday Citizen Advice');
    opinion = isTa 
      ? 'இந்தப் புதிய நிகழ்வு உங்கள் அன்றாட வாழ்க்கை, குடும்ப மளிகை செலவு மற்றும் பயணத்தை பாதிக்கலாம்.' 
      : (isHi ? 'यह घटनाक्रम आपकी दैनिक दिनचर्या, राशन बजट और यात्रा को प्रभावित कर सकता है।' : 'This news may impact your weekly grocery budget, fuel expenses, or local transit.');
    keyTakeaway = isTa ? 'குடும்ப செலவு மற்றும் பயணத்தை கவனியுங்கள்.' : (isHi ? 'घरेलू खर्च और यात्रा पर नजर रखें।' : 'Track local transit updates and weekly household budget.');
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


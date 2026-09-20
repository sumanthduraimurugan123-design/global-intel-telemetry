import { supabase, isConfigured, logTelemetryAction } from './supabaseClient';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Fetch real news stream directly from Express backend (which aggregates verified deep-links)
 * with multi-tier failovers to Supabase or direct RSS stream.
 */
/**
 * Fetch real news stream directly from Express backend (which aggregates verified deep-links)
 * with multi-tier failovers to Supabase or direct RSS stream.
 */
export async function fetchNewsStream(country = 'global', topic = 'all', forceRefresh = false, location = null, language = 'en') {
  const timestamp = Date.now();
  const locParam = location ? `&location=${encodeURIComponent(location)}` : '';
  const langParam = language ? `&language=${encodeURIComponent(language)}` : '';

  // 1. Primary: Direct Backend API on localhost:5000
  const candidateUrls = [
    `${API_BASE}/news?country=${encodeURIComponent(country)}&topic=${encodeURIComponent(topic)}&refresh=${forceRefresh}${locParam}${langParam}&_t=${timestamp}`,
    `http://localhost:5000/api/news?country=${encodeURIComponent(country)}&topic=${encodeURIComponent(topic)}&refresh=${forceRefresh}${locParam}${langParam}&_t=${timestamp}`,
    `/api/news?country=${encodeURIComponent(country)}&topic=${encodeURIComponent(topic)}&refresh=${forceRefresh}${locParam}${langParam}&_t=${timestamp}`
  ];

  for (const endpoint of candidateUrls) {
    try {
      const response = await fetch(endpoint, {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const data = await response.json();
        if (Array.isArray(data.news) && data.news.length > 0) {
          // Verify that items have valid URLs
          const validArticles = data.news.filter(n => n.url && n.url.startsWith('http'));
          if (validArticles.length > 0) {
            return validArticles;
          }
        }
      }
    } catch (err) {
      // Try next endpoint candidate
    }
  }

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
        return data;
      }
    } catch (e) {
      console.warn('Supabase direct query failed:', e);
    }
  }

  // 3. Tertiary: Direct RSS fallback via public CORS proxy with strict Regex link extraction
  try {
    const feedUrl = 'https://feeds.bbci.co.uk/news/world/rss.xml';
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
    const directRes = await fetch(proxyUrl, { cache: 'no-store' });
    const xml = await directRes.text();

    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 25) {
      const itemBlock = match[1];

      // Declare titleMatch and decode HTML entities
      const titleMatch = itemBlock.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/i) || itemBlock.match(/<title>(.*?)<\/title>/i);
      let title = titleMatch ? titleMatch[1].trim() : '';
      title = title.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

      // Extract and clean description
      const descMatch = itemBlock.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/i) || itemBlock.match(/<description>(.*?)<\/description>/i);
      let desc = descMatch ? descMatch[1].replace(/<[^>]*>?/gm, '').trim() : title;
      desc = desc.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

      // Extract EXACT article link from <link> or <guid>
      let articleUrl = '';
      const linkMatch = itemBlock.match(/<link>(.*?)<\/link>/i) || itemBlock.match(/<guid[^>]*>(.*?)<\/guid>/i);
      if (linkMatch && linkMatch[1]) {
        articleUrl = linkMatch[1].trim().split('?')[0]; // Strip tracking queries
      }

      const pubDateMatch = itemBlock.match(/<pubDate>(.*?)<\/pubDate>/i);
      const pubDate = pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString();

      if (title && articleUrl && articleUrl.startsWith('http') && !articleUrl.endsWith('/news') && !articleUrl.endsWith('/world')) {
        items.push({
          id: `wire-${Date.now()}-${items.length}`,
          title,
          description: desc,
          url: articleUrl,
          source: 'BBC News',
          country: country.toLowerCase(),
          topic: topic === 'all' ? 'Geopolitics' : topic,
          sentiment: 'Active',
          created_at: pubDate
        });
      }
    }

    if (items.length > 0) {
      return items;
    }
  } catch (directErr) {
    console.warn('Tertiary RSS fallback exception:', directErr);
  }

  return [];
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

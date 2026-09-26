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
  const isPolicy = /law|policy|court|bill|act|parliament|government|rules|regulation|ban|order|verdict|supreme court/i.test(fullText);

  const topicSnippet = cleanTitle.length > 55 ? cleanTitle.substring(0, 52) + '...' : cleanTitle;
  const pLower = (persona || '').toLowerCase();

  let badge = 'Citizen AI Perspective';
  let opinion = '';
  let keyTakeaway = '';

  if (pLower.includes('farmer') || pLower.includes('kisan')) {
    badge = lang === 'ta' ? '🌾 உழவர் வேளாண் ஆலோசனை' : (lang === 'hi' ? '🌾 किसान कृषि सलाह' : '🌾 Kisan Agrarian Advisory');
    if (isAgri || isWeather) {
      opinion = lang === 'ta' 
        ? `வேளாண் எச்சரிக்கை: "${topicSnippet}" - பருவமழை, மண் ஈரப்பதம் மற்றும் அறுவடை திட்டங்களை நேரடியாக பாதிக்கலாம்.`
        : (lang === 'hi'
          ? `कृषि चेतावनी: "${topicSnippet}" - फसल कटाई, सिंचाई और मंडी आवक को प्रभावित कर सकता है।`
          : `Direct Agrarian Impact: "${topicSnippet}" - May directly affect field drainage, soil moisture, crop harvesting schedule, or Mandi arrivals.`);
      keyTakeaway = lang === 'ta' ? 'வயல் வடிகால் வசதியை சரிசெய்து, அறுவடை தானியங்களை உலர் சேமிப்பகத்தில் பாதுகாக்கவும்.' : (lang === 'hi' ? 'खेतों में जल निकासी सुनिश्चित करें और कटी फसल को शुष्क भंडारण में सुरक्षित रखें।' : 'Ensure field drainage, secure harvested produce in dry storage, and monitor local weather alerts.');
    } else if (isEcon) {
      opinion = lang === 'ta' 
        ? `சந்தை கட்டண மாற்றம்: "${topicSnippet}" - உரம், டீசல் விலை மற்றும் உள்ளூர் விளைபொருள் கொள்முதல் மண்டி விலையை பாதிக்கலாம்.`
        : (lang === 'hi'
          ? `बाजार मूल्य अलर्ट: "${topicSnippet}" - खाद, डीजल लागत और मंडी में फसलों के बिक्री भावों में फेरबदल कर सकता है।`
          : `Input Cost & Pricing Alert: "${topicSnippet}" - Influences fertilizer tariffs, diesel pump rates, and regional Mandi procurement prices.`);
      keyTakeaway = lang === 'ta' ? 'அரசு குறைந்தபட்ச ஆதரவு விலை (MSP) மற்றும் மண்டி விலைகளை ஒப்பிட்டு விற்கவும்.' : (lang === 'hi' ? 'सरकारी न्यूनतम समर्थन मूल्य (MSP) और स्थानीय मंडी भावों की तुलना करके उपज बेचें।' : 'Compare local Mandi rates with MSP benchmarks before executing crop sales.');
    } else if (isGeo || isTransit) {
      opinion = lang === 'ta'
        ? `சரக்கு வழித்தட செய்தி: "${topicSnippet}" - சர்வதேச கப்பல் நெரிசல் மற்றும் டீசல், உரம் இறக்குமதி விநியோகத்தை பாதிக்கலாம்.`
        : (lang === 'hi'
          ? `आपूर्ति मार्ग अपडेट: "${topicSnippet}" - अंतरराष्ट्रीय समुद्री परिवहन, डीजल और उर्वरक आयात लागत को प्रभावित कर सकता है।`
          : `Supply Logistics Brief: "${topicSnippet}" - Signals potential freight rate surcharges, diesel transport inflation, or fertilizer import delays.`);
      keyTakeaway = lang === 'ta' ? 'விவசாய தேவைக்கான உரம் மற்றும் டீசல் இருப்பை முன்கூட்டியே திட்டமிட்டு வைத்திருக்கவும்.' : (lang === 'hi' ? 'कृषि सीजन के लिए आवश्यक उर्वरक और ईंधन का अग्रिम स्टॉक सुनिश्चित करें।' : 'Pre-order essential farm inputs (fertilizer & fuel) to guard against regional transit delays.');
    } else {
      opinion = lang === 'ta'
        ? `கிராமப்புற பொது தகவல்: "${topicSnippet}" - விவசாயப்பணிகளுக்கு நேரடி அச்சுறுத்தல் இல்லை, கிராமப்புற சூழல் செய்தி.`
        : (lang === 'hi'
          ? `ग्रामीण जनजीवन अपडेट: "${topicSnippet}" - कृषि कार्यों पर कोई सीधा खतरा नहीं, सामान्य ग्रामीण जागरूकता खबर।`
          : `General Rural Context: "${topicSnippet}" - No immediate crop risk; presents general community awareness context.`);
      keyTakeaway = lang === 'ta' ? 'வழக்கமான விவசாய மற்றும் கால்நடை பராமரிப்பு பணிகளை தொடரவும்.' : (lang === 'hi' ? 'अपनी दैनिक खेती और पशुपालन गतिविधियों को सुचारू रूप से जारी रखें।' : 'Continue routine farm and livestock management as scheduled.');
    }
  } else if (pLower.includes('student')) {
    badge = lang === 'ta' ? '🎓 மாணவர் கல்வி உளவு' : (lang === 'hi' ? '🎓 छात्र शैक्षणिक दृष्टिकोण' : '🎓 Student Academic Intel');
    if (isGeo || isPolicy) {
      opinion = lang === 'ta'
        ? `போட்டித் தேர்வு பகுப்பாய்வு: "${topicSnippet}" - யுபிஎஸ்சி, சர்வதேச உறவுகள் மற்றும் நடப்பு நிகழ்வுகள் தேர்வுகளுக்கு முக்கிய பாடம்.`
        : (lang === 'hi'
          ? `प्रतियोगी परीक्षा विश्लेषण: "${topicSnippet}" - यूपीएससी, अंतर्राष्ट्रीय संबंधों और सामान्य ज्ञान अध्ययन के लिए अति महत्वपूर्ण केस स्टडी।`
          : `Exam & Case Study Relevance: "${topicSnippet}" - Highly relevant for UPSC, GRE, international relations essays, and current affairs tests.`);
      keyTakeaway = lang === 'ta' ? 'முக்கிய தேதிகள், சர்வதேச அமைப்புகள் மற்றும் கொள்கை முடிவுகளை தேர்வு குறிப்பில் எழுதவும்.' : (lang === 'hi' ? 'अंतर्राष्ट्रीय संगठनों, तिथियों और नीतिगत बिंदुओं को अपने स्टडी नोट्स में दर्ज करें।' : 'Document treaty terms, dates, and participating nations for essay & interview prep.');
    } else if (isEcon) {
      opinion = lang === 'ta'
        ? `கல்வி நிதி & வேலைவாய்ப்பு: "${topicSnippet}" - கல்லூரி கட்டணம், மாணவர் கடன் வட்டி விகிதம் மற்றும் நிறுவன வளாக வேலைவாய்ப்பில் தாக்கம்.`
        : (lang === 'hi'
          ? `छात्र वित्त व प्लेसमेंट: "${topicSnippet}" - छात्र ऋण ब्याज दरों, तकनीकी गैजेट की लागत और कैंपस हायरिंग पर प्रभाव।`
          : `Education Finance & Career Outlook: "${topicSnippet}" - Impacts student loan interest rates, tech gadget pricing, and campus hiring trends.`);
      keyTakeaway = lang === 'ta' ? 'மாணவர் கடன்களுக்கான வட்டி சலுகைகள் மற்றும் கல்வி உதவித்தொகைகளை பரிசீலிக்கவும்.' : (lang === 'hi' ? 'एज्यूकेशन लोन सब्सिडी और स्कॉलरशिप अवसरों की सक्रियता से जांच करें।' : 'Track central bank interest rates and apply for institutional merit scholarships early.');
    } else {
      opinion = lang === 'ta'
        ? `பொது அறிவு பார்வை: "${topicSnippet}" - கல்வி விவாதங்கள் மற்றும் குழு விவாதங்களுக்கு பயனுள்ள உலகளாவிய செய்தி.`
        : (lang === 'hi'
          ? `सामान्य जागरूकता: "${topicSnippet}" - ग्रुप डिस्कशन और अकादमिक बहसों के लिए एक उपयोगी संदर्भ।`
          : `General Knowledge Brief: "${topicSnippet}" - Broadens academic perspective for seminar discussions and essays.`);
      keyTakeaway = lang === 'ta' ? 'நம்பகமான செய்தி ஆதாரங்களை ஒப்பிட்டு கருத்துக்களை உருவாக்கவும்.' : (lang === 'hi' ? 'तथ्यों की पुष्टि के लिए विश्वसनीय समाचार स्रोतों का संदर्भ लें।' : 'Cross-reference information with primary research papers before citing in assignments.');
    }
  } else if (pLower.includes('business')) {
    badge = lang === 'ta' ? '💼 நிறுவன வணிக உளவு' : (lang === 'hi' ? '💼 व्यापारिक जोखिम विश्लेषण' : '💼 Enterprise Risk & Business Intel');
    if (isGeo || isPolicy) {
      opinion = lang === 'ta'
        ? `புவிசார் இடர் பகுப்பாய்வு: "${topicSnippet}" - சர்வதேச வர்த்தக தடைகள், சுங்க வரி மாற்றங்கள் மற்றும் கார்ப்பரேட் கொள்கை தாக்கம்.`
        : (lang === 'hi'
          ? `भू-राजनीतिक जोखिम: "${topicSnippet}" - सीमा पार व्यापार प्रतिबंधों, टैरिफ दरों और कॉर्पोरेट अनुपालन पर असर।`
          : `Geopolitical & Policy Risk: "${topicSnippet}" - Cross-border sanctions, tariff shifts, and compliance exposure for enterprise operations.`);
      keyTakeaway = lang === 'ta' ? 'சட்ட ஆலோசகர்களுடன் நிறுவன இறக்குமதி/ஏற்றுமதி விதிகளை மறுஆய்வு செய்யுங்கள்.' : (lang === 'hi' ? 'विदेशी व्यापार नियमों और सप्लायर जोखिमों की कानूनी समीक्षा करें।' : 'Audit vendor compliance and explore alternative neutral-country sourcing channels.');
    } else if (isEcon) {
      opinion = lang === 'ta'
        ? `கார்ப்பரேட் நிதி & சந்தை: "${topicSnippet}" - பணவீக்கம், வட்டி விகித மாற்றங்கள் மற்றும் நிறுவன பணி மூலதனம் மீதான அழுத்தம்.`
        : (lang === 'hi'
          ? `कॉर्पोरेट वित्त व बाजार: "${topicSnippet}" - मुद्रास्फीति, क्रेडिट लागत और कार्यशील पूंजी (Working Capital) पर प्रभाव।`
          : `Fiscal & Working Capital Brief: "${topicSnippet}" - Currency fluctuations, debt refinancing costs, and gross margin margin compression.`);
      keyTakeaway = lang === 'ta' ? 'வங்கி கடன் வரம்புகளை மறுசீரமைத்து, பணப்புழக்கம் மற்றும் சரக்கு இருப்பை மேம்படுத்துங்கள்.' : (lang === 'hi' ? 'बैंक क्रेडिट लाइन्स पर फिर से बातचीत करें और इन्वेंट्री कैश फ्लो को संतुलित रखें।' : 'Re-negotiate short-term credit facilities and buffer operating cash reserves.');
    } else {
      opinion = lang === 'ta'
        ? `கார்ப்பரேட் மேக்ரோ சூழல்: "${topicSnippet}" - உடனடி செயல்பாட்டு இடர் இல்லை, நிறுவன நீண்டகால கொள்கை கண்காணிப்பு.`
        : (lang === 'hi'
          ? `कारोबारी माहौल: "${topicSnippet}" - तात्कालिक परिचालन जोखिम कम है, पर दूरगामी नीतियों पर नजर जरूरी है।`
          : `Enterprise Macro Context: "${topicSnippet}" - Low immediate disruption risk; monitor standard industry policy trends.`);
      keyTakeaway = lang === 'ta' ? 'நிறுவன நிலையான செயல்பாட்டு விதிமுறைகளை (SOP) தொடரவும்.' : (lang === 'hi' ? 'मानक व्यावसायिक प्रक्रियाओं (SOP) का पालन जारी रखें।' : 'Maintain standard operational continuity SOPs and quarterly business goals.');
    }
  } else if (pLower.includes('analyst')) {
    badge = '🛡️ Strategic Intel Assessment';
    if (isGeo) {
      opinion = `Strategic Telemetry: "${topicSnippet}" analyzed. High-order geopolitical ripple vectors detected across defense alliances, territorial buffer zones, and proxy force postures.`;
      keyTakeaway = `Elevate threat monitoring matrix; map secondary proxy spillover zones and prepare executive briefing.`;
    } else if (isEcon) {
      opinion = `Macroeconomic Stability Telemetry: "${topicSnippet}" evaluated. Currency weaponization, central bank reserve maneuvers, and sovereign credit default swap (CDS) volatility identified.`;
      keyTakeaway = `Model strategic commodity supply index and evaluate sovereign debt exposure risks.`;
    } else {
      opinion = `Operational Telemetry: "${topicSnippet}" logged into intelligence ledger. Assessment indicates localized policy movement within baseline risk thresholds.`;
      keyTakeaway = `Monitored dispatch; maintain continuous automated sensor telemetry tracking.`;
    }
  } else if (pLower.includes('accessibility')) {
    badge = lang === 'ta' ? '🔊 எளிய குரல் விளக்கம்' : (lang === 'hi' ? '🔊 सरल आवाज सलाह' : '🔊 Simple Voice Guidance');
    opinion = lang === 'ta' ? `செய்தி சுருக்கம்: "${topicSnippet}". இது ஒரு முக்கியமான தகவல்.` : (lang === 'hi' ? `समाचार सारांश: "${topicSnippet}"। यह एक जरूरी जानकारी है।` : `News Summary: "${topicSnippet}". Important update for awareness.`);
    keyTakeaway = lang === 'ta' ? 'பாதுகாப்பாக விழிப்புடன் இருங்கள்.' : (lang === 'hi' ? 'सतर्क और सुरक्षित रहें।' : 'Stay safe and informed.');
  } else {
    badge = lang === 'ta' ? '🏡 பொதுமக்கள் பார்வை' : (lang === 'hi' ? '🏡 नागरिक एआई राय' : '🏡 Everyday Citizen Advice');
    if (isEcon) {
      opinion = lang === 'ta' ? `குடும்ப வரவு செலவு: "${topicSnippet}" - சமையல் மளிகை, எல்பிஜி கேஸ், பெட்ரோல் விலை மற்றும் வீட்டு பட்ஜெட்டில் தாக்கம்.` : (lang === 'hi' ? `घरेलू बजट सलाह: "${topicSnippet}" - रसोई के राशन, रसोई गैस, पेट्रोल दरों और परिवार के खर्च पर प्रभाव।` : `Household Budget Impact: "${topicSnippet}" - May affect monthly grocery bills, LPG cylinder prices, fuel costs, or home loan EMIs.`);
      keyTakeaway = lang === 'ta' ? 'மாதாந்திர குடும்ப செலவை திட்டமிட்டு, பெரிய தேவையில்லாத செலவுகளை தள்ளிப்போடுங்கள்.' : (lang === 'hi' ? 'मासिक घरेलू खर्चों की योजना बनाएं और अनावश्यक बड़े खर्चों को फिलहाल टालें।' : 'Plan monthly grocery purchases wisely and compare retail market prices before buying.');
    } else {
      opinion = lang === 'ta' ? `பொதுமக்கள் விழிப்புணர்வு: "${topicSnippet}" - சமூகம் மற்றும் அன்றாட வாழ்க்கையுடன் தொடர்புடைய செய்தி.` : (lang === 'hi' ? `नागरिक जागरूकता: "${topicSnippet}" - समाज और आम जनजीवन से जुड़ा महत्वपूर्ण घटनाक्रम।` : `Citizen Overview: "${topicSnippet}" - Relevant community update for general awareness and family safety.`);
      keyTakeaway = lang === 'ta' ? 'உள்ளூர் நேரலை தகவல்களை அறிந்து செயல்படுங்கள்.' : (lang === 'hi' ? 'प्रमाणित समाचारों से अपडेट रहें और दैनिक दिनचर्या की सही योजना बनाएं।' : 'Stay updated with verified local news and plan daily routine with facts.');
    }
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


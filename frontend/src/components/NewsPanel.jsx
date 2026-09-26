import React, { useState, useMemo } from 'react';
import { ExternalLink, Volume2, Globe2, HelpCircle, Sparkles, VolumeX, LineChart, Coffee, Accessibility, Bot, Lightbulb, MapPin, ShieldAlert, CheckCircle2, GraduationCap, Wheat, Briefcase, Users } from 'lucide-react';
import { speakInLanguage, stopSpeaking, playEarcon } from '../services/voiceService';
import { fetchNewsExplanation, fetchPersonalizedOpinion } from '../services/newsService';
import { playUiSound } from '../services/soundSystem';
import IntelligentEmptyState from './IntelligentEmptyState';

function NewsSkeletonLoader() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span className="font-mono text-xs text-cyan-300 animate-pulse font-semibold">
          Processing global data streams & synthesizing intelligence...
        </span>
      </div>
      {[1, 2, 3, 4].map(idx => (
        <div key={idx} className="p-4 rounded-xl border border-purple-500/15 bg-slate-900/40 relative overflow-hidden shimmer-mask">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-5 h-5 rounded-full bg-slate-800" />
            <div className="w-28 h-3.5 rounded bg-slate-800" />
            <div className="w-20 h-3.5 rounded bg-slate-800/60 ml-auto" />
          </div>
          <div className="w-4/5 h-4 rounded bg-slate-700/60 mb-2" />
          <div className="w-full h-3 rounded bg-slate-800/80 mb-1.5" />
          <div className="w-2/3 h-3 rounded bg-slate-800/80" />
          <div className="flex gap-2 mt-3 pt-2 border-t border-purple-500/10">
            <div className="w-20 h-6 rounded-lg bg-slate-800/60" />
            <div className="w-24 h-6 rounded-lg bg-slate-800/60" />
          </div>
        </div>
      ))}
    </div>
  );
}

const TOPICS = ['all', 'Geopolitics', 'Defense', 'Economy', 'Cyber', 'Energy'];

const SENTIMENT_LABEL = {
  'Hostile / Risk': { cls: 'text-rose-300 border-rose-500/50 bg-rose-500/20 font-bold shadow-sm shadow-rose-500/20', label: 'Risk / Critical' },
  'Tense':          { cls: 'text-amber-300 border-amber-500/50 bg-amber-500/20 font-semibold shadow-sm shadow-amber-500/20', label: 'Tense / Watch' },
  'Positive / Stable': { cls: 'text-emerald-300 border-emerald-500/50 bg-emerald-500/20 font-semibold shadow-sm shadow-emerald-500/20', label: 'Stable' },
  'Constructive':   { cls: 'text-emerald-300 border-emerald-500/50 bg-emerald-500/20 font-semibold shadow-sm shadow-emerald-500/20', label: 'Constructive' },
  'Neutral':        { cls: 'text-cyan-300 border-cyan-500/50 bg-cyan-500/15', label: 'Neutral' },
};

function cleanDescription(desc, title) {
  if (!desc || typeof desc !== 'string') return '';
  let text = desc
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

  if (text.includes('news.google.com') || text.includes('target="_blank"') || text.includes('<a href=')) {
    return '';
  }

  if (title) {
    const normTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normText = text.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normText === normTitle || normText.startsWith(normTitle) || normTitle.startsWith(normText)) {
      return '';
    }
  }

  return text;
}

function getDynamicPersonaInsight(title = '', description = '', persona = 'Casual user', language = 'en') {
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

  if (pLower.includes('farmer') || pLower.includes('kisan')) {
    let opinion = '';
    let keyTakeaway = '';
    let badge = lang === 'ta' ? '🌾 உழவர் வேளாண் ஆலோசனை' : (lang === 'hi' ? '🌾 किसान कृषि सलाह' : '🌾 Kisan Agrarian Advisory');

    if (isAgri || isWeather) {
      opinion = lang === 'ta' 
        ? `வேளாண் எச்சரிக்கை: "${topicSnippet}" விளைபொருட்கள் மற்றும் அறுவடை திட்டங்களை நேரடியாக பாதிக்கலாம்.`
        : (lang === 'hi'
          ? `कृषि अलर्ट: "${topicSnippet}" फसल कटाई और मंडी भाव को प्रभावित कर सकता है।`
          : `Direct Agrarian Impact: "${topicSnippet}" may affect crop harvesting, soil moisture, or Mandi sales.`);
      keyTakeaway = lang === 'ta' ? 'வயல் வடிகால் மற்றும் அறுவடை தானியங்களை பாதுகாக்கவும்.' : (lang === 'hi' ? 'खेतों की जल निकासी और कटी फसल सुरक्षित करें।' : 'Check field drainage and store harvested grain safely.');
    } else if (isEcon) {
      opinion = lang === 'ta' 
        ? `சந்தை எச்சரிக்கை: "${topicSnippet}" உரம், டீசல் கட்டணம் மற்றும் உள்ளூர் மண்டி விலையில் மாற்றத்தை ஏற்படுத்தலாம்.`
        : (lang === 'hi'
          ? `बाजार अलर्ट: "${topicSnippet}" डीजल, खाद की लागत और मंडी दामों को प्रभावित कर सकता है।`
          : `Input Cost Alert: "${topicSnippet}" could influence diesel prices, fertilizer rates, or regional crop valuation.`);
      keyTakeaway = lang === 'ta' ? 'கொள்முதல் விலைகளை ஒப்பிட்டு விற்கவும்.' : (lang === 'hi' ? 'मंडी भाव और सरकारी खरीद केंद्रों की तुलना करें।' : 'Compare local Mandi rates before selling your produce.');
    } else if (isGeo || isTransit) {
      opinion = lang === 'ta'
        ? `சரக்கு வழித்தடம்: "${topicSnippet}" சர்வதேச டீசல் மற்றும் உரம் இறக்குமதி செலவில் மறைமுக தாக்கம் தரலாம்.`
        : (lang === 'hi'
          ? `लॉजिस्टिक्स अपडेट: "${topicSnippet}" डीजल और आयातित खाद की आपूर्ति को प्रभावित कर सकता है।`
          : `Supply Corridor Brief: "${topicSnippet}" affects international fuel transit and fertilizer import logistics.`);
      keyTakeaway = lang === 'ta' ? 'டீசல் மற்றும் உரம் இருப்பை முன்கூட்டியே கவனியுங்கள்.' : (lang === 'hi' ? 'डीजल और उर्वरक आपूर्ति पर नजर रखें।' : 'Monitor regional fuel and fertilizer stock levels.');
    } else if (isTech) {
      opinion = lang === 'ta'
        ? `டிஜிட்டல் எச்சரிக்கை: "${topicSnippet}" ஆன்லைன் விவசாய போலி குறுஞ்செய்திகளிடம் எச்சரிக்கையாக இருங்கள்.`
        : (lang === 'hi'
          ? `डिजिटल सुरक्षा: "${topicSnippet}" कृषि योजनाओं के नाम पर आने वाले फर्जी मैसेज से सावधान रहें।`
          : `Digital Safety Brief: "${topicSnippet}" highlights the need to avoid agricultural subsidy phishing scams.`);
      keyTakeaway = lang === 'ta' ? 'அரசு வேளாண் உதவி மையங்களை மட்டும் நம்புங்கள்.' : (lang === 'hi' ? 'केवल आधिकारिक किसान पोर्टल का उपयोग करें।' : 'Rely only on verified Kisan Kendra portals.');
    } else {
      opinion = lang === 'ta'
        ? `பொது செய்தி: "${topicSnippet}" செய்தி உழவர் குடும்பங்களின் அன்றாட வாழ்கைக்கு மறைமுக தகவலாகும்.`
        : (lang === 'hi'
          ? `ग्रामीण सूचना: "${topicSnippet}" का कृषि कार्यों पर सीधा प्रभाव नहीं है, पर ग्रामीण जनजीवन से जुड़ा है।`
          : `General Rural Overview: "${topicSnippet}" carries general rural interest and family context.`);
      keyTakeaway = lang === 'ta' ? 'அன்றாட விவசாய பணிகளை தொடரவும்.' : (lang === 'hi' ? 'नियमित खेती-किसानी कार्य सुचारू रखें।' : 'Continue routine farm management as planned.');
    }

    return { badge, impactLevel: 'AGRICO', opinion, keyTakeaway };
  }

  if (pLower.includes('student')) {
    let badge = lang === 'ta' ? '🎓 மாணவர் கல்வி உளவு' : (lang === 'hi' ? '🎓 छात्र शैक्षणिक दृष्टिकोण' : '🎓 Student Perspective');
    let opinion = lang === 'ta' ? `கல்விசார் குறிப்பு: "${topicSnippet}" போட்டித் தேர்வுகள் மற்றும் நடப்பு நிகழ்வுகளுக்கு முக்கிய தலைப்பாகும்.` : (lang === 'hi' ? `करेंट अफेयर्स बिंदु: "${topicSnippet}" प्रतियोगी परीक्षाओं और सामान्य अध्ययन के लिए उपयोगी है।` : `Academic Relevance: "${topicSnippet}" is a valuable case study for current affairs and competitive exam prep.`);
    let keyTakeaway = lang === 'ta' ? 'தேர்வு குறிப்புகளில் இந்த நிகழ்வை குறித்துக் கொள்ளுங்கள்.' : (lang === 'hi' ? 'परीक्षा के दृष्टिकोण से मुख्य बिंदु नोट करें।' : 'Note key dates and geopolitical terms for exam prep.');
    return { badge, impactLevel: 'ACADEMIC', opinion, keyTakeaway };
  }

  if (pLower.includes('business')) {
    let badge = lang === 'ta' ? '💼 நிறுவன வணிக உளவு' : (lang === 'hi' ? '💼 व्यापारिक जोखिम विश्लेषण' : '💼 Business Intel');
    let opinion = lang === 'ta' ? `வர்த்தக தாக்கம்: "${topicSnippet}" விநியோக சங்கிலி மற்றும் செயல்பாட்டு செலவை பாதிக்கலாம்.` : (lang === 'hi' ? `व्यापारिक प्रभाव: "${topicSnippet}" सप्लाई चेन और परिचालन लागत को प्रभावित कर सकता है।` : `Enterprise Impact: "${topicSnippet}" signals supply chain friction, freight surcharge risk, or input price shifts.`);
    let keyTakeaway = lang === 'ta' ? 'சரக்கு இருப்பை திட்டமிட்டு விநியோக வழிகளை சரிபார்க்கவும்.' : (lang === 'hi' ? 'इन्वेंट्री बफर रखें और सप्लायर अनुबंध जांचें।' : 'Buffer inventory and review vendor lead-times.');
    return { badge, impactLevel: 'COMMERCIAL', opinion, keyTakeaway };
  }

  if (pLower.includes('analyst')) {
    const badge = '🛡️ Strategic Intel Assessment';
    const opinion = `Strategic Telemetry: "${topicSnippet}" analyzed. Assessment indicates localized policy or geopolitical ripple vectors with monitored operational risk index.`;
    const keyTakeaway = 'Monitored dispatch; threat vectors evaluated for systemic stability.';
    return { badge, impactLevel: 'ELEVATED', opinion, keyTakeaway };
  }

  if (pLower.includes('accessibility')) {
    const badge = lang === 'ta' ? '🔊 எளிய குரல் விளக்கம்' : (lang === 'hi' ? '🔊 सरल आवाज सलाह' : '🔊 Simple Voice Guidance');
    const opinion = lang === 'ta' ? `செய்தி சுருக்கம்: "${topicSnippet}". இது ஒரு முக்கியமான தகவல்.` : (lang === 'hi' ? `समाचार सारांश: "${topicSnippet}"। यह एक जरूरी जानकारी है।` : `News Summary: "${topicSnippet}". Important update for awareness.`);
    const keyTakeaway = lang === 'ta' ? 'பாதுகாப்பாக விழிப்புடன் இருங்கள்.' : (lang === 'hi' ? 'सतर्क और सुरक्षित रहें।' : 'Stay safe and informed.');
    return { badge, impactLevel: 'CLEAR', opinion, keyTakeaway };
  }

  const badge = lang === 'ta' ? '🏡 பொதுமக்கள் பார்வை' : (lang === 'hi' ? '🏡 नागरिक एআই राय' : '🏡 Everyday Citizen Advice');
  const opinion = lang === 'ta' ? `அன்றாட பார்வை: "${topicSnippet}" தகவல் குடும்ப செலவு அல்லது உள்ளூர் பயணத்தை பாதிக்கலாம்.` : (lang === 'hi' ? `नागरिक राय: "${topicSnippet}" आपकी दैनिक दिनचर्या या यात्रा को प्रभावित कर सकता है।` : `Citizen View: "${topicSnippet}" affects daily routine, local transit, or household budget decisions.`);
  const keyTakeaway = lang === 'ta' ? 'உள்ளூர் நேரலை தகவல்களை அறிந்து செயல்படுங்கள்.' : (lang === 'hi' ? 'स्थानीय अपडेट देखकर योजना बनाएं।' : 'Plan daily routine with verified local facts.');

  return { badge, impactLevel: 'EVERYDAY', opinion, keyTakeaway };
}

export default function NewsPanel({ 
  news = [], 
  isLoading = false, 
  selectedCountry,
  selectedLocation = null,
  geoInfo = null,
  fallbackDetails = null,
  onSelectTopic, 
  activeTopic,
  persona = 'Casual user',
  onSelectPersona,
  isCognitiveSimple = false,
  currentLanguage = 'en',
  lastUpdatedTime = '',
  countdown = 30
}) {
  const [readingId, setReadingId] = useState(null);
  const [explainingId, setExplainingId] = useState(null);
  const [explanations, setExplanations] = useState({});
  const [opinions, setOpinions] = useState({});
  const [opinionLoadingId, setOpinionLoadingId] = useState(null);
  const [selectedCountryFilter, setSelectedCountryFilter] = useState('all');
  const [viewMode, setViewMode] = useState('stream');

  const pLower = (persona || '').toLowerCase();

  const handleSpeak = (e, item, id) => {
    e.stopPropagation();
    e.preventDefault();
    if (readingId === id) {
      stopSpeaking();
      setReadingId(null);
      return;
    }
    setReadingId(id);
    setExplainingId(null);
    setOpinionLoadingId(null);
    playEarcon('click');

    const cleanTitle = (item.title || '').split(' - ')[0];
    const src = item.source ? `Source: ${item.source}. ` : '';
    const desc = item.description ? `${item.description}. ` : '';

    speakInLanguage(
      `${cleanTitle}. ${src} ${desc}`,
      {
        language: currentLanguage,
        rate: 0.95,
        onEnd: () => setReadingId(null),
        onError: () => setReadingId(null)
      }
    );
  };

  const handleExplain = async (e, item, id) => {
    e.stopPropagation();
    e.preventDefault();
    if (explainingId === id) {
      stopSpeaking();
      setExplainingId(null);
      return;
    }

    setExplainingId(id);
    setReadingId(null);
    setOpinionLoadingId(null);
    playEarcon('click');

    let waitMsg = 'Simplifying news in plain words...';
    if (currentLanguage === 'ta') waitMsg = 'செய்தியை எளிய தமிழில் விளக்குகிறேன்...';
    if (currentLanguage === 'hi') waitMsg = 'इस खबर को सरल भाषा में समझा रहे हैं...';
    speakInLanguage(waitMsg, { language: currentLanguage });

    try {
      const data = await fetchNewsExplanation(item.title, item.description, currentLanguage);
      setExplanations(prev => ({ ...prev, [id]: data }));

      const speech = data.simpleText || `${data.explanation} ${data.impact}`;
      speakInLanguage(speech, {
        language: currentLanguage,
        rate: 0.95,
        onEnd: () => setExplainingId(null),
        onError: () => setExplainingId(null)
      });
    } catch (err) {
      console.error('Explain error:', err);
      setExplainingId(null);
    }
  };

  const handleGetOpinion = async (e, item, id) => {
    e.stopPropagation();
    e.preventDefault();
    if (opinions[id] && opinionLoadingId === id) {
      stopSpeaking();
      setOpinionLoadingId(null);
      return;
    }

    setOpinionLoadingId(id);
    setReadingId(null);
    setExplainingId(null);
    playEarcon('click');

    let intro = 'Generating AI personalized opinion...';
    if (currentLanguage === 'ta') intro = 'தனிப்பயனாக்கப்பட்ட ஏஐ பார்வையை உருவாக்குகிறேன்...';
    if (currentLanguage === 'hi') intro = 'निजीकृत एआई राय तैयार की जा रही है...';
    speakInLanguage(intro, { language: currentLanguage });

    try {
      const opData = await fetchPersonalizedOpinion(item.title, item.description, persona, currentLanguage);
      setOpinions(prev => ({ ...prev, [id]: opData }));

      speakInLanguage(opData.speechText || `${opData.badge}: ${opData.opinion}`, {
        language: currentLanguage,
        rate: 0.95,
        onEnd: () => setOpinionLoadingId(null),
        onError: () => setOpinionLoadingId(null)
      });
    } catch (err) {
      console.error('Opinion error:', err);
      setOpinionLoadingId(null);
    }
  };

  const getCleanDomain = (url) => {
    try { return new URL(url).hostname.replace('www.', ''); }
    catch { return ''; }
  };

  const availableCountries = useMemo(() => {
    const map = {};
    for (const item of news) {
      const cId = item.country || 'global';
      if (!map[cId]) {
        map[cId] = {
          id: cId,
          name: item.country_name || (cId === 'global' ? 'Global' : cId),
          flag: item.country_flag || (cId === 'global' ? '🌐' : ''),
          count: 0
        };
      }
      map[cId].count++;
    }
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [news]);

  const filteredNews = useMemo(() => {
    if (selectedCountryFilter === 'all') return news;
    return news.filter(n => (n.country || 'global') === selectedCountryFilter);
  }, [news, selectedCountryFilter]);

  const groupedByCountry = useMemo(() => {
    const groups = {};
    for (const item of filteredNews) {
      const cId = item.country || 'global';
      if (!groups[cId]) {
        groups[cId] = {
          id: cId,
          name: item.country_name || (cId === 'global' ? 'Global' : cId.toUpperCase()),
          flag: item.country_flag || (cId === 'global' ? '🌐' : ''),
          articles: []
        };
      }
      groups[cId].articles.push(item);
    }
    return Object.values(groups).sort((a, b) => b.articles.length - a.articles.length);
  }, [filteredNews]);

  const renderNewsRow = (item, idx) => {
    const cardId = item.id || `news-${idx}`;
    const isReading = readingId === cardId;
    const isExplaining = explainingId === cardId;
    const isOpinionActive = opinionLoadingId === cardId;
    const explanation = explanations[cardId];
    const opinion = opinions[cardId];
    const activeOpinion = opinion || getDynamicPersonaInsight(item.title, item.description, persona, currentLanguage);
    const sentCfg = SENTIMENT_LABEL[item.sentiment] || SENTIMENT_LABEL['Neutral'];
    const isLocal = item.country_flag === '📍' || (item.country_name && item.country_name.includes('Local'));

    const pLower = (persona || '').toLowerCase();

    const catStr = `${item.category || ''} ${item.topic || ''} ${item.sentiment || ''} ${item.title || ''}`.toLowerCase();
    let categoryGlow = 'hover:border-purple-400/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]';
    if (catStr.includes('economy') || catStr.includes('market') || catStr.includes('finance') || catStr.includes('trade')) {
      categoryGlow = 'hover:border-cyan-400/50 hover:shadow-[0_0_24px_rgba(6,182,212,0.22)]';
    } else if (catStr.includes('risk') || catStr.includes('hostile') || catStr.includes('defense') || catStr.includes('war') || catStr.includes('threat')) {
      categoryGlow = 'hover:border-rose-400/50 hover:shadow-[0_0_24px_rgba(244,63,94,0.22)]';
    } else if (catStr.includes('growth') || catStr.includes('tech') || catStr.includes('energy') || catStr.includes('cyber') || catStr.includes('chip')) {
      categoryGlow = 'hover:border-emerald-400/50 hover:shadow-[0_0_24px_rgba(16,185,129,0.22)]';
    }

    // ACCESSIBILITY MODE VIEW (Large buttons, high-contrast, speech-friendly)
    if (pLower.includes('accessibility') || isCognitiveSimple) {
      return (
        <div key={cardId} className={`p-4 border-b-2 border-slate-800 bg-slate-900/50 ${isReading ? 'bg-amber-950/20 border-l-4 border-l-amber-400' : ''}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{item.country_flag || '🌐'}</span>
            <span className="font-mono text-sm font-bold text-slate-100">{item.country_name || item.country}</span>
            {isLocal && (
              <span className="bg-amber-400 text-slate-950 font-mono font-bold text-[11px] px-2 py-0.5 rounded-sm">
                LOCAL NEWS
              </span>
            )}
            <span className="font-mono text-xs text-slate-400 ml-auto">{item.source}</span>
          </div>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-lg font-bold text-white hover:text-amber-400 transition-colors leading-snug mb-3"
          >
            {item.title}
          </a>

          {/* Explanation if loaded */}
          {explanation && (
            <div className="bg-slate-900/80 border-2 border-amber-500/60 p-3 my-2 text-white font-sans text-sm">
              <span className="font-mono text-xs text-amber-400 font-bold block mb-1">💡 எளிய விளக்கம் / PLAIN MEANING:</span>
              <p className="font-medium mb-1">{explanation.explanation}</p>
              <p className="text-amber-300 font-semibold">👉 {explanation.impact}</p>
            </div>
          )}

          {/* Dynamic AI Opinion */}
          {activeOpinion && (
            <div className="bg-slate-900/80 border-2 border-cyan-500 p-3 my-2 text-white font-sans text-sm">
              <span className="font-mono text-xs text-cyan-400 font-bold block mb-1">🤖 {activeOpinion.badge}:</span>
              <p className="font-medium mb-1">{activeOpinion.opinion}</p>
              <p className="text-cyan-300 font-semibold">👉 {activeOpinion.keyTakeaway}</p>
            </div>
          )}

          {(() => {
            const desc = cleanDescription(item.description, item.title);
            if (!desc || explanation || activeOpinion) return null;
            return <p className="text-sm text-slate-300 leading-relaxed mb-3">{desc}</p>;
          })()}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={(e) => handleSpeak(e, item, cardId)}
              className={`px-4 py-2 font-mono text-sm font-bold rounded-sm border transition-colors flex items-center gap-2 ${
                isReading ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-950 text-slate-100 border-slate-800 hover:border-amber-500/60'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isReading ? 'Stop Audio' : '🔊 Listen News'}</span>
            </button>

            <button
              onClick={(e) => handleExplain(e, item, cardId)}
              className="px-4 py-2 font-mono text-sm font-bold rounded-sm border bg-slate-950 text-amber-400 border-amber-500/60 hover:bg-amber-400 hover:text-slate-950 transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>💡 Explain News</span>
            </button>

            <button
              onClick={(e) => handleGetOpinion(e, item, cardId)}
              className="px-4 py-2 font-mono text-sm font-bold rounded-sm border bg-slate-950 text-cyan-400 border-cyan-500 hover:bg-cyan-500 hover:text-slate-950 transition-colors flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              <span>🤖 AI Opinion</span>
            </button>
          </div>
        </div>
      );
    }

    // ANALYST VIEW (High-density telemetry, strategic threat assessment, raw indicators)
    if (pLower.includes('analyst')) {
      return (
        <div
          key={cardId}
          className={`px-4 py-3.5 border-b border-slate-800/50 hover:bg-slate-900/80/60 transition-colors ${
            isReading ? 'bg-amber-950/20 border-l-2 border-l-amber-400' : ''
          }`}
        >
          {/* Top Analyst Metric Strip */}
          <div className="flex items-center gap-2 mb-1.5 font-mono text-[10px]">
            <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1">
              <span>{item.country_flag || '🌐'}</span>
              <span className="font-semibold uppercase">{item.country_name || item.country}</span>
            </span>

            {isLocal && (
              <span className="px-1.5 py-0.5 bg-amber-950 text-amber-400 border border-amber-800 font-semibold">
                HYPER-LOCAL INTEL
              </span>
            )}

            <span className="text-slate-400">{item.source}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 tabular-nums">
              {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>

            <span className={`ml-auto border px-1.5 py-0.5 text-[9px] font-semibold ${sentCfg.cls}`}>
              {sentCfg.label}
            </span>

            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={(e) => handleSpeak(e, item, cardId)}
                className={`p-1 border text-[10px] flex items-center gap-1 transition-colors ${
                  isReading ? 'bg-rose-600 text-white border-rose-600' : 'border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Listen to dispatch"
              >
                <Volume2 className="w-3 h-3" />
                <span className="hidden sm:inline">Audio</span>
              </button>
              <button
                onClick={(e) => handleGetOpinion(e, item, cardId)}
                className={`p-1 border text-[10px] flex items-center gap-1 transition-colors ${
                  opinion ? 'bg-cyan-950 text-cyan-400 border-cyan-800' : 'border-slate-800 text-cyan-400 hover:bg-cyan-950/40'
                }`}
                title="Run Strategic AI Assessment"
              >
                <Bot className="w-3 h-3" />
                <span className="hidden sm:inline">Strategic AI</span>
              </button>
            </div>
          </div>

          {/* Headline */}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-serif text-sm font-semibold text-slate-100 hover:text-amber-400 transition-colors leading-snug"
          >
            {item.title}
          </a>

          {/* Description */}
          {item.description && item.description !== item.title && (
            <p className="mt-1 text-xs text-slate-400 font-sans leading-relaxed line-clamp-2">
              {item.description}
            </p>
          )}

          {/* Strategic Assessment Box */}
          {activeOpinion && (
            <div className="mt-2.5 bg-slate-950 border-l-2 border-l-cyan-500 border-y border-r border-slate-800 p-2.5 font-mono text-[11px] text-slate-300">
              <div className="flex items-center justify-between text-cyan-400 font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{activeOpinion.badge || 'STRATEGIC INTEL ASSESSMENT'}</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.2 bg-cyan-950/60 border border-cyan-800">
                  IMPACT: {activeOpinion.impactLevel || 'ELEVATED'}
                </span>
              </div>
              <p className="text-slate-200 mb-1 font-sans text-xs leading-relaxed">{activeOpinion.opinion}</p>
              <p className="text-cyan-300 font-sans text-[11px]">⚡ Key Takeaway: {activeOpinion.keyTakeaway}</p>
            </div>
          )}
        </div>
      );
    }

    // STUDENT VIEW — Clear, campus-focused, digital safety emphasis
    if (pLower.includes('student')) {
      return (
        <div
          key={cardId}
          className={`px-4 py-3.5 border-b border-slate-800/40 hover:bg-sky-950/10 transition-colors ${
            isReading ? 'bg-sky-950/20 border-l-2 border-l-sky-400' : ''
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5 text-xs font-mono">
            <span className="text-base">{item.country_flag || '🌐'}</span>
            <span className="text-slate-400">{item.country_name || item.country}</span>
            <span>·</span>
            <span className="text-slate-500">{item.source}</span>
            <span className={`ml-auto border px-1.5 py-0.5 text-[9px] font-semibold ${sentCfg.cls}`}>
              {sentCfg.label}
            </span>
          </div>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-serif text-sm font-semibold text-white hover:text-sky-300 transition-colors leading-snug mb-1"
          >
            {item.title}
          </a>

          {(() => {
            const desc = cleanDescription(item.description, item.title);
            if (!desc) return null;
            return <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-2 mb-2">{desc}</p>;
          })()}

          {activeOpinion && (
            <div className="bg-sky-950/30 border-l-2 border-l-sky-400 border-y border-r border-sky-800/40 p-2.5 my-2 text-xs font-sans">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-sky-400 font-bold mb-1">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{activeOpinion.badge}</span>
              </div>
              <p className="text-white mb-1 leading-relaxed">{activeOpinion.opinion}</p>
              <p className="text-sky-300 font-medium text-[11px]">📚 {activeOpinion.keyTakeaway}</p>
            </div>
          )}

          {explanation && !opinion && (
            <div className="bg-sky-950/20 border-l-2 border-l-sky-400 p-2.5 my-2 text-xs font-sans">
              <span className="font-mono text-[10px] text-sky-300 block mb-1 font-bold">💡 PLAIN EXPLANATION:</span>
              <p className="text-white mb-1">{explanation.explanation}</p>
              <p className="text-slate-400 text-[11px]">📖 {explanation.impact}</p>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={(e) => handleSpeak(e, item, cardId)}
              className={`px-2.5 py-1 text-xs font-mono border rounded-sm flex items-center gap-1 transition-colors ${
                isReading ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-950 text-slate-100 border-slate-800 hover:border-sky-400'
              }`}
            >
              <Volume2 className="w-3 h-3" />
              <span>{isReading ? 'Stop' : '🔊 Listen'}</span>
            </button>
            <button
              onClick={(e) => handleGetOpinion(e, item, cardId)}
              className={`px-2.5 py-1 text-xs font-mono border rounded-sm flex items-center gap-1 transition-colors ${
                opinion ? 'bg-sky-700 text-white border-sky-700' : 'bg-slate-950 text-sky-400 border-sky-700/50 hover:border-sky-400'
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              <span>{opinion ? 'Student AI Active' : '🎓 Student View'}</span>
            </button>
            <button
              onClick={(e) => handleExplain(e, item, cardId)}
              className="px-2.5 py-1 text-xs font-mono border rounded-sm bg-slate-950 text-slate-400 border-slate-800 hover:text-white transition-colors flex items-center gap-1"
            >
              <Lightbulb className="w-3 h-3 text-sky-300" />
              <span>💡 Explain</span>
            </button>
          </div>
        </div>
      );
    }

    // FARMER / KISAN VIEW — Weather, mandi prices, crop focus in simple language
    if (pLower.includes('farmer') || pLower.includes('kisan')) {
      return (
        <div
          key={cardId}
          className={`px-4 py-3.5 border-b border-slate-800/40 hover:bg-emerald-950/10 transition-colors ${
            isReading ? 'bg-emerald-950/20 border-l-2 border-l-emerald-400' : ''
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5 text-xs font-mono">
            <span className="text-base">{item.country_flag || '🌐'}</span>
            <span className="text-slate-400">{item.country_name || item.country}</span>
            <span>·</span>
            <span className="text-slate-500 text-[11px]">{item.source}</span>
            <span className={`ml-auto border px-1.5 py-0.5 text-[9px] font-semibold ${sentCfg.cls}`}>
              {sentCfg.label}
            </span>
          </div>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-serif text-base font-bold text-white hover:text-emerald-300 transition-colors leading-snug mb-1.5"
          >
            {item.title}
          </a>

          {(() => {
            const desc = cleanDescription(item.description, item.title);
            if (!desc) return null;
            return <p className="text-sm text-slate-300 font-sans leading-relaxed line-clamp-2 mb-2">{desc}</p>;
          })()}

          {activeOpinion && (
            <div className="bg-emerald-950/30 border-l-2 border-l-emerald-400 border-y border-r border-emerald-800/40 p-3 my-2 text-sm font-sans">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 font-bold mb-1">
                <Wheat className="w-3.5 h-3.5" />
                <span>{activeOpinion.badge}</span>
              </div>
              <p className="text-white mb-1.5 leading-relaxed">{activeOpinion.opinion}</p>
              <p className="text-emerald-300 font-medium text-xs">🚜 {activeOpinion.keyTakeaway}</p>
            </div>
          )}

          {explanation && !opinion && (
            <div className="bg-emerald-950/20 border-l-2 border-l-emerald-400 p-3 my-2 text-sm font-sans">
              <span className="font-mono text-[10px] text-emerald-300 block mb-1 font-bold">🌱 SIMPLE MEANING:</span>
              <p className="text-white mb-1.5">{explanation.explanation}</p>
              <p className="text-slate-400 text-xs">🌾 {explanation.impact}</p>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={(e) => handleSpeak(e, item, cardId)}
              className={`px-3 py-1.5 text-sm font-mono border rounded-sm flex items-center gap-2 transition-colors ${
                isReading ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-slate-950 text-slate-100 border-slate-800 hover:border-emerald-400'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isReading ? 'Stop' : '🔊 Suno / Listen'}</span>
            </button>
            <button
              onClick={(e) => handleGetOpinion(e, item, cardId)}
              className={`px-3 py-1.5 text-sm font-mono border rounded-sm flex items-center gap-2 transition-colors ${
                opinion ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-slate-950 text-emerald-400 border-emerald-700/50 hover:border-emerald-400'
              }`}
            >
              <Wheat className="w-4 h-4" />
              <span>{opinion ? 'Kisan View Active' : '🌾 Kisan Advisory'}</span>
            </button>
          </div>
        </div>
      );
    }

    // BUSINESS VIEW — Supply chain, freight, tariffs, operational risk focus
    if (pLower.includes('business')) {
      return (
        <div
          key={cardId}
          className={`px-4 py-3.5 border-b border-slate-800/50 hover:bg-purple-950/10 transition-colors ${
            isReading ? 'bg-purple-950/20 border-l-2 border-l-purple-400' : ''
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5 font-mono text-[10px]">
            <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1">
              <span>{item.country_flag || '🌐'}</span>
              <span className="font-semibold uppercase">{item.country_name || item.country}</span>
            </span>
            {isLocal && (
              <span className="px-1.5 py-0.5 bg-purple-950 text-purple-400 border border-purple-800 font-semibold">
                LOCAL MARKET
              </span>
            )}
            <span className="text-slate-400">{item.source}</span>
            <span className={`ml-auto border px-1.5 py-0.5 text-[9px] font-semibold ${sentCfg.cls}`}>
              {sentCfg.label}
            </span>
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={(e) => handleSpeak(e, item, cardId)}
                className={`p-1 border text-[10px] flex items-center gap-1 transition-colors ${
                  isReading ? 'bg-purple-600 text-white border-purple-600' : 'border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Volume2 className="w-3 h-3" />
                <span className="hidden sm:inline">Audio</span>
              </button>
              <button
                onClick={(e) => handleGetOpinion(e, item, cardId)}
                className={`p-1 border text-[10px] flex items-center gap-1 transition-colors ${
                  opinion ? 'bg-purple-950 text-purple-400 border-purple-800' : 'border-slate-800 text-purple-400 hover:bg-purple-950/40'
                }`}
              >
                <Briefcase className="w-3 h-3" />
                <span className="hidden sm:inline">Biz Intel</span>
              </button>
            </div>
          </div>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-serif text-sm font-semibold text-slate-100 hover:text-purple-300 transition-colors leading-snug"
          >
            {item.title}
          </a>

          {item.description && item.description !== item.title && (
            <p className="mt-1 text-xs text-slate-400 font-sans leading-relaxed line-clamp-2">
              {item.description}
            </p>
          )}

          {activeOpinion && (
            <div className="mt-2.5 bg-slate-950 border-l-2 border-l-purple-400 border-y border-r border-slate-800 p-2.5 font-mono text-[11px] text-slate-300">
              <div className="flex items-center justify-between text-purple-400 font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{activeOpinion.badge}</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.2 bg-purple-950/60 border border-purple-800">
                  RISK: {activeOpinion.impactLevel || 'ELEVATED'}
                </span>
              </div>
              <p className="text-slate-200 mb-1 font-sans text-xs leading-relaxed">{activeOpinion.opinion}</p>
              <p className="text-purple-300 font-sans text-[11px]">💼 Key Takeaway: {activeOpinion.keyTakeaway}</p>
            </div>
          )}
        </div>
      );
    }

    // COMMON PERSON VIEW — Everyday, family-focused, simple language
    if (pLower.includes('common')) {
      return (
        <div
          key={cardId}
          className={`px-4 py-3.5 border-b border-slate-800/40 hover:bg-amber-950/10 transition-colors ${
            isReading ? 'bg-amber-950/20 border-l-2 border-l-amber-400' : ''
          }`}
        >
          <div className="flex items-center gap-2 mb-1 text-xs text-slate-400 font-mono">
            <span className="text-base">{item.country_flag || '🌐'}</span>
            <span>{item.country_name || item.country}</span>
            {isLocal && (
              <span className="px-1.5 py-0.2 bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">
                YOUR AREA
              </span>
            )}
            <span>·</span>
            <span>{item.source}</span>
            <span className="ml-auto text-[10px] text-slate-500">
              {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-serif text-base font-bold text-slate-100 hover:text-amber-300 transition-colors leading-snug mb-1"
          >
            {item.title}
          </a>

          {(() => {
            const desc = cleanDescription(item.description, item.title);
            if (!desc) return null;
            return <p className="text-sm text-slate-300 font-sans leading-relaxed line-clamp-2 mb-2">{desc}</p>;
          })()}

          {activeOpinion && (
            <div className="bg-slate-950 border-l-2 border-l-amber-400 border-y border-r border-amber-800/30 p-3 my-2 text-sm font-sans">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-400 font-bold mb-1">
                <Users className="w-3.5 h-3.5" />
                <span>{activeOpinion.badge}</span>
              </div>
              <p className="text-slate-200 mb-1 leading-relaxed">{activeOpinion.opinion}</p>
              <p className="text-amber-300 font-medium text-xs">👉 {activeOpinion.keyTakeaway}</p>
            </div>
          )}

          {explanation && !opinion && (
            <div className="bg-slate-950 border-l-2 border-l-amber-400 p-2.5 my-2 text-sm font-sans">
              <span className="font-mono text-[10px] text-amber-300 block mb-1 font-bold">💡 PLAIN MEANING:</span>
              <p className="text-white mb-1">{explanation.explanation}</p>
              <p className="text-slate-400 text-xs">👉 {explanation.impact}</p>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={(e) => handleSpeak(e, item, cardId)}
              className={`px-3 py-1.5 text-sm font-mono border rounded-sm flex items-center gap-2 transition-colors ${
                isReading ? 'bg-amber-600 text-black border-amber-600' : 'bg-slate-950 text-slate-100 border-slate-800 hover:border-amber-400'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isReading ? 'Stop' : '🔊 Listen'}</span>
            </button>
            <button
              onClick={(e) => handleGetOpinion(e, item, cardId)}
              className={`px-3 py-1.5 text-sm font-mono border rounded-sm flex items-center gap-2 transition-colors ${
                opinion ? 'bg-amber-600 text-black border-amber-600 font-bold' : 'bg-slate-950 text-amber-400 border-amber-700/50 hover:border-amber-400'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{opinion ? 'Opinion Active' : '👥 My Opinion'}</span>
            </button>
            <button
              onClick={(e) => handleExplain(e, item, cardId)}
              className="px-3 py-1.5 text-sm font-mono border rounded-sm bg-slate-950 text-slate-400 border-slate-800 hover:text-white transition-colors flex items-center gap-2"
            >
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Explain Simply</span>
            </button>
          </div>
        </div>
      );
    }

    // CASUAL USER VIEW (Clean, citizen-focused layout with everyday AI opinions)
    return (
      <div
        key={cardId}
        className={`px-4 py-3.5 border-b border-purple-500/10 hover:bg-slate-900/60 transition-all duration-300 rounded-xl my-1 mx-1 border border-transparent ${categoryGlow} ${
          isReading ? 'bg-amber-950/20 border-l-4 border-l-amber-400' : ''
        }`}
      >
        <div className="flex items-center gap-2 mb-1 text-xs text-slate-400 font-mono">
          <span>{item.country_flag || '🌐'} {item.country_name || item.country}</span>
          {isLocal && (
            <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
              NEIGHBORHOOD NEWS
            </span>
          )}
          <span>·</span>
          <span>{item.source}</span>
          <span className="ml-auto text-[10px] text-slate-500">
            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block font-serif text-sm sm:text-base font-semibold text-slate-100 hover:text-amber-400 transition-colors leading-snug mb-1"
        >
          {item.title}
        </a>

        {(() => {
          const desc = cleanDescription(item.description, item.title);
          if (!desc) return null;
          return (
            <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-2 mb-2">
              {desc}
            </p>
          );
        })()}

        {/* Personalized AI Citizen Opinion */}
        {opinion && (
          <div className="bg-slate-950 border-l-2 border-l-amber-400 border-y border-r border-slate-800 p-3 my-2 text-xs text-slate-100 font-sans">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-400 font-bold mb-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>{opinion.badge || 'CITIZEN AI PERSPECTIVE'}</span>
            </div>
            <p className="text-white mb-1.5 leading-relaxed">{opinion.opinion}</p>
            <p className="text-slate-400 font-medium text-[11px]">👉 {opinion.keyTakeaway}</p>
          </div>
        )}

        {explanation && !opinion && (
          <div className="bg-slate-950 border-l-2 border-l-amber-400 border-y border-r border-slate-800 p-2.5 my-2 text-xs text-slate-100 font-sans">
            <span className="font-mono text-[10px] text-amber-400 block mb-1 font-bold">💡 PLAIN EXPLANATION:</span>
            <p className="text-white mb-1">{explanation.explanation}</p>
            <p className="text-slate-400 text-[11px]">👉 {explanation.impact}</p>
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={(e) => handleSpeak(e, item, cardId)}
            className={`px-2.5 py-1 text-xs font-mono border rounded-sm flex items-center gap-1 transition-colors ${
              isReading ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-950 text-slate-100 border-slate-800 hover:border-amber-500/60'
            }`}
          >
            <Volume2 className="w-3 h-3" />
            <span>{isReading ? 'Stop' : '🔊 Listen'}</span>
          </button>

          <button
            onClick={(e) => handleGetOpinion(e, item, cardId)}
            className={`px-2.5 py-1 text-xs font-mono border rounded-sm flex items-center gap-1 transition-colors ${
              opinion ? 'bg-amber-400 text-slate-950 font-semibold border-amber-500/60' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-amber-400 hover:border-amber-500/60'
            }`}
          >
            <Bot className="w-3 h-3 text-amber-400" />
            <span>{opinion ? 'AI Opinion Active' : '🤖 AI Opinion'}</span>
          </button>

          <button
            onClick={(e) => handleExplain(e, item, cardId)}
            className="px-2.5 py-1 text-xs font-mono border rounded-sm bg-slate-950 text-slate-400 border-slate-800 hover:text-white transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>💡 Explain</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="glass-card-luxe rounded-2xl flex flex-col shadow-2xl overflow-hidden my-4 border border-purple-500/25">
      
      {/* 1. Prominent Active Persona Status & 1-Click Persona Tabs */}
      <div className="bg-slate-900/80 border-b border-purple-500/20 px-4 py-3 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] text-purple-300 uppercase tracking-widest font-semibold">Active Persona:</span>
          <span className={`px-3 py-1 text-xs font-mono font-bold rounded-lg border flex items-center gap-1.5 shadow-sm ${
            pLower.includes('analyst')
              ? 'bg-purple-950/60 text-purple-200 border-purple-500/50 shadow-purple-500/20'
              : pLower.includes('accessibility')
              ? 'bg-emerald-950/60 text-emerald-200 border-emerald-500/50 shadow-emerald-500/20'
              : pLower.includes('student')
              ? 'bg-sky-950/60 text-sky-200 border-sky-500/50 shadow-sky-500/20'
              : pLower.includes('farmer') || pLower.includes('kisan')
              ? 'bg-emerald-950/60 text-emerald-200 border-emerald-500/50 shadow-emerald-500/20'
              : pLower.includes('business')
              ? 'bg-pink-950/60 text-pink-200 border-pink-500/50 shadow-pink-500/20'
              : 'bg-amber-950/60 text-amber-200 border-amber-500/50 shadow-amber-500/20'
          }`}>
            {pLower.includes('analyst') && <LineChart className="w-3.5 h-3.5" />}
            {pLower.includes('student') && <GraduationCap className="w-3.5 h-3.5" />}
            {pLower.includes('farmer') && <Wheat className="w-3.5 h-3.5" />}
            {pLower.includes('business') && <Briefcase className="w-3.5 h-3.5" />}
            {(pLower.includes('common') || pLower.includes('casual')) && <Users className="w-3.5 h-3.5" />}
            {pLower.includes('accessibility') && <Accessibility className="w-3.5 h-3.5" />}
            {persona}
          </span>
          <span className="hidden md:inline font-sans text-xs text-slate-400">
            {pLower.includes('analyst') && '— Deep telemetry, threat assessments, raw dispatches'}
            {pLower.includes('student') && '— Campus commute, gadget prices, digital safety digest'}
            {(pLower.includes('farmer') || pLower.includes('kisan')) && '— Weather alerts, mandi prices, crop advisories'}
            {pLower.includes('business') && '— Supply chain, freight, tariffs, operational risk'}
            {(pLower.includes('common') || pLower.includes('casual')) && '— Everyday digest with family-focused insights'}
            {pLower.includes('accessibility') && '— Large font, high contrast, voice-first guidance'}
          </span>
        </div>

        {/* Persona Quick-Switch Tabs — All 6 personas */}
        {onSelectPersona && (
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-purple-500/20 flex-wrap">
            {[
              { id: 'Analyst', icon: <LineChart className="w-3 h-3" />, label: 'Analyst', activeClass: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-500/30' },
              { id: 'Common person', icon: <Users className="w-3 h-3" />, label: 'Common', activeClass: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/30' },
              { id: 'Student', icon: <GraduationCap className="w-3 h-3" />, label: 'Student', activeClass: 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-sky-500/30' },
              { id: 'Farmer', icon: <Wheat className="w-3 h-3" />, label: 'Farmer', activeClass: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/30' },
              { id: 'Business', icon: <Briefcase className="w-3 h-3" />, label: 'Business', activeClass: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-pink-500/30' },
              { id: 'Accessibility mode', icon: <Accessibility className="w-3 h-3" />, label: 'Access.', activeClass: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/30' },
            ].map((p) => {
              const isActive = persona === p.id || (persona || '').toLowerCase() === p.id.toLowerCase();
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPersona(p.id)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? `${p.activeClass} font-bold shadow-md scale-105`
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {p.icon}
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Sub-Header: Feed Stats, Breadcrumbs & Controls */}
      <div className="px-4 py-3 border-b border-purple-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="font-display text-white text-sm font-bold flex items-center gap-2">
            <span className="gradient-text">Live Telemetry Feed</span>
          </h2>
          
          {/* Hierarchical Location Breadcrumbs */}
          <div className="flex items-center gap-1.5 font-mono text-[11px] bg-slate-950/70 border border-purple-500/25 px-2.5 py-1 rounded-full shadow-inner">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300">
              {geoInfo?.country || (selectedCountry === 'global' ? 'Planetary' : selectedCountry.toUpperCase())}
            </span>
            {geoInfo?.state && (
              <>
                <span className="text-purple-400/50">/</span>
                <span className="text-slate-200 font-semibold">{geoInfo.state}</span>
              </>
            )}
            {geoInfo?.city && (
              <>
                <span className="text-purple-400/50">/</span>
                <span className="text-pink-300 font-bold">{geoInfo.city}</span>
              </>
            )}
          </div>

          <span className="font-mono text-[11px] text-slate-400 px-2 py-0.5 rounded-md bg-purple-950/20 border border-purple-500/20">
            {filteredNews.length} verified dispatches
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-purple-500/20 overflow-hidden bg-slate-950/60 p-0.5">
            <button
              onClick={() => setViewMode('stream')}
              className={`px-3 py-1 rounded-md transition-all ${
                viewMode === 'stream' ? 'bg-purple-600/40 text-purple-200 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >Stream</button>
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-3 py-1 rounded-md transition-all ${
                viewMode === 'grouped' ? 'bg-purple-600/40 text-purple-200 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >Grouped</button>
          </div>
          
          <span className={`tabular-nums px-2 py-0.5 rounded-md border text-[11px] ${
            countdown <= 5 ? 'text-pink-400 border-pink-500/40 bg-pink-500/10 animate-pulse font-bold' : 'text-slate-400 border-slate-800'
          }`}>
            Sync {countdown}s
          </span>
        </div>
      </div>

      {/* 3. Topic filter strip */}
      <div className="px-4 py-2.5 border-b border-purple-500/10 flex flex-wrap gap-2 bg-slate-950/40 items-center">
        <span className="font-mono text-[10px] text-purple-300 font-semibold uppercase tracking-wider mr-1">TOPIC:</span>
        {TOPICS.map(t => (
          <button
            key={t}
            onClick={() => onSelectTopic(t)}
            className={`font-mono text-xs px-3 py-1 rounded-full transition-all duration-200 border ${
              activeTopic === t
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-md shadow-purple-500/25 font-bold scale-105'
                : 'text-slate-400 border-purple-500/20 hover:text-white hover:border-purple-500/40 hover:bg-slate-900/60'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Smart Fallback Warning Banner */}
      {fallbackDetails && fallbackDetails.fallbackMessage && (
        <div className="px-4 py-2.5 bg-amber-950/30 border-b border-amber-500/30 flex items-center gap-2 text-xs font-mono text-amber-200">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
          <div className="flex-1">
            <span className="font-bold uppercase tracking-wider text-[10px] block text-amber-400">Smart Regional Fallback Active:</span>
            <span>{fallbackDetails.fallbackMessage}</span>
          </div>
        </div>
      )}

      {/* 4. Country / Region Filter */}
      {availableCountries.length > 1 && (
        <div className="px-4 py-2 border-b border-purple-500/10 flex flex-wrap gap-1.5 bg-slate-950/20">
          <button
            onClick={() => setSelectedCountryFilter('all')}
            className={`font-mono text-[11px] px-3 py-1 rounded-lg border transition-all ${
              selectedCountryFilter === 'all'
                ? 'text-purple-200 border-purple-500/50 bg-purple-900/30 font-semibold'
                : 'text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            All Sectors ({news.length})
          </button>
          {availableCountries.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCountryFilter(c.id)}
              className={`font-mono text-[11px] px-3 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                selectedCountryFilter === c.id
                  ? 'text-cyan-200 border-cyan-500/50 bg-cyan-950/40 font-semibold shadow-sm shadow-cyan-500/20'
                  : 'text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span>{c.flag}</span>
              <span className="capitalize">{c.name}</span>
              <span className="text-slate-400 text-[10px]">({c.count})</span>
            </button>
          ))}
        </div>
      )}

      {/* 5. Articles List */}
      <div className="divide-y divide-purple-500/10">
        {isLoading ? (
          <NewsSkeletonLoader />
        ) : filteredNews.length === 0 ? (
          <div className="p-4">
            <IntelligentEmptyState
              title={`No Verified Telemetry in ${selectedCountryFilter !== 'all' ? selectedCountryFilter.toUpperCase() : 'Selected'} Scope`}
              description="Planetary intelligence aggregator is scanning sovereign feeds. Try selecting 'All' or clearing sector filters."
              onReset={() => {
                playUiSound('click');
                setSelectedCountryFilter('all');
                if (onSelectTopic) onSelectTopic('all');
              }}
              resetLabel="Reset Scope to All"
            />
          </div>
        ) : viewMode === 'stream' ? (
          filteredNews.map(renderNewsRow)
        ) : (
          groupedByCountry.map(group => (
            <div key={group.id} className="border-b border-purple-500/10 last:border-0">
              <div className="px-4 py-2.5 bg-slate-900/70 flex items-center gap-2 border-b border-purple-500/10">
                <span className="text-base">{group.flag}</span>
                <span className="font-display text-xs font-bold text-slate-200 capitalize">{group.name}</span>
                <span className="font-mono text-[10px] text-purple-300 px-2 py-0.5 rounded-full bg-purple-950/40 border border-purple-500/30">
                  {group.articles.length}
                </span>
              </div>
              <div className="divide-y divide-purple-500/10">
                {group.articles.map(renderNewsRow)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

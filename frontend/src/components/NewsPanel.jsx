import React, { useState, useMemo } from 'react';
import { ExternalLink, Volume2, Globe2, HelpCircle, Sparkles, VolumeX, LineChart, Coffee, Accessibility, Bot, Lightbulb, MapPin, ShieldAlert, CheckCircle2, GraduationCap, Wheat, Briefcase, Users } from 'lucide-react';
import { speakInLanguage, stopSpeaking, playEarcon } from '../services/voiceService';
import { fetchNewsExplanation, fetchPersonalizedOpinion } from '../services/newsService';

const TOPICS = ['all', 'Geopolitics', 'Defense', 'Economy', 'Cyber', 'Energy'];

const SENTIMENT_LABEL = {
  'Hostile / Risk': { cls: 'text-wire-red border-wire-red/40 bg-red-950/20', label: 'Risk / Critical' },
  'Tense':          { cls: 'text-wire-amber border-wire-amber/40 bg-amber-950/20', label: 'Tense / Watch' },
  'Positive / Stable': { cls: 'text-wire-green border-wire-green/40 bg-emerald-950/20', label: 'Stable' },
  'Constructive':   { cls: 'text-wire-green border-wire-green/40 bg-emerald-950/20', label: 'Constructive' },
  'Neutral':        { cls: 'text-wire-subtle border-wire-border bg-slate-900/30', label: 'Neutral' },
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

export default function NewsPanel({ 
  news = [], 
  isLoading = false, 
  selectedCountry,
  selectedLocation = null,
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
    const sentCfg = SENTIMENT_LABEL[item.sentiment] || SENTIMENT_LABEL['Neutral'];
    const isLocal = item.country_flag === '📍' || (item.country_name && item.country_name.includes('Local'));

    const pLower = (persona || '').toLowerCase();

    // ACCESSIBILITY MODE VIEW (Large buttons, high-contrast, speech-friendly)
    if (pLower.includes('accessibility') || isCognitiveSimple) {
      return (
        <div key={cardId} className={`p-4 border-b-2 border-wire-border bg-wire-surface ${isReading ? 'bg-amber-950/20 border-l-4 border-l-wire-amber' : ''}`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{item.country_flag || '🌐'}</span>
            <span className="font-mono text-sm font-bold text-wire-fg">{item.country_name || item.country}</span>
            {isLocal && (
              <span className="bg-wire-amber text-wire-base font-mono font-bold text-[11px] px-2 py-0.5 rounded-sm">
                LOCAL NEWS
              </span>
            )}
            <span className="font-mono text-xs text-wire-subtle ml-auto">{item.source}</span>
          </div>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-lg font-bold text-white hover:text-wire-amber transition-colors leading-snug mb-3"
          >
            {item.title}
          </a>

          {/* Explanation if loaded */}
          {explanation && (
            <div className="bg-wire-raised border-2 border-wire-amber p-3 my-2 text-white font-sans text-sm">
              <span className="font-mono text-xs text-wire-amber font-bold block mb-1">💡 எளிய விளக்கம் / PLAIN MEANING:</span>
              <p className="font-medium mb-1">{explanation.explanation}</p>
              <p className="text-amber-300 font-semibold">👉 {explanation.impact}</p>
            </div>
          )}

          {/* AI Opinion if loaded */}
          {opinion && (
            <div className="bg-wire-raised border-2 border-cyan-500 p-3 my-2 text-white font-sans text-sm">
              <span className="font-mono text-xs text-cyan-400 font-bold block mb-1">🤖 AI OPINION:</span>
              <p className="font-medium mb-1">{opinion.opinion}</p>
              <p className="text-cyan-300 font-semibold">👉 {opinion.keyTakeaway}</p>
            </div>
          )}

          {(() => {
            const desc = cleanDescription(item.description, item.title);
            if (!desc || explanation || opinion) return null;
            return <p className="text-sm text-slate-300 leading-relaxed mb-3">{desc}</p>;
          })()}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={(e) => handleSpeak(e, item, cardId)}
              className={`px-4 py-2 font-mono text-sm font-bold rounded-sm border transition-colors flex items-center gap-2 ${
                isReading ? 'bg-wire-red text-white border-wire-red' : 'bg-wire-base text-wire-fg border-wire-border hover:border-wire-amber'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isReading ? 'Stop Audio' : '🔊 Listen News'}</span>
            </button>

            <button
              onClick={(e) => handleExplain(e, item, cardId)}
              className="px-4 py-2 font-mono text-sm font-bold rounded-sm border bg-wire-base text-wire-amber border-wire-amber hover:bg-wire-amber hover:text-wire-base transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>💡 Explain News</span>
            </button>

            <button
              onClick={(e) => handleGetOpinion(e, item, cardId)}
              className="px-4 py-2 font-mono text-sm font-bold rounded-sm border bg-wire-base text-cyan-400 border-cyan-500 hover:bg-cyan-500 hover:text-wire-base transition-colors flex items-center gap-2"
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
          className={`px-4 py-3.5 border-b border-wire-border/50 hover:bg-wire-raised/60 transition-colors ${
            isReading ? 'bg-amber-950/20 border-l-2 border-l-wire-amber' : ''
          }`}
        >
          {/* Top Analyst Metric Strip */}
          <div className="flex items-center gap-2 mb-1.5 font-mono text-[10px]">
            <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1">
              <span>{item.country_flag || '🌐'}</span>
              <span className="font-semibold uppercase">{item.country_name || item.country}</span>
            </span>

            {isLocal && (
              <span className="px-1.5 py-0.5 bg-amber-950 text-wire-amber border border-amber-800 font-semibold">
                HYPER-LOCAL INTEL
              </span>
            )}

            <span className="text-wire-subtle">{item.source}</span>
            <span className="text-wire-border">·</span>
            <span className="text-wire-subtle tabular-nums">
              {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>

            <span className={`ml-auto border px-1.5 py-0.5 text-[9px] font-semibold ${sentCfg.cls}`}>
              {sentCfg.label}
            </span>

            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={(e) => handleSpeak(e, item, cardId)}
                className={`p-1 border text-[10px] flex items-center gap-1 transition-colors ${
                  isReading ? 'bg-wire-red text-white border-wire-red' : 'border-wire-border text-wire-subtle hover:text-white'
                }`}
                title="Listen to dispatch"
              >
                <Volume2 className="w-3 h-3" />
                <span className="hidden sm:inline">Audio</span>
              </button>
              <button
                onClick={(e) => handleGetOpinion(e, item, cardId)}
                className={`p-1 border text-[10px] flex items-center gap-1 transition-colors ${
                  opinion ? 'bg-cyan-950 text-cyan-400 border-cyan-800' : 'border-wire-border text-cyan-400 hover:bg-cyan-950/40'
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
            className="block font-serif text-sm font-semibold text-slate-100 hover:text-wire-amber transition-colors leading-snug"
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
          {opinion && (
            <div className="mt-2.5 bg-slate-950 border-l-2 border-l-cyan-500 border-y border-r border-slate-800 p-2.5 font-mono text-[11px] text-slate-300">
              <div className="flex items-center justify-between text-cyan-400 font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>STRATEGIC INTEL ASSESSMENT</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.2 bg-cyan-950/60 border border-cyan-800">
                  IMPACT: {opinion.impactLevel || 'ELEVATED'}
                </span>
              </div>
              <p className="text-slate-200 mb-1 font-sans text-xs leading-relaxed">{opinion.opinion}</p>
              <p className="text-cyan-300 font-sans text-[11px]">⚡ Key Takeaway: {opinion.keyTakeaway}</p>
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
          className={`px-4 py-3.5 border-b border-wire-border/40 hover:bg-sky-950/10 transition-colors ${
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

          {opinion && (
            <div className="bg-sky-950/30 border-l-2 border-l-sky-400 border-y border-r border-sky-800/40 p-2.5 my-2 text-xs font-sans">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-sky-400 font-bold mb-1">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{opinion.badge || '🎓 STUDENT PERSPECTIVE'}</span>
              </div>
              <p className="text-white mb-1 leading-relaxed">{opinion.opinion}</p>
              <p className="text-sky-300 font-medium text-[11px]">📚 {opinion.keyTakeaway}</p>
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
                isReading ? 'bg-sky-600 text-white border-sky-600' : 'bg-wire-base text-wire-fg border-wire-border hover:border-sky-400'
              }`}
            >
              <Volume2 className="w-3 h-3" />
              <span>{isReading ? 'Stop' : '🔊 Listen'}</span>
            </button>
            <button
              onClick={(e) => handleGetOpinion(e, item, cardId)}
              className={`px-2.5 py-1 text-xs font-mono border rounded-sm flex items-center gap-1 transition-colors ${
                opinion ? 'bg-sky-700 text-white border-sky-700' : 'bg-wire-base text-sky-400 border-sky-700/50 hover:border-sky-400'
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              <span>{opinion ? 'Student AI Active' : '🎓 Student View'}</span>
            </button>
            <button
              onClick={(e) => handleExplain(e, item, cardId)}
              className="px-2.5 py-1 text-xs font-mono border rounded-sm bg-wire-base text-slate-400 border-wire-border hover:text-white transition-colors flex items-center gap-1"
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
          className={`px-4 py-3.5 border-b border-wire-border/40 hover:bg-emerald-950/10 transition-colors ${
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

          {opinion && (
            <div className="bg-emerald-950/30 border-l-2 border-l-emerald-400 border-y border-r border-emerald-800/40 p-3 my-2 text-sm font-sans">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 font-bold mb-1">
                <Wheat className="w-3.5 h-3.5" />
                <span>{opinion.badge || '🌾 KISAN ADVISORY'}</span>
              </div>
              <p className="text-white mb-1.5 leading-relaxed">{opinion.opinion}</p>
              <p className="text-emerald-300 font-medium text-xs">🚜 {opinion.keyTakeaway}</p>
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
                isReading ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-wire-base text-wire-fg border-wire-border hover:border-emerald-400'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isReading ? 'Stop' : '🔊 Suno / Listen'}</span>
            </button>
            <button
              onClick={(e) => handleGetOpinion(e, item, cardId)}
              className={`px-3 py-1.5 text-sm font-mono border rounded-sm flex items-center gap-2 transition-colors ${
                opinion ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-wire-base text-emerald-400 border-emerald-700/50 hover:border-emerald-400'
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
          className={`px-4 py-3.5 border-b border-wire-border/50 hover:bg-purple-950/10 transition-colors ${
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
            <span className="text-wire-subtle">{item.source}</span>
            <span className={`ml-auto border px-1.5 py-0.5 text-[9px] font-semibold ${sentCfg.cls}`}>
              {sentCfg.label}
            </span>
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={(e) => handleSpeak(e, item, cardId)}
                className={`p-1 border text-[10px] flex items-center gap-1 transition-colors ${
                  isReading ? 'bg-purple-600 text-white border-purple-600' : 'border-wire-border text-wire-subtle hover:text-white'
                }`}
              >
                <Volume2 className="w-3 h-3" />
                <span className="hidden sm:inline">Audio</span>
              </button>
              <button
                onClick={(e) => handleGetOpinion(e, item, cardId)}
                className={`p-1 border text-[10px] flex items-center gap-1 transition-colors ${
                  opinion ? 'bg-purple-950 text-purple-400 border-purple-800' : 'border-wire-border text-purple-400 hover:bg-purple-950/40'
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

          {opinion && (
            <div className="mt-2.5 bg-slate-950 border-l-2 border-l-purple-400 border-y border-r border-slate-800 p-2.5 font-mono text-[11px] text-slate-300">
              <div className="flex items-center justify-between text-purple-400 font-semibold mb-1">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>BUSINESS IMPACT ASSESSMENT</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.2 bg-purple-950/60 border border-purple-800">
                  RISK: {opinion.impactLevel || 'ELEVATED'}
                </span>
              </div>
              <p className="text-slate-200 mb-1 font-sans text-xs leading-relaxed">{opinion.opinion}</p>
              <p className="text-purple-300 font-sans text-[11px]">💼 Key Takeaway: {opinion.keyTakeaway}</p>
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
          className={`px-4 py-3.5 border-b border-wire-border/40 hover:bg-amber-950/10 transition-colors ${
            isReading ? 'bg-amber-950/20 border-l-2 border-l-amber-400' : ''
          }`}
        >
          <div className="flex items-center gap-2 mb-1 text-xs text-wire-subtle font-mono">
            <span className="text-base">{item.country_flag || '🌐'}</span>
            <span>{item.country_name || item.country}</span>
            {isLocal && (
              <span className="px-1.5 py-0.2 bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold">
                YOUR AREA
              </span>
            )}
            <span>·</span>
            <span>{item.source}</span>
            <span className="ml-auto text-[10px] text-wire-muted">
              {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-serif text-base font-bold text-wire-fg hover:text-amber-300 transition-colors leading-snug mb-1"
          >
            {item.title}
          </a>

          {(() => {
            const desc = cleanDescription(item.description, item.title);
            if (!desc) return null;
            return <p className="text-sm text-slate-300 font-sans leading-relaxed line-clamp-2 mb-2">{desc}</p>;
          })()}

          {opinion && (
            <div className="bg-wire-base border-l-2 border-l-amber-400 border-y border-r border-amber-800/30 p-3 my-2 text-sm font-sans">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-400 font-bold mb-1">
                <Users className="w-3.5 h-3.5" />
                <span>{opinion.badge || '👥 EVERYDAY PERSPECTIVE'}</span>
              </div>
              <p className="text-white mb-1.5 leading-relaxed">{opinion.opinion}</p>
              <p className="text-amber-300 font-medium text-xs">👉 {opinion.keyTakeaway}</p>
            </div>
          )}

          {explanation && !opinion && (
            <div className="bg-wire-base border-l-2 border-l-amber-400 p-2.5 my-2 text-sm font-sans">
              <span className="font-mono text-[10px] text-amber-300 block mb-1 font-bold">💡 PLAIN MEANING:</span>
              <p className="text-white mb-1">{explanation.explanation}</p>
              <p className="text-slate-400 text-xs">👉 {explanation.impact}</p>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={(e) => handleSpeak(e, item, cardId)}
              className={`px-3 py-1.5 text-sm font-mono border rounded-sm flex items-center gap-2 transition-colors ${
                isReading ? 'bg-amber-600 text-black border-amber-600' : 'bg-wire-base text-wire-fg border-wire-border hover:border-amber-400'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isReading ? 'Stop' : '🔊 Listen'}</span>
            </button>
            <button
              onClick={(e) => handleGetOpinion(e, item, cardId)}
              className={`px-3 py-1.5 text-sm font-mono border rounded-sm flex items-center gap-2 transition-colors ${
                opinion ? 'bg-amber-600 text-black border-amber-600 font-bold' : 'bg-wire-base text-amber-400 border-amber-700/50 hover:border-amber-400'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{opinion ? 'Opinion Active' : '👥 My Opinion'}</span>
            </button>
            <button
              onClick={(e) => handleExplain(e, item, cardId)}
              className="px-3 py-1.5 text-sm font-mono border rounded-sm bg-wire-base text-slate-400 border-wire-border hover:text-white transition-colors flex items-center gap-2"
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
        className={`px-4 py-3.5 border-b border-wire-border/40 hover:bg-wire-raised/50 transition-colors ${
          isReading ? 'bg-amber-950/20 border-l-2 border-l-wire-amber' : ''
        }`}
      >
        <div className="flex items-center gap-2 mb-1 text-xs text-wire-subtle font-mono">
          <span>{item.country_flag || '🌐'} {item.country_name || item.country}</span>
          {isLocal && (
            <span className="px-1.5 py-0.2 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
              NEIGHBORHOOD NEWS
            </span>
          )}
          <span>·</span>
          <span>{item.source}</span>
          <span className="ml-auto text-[10px] text-wire-muted">
            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block font-serif text-sm sm:text-base font-semibold text-wire-fg hover:text-wire-amber transition-colors leading-snug mb-1"
        >
          {item.title}
        </a>

        {(() => {
          const desc = cleanDescription(item.description, item.title);
          if (!desc) return null;
          return (
            <p className="text-xs text-wire-subtle font-sans leading-relaxed line-clamp-2 mb-2">
              {desc}
            </p>
          );
        })()}

        {/* Personalized AI Citizen Opinion */}
        {opinion && (
          <div className="bg-wire-base border-l-2 border-l-wire-amber border-y border-r border-wire-border p-3 my-2 text-xs text-wire-fg font-sans">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-wire-amber font-bold mb-1">
              <Lightbulb className="w-3.5 h-3.5 text-wire-amber" />
              <span>{opinion.badge || 'CITIZEN AI PERSPECTIVE'}</span>
            </div>
            <p className="text-white mb-1.5 leading-relaxed">{opinion.opinion}</p>
            <p className="text-wire-subtle font-medium text-[11px]">👉 {opinion.keyTakeaway}</p>
          </div>
        )}

        {explanation && !opinion && (
          <div className="bg-wire-base border-l-2 border-l-wire-amber border-y border-r border-wire-border p-2.5 my-2 text-xs text-wire-fg font-sans">
            <span className="font-mono text-[10px] text-wire-amber block mb-1 font-bold">💡 PLAIN EXPLANATION:</span>
            <p className="text-white mb-1">{explanation.explanation}</p>
            <p className="text-wire-subtle text-[11px]">👉 {explanation.impact}</p>
          </div>
        )}

        {/* Action Row */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={(e) => handleSpeak(e, item, cardId)}
            className={`px-2.5 py-1 text-xs font-mono border rounded-sm flex items-center gap-1 transition-colors ${
              isReading ? 'bg-wire-red text-white border-wire-red' : 'bg-wire-base text-wire-fg border-wire-border hover:border-wire-amber'
            }`}
          >
            <Volume2 className="w-3 h-3" />
            <span>{isReading ? 'Stop' : '🔊 Listen'}</span>
          </button>

          <button
            onClick={(e) => handleGetOpinion(e, item, cardId)}
            className={`px-2.5 py-1 text-xs font-mono border rounded-sm flex items-center gap-1 transition-colors ${
              opinion ? 'bg-wire-amber text-wire-base font-semibold border-wire-amber' : 'bg-wire-base text-wire-subtle border-wire-border hover:text-wire-amber hover:border-wire-amber'
            }`}
          >
            <Bot className="w-3 h-3 text-wire-amber" />
            <span>{opinion ? 'AI Opinion Active' : '🤖 AI Opinion'}</span>
          </button>

          <button
            onClick={(e) => handleExplain(e, item, cardId)}
            className="px-2.5 py-1 text-xs font-mono border rounded-sm bg-wire-base text-wire-subtle border-wire-border hover:text-white transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-wire-amber" />
            <span>💡 Explain</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-wire-surface border border-wire-border flex flex-col shadow-xl">
      
      {/* 1. Prominent Active Persona Status & 1-Click Persona Tabs */}
      <div className="bg-wire-base border-b border-wire-border px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[10px] text-wire-subtle uppercase tracking-wider">Active Persona:</span>
          <span className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-sm border flex items-center gap-1.5 ${
            pLower.includes('analyst')
              ? 'bg-amber-950/40 text-wire-amber border-wire-amber'
              : pLower.includes('accessibility')
              ? 'bg-emerald-950/40 text-wire-green border-wire-green'
              : pLower.includes('student')
              ? 'bg-sky-950/40 text-sky-400 border-sky-500'
              : pLower.includes('farmer') || pLower.includes('kisan')
              ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500'
              : pLower.includes('business')
              ? 'bg-purple-950/40 text-purple-400 border-purple-500'
              : 'bg-amber-950/40 text-amber-400 border-amber-500'
          }`}>
            {pLower.includes('analyst') && <LineChart className="w-3.5 h-3.5" />}
            {pLower.includes('student') && <GraduationCap className="w-3.5 h-3.5" />}
            {pLower.includes('farmer') && <Wheat className="w-3.5 h-3.5" />}
            {pLower.includes('business') && <Briefcase className="w-3.5 h-3.5" />}
            {(pLower.includes('common') || pLower.includes('casual')) && <Users className="w-3.5 h-3.5" />}
            {pLower.includes('accessibility') && <Accessibility className="w-3.5 h-3.5" />}
            {persona}
          </span>
          <span className="hidden md:inline font-sans text-xs text-wire-subtle">
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
          <div className="flex items-center gap-0.5 bg-wire-surface p-1 border border-wire-border flex-wrap">
            {[
              { id: 'Analyst', icon: <LineChart className="w-3 h-3" />, label: 'Analyst', activeClass: 'bg-wire-amber text-wire-base' },
              { id: 'Common person', icon: <Users className="w-3 h-3" />, label: 'Common', activeClass: 'bg-amber-600 text-white' },
              { id: 'Student', icon: <GraduationCap className="w-3 h-3" />, label: 'Student', activeClass: 'bg-sky-600 text-white' },
              { id: 'Farmer', icon: <Wheat className="w-3 h-3" />, label: 'Farmer', activeClass: 'bg-emerald-600 text-white' },
              { id: 'Business', icon: <Briefcase className="w-3 h-3" />, label: 'Business', activeClass: 'bg-purple-600 text-white' },
              { id: 'Accessibility mode', icon: <Accessibility className="w-3 h-3" />, label: 'Access.', activeClass: 'bg-green-600 text-white' },
            ].map((p) => {
              const isActive = persona === p.id || (persona || '').toLowerCase() === p.id.toLowerCase();
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPersona(p.id)}
                  className={`px-2 py-1 text-xs font-mono border transition-all flex items-center gap-1 ${
                    isActive
                      ? `${p.activeClass} border-transparent font-bold shadow-sm`
                      : 'text-wire-subtle border-transparent hover:text-white'
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

      {/* 2. Sub-Header: Feed Stats & Controls */}
      <div className="px-4 py-3 border-b border-wire-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-wire-surface">
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-wire-fg text-sm font-semibold flex items-center gap-2">
            News Feed
            {selectedLocation && (
              <span className="font-mono text-xs text-wire-amber font-normal">
                (Focused on: <span className="font-bold uppercase">{selectedLocation}</span>)
              </span>
            )}
          </h2>
          <span className="font-mono text-[10px] text-wire-subtle">{filteredNews.length} dispatches</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px]">
          {/* View toggle */}
          <div className="flex items-center border border-wire-border">
            <button
              onClick={() => setViewMode('stream')}
              className={`px-2.5 py-1 transition-colors ${
                viewMode === 'stream' ? 'bg-wire-raised text-wire-fg' : 'text-wire-subtle hover:text-wire-fg'
              }`}
            >Stream</button>
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-2.5 py-1 transition-colors border-l border-wire-border ${
                viewMode === 'grouped' ? 'bg-wire-raised text-wire-fg' : 'text-wire-subtle hover:text-wire-fg'
              }`}
            >Grouped</button>
          </div>
          
          <span className={`tabular-nums ${countdown <= 5 ? 'text-wire-amber' : 'text-wire-subtle'}`}>
            Sync in {countdown}s
          </span>
        </div>
      </div>

      {/* 3. Topic filter strip */}
      <div className="px-4 py-2 border-b border-wire-border/60 flex flex-wrap gap-1.5 bg-wire-base/50">
        {TOPICS.map(t => (
          <button
            key={t}
            onClick={() => onSelectTopic(t)}
            className={`font-mono text-[10px] px-2.5 py-1 transition-colors border ${
              activeTopic === t
                ? 'bg-wire-amber text-wire-base border-wire-amber font-medium'
                : 'text-wire-subtle border-wire-border hover:text-wire-fg hover:border-wire-muted'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 4. Country / Region Filter */}
      {availableCountries.length > 1 && (
        <div className="px-4 py-2 border-b border-wire-border/40 flex flex-wrap gap-1.5 bg-wire-base/30">
          <button
            onClick={() => setSelectedCountryFilter('all')}
            className={`font-mono text-[10px] px-2.5 py-1 border transition-colors ${
              selectedCountryFilter === 'all'
                ? 'text-wire-fg border-wire-muted bg-wire-raised'
                : 'text-wire-subtle border-wire-border hover:text-wire-fg'
            }`}
          >
            All Sectors ({news.length})
          </button>
          {availableCountries.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCountryFilter(c.id)}
              className={`font-mono text-[10px] px-2.5 py-1 border transition-colors flex items-center gap-1 ${
                selectedCountryFilter === c.id
                  ? 'text-wire-fg border-wire-muted bg-wire-raised font-medium'
                  : 'text-wire-subtle border-wire-border hover:text-wire-fg'
              }`}
            >
              <span>{c.flag}</span>
              <span className="capitalize">{c.name}</span>
              <span className="text-wire-subtle text-[9px]">({c.count})</span>
            </button>
          ))}
        </div>
      )}

      {/* 5. Articles List */}
      <div className="divide-y divide-wire-border/40">
        {isLoading ? (
          <div className="p-8 text-center font-mono text-xs text-wire-subtle">
            <span className="animate-pulse">Loading live verified telemetry stream...</span>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="p-8 text-center font-mono text-xs text-wire-subtle">
            No dispatches for this filter. Try selecting 'All' or a different sector.
          </div>
        ) : viewMode === 'stream' ? (
          filteredNews.map(renderNewsRow)
        ) : (
          groupedByCountry.map(group => (
            <div key={group.id} className="border-b border-wire-border last:border-0">
              <div className="px-4 py-2 bg-wire-base flex items-center gap-2 border-b border-wire-border/30">
                <span>{group.flag}</span>
                <span className="font-serif text-xs font-semibold text-wire-fg capitalize">{group.name}</span>
                <span className="font-mono text-[10px] text-wire-subtle">({group.articles.length})</span>
              </div>
              <div className="divide-y divide-wire-border/30">
                {group.articles.map(renderNewsRow)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

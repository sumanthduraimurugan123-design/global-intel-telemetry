import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Radio, RefreshCw, AlertCircle, Globe2, Filter,
  ExternalLink, Clock, MapPin, X,
  Zap, TrendingUp, Cloud, Shield, Cpu, Truck, ArrowLeft
} from 'lucide-react';
import WorldGlobe3D from '../components/WorldGlobe3D';
import { fetchNewsStream } from '../services/newsService';
import { playUiSound } from '../services/soundSystem';

const EVENT_CATEGORIES = {
  all:        { label: 'All Events',    color: '#94a3b8', icon: Globe2 },
  economy:    { label: 'Economy',       color: '#22d3ee', icon: TrendingUp },
  climate:    { label: 'Weather/Env',   color: '#34d399', icon: Cloud },
  risk:       { label: 'Crisis/Risk',   color: '#f87171', icon: AlertCircle },
  defense:    { label: 'Defense',       color: '#a78bfa', icon: Shield },
  cyber:      { label: 'Cyber/Tech',    color: '#60a5fa', icon: Cpu },
  supply:     { label: 'Supply Chain',  color: '#fb923c', icon: Truck },
  geopolitics:{ label: 'Geopolitics',   color: '#fbbf24', icon: Zap },
};

function mapCategoryToExplorer(cat) {
  const MAP = {
    economy: 'finance', climate: 'leisure', risk: 'healthcare',
    defense: 'government', cyber: 'education', supply: 'transport', geopolitics: 'shopping',
  };
  return MAP[cat] || 'government';
}

function newsToPlaces(articles) {
  return articles
    .filter(a => a.geo && a.geo.lat && a.geo.lng)
    .map((a, i) => ({
      id: String(i) + '-' + (a.url || ''),
      name: a.title,
      lat: a.geo.lat,
      lng: a.geo.lng,
      category: mapCategoryToExplorer(a.category),
      categoryLabel: (EVENT_CATEGORIES[a.category] || EVENT_CATEGORIES.geopolitics).label,
      address: a.country_name || a.region || '',
      _raw: a,
    }));
}

function timeAgo(iso) {
  if (!iso) return '';
  const m = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  return Math.floor(h / 24) + 'd ago';
}

export default function EventRadar({ onNavigateBack, onNavigatePage }) {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [focusedCoords, setFocusedCoords] = useState(null);

  const fetchEvents = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true);
    setError(null);
    try {
      const [globalRes, indiaRes, usRes] = await Promise.allSettled([
        fetchNewsStream('global', 'all', true),
        fetchNewsStream('india', 'all', false),
        fetchNewsStream('us', 'all', false),
      ]);
      const allArticles = [];
      for (const res of [globalRes, indiaRes, usRes]) {
        if (res.status === 'fulfilled' && Array.isArray(res.value && res.value.news)) {
          allArticles.push(...res.value.news);
        }
      }
      const seen = new Set();
      const unique = allArticles.filter(a => {
        if (!a.url || seen.has(a.url)) return false;
        seen.add(a.url);
        return true;
      }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setEvents(unique);
      setLastUpdated(new Date().toISOString());
      if (unique.length === 0) setError('No live events loaded. Feeds may be temporarily rate-limited. Try refreshing.');
    } catch (err) {
      setError('Failed to load events: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(true); const t = setInterval(() => fetchEvents(false), 90000); return () => clearInterval(t); }, [fetchEvents]);

  useEffect(() => {
    setFiltered(activeCategory === 'all' ? events : events.filter(e => e.category === activeCategory));
    setSelectedEvent(null);
  }, [activeCategory, events]);

  const handleEventSelect = (event) => {
    playUiSound('click');
    setSelectedEvent(event);
    if (event.geo && event.geo.lat) setFocusedCoords({ lat: event.geo.lat, lng: event.geo.lng });
  };

  const globePlaces = newsToPlaces(filtered);
  const selectedGlobePlace = selectedEvent ? globePlaces.find(p => p._raw && p._raw.url === selectedEvent.url) || null : null;

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => { playUiSound('click'); onNavigateBack && onNavigateBack(); }} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
              <h1 className="text-sm font-bold text-white tracking-wide">LIVE GLOBAL EVENT RADAR</h1>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 font-mono font-bold border border-red-500/30">LIVE</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Real events from BBC · NYT · Guardian · Al Jazeera · {filtered.length} loaded</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && <span className="hidden sm:block text-[10px] text-slate-500 font-mono">Updated {timeAgo(lastUpdated)}</span>}
          <button onClick={() => { playUiSound('click'); fetchEvents(true); }} disabled={isLoading} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors disabled:opacity-50">
            <RefreshCw className={'w-3.5 h-3.5 ' + (isLoading ? 'animate-spin' : '')} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </header>

      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-800/60 overflow-x-auto bg-slate-900/40">
        <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-1" />
        {Object.entries(EVENT_CATEGORIES).map(([key, cat]) => {
          const Icon = cat.icon;
          const count = key === 'all' ? events.length : events.filter(e => e.category === key).length;
          const isActive = activeCategory === key;
          return (
            <button key={key} onClick={() => { playUiSound('click'); setActiveCategory(key); }}
              className={'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all border shrink-0 ' + (isActive ? 'text-white' : 'border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600 bg-slate-900/50')}
              style={isActive ? { backgroundColor: cat.color + '25', borderColor: cat.color, color: cat.color } : {}}>
              <Icon className="w-3 h-3" />
              {cat.label}
              {count > 0 && <span className="text-[10px] px-1 py-0.5 rounded font-mono" style={{ background: cat.color + '20', color: cat.color }}>{count}</span>}
            </button>
          );
        })}
      </div>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        <aside className="w-full lg:w-[370px] lg:max-w-[370px] flex flex-col border-r border-slate-800 bg-slate-900/30 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-9 h-9 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
                <p className="text-sm text-slate-400 animate-pulse">Scanning global feeds…</p>
              </div>
            )}
            {!isLoading && error && (
              <div className="m-4 p-4 rounded-xl bg-red-950/30 border border-red-800/50">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-300">Feed Error</p>
                    <p className="text-xs text-red-400/80 mt-1">{error}</p>
                    <p className="text-xs text-slate-500 mt-2">No API key required. Reads free RSS feeds. May be a temporary rate-limit.</p>
                  </div>
                </div>
              </div>
            )}
            {!isLoading && !error && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 gap-3 px-6">
                <Globe2 className="w-9 h-9 text-slate-600" />
                <p className="text-sm text-slate-400 text-center">No events for this filter</p>
                <button onClick={() => setActiveCategory('all')} className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700">Show all</button>
              </div>
            )}
            {!isLoading && filtered.map((event, i) => {
              const cat = EVENT_CATEGORIES[event.category] || EVENT_CATEGORIES.geopolitics;
              const Icon = cat.icon;
              const isSelected = selectedEvent && selectedEvent.url === event.url;
              return (
                <div key={String(i) + event.url} onClick={() => handleEventSelect(event)}
                  className={'px-4 py-3 border-b border-slate-800/50 cursor-pointer transition-all border-l-2 ' + (isSelected ? 'bg-cyan-950/30 border-l-cyan-400' : 'hover:bg-slate-800/30 border-l-transparent')}>
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: cat.color + '20', border: '1px solid ' + cat.color + '40' }}>
                      <Icon className="w-3.5 h-3.5" style={{ color: cat.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-white leading-snug line-clamp-2">{event.title}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] font-mono" style={{ color: cat.color }}>{cat.label}</span>
                        {event.country_flag && <span className="text-xs">{event.country_flag}</span>}
                        <span className="text-[10px] text-slate-500">{event.source}</span>
                        <span className="text-[10px] text-slate-600">·</span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{timeAgo(event.created_at)}</span>
                        {event.geo && event.geo.lat && <span className="text-[10px] text-cyan-500 flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />Mapped</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-3 py-2 border-t border-slate-800 bg-slate-900/80">
            <p className="text-[10px] text-slate-500 leading-relaxed">⚡ Free RSS: BBC · NYT · Guardian · Al Jazeera. Optional: add GNEWS_API_KEY or NEWS_API_KEY in backend .env for richer data.</p>
          </div>
        </aside>

        <section className="flex-1 flex flex-col min-h-[460px] relative">
          <div className="flex-1 min-h-[380px]">
            <WorldGlobe3D places={globePlaces} selectedPlace={selectedGlobePlace}
              onSelectPlace={(p) => { if (p && p._raw) handleEventSelect(p._raw); }}
              focusedCoordinates={focusedCoords} activeCategory="all"
              zoomLevel={selectedEvent ? 5 : 2} className="w-full h-full min-h-[380px]" />
            {filtered.length > 0 && (
              <div className="absolute bottom-4 left-4 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/60 text-[10px] text-slate-400 font-mono pointer-events-none">
                {globePlaces.length} / {filtered.length} events are geo-mapped
              </div>
            )}
          </div>

          {selectedEvent && (
            <div className="bg-slate-900/95 border-t border-cyan-500/30 p-4 max-h-[260px] overflow-y-auto">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {(() => {
                      const cat = EVENT_CATEGORIES[selectedEvent.category] || EVENT_CATEGORIES.geopolitics;
                      const Icon = cat.icon;
                      return <span className="flex items-center gap-1 text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded" style={{ color: cat.color, background: cat.color + '20' }}><Icon className="w-3 h-3" />{cat.label}</span>;
                    })()}
                    {selectedEvent.country_flag && <span className="text-sm">{selectedEvent.country_flag}</span>}
                    <span className="text-[10px] text-slate-400">{selectedEvent.source}</span>
                    <span className="text-[10px] text-slate-500">{timeAgo(selectedEvent.created_at)}</span>
                  </div>
                  <h2 className="text-sm font-bold text-white leading-snug">{selectedEvent.title}</h2>
                </div>
                <button onClick={() => { setSelectedEvent(null); setFocusedCoords(null); }} className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {selectedEvent.description && <p className="text-[12px] text-slate-300 leading-relaxed mb-3">{selectedEvent.description}</p>}
              <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                {selectedEvent.geo && selectedEvent.geo.lat && (
                  <div className="bg-slate-800/60 rounded-lg p-2">
                    <span className="text-slate-500 block font-mono uppercase text-[9px] mb-0.5">Location</span>
                    <span className="text-slate-200 font-semibold">{selectedEvent.country_name || selectedEvent.region || 'Global'}</span>
                  </div>
                )}
                {selectedEvent.sentiment && (
                  <div className="bg-slate-800/60 rounded-lg p-2">
                    <span className="text-slate-500 block font-mono uppercase text-[9px] mb-0.5">Signal</span>
                    <span className="text-slate-200 font-semibold">{selectedEvent.sentiment}</span>
                  </div>
                )}
              </div>
              {['risk','defense','supply','economy'].includes(selectedEvent.category) && (
                <div className="mb-3 px-3 py-2 rounded-lg bg-amber-950/30 border border-amber-700/30 text-[11px] text-amber-300">
                  <strong>India relevance note:</strong> {selectedEvent.category} events may affect Indian markets, supply chains, or geopolitical posture. Verify with primary sources.
                </div>
              )}
              <a href={selectedEvent.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors">
                Read Full Article <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

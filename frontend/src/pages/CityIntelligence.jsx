import React, { useState, useEffect, useCallback } from 'react';
import {
  Building2, Search, RefreshCw, AlertCircle, Globe2, MapPin,
  GraduationCap, HeartPulse, Bus, ShoppingBag, Landmark, Trees, CreditCard,
  Newspaper, ExternalLink, Clock, X, ChevronDown, ArrowLeft, Info
} from 'lucide-react';
import WorldGlobe3D from '../components/WorldGlobe3D';
import OsmStreetViewer from '../components/OsmStreetViewer';
import { fetchPlaceSearch, geocodeLocationQuery, CATEGORY_DEFINITIONS } from '../services/explorerService';
import { fetchNewsStream } from '../services/newsService';
import { playUiSound } from '../services/soundSystem';

const CAT_ICONS = {
  education: GraduationCap, healthcare: HeartPulse, transport: Bus,
  shopping: ShoppingBag, government: Landmark, leisure: Trees, finance: CreditCard,
};

// Popular world cities with coords for quick-select
const QUICK_CITIES = [
  { label: '🇮🇳 Chennai', q: 'Chennai, India', lat: 13.0827, lng: 80.2707 },
  { label: '🇮🇳 Mumbai', q: 'Mumbai, India', lat: 19.0760, lng: 72.8777 },
  { label: '🇮🇳 Delhi', q: 'New Delhi, India', lat: 28.6139, lng: 77.2090 },
  { label: '🇺🇸 New York', q: 'New York, USA', lat: 40.7128, lng: -74.0060 },
  { label: '🇬🇧 London', q: 'London, UK', lat: 51.5074, lng: -0.1278 },
  { label: '🇯🇵 Tokyo', q: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 },
  { label: '🇦🇺 Sydney', q: 'Sydney, Australia', lat: -33.8688, lng: 151.2093 },
  { label: '🇸🇬 Singapore', q: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { label: '🇩🇪 Berlin', q: 'Berlin, Germany', lat: 52.5200, lng: 13.4050 },
  { label: '🇫🇷 Paris', q: 'Paris, France', lat: 48.8566, lng: 2.3522 },
  { label: '🇦🇪 Dubai', q: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
  { label: '🇧🇷 São Paulo', q: 'São Paulo, Brazil', lat: -23.5505, lng: -46.6333 },
];

function timeAgo(iso) {
  if (!iso) return '';
  const m = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  return Math.floor(h / 24) + 'd ago';
}

export default function CityIntelligence({ onNavigateBack, onNavigatePage }) {
  const [cityQuery, setCityQuery] = useState('Chennai, India');
  const [inputVal, setInputVal] = useState('Chennai, India');
  const [centerCoords, setCenterCoords] = useState({ lat: 13.0827, lng: 80.2707, label: 'Chennai, India' });
  const [activeCategory, setActiveCategory] = useState('healthcare');
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [cityNews, setCityNews] = useState([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [placesError, setPlacesError] = useState(null);
  const [viewMode, setViewMode] = useState('globe');

  const fetchCityData = useCallback(async (query, coords) => {
    setIsLoadingPlaces(true);
    setPlacesError(null);
    setSelectedPlace(null);
    try {
      const result = await fetchPlaceSearch({
        q: CATEGORY_DEFINITIONS[activeCategory].label + ' in ' + query,
        category: activeCategory,
        lat: coords.lat,
        lng: coords.lng,
        radius: 5000,
        limit: 40,
      });
      setPlaces(Array.isArray(result.results) ? result.results : []);
      if (result.center) {
        setCenterCoords({ lat: result.center.lat, lng: result.center.lng, label: query });
      }
    } catch (err) {
      setPlacesError('Could not load places: ' + err.message);
    } finally {
      setIsLoadingPlaces(false);
    }
  }, [activeCategory]);

  const fetchCityNews = useCallback(async (query) => {
    setIsLoadingNews(true);
    try {
      const country = query.split(',').pop().trim().toLowerCase() || 'global';
      const result = await fetchNewsStream(country, 'all', false, query);
      setCityNews(Array.isArray(result && result.news) ? result.news.slice(0, 12) : []);
    } catch (err) {
      setCityNews([]);
    } finally {
      setIsLoadingNews(false);
    }
  }, []);

  const handleCitySearch = useCallback(async (q, lat, lng) => {
    playUiSound('search');
    let coords = lat != null ? { lat, lng } : null;
    if (!coords) {
      try {
        const geo = await geocodeLocationQuery(q);
        if (geo) coords = { lat: geo.lat, lng: geo.lng };
      } catch (_) {}
    }
    if (!coords) {
      setPlacesError('Could not find location: ' + q + '. Try a more specific city name.');
      return;
    }
    setCityQuery(q);
    setCenterCoords({ ...coords, label: q });
    fetchCityData(q, coords);
    fetchCityNews(q);
  }, [fetchCityData, fetchCityNews]);

  // Initial load
  useEffect(() => {
    fetchCityData('Chennai, India', { lat: 13.0827, lng: 80.2707 });
    fetchCityNews('Chennai, India');
  }, []);

  // Refetch places when category changes
  useEffect(() => {
    if (centerCoords && centerCoords.lat) {
      fetchCityData(cityQuery, centerCoords);
    }
  }, [activeCategory]);

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={() => { playUiSound('click'); onNavigateBack && onNavigateBack(); }} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <h1 className="text-sm font-bold text-white tracking-wide">CITY INTELLIGENCE TWIN</h1>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold border border-cyan-500/30">OSM</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">Real infrastructure data via OpenStreetMap · {places.length} places loaded</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex gap-1 bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            {['globe','map','split'].map(mode => (
              <button key={mode} onClick={() => { playUiSound('click'); setViewMode(mode); }}
                className={'px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ' + (viewMode === mode ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white')}>
                {mode === 'globe' ? '3D' : mode === 'map' ? 'Map' : 'Split'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Quick City Selector */}
      <div className="px-4 py-2 border-b border-slate-800/60 bg-slate-900/40 overflow-x-auto">
        <div className="flex items-center gap-2">
          {/* Search input */}
          <form className="flex items-center gap-1.5 flex-1 min-w-[200px] max-w-[320px]"
            onSubmit={e => { e.preventDefault(); handleCitySearch(inputVal, null, null); }}>
            <div className="flex items-center flex-1 gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-colors focus-within:border-cyan-500">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input value={inputVal} onChange={e => setInputVal(e.target.value)} placeholder="Search any city worldwide…"
                className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 outline-none min-w-0" />
            </div>
            <button type="submit" className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors whitespace-nowrap">Go</button>
          </form>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {QUICK_CITIES.map(city => (
              <button key={city.q} onClick={() => { setInputVal(city.q); handleCitySearch(city.q, city.lat, city.lng); }}
                className={'px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all border shrink-0 ' + (cityQuery === city.q ? 'bg-cyan-600/20 border-cyan-500/40 text-cyan-200' : 'border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600 bg-slate-900/50')}>
                {city.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-800/60 bg-slate-950/60 overflow-x-auto">
        {Object.entries(CATEGORY_DEFINITIONS).map(([key, cat]) => {
          const Icon = CAT_ICONS[key] || Building2;
          return (
            <button key={key} onClick={() => { playUiSound('click'); setActiveCategory(key); }}
              className={'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all border shrink-0 ' + (activeCategory === key ? 'text-white' : 'border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600 bg-slate-900/50')}
              style={activeCategory === key ? { backgroundColor: cat.color + '25', borderColor: cat.color, color: cat.color } : {}}>
              <Icon className="w-3 h-3" />
              {cat.label.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Left: Place List + City News */}
        <aside className="w-full lg:w-[360px] lg:max-w-[360px] flex flex-col border-r border-slate-800 bg-slate-900/30 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {/* Places section */}
            <div className="px-4 py-2 border-b border-slate-800/50">
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />
                Real Places — {CATEGORY_DEFINITIONS[activeCategory]?.label}
              </h2>
            </div>

            {isLoadingPlaces && (
              <div className="flex items-center justify-center py-8 gap-2">
                <div className="w-7 h-7 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
                <p className="text-xs text-slate-400">Loading OpenStreetMap data…</p>
              </div>
            )}
            {!isLoadingPlaces && placesError && (
              <div className="m-3 p-3 rounded-xl bg-red-950/30 border border-red-800/50 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">{placesError}</p>
              </div>
            )}
            {!isLoadingPlaces && !placesError && places.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 gap-2 px-4">
                <Info className="w-7 h-7 text-slate-600" />
                <p className="text-xs text-slate-400 text-center">No {CATEGORY_DEFINITIONS[activeCategory]?.label} found in {cityQuery}. Try a different city or category.</p>
              </div>
            )}
            {!isLoadingPlaces && places.map((place) => {
              const catDef = CATEGORY_DEFINITIONS[place.category] || CATEGORY_DEFINITIONS.education;
              const Icon = CAT_ICONS[place.category] || Building2;
              const isSelected = selectedPlace && selectedPlace.id === place.id;
              return (
                <div key={place.id} onClick={() => { playUiSound('click'); setSelectedPlace(place); }}
                  className={'px-4 py-2.5 border-b border-slate-800/40 cursor-pointer transition-all border-l-2 ' + (isSelected ? 'bg-cyan-950/20 border-l-cyan-400' : 'hover:bg-slate-800/20 border-l-transparent')}>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: catDef.color + '20', border: '1px solid ' + catDef.color + '40' }}>
                      <Icon className="w-3 h-3" style={{ color: catDef.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-white line-clamp-1">{place.name}</p>
                      {place.address && <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{place.address}</p>}
                      <div className="flex items-center gap-2 mt-0.5">
                        {place.distanceFormatted && <span className="text-[10px] font-mono text-cyan-400">{place.distanceFormatted}</span>}
                        <span className="text-[10px] text-slate-600 font-mono">{place.lat && place.lat.toFixed(4)}°, {place.lng && place.lng.toFixed(4)}°</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Local News section */}
            <div className="px-4 py-2 border-b border-slate-800/50 border-t border-slate-700/50 mt-2">
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Newspaper className="w-3 h-3" />
                Local Events &amp; News
              </h2>
            </div>
            {isLoadingNews && <div className="px-4 py-4 text-xs text-slate-500">Loading local news…</div>}
            {!isLoadingNews && cityNews.length === 0 && (
              <div className="px-4 py-4 text-xs text-slate-500">No specific local news found for {cityQuery}.</div>
            )}
            {!isLoadingNews && cityNews.map((article, i) => (
              <div key={String(i) + article.url} className="px-4 py-2.5 border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                <p className="text-[11px] font-semibold text-slate-200 line-clamp-2 leading-snug">{article.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-500">{article.source}</span>
                  <span className="text-[10px] text-slate-600">·</span>
                  <span className="text-[10px] text-slate-500 flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" />{timeAgo(article.created_at)}</span>
                </div>
                {article.url && (
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 mt-1">
                    Read article <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            ))}

            {/* Data notice */}
            <div className="px-3 py-3 text-[10px] text-slate-600 leading-relaxed border-t border-slate-800">
              <strong className="text-slate-500">Data transparency:</strong> Infrastructure data is sourced from real OpenStreetMap contributors. Coverage varies by city. News from RSS feeds. No data is fabricated or simulated.
            </div>
          </div>
        </aside>

        {/* Right: Globe / Map / Split */}
        <section className="flex-1 flex flex-col min-h-[460px]">
          {/* Selected place info bar */}
          {selectedPlace && (
            <div className="flex items-center justify-between px-4 py-2 bg-cyan-950/30 border-b border-cyan-500/30">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs font-bold text-white">{selectedPlace.name}</span>
                {selectedPlace.distanceFormatted && <span className="text-[10px] font-mono text-cyan-300">{selectedPlace.distanceFormatted}</span>}
              </div>
              <div className="flex items-center gap-2">
                <a href={'https://www.openstreetmap.org/?mlat=' + selectedPlace.lat + '&mlon=' + selectedPlace.lng + '#map=17/' + selectedPlace.lat + '/' + selectedPlace.lng}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300">
                  OSM <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <button onClick={() => setSelectedPlace(null)} className="p-0.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          <div className={'flex-1 ' + (viewMode === 'split' ? 'grid grid-cols-1 md:grid-cols-2 gap-0' : '')}>
            {(viewMode === 'globe' || viewMode === 'split') && (
              <WorldGlobe3D places={places} selectedPlace={selectedPlace}
                onSelectPlace={(p) => { playUiSound('click'); setSelectedPlace(p); }}
                focusedCoordinates={selectedPlace || centerCoords}
                activeCategory={activeCategory} zoomLevel={selectedPlace ? 5 : 4}
                className="w-full h-full min-h-[400px]" />
            )}
            {(viewMode === 'map' || viewMode === 'split') && (
              <OsmStreetViewer centerLat={centerCoords.lat} centerLng={centerCoords.lng}
                zoom={selectedPlace ? 16 : 14} places={places} selectedPlace={selectedPlace}
                onSelectPlace={(p) => { playUiSound('click'); setSelectedPlace(p); }}
                className="w-full h-full min-h-[400px]" />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

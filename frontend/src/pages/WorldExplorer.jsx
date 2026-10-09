import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Globe2, 
  Search, 
  MapPin, 
  Navigation, 
  Compass, 
  ChevronRight, 
  SlidersHorizontal, 
  Filter, 
  Layers, 
  Sparkles, 
  RefreshCw, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  Building2, 
  GraduationCap, 
  HeartPulse, 
  Bus, 
  ShoppingBag, 
  Landmark, 
  Trees, 
  CreditCard,
  Maximize2,
  ArrowLeft
} from 'lucide-react';
import WorldGlobe3D from '../components/WorldGlobe3D';
import OsmStreetViewer from '../components/OsmStreetViewer';
import { 
  fetchPlaceSearch, 
  fetchHierarchyTree, 
  getUserCoordinates, 
  CATEGORY_DEFINITIONS 
} from '../services/explorerService';
import { playUiSound } from '../services/soundSystem';

// Default initial location: Velachery, Chennai
const DEFAULT_COORDS = { lat: 12.9759, lng: 80.2212, label: 'Velachery, Chennai' };

export default function WorldExplorer({ onNavigateBack, onNavigatePage }) {
  // Navigation & Hierarchy State
  const [hierarchy, setHierarchy] = useState({
    country: 'india',
    countryName: 'India',
    state: 'tamil nadu',
    stateName: 'Tamil Nadu',
    city: 'chennai',
    cityName: 'Chennai',
    neighbourhood: 'velachery',
    neighbourhoodName: 'Velachery'
  });

  const [geoTree, setGeoTree] = useState(null);
  const [centerCoords, setCenterCoords] = useState(DEFAULT_COORDS);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('Hospitals in Chennai');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchRadius, setSearchRadius] = useState(4000); // meters

  // Data & Selection State
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [copiedCoord, setCopiedCoord] = useState(false);

  // View Mode: '3d' | 'street' | 'split'
  const [viewMode, setViewMode] = useState('3d');
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(true);

  // Quick Preset Search Queries
  const PRESET_QUERIES = [
    { label: '🏥 Hospitals in Chennai', q: 'Hospitals in Chennai', category: 'healthcare' },
    { label: '🏛️ Govt offices in Velachery', q: 'Government offices in Velachery', category: 'government' },
    { label: '🏫 Schools near me', q: 'Schools near me', category: 'education' },
    { label: '🚏 Bus stops in Velachery', q: 'Bus stops in Velachery', category: 'transport' },
    { label: '🛍️ Malls in Chennai', q: 'Malls in Chennai', category: 'shopping' },
    { label: '💳 Banks in Chennai', q: 'Banks in Chennai', category: 'finance' },
    { label: '🌳 Parks near me', q: 'Parks near me', category: 'leisure' }
  ];

  // Fetch Geographic Hierarchy on mount
  useEffect(() => {
    fetchHierarchyTree().then((tree) => {
      if (tree) setGeoTree(tree);
    });
  }, []);

  // Execute Search Function
  const handleSearch = useCallback(
    async (overrideQuery = null, overrideCategory = null, overrideCoords = null) => {
      const q = overrideQuery !== null ? overrideQuery : searchQuery;
      const cat = overrideCategory !== null ? overrideCategory : activeCategory;
      const coords = overrideCoords !== null ? overrideCoords : centerCoords;

      setIsLoading(true);
      setErrorMsg(null);
      playUiSound('search');

      try {
        let lat = coords?.lat;
        let lng = coords?.lng;

        // If query is "near me", try requesting GPS
        if (q.toLowerCase().includes('near me')) {
          try {
            const gps = await getUserCoordinates();
            lat = gps.lat;
            lng = gps.lng;
            setCenterCoords({ lat, lng, label: 'Current Device Location' });
          } catch (gpsErr) {
            console.warn('[GPS Denied]: Falling back to manual coordinates', gpsErr.message);
            // Default to Velachery coordinates if GPS is unavailable
            lat = lat || DEFAULT_COORDS.lat;
            lng = lng || DEFAULT_COORDS.lng;
          }
        }

        const data = await fetchPlaceSearch({
          q,
          category: cat,
          lat,
          lng,
          radius: searchRadius,
          limit: 45
        });

        if (data && data.results) {
          setPlaces(data.results);
          if (data.center && data.center.lat && data.center.lng) {
            setCenterCoords({
              lat: data.center.lat,
              lng: data.center.lng,
              label: data.center.label || coords.label
            });
          }
          // Reset selected place if previous place is no longer in results
          if (selectedPlace && !data.results.find((p) => p.id === selectedPlace.id)) {
            setSelectedPlace(null);
          }
        } else {
          setPlaces([]);
        }
      } catch (err) {
        console.error('[Search Error]:', err);
        setErrorMsg('Unable to reach OpenStreetMap services. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery, activeCategory, centerCoords, searchRadius, selectedPlace]
  );

  // Initial search on boot
  useEffect(() => {
    handleSearch('Hospitals in Chennai', 'healthcare', DEFAULT_COORDS);
  }, []);

  // Filtered places according to category chips
  const filteredPlaces = useMemo(() => {
    if (activeCategory === 'all') return places;
    return places.filter((p) => p.category === activeCategory);
  }, [places, activeCategory]);

  // Handle "Near Me" GPS Button
  const handleNearMeTrigger = async () => {
    playUiSound('click');
    setIsLoading(true);
    try {
      const gps = await getUserCoordinates();
      const newCoords = { lat: gps.lat, lng: gps.lng, label: 'Your Location (GPS)' };
      setCenterCoords(newCoords);
      setSearchQuery('Places near me');
      await handleSearch('Places near me', activeCategory, newCoords);
    } catch (err) {
      alert('Location access was denied or is unavailable. You can search manually by typing any city or neighborhood name.');
      setIsLoading(false);
    }
  };

  // Handle Preset Click
  const handlePresetClick = (preset) => {
    playUiSound('click');
    setSearchQuery(preset.q);
    setActiveCategory(preset.category);
    handleSearch(preset.q, preset.category);
  };

  // Handle Category Filter Selection
  const handleCategoryChange = (catKey) => {
    playUiSound('switch');
    setActiveCategory(catKey);
    // If we have a query, re-run with this category
    handleSearch(searchQuery, catKey);
  };

  // Hierarchy Drill-Down Handlers
  const handleDrillWorld = () => {
    playUiSound('click');
    setCenterCoords({ lat: 20.0, lng: 0.0, label: 'Planetary Earth' });
    setHierarchy({
      country: null,
      countryName: null,
      state: null,
      stateName: null,
      city: null,
      cityName: null,
      neighbourhood: null,
      neighbourhoodName: null
    });
    setPlaces([]);
    setSelectedPlace(null);
  };

  const handleDrillCountry = (country) => {
    playUiSound('click');
    setCenterCoords({ lat: country.lat, lng: country.lng, label: country.name });
    setHierarchy({
      country: country.id,
      countryName: country.name,
      state: null,
      stateName: null,
      city: null,
      cityName: null,
      neighbourhood: null,
      neighbourhoodName: null
    });
    handleSearch(`Key places in ${country.name}`, activeCategory, country);
  };

  const handleDrillState = (state) => {
    playUiSound('click');
    setCenterCoords({ lat: state.lat, lng: state.lng, label: `${state.name}, India` });
    setHierarchy((prev) => ({
      ...prev,
      state: state.id,
      stateName: state.name,
      city: null,
      cityName: null,
      neighbourhood: null,
      neighbourhoodName: null
    }));
    handleSearch(`Hospitals in ${state.name}`, activeCategory, state);
  };

  const handleDrillCity = (city) => {
    playUiSound('click');
    const coords = { lat: 13.0827, lng: 80.2707, label: `${city}, Tamil Nadu` };
    setCenterCoords(coords);
    setHierarchy((prev) => ({
      ...prev,
      city: city.toLowerCase(),
      cityName: city,
      neighbourhood: null,
      neighbourhoodName: null
    }));
    handleSearch(`Hospitals in ${city}`, activeCategory, coords);
  };

  const handleDrillNeighbourhood = (neigh) => {
    playUiSound('click');
    const coords = { lat: neigh.lat, lng: neigh.lng, label: `${neigh.name}, Chennai` };
    setCenterCoords(coords);
    setHierarchy((prev) => ({
      ...prev,
      neighbourhood: neigh.id,
      neighbourhoodName: neigh.name
    }));
    handleSearch(`Government offices in ${neigh.name}`, activeCategory, coords);
  };

  // Copy Coordinates to Clipboard
  const handleCopyCoords = (lat, lng) => {
    navigator.clipboard.writeText(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    setCopiedCoord(true);
    playUiSound('copy');
    setTimeout(() => setCopiedCoord(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* ── Top Header Bar ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-purple-500/20 shadow-xl shadow-black/60">
        <div className="h-[2px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 w-full animate-pulse" />
        
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Left: Brand & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigatePage && onNavigatePage('dashboard')}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-all"
              title="Return to Telemetry Dashboard"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>

            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Compass className="w-4 h-4 text-cyan-300 animate-spin-slow" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-white font-bold text-base tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300">
                  World Explorer AI
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono font-bold">
                  3D EARTH & OSM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Real OpenStreetMap Discovery · Zero Fabrication
              </p>
            </div>
          </div>

          {/* Center / Right: View Mode Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
              <button
                onClick={() => { playUiSound('switch'); setViewMode('3d'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === '3d'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>3D Globe</span>
              </button>
              <button
                onClick={() => { playUiSound('switch'); setViewMode('street'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'street'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Street Map</span>
              </button>
              <button
                onClick={() => { playUiSound('switch'); setViewMode('split'); }}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'split'
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Dual View</span>
              </button>
            </div>

            {/* Quick GPS Near Me */}
            <button
              onClick={handleNearMeTrigger}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/40 rounded-xl transition-all shadow-sm hover:scale-105 active:scale-95"
              title="Locate me using device GPS"
            >
              <Navigation className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">Near Me</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Subheader Bar: Geographic Hierarchy Drill-down Breadcrumb ── */}
      <div className="bg-slate-900/80 border-b border-slate-800/80 px-4 py-2 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          {/* Breadcrumb Path */}
          <div className="flex items-center flex-wrap gap-1.5 text-slate-400">
            <button
              onClick={handleDrillWorld}
              className="flex items-center gap-1 text-cyan-300 hover:text-white px-2 py-0.5 rounded hover:bg-slate-800 transition-colors font-bold"
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>World</span>
            </button>

            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

            {/* Country Selector */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-slate-200 hover:text-cyan-300 px-2 py-0.5 rounded hover:bg-slate-800 transition-colors">
                <span>{hierarchy.countryName ? `🇮🇳 ${hierarchy.countryName}` : 'Select Country'}</span>
              </button>
              <div className="hidden group-hover:block absolute left-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1 z-50 min-w-[150px]">
                {geoTree?.countries?.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleDrillCountry(c)}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-2"
                  >
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

            {/* State Selector */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-slate-200 hover:text-cyan-300 px-2 py-0.5 rounded hover:bg-slate-800 transition-colors">
                <span>{hierarchy.stateName || 'State: Tamil Nadu'}</span>
              </button>
              <div className="hidden group-hover:block absolute left-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1 z-50 min-w-[170px] max-h-60 overflow-y-auto">
                {geoTree?.india?.states?.slice(0, 10).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleDrillState(s)}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

            {/* City Selector */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-slate-200 hover:text-cyan-300 px-2 py-0.5 rounded hover:bg-slate-800 transition-colors">
                <span>{hierarchy.cityName || 'City: Chennai'}</span>
              </button>
              <div className="hidden group-hover:block absolute left-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1 z-50 min-w-[150px]">
                {['Chennai', 'Coimbatore', 'Madurai', 'Bengaluru', 'Mumbai'].map((city) => (
                  <button
                    key={city}
                    onClick={() => handleDrillCity(city)}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />

            {/* Neighbourhood Selector */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-purple-300 font-bold hover:text-white px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 transition-colors">
                <span>📍 {hierarchy.neighbourhoodName || 'Velachery'}</span>
              </button>
              <div className="hidden group-hover:block absolute left-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1 z-50 min-w-[170px]">
                {geoTree?.india?.chennaiNeighbourhoods?.map((neigh) => (
                  <button
                    key={neigh.id}
                    onClick={() => handleDrillNeighbourhood(neigh)}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                  >
                    {neigh.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Center Coordinates Indicator */}
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-300">Focus:</span>
            <span className="text-cyan-300 font-semibold">{centerCoords.label}</span>
            <span className="text-slate-600">({centerCoords.lat.toFixed(4)}°, {centerCoords.lng.toFixed(4)}°)</span>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Control Bar ───────────────────────────────── */}
      <div className="bg-slate-950/70 border-b border-slate-800 px-4 py-3">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Main Search Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-wrap md:flex-nowrap items-center gap-2"
          >
            <div className="relative flex-1 min-w-[280px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search queries: 'Schools near me', 'Hospitals in Chennai', 'Government offices in Velachery'..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition-all font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Radius Selector */}
            <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-xl text-xs font-mono text-slate-300">
              <span className="text-slate-400">Radius:</span>
              <select
                value={searchRadius}
                onChange={(e) => {
                  const r = Number(e.target.value);
                  setSearchRadius(r);
                  handleSearch(searchQuery, activeCategory, centerCoords);
                }}
                className="bg-transparent text-cyan-300 font-semibold focus:outline-none cursor-pointer"
              >
                <option value={2000} className="bg-slate-900">2 km (Local Walk)</option>
                <option value={4000} className="bg-slate-900">4 km (Neighbourhood)</option>
                <option value={8000} className="bg-slate-900">8 km (City Metro)</option>
                <option value={15000} className="bg-slate-900">15 km (District)</option>
              </select>
            </div>

            {/* Submit Search Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-semibold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Searching OSM...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search Places</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Presets Carousel */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap mr-1">Suggestions:</span>
            {PRESET_QUERIES.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePresetClick(preset)}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all whitespace-nowrap text-[11px]"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                activeCategory === 'all'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-500/30'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>All Categories</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800/80">
                {places.length}
              </span>
            </button>

            {Object.entries(CATEGORY_DEFINITIONS).map(([catKey, catDef]) => {
              const count = places.filter((p) => p.category === catKey).length;
              const isSelected = activeCategory === catKey;

              return (
                <button
                  key={catKey}
                  onClick={() => handleCategoryChange(catKey)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'text-white font-bold shadow-md'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                  style={{
                    backgroundColor: isSelected ? catDef.color : undefined,
                    borderColor: isSelected ? catDef.color : undefined
                  }}
                >
                  <span>{catDef.label}</span>
                  {count > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-white font-mono">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main Workspace: Map Canvas + Places Drawer ────────────────── */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 flex flex-col lg:flex-row gap-4 relative">
        {/* Left / Desktop Results Drawer (380px) */}
        <aside className="w-full lg:w-96 flex flex-col bg-slate-900/70 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl backdrop-blur-md max-h-[720px]">
          {/* Drawer Header */}
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <h2 className="font-bold text-sm text-white">Discovered Places</h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {filteredPlaces.length}
              </span>
            </div>

            <button
              onClick={() => handleSearch()}
              disabled={isLoading}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Refresh results"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="m-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">{errorMsg}</p>
                <button
                  onClick={() => handleSearch()}
                  className="mt-1 text-cyan-400 underline font-semibold hover:text-cyan-300"
                >
                  Retry Search
                </button>
              </div>
            </div>
          )}

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
                <p className="text-sm font-semibold text-slate-300">Querying OpenStreetMap Telemetry</p>
                <p className="text-xs text-slate-500 font-mono mt-1">Checking live Overpass nodes & ways...</p>
              </div>
            ) : filteredPlaces.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400 mb-3">
                  <MapPin className="w-6 h-6 text-slate-500" />
                </div>
                <p className="text-sm font-semibold text-slate-200">No places found in this area</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Try widening the search radius, switching category filters, or searching another location.
                </p>
                <button
                  onClick={() => {
                    setSearchRadius(15000);
                    setActiveCategory('all');
                    handleSearch(searchQuery, 'all', centerCoords);
                  }}
                  className="mt-4 px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-500/40 rounded-xl hover:bg-cyan-900/40 transition-colors"
                >
                  Expand to 15 km Radius
                </button>
              </div>
            ) : (
              filteredPlaces.map((place) => {
                const isSelected = selectedPlace && selectedPlace.id === place.id;
                const catDef = CATEGORY_DEFINITIONS[place.category] || CATEGORY_DEFINITIONS.education;

                return (
                  <div
                    key={place.id}
                    onClick={() => {
                      playUiSound('click');
                      setSelectedPlace(place);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400/50 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: catDef.color }}
                          />
                          <span
                            className="text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded"
                            style={{
                              color: catDef.color,
                              backgroundColor: `${catDef.color}20`
                            }}
                          >
                            {place.categoryLabel}
                          </span>
                        </div>
                        <h3 className="font-bold text-xs text-white line-clamp-1">{place.name}</h3>
                      </div>

                      {place.distanceFormatted && (
                        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 shrink-0">
                          {place.distanceFormatted}
                        </span>
                      )}
                    </div>

                    {place.address && (
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                        <span>{place.address}</span>
                      </p>
                    )}

                    <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>{place.lat.toFixed(4)}°, {place.lng.toFixed(4)}°</span>
                      <span className="text-cyan-400 font-medium hover:underline">Select & Focus →</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Compact Location Details Panel (Bottom of drawer when selected) */}
          {selectedPlace && (
            <div className="p-3.5 bg-slate-950/95 border-t border-cyan-500/30 animate-in fade-in slide-in-from-bottom duration-200">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold">
                    Target Inspection
                  </span>
                  <h3 className="font-bold text-sm text-white line-clamp-1">{selectedPlace.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 mb-3">
                <div className="flex items-start gap-1.5">
                  <span className="text-slate-500 font-mono text-[11px] w-16 shrink-0">Address:</span>
                  <span className="text-slate-300 line-clamp-2">{selectedPlace.address || 'Address not listed in OSM'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-mono text-[11px] w-16 shrink-0">Distance:</span>
                  <span className="text-cyan-300 font-semibold">{selectedPlace.distanceFormatted || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-mono text-[11px] w-16 shrink-0">GPS:</span>
                    <span className="font-mono text-[11px] text-slate-300">
                      {selectedPlace.lat.toFixed(5)}, {selectedPlace.lng.toFixed(5)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyCoords(selectedPlace.lat, selectedPlace.lng)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    {copiedCoord ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCoord ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.openstreetmap.org/?mlat=${selectedPlace.lat}&mlon=${selectedPlace.lng}#map=17/${selectedPlace.lat}/${selectedPlace.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
                >
                  <span>OpenStreetMap</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedPlace.lat},${selectedPlace.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors shadow-md shadow-cyan-600/20"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </aside>

        {/* Right / Center Map Area */}
        <section className="flex-1 flex flex-col min-h-[520px] rounded-2xl overflow-hidden relative">
          {viewMode === '3d' && (
            <WorldGlobe3D
              places={filteredPlaces}
              selectedPlace={selectedPlace}
              onSelectPlace={(place) => {
                playUiSound('click');
                setSelectedPlace(place);
              }}
              focusedCoordinates={centerCoords}
              activeCategory={activeCategory}
              className="w-full h-full min-h-[540px]"
            />
          )}

          {viewMode === 'street' && (
            <OsmStreetViewer
              centerLat={centerCoords.lat}
              centerLng={centerCoords.lng}
              zoom={15}
              places={filteredPlaces}
              selectedPlace={selectedPlace}
              onSelectPlace={(place) => {
                playUiSound('click');
                setSelectedPlace(place);
              }}
              className="w-full h-full min-h-[540px]"
            />
          )}

          {viewMode === 'split' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full h-full min-h-[540px]">
              <WorldGlobe3D
                places={filteredPlaces}
                selectedPlace={selectedPlace}
                onSelectPlace={(place) => {
                  playUiSound('click');
                  setSelectedPlace(place);
                }}
                focusedCoordinates={centerCoords}
                activeCategory={activeCategory}
                className="w-full h-full min-h-[480px]"
              />
              <OsmStreetViewer
                centerLat={centerCoords.lat}
                centerLng={centerCoords.lng}
                zoom={15}
                places={filteredPlaces}
                selectedPlace={selectedPlace}
                onSelectPlace={(place) => {
                  playUiSound('click');
                  setSelectedPlace(place);
                }}
                className="w-full h-full min-h-[480px]"
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

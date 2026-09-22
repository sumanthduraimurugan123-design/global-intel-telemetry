import React from 'react';
import { 
  X, 
  Sparkles, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Radio, 
  ShieldAlert, 
  Flame, 
  Compass, 
  Layers, 
  ArrowRight,
  TrendingUp,
  Cpu,
  Zap,
  Globe2,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../services/soundSystem';
import { speakInLanguage, stopSpeaking, playEarcon } from '../services/voiceService';

// Pre-configured intelligence hotspots for fast jumping
const CINEMATIC_HOTSPOTS = [
  { id: 'taiwan', name: 'Taiwan', flag: '🇹🇼', threat: 'HIGH', sector: 'Semiconductors' },
  { id: 'ukraine', name: 'Ukraine', flag: '🇺🇦', threat: 'CRITICAL', sector: 'Food & Neon Gas' },
  { id: 'israel', name: 'Levant / Red Sea', flag: '🇮🇱', threat: 'CRITICAL', sector: 'Maritime Freight' },
  { id: 'iran', name: 'Strait of Hormuz', flag: '🇮🇷', threat: 'HIGH', sector: 'Crude Petroleum' },
  { id: 'russia', name: 'Russia', flag: '🇷🇺', threat: 'HIGH', sector: 'Fertilizer & Gas' },
  { id: 'south korea', name: 'South Korea', flag: '🇰🇷', threat: 'ELEVATED', sector: 'Memory DRAM' },
  { id: 'china', name: 'China', flag: '🇨🇳', threat: 'ELEVATED', sector: 'Consumer Hardware' },
  { id: 'india', name: 'India', flag: '🇮🇳', threat: 'MONITORED', sector: 'IT & Manufacturing' },
  { id: 'us', name: 'United States', flag: '🇺🇸', threat: 'MONITORED', sector: 'Financial & Cloud' }
];

export default function CinematicRegionPanel({
  selectedCountry = 'global',
  onSelectCountry,
  onExitFocusMode,
  news = [],
  alerts = [],
  currentLanguage = 'en',
  onOpenImpactModal
}) {
  const [speakingId, setSpeakingId] = React.useState(null);

  // Filter regional news and alerts
  const countryId = (selectedCountry || 'global').toLowerCase();
  const regionalNews = news.filter(n => 
    (n.country && n.country.toLowerCase() === countryId) ||
    (n.country_name && n.country_name.toLowerCase().includes(countryId))
  ).slice(0, 5);

  const regionalAlerts = alerts.filter(a =>
    a.country && a.country.toLowerCase() === countryId
  ).slice(0, 4);

  const activeHotspot = CINEMATIC_HOTSPOTS.find(h => h.id === countryId) || {
    id: countryId,
    name: countryId === 'global' ? 'Planetary Overview' : countryId.toUpperCase(),
    flag: '🌐',
    threat: regionalAlerts.length > 0 ? 'CRITICAL' : 'MONITORED',
    sector: 'Geospatial Sector'
  };

  const handleReadAloud = (text, id) => {
    playSound('click');
    if (speakingId === id) {
      stopSpeaking();
      setSpeakingId(null);
      return;
    }
    setSpeakingId(id);
    speakInLanguage(text, {
      language: currentLanguage,
      onEnd: () => setSpeakingId(null),
      onError: () => setSpeakingId(null)
    });
  };

  return (
    <div className="flex flex-col h-full max-h-[580px] lg:max-h-[640px] glass-card-luxe rounded-2xl border border-pink-500/30 shadow-2xl overflow-hidden font-sans">
      
      {/* Panel Header */}
      <div className="p-4 border-b border-purple-500/20 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{activeHotspot.flag}</span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-sm font-bold text-white tracking-wide">
                {activeHotspot.name}
              </h2>
              <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full border font-semibold ${
                activeHotspot.threat === 'CRITICAL' ? 'border-rose-500/60 bg-rose-500/20 text-rose-300' :
                activeHotspot.threat === 'HIGH' ? 'border-amber-500/60 bg-amber-500/20 text-amber-300' :
                'border-cyan-500/60 bg-cyan-500/20 text-cyan-300'
              }`}>
                {activeHotspot.threat}
              </span>
            </div>
            <p className="font-mono text-[10px] text-purple-300 flex items-center gap-1.5 mt-0.5">
              <Compass className="w-3 h-3 text-cyan-400" />
              <span>Sector: {activeHotspot.sector}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playSound('click');
            onExitFocusMode();
          }}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
          title="Exit Focus Mode (ESC)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Jump Hotspot Bar */}
      <div className="px-3 py-2 bg-slate-900/60 border-b border-purple-500/15 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider shrink-0 mr-1">
          Fly To:
        </span>
        {CINEMATIC_HOTSPOTS.map((h) => {
          const isActive = h.id === countryId;
          return (
            <button
              key={h.id}
              onClick={() => {
                playSound('switch');
                onSelectCountry(h.id);
              }}
              className={`px-2 py-1 rounded-lg font-mono text-[10px] transition-all flex items-center gap-1 shrink-0 ${
                isActive 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold shadow-md shadow-pink-500/20' 
                  : 'bg-slate-950/70 text-slate-300 border border-slate-800 hover:border-purple-500/40 hover:text-white'
              }`}
            >
              <span>{h.flag}</span>
              <span>{h.name}</span>
            </button>
          );
        })}
      </div>

      {/* Scrollable Intelligence Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* AI Regional Impact Summary Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-purple-950/30 to-pink-950/20 border border-purple-500/25 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-pink-300 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>REGIONAL CRISIS TRANSLATION</span>
            </div>
            {onOpenImpactModal && (
              <button
                onClick={() => {
                  playSound('click');
                  onOpenImpactModal();
                }}
                className="font-mono text-[9px] text-cyan-300 hover:text-cyan-200 underline flex items-center gap-0.5"
              >
                <span>Full Engine</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
          <p className="font-sans text-xs text-slate-200 leading-relaxed">
            {regionalAlerts.length > 0 
              ? `Active geopolitical friction in ${activeHotspot.name} risks shipping corridor congestion and elevated domestic component prices.` 
              : `Telemetry stream confirms steady supply transit through ${activeHotspot.name} with standard domestic retail buffer.`
            }
          </p>
        </div>

        {/* Regional Alerts (if any) */}
        <div>
          <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Active Sector Threats ({regionalAlerts.length})</span>
          </div>

          {regionalAlerts.length > 0 ? (
            <div className="space-y-2">
              {regionalAlerts.map((alt, idx) => (
                <div 
                  key={alt.id || idx}
                  className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-start gap-2 text-xs"
                >
                  <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5 animate-bounce" />
                  <div className="flex-1">
                    <p className="text-rose-100 font-medium leading-snug">{alt.message}</p>
                    <span className="font-mono text-[9px] text-rose-400/80 mt-1 block">
                      Severity: {alt.severity} · Verified Alert
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-center font-mono text-xs text-slate-400">
              No active critical threats flagged for this sovereign territory.
            </div>
          )}
        </div>

        {/* Regional News Dispatches */}
        <div>
          <div className="font-mono text-[10px] text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>Verified Regional Dispatches ({regionalNews.length})</span>
          </div>

          {regionalNews.length > 0 ? (
            <div className="space-y-2">
              {regionalNews.map((item, idx) => (
                <div 
                  key={item.id || idx}
                  className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-purple-500/40 transition-all space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-medium text-slate-100 line-clamp-2 leading-relaxed">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleReadAloud(item.title, item.id || idx)}
                        className="p-1 text-slate-400 hover:text-cyan-300 rounded transition-colors"
                        title="Read aloud"
                      >
                        {speakingId === (item.id || idx) ? <VolumeX className="w-3.5 h-3.5 text-pink-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                      </button>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-slate-400 hover:text-white rounded transition-colors"
                          title="Open publisher source"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[9px] text-slate-400">
                    <span>{item.source}</span>
                    <span className="text-purple-300">{item.category || 'geopolitics'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-center font-mono text-xs text-slate-400">
              Broadband monitoring active. No urgent regional dispatches in current cycle.
            </div>
          )}
        </div>

      </div>

      {/* Footer Actions */}
      <div className="p-3.5 border-t border-purple-500/20 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between shrink-0">
        <span className="font-mono text-[10px] text-slate-500">
          Press <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold">ESC</kbd> to exit
        </span>
        <button
          onClick={() => {
            playSound('click');
            onExitFocusMode();
          }}
          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-sans text-xs font-semibold shadow-md shadow-purple-500/20 transition-all flex items-center gap-1.5"
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit Focus Mode</span>
        </button>
      </div>

    </div>
  );
}

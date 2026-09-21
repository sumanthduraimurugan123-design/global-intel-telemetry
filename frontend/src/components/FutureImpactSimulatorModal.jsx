import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  ExternalLink, 
  RefreshCw, 
  ShieldAlert, 
  MapPin, 
  UserCheck, 
  GraduationCap, 
  Wheat, 
  Briefcase, 
  Users,
  Flame,
  CloudRain,
  DollarSign,
  BriefcaseIcon
} from 'lucide-react';
import { fetchFutureImpact } from '../services/newsService';
import { logTelemetryAction } from '../services/supabaseClient';

const PERSONA_OPTIONS = [
  { id: 'Student', label: 'Student', icon: <GraduationCap className="w-3.5 h-3.5 text-sky-400" />, desc: 'Campus commute, tuition & study expense impacts' },
  { id: 'Farmer', label: 'Farmer', icon: <Wheat className="w-3.5 h-3.5 text-emerald-400" />, desc: 'Crop transport, fertilizer & seasonal impacts' },
  { id: 'Professional', label: 'Professional', icon: <Briefcase className="w-3.5 h-3.5 text-purple-400" />, desc: 'Daily commute, career & household budget impacts' },
  { id: 'Common Person', label: 'Common Person', icon: <Users className="w-3.5 h-3.5 text-pink-400" />, desc: 'Daily cost of living & local grocery impacts' }
];

const CATEGORY_ICONS = {
  fuel: <Flame className="w-4 h-4 text-amber-400" />,
  inflation: <DollarSign className="w-4 h-4 text-emerald-400" />,
  weather: <CloudRain className="w-4 h-4 text-cyan-400" />,
  jobs: <BriefcaseIcon className="w-4 h-4 text-purple-400" />,
  risk: <ShieldAlert className="w-4 h-4 text-rose-400" />
};

export default function FutureImpactSimulatorModal({
  isOpen,
  onClose,
  currentLocation = 'global',
  currentPersona = 'Common Person'
}) {
  const [selectedPersona, setSelectedPersona] = useState(currentPersona);
  const [locationInput, setLocationInput] = useState(currentLocation || 'global');
  const [loading, setLoading] = useState(false);
  const [predictionsData, setPredictionsData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentPersona) {
      if (currentPersona.toLowerCase().includes('student')) setSelectedPersona('Student');
      else if (currentPersona.toLowerCase().includes('farmer')) setSelectedPersona('Farmer');
      else if (currentPersona.toLowerCase().includes('business') || currentPersona.toLowerCase().includes('professional') || currentPersona.toLowerCase().includes('analyst')) setSelectedPersona('Professional');
      else setSelectedPersona('Common Person');
    }
  }, [currentPersona]);

  useEffect(() => {
    if (currentLocation) {
      setLocationInput(currentLocation);
    }
  }, [currentLocation]);

  const handleSimulate = async (targetLoc = locationInput, targetPersona = selectedPersona) => {
    setLoading(true);
    setError(null);
    try {
      logTelemetryAction(`Future Impact Simulation requested for ${targetLoc} (${targetPersona})`, targetPersona);
      const data = await fetchFutureImpact(targetLoc, targetPersona);
      setPredictionsData(data);
    } catch (err) {
      console.error('Simulation error:', err);
      setError('Failed to fetch real-time news impact predictions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleSimulate(locationInput, selectedPersona);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-slate-950/95 border border-purple-500/30 shadow-2xl shadow-purple-950/50 rounded-2xl overflow-hidden backdrop-blur-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-slate-900/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl text-white shadow-lg shadow-purple-500/30">
              <Sparkles className="w-5 h-5 animate-pulse text-pink-200" />
            </div>
            <div>
              <h2 className="font-display text-lg text-white font-bold flex items-center gap-2">
                <span className="gradient-text">Future Impact Simulator</span>
                <span className="font-mono text-[10px] px-2.5 py-0.5 bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 rounded-full font-semibold">
                  LIVE NEWS AI
                </span>
              </h2>
              <p className="font-mono text-xs text-slate-400 mt-0.5">
                7–30 day localized real-world predictive models powered by verified feeds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-all"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Control Bar */}
        <div className="p-5 border-b border-purple-500/15 bg-slate-900/40 space-y-4">
          
          {/* Persona Selector Pills */}
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-purple-300 font-semibold mb-2 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-pink-400" />
              Target Persona:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PERSONA_OPTIONS.map((p) => {
                const isSelected = selectedPersona === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPersona(p.id);
                      handleSimulate(locationInput, p.id);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono transition-all text-left border ${
                      isSelected 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-transparent text-white font-bold shadow-lg shadow-purple-500/25 scale-[1.02]' 
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/40 hover:bg-slate-800/60'
                    }`}
                  >
                    {p.icon}
                    <span className="truncate">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location Input & Simulate Button */}
          <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Enter Location (e.g. Chennai, India, US, London...)"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 text-white text-xs font-mono focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 rounded-xl transition-all"
              />
            </div>

            <button
              onClick={() => handleSimulate(locationInput, selectedPersona)}
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0 hover:scale-105 active:scale-95"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-pink-200" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-pink-200 animate-pulse" />
                  <span>Run Prediction</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {loading && (
            <div className="py-16 flex flex-col items-center justify-center space-y-3 text-center">
              <div className="w-12 h-12 border-3 border-purple-500 border-t-pink-500 rounded-full animate-spin"></div>
              <p className="font-mono text-xs text-purple-300 font-semibold">Parsing dispatches for {locationInput}...</p>
              <p className="font-sans text-xs text-slate-400">Extracting events, calculating future vectors & customizing for {selectedPersona}</p>
            </div>
          )}

          {!loading && error && (
            <div className="p-4 bg-rose-950/30 border border-rose-500/40 text-rose-300 text-xs font-mono rounded-xl flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && predictionsData && (
            <>
              {/* Summary Status Bar */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900/60 px-4 py-2.5 border border-purple-500/20 rounded-xl">
                <span>
                  Sector: <strong className="text-white font-bold">{predictionsData.location}</strong> | Persona: <strong className="text-pink-300 font-bold">{predictionsData.persona}</strong>
                </span>
                <span className="text-cyan-300 font-semibold">
                  {predictionsData.totalArticlesAnalyzed} dispatches parsed
                </span>
              </div>

              {/* No Predictions Found State */}
              {(!predictionsData.predictions || predictionsData.predictions.length === 0) ? (
                <div className="py-12 text-center space-y-2 border border-dashed border-slate-700/60 rounded-xl p-8 bg-slate-900/30">
                  <TrendingUp className="w-10 h-10 text-slate-500 mx-auto opacity-50 mb-2" />
                  <p className="font-display text-sm text-slate-200 font-bold">No high-probability risk events detected in current news</p>
                  <p className="font-sans text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    No severe commodity price spikes, extreme weather, widespread layoffs, or supply chain bottlenecks matched the latest news in this region.
                  </p>
                </div>
              ) : (
                /* Prediction Cards List */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {predictionsData.predictions.map((pred, idx) => (
                    <div 
                      key={idx}
                      className="glass-card glass-card-hover p-4 rounded-xl flex flex-col justify-between space-y-3 relative group overflow-hidden border border-purple-500/25"
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center justify-center">
                            {CATEGORY_ICONS[pred.category] || <TrendingUp className="w-4 h-4 text-purple-400" />}
                          </div>
                          <span className="font-display text-xs text-white font-bold tracking-tight">
                            {pred.event}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] uppercase px-2.5 py-0.5 bg-pink-500/15 text-pink-300 border border-pink-500/30 rounded-full font-semibold">
                          {pred.trend} Trend
                        </span>
                      </div>

                      {/* Main Impact Statement */}
                      <div className="p-3 bg-slate-900/80 border border-purple-500/20 rounded-lg space-y-1 shadow-inner">
                        <span className="font-mono text-[10px] text-purple-300 uppercase tracking-wider block font-semibold">
                          Predicted Impact ({selectedPersona}):
                        </span>
                        <p className="font-sans text-xs text-pink-100 font-medium leading-relaxed">
                          "{pred.impact}"
                        </p>
                      </div>

                      {/* Details & Source */}
                      <div className="space-y-2 pt-1 border-t border-slate-800/80">
                        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                          <span className="flex items-center gap-1.5 text-cyan-300 font-semibold">
                            <Clock className="w-3.5 h-3.5 text-cyan-400" />
                            Window: {pred.timeframe}
                          </span>
                          <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-900/60 border border-slate-800">
                            Rule-Based Engine
                          </span>
                        </div>

                        {/* News Source Article Reference */}
                        {pred.source && (
                          <a
                            href={pred.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-pink-400 hover:text-pink-300 hover:underline truncate max-w-full"
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            <span className="truncate">Source: {pred.articleTitle || pred.source}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-purple-500/20 bg-slate-900/80 flex items-center justify-between backdrop-blur-md">
          <p className="font-mono text-[11px] text-purple-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Telemetry Rule-Engine v2.5</span>
          </p>
          <button
            onClick={onClose}
            className="px-5 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-white font-mono text-xs border border-slate-700 rounded-xl transition-all font-medium"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

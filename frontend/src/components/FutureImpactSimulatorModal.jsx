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
  { id: 'Common Person', label: 'Common Person', icon: <Users className="w-3.5 h-3.5 text-amber-400" />, desc: 'Daily cost of living & local grocery impacts' }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-wire-surface border border-wire-border shadow-2xl rounded-lg overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-wire-border bg-gradient-to-r from-wire-surface via-wire-raised to-wire-surface">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-mono text-base uppercase tracking-wider text-wire-fg font-bold flex items-center gap-2">
                Future Impact Simulator
                <span className="font-mono text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full normal-case font-normal">
                  Real News AI Engine
                </span>
              </h2>
              <p className="font-mono text-xs text-wire-subtle mt-0.5">
                Predicting 7–30 day localized real-world impacts strictly from real-time news data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-wire-subtle hover:text-wire-fg hover:bg-wire-raised rounded transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Control Bar */}
        <div className="p-4 border-b border-wire-border/60 bg-wire-base/60 space-y-3">
          
          {/* Persona selector pills */}
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-wider text-wire-subtle mb-1.5 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              User Persona:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PERSONA_OPTIONS.map((p) => {
                const isSelected = selectedPersona === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPersona(p.id);
                      handleSimulate(locationInput, p.id);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 border text-xs font-mono rounded transition-all text-left ${
                      isSelected 
                        ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-semibold shadow-sm' 
                        : 'bg-wire-surface border-wire-border text-wire-subtle hover:text-wire-fg hover:bg-wire-raised'
                    }`}
                  >
                    {p.icon}
                    <span>{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location input & Simulate button */}
          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <div className="relative flex-1">
              <MapPin className="w-4 h-4 text-wire-subtle absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Enter Location (e.g. Chennai, India, US...)"
                className="w-full pl-9 pr-3 py-2 bg-wire-surface border border-wire-border text-wire-fg text-xs font-mono focus:outline-none focus:border-amber-500/60 rounded"
              />
            </div>

            <button
              onClick={() => handleSimulate(locationInput, selectedPersona)}
              disabled={loading}
              className="px-5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-mono text-xs uppercase font-bold border border-amber-500/50 rounded flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Analyzing News...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Simulate Future Impact
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
              <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="font-mono text-xs text-amber-400">Fetching live news dispatches for {locationInput}...</p>
              <p className="font-sans text-[11px] text-wire-subtle">Extracting events, calculating trends & customizing predictions for {selectedPersona}</p>
            </div>
          )}

          {!loading && error && (
            <div className="p-4 bg-rose-950/20 border border-rose-500/40 text-rose-300 text-xs font-mono rounded flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && predictionsData && (
            <>
              {/* Summary Status Bar */}
              <div className="flex items-center justify-between text-[11px] font-mono text-wire-subtle bg-wire-raised/40 px-3 py-2 border border-wire-border/40 rounded">
                <span>
                  Location: <strong className="text-wire-fg">{predictionsData.location}</strong> | Persona: <strong className="text-amber-400">{predictionsData.persona}</strong>
                </span>
                <span>
                  News Articles Analyzed: <strong className="text-wire-fg">{predictionsData.totalArticlesAnalyzed}</strong>
                </span>
              </div>

              {/* No Predictions Found State */}
              {(!predictionsData.predictions || predictionsData.predictions.length === 0) ? (
                <div className="py-10 text-center space-y-2 border border-dashed border-wire-border/60 rounded p-6">
                  <TrendingUp className="w-8 h-8 text-wire-subtle mx-auto opacity-50" />
                  <p className="font-mono text-xs text-wire-fg font-semibold">No high-probability risk events detected in current news</p>
                  <p className="font-sans text-xs text-wire-subtle max-w-md mx-auto">
                    No major price surges, extreme weather, layoffs, or inflation triggers were matched in the latest news for this location.
                  </p>
                </div>
              ) : (
                /* Prediction Cards List */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {predictionsData.predictions.map((pred, idx) => (
                    <div 
                      key={idx}
                      className="bg-wire-raised/50 border border-wire-border/80 hover:border-amber-500/40 transition-all p-4 rounded flex flex-col justify-between space-y-3 relative group"
                    >
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {CATEGORY_ICONS[pred.category] || <TrendingUp className="w-4 h-4 text-amber-400" />}
                          <span className="font-mono text-xs text-wire-fg font-bold tracking-tight">
                            {pred.event}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] uppercase px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded">
                          {pred.trend} Trend
                        </span>
                      </div>

                      {/* Main Impact Statement */}
                      <div className="p-3 bg-wire-surface border border-wire-border/60 rounded space-y-1">
                        <span className="font-mono text-[10px] text-wire-subtle uppercase block">
                          Predicted Impact ({selectedPersona}):
                        </span>
                        <p className="font-serif text-sm text-amber-300 font-medium leading-snug">
                          "{pred.impact}"
                        </p>
                      </div>

                      {/* Details & Source */}
                      <div className="space-y-2 pt-1 border-t border-wire-border/40">
                        <div className="flex items-center justify-between text-xs font-mono text-wire-subtle">
                          <span className="flex items-center gap-1 text-wire-fg font-semibold">
                            <Clock className="w-3.5 h-3.5 text-sky-400" />
                            Timeframe: {pred.timeframe}
                          </span>
                          <span className="text-[10px] text-wire-subtle">
                            Real-time AI Rules
                          </span>
                        </div>

                        {/* News Source Article Reference */}
                        {pred.source && (
                          <a
                            href={pred.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-400 hover:text-amber-300 hover:underline truncate max-w-full"
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
        <div className="px-5 py-3 border-t border-wire-border bg-wire-base/80 flex items-center justify-between">
          <p className="font-mono text-[10px] text-wire-subtle">
            ⚡ Powered by Real News Integration & Rule-Based AI Engine
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-wire-raised hover:bg-wire-hover text-wire-fg font-mono text-xs border border-wire-border rounded transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

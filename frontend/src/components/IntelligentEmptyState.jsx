import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, Radio, RotateCcw } from 'lucide-react';
import { playUiSound } from '../services/soundSystem';

const AI_STATUS_MESSAGES = [
  'Analyzing planetary telemetry signals...',
  'Synthesizing cross-border frequency feeds...',
  'Calibrating regional geospatial vectors...',
  'Monitoring sovereign trade and defense corridors...',
  'Resolving satellite and open-source intelligence...'
];

export default function IntelligentEmptyState({
  title = 'No Telemetry Records in Active Sector',
  description = null,
  onReset = null,
  resetLabel = 'Reset Global Scope',
  icon: CustomIcon = null
}) {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % AI_STATUS_MESSAGES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const handleResetClick = () => {
    playUiSound('click');
    if (onReset) onReset();
  };

  return (
    <div className="w-full py-16 px-6 flex flex-col items-center justify-center text-center relative overflow-hidden rounded-2xl glass-card-luxe border border-purple-500/20 my-4">
      {/* Background Holographic Radar Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30" aria-hidden="true">
        <div className="w-96 h-96 rounded-full border border-purple-500/10 animate-ping [animation-duration:4s]" />
        <div className="absolute w-72 h-72 rounded-full border border-cyan-500/20" />
        <div className="absolute w-48 h-48 rounded-full border border-pink-500/25 border-dashed animate-spin-slow" />
        <div className="absolute w-24 h-24 rounded-full bg-purple-500/10 blur-xl" />
      </div>

      {/* Center Radar Scanner Icon */}
      <div className="relative z-10 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-900/60 to-slate-900/80 border border-purple-400/30 flex items-center justify-center shadow-lg shadow-purple-950/50 backdrop-blur-md">
          {CustomIcon ? (
            <CustomIcon className="w-8 h-8 text-cyan-300 animate-pulse" />
          ) : (
            <Radio className="w-8 h-8 text-cyan-300 animate-pulse" />
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center">
          <Sparkles className="w-2.5 h-2.5 text-emerald-300 animate-bounce" />
        </div>
      </div>

      {/* Text Hierarchy */}
      <h3 className="relative z-10 font-display text-base md:text-lg font-bold text-white tracking-tight">
        {title}
      </h3>

      {/* AI Rotating Status Indicator */}
      <div className="relative z-10 flex items-center gap-2 mt-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-purple-500/30 shadow-inner">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span className="font-mono text-xs text-cyan-200 transition-opacity duration-500 font-medium">
          {AI_STATUS_MESSAGES[statusIndex]}
        </span>
      </div>

      {description && (
        <p className="relative z-10 text-xs text-slate-400 max-w-md mt-3 font-mono leading-relaxed">
          {description}
        </p>
      )}

      {/* Reset / Action Button */}
      {onReset && (
        <button
          onClick={handleResetClick}
          className="relative z-10 mt-6 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5 text-pink-200" />
          <span>{resetLabel}</span>
        </button>
      )}
    </div>
  );
}

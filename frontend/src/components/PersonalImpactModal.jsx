import React from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  X, 
  CheckCircle2, 
  Activity, 
  Cpu, 
  ShoppingBag, 
  Car, 
  Lock, 
  Compass 
} from 'lucide-react';
import { IMPACT_PROFILES } from '../services/impactEngine';
import { speakInLanguage, stopSpeaking, playEarcon } from '../services/voiceService';
import { playSound } from '../services/soundSystem';

export default function PersonalImpactModal({
  isOpen,
  onClose,
  impactData,
  activeProfileId,
  onChangeProfile,
  selectedCountry,
  currentLanguage = 'en',
  isSpeaking,
  setIsSpeaking
}) {
  if (!isOpen || !impactData) return null;

  const handleSpeak = () => {
    playSound('click');
    if (isSpeaking) {
      stopSpeaking();
      if (setIsSpeaking) setIsSpeaking(false);
      return;
    }
    playEarcon('click');
    if (setIsSpeaking) setIsSpeaking(true);
    speakInLanguage(impactData.speechText, {
      language: currentLanguage,
      onEnd: () => setIsSpeaking && setIsSpeaking(false),
      onError: () => setIsSpeaking && setIsSpeaking(false)
    });
  };

  const handleClose = () => {
    playSound('click');
    onClose();
  };

  const getVectorIcon = (id) => {
    switch (id) {
      case 'commute': return <Car className="w-4 h-4 text-cyan-400" />;
      case 'budget': return <ShoppingBag className="w-4 h-4 text-amber-400" />;
      case 'tech': return <Cpu className="w-4 h-4 text-purple-400" />;
      case 'cyber': return <Lock className="w-4 h-4 text-emerald-400" />;
      default: return <Activity className="w-4 h-4 text-slate-300" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto glass-card-luxe rounded-2xl border border-slate-700/60 shadow-2xl shadow-cyan-950/20 flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 bg-slate-900/90 sticky top-0 z-10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/30">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-sm tracking-wider uppercase font-bold text-slate-100">
                  AI Personal Impact Engine
                </h3>
                <span className={`font-mono text-[10px] px-2.5 py-0.5 border rounded-full ${impactData.bgBadge || 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                  {impactData.levelBadge}
                </span>
              </div>
              <p className="font-sans text-xs text-slate-400 mt-0.5">
                Real-time translation of global telemetry into your everyday life
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeak}
              className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 font-sans text-xs font-medium ${
                isSpeaking 
                  ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-400/20' 
                  : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-amber-400/60 hover:text-amber-400'
              }`}
              title="Listen to AI impact briefing"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
            </button>

            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Profile Switcher */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-slate-400 tracking-widest uppercase">
                Select Your Life Profile:
              </span>
              <span className="font-sans text-xs text-amber-400 font-medium">
                {impactData.profile.desc}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-950/60 p-2 rounded-xl border border-slate-800/70">
              {IMPACT_PROFILES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    playSound('switch');
                    playEarcon('click');
                    onChangeProfile(p.id);
                  }}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-lg text-center transition-all border ${
                    activeProfileId === p.id
                      ? 'bg-amber-400/15 border-amber-400/50 text-slate-100 shadow-sm'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-xl mb-1">{p.icon}</span>
                  <span className="font-sans text-[11px] font-medium leading-tight">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Score & Summary Card */}
          <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5 flex flex-col sm:flex-row items-center gap-5">
            {/* Score Ring / Gauge */}
            <div className="flex flex-col items-center justify-center w-28 h-28 shrink-0 rounded-full border-2 border-slate-700/80 bg-slate-950/80 relative shadow-inner">
              <div 
                className="absolute inset-1 rounded-full border border-dashed opacity-40 animate-spin-slow"
                style={{ borderColor: impactData.badgeColor === 'text-rose-500' || impactData.badgeColor === 'text-rose-400' ? '#f43f5e' : '#f59e0b' }}
              />
              <span className={`font-mono text-3xl font-bold tabular-nums ${impactData.badgeColor || 'text-amber-400'}`}>
                {impactData.overallScore}
              </span>
              <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider">/ 100 Impact</span>
            </div>

            {/* Assessment Narrative */}
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-mono text-xs text-slate-400 uppercase">Primary Driver:</span>
                <span className="font-sans text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  {getVectorIcon(impactData.primaryVector.id)}
                  {impactData.primaryVector.name} ({impactData.primaryVector.score}%)
                </span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {impactData.conciseSummary}
              </p>
            </div>
          </div>

          {/* 4-Vector Breakdown Grid */}
          <div>
            <div className="font-mono text-[10px] text-slate-400 tracking-widest uppercase mb-2.5">
              Impact Vector Breakdown:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {impactData.vectors.map((vec) => (
                <div 
                  key={vec.id} 
                  className="bg-slate-900/50 rounded-xl border border-slate-800/80 p-3.5 flex flex-col gap-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getVectorIcon(vec.id)}
                      <span className="font-sans text-xs font-medium text-slate-200">{vec.name}</span>
                    </div>
                    <span className="font-mono text-xs font-bold tabular-nums text-slate-100">
                      {vec.score}%
                    </span>
                  </div>
                  
                  {/* Meter Bar */}
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-700"
                      style={{ 
                        width: `${vec.score}%`,
                        backgroundColor: vec.color || '#f59e0b'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sector-Specific Geopolitical Note (if a country is selected) */}
          {impactData.hotspotInfo && (
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-cyan-300 mb-1">
                <Compass className="w-4 h-4" />
                <span>Regional Vector: {impactData.hotspotInfo.title}</span>
              </div>
              <p className="text-xs text-cyan-100/90 leading-relaxed font-sans">
                {impactData.hotspotInfo.personalImpact}
              </p>
            </div>
          )}

          {/* Actionable Recommendations */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Recommended Action For You</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {impactData.actionableAdvice}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-between font-sans text-xs text-slate-400">
          <span>Active Persona: <strong className="text-slate-100">{impactData.profile.label}</strong></span>
          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-sans text-xs font-medium border border-slate-700 transition-colors shadow-sm"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}

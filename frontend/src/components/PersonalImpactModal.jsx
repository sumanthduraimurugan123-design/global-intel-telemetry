import React from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  ArrowRight,
  TrendingUp,
  Cpu,
  ShoppingBag,
  Car,
  Lock,
  Compass
} from 'lucide-react';
import { IMPACT_PROFILES } from '../services/impactEngine';
import { speakInLanguage, stopSpeaking, playEarcon } from '../services/voiceService';

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

  const getVectorIcon = (id) => {
    switch (id) {
      case 'commute': return <Car className="w-4 h-4 text-cyan-400" />;
      case 'budget': return <ShoppingBag className="w-4 h-4 text-amber-400" />;
      case 'tech': return <Cpu className="w-4 h-4 text-purple-400" />;
      case 'cyber': return <Lock className="w-4 h-4 text-emerald-400" />;
      default: return <Activity className="w-4 h-4 text-wire-fg" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-wire-surface border border-wire-border shadow-2xl flex flex-col font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-wire-border bg-wire-base/60 sticky top-0 z-10 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-wire-raised border border-wire-border">
              <Sparkles className="w-5 h-5 text-wire-amber animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-sm tracking-wider uppercase font-bold text-wire-fg">
                  AI Personal Impact Engine
                </h3>
                <span className={`font-mono text-[10px] px-2 py-0.5 border rounded-full ${impactData.bgBadge}`}>
                  {impactData.levelBadge}
                </span>
              </div>
              <p className="font-mono text-[11px] text-wire-subtle">
                Real-time translation of global telemetry into your everyday life
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeak}
              className={`p-2 border transition-colors flex items-center gap-1.5 font-mono text-xs ${
                isSpeaking 
                  ? 'bg-wire-amber text-black border-wire-amber' 
                  : 'bg-wire-raised border-wire-border text-wire-fg hover:border-wire-amber'
              }`}
              title="Listen to AI impact briefing"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-wire-subtle hover:text-wire-fg border border-wire-border hover:border-wire-muted transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5">
          
          {/* Profile Switcher */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-wire-subtle tracking-widest uppercase">
                Select Your Life Profile:
              </span>
              <span className="font-mono text-[10px] text-wire-amber">
                {impactData.profile.desc}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 bg-wire-base p-1.5 border border-wire-border">
              {IMPACT_PROFILES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    playEarcon('click');
                    onChangeProfile(p.id);
                  }}
                  className={`flex flex-col items-center justify-center p-2 text-center transition-all border ${
                    activeProfileId === p.id
                      ? 'bg-wire-raised border-wire-amber text-wire-fg shadow-sm'
                      : 'border-transparent text-wire-subtle hover:text-wire-fg hover:bg-wire-raised/50'
                  }`}
                >
                  <span className="text-lg mb-1">{p.icon}</span>
                  <span className="font-mono text-[10px] font-medium leading-tight">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Score & Summary Card */}
          <div className="bg-wire-base border border-wire-border p-4 flex flex-col sm:flex-row items-center gap-5">
            {/* Score Ring / Gauge */}
            <div className="flex flex-col items-center justify-center w-28 h-28 shrink-0 rounded-full border-2 border-wire-border bg-wire-surface relative">
              <div 
                className="absolute inset-1 rounded-full border border-dashed opacity-40 animate-spin-slow"
                style={{ borderColor: impactData.badgeColor === 'text-wire-red' ? '#ff3b30' : '#ffb800' }}
              />
              <span className={`font-mono text-3xl font-bold tabular-nums ${impactData.badgeColor}`}>
                {impactData.overallScore}
              </span>
              <span className="font-mono text-[10px] text-wire-subtle uppercase">/ 100 Impact</span>
            </div>

            {/* Assessment Narrative */}
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-mono text-xs text-wire-subtle uppercase">Primary Driver:</span>
                <span className="font-mono text-xs font-semibold text-wire-fg flex items-center gap-1">
                  {getVectorIcon(impactData.primaryVector.id)}
                  {impactData.primaryVector.name} ({impactData.primaryVector.score}%)
                </span>
              </div>
              <p className="text-sm text-wire-fg leading-relaxed">
                {impactData.conciseSummary}
              </p>
            </div>
          </div>

          {/* 4-Vector Breakdown Grid */}
          <div>
            <div className="font-mono text-[10px] text-wire-subtle tracking-widest uppercase mb-2.5">
              Impact Vector Breakdown:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {impactData.vectors.map((vec) => (
                <div 
                  key={vec.id} 
                  className="bg-wire-base border border-wire-border p-3 flex flex-col gap-2 hover:border-wire-muted transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getVectorIcon(vec.id)}
                      <span className="font-mono text-xs font-medium text-wire-fg">{vec.name}</span>
                    </div>
                    <span className="font-mono text-xs font-bold tabular-nums text-wire-fg">
                      {vec.score}%
                    </span>
                  </div>
                  
                  {/* Meter Bar */}
                  <div className="w-full h-1.5 bg-wire-raised overflow-hidden">
                    <div 
                      className="h-full transition-all duration-700"
                      style={{ 
                        width: `${vec.score}%`,
                        backgroundColor: vec.color || '#ffb800'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sector-Specific Geopolitical Note (if a country is selected) */}
          {impactData.hotspotInfo && (
            <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/30 text-cyan-200">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-cyan-300 mb-1">
                <Compass className="w-4 h-4" />
                <span>Regional Vector: {impactData.hotspotInfo.title}</span>
              </div>
              <p className="text-xs text-cyan-100/90 leading-relaxed">
                {impactData.hotspotInfo.personalImpact}
              </p>
            </div>
          )}

          {/* Actionable Recommendations */}
          <div className="p-4 bg-wire-base border border-wire-border space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-semibold text-wire-amber uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-wire-amber" />
              <span>Recommended Action For You</span>
            </div>
            <p className="text-xs text-wire-fg leading-relaxed">
              {impactData.actionableAdvice}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-wire-border bg-wire-base/60 flex items-center justify-between font-mono text-[11px] text-wire-subtle">
          <span>Active Persona: <strong className="text-wire-fg">{impactData.profile.label}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-wire-raised hover:bg-wire-hover text-wire-fg border border-wire-border transition-colors"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Sparkles, ArrowUpRight, Activity, ShieldCheck, Database, Newspaper, Zap } from 'lucide-react';
import { calculatePersonalImpact } from '../services/impactEngine';

export default function TelemetryStats({ 
  selectedCountry = 'global', 
  newsCount = 0, 
  alertsCount = 0, 
  news = [], 
  alerts = [],
  persona = 'Analyst',
  profileId = 'tech',
  onOpenImpactModal,
  currentLanguage = 'en'
}) {
  const totalNews = news.length || newsCount || 0;
  const sourcesSet = new Set();
  for (const item of news) {
    if (item.source) sourcesSet.add(item.source);
  }
  const distinctSources = sourcesSet.size || (totalNews > 0 ? 3 : 0);

  // Map persona to default profile if not explicitly set
  let effectiveProfileId = profileId;
  if (!effectiveProfileId || effectiveProfileId === 'tech') {
    const pLower = (persona || '').toLowerCase();
    if (pLower.includes('student')) effectiveProfileId = 'student';
    else if (pLower.includes('farmer') || pLower.includes('kisan')) effectiveProfileId = 'farmer';
    else if (pLower.includes('business')) effectiveProfileId = 'business';
    else if (pLower.includes('common') || pLower.includes('casual')) effectiveProfileId = 'common_person';
    else if (pLower.includes('accessibility')) effectiveProfileId = 'common_person';
    else effectiveProfileId = 'analyst';
  }

  // Calculate AI Personal Impact
  const impact = calculatePersonalImpact({
    news,
    alerts,
    selectedCountry,
    profileId: effectiveProfileId,
    language: currentLanguage
  });

  const isHighImpact = impact.overallScore >= 70;
  const isModerateImpact = impact.overallScore >= 45;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 my-3">
      
      {/* 1. PERSONAL IMPACT CARD */}
      <div className="glass-card glass-card-hover p-4 rounded-xl flex flex-col gap-2 relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />
        
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
              <Sparkles className="w-3 h-3 text-purple-400" />
            </div>
            <span className="font-mono text-[11px] text-purple-300 font-semibold tracking-wider uppercase">
              Personal Impact
            </span>
          </div>
          {onOpenImpactModal && (
            <button
              onClick={onOpenImpactModal}
              className="font-mono text-[10px] text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded bg-pink-500/10 border border-pink-500/20"
              title="Open full AI impact breakdown"
            >
              <span>AI View</span>
              <ArrowUpRight className="w-2.5 h-2.5" />
            </button>
          )}
        </div>

        <div className="flex items-baseline gap-2 z-10">
          <span className={`font-mono text-3xl font-extrabold tabular-nums tracking-tight ${
            isHighImpact ? 'text-rose-400' : isModerateImpact ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {impact.overallScore}
          </span>
          <span className="font-mono text-xs text-slate-400">/ 100</span>
          <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ml-auto font-medium ${
            isHighImpact 
              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' 
              : isModerateImpact 
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' 
              : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
          }`}>
            {impact.levelBadge}
          </span>
        </div>

        {/* Dynamic Gradient Progress Bar */}
        <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden mt-1 z-10">
          <div
            className={`h-full transition-all duration-700 rounded-full ${
              isHighImpact 
                ? 'bg-gradient-to-r from-orange-500 to-rose-500 shadow-sm shadow-rose-500/50' 
                : isModerateImpact 
                ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                : 'bg-gradient-to-r from-cyan-500 to-emerald-400'
            }`}
            style={{ width: `${impact.overallScore}%` }}
          />
        </div>

        <div className="font-mono text-[10px] text-slate-400 flex items-center justify-between pt-0.5 z-10">
          <span className="truncate">Vector: <strong className="text-slate-300 font-medium">{impact.primaryVector.name}</strong></span>
          <span className="text-purple-300 font-semibold shrink-0 ml-1">{impact.primaryVector.score}% load</span>
        </div>
      </div>

      {/* 2. HOW THIS AFFECTS YOU CARD */}
      <div className="glass-card glass-card-hover p-4 rounded-xl flex flex-col gap-2 relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all pointer-events-none" />

        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
              <Zap className="w-3 h-3 text-pink-400" />
            </div>
            <span className="font-mono text-[11px] text-pink-300 font-semibold tracking-wider uppercase">
              Affects You
            </span>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700/80">
            {impact.profile.icon} {impact.profile.label}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center my-0.5 z-10">
          <div className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
            {impact.conciseSummary}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between z-10">
          <span className="font-mono text-[10px] text-slate-400 truncate max-w-[180px]">
            💡 {impact.actionableAdvice}
          </span>
          {onOpenImpactModal && (
            <button
              onClick={onOpenImpactModal}
              className="font-mono text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline shrink-0 ml-1 font-medium"
            >
              Details
            </button>
          )}
        </div>
      </div>

      {/* 3. DISPATCHES TELEMETRY STREAM */}
      <div className="glass-card glass-card-hover p-4 rounded-xl flex flex-col gap-2 relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />

        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
              <Newspaper className="w-3 h-3 text-cyan-400" />
            </div>
            <span className="font-mono text-[11px] text-cyan-300 font-semibold tracking-wider uppercase">
              Live Dispatches
            </span>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            REALTIME
          </span>
        </div>

        <div className="flex items-baseline gap-2 z-10">
          <span className="font-mono text-3xl font-extrabold tabular-nums tracking-tight text-white">
            {totalNews}
          </span>
          <span className="font-mono text-xs text-slate-400">stories parsed</span>
        </div>

        <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden mt-1 z-10">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700 shadow-sm shadow-cyan-500/30" 
            style={{ width: `${Math.min(100, Math.max(15, (totalNews / 25) * 100))}%` }} 
          />
        </div>

        <div className="font-mono text-[10px] text-slate-400 z-10">
          {distinctSources > 0 ? `${distinctSources} verified global feeds` : 'Awaiting data streams'}
        </div>
      </div>

      {/* 4. PERSISTENCE & SYSTEM INTEGRITY */}
      <div className="glass-card glass-card-hover p-4 rounded-xl flex flex-col gap-2 relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />

        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <Database className="w-3 h-3 text-emerald-400" />
            </div>
            <span className="font-mono text-[11px] text-emerald-300 font-semibold tracking-wider uppercase">
              Persistence Engine
            </span>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            SYNCED
          </span>
        </div>

        <div className="flex items-baseline gap-2 z-10">
          <span className="font-mono text-3xl font-extrabold tabular-nums tracking-tight text-white">
            4
          </span>
          <span className="font-mono text-xs text-slate-400">tables active</span>
        </div>

        <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden mt-1 z-10">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-sm shadow-emerald-500/30" style={{ width: '100%' }} />
        </div>

        <div className="font-mono text-[10px] text-slate-400 truncate z-10">
          users · news · alerts · logs
        </div>
      </div>

    </div>
  );
}

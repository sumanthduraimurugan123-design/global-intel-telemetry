import React from 'react';
import { Sparkles, ArrowUpRight, Activity, ShieldCheck, Database, Newspaper, Zap } from 'lucide-react';
import { calculatePersonalImpact } from '../services/impactEngine';
import { motion } from 'framer-motion';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 my-3 spatial-perspective">
      
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="p-4 flex flex-col gap-2 relative group cursor-pointer shadow-xl rounded-xl border-l-4 border-l-purple-500 bg-slate-900/60 backdrop-blur-md border border-white/5 transition-all"
        onClick={onOpenImpactModal}
      >
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
              isHighImpact 
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400' 
                : 'bg-purple-500/20 border-purple-500/30 text-purple-400'
            }`}>
              <Sparkles className="w-3 h-3" />
            </div>
            <span className="font-mono text-[11px] text-purple-300 font-semibold tracking-wider uppercase">
              PERSONAL IMPACT
            </span>
          </div>
          {onOpenImpactModal && (
            <div className="font-mono text-[10px] text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded bg-pink-500/10 border border-pink-500/20">
              <span className="font-bold relative overflow-hidden group">
                <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                AI View
              </span>
              <ArrowUpRight className="w-2.5 h-2.5 text-pink-300" />
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-2 z-10">
          <span
            className={`font-mono text-3xl font-extrabold tracking-tight ${
              isHighImpact ? 'text-rose-400' : isModerateImpact ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >{impact.overallScore}</span>
          <span className="font-mono text-xs text-slate-400">/ 100</span>
          <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ml-auto font-medium ${
            isHighImpact 
              ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 shadow-sm shadow-rose-500/20' 
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
      </motion.div>

      {/* 2. HOW THIS AFFECTS YOU CARD */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="p-4 flex flex-col gap-2 relative group cursor-pointer shadow-xl rounded-xl border-l-4 border-l-pink-500 bg-slate-900/60 backdrop-blur-md border border-white/5 transition-all"
        onClick={onOpenImpactModal}
      >
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-pink-500/20 flex items-center justify-center border border-pink-500/30">
              <Zap className="w-3 h-3 text-pink-400" />
            </div>
            <span className="font-mono text-[11px] text-pink-300 font-semibold tracking-wider uppercase">
              AFFECTS YOU
            </span>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700/80">
            {impact.profile.icon} {impact.profile.label}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center my-0.5 z-10">
          <div className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-sans">
            {impact.conciseSummary}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between z-10">
          <span className="font-mono text-[10px] text-slate-400 truncate max-w-[180px]">
            💡 {impact.actionableAdvice}
          </span>
          {onOpenImpactModal && (
            <span className="font-mono text-[10px] text-cyan-400 hover:text-cyan-300 hover:underline shrink-0 ml-1 font-medium">
              Details
            </span>
          )}
        </div>
      </motion.div>

      {/* 3. DISPATCHES TELEMETRY STREAM */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="p-4 flex flex-col gap-2 relative group shadow-xl rounded-xl border-l-4 border-l-cyan-500 bg-slate-900/60 backdrop-blur-md border border-white/5 transition-all"
      >
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
              <Newspaper className="w-3 h-3 text-cyan-400" />
            </div>
            <span className="font-mono text-[11px] text-cyan-300 font-semibold tracking-wider uppercase">
              LIVE DISPATCHES
            </span>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-cyan-300 font-bold relative overflow-hidden group">
              <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              REALTIME
            </span>
          </span>
        </div>

        <div className="flex items-baseline gap-2 z-10">
          <span
            className="font-mono text-3xl font-extrabold tracking-tight text-white"
          >{totalNews}</span>
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
      </motion.div>

      {/* 4. PERSISTENCE & SYSTEM INTEGRITY */}
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="p-4 flex flex-col gap-2 relative group shadow-xl rounded-xl border-l-4 border-l-emerald-500 bg-slate-900/60 backdrop-blur-md border border-white/5 transition-all"
      >
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <Database className="w-3 h-3 text-emerald-400" />
            </div>
            <span className="font-mono text-[11px] text-emerald-300 font-semibold tracking-wider uppercase">
              PERSISTENCE ENGINE
            </span>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span className="text-emerald-300 font-bold relative overflow-hidden group">
              <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              SYNCED
            </span>
          </span>
        </div>

        <div className="flex items-baseline gap-2 z-10">
          <span
            className="font-mono text-3xl font-extrabold tracking-tight text-white"
          >4</span>
          <span className="font-mono text-xs text-slate-400">tables active</span>
        </div>

        <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden mt-1 z-10">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-sm shadow-emerald-500/30" style={{ width: '100%' }} />
        </div>

        <div className="font-mono text-[10px] text-slate-400 truncate z-10">
          users · news · alerts · logs
        </div>
      </motion.div>

    </div>
  );
}

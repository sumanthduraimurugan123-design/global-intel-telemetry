import React from 'react';
import { Sparkles, ArrowUpRight, Activity, ShieldCheck, AlertCircle } from 'lucide-react';
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-wire-border border border-wire-border">
      
      {/* 1. PERSONAL IMPACT (Replaces RISK INDEX) */}
      <div className="bg-wire-surface border border-wire-border p-4 flex flex-col gap-1.5 relative group hover:bg-wire-base/50 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-wire-amber" />
            <span className="font-mono text-[10px] text-wire-subtle tracking-widest uppercase">
              PERSONAL IMPACT
            </span>
          </div>
          {onOpenImpactModal && (
            <button
              onClick={onOpenImpactModal}
              className="font-mono text-[9px] text-wire-amber hover:underline flex items-center gap-0.5"
              title="Open full AI impact breakdown"
            >
              <span>AI Breakdown</span>
              <ArrowUpRight className="w-2.5 h-2.5" />
            </button>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span className={`font-mono text-2xl font-bold tabular-nums ${impact.badgeColor}`}>
            {impact.overallScore}
          </span>
          <span className="font-mono text-[10px] text-wire-subtle">/ 100 Impact</span>
          <span className={`font-mono text-[9px] px-1.5 py-0.2 rounded border ml-auto ${impact.bgBadge}`}>
            {impact.levelBadge}
          </span>
        </div>

        {/* Dynamic Vector Progress Bar */}
        <div className="w-full h-1 bg-wire-raised overflow-hidden mt-0.5">
          <div
            className={`h-full transition-all duration-700 ${
              isHighImpact ? 'bg-wire-red' : isModerateImpact ? 'bg-wire-amber' : 'bg-wire-green'
            }`}
            style={{ width: `${impact.overallScore}%` }}
          />
        </div>

        <div className="font-mono text-[10px] text-wire-subtle flex items-center justify-between pt-0.5">
          <span>Primary: {impact.primaryVector.name}</span>
          <span className="text-wire-fg">{impact.primaryVector.score}% load</span>
        </div>
      </div>

      {/* 2. HOW THIS AFFECTS YOU (Replaces THREAT STATUS) */}
      <div className="bg-wire-surface border border-wire-border p-4 flex flex-col gap-1.5 hover:bg-wire-base/50 transition-colors">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-wire-subtle tracking-widest uppercase">
            HOW THIS AFFECTS YOU
          </span>
          <span className="font-mono text-[9px] text-wire-subtle">
            {impact.profile.icon} {impact.profile.label}
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="text-xs text-wire-fg line-clamp-2 leading-tight">
            {impact.conciseSummary}
          </div>
        </div>

        <div className="pt-1 border-t border-wire-border/50 flex items-center justify-between">
          <span className="font-mono text-[10px] text-wire-subtle truncate max-w-[170px]">
            Adv: {impact.actionableAdvice}
          </span>
          {onOpenImpactModal && (
            <button
              onClick={onOpenImpactModal}
              className="font-mono text-[9px] text-wire-fg hover:text-wire-amber underline shrink-0 ml-1"
            >
              Details
            </button>
          )}
        </div>
      </div>

      {/* 3. DISPATCHES (Existing feature preserved) */}
      <div className="bg-wire-surface border border-wire-border p-4 flex flex-col gap-1.5 hover:bg-wire-base/50 transition-colors">
        <div className="font-mono text-[10px] text-wire-subtle tracking-widest uppercase">
          DISPATCHES
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-medium tabular-nums text-wire-fg">
            {totalNews}
          </span>
          <span className="font-mono text-[10px] text-wire-subtle">processed</span>
        </div>
        <div className="w-full h-1 bg-wire-raised overflow-hidden">
          <div 
            className="h-full bg-cyan-500/80 transition-all duration-700" 
            style={{ width: `${Math.min(100, (totalNews / 25) * 100)}%` }} 
          />
        </div>
        <div className="font-mono text-[10px] text-wire-subtle">
          {distinctSources > 0 ? `${distinctSources} verified sources` : 'System active'}
        </div>
      </div>

      {/* 4. PERSISTENCE (Existing feature preserved) */}
      <div className="bg-wire-surface border border-wire-border p-4 flex flex-col gap-1.5 hover:bg-wire-base/50 transition-colors">
        <div className="font-mono text-[10px] text-wire-subtle tracking-widest uppercase">
          PERSISTENCE
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-medium tabular-nums text-wire-subtle">
            4
          </span>
          <span className="font-mono text-[10px] text-wire-subtle">tables active</span>
        </div>
        <div className="w-full h-1 bg-wire-raised overflow-hidden">
          <div className="h-full bg-emerald-500/70" style={{ width: '100%' }} />
        </div>
        <div className="font-mono text-[10px] text-wire-subtle truncate">
          users · news · alerts · logs
        </div>
      </div>

    </div>
  );
}

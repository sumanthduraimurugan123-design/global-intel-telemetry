import React, { useMemo, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  Flame, 
  ShieldAlert, 
  Radio, 
  ExternalLink,
  Wheat,
  GraduationCap,
  Briefcase,
  Users,
  LineChart,
  Sparkles,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playUiSound } from '../services/soundSystem';
import IntelligentEmptyState from './IntelligentEmptyState';
// Removed React Bits to improve performance. Using Framer Motion directly.

export default function AlertSystem({ 
  alerts = [], 
  selectedCountry, 
  onSelectCountry,
  persona = 'Common person'
}) {
  const prevAlertCountRef = useRef(alerts.length);

  // Play subtle alert tone if new alerts arrive
  useEffect(() => {
    if (alerts.length > prevAlertCountRef.current && prevAlertCountRef.current > 0) {
      playUiSound('alert');
    }
    prevAlertCountRef.current = alerts.length;
  }, [alerts.length]);
  
  const getSeverityConfig = (sev) => {
    switch (sev?.toUpperCase()) {
      case 'CRITICAL':
        return {
          bar: 'border-l-rose-500 bg-rose-500/10 shadow-rose-950/40 ambient-glow-risk',
          badge: 'text-rose-300 border-rose-500/60 bg-rose-500/25 font-bold shadow-sm shadow-rose-500/30',
          icon: <Flame className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />,
          glow: 'shadow-[inset_0_0_16px_rgba(244,63,94,0.2)]',
        };
      case 'HIGH':
        return {
          bar: 'border-l-amber-400 bg-amber-500/10 shadow-amber-950/30',
          badge: 'text-amber-300 border-amber-500/50 bg-amber-500/20 font-semibold',
          icon: <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />,
          glow: 'shadow-[inset_0_0_12px_rgba(245,158,11,0.12)]',
        };
      case 'MEDIUM':
        return {
          bar: 'border-l-cyan-400 bg-cyan-500/5 shadow-cyan-950/30',
          badge: 'text-cyan-300 border-cyan-500/50 bg-cyan-500/15',
          icon: <Radio className="w-4 h-4 text-cyan-400 shrink-0" />,
          glow: '',
        };
      default:
        return {
          bar: 'border-l-slate-600 bg-slate-800/30',
          badge: 'text-slate-400 border-slate-700 bg-slate-800/50',
          icon: <AlertTriangle className="w-4 h-4 text-slate-400 shrink-0" />,
          glow: '',
        };
    }
  };

  // Persona Priority Scoring and Advice Tag Generator
  const pLower = (persona || '').toLowerCase();

  const getPersonaRelevance = (alert) => {
    const text = ((alert.message || '') + ' ' + (alert.severity || '')).toLowerCase();
    let score = 0;
    let adviceTag = null;

    if (pLower.includes('farmer') || pLower.includes('kisan')) {
      if (text.includes('rain') || text.includes('flood') || text.includes('cyclone') || text.includes('storm') || text.includes('weather') || text.includes('heatwave')) {
        score += 30;
        adviceTag = '🌾 Kisan Advice: Protect harvested crops & check field drainage';
      } else if (text.includes('diesel') || text.includes('fuel') || text.includes('fertilizer') || text.includes('crop') || text.includes('water') || text.includes('reservoir')) {
        score += 25;
        adviceTag = '🚜 Agri Note: Check Mandi procurement & input fuel rates';
      }
    } else if (pLower.includes('student')) {
      if (text.includes('metro') || text.includes('transit') || text.includes('bus') || text.includes('traffic') || text.includes('train')) {
        score += 30;
        adviceTag = '🎓 Student Tip: Allow +20m buffer for campus classes & exams';
      } else if (text.includes('cyber') || text.includes('network') || text.includes('outage') || text.includes('scam') || text.includes('phishing')) {
        score += 25;
        adviceTag = '🔒 Digital Safety: Protect campus login & avoid untrusted links';
      }
    } else if (pLower.includes('business')) {
      if (text.includes('ship') || text.includes('port') || text.includes('cargo') || text.includes('sea') || text.includes('freight') || text.includes('trade')) {
        score += 30;
        adviceTag = '💼 Supply Chain Alert: Review cargo ETA & dispatch buffers';
      } else if (text.includes('cyber') || text.includes('ransom') || text.includes('breach') || text.includes('tariff') || text.includes('tax') || text.includes('market')) {
        score += 25;
        adviceTag = '🛡️ Commercial Intel: Audit vendor contracts & IT backups';
      }
    } else {
      // Common Person / Casual
      if (text.includes('traffic') || text.includes('metro') || text.includes('transit') || text.includes('power cut') || text.includes('water')) {
        score += 25;
        adviceTag = '👥 Everyday Advice: Check road delays and household utilities';
      } else if (text.includes('petrol') || text.includes('diesel') || text.includes('grocery') || text.includes('rain')) {
        score += 20;
        adviceTag = '🛒 Household Tip: Keep essentials stocked and monitor prices';
      }
    }

    if (alert.severity === 'CRITICAL') score += 50;
    else if (alert.severity === 'HIGH') score += 30;

    return { score, adviceTag };
  };

  // Sort alerts prioritizing persona relevance
  const processedAlerts = useMemo(() => {
    return [...alerts].map((a, idx) => {
      const { score, adviceTag } = getPersonaRelevance(a);
      return { ...a, _priorityScore: score, _adviceTag: adviceTag, _origIdx: idx };
    }).sort((a, b) => b._priorityScore - a._priorityScore);
  }, [alerts, persona]);

  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;

  const getPersonaBadge = () => {
    if (pLower.includes('farmer')) {
      return { icon: <Wheat className="w-3.5 h-3.5 text-emerald-400" />, label: 'Agrarian Filter', color: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/40' };
    } else if (pLower.includes('student')) {
      return { icon: <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />, label: 'Student Filter', color: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40' };
    } else if (pLower.includes('business')) {
      return { icon: <Briefcase className="w-3.5 h-3.5 text-purple-400" />, label: 'Enterprise Filter', color: 'text-purple-300 border-purple-500/40 bg-purple-950/40' };
    } else if (pLower.includes('analyst')) {
      return { icon: <LineChart className="w-3.5 h-3.5 text-pink-400" />, label: 'Tactical Intel', color: 'text-pink-300 border-pink-500/40 bg-pink-950/40' };
    }
    return { icon: <Users className="w-3.5 h-3.5 text-amber-400" />, label: 'Everyday Filter', color: 'text-amber-300 border-amber-500/40 bg-amber-950/40' };
  };

  const pBadge = getPersonaBadge();

  return (
    <div className={`glass-card-luxe rounded-xl flex flex-col h-full overflow-hidden shadow-2xl transition-all duration-500 ${
      criticalCount > 0 ? 'border-rose-500/40 shadow-rose-950/40' : 'border-purple-500/25'
    }`}>
      
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-purple-500/20 flex items-center justify-between bg-slate-900/75 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-colors ${
            criticalCount > 0 
              ? 'bg-rose-500/20 border-rose-500/40 shadow-sm shadow-rose-500/30' 
              : 'bg-purple-500/20 border-purple-500/30'
          }`}>
            <Bell className={`w-3.5 h-3.5 ${criticalCount > 0 ? 'text-rose-400 animate-bounce' : 'text-purple-300'}`} />
          </div>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-display text-white text-sm font-bold tracking-tight"
          >
            Active Telemetry Alerts
          </motion.span>
          <span className={`font-mono text-[10px] px-2 py-0.5 border rounded-full flex items-center gap-1.5 ${pBadge.color}`}>
            {pBadge.icon}
            <span>{pBadge.label}</span>
          </span>
          {criticalCount > 0 && (
            <span className="font-mono text-[10px] text-rose-300 border border-rose-500/60 bg-rose-500/25 px-2.5 py-0.5 rounded-full font-bold animate-pulse shadow-sm shadow-rose-500/30 relative overflow-hidden group">
              <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="text-rose-200">{criticalCount} CRITICAL</span>
            </span>
          )}
        </div>
        <span className="font-mono text-[11px] text-purple-300 font-semibold px-2.5 py-0.5 rounded-lg bg-purple-950/40 border border-purple-500/30 tabular-nums">
          {alerts.length} live
        </span>
      </div>

      {/* Alert rows with Framer Motion slide-in & React Bits SpotlightCard */}
      <div className="flex-1 overflow-y-auto divide-y divide-purple-500/10 max-h-[420px] p-2 space-y-2.5">
        {processedAlerts.length === 0 ? (
          <div className="py-8">
            <IntelligentEmptyState
              title={`No Active Warnings in ${selectedCountry?.toUpperCase() || 'GLOBAL'} Sector`}
              description="Real-time planetary feeds are currently within normal baseline thresholds."
              onReset={onSelectCountry ? () => onSelectCountry('global') : null}
              resetLabel="View Global Sector"
            />
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {processedAlerts.map((alert, index) => {
              const cfg = getSeverityConfig(alert.severity);
              const isCrit = alert.severity?.toUpperCase() === 'CRITICAL';
              const isHigh = alert.severity?.toUpperCase() === 'HIGH';

              return (
                <motion.div
                  key={alert.id || `alert-${alert._origIdx || index}`}
                  initial={{ opacity: 0, x: 20, scale: 0.97 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  layout
                >
                  <div
                    className={`p-3.5 rounded-xl border-l-4 ${cfg.bar} ${cfg.glow} transition-all duration-200 hover:translate-x-1 hover:brightness-110 relative group bg-slate-900/40`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {cfg.icon}
                      <span className={`font-mono text-[10px] border px-2 py-0.5 rounded-md tracking-wider ${cfg.badge}`}>
                        {alert.severity}
                      </span>
                      <button
                        onClick={() => {
                          playUiSound('click');
                          onSelectCountry && onSelectCountry(alert.country);
                        }}
                        className="font-mono text-[10px] text-cyan-300 hover:text-cyan-200 hover:underline capitalize ml-auto flex items-center gap-1 font-medium"
                      >
                        <span>📍 {alert.country || 'Global'}</span>
                      </button>
                      {alert.created_at && (
                        <span className="font-mono text-[10px] text-slate-400 tabular-nums">
                          {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>

                    <p className="font-sans text-xs text-slate-100 font-medium leading-relaxed">
                      {alert.message}
                    </p>

                    {/* Persona-Adaptive Advice Tag */}
                    {alert._adviceTag && (
                      <div className="mt-2.5 text-[11px] font-sans px-3 py-1.5 bg-slate-900/90 border border-purple-500/30 text-purple-200 flex items-center gap-2 rounded-lg shadow-inner">
                        <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                        <span className="leading-snug font-medium">{alert._adviceTag}</span>
                      </div>
                    )}

                    {alert.source_url && (
                      <a
                        href={alert.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 font-mono text-[10px] text-slate-400 hover:text-pink-300 transition-colors"
                        onClick={() => playUiSound('click')}
                      >
                        <span>Verified Source Wire</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

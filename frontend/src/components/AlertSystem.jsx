import React, { useMemo } from 'react';
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
  Sparkles
} from 'lucide-react';

export default function AlertSystem({ 
  alerts = [], 
  selectedCountry, 
  onSelectCountry,
  persona = 'Common person'
}) {
  
  const getSeverityConfig = (sev) => {
    switch (sev?.toUpperCase()) {
      case 'CRITICAL':
        return {
          bar: 'bg-wire-red',
          badge: 'text-wire-red border-wire-red/50 bg-wire-red/10',
          icon: <Flame className="w-3.5 h-3.5 text-wire-red shrink-0" />,
          rowBg: 'bg-wire-red/5 border-wire-red/20',
        };
      case 'HIGH':
        return {
          bar: 'bg-wire-amber',
          badge: 'text-wire-amber border-wire-amber/50 bg-wire-amber/10',
          icon: <ShieldAlert className="w-3.5 h-3.5 text-wire-amber shrink-0" />,
          rowBg: 'bg-wire-amber/5 border-wire-amber/20',
        };
      case 'MEDIUM':
        return {
          bar: 'bg-wire-blue',
          badge: 'text-wire-blue border-wire-blue/50 bg-wire-blue/10',
          icon: <Radio className="w-3.5 h-3.5 text-wire-blue shrink-0" />,
          rowBg: 'bg-wire-surface border-wire-border',
        };
      default:
        return {
          bar: 'bg-wire-muted',
          badge: 'text-wire-subtle border-wire-border',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-wire-subtle shrink-0" />,
          rowBg: 'bg-wire-surface border-wire-border',
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
      return { icon: <Wheat className="w-3.5 h-3.5 text-emerald-400" />, label: 'Agrarian Filter', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30' };
    } else if (pLower.includes('student')) {
      return { icon: <GraduationCap className="w-3.5 h-3.5 text-sky-400" />, label: 'Student Filter', color: 'text-sky-400 border-sky-500/40 bg-sky-950/30' };
    } else if (pLower.includes('business')) {
      return { icon: <Briefcase className="w-3.5 h-3.5 text-purple-400" />, label: 'Enterprise Filter', color: 'text-purple-400 border-purple-500/40 bg-purple-950/30' };
    } else if (pLower.includes('analyst')) {
      return { icon: <LineChart className="w-3.5 h-3.5 text-wire-amber" />, label: 'Tactical Intel', color: 'text-wire-amber border-wire-amber/40 bg-wire-base' };
    }
    return { icon: <Users className="w-3.5 h-3.5 text-amber-400" />, label: 'Everyday Filter', color: 'text-amber-400 border-amber-500/40 bg-amber-950/20' };
  };

  const pBadge = getPersonaBadge();

  return (
    <div className="bg-wire-surface border border-wire-border flex flex-col h-full shadow-sm">
      
      {/* Header */}
      <div className="px-4 py-3 border-b border-wire-border flex items-center justify-between bg-wire-base/40">
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-wire-fg text-sm font-semibold">Alerts</h2>
          <span className={`font-mono text-[9px] px-1.5 py-0.5 border rounded flex items-center gap-1 ${pBadge.color}`}>
            {pBadge.icon}
            <span>{pBadge.label}</span>
          </span>
          {criticalCount > 0 && (
            <span className="font-mono text-[10px] text-wire-red border border-wire-red/50 bg-wire-red/10 px-1.5 py-0.2">
              {criticalCount} CRITICAL
            </span>
          )}
        </div>
        <span className="font-mono text-[10px] text-wire-subtle tabular-nums">
          {alerts.length} active
        </span>
      </div>

      {/* Alert rows */}
      <div className="flex-1 overflow-y-auto divide-y divide-wire-border/50 max-h-[360px]">
        {processedAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <Radio className="w-6 h-6 text-wire-muted mb-2 animate-pulse" />
            <p className="font-mono text-[11px] text-wire-subtle">
              No alerts active for {selectedCountry?.toUpperCase() || 'GLOBAL'} sector
            </p>
          </div>
        ) : (
          processedAlerts.map((alert, index) => {
            const cfg = getSeverityConfig(alert.severity);
            return (
              <div
                key={alert.id || `alert-${index}`}
                className={`px-4 py-3 border-l-[3px] ${cfg.bar} transition-colors hover:bg-wire-raised/70`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {cfg.icon}
                  <span className={`font-mono text-[10px] border px-1.5 py-0.2 ${cfg.badge}`}>
                    {alert.severity}
                  </span>
                  <button
                    onClick={() => onSelectCountry && onSelectCountry(alert.country)}
                    className="font-mono text-[10px] text-wire-amber hover:underline capitalize ml-auto flex items-center gap-1"
                  >
                    <span>{alert.country || 'Global'}</span>
                  </button>
                  {alert.created_at && (
                    <span className="font-mono text-[10px] text-wire-subtle tabular-nums">
                      {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>

                <p className="font-serif text-xs text-wire-fg leading-snug">
                  {alert.message}
                </p>

                {/* Persona-Adaptive Advice Tag */}
                {alert._adviceTag && (
                  <div className="mt-2 text-[11px] font-sans px-2.5 py-1 bg-wire-base border border-wire-border/80 text-wire-fg/90 flex items-center gap-1.5 rounded-sm">
                    <Sparkles className="w-3 h-3 text-wire-amber shrink-0" />
                    <span>{alert._adviceTag}</span>
                  </div>
                )}

                {alert.source_url && (
                  <a
                    href={alert.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1.5 font-mono text-[10px] text-wire-subtle hover:text-wire-amber transition-colors"
                  >
                    <span>Verified Wire</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

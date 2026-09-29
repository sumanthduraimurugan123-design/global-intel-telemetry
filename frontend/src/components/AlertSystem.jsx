import React, { useMemo, useEffect, useRef, useState } from 'react';
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
  Bell,
  PhoneCall,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Smartphone,
  Phone,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playUiSound } from '../services/soundSystem';
import IntelligentEmptyState from './IntelligentEmptyState';
import OutreachSystem from './OutreachSystem';
import { sendSmsAlert, makeCallAlert } from '../services/outreachService';

export default function AlertSystem({ 
  alerts = [], 
  selectedCountry, 
  onSelectCountry,
  persona = 'Common person'
}) {
  const prevAlertCountRef = useRef(alerts.length);
  const [isOutreachOpen, setIsOutreachOpen] = useState(false);

  // Real-time Phone Alert Dispatcher State
  const [phoneNumber, setPhoneNumber] = useState('+919876543210');
  const [alertMessage, setAlertMessage] = useState('Heavy rain expected in your area. Stay safe.');
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [isMakingCall, setIsMakingCall] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text: '' }
  const [showPhonePanel, setShowPhonePanel] = useState(true);

  // Play subtle alert tone if new alerts arrive
  useEffect(() => {
    if (alerts.length > prevAlertCountRef.current && prevAlertCountRef.current > 0) {
      playUiSound('alert');
    }
    prevAlertCountRef.current = alerts.length;
  }, [alerts.length]);

  // Phone number E.164 international validator
  const validatePhone = (num) => {
    if (!num) return false;
    const clean = num.replace(/[\s\-\(\)]/g, '').trim();
    return /^\+[1-9]\d{7,14}$/.test(clean);
  };

  // Handler: Send Real SMS
  const handleSendSms = async () => {
    playUiSound('click');
    setFeedback(null);

    const clean = phoneNumber.replace(/[\s\-\(\)]/g, '').trim();
    if (!validatePhone(clean)) {
      setFeedback({
        type: 'error',
        text: 'Please enter a valid international phone number starting with + (e.g. +91XXXXXXXXXX).'
      });
      return;
    }

    setIsSendingSms(true);
    try {
      const msg = alertMessage.trim() || 'Heavy rain expected in your area. Stay safe.';
      const res = await sendSmsAlert(clean, msg);
      
      setFeedback({
        type: 'success',
        text: res.message || 'Alert sent successfully',
        details: res.sid ? `Twilio SID: ${res.sid}` : null
      });
      playUiSound('alert');
    } catch (err) {
      console.error('SMS Dispatch Error:', err);
      setFeedback({
        type: 'error',
        text: err.message || 'Failed to send SMS. Please verify your phone number or backend configuration.'
      });
    } finally {
      setIsSendingSms(false);
    }
  };

  // Handler: Trigger Real Automated Voice Call
  const handleMakeCall = async () => {
    playUiSound('click');
    setFeedback(null);

    const clean = phoneNumber.replace(/[\s\-\(\)]/g, '').trim();
    if (!validatePhone(clean)) {
      setFeedback({
        type: 'error',
        text: 'Please enter a valid international phone number starting with + (e.g. +91XXXXXXXXXX).'
      });
      return;
    }

    setIsMakingCall(true);
    try {
      const msg = alertMessage.trim() || 'Alert. Fuel prices may increase. Plan accordingly.';
      const res = await makeCallAlert(clean, msg);

      setFeedback({
        type: 'success',
        text: res.message || 'Alert sent successfully',
        details: res.sid ? `Twilio Call SID: ${res.sid}` : null
      });
      playUiSound('alert');
    } catch (err) {
      console.error('Call Dispatch Error:', err);
      setFeedback({
        type: 'error',
        text: err.message || 'Failed to place call. Please verify your phone number or backend configuration.'
      });
    } finally {
      setIsMakingCall(false);
    }
  };

  // Quick preset selector
  const setPresetMessage = (msg) => {
    playUiSound('click');
    setAlertMessage(msg);
  };
  
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
      <div className="px-4 py-3 border-b border-purple-500/20 flex items-center justify-between bg-slate-900/80 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-colors ${
            criticalCount > 0 
              ? 'bg-rose-500/20 border-rose-500/40 shadow-sm shadow-rose-500/30' 
              : 'bg-purple-500/20 border-purple-500/30'
          }`}>
            <Bell className={`w-3.5 h-3.5 ${criticalCount > 0 ? 'text-rose-400 animate-bounce' : 'text-purple-300'}`} />
          </div>
          <span className="font-display text-white text-sm font-bold tracking-tight">
            Active Telemetry Alerts
          </span>
          <span className={`font-mono text-[10px] px-2 py-0.5 border rounded-full flex items-center gap-1.5 ${pBadge.color}`}>
            {pBadge.icon}
            <span>{pBadge.label}</span>
          </span>
          {criticalCount > 0 && (
            <span className="font-mono text-[10px] text-rose-300 border border-rose-500/60 bg-rose-500/25 px-2.5 py-0.5 rounded-full font-bold animate-pulse shadow-sm shadow-rose-500/30 relative overflow-hidden group">
              <span className="text-rose-200">{criticalCount} CRITICAL</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playUiSound('click');
              setIsOutreachOpen(true);
            }}
            className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 hover:border-emerald-400 font-mono text-[10px] font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-500/10 transition-all hover:scale-105"
          >
            <PhoneCall className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>📢 Outreach (IVR / WA)</span>
          </button>
          <span className="font-mono text-[11px] text-purple-300 font-semibold px-2.5 py-0.5 rounded-lg bg-purple-950/40 border border-purple-500/30 tabular-nums">
            {alerts.length} live
          </span>
        </div>
      </div>

      {/* Outreach modal dialog */}
      <OutreachSystem
        isOpen={isOutreachOpen}
        onClose={() => setIsOutreachOpen(false)}
        currentPersona={persona}
        currentLocation={selectedCountry || 'Global'}
      />

      {/* 🚀 REAL-TIME PHONE ALERT DISPATCH PANEL (SMS & VOICE CALL) */}
      <div className="border-b border-purple-500/20 bg-slate-950/70 p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              Live Phone Alert Dispatcher
            </span>
            <span className="font-mono text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
              Real Carrier API
            </span>
          </div>

          <button
            onClick={() => {
              playUiSound('click');
              setShowPhonePanel(!showPhonePanel);
            }}
            className="text-slate-400 hover:text-white text-xs flex items-center gap-1 font-mono transition-colors"
          >
            <span>{showPhonePanel ? 'Collapse' : 'Expand'}</span>
            {showPhonePanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showPhonePanel && (
          <div className="space-y-3 pt-1">
            {/* Phone Number Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-mono text-slate-300 flex items-center gap-1">
                  <span>Target Phone Number:</span>
                  <span className="text-[10px] text-amber-400/90">(International Format Required)</span>
                </label>
                <span className="text-[10px] font-mono text-slate-500">e.g. +91XXXXXXXXXX</span>
              </div>
              <div className="relative">
                <input
                  type="tel"
                  id="phone-alert-number-input"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91XXXXXXXXXX"
                  className="w-full bg-slate-900 border border-purple-500/40 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-500 transition-all outline-none"
                />
                <span className="absolute right-3 top-2.5 text-[10px] font-mono text-emerald-400/80">
                  {phoneNumber.startsWith('+') ? '✓ Format OK' : 'Must start with +'}
                </span>
              </div>
            </div>

            {/* Alert Message Text */}
            <div>
              <label className="text-[11px] font-mono text-slate-300 block mb-1">
                Alert Message Payload:
              </label>
              <textarea
                id="phone-alert-message-input"
                rows={2}
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                placeholder="Enter alert message to be transmitted..."
                className="w-full bg-slate-900 border border-purple-500/30 focus:border-cyan-400 rounded-lg p-2 text-xs text-slate-200 placeholder-slate-500 outline-none resize-none font-sans"
              />
            </div>

            {/* Preset Message Quick Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono text-slate-400 mr-1">Presets:</span>
              <button
                type="button"
                onClick={() => setPresetMessage('Heavy rain expected in your area. Stay safe.')}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-colors"
              >
                🌧️ Rain Alert
              </button>
              <button
                type="button"
                onClick={() => setPresetMessage('Alert. Fuel prices may increase. Plan accordingly.')}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-700 hover:border-amber-400 text-amber-300 transition-colors"
              >
                ⛽ Fuel Price
              </button>
              <button
                type="button"
                onClick={() => setPresetMessage('Transit alert: Metro & bus delays reported. Allow extra travel time.')}
                className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-slate-700 hover:border-purple-400 text-purple-300 transition-colors"
              >
                🚌 Transit Advisory
              </button>
            </div>

            {/* Dual Action Buttons: "Send SMS" and "Call Alert" */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {/* Button 1: Send SMS */}
              <button
                type="button"
                id="send-sms-button"
                onClick={handleSendSms}
                disabled={isSendingSms || isMakingCall}
                className="py-2.5 px-3 rounded-lg font-mono text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/40 shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isSendingSms ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending SMS...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Send SMS</span>
                  </>
                )}
              </button>

              {/* Button 2: Call Alert */}
              <button
                type="button"
                id="call-alert-button"
                onClick={handleMakeCall}
                disabled={isSendingSms || isMakingCall}
                className="py-2.5 px-3 rounded-lg font-mono text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 border border-amber-400/40 shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isMakingCall ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Dialing Voice...</span>
                  </>
                ) : (
                  <>
                    <PhoneCall className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                    <span>Call Alert</span>
                  </>
                )}
              </button>
            </div>

            {/* Feedback Notifications (Success / Error) */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className={`p-2.5 rounded-lg border text-xs font-mono flex items-start justify-between gap-2 ${
                    feedback.type === 'success'
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200 shadow-md shadow-emerald-950/40'
                      : 'bg-rose-950/80 border-rose-500/50 text-rose-200 shadow-md shadow-rose-950/40'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {feedback.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-bold block">{feedback.text}</span>
                      {feedback.details && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">{feedback.details}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setFeedback(null)}
                    className="text-slate-400 hover:text-white p-0.5 shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Alert rows with Framer Motion slide-in & React Bits SpotlightCard */}
      <div className="flex-1 overflow-y-auto divide-y divide-purple-500/10 max-h-[380px] p-2 space-y-2.5">
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
                    className={`p-3 rounded-xl border-l-4 ${cfg.bar} ${cfg.glow} transition-all duration-200 hover:translate-x-1 hover:brightness-110 relative group bg-slate-900/40`}
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
                      <div className="mt-2 text-[11px] font-sans px-3 py-1.5 bg-slate-900/90 border border-purple-500/30 text-purple-200 flex items-center gap-2 rounded-lg shadow-inner">
                        <Sparkles className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                        <span className="leading-snug font-medium">{alert._adviceTag}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-purple-500/10">
                      {/* One-click: Load this alert into the Phone Dispatcher */}
                      <button
                        type="button"
                        onClick={() => {
                          playUiSound('click');
                          setAlertMessage(alert.message);
                          setShowPhonePanel(true);
                          const el = document.getElementById('phone-alert-number-input');
                          if (el) el.focus();
                        }}
                        className="inline-flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-400 px-2 py-1 rounded transition-colors"
                      >
                        <Smartphone className="w-3 h-3" />
                        <span>Send Alert to Phone</span>
                      </button>

                      {alert.source_url && (
                        <a
                          href={alert.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[10px] text-slate-400 hover:text-pink-300 transition-colors"
                          onClick={() => playUiSound('click')}
                        >
                          <span>Verified Source Wire</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
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

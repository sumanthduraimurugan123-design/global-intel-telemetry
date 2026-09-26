import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  MessageSquare, 
  Radio, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Zap, 
  ShieldAlert, 
  Users, 
  QrCode, 
  PhoneMissed, 
  Send, 
  RefreshCw, 
  X, 
  Sparkles, 
  Wheat, 
  GraduationCap, 
  Briefcase, 
  Globe,
  BellRing,
  Smartphone,
  Phone,
  FileText,
  Play,
  Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playUiSound } from '../services/soundSystem';
import { 
  registerMissedCall, 
  registerWhatsApp, 
  fetchSubscribers, 
  fetchDispatchLogs, 
  triggerEmergencyOutreach, 
  playSimulatedVoiceCall 
} from '../services/outreachService';

export default function OutreachSystem({ isOpen, onClose, currentPersona = 'Common Person', currentLocation = 'Global' }) {
  const [activeTab, setActiveTab] = useState('missedcall'); // 'missedcall', 'whatsapp', 'trigger', 'logs'

  // Registration Form States
  const [missedPhone, setMissedPhone] = useState('+91 98765 43210');
  const [missedLoc, setMissedLoc] = useState(currentLocation !== 'Global' ? currentLocation : 'India');
  const [missedPersona, setMissedPersona] = useState(currentPersona.toLowerCase().includes('farmer') ? 'Farmer / Kisan' : 'Farmer / Kisan');

  const [waPhone, setWaPhone] = useState('+91 91234 56789');
  const [waLoc, setWaLoc] = useState(currentLocation !== 'Global' ? currentLocation : 'India');
  const [waPersona, setWaPersona] = useState(currentPersona.toLowerCase().includes('student') ? 'Student' : 'Student');

  // Broadcast Trigger Form States
  const [broadcastPreset, setBroadcastPreset] = useState('weather');
  const [broadcastLoc, setBroadcastLoc] = useState('India');
  const [broadcastPersona, setBroadcastPersona] = useState('Farmer / Kisan');
  const [customMsg, setCustomMsg] = useState('Heavy rain expected in your area tomorrow. Protect harvested crops in shed and stay indoors.');

  // Data States
  const [subscribersData, setSubscribersData] = useState({ total: 0, buttonPhones: 0, smartphones: 0, subscribers: [] });
  const [logsData, setLogsData] = useState({ total: 0, logs: [] });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Audio simulation state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentSpeechText, setCurrentSpeechText] = useState('');

  // Preset options
  const PRESETS = [
    {
      id: 'weather',
      title: '🌧️ Heavy Rain & Flood Warning',
      persona: 'Farmer / Kisan',
      location: 'India',
      message: 'Heavy rain expected in your area tomorrow. Protect harvested crops in shed and stay indoors. Stay safe.'
    },
    {
      id: 'fuel',
      title: '⛽ Fuel Price Surge Alert',
      persona: 'Student',
      location: 'India',
      message: 'Fuel prices will increase by ₹3 tonight. Travel and bus pass costs may rise. Plan monthly budget.'
    },
    {
      id: 'transport',
      title: '🚌 Transport Strike Notice',
      persona: 'Student',
      location: 'India',
      message: 'City bus and metro strike reported tomorrow. Classes delayed. Keep 30 min extra travel buffer.'
    },
    {
      id: 'power',
      title: '⚡ Power Outage Advisory',
      persona: 'Common Person',
      location: 'United States',
      message: 'Power line maintenance tonight from 10 PM to 4 AM. Charge phone battery and keep emergency lights ready.'
    }
  ];

  // Load data on open
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [subs, logs] = await Promise.all([fetchSubscribers(), fetchDispatchLogs()]);
      setSubscribersData(subs);
      setLogsData(logs);
    } catch (err) {
      console.error('Error loading outreach data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMissedCallRegister = async (e) => {
    e.preventDefault();
    playUiSound('click');
    setLoading(true);
    setFeedback(null);
    try {
      const res = await registerMissedCall(missedPhone, missedLoc, missedPersona);
      setFeedback({ type: 'success', text: res.message || 'Registered button phone user successfully!' });
      playUiSound('toggle');
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppRegister = async (e) => {
    e.preventDefault();
    playUiSound('click');
    setLoading(true);
    setFeedback(null);
    try {
      const res = await registerWhatsApp(waPhone, waLoc, waPersona, 'HI');
      setFeedback({ type: 'success', text: res.message || 'Registered WhatsApp user successfully!' });
      playUiSound('toggle');
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerBroadcast = async () => {
    playUiSound('click');
    setLoading(true);
    setFeedback(null);
    try {
      const preset = PRESETS.find(p => p.id === broadcastPreset);
      const res = await triggerEmergencyOutreach({
        alertTitle: preset?.title || 'Emergency Telemetry Alert',
        alertLocation: broadcastLoc,
        persona: broadcastPersona,
        message: customMsg || preset?.message,
        severity: 'HIGH'
      });

      setFeedback({ 
        type: 'success', 
        text: `⚡ Emergency broadcast sent to ${res.result?.dispatched_count || 2} registered phone(s)! Check Logs tab.` 
      });
      playUiSound('alert');
      await loadData();
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Broadcast failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleTestVoiceCall = (text) => {
    playUiSound('click');
    if (isPlayingAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudio(false);
      setCurrentSpeechText('');
      return;
    }

    const textToSpeak = text || customMsg || 'Heavy rain expected in your area tomorrow. Protect harvested crops in shed and stay indoors. Stay safe.';
    setCurrentSpeechText(textToSpeak);
    setIsPlayingAudio(true);

    playSimulatedVoiceCall(textToSpeak, () => {
      setIsPlayingAudio(false);
      setCurrentSpeechText('');
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        
        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-4xl bg-slate-900 border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-purple-500/20 bg-slate-900/90 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/40 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Radio className="w-5 h-5 text-purple-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg font-bold text-white tracking-tight">
                    User Outreach & Alert System
                  </h2>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    NO LOGIN REQUIRED
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Delivering simple-language voice calls to button phones & WhatsApp alerts to smartphones
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playUiSound('click');
                window.speechSynthesis?.cancel();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6 py-3 bg-slate-950/60 border-b border-purple-500/10 font-mono text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px]">Button Phone (IVR)</span>
                <span className="font-bold text-emerald-300">{subscribersData.buttonPhones} Registered</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <Smartphone className="w-4 h-4 text-cyan-400 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px]">Smartphones (WhatsApp)</span>
                <span className="font-bold text-cyan-300">{subscribersData.smartphones} Subscribed</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <BellRing className="w-4 h-4 text-pink-400 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px]">Dispatched Alerts</span>
                <span className="font-bold text-pink-300">{logsData.total} Sent</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-300">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[10px]">Opt-In Mechanism</span>
                <span className="font-bold text-amber-300">Missed Call / WA</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-purple-500/20 bg-slate-900/60 px-6 gap-2 overflow-x-auto">
            <button
              onClick={() => { playUiSound('click'); setActiveTab('missedcall'); }}
              className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'missedcall' 
                  ? 'border-emerald-400 text-emerald-300 bg-emerald-500/10' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <PhoneMissed className="w-4 h-4" />
              <span>1. Missed Call (Button Phone)</span>
            </button>

            <button
              onClick={() => { playUiSound('click'); setActiveTab('whatsapp'); }}
              className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'whatsapp' 
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>2. WhatsApp System</span>
            </button>

            <button
              onClick={() => { playUiSound('click'); setActiveTab('trigger'); }}
              className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'trigger' 
                  ? 'border-pink-400 text-pink-300 bg-pink-500/10' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>3. Trigger Broadcast</span>
            </button>

            <button
              onClick={() => { playUiSound('click'); setActiveTab('logs'); }}
              className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === 'logs' 
                  ? 'border-purple-400 text-purple-300 bg-purple-500/10' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>4. Delivery Logs & Subscribers</span>
            </button>
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div className={`mx-6 mt-4 p-3 rounded-xl border text-xs font-medium flex items-center justify-between ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{feedback.text}</span>
              </div>
              <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Main Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* TAB 1: MISSED CALL (BUTTON PHONE) */}
            {activeTab === 'missedcall' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form Card */}
                <div className="glass-card-luxe p-5 rounded-2xl border border-emerald-500/30 bg-slate-900/60 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <PhoneMissed className="w-4 h-4" />
                    <h3>Simulate Missed Call Registration</h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Button phone users can simply dial our virtual toll-free number <span className="font-mono text-emerald-300 font-bold">+1-800-UGI-ALERTS</span> or give a missed call. The number is automatically registered for automated IVR voice calls in simple language.
                  </p>

                  <form onSubmit={handleMissedCallRegister} className="space-y-3 font-sans text-xs">
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Phone Number (Button Phone):</label>
                      <input
                        type="text"
                        value={missedPhone}
                        onChange={(e) => setMissedPhone(e.target.value)}
                        required
                        className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-white font-mono text-xs"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">User Location / District:</label>
                      <select
                        value={missedLoc}
                        onChange={(e) => setMissedLoc(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-white text-xs"
                      >
                        <option value="India">India (Punjab / Regional)</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Global">Global Baseline</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Persona Type:</label>
                      <select
                        value={missedPersona}
                        onChange={(e) => setMissedPersona(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-white text-xs"
                      >
                        <option value="Farmer / Kisan">🌾 Farmer / Kisan (Agri Weather & Mandi focus)</option>
                        <option value="Common Person">👥 Common Person (Household & Weather focus)</option>
                        <option value="Student">🎓 Student (Transit & Exam focus)</option>
                        <option value="Business Owner">💼 Business Owner (Logistics & Fuel focus)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>{loading ? 'Registering...' : '📞 Simulate Missed Call Opt-In'}</span>
                    </button>
                  </form>
                </div>

                {/* Voice Call Demo Box */}
                <div className="glass-card-luxe p-5 rounded-2xl border border-emerald-500/20 bg-slate-950/80 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest font-bold">
                        AUTOMATED VOICE CALL SAMPLE (IVR)
                      </span>
                      <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 rounded-full font-mono">
                        TTS Synthesizer Ready
                      </span>
                    </div>
                    <h4 className="text-white font-bold text-sm mb-2">
                      Simple Language Audio Readout for Button Phones
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      When a high-risk event occurs, our server dials registered button phone users and speaks an ultra-clear, simple message without technical jargon.
                    </p>

                    <div className="p-3.5 bg-slate-900 border border-emerald-500/30 rounded-xl text-xs text-emerald-200 font-mono leading-relaxed space-y-2">
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] pb-1 border-b border-slate-800">
                        <PhoneCall className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                        <span>INCOMING CALL FROM TELEMETRY BOT...</span>
                      </div>
                      <p>
                        "Heavy rain expected in your area tomorrow. Protect harvested crops in shed and stay indoors. Stay safe."
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleTestVoiceCall('Heavy rain expected in your area tomorrow. Protect harvested crops in shed and stay indoors. Stay safe.')}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      isPlayingAudio 
                        ? 'bg-rose-500 text-white animate-pulse' 
                        : 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30'
                    }`}
                  >
                    {isPlayingAudio ? (
                      <>
                        <Square className="w-4 h-4 fill-current" />
                        <span>Playing Voice Call Audio... (Click to Stop)</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        <span>🔊 Hear Automated Voice Call Demo Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: WHATSAPP SYSTEM */}
            {activeTab === 'whatsapp' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Registration Form */}
                <div className="glass-card-luxe p-5 rounded-2xl border border-cyan-500/30 bg-slate-900/60 space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                    <MessageSquare className="w-4 h-4" />
                    <h3>WhatsApp Opt-In (Smartphone Users)</h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Smartphone users can send a WhatsApp message <span className="font-mono text-cyan-300 font-bold">"HI"</span> to <span className="font-mono text-cyan-300 font-bold">+91 91234 56789</span>. They receive plain-language alerts as both text messages and voice notes.
                  </p>

                  <form onSubmit={handleWhatsAppRegister} className="space-y-3 font-sans text-xs">
                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">WhatsApp Phone Number:</label>
                      <input
                        type="text"
                        value={waPhone}
                        onChange={(e) => setWaPhone(e.target.value)}
                        required
                        className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white font-mono text-xs"
                        placeholder="+91 91234 56789"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Location:</label>
                      <select
                        value={waLoc}
                        onChange={(e) => setWaLoc(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white text-xs"
                      >
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Global">Global</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 text-[11px] mb-1">Persona Filter:</label>
                      <select
                        value={waPersona}
                        onChange={(e) => setWaPersona(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-3 py-2 text-white text-xs"
                      >
                        <option value="Student">🎓 Student (Transit & Exam focus)</option>
                        <option value="Farmer / Kisan">🌾 Farmer / Kisan (Agri Weather focus)</option>
                        <option value="Business Owner">💼 Business Owner (Logistics & Fuel focus)</option>
                        <option value="Common Person">👥 Common Person (Household focus)</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{loading ? 'Subscribing...' : '💬 Send "HI" via WhatsApp Opt-In'}</span>
                    </button>
                  </form>
                </div>

                {/* Simulated WhatsApp UI */}
                <div className="glass-card-luxe p-4 rounded-2xl border border-cyan-500/20 bg-slate-950 flex flex-col h-[340px]">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-xs font-semibold text-slate-200">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <MessageSquare className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span>Global Telemetry WhatsApp Bot</span>
                      <span className="block text-[10px] text-emerald-400 font-mono font-normal">Official Telemetry Channel</span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto py-3 space-y-3 text-xs font-sans">
                    {/* User Sent "HI" */}
                    <div className="flex justify-end">
                      <div className="bg-emerald-950/80 text-emerald-200 border border-emerald-500/30 px-3 py-2 rounded-xl rounded-tr-none max-w-[80%]">
                        <p>HI</p>
                        <span className="text-[9px] text-emerald-400/60 block text-right mt-1">Just now</span>
                      </div>
                    </div>

                    {/* Bot Response */}
                    <div className="flex justify-start">
                      <div className="bg-slate-900 border border-slate-800 text-slate-200 px-3.5 py-2.5 rounded-xl rounded-tl-none max-w-[85%] space-y-2">
                        <p className="font-semibold text-emerald-400 text-[11px]">
                          ✅ Welcome to Global Intel Emergency Telemetry!
                        </p>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          Your number is subscribed for <strong>{waPersona}</strong> in <strong>{waLoc}</strong>.
                        </p>
                        
                        {/* Audio Voice Note Card */}
                        <div className="mt-2 p-2 bg-slate-950 border border-purple-500/30 rounded-lg flex items-center gap-2">
                          <button
                            onClick={() => handleTestVoiceCall('Fuel prices will increase by 3 rupees tonight. Travel and bus pass costs may rise. Plan monthly budget.')}
                            className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 hover:scale-105 shrink-0"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          <div className="flex-1">
                            <span className="text-[10px] text-purple-300 font-mono block">Voice Note (0:14)</span>
                            <div className="w-full bg-purple-950 h-1.5 rounded-full overflow-hidden mt-0.5">
                              <div className="bg-purple-400 h-full w-2/3 animate-pulse" />
                            </div>
                          </div>
                        </div>

                        <span className="text-[9px] text-slate-500 block text-right">09:42 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: TRIGGER BROADCAST */}
            {activeTab === 'trigger' && (
              <div className="glass-card-luxe p-6 rounded-2xl border border-pink-500/30 bg-slate-900/60 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-pink-400 font-bold text-sm">
                    <Zap className="w-4 h-4 animate-bounce" />
                    <h3>Emergency Alert Dispatch Center</h3>
                  </div>
                  <span className="font-mono text-xs text-pink-300 bg-pink-500/20 border border-pink-500/40 px-2.5 py-0.5 rounded-full">
                    AUTOMATED BROADCAST
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Trigger an high-risk event broadcast. Our system converts the alert into simple, plain language personalized for each registered persona, and dispatches automated Voice Calls to button phone users & WhatsApp messages to smartphones.
                </p>

                {/* Preset Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        playUiSound('click');
                        setBroadcastPreset(preset.id);
                        setBroadcastLoc(preset.location);
                        setBroadcastPersona(preset.persona);
                        setCustomMsg(preset.message);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        broadcastPreset === preset.id
                          ? 'bg-pink-500/15 border-pink-500 text-white shadow-md shadow-pink-500/20'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs text-pink-300 mb-1">{preset.title}</div>
                      <div className="text-[10px] font-mono text-slate-400 mb-1">
                        Target: {preset.persona} ({preset.location})
                      </div>
                      <div className="text-[11px] text-slate-300 line-clamp-2">{preset.message}</div>
                    </button>
                  ))}
                </div>

                {/* Custom Message Field */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">Generated Plain Language Message:</label>
                  <textarea
                    rows={3}
                    value={customMsg}
                    onChange={(e) => setCustomMsg(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-pink-500 rounded-xl p-3 text-xs text-white leading-relaxed font-sans"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleTriggerBroadcast}
                    disabled={loading}
                    className="flex-1 py-3 px-5 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xs rounded-xl shadow-xl shadow-pink-500/25 hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    <span>{loading ? 'Broadcasting...' : '🚀 Dispatch Emergency Alert Now'}</span>
                  </button>

                  <button
                    onClick={() => handleTestVoiceCall(customMsg)}
                    className="py-3 px-4 bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-xs rounded-xl hover:bg-purple-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>🔊 Listen to Voice Call</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: DELIVERY LOGS & SUBSCRIBERS */}
            {activeTab === 'logs' && (
              <div className="space-y-6">
                {/* Active Subscribers */}
                <div className="glass-card-luxe p-5 rounded-2xl border border-purple-500/20 bg-slate-900/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-purple-300 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Opted-In Subscribers ({subscribersData.subscribers.length})</span>
                    </h3>
                    <button
                      onClick={loadData}
                      className="text-[11px] font-mono text-slate-400 hover:text-white flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Refresh</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead>
                        <tr className="border-b border-purple-500/20 text-slate-400 font-mono text-[10px]">
                          <th className="py-2 px-3">PHONE NUMBER</th>
                          <th className="py-2 px-3">PHONE TYPE</th>
                          <th className="py-2 px-3">CHANNEL</th>
                          <th className="py-2 px-3">LOCATION</th>
                          <th className="py-2 px-3">PERSONA</th>
                          <th className="py-2 px-3">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-500/10">
                        {subscribersData.subscribers.map((sub) => (
                          <tr key={sub.id} className="hover:bg-slate-800/40 text-slate-200">
                            <td className="py-2.5 px-3 font-mono text-[11px]">
                              {sub.phone.slice(0, 7)}****{sub.phone.slice(-3)}
                            </td>
                            <td className="py-2.5 px-3">
                              {sub.phone_type === 'button_phone' ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  📞 Button Phone
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                  💬 Smartphone
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[11px] capitalize">{sub.channel}</td>
                            <td className="py-2.5 px-3">{sub.location}</td>
                            <td className="py-2.5 px-3 font-medium text-purple-300">{sub.persona}</td>
                            <td className="py-2.5 px-3 font-mono text-[10px] text-emerald-400">● OPTED-IN</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Dispatch Logs */}
                <div className="glass-card-luxe p-5 rounded-2xl border border-purple-500/20 bg-slate-900/60 space-y-3">
                  <h3 className="text-xs font-bold text-purple-300 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>Dispatched Alert Logs ({logsData.logs.length})</span>
                  </h3>

                  <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
                    {logsData.logs.map((log) => (
                      <div key={log.id} className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1 font-sans text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">{log.alert_title}</span>
                          <span className="font-mono text-[10px] text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            {log.delivery_status}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] italic">"{log.simple_message}"</p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono pt-1">
                          <span>Phone: {log.recipient_phone}</span>
                          <span>Channel: {log.channel}</span>
                          <span>Persona: {log.persona}</span>
                          <span>Sent: {new Date(log.dispatched_at).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="px-6 py-3 border-t border-purple-500/20 bg-slate-950 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>🛡️ Privacy Protection: Opt-in only. Zero illegal user tracking.</span>
            <button
              onClick={() => { playUiSound('click'); onClose(); }}
              className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors font-sans font-bold"
            >
              Close Hub
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

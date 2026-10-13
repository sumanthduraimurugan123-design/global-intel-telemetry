import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  X, 
  Send, 
  Minimize2, 
  Maximize2,
  Compass, 
  Radio, 
  Building2, 
  Activity, 
  AlertTriangle, 
  HelpCircle,
  RotateCcw,
  Bot,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playEarcon } from '../services/voiceService';
import { playUiSound } from '../services/soundSystem';

// Clean text for speech synthesis so emojis and markdown symbols aren't pronounced awkwardly
function cleanForSpeech(raw) {
  if (!raw) return '';
  return raw
    .replace(/[#*_`~]/g, '')
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}🌐📡🏙️🚨🔮💡👋👉•✓❌]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Intelligent Conversational Siri NLP Engine
 * Responds to greetings, platform features, navigation commands, geopolitical queries,
 * and everyday conversational questions dynamically.
 */
function processSiriQuery(query, activePage, onNavigatePage, onOpenFutureImpact) {
  const q = (query || '').toLowerCase().trim();

  // 1. GREETINGS & CASUAL INTERACTION
  if (/^(hi|hello|hey|yo|sup|hola|vanakkam|namaste|greetings)(\s|$|[!.,?])/i.test(q)) {
    return {
      text: "Hello! 👋 Great to have you here. I'm your Planetary Telemetry AI Guide. I can take you to the 3D World Explorer, scan crisis alerts on the Event Radar, or walk you through the platform. What would you like to explore?",
      action: {
        type: 'navigate',
        target: 'world-explorer',
        label: 'Explore 3D Earth'
      }
    };
  }

  if (q.includes('good morning') || q.includes('good afternoon') || q.includes('good evening') || q.includes('good day')) {
    return {
      text: "Good day! ☀️ Planetary telemetry sensors and news feeds are live and updating across all 195+ countries. How can I assist your mission today?",
      action: {
        type: 'navigate',
        target: 'dashboard',
        label: 'View Mission Dashboard'
      }
    };
  }

  if (q.includes('how are you') || q.includes('how r u') || q.includes('how are you doing') || q.includes("how's it going")) {
    return {
      text: "I'm doing fantastic, thank you! ⚡ All global telemetry feeds, 3D globes, and alert listeners are operating smoothly. How can I guide you right now?",
      action: null
    };
  }

  if (q.includes('who are you') || q.includes('what is your name') || q.includes('are you siri') || q.includes('are you ammukutty') || q.includes('ammukutty') || q.includes('what are you')) {
    return {
      text: "I am Ammukutty, your personal AI Telemetry Guide! I help you navigate the 3D Earth, monitor crisis alerts, inspect city digital twins, and project geopolitical impacts.",
      action: null
    };
  }

  if (q.includes('thank you') || q.includes('thanks') || q.includes('thx') || q.includes('appreciate it')) {
    return {
      text: "You're very welcome! Always here to assist. Just ask whenever you want to switch sectors or query intelligence.",
      action: null
    };
  }

  if (q.includes('bye') || q.includes('goodbye') || q.includes('see you') || q.includes('cya')) {
    return {
      text: "Goodbye! Stay safe and keep an eye on planetary telemetry. I'll stay right here floating at the corner whenever you need me.",
      action: null
    };
  }

  if (/^(cool|awesome|great|nice|wow|super|amazing|good)(\s|$|[!.,?])/i.test(q)) {
    return {
      text: "Awesome! Let me know if you'd like to test our 3D World Explorer, check the Live Event Radar, or inspect the City Twin.",
      action: null
    };
  }

  // 2. HELP & CAPABILITIES
  if (q.includes('what can you do') || q.includes('features') || q.includes('capabilities') || q.includes('help') || q.includes('commands') || q.includes('guide me')) {
    return {
      text: "Here is what I can do for you:\n• 🌐 Launch 3D World Explorer: Explore 195+ countries, states, and OpenStreetMap amenities.\n• 📡 Open Live Event Radar: Track real-time defense, climate, and cyber events.\n• 🏙️ View City Intelligence Twin: Urban telemetry and infrastructure monitoring.\n• 🚨 Check Alerts: Real-time critical geopolitical warnings.\n• 🗣️ Voice Commands: Tap the mic icon anytime to speak to me naturally!",
      action: {
        type: 'navigate',
        target: 'world-explorer',
        label: 'Try World Explorer'
      }
    };
  }

  // 3. EXPLANATION OF TELEMETRY & PLATFORM
  if (q.includes('what is telemetry') || q.includes('what does this app do') || q.includes('what is this platform') || q.includes('about this project') || q.includes('what is ugi')) {
    return {
      text: "Global Intel & Telemetry (UGI) is a planetary intelligence platform. It tracks real-time verified international news, autonomous crisis alarms, and 3D geospatial infrastructure across 195+ nations, providing actionable insight for analysts and citizens alike.",
      action: {
        type: 'navigate',
        target: 'dashboard',
        label: 'Open Dashboard'
      }
    };
  }

  // 4. WORLD EXPLORER & 3D EARTH NAVIGATION
  if (q.includes('world explorer') || q.includes('explorer') || q.includes('osm') || q.includes('3d earth') || q.includes('globe') || q.includes('map') || q.includes('places') || q.includes('schools') || q.includes('hospitals') || q.includes('overpass')) {
    return {
      text: "The World Explorer AI lets you explore all 195+ sovereign nations in 3D. You can drill down into provinces, states, and cities, then query real-world OpenStreetMap amenities like hospitals, schools, transit stations, and banks with real coordinates.",
      action: {
        type: 'navigate',
        target: 'world-explorer',
        label: 'Launch World Explorer'
      }
    };
  }

  // 5. EVENT RADAR & THREAT TRACKER
  if (q.includes('radar') || q.includes('event radar') || q.includes('live events') || q.includes('threat radar') || q.includes('signals') || q.includes('threat tracker')) {
    return {
      text: "The Live Event Radar tracks planetary events classified into Defense, Climate, Economy, Cyber, and Supply Chain risks with real-time geographic markers on an interactive 3D globe.",
      action: {
        type: 'navigate',
        target: 'event-radar',
        label: 'Open Event Radar'
      }
    };
  }

  // 6. CITY TWIN & CHENNAI
  if (q.includes('city twin') || q.includes('city') || q.includes('digital twin') || q.includes('chennai') || q.includes('urban') || q.includes('grid metrics') || q.includes('velachery') || q.includes('t nagar')) {
    return {
      text: "The City Intelligence Twin monitors urban infrastructure telemetry, district-level safety indices, power grid status, and emergency response assets with micro-locality focus (such as Chennai, Velachery, T. Nagar).",
      action: {
        type: 'navigate',
        target: 'city-intelligence',
        label: 'Explore City Twin'
      }
    };
  }

  // 7. FUTURE IMPACT SIMULATOR
  if (q.includes('future impact') || q.includes('simulator') || q.includes('simulate') || q.includes('consequences') || q.includes('projections')) {
    return {
      text: "The Future Impact Simulator models the cascading economic, supply chain, and personal repercussions of global crises on your sector and lifestyle.",
      action: {
        type: 'special',
        handler: onOpenFutureImpact,
        label: 'Open Impact Simulator'
      }
    };
  }

  // 8. ALERTS & CRISIS WARNINGS
  if (q.includes('alert') || q.includes('threat') || q.includes('warning') || q.includes('emergency') || q.includes('crisis') || q.includes('danger') || q.includes('war') || q.includes('conflict')) {
    return {
      text: "Our autonomous alert engine continuously ingests geopolitical news feeds and classifies threats into CRITICAL, HIGH, MEDIUM, and LOW severity with acoustic earcons. You can see active alerts in the Dashboard or on the Event Radar.",
      action: {
        type: 'navigate',
        target: 'event-radar',
        label: 'Check Threat Radar'
      }
    };
  }

  // 9. WEATHER & CLIMATE
  if (q.includes('weather') || q.includes('rain') || q.includes('cyclone') || q.includes('flood') || q.includes('storm') || q.includes('monsoon') || q.includes('climate')) {
    return {
      text: "Weather and climate threats (cyclones, monsoons, and extreme weather) are tracked live on the Event Radar with environmental category filters.",
      action: {
        type: 'navigate',
        target: 'event-radar',
        label: 'Filter Weather on Radar'
      }
    };
  }

  // 10. ECONOMY & FUEL
  if (q.includes('economy') || q.includes('inflation') || q.includes('fuel') || q.includes('petrol') || q.includes('diesel') || q.includes('oil') || q.includes('jobs') || q.includes('layoffs')) {
    return {
      text: "Economic and energy telemetry tracks price shifts, inflation metrics, and job market trends. You can run simulations to see how fuel price shifts affect household and transit costs.",
      action: {
        type: 'special',
        handler: onOpenFutureImpact,
        label: 'Simulate Economic Impact'
      }
    };
  }

  // 11. SPECIFIC COUNTRIES
  const countries = [
    { name: 'India', keywords: ['india', 'delhi', 'mumbai', 'bangalore', 'tamil nadu'] },
    { name: 'United States', keywords: ['us', 'usa', 'america', 'united states', 'new york', 'washington'] },
    { name: 'Ukraine', keywords: ['ukraine', 'kyiv'] },
    { name: 'Russia', keywords: ['russia', 'moscow'] },
    { name: 'China', keywords: ['china', 'beijing'] },
    { name: 'Taiwan', keywords: ['taiwan', 'taipei'] },
    { name: 'Israel', keywords: ['israel', 'jerusalem', 'tel aviv'] },
    { name: 'Iran', keywords: ['iran', 'tehran'] },
    { name: 'United Kingdom', keywords: ['uk', 'united kingdom', 'london', 'britain'] },
    { name: 'Germany', keywords: ['germany', 'berlin'] },
    { name: 'France', keywords: ['france', 'paris'] },
    { name: 'Japan', keywords: ['japan', 'tokyo'] }
  ];

  for (const c of countries) {
    if (c.keywords.some(k => q.includes(k))) {
      return {
        text: `You asked about ${c.name}. You can explore ${c.name} in 3D on the World Explorer (drill down into states & cities) or inspect real-time news telemetry on the dashboard.`,
        action: {
          type: 'navigate',
          target: 'world-explorer',
          label: `Explore ${c.name} in 3D`
        }
      };
    }
  }

  // 12. PERSONA & ACCESSIBILITY
  if (q.includes('persona') || q.includes('analyst') || q.includes('accessibility') || q.includes('easy mode') || q.includes('large text') || q.includes('contrast')) {
    return {
      text: "The platform supports adaptive operational personas:\n• Analyst: Deep telemetry metrics, raw sentiment, and JSON logs.\n• Casual User: High-level planetary summary.\n• Accessibility Mode: High contrast, large text, and spoken voice briefings.",
      action: {
        type: 'navigate',
        target: 'dashboard',
        label: 'Switch Persona on Dashboard'
      }
    };
  }

  // 13. INTELLIGENT DYNAMIC CONTEXTUAL FALLBACK
  return {
    text: `I understand you're asking about "${query}". I can help you inspect live planetary intelligence on the 3D globe, launch the World Explorer, or view the Event Radar. Where would you like to go?`,
    action: {
      type: 'navigate',
      target: activePage === 'world-explorer' ? 'event-radar' : 'world-explorer',
      label: activePage === 'world-explorer' ? 'Check Event Radar' : 'Launch World Explorer'
    }
  };
}

export default function SiriAssistant({ activePage = 'dashboard', onNavigatePage, onOpenFutureImpact }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'siri',
      text: "Hey! I'm Ammukutty, your AI Planetary Guide. You can ask me anything about the platform, crisis events, 3D Earth, or tell me to navigate for you.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: null
    }
  ]);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Initialize Speech Synthesis & Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = false;
        recog.lang = 'en-US';

        recog.onstart = () => {
          setIsListening(true);
          playEarcon('mic-on');
        };

        recog.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            handleUserMessage(transcript);
          }
        };

        recog.onerror = (event) => {
          console.warn('Siri speech recognition error:', event.error);
          setIsListening(false);
          playEarcon('mic-off');
        };

        recog.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recog;
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Voice synthesis speaking response like Siri
  const speakText = (text) => {
    if (!speechEnabled || !synthRef.current) return;
    try {
      synthRef.current.cancel();
      const cleanText = cleanForSpeech(text);
      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.1; // Friendly natural pitch

      const voices = synthRef.current.getVoices();
      const englishVoice = voices.find(v => (v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Natural')) && v.lang.startsWith('en')) || voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Toggle voice recognition
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      playEarcon('mic-off');
    } else {
      if (!recognitionRef.current) {
        alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
        return;
      }
      stopSpeaking();
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.warn('Failed to start speech recognition:', err);
      }
    }
  };

  // Process user queries and match knowledge / actions
  const handleUserMessage = (rawText) => {
    if (!rawText || !rawText.trim()) return;
    const query = rawText.trim();
    const queryLower = query.toLowerCase();

    playUiSound('click');

    const userMsg = {
      id: Date.now() + '-user',
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      // Process query through smart NLP engine
      const response = processSiriQuery(query, activePage, onNavigatePage, onOpenFutureImpact);

      // Auto-navigate if command explicitly asks to go/open/switch
      if (response.action && response.action.type === 'navigate') {
        if (queryLower.startsWith('go to') || queryLower.startsWith('open') || queryLower.startsWith('switch to') || queryLower.startsWith('launch')) {
          if (onNavigatePage) onNavigatePage(response.action.target);
          response.text += `\nNavigating you there right now!`;
        }
      }

      const botMsg = {
        id: Date.now() + '-siri',
        sender: 'siri',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: response.action
      };

      setMessages(prev => [...prev, botMsg]);
      playEarcon('success');
      speakText(response.text);
    }, 350);
  };

  const handleActionClick = (action) => {
    if (!action) return;
    playUiSound('switch');
    if (action.type === 'navigate' && onNavigatePage) {
      onNavigatePage(action.target);
    } else if (action.type === 'special' && action.handler) {
      action.handler();
    }
  };

  const quickChips = [
    { label: '👋 Say Hi', query: 'Hi' },
    { label: '🌐 World Explorer', query: 'Open World Explorer' },
    { label: '📡 Event Radar', query: 'Check Event Radar' },
    { label: '🏙️ City Twin', query: 'Show City Intelligence Twin' },
    { label: '🚨 Crisis Alerts', query: 'What are the critical alerts?' },
    { label: '💡 What can you do?', query: 'What can you do?' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto select-none">
      
      {/* Siri Floating Orb Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -30 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            className="relative cursor-pointer group"
            onClick={() => {
              playUiSound('open');
              setIsOpen(true);
              setIsMinimized(false);
            }}
          >
            {/* Outer Siri Glow Rings */}
            <div className="absolute -inset-2.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 opacity-60 blur-lg group-hover:opacity-100 transition-opacity animate-pulse" />
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-purple-600 opacity-75 blur-sm animate-spin-slow" />

            {/* Core Siri Orb */}
            <div className="relative w-14 h-14 rounded-full bg-slate-950 p-[2px] shadow-2xl flex items-center justify-center overflow-hidden border border-purple-400/50">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-500 flex items-center justify-center relative">
                {/* Internal Siri Fluid Swirl */}
                <div className="absolute inset-0 bg-radial from-white/40 via-transparent to-transparent opacity-80 animate-ping-slow" />
                <Sparkles className="w-6 h-6 text-white drop-shadow-md animate-pulse" />
              </div>
            </div>

            {/* Floating Ammukutty Badge Pill */}
            <div className="absolute -top-3 -left-16 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-purple-500/40 text-[10px] font-mono font-bold text-cyan-300 shadow-lg backdrop-blur-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Ask Ammukutty
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Siri Interactive Chatbot Floating Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`w-[390px] max-w-[calc(100vw-2rem)] rounded-3xl bg-slate-950/95 backdrop-blur-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden flex flex-col transition-all duration-200 ${
              isMinimized ? 'h-16' : 'h-[530px]'
            }`}
          >
            {/* Header with Siri Glowing Theme */}
            <div className="p-3.5 bg-gradient-to-r from-purple-950/80 via-slate-950 to-cyan-950/80 border-b border-purple-500/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                {/* Mini Siri Animated Orb */}
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-cyan-400 p-[1.5px] shadow-md shadow-purple-500/30">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                    <Sparkles className={`w-4 h-4 text-cyan-300 ${isSpeaking ? 'animate-spin-slow text-pink-400' : isListening ? 'animate-ping text-purple-400' : ''}`} />
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5 font-display">
                    <span>Ammukutty AI Guide</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {isSpeaking ? 'Speaking response...' : isListening ? 'Listening to voice...' : 'Planetary AI Copilot'}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1">
                {/* Voice speech toggle */}
                <button
                  onClick={() => {
                    const next = !speechEnabled;
                    setSpeechEnabled(next);
                    if (!next) stopSpeaking();
                  }}
                  className={`p-1.5 rounded-lg border transition-all ${
                    speechEnabled 
                      ? 'border-purple-500/40 text-purple-300 bg-purple-500/10 hover:bg-purple-500/20' 
                      : 'border-slate-800 text-slate-500 bg-slate-900/60'
                  }`}
                  title={speechEnabled ? "Voice Output Enabled (Click to mute)" : "Voice Output Muted (Click to enable)"}
                >
                  {speechEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>

                {/* Reset messages */}
                <button
                  onClick={() => {
                    playUiSound('click');
                    stopSpeaking();
                    setMessages([
                      {
                        id: 'welcome-reset',
                        sender: 'siri',
                        text: "Conversation reset. Where would you like to explore?",
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      }
                    ]);
                  }}
                  className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 transition-all"
                  title="Clear chat"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Minimize */}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 transition-all"
                  title={isMinimized ? "Expand" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>

                {/* Close */}
                <button
                  onClick={() => {
                    playUiSound('close');
                    stopSpeaking();
                    if (isListening) recognitionRef.current?.stop();
                    setIsOpen(false);
                  }}
                  className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-rose-400 bg-slate-900/60 hover:bg-rose-500/10 transition-all"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Main Chat Body (if not minimized) */}
            {!isMinimized && (
              <>
                {/* Quick Interactive Chips */}
                <div className="px-3 py-2 bg-slate-900/60 border-b border-purple-500/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {quickChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleUserMessage(chip.query)}
                      className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-purple-600/30 border border-purple-500/20 hover:border-purple-400/50 text-[10px] font-mono text-purple-200 transition-all hover:scale-105 active:scale-95"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-3 font-sans text-xs custom-scrollbar">
                  {messages.map((m) => {
                    const isSiri = m.sender === 'siri';
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isSiri ? 'items-start' : 'items-end'}`}
                      >
                        <div
                          className={`max-w-[88%] p-3 rounded-2xl ${
                            isSiri
                              ? 'bg-gradient-to-br from-slate-900 to-purple-950/40 text-slate-200 border border-purple-500/25 rounded-tl-sm shadow-md'
                              : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-tr-sm shadow-md shadow-purple-500/25'
                          }`}
                        >
                          {isSiri && (
                            <div className="flex items-center gap-1 text-[9px] font-mono text-cyan-300 mb-1 font-bold">
                              <Sparkles className="w-3 h-3 text-pink-400" />
                              <span>AMMUKUTTY</span>
                            </div>
                          )}
                          <p className="leading-relaxed whitespace-pre-line text-xs">{m.text}</p>

                          {/* Action Button attached to message */}
                          {m.action && (
                            <button
                              onClick={() => handleActionClick(m.action)}
                              className="mt-2.5 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-[11px] font-semibold shadow-md shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
                            >
                              <span>{m.action.label}</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">
                          {m.timestamp}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Voice Listening Wave Indicator */}
                {isListening && (
                  <div className="px-3 py-1.5 bg-gradient-to-r from-purple-900/60 to-pink-900/60 border-t border-purple-500/30 flex items-center justify-between text-xs text-pink-200 font-mono animate-pulse">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
                      Listening to your voice... Speak now!
                    </span>
                    <button
                      onClick={toggleListening}
                      className="text-[10px] text-pink-300 underline font-semibold"
                    >
                      Done
                    </button>
                  </div>
                )}

                {/* Input Strip */}
                <div className="p-2.5 bg-slate-900/80 border-t border-purple-500/20 flex items-center gap-2">
                  {/* Microphone Speech Trigger */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleListening}
                    className={`p-2 rounded-xl transition-all ${
                      isListening
                        ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/40 animate-pulse'
                        : 'bg-slate-800 text-purple-300 hover:text-white hover:bg-purple-600/30 border border-purple-500/30'
                    }`}
                    title={isListening ? "Listening... Click to stop" : "Speak to Ammukutty (Microphone)"}
                  >
                    {isListening ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4" />}
                  </motion.button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUserMessage(inputText);
                    }}
                    placeholder="Ask Ammukutty or type a command..."
                    className="flex-1 bg-slate-950/80 border border-slate-700/80 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none font-sans"
                  />

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleUserMessage(inputText)}
                    disabled={!inputText.trim()}
                    className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white disabled:opacity-40 transition-all shadow-md shadow-purple-500/20"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </>
            )}

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

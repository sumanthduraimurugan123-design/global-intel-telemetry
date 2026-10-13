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

// Knowledge base responses and intelligent intent routing
const GUIDE_KNOWLEDGE = [
  {
    keywords: ['world explorer', 'explorer', 'osm', '3d earth', 'places', 'schools', 'hospitals', 'overpass'],
    title: 'World Explorer 3D',
    page: 'world-explorer',
    response: "The World Explorer AI lets you explore all 195+ sovereign countries, drill down into states, cities, and discover real-world infrastructure (hospitals, schools, transit, and offices) using 3D Earth and live OpenStreetMap.",
    actionLabel: "Launch World Explorer"
  },
  {
    keywords: ['radar', 'event radar', 'live events', 'threat radar', 'signals'],
    title: 'Live Event Radar',
    page: 'event-radar',
    response: "The Live Event Radar tracks real-time planetary events categorized into defense, climate, economy, cyber, and supply chain threats with live geolocated signals on a 3D Earth.",
    actionLabel: "Open Event Radar"
  },
  {
    keywords: ['city twin', 'city', 'digital twin', 'chennai', 'infrastructure', 'urban'],
    title: 'City Intelligence Twin',
    page: 'city-intelligence',
    response: "The City Intelligence Twin monitors urban infrastructure telemetry, district-level safety, grid metrics, and emergency response assets in real time.",
    actionLabel: "Explore City Twin"
  },
  {
    keywords: ['telemetry', 'dashboard', 'globe', 'home', 'main page', 'overview'],
    title: 'Planetary Telemetry Dashboard',
    page: 'dashboard',
    response: "The Telemetry Dashboard is your central mission control featuring the 3D Planetary Smart Globe, real-time threat alarms, multi-level geographic navigation, and persona matrix.",
    actionLabel: "Go to Telemetry Dashboard"
  },
  {
    keywords: ['alert', 'threat', 'warning', 'emergency', 'crisis', 'danger'],
    title: 'Threat Detection Engine',
    page: null,
    response: "Our autonomous alert engine continuously ingests geopolitical feeds and classifies threats into CRITICAL, HIGH, MEDIUM, and LOW severity with acoustic earcons.",
    actionLabel: null
  },
  {
    keywords: ['future impact', 'simulator', 'impact', 'scenario'],
    title: 'Future Impact Simulator',
    page: null,
    specialAction: 'future-impact',
    response: "The Future Impact Simulator models the cascading economic, supply chain, and personal repercussions of global crises on your sector.",
    actionLabel: "Open Impact Simulator"
  },
  {
    keywords: ['how to use', 'help', 'guide', 'what can you do', 'features', 'who are you', 'siri'],
    title: 'Siri Telemetry Assistant',
    page: null,
    response: "I am your floating Siri AI Copilot! I can navigate you across the platform (World Explorer, Event Radar, City Twin, Dashboard), explain crisis telemetry, read news briefings aloud, and answer your questions via voice or text.",
    actionLabel: null
  }
];

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
      text: "Hey! I'm your Planetary Telemetry AI Guide. Ask me to navigate to World Explorer, inspect crisis events, or guide you through the platform.",
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
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.1; // Siri-like friendly tone

      // Pick high-quality natural voice if available
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

    // Evaluate matching intent
    let matched = null;
    for (const item of GUIDE_KNOWLEDGE) {
      if (item.keywords.some(kw => queryLower.includes(kw))) {
        matched = item;
        break;
      }
    }

    setTimeout(() => {
      let botResponseText = "";
      let botAction = null;

      if (matched) {
        botResponseText = matched.response;
        if (matched.page) {
          botAction = {
            type: 'navigate',
            target: matched.page,
            label: matched.actionLabel || `Go to ${matched.title}`
          };
          // Auto-navigate if command explicitly asks to go/open/launch
          if (queryLower.startsWith('go to') || queryLower.startsWith('open') || queryLower.startsWith('switch to') || queryLower.startsWith('launch')) {
            if (onNavigatePage) onNavigatePage(matched.page);
            botResponseText += ` Navigating you to ${matched.title} now!`;
          }
        } else if (matched.specialAction === 'future-impact' && onOpenFutureImpact) {
          botAction = {
            type: 'special',
            handler: onOpenFutureImpact,
            label: matched.actionLabel
          };
        }
      } else {
        botResponseText = `I processed "${query}". I can help you navigate to the 3D World Explorer, live Event Radar, City Intelligence Twin, or Telemetry Dashboard. What would you like to see?`;
        botAction = {
          type: 'navigate',
          target: 'world-explorer',
          label: 'Launch World Explorer'
        };
      }

      const botMsg = {
        id: Date.now() + '-siri',
        sender: 'siri',
        text: botResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action: botAction
      };

      setMessages(prev => [...prev, botMsg]);
      playEarcon('success');
      speakText(botResponseText);
    }, 450);
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
    { label: '🌐 World Explorer', query: 'Show me World Explorer' },
    { label: '📡 Event Radar', query: 'Open Event Radar' },
    { label: '🏙️ City Twin', query: 'Take me to City Twin' },
    { label: '🚨 Critical Alerts', query: 'What are the active crisis alerts?' },
    { label: '💡 How to use', query: 'How do I use this platform?' },
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

            {/* Floating Siri Badge Pill */}
            <div className="absolute -top-3 -left-12 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-purple-500/40 text-[10px] font-mono font-bold text-cyan-300 shadow-lg backdrop-blur-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Ask Siri AI Guide
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Siri Interactive Chatbot Floating Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`w-[380px] max-w-[calc(100vw-2rem)] rounded-3xl bg-slate-950/95 backdrop-blur-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden flex flex-col transition-all duration-200 ${
              isMinimized ? 'h-16' : 'h-[520px]'
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
                    <span>Siri Telemetry Guide</span>
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
                              <span>SIRI GUIDE</span>
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
                    title={isListening ? "Listening... Click to stop" : "Speak to Siri (Microphone)"}
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
                    placeholder="Ask Siri or type a command..."
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

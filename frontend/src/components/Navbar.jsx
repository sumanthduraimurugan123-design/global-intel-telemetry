import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  UserCheck, 
  Database, 
  Sparkles, 
  Globe2, 
  Mic, 
  Volume1,
  Dna
} from 'lucide-react';
import { isConfigured } from '../services/supabaseClient';
import { playUiSound, isSoundMuted, toggleSoundMute } from '../services/soundSystem';
import { motion } from 'framer-motion';

export default function Navbar({ 
  selectedCountry, 
  onRefresh, 
  isRefreshing, 
  persona, 
  onOpenPersonaModal,
  onOpenDbModal,
  onToggleVoiceSummary,
  isSpeaking,
  countdown,
  currentLanguage = 'en',
  onSelectLanguage,
  onOpenVoiceModal,
  onToggleEasyMode,
  isEasyMode = false,
  onOpenFutureImpactModal,
  onOpenDnaSidePanel
}) {
  const [utcTime, setUtcTime] = useState('');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(isSoundMuted());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const parts = now.toUTCString().split(' ');
      setUtcTime(`${parts[1]} ${parts[2]} ${parts[3]}  ${parts[4]} UTC`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    const newMuted = toggleSoundMute();
    setIsMuted(newMuted);
    if (!newMuted) {
      playUiSound('toggle');
    }
  };

  const languageLabels = {
    en: 'EN',
    ta: 'தமிழ்',
    hi: 'हिंदी',
    te: 'తెలుగు',
    bn: 'বাংলা',
    mr: 'मराठी'
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-2xl border-b border-purple-500/20 shadow-xl shadow-black/50 transition-all">
      {/* Top Futuristic Neon Gradient Rule */}
      <div className="h-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 w-full animate-pulse" />

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-2.5 flex items-center justify-between gap-4">

        {/* Left: Brand / Title with React Bits DecryptedText & ShinyText */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-500 p-[1px] shadow-lg shadow-purple-500/30">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Globe2 className="w-4 h-4 text-cyan-300 animate-spin-slow" />
            </div>
          </div>
          <div>
            <h1 className="font-display text-white font-bold text-base tracking-tight leading-none flex items-center gap-2">
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-bold"
              >
                Global Intelligence
              </motion.span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono tracking-wider font-bold shadow-sm shadow-purple-500/10 relative overflow-hidden group">
                <span className="absolute inset-0 w-full h-full -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                AI WIRE
              </span>
            </h1>
            <div className="font-mono text-[10px] text-slate-400 mt-0.5 tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-300 font-medium">LIVE TELEMETRY v3.0</span>
              <span className="text-slate-600">·</span>
              <motion.span
                initial={{ opacity: 0.8 }}
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-cyan-400/90 font-semibold"
              >
                PLANETARY TELEMETRY
              </motion.span>
            </div>
          </div>
        </div>

        {/* Center: UTC Dateline + Sector */}
        <div className="hidden md:flex items-center gap-3 px-3.5 py-1 rounded-full bg-slate-900/90 border border-purple-500/25 font-mono text-[11px] text-slate-400 shadow-inner backdrop-blur-md">
          <span className="text-slate-300 tabular-nums font-medium">{utcTime || 'Syncing clock...'}</span>
          <span className="text-purple-500/40">|</span>
          <span className="flex items-center gap-1">
            <span className="text-slate-400">Sector:</span>
            <span className="text-cyan-300 font-semibold capitalize">{selectedCountry || 'Global'}</span>
          </span>
          <span className="text-purple-500/40">|</span>
          <span className="flex items-center gap-1">
            <span className="text-slate-400">Sync:</span>
            <span className={`tabular-nums font-bold ${countdown <= 5 ? 'text-pink-400 animate-pulse' : 'text-purple-300'}`}>
              {countdown}s
            </span>
          </span>
        </div>

        {/* Right: Action Strip */}
        <div className="flex items-center gap-2">

          {/* 🔊 UI Sound Design Toggle */}
          <button
            onClick={handleToggleSound}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all ${
              isMuted
                ? 'border-slate-800 text-slate-500 bg-slate-900/60 hover:text-slate-300 hover:border-slate-700'
                : 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10 shadow-sm shadow-cyan-500/20 hover:border-cyan-400'
            }`}
            title={isMuted ? 'UI Sounds Muted (Click to enable)' : 'UI Sounds Active (Click to mute)'}
            aria-label={isMuted ? 'Unmute UI sounds' : 'Mute UI sounds'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            )}
          </button>

          {/* 🎤 Voice Access Button with Magnet */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { playUiSound('click'); onOpenVoiceModal(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 font-medium text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-md shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-200"
            title="Voice Access: speak to navigate news"
            aria-label="Open Voice Assistant"
          >
            <Mic className="w-3.5 h-3.5 animate-pulse text-pink-200" />
            <span className="hidden sm:inline font-semibold">Voice AI</span>
          </motion.button>

          {/* 🔮 Future Impact Simulator Button with React Bits StarBorder */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { playUiSound('click'); onOpenFutureImpactModal(); }}
            className="cursor-pointer relative overflow-hidden group p-[1px] rounded-lg bg-gradient-to-r from-pink-500/50 to-purple-500/50 hover:from-pink-500 hover:to-purple-500 transition-colors shadow-sm shadow-pink-500/20"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 font-medium text-xs text-pink-200 hover:text-white transition-colors bg-slate-900 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
              <span className="hidden md:inline font-semibold">Future Impact</span>
            </div>
          </motion.button>

          {/* 🧬 Global Impact DNA Side Panel Trigger */}
          <button
            onClick={() => {
              playUiSound('click');
              if (onOpenDnaSidePanel) {
                onOpenDnaSidePanel();
              } else {
                document.getElementById('global-impact-dna')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 font-medium text-xs bg-gradient-to-r from-cyan-950/60 via-purple-950/60 to-pink-950/60 text-cyan-200 border border-cyan-500/40 hover:border-cyan-300 rounded-lg shadow-md hover:shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all duration-200 backdrop-blur-sm"
            title="Open Global Impact DNA 3-Strand Helix Model"
            aria-label="Open Global Impact DNA"
          >
            <Dna className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
            <span className="font-semibold hidden sm:inline">Global DNA</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </button>

          {/* 🌐 Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => { playUiSound('click'); setIsLangMenuOpen(!isLangMenuOpen); }}
              className="flex items-center gap-1 px-2.5 py-1.5 font-mono text-xs text-slate-300 border border-slate-700/80 hover:border-purple-500/50 bg-slate-900/80 rounded-lg transition-colors hover:scale-105 active:scale-95"
              title="Select language"
              aria-label="Select language"
            >
              <span className="text-xs">🌐</span>
              <span className="font-semibold">{languageLabels[currentLanguage] || 'EN'}</span>
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 bg-slate-900/95 border border-purple-500/30 shadow-2xl z-50 py-1.5 min-w-[140px] rounded-xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
                {[
                  { code: 'en', label: '🇬🇧 English' },
                  { code: 'ta', label: '🇮🇳 தமிழ்' },
                  { code: 'hi', label: '🇮🇳 हिंदी' },
                  { code: 'te', label: '🇮🇳 తెలుగు' },
                  { code: 'bn', label: '🇮🇳 বাংলা' },
                  { code: 'mr', label: '🇮🇳 मराठी' }
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => { 
                      playUiSound('switch');
                      onSelectLanguage(item.code); 
                      setIsLangMenuOpen(false); 
                    }}
                    className={`w-full text-left px-3.5 py-1.5 text-xs font-mono transition-all ${
                      currentLanguage === item.code 
                        ? 'bg-purple-600/30 text-purple-300 font-bold border-l-2 border-purple-400' 
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 🎛️ Easy Mode Button */}
          <button
            onClick={() => { playUiSound('toggle'); onToggleEasyMode(!isEasyMode); }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-all active:scale-95 ${
              isEasyMode 
                ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/30' 
                : 'text-slate-400 hover:text-slate-200 border border-slate-700/80 hover:border-slate-600 bg-slate-900/60'
            }`}
            title="Toggle Easy Mode (Simple UI for disabled/elderly)"
            aria-label="Toggle Easy Mode"
          >
            <span>🎛️</span>
            <span className="hidden lg:inline">{isEasyMode ? 'Exit Easy' : 'Easy Mode'}</span>
          </button>

          {/* 👤 Persona Button */}
          <button
            onClick={() => { playUiSound('click'); onOpenPersonaModal(); }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white border border-slate-700/80 hover:border-purple-500/40 transition-all bg-slate-900/60 hover:bg-slate-800/80 rounded-lg active:scale-95"
            title="Switch profile"
          >
            <UserCheck className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline font-medium">{persona}</span>
          </button>

          {/* 🗄️ Database Inspector */}
          <button
            onClick={() => { playUiSound('click'); onOpenDbModal(); }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-all active:scale-95 ${
              isConfigured
                ? 'text-slate-400 hover:text-slate-200 border border-slate-700/80 hover:border-slate-600 bg-slate-900/60'
                : 'text-rose-400 border border-rose-500/40 bg-rose-500/10'
            }`}
            title="Database inspector"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline font-medium">{isConfigured ? 'DB' : 'No DB'}</span>
          </button>

          {/* 🔊 Audio Briefing */}
          <button
            onClick={() => { playUiSound('click'); onToggleVoiceSummary(); }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-all active:scale-95 ${
              isSpeaking
                ? 'text-pink-300 border border-pink-500/50 bg-pink-500/20 font-medium shadow-md shadow-pink-500/20'
                : 'text-slate-400 hover:text-slate-200 border border-slate-700/80 hover:border-slate-600 bg-slate-900/60'
            }`}
            title="Audio briefing"
          >
            <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-pink-400 animate-bounce' : 'text-slate-400'}`} />
            <span className="hidden sm:inline font-medium">{isSpeaking ? 'Stop' : 'Briefing'}</span>
          </button>

          {/* 🔄 Sync Button */}
          <button
            onClick={() => { playUiSound('click'); onRefresh(); }}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-lg shadow-md shadow-cyan-500/25 transition-all disabled:opacity-50 font-medium hover:scale-105 active:scale-95"
            title="Sync feeds"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline font-semibold">Sync</span>
          </button>

        </div>
      </div>
    </header>
  );
}

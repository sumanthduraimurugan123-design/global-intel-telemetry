import React from 'react';
import { Volume2, VolumeX, Eye, Type, Smile, Mic, Radio, Bell, BellOff } from 'lucide-react';
import { playSound } from '../services/soundSystem';

export default function AccessibilityToolbar({
  isHighContrast,
  onToggleHighContrast,
  isLargeText,
  onToggleLargeText,
  isCognitiveSimple,
  onToggleCognitiveSimple,
  onTriggerVoiceSummary,
  isSpeaking,
  onOpenVoiceModal,
  onStartRadio,
  isRadioPlaying,
  isAudioAlertsEnabled,
  onToggleAudioAlerts,
  onToggleEasyMode,
  isEasyMode,
  currentLanguage = 'en'
}) {
  const btnBase = "flex items-center gap-1.5 px-3 py-1.5 font-sans text-xs font-medium border transition-all rounded-lg";
  const btnOff = "text-slate-400 border-slate-800/80 hover:text-slate-100 hover:border-slate-700 bg-slate-900/60 backdrop-blur-sm";
  const btnOn = "text-slate-950 bg-amber-400 border-amber-400 font-semibold shadow-sm shadow-amber-400/20";

  const handleClick = (fn) => {
    playSound('click');
    if (fn) fn();
  };

  return (
    <div className="w-full bg-slate-950/70 border-b border-slate-800/60 px-4 py-2 backdrop-blur-md sticky top-[64px] z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        
        {/* Left: Voice First & Accessibility Tools */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider mr-1 hidden sm:inline">Voice & Intel:</span>

          {/* Voice Assistant Trigger */}
          <button
            onClick={() => handleClick(onOpenVoiceModal)}
            className={`${btnBase} bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-400/20 hover:bg-amber-300`}
            title="Speak voice command (Speech-to-text)"
          >
            <Mic className="w-3.5 h-3.5 animate-pulse text-slate-950" />
            <span>Voice Assistant</span>
          </button>

          {/* Radio Auto-Play Mode */}
          <button
            onClick={() => handleClick(onStartRadio)}
            className={`${btnBase} ${isRadioPlaying ? 'bg-emerald-500 text-slate-950 border-emerald-500 font-semibold shadow-md shadow-emerald-500/20' : btnOff}`}
            title="Auto-play all news like radio"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>{isRadioPlaying ? 'Radio Playing' : 'Live Radio'}</span>
          </button>

          {/* Live Audio Alerts Toggle */}
          <button
            onClick={() => handleClick(onToggleAudioAlerts)}
            className={`${btnBase} ${isAudioAlertsEnabled ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold shadow-md shadow-amber-400/20' : btnOff}`}
            title="Enable/disable unauthenticated spoken threat warnings"
          >
            {isAudioAlertsEnabled ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
            <span>{isAudioAlertsEnabled ? 'Audio Alerts: ON' : 'Audio Alerts: OFF'}</span>
          </button>

          {/* Easy Mode Toggle */}
          <button
            onClick={() => handleClick(() => onToggleEasyMode(!isEasyMode))}
            className={`${btnBase} ${isEasyMode ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-400/20' : btnOff}`}
            title="Switch to simplified oversized high-contrast Easy Mode"
          >
            <span>🎛️</span>
            <span>{isEasyMode ? 'Exit Easy' : 'Easy Mode'}</span>
          </button>

          {/* Voice Summary */}
          <button
            onClick={() => handleClick(onTriggerVoiceSummary)}
            className={`${btnBase} ${isSpeaking ? btnOn : btnOff}`}
            title="Read sector intelligence briefing aloud"
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isSpeaking ? 'Stop Briefing' : 'Brief Aloud'}</span>
          </button>
        </div>

        {/* Right: Visual toggles */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => handleClick(onToggleHighContrast)}
            className={`${btnBase} ${isHighContrast ? btnOn : btnOff}`}
            title="High contrast mode (WCAG AAA)"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>High Contrast</span>
          </button>

          <button
            onClick={() => handleClick(onToggleLargeText)}
            className={`${btnBase} ${isLargeText ? btnOn : btnOff}`}
            title="Large text typography"
          >
            <Type className="w-3.5 h-3.5" />
            <span>Large Text</span>
          </button>

          <button
            onClick={() => handleClick(onToggleCognitiveSimple)}
            className={`${btnBase} ${isCognitiveSimple ? btnOn : btnOff}`}
            title="Simplified reading layout"
          >
            <Smile className="w-3.5 h-3.5" />
            <span>Simplified</span>
          </button>
        </div>

      </div>
    </div>
  );
}

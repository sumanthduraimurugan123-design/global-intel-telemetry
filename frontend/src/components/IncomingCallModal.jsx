import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Volume2, ShieldAlert, Sparkles, UserCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playUiSound } from '../services/soundSystem';

export default function IncomingCallModal({ 
  isOpen, 
  onClose, 
  phoneNumber = '+91 98765 43210', 
  callerName = 'Global Telemetry IVR',
  messageText = 'Heavy rain expected in your area tomorrow. Protect harvested crops in shed and stay indoors. Stay safe.',
  persona = 'Farmer / Kisan',
  location = 'India'
}) {
  const [callState, setCallState] = useState('ringing'); // 'ringing', 'connected', 'ended'
  const [callDuration, setCallDuration] = useState(0);
  const ringIntervalRef = useRef(null);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setCallState('ringing');
      setCallDuration(0);

      // Play ringing sound periodically while ringing
      playUiSound('alert');
      ringIntervalRef.current = setInterval(() => {
        playUiSound('alert');
      }, 3500);
    } else {
      cleanup();
    }

    return () => cleanup();
  }, [isOpen]);

  const cleanup = () => {
    if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };

  const handleAnswerCall = () => {
    if (ringIntervalRef.current) clearInterval(ringIntervalRef.current);
    setCallState('connected');
    playUiSound('click');

    // Start timer counter
    timerIntervalRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Speak emergency message using Browser SpeechSynthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `Attention subscriber. Automated IVR Emergency Call for ${persona} in ${location}. ${messageText} Repeat. ${messageText}. Thank you for using Global Intel Telemetry. Stay safe.`
      );
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) utterance.voice = englishVoice;

      utterance.onend = () => {
        handleEndCall();
      };
      utterance.onerror = () => {
        handleEndCall();
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const handleEndCall = () => {
    cleanup();
    setCallState('ended');
    playUiSound('toggle');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-sm bg-slate-900 border border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden p-6 text-center flex flex-col items-center justify-between min-h-[480px] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900"
        >
          {/* Close X */}
          <button
            onClick={handleEndCall}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Caller Info Header */}
          <div className="w-full mt-4 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[11px] font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>INCOMING SIMULATED IVR VOICE CALL</span>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight pt-2">
              {callerName}
            </h3>

            <p className="font-mono text-xs text-purple-300">
              Target Phone: <strong className="text-white">{phoneNumber}</strong>
            </p>

            <div className="font-mono text-[11px] text-slate-400 flex items-center justify-center gap-2 pt-1">
              <span>Persona: {persona}</span>
              <span>·</span>
              <span>Loc: {location}</span>
            </div>
          </div>

          {/* Call Avatar & Animation */}
          <div className="relative my-6 flex items-center justify-center">
            {callState === 'ringing' && (
              <>
                <div className="absolute w-36 h-36 rounded-full border-2 border-emerald-500/30 animate-ping" />
                <div className="absolute w-28 h-28 rounded-full border-2 border-emerald-500/50 animate-pulse" />
              </>
            )}

            {callState === 'connected' && (
              <div className="absolute w-36 h-36 rounded-full border-2 border-purple-500/40 animate-spin-slow" />
            )}

            <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 shadow-2xl transition-all ${
              callState === 'connected' 
                ? 'bg-purple-600/30 border-purple-400 shadow-purple-500/40' 
                : callState === 'ended'
                ? 'bg-rose-600/30 border-rose-500'
                : 'bg-emerald-600/30 border-emerald-400 shadow-emerald-500/40'
            }`}>
              <Phone className={`w-10 h-10 ${
                callState === 'ringing' 
                  ? 'text-emerald-300 animate-bounce' 
                  : callState === 'connected'
                  ? 'text-purple-200 animate-pulse'
                  : 'text-rose-300'
              }`} />
            </div>
          </div>

          {/* Status Message & Script readout */}
          <div className="w-full space-y-2 px-2">
            {callState === 'ringing' && (
              <div className="space-y-1">
                <p className="text-emerald-300 font-mono text-xs animate-pulse font-bold">
                  🔔 Ringing... (+1-800-UGI-ALERTS Calling)
                </p>
                <p className="text-[11px] text-slate-400">
                  Press Accept to answer automated voice call
                </p>
              </div>
            )}

            {callState === 'connected' && (
              <div className="space-y-2">
                <div className="font-mono text-sm font-bold text-purple-300 flex items-center justify-center gap-2">
                  <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span>CONNECTED · {formatTimer(callDuration)}</span>
                </div>
                <div className="p-3 bg-slate-950/90 border border-purple-500/30 rounded-xl text-[11px] text-slate-200 font-sans leading-relaxed text-left max-h-[100px] overflow-y-auto">
                  <span className="text-[10px] text-purple-400 font-mono block mb-1">AUTOMATED VOICE SCRIPT:</span>
                  "{messageText}"
                </div>
              </div>
            )}

            {callState === 'ended' && (
              <p className="text-rose-400 font-mono text-xs font-bold">
                Call Ended. User Registered Successfully!
              </p>
            )}
          </div>

          {/* Call Control Action Buttons */}
          <div className="w-full pt-4 flex items-center justify-center gap-6">
            {callState === 'ringing' && (
              <>
                <button
                  onClick={handleEndCall}
                  className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>Decline</span>
                </button>

                <button
                  onClick={handleAnswerCall}
                  className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-2xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 animate-bounce active:scale-95"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>Answer Call 📞</span>
                </button>
              </>
            )}

            {callState === 'connected' && (
              <button
                onClick={handleEndCall}
                className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-rose-600/40 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <PhoneOff className="w-4 h-4" />
                <span>End Voice Call</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

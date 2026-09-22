/**
 * High-End Tactile Sound System
 * Powered by Web Audio API for zero latency, 0 external network requests,
 * and Apple/Tesla-grade subtle acoustic feedback.
 */

let audioCtx = null;
let isMutedState = false;

// Initialize mute state from localStorage
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('ugi_ui_sound_muted');
    isMutedState = saved === 'true';
  } catch (e) {
    isMutedState = false;
  }
}

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundMuted() {
  return isMutedState;
}

export function setSoundMuted(muted) {
  isMutedState = !!muted;
  try {
    localStorage.setItem('ugi_ui_sound_muted', isMutedState ? 'true' : 'false');
  } catch (e) {}
  return isMutedState;
}

export function toggleSoundMute() {
  return setSoundMuted(!isMutedState);
}

/**
 * Play subtle, luxurious acoustic feedback
 * @param {'click' | 'hover' | 'alert' | 'success' | 'switch' | 'toggle'} type 
 */
export function playUiSound(type = 'click') {
  if (isMutedState) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    if (type === 'click') {
      // Very soft, damped tactile micro-click (mimics haptic tap)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.035);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.038);
    } else if (type === 'hover') {
      // Extremely subtle high-pitch air tick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2400, now);
      gain.gain.setValueAtTime(0.008, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.018);
    } else if (type === 'switch') {
      // Soft modern tone transition
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.06);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.075);
    } else if (type === 'alert') {
      // Luxurious double-harmonic soft notification chime (not abrasive)
      [
        { freq: 587.33, delay: 0, duration: 0.22, vol: 0.06 },   // D5
        { freq: 880.00, delay: 0.08, duration: 0.28, vol: 0.08 } // A5
      ].forEach(({ freq, delay, duration, vol }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);

        gain.gain.setValueAtTime(vol, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.0005, now + delay + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + duration + 0.02);
      });
    } else if (type === 'toggle') {
      // Soft ascending toggle feedback
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.05);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.065);
    }
  } catch (err) {
    // Audio errors are safely suppressed to prevent any UI interruption
  }
}

export const playSound = playUiSound;

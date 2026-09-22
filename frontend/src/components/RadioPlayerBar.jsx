import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Square, Radio, X } from 'lucide-react';

export default function RadioPlayerBar({
  isPlaying,
  isPaused,
  currentIndex = 0,
  totalStories = 0,
  currentStory = null,
  language = 'en',
  onPlay,
  onPause,
  onNext,
  onPrev,
  onStop
}) {
  if (!isPlaying && !isPaused) return null;

  return (
    <aside 
      className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t-2 border-amber-400/60 shadow-2xl shadow-amber-500/10 backdrop-blur-xl px-4 py-3 text-slate-100"
      aria-label="Continuous News Radio Player"
    >
      {/* Ambient glow strip */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left: Radio badge + Soundwave + Current story title */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
          <div className="flex items-center gap-2 shrink-0">
            <span className="p-1.5 bg-amber-400 text-slate-950 rounded-lg flex items-center justify-center shadow-md shadow-amber-400/30">
              <Radio className="w-4 h-4 animate-pulse" />
            </span>
            <div className="hidden md:flex items-center gap-0.5 h-4 px-1">
              {[40, 90, 60, 100, 70, 30].map((h, i) => (
                <span
                  key={i}
                  className={`w-0.5 bg-amber-400 transition-all duration-300 rounded-full ${isPlaying ? 'animate-pulse' : 'opacity-30'}`}
                  style={{ height: isPlaying ? `${h}%` : '20%' }}
                />
              ))}
            </div>
          </div>

          <div className="truncate">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-amber-400 uppercase tracking-wider font-semibold">
                Radio Mode · {currentIndex + 1} of {totalStories}
              </span>
              {currentStory?.source && (
                <span className="font-mono text-[10px] text-slate-400 truncate">
                  · {currentStory.source}
                </span>
              )}
            </div>
            <p className="font-sans text-xs sm:text-sm text-slate-100 font-medium truncate">
              {currentStory?.title || 'Loading next dispatch...'}
            </p>
          </div>
        </div>

        {/* Center/Right: Big controls */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Previous Button */}
          <button
            onClick={onPrev}
            disabled={currentIndex <= 0}
            className="p-2 bg-slate-900 border border-slate-800 hover:border-amber-400 text-slate-100 hover:text-amber-400 rounded-lg transition-colors disabled:opacity-40 disabled:hover:border-slate-800"
            title="Previous story"
            aria-label="Previous story"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause Toggle Button */}
          {isPlaying ? (
            <button
              onClick={onPause}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 text-slate-950 font-mono text-xs font-semibold rounded-lg shadow-md shadow-amber-400/30 hover:bg-amber-300 transition-all active:scale-95"
              title="Pause radio"
              aria-label="Pause radio"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>PAUSE</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-slate-950 font-mono text-xs font-semibold rounded-lg shadow-md shadow-emerald-500/30 hover:bg-emerald-400 transition-all active:scale-95"
              title="Resume radio"
              aria-label="Resume radio"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>RESUME</span>
            </button>
          )}

          {/* Next Button */}
          <button
            onClick={onNext}
            disabled={currentIndex >= totalStories - 1}
            className="p-2 bg-slate-900 border border-slate-800 hover:border-amber-400 text-slate-100 hover:text-amber-400 rounded-lg transition-colors disabled:opacity-40 disabled:hover:border-slate-800"
            title="Next story"
            aria-label="Next story"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Stop Button */}
          <button
            onClick={onStop}
            className="p-2 bg-slate-900 border border-slate-800 hover:border-rose-500 text-slate-400 hover:text-rose-500 rounded-lg transition-colors ml-1"
            title="Stop playback"
            aria-label="Stop playback"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>

          {/* Close/Dismiss */}
          <button
            onClick={onStop}
            className="p-2 text-slate-400 hover:text-slate-100 rounded-lg transition-colors ml-1"
            title="Close radio bar"
            aria-label="Close radio bar"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

      </div>
    </aside>
  );
}

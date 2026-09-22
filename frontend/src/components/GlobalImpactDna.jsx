import React, { useEffect, useRef, useState } from 'react';
import { 
  Dna, 
  Activity, 
  ShieldAlert, 
  TrendingUp, 
  CloudRain, 
  Maximize2, 
  Minimize2, 
  X, 
  Sparkles, 
  Sliders, 
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { playSound } from '../services/soundSystem';

/**
 * Global Impact DNA Visual
 * Abstract holographic 3-strand helix visualizing planetary equilibrium:
 * - Strand 1: Economy (Electric Blue / #38bdf8)
 * - Strand 2: Risk (Vibrant Red / #f43f5e)
 * - Strand 3: Climate (Emerald Green / #10b981)
 * 
 * Dynamic Physics:
 * - Twist speed = global activity level
 * - Wave distortion = geopolitical & market instability
 * - Harmonic smooth curves = planetary stability
 */
export default function GlobalImpactDna({
  riskScore = 42,
  activityLevel = 65,
  climateScore = 38,
  compact = false,
  asSidePanel = false,
  isOpen = true,
  onClose,
  className = ''
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedStrand, setSelectedStrand] = useState(null);

  // Normalize scores 0-100
  const normalizedRisk = Math.max(5, Math.min(100, Number(riskScore) || 42));
  const normalizedActivity = Math.max(10, Math.min(100, Number(activityLevel) || 60));
  const normalizedClimate = Math.max(5, Math.min(100, Number(climateScore) || 35));

  // Instability calculation: higher risk = higher distortion
  const instabilityFactor = normalizedRisk / 100;
  const isHighTension = normalizedRisk > 60;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let time = 0;

    const render = () => {
      try {
        const container = containerRef.current || canvas.parentElement;
        const width = container ? container.clientWidth : 320;
        const height = container ? container.clientHeight : (compact ? 120 : 160);

        if (width <= 40 || height <= 20) {
          animationFrameId = requestAnimationFrame(render);
          return;
        }

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const targetW = Math.floor(width * dpr);
        const targetH = Math.floor(height * dpr);

        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW;
          canvas.height = targetH;
        }

        time += 0.014 + (normalizedActivity / 100) * 0.032;

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);

        const numPoints = compact ? 32 : 48;
        const centerY = height / 2;
        const startX = 20;
        const endX = width - 20;
        const stepX = (endX - startX) / Math.max(1, numPoints - 1);

        // Instability noise jitter
        const distortion = instabilityFactor * 16;

        const strands = [
          {
            id: 'economy',
            name: 'Economy Strand',
            color: '#38bdf8',
            glow: 'rgba(56, 189, 248, 0.45)',
            phaseOffset: 0,
            weight: selectedStrand === 'economy' ? 3.5 : 2.2,
            yAmp: Math.min(height * 0.32, 44)
          },
          {
            id: 'risk',
            name: 'Risk Strand',
            color: '#f43f5e',
            glow: 'rgba(244, 63, 94, 0.55)',
            phaseOffset: (Math.PI * 2) / 3, // 120 degrees offset
            weight: selectedStrand === 'risk' ? 3.5 : 2.5,
            yAmp: Math.min(height * 0.35, 48) * (1 + instabilityFactor * 0.25)
          },
          {
            id: 'climate',
            name: 'Climate Strand',
            color: '#10b981',
            glow: 'rgba(16, 185, 129, 0.45)',
            phaseOffset: (Math.PI * 4) / 3, // 240 degrees offset
            weight: selectedStrand === 'climate' ? 3.5 : 2.0,
            yAmp: Math.min(height * 0.3, 40)
          }
        ];

        // 1. Calculate projected coordinates
        const strandPoints = strands.map((strand) => {
          const points = [];
          for (let i = 0; i < numPoints; i++) {
            const x = startX + i * stepX;
            const progress = i / (numPoints - 1);
            const angle = time + progress * Math.PI * 4 + strand.phaseOffset;

            // Add harmonic distortion based on risk
            let noise = 0;
            if (instabilityFactor > 0.3) {
              noise = Math.sin(time * 3.4 + i * 0.65) * distortion * Math.sin(progress * Math.PI);
            }

            const z = Math.sin(angle);
            const y = centerY + Math.cos(angle) * strand.yAmp + noise;
            const scale = 0.75 + (z + 1) * 0.25;
            const opacity = 0.35 + (z + 1) * 0.32;

            points.push({ x, y, z, scale, opacity });
          }
          return points;
        });

        // 2. Draw connecting base-pair rungs
        for (let i = 0; i < numPoints; i += (compact ? 3 : 2)) {
          const p1 = strandPoints[0][i]; // Economy
          const p2 = strandPoints[1][i]; // Risk
          const p3 = strandPoints[2][i]; // Climate

          if (p1 && p2) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(168, 85, 247, ${Math.max(0.12, 0.3 + ((p1.z + p2.z) / 2) * 0.2)})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 3]);
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }

          if (p2 && p3) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(52, 211, 153, ${Math.max(0.12, 0.25 + ((p2.z + p3.z) / 2) * 0.2)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }

        // 3. Draw continuous glowing strands
        strands.forEach((strand, sIdx) => {
          const points = strandPoints[sIdx];
          if (!points || points.length < 3) return;

          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);

          for (let i = 1; i < points.length - 2; i++) {
            const xc = (points[i].x + points[i + 1].x) / 2;
            const yc = (points[i].y + points[i + 1].y) / 2;
            ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
          }
          ctx.quadraticCurveTo(
            points[points.length - 2].x,
            points[points.length - 2].y,
            points[points.length - 1].x,
            points[points.length - 1].y
          );

          ctx.strokeStyle = strand.color;
          ctx.lineWidth = strand.weight;
          ctx.shadowColor = strand.color;
          ctx.shadowBlur = 8;
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Molecular nodes along strand
          points.forEach((p, idx) => {
            if (idx % (compact ? 3 : 2) === 0) {
              const beadRadius = (p.scale * 2.5) * (strand.id === 'risk' && isHighTension ? 1.4 : 1);

              ctx.beginPath();
              ctx.arc(p.x, p.y, beadRadius * 2, 0, Math.PI * 2);
              ctx.fillStyle = strand.glow;
              ctx.fill();

              ctx.beginPath();
              ctx.arc(p.x, p.y, beadRadius, 0, Math.PI * 2);
              ctx.fillStyle = p.z > 0 ? '#ffffff' : strand.color;
              ctx.fill();
            }
          });
        });

        ctx.restore();
      } catch (e) {
        // Suppress canvas errors to preserve UI
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [normalizedRisk, normalizedActivity, normalizedClimate, compact, instabilityFactor, isHighTension, selectedStrand]);

  const toggleExpand = () => {
    playSound('toggle');
    setIsExpanded(!isExpanded);
  };

  const handleStrandClick = (id) => {
    playSound('click');
    setSelectedStrand(selectedStrand === id ? null : id);
  };

  // If rendered as a dedicated Side Panel Drawer
  if (asSidePanel) {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md animate-fade-in">
        <div 
          className="relative w-full max-w-md h-full bg-[#050814] border-l border-purple-500/30 shadow-2xl p-5 flex flex-col overflow-y-auto space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
                <Dna className="w-5 h-5 animate-spin-slow text-purple-300" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white tracking-wide">
                  Global Impact DNA Helix
                </h3>
                <p className="font-mono text-[10px] text-purple-300">
                  Planetary Biometric Equilibrium Model
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playSound('click');
                if (onClose) onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Helix Canvas Visual */}
          <div 
            ref={containerRef}
            className="w-full h-48 rounded-xl bg-slate-950/80 border border-purple-500/30 overflow-hidden relative shadow-inner flex items-center justify-center"
          >
            <canvas ref={canvasRef} className="w-full h-full" />
            <div className="absolute bottom-2 left-3 font-mono text-[9px] text-slate-500 pointer-events-none">
              TWIST VELOCITY: {(0.014 + (normalizedActivity / 100) * 0.032).toFixed(3)} rad/s · DISTORTION: {(instabilityFactor * 100).toFixed(0)}%
            </div>
          </div>

          {/* Equilibrium Status Pill */}
          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            isHighTension 
              ? 'bg-rose-950/30 border-rose-500/40 text-rose-300' 
              : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
          }`}>
            <div className="flex items-center gap-2">
              {isHighTension ? <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              <span className="font-mono text-xs font-bold">
                {isHighTension ? 'PLANETARY TENSION HIGH' : 'DYNAMIC EQUILIBRIUM ACTIVE'}
              </span>
            </div>
            <span className="font-mono text-xs font-bold">{100 - normalizedRisk}% Balance</span>
          </div>

          {/* 3 Strands Deep Dive */}
          <div className="space-y-2.5">
            <h4 className="font-mono text-xs text-purple-300 uppercase tracking-wider font-semibold">
              The 3 Planetary Strands:
            </h4>

            {/* Economy Strand */}
            <div 
              onClick={() => handleStrandClick('economy')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedStrand === 'economy' ? 'bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-500/20' : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs font-bold text-cyan-300 mb-1">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
                  ECONOMY (BLUE)
                </span>
                <span>{100 - normalizedRisk}% Flow</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Represents maritime freight velocity, currency liquidity, and chip supplies. Twist accelerates with trading volume.
              </p>
            </div>

            {/* Risk Strand */}
            <div 
              onClick={() => handleStrandClick('risk')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedStrand === 'risk' ? 'bg-rose-950/40 border-rose-400 shadow-md shadow-rose-500/20' : 'bg-slate-900/60 border-slate-800 hover:border-rose-500/40'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs font-bold text-rose-400 mb-1">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                  RISK & DEFENSE (RED)
                </span>
                <span>{normalizedRisk}% Stress</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Reflects active threats, war corridors, and cyber friction. Distorts the helix into chaotic harmonic spikes when critical alerts rise.
              </p>
            </div>

            {/* Climate Strand */}
            <div 
              onClick={() => handleStrandClick('climate')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedStrand === 'climate' ? 'bg-emerald-950/40 border-emerald-400 shadow-md shadow-emerald-500/20' : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs font-bold text-emerald-300 mb-1">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                  CLIMATE & FOOD (GREEN)
                </span>
                <span>{normalizedClimate}% Monitored</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Tracks crop weather anomalies, rainfall cycles, monsoon indices, and raw agricultural commodity flow.
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl font-mono text-[11px] text-purple-200">
            💡 Dynamic biometrics update continuously as live dispatches and threats are processed.
          </div>
        </div>
      </div>
    );
  }

  // Inline Dashboard Card Mode
  return (
    <div 
      id="global-impact-dna"
      className={`glass-card-luxe rounded-2xl border border-purple-500/30 p-5 relative overflow-hidden transition-all shadow-2xl ${className}`}
    >
      {/* Multi-layer Background Atmosphere */}
      <div 
        className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-25"
        style={{
          background: isHighTension 
            ? 'radial-gradient(circle, #f43f5e 0%, transparent 65%)' 
            : 'radial-gradient(circle, #a855f7 0%, transparent 65%)'
        }}
      />
      <div 
        className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-15"
        style={{ background: 'radial-gradient(circle, #38bdf8 0%, transparent 65%)' }}
      />

      {/* Card Header — prominent, full-width */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between z-10 relative mb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl border shadow-lg ${
            isHighTension 
              ? 'bg-rose-500/20 border-rose-500/40 shadow-rose-500/30' 
              : 'bg-gradient-to-br from-purple-600/40 to-cyan-500/20 border-purple-500/40 shadow-purple-500/30'
          }`}>
            <Dna className={`w-5 h-5 ${
              isHighTension ? 'text-rose-400' : 'text-cyan-300 animate-spin-slow'
            }`} />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="font-display text-sm font-bold text-white tracking-widest uppercase">
                Global Impact DNA
              </h3>
              {/* LIVE badge */}
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE
              </span>
              <span className={`font-mono text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${
                isHighTension
                  ? 'border-rose-500/50 bg-rose-500/20 text-rose-300 animate-pulse'
                  : 'border-purple-500/40 bg-purple-500/15 text-purple-200'
              }`}>
                {isHighTension ? '⚠ HIGH INSTABILITY' : '✦ EQUILIBRIUM ACTIVE'}
              </span>
            </div>
            <p className="font-mono text-[10px] text-slate-400 mt-0.5">
              3-strand holographic helix · Economy · Risk · Climate · Updating live
            </p>
          </div>
        </div>

        <button
          onClick={toggleExpand}
          className="self-start sm:self-auto p-2 text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30 rounded-xl transition-all"
          title={isExpanded ? 'Collapse' : 'Expand DNA view'}
        >
          {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Interactive 3D Canvas Visual — tall, cinematic */}
      <div 
        ref={containerRef}
        className={`relative w-full rounded-2xl border overflow-hidden shadow-2xl cursor-pointer group ${
          isHighTension 
            ? 'bg-slate-950 border-rose-500/25 shadow-rose-500/10' 
            : 'bg-slate-950 border-purple-500/25 shadow-purple-500/10'
        } ${
          isExpanded ? 'h-72' : compact ? 'h-28' : 'h-48'
        }`}
        onClick={toggleExpand}
        title="Click to expand / collapse"
      >
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
        />

        {/* Corner gradient overlays for depth */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to right, rgba(3,7,18,0.5) 0%, transparent 12%, transparent 88%, rgba(3,7,18,0.5) 100%)'
        }} />

        {/* Telemetry HUD overlay */}
        <div className="absolute bottom-3 left-4 pointer-events-none flex items-center gap-3 font-mono text-[10px]">
          <span className="text-cyan-400/70">⟳ VELOCITY: {(0.014 + (normalizedActivity / 100) * 0.032).toFixed(3)} rad/s</span>
          <span className="text-rose-400/70">⚡ DISTORTION: {(instabilityFactor * 100).toFixed(0)}%</span>
          <span className="text-emerald-400/70">✦ STRANDS: 3 ACTIVE</span>
        </div>

        {/* Expand hint on hover */}
        <div className="absolute top-3 right-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[9px] text-purple-300/70 flex items-center gap-1">
          <Maximize2 className="w-3 h-3" />
          {isExpanded ? 'COLLAPSE' : 'EXPAND HELIX'}
        </div>
      </div>

      {/* 3 Strands Status Metric Strip — side by side, always visible */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-purple-500/20 z-10 relative">
        {/* Strand 1: Economy */}
        <button 
          onClick={() => handleStrandClick('economy')}
          className={`bg-slate-900/60 border rounded-xl p-2 text-left transition-all ${
            selectedStrand === 'economy' ? 'border-cyan-400 bg-cyan-950/30' : 'border-cyan-500/20 hover:border-cyan-500/50'
          }`}
        >
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyan-300 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50 animate-pulse" />
            <span className="truncate">ECONOMY</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xs text-white font-bold">{100 - normalizedRisk}%</span>
            <span className="font-mono text-[9px] text-cyan-300/80">Flow</span>
          </div>
        </button>

        {/* Strand 2: Risk */}
        <button 
          onClick={() => handleStrandClick('risk')}
          className={`bg-slate-900/60 border rounded-xl p-2 text-left transition-all ${
            selectedStrand === 'risk' ? 'border-rose-400 bg-rose-950/30' : 'border-rose-500/20 hover:border-rose-500/50'
          }`}
        >
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-rose-300 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50 animate-ping" />
            <span className="truncate">RISK</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xs text-rose-400 font-bold">{normalizedRisk}%</span>
            <span className="font-mono text-[9px] text-rose-300/80">{isHighTension ? 'Tension' : 'Nominal'}</span>
          </div>
        </button>

        {/* Strand 3: Climate */}
        <button 
          onClick={() => handleStrandClick('climate')}
          className={`bg-slate-900/60 border rounded-xl p-2 text-left transition-all ${
            selectedStrand === 'climate' ? 'border-emerald-400 bg-emerald-950/30' : 'border-emerald-500/20 hover:border-emerald-500/50'
          }`}
        >
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-300 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
            <span className="truncate">CLIMATE</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xs text-emerald-400 font-bold">{normalizedClimate}%</span>
            <span className="font-mono text-[9px] text-emerald-300/80">Stable</span>
          </div>
        </button>
      </div>

    </div>
  );
}

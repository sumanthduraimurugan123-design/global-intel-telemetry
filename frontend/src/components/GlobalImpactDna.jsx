import React, { useEffect, useRef, useState } from 'react';
import { Dna, Activity, ShieldAlert, TrendingUp, CloudRain, Maximize2, Minimize2, Info, Sparkles } from 'lucide-react';
import { playSound } from '../services/soundSystem';

/**
 * Global Impact DNA Visual
 * Abstract holographic 3-strand helix visualizing planetary equilibrium:
 * - Strand 1: Economy (Blue / Cyan)
 * - Strand 2: Risk (Red / Rose)
 * - Strand 3: Climate (Green / Emerald)
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
  className = ''
}) {
  const canvasRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredStrand, setHoveredStrand] = useState(null);

  // Normalize scores 0-100
  const normalizedRisk = Math.max(5, Math.min(100, Number(riskScore) || 40));
  const normalizedActivity = Math.max(10, Math.min(100, Number(activityLevel) || 50));
  const normalizedClimate = Math.max(5, Math.min(100, Number(climateScore) || 35));

  // Instability calculation: higher risk = higher distortion
  const instabilityFactor = normalizedRisk / 100;
  const isHighTension = normalizedRisk > 65;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      time += 0.015 + (normalizedActivity / 100) * 0.035; // Twist speed driven by activity

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      const numPoints = compact ? 36 : 54;
      const centerY = height / 2;
      const radiusX = Math.min(width * 0.42, 110);
      const startX = 24;
      const endX = width - 24;
      const stepX = (endX - startX) / (numPoints - 1);

      // Instability noise jitter
      const distortion = instabilityFactor * 18;

      const strands = [
        {
          id: 'economy',
          name: 'Economy Strand',
          color: '#38bdf8',
          glow: 'rgba(56, 189, 248, 0.4)',
          phaseOffset: 0,
          weight: 2.2,
          yAmp: Math.min(height * 0.32, 45)
        },
        {
          id: 'risk',
          name: 'Risk Strand',
          color: '#f43f5e',
          glow: 'rgba(244, 63, 94, 0.5)',
          phaseOffset: (Math.PI * 2) / 3, // 120 degrees offset
          weight: 2.5,
          yAmp: Math.min(height * 0.35, 48) * (1 + instabilityFactor * 0.25)
        },
        {
          id: 'climate',
          name: 'Climate Strand',
          color: '#10b981',
          glow: 'rgba(16, 185, 129, 0.4)',
          phaseOffset: (Math.PI * 4) / 3, // 240 degrees offset
          weight: 2.0,
          yAmp: Math.min(height * 0.3, 42)
        }
      ];

      // Calculate 3D projected coordinates for each point along each strand
      const strandPoints = strands.map((strand) => {
        const points = [];
        for (let i = 0; i < numPoints; i++) {
          const x = startX + i * stepX;
          const progress = i / (numPoints - 1);
          const angle = time + progress * Math.PI * 4 + strand.phaseOffset;

          // Add harmonic distortion based on world risk level
          let noise = 0;
          if (instabilityFactor > 0.3) {
            noise = Math.sin(time * 3.2 + i * 0.7) * distortion * Math.sin(progress * Math.PI);
          }

          const z = Math.sin(angle); // -1 (far) to +1 (near)
          const y = centerY + Math.cos(angle) * strand.yAmp + noise;
          const scale = 0.75 + (z + 1) * 0.25; // 0.75 to 1.25 depth perspective
          const opacity = 0.35 + (z + 1) * 0.32; // 0.35 to 0.99

          points.push({ x, y, z, scale, opacity });
        }
        return points;
      });

      // 1. Draw base-pair connecting rungs between strands (depth sorted)
      for (let i = 0; i < numPoints; i += (compact ? 3 : 2)) {
        const p1 = strandPoints[0][i]; // Economy
        const p2 = strandPoints[1][i]; // Risk
        const p3 = strandPoints[2][i]; // Climate

        // Draw cross-links between Economy and Risk
        const avgZ12 = (p1.z + p2.z) / 2;
        const alpha12 = Math.max(0.1, 0.25 + avgZ12 * 0.2);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(168, 85, 247, ${alpha12 * 0.7})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Draw cross-links between Risk and Climate
        const avgZ23 = (p2.z + p3.z) / 2;
        const alpha23 = Math.max(0.1, 0.25 + avgZ23 * 0.2);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(52, 211, 153, ${alpha23 * 0.5})`;
        ctx.lineWidth = 1;
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 2. Draw continuous strands with gradient and depth
      strands.forEach((strand, sIdx) => {
        const points = strandPoints[sIdx];

        // Draw glowing line segments
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
        ctx.shadowBlur = 0; // reset

        // Draw glowing molecular beads along the strand
        points.forEach((p, idx) => {
          if (idx % (compact ? 3 : 2) === 0) {
            const beadRadius = (p.scale * 2.5) * (strand.id === 'risk' && isHighTension ? 1.4 : 1);
            
            // Outer glow
            ctx.beginPath();
            ctx.arc(p.x, p.y, beadRadius * 2, 0, Math.PI * 2);
            ctx.fillStyle = strand.glow;
            ctx.fill();

            // Inner core
            ctx.beginPath();
            ctx.arc(p.x, p.y, beadRadius, 0, Math.PI * 2);
            ctx.fillStyle = p.z > 0 ? '#ffffff' : strand.color;
            ctx.fill();
          }
        });
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [normalizedRisk, normalizedActivity, normalizedClimate, compact, instabilityFactor, isHighTension]);

  const toggleExpand = () => {
    playSound('toggle');
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`glass-card-luxe rounded-2xl border border-purple-500/25 p-4 relative overflow-hidden transition-all shadow-xl ${
      isExpanded ? 'col-span-full' : ''
    } ${className}`}>
      
      {/* Background radial atmosphere */}
      <div 
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-25"
        style={{
          background: isHighTension 
            ? 'radial-gradient(circle, #f43f5e 0%, transparent 70%)' 
            : 'radial-gradient(circle, #38bdf8 0%, transparent 70%)'
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between z-10 relative mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg border ${
            isHighTension 
              ? 'bg-rose-500/15 border-rose-500/40 text-rose-400' 
              : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
          }`}>
            <Dna className={`w-4 h-4 ${isHighTension ? 'animate-spin-slow text-rose-400' : 'text-cyan-300'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-white tracking-wider uppercase">
                Global Impact DNA
              </span>
              <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full border ${
                isHighTension
                  ? 'border-rose-500/40 bg-rose-500/15 text-rose-300 animate-pulse'
                  : 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
              }`}>
                {isHighTension ? 'HIGH INSTABILITY' : 'EQUILIBRIUM'}
              </span>
            </div>
            <p className="font-sans text-[10px] text-slate-400">
              3-Strand planetary biometrics · Real-time twist & harmonic resonance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={toggleExpand}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            title={isExpanded ? 'Collapse DNA view' : 'Expand DNA view'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Interactive 3D Canvas Visual */}
      <div className={`relative w-full rounded-xl bg-slate-950/70 border border-slate-800/80 overflow-hidden shadow-inner ${
        isExpanded ? 'h-52' : compact ? 'h-24' : 'h-32'
      }`}>
        <canvas 
          ref={canvasRef} 
          className="w-full h-full cursor-pointer"
          onClick={toggleExpand}
        />

        {/* Ambient overlay watermark */}
        <div className="absolute bottom-2 left-3 pointer-events-none flex items-center gap-2 font-mono text-[9px] text-slate-500">
          <span>FREQ: {(0.015 + (normalizedActivity / 100) * 0.035).toFixed(3)} rad/s</span>
          <span>·</span>
          <span>DISTORTION: {(instabilityFactor * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* 3 Strands Status Metric Strip */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-purple-500/15 z-10 relative">
        {/* Strand 1: Economy */}
        <div 
          onMouseEnter={() => setHoveredStrand('economy')}
          onMouseLeave={() => setHoveredStrand(null)}
          className="bg-slate-900/60 border border-cyan-500/20 rounded-xl p-2 transition-all hover:border-cyan-500/50 hover:bg-cyan-950/20"
        >
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyan-300 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50 animate-pulse" />
            <span className="truncate">ECONOMY</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xs text-white font-bold">{100 - normalizedRisk}%</span>
            <span className="font-mono text-[9px] text-cyan-300/80">Flow</span>
          </div>
        </div>

        {/* Strand 2: Risk */}
        <div 
          onMouseEnter={() => setHoveredStrand('risk')}
          onMouseLeave={() => setHoveredStrand(null)}
          className="bg-slate-900/60 border border-rose-500/20 rounded-xl p-2 transition-all hover:border-rose-500/50 hover:bg-rose-950/20"
        >
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-rose-300 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50 animate-ping" />
            <span className="truncate">RISK</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xs text-rose-400 font-bold">{normalizedRisk}%</span>
            <span className="font-mono text-[9px] text-rose-300/80">{isHighTension ? 'Tension' : 'Calm'}</span>
          </div>
        </div>

        {/* Strand 3: Climate */}
        <div 
          onMouseEnter={() => setHoveredStrand('climate')}
          onMouseLeave={() => setHoveredStrand(null)}
          className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-2 transition-all hover:border-emerald-500/50 hover:bg-emerald-950/20"
        >
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-300 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
            <span className="truncate">CLIMATE</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xs text-emerald-400 font-bold">{normalizedClimate}%</span>
            <span className="font-mono text-[9px] text-emerald-300/80">Active</span>
          </div>
        </div>
      </div>

    </div>
  );
}

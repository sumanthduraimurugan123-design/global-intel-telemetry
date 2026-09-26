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
  AlertTriangle,
  Globe2,
  Zap,
  HelpCircle,
  BookOpen,
  Wheat,
  GraduationCap,
  Briefcase,
  LineChart,
  Users,
  Volume2
} from 'lucide-react';
import { playSound } from '../services/soundSystem';

/**
 * Global Impact DNA Visual - 3D Holographic Globe & Orbiting Triple Helix
 * Visualizing planetary equilibrium across 3 biometrics:
 * - Strand 1: Economy (Electric Blue / #38bdf8)
 * - Strand 2: Risk & Conflict (Vibrant Red / #f43f5e)
 * - Strand 3: Climate & Agri (Emerald Green / #10b981)
 */
export default function GlobalImpactDna({
  riskScore = 42,
  activityLevel = 65,
  climateScore = 38,
  compact = false,
  asSidePanel = false,
  isOpen = true,
  onClose,
  persona = 'Casual user',
  className = ''
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedStrand, setSelectedStrand] = useState(null); // 'economy' | 'risk' | 'climate' | null
  const [visualMode, setVisualMode] = useState('globe'); // 'globe' | 'helix' | 'wave'
  const [showInstructions, setShowInstructions] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState('howToRead'); // 'howToRead' | 'strands' | 'personas'

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

    // Generate random background stars once
    const stars = Array.from({ length: 45 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.02 + 0.005
    }));

    const render = () => {
      try {
        const container = containerRef.current || canvas.parentElement;
        const width = container ? container.clientWidth : 340;
        const height = container ? container.clientHeight : (compact ? 130 : 200);

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

        time += 0.015 + (normalizedActivity / 100) * 0.025;

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, width, height);

        const centerX = width / 2;
        const centerY = height / 2;

        // 1. Draw Starfield Background
        stars.forEach(star => {
          star.alpha = 0.3 + Math.sin(time * 2 + star.x * 10) * 0.3;
          ctx.beginPath();
          ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(168, 85, 247, ${star.alpha})`;
          ctx.fill();
        });

        if (visualMode === 'globe') {
          // --- 3D HOLOGRAPHIC GLOBE + ORBITING TRIPLE HELIX ---
          const globeRadius = Math.min(width, height) * (compact ? 0.28 : 0.32);
          const rotY = time * 0.4;
          const rotX = Math.sin(time * 0.2) * 0.15;

          // A. Globe Atmosphere Core Glow
          const atmosphereGradient = ctx.createRadialGradient(
            centerX, centerY, globeRadius * 0.2,
            centerX, centerY, globeRadius * 1.3
          );
          if (isHighTension) {
            atmosphereGradient.addColorStop(0, 'rgba(244, 63, 94, 0.25)');
            atmosphereGradient.addColorStop(0.6, 'rgba(244, 63, 94, 0.08)');
            atmosphereGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          } else {
            atmosphereGradient.addColorStop(0, 'rgba(56, 189, 248, 0.2)');
            atmosphereGradient.addColorStop(0.6, 'rgba(168, 85, 247, 0.08)');
            atmosphereGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          }
          ctx.beginPath();
          ctx.arc(centerX, centerY, globeRadius * 1.3, 0, Math.PI * 2);
          ctx.fillStyle = atmosphereGradient;
          ctx.fill();

          // B. 3D Globe Latitude & Longitude Wireframe Grid
          const latLines = 6;
          const lonLines = 8;
          ctx.strokeStyle = isHighTension ? 'rgba(244, 63, 94, 0.2)' : 'rgba(168, 85, 247, 0.22)';
          ctx.lineWidth = 1;

          // Latitude Circles
          for (let i = 1; i < latLines; i++) {
            const phi = (i / latLines) * Math.PI - Math.PI / 2;
            const rLat = globeRadius * Math.cos(phi);
            const yLat = centerY + globeRadius * Math.sin(phi);
            ctx.beginPath();
            ctx.ellipse(centerX, yLat, rLat, rLat * 0.35, 0, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Longitude Meridians
          for (let i = 0; i < lonLines; i++) {
            const theta = (i / lonLines) * Math.PI + rotY;
            const rx = globeRadius * Math.sin(theta);
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, Math.abs(rx), globeRadius, 0, 0, Math.PI * 2);
            ctx.stroke();
          }

          // C. Orbiting Triple Helix Strands wrapping around 3D Globe
          const strandConfigs = [
            { id: 'economy', color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.6)', phase: 0, ampMult: 1.1 },
            { id: 'risk', color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.7)', phase: (Math.PI * 2) / 3, ampMult: 1.25 * (1 + instabilityFactor * 0.3) },
            { id: 'climate', color: '#10b981', glow: 'rgba(16, 185, 129, 0.6)', phase: (Math.PI * 4) / 3, ampMult: 1.05 }
          ];

          const numBeads = compact ? 28 : 42;
          const renderElements = [];

          strandConfigs.forEach((strand) => {
            if (selectedStrand && selectedStrand !== strand.id) return;

            for (let i = 0; i < numBeads; i++) {
              const progress = i / numBeads;
              const angle = time * 0.8 + progress * Math.PI * 3 + strand.phase;

              // Spherical spiral around globe
              const orbitR = globeRadius * strand.ampMult;
              const x3d = Math.cos(angle) * orbitR;
              const y3d = (progress - 0.5) * globeRadius * 2.2 + Math.sin(angle * 2) * (instabilityFactor * 12);
              const z3d = Math.sin(angle) * orbitR;

              // Rotate 3D point around Y and X
              const cosY = Math.cos(rotY * 0.5);
              const sinY = Math.sin(rotY * 0.5);
              const rx3d = x3d * cosY - z3d * sinY;
              const rz3d = x3d * sinY + z3d * cosY;

              const perspective = 300;
              const scale = perspective / (perspective + rz3d);
              const scrX = centerX + rx3d * scale;
              const scrY = centerY + y3d * scale;
              const opacity = Math.max(0.15, Math.min(1, (rz3d + orbitR) / (orbitR * 2)));

              renderElements.push({
                type: 'bead',
                id: strand.id,
                color: strand.color,
                glow: strand.glow,
                x: scrX,
                y: scrY,
                z: rz3d,
                scale,
                opacity,
                isFront: rz3d > 0
              });
            }
          });

          // Sort 3D elements by Z depth (back to front)
          renderElements.sort((a, b) => a.z - b.z);

          // Render sorted 3D beads
          renderElements.forEach((el) => {
            const baseSize = (compact ? 2.2 : 3) * el.scale;
            const isHighlight = selectedStrand === el.id;
            const finalSize = isHighlight ? baseSize * 1.5 : baseSize;

            ctx.beginPath();
            ctx.arc(el.x, el.y, finalSize * 2, 0, Math.PI * 2);
            ctx.fillStyle = el.glow;
            ctx.globalAlpha = el.opacity * 0.6;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(el.x, el.y, finalSize, 0, Math.PI * 2);
            ctx.fillStyle = el.isFront ? '#ffffff' : el.color;
            ctx.globalAlpha = el.opacity;
            ctx.fill();
            ctx.globalAlpha = 1.0;
          });

        } else if (visualMode === 'helix') {
          // --- HOLOGRAPHIC LINEAR HELIX ---
          const numPoints = compact ? 32 : 48;
          const startX = 20;
          const endX = width - 20;
          const stepX = (endX - startX) / Math.max(1, numPoints - 1);
          const distortion = instabilityFactor * 16;

          const strands = [
            { id: 'economy', name: 'Economy', color: '#38bdf8', glow: 'rgba(56,189,248,0.5)', phase: 0, amp: Math.min(height * 0.32, 44) },
            { id: 'risk', name: 'Risk', color: '#f43f5e', glow: 'rgba(244,63,94,0.6)', phase: (Math.PI * 2) / 3, amp: Math.min(height * 0.35, 48) * (1 + instabilityFactor * 0.25) },
            { id: 'climate', name: 'Climate', color: '#10b981', glow: 'rgba(16,185,129,0.5)', phase: (Math.PI * 4) / 3, amp: Math.min(height * 0.3, 40) }
          ];

          const strandPoints = strands.map((strand) => {
            const points = [];
            for (let i = 0; i < numPoints; i++) {
              const x = startX + i * stepX;
              const progress = i / (numPoints - 1);
              const angle = time + progress * Math.PI * 4 + strand.phase;
              let noise = 0;
              if (instabilityFactor > 0.3) {
                noise = Math.sin(time * 3.4 + i * 0.65) * distortion * Math.sin(progress * Math.PI);
              }
              const z = Math.sin(angle);
              const y = centerY + Math.cos(angle) * strand.amp + noise;
              points.push({ x, y, z, scale: 0.75 + (z + 1) * 0.25 });
            }
            return points;
          });

          // Draw connector rungs
          for (let i = 0; i < numPoints; i += 3) {
            const p1 = strandPoints[0][i];
            const p2 = strandPoints[1][i];
            if (p1 && p2) {
              ctx.beginPath();
              ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
              ctx.lineWidth = 1;
              ctx.setLineDash([2, 3]);
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
              ctx.setLineDash([]);
            }
          }

          // Draw strand curves & nodes
          strands.forEach((strand, sIdx) => {
            if (selectedStrand && selectedStrand !== strand.id) return;
            const points = strandPoints[sIdx];
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length - 1; i++) {
              const xc = (points[i].x + points[i + 1].x) / 2;
              const yc = (points[i].y + points[i + 1].y) / 2;
              ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }
            ctx.strokeStyle = strand.color;
            ctx.lineWidth = selectedStrand === strand.id ? 3.5 : 2.2;
            ctx.stroke();

            points.forEach((p, idx) => {
              if (idx % 2 === 0) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.scale * 3, 0, Math.PI * 2);
                ctx.fillStyle = strand.color;
                ctx.fill();
              }
            });
          });

        } else {
          // --- SPHERICAL THREAT WAVE MATRIX ---
          const waveRadius = Math.min(width, height) * 0.35;
          const pointsCount = 60;
          ctx.beginPath();
          for (let i = 0; i <= pointsCount; i++) {
            const angle = (i / pointsCount) * Math.PI * 2;
            const r = waveRadius + Math.sin(angle * 6 + time * 3) * (10 + instabilityFactor * 20);
            const x = centerX + Math.cos(angle) * r;
            const y = centerY + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.strokeStyle = isHighTension ? '#f43f5e' : '#38bdf8';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        ctx.restore();
      } catch (e) {
        // Suppress rendering exceptions
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [normalizedRisk, normalizedActivity, normalizedClimate, compact, instabilityFactor, isHighTension, selectedStrand, visualMode]);

  const toggleExpand = () => {
    playSound('toggle');
    setIsExpanded(!isExpanded);
  };

  const handleStrandClick = (id) => {
    playSound('click');
    setSelectedStrand(selectedStrand === id ? null : id);
  };

  // Get persona-tailored DNA instructions badge
  const getPersonaDnaBadge = () => {
    const pLower = (persona || '').toLowerCase();
    if (pLower.includes('farmer') || pLower.includes('kisan')) {
      return { icon: <Wheat className="w-3.5 h-3.5 text-emerald-400" />, title: 'Kisan Agrarian DNA Telemetry', focus: 'Monitor Green Climate Strand & Red Risk Spikes for harvesting & Mandi dispatch.' };
    } else if (pLower.includes('student')) {
      return { icon: <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />, title: 'Student Academic DNA Guide', focus: 'Observe Blue Economy twist & Red Risk velocity for exam case studies.' };
    } else if (pLower.includes('business')) {
      return { icon: <Briefcase className="w-3.5 h-3.5 text-purple-400" />, title: 'Enterprise Risk DNA Monitor', focus: 'Track Red Risk distortion to adjust supply lead times & freight buffers.' };
    } else if (pLower.includes('analyst')) {
      return { icon: <LineChart className="w-3.5 h-3.5 text-pink-400" />, title: 'Tactical Command DNA Telemetry', focus: 'Audit 3D planetary balance index & threat vector spillover.' };
    }
    return { icon: <Users className="w-3.5 h-3.5 text-amber-400" />, title: 'Everyday Citizen DNA Overview', focus: 'Track general planetary stability & local household risk index.' };
  };

  const personaBadge = getPersonaDnaBadge();

  // Render Side Drawer Panel
  if (asSidePanel) {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-md animate-fade-in">
        <div 
          className="relative w-full max-w-lg h-full bg-[#050814] border-l border-purple-500/30 shadow-2xl p-5 flex flex-col overflow-y-auto space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
                <Globe2 className="w-5 h-5 animate-spin-slow text-purple-300" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white tracking-wide">
                  Global Impact DNA Globe & Telemetry
                </h3>
                <p className="font-mono text-[10px] text-purple-300">
                  3D Holographic Planetary Equilibrium Model
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

          {/* Canvas View */}
          <div 
            ref={containerRef}
            className="w-full h-56 rounded-xl bg-slate-950/90 border border-purple-500/30 overflow-hidden relative shadow-inner flex items-center justify-center"
          >
            <canvas ref={canvasRef} className="w-full h-full" />
            <div className="absolute bottom-2 left-3 font-mono text-[9px] text-slate-400 pointer-events-none">
              ROTATION: {(0.015 + (normalizedActivity / 100) * 0.025).toFixed(3)} rad/s · DISTORTION: {(instabilityFactor * 100).toFixed(0)}%
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center justify-between bg-slate-900/80 border border-purple-500/20 p-1.5 rounded-xl font-mono text-xs">
            <button
              onClick={() => setVisualMode('globe')}
              className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                visualMode === 'globe' ? 'bg-purple-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>3D Globe</span>
            </button>
            <button
              onClick={() => setVisualMode('helix')}
              className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                visualMode === 'helix' ? 'bg-purple-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Dna className="w-3.5 h-3.5" />
              <span>Hologram Helix</span>
            </button>
            <button
              onClick={() => setVisualMode('wave')}
              className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                visualMode === 'wave' ? 'bg-purple-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Threat Wave</span>
            </button>
          </div>

          {/* Persona Guidance Banner */}
          <div className="p-3 bg-purple-950/30 border border-purple-500/30 rounded-xl font-sans text-xs">
            <div className="flex items-center gap-2 font-mono text-purple-300 font-bold mb-1">
              {personaBadge.icon}
              <span>{personaBadge.title}</span>
            </div>
            <p className="text-slate-200 text-xs leading-relaxed">{personaBadge.focus}</p>
          </div>

          {/* 3 Strands Selector */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs text-purple-300 uppercase tracking-wider font-semibold">
              The 3 Planetary Strands:
            </h4>

            {/* Economy */}
            <div 
              onClick={() => handleStrandClick('economy')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedStrand === 'economy' ? 'bg-cyan-950/50 border-cyan-400 shadow-md' : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs font-bold text-cyan-300 mb-1">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
                  ECONOMY & TECH (BLUE)
                </span>
                <span>{100 - normalizedRisk}% Throughput</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Tracks maritime trade velocity, financial liquidity, semiconductor supply chains, and market confidence.
              </p>
            </div>

            {/* Risk */}
            <div 
              onClick={() => handleStrandClick('risk')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedStrand === 'risk' ? 'bg-rose-950/50 border-rose-400 shadow-md' : 'bg-slate-900/60 border-slate-800 hover:border-rose-500/40'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-xs font-bold text-rose-400 mb-1">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
                  RISK & GEOPOLITICS (RED)
                </span>
                <span>{normalizedRisk}% Tension Index</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Reflects active war corridors, cyber threat intensity, and border friction. Higher scores distort the 3D globe orbit into chaotic wave spikes.
              </p>
            </div>

            {/* Climate */}
            <div 
              onClick={() => handleStrandClick('climate')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedStrand === 'climate' ? 'bg-emerald-950/50 border-emerald-400 shadow-md' : 'bg-slate-900/60 border-slate-800 hover:border-emerald-500/40'
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
                Monitors rainfall anomalies, agricultural yield risks, monsoon cycles, and raw grain food security.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard Dashboard Component Mode
  return (
    <div 
      id="global-impact-dna"
      className={`glass-card-luxe rounded-2xl border border-purple-500/30 p-5 relative overflow-hidden transition-all shadow-2xl ${className}`}
    >
      {/* Background glow */}
      <div 
        className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-25"
        style={{
          background: isHighTension 
            ? 'radial-gradient(circle, #f43f5e 0%, transparent 65%)' 
            : 'radial-gradient(circle, #a855f7 0%, transparent 65%)'
        }}
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between z-10 relative mb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl border shadow-lg ${
            isHighTension 
              ? 'bg-rose-500/20 border-rose-500/40 shadow-rose-500/30' 
              : 'bg-gradient-to-br from-purple-600/40 to-cyan-500/20 border-purple-500/40 shadow-purple-500/30'
          }`}>
            <Globe2 className={`w-5 h-5 ${
              isHighTension ? 'text-rose-400 animate-pulse' : 'text-cyan-300 animate-spin-slow'
            }`} />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="font-display text-sm font-bold text-white tracking-widest uppercase">
                Global Impact 3D DNA Globe
              </h3>
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                3D LIVE
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
              3D Holographic Globe & Triple Helix · Economy · Risk · Climate
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Instructions Guide Button */}
          <button
            onClick={() => {
              playSound('click');
              setShowInstructions(!showInstructions);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs rounded-xl border transition-all ${
              showInstructions 
                ? 'bg-purple-600 border-purple-400 text-white shadow-md' 
                : 'bg-slate-900/80 border-purple-500/30 text-purple-300 hover:bg-purple-950/50 hover:border-purple-400'
            }`}
            title="Read detailed instructions & persona DNA manual"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>DNA Guide & Instructions</span>
          </button>

          {/* Mode Switcher Toggle */}
          <button
            onClick={() => {
              playSound('click');
              setVisualMode(visualMode === 'globe' ? 'helix' : visualMode === 'helix' ? 'wave' : 'globe');
            }}
            className="p-2 bg-slate-900/80 border border-purple-500/30 text-cyan-300 hover:text-white rounded-xl transition-all font-mono text-xs flex items-center gap-1"
            title="Switch 3D View Mode"
          >
            {visualMode === 'globe' ? <Globe2 className="w-4 h-4 text-cyan-400" /> : visualMode === 'helix' ? <Dna className="w-4 h-4 text-purple-400" /> : <Activity className="w-4 h-4 text-rose-400" />}
            <span className="hidden md:inline uppercase text-[10px]">{visualMode}</span>
          </button>

          <button
            onClick={toggleExpand}
            className="p-2 text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30 rounded-xl transition-all"
            title={isExpanded ? 'Collapse' : 'Expand DNA view'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 3D Holographic Globe Canvas */}
      <div 
        ref={containerRef}
        className={`relative w-full rounded-2xl border overflow-hidden shadow-2xl cursor-pointer group ${
          isHighTension 
            ? 'bg-slate-950 border-rose-500/30 shadow-rose-950/40' 
            : 'bg-slate-950 border-purple-500/30 shadow-purple-950/40'
        } ${
          isExpanded ? 'h-80' : compact ? 'h-32' : 'h-52'
        }`}
        onClick={toggleExpand}
        title="Click to expand / collapse 3D Globe"
      >
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
        />

        {/* Depth vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to right, rgba(3,7,18,0.6) 0%, transparent 15%, transparent 85%, rgba(3,7,18,0.6) 100%)'
        }} />

        {/* Telemetry HUD overlay */}
        <div className="absolute bottom-3 left-4 pointer-events-none flex items-center gap-4 font-mono text-[10px] flex-wrap">
          <span className="text-cyan-300 flex items-center gap-1 font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            3D GLOBE ROTATION: {(0.015 + (normalizedActivity / 100) * 0.025).toFixed(3)} rad/s
          </span>
          <span className="text-rose-400 flex items-center gap-1 font-bold">
            ⚡ DISTORTION: {(instabilityFactor * 100).toFixed(0)}%
          </span>
          <span className="text-emerald-300 font-bold">✦ STRANDS: 3 ACTIVE</span>
        </div>

        {/* Persona Active Overlay Badge */}
        <div className="absolute top-3 left-3 bg-slate-950/80 border border-purple-500/30 px-3 py-1 rounded-lg text-purple-200 font-mono text-[10px] flex items-center gap-1.5 shadow-md">
          {personaBadge.icon}
          <span>{personaBadge.title}</span>
        </div>
      </div>

      {/* 3 Strands Status Metric Strip */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-purple-500/20 z-10 relative">
        <button 
          onClick={() => handleStrandClick('economy')}
          className={`bg-slate-900/70 border rounded-xl p-2.5 text-left transition-all ${
            selectedStrand === 'economy' ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20' : 'border-cyan-500/20 hover:border-cyan-500/50'
          }`}
        >
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyan-300 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50 animate-pulse" />
            <span className="truncate">ECONOMY (BLUE)</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xs text-white font-bold">{100 - normalizedRisk}%</span>
            <span className="font-mono text-[9px] text-cyan-300/80">Flow</span>
          </div>
        </button>

        <button 
          onClick={() => handleStrandClick('risk')}
          className={`bg-slate-900/70 border rounded-xl p-2.5 text-left transition-all ${
            selectedStrand === 'risk' ? 'border-rose-400 bg-rose-950/40 shadow-lg shadow-rose-500/20' : 'border-rose-500/20 hover:border-rose-500/50'
          }`}
        >
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-rose-300 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50 animate-ping" />
            <span className="truncate">RISK (RED)</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xs text-rose-400 font-bold">{normalizedRisk}%</span>
            <span className="font-mono text-[9px] text-rose-300/80">{isHighTension ? 'Tension' : 'Nominal'}</span>
          </div>
        </button>

        <button 
          onClick={() => handleStrandClick('climate')}
          className={`bg-slate-900/70 border rounded-xl p-2.5 text-left transition-all ${
            selectedStrand === 'climate' ? 'border-emerald-400 bg-emerald-950/40 shadow-lg shadow-emerald-500/20' : 'border-emerald-500/20 hover:border-emerald-500/50'
          }`}
        >
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-300 font-semibold mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
            <span className="truncate">CLIMATE (GREEN)</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xs text-emerald-400 font-bold">{normalizedClimate}%</span>
            <span className="font-mono text-[9px] text-emerald-300/80">Monitored</span>
          </div>
        </button>
      </div>

      {/* --- INSTRUCTIONS & PERSONA MANUAL MODAL --- */}
      {showInstructions && (
        <div className="mt-4 p-4 rounded-2xl bg-slate-950 border-2 border-purple-500/40 shadow-2xl space-y-4 animate-fade-in relative z-20">
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3 border-b border-purple-500/25">
            <div className="flex items-center gap-2 font-display text-sm font-bold text-white">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Planetary DNA Telemetry Instructions & Manual</span>
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Guide Tabs */}
          <div className="flex gap-2 border-b border-purple-500/20 pb-2 font-mono text-xs">
            <button
              onClick={() => setActiveGuideTab('howToRead')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                activeGuideTab === 'howToRead' ? 'bg-purple-600 border-purple-400 text-white font-bold' : 'bg-slate-900 text-slate-400 border-transparent hover:text-white'
              }`}
            >
              1. Reading the 3D DNA
            </button>
            <button
              onClick={() => setActiveGuideTab('strands')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                activeGuideTab === 'strands' ? 'bg-purple-600 border-purple-400 text-white font-bold' : 'bg-slate-900 text-slate-400 border-transparent hover:text-white'
              }`}
            >
              2. The 3 Strands
            </button>
            <button
              onClick={() => setActiveGuideTab('personas')}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                activeGuideTab === 'personas' ? 'bg-purple-600 border-purple-400 text-white font-bold' : 'bg-slate-900 text-slate-400 border-transparent hover:text-white'
              }`}
            >
              3. Persona Workflows
            </button>
          </div>

          {/* Tab 1: How to Read the 3D DNA Globe */}
          {activeGuideTab === 'howToRead' && (
            <div className="space-y-2.5 font-sans text-xs text-slate-300 leading-relaxed">
              <p className="font-medium text-white">
                The <strong className="text-purple-300">Global Impact DNA</strong> is a real-time 3D holographic biometrics model representing global equilibrium:
              </p>
              <ul className="space-y-1.5 list-disc list-inside font-mono text-[11px] text-slate-300">
                <li><strong className="text-cyan-300">Twist Velocity:</strong> Globe & helix rotation speed increases automatically as live market trading and international dispatches accelerate.</li>
                <li><strong className="text-rose-400">Wave Distortion & Spikes:</strong> High geopolitical tension or warfare alerts distort the 3D orbits into chaotic, pulsing wave spikes.</li>
                <li><strong className="text-emerald-300">Base-Pair Rungs:</strong> Interconnecting dashed lines represent cross-domain ripple effects (e.g. how war impacts fuel prices and crop harvest).</li>
              </ul>
            </div>
          )}

          {/* Tab 2: The 3 Strands Breakdown */}
          {activeGuideTab === 'strands' && (
            <div className="space-y-2.5 font-sans text-xs">
              <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                <span className="font-mono text-cyan-300 font-bold block mb-1">🔵 Blue Strand: Economy & Freight</span>
                <p className="text-slate-300 text-[11px]">Monitors global shipping corridors, currency exchange liquidity, semiconductor manufacturing, and corporate trade speed.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-500/30">
                <span className="font-mono text-rose-400 font-bold block mb-1">🔴 Red Strand: Risk & Conflict</span>
                <p className="text-slate-300 text-[11px]">Tracks active warfare, missile alerts, cyber attacks, civil unrest, and international trade sanctions.</p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                <span className="font-mono text-emerald-300 font-bold block mb-1">🟢 Green Strand: Climate & Food</span>
                <p className="text-slate-300 text-[11px]">Measures monsoon rainfall cycles, heatwave alerts, crop soil moisture, and raw agricultural commodity harvests.</p>
              </div>
            </div>
          )}

          {/* Tab 3: Persona Specific Workflow Instructions */}
          {activeGuideTab === 'personas' && (
            <div className="space-y-2.5 font-sans text-xs">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-purple-500/20">
                <span className="font-mono text-emerald-300 font-bold flex items-center gap-1.5 mb-1">
                  <Wheat className="w-3.5 h-3.5" /> 🌾 Kisan / Farmer Instructions
                </span>
                <p className="text-slate-300 text-[11px]">Watch the Green Climate Strand for monsoon timing & rain anomalies. If the Red Risk Strand spikes, check diesel pump rates and Mandi procurement centers immediately.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-purple-500/20">
                <span className="font-mono text-cyan-300 font-bold flex items-center gap-1.5 mb-1">
                  <GraduationCap className="w-3.5 h-3.5" /> 🎓 Student Instructions
                </span>
                <p className="text-slate-300 text-[11px]">Use DNA rotation velocity and Red Risk spikes to identify high-order case studies for UPSC, GRE, and international current affairs exam essays.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-purple-500/20">
                <span className="font-mono text-purple-300 font-bold flex items-center gap-1.5 mb-1">
                  <Briefcase className="w-3.5 h-3.5" /> 💼 Enterprise / Business Instructions
                </span>
                <p className="text-slate-300 text-[11px]">If Red Risk distortion rises above 50%, extend vendor lead-times by 7-10 days and lock in freight forwarder contracts to prevent supply chain bottlenecks.</p>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-purple-500/20">
                <span className="font-mono text-pink-300 font-bold flex items-center gap-1.5 mb-1">
                  <LineChart className="w-3.5 h-3.5" /> 🛡️ Strategic Analyst Instructions
                </span>
                <p className="text-slate-300 text-[11px]">Audit the 3D globe balance index to evaluate proxy force postures and sovereign debt CDS volatility for command dispatches.</p>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

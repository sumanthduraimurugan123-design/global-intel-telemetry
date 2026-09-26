import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Globe2, BookOpen, Maximize2, Minimize2, X,
  Wheat, GraduationCap, Briefcase, LineChart, Users,
  AlertTriangle, Eye, Wifi
} from 'lucide-react';
import { playSound } from '../services/soundSystem';

/**
 * GlobalImpactDna
 * ───────────────
 * A 3D holographic globe with three orbiting DNA helix strands.
 *
 *  🔵 Blue  = Economy & Trade
 *  🔴 Red   = Risk & Conflict
 *  🟢 Green = Climate & Food
 *
 * Designed to be understood by EVERYONE — farmers, students,
 * business owners, analysts, and everyday citizens.
 */
export default function GlobalImpactDna({
  riskScore     = 42,
  activityLevel = 65,
  climateScore  = 38,
  compact       = false,
  asSidePanel   = false,
  isOpen        = true,
  onClose,
  persona       = 'Casual user',
  className     = '',
}) {
  const canvasRef    = useRef(null);
  const containerRef = useRef(null);
  const animRef      = useRef(null);
  const timeRef      = useRef(0);

  const [isExpanded,     setIsExpanded]     = useState(false);
  const [selectedStrand, setSelectedStrand] = useState(null);
  const [showGuide,      setShowGuide]      = useState(false);
  const [guideTab,       setGuideTab]       = useState('simple');
  const [liveStatus,     setLiveStatus]     = useState('LIVE');

  // Normalise 0-100
  const risk     = Math.max(5,  Math.min(100, Number(riskScore)     || 42));
  const activity = Math.max(10, Math.min(100, Number(activityLevel) || 60));
  const climate  = Math.max(5,  Math.min(100, Number(climateScore)  || 35));

  const instability   = risk / 100;
  const isHighTension = risk > 60;

  // ── Live event hotspots (real lat/lon) ──────────────────────────────────────
  const HOTSPOTS = [
    { lat:  28.6, lon:  77.2, label: 'Delhi: Market Activity',       color: '#38bdf8', type: 'economy' },
    { lat:  51.5, lon:  -0.1, label: 'London: Trade Hub',            color: '#38bdf8', type: 'economy' },
    { lat:  31.2, lon: 121.5, label: 'Shanghai: Port Dispatch',      color: '#38bdf8', type: 'economy' },
    { lat:  48.8, lon:   2.3, label: 'Paris: Climate Summit',        color: '#10b981', type: 'climate' },
    { lat: -23.5, lon: -46.6, label: 'Sao Paulo: Agri Output',       color: '#10b981', type: 'climate' },
    { lat:  33.3, lon:  44.4, label: 'Baghdad: Conflict Zone',       color: '#f43f5e', type: 'risk'    },
    { lat:  50.4, lon:  30.5, label: 'Kyiv: Active Alert',           color: '#f43f5e', type: 'risk'    },
    { lat:  40.7, lon: -74.0, label: 'New York: Financial Hub',      color: '#38bdf8', type: 'economy' },
    { lat:  35.7, lon: 139.7, label: 'Tokyo: Tech Corridor',         color: '#38bdf8', type: 'economy' },
    { lat:  -1.3, lon:  36.8, label: 'Nairobi: Food Security Alert', color: '#10b981', type: 'climate' },
  ];

  // ── Persona-aware plain-language panel ──────────────────────────────────────
  const getPersonaInfo = useCallback(() => {
    const p = (persona || '').toLowerCase();

    if (p.includes('farmer') || p.includes('kisan')) return {
      icon:   <Wheat className="w-4 h-4 text-emerald-400" />,
      title:  '🌾 For You, Farmer',
      what:   'This spinning globe shows the world\'s health in 3 simple colors.',
      tips: [
        { icon: '🟢', text: 'GREEN going slow → Good rains coming, prices may drop. Hold your stock.' },
        { icon: '🔴', text: 'RED rising high → Diesel and transport costs going up. Sell at Mandi quickly.' },
        { icon: '🔵', text: 'BLUE spinning fast → Trade is active. Good export demand for your crops.' },
      ],
      action: risk > 60
        ? '⚠️ High Red Alert: Diesel prices may spike. Contact your Mandi agent today.'
        : '✅ Globe looks stable. Safe time to plan crop dispatch.',
    };

    if (p.includes('student')) return {
      icon:   <GraduationCap className="w-4 h-4 text-cyan-400" />,
      title:  '🎓 For You, Student',
      what:   'Each spinning strand is a real world system you can study for exams.',
      tips: [
        { icon: '🔵', text: 'BLUE strand = Economics. Faster spin = good UPSC/GK trade topics.' },
        { icon: '🔴', text: 'RED strand = Geopolitics. Spikes = current affairs exam material.' },
        { icon: '🟢', text: 'GREEN strand = Environment. Essential for IELTS/GRE essays.' },
      ],
      action: risk > 60
        ? '📚 High tension — great time to revise international relations!'
        : '📖 Stable world. Focus on economics and trade chapters now.',
    };

    if (p.includes('business')) return {
      icon:   <Briefcase className="w-4 h-4 text-purple-400" />,
      title:  '💼 For You, Business Owner',
      what:   'This globe tracks 3 forces that affect your supply chain and costs.',
      tips: [
        { icon: '🔴', text: `RED at ${risk}% → ${risk > 60 ? 'Add 7–10 days to delivery timelines NOW.' : 'Supply chains normal. No change needed.'}` },
        { icon: '🔵', text: `BLUE at ${100 - risk}% → Trade flow ${100 - risk > 60 ? 'good — lock in freight rates today.' : 'slow — negotiate lower freight costs.'}` },
        { icon: '🟢', text: `GREEN at ${climate}% → Raw material prices ${climate > 50 ? 'under pressure — stock up.' : 'stable.'}` },
      ],
      action: risk > 60
        ? '⚠️ Risk High: Extend vendor payment terms and hedge your FX exposure.'
        : '✅ Low risk window. Good time to sign new supplier contracts.',
    };

    if (p.includes('analyst') || p.includes('strategic')) return {
      icon:   <LineChart className="w-4 h-4 text-pink-400" />,
      title:  '🛡️ Strategic Analyst View',
      what:   '3-axis equilibrium matrix: Economy ↔ Risk ↔ Climate interplay.',
      tips: [
        { icon: '🔴', text: `Risk Index: ${risk}% — ${risk > 70 ? 'Escalation phase. Monitor proxy corridors.' : risk > 50 ? 'Elevated. Watch maritime chokepoints.' : 'Nominal baseline ISR posture.'}` },
        { icon: '🔵', text: `Economy Throughput: ${100 - risk}% — ${100 - risk > 60 ? 'Liquidity nominal. FX stable.' : 'Liquidity stress. CDS spreads widening.'}` },
        { icon: '🟢', text: `Climate Index: ${climate}% — ${climate > 60 ? 'Agri stress. Food security risk elevated.' : 'Monsoon corridor nominal.'}` },
      ],
      action: risk > 60
        ? `⚡ Threat vector active at ${risk}%. Audit proxy postures and sovereign CDS.`
        : '✦ Planetary equilibrium nominal. Maintain standing watch.',
    };

    // Default – common person
    return {
      icon:   <Users className="w-4 h-4 text-amber-400" />,
      title:  '👋 What Does This Mean For You?',
      what:   'This globe is like a health check for the whole world — shown in 3 colors.',
      tips: [
        { icon: '🟢', text: 'GREEN strand — Are farms and weather okay? High = possible food price rise.' },
        { icon: '🔴', text: 'RED strand — Is the world peaceful? High = conflict somewhere, petrol may cost more.' },
        { icon: '🔵', text: 'BLUE strand — Is business good? High = jobs and economy are doing well.' },
      ],
      action: risk > 60
        ? '⚠️ World is a bit tense right now. Some goods may become more expensive soon.'
        : '✅ The world looks fairly stable today. No major alarms.',
    };
  }, [persona, risk, climate]);

  // ── Canvas 3D Globe Renderer ────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background stars
    const stars = Array.from({ length: 70 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.3 + 0.3,
      a: Math.random() * 0.5 + 0.2,
      sp: Math.random() * 0.01 + 0.003,
    }));

    // Continent dot cloud (simplified lat/lon clusters)
    const contDots = [
      ...Array.from({ length: 50 }, () => ({ lat: 35  + Math.random() * 20, lon: -100 + Math.random() * 45 })), // N.America
      ...Array.from({ length: 40 }, () => ({ lat: 45  + Math.random() * 18, lon:   -5 + Math.random() * 35 })), // Europe
      ...Array.from({ length: 65 }, () => ({ lat: 15  + Math.random() * 40, lon:   60 + Math.random() * 90 })), // Asia
      ...Array.from({ length: 40 }, () => ({ lat: -25 + Math.random() * 50, lon:  -15 + Math.random() * 55 })), // Africa
      ...Array.from({ length: 30 }, () => ({ lat: -32 + Math.random() * 42, lon:  -75 + Math.random() * 38 })), // S.America
      ...Array.from({ length: 18 }, () => ({ lat: -30 + Math.random() * 18, lon:  115 + Math.random() * 38 })), // Australia
    ];

    // Lat/Lon → screen projection (orthographic + mild perspective)
    const proj = (lat, lon, rotY, R, cx, cy) => {
      const phi   = (lat * Math.PI) / 180;
      const theta = (lon * Math.PI) / 180 + rotY;
      const x3 = Math.cos(phi) * Math.cos(theta);
      const y3 = Math.sin(phi);
      const z3 = Math.cos(phi) * Math.sin(theta);
      const pv = 2.6 / (2.6 + z3 * 0.28);
      return { x: cx + x3 * R * pv, y: cy - y3 * R * pv, z: z3, visible: z3 > -0.08 };
    };

    const render = () => {
      try {
        const cont = containerRef.current || canvas.parentElement;
        const W = cont ? cont.clientWidth  : 420;
        const H = cont ? cont.clientHeight : 240;
        if (W < 40 || H < 20) { animRef.current = requestAnimationFrame(render); return; }

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        if (canvas.width !== Math.floor(W * dpr) || canvas.height !== Math.floor(H * dpr)) {
          canvas.width  = Math.floor(W * dpr);
          canvas.height = Math.floor(H * dpr);
        }

        const t  = timeRef.current;
        timeRef.current += 0.012 + (activity / 100) * 0.02;

        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, W, H);

        const cx = W / 2;
        const cy = H / 2;
        const R  = Math.min(W, H) * (compact ? 0.25 : 0.30);
        const rY = t * 0.32;

        // 1. Stars
        stars.forEach(s => {
          s.a = 0.2 + Math.abs(Math.sin(t * s.sp * 25 + s.x * 9)) * 0.55;
          ctx.beginPath();
          ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,185,255,${s.a})`;
          ctx.fill();
        });

        // 2. Deep-space ambient glow
        const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 1.8);
        bg.addColorStop(0, isHighTension ? 'rgba(244,63,94,0.10)'  : 'rgba(99,102,241,0.12)');
        bg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath(); ctx.arc(cx, cy, R * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = bg; ctx.fill();

        // 3. Globe sphere body
        const sg = ctx.createRadialGradient(cx - R * 0.28, cy - R * 0.22, R * 0.04, cx, cy, R);
        sg.addColorStop(0,    isHighTension ? 'rgba(55,8,18,0.97)'  : 'rgba(8,18,55,0.97)');
        sg.addColorStop(0.65, isHighTension ? 'rgba(35,4,12,0.93)'  : 'rgba(5,10,38,0.94)');
        sg.addColorStop(1,    'rgba(2,3,18,0.98)');
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fillStyle = sg; ctx.fill();

        // 4. Latitude circles
        for (let li = 1; li < 8; li++) {
          const phi = (li / 8) * Math.PI;
          const ry2 = Math.cos(phi - Math.PI / 2) * R;
          const py  = cy + Math.sin(phi - Math.PI / 2) * R;
          ctx.beginPath();
          ctx.ellipse(cx, py, Math.abs(ry2), Math.abs(ry2) * 0.17, 0, 0, Math.PI * 2);
          ctx.strokeStyle = isHighTension ? 'rgba(244,63,94,0.13)' : 'rgba(99,102,241,0.17)';
          ctx.lineWidth = 0.65; ctx.stroke();
        }

        // 5. Longitude meridians
        for (let mi = 0; mi < 10; mi++) {
          const theta = (mi / 10) * Math.PI + rY;
          ctx.beginPath();
          ctx.ellipse(cx, cy, Math.abs(Math.sin(theta)) * R, R, 0, 0, Math.PI * 2);
          ctx.strokeStyle = isHighTension ? 'rgba(244,63,94,0.11)' : 'rgba(99,102,241,0.13)';
          ctx.lineWidth = 0.55; ctx.stroke();
        }

        // 6. Continent dot-cloud
        contDots.forEach(d => {
          const p = proj(d.lat, d.lon, rY, R, cx, cy);
          if (!p.visible) return;
          const b = 0.25 + p.z * 0.75;
          ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(110,155,255,${b * 0.60})`; ctx.fill();
        });

        // 7. Live hotspot event markers
        HOTSPOTS.forEach((hs, hi) => {
          if (selectedStrand && selectedStrand !== hs.type) return;
          const p = proj(hs.lat, hs.lon, rY, R, cx, cy);
          if (!p.visible) return;
          const pulse = 0.5 + Math.sin(t * 2.4 + hi * 1.2) * 0.5;
          const r1 = 2.2 + pulse * 1.8;
          const r2 = 4.5 + pulse * 3.5;
          ctx.beginPath(); ctx.arc(p.x, p.y, r2, 0, Math.PI * 2);
          ctx.fillStyle = hs.color + '28'; ctx.fill();
          ctx.beginPath(); ctx.arc(p.x, p.y, r1, 0, Math.PI * 2);
          ctx.fillStyle = hs.color;
          ctx.globalAlpha = 0.85 + pulse * 0.15; ctx.fill();
          ctx.globalAlpha = 1;
        });

        // 8. Triple DNA helix strands orbiting the globe
        const strandDefs = [
          { id: 'economy', color: '#38bdf8', glow: 'rgba(56,189,248,0.50)',  phase: 0,                  amp: 1.18 },
          { id: 'risk',    color: '#f43f5e', glow: 'rgba(244,63,94,0.62)',   phase: (Math.PI * 2) / 3,  amp: 1.28 * (1 + instability * 0.25) },
          { id: 'climate', color: '#10b981', glow: 'rgba(16,185,129,0.50)',  phase: (Math.PI * 4) / 3,  amp: 1.12 },
        ];
        const nBeads = compact ? 32 : 52;
        const beads  = [];

        strandDefs.forEach(sd => {
          if (selectedStrand && selectedStrand !== sd.id) return;
          for (let i = 0; i < nBeads; i++) {
            const prog  = i / nBeads;
            const angle = t * 0.72 + prog * Math.PI * 2.8 + sd.phase;
            const or    = R * sd.amp;
            const x3d   = Math.cos(angle) * or;
            const y3d   = (prog - 0.5) * R * 2.1 + Math.sin(angle * 1.5) * (instability * 9);
            const z3d   = Math.sin(angle) * or;
            // Rotate around Y axis with globe
            const cR = Math.cos(rY * 0.38), sR = Math.sin(rY * 0.38);
            const rx3d = x3d * cR - z3d * sR;
            const rz3d = x3d * sR + z3d * cR;
            const pv   = 275 / (275 + rz3d);
            const op   = Math.max(0.07, Math.min(1, (rz3d + or) / (or * 2)));
            beads.push({
              id: sd.id, color: sd.color, glow: sd.glow,
              x: cx + rx3d * pv, y: cy + y3d * pv,
              z: rz3d, scl: pv, op, isFront: rz3d > 0,
            });
          }
        });

        // Sort back-to-front (painter's algorithm)
        beads.sort((a, b) => a.z - b.z);
        beads.forEach(b => {
          const sz = (compact ? 2 : 2.7) * b.scl * (selectedStrand === b.id ? 1.6 : 1);
          // Glow halo
          ctx.beginPath(); ctx.arc(b.x, b.y, sz * 2.3, 0, Math.PI * 2);
          ctx.fillStyle = b.glow; ctx.globalAlpha = b.op * 0.45; ctx.fill();
          // Core bead
          ctx.beginPath(); ctx.arc(b.x, b.y, sz, 0, Math.PI * 2);
          ctx.fillStyle = b.isFront ? '#ffffff' : b.color;
          ctx.globalAlpha = b.op; ctx.fill();
          ctx.globalAlpha = 1;
        });

        // 9. Atmosphere rim glow
        const rim = ctx.createRadialGradient(cx, cy, R * 0.87, cx, cy, R * 1.14);
        rim.addColorStop(0,    'rgba(0,0,0,0)');
        rim.addColorStop(0.55, isHighTension ? 'rgba(244,63,94,0.05)' : 'rgba(56,189,248,0.06)');
        rim.addColorStop(1,    isHighTension ? 'rgba(244,63,94,0.20)' : 'rgba(99,102,241,0.18)');
        ctx.beginPath(); ctx.arc(cx, cy, R * 1.14, 0, Math.PI * 2);
        ctx.fillStyle = rim; ctx.fill();

        // 10. Shine highlight (top-left specular)
        const sh = ctx.createRadialGradient(cx - R * 0.38, cy - R * 0.38, 0, cx - R * 0.25, cy - R * 0.25, R * 0.58);
        sh.addColorStop(0,   'rgba(255,255,255,0.13)');
        sh.addColorStop(0.5, 'rgba(255,255,255,0.04)');
        sh.addColorStop(1,   'rgba(255,255,255,0)');
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
        ctx.fillStyle = sh; ctx.fill();

        ctx.restore();
      } catch (e) { /* suppress render errors */ }
      animRef.current = requestAnimationFrame(render);
    };

    render();
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [risk, activity, climate, compact, instability, isHighTension, selectedStrand]);

  // Blinking LIVE status
  useEffect(() => {
    const id = setInterval(() => setLiveStatus(s => (s === 'LIVE' ? '● LIVE' : 'LIVE')), 900);
    return () => clearInterval(id);
  }, []);

  const personaInfo = getPersonaInfo();

  // Strand metadata for UI cards
  const STRAND_META = [
    {
      id: 'economy', cname: 'cyan',
      dot: 'bg-cyan-400', border: 'border-cyan-500/25', active: 'border-cyan-400 bg-cyan-950/40',
      label: '🔵 ECONOMY', val: `${100 - risk}%`, hint: 'Flow',
      simple: 'How well global business and shipping is working.',
      detail: `Trade flow at ${100 - risk}%. ${100 - risk > 60 ? 'Strong — markets liquid.' : 'Slow — supply chain stress possible.'}`,
    },
    {
      id: 'risk', cname: 'rose',
      dot: 'bg-rose-500', border: 'border-rose-500/25', active: 'border-rose-400 bg-rose-950/40',
      label: '🔴 RISK', val: `${risk}%`, hint: isHighTension ? '⚡HIGH' : 'Low',
      simple: 'How much war or conflict is happening in the world right now.',
      detail: `Risk tension at ${risk}%. ${risk > 60 ? 'High — prices may spike.' : 'Manageable — no major escalation.'}`,
    },
    {
      id: 'climate', cname: 'emerald',
      dot: 'bg-emerald-400', border: 'border-emerald-500/25', active: 'border-emerald-400 bg-emerald-950/40',
      label: '🟢 CLIMATE', val: `${climate}%`, hint: 'Monitor',
      simple: 'Are rains and food supply okay around the world?',
      detail: `Climate index at ${climate}%. ${climate > 60 ? 'Stress — drought or food risk.' : 'Harvest on track.'}`,
    },
  ];

  // ── Side Panel Mode ───────────────────────────────────────────────────────
  if (asSidePanel) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-md">
        <div
          className="relative w-full max-w-lg h-full bg-[#050814] border-l border-purple-500/30 shadow-2xl p-5 flex flex-col overflow-y-auto gap-4"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-purple-500/20">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/40">
                <Globe2 className="w-5 h-5 text-purple-300 animate-spin-slow" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white">Global Impact DNA Globe</h3>
                <p className="font-mono text-[10px] text-purple-300">3D Holographic Planetary Health Monitor</p>
              </div>
            </div>
            <button
              onClick={() => { playSound('click'); if (onClose) onClose(); }}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={containerRef} className="w-full h-64 rounded-xl bg-slate-950 border border-purple-500/30 overflow-hidden">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          {/* Plain-language persona block */}
          <div className="p-3.5 bg-purple-950/30 border border-purple-500/30 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-semibold text-sm text-white">
              {personaInfo.icon} <span>{personaInfo.title}</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">{personaInfo.what}</p>
            <div className="space-y-1.5">
              {personaInfo.tips.map((tip, i) => (
                <div key={i} className="flex gap-2 text-xs text-slate-200 leading-relaxed">
                  <span>{tip.icon}</span><span>{tip.text}</span>
                </div>
              ))}
            </div>
            <div className={`mt-2 text-xs font-semibold ${isHighTension ? 'text-rose-300' : 'text-emerald-300'}`}>
              {personaInfo.action}
            </div>
          </div>

          {STRAND_META.map(s => (
            <div
              key={s.id}
              onClick={() => { playSound('click'); setSelectedStrand(selectedStrand === s.id ? null : s.id); }}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                selectedStrand === s.id ? `${s.active} shadow-md` : `bg-slate-900/60 ${s.border}`
              }`}
            >
              <div className={`flex items-center justify-between font-mono text-xs font-bold text-${s.cname}-300 mb-1`}>
                <span className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                  {s.label}
                </span>
                <span>{s.val}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{s.simple}</p>
              {selectedStrand === s.id && (
                <p className={`mt-1.5 text-xs text-${s.cname}-200 font-medium leading-relaxed border-t border-${s.cname}-500/20 pt-1.5`}>
                  {s.detail}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Dashboard Component Mode ─────────────────────────────────────────────
  return (
    <div
      id="global-impact-dna"
      className={`glass-card-luxe rounded-2xl border border-purple-500/30 p-5 relative overflow-hidden transition-all shadow-2xl ${className}`}
    >
      {/* Ambient background glow */}
      <div
        className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20 transition-all duration-700"
        style={{ background: isHighTension
          ? 'radial-gradient(circle, #f43f5e 0%, transparent 65%)'
          : 'radial-gradient(circle, #a855f7 0%, transparent 65%)' }}
      />

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between z-10 relative mb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl border shadow-lg ${
            isHighTension
              ? 'bg-rose-500/20 border-rose-500/40 shadow-rose-500/30'
              : 'bg-gradient-to-br from-purple-600/40 to-cyan-500/20 border-purple-500/40 shadow-purple-500/30'
          }`}>
            <Globe2 className={`w-5 h-5 ${isHighTension ? 'text-rose-400 animate-pulse' : 'text-cyan-300 animate-spin-slow'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display text-sm font-bold text-white tracking-widest uppercase">
                Global Impact DNA Globe
              </h3>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                <Wifi className="w-2.5 h-2.5" /> {liveStatus}
              </span>
              {isHighTension && (
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-rose-500/50 bg-rose-500/20 text-rose-300 animate-pulse flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5" /> HIGH TENSION
                </span>
              )}
            </div>
            <p className="font-mono text-[10px] text-slate-400 mt-0.5">
              3D globe · Economy · Risk · Climate · {HOTSPOTS.length} live event markers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => { playSound('click'); setShowGuide(!showGuide); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs rounded-xl border transition-all ${
              showGuide
                ? 'bg-purple-600 border-purple-400 text-white'
                : 'bg-slate-900/80 border-purple-500/30 text-purple-300 hover:bg-purple-950/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>How to Read</span>
          </button>
          <button
            onClick={() => { playSound('toggle'); setIsExpanded(!isExpanded); }}
            className="p-2 text-slate-400 hover:text-purple-300 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30 rounded-xl transition-all"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── Globe Canvas ── */}
      <div
        ref={containerRef}
        className={`relative w-full rounded-2xl border overflow-hidden shadow-2xl cursor-pointer transition-all duration-500 bg-slate-950 ${
          isHighTension ? 'border-rose-500/30' : 'border-purple-500/30'
        } ${isExpanded ? 'h-96' : compact ? 'h-36' : 'h-60'}`}
        onClick={() => { playSound('toggle'); setIsExpanded(!isExpanded); }}
        title="Click to expand / collapse"
      >
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* Edge vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to right, rgba(3,7,18,0.55) 0%, transparent 12%, transparent 88%, rgba(3,7,18,0.55) 100%)' }}
        />

        {/* Persona badge */}
        <div className="absolute top-3 left-3 bg-slate-950/85 border border-purple-500/30 px-2.5 py-1 rounded-lg text-purple-200 font-mono text-[10px] flex items-center gap-1.5 shadow">
          {personaInfo.icon}
          <span className="hidden sm:inline">{personaInfo.title}</span>
        </div>

        {/* Telemetry HUD strip */}
        <div className="absolute bottom-3 left-4 right-4 pointer-events-none flex items-center justify-between font-mono text-[10px] flex-wrap gap-1">
          <span className="text-cyan-300 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            GLOBE SPIN: {(0.012 + (activity / 100) * 0.02).toFixed(3)} rad/s
          </span>
          <span className="text-rose-400 font-bold">⚡ DISTORTION: {(instability * 100).toFixed(0)}%</span>
          <span className="text-emerald-300 font-bold">✦ {HOTSPOTS.length} LIVE MARKERS</span>
        </div>

        {!isExpanded && (
          <div className="absolute top-3 right-3 text-slate-500 font-mono text-[9px] flex items-center gap-1">
            <Eye className="w-3 h-3" /> expand
          </div>
        )}
      </div>

      {/* ── Plain-Language Persona Panel ── */}
      <div className="mt-4 p-3.5 rounded-xl border border-purple-500/20 bg-slate-900/50 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-sm text-white">
          {personaInfo.icon} <span>{personaInfo.title}</span>
        </div>
        <p className="text-slate-300 text-xs leading-relaxed">{personaInfo.what}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {personaInfo.tips.map((tip, i) => (
            <div key={i} className="flex gap-1.5 text-xs text-slate-200 leading-snug bg-slate-950/60 p-2 rounded-lg border border-slate-700/40">
              <span className="text-base leading-none">{tip.icon}</span>
              <span>{tip.text}</span>
            </div>
          ))}
        </div>
        <div className={`text-xs font-semibold pt-1 ${isHighTension ? 'text-rose-300' : 'text-emerald-300'}`}>
          {personaInfo.action}
        </div>
      </div>

      {/* ── Strand Metric Cards ── */}
      <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-purple-500/20 z-10 relative">
        {STRAND_META.map(s => (
          <button
            key={s.id}
            onClick={() => { playSound('click'); setSelectedStrand(selectedStrand === s.id ? null : s.id); }}
            className={`bg-slate-900/70 border rounded-xl p-2.5 text-left transition-all ${
              selectedStrand === s.id
                ? `${s.active} shadow-lg`
                : `${s.border} hover:brightness-125`
            }`}
          >
            <div className={`flex items-center gap-1.5 font-mono text-[10px] text-${s.cname}-300 font-semibold mb-1 truncate`}>
              <span className={`w-2 h-2 rounded-full ${s.dot} animate-pulse flex-shrink-0`} />
              <span className="truncate">{s.label}</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className={`font-mono text-xs text-${s.cname}-400 font-bold`}>{s.val}</span>
              <span className="font-mono text-[9px] text-slate-400">{s.hint}</span>
            </div>
            {selectedStrand === s.id && (
              <p className={`mt-1.5 text-[10px] text-${s.cname}-200 leading-snug`}>{s.simple}</p>
            )}
          </button>
        ))}
      </div>

      {/* ── How To Read Guide ── */}
      {showGuide && (
        <div className="mt-4 rounded-2xl bg-slate-950 border-2 border-purple-500/40 shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-purple-500/20 font-mono text-xs">
            {[
              ['simple',   '🙋 Simple Guide'],
              ['strands',  '🔬 3 Strands'],
              ['personas', '👥 Persona Tips'],
            ].map(([k, l]) => (
              <button
                key={k}
                onClick={() => setGuideTab(k)}
                className={`flex-1 py-2.5 px-2 transition-all ${
                  guideTab === k ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-3 text-xs">
            {/* Tab 1 – Simple Guide */}
            {guideTab === 'simple' && (
              <div className="space-y-3 text-slate-300 leading-relaxed">
                <p className="text-white font-semibold">
                  Think of this globe like a doctor's health chart for the whole world.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    ['🌍', 'The Spinning Globe',     `It spins faster when the world is busy — lots of trade, travel, and activity happening.`],
                    ['💫', 'The 3 Colored Rings',    'Three strands orbit the globe. Each tracks something important: money, conflict, or weather.'],
                    ['⚡', 'Shaking / Distortion',   `When the RED strand gets wobbly, tensions are high (${risk}% now). Like when news feels scary.`],
                    ['📍', 'Glowing Dots on Globe',  `Those ${HOTSPOTS.length} pulsing dots are real places with active news — trade hubs, conflict zones, climate alerts.`],
                    ['🔵🔴🟢', 'Color System',       'Blue = Money. Red = War & Risk. Green = Weather & Food. Simple as a traffic light.'],
                    ['👆', 'Tap Any Strand Card',    'Tap Blue, Red, or Green below to focus on that topic and get a plain-English explanation.'],
                  ].map(([icon, title, text], i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-700/50">
                      <p className="font-semibold text-white mb-1">{icon} {title}</p>
                      <p className="text-slate-400 leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2 – 3 Strands */}
            {guideTab === 'strands' && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                  <p className="font-mono text-cyan-300 font-bold mb-1">🔵 Blue Strand — Economy &amp; Trade ({100 - risk}% Flow)</p>
                  <p className="text-slate-300 leading-relaxed">
                    Tracks global shipping, business deals, stock markets, and how fast goods move between countries.
                    HIGH means imports are cheaper and jobs are plentiful. LOW means delays and price increases.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/30">
                  <p className="font-mono text-rose-400 font-bold mb-1">🔴 Red Strand — Risk &amp; Conflict ({risk}% Tension)</p>
                  <p className="text-slate-300 leading-relaxed">
                    Tracks wars, political tensions, cyber attacks, and border disputes.
                    HIGH means petrol and food prices often rise and shipping gets disrupted.
                    Currently {risk}% — {risk > 60 ? 'elevated, be cautious.' : 'within safe range.'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                  <p className="font-mono text-emerald-300 font-bold mb-1">🟢 Green Strand — Climate &amp; Food ({climate}% Monitored)</p>
                  <p className="text-slate-300 leading-relaxed">
                    Watches rainfall, heatwaves, monsoon patterns, and crop yields worldwide.
                    HIGH means food may be scarce and prices rise.
                    Currently {climate}% — {climate > 60 ? 'watch food prices carefully.' : 'harvest looks stable.'}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3 – Persona Tips */}
            {guideTab === 'personas' && (
              <div className="space-y-2.5">
                {[
                  ['🌾', 'Farmer / Kisan',   'Watch GREEN for monsoon signs. If RED goes above 60%, diesel prices will rise — sell Mandi stock fast before costs increase.'],
                  ['🎓', 'Student',          'RED strand spikes = rich geopolitics exam essays. BLUE drops = economics case studies. GREEN issues = environment topics.'],
                  ['💼', 'Business Owner',   'RED above 60% means add 10-day delivery buffers. BLUE below 40% means renegotiate freight contracts immediately.'],
                  ['🛡️', 'Analyst',          'Monitor the 3D equilibrium balance. Red and Blue diverging signals proxy conflict or sanctions escalation cycle.'],
                  ['👋', 'Common Person',    'RED going up = petrol and food may cost more soon. GREEN stable = good rains and harvest ahead. BLUE high = economy healthy.'],
                ].map(([icon, who, tip], i) => (
                  <div key={i} className="flex gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-700/40">
                    <span className="text-lg leading-none mt-0.5">{icon}</span>
                    <div>
                      <p className="font-semibold text-white text-xs mb-0.5">{who}</p>
                      <p className="text-slate-400 leading-relaxed">{tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-4 pb-4">
            <button
              onClick={() => setShowGuide(false)}
              className="w-full py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 font-mono text-xs hover:bg-purple-600/40 transition-all"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


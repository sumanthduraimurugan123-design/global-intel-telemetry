import React from 'react';
import { 
  X, 
  LineChart, 
  Accessibility, 
  Check, 
  GraduationCap, 
  Users, 
  Wheat, 
  Briefcase 
} from 'lucide-react';
import { logTelemetryAction } from '../services/supabaseClient';
import { playSound } from '../services/soundSystem';

export const PERSONAS = [
  {
    id: 'Common person',
    title: 'Common Person',
    icon: <Users className="w-4 h-4 text-amber-400" />,
    desc: 'Everyday life, family grocery budget, daily commute, fuel costs, and neighborhood services in plain conversational words.',
    tag: 'Everyday',
    badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-950/30'
  },
  {
    id: 'Student',
    title: 'Student / Scholar',
    icon: <GraduationCap className="w-4 h-4 text-sky-400" />,
    desc: 'Campus commute, exams, gadget prices, digital connectivity, and study tools in simple, clear language.',
    tag: 'Academic',
    badgeColor: 'border-sky-500/40 text-sky-400 bg-sky-950/30'
  },
  {
    id: 'Farmer',
    title: 'Farmer / Kisan',
    icon: <Wheat className="w-4 h-4 text-emerald-400" />,
    desc: 'Weather forecasts, rainfall/monsoon alerts, mandi crop prices, fertilizer, and diesel costs in ultra-simple words.',
    tag: 'Agrarian',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30'
  },
  {
    id: 'Business',
    title: 'Business & Trade',
    icon: <Briefcase className="w-4 h-4 text-purple-400" />,
    desc: 'Supply chain friction, maritime shipping, import tariffs, interest rates, currency shifts, and operational risk.',
    tag: 'Enterprise',
    badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-950/30'
  },
  {
    id: 'Analyst',
    title: 'Strategic Analyst',
    icon: <LineChart className="w-4 h-4 text-amber-400" />,
    desc: 'Dense data view — raw telemetry, sentiment scores, source verification, defense and geopolitical indicators.',
    tag: 'Dense',
    badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-950/30'
  },
  {
    id: 'Accessibility mode',
    title: 'Accessibility Mode',
    icon: <Accessibility className="w-4 h-4 text-emerald-400" />,
    desc: 'High contrast, large touch targets, automatic speech synthesis, and simplified reading layout.',
    tag: 'Inclusive',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/30'
  }
];

export default function PersonaSelector({ 
  isOpen, 
  onClose, 
  currentPersona, 
  onSelectPersona 
}) {
  if (!isOpen) return null;

  const handleSelect = (pId) => {
    playSound('switch');
    onSelectPersona(pId);
    logTelemetryAction(`Persona changed to: ${pId}`, pId);
    onClose();
  };

  const handleClose = () => {
    playSound('click');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl glass-card-luxe border border-slate-700/60 shadow-2xl shadow-purple-950/20">
        
        {/* Title bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80 sticky top-0 bg-slate-900/90 z-10 backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="font-mono text-sm uppercase tracking-wider text-slate-100 font-bold">
                Choose Persona Mode
              </h3>
            </div>
            <p className="font-sans text-xs text-slate-400 mt-1">
              UI telemetry, language complexity, alerts, and AI guidance dynamically adapt
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 rounded-lg transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="divide-y divide-slate-800/60 p-2">
          {PERSONAS.map((p) => {
            const isSelected = currentPersona === p.id || 
              (currentPersona === 'Casual user' && p.id === 'Common person');
            return (
              <div
                key={p.id}
                onClick={() => handleSelect(p.id)}
                className={`p-3.5 my-1 rounded-xl cursor-pointer transition-all flex items-start justify-between gap-3 ${
                  isSelected 
                    ? 'bg-amber-400/10 border border-amber-400/30 shadow-sm' 
                    : 'hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-2 rounded-lg border shrink-0 ${
                    isSelected ? 'bg-amber-400/20 border-amber-400/40' : 'bg-slate-900/80 border-slate-800'
                  }`}>
                    {p.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-sans text-sm text-slate-100 font-semibold">{p.title}</span>
                      <span className={`font-mono text-[9px] border px-2 py-0.5 rounded-full ${p.badgeColor}`}>
                        {p.tag}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shrink-0 mt-1 shadow-md shadow-amber-400/30">
                    <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-950/70 flex justify-between items-center">
          <span className="text-[11px] font-mono text-slate-500">Autonomous context adaptation active</span>
          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-sans text-xs font-medium border border-slate-700 transition-colors shadow-sm"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}

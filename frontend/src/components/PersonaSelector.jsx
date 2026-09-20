import React from 'react';
import { 
  X, 
  LineChart, 
  Coffee, 
  Accessibility, 
  Check, 
  GraduationCap, 
  Users, 
  Wheat, 
  Briefcase 
} from 'lucide-react';
import { logTelemetryAction } from '../services/supabaseClient';

export const PERSONAS = [
  {
    id: 'Common person',
    title: 'Common Person',
    icon: <Users className="w-4 h-4 text-amber-400" />,
    desc: 'Everyday life, family grocery budget, daily commute, fuel costs, and neighborhood services in plain conversational words.',
    tag: 'Everyday',
    badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-950/20'
  },
  {
    id: 'Student',
    title: 'Student / Scholar',
    icon: <GraduationCap className="w-4 h-4 text-sky-400" />,
    desc: 'Campus commute, exams, gadget prices, digital connectivity, and study tools in simple, clear language.',
    tag: 'Academic',
    badgeColor: 'border-sky-500/40 text-sky-400 bg-sky-950/20'
  },
  {
    id: 'Farmer',
    title: 'Farmer / Kisan',
    icon: <Wheat className="w-4 h-4 text-emerald-400" />,
    desc: 'Weather forecasts, rainfall/monsoon alerts, mandi crop prices, fertilizer, and diesel costs in ultra-simple words.',
    tag: 'Agrarian',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20'
  },
  {
    id: 'Business',
    title: 'Business & Trade',
    icon: <Briefcase className="w-4 h-4 text-purple-400" />,
    desc: 'Supply chain friction, maritime shipping, import tariffs, interest rates, currency shifts, and operational risk.',
    tag: 'Enterprise',
    badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-950/20'
  },
  {
    id: 'Analyst',
    title: 'Strategic Analyst',
    icon: <LineChart className="w-4 h-4 text-wire-amber" />,
    desc: 'Dense data view — raw telemetry, sentiment scores, source verification, defense and geopolitical indicators.',
    tag: 'Dense',
    badgeColor: 'border-amber-500/40 text-wire-amber bg-wire-base'
  },
  {
    id: 'Accessibility mode',
    title: 'Accessibility Mode',
    icon: <Accessibility className="w-4 h-4 text-wire-green" />,
    desc: 'High contrast, large touch targets, automatic speech synthesis, and simplified reading layout.',
    tag: 'Inclusive',
    badgeColor: 'border-green-500/40 text-wire-green bg-green-950/20'
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
    onSelectPersona(pId);
    logTelemetryAction(`Persona changed to: ${pId}`, pId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-wire-surface border border-wire-border shadow-2xl">
        
        {/* Title bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-wire-border sticky top-0 bg-wire-surface z-10 backdrop-blur-sm">
          <div>
            <h3 className="font-mono text-sm uppercase tracking-wider text-wire-fg font-bold">
              Choose Persona Mode
            </h3>
            <p className="font-mono text-[10px] text-wire-subtle mt-0.5">
              UI layout, alerts, language complexity, and AI guidance adapt to your selection
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-wire-subtle hover:text-wire-fg hover:bg-wire-raised transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="divide-y divide-wire-border/50">
          {PERSONAS.map((p) => {
            const isSelected = currentPersona === p.id || 
              (currentPersona === 'Casual user' && p.id === 'Common person');
            return (
              <div
                key={p.id}
                onClick={() => handleSelect(p.id)}
                className={`px-5 py-3.5 cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                  isSelected ? 'bg-wire-raised border-l-2 border-l-wire-amber' : 'hover:bg-wire-raised/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-2 bg-wire-base border border-wire-border shrink-0">
                    {p.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-serif text-sm text-wire-fg font-semibold">{p.title}</span>
                      <span className={`font-mono text-[9px] border px-1.5 py-0.2 rounded ${p.badgeColor}`}>
                        {p.tag}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-wire-subtle leading-relaxed">{p.desc}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-5 h-5 bg-wire-amber flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-wire-border bg-wire-base/60 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-wire-raised hover:bg-wire-hover text-wire-fg font-mono text-xs border border-wire-border transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}

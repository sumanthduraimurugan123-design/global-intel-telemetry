import React, { useState, useMemo } from 'react';
import { 
  X, 
  ArrowLeftRight, 
  ShieldAlert, 
  Flame, 
  TrendingUp, 
  Layers, 
  Volume2, 
  VolumeX, 
  Globe2, 
  Zap, 
  Ship, 
  Radio, 
  AlertTriangle,
  Building2,
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getBilateralIntelligence, BILATERAL_CURATED_PAIRS } from '../services/bilateralService';
import { playEarcon, speakInLanguage } from '../services/voiceService';
import { playUiSound } from '../services/soundSystem';

const PRESET_FLASHPOINTS = [
  { idA: 'india', idB: 'china', label: '🇮🇳 India vs 🇨🇳 China' },
  { idA: 'us', idB: 'china', label: '🇺🇸 US vs 🇨🇳 China' },
  { idA: 'us', idB: 'russia', label: '🇺🇸 US vs 🇷🇺 Russia' },
  { idA: 'russia', idB: 'ukraine', label: '🇷🇺 Russia vs 🇺🇦 Ukraine' },
  { idA: 'israel', idB: 'iran', label: '🇮🇱 Israel vs 🇮🇷 Iran' },
  { idA: 'taiwan', idB: 'china', label: '🇹🇼 Taiwan vs 🇨🇳 China' },
  { idA: 'india', idB: 'pakistan', label: '🇮🇳 India vs 🇵🇰 Pakistan' },
  { idA: 'us', idB: 'india', label: '🇺🇸 US vs 🇮🇳 India' },
];

const COUNTRY_OPTIONS = [
  { id: 'india', name: 'India', flag: '🇮🇳' },
  { id: 'china', name: 'China', flag: '🇨🇳' },
  { id: 'us', name: 'United States', flag: '🇺🇸' },
  { id: 'russia', name: 'Russia', flag: '🇷🇺' },
  { id: 'ukraine', name: 'Ukraine', flag: '🇺🇦' },
  { id: 'israel', name: 'Israel', flag: '🇮🇱' },
  { id: 'iran', name: 'Iran', flag: '🇮🇷' },
  { id: 'taiwan', name: 'Taiwan', flag: '🇹🇼' },
  { id: 'pakistan', name: 'Pakistan', flag: '🇵🇰' },
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
  { id: 'germany', name: 'Germany', flag: '🇩🇪' },
  { id: 'france', name: 'France', flag: '🇫🇷' },
  { id: 'japan', name: 'Japan', flag: '🇯🇵' },
  { id: 'australia', name: 'Australia', flag: '🇦🇺' },
  { id: 'canada', name: 'Canada', flag: '🇨🇦' },
  { id: 'brazil', name: 'Brazil', flag: '🇧🇷' },
];

export default function BilateralIntelLens({ isOpen, onClose, onSelectCountryOnGlobe }) {
  const [countryA, setCountryA] = useState('india');
  const [countryB, setCountryB] = useState('china');
  const [activeTab, setActiveTab] = useState('flashpoints'); // 'flashpoints', 'defense', 'trade', 'alliances'
  const [isSpeakingBrief, setIsSpeakingBrief] = useState(false);

  const intel = useMemo(() => {
    return getBilateralIntelligence(countryA, countryB);
  }, [countryA, countryB]);

  if (!isOpen) return null;

  const handleSwap = () => {
    playUiSound('switch');
    setCountryA(countryB);
    setCountryB(countryA);
  };

  const handleSpeakBriefing = () => {
    if (isSpeakingBrief) {
      window.speechSynthesis?.cancel();
      setIsSpeakingBrief(false);
    } else {
      playEarcon('success');
      const textToSpeak = `${intel.headline}. ${intel.strategicAssessment}`;
      setIsSpeakingBrief(true);
      speakInLanguage(textToSpeak, {
        language: 'en',
        onEnd: () => setIsSpeakingBrief(false)
      });
    }
  };

  const getFrictionColor = (score) => {
    if (score >= 90) return 'from-rose-600 to-red-500 text-rose-400 border-rose-500/40';
    if (score >= 70) return 'from-amber-600 to-orange-500 text-amber-400 border-amber-500/40';
    if (score >= 40) return 'from-blue-600 to-cyan-500 text-cyan-400 border-cyan-500/40';
    return 'from-emerald-600 to-teal-500 text-emerald-400 border-emerald-500/40';
  };

  const cAData = COUNTRY_OPTIONS.find(c => c.id === countryA) || { name: countryA, flag: '🌐' };
  const cBData = COUNTRY_OPTIONS.find(c => c.id === countryB) || { name: countryB, flag: '🌐' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-950/95 border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-500/20 overflow-hidden flex flex-col font-sans">
        
        {/* Header Strip */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950/90 via-slate-950 to-cyan-950/80 border-b border-purple-500/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-500 p-[1.5px] shadow-lg shadow-purple-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <ArrowLeftRight className="w-5 h-5 text-cyan-300 animate-pulse" />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Bilateral Strategic Intel Lens</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  NATION VS NATION
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparative defense posture, trade interdependence, and crisis friction matrix
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeakBriefing}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isSpeakingBrief
                  ? 'border-pink-500 text-pink-300 bg-pink-500/20 animate-pulse shadow-md shadow-pink-500/30'
                  : 'border-slate-800 text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800'
              }`}
              title="Ammukutty audio brief"
            >
              {isSpeakingBrief ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isSpeakingBrief ? 'Stop Brief' : 'Audio Brief'}</span>
            </button>

            <button
              onClick={() => {
                playUiSound('close');
                window.speechSynthesis?.cancel();
                onClose();
              }}
              className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-rose-400 bg-slate-900/60 hover:bg-rose-500/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Flashpoint Presets */}
        <div className="px-4 py-2 bg-slate-900/60 border-b border-purple-500/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mr-1 whitespace-nowrap">
            Key Flashpoints:
          </span>
          {PRESET_FLASHPOINTS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                playUiSound('click');
                setCountryA(preset.idA);
                setCountryB(preset.idB);
              }}
              className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-mono transition-all ${
                (countryA === preset.idA && countryB === preset.idB) || (countryA === preset.idB && countryB === preset.idA)
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-500/30 border border-purple-400'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Country Selector Strip & Live Friction Meter */}
        <div className="p-4 sm:p-5 bg-slate-950/60 border-b border-purple-500/15">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Country A */}
            <div className="md:col-span-5 p-3 rounded-2xl bg-gradient-to-r from-purple-950/30 to-slate-900/80 border border-purple-500/25 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{cAData.flag}</span>
                <div>
                  <span className="text-[10px] font-mono text-purple-300 uppercase font-semibold">Primary Sovereign</span>
                  <select
                    value={countryA}
                    onChange={(e) => {
                      playUiSound('switch');
                      setCountryA(e.target.value);
                    }}
                    className="block bg-transparent text-white font-bold text-base focus:outline-none cursor-pointer"
                  >
                    {COUNTRY_OPTIONS.map(c => (
                      <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {onSelectCountryOnGlobe && (
                <button
                  onClick={() => onSelectCountryOnGlobe(countryA)}
                  className="px-2 py-1 text-[10px] font-mono rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-all border border-purple-500/30"
                  title="Center globe on this country"
                >
                  Focus Globe
                </button>
              )}
            </div>

            {/* Swap Button & Friction Score Center */}
            <div className="md:col-span-2 flex flex-col items-center justify-center gap-1">
              <button
                onClick={handleSwap}
                className="p-2.5 rounded-full bg-slate-900 hover:bg-purple-600/30 border border-purple-500/30 text-cyan-300 hover:text-white transition-all shadow-md active:scale-95"
                title="Swap nations"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
              <div className="text-center mt-1">
                <span className="text-[10px] font-mono text-slate-400">FRICTION INDEX</span>
                <div className={`text-base font-mono font-bold ${
                  intel.frictionScore >= 80 ? 'text-rose-400 animate-pulse' : intel.frictionScore >= 50 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {intel.frictionScore}%
                </div>
              </div>
            </div>

            {/* Country B */}
            <div className="md:col-span-5 p-3 rounded-2xl bg-gradient-to-r from-slate-900/80 to-cyan-950/30 border border-cyan-500/25 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{cBData.flag}</span>
                <div>
                  <span className="text-[10px] font-mono text-cyan-300 uppercase font-semibold">Counterpart Sovereign</span>
                  <select
                    value={countryB}
                    onChange={(e) => {
                      playUiSound('switch');
                      setCountryB(e.target.value);
                    }}
                    className="block bg-transparent text-white font-bold text-base focus:outline-none cursor-pointer"
                  >
                    {COUNTRY_OPTIONS.map(c => (
                      <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {onSelectCountryOnGlobe && (
                <button
                  onClick={() => onSelectCountryOnGlobe(countryB)}
                  className="px-2 py-1 text-[10px] font-mono rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-all border border-cyan-500/30"
                  title="Center globe on this country"
                >
                  Focus Globe
                </button>
              )}
            </div>

          </div>

          {/* Friction Bar */}
          <div className="w-full bg-slate-900 h-2 rounded-full mt-3 overflow-hidden border border-slate-800">
            <div 
              className={`h-full bg-gradient-to-r ${getFrictionColor(intel.frictionScore)} transition-all duration-500`}
              style={{ width: `${intel.frictionScore}%` }}
            />
          </div>
        </div>

        {/* Dynamic Strategic Headline & Executive Assessment */}
        <div className="px-5 py-3 bg-purple-950/20 border-b border-purple-500/10 flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white tracking-wide">{intel.headline}</h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{intel.strategicAssessment}</p>
          </div>
        </div>

        {/* Analysis Navigation Tabs */}
        <div className="flex items-center px-5 border-b border-purple-500/15 bg-slate-900/40">
          {[
            { id: 'flashpoints', label: '⚡ Flashpoints & Frictions', icon: Flame },
            { id: 'defense', label: '🛡️ Defense & Nuclear Triad', icon: ShieldAlert },
            { id: 'trade', label: '🚢 Trade & Choke Points', icon: Ship },
            { id: 'alliances', label: '🤝 Alliances & Pacts', icon: Layers },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playUiSound('switch');
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-mono text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'border-purple-400 text-white bg-purple-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar text-xs">
          
          {/* TAB 1: FLASHPOINTS */}
          {activeTab === 'flashpoints' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-mono text-slate-400 uppercase font-semibold">Active Crisis Vectors</span>
                <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-bold border ${getFrictionColor(intel.frictionScore)}`}>
                  {intel.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {intel.flashpoints.map((fp, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-purple-950/30 border border-purple-500/20 shadow-md">
                    <div className="flex items-center gap-2 font-mono text-[11px] text-pink-400 font-bold mb-2">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>FLASHPOINT 0{i + 1}</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed text-xs">{fp}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: DEFENSE & NUCLEAR */}
          {activeTab === 'defense' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nation A Military */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/25 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-purple-300 pb-2 border-b border-purple-500/20">
                    <span>{cAData.flag} {cAData.name} Defense Profile</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Active Standing Military:</span>
                    <span className="text-white font-mono text-sm font-bold">{intel.militaryIndex.activePersonnelA}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Nuclear Deterrent Arsenal:</span>
                    <span className="text-pink-300 font-mono text-xs font-semibold">{intel.militaryIndex.nuclearStatusA}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Annual Defense Expenditure:</span>
                    <span className="text-cyan-300 font-mono text-xs font-bold">{intel.militaryIndex.defenseBudgetA}</span>
                  </div>
                </div>

                {/* Nation B Military */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/25 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-cyan-300 pb-2 border-b border-cyan-500/20">
                    <span>{cBData.flag} {cBData.name} Defense Profile</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Active Standing Military:</span>
                    <span className="text-white font-mono text-sm font-bold">{intel.militaryIndex.activePersonnelB}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Nuclear Deterrent Arsenal:</span>
                    <span className="text-pink-300 font-mono text-xs font-semibold">{intel.militaryIndex.nuclearStatusB}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Annual Defense Expenditure:</span>
                    <span className="text-cyan-300 font-mono text-xs font-bold">{intel.militaryIndex.defenseBudgetB}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRADE & CHOKE POINTS */}
          {activeTab === 'trade' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-900 border border-purple-500/25 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Annual Bilateral Trade Volume</span>
                  <div className="text-lg font-mono font-bold text-white mt-0.5">{intel.tradeInterdependence.volumeUSD}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300">
                  <Ship className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-mono text-purple-300 uppercase font-semibold">Critical Supply Dependencies ({cAData.name}):</span>
                  <p className="text-slate-300 leading-relaxed">{intel.tradeInterdependence.dependencyA}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <span className="text-[11px] font-mono text-cyan-300 uppercase font-semibold">Critical Supply Dependencies ({cBData.name}):</span>
                  <p className="text-slate-300 leading-relaxed">{intel.tradeInterdependence.dependencyB}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold">Maritime & Logistics Choke Point:</span>{' '}
                  <span className="text-slate-200">{intel.tradeInterdependence.supplyChokePoints}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ALLIANCES */}
          {activeTab === 'alliances' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* A Alliances */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/25 space-y-2">
                  <span className="text-[11px] font-mono text-purple-300 uppercase font-bold">{cAData.name} Pacts & Blocks</span>
                  <div className="space-y-1.5 pt-1">
                    {intel.alliances.countryA.map((p, i) => (
                      <div key={i} className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 text-white font-mono text-[11px] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shared */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-mono text-emerald-300 uppercase font-bold">Mutual Forums & Treaties</span>
                  <div className="space-y-1.5 pt-1">
                    {intel.alliances.sharedOrganizations.map((p, i) => (
                      <div key={i} className="px-2.5 py-1.5 rounded-lg bg-emerald-950/40 text-emerald-200 border border-emerald-500/20 font-mono text-[11px] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* B Alliances */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/25 space-y-2">
                  <span className="text-[11px] font-mono text-cyan-300 uppercase font-bold">{cBData.name} Pacts & Blocks</span>
                  <div className="space-y-1.5 pt-1">
                    {intel.alliances.countryB.map((p, i) => (
                      <div key={i} className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 text-white font-mono text-[11px] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

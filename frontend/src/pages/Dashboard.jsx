import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '../components/Navbar';
import AccessibilityToolbar from '../components/AccessibilityToolbar';
import Globe3D from '../components/Globe3D';
import NewsPanel from '../components/NewsPanel';
import AlertSystem from '../components/AlertSystem';
import TelemetryStats from '../components/TelemetryStats';
import PersonaSelector from '../components/PersonaSelector';
import LogsViewer from '../components/LogsViewer';
import VoiceAssistantModal from '../components/VoiceAssistantModal';
import RadioPlayerBar from '../components/RadioPlayerBar';
import EasyModeView from '../components/EasyModeView';
import PersonalImpactModal from '../components/PersonalImpactModal';
import FutureImpactSimulatorModal from '../components/FutureImpactSimulatorModal';
import { calculatePersonalImpact } from '../services/impactEngine';
import { fetchNewsStream, fetchActiveAlerts, fetchNewsExplanation, fetchGeoDirectory } from '../services/newsService';
import { logTelemetryAction } from '../services/supabaseClient';
import BackgroundMesh from '../components/BackgroundMesh';
import GlobalImpactDna from '../components/GlobalImpactDna';
import CinematicRegionPanel from '../components/CinematicRegionPanel';
import { playUiSound } from '../services/soundSystem';
import { 
  globalRadioEngine, 
  speakInLanguage, 
  stopSpeaking, 
  playEarcon, 
  detectUserLocation, 
  triggerAudioAlert,
  requestNotificationPermission 
} from '../services/voiceService';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Building2, 
  Globe2, 
  Compass, 
  Sparkles, 
  X,
  Layers,
  ChevronRight
} from 'lucide-react';

const CHENNAI_NEIGHBORHOODS = [
  { id: 'all_chennai', label: 'Chennai Metro', loc: 'chennai', icon: '🏙️' },
  { id: 'velachery', label: 'Velachery', loc: 'velachery', icon: '📍' },
  { id: 'tnagar', label: 'T. Nagar', loc: 't nagar', icon: '🛍️' },
  { id: 'annanagar', label: 'Anna Nagar', loc: 'anna nagar', icon: '🌳' },
  { id: 'adyar', label: 'Adyar', loc: 'adyar', icon: '🌊' },
  { id: 'tambaram', label: 'Tambaram', loc: 'tambaram', icon: '🚆' },
  { id: 'mylapore', label: 'Mylapore', loc: 'mylapore', icon: '🛕' },
  { id: 'omr', label: 'OMR / IT Corridor', loc: 'omr', icon: '💻' },
  { id: 'guindy', label: 'Guindy', loc: 'guindy', icon: '🏭' },
];

export default function Dashboard() {
  // Core Hierarchical Geographic State
  const [selectedCountry, setSelectedCountry] = useState('global');
  const [selectedState, setSelectedState] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null); // city / micro-locality
  const [customLocationInput, setCustomLocationInput] = useState('');
  const [geoDirectory, setGeoDirectory] = useState(null);
  const [geoInfo, setGeoInfo] = useState(null);
  const [fallbackDetails, setFallbackDetails] = useState(null);

  const [activeTopic, setActiveTopic] = useState('all');
  const [news, setNews] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState('');
  const [countdown, setCountdown] = useState(30);

  // Voice & Accessibility States
  const [currentLanguage, setCurrentLanguage] = useState('en'); // 'en', 'ta', 'hi'
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isEasyMode, setIsEasyMode] = useState(false);
  const [isAudioAlertsEnabled, setIsAudioAlertsEnabled] = useState(true);
  const [detectedLocationLabel, setDetectedLocationLabel] = useState('Auto');
  const soundedAlertsRef = useRef(new Set());

  // Radio Player State
  const [radioState, setRadioState] = useState({
    isPlaying: false,
    isPaused: false,
    currentIndex: 0,
    total: 0,
    currentStory: null
  });

  // Persona State
  const [persona, setPersona] = useState('Analyst'); // Analyst, Casual user, Accessibility mode
  const [isPersonaModalOpen, setIsPersonaModalOpen] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);

  // AI Personal Impact Engine State
  const [isImpactModalOpen, setIsImpactModalOpen] = useState(false);
  const [impactProfileId, setImpactProfileId] = useState('tech');

  // Future Impact Simulator Modal State
  const [isFutureImpactModalOpen, setIsFutureImpactModalOpen] = useState(false);

  // Cinematic Focus Mode State
  const [isCinematicFocus, setIsCinematicFocus] = useState(false);

  // Dynamic Global Impact DNA Biometrics
  const criticalAlertsCount = alerts.filter(a => a.severity?.toUpperCase() === 'CRITICAL').length;
  const dnaRiskScore = Math.min(95, Math.max(15, (alerts.length * 7) + (criticalAlertsCount * 16)));
  const dnaActivityLevel = Math.min(100, Math.max(25, news.length * 4));
  const climateNewsCount = news.filter(n => n.category === 'climate' || n.topic?.includes('climate')).length;
  const dnaClimateScore = Math.min(90, Math.max(20, 30 + climateNewsCount * 12));

  // ESC Key listener to exit Cinematic Focus Mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCinematicFocus) {
        playUiSound('click');
        setIsCinematicFocus(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCinematicFocus]);

  // Visual Accessibility States
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);
  const [isCognitiveSimple, setIsCognitiveSimple] = useState(false);

  // Apply accessibility classes to document body
  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
  }, [isHighContrast]);

  useEffect(() => {
    if (isLargeText) {
      document.body.classList.add('large-text-mode');
    } else {
      document.body.classList.remove('large-text-mode');
    }
  }, [isLargeText]);

  // Fetch complete geographic directory on boot
  useEffect(() => {
    fetchGeoDirectory()
      .then(dir => {
        if (dir) setGeoDirectory(dir);
      })
      .catch(e => console.log('Could not load geo directory:', e));
  }, []);

  // Load news and alerts
  const loadTelemetryData = useCallback(async (force = false, overrideCountry = null, overrideLocation = undefined, overrideState = undefined) => {
    setIsRefreshing(true);
    try {
      const locToUse = overrideLocation !== undefined ? overrideLocation : selectedLocation;
      const countryToUse = overrideCountry || selectedCountry;
      const stateToUse = overrideState !== undefined ? overrideState : selectedState;

      const [resStream, fetchedAlerts] = await Promise.all([
        fetchNewsStream(countryToUse, activeTopic, force, locToUse, currentLanguage, stateToUse, locToUse),
        fetchActiveAlerts(countryToUse)
      ]);

      const articles = resStream?.news || (Array.isArray(resStream) ? resStream : []);
      setNews(articles);
      setGeoInfo(resStream?.geoInfo || null);
      setFallbackDetails(resStream?.fallbackDetails || null);
      setAlerts(fetchedAlerts);
      setLastUpdatedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      // Check for new critical alerts for audio announcement
      if (isAudioAlertsEnabled && fetchedAlerts && fetchedAlerts.length > 0) {
        const criticalAlerts = fetchedAlerts.filter(a => a.severity === 'CRITICAL');
        for (const cAlert of criticalAlerts) {
          const alertKey = cAlert.id || cAlert.message;
          if (!soundedAlertsRef.current.has(alertKey)) {
            soundedAlertsRef.current.add(alertKey);
            triggerAudioAlert(cAlert, currentLanguage);
            break; // Speak top alert first
          }
        }
      }
    } catch (err) {
      console.error('Error loading telemetry data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [selectedCountry, selectedLocation, selectedState, activeTopic, currentLanguage, isAudioAlertsEnabled]);

  // Initial load and reload when country, location, state, topic, or language changes
  useEffect(() => {
    loadTelemetryData(false);
    setCountdown(30);
    const focusLabel = selectedLocation 
      ? `${selectedLocation.toUpperCase()} (${selectedState || selectedCountry.toUpperCase()})` 
      : (selectedState ? `${selectedState.toUpperCase()} (${selectedCountry.toUpperCase()})` : selectedCountry.toUpperCase());
    logTelemetryAction(`Sector focus switched to: ${focusLabel}`, persona, { 
      topic: activeTopic,
      language: currentLanguage,
      state: selectedState,
      location: selectedLocation 
    });
  }, [selectedCountry, selectedState, selectedLocation, activeTopic, currentLanguage, loadTelemetryData]);

  // Real-time 30-second countdown loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          loadTelemetryData(true);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loadTelemetryData]);

  // Sync Radio playlist with news updates
  useEffect(() => {
    if (news && news.length > 0) {
      globalRadioEngine.init(news, currentLanguage, setRadioState);
    }
  }, [news, currentLanguage]);

  // Handle manual refresh
  const handleManualRefresh = () => {
    setCountdown(30);
    loadTelemetryData(true);
  };

  // Handle Country/Location Selection from 3D Globe or Navigation
  const handleSelectCountry = (countryId, activateFocus = true) => {
    setSelectedCountry(countryId);
    setSelectedState(null);
    setSelectedLocation(null);
    stopSpeaking();
    setIsSpeaking(false);
    if (countryId && countryId !== 'global' && activateFocus) {
      setIsCinematicFocus(true);
    }
    loadTelemetryData(true, countryId, null, null);
  };

  const handleExitFocusMode = () => {
    playUiSound('click');
    setIsCinematicFocus(false);
    setSelectedCountry('global');
    loadTelemetryData(true, 'global', null, null);
  };

  // Handle State / Province Selection (e.g. Tamil Nadu, California, Texas, Bavaria)
  const handleSelectState = (stateName, parentCountry = null) => {
    playEarcon('click');
    const c = parentCountry || selectedCountry || 'india';
    setSelectedCountry(c);
    setSelectedState(stateName);
    setSelectedLocation(null);
    stopSpeaking();
    setIsSpeaking(false);
    loadTelemetryData(true, c, null, stateName);
  };

  // Handle Specific Locality / Micro-area Selection (e.g. Velachery, T. Nagar, Munich)
  const handleSelectLocation = (locName, parentCountry = null, parentState = null) => {
    playEarcon('click');
    const c = parentCountry || selectedCountry || 'india';
    setSelectedCountry(c);
    if (parentState) setSelectedState(parentState);
    setSelectedLocation(locName);
    setActiveTopic('all');
    stopSpeaking();
    setIsSpeaking(false);
    loadTelemetryData(true, c, locName, parentState || selectedState);
  };

  // Handle Custom Locality Search
  const handleCustomLocSubmit = (e) => {
    e.preventDefault();
    if (!customLocationInput.trim()) return;
    handleSelectLocation(customLocationInput.trim().toLowerCase());
  };

  // Auto-Detect GPS Location
  const handleDetectLocation = async () => {
    playEarcon('click');
    let msg = 'Detecting your location via GPS...';
    if (currentLanguage === 'ta') msg = 'உங்கள் இருப்பிடத்தை கண்டறிகிறேன்...';
    if (currentLanguage === 'hi') msg = 'आपकी लोकेशन का पता लगाया जा रहा है...';
    speakInLanguage(msg, { language: currentLanguage });

    const loc = await detectUserLocation();
    setDetectedLocationLabel(loc.label);

    const targetLoc = loc.locality || loc.city || 'velachery';
    const targetCountry = loc.country || 'india';

    setSelectedCountry(targetCountry);
    setSelectedLocation(targetLoc);
    setActiveTopic('all');

    let confirmMsg = `Location detected as ${loc.label}. Loading local dispatches for ${targetLoc}.`;
    if (currentLanguage === 'ta') confirmMsg = `உங்கள் பகுதி ${loc.label}. ${targetLoc} பகுதிக்கான செய்திகள் ஏற்றப்படுகின்றன.`;
    if (currentLanguage === 'hi') confirmMsg = `आपकी लोकेशन ${loc.label} मिली। ${targetLoc} के स्थानीय समाचार लोड हो रहे हैं।`;
    
    speakInLanguage(confirmMsg, { language: currentLanguage });
    logTelemetryAction(`GPS auto-personalization: ${loc.label}`, persona);
    loadTelemetryData(true, targetCountry, targetLoc);
  };

  // Voice Summary Synthesis
  const handleTriggerVoiceSummary = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const activeLabel = selectedLocation ? `${selectedLocation.toUpperCase()} (CHENNAI)` : selectedCountry.toUpperCase();

    if (!news || news.length === 0) {
      speakInLanguage(
        currentLanguage === 'ta' 
          ? `${activeLabel} பகுதியில் செய்திகள் எதுவும் கிடைக்கவில்லை. தயவுசெய்து புதுப்பிக்கவும்.` 
          : `No dispatches available for ${activeLabel}. Please refresh.`,
        { language: currentLanguage }
      );
      return;
    }

    setIsSpeaking(true);
    const topStories = news.slice(0, 3).map((n, i) => `Story ${i + 1}: ${n.title} reported by ${n.source || 'wire'}.`).join(' ');
    const criticalAlertsCount = alerts.filter(a => a.severity === 'CRITICAL').length;
    const alertSummary = criticalAlertsCount > 0 
      ? `Attention: There are ${criticalAlertsCount} critical alerts active in this sector.` 
      : 'No critical alerts active.';

    let fullBrief = `Planetary Telemetry Briefing for sector ${activeLabel}. ${alertSummary} Here are the top verified headlines. ${topStories} Briefing completed.`;
    
    if (currentLanguage === 'ta') {
      const taStories = news.slice(0, 3).map((n, i) => `செய்தி ${i + 1}: ${n.title}.`).join(' ');
      fullBrief = `${activeLabel} பகுதிக்கான முக்கிய செய்தி அறிக்கை. ${criticalAlertsCount > 0 ? `${criticalAlertsCount} அவசர எச்சரிக்கைகள் உள்ளன.` : ''} முக்கிய செய்திகள்: ${taStories} அறிக்கை நிறைவடைந்தது.`;
    } else if (currentLanguage === 'hi') {
      const hiStories = news.slice(0, 3).map((n, i) => `खबर ${i + 1}: ${n.title}.`).join(' ');
      fullBrief = `${activeLabel} क्षेत्र के मुख्य समाचार। ${criticalAlertsCount > 0 ? `${criticalAlertsCount} महत्वपूर्ण अलर्ट हैं।` : ''} मुख्य खबरें: ${hiStories} समाचार समाप्त हुए।`;
    }

    speakInLanguage(fullBrief, {
      language: currentLanguage,
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    });

    logTelemetryAction(`Voice summary briefing triggered for ${selectedCountry}`, persona);
  };

  // Read Alerts aloud
  const handleReadAlerts = () => {
    playEarcon('click');
    if (!alerts || alerts.length === 0) {
      let noAlertMsg = `No active crisis alerts reported for sector ${selectedCountry.toUpperCase()}.`;
      if (currentLanguage === 'ta') noAlertMsg = `${selectedCountry.toUpperCase()} பகுதியில் எந்த அவசர எச்சரிக்கையும் இல்லை.`;
      if (currentLanguage === 'hi') noAlertMsg = `${selectedCountry.toUpperCase()} क्षेत्र में कोई अलर्ट नहीं है।`;
      speakInLanguage(noAlertMsg, { language: currentLanguage });
      return;
    }

    const alertList = alerts.slice(0, 4).map((a, i) => `Alert ${i + 1}: ${a.severity} priority in ${a.country}. ${a.message}`).join('. ');
    let intro = `Active security alerts for ${selectedCountry.toUpperCase()}: ${alertList}`;
    if (currentLanguage === 'ta') {
      intro = `${selectedCountry.toUpperCase()} பகுதிக்கான அவசர எச்சரிக்கைகள்: ${alerts.slice(0, 4).map(a => a.message).join('. ')}`;
    }
    speakInLanguage(intro, { language: currentLanguage });
  };

  // Start Radio Mode
  const handleStartRadio = () => {
    if (!news || news.length === 0) return;
    playEarcon('click');
    globalRadioEngine.init(news, currentLanguage, setRadioState);
    globalRadioEngine.start();
  };

  // Toggle Live Audio Alerts
  const handleToggleAudioAlerts = async () => {
    playEarcon('click');
    const newState = !isAudioAlertsEnabled;
    setIsAudioAlertsEnabled(newState);
    if (newState) {
      await requestNotificationPermission();
      let onMsg = 'Live audio alerts are now enabled.';
      if (currentLanguage === 'ta') onMsg = 'நேரலை குரல் எச்சரிக்கை இயக்கப்பட்டது.';
      if (currentLanguage === 'hi') onMsg = 'लाइव आवाज अलर्ट सक्रिय हो गए हैं।';
      speakInLanguage(onMsg, { language: currentLanguage });
    }
  };

  // Handle Persona Change — maps new persona IDs to impact profiles
  const handlePersonaChange = (newPersona) => {
    setPersona(newPersona);
    const pLower = (newPersona || '').toLowerCase();

    if (pLower.includes('student')) {
      setImpactProfileId('student');
    } else if (pLower.includes('farmer') || pLower.includes('kisan')) {
      setImpactProfileId('farmer');
    } else if (pLower.includes('business')) {
      setImpactProfileId('business');
    } else if (pLower.includes('common') || pLower.includes('casual')) {
      setImpactProfileId('common_person');
    } else if (pLower.includes('accessibility')) {
      setImpactProfileId('common_person');
      setIsHighContrast(true);
      setIsLargeText(true);
      setIsCognitiveSimple(true);
      setIsEasyMode(true);
    } else {
      // Analyst / default
      setImpactProfileId('analyst');
    }

    // Exit easy mode when switching away from Accessibility
    if (!pLower.includes('accessibility') && isEasyMode && (persona || '').toLowerCase().includes('accessibility')) {
      setIsEasyMode(false);
      setIsHighContrast(false);
      setIsLargeText(false);
      setIsCognitiveSimple(false);
    }
    logTelemetryAction(`Persona switched to: ${newPersona}`, newPersona);
  };

  // Handle Easy Mode Toggle
  const handleToggleEasyMode = (val) => {
    playEarcon('click');
    setIsEasyMode(val);
    if (val) {
      let msg = 'Switched to Easy Voice Mode with large buttons.';
      if (currentLanguage === 'ta') msg = 'எளிய குரல் வழி பார்வை முறைக்கு மாற்றப்பட்டது.';
      if (currentLanguage === 'hi') msg = 'बटन और आवाज वाले सरल मोड में बदल दिया गया है।';
      speakInLanguage(msg, { language: currentLanguage });
    }
  };

  const hasCriticalAlert = alerts.some(a => a.severity === 'CRITICAL');

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-slate-100 relative overflow-x-hidden selection:bg-purple-500/30 selection:text-white">
      {/* 3D Spatial Animated Mesh & Contextual Dynamic Ambient Lighting */}
      <BackgroundMesh activeTopic={activeTopic} hasCriticalAlert={hasCriticalAlert} />
      
      {/* If Easy Mode is active, render full-screen EasyModeView */}
      {isEasyMode ? (
        <EasyModeView
          news={news}
          alerts={alerts}
          isLoading={isRefreshing}
          selectedLocation={selectedLocation}
          selectedCountry={selectedCountry}
          onSelectLocation={handleSelectLocation}
          currentLanguage={currentLanguage}
          onSelectLanguage={setCurrentLanguage}
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          onStartRadio={handleStartRadio}
          onReadAlerts={handleReadAlerts}
          onDetectLocation={handleDetectLocation}
          onRefresh={handleManualRefresh}
          onExitEasyMode={() => handleToggleEasyMode(false)}
          isAudioAlertsEnabled={isAudioAlertsEnabled}
          onToggleAudioAlerts={handleToggleAudioAlerts}
        />
      ) : (
        <>
          {/* Top HUD Navigation */}
          <Navbar
            selectedCountry={selectedCountry}
            onRefresh={handleManualRefresh}
            isRefreshing={isRefreshing}
            persona={persona}
            onOpenPersonaModal={() => setIsPersonaModalOpen(true)}
            onOpenDbModal={() => setIsDbModalOpen(true)}
            onToggleVoiceSummary={handleTriggerVoiceSummary}
            isSpeaking={isSpeaking}
            lastUpdatedTime={lastUpdatedTime}
            countdown={countdown}
            currentLanguage={currentLanguage}
            onSelectLanguage={setCurrentLanguage}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            onToggleEasyMode={handleToggleEasyMode}
            isEasyMode={isEasyMode}
            onOpenFutureImpactModal={() => setIsFutureImpactModalOpen(true)}
          />

          {/* Accessibility & Voice Controls Bar */}
          <AccessibilityToolbar
            isHighContrast={isHighContrast}
            onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
            isLargeText={isLargeText}
            onToggleLargeText={() => setIsLargeText(!isLargeText)}
            isCognitiveSimple={isCognitiveSimple}
            onToggleCognitiveSimple={() => setIsCognitiveSimple(!isCognitiveSimple)}
            onTriggerVoiceSummary={handleTriggerVoiceSummary}
            isSpeaking={isSpeaking}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            onStartRadio={handleStartRadio}
            isRadioPlaying={radioState.isPlaying}
            isAudioAlertsEnabled={isAudioAlertsEnabled}
            onToggleAudioAlerts={handleToggleAudioAlerts}
            onToggleEasyMode={handleToggleEasyMode}
            isEasyMode={isEasyMode}
            currentLanguage={currentLanguage}
          />

          {/* Main Dashboard Grid */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-5 space-y-4 relative z-10 spatial-perspective">
            
            {/* Row 1: Key Indicators (AI Personal Impact Engine) */}
            <TelemetryStats
              selectedCountry={selectedCountry}
              newsCount={news.length}
              alertsCount={alerts.length}
              news={news}
              alerts={alerts}
              persona={persona}
              profileId={impactProfileId}
              onOpenImpactModal={() => setIsImpactModalOpen(true)}
              currentLanguage={currentLanguage}
            />

            {/* Row 2: 3D Planetary Smart Globe & Real-time Alert System + Global Impact DNA */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* 3D Smart Globe: 7 columns on desktop */}
              <div className="lg:col-span-7 flex flex-col">
                <Globe3D
                  selectedCountry={selectedCountry}
                  onSelectCountry={handleSelectCountry}
                  onOpenImpactModal={() => setIsImpactModalOpen(true)}
                  news={news}
                  isFocusMode={isCinematicFocus}
                  onToggleFocusMode={(nextVal) => setIsCinematicFocus(nextVal)}
                />
              </div>

              {/* Global Impact DNA & Alert System: 5 columns on desktop */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <GlobalImpactDna
                  riskScore={dnaRiskScore}
                  activityLevel={dnaActivityLevel}
                  climateScore={dnaClimateScore}
                />

                <AlertSystem
                  alerts={alerts}
                  selectedCountry={selectedCountry}
                  onSelectCountry={handleSelectCountry}
                  persona={persona}
                />
              </div>

            </div>

            {/* Row 3: Planetary Hierarchical Geo Navigation & Neighborhood Telemetry Strip */}
            <div className="glass-card-luxe rounded-2xl p-5 shadow-2xl border border-purple-500/25 space-y-4">
              {/* Header with Breadcrumb and GPS */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-purple-500/15">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-display text-xs font-bold text-white tracking-wide flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span className="gradient-text">Planetary Hierarchical Geo Navigation</span>
                  </span>

                  {/* Active Breadcrumb Badge */}
                  <div className="flex items-center gap-1.5 font-mono text-[11px] bg-slate-950/80 border border-purple-500/30 px-3 py-1 rounded-full shadow-inner">
                    <span className="text-cyan-300 font-bold uppercase">{selectedCountry}</span>
                    {selectedState && (
                      <>
                        <ChevronRight className="w-3 h-3 text-purple-400/50" />
                        <span className="text-white font-semibold">{selectedState}</span>
                      </>
                    )}
                    {selectedLocation && (
                      <>
                        <ChevronRight className="w-3 h-3 text-purple-400/50" />
                        <span className="text-pink-400 font-bold">{selectedLocation}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* GPS Auto-Detect Button & Reset Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDetectLocation}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-lg shadow-md shadow-cyan-500/25 transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
                    title="Detect precise GPS neighborhood"
                  >
                    <Navigation className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
                    <span>GPS Auto-Locate</span>
                    <span className="text-[10px] text-cyan-200/80 font-mono">({detectedLocationLabel})</span>
                  </button>

                  {(selectedLocation || selectedState || selectedCountry !== 'global') && (
                    <button
                      onClick={() => handleSelectCountry('global')}
                      className="px-3 py-1.5 text-xs font-mono text-slate-400 hover:text-rose-300 border border-slate-700/80 hover:border-rose-500/50 rounded-lg transition-all flex items-center gap-1.5 hover:bg-rose-500/10"
                      title="Reset to global view"
                    >
                      <X className="w-3 h-3" />
                      <span>Reset Global</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 3-Level Hierarchical Selectors: Country -> State/Province -> City/District */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                {/* Level 1: Country Selector */}
                <div>
                  <label className="block font-mono text-[10px] text-purple-300 font-semibold uppercase tracking-wider mb-1.5">
                    Level 1: Sovereign Nation
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => handleSelectCountry(e.target.value)}
                    className="w-full bg-slate-900/90 border border-slate-700/80 hover:border-purple-500/50 px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 rounded-xl transition-all"
                  >
                    <option value="global">🌐 Worldwide (Planetary Wire)</option>
                    <option value="india">🇮🇳 India</option>
                    <option value="us">🇺🇸 United States</option>
                    <option value="ukraine">🇺🇦 Ukraine</option>
                    <option value="russia">🇷🇺 Russia</option>
                    <option value="china">🇨🇳 China</option>
                    <option value="taiwan">🇹🇼 Taiwan</option>
                    <option value="israel">🇮🇱 Israel</option>
                    <option value="iran">🇮🇷 Iran</option>
                    <option value="germany">🇩🇪 Germany</option>
                    <option value="france">🇫🇷 France</option>
                    <option value="uk">🇬🇧 United Kingdom</option>
                    <option value="japan">🇯🇵 Japan</option>
                    <option value="australia">🇦🇺 Australia</option>
                    <option value="canada">🇨🇦 Canada</option>
                    <option value="brazil">🇧🇷 Brazil</option>
                    {geoDirectory?.countries
                      ?.filter(c => !['global', 'india', 'us', 'ukraine', 'russia', 'china', 'taiwan', 'israel', 'iran', 'germany', 'france', 'uk', 'japan', 'australia', 'canada', 'brazil'].includes(c.id))
                      .map(c => (
                        <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
                      ))}
                  </select>
                </div>

                {/* Level 2: State / Province Selector */}
                <div>
                  <label className="block font-mono text-[10px] text-purple-300 font-semibold uppercase tracking-wider mb-1.5">
                    Level 2: State / Province
                  </label>
                  <select
                    value={selectedState || ''}
                    onChange={(e) => {
                      if (!e.target.value) {
                        setSelectedState(null);
                        loadTelemetryData(true, selectedCountry, null, null);
                      } else {
                        handleSelectState(e.target.value);
                      }
                    }}
                    className="w-full bg-slate-900/90 border border-slate-700/80 hover:border-purple-500/50 px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 rounded-xl transition-all"
                  >
                    <option value="">All States / Whole Country</option>
                    {selectedCountry === 'india' && geoDirectory?.indiaStates?.map(s => (
                      <option key={s.id} value={s.id}>🇮🇳 {s.name}</option>
                    ))}
                    {selectedCountry === 'us' && geoDirectory?.usStates?.map(s => (
                      <option key={s.id} value={s.id}>🇺🇸 {s.name}</option>
                    ))}
                    {selectedCountry !== 'india' && selectedCountry !== 'us' && geoDirectory?.intlRegions?.filter(r => r.country === selectedCountry).map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                {/* Level 3: City / District / Micro-Region Quick Drill-down */}
                <div>
                  <label className="block font-mono text-[10px] text-purple-300 font-semibold uppercase tracking-wider mb-1.5">
                    Level 3: City / Micro-Area
                  </label>
                  <form onSubmit={handleCustomLocSubmit} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={customLocationInput}
                      onChange={(e) => setCustomLocationInput(e.target.value)}
                      placeholder="e.g. Velachery, Dallas, Munich..."
                      className="w-full bg-slate-900/90 border border-slate-700/80 hover:border-purple-500/50 px-3 py-2 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 rounded-xl transition-all"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-xs rounded-xl shadow-md shadow-purple-500/25 transition-all shrink-0 flex items-center gap-1 hover:scale-105 active:scale-95"
                    >
                      <Search className="w-3.5 h-3.5 text-pink-200" />
                      <span>Drill</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Quick Neighborhood & City Chips */}
              <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-purple-500/10">
                <span className="font-mono text-[11px] text-purple-300 font-semibold mr-1">Direct Chips:</span>

                {selectedCountry === 'india' ? (
                  CHENNAI_NEIGHBORHOODS.map(hood => {
                    const isSelected = selectedLocation === hood.loc;
                    return (
                      <button
                        key={hood.id}
                        onClick={() => handleSelectLocation(hood.loc, 'india', 'tamil nadu')}
                        className={`px-3 py-1 text-xs font-mono rounded-lg border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold border-transparent shadow-md shadow-purple-500/30 scale-105'
                            : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:text-white hover:border-purple-500/40 hover:bg-slate-800/80'
                        }`}
                      >
                        <span>{hood.icon}</span>
                        <span>{hood.label}</span>
                      </button>
                    );
                  })
                ) : (
                  [
                    { id: 'all', label: 'All Regions', loc: null },
                    { id: 'cap', label: 'National Capital', loc: 'capital' },
                    { id: 'comm', label: 'Economic Core', loc: 'economy' }
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleSelectLocation(c.loc)}
                      className="px-3 py-1 text-xs font-mono rounded-lg border bg-slate-900/80 text-slate-300 border-slate-800 hover:text-white hover:border-purple-500/40 hover:bg-slate-800/80 transition-all"
                    >
                      {c.label}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Row 4: Live Verified Real-time News Stream */}
            <div className="w-full">
              <NewsPanel
                news={news}
                isLoading={isRefreshing && news.length === 0}
                selectedCountry={selectedCountry}
                selectedLocation={selectedLocation}
                geoInfo={geoInfo}
                fallbackDetails={fallbackDetails}
                onSelectLocation={handleSelectLocation}
                activeTopic={activeTopic}
                onSelectTopic={setActiveTopic}
                persona={persona}
                onSelectPersona={handlePersonaChange}
                isCognitiveSimple={isCognitiveSimple}
                currentLanguage={currentLanguage}
                lastUpdatedTime={lastUpdatedTime}
                countdown={countdown}
              />
            </div>

          </main>

          {/* Footer */}
          <footer className="w-full border-t border-purple-500/15 py-3 px-6 bg-slate-950/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="font-mono text-slate-500 text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                Global Intelligence Wire · Voice Subsystem Active
              </span>
              <span className="font-mono text-[10px] text-slate-500 tabular-nums">
                Auto-sync in <span className={`font-bold ${countdown <= 5 ? 'text-pink-400 animate-pulse' : 'text-purple-300'}`}>{countdown}s</span>
              </span>
              <span className="font-mono text-[10px] text-slate-500">
                Speech API · EN / தமிழ் / हिंदी
              </span>
            </div>
          </footer>
        </>
      )}

      {/* Persistent Continuous News Radio Player Bar (Active in both views) */}
      <RadioPlayerBar
        isPlaying={radioState.isPlaying}
        isPaused={radioState.isPaused}
        currentIndex={radioState.currentIndex}
        totalStories={radioState.total}
        currentStory={radioState.currentStory}
        language={currentLanguage}
        onPlay={() => globalRadioEngine.resume()}
        onPause={() => globalRadioEngine.pause()}
        onNext={() => globalRadioEngine.next()}
        onPrev={() => globalRadioEngine.prev()}
        onStop={() => globalRadioEngine.stop()}
      />

      {/* Voice Assistant Speech Recognition Dialog */}
      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        currentLanguage={currentLanguage}
        onSelectLanguage={setCurrentLanguage}
        onLocationChange={(loc) => {
          const locLower = (loc || '').toLowerCase().trim();
          const chennaiAreas = ['velachery', 't nagar', 'tnagar', 'adyar', 'anna nagar', 'tambaram', 'mylapore', 'guindy', 'omr', 'chennai', 'madipakkam', 'porur', 'thiruvanmiyur'];
          if (chennaiAreas.includes(locLower)) {
            handleSelectLocation(locLower === 'tnagar' ? 't nagar' : locLower);
          } else {
            handleSelectCountry(locLower);
          }
        }}
        onStartRadio={handleStartRadio}
        onReadAlerts={handleReadAlerts}
        onToggleEasyMode={handleToggleEasyMode}
        onTriggerExplain={() => {
          if (news.length > 0) {
            fetchNewsExplanation(news[0].title, news[0].description, currentLanguage)
              .then(data => speakInLanguage(data.simpleText, { language: currentLanguage }));
          }
        }}
        onRepeat={() => {
          if (radioState.isPlaying) {
            globalRadioEngine.repeatCurrentStory();
          } else if (news.length > 0) {
            speakInLanguage(`${news[0].title}. ${news[0].description || ''}`, { language: currentLanguage });
          }
        }}
        onSelectTopic={(cat) => {
          setActiveTopic(cat);
          loadTelemetryData(true);
        }}
      />

      {/* Persona Selection Modal */}
      <PersonaSelector
        isOpen={isPersonaModalOpen}
        onClose={() => setIsPersonaModalOpen(false)}
        currentPersona={persona}
        onSelectPersona={handlePersonaChange}
      />

      {/* Supabase Table & Live Rows Inspector Modal */}
      <LogsViewer
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
      />

      {/* AI Personal Impact Engine Deep-Dive Modal */}
      <PersonalImpactModal
        isOpen={isImpactModalOpen}
        onClose={() => setIsImpactModalOpen(false)}
        impactData={calculatePersonalImpact({
          news,
          alerts,
          selectedCountry,
          profileId: impactProfileId,
          language: currentLanguage
        })}
        activeProfileId={impactProfileId}
        onChangeProfile={setImpactProfileId}
        selectedCountry={selectedCountry}
        currentLanguage={currentLanguage}
        isSpeaking={isSpeaking}
        setIsSpeaking={setIsSpeaking}
      />

      {/* Future Impact Simulator Modal */}
      <FutureImpactSimulatorModal
        isOpen={isFutureImpactModalOpen}
        onClose={() => setIsFutureImpactModalOpen(false)}
        currentLocation={selectedLocation || selectedState || selectedCountry}
        currentPersona={persona}
      />

      {/* Cinematic Focus Mode Fullscreen Immersive View */}
      {isCinematicFocus && (
        <div className="fixed inset-0 z-50 bg-[#02040a]/94 backdrop-blur-2xl p-4 sm:p-6 flex flex-col overflow-y-auto animate-fade-in">
          {/* Cinematic Top Control Bar */}
          <div className="flex items-center justify-between p-3.5 mb-4 rounded-2xl glass-card-luxe border border-pink-500/30 shadow-2xl shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-pink-500 animate-ping" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white tracking-widest uppercase">
                    CINEMATIC FOCUS MODE
                  </span>
                  <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full border border-pink-500/50 bg-pink-500/20 text-pink-200 font-semibold">
                    ORBITAL SPOTLIGHT
                  </span>
                </div>
                <p className="font-sans text-[11px] text-slate-400">
                  Target Territory: <strong className="text-cyan-300 uppercase">{selectedCountry}</strong> · Background dimmed · Regional stream locked
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleExitFocusMode}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-sans text-xs font-semibold shadow-lg shadow-pink-500/25 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                title="Exit Cinematic Focus Mode (or press ESC)"
              >
                <X className="w-4 h-4" />
                <span>Exit Focus Mode</span>
                <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono border border-white/20">ESC</kbd>
              </button>
            </div>
          </div>

          {/* Cinematic Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch">
            {/* Expanded 3D Globe with Close Orbital Focus */}
            <div className="lg:col-span-7 flex flex-col min-h-[480px]">
              <Globe3D
                selectedCountry={selectedCountry}
                onSelectCountry={(cId) => handleSelectCountry(cId, false)}
                onOpenImpactModal={() => setIsImpactModalOpen(true)}
                news={news}
                isFocusMode={true}
                onToggleFocusMode={handleExitFocusMode}
              />
            </div>

            {/* Regional Intelligence Data Panel */}
            <div className="lg:col-span-5 flex flex-col">
              <CinematicRegionPanel
                selectedCountry={selectedCountry}
                onSelectCountry={(cId) => handleSelectCountry(cId, false)}
                onExitFocusMode={handleExitFocusMode}
                news={news}
                alerts={alerts}
                currentLanguage={currentLanguage}
                onOpenImpactModal={() => setIsImpactModalOpen(true)}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

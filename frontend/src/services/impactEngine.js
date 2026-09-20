/**
 * AI Personal Impact Engine
 * 
 * Computes how planetary and local telemetry directly affects the user's daily life
 * across 4 core vectors:
 * 1. Commute & Transit (Fuel, Transit, Regional Mobility)
 * 2. Household Budget (Food, Grocery, Energy, Inflation)
 * 3. Tech & Devices (Gadgets, Semiconductor Chips, Hardware Supply Chains)
 * 4. Digital Safety (Cyber Threats, Phishing, Telecom & Network Reliability)
 */

export const IMPACT_PROFILES = [
  { id: 'commuter', label: 'Daily Commuter', icon: '🚗', desc: 'Prioritizes fuel prices, transit disruptions, and regional weather' },
  { id: 'tech', label: 'Tech Professional', icon: '💻', desc: 'Focuses on chip supply chains, cloud/cyber stability, and hardware prices' },
  { id: 'household', label: 'Household & Budget', icon: '🛒', desc: 'Monitors food inflation, energy bills, and essential goods' },
  { id: 'student', label: 'Student / Scholar', icon: '🎓', desc: 'Tracks digital connectivity, educational transit, and device access' },
  { id: 'analyst', label: 'Strategic Analyst', icon: '📊', desc: 'Holistic geopolitical ripple effects across all sectors' }
];

// Hotspot specific personal impact annotations
export const HOTSPOT_PERSONAL_IMPACTS = {
  taiwan: {
    title: 'Taiwan Strait',
    personalImpact: 'Originates 85% of advanced computing chips. Disruption directly triggers price spikes on smartphones, laptops, and auto parts.',
    primaryVector: 'Tech & Hardware',
    severity: 'HIGH'
  },
  ukraine: {
    title: 'Ukraine & Black Sea',
    personalImpact: 'Crucial grain and neon gas corridor. Tensions create grocery wheat/oil inflation and industrial supply ripples.',
    primaryVector: 'Household Budget',
    severity: 'CRITICAL'
  },
  israel: {
    title: 'Levant & Red Sea',
    personalImpact: 'Red Sea maritime shipping chokepoint. Route diversions add 10-14 days to imported electronics and raise shipping freight costs.',
    primaryVector: 'Commute & Freight',
    severity: 'CRITICAL'
  },
  iran: {
    title: 'Strait of Hormuz',
    personalImpact: '20% of global petroleum passes here. Escalations cause direct surges in petrol, diesel, and cooking LPG prices.',
    primaryVector: 'Commute & Fuel',
    severity: 'HIGH'
  },
  russia: {
    title: 'Eurasian Energy Corridor',
    personalImpact: 'Global fertilizer, wheat, and oil exporter. Instability ripples into cooking oil and energy tariff fluctuations.',
    primaryVector: 'Household Budget',
    severity: 'HIGH'
  },
  'south korea': {
    title: 'Korean Semiconductor Hub',
    personalImpact: 'Produces over 50% of global smartphone memory (DRAM/NAND). Tensions can delay gadget upgrades and drive up RAM/SSD costs.',
    primaryVector: 'Tech & Hardware',
    severity: 'ELEVATED'
  },
  china: {
    title: 'Manufacturing Epicenter',
    personalImpact: 'Supplies 60%+ of consumer electronics and daily household goods. Production or export halts create immediate retail shortages.',
    primaryVector: 'Household & Tech',
    severity: 'ELEVATED'
  },
  us: {
    title: 'Global Financial & Cloud Core',
    personalImpact: 'Hosts major cloud infrastructure (AWS/Azure/GCP). Policy shifts sway global tech hiring and interest rates on loans.',
    primaryVector: 'Tech & Budget',
    severity: 'ELEVATED'
  },
  india: {
    title: 'Domestic Sector',
    personalImpact: 'Local transit, monsoon reservoir levels, vegetable inflation, and power grid status impacting your daily routine directly.',
    primaryVector: 'Commute & Budget',
    severity: 'MONITORED'
  },
  sudan: {
    title: 'Nile Basin Corridor',
    personalImpact: 'Gum arabic and agricultural supply chain disruptions impacting packaged food and pharmaceutical stabilizers.',
    primaryVector: 'Household Budget',
    severity: 'HIGH'
  }
};

/**
 * Calculate personal impact based on live news, active alerts, selected location, and profile
 */
export function calculatePersonalImpact({
  news = [],
  alerts = [],
  selectedCountry = 'global',
  profileId = 'tech',
  language = 'en'
}) {
  let commuteScore = 15;
  let budgetScore = 15;
  let techScore = 15;
  let cyberScore = 15;

  const activeAlerts = alerts || [];
  const newsItems = news || [];

  // 1. Analyze Active Alerts
  for (const alert of activeAlerts) {
    const text = ((alert.message || '') + ' ' + (alert.severity || '')).toLowerCase();
    const weight = alert.severity === 'CRITICAL' ? 18 : (alert.severity === 'HIGH' ? 10 : 5);

    if (text.includes('cyber') || text.includes('hack') || text.includes('telecom') || text.includes('outage') || text.includes('network')) {
      cyberScore += weight;
    }
    if (text.includes('oil') || text.includes('fuel') || text.includes('transit') || text.includes('flight') || text.includes('airspace') || text.includes('sea') || text.includes('ship')) {
      commuteScore += weight;
    }
    if (text.includes('inflation') || text.includes('food') || text.includes('wheat') || text.includes('grain') || text.includes('price') || text.includes('energy')) {
      budgetScore += weight;
    }
    if (text.includes('chip') || text.includes('semiconductor') || text.includes('hardware') || text.includes('tech') || text.includes('taiwan')) {
      techScore += weight;
    }
  }

  // 2. Analyze News Headlines & Sentiment
  for (const item of newsItems) {
    const text = ((item.title || '') + ' ' + (item.description || '') + ' ' + (item.topic || '')).toLowerCase();
    
    // Commute & Fuel
    if (text.includes('petrol') || text.includes('diesel') || text.includes('fuel') || text.includes('traffic') || text.includes('metro') || text.includes('flight') || text.includes('transit') || text.includes('crude')) {
      commuteScore += 4;
    }
    // Budget & Food
    if (text.includes('inflation') || text.includes('grocery') || text.includes('vegetable') || text.includes('food') || text.includes('tariff') || text.includes('economy') || text.includes('market') || text.includes('interest rate')) {
      budgetScore += 4;
    }
    // Tech & Supply Chain
    if (text.includes('chip') || text.includes('ai') || text.includes('semiconductor') || text.includes('hardware') || text.includes('electronics') || text.includes('supply chain') || text.includes('laptop') || text.includes('smartphone')) {
      techScore += 4;
    }
    // Cyber & Digital Safety
    if (text.includes('cyber') || text.includes('phishing') || text.includes('scam') || text.includes('ransomware') || text.includes('breach') || text.includes('privacy') || text.includes('cloud') || text.includes('telecom')) {
      cyberScore += 5;
    }
  }

  // Normalize scores to max 98 and min 12
  commuteScore = Math.min(98, Math.max(12, Math.round(commuteScore)));
  budgetScore = Math.min(98, Math.max(12, Math.round(budgetScore)));
  techScore = Math.min(98, Math.max(12, Math.round(techScore)));
  cyberScore = Math.min(98, Math.max(12, Math.round(cyberScore)));

  // Profile-weighted overall impact score
  let overallScore = 25;
  switch (profileId) {
    case 'commuter':
      overallScore = Math.round(commuteScore * 0.45 + budgetScore * 0.25 + cyberScore * 0.15 + techScore * 0.15);
      break;
    case 'tech':
      overallScore = Math.round(techScore * 0.40 + cyberScore * 0.30 + budgetScore * 0.15 + commuteScore * 0.15);
      break;
    case 'household':
      overallScore = Math.round(budgetScore * 0.45 + commuteScore * 0.25 + cyberScore * 0.15 + techScore * 0.15);
      break;
    case 'student':
      overallScore = Math.round(techScore * 0.35 + budgetScore * 0.25 + commuteScore * 0.20 + cyberScore * 0.20);
      break;
    case 'analyst':
    default:
      overallScore = Math.round((commuteScore + budgetScore + techScore + cyberScore) / 4);
      break;
  }
  overallScore = Math.min(98, Math.max(15, overallScore));

  // Determine Severity Level
  let level = 'LOW';
  let levelBadge = 'Mild Ripple';
  let badgeColor = 'text-wire-green';
  let bgBadge = 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300';

  if (overallScore >= 70) {
    level = 'HIGH';
    levelBadge = 'Direct Impact Expected';
    badgeColor = 'text-wire-red';
    bgBadge = 'bg-rose-950/50 border-rose-500/40 text-rose-300';
  } else if (overallScore >= 45) {
    level = 'MEDIUM';
    levelBadge = 'Moderate Ripple';
    badgeColor = 'text-wire-amber';
    bgBadge = 'bg-amber-950/40 border-amber-500/30 text-amber-300';
  }

  // Find Primary Driving Vector
  const vectors = [
    { id: 'commute', name: 'Commute & Travel', score: commuteScore, icon: '🚗', color: '#00f3ff' },
    { id: 'budget', name: 'Household Budget', score: budgetScore, icon: '🛒', color: '#ffb800' },
    { id: 'tech', name: 'Tech & Hardware', score: techScore, icon: '💻', color: '#a855f7' },
    { id: 'cyber', name: 'Digital & Cyber Safety', score: cyberScore, icon: '🔒', color: '#00ff9d' }
  ];
  vectors.sort((a, b) => b.score - a.score);
  const primaryVector = vectors[0];

  // Dynamic concise summary
  let conciseSummary = '';
  let actionableAdvice = '';

  if (overallScore >= 70) {
    conciseSummary = `High vulnerability in ${primaryVector.name}. Geopolitical & supply chain disruptions pose near-term price and access friction.`;
    actionableAdvice = `Postpone non-essential hardware purchases, verify two-factor authentication on financial accounts, and check route fuel/transit updates before travel.`;
  } else if (overallScore >= 45) {
    conciseSummary = `Notable ripple in ${primaryVector.name}. Moderate consumer inflation and component lead-time variances detected.`;
    actionableAdvice = `Monitor monthly utility/grocery budgets and keep essential software and device backups updated.`;
  } else {
    conciseSummary = `Stable personal telemetry across all life vectors. Normal daily operations recommended.`;
    actionableAdvice = `Routine monitoring. No immediate defensive adjustments needed for your daily schedule.`;
  }

  // Multilingual translations
  if (language === 'ta') {
    if (overallScore >= 70) {
      conciseSummary = `${primaryVector.name} துறையில் அதிக தாக்கம். உலகளாவிய மாற்றங்கள் உங்கள் அன்றாட செலவு மற்றும் பயணத்தை நேரடியாக பாதிக்கலாம்.`;
      actionableAdvice = `அத்தியாவசியமில்லாத பெரிய வாங்குதல்களை தள்ளிப்போடவும், வங்கி பாதுகாப்பு சோதனைகளை உறுதிப்படுத்தவும்.`;
    } else if (overallScore >= 45) {
      conciseSummary = `${primaryVector.name} பிரிவில் மிதமான தாக்கம் பதிவாகியுள்ளது. மளிகை மற்றும் பயணச் செலவுகளை கவனிக்கவும்.`;
      actionableAdvice = `மாதாந்திர பட்ஜெட்டை சீராக பராமரித்து, அன்றாட பயண விவரங்களை முன்கூட்டியே திட்டமிடவும்.`;
    } else {
      conciseSummary = `உங்கள் அன்றாட வாழ்க்கைக்கு நேரடி அச்சுறுத்தல் இல்லை. இயல்பான சூழல் நீடிக்கிறது.`;
      actionableAdvice = `எப்போதும் போல வழமையான பணிகளைத் தொடரலாம்.`;
    }
  } else if (language === 'hi') {
    if (overallScore >= 70) {
      conciseSummary = `${primaryVector.name} में उच्च असर। वैश्विक घटनाक्रम आपके दैनिक खर्च और यात्रा पर सीधा असर डाल सकते हैं।`;
      actionableAdvice = `अनावश्यक बड़े खर्च टालें और डिजिटल खातों की सुरक्षा सुनिश्चित करें।`;
    } else if (overallScore >= 45) {
      conciseSummary = `${primaryVector.name} में मध्यम प्रभाव देखा गया है। बजट और यात्रा योजनाओं पर नजर रखें।`;
      actionableAdvice = `मासिक खर्चों को संतुलित रखें और आवश्यक बैकअप तैयार रखें।`;
    } else {
      conciseSummary = `आपकी दिनचर्या पर कोई सीधा खतरा नहीं है। सामान्य स्थिति बनी हुई है।`;
      actionableAdvice = `दैनिक कार्य सामान्य रूप से जारी रख सकते हैं।`;
    }
  }

  // Country specific annotation if focused
  const hotspotInfo = HOTSPOT_PERSONAL_IMPACTS[selectedCountry.toLowerCase()] || null;

  return {
    overallScore,
    level,
    levelBadge,
    badgeColor,
    bgBadge,
    primaryVector,
    conciseSummary,
    actionableAdvice,
    vectors,
    hotspotInfo,
    profile: IMPACT_PROFILES.find(p => p.id === profileId) || IMPACT_PROFILES[1],
    speechText: `AI Personal Impact Assessment: ${levelBadge}. Overall personal impact score is ${overallScore} out of 100. Primary driving area is ${primaryVector.name}. ${conciseSummary} Actionable guidance: ${actionableAdvice}`
  };
}

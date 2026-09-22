/**
 * AI Personal Impact Engine
 * 
 * Computes how planetary and local telemetry directly affects the user's daily life
 * across 4 core vectors tailored to the active Persona:
 * 1. Commute & Transit (Fuel, Transit, Regional Mobility)
 * 2. Household Budget (Food, Grocery, Energy, Inflation, Crop Mandi)
 * 3. Tech & Devices (Gadgets, Semiconductor Chips, Hardware Supply Chains)
 * 4. Digital Safety (Cyber Threats, Phishing, Telecom & Network Reliability)
 */

export const IMPACT_PROFILES = [
  { id: 'common_person', label: 'Common Person', icon: '👥', desc: 'Family grocery budget, daily commute, fuel, and domestic utilities' },
  { id: 'student', label: 'Student / Scholar', icon: '🎓', desc: 'Exams, campus commute, gadget prices, digital connectivity, and study tools' },
  { id: 'farmer', label: 'Farmer / Kisan', icon: '🌾', desc: 'Rainfall/monsoon, mandi crop prices, fertilizer, diesel, and water reservoirs' },
  { id: 'business', label: 'Business & Trade', icon: '💼', desc: 'Supply chains, freight shipping, forex, tariffs, inflation, and corporate risks' },
  { id: 'analyst', label: 'Strategic Analyst', icon: '📊', desc: 'Holistic geopolitical ripple effects, systemic defence, and sovereign risks' },
  { id: 'tech', label: 'Tech Professional', icon: '💻', desc: 'Chip supply chains, cloud stability, hardware prices, and cyber defence' }
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
    personalImpact: 'Crucial grain and fertilizer corridor. Tensions create grocery wheat/cooking oil inflation and fertilizer cost hikes.',
    primaryVector: 'Household Budget & Agri',
    severity: 'CRITICAL'
  },
  israel: {
    title: 'Levant & Red Sea',
    personalImpact: 'Red Sea maritime shipping chokepoint. Route diversions add 10-14 days to imported goods and raise cargo freight costs.',
    primaryVector: 'Commute & Freight',
    severity: 'CRITICAL'
  },
  iran: {
    title: 'Strait of Hormuz',
    personalImpact: '20% of global petroleum passes here. Escalations cause direct surges in petrol, diesel, and cooking LPG prices.',
    primaryVector: 'Fuel & Commute',
    severity: 'HIGH'
  },
  russia: {
    title: 'Eurasian Energy Corridor',
    personalImpact: 'Global potash fertilizer and crude exporter. Instability ripples into cooking oil, crop inputs, and domestic energy bills.',
    primaryVector: 'Budget & Fertilizer',
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
    primaryVector: 'Retail & Hardware',
    severity: 'ELEVATED'
  },
  us: {
    title: 'Global Financial & Cloud Core',
    personalImpact: 'Hosts major cloud infrastructure (AWS/Azure/GCP). Policy shifts sway global tech hiring and interest rates on loans.',
    primaryVector: 'Business & Cloud',
    severity: 'ELEVATED'
  },
  india: {
    title: 'Domestic Sector',
    personalImpact: 'Local transit, monsoon reservoir levels, mandi vegetable inflation, and power grid status impacting your daily routine directly.',
    primaryVector: 'Domestic Routine',
    severity: 'MONITORED'
  },
  sudan: {
    title: 'Nile Basin Corridor',
    personalImpact: 'Gum arabic and agricultural supply chain disruptions impacting packaged food and pharmaceutical stabilizers.',
    primaryVector: 'Agri Supply Chain',
    severity: 'HIGH'
  }
};

/**
 * Calculate personal impact based on live news, active alerts, selected location, and persona profile
 */
export function calculatePersonalImpact({
  news = [],
  alerts = [],
  selectedCountry = 'global',
  profileId = 'common_person',
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

    if (text.includes('cyber') || text.includes('hack') || text.includes('telecom') || text.includes('outage') || text.includes('network') || text.includes('scam')) {
      cyberScore += weight;
    }
    if (text.includes('oil') || text.includes('fuel') || text.includes('transit') || text.includes('flight') || text.includes('airspace') || text.includes('sea') || text.includes('ship') || text.includes('metro') || text.includes('traffic')) {
      commuteScore += weight;
    }
    if (text.includes('inflation') || text.includes('food') || text.includes('wheat') || text.includes('grain') || text.includes('price') || text.includes('energy') || text.includes('rain') || text.includes('flood') || text.includes('cyclone') || text.includes('monsoon')) {
      budgetScore += weight;
    }
    if (text.includes('chip') || text.includes('semiconductor') || text.includes('hardware') || text.includes('tech') || text.includes('taiwan') || text.includes('device') || text.includes('ai')) {
      techScore += weight;
    }
  }

  // 2. Analyze News Headlines & Sentiment
  for (const item of newsItems) {
    const text = ((item.title || '') + ' ' + (item.description || '') + ' ' + (item.topic || '')).toLowerCase();
    
    // Commute & Transit
    if (text.includes('petrol') || text.includes('diesel') || text.includes('fuel') || text.includes('traffic') || text.includes('metro') || text.includes('flight') || text.includes('transit') || text.includes('crude')) {
      commuteScore += 4;
    }
    // Budget & Food / Agriculture
    if (text.includes('inflation') || text.includes('grocery') || text.includes('vegetable') || text.includes('food') || text.includes('tariff') || text.includes('economy') || text.includes('market') || text.includes('rain') || text.includes('crop') || text.includes('farmer') || text.includes('fertilizer') || text.includes('monsoon')) {
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
    case 'farmer':
      // Heavily weights budget (crop/rain/fertilizer) and commute (diesel/transport)
      overallScore = Math.round(budgetScore * 0.55 + commuteScore * 0.30 + cyberScore * 0.05 + techScore * 0.10);
      break;
    case 'student':
      // Focuses on tech/devices, digital safety/cyber, and campus commute
      overallScore = Math.round(techScore * 0.40 + cyberScore * 0.25 + commuteScore * 0.25 + budgetScore * 0.10);
      break;
    case 'business':
      // High supply chain, market/budget, and cyber stability
      overallScore = Math.round(budgetScore * 0.35 + techScore * 0.30 + cyberScore * 0.20 + commuteScore * 0.15);
      break;
    case 'common_person':
    case 'commuter':
    case 'household':
      // Balanced everyday household budget and commute
      overallScore = Math.round(budgetScore * 0.40 + commuteScore * 0.40 + cyberScore * 0.10 + techScore * 0.10);
      break;
    case 'tech':
      overallScore = Math.round(techScore * 0.45 + cyberScore * 0.30 + budgetScore * 0.15 + commuteScore * 0.10);
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
  let badgeColor = 'text-emerald-400';
  let bgBadge = 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300';

  if (overallScore >= 70) {
    level = 'HIGH';
    levelBadge = 'Direct Impact Expected';
    badgeColor = 'text-rose-400';
    bgBadge = 'bg-rose-950/50 border-rose-500/40 text-rose-300';
  } else if (overallScore >= 45) {
    level = 'MEDIUM';
    levelBadge = 'Moderate Ripple';
    badgeColor = 'text-amber-400';
    bgBadge = 'bg-amber-950/40 border-amber-500/30 text-amber-300';
  }

  // Rename and customize vectors based on persona
  let vectorNames = {
    commute: 'Commute & Travel',
    budget: 'Household Budget',
    tech: 'Tech & Hardware',
    cyber: 'Digital & Cyber Safety'
  };

  if (profileId === 'farmer') {
    vectorNames = {
      commute: 'Diesel & Tractor Fuel',
      budget: 'Crop Prices & Monsoon Rain',
      tech: 'Agri Machinery & Tools',
      cyber: 'Direct DBT & Bank SMS'
    };
  } else if (profileId === 'business') {
    vectorNames = {
      commute: 'Freight Logistics & Transit',
      budget: 'Trade Costs & Currency Inflation',
      tech: 'Supply Chain & Hardware',
      cyber: 'Corporate Cyber Infrastructure'
    };
  } else if (profileId === 'student') {
    vectorNames = {
      commute: 'Campus & Metro Transit',
      budget: 'Living & Food Expenses',
      tech: 'Gadgets & Laptop Costs',
      cyber: 'Campus Network & Accounts'
    };
  }

  const vectors = [
    { id: 'commute', name: vectorNames.commute, score: commuteScore, icon: profileId === 'farmer' ? '🚜' : '🚗', color: '#00f3ff' },
    { id: 'budget', name: vectorNames.budget, score: budgetScore, icon: profileId === 'farmer' ? '🌾' : '🛒', color: '#ffb800' },
    { id: 'tech', name: vectorNames.tech, score: techScore, icon: '💻', color: '#a855f7' },
    { id: 'cyber', name: vectorNames.cyber, score: cyberScore, icon: '🔒', color: '#00ff9d' }
  ];
  vectors.sort((a, b) => b.score - a.score);
  const primaryVector = vectors[0];

  // Dynamic persona-tailored concise summary and advice
  let conciseSummary = '';
  let actionableAdvice = '';

  if (profileId === 'farmer') {
    if (overallScore >= 70) {
      conciseSummary = `High alert for agriculture. Weather changes and diesel/fertilizer tariffs indicate critical crop protection needed.`;
      actionableAdvice = `Check field drainage, secure harvested produce in storage sheds, and monitor local Mandi rates before selling.`;
    } else if (overallScore >= 45) {
      conciseSummary = `Moderate agrarian ripple. Rainfall variability and agricultural fuel costs may shift this week.`;
      actionableAdvice = `Track daily weather forecasts and schedule irrigation according to rain advisories.`;
    } else {
      conciseSummary = `Normal weather and mandi price conditions. Agricultural routines can proceed smoothly.`;
      actionableAdvice = `Continue routine farming and irrigation as planned.`;
    }
  } else if (profileId === 'business') {
    if (overallScore >= 70) {
      conciseSummary = `Severe commercial friction detected in ${primaryVector.name}. Supply chain bottlenecks and currency rates require immediate review.`;
      actionableAdvice = `Increase inventory buffer, hedge currency exposure, and evaluate alternative maritime shipping routes.`;
    } else if (overallScore >= 45) {
      conciseSummary = `Moderate business volatility. Expect slight freight delays and wholesale input price variations.`;
      actionableAdvice = `Communicate with key vendors and monitor freight lead times for critical components.`;
    } else {
      conciseSummary = `Commercial and supply chain indicators stable. Standard operational flow maintained.`;
      actionableAdvice = `Maintain normal procurement and enterprise workflows.`;
    }
  } else if (profileId === 'student') {
    if (overallScore >= 70) {
      conciseSummary = `Elevated impact on student transit and device hardware costs. Possible metro delays or gadget price increases.`;
      actionableAdvice = `Leave early for campus exams, postpone non-critical electronics purchases, and verify digital student portals.`;
    } else if (overallScore >= 45) {
      conciseSummary = `Moderate ripple in ${primaryVector.name}. Daily travel or online study connectivity may see brief variance.`;
      actionableAdvice = `Keep offline notes ready and charge devices ahead of regional power or transit advisories.`;
    } else {
      conciseSummary = `Smooth conditions for academic routines and campus transit. No disruptions expected.`;
      actionableAdvice = `Focus on study and regular campus schedules.`;
    }
  } else {
    // Common Person / Default
    if (overallScore >= 70) {
      conciseSummary = `High vulnerability in ${primaryVector.name}. Everyday fuel, grocery budget, or transit routes face noticeable pressure.`;
      actionableAdvice = `Plan extra time for daily commute, check fuel prices, and postpone discretionary household purchases.`;
    } else if (overallScore >= 45) {
      conciseSummary = `Moderate ripple in ${primaryVector.name}. Kitchen groceries or local travel times may experience small shifts.`;
      actionableAdvice = `Keep household essentials stocked and check route traffic before leaving home.`;
    } else {
      conciseSummary = `Stable personal telemetry across all life vectors. Normal daily routine recommended.`;
      actionableAdvice = `Routine operations. No special defensive precautions required today.`;
    }
  }

  // Multilingual translations
  if (language === 'ta') {
    if (profileId === 'farmer') {
      conciseSummary = overallScore >= 50 
        ? `விவசாயத்திற்கான முக்கிய எச்சரிக்கை. பருவமழை மற்றும் உரம்/டீசல் விலையில் மாற்றம் ஏற்படலாம்.`
        : `விவசாய சூழல் இயல்பாக உள்ளது. அறுவடை மற்றும் பாசன பணிகளை வழக்கம்போல தொடரலாம்.`;
      actionableAdvice = `விளைபொருட்களை பாதுகாப்பான கிடங்கில் வைக்கவும்; வானிலை அறிக்கையை தினமும் கவனிக்கவும்.`;
    } else if (profileId === 'student') {
      conciseSummary = overallScore >= 50 
        ? `மாணவர்களுக்கான எச்சரிக்கை: கல்லூரி பயணம் மற்றும் இணைய வசதிகளில் சிறு மாற்றங்கள் இருக்கலாம்.`
        : `படிப்பு மற்றும் கல்லூரி பயணத்தில் எந்த தடங்கலும் இல்லை. இயல்பான சூழல் நீடிக்கிறது.`;
      actionableAdvice = `தேர்வுகளுக்கு முன்னதாக கிளம்பவும், முக்கியமான பாட குறிப்புகளை கணினியில் சேமித்து வைக்கவும்.`;
    } else if (profileId === 'business') {
      conciseSummary = overallScore >= 50 
        ? `வணிகம் மற்றும் சரக்கு போக்குவரத்தில் தாமதங்கள் ஏற்பட வாய்ப்புள்ளது.`
        : `வணிகச் சூழல் மற்றும் சந்தை நிலவரம் சீராக உள்ளது.`;
      actionableAdvice = `சரக்கு இருப்பை முன்கூட்டியே திட்டமிட்டு, மாற்று விநியோக வழிகளை ஆராயவும்.`;
    } else {
      conciseSummary = overallScore >= 50 
        ? `உங்கள் அன்றாட குடும்ப செலவு மற்றும் பயணத்தில் சிறு மாற்றம் இருக்கலாம்.`
        : `உங்கள் அன்றாட வாழ்க்கைக்கு நேரடி அச்சுறுத்தல் இல்லை. இயல்பான சூழல் நீடிக்கிறது.`;
      actionableAdvice = `பயணத்தை முன்கூட்டியே திட்டமிட்டு, மாதாந்திர பட்ஜெட்டை கவனிக்கவும்.`;
    }
  } else if (language === 'hi') {
    if (profileId === 'farmer') {
      conciseSummary = overallScore >= 50 
        ? `किसानों के लिए जरूरी सूचना: मौसम में बदलाव और खाद/डीजल की कीमतों पर असर संभव है।`
        : `खेती-किसानी के लिए स्थिति सामान्य है। नियमित कार्य जारी रख सकते हैं।`;
      actionableAdvice = `फसल को सुरक्षित स्थान पर रखें और मौसम की ताजा जानकारी लेते रहें।`;
    } else if (profileId === 'student') {
      conciseSummary = overallScore >= 50 
        ? `छात्रों के लिए सूचना: आवागमन और डिजिटल सेवाओं में थोड़ा असर दिख सकता है।`
        : `पढ़ाई और कॉलेज यात्रा के लिए स्थिति बिल्कुल सामान्य है।`;
      actionableAdvice = `परीक्षाओं के लिए समय से निकलें और जरूरी नोट्स का बैकअप रखें।`;
    } else if (profileId === 'business') {
      conciseSummary = overallScore >= 50 
        ? `व्यापार और सप्लाई चेन में थोड़ी देरी या लागत वृद्धि की संभावना है।`
        : `व्यापारिक माहौल और बाजार स्थिर हैं।`;
      actionableAdvice = `सप्लाई की अग्रिम योजना बनाएं और वैकल्पिक रास्तों पर विचार करें।`;
    } else {
      conciseSummary = overallScore >= 50 
        ? `दैनिक खर्च और यात्रा पर थोड़ा असर पड़ सकता है।`
        : `आपकी दिनचर्या पर कोई सीधा असर नहीं है। स्थिति सामान्य है।`;
      actionableAdvice = `दैनिक यात्रा के लिए अतिरिक्त समय रखें और बजट संतुलित रखें।`;
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
    profile: IMPACT_PROFILES.find(p => p.id === profileId) || IMPACT_PROFILES[0],
    speechText: `${IMPACT_PROFILES.find(p => p.id === profileId)?.label || 'Personal'} Impact Assessment: ${levelBadge}. Overall score is ${overallScore} out of 100. Primary driving area is ${primaryVector.name}. ${conciseSummary} Actionable guidance: ${actionableAdvice}`
  };
}

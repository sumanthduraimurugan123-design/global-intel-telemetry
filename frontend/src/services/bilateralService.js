/**
 * Bilateral Strategic Intelligence Lens Service (UGI)
 * Provides defense alliances, trade interdependence, nuclear & military index,
 * active flashpoints, and strategic dynamic assessments for any two sovereign nations.
 */

export const BILATERAL_CURATED_PAIRS = {
  'india-china': {
    status: 'ACTIVE_STANDOFF',
    frictionScore: 82,
    threatLevel: 'HIGH',
    relationshipType: 'Strategic Competition & Border Disputed',
    headline: 'High-Altitude Border Standoff & Semiconductor Manufacturing Rivalry',
    flashpoints: [
      'Line of Actual Control (LAC) in Eastern Ladakh & Arunachal Pradesh',
      'Maritime Indian Ocean Region (IOR) surveillance & naval dual-use ports',
      'Massive bilateral trade deficit with Indian curbs on Chinese tech apps'
    ],
    alliances: {
      countryA: ['Quad (with US, Japan, Australia)', 'BRICS', 'SCO', 'G20'],
      countryB: ['BRICS', 'SCO', 'G20', 'Strategic Partnership with Russia'],
      sharedOrganizations: ['BRICS', 'SCO', 'G20', 'Asian Infrastructure Investment Bank (AIIB)']
    },
    militaryIndex: {
      activePersonnelA: '1,450,000',
      activePersonnelB: '2,035,000',
      nuclearStatusA: 'Estimated 170 Warheads (No-First-Use)',
      nuclearStatusB: 'Estimated 500 Warheads (Rapid Modernization)',
      defenseBudgetA: '$75.0 Billion',
      defenseBudgetB: '$230.0 Billion'
    },
    tradeInterdependence: {
      volumeUSD: '$136.2 Billion / year',
      dependencyA: 'Critical dependencies on Chinese APIs (pharma), solar cells, electronics',
      dependencyB: 'Imports Indian iron ore, refined petroleum, and agricultural commodities',
      supplyChokePoints: 'Malacca Strait passage & Himalayan trans-border river watersheds'
    },
    strategicAssessment: 'While both nations maintain dialogue through diplomatic and Corps Commander channels, structural geopolitical competition across the Indo-Pacific and Himalayas keeps military readiness high.'
  },
  'us-china': {
    status: 'SUPERPOWER_CONTEST',
    frictionScore: 88,
    threatLevel: 'CRITICAL',
    relationshipType: 'Global Hegemonic & Technological Standoff',
    headline: 'Semiconductor Export Controls, Taiwan Strait Deterrence & AI Hegemony',
    flashpoints: [
      'Taiwan Strait independence status and military encirclement exercises',
      'Advanced semiconductor fab equipment export restrictions (Chips Act)',
      'South China Sea freedom-of-navigation operations (FONOPs) vs Island militarization'
    ],
    alliances: {
      countryA: ['NATO', 'AUKUS', 'Quad', 'Five Eyes (FVEY)', 'G7'],
      countryB: ['BRICS', 'SCO', 'China-Russia "No-Limits" Strategic Partnership'],
      sharedOrganizations: ['UN Security Council (P5)', 'G20', 'APEC', 'WTO']
    },
    militaryIndex: {
      activePersonnelA: '1,328,000',
      activePersonnelB: '2,035,000',
      nuclearStatusA: 'Estimated 5,244 Warheads (Global Triad)',
      nuclearStatusB: 'Estimated 500 Warheads (Expanding Silos)',
      defenseBudgetA: '$842.0 Billion',
      defenseBudgetB: '$230.0 Billion'
    },
    tradeInterdependence: {
      volumeUSD: '$575.0 Billion / year',
      dependencyA: 'Consumer electronics, critical rare-earth metals (neodymium, dysprosium), solar panels',
      dependencyB: 'US agricultural exports (soybeans), commercial aviation (Boeing), capital markets',
      supplyChokePoints: 'Taiwan Strait, Malacca Strait, and Pacific deep-sea subsea cables'
    },
    strategicAssessment: 'The defining bilateral rivalry of the 21st century. Economic decoupling in high-tech sectors coincides with strategic competition across artificial intelligence, quantum computing, and naval deterrence.'
  },
  'us-russia': {
    status: 'PROXY_CONFRONTATION',
    frictionScore: 94,
    threatLevel: 'CRITICAL',
    relationshipType: 'Adversarial Nuclear Powers in Active Proxy War',
    headline: 'NATO Defense Posture, Strategic Nuclear Treaties Suspended & Comprehensive Sanctions',
    flashpoints: [
      'Direct US military aid and satellite intelligence coordination with Ukraine',
      'Suspension of New START nuclear inspections and tactical nuclear exercises',
      'Nord Stream pipeline disruption and Arctic maritime militarization'
    ],
    alliances: {
      countryA: ['NATO (32 Member Nations)', 'G7', 'Five Eyes', 'NORAD'],
      countryB: ['CSTO (Collective Security Treaty Org)', 'BRICS', 'SCO', 'Union State'],
      sharedOrganizations: ['UN Security Council (P5)', 'OSCE', 'Arctic Council']
    },
    militaryIndex: {
      activePersonnelA: '1,328,000',
      activePersonnelB: '1,320,000',
      nuclearStatusA: '5,244 Nuclear Warheads',
      nuclearStatusB: '5,580 Nuclear Warheads',
      defenseBudgetA: '$842.0 Billion',
      defenseBudgetB: '$109.0 Billion ( wartime budget )'
    },
    tradeInterdependence: {
      volumeUSD: '< $5.0 Billion / year (Pre-war: $36B)',
      dependencyA: 'Minimal (historic imports of titanium and enriched uranium fuel)',
      dependencyB: 'Virtually severed due to OFAC sanctions, SWIFT exclusion, and export embargoes',
      supplyChokePoints: 'Bering Strait, Baltic Sea outlets, and Turkish Bosporus/Dardanelles'
    },
    strategicAssessment: 'Bilateral relations have reached their lowest ebb since the 1962 Cuban Missile Crisis. Conventional conflict in Eastern Europe and reciprocal cyber telemetry probe operations risk unintentional escalation.'
  },
  'russia-ukraine': {
    status: 'ACTIVE_ARMED_CONFLICT',
    frictionScore: 99,
    threatLevel: 'CRITICAL',
    relationshipType: 'Direct Interstate High-Intensity Warfare',
    headline: 'High-Attrition Land Warfare, Black Sea Maritime Drone Warfare & Deep Drone Strikes',
    flashpoints: [
      '1,000-km active frontline stretching across Donbas, Zaporizhzhia, and Kherson',
      'Cross-border long-range drone strikes targeting energy refineries and airbases',
      'Zaporizhzhia Nuclear Power Plant safety integrity under military occupation'
    ],
    alliances: {
      countryA: ['CSTO', 'BRICS', 'SCO', 'Military partnerships with Iran & North Korea'],
      countryB: ['EU Candidate Member', 'Backed by NATO Ukraine Defense Contact Group (Ramstein)'],
      sharedOrganizations: ['UN General Assembly']
    },
    militaryIndex: {
      activePersonnelA: '1,320,000',
      activePersonnelB: '850,000 (Mobilized armed forces)',
      nuclearStatusA: '5,580 Strategic & Tactical Warheads',
      nuclearStatusB: 'Non-Nuclear (Relinquished 1994 Budapest Memorandum)',
      defenseBudgetA: '$109.0 Billion',
      defenseBudgetB: '$43.0 Billion (Plus $100B+ Western security assistance)'
    },
    tradeInterdependence: {
      volumeUSD: '0 (Trade embargo & severed border infrastructure)',
      dependencyA: 'Severed transit of natural gas to Europe through Druzhba lines',
      dependencyB: 'Total maritime corridor disruption; agricultural exports depend on coastal corridor',
      supplyChokePoints: 'Kerch Strait, Black Sea ports of Odesa, and Dnieper river hydro-electric dams'
    },
    strategicAssessment: 'The largest conventional conflict on the European continent since 1945, fundamentally redrawing global security doctrines, European defense budgets, and energy supply chains.'
  },
  'israel-iran': {
    status: 'DIRECT_ESCALATION',
    frictionScore: 96,
    threatLevel: 'CRITICAL',
    relationshipType: 'Regional Hegemonic War & Asymmetric Missile Exchange',
    headline: 'Direct Ballistic Missile Exchanges & Regional Multi-Front Proxy Conflict',
    flashpoints: [
      'Direct ballistic missile and drone salvos over Israeli airspace and retaliatory air strikes',
      'Iranian uranium enrichment reaching near weapons-grade 60% purity levels',
      'Hezbollah, Houthi Red Sea blockade, and Syrian weapons transfer routes'
    ],
    alliances: {
      countryA: ['Major Non-NATO Ally (US)', 'Abraham Accords Partnerships', 'Centcom Integration'],
      countryB: ['"Axis of Resistance" Network', 'SCO Member', 'BRICS Member', 'Strategic Ties with Moscow'],
      sharedOrganizations: ['UN General Assembly']
    },
    militaryIndex: {
      activePersonnelA: '169,500 (+ 465,000 reservists)',
      activePersonnelB: '610,000 (+ IRGC Quds Force)',
      nuclearStatusA: 'Undeclared nuclear capability (~90 plutonium warheads)',
      nuclearStatusB: 'Threshold nuclear capability (No weaponized warheads deployed)',
      defenseBudgetA: '$24.4 Billion',
      defenseBudgetB: '$10.2 Billion'
    },
    tradeInterdependence: {
      volumeUSD: '0 (Zero direct diplomatic or economic relations)',
      dependencyA: 'Zero economic exchange',
      dependencyB: 'Zero economic exchange',
      supplyChokePoints: 'Bab-el-Mandeb Strait (Red Sea transit) & Strait of Hormuz'
    },
    strategicAssessment: 'The proxy war has transformed into open, direct state-on-state strikes with hypersonic missiles, advanced air defense batteries (Arrow 3, David’s Sling), and global maritime shipping blockades.'
  },
  'taiwan-china': {
    status: 'INVASION_THREAT',
    frictionScore: 91,
    threatLevel: 'CRITICAL',
    relationshipType: 'Sovereignty Dispute & Semiconductor Flashpoint',
    headline: 'Cross-Strait Air Defense Incursions & Semiconductor Silicon Shield',
    flashpoints: [
      'PLA joint combat patrols crossing the median line of the Taiwan Strait',
      'TSMC fabrication facilities producing 90% of global leading-edge chips (3nm & 2nm)',
      'Potential naval blockade scenarios cutting off Taiwanese LNG imports'
    ],
    alliances: {
      countryA: ['US Taiwan Relations Act & Six Assurances', 'Unofficial security partners (Japan, Australia)'],
      countryB: ['UN Recognized "One China" Stance', 'SCO', 'BRICS'],
      sharedOrganizations: ['WTO', 'APEC', 'Olympic Committee']
    },
    militaryIndex: {
      activePersonnelA: '169,000 (+ 1.6M reservists)',
      activePersonnelB: '2,035,000 (Eastern Theater Command focused on Taiwan)',
      nuclearStatusA: 'Non-Nuclear',
      nuclearStatusB: '500 Nuclear Warheads',
      defenseBudgetA: '$19.0 Billion',
      defenseBudgetB: '$230.0 Billion'
    },
    tradeInterdependence: {
      volumeUSD: '$205.0 Billion / year',
      dependencyA: 'Exports integrated circuits and electronics to mainland assembly factories',
      dependencyB: 'Imports raw materials, intermediate electronics, and consumer hardware',
      supplyChokePoints: 'Taiwan Strait (50% of global container ship transits)'
    },
    strategicAssessment: 'A flashpoint carrying immediate systemic economic danger. An operational blockade or assault on Taiwan would instantly freeze global automotive, tech, and defense supply chains.'
  },
  'india-pakistan': {
    status: 'COLD_PEACE_NUCLEAR',
    frictionScore: 78,
    threatLevel: 'ELEVATED',
    relationshipType: 'Nuclear-Armed Historical Rivals Across Line of Control',
    headline: 'Line of Control Ceasefire, Indus Basin Water Management & Cross-Border Terrorism',
    flashpoints: [
      'Line of Control (LoC) in Jammu & Kashmir and Siachen Glacier',
      'Indus Waters Treaty renegotiation and hydrologic dam construction',
      'Cross-border militant infiltration and air defense alert status'
    ],
    alliances: {
      countryA: ['Quad', 'BRICS', 'SCO', 'G20', 'Strategic US/French defense ties'],
      countryB: ['Major Non-NATO Ally (US - historic)', 'CPEC Strategic Partner (China)', 'OIC Member', 'SCO'],
      sharedOrganizations: ['SAARC', 'SCO', 'UN General Assembly', 'Commonwealth']
    },
    militaryIndex: {
      activePersonnelA: '1,450,000',
      activePersonnelB: '654,000',
      nuclearStatusA: 'Estimated 170 Warheads',
      nuclearStatusB: 'Estimated 170 Warheads (Tactical battlefield warheads)',
      defenseBudgetA: '$75.0 Billion',
      defenseBudgetB: '$8.5 Billion'
    },
    tradeInterdependence: {
      volumeUSD: '< $1.5 Billion / year (Suspended direct bilateral commerce)',
      dependencyA: 'Negligible direct exposure',
      dependencyB: 'Severe shortage of Indian agricultural and pharmaceutical imports',
      supplyChokePoints: 'Wagah-Attari land border crossing and Sir Creek maritime boundary'
    },
    strategicAssessment: 'Despite regular diplomatic standoff and suspended cricket and trade ties, a 2021 Line of Control ceasefire has reduced kinetic artillery duels, though nuclear threshold vigilance remains continuous.'
  },
  'us-india': {
    status: 'STRATEGIC_PARTNERSHIP',
    frictionScore: 22,
    threatLevel: 'LOW',
    relationshipType: 'Indo-Pacific Comprehensive Global Strategic Partnership',
    headline: 'Initiative on Critical and Emerging Technologies (iCET) & Maritime Quad Defense',
    flashpoints: [
      'Diverging foreign policy postures on Russian oil imports and Ukraine diplomacy',
      'US H-1B visa and skilled tech immigration bottlenecks',
      'Trade tariff negotiations on agricultural and dairy market access'
    ],
    alliances: {
      countryA: ['NATO', 'AUKUS', 'Five Eyes', 'Quad', 'G7'],
      countryB: ['Quad', 'BRICS', 'SCO', 'G20'],
      sharedOrganizations: ['Quad', 'G20', 'I2U2 (India, Israel, US, UAE)', 'IPEF']
    },
    militaryIndex: {
      activePersonnelA: '1,328,000',
      activePersonnelB: '1,450,000',
      nuclearStatusA: '5,244 Warheads',
      nuclearStatusB: '170 Warheads',
      defenseBudgetA: '$842.0 Billion',
      defenseBudgetB: '$75.0 Billion'
    },
    tradeInterdependence: {
      volumeUSD: '$128.8 Billion / year (US is India’s largest trading partner)',
      dependencyA: 'Software services, generic pharmaceuticals, diamond/jewelry, and textiles',
      dependencyB: 'Defense technology (GE F414 jet engines, MQ-9B Predator drones), aircraft, crude oil',
      supplyChokePoints: 'Indian Ocean maritime security and transatlantic data cables'
    },
    strategicAssessment: 'One of the fastest-growing geopolitical alignments in the world. Shared concerns over Indo-Pacific maritime balance have propelled unprecedented intelligence sharing, military interoperability, and joint semiconductor fab investments.'
  }
};

/**
 * Computes or retrieves bilateral intelligence between any two countries
 */
export function getBilateralIntelligence(countryAId, countryBId) {
  const cA = (countryAId || '').toLowerCase().trim();
  const cB = (countryBId || '').toLowerCase().trim();

  // Try direct key or reversed key
  const directKey = `${cA}-${cB}`;
  const reverseKey = `${cB}-${cA}`;

  if (BILATERAL_CURATED_PAIRS[directKey]) {
    return {
      isCurated: true,
      key: directKey,
      ...BILATERAL_CURATED_PAIRS[directKey]
    };
  }

  if (BILATERAL_CURATED_PAIRS[reverseKey]) {
    return {
      isCurated: true,
      key: reverseKey,
      ...BILATERAL_CURATED_PAIRS[reverseKey]
    };
  }

  // Fallback: Dynamic rule-based synthesis for any pair in the world
  const nameA = cA.charAt(0).toUpperCase() + cA.slice(1);
  const nameB = cB.charAt(0).toUpperCase() + cB.slice(1);

  return {
    isCurated: false,
    status: 'DIPLOMATIC_RELATIONS',
    frictionScore: 45,
    threatLevel: 'MODERATE',
    relationshipType: `Bilateral Diplomatic & Economic Channel (${nameA} — ${nameB})`,
    headline: `Multilateral Trade, Energy Agreements & International Forum Coordination`,
    flashpoints: [
      `Trade tariff negotiations and market access standards`,
      `Diplomatic coordination within United Nations and regional bodies`,
      `Climate mitigation treaties and renewable energy technology transfers`
    ],
    alliances: {
      countryA: ['United Nations Member', 'International Monetary Fund (IMF)'],
      countryB: ['United Nations Member', 'World Trade Organization (WTO)'],
      sharedOrganizations: ['United Nations', 'World Bank', 'WHO', 'INTERPOL']
    },
    militaryIndex: {
      activePersonnelA: 'Standing Defense Forces',
      activePersonnelB: 'Standing Defense Forces',
      nuclearStatusA: 'Sovereign Defense Doctrine',
      nuclearStatusB: 'Sovereign Defense Doctrine',
      defenseBudgetA: 'Active National Allocation',
      defenseBudgetB: 'Active National Allocation'
    },
    tradeInterdependence: {
      volumeUSD: 'Bilateral commercial exchange active across consumer goods, agricultural products, and services.',
      dependencyA: 'Import of finished industrial goods, raw agricultural commodities, or energy.',
      dependencyB: 'Export of services, manufacturing components, and consumer wares.',
      supplyChokePoints: 'Global commercial aviation corridors and standard international container lanes.'
    },
    strategicAssessment: `${nameA} and ${nameB} maintain formal diplomatic ties under international law, cooperating through multilateral institutions to resolve trade disputes and environmental challenges.`
  };
}

import { fetchLiveNews } from './newsService.js';

/**
 * Event Detection from News Item via Keyword Matching
 */
export function detectEvent(news) {
  const text = `${news.title || ''} ${news.description || ''}`.toLowerCase();
  
  const keywords = {
    fuel: ['fuel', 'petrol', 'diesel', 'oil', 'gasoline', 'petroleum', 'crude', 'energy price'],
    inflation: ['inflation', 'price rise', 'cost', 'expensive', 'prices rise', 'cpi', 'interest rate', 'tariff'],
    weather: ['rain', 'storm', 'flood', 'heatwave', 'cyclone', 'monsoon', 'heavy rainfall', 'weather'],
    jobs: ['layoffs', 'hiring', 'unemployment', 'job cuts', 'layoff', 'workforce', 'staff reduction'],
    risk: ['war', 'conflict', 'attack', 'military', 'crisis', 'threat', 'strike', 'sanctions', 'bombing']
  };

  let matchedCategory = null;
  let maxMatches = 0;
  let matchedKeywords = [];

  for (const [cat, words] of Object.entries(keywords)) {
    const matches = words.filter(word => text.includes(word));
    if (matches.length > maxMatches) {
      maxMatches = matches.length;
      matchedCategory = cat;
      matchedKeywords = matches;
    }
  }

  return {
    category: matchedCategory,
    keywordsMatched: matchedKeywords
  };
}

/**
 * Trend Detection based on recent event patterns
 */
export function detectTrend(category, articles) {
  if (!category || !articles || articles.length === 0) return 'stable';

  let matchCount = 0;
  for (const article of articles) {
    const { category: cat } = detectEvent(article);
    if (cat === category) {
      matchCount++;
    }
  }

  if (matchCount >= 3 || (articles.length > 0 && matchCount / articles.length >= 0.2)) {
    return 'increasing';
  } else if (matchCount >= 1) {
    return 'stable';
  }
  return 'decreasing';
}

/**
 * Rule-Based Prediction Engine Core
 */
export function generatePrediction(category, trend) {
  if (category === 'fuel' && trend === 'increasing') {
    return {
      impact: 'Transport costs may increase',
      timeframe: '7–14 days'
    };
  }

  if (category === 'fuel') {
    return {
      impact: 'Fuel and transportation expenses may fluctuate',
      timeframe: '7–14 days'
    };
  }

  if (category === 'inflation') {
    return {
      impact: 'Cost of living may rise',
      timeframe: '10–20 days'
    };
  }

  if (category === 'weather') {
    return {
      impact: 'Heavy rain may affect daily life',
      timeframe: '1–5 days'
    };
  }

  if (category === 'jobs') {
    return {
      impact: 'Job opportunities may decrease',
      timeframe: '15–30 days'
    };
  }

  if (category === 'risk') {
    return {
      impact: 'Regional security & market volatility expected',
      timeframe: '3–10 days'
    };
  }

  return null;
}

/**
 * Persona Customization Layer
 */
export function customizeImpactByPersona(baseImpact, category, persona = 'Common Person') {
  const normPersona = (persona || '').toLowerCase();

  if (normPersona.includes('student')) {
    if (category === 'fuel') return 'Bus fares may increase';
    if (category === 'inflation') return 'Tuition, canteen, and stationery prices may rise';
    if (category === 'weather') return 'College schedules and daily campus commute may be disrupted';
    if (category === 'jobs') return 'Campus placements and entry-level hiring may slow down';
    if (category === 'risk') return 'Travel advisories and student safety alerts active';
  }

  if (normPersona.includes('farmer') || normPersona.includes('kisan')) {
    if (category === 'fuel') return 'Transport cost for crops may increase';
    if (category === 'inflation') return 'Fertilizer, seed, and machinery costs may rise';
    if (category === 'weather') return 'Crop harvest, soil drainage, and field work may be impacted';
    if (category === 'jobs') return 'Agricultural seasonal labor availability may fluctuate';
    if (category === 'risk') return 'Mandi transport routes and supply chains may face delays';
  }

  if (normPersona.includes('professional') || normPersona.includes('business') || normPersona.includes('trade')) {
    if (category === 'fuel') return 'Daily commute cost may increase';
    if (category === 'inflation') return 'Corporate operating budgets and living expenses may rise';
    if (category === 'weather') return 'Workplace commute and outdoor logistics may be disrupted';
    if (category === 'jobs') return 'Corporate hiring freezes and industry restructuring risks may increase';
    if (category === 'risk') return 'Business continuity plans and supply chain mitigations required';
  }

  // Common Person / Default fallback
  if (category === 'fuel') return 'Daily expenses may increase';
  if (category === 'inflation') return 'Daily cost of groceries and essential goods may rise';
  if (category === 'weather') return 'Heavy rain and local outdoor travel may be affected';
  if (category === 'jobs') return 'Local job market and income stability may decrease';
  if (category === 'risk') return 'General consumer prices and security alerts may rise';

  return baseImpact;
}

const CATEGORY_EVENT_TITLES = {
  fuel: 'Fuel & Transportation Surge',
  inflation: 'Economic Inflation & Living Cost Shift',
  weather: 'Extreme Weather & Climate Event',
  jobs: 'Job Market & Workforce Contraction',
  risk: 'Geopolitical & Security Escalation'
};

/**
 * Main Controller Function for Future Impact Simulation
 */
export async function getFutureImpactSimulation(location = 'global', persona = 'Common Person') {
  // 1. Fetch Real News (Mandatory: Uses real RSS feeds / APIs via newsService)
  const realArticles = await fetchLiveNews(location, 'all');

  if (!realArticles || realArticles.length === 0) {
    return {
      location,
      persona,
      totalArticlesAnalyzed: 0,
      predictions: []
    };
  }

  // 2. Group articles by detected category
  const categorizedMap = new Map();

  for (const article of realArticles) {
    const { category, keywordsMatched } = detectEvent(article);
    if (category) {
      if (!categorizedMap.has(category)) {
        categorizedMap.set(category, []);
      }
      categorizedMap.get(category).push({
        article,
        keywordsMatched
      });
    }
  }

  const predictions = [];
  const seenCategories = new Set();

  // 3 & 4 & 5. For each category detected in real news, detect trend & generate personalized prediction
  for (const [category, itemGroup] of categorizedMap.entries()) {
    if (seenCategories.has(category)) continue;
    seenCategories.add(category);

    const trend = detectTrend(category, realArticles);
    const basePrediction = generatePrediction(category, trend);

    if (basePrediction) {
      const customizedImpact = customizeImpactByPersona(basePrediction.impact, category, persona);
      const topArticle = itemGroup[0].article;

      predictions.push({
        event: CATEGORY_EVENT_TITLES[category] || `${category.toUpperCase()} Event`,
        category,
        trend,
        impact: customizedImpact,
        timeframe: basePrediction.timeframe,
        source: topArticle.url,
        articleTitle: topArticle.title,
        publishedAt: topArticle.created_at || topArticle.publishedAt || new Date().toISOString()
      });
    }
  }

  return {
    location,
    persona,
    totalArticlesAnalyzed: realArticles.length,
    predictions
  };
}

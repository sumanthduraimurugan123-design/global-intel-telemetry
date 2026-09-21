import express from 'express';
import { fetchLiveNews, fetchWorldwideNewsCategorized, getLastSyncTimestamp, COUNTRY_LEXICON } from '../services/newsService.js';
import { getFullGeoDirectory, resolveGeoHierarchy } from '../services/geoHierarchy.js';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient.js';
import { explainNews, generatePersonalizedOpinion } from '../services/newsExplainer.js';

const router = express.Router();

/**
 * GET /api/news/geo-hierarchy
 * Returns directory of all supported countries, states, and searchable cities
 */
router.get('/geo-hierarchy', (req, res) => {
  try {
    const directory = getFullGeoDirectory();
    res.json({
      success: true,
      ...directory
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve geo directory', details: error.message });
  }
});

/**
 * GET /api/news/by-country
 * Returns dispatches categorized and grouped by sovereign nations
 */
router.get('/by-country', async (req, res) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  try {
    const data = await fetchWorldwideNewsCategorized();
    res.json(data);
  } catch (error) {
    console.error('❌ [News By-Country Error]:', error);
    res.status(500).json({ error: 'Failed to retrieve categorized news', details: error.message });
  }
});

/**
 * GET /api/news/countries-list
 * Returns the lexicon of supported countries with their flags and regions
 */
router.get('/countries-list', (req, res) => {
  const directory = getFullGeoDirectory();
  res.json({
    count: directory.countries.length,
    countries: directory.countries
  });
});

/**
 * POST /api/news/explain
 * Returns a smart plain-language explanation and everyday impact in English, Hindi, Tamil, etc.
 */
router.post('/explain', (req, res) => {
  try {
    const { title, description, language } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }
    const explanation = explainNews(title, description, language || 'en');
    res.json({
      success: true,
      title,
      ...explanation
    });
  } catch (err) {
    console.error('❌ [News Explain Error]:', err);
    res.status(500).json({ error: 'Failed to generate explanation', details: err.message });
  }
});

/**
 * POST /api/news/opinion
 * Returns personalized AI-based opinion tailored to persona (Analyst vs Casual user vs Accessibility mode)
 */
router.post('/opinion', (req, res) => {
  try {
    const { title, description, persona, language } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }
    const opinionData = generatePersonalizedOpinion(title, description, persona || 'Casual user', language || 'en');
    res.json({
      success: true,
      title,
      ...opinionData
    });
  } catch (err) {
    console.error('❌ [News Opinion Error]:', err);
    res.status(500).json({ error: 'Failed to generate personalized opinion', details: err.message });
  }
});

/**
 * GET /api/news/opinion
 */
router.get('/opinion', (req, res) => {
  try {
    const { title, description, persona, language } = req.query;
    if (!title) {
      return res.status(400).json({ error: 'title is required' });
    }
    const opinionData = generatePersonalizedOpinion(title, description, persona || 'Casual user', language || 'en');
    res.json({
      success: true,
      title,
      ...opinionData
    });
  } catch (err) {
    console.error('❌ [News Opinion Error]:', err);
    res.status(500).json({ error: 'Failed to generate personalized opinion', details: err.message });
  }
});

/**
 * GET /api/news
 * Query parameters: country, state, city, location, topic, language, refresh
 */
router.get('/', async (req, res) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  try {
    const location = req.query.location ? req.query.location.toLowerCase().trim() : null;
    const state = req.query.state ? req.query.state.toLowerCase().trim() : null;
    const city = req.query.city ? req.query.city.toLowerCase().trim() : null;
    const country = (req.query.country || 'global').toLowerCase().trim();
    const language = (req.query.language || 'en').toLowerCase();
    const topic = req.query.topic || 'all';
    const forceRefresh = req.query.refresh === 'true';

    // Fetch live from authentic feeds with hierarchical resolution & smart fallback
    const liveArticles = await fetchLiveNews(country, topic, location, language, state, city);

    // Resolve hierarchical context for metadata reporting
    const geoInfo = resolveGeoHierarchy(city || location || state || country, country);

    // Check if any articles carry fallback metadata
    const fallbackArticle = liveArticles.find(a => a.fallbackMeta);
    const fallbackDetails = fallbackArticle ? fallbackArticle.fallbackMeta : null;

    return res.json({
      source: 'live_authenticated_multisource_feeds',
      count: liveArticles.length,
      country,
      state,
      city,
      location,
      geoInfo,
      fallbackDetails,
      topic,
      language,
      lastUpdated: getLastSyncTimestamp(),
      news: liveArticles
    });
  } catch (error) {
    console.error('❌ [News Route Error]:', error);
    res.status(500).json({ error: 'Failed to retrieve news stream', details: error.message });
  }
});

/**
 * POST /api/news/refresh
 * Force instant refresh and ingestion
 */
router.post('/refresh', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  try {
    const country = req.body.country || 'global';
    const topic = req.body.topic || 'all';
    const location = req.body.location || null;
    const state = req.body.state || null;
    const city = req.body.city || null;
    const language = req.body.language || 'en';
    const freshData = await fetchLiveNews(country, topic, location, language, state, city);
    res.json({
      success: true,
      refreshedAt: new Date().toISOString(),
      count: freshData.length,
      news: freshData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

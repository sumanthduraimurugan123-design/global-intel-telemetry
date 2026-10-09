import express from 'express';
import { searchPlaces, geocodeLocation, getHierarchyStructure, CATEGORIES } from '../services/explorerService.js';

const router = express.Router();

/**
 * GET /api/explorer/search
 * Natural language or coordinate-based place search
 * e.g. /api/explorer/search?q=Hospitals in Chennai
 * e.g. /api/explorer/search?q=Schools near me&lat=12.9759&lng=80.2212
 */
router.get('/search', async (req, res) => {
  try {
    const { q = '', category, lat, lng, radius, limit } = req.query;
    const data = await searchPlaces({
      q,
      category,
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
      radius: radius ? parseInt(radius, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined
    });
    res.json(data);
  } catch (error) {
    console.error('❌ [Explorer Search Error]:', error);
    res.status(500).json({
      error: 'Failed to search places',
      details: error.message
    });
  }
});

/**
 * GET /api/explorer/geocode
 * Geocode place name to lat/lng
 */
router.get('/geocode', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter q is required' });
    }
    const location = await geocodeLocation(q);
    if (!location) {
      return res.status(404).json({ error: `Location not found: ${q}` });
    }
    res.json(location);
  } catch (error) {
    console.error('❌ [Explorer Geocode Error]:', error);
    res.status(500).json({
      error: 'Failed to geocode location',
      details: error.message
    });
  }
});

/**
 * GET /api/explorer/hierarchy
 * Returns the 5-level geographic tree:
 * World -> Country -> State/Region -> City -> Neighbourhood
 */
router.get('/hierarchy', (req, res) => {
  try {
    const tree = getHierarchyStructure();
    res.json(tree);
  } catch (error) {
    console.error('❌ [Explorer Hierarchy Error]:', error);
    res.status(500).json({
      error: 'Failed to retrieve geographic hierarchy',
      details: error.message
    });
  }
});

/**
 * GET /api/explorer/categories
 * Returns all supported categories
 */
router.get('/categories', (req, res) => {
  res.json(CATEGORIES);
});

export default router;

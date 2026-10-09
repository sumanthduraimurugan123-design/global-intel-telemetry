/**
 * World Explorer AI - Geographic Search & OpenStreetMap / Overpass Service
 * 
 * Provides:
 * - Natural language query parsing ("Schools near me", "Hospitals in Chennai", "Government offices in Velachery")
 * - Real OpenStreetMap Overpass API queries with failover between public mirrors
 * - Nominatim geocoding & reverse geocoding fallback
 * - Real distance calculation (Haversine formula)
 * - 5-level geographic hierarchy navigation (World -> Country -> State -> City -> Neighbourhood)
 */

import { resolveGeoHierarchy, getFullGeoDirectory, GLOBAL_COUNTRIES, INDIA_STATES, US_STATES, INTL_REGIONS, CHENNAI_MICRO_AREAS } from './geoHierarchy.js';

// In-memory cache for fast repeated queries (10 min TTL)
const searchCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000;

// OpenStreetMap User-Agent header (required by OSM policies)
const OSM_HEADERS = {
  'User-Agent': 'EconoPulse-WorldExplorer/1.0 (telemetry@econopulse.internal; education-research)',
  'Accept': 'application/json'
};

// Mirror endpoints for Overpass API
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter'
];

/**
 * Supported Category Definitions mapped to OpenStreetMap tags
 */
export const CATEGORIES = {
  education: {
    key: 'education',
    label: 'Schools & Colleges',
    icon: 'GraduationCap',
    color: '#3b82f6', // blue
    osmTags: [
      '["amenity"="school"]',
      '["amenity"="college"]',
      '["amenity"="university"]',
      '["amenity"="kindergarten"]'
    ],
    keywords: ['school', 'schools', 'college', 'colleges', 'university', 'campus', 'kindergarten', 'academy', 'education']
  },
  healthcare: {
    key: 'healthcare',
    label: 'Hospitals & Clinics',
    icon: 'HeartPulse',
    color: '#ef4444', // red
    osmTags: [
      '["amenity"="hospital"]',
      '["amenity"="clinic"]',
      '["amenity"="doctors"]',
      '["amenity"="pharmacy"]'
    ],
    keywords: ['hospital', 'hospitals', 'clinic', 'clinics', 'doctor', 'pharmacy', 'medical', 'dispensary', 'healthcare']
  },
  transport: {
    key: 'transport',
    label: 'Bus Stops & Transit',
    icon: 'Bus',
    color: '#f59e0b', // amber
    osmTags: [
      '["highway"="bus_stop"]',
      '["amenity"="bus_station"]',
      '["railway"="station"]',
      '["public_transport"="platform"]',
      '["public_transport"="stop_position"]'
    ],
    keywords: ['bus stop', 'bus stops', 'bus station', 'metro', 'transit', 'train station', 'railway', 'transport']
  },
  shopping: {
    key: 'shopping',
    label: 'Malls & Shops',
    icon: 'ShoppingBag',
    color: '#ec4899', // pink
    osmTags: [
      '["shop"="mall"]',
      '["shop"="supermarket"]',
      '["shop"="department_store"]',
      '["amenity"="marketplace"]',
      '["shop"="convenience"]'
    ],
    keywords: ['mall', 'malls', 'shop', 'shops', 'supermarket', 'market', 'store', 'bazaar', 'shopping']
  },
  government: {
    key: 'government',
    label: 'Government & Public Offices',
    icon: 'Landmark',
    color: '#8b5cf6', // purple
    osmTags: [
      '["office"="government"]',
      '["amenity"="townhall"]',
      '["amenity"="courthouse"]',
      '["amenity"="police"]',
      '["amenity"="post_office"]',
      '["building"="government"]'
    ],
    keywords: ['government', 'government office', 'government buildings', 'office', 'post office', 'police station', 'collectorate', 'taluk', 'corporation', 'court', 'public office']
  },
  leisure: {
    key: 'leisure',
    label: 'Parks & Playgrounds',
    icon: 'Trees',
    color: '#10b981', // green
    osmTags: [
      '["leisure"="park"]',
      '["leisure"="playground"]',
      '["leisure"="garden"]',
      '["leisure"="pitch"]'
    ],
    keywords: ['park', 'parks', 'playground', 'playgrounds', 'garden', 'recreation', 'pitch', 'ground']
  },
  finance: {
    key: 'finance',
    label: 'Banks & ATMs',
    icon: 'CreditCard',
    color: '#06b6d4', // cyan
    osmTags: [
      '["amenity"="bank"]',
      '["amenity"="atm"]'
    ],
    keywords: ['bank', 'banks', 'atm', 'atms', 'finance', 'cash']
  }
};

/**
 * Calculate distance between two lat/lng pairs in meters using Haversine formula
 */
export function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371e3; // metres
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Format meters to human readable string (e.g. "450 m" or "2.3 km")
 */
export function formatDistance(meters) {
  if (meters == null || isNaN(meters)) return '';
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Parse natural language search queries
 * Examples:
 * - "Schools near me"
 * - "Hospitals in Chennai"
 * - "Government offices in Velachery"
 * - "Banks in New York"
 */
export function parseQuery(rawQuery = '', userLocation = null) {
  const q = rawQuery.trim();
  const lower = q.toLowerCase();

  const isNearMe = lower.includes('near me') || lower.includes('nearby') || lower.includes('around me');

  let detectedCategory = null;
  for (const [catKey, catDef] of Object.entries(CATEGORIES)) {
    for (const kw of catDef.keywords) {
      if (lower.includes(kw)) {
        detectedCategory = catKey;
        break;
      }
    }
    if (detectedCategory) break;
  }

  // Extract location string if not "near me"
  let extractedLocation = '';
  if (isNearMe) {
    extractedLocation = 'near me';
  } else {
    // Look for "in [Location]" or "at [Location]"
    const match = lower.match(/(?:in|at|near|around)\s+([a-z0-9\s.,-]+)$/i);
    if (match && match[1]) {
      extractedLocation = match[1].trim();
    } else if (detectedCategory) {
      // Strip out category keywords to find location residue
      let residue = lower;
      for (const catDef of Object.values(CATEGORIES)) {
        for (const kw of catDef.keywords) {
          residue = residue.replace(new RegExp(`\\b${kw}\\b`, 'gi'), '');
        }
      }
      residue = residue.replace(/\b(near|in|at|around|me|the|all|find|show|search)\b/gi, '').trim();
      if (residue.length >= 2) {
        extractedLocation = residue;
      }
    } else {
      extractedLocation = q;
    }
  }

  return {
    rawQuery: q,
    isNearMe,
    category: detectedCategory || 'all',
    extractedLocation: extractedLocation || ''
  };
}

/**
 * Geocode a location using local database or Nominatim
 */
export async function geocodeLocation(locationName) {
  if (!locationName || locationName === 'near me') return null;

  const trimmed = locationName.trim();
  const norm = trimmed.toLowerCase();

  // 1. Check local hierarchy first
  const resolved = resolveGeoHierarchy(norm);
  if (resolved && resolved.level !== 'custom' && resolved.lat && resolved.lng && (resolved.lat !== 20.0 || resolved.lng !== 0.0)) {
    return {
      name: resolved.displayName || trimmed,
      displayName: resolved.displayName || trimmed,
      lat: resolved.lat,
      lng: resolved.lng,
      level: resolved.level,
      city: resolved.city,
      state: resolved.state,
      country: resolved.country,
      source: 'local_hierarchy'
    };
  }

  // 2. Query OpenStreetMap Nominatim
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmed)}&format=json&limit=1&addressdetails=1`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, { headers: OSM_HEADERS, signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        const addr = item.address || {};
        return {
          name: item.name || trimmed,
          displayName: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          level: item.type || 'place',
          city: addr.city || addr.town || addr.suburb || addr.village,
          state: addr.state,
          country: addr.country,
          boundingBox: item.boundingbox,
          source: 'nominatim'
        };
      }
    }
  } catch (err) {
    console.warn(`[Geocode Nominatim Warning]: ${err.message}`);
  }

  return null;
}

/**
 * Build Overpass QL query string
 */
function buildOverpassQL(lat, lng, categoryKey, radiusMeters = 3500, limit = 40) {
  let tagClauses = [];

  if (categoryKey && CATEGORIES[categoryKey]) {
    tagClauses = CATEGORIES[categoryKey].osmTags;
  } else {
    // If "all", combine top tags from each category
    tagClauses = [
      '["amenity"="school"]',
      '["amenity"="hospital"]',
      '["amenity"="clinic"]',
      '["highway"="bus_stop"]',
      '["amenity"="bus_station"]',
      '["shop"="mall"]',
      '["shop"="supermarket"]',
      '["office"="government"]',
      '["amenity"="townhall"]',
      '["leisure"="park"]',
      '["amenity"="bank"]',
      '["amenity"="atm"]'
    ];
  }

  const unions = tagClauses.map(tag => `
    node${tag}(around:${radiusMeters}, ${lat}, ${lng});
    way${tag}(around:${radiusMeters}, ${lat}, ${lng});
  `).join('\n');

  return `
    [out:json][timeout:25];
    (
      ${unions}
    );
    out center ${limit};
  `;
}

/**
 * Categorize an OSM element by inspecting its tags
 */
function identifyElementCategory(tags = {}) {
  if (tags.amenity === 'school' || tags.amenity === 'college' || tags.amenity === 'university' || tags.amenity === 'kindergarten') {
    return 'education';
  }
  if (tags.amenity === 'hospital' || tags.amenity === 'clinic' || tags.amenity === 'doctors' || tags.amenity === 'pharmacy') {
    return 'healthcare';
  }
  if (tags.highway === 'bus_stop' || tags.amenity === 'bus_station' || tags.railway === 'station' || tags.public_transport) {
    return 'transport';
  }
  if (tags.shop || tags.amenity === 'marketplace') {
    return 'shopping';
  }
  if (tags.office === 'government' || tags.amenity === 'townhall' || tags.amenity === 'courthouse' || tags.amenity === 'police' || tags.amenity === 'post_office' || tags.building === 'government') {
    return 'government';
  }
  if (tags.leisure === 'park' || tags.leisure === 'playground' || tags.leisure === 'garden' || tags.leisure === 'pitch') {
    return 'leisure';
  }
  if (tags.amenity === 'bank' || tags.amenity === 'atm') {
    return 'finance';
  }
  return 'general';
}

/**
 * Format structured address from OSM tags
 */
function formatOsmAddress(tags = {}) {
  const parts = [];
  if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
  if (tags['addr:street']) parts.push(tags['addr:street']);
  if (tags['addr:suburb']) parts.push(tags['addr:suburb']);
  if (tags['addr:city']) parts.push(tags['addr:city']);
  if (tags['addr:postcode']) parts.push(tags['addr:postcode']);

  if (parts.length > 0) return parts.join(', ');
  if (tags['addr:full']) return tags['addr:full'];
  return '';
}

/**
 * Query Overpass API with mirror fallback
 */
async function queryOverpassMirrors(ql) {
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          ...OSM_HEADERS
        },
        body: `data=${encodeURIComponent(ql)}`,
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (res.ok) {
        const json = await res.json();
        if (json && Array.isArray(json.elements)) {
          return json.elements;
        }
      }
    } catch (err) {
      console.warn(`[Overpass Mirror ${endpoint} Warning]:`, err.message);
    }
  }
  return null;
}

/**
 * Fallback to Nominatim amenity search if Overpass is down
 */
async function queryNominatimFallback(lat, lng, categoryKey, locationLabel = '') {
  try {
    const cat = CATEGORIES[categoryKey];
    const searchTerm = cat ? cat.keywords[0] : 'hospital';
    const q = locationLabel ? `${searchTerm} in ${locationLabel}` : `${searchTerm}`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=30&addressdetails=1`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(url, { headers: OSM_HEADERS, signal: controller.signal });
    clearTimeout(timeout);

    if (res.ok) {
      const items = await res.json();
      if (Array.isArray(items)) {
        return items.map((item, idx) => {
          const itemLat = parseFloat(item.lat);
          const itemLon = parseFloat(item.lon);
          const dist = calculateDistanceMeters(lat, lng, itemLat, itemLon);
          const addr = item.address || {};

          return {
            id: `nom-${item.osm_id || idx}`,
            name: item.name || item.display_name.split(',')[0],
            category: categoryKey || 'general',
            categoryLabel: cat ? cat.label : 'Place of Interest',
            lat: itemLat,
            lng: itemLon,
            address: item.display_name,
            distanceMeters: dist,
            distanceFormatted: formatDistance(dist),
            details: {
              source: 'OpenStreetMap (Nominatim Fallback)',
              suburb: addr.suburb,
              city: addr.city || addr.town,
              postcode: addr.postcode
            }
          };
        });
      }
    }
  } catch (err) {
    console.warn(`[Nominatim Fallback Error]:`, err.message);
  }
  return [];
}

/**
 * Main Search Function for Places
 * 
 * Handles natural queries or explicit parameters:
 * @param {Object} params
 * @param {string} params.q - Search query string
 * @param {string} params.category - Specific category key (optional)
 * @param {number} params.lat - Latitude (optional)
 * @param {number} params.lng - Longitude (optional)
 * @param {number} params.radius - Search radius in meters (default 4000)
 * @param {number} params.limit - Max items (default 40)
 */
export async function searchPlaces({ q = '', category, lat, lng, radius = 4000, limit = 40 }) {
  const parsed = parseQuery(q);
  const activeCategory = category || parsed.category || 'all';

  let targetLat = lat ? parseFloat(lat) : null;
  let targetLng = lng ? parseFloat(lng) : null;
  let targetLabel = '';
  let geoContext = null;

  // Resolve coordinates
  if (targetLat != null && targetLng != null && !isNaN(targetLat) && !isNaN(targetLng)) {
    targetLabel = parsed.extractedLocation || 'Selected Coordinates';
  } else if (parsed.extractedLocation && parsed.extractedLocation !== 'near me') {
    const geo = await geocodeLocation(parsed.extractedLocation);
    if (geo) {
      targetLat = geo.lat;
      targetLng = geo.lng;
      targetLabel = geo.displayName || geo.name;
      geoContext = geo;
    }
  }

  // If still no coordinates and query was "near me" or empty, default to Chennai / local coordinates
  if (targetLat == null || targetLng == null) {
    // Default fallback to Velachery, Chennai as prime benchmark location
    targetLat = 12.9759;
    targetLng = 80.2212;
    targetLabel = 'Velachery, Chennai (Default Benchmark)';
  }

  // Check cache
  const cacheKey = `${targetLat.toFixed(3)}_${targetLng.toFixed(3)}_${activeCategory}_${radius}_${limit}`;
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // Build and execute Overpass Query
  const overpassQL = buildOverpassQL(targetLat, targetLng, activeCategory, radius, limit);
  const rawElements = await queryOverpassMirrors(overpassQL);

  let results = [];

  if (rawElements && rawElements.length > 0) {
    for (const elem of rawElements) {
      const eLat = elem.lat || (elem.center && elem.center.lat);
      const eLng = elem.lon || (elem.center && elem.center.lon);
      if (!eLat || !eLng) continue;

      const tags = elem.tags || {};
      const catKey = identifyElementCategory(tags);
      const catDef = CATEGORIES[catKey] || CATEGORIES.education;

      // Real place name or fallback to description
      const name = tags.name || tags['name:en'] || tags.operator || tags.brand || `${catDef.label.split('&')[0].trim()} Facility`;
      const dist = calculateDistanceMeters(targetLat, targetLng, eLat, eLng);
      const addr = formatOsmAddress(tags);

      results.push({
        id: `osm-${elem.type}-${elem.id}`,
        name,
        category: catKey,
        categoryLabel: catDef.label,
        lat: eLat,
        lng: eLng,
        address: addr || `${targetLabel}`,
        distanceMeters: dist,
        distanceFormatted: formatDistance(dist),
        tags: {
          amenity: tags.amenity,
          shop: tags.shop,
          office: tags.office,
          leisure: tags.leisure,
          highway: tags.highway,
          opening_hours: tags.opening_hours,
          phone: tags.phone || tags['contact:phone'],
          website: tags.website || tags['contact:website'],
          operator: tags.operator,
          wheelchair: tags.wheelchair
        }
      });
    }

    // Sort by distance
    results.sort((a, b) => (a.distanceMeters || 999999) - (b.distanceMeters || 999999));
  } else {
    // If Overpass returned 0 or timed out, query Nominatim fallback
    results = await queryNominatimFallback(targetLat, targetLng, activeCategory, targetLabel);
  }

  const response = {
    query: q,
    category: activeCategory,
    center: {
      lat: targetLat,
      lng: targetLng,
      label: targetLabel
    },
    geoContext,
    count: results.length,
    results
  };

  // Cache response
  searchCache.set(cacheKey, { timestamp: Date.now(), data: response });

  return response;
}

/**
 * Return 5-level geographic hierarchy tree for drill-down exploration
 * World -> Country -> State/Region -> City -> Neighbourhood
 */
export function getHierarchyStructure() {
  const full = getFullGeoDirectory();

  return {
    world: {
      id: 'world',
      name: 'Planetary Earth',
      lat: 20.0,
      lng: 0.0,
      zoom: 1.5,
      countriesCount: full.countries.length
    },
    countries: full.countries,
    india: {
      country: 'India',
      flag: '🇮🇳',
      lat: 20.5937,
      lng: 78.9629,
      states: full.indiaStates,
      chennaiNeighbourhoods: full.chennaiAreas
    },
    us: {
      country: 'United States',
      flag: '🇺🇸',
      lat: 37.0902,
      lng: -95.7129,
      states: full.usStates
    },
    intlRegions: full.intlRegions
  };
}

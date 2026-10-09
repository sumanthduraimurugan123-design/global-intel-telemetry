/**
 * Frontend Explorer Service - Connects to backend OpenStreetMap / Overpass endpoints
 * with graceful direct fallback to Nominatim & Overpass if backend is offline.
 */

const API_BASE = '/api/explorer';

export const CATEGORY_DEFINITIONS = {
  education: {
    key: 'education',
    label: 'Schools & Colleges',
    icon: 'GraduationCap',
    color: '#3b82f6',
    markerColor: '#3b82f6',
    desc: 'Schools, colleges, universities, and academic campuses'
  },
  healthcare: {
    key: 'healthcare',
    label: 'Hospitals & Clinics',
    icon: 'HeartPulse',
    color: '#ef4444',
    markerColor: '#ef4444',
    desc: 'Hospitals, specialty clinics, pharmacies, and healthcare centers'
  },
  transport: {
    key: 'transport',
    label: 'Bus Stops & Transit',
    icon: 'Bus',
    color: '#f59e0b',
    markerColor: '#f59e0b',
    desc: 'Bus stops, bus stations, metro stations, and transit hubs'
  },
  shopping: {
    key: 'shopping',
    label: 'Malls & Shops',
    icon: 'ShoppingBag',
    color: '#ec4899',
    markerColor: '#ec4899',
    desc: 'Shopping malls, supermarkets, department stores, and markets'
  },
  government: {
    key: 'government',
    label: 'Government & Public Offices',
    icon: 'Landmark',
    color: '#8b5cf6',
    markerColor: '#8b5cf6',
    desc: 'Administrative headquarters, police stations, courts, and post offices'
  },
  leisure: {
    key: 'leisure',
    label: 'Parks & Playgrounds',
    icon: 'Trees',
    color: '#10b981',
    markerColor: '#10b981',
    desc: 'Public parks, recreational gardens, playgrounds, and sports grounds'
  },
  finance: {
    key: 'finance',
    label: 'Banks & ATMs',
    icon: 'CreditCard',
    color: '#06b6d4',
    markerColor: '#06b6d4',
    desc: 'Banks, credit unions, and automated teller machines (ATMs)'
  }
};

/**
 * Request browser location for "Near Me" searches
 */
export async function getUserCoordinates() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
      },
      (err) => {
        reject(err);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  });
}

/**
 * Execute place search via backend proxy
 */
export async function fetchPlaceSearch({ q = '', category = 'all', lat, lng, radius = 4000, limit = 50 }) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (category && category !== 'all') params.set('category', category);
  if (lat != null) params.set('lat', String(lat));
  if (lng != null) params.set('lng', String(lng));
  if (radius) params.set('radius', String(radius));
  if (limit) params.set('limit', String(limit));

  try {
    const res = await fetch(`${API_BASE}/search?${params.toString()}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[Explorer API Warning]: Backend route unreachable, using direct OSM fallback', err.message);
  }

  // Direct OpenStreetMap Fallback if backend route is unavailable
  return await directOsmFallbackSearch({ q, category, lat, lng, radius, limit });
}

/**
 * Direct OSM Fallback if backend server is unreachable
 */
async function directOsmFallbackSearch({ q = '', category = 'all', lat, lng, limit = 30 }) {
  const targetLat = lat || 12.9759;
  const targetLng = lng || 80.2212;
  const catDef = CATEGORY_DEFINITIONS[category] || CATEGORY_DEFINITIONS.education;
  const queryTerm = q || `${catDef.label} in Velachery, Chennai`;

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(queryTerm)}&format=json&limit=${limit}&addressdetails=1`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (res.ok) {
      const data = await res.json();
      const results = (data || []).map((item, idx) => {
        const itemLat = parseFloat(item.lat);
        const itemLng = parseFloat(item.lon);
        const dist = calculateDistance(targetLat, targetLng, itemLat, itemLng);
        return {
          id: `osm-${item.osm_id || idx}`,
          name: item.name || item.display_name.split(',')[0],
          category: category !== 'all' ? category : 'education',
          categoryLabel: catDef.label,
          lat: itemLat,
          lng: itemLng,
          address: item.display_name,
          distanceMeters: dist,
          distanceFormatted: dist < 1000 ? `${dist} m` : `${(dist / 1000).toFixed(1)} km`,
          tags: {
            source: 'OpenStreetMap Nominatim Live'
          }
        };
      });

      return {
        query: q,
        category,
        center: { lat: targetLat, lng: targetLng, label: queryTerm },
        count: results.length,
        results
      };
    }
  } catch (e) {
    console.error('[Direct OSM Fallback Error]:', e);
  }

  return {
    query: q,
    category,
    center: { lat: targetLat, lng: targetLng, label: 'Search Center' },
    count: 0,
    results: []
  };
}

/**
 * Fetch geographic hierarchy tree
 */
export async function fetchHierarchyTree() {
  try {
    const res = await fetch(`${API_BASE}/hierarchy`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[Explorer Hierarchy API Warning]:', err.message);
  }

  // Default fallback tree
  return {
    world: { name: 'Planetary Earth', lat: 20.0, lng: 0.0, zoom: 1.5 },
    countries: [
      { id: 'india', name: 'India', flag: '🇮🇳', lat: 20.5937, lng: 78.9629 },
      { id: 'us', name: 'United States', flag: '🇺🇸', lat: 37.0902, lng: -95.7129 },
      { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', lat: 55.3781, lng: -3.4360 },
      { id: 'germany', name: 'Germany', flag: '🇩🇪', lat: 51.1657, lng: 10.4515 },
      { id: 'japan', name: 'Japan', flag: '🇯🇵', lat: 36.2048, lng: 138.2529 },
      { id: 'australia', name: 'Australia', flag: '🇦🇺', lat: -25.2744, lng: 133.7751 }
    ],
    india: {
      country: 'India',
      flag: '🇮🇳',
      lat: 20.5937,
      lng: 78.9629,
      states: [
        { id: 'tamil nadu', name: 'Tamil Nadu', lat: 11.1271, lng: 78.6569, capital: 'Chennai', cities: ['Chennai', 'Coimbatore', 'Madurai'] },
        { id: 'maharashtra', name: 'Maharashtra', lat: 19.7515, lng: 75.7139, capital: 'Mumbai', cities: ['Mumbai', 'Pune', 'Nagpur'] },
        { id: 'karnataka', name: 'Karnataka', lat: 15.3173, lng: 75.7139, capital: 'Bengaluru', cities: ['Bengaluru', 'Mysuru'] },
        { id: 'delhi', name: 'Delhi NCR', lat: 28.7041, lng: 77.1025, capital: 'New Delhi', cities: ['New Delhi', 'Noida', 'Gurugram'] }
      ],
      chennaiNeighbourhoods: [
        { id: 'velachery', name: 'Velachery', lat: 12.9759, lng: 80.2212 },
        { id: 't nagar', name: 'T. Nagar', lat: 13.0418, lng: 80.2341 },
        { id: 'anna nagar', name: 'Anna Nagar', lat: 13.0850, lng: 80.2101 },
        { id: 'adyar', name: 'Adyar', lat: 13.0012, lng: 80.2565 },
        { id: 'mylapore', name: 'Mylapore', lat: 13.0368, lng: 80.2676 },
        { id: 'guindy', name: 'Guindy', lat: 13.0067, lng: 80.2021 },
        { id: 'omr', name: 'OMR / IT Corridor', lat: 12.9010, lng: 80.2279 }
      ]
    }
  };
}

/**
 * Geocode location name to coordinates
 */
export async function geocodeLocationQuery(q) {
  try {
    const res = await fetch(`${API_BASE}/geocode?q=${encodeURIComponent(q)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('[Geocode API Warning]:', err.message);
  }

  // Direct Nominatim
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&addressdetails=1`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data && data[0]) {
        return {
          name: data[0].name || q,
          displayName: data[0].display_name,
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
    }
  } catch (e) {
    console.error(e);
  }
  return null;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
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

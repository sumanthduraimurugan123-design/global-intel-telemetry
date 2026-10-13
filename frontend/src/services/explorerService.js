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
  const targetLat = lat != null ? lat : 12.9759;
  const targetLng = lng != null ? lng : 80.2212;
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

  // Comprehensive fallback with all global countries
  return {
    world: { name: 'Planetary Earth', lat: 20.0, lng: 0.0, zoom: 1.5 },
    countries: [
      // Asia-Pacific
      { id: 'india', name: 'India', flag: '🇮🇳', lat: 20.5937, lng: 78.9629 },
      { id: 'china', name: 'China', flag: '🇨🇳', lat: 35.8617, lng: 104.1954 },
      { id: 'japan', name: 'Japan', flag: '🇯🇵', lat: 36.2048, lng: 138.2529 },
      { id: 'south korea', name: 'South Korea', flag: '🇰🇷', lat: 35.9078, lng: 127.7669 },
      { id: 'australia', name: 'Australia', flag: '🇦🇺', lat: -25.2744, lng: 133.7751 },
      { id: 'indonesia', name: 'Indonesia', flag: '🇮🇩', lat: -0.7893, lng: 113.9213 },
      { id: 'thailand', name: 'Thailand', flag: '🇹🇭', lat: 15.8700, lng: 100.9925 },
      { id: 'vietnam', name: 'Vietnam', flag: '🇻🇳', lat: 14.0583, lng: 108.2772 },
      { id: 'malaysia', name: 'Malaysia', flag: '🇲🇾', lat: 4.2105, lng: 101.9758 },
      { id: 'singapore', name: 'Singapore', flag: '🇸🇬', lat: 1.3521, lng: 103.8198 },
      { id: 'philippines', name: 'Philippines', flag: '🇵🇭', lat: 12.8797, lng: 121.7740 },
      { id: 'pakistan', name: 'Pakistan', flag: '🇵🇰', lat: 30.3753, lng: 69.3451 },
      { id: 'bangladesh', name: 'Bangladesh', flag: '🇧🇩', lat: 23.6850, lng: 90.3563 },
      { id: 'sri lanka', name: 'Sri Lanka', flag: '🇱🇰', lat: 7.8731, lng: 80.7718 },
      { id: 'new zealand', name: 'New Zealand', flag: '🇳🇿', lat: -40.9006, lng: 174.8860 },
      { id: 'taiwan', name: 'Taiwan', flag: '🇹🇼', lat: 23.6978, lng: 120.9605 },
      { id: 'myanmar', name: 'Myanmar', flag: '🇲🇲', lat: 21.9162, lng: 95.9560 },
      { id: 'cambodia', name: 'Cambodia', flag: '🇰🇭', lat: 12.5657, lng: 104.9910 },
      { id: 'nepal', name: 'Nepal', flag: '🇳🇵', lat: 28.3949, lng: 84.1240 },
      { id: 'bhutan', name: 'Bhutan', flag: '🇧🇹', lat: 27.5142, lng: 90.4336 },
      { id: 'mongolia', name: 'Mongolia', flag: '🇲🇳', lat: 46.8625, lng: 103.8467 },
      { id: 'kazakhstan', name: 'Kazakhstan', flag: '🇰🇿', lat: 48.0196, lng: 66.9237 },
      { id: 'maldives', name: 'Maldives', flag: '🇲🇻', lat: 3.2028, lng: 73.2207 },
      { id: 'brunei', name: 'Brunei', flag: '🇧🇳', lat: 4.5353, lng: 114.7277 },
      { id: 'laos', name: 'Laos', flag: '🇱🇦', lat: 19.8563, lng: 102.4955 },
      { id: 'uzbekistan', name: 'Uzbekistan', flag: '🇺🇿', lat: 41.3775, lng: 64.5853 },
      { id: 'north korea', name: 'North Korea', flag: '🇰🇵', lat: 40.3399, lng: 127.5101 },
      { id: 'afghanistan', name: 'Afghanistan', flag: '🇦🇫', lat: 33.9391, lng: 67.7100 },
      { id: 'papua new guinea', name: 'Papua New Guinea', flag: '🇵🇬', lat: -6.3150, lng: 143.9555 },
      { id: 'fiji', name: 'Fiji', flag: '🇫🇯', lat: -17.7134, lng: 178.0650 },
      { id: 'timor-leste', name: 'Timor-Leste', flag: '🇹🇱', lat: -8.8742, lng: 125.7275 },
      { id: 'solomon islands', name: 'Solomon Islands', flag: '🇸🇧', lat: -9.6457, lng: 160.1562 },
      { id: 'vanuatu', name: 'Vanuatu', flag: '🇻🇺', lat: -15.3767, lng: 166.9592 },
      { id: 'turkmenistan', name: 'Turkmenistan', flag: '🇹🇲', lat: 38.9697, lng: 59.5563 },
      { id: 'kyrgyzstan', name: 'Kyrgyzstan', flag: '🇰🇬', lat: 41.2044, lng: 74.7661 },
      { id: 'tajikistan', name: 'Tajikistan', flag: '🇹🇯', lat: 38.8610, lng: 71.2761 },
      { id: 'samoa', name: 'Samoa', flag: '🇼🇸', lat: -13.7590, lng: -172.1046 },
      { id: 'tonga', name: 'Tonga', flag: '🇹🇴', lat: -21.1789, lng: -175.1982 },
      { id: 'kiribati', name: 'Kiribati', flag: '🇰🇮', lat: -3.3704, lng: -168.7340 },
      { id: 'micronesia', name: 'Micronesia', flag: '🇫🇲', lat: 7.4256, lng: 150.5508 },
      { id: 'palau', name: 'Palau', flag: '🇵🇼', lat: 7.5150, lng: 134.5825 },
      { id: 'marshall islands', name: 'Marshall Islands', flag: '🇲🇭', lat: 7.1315, lng: 171.1845 },
      { id: 'tuvalu', name: 'Tuvalu', flag: '🇹🇻', lat: -7.1095, lng: 177.6493 },
      { id: 'nauru', name: 'Nauru', flag: '🇳🇷', lat: -0.5228, lng: 166.9315 },
      // Americas
      { id: 'us', name: 'United States', flag: '🇺🇸', lat: 37.0902, lng: -95.7129 },
      { id: 'canada', name: 'Canada', flag: '🇨🇦', lat: 56.1304, lng: -106.3468 },
      { id: 'mexico', name: 'Mexico', flag: '🇲🇽', lat: 23.6345, lng: -102.5528 },
      { id: 'brazil', name: 'Brazil', flag: '🇧🇷', lat: -14.2350, lng: -51.9253 },
      { id: 'argentina', name: 'Argentina', flag: '🇦🇷', lat: -38.4161, lng: -63.6167 },
      { id: 'colombia', name: 'Colombia', flag: '🇨🇴', lat: 4.5709, lng: -74.2973 },
      { id: 'chile', name: 'Chile', flag: '🇨🇱', lat: -35.6751, lng: -71.5430 },
      { id: 'peru', name: 'Peru', flag: '🇵🇪', lat: -9.1900, lng: -75.0152 },
      { id: 'venezuela', name: 'Venezuela', flag: '🇻🇪', lat: 6.4238, lng: -66.5897 },
      { id: 'ecuador', name: 'Ecuador', flag: '🇪🇨', lat: -1.8312, lng: -78.1834 },
      { id: 'bolivia', name: 'Bolivia', flag: '🇧🇴', lat: -16.2902, lng: -63.5887 },
      { id: 'paraguay', name: 'Paraguay', flag: '🇵🇾', lat: -23.4425, lng: -58.4438 },
      { id: 'uruguay', name: 'Uruguay', flag: '🇺🇾', lat: -32.5228, lng: -55.7658 },
      { id: 'cuba', name: 'Cuba', flag: '🇨🇺', lat: 21.5218, lng: -77.7812 },
      { id: 'haiti', name: 'Haiti', flag: '🇭🇹', lat: 18.9712, lng: -72.2852 },
      { id: 'dominican republic', name: 'Dominican Republic', flag: '🇩🇴', lat: 18.7357, lng: -70.1627 },
      { id: 'guatemala', name: 'Guatemala', flag: '🇬🇹', lat: 15.7835, lng: -90.2308 },
      { id: 'honduras', name: 'Honduras', flag: '🇭🇳', lat: 15.2000, lng: -86.2419 },
      { id: 'el salvador', name: 'El Salvador', flag: '🇸🇻', lat: 13.7942, lng: -88.8965 },
      { id: 'nicaragua', name: 'Nicaragua', flag: '🇳🇮', lat: 12.8654, lng: -85.2072 },
      { id: 'costa rica', name: 'Costa Rica', flag: '🇨🇷', lat: 9.7489, lng: -83.7534 },
      { id: 'panama', name: 'Panama', flag: '🇵🇦', lat: 8.5380, lng: -80.7821 },
      { id: 'jamaica', name: 'Jamaica', flag: '🇯🇲', lat: 18.1096, lng: -77.2975 },
      { id: 'trinidad and tobago', name: 'Trinidad and Tobago', flag: '🇹🇹', lat: 10.6918, lng: -61.2225 },
      { id: 'bahamas', name: 'Bahamas', flag: '🇧🇸', lat: 25.0343, lng: -77.3963 },
      { id: 'barbados', name: 'Barbados', flag: '🇧🇧', lat: 13.1939, lng: -59.5432 },
      { id: 'belize', name: 'Belize', flag: '🇧🇿', lat: 17.1899, lng: -88.4976 },
      { id: 'guyana', name: 'Guyana', flag: '🇬🇾', lat: 4.8604, lng: -58.9302 },
      { id: 'suriname', name: 'Suriname', flag: '🇸🇷', lat: 3.9193, lng: -56.0278 },
      { id: 'saint lucia', name: 'Saint Lucia', flag: '🇱🇨', lat: 13.9094, lng: -60.9789 },
      { id: 'grenada', name: 'Grenada', flag: '🇬🇩', lat: 12.1165, lng: -61.6790 },
      { id: 'saint vincent', name: 'St. Vincent & Grenadines', flag: '🇻🇨', lat: 12.9843, lng: -61.2872 },
      { id: 'antigua and barbuda', name: 'Antigua and Barbuda', flag: '🇦🇬', lat: 17.0608, lng: -61.7964 },
      { id: 'saint kitts and nevis', name: 'Saint Kitts and Nevis', flag: '🇰🇳', lat: 17.3578, lng: -62.7830 },
      { id: 'dominica', name: 'Dominica', flag: '🇩🇲', lat: 15.4150, lng: -61.3710 },
      // Europe
      { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', lat: 55.3781, lng: -3.4360 },
      { id: 'germany', name: 'Germany', flag: '🇩🇪', lat: 51.1657, lng: 10.4515 },
      { id: 'france', name: 'France', flag: '🇫🇷', lat: 46.2276, lng: 2.2137 },
      { id: 'italy', name: 'Italy', flag: '🇮🇹', lat: 41.8719, lng: 12.5674 },
      { id: 'spain', name: 'Spain', flag: '🇪🇸', lat: 40.4637, lng: -3.7492 },
      { id: 'russia', name: 'Russia', flag: '🇷🇺', lat: 61.5240, lng: 105.3188 },
      { id: 'ukraine', name: 'Ukraine', flag: '🇺🇦', lat: 48.3794, lng: 31.1656 },
      { id: 'poland', name: 'Poland', flag: '🇵🇱', lat: 51.9194, lng: 19.1451 },
      { id: 'netherlands', name: 'Netherlands', flag: '🇳🇱', lat: 52.1326, lng: 5.2913 },
      { id: 'belgium', name: 'Belgium', flag: '🇧🇪', lat: 50.5039, lng: 4.4699 },
      { id: 'sweden', name: 'Sweden', flag: '🇸🇪', lat: 60.1282, lng: 18.6435 },
      { id: 'norway', name: 'Norway', flag: '🇳🇴', lat: 60.4720, lng: 8.4689 },
      { id: 'denmark', name: 'Denmark', flag: '🇩🇰', lat: 56.2639, lng: 9.5018 },
      { id: 'finland', name: 'Finland', flag: '🇫🇮', lat: 61.9241, lng: 25.7482 },
      { id: 'switzerland', name: 'Switzerland', flag: '🇨🇭', lat: 46.8182, lng: 8.2275 },
      { id: 'austria', name: 'Austria', flag: '🇦🇹', lat: 47.5162, lng: 14.5501 },
      { id: 'portugal', name: 'Portugal', flag: '🇵🇹', lat: 39.3999, lng: -8.2245 },
      { id: 'greece', name: 'Greece', flag: '🇬🇷', lat: 39.0742, lng: 21.8243 },
      { id: 'ireland', name: 'Ireland', flag: '🇮🇪', lat: 53.1424, lng: -7.6921 },
      { id: 'czech republic', name: 'Czech Republic', flag: '🇨🇿', lat: 49.8175, lng: 15.4730 },
      { id: 'romania', name: 'Romania', flag: '🇷🇴', lat: 45.9432, lng: 24.9668 },
      { id: 'hungary', name: 'Hungary', flag: '🇭🇺', lat: 47.1625, lng: 19.5033 },
      { id: 'bulgaria', name: 'Bulgaria', flag: '🇧🇬', lat: 42.7339, lng: 25.4858 },
      { id: 'serbia', name: 'Serbia', flag: '🇷🇸', lat: 44.0165, lng: 21.0059 },
      { id: 'croatia', name: 'Croatia', flag: '🇭🇷', lat: 45.1000, lng: 15.2000 },
      { id: 'slovakia', name: 'Slovakia', flag: '🇸🇰', lat: 48.6690, lng: 19.6990 },
      { id: 'estonia', name: 'Estonia', flag: '🇪🇪', lat: 58.5953, lng: 25.0136 },
      { id: 'latvia', name: 'Latvia', flag: '🇱🇻', lat: 56.8796, lng: 24.6032 },
      { id: 'lithuania', name: 'Lithuania', flag: '🇱🇹', lat: 55.1694, lng: 23.8813 },
      { id: 'belarus', name: 'Belarus', flag: '🇧🇾', lat: 53.7098, lng: 27.9534 },
      { id: 'moldova', name: 'Moldova', flag: '🇲🇩', lat: 47.4116, lng: 28.3699 },
      { id: 'albania', name: 'Albania', flag: '🇦🇱', lat: 41.1533, lng: 20.1683 },
      { id: 'north macedonia', name: 'North Macedonia', flag: '🇲🇰', lat: 41.6086, lng: 21.7453 },
      { id: 'bosnia', name: 'Bosnia & Herzegovina', flag: '🇧🇦', lat: 43.9159, lng: 17.6791 },
      { id: 'slovenia', name: 'Slovenia', flag: '🇸🇮', lat: 46.1512, lng: 14.9955 },
      { id: 'cyprus', name: 'Cyprus', flag: '🇨🇾', lat: 35.1264, lng: 33.4299 },
      { id: 'malta', name: 'Malta', flag: '🇲🇹', lat: 35.9375, lng: 14.3754 },
      { id: 'iceland', name: 'Iceland', flag: '🇮🇸', lat: 64.9631, lng: -19.0208 },
      { id: 'luxembourg', name: 'Luxembourg', flag: '🇱🇺', lat: 49.8153, lng: 6.1296 },
      { id: 'montenegro', name: 'Montenegro', flag: '🇲🇪', lat: 42.7087, lng: 19.3744 },
      { id: 'kosovo', name: 'Kosovo', flag: '🇽🇰', lat: 42.6026, lng: 20.9030 },
      { id: 'andorra', name: 'Andorra', flag: '🇦🇩', lat: 42.5063, lng: 1.5218 },
      { id: 'monaco', name: 'Monaco', flag: '🇲🇨', lat: 43.7384, lng: 7.4246 },
      { id: 'liechtenstein', name: 'Liechtenstein', flag: '🇱🇮', lat: 47.1660, lng: 9.5554 },
      { id: 'san marino', name: 'San Marino', flag: '🇸🇲', lat: 43.9424, lng: 12.4578 },
      { id: 'vatican city', name: 'Vatican City', flag: '🇻🇦', lat: 41.9029, lng: 12.4534 },
      // Middle East & North Africa
      { id: 'uae', name: 'United Arab Emirates', flag: '🇦🇪', lat: 23.4241, lng: 53.8478 },
      { id: 'saudi arabia', name: 'Saudi Arabia', flag: '🇸🇦', lat: 23.8859, lng: 45.0792 },
      { id: 'israel', name: 'Israel', flag: '🇮🇱', lat: 31.0461, lng: 34.8516 },
      { id: 'turkey', name: 'Turkey', flag: '🇹🇷', lat: 38.9637, lng: 35.2433 },
      { id: 'iran', name: 'Iran', flag: '🇮🇷', lat: 32.4279, lng: 53.6880 },
      { id: 'egypt', name: 'Egypt', flag: '🇪🇬', lat: 26.8206, lng: 30.8025 },
      { id: 'iraq', name: 'Iraq', flag: '🇮🇶', lat: 33.2232, lng: 43.6793 },
      { id: 'jordan', name: 'Jordan', flag: '🇯🇴', lat: 30.5852, lng: 36.2384 },
      { id: 'kuwait', name: 'Kuwait', flag: '🇰🇼', lat: 29.3117, lng: 47.4818 },
      { id: 'qatar', name: 'Qatar', flag: '🇶🇦', lat: 25.3548, lng: 51.1839 },
      { id: 'bahrain', name: 'Bahrain', flag: '🇧🇭', lat: 26.0667, lng: 50.5577 },
      { id: 'oman', name: 'Oman', flag: '🇴🇲', lat: 21.5126, lng: 55.9233 },
      { id: 'lebanon', name: 'Lebanon', flag: '🇱🇧', lat: 33.8547, lng: 35.8623 },
      { id: 'syria', name: 'Syria', flag: '🇸🇾', lat: 34.8021, lng: 38.9968 },
      { id: 'yemen', name: 'Yemen', flag: '🇾🇪', lat: 15.5527, lng: 48.5164 },
      { id: 'palestine', name: 'Palestine', flag: '🇵🇸', lat: 31.9522, lng: 35.2332 },
      { id: 'morocco', name: 'Morocco', flag: '🇲🇦', lat: 31.7917, lng: -7.0926 },
      { id: 'algeria', name: 'Algeria', flag: '🇩🇿', lat: 28.0339, lng: 1.6596 },
      { id: 'tunisia', name: 'Tunisia', flag: '🇹🇳', lat: 33.8869, lng: 9.5375 },
      { id: 'libya', name: 'Libya', flag: '🇱🇾', lat: 26.3351, lng: 17.2283 },
      { id: 'sudan', name: 'Sudan', flag: '🇸🇩', lat: 12.8628, lng: 30.2176 },
      // Sub-Saharan Africa
      { id: 'south africa', name: 'South Africa', flag: '🇿🇦', lat: -30.5595, lng: 22.9375 },
      { id: 'nigeria', name: 'Nigeria', flag: '🇳🇬', lat: 9.0820, lng: 8.6753 },
      { id: 'kenya', name: 'Kenya', flag: '🇰🇪', lat: -0.0236, lng: 37.9062 },
      { id: 'ethiopia', name: 'Ethiopia', flag: '🇪🇹', lat: 9.1450, lng: 40.4897 },
      { id: 'ghana', name: 'Ghana', flag: '🇬🇭', lat: 7.9465, lng: -1.0232 },
      { id: 'tanzania', name: 'Tanzania', flag: '🇹🇿', lat: -6.3690, lng: 34.8888 },
      { id: 'uganda', name: 'Uganda', flag: '🇺🇬', lat: 1.3733, lng: 32.2903 },
      { id: 'congo', name: 'DR Congo', flag: '🇨🇩', lat: -4.0383, lng: 21.7587 },
      { id: 'angola', name: 'Angola', flag: '🇦🇴', lat: -11.2027, lng: 17.8739 },
      { id: 'mozambique', name: 'Mozambique', flag: '🇲🇿', lat: -18.6657, lng: 35.5296 },
      { id: 'zambia', name: 'Zambia', flag: '🇿🇲', lat: -13.1339, lng: 27.8493 },
      { id: 'zimbabwe', name: 'Zimbabwe', flag: '🇿🇼', lat: -19.0154, lng: 29.1549 },
      { id: 'cameroon', name: 'Cameroon', flag: '🇨🇲', lat: 7.3697, lng: 12.3547 },
      { id: 'senegal', name: 'Senegal', flag: '🇸🇳', lat: 14.4974, lng: -14.4524 },
      { id: 'mali', name: 'Mali', flag: '🇲🇱', lat: 17.5707, lng: -3.9962 },
      { id: 'niger', name: 'Niger', flag: '🇳🇪', lat: 17.6078, lng: 8.0817 },
      { id: 'chad', name: 'Chad', flag: '🇹🇩', lat: 15.4542, lng: 18.7322 },
      { id: 'somalia', name: 'Somalia', flag: '🇸🇴', lat: 5.1521, lng: 46.1996 },
      { id: 'south sudan', name: 'South Sudan', flag: '🇸🇸', lat: 6.8770, lng: 31.3070 },
      { id: 'rwanda', name: 'Rwanda', flag: '🇷🇼', lat: -1.9403, lng: 29.8739 },
      { id: 'madagascar', name: 'Madagascar', flag: '🇲🇬', lat: -18.7669, lng: 46.8691 },
      { id: 'burkina faso', name: 'Burkina Faso', flag: '🇧🇫', lat: 12.2383, lng: -1.5616 },
      { id: 'namibia', name: 'Namibia', flag: '🇳🇦', lat: -22.9576, lng: 18.4904 },
      { id: 'botswana', name: 'Botswana', flag: '🇧🇼', lat: -22.3285, lng: 24.6849 },
      { id: 'burundi', name: 'Burundi', flag: '🇧🇮', lat: -3.3731, lng: 29.9189 },
      { id: 'togo', name: 'Togo', flag: '🇹🇬', lat: 8.6195, lng: 0.8248 },
      { id: 'benin', name: 'Benin', flag: '🇧🇯', lat: 9.3077, lng: 2.3158 },
      { id: 'guinea', name: 'Guinea', flag: '🇬🇳', lat: 9.9456, lng: -9.6966 },
      { id: 'sierra leone', name: 'Sierra Leone', flag: '🇸🇱', lat: 8.4606, lng: -11.7799 },
      { id: 'liberia', name: 'Liberia', flag: '🇱🇷', lat: 6.4281, lng: -9.4295 },
      { id: 'mauritania', name: 'Mauritania', flag: '🇲🇷', lat: 21.0079, lng: -10.9408 },
      { id: 'malawi', name: 'Malawi', flag: '🇲🇼', lat: -13.2543, lng: 34.3015 },
      { id: 'eritrea', name: 'Eritrea', flag: '🇪🇷', lat: 15.1794, lng: 39.7823 },
      { id: 'gabon', name: 'Gabon', flag: '🇬🇦', lat: -0.8037, lng: 11.6094 },
      { id: 'mauritius', name: 'Mauritius', flag: '🇲🇺', lat: -20.3484, lng: 57.5522 },
      { id: 'eswatini', name: 'Eswatini', flag: '🇸🇿', lat: -26.5225, lng: 31.4659 },
      { id: 'djibouti', name: 'Djibouti', flag: '🇩🇯', lat: 11.8251, lng: 42.5903 },
      { id: 'gambia', name: 'Gambia', flag: '🇬🇲', lat: 13.4432, lng: -15.3101 },
      { id: 'central african republic', name: 'Central African Republic', flag: '🇨🇫', lat: 6.6111, lng: 20.9394 },
      { id: 'republic of the congo', name: 'Republic of the Congo', flag: '🇨🇬', lat: -0.2280, lng: 15.8277 },
      { id: 'lesotho', name: 'Lesotho', flag: '🇱🇸', lat: -29.6100, lng: 28.2336 },
      { id: 'guinea-bissau', name: 'Guinea-Bissau', flag: '🇬🇼', lat: 11.8037, lng: -15.1804 },
      { id: 'equatorial guinea', name: 'Equatorial Guinea', flag: '🇬🇶', lat: 1.6508, lng: 10.2679 },
      { id: 'comoros', name: 'Comoros', flag: '🇰🇲', lat: -11.8753, lng: 43.8722 },
      { id: 'cape verde', name: 'Cape Verde', flag: '🇨🇻', lat: 16.5388, lng: -23.0418 },
      { id: 'seychelles', name: 'Seychelles', flag: '🇸🇨', lat: -4.6796, lng: 55.4920 },
      { id: 'sao tome and principe', name: 'São Tomé and Príncipe', flag: '🇸🇹', lat: 0.1864, lng: 6.6131 }
    ],
    india: {
      country: 'India',
      flag: '🇮🇳',
      lat: 20.5937,
      lng: 78.9629,
      states: [
        { id: 'tamil nadu', name: 'Tamil Nadu', lat: 11.1271, lng: 78.6569, capital: 'Chennai', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'] },
        { id: 'maharashtra', name: 'Maharashtra', lat: 19.7515, lng: 75.7139, capital: 'Mumbai', cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'] },
        { id: 'karnataka', name: 'Karnataka', lat: 15.3173, lng: 75.7139, capital: 'Bengaluru', cities: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru'] },
        { id: 'delhi', name: 'Delhi NCR', lat: 28.7041, lng: 77.1025, capital: 'New Delhi', cities: ['New Delhi', 'Noida', 'Gurugram', 'Faridabad'] },
        { id: 'gujarat', name: 'Gujarat', lat: 22.2587, lng: 71.1924, capital: 'Gandhinagar', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'] },
        { id: 'rajasthan', name: 'Rajasthan', lat: 27.0238, lng: 74.2179, capital: 'Jaipur', cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'] },
        { id: 'west bengal', name: 'West Bengal', lat: 22.9868, lng: 87.8550, capital: 'Kolkata', cities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol'] },
        { id: 'telangana', name: 'Telangana', lat: 18.1124, lng: 79.0193, capital: 'Hyderabad', cities: ['Hyderabad', 'Warangal', 'Nizamabad'] },
        { id: 'uttar pradesh', name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, capital: 'Lucknow', cities: ['Lucknow', 'Kanpur', 'Varanasi', 'Agra'] },
        { id: 'kerala', name: 'Kerala', lat: 10.8505, lng: 76.2711, capital: 'Thiruvananthapuram', cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode'] },
        { id: 'andhra pradesh', name: 'Andhra Pradesh', lat: 15.9129, lng: 79.7400, capital: 'Amaravati', cities: ['Visakhapatnam', 'Vijayawada', 'Guntur'] },
        { id: 'madhya pradesh', name: 'Madhya Pradesh', lat: 22.9734, lng: 78.6569, capital: 'Bhopal', cities: ['Bhopal', 'Indore', 'Jabalpur'] },
        { id: 'bihar', name: 'Bihar', lat: 25.0961, lng: 85.3131, capital: 'Patna', cities: ['Patna', 'Gaya', 'Muzaffarpur'] },
        { id: 'punjab', name: 'Punjab', lat: 31.1471, lng: 75.3412, capital: 'Chandigarh', cities: ['Ludhiana', 'Amritsar', 'Jalandhar'] },
        { id: 'odisha', name: 'Odisha', lat: 20.9517, lng: 85.0985, capital: 'Bhubaneswar', cities: ['Bhubaneswar', 'Cuttack', 'Rourkela'] },
        { id: 'assam', name: 'Assam', lat: 26.2006, lng: 92.9376, capital: 'Dispur', cities: ['Guwahati', 'Silchar', 'Dibrugarh'] },
        { id: 'goa', name: 'Goa', lat: 15.2993, lng: 74.1240, capital: 'Panaji', cities: ['Panaji', 'Margao', 'Vasco da Gama'] },
        { id: 'jammu and kashmir', name: 'Jammu & Kashmir', lat: 33.7782, lng: 76.5762, capital: 'Srinagar', cities: ['Srinagar', 'Jammu', 'Anantnag'] }
      ],
      chennaiNeighbourhoods: [
        { id: 'velachery', name: 'Velachery', lat: 12.9759, lng: 80.2212 },
        { id: 't nagar', name: 'T. Nagar', lat: 13.0418, lng: 80.2341 },
        { id: 'anna nagar', name: 'Anna Nagar', lat: 13.0850, lng: 80.2101 },
        { id: 'adyar', name: 'Adyar', lat: 13.0012, lng: 80.2565 },
        { id: 'mylapore', name: 'Mylapore', lat: 13.0368, lng: 80.2676 },
        { id: 'guindy', name: 'Guindy', lat: 13.0067, lng: 80.2021 },
        { id: 'omr', name: 'OMR / IT Corridor', lat: 12.9010, lng: 80.2279 },
        { id: 'sholinganallur', name: 'Sholinganallur', lat: 12.8998, lng: 80.2279 },
        { id: 'porur', name: 'Porur', lat: 13.0382, lng: 80.1565 }
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

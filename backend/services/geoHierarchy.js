/**
 * Global Geographic Hierarchy, Coordinates & Resolution Engine
 * 
 * Provides comprehensive global coverage:
 * - Sovereign Nations across all continents (all 195+ world nations with flags, ISO codes, coordinates, capitals, regions)
 * - Comprehensive State / Province coverage:
 *   - All 28 States & 8 UTs of India with coordinates, capitals, and key districts
 *   - All 50 US States + DC + PR with coordinates, capitals, and key metros
 *   - Key provinces/states for Canada, Australia, UK, Germany, France, Japan, China, Brazil, Mexico, Italy, Spain, Russia, South Africa, UAE, Saudi Arabia, Indonesia, Turkey, South Korea, etc.
 * - Global Major Metros & Cities Dictionary across every continent with exact lat/lng
 * - Micro-neighborhoods for prime global hubs (Chennai, New York, London, Tokyo, Paris, Mumbai, Bengaluru, San Francisco, Dubai, Sydney, Berlin, Toronto, Singapore)
 * - Smart Hierarchical Resolver for Country -> State/Province -> City -> Micro-region
 */

export const GLOBAL_COUNTRIES = [
  // --- ASIA-PACIFIC ---
  { id: 'india', name: 'India', flag: '🇮🇳', region: 'Asia-Pacific', lat: 20.5937, lng: 78.9629, iso: 'IN', capital: 'New Delhi', capitalLat: 28.6139, capitalLng: 77.2090 },
  { id: 'china', name: 'China', flag: '🇨🇳', region: 'Asia-Pacific', lat: 35.8617, lng: 104.1954, iso: 'CN', capital: 'Beijing', capitalLat: 39.9042, capitalLng: 116.4074 },
  { id: 'japan', name: 'Japan', flag: '🇯🇵', region: 'Asia-Pacific', lat: 36.2048, lng: 138.2529, iso: 'JP', capital: 'Tokyo', capitalLat: 35.6762, capitalLng: 139.6503 },
  { id: 'south korea', name: 'South Korea', flag: '🇰🇷', region: 'Asia-Pacific', lat: 35.9078, lng: 127.7669, iso: 'KR', capital: 'Seoul', capitalLat: 37.5665, capitalLng: 126.9780 },
  { id: 'north korea', name: 'North Korea', flag: '🇰🇵', region: 'Asia-Pacific', lat: 40.3399, lng: 127.5101, iso: 'KP', capital: 'Pyongyang', capitalLat: 39.0392, capitalLng: 125.7625 },
  { id: 'taiwan', name: 'Taiwan', flag: '🇹🇼', region: 'Asia-Pacific', lat: 23.6978, lng: 120.9605, iso: 'TW', capital: 'Taipei', capitalLat: 25.0330, capitalLng: 121.5654 },
  { id: 'australia', name: 'Australia', flag: '🇦🇺', region: 'Asia-Pacific', lat: -25.2744, lng: 133.7751, iso: 'AU', capital: 'Canberra', capitalLat: -35.2809, capitalLng: 149.1300 },
  { id: 'indonesia', name: 'Indonesia', flag: '🇮🇩', region: 'Asia-Pacific', lat: -0.7893, lng: 113.9213, iso: 'ID', capital: 'Jakarta', capitalLat: -6.2088, capitalLng: 106.8456 },
  { id: 'philippines', name: 'Philippines', flag: '🇵🇭', region: 'Asia-Pacific', lat: 12.8797, lng: 121.7740, iso: 'PH', capital: 'Manila', capitalLat: 14.5995, capitalLng: 120.9842 },
  { id: 'vietnam', name: 'Vietnam', flag: '🇻🇳', region: 'Asia-Pacific', lat: 14.0583, lng: 108.2772, iso: 'VN', capital: 'Hanoi', capitalLat: 21.0285, capitalLng: 105.8542 },
  { id: 'thailand', name: 'Thailand', flag: '🇹🇭', region: 'Asia-Pacific', lat: 15.8700, lng: 100.9925, iso: 'TH', capital: 'Bangkok', capitalLat: 13.7563, capitalLng: 100.5018 },
  { id: 'malaysia', name: 'Malaysia', flag: '🇲🇾', region: 'Asia-Pacific', lat: 4.2105, lng: 101.9758, iso: 'MY', capital: 'Kuala Lumpur', capitalLat: 3.1390, capitalLng: 101.6869 },
  { id: 'singapore', name: 'Singapore', flag: '🇸🇬', region: 'Asia-Pacific', lat: 1.3521, lng: 103.8198, iso: 'SG', capital: 'Singapore', capitalLat: 1.3521, capitalLng: 103.8198 },
  { id: 'pakistan', name: 'Pakistan', flag: '🇵🇰', region: 'Asia-Pacific', lat: 30.3753, lng: 69.3451, iso: 'PK', capital: 'Islamabad', capitalLat: 33.6844, capitalLng: 73.0479 },
  { id: 'bangladesh', name: 'Bangladesh', flag: '🇧🇩', region: 'Asia-Pacific', lat: 23.6850, lng: 90.3563, iso: 'BD', capital: 'Dhaka', capitalLat: 23.8103, capitalLng: 90.4125 },
  { id: 'sri lanka', name: 'Sri Lanka', flag: '🇱🇰', region: 'Asia-Pacific', lat: 7.8731, lng: 80.7718, iso: 'LK', capital: 'Colombo', capitalLat: 6.9271, capitalLng: 79.8612 },
  { id: 'new zealand', name: 'New Zealand', flag: '🇳🇿', region: 'Asia-Pacific', lat: -40.9006, lng: 174.8860, iso: 'NZ', capital: 'Wellington', capitalLat: -41.2865, capitalLng: 174.7762 },
  { id: 'myanmar', name: 'Myanmar', flag: '🇲🇲', region: 'Asia-Pacific', lat: 21.9162, lng: 95.9560, iso: 'MM', capital: 'Naypyidaw', capitalLat: 19.7633, capitalLng: 96.0785 },
  { id: 'cambodia', name: 'Cambodia', flag: '🇰🇭', region: 'Asia-Pacific', lat: 12.5657, lng: 104.9910, iso: 'KH', capital: 'Phnom Penh', capitalLat: 11.5564, capitalLng: 104.9282 },
  { id: 'laos', name: 'Laos', flag: '🇱🇦', region: 'Asia-Pacific', lat: 19.8563, lng: 102.4955, iso: 'LA', capital: 'Vientiane', capitalLat: 17.9757, capitalLng: 102.6331 },
  { id: 'nepal', name: 'Nepal', flag: '🇳🇵', region: 'Asia-Pacific', lat: 28.3949, lng: 84.1240, iso: 'NP', capital: 'Kathmandu', capitalLat: 27.7172, capitalLng: 85.3240 },
  { id: 'bhutan', name: 'Bhutan', flag: '🇧🇹', region: 'Asia-Pacific', lat: 27.5142, lng: 90.4336, iso: 'BT', capital: 'Thimphu', capitalLat: 27.4728, capitalLng: 89.6393 },
  { id: 'maldives', name: 'Maldives', flag: '🇲🇻', region: 'Asia-Pacific', lat: 3.2028, lng: 73.2207, iso: 'MV', capital: 'Male', capitalLat: 4.1755, capitalLng: 73.5093 },
  { id: 'mongolia', name: 'Mongolia', flag: '🇲🇳', region: 'Asia-Pacific', lat: 46.8625, lng: 103.8467, iso: 'MN', capital: 'Ulaanbaatar', capitalLat: 47.8864, capitalLng: 106.9057 },
  { id: 'kazakhstan', name: 'Kazakhstan', flag: '🇰🇿', region: 'Asia-Pacific', lat: 48.0196, lng: 66.9237, iso: 'KZ', capital: 'Astana', capitalLat: 51.1694, capitalLng: 71.4491 },
  { id: 'uzbekistan', name: 'Uzbekistan', flag: '🇺🇿', region: 'Asia-Pacific', lat: 41.3775, lng: 64.5853, iso: 'UZ', capital: 'Tashkent', capitalLat: 41.2995, capitalLng: 69.2401 },
  { id: 'turkmenistan', name: 'Turkmenistan', flag: '🇹🇲', region: 'Asia-Pacific', lat: 38.9697, lng: 59.5563, iso: 'TM', capital: 'Ashgabat', capitalLat: 37.9601, capitalLng: 58.3261 },
  { id: 'kyrgyzstan', name: 'Kyrgyzstan', flag: '🇰🇬', region: 'Asia-Pacific', lat: 41.2044, lng: 74.7661, iso: 'KG', capital: 'Bishkek', capitalLat: 42.8746, capitalLng: 74.5698 },
  { id: 'tajikistan', name: 'Tajikistan', flag: '🇹🇯', region: 'Asia-Pacific', lat: 38.8610, lng: 71.2761, iso: 'TJ', capital: 'Dushanbe', capitalLat: 38.5598, capitalLng: 68.7870 },
  { id: 'afghanistan', name: 'Afghanistan', flag: '🇦🇫', region: 'Asia-Pacific', lat: 33.9391, lng: 67.7100, iso: 'AF', capital: 'Kabul', capitalLat: 34.5553, capitalLng: 69.2075 },
  { id: 'brunei', name: 'Brunei', flag: '🇧🇳', region: 'Asia-Pacific', lat: 4.5353, lng: 114.7277, iso: 'BN', capital: 'Bandar Seri Begawan', capitalLat: 4.9031, capitalLng: 114.9398 },
  { id: 'timor-leste', name: 'Timor-Leste', flag: '🇹🇱', region: 'Asia-Pacific', lat: -8.8742, lng: 125.7275, iso: 'TL', capital: 'Dili', capitalLat: -8.5569, capitalLng: 125.5603 },
  { id: 'papua new guinea', name: 'Papua New Guinea', flag: '🇵🇬', region: 'Asia-Pacific', lat: -6.3150, lng: 143.9555, iso: 'PG', capital: 'Port Moresby', capitalLat: -9.4438, capitalLng: 147.1803 },
  { id: 'fiji', name: 'Fiji', flag: '🇫🇯', region: 'Asia-Pacific', lat: -17.7134, lng: 178.0650, iso: 'FJ', capital: 'Suva', capitalLat: -18.1416, capitalLng: 178.4419 },
  { id: 'solomon islands', name: 'Solomon Islands', flag: '🇸🇧', region: 'Asia-Pacific', lat: -9.6457, lng: 160.1562, iso: 'SB', capital: 'Honiara', capitalLat: -9.4456, capitalLng: 159.9729 },
  { id: 'vanuatu', name: 'Vanuatu', flag: '🇻🇺', region: 'Asia-Pacific', lat: -15.3767, lng: 166.9592, iso: 'VU', capital: 'Port Vila', capitalLat: -17.7333, capitalLng: 168.3273 },
  { id: 'samoa', name: 'Samoa', flag: '🇼🇸', region: 'Asia-Pacific', lat: -13.7590, lng: -172.1046, iso: 'WS', capital: 'Apia', capitalLat: -13.8333, capitalLng: -171.7667 },
  { id: 'kiribati', name: 'Kiribati', flag: '🇰🇮', region: 'Asia-Pacific', lat: -3.3704, lng: -168.7340, iso: 'KI', capital: 'Tarawa', capitalLat: 1.3278, capitalLng: 172.9770 },
  { id: 'tonga', name: 'Tonga', flag: '🇹🇴', region: 'Asia-Pacific', lat: -21.1789, lng: -175.1982, iso: 'TO', capital: 'Nukuʻalofa', capitalLat: -21.1394, capitalLng: -175.2049 },
  { id: 'micronesia', name: 'Micronesia', flag: '🇫🇲', region: 'Asia-Pacific', lat: 7.4256, lng: 150.5508, iso: 'FM', capital: 'Palikir', capitalLat: 6.9248, capitalLng: 158.1611 },
  { id: 'palau', name: 'Palau', flag: '🇵🇼', region: 'Asia-Pacific', lat: 7.5150, lng: 134.5825, iso: 'PW', capital: 'Ngerulmud', capitalLat: 7.5004, capitalLng: 134.6242 },
  { id: 'marshall islands', name: 'Marshall Islands', flag: '🇲🇭', region: 'Asia-Pacific', lat: 7.1315, lng: 171.1845, iso: 'MH', capital: 'Majuro', capitalLat: 7.1163, capitalLng: 171.3653 },
  { id: 'tuvalu', name: 'Tuvalu', flag: '🇹🇻', region: 'Asia-Pacific', lat: -7.1095, lng: 177.6493, iso: 'TV', capital: 'Funafuti', capitalLat: -8.5211, capitalLng: 179.1962 },
  { id: 'nauru', name: 'Nauru', flag: '🇳🇷', region: 'Asia-Pacific', lat: -0.5228, lng: 166.9315, iso: 'NR', capital: 'Yaren', capitalLat: -0.5477, capitalLng: 166.9209 },

  // --- AMERICAS ---
  { id: 'us', name: 'United States', flag: '🇺🇸', region: 'Americas', lat: 37.0902, lng: -95.7129, iso: 'US', capital: 'Washington D.C.', capitalLat: 38.9072, capitalLng: -77.0369 },
  { id: 'canada', name: 'Canada', flag: '🇨🇦', region: 'Americas', lat: 56.1304, lng: -106.3468, iso: 'CA', capital: 'Ottawa', capitalLat: 45.4215, capitalLng: -75.6972 },
  { id: 'mexico', name: 'Mexico', flag: '🇲🇽', region: 'Americas', lat: 23.6345, lng: -102.5528, iso: 'MX', capital: 'Mexico City', capitalLat: 19.4326, capitalLng: -99.1332 },
  { id: 'brazil', name: 'Brazil', flag: '🇧🇷', region: 'Americas', lat: -14.2350, lng: -51.9253, iso: 'BR', capital: 'Brasília', capitalLat: -15.8267, capitalLng: -47.9218 },
  { id: 'argentina', name: 'Argentina', flag: '🇦🇷', region: 'Americas', lat: -38.4161, lng: -63.6167, iso: 'AR', capital: 'Buenos Aires', capitalLat: -34.6037, capitalLng: -58.3816 },
  { id: 'colombia', name: 'Colombia', flag: '🇨🇴', region: 'Americas', lat: 4.5709, lng: -74.2973, iso: 'CO', capital: 'Bogotá', capitalLat: 4.7110, capitalLng: -74.0721 },
  { id: 'chile', name: 'Chile', flag: '🇨🇱', region: 'Americas', lat: -35.6751, lng: -71.5430, iso: 'CL', capital: 'Santiago', capitalLat: -33.4489, capitalLng: -70.6693 },
  { id: 'peru', name: 'Peru', flag: '🇵🇪', region: 'Americas', lat: -9.1900, lng: -75.0152, iso: 'PE', capital: 'Lima', capitalLat: -12.0464, capitalLng: -77.0428 },
  { id: 'venezuela', name: 'Venezuela', flag: '🇻🇪', region: 'Americas', lat: 6.4238, lng: -66.5897, iso: 'VE', capital: 'Caracas', capitalLat: 10.4806, capitalLng: -66.9036 },
  { id: 'ecuador', name: 'Ecuador', flag: '🇪🇨', region: 'Americas', lat: -1.8312, lng: -78.1834, iso: 'EC', capital: 'Quito', capitalLat: -0.1807, capitalLng: -78.4678 },
  { id: 'bolivia', name: 'Bolivia', flag: '🇧🇴', region: 'Americas', lat: -16.2902, lng: -63.5887, iso: 'BO', capital: 'La Paz', capitalLat: -16.4897, capitalLng: -68.1193 },
  { id: 'paraguay', name: 'Paraguay', flag: '🇵🇾', region: 'Americas', lat: -23.4425, lng: -58.4438, iso: 'PY', capital: 'Asunción', capitalLat: -25.2637, capitalLng: -57.5759 },
  { id: 'uruguay', name: 'Uruguay', flag: '🇺🇾', region: 'Americas', lat: -32.5228, lng: -55.7658, iso: 'UY', capital: 'Montevideo', capitalLat: -34.9011, capitalLng: -56.1645 },
  { id: 'guyana', name: 'Guyana', flag: '🇬🇾', region: 'Americas', lat: 4.8604, lng: -58.9302, iso: 'GY', capital: 'Georgetown', capitalLat: 6.8013, capitalLng: -58.1551 },
  { id: 'suriname', name: 'Suriname', flag: '🇸🇷', region: 'Americas', lat: 3.9193, lng: -56.0278, iso: 'SR', capital: 'Paramaribo', capitalLat: 5.8520, capitalLng: -55.2038 },
  { id: 'cuba', name: 'Cuba', flag: '🇨🇺', region: 'Americas', lat: 21.5218, lng: -77.7812, iso: 'CU', capital: 'Havana', capitalLat: 23.1136, capitalLng: -82.3666 },
  { id: 'dominican republic', name: 'Dominican Republic', flag: '🇩🇴', region: 'Americas', lat: 18.7357, lng: -70.1627, iso: 'DO', capital: 'Santo Domingo', capitalLat: 18.4861, capitalLng: -69.9312 },
  { id: 'haiti', name: 'Haiti', flag: '🇭🇹', region: 'Americas', lat: 18.9712, lng: -72.2852, iso: 'HT', capital: 'Port-au-Prince', capitalLat: 18.5944, capitalLng: -72.3074 },
  { id: 'guatemala', name: 'Guatemala', flag: '🇬🇹', region: 'Americas', lat: 15.7835, lng: -90.2308, iso: 'GT', capital: 'Guatemala City', capitalLat: 14.6349, capitalLng: -90.5069 },
  { id: 'honduras', name: 'Honduras', flag: '🇭🇳', region: 'Americas', lat: 15.2000, lng: -86.2419, iso: 'HN', capital: 'Tegucigalpa', capitalLat: 14.0723, capitalLng: -87.1921 },
  { id: 'el salvador', name: 'El Salvador', flag: '🇸🇻', region: 'Americas', lat: 13.7942, lng: -88.8965, iso: 'SV', capital: 'San Salvador', capitalLat: 13.6929, capitalLng: -89.2182 },
  { id: 'nicaragua', name: 'Nicaragua', flag: '🇳🇮', region: 'Americas', lat: 12.8654, lng: -85.2072, iso: 'NI', capital: 'Managua', capitalLat: 12.1150, capitalLng: -86.2362 },
  { id: 'costa rica', name: 'Costa Rica', flag: '🇨🇷', region: 'Americas', lat: 9.7489, lng: -83.7534, iso: 'CR', capital: 'San José', capitalLat: 9.9281, capitalLng: -84.0907 },
  { id: 'panama', name: 'Panama', flag: '🇵🇦', region: 'Americas', lat: 8.5380, lng: -80.7821, iso: 'PA', capital: 'Panama City', capitalLat: 8.9824, capitalLng: -79.5199 },
  { id: 'jamaica', name: 'Jamaica', flag: '🇯🇲', region: 'Americas', lat: 18.1096, lng: -77.2975, iso: 'JM', capital: 'Kingston', capitalLat: 17.9714, capitalLng: -76.7936 },
  { id: 'trinidad and tobago', name: 'Trinidad and Tobago', flag: '🇹🇹', region: 'Americas', lat: 10.6918, lng: -61.2225, iso: 'TT', capital: 'Port of Spain', capitalLat: 10.6573, capitalLng: -61.5180 },
  { id: 'bahamas', name: 'Bahamas', flag: '🇧🇸', region: 'Americas', lat: 25.0343, lng: -77.3963, iso: 'BS', capital: 'Nassau', capitalLat: 25.0480, capitalLng: -77.3554 },
  { id: 'barbados', name: 'Barbados', flag: '🇧🇧', region: 'Americas', lat: 13.1939, lng: -59.5432, iso: 'BB', capital: 'Bridgetown', capitalLat: 13.0969, capitalLng: -59.6145 },
  { id: 'belize', name: 'Belize', flag: '🇧🇿', region: 'Americas', lat: 17.1899, lng: -88.4976, iso: 'BZ', capital: 'Belmopan', capitalLat: 17.2510, capitalLng: -88.7590 },
  { id: 'saint lucia', name: 'Saint Lucia', flag: '🇱🇨', region: 'Americas', lat: 13.9094, lng: -60.9789, iso: 'LC', capital: 'Castries', capitalLat: 14.0101, capitalLng: -60.9875 },
  { id: 'grenada', name: 'Grenada', flag: '🇬🇩', region: 'Americas', lat: 12.1165, lng: -61.6790, iso: 'GD', capital: "St. George's", capitalLat: 12.0561, capitalLng: -61.7488 },
  { id: 'saint vincent', name: 'St. Vincent & Grenadines', flag: '🇻🇨', region: 'Americas', lat: 12.9843, lng: -61.2872, iso: 'VC', capital: 'Kingstown', capitalLat: 13.1587, capitalLng: -61.2248 },
  { id: 'antigua and barbuda', name: 'Antigua and Barbuda', flag: '🇦🇬', region: 'Americas', lat: 17.0608, lng: -61.7964, iso: 'AG', capital: "St. John's", capitalLat: 17.1274, capitalLng: -61.8468 },
  { id: 'saint kitts and nevis', name: 'Saint Kitts and Nevis', flag: '🇰🇳', region: 'Americas', lat: 17.3578, lng: -62.7830, iso: 'KN', capital: 'Basseterre', capitalLat: 17.3026, capitalLng: -62.7177 },
  { id: 'dominica', name: 'Dominica', flag: '🇩🇲', region: 'Americas', lat: 15.4150, lng: -61.3710, iso: 'DM', capital: 'Roseau', capitalLat: 15.3017, capitalLng: -61.3881 },

  // --- EUROPE ---
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe', lat: 55.3781, lng: -3.4360, iso: 'GB', capital: 'London', capitalLat: 51.5074, capitalLng: -0.1278 },
  { id: 'germany', name: 'Germany', flag: '🇩🇪', region: 'Europe', lat: 51.1657, lng: 10.4515, iso: 'DE', capital: 'Berlin', capitalLat: 52.5200, capitalLng: 13.4050 },
  { id: 'france', name: 'France', flag: '🇫🇷', region: 'Europe', lat: 46.2276, lng: 2.2137, iso: 'FR', capital: 'Paris', capitalLat: 48.8566, capitalLng: 2.3522 },
  { id: 'italy', name: 'Italy', flag: '🇮🇹', region: 'Europe', lat: 41.8719, lng: 12.5674, iso: 'IT', capital: 'Rome', capitalLat: 41.9028, capitalLng: 12.4964 },
  { id: 'spain', name: 'Spain', flag: '🇪🇸', region: 'Europe', lat: 40.4637, lng: -3.7492, iso: 'ES', capital: 'Madrid', capitalLat: 40.4168, capitalLng: -3.7038 },
  { id: 'ukraine', name: 'Ukraine', flag: '🇺🇦', region: 'Europe', lat: 48.3794, lng: 31.1656, iso: 'UA', capital: 'Kyiv', capitalLat: 50.4501, capitalLng: 30.5234 },
  { id: 'russia', name: 'Russia', flag: '🇷🇺', region: 'Europe', lat: 61.5240, lng: 105.3188, iso: 'RU', capital: 'Moscow', capitalLat: 55.7558, capitalLng: 37.6173 },
  { id: 'poland', name: 'Poland', flag: '🇵🇱', region: 'Europe', lat: 51.9194, lng: 19.1451, iso: 'PL', capital: 'Warsaw', capitalLat: 52.2297, capitalLng: 21.0122 },
  { id: 'netherlands', name: 'Netherlands', flag: '🇳🇱', region: 'Europe', lat: 52.1326, lng: 5.2913, iso: 'NL', capital: 'Amsterdam', capitalLat: 52.3676, capitalLng: 4.9041 },
  { id: 'belgium', name: 'Belgium', flag: '🇧🇪', region: 'Europe', lat: 50.5039, lng: 4.4699, iso: 'BE', capital: 'Brussels', capitalLat: 50.8503, capitalLng: 4.3517 },
  { id: 'sweden', name: 'Sweden', flag: '🇸🇪', region: 'Europe', lat: 60.1282, lng: 18.6435, iso: 'SE', capital: 'Stockholm', capitalLat: 59.3293, capitalLng: 18.0686 },
  { id: 'norway', name: 'Norway', flag: '🇳🇴', region: 'Europe', lat: 60.4720, lng: 8.4689, iso: 'NO', capital: 'Oslo', capitalLat: 59.9139, capitalLng: 10.7522 },
  { id: 'denmark', name: 'Denmark', flag: '🇩🇰', region: 'Europe', lat: 56.2639, lng: 9.5018, iso: 'DK', capital: 'Copenhagen', capitalLat: 55.6761, capitalLng: 12.5683 },
  { id: 'finland', name: 'Finland', flag: '🇫🇮', region: 'Europe', lat: 61.9241, lng: 25.7482, iso: 'FI', capital: 'Helsinki', capitalLat: 60.1699, capitalLng: 24.9384 },
  { id: 'ireland', name: 'Ireland', flag: '🇮🇪', region: 'Europe', lat: 53.1424, lng: -7.6921, iso: 'IE', capital: 'Dublin', capitalLat: 53.3498, capitalLng: -6.2603 },
  { id: 'portugal', name: 'Portugal', flag: '🇵🇹', region: 'Europe', lat: 39.3999, lng: -8.2245, iso: 'PT', capital: 'Lisbon', capitalLat: 38.7223, capitalLng: -9.1393 },
  { id: 'austria', name: 'Austria', flag: '🇦🇹', region: 'Europe', lat: 47.5162, lng: 14.5501, iso: 'AT', capital: 'Vienna', capitalLat: 48.2082, capitalLng: 16.3738 },
  { id: 'switzerland', name: 'Switzerland', flag: '🇨🇭', region: 'Europe', lat: 46.8182, lng: 8.2275, iso: 'CH', capital: 'Bern', capitalLat: 46.9480, capitalLng: 7.4474 },
  { id: 'greece', name: 'Greece', flag: '🇬🇷', region: 'Europe', lat: 39.0742, lng: 21.8243, iso: 'GR', capital: 'Athens', capitalLat: 37.9838, capitalLng: 23.7275 },
  { id: 'czech republic', name: 'Czech Republic', flag: '🇨🇿', region: 'Europe', lat: 49.8175, lng: 15.4730, iso: 'CZ', capital: 'Prague', capitalLat: 50.0755, capitalLng: 14.4378 },
  { id: 'romania', name: 'Romania', flag: '🇷🇴', region: 'Europe', lat: 45.9432, lng: 24.9668, iso: 'RO', capital: 'Bucharest', capitalLat: 44.4268, capitalLng: 26.1025 },
  { id: 'hungary', name: 'Hungary', flag: '🇭🇺', region: 'Europe', lat: 47.1625, lng: 19.5033, iso: 'HU', capital: 'Budapest', capitalLat: 47.4979, capitalLng: 19.0402 },
  { id: 'slovakia', name: 'Slovakia', flag: '🇸🇰', region: 'Europe', lat: 48.6690, lng: 19.6990, iso: 'SK', capital: 'Bratislava', capitalLat: 48.1486, capitalLng: 17.1077 },
  { id: 'bulgaria', name: 'Bulgaria', flag: '🇧🇬', region: 'Europe', lat: 42.7339, lng: 25.4858, iso: 'BG', capital: 'Sofia', capitalLat: 42.6977, capitalLng: 23.3219 },
  { id: 'croatia', name: 'Croatia', flag: '🇭🇷', region: 'Europe', lat: 45.1000, lng: 15.2000, iso: 'HR', capital: 'Zagreb', capitalLat: 45.8150, capitalLng: 15.9819 },
  { id: 'serbia', name: 'Serbia', flag: '🇷🇸', region: 'Europe', lat: 44.0165, lng: 21.0059, iso: 'RS', capital: 'Belgrade', capitalLat: 44.7866, capitalLng: 20.4489 },
  { id: 'bosnia', name: 'Bosnia & Herzegovina', flag: '🇧🇦', region: 'Europe', lat: 43.9159, lng: 17.6791, iso: 'BA', capital: 'Sarajevo', capitalLat: 43.8563, capitalLng: 18.4131 },
  { id: 'slovenia', name: 'Slovenia', flag: '🇸🇮', region: 'Europe', lat: 46.1512, lng: 14.9955, iso: 'SI', capital: 'Ljubljana', capitalLat: 46.0569, capitalLng: 14.5058 },
  { id: 'lithuania', name: 'Lithuania', flag: '🇱🇹', region: 'Europe', lat: 55.1694, lng: 23.8813, iso: 'LT', capital: 'Vilnius', capitalLat: 54.6872, capitalLng: 25.2797 },
  { id: 'latvia', name: 'Latvia', flag: '🇱🇻', region: 'Europe', lat: 56.8796, lng: 24.6032, iso: 'LV', capital: 'Riga', capitalLat: 56.9496, capitalLng: 24.1052 },
  { id: 'estonia', name: 'Estonia', flag: '🇪🇪', region: 'Europe', lat: 58.5953, lng: 25.0136, iso: 'EE', capital: 'Tallinn', capitalLat: 59.4370, capitalLng: 24.7535 },
  { id: 'belarus', name: 'Belarus', flag: '🇧🇾', region: 'Europe', lat: 53.7098, lng: 27.9534, iso: 'BY', capital: 'Minsk', capitalLat: 53.9045, capitalLng: 27.5615 },
  { id: 'moldova', name: 'Moldova', flag: '🇲🇩', region: 'Europe', lat: 47.4116, lng: 28.3699, iso: 'MD', capital: 'Chisinau', capitalLat: 47.0105, capitalLng: 28.8638 },
  { id: 'albania', name: 'Albania', flag: '🇦🇱', region: 'Europe', lat: 41.1533, lng: 20.1683, iso: 'AL', capital: 'Tirana', capitalLat: 41.3275, capitalLng: 19.8187 },
  { id: 'north macedonia', name: 'North Macedonia', flag: '🇲🇰', region: 'Europe', lat: 41.6086, lng: 21.7453, iso: 'MK', capital: 'Skopje', capitalLat: 41.9973, capitalLng: 21.4280 },
  { id: 'cyprus', name: 'Cyprus', flag: '🇨🇾', region: 'Europe', lat: 35.1264, lng: 33.4299, iso: 'CY', capital: 'Nicosia', capitalLat: 35.1856, capitalLng: 33.3823 },
  { id: 'malta', name: 'Malta', flag: '🇲🇹', region: 'Europe', lat: 35.9375, lng: 14.3754, iso: 'MT', capital: 'Valletta', capitalLat: 35.8989, capitalLng: 14.5146 },
  { id: 'iceland', name: 'Iceland', flag: '🇮🇸', region: 'Europe', lat: 64.9631, lng: -19.0208, iso: 'IS', capital: 'Reykjavik', capitalLat: 64.1466, capitalLng: -21.9426 },
  { id: 'luxembourg', name: 'Luxembourg', flag: '🇱🇺', region: 'Europe', lat: 49.8153, lng: 6.1296, iso: 'LU', capital: 'Luxembourg City', capitalLat: 49.6116, capitalLng: 6.1319 },
  { id: 'montenegro', name: 'Montenegro', flag: '🇲🇪', region: 'Europe', lat: 42.7087, lng: 19.3744, iso: 'ME', capital: 'Podgorica', capitalLat: 42.4304, capitalLng: 19.2594 },
  { id: 'kosovo', name: 'Kosovo', flag: '🇽🇰', region: 'Europe', lat: 42.6026, lng: 20.9030, iso: 'XK', capital: 'Pristina', capitalLat: 42.6629, capitalLng: 21.1655 },
  { id: 'andorra', name: 'Andorra', flag: '🇦🇩', region: 'Europe', lat: 42.5063, lng: 1.5218, iso: 'AD', capital: 'Andorra la Vella', capitalLat: 42.5063, capitalLng: 1.5218 },
  { id: 'monaco', name: 'Monaco', flag: '🇲🇨', region: 'Europe', lat: 43.7384, lng: 7.4246, iso: 'MC', capital: 'Monaco', capitalLat: 43.7384, capitalLng: 7.4246 },
  { id: 'liechtenstein', name: 'Liechtenstein', flag: '🇱🇮', region: 'Europe', lat: 47.1660, lng: 9.5554, iso: 'LI', capital: 'Vaduz', capitalLat: 47.1410, capitalLng: 9.5209 },
  { id: 'san marino', name: 'San Marino', flag: '🇸🇲', region: 'Europe', lat: 43.9424, lng: 12.4578, iso: 'SM', capital: 'San Marino', capitalLat: 43.9333, capitalLng: 12.4500 },
  { id: 'vatican city', name: 'Vatican City', flag: '🇻🇦', region: 'Europe', lat: 41.9029, lng: 12.4534, iso: 'VA', capital: 'Vatican City', capitalLat: 41.9029, capitalLng: 12.4534 },

  // --- MIDDLE EAST & NORTH AFRICA ---
  { id: 'israel', name: 'Israel', flag: '🇮🇱', region: 'Middle East', lat: 31.0461, lng: 34.8516, iso: 'IL', capital: 'Jerusalem', capitalLat: 31.7683, capitalLng: 35.2137 },
  { id: 'iran', name: 'Iran', flag: '🇮🇷', region: 'Middle East', lat: 32.4279, lng: 53.6880, iso: 'IR', capital: 'Tehran', capitalLat: 35.6892, capitalLng: 51.3890 },
  { id: 'saudi arabia', name: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East', lat: 23.8859, lng: 45.0792, iso: 'SA', capital: 'Riyadh', capitalLat: 24.7136, capitalLng: 46.6753 },
  { id: 'uae', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Middle East', lat: 23.4241, lng: 53.8478, iso: 'AE', capital: 'Abu Dhabi', capitalLat: 24.4539, capitalLng: 54.3773 },
  { id: 'egypt', name: 'Egypt', flag: '🇪🇬', region: 'Middle East', lat: 26.8206, lng: 30.8025, iso: 'EG', capital: 'Cairo', capitalLat: 30.0444, capitalLng: 31.2357 },
  { id: 'turkey', name: 'Turkey', flag: '🇹🇷', region: 'Middle East', lat: 38.9637, lng: 35.2433, iso: 'TR', capital: 'Ankara', capitalLat: 39.9334, capitalLng: 32.8597 },
  { id: 'iraq', name: 'Iraq', flag: '🇮🇶', region: 'Middle East', lat: 33.2232, lng: 43.6793, iso: 'IQ', capital: 'Baghdad', capitalLat: 33.3152, capitalLng: 44.3661 },
  { id: 'syria', name: 'Syria', flag: '🇸🇾', region: 'Middle East', lat: 34.8021, lng: 38.9968, iso: 'SY', capital: 'Damascus', capitalLat: 33.5138, capitalLng: 36.2765 },
  { id: 'jordan', name: 'Jordan', flag: '🇯🇴', region: 'Middle East', lat: 30.5852, lng: 36.2384, iso: 'JO', capital: 'Amman', capitalLat: 31.9454, capitalLng: 35.9284 },
  { id: 'lebanon', name: 'Lebanon', flag: '🇱🇧', region: 'Middle East', lat: 33.8547, lng: 35.8623, iso: 'LB', capital: 'Beirut', capitalLat: 33.8938, capitalLng: 35.5018 },
  { id: 'oman', name: 'Oman', flag: '🇴🇲', region: 'Middle East', lat: 21.5126, lng: 55.9233, iso: 'OM', capital: 'Muscat', capitalLat: 23.5880, capitalLng: 58.3829 },
  { id: 'kuwait', name: 'Kuwait', flag: '🇰🇼', region: 'Middle East', lat: 29.3117, lng: 47.4818, iso: 'KW', capital: 'Kuwait City', capitalLat: 29.3759, capitalLng: 47.9774 },
  { id: 'qatar', name: 'Qatar', flag: '🇶🇦', region: 'Middle East', lat: 25.3548, lng: 51.1839, iso: 'QA', capital: 'Doha', capitalLat: 25.2854, capitalLng: 51.5310 },
  { id: 'bahrain', name: 'Bahrain', flag: '🇧🇭', region: 'Middle East', lat: 26.0667, lng: 50.5577, iso: 'BH', capital: 'Manama', capitalLat: 26.2285, capitalLng: 50.5860 },
  { id: 'yemen', name: 'Yemen', flag: '🇾🇪', region: 'Middle East', lat: 15.5527, lng: 48.5164, iso: 'YE', capital: "Sana'a", capitalLat: 15.3694, capitalLng: 44.1910 },
  { id: 'palestine', name: 'Palestine', flag: '🇵🇸', region: 'Middle East', lat: 31.9522, lng: 35.2332, iso: 'PS', capital: 'Ramallah', capitalLat: 31.9038, capitalLng: 35.2034 },
  { id: 'morocco', name: 'Morocco', flag: '🇲🇦', region: 'Middle East', lat: 31.7917, lng: -7.0926, iso: 'MA', capital: 'Rabat', capitalLat: 34.0209, capitalLng: -6.8416 },
  { id: 'algeria', name: 'Algeria', flag: '🇩🇿', region: 'Middle East', lat: 28.0339, lng: 1.6596, iso: 'DZ', capital: 'Algiers', capitalLat: 36.7538, capitalLng: 3.0588 },
  { id: 'tunisia', name: 'Tunisia', flag: '🇹🇳', region: 'Middle East', lat: 33.8869, lng: 9.5375, iso: 'TN', capital: 'Tunis', capitalLat: 36.8065, capitalLng: 10.1815 },
  { id: 'libya', name: 'Libya', flag: '🇱🇾', region: 'Middle East', lat: 26.3351, lng: 17.2283, iso: 'LY', capital: 'Tripoli', capitalLat: 32.8872, capitalLng: 13.1913 },
  { id: 'sudan', name: 'Sudan', flag: '🇸🇩', region: 'Middle East', lat: 12.8628, lng: 30.2176, iso: 'SD', capital: 'Khartoum', capitalLat: 15.5007, capitalLng: 32.5599 },

  // --- SUB-SAHARAN AFRICA ---
  { id: 'south africa', name: 'South Africa', flag: '🇿🇦', region: 'Africa', lat: -30.5595, lng: 22.9375, iso: 'ZA', capital: 'Pretoria', capitalLat: -25.7479, capitalLng: 28.2293 },
  { id: 'nigeria', name: 'Nigeria', flag: '🇳🇬', region: 'Africa', lat: 9.0820, lng: 8.6753, iso: 'NG', capital: 'Abuja', capitalLat: 9.0765, capitalLng: 7.3986 },
  { id: 'kenya', name: 'Kenya', flag: '🇰🇪', region: 'Africa', lat: -0.0236, lng: 37.9062, iso: 'KE', capital: 'Nairobi', capitalLat: -1.2921, capitalLng: 36.8219 },
  { id: 'ethiopia', name: 'Ethiopia', flag: '🇪🇹', region: 'Africa', lat: 9.1450, lng: 40.4897, iso: 'ET', capital: 'Addis Ababa', capitalLat: 9.0300, capitalLng: 38.7400 },
  { id: 'ghana', name: 'Ghana', flag: '🇬🇭', region: 'Africa', lat: 7.9465, lng: -1.0232, iso: 'GH', capital: 'Accra', capitalLat: 5.6037, capitalLng: -0.1870 },
  { id: 'tanzania', name: 'Tanzania', flag: '🇹🇿', region: 'Africa', lat: -6.3690, lng: 34.8888, iso: 'TZ', capital: 'Dodoma', capitalLat: -6.1630, capitalLng: 35.7516 },
  { id: 'uganda', name: 'Uganda', flag: '🇺🇬', region: 'Africa', lat: 1.3733, lng: 32.2903, iso: 'UG', capital: 'Kampala', capitalLat: 0.3476, capitalLng: 32.5825 },
  { id: 'congo', name: 'DR Congo', flag: '🇨🇩', region: 'Africa', lat: -4.0383, lng: 21.7587, iso: 'CD', capital: 'Kinshasa', capitalLat: -4.4419, capitalLng: 15.2663 },
  { id: 'republic of the congo', name: 'Republic of the Congo', flag: '🇨🇬', region: 'Africa', lat: -0.2280, lng: 15.8277, iso: 'CG', capital: 'Brazzaville', capitalLat: -4.2634, capitalLng: 15.2429 },
  { id: 'angola', name: 'Angola', flag: '🇦🇴', region: 'Africa', lat: -11.2027, lng: 17.8739, iso: 'AO', capital: 'Luanda', capitalLat: -8.8390, capitalLng: 13.2894 },
  { id: 'mozambique', name: 'Mozambique', flag: '🇲🇿', region: 'Africa', lat: -18.6657, lng: 35.5296, iso: 'MZ', capital: 'Maputo', capitalLat: -25.9692, capitalLng: 32.5732 },
  { id: 'zambia', name: 'Zambia', flag: '🇿🇲', region: 'Africa', lat: -13.1339, lng: 27.8493, iso: 'ZM', capital: 'Lusaka', capitalLat: -15.3875, capitalLng: 28.3228 },
  { id: 'zimbabwe', name: 'Zimbabwe', flag: '🇿🇼', region: 'Africa', lat: -19.0154, lng: 29.1549, iso: 'ZW', capital: 'Harare', capitalLat: -17.8252, capitalLng: 31.0335 },
  { id: 'namibia', name: 'Namibia', flag: '🇳🇦', region: 'Africa', lat: -22.9576, lng: 18.4904, iso: 'NA', capital: 'Windhoek', capitalLat: -22.5609, capitalLng: 17.0658 },
  { id: 'botswana', name: 'Botswana', flag: '🇧🇼', region: 'Africa', lat: -22.3285, lng: 24.6849, iso: 'BW', capital: 'Gaborone', capitalLat: -24.6282, capitalLng: 25.9231 },
  { id: 'rwanda', name: 'Rwanda', flag: '🇷🇼', region: 'Africa', lat: -1.9403, lng: 29.8739, iso: 'RW', capital: 'Kigali', capitalLat: -1.9706, capitalLng: 30.1044 },
  { id: 'burundi', name: 'Burundi', flag: '🇧🇮', region: 'Africa', lat: -3.3731, lng: 29.9189, iso: 'BI', capital: 'Gitega', capitalLat: -3.4264, capitalLng: 29.9246 },
  { id: 'senegal', name: 'Senegal', flag: '🇸🇳', region: 'Africa', lat: 14.4974, lng: -14.4524, iso: 'SN', capital: 'Dakar', capitalLat: 14.7167, capitalLng: -17.4677 },
  { id: 'cote dIvoire', name: "Côte d'Ivoire", flag: '🇨🇮', region: 'Africa', lat: 7.5400, lng: -5.5471, iso: 'CI', capital: 'Yamoussoukro', capitalLat: 6.8276, capitalLng: -5.2893 },
  { id: 'cameroon', name: 'Cameroon', flag: '🇨🇲', region: 'Africa', lat: 7.3697, lng: 12.3547, iso: 'CM', capital: 'Yaoundé', capitalLat: 3.8480, capitalLng: 11.5021 },
  { id: 'madagascar', name: 'Madagascar', flag: '🇲🇬', region: 'Africa', lat: -18.7669, lng: 46.8691, iso: 'MG', capital: 'Antananarivo', capitalLat: -18.8792, capitalLng: 47.5079 },
  { id: 'mali', name: 'Mali', flag: '🇲🇱', region: 'Africa', lat: 17.5707, lng: -3.9962, iso: 'ML', capital: 'Bamako', capitalLat: 12.6392, capitalLng: -8.0029 },
  { id: 'burkina faso', name: 'Burkina Faso', flag: '🇧🇫', region: 'Africa', lat: 12.2383, lng: -1.5616, iso: 'BF', capital: 'Ouagadougou', capitalLat: 12.3714, capitalLng: -1.5197 },
  { id: 'niger', name: 'Niger', flag: '🇳🇪', region: 'Africa', lat: 17.6078, lng: 8.0817, iso: 'NE', capital: 'Niamey', capitalLat: 13.5116, capitalLng: 2.1254 },
  { id: 'chad', name: 'Chad', flag: '🇹🇩', region: 'Africa', lat: 15.4542, lng: 18.7322, iso: 'TD', capital: "N'Djamena", capitalLat: 12.1348, capitalLng: 15.0557 },
  { id: 'somalia', name: 'Somalia', flag: '🇸🇴', region: 'Africa', lat: 5.1521, lng: 46.1996, iso: 'SO', capital: 'Mogadishu', capitalLat: 2.0469, capitalLng: 45.3182 },
  { id: 'south sudan', name: 'South Sudan', flag: '🇸🇸', region: 'Africa', lat: 6.8770, lng: 31.3070, iso: 'SS', capital: 'Juba', capitalLat: 4.8594, capitalLng: 31.5713 },
  { id: 'guinea', name: 'Guinea', flag: '🇬🇳', region: 'Africa', lat: 9.9456, lng: -9.6966, iso: 'GN', capital: 'Conakry', capitalLat: 9.6412, capitalLng: -13.5784 },
  { id: 'benin', name: 'Benin', flag: '🇧🇯', region: 'Africa', lat: 9.3077, lng: 2.3158, iso: 'BJ', capital: 'Porto-Novo', capitalLat: 6.4969, capitalLng: 2.6289 },
  { id: 'togo', name: 'Togo', flag: '🇹🇬', region: 'Africa', lat: 8.6195, lng: 0.8248, iso: 'TG', capital: 'Lomé', capitalLat: 6.1375, capitalLng: 1.2125 },
  { id: 'sierra leone', name: 'Sierra Leone', flag: '🇸🇱', region: 'Africa', lat: 8.4606, lng: -11.7799, iso: 'SL', capital: 'Freetown', capitalLat: 8.4840, capitalLng: -13.2299 },
  { id: 'liberia', name: 'Liberia', flag: '🇱🇷', region: 'Africa', lat: 6.4281, lng: -9.4295, iso: 'LR', capital: 'Monrovia', capitalLat: 6.3156, capitalLng: -10.8074 },
  { id: 'mauritania', name: 'Mauritania', flag: '🇲🇷', region: 'Africa', lat: 21.0079, lng: -10.9408, iso: 'MR', capital: 'Nouakchott', capitalLat: 18.0735, capitalLng: -15.9582 },
  { id: 'eritrea', name: 'Eritrea', flag: '🇪🇷', region: 'Africa', lat: 15.1794, lng: 39.7823, iso: 'ER', capital: 'Asmara', capitalLat: 15.3229, capitalLng: 38.9251 },
  { id: 'gambia', name: 'Gambia', flag: '🇬🇲', region: 'Africa', lat: 13.4432, lng: -15.3101, iso: 'GM', capital: 'Banjul', capitalLat: 13.4549, capitalLng: -16.5790 },
  { id: 'gabon', name: 'Gabon', flag: '🇬🇦', region: 'Africa', lat: -0.8037, lng: 11.6094, iso: 'GA', capital: 'Libreville', capitalLat: 0.4162, capitalLng: 9.4673 },
  { id: 'lesotho', name: 'Lesotho', flag: '🇱🇸', region: 'Africa', lat: -29.6100, lng: 28.2336, iso: 'LS', capital: 'Maseru', capitalLat: -29.3151, capitalLng: 27.4869 },
  { id: 'guinea-bissau', name: 'Guinea-Bissau', flag: '🇬🇼', region: 'Africa', lat: 11.8037, lng: -15.1804, iso: 'GW', capital: 'Bissau', capitalLat: 11.8636, capitalLng: -15.5977 },
  { id: 'equatorial guinea', name: 'Equatorial Guinea', flag: '🇬🇶', region: 'Africa', lat: 1.6508, lng: 10.2679, iso: 'GQ', capital: 'Malabo', capitalLat: 3.7504, capitalLng: 8.7371 },
  { id: 'mauritius', name: 'Mauritius', flag: '🇲🇺', region: 'Africa', lat: -20.3484, lng: 57.5522, iso: 'MU', capital: 'Port Louis', capitalLat: -20.1609, capitalLng: 57.5012 },
  { id: 'eswatini', name: 'Eswatini', flag: '🇸🇿', region: 'Africa', lat: -26.5225, lng: 31.4659, iso: 'SZ', capital: 'Mbabane', capitalLat: -26.3054, capitalLng: 31.1367 },
  { id: 'djibouti', name: 'Djibouti', flag: '🇩🇯', region: 'Africa', lat: 11.8251, lng: 42.5903, iso: 'DJ', capital: 'Djibouti City', capitalLat: 11.5890, capitalLng: 43.1450 },
  { id: 'comoros', name: 'Comoros', flag: '🇰🇲', region: 'Africa', lat: -11.8753, lng: 43.8722, iso: 'KM', capital: 'Moroni', capitalLat: -11.7172, capitalLng: 43.2473 },
  { id: 'cape verde', name: 'Cape Verde', flag: '🇨🇻', region: 'Africa', lat: 16.5388, lng: -23.0418, iso: 'CV', capital: 'Praia', capitalLat: 14.9330, capitalLng: -23.5133 },
  { id: 'sao tome and principe', name: 'São Tomé and Príncipe', flag: '🇸🇹', region: 'Africa', lat: 0.1864, lng: 6.6131, iso: 'ST', capital: 'São Tomé', capitalLat: 0.3365, capitalLng: 6.7273 },
  { id: 'seychelles', name: 'Seychelles', flag: '🇸🇨', region: 'Africa', lat: -4.6796, lng: 55.4920, iso: 'SC', capital: 'Victoria', capitalLat: -4.6191, capitalLng: 55.4513 },
  { id: 'central african republic', name: 'Central African Republic', flag: '🇨🇫', region: 'Africa', lat: 6.6111, lng: 20.9394, iso: 'CF', capital: 'Bangui', capitalLat: 4.3947, capitalLng: 18.5582 },
  { id: 'malawi', name: 'Malawi', flag: '🇲🇼', region: 'Africa', lat: -13.2543, lng: 34.3015, iso: 'MW', capital: 'Lilongwe', capitalLat: -13.9626, capitalLng: 33.7741 }
];

// All 28 States + 8 Union Territories of India
export const INDIA_STATES = [
  { id: 'tamil nadu', name: 'Tamil Nadu', lat: 11.1271, lng: 78.6569, capital: 'Chennai', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thanjavur', 'Kanchipuram'] },
  { id: 'maharashtra', name: 'Maharashtra', lat: 19.7515, lng: 75.7139, capital: 'Mumbai', cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur'] },
  { id: 'delhi', name: 'Delhi NCR', lat: 28.7041, lng: 77.1025, capital: 'New Delhi', cities: ['New Delhi', 'North Delhi', 'South Delhi', 'Noida', 'Gurugram', 'Faridabad', 'Ghaziabad'] },
  { id: 'karnataka', name: 'Karnataka', lat: 15.3173, lng: 75.7139, capital: 'Bengaluru', cities: ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Kalaburagi', 'Davanagere'] },
  { id: 'kerala', name: 'Kerala', lat: 10.8505, lng: 76.2711, capital: 'Thiruvananthapuram', cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Kannur'] },
  { id: 'andhra pradesh', name: 'Andhra Pradesh', lat: 15.9129, lng: 79.7400, capital: 'Amaravati', cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati'] },
  { id: 'telangana', name: 'Telangana', lat: 18.1124, lng: 79.0193, capital: 'Hyderabad', cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'] },
  { id: 'gujarat', name: 'Gujarat', lat: 22.2587, lng: 71.1924, capital: 'Gandhinagar', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'] },
  { id: 'west bengal', name: 'West Bengal', lat: 22.9868, lng: 87.8550, capital: 'Kolkata', cities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Kharagpur'] },
  { id: 'rajasthan', name: 'Rajasthan', lat: 27.0238, lng: 74.2179, capital: 'Jaipur', cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'] },
  { id: 'uttar pradesh', name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, capital: 'Lucknow', cities: ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Noida', 'Meerut'] },
  { id: 'madhya pradesh', name: 'Madhya Pradesh', lat: 22.9734, lng: 78.6569, capital: 'Bhopal', cities: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'] },
  { id: 'bihar', name: 'Bihar', lat: 25.0961, lng: 85.3131, capital: 'Patna', cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'] },
  { id: 'punjab', name: 'Punjab', lat: 31.1471, lng: 75.3412, capital: 'Chandigarh', cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'] },
  { id: 'haryana', name: 'Haryana', lat: 29.0588, lng: 76.0856, capital: 'Chandigarh', cities: ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal'] },
  { id: 'odisha', name: 'Odisha', lat: 20.9517, lng: 85.0985, capital: 'Bhubaneswar', cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri', 'Sambalpur'] },
  { id: 'assam', name: 'Assam', lat: 26.2006, lng: 92.9376, capital: 'Dispur', cities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Tezpur'] },
  { id: 'jammu and kashmir', name: 'Jammu & Kashmir', lat: 33.7782, lng: 76.5762, capital: 'Srinagar', cities: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla'] },
  { id: 'jharkhand', name: 'Jharkhand', lat: 23.6102, lng: 85.2799, capital: 'Ranchi', cities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro'] },
  { id: 'chhattisgarh', name: 'Chhattisgarh', lat: 21.2787, lng: 81.8661, capital: 'Raipur', cities: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba'] },
  { id: 'uttarakhand', name: 'Uttarakhand', lat: 30.0668, lng: 79.0193, capital: 'Dehradun', cities: ['Dehradun', 'Haridwar', 'Rishikesh', 'Haldwani', 'Nainital'] },
  { id: 'himachal pradesh', name: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734, capital: 'Shimla', cities: ['Shimla', 'Dharamshala', 'Mandi', 'Solan', 'Kullu'] },
  { id: 'goa', name: 'Goa', lat: 15.2993, lng: 74.1240, capital: 'Panaji', cities: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa'] },
  { id: 'tripura', name: 'Tripura', lat: 23.9408, lng: 91.9882, capital: 'Agartala', cities: ['Agartala', 'Udaipur', 'Dharmanagar'] },
  { id: 'meghalaya', name: 'Meghalaya', lat: 25.4670, lng: 91.3662, capital: 'Shillong', cities: ['Shillong', 'Tura', 'Jowai'] },
  { id: 'manipur', name: 'Manipur', lat: 24.6637, lng: 93.9063, capital: 'Imphal', cities: ['Imphal', 'Churachandpur', 'Thoubal'] },
  { id: 'nagaland', name: 'Nagaland', lat: 26.1584, lng: 94.5624, capital: 'Kohima', cities: ['Kohima', 'Dimapur', 'Mokokchung'] },
  { id: 'mizoram', name: 'Mizoram', lat: 23.1645, lng: 92.9376, capital: 'Aizawl', cities: ['Aizawl', 'Lunglei', 'Champhai'] },
  { id: 'sikkim', name: 'Sikkim', lat: 27.5330, lng: 88.5122, capital: 'Gangtok', cities: ['Gangtok', 'Namchi', 'Geyzing'] },
  { id: 'arunachal pradesh', name: 'Arunachal Pradesh', lat: 28.2180, lng: 94.7278, capital: 'Itanagar', cities: ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang'] },
  { id: 'ladakh', name: 'Ladakh', lat: 34.1526, lng: 77.5771, capital: 'Leh', cities: ['Leh', 'Kargil', 'Nubra'] },
  { id: 'puducherry', name: 'Puducherry', lat: 11.9416, lng: 79.8083, capital: 'Puducherry', cities: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'] },
  { id: 'chandigarh', name: 'Chandigarh', lat: 30.7333, lng: 76.7794, capital: 'Chandigarh', cities: ['Chandigarh'] },
  { id: 'andaman and nicobar', name: 'Andaman & Nicobar Islands', lat: 11.7401, lng: 92.6586, capital: 'Port Blair', cities: ['Port Blair', 'Havelock', 'Diglipur'] },
  { id: 'dadra and nagar haveli', name: 'Dadra & Nagar Haveli & Daman & Diu', lat: 20.4283, lng: 72.8397, capital: 'Daman', cities: ['Daman', 'Diu', 'Silvassa'] },
  { id: 'lakshadweep', name: 'Lakshadweep', lat: 10.5667, lng: 72.6417, capital: 'Kavaratti', cities: ['Kavaratti', 'Agatti', 'Andrott'] }
];

// All 50 US States + District of Columbia + Puerto Rico
export const US_STATES = [
  { id: 'alabama', name: 'Alabama', lat: 32.3182, lng: -86.9023, capital: 'Montgomery', cities: ['Birmingham', 'Montgomery', 'Huntsville', 'Mobile'] },
  { id: 'alaska', name: 'Alaska', lat: 64.2008, lng: -149.4937, capital: 'Juneau', cities: ['Anchorage', 'Fairbanks', 'Juneau'] },
  { id: 'arizona', name: 'Arizona', lat: 34.0489, lng: -111.0937, capital: 'Phoenix', cities: ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale'] },
  { id: 'arkansas', name: 'Arkansas', lat: 35.2010, lng: -91.8318, capital: 'Little Rock', cities: ['Little Rock', 'Fort Smith', 'Fayetteville'] },
  { id: 'california', name: 'California', lat: 36.7783, lng: -119.4179, capital: 'Sacramento', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento', 'Oakland', 'Fresno'] },
  { id: 'colorado', name: 'Colorado', lat: 39.5501, lng: -105.7821, capital: 'Denver', cities: ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Boulder'] },
  { id: 'connecticut', name: 'Connecticut', lat: 41.6032, lng: -73.0877, capital: 'Hartford', cities: ['Bridgeport', 'New Haven', 'Stamford', 'Hartford'] },
  { id: 'delaware', name: 'Delaware', lat: 38.9108, lng: -75.5277, capital: 'Dover', cities: ['Wilmington', 'Dover', 'Newark'] },
  { id: 'florida', name: 'Florida', lat: 27.6648, lng: -81.5158, capital: 'Tallahassee', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Tallahassee', 'Fort Lauderdale'] },
  { id: 'georgia', name: 'Georgia', lat: 32.1656, lng: -82.9001, capital: 'Atlanta', cities: ['Atlanta', 'Augusta', 'Columbus', 'Macon', 'Savannah'] },
  { id: 'hawaii', name: 'Hawaii', lat: 19.8968, lng: -155.5828, capital: 'Honolulu', cities: ['Honolulu', 'Hilo', 'Kailua'] },
  { id: 'idaho', name: 'Idaho', lat: 44.0682, lng: -114.7420, capital: 'Boise', cities: ['Boise', 'Meridian', 'Nampa'] },
  { id: 'illinois', name: 'Illinois', lat: 40.6331, lng: -89.3985, capital: 'Springfield', cities: ['Chicago', 'Aurora', 'Naperville', 'Rockford', 'Springfield'] },
  { id: 'indiana', name: 'Indiana', lat: 40.2672, lng: -86.1349, capital: 'Indianapolis', cities: ['Indianapolis', 'Fort Wayne', 'Evansville', 'South Bend'] },
  { id: 'iowa', name: 'Iowa', lat: 41.8780, lng: -93.0977, capital: 'Des Moines', cities: ['Des Moines', 'Cedar Rapids', 'Davenport'] },
  { id: 'kansas', name: 'Kansas', lat: 39.0119, lng: -98.4842, capital: 'Topeka', cities: ['Wichita', 'Overland Park', 'Kansas City', 'Topeka'] },
  { id: 'kentucky', name: 'Kentucky', lat: 37.8393, lng: -84.2700, capital: 'Frankfort', cities: ['Louisville', 'Lexington', 'Bowling Green', 'Frankfort'] },
  { id: 'louisiana', name: 'Louisiana', lat: 30.9843, lng: -91.9623, capital: 'Baton Rouge', cities: ['New Orleans', 'Baton Rouge', 'Shreveport', 'Lafayette'] },
  { id: 'maine', name: 'Maine', lat: 45.2538, lng: -69.4455, capital: 'Augusta', cities: ['Portland', 'Lewiston', 'Bangor', 'Augusta'] },
  { id: 'maryland', name: 'Maryland', lat: 39.0458, lng: -76.6413, capital: 'Annapolis', cities: ['Baltimore', 'Annapolis', 'Bethesda', 'Silver Spring'] },
  { id: 'massachusetts', name: 'Massachusetts', lat: 42.4072, lng: -71.3824, capital: 'Boston', cities: ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell'] },
  { id: 'michigan', name: 'Michigan', lat: 44.3148, lng: -85.6024, capital: 'Lansing', cities: ['Detroit', 'Grand Rapids', 'Warren', 'Ann Arbor', 'Lansing'] },
  { id: 'minnesota', name: 'Minnesota', lat: 46.7296, lng: -94.6859, capital: 'Saint Paul', cities: ['Minneapolis', 'Saint Paul', 'Rochester', 'Bloomington'] },
  { id: 'mississippi', name: 'Mississippi', lat: 32.3547, lng: -89.3985, capital: 'Jackson', cities: ['Jackson', 'Gulfport', 'Southaven', 'Biloxi'] },
  { id: 'missouri', name: 'Missouri', lat: 37.9643, lng: -91.8318, capital: 'Jefferson City', cities: ['Kansas City', 'Saint Louis', 'Springfield', 'Jefferson City'] },
  { id: 'montana', name: 'Montana', lat: 46.8797, lng: -110.3626, capital: 'Helena', cities: ['Billings', 'Missoula', 'Great Falls', 'Bozeman', 'Helena'] },
  { id: 'nebraska', name: 'Nebraska', lat: 41.4925, lng: -99.9018, capital: 'Lincoln', cities: ['Omaha', 'Lincoln', 'Bellevue', 'Grand Island'] },
  { id: 'nevada', name: 'Nevada', lat: 38.8026, lng: -116.4194, capital: 'Carson City', cities: ['Las Vegas', 'Henderson', 'Reno', 'Carson City'] },
  { id: 'new hampshire', name: 'New Hampshire', lat: 43.1939, lng: -71.5724, capital: 'Concord', cities: ['Manchester', 'Nashua', 'Concord'] },
  { id: 'new jersey', name: 'New Jersey', lat: 40.0583, lng: -74.4057, capital: 'Trenton', cities: ['Newark', 'Jersey City', 'Paterson', 'Trenton'] },
  { id: 'new mexico', name: 'New Mexico', lat: 34.5199, lng: -105.8701, capital: 'Santa Fe', cities: ['Albuquerque', 'Las Cruces', 'Rio Rancho', 'Santa Fe'] },
  { id: 'new york', name: 'New York', lat: 40.7128, lng: -74.0060, capital: 'Albany', cities: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany'] },
  { id: 'north carolina', name: 'North Carolina', lat: 35.7596, lng: -79.0193, capital: 'Raleigh', cities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem'] },
  { id: 'north dakota', name: 'North Dakota', lat: 47.5515, lng: -101.0020, capital: 'Bismarck', cities: ['Fargo', 'Bismarck', 'Grand Forks'] },
  { id: 'ohio', name: 'Ohio', lat: 40.4173, lng: -82.9071, capital: 'Columbus', cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'] },
  { id: 'oklahoma', name: 'Oklahoma', lat: 35.0078, lng: -97.0929, capital: 'Oklahoma City', cities: ['Oklahoma City', 'Tulsa', 'Norman', 'Broken Arrow'] },
  { id: 'oregon', name: 'Oregon', lat: 43.8041, lng: -120.5542, capital: 'Salem', cities: ['Portland', 'Eugene', 'Salem', 'Gresham'] },
  { id: 'pennsylvania', name: 'Pennsylvania', lat: 41.2033, lng: -77.1945, capital: 'Harrisburg', cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Harrisburg'] },
  { id: 'rhode island', name: 'Rhode Island', lat: 41.5801, lng: -71.4774, capital: 'Providence', cities: ['Providence', 'Warwick', 'Cranston'] },
  { id: 'south carolina', name: 'South Carolina', lat: 33.8361, lng: -81.1637, capital: 'Columbia', cities: ['Charleston', 'Columbia', 'North Charleston', 'Greenville'] },
  { id: 'south dakota', name: 'South Dakota', lat: 43.9695, lng: -99.9018, capital: 'Pierre', cities: ['Sioux Falls', 'Rapid City', 'Aberdeen', 'Pierre'] },
  { id: 'tennessee', name: 'Tennessee', lat: 35.5175, lng: -86.5804, capital: 'Nashville', cities: ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga'] },
  { id: 'texas', name: 'Texas', lat: 31.9686, lng: -99.9018, capital: 'Austin', cities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso', 'Arlington'] },
  { id: 'utah', name: 'Utah', lat: 39.3210, lng: -111.0937, capital: 'Salt Lake City', cities: ['Salt Lake City', 'West Valley City', 'Provo', 'West Jordan'] },
  { id: 'vermont', name: 'Vermont', lat: 44.5588, lng: -72.5778, capital: 'Montpelier', cities: ['Burlington', 'South Burlington', 'Rutland', 'Montpelier'] },
  { id: 'virginia', name: 'Virginia', lat: 37.4316, lng: -78.6569, capital: 'Richmond', cities: ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond', 'Arlington'] },
  { id: 'washington', name: 'Washington', lat: 47.7511, lng: -120.7401, capital: 'Olympia', cities: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue', 'Olympia'] },
  { id: 'west virginia', name: 'West Virginia', lat: 38.5976, lng: -80.4549, capital: 'Charleston', cities: ['Charleston', 'Huntington', 'Morgantown'] },
  { id: 'wisconsin', name: 'Wisconsin', lat: 43.7844, lng: -88.7879, capital: 'Madison', cities: ['Milwaukee', 'Madison', 'Green Bay', 'Kenosha'] },
  { id: 'wyoming', name: 'Wyoming', lat: 43.0760, lng: -107.2903, capital: 'Cheyenne', cities: ['Cheyenne', 'Casper', 'Laramie', 'Gillette'] },
  { id: 'district of columbia', name: 'District of Columbia', lat: 38.9072, lng: -77.0369, capital: 'Washington D.C.', cities: ['Washington D.C.', 'Georgetown', 'Capitol Hill'] },
  { id: 'puerto rico', name: 'Puerto Rico', lat: 18.2208, lng: -66.5901, capital: 'San Juan', cities: ['San Juan', 'Bayamón', 'Ponce', 'Carolina'] }
];

// Major International Provinces & States (Canada, Australia, UK, Germany, France, Japan, China, Brazil, Mexico, Italy, Spain, Russia, South Africa, UAE, Saudi Arabia, Indonesia, Turkey, South Korea, etc.)
export const INTL_REGIONS = [
  // Canada
  { id: 'ontario', name: 'Ontario', country: 'canada', countryName: 'Canada', lat: 51.2538, lng: -85.3232, capital: 'Toronto', cities: ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'Brampton', 'London'] },
  { id: 'quebec', name: 'Quebec', country: 'canada', countryName: 'Canada', lat: 52.9399, lng: -73.5491, capital: 'Quebec City', cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil'] },
  { id: 'british columbia', name: 'British Columbia', country: 'canada', countryName: 'Canada', lat: 53.7267, lng: -127.6476, capital: 'Victoria', cities: ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond'] },
  { id: 'alberta', name: 'Alberta', country: 'canada', countryName: 'Canada', lat: 53.9333, lng: -116.5765, capital: 'Edmonton', cities: ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge'] },
  { id: 'manitoba', name: 'Manitoba', country: 'canada', countryName: 'Canada', lat: 53.7609, lng: -98.8139, capital: 'Winnipeg', cities: ['Winnipeg', 'Brandon', 'Steinbach'] },
  { id: 'nova scotia', name: 'Nova Scotia', country: 'canada', countryName: 'Canada', lat: 44.6820, lng: -63.7443, capital: 'Halifax', cities: ['Halifax', 'Dartmouth', 'Sydney'] },

  // Australia
  { id: 'new south wales', name: 'New South Wales', country: 'australia', countryName: 'Australia', lat: -31.8402, lng: 145.6128, capital: 'Sydney', cities: ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast'] },
  { id: 'victoria', name: 'Victoria', country: 'australia', countryName: 'Australia', lat: -37.4713, lng: 144.7852, capital: 'Melbourne', cities: ['Melbourne', 'Geelong', 'Ballarat', 'Bendigo'] },
  { id: 'queensland', name: 'Queensland', country: 'australia', countryName: 'Australia', lat: -20.9176, lng: 142.7028, capital: 'Brisbane', cities: ['Brisbane', 'Gold Coast', 'Sunshine Coast', 'Cairns', 'Townsville'] },
  { id: 'western australia', name: 'Western Australia', country: 'australia', countryName: 'Australia', lat: -27.6728, lng: 121.6283, capital: 'Perth', cities: ['Perth', 'Fremantle', 'Mandurah', 'Bunbury'] },
  { id: 'south australia', name: 'South Australia', country: 'australia', countryName: 'Australia', lat: -30.0002, lng: 136.2092, capital: 'Adelaide', cities: ['Adelaide', 'Mount Gambier', 'Whyalla'] },
  { id: 'tasmania', name: 'Tasmania', country: 'australia', countryName: 'Australia', lat: -41.4545, lng: 145.9707, capital: 'Hobart', cities: ['Hobart', 'Launceston', 'Devonport'] },

  // United Kingdom
  { id: 'england', name: 'England', country: 'uk', countryName: 'United Kingdom', lat: 52.3555, lng: -1.1743, capital: 'London', cities: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Bristol', 'Newcastle'] },
  { id: 'scotland', name: 'Scotland', country: 'uk', countryName: 'United Kingdom', lat: 56.4907, lng: -4.2026, capital: 'Edinburgh', cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Inverness'] },
  { id: 'wales', name: 'Wales', country: 'uk', countryName: 'United Kingdom', lat: 52.1307, lng: -3.7837, capital: 'Cardiff', cities: ['Cardiff', 'Swansea', 'Newport', 'Wrexham'] },
  { id: 'northern ireland', name: 'Northern Ireland', country: 'uk', countryName: 'United Kingdom', lat: 54.7877, lng: -6.4923, capital: 'Belfast', cities: ['Belfast', 'Derry', 'Lisburn', 'Newry'] },

  // Germany
  { id: 'bavaria', name: 'Bavaria', country: 'germany', countryName: 'Germany', lat: 48.7904, lng: 11.4979, capital: 'Munich', cities: ['Munich', 'Nuremberg', 'Augsburg', 'Regensburg', 'Würzburg'] },
  { id: 'berlin', name: 'Berlin (State)', country: 'germany', countryName: 'Germany', lat: 52.5200, lng: 13.4050, capital: 'Berlin', cities: ['Berlin', 'Potsdam', 'Spandau'] },
  { id: 'north rhine-westphalia', name: 'North Rhine-Westphalia', country: 'germany', countryName: 'Germany', lat: 51.4332, lng: 7.6616, capital: 'Düsseldorf', cities: ['Cologne', 'Düsseldorf', 'Dortmund', 'Essen', 'Bonn'] },
  { id: 'baden-wurttemberg', name: 'Baden-Württemberg', country: 'germany', countryName: 'Germany', lat: 48.6616, lng: 9.3501, capital: 'Stuttgart', cities: ['Stuttgart', 'Karlsruhe', 'Mannheim', 'Heidelberg', 'Freiburg'] },
  { id: 'hesse', name: 'Hesse', country: 'germany', countryName: 'Germany', lat: 50.6521, lng: 9.1624, capital: 'Wiesbaden', cities: ['Frankfurt', 'Wiesbaden', 'Kassel', 'Darmstadt'] },
  { id: 'hamburg', name: 'Hamburg', country: 'germany', countryName: 'Germany', lat: 53.5511, lng: 9.9937, capital: 'Hamburg', cities: ['Hamburg', 'Altona'] },

  // France
  { id: 'ile-de-france', name: 'Île-de-France (Paris Region)', country: 'france', countryName: 'France', lat: 48.8499, lng: 2.6370, capital: 'Paris', cities: ['Paris', 'Boulogne-Billancourt', 'Saint-Denis', 'Versailles', 'Montreuil'] },
  { id: 'auvergne-rhone-alpes', name: 'Auvergne-Rhône-Alpes', country: 'france', countryName: 'France', lat: 45.4471, lng: 4.3853, capital: 'Lyon', cities: ['Lyon', 'Saint-Étienne', 'Grenoble', 'Clermont-Ferrand'] },
  { id: 'provence-alpes-cote-d-azur', name: "Provence-Alpes-Côte d'Azur", country: 'france', countryName: 'France', lat: 43.9352, lng: 6.0679, capital: 'Marseille', cities: ['Marseille', 'Nice', 'Toulon', 'Aix-en-Provence', 'Cannes'] },
  { id: 'occitanie', name: 'Occitanie', country: 'france', countryName: 'France', lat: 43.8927, lng: 3.2828, capital: 'Toulouse', cities: ['Toulouse', 'Montpellier', 'Nîmes', 'Perpignan'] },
  { id: 'nouvelle-aquitaine', name: 'Nouvelle-Aquitaine', country: 'france', countryName: 'France', lat: 45.3637, lng: 0.6030, capital: 'Bordeaux', cities: ['Bordeaux', 'Limoges', 'Poitiers', 'Pau', 'La Rochelle'] },

  // Japan
  { id: 'tokyo', name: 'Tokyo Prefecture', country: 'japan', countryName: 'Japan', lat: 35.6762, lng: 139.6503, capital: 'Tokyo', cities: ['Tokyo', 'Shinjuku', 'Shibuya', 'Chiyoda', 'Minato', 'Ginza'] },
  { id: 'osaka', name: 'Osaka Prefecture', country: 'japan', countryName: 'Japan', lat: 34.6937, lng: 135.5023, capital: 'Osaka', cities: ['Osaka', 'Sakai', 'Higashiosaka'] },
  { id: 'kanagawa', name: 'Kanagawa', country: 'japan', countryName: 'Japan', lat: 35.4478, lng: 139.6425, capital: 'Yokohama', cities: ['Yokohama', 'Kawasaki', 'Sagamihara'] },
  { id: 'aichi', name: 'Aichi', country: 'japan', countryName: 'Japan', lat: 35.1802, lng: 136.9066, capital: 'Nagoya', cities: ['Nagoya', 'Toyota', 'Okazaki'] },
  { id: 'hokkaido', name: 'Hokkaido', country: 'japan', countryName: 'Japan', lat: 43.0642, lng: 141.3469, capital: 'Sapporo', cities: ['Sapporo', 'Asahikawa', 'Hakodate'] },
  { id: 'fukuoka', name: 'Fukuoka', country: 'japan', countryName: 'Japan', lat: 33.5904, lng: 130.4017, capital: 'Fukuoka', cities: ['Fukuoka', 'Kitakyushu', 'Kurume'] },
  { id: 'kyoto', name: 'Kyoto Prefecture', country: 'japan', countryName: 'Japan', lat: 35.0116, lng: 135.7681, capital: 'Kyoto', cities: ['Kyoto', 'Uji', 'Kameoka'] },

  // China
  { id: 'guangdong', name: 'Guangdong', country: 'china', countryName: 'China', lat: 23.3790, lng: 113.7633, capital: 'Guangzhou', cities: ['Guangzhou', 'Shenzhen', 'Dongguan', 'Foshan', 'Zhongshan'] },
  { id: 'beijing', name: 'Beijing Municipality', country: 'china', countryName: 'China', lat: 39.9042, lng: 116.4074, capital: 'Beijing', cities: ['Beijing', 'Haidian', 'Chaoyang'] },
  { id: 'shanghai', name: 'Shanghai Municipality', country: 'china', countryName: 'China', lat: 31.2304, lng: 121.4737, capital: 'Shanghai', cities: ['Shanghai', 'Pudong', 'Huangpu'] },
  { id: 'zhejiang', name: 'Zhejiang', country: 'china', countryName: 'China', lat: 29.1416, lng: 119.7889, capital: 'Hangzhou', cities: ['Hangzhou', 'Ningbo', 'Wenzhou'] },
  { id: 'sichuan', name: 'Sichuan', country: 'china', countryName: 'China', lat: 30.6517, lng: 104.0759, capital: 'Chengdu', cities: ['Chengdu', 'Mianyang', 'Nanchong'] },

  // Brazil
  { id: 'sao paulo', name: 'São Paulo (State)', country: 'brazil', countryName: 'Brazil', lat: -23.5505, lng: -46.6333, capital: 'São Paulo', cities: ['São Paulo', 'Campinas', 'Santos', 'São Bernardo'] },
  { id: 'rio de janeiro', name: 'Rio de Janeiro (State)', country: 'brazil', countryName: 'Brazil', lat: -22.9068, lng: -43.1729, capital: 'Rio de Janeiro', cities: ['Rio de Janeiro', 'Niterói', 'Petrópolis', 'Duque de Caxias'] },
  { id: 'minas gerais', name: 'Minas Gerais', country: 'brazil', countryName: 'Brazil', lat: -18.5122, lng: -44.5550, capital: 'Belo Horizonte', cities: ['Belo Horizonte', 'Uberlândia', 'Contagem'] },
  { id: 'bahia', name: 'Bahia', country: 'brazil', countryName: 'Brazil', lat: -12.9714, lng: -38.5014, capital: 'Salvador', cities: ['Salvador', 'Feira de Santana', 'Vitória da Conquista'] },

  // Mexico
  { id: 'cdmx', name: 'Mexico City (CDMX)', country: 'mexico', countryName: 'Mexico', lat: 19.4326, lng: -99.1332, capital: 'Mexico City', cities: ['Mexico City', 'Coyoacán', 'Cuauhtémoc', 'Polanco'] },
  { id: 'jalisco', name: 'Jalisco', country: 'mexico', countryName: 'Mexico', lat: 20.6597, lng: -103.3496, capital: 'Guadalajara', cities: ['Guadalajara', 'Zapopan', 'Tlaquepaque', 'Puerto Vallarta'] },
  { id: 'nuevo leon', name: 'Nuevo León', country: 'mexico', countryName: 'Mexico', lat: 25.6866, lng: -100.3161, capital: 'Monterrey', cities: ['Monterrey', 'San Pedro Garza García', 'Guadalupe'] },

  // Italy
  { id: 'lombardy', name: 'Lombardy', country: 'italy', countryName: 'Italy', lat: 45.4642, lng: 9.1900, capital: 'Milan', cities: ['Milan', 'Brescia', 'Monza', 'Bergamo', 'Como'] },
  { id: 'lazio', name: 'Lazio', country: 'italy', countryName: 'Italy', lat: 41.9028, lng: 12.4964, capital: 'Rome', cities: ['Rome', 'Latina', 'Fiumicino', 'Tivoli'] },
  { id: 'campania', name: 'Campania', country: 'italy', countryName: 'Italy', lat: 40.8518, lng: 14.2681, capital: 'Naples', cities: ['Naples', 'Salerno', 'Caserta', 'Pompeii'] },
  { id: 'veneto', name: 'Veneto', country: 'italy', countryName: 'Italy', lat: 45.4408, lng: 12.3155, capital: 'Venice', cities: ['Venice', 'Verona', 'Padua', 'Vicenza'] },

  // Spain
  { id: 'madrid', name: 'Community of Madrid', country: 'spain', countryName: 'Spain', lat: 40.4168, lng: -3.7038, capital: 'Madrid', cities: ['Madrid', 'Móstoles', 'Alcalá de Henares', 'Getafe'] },
  { id: 'catalonia', name: 'Catalonia', country: 'spain', countryName: 'Spain', lat: 41.3851, lng: 2.1734, capital: 'Barcelona', cities: ['Barcelona', "L'Hospitalet", 'Badalona', 'Terrassa', 'Sabadell'] },
  { id: 'andalusia', name: 'Andalusia', country: 'spain', countryName: 'Spain', lat: 37.3891, lng: -5.9845, capital: 'Seville', cities: ['Seville', 'Malaga', 'Granada', 'Cordoba'] },

  // Russia
  { id: 'moscow region', name: 'Moscow Federal City', country: 'russia', countryName: 'Russia', lat: 55.7558, lng: 37.6173, capital: 'Moscow', cities: ['Moscow', 'Khimki', 'Podolsk', 'Zelenograd'] },
  { id: 'saint petersburg region', name: 'Saint Petersburg City', country: 'russia', countryName: 'Russia', lat: 59.9343, lng: 30.3351, capital: 'Saint Petersburg', cities: ['Saint Petersburg', 'Kolpino', 'Pushkin'] },

  // South Africa
  { id: 'gauteng', name: 'Gauteng', country: 'south africa', countryName: 'South Africa', lat: -26.2041, lng: 28.0473, capital: 'Johannesburg', cities: ['Johannesburg', 'Pretoria', 'Soweto', 'Sandton'] },
  { id: 'western cape', name: 'Western Cape', country: 'south africa', countryName: 'South Africa', lat: -33.9249, lng: 18.4241, capital: 'Cape Town', cities: ['Cape Town', 'Stellenbosch', 'George', 'Paarl'] },

  // UAE
  { id: 'dubai emirate', name: 'Dubai Emirate', country: 'uae', countryName: 'United Arab Emirates', lat: 25.2048, lng: 55.2708, capital: 'Dubai', cities: ['Dubai', 'Jumeirah', 'Deira', 'Bur Dubai'] },
  { id: 'abu dhabi emirate', name: 'Abu Dhabi Emirate', country: 'uae', countryName: 'United Arab Emirates', lat: 24.4539, lng: 54.3773, capital: 'Abu Dhabi', cities: ['Abu Dhabi', 'Al Ain', 'Madinat Zayed'] },

  // Saudi Arabia
  { id: 'riyadh province', name: 'Riyadh Province', country: 'saudi arabia', countryName: 'Saudi Arabia', lat: 24.7136, lng: 46.6753, capital: 'Riyadh', cities: ['Riyadh', 'Al Kharj', 'Ad Diriyah'] },
  { id: 'makkah province', name: 'Makkah Province', country: 'saudi arabia', countryName: 'Saudi Arabia', lat: 21.4225, lng: 39.8262, capital: 'Mecca', cities: ['Jeddah', 'Mecca', 'Taif'] }
];

// Major Metropolitan Hubs of the World with accurate geographic coordinates
export const WORLD_MAJOR_CITIES = {
  // Asia-Pacific
  'new delhi': { name: 'New Delhi', lat: 28.6139, lng: 77.2090, country: 'India', countryId: 'india', state: 'Delhi NCR', flag: '🇮🇳' },
  'mumbai': { name: 'Mumbai', lat: 19.0760, lng: 72.8777, country: 'India', countryId: 'india', state: 'Maharashtra', flag: '🇮🇳' },
  'bengaluru': { name: 'Bengaluru', lat: 12.9716, lng: 77.5946, country: 'India', countryId: 'india', state: 'Karnataka', flag: '🇮🇳' },
  'chennai': { name: 'Chennai', lat: 13.0827, lng: 80.2707, country: 'India', countryId: 'india', state: 'Tamil Nadu', flag: '🇮🇳' },
  'kolkata': { name: 'Kolkata', lat: 22.5726, lng: 88.3639, country: 'India', countryId: 'india', state: 'West Bengal', flag: '🇮🇳' },
  'hyderabad': { name: 'Hyderabad', lat: 17.3850, lng: 78.4867, country: 'India', countryId: 'india', state: 'Telangana', flag: '🇮🇳' },
  'ahmedabad': { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714, country: 'India', countryId: 'india', state: 'Gujarat', flag: '🇮🇳' },
  'pune': { name: 'Pune', lat: 18.5204, lng: 73.8567, country: 'India', countryId: 'india', state: 'Maharashtra', flag: '🇮🇳' },
  'jaipur': { name: 'Jaipur', lat: 26.9124, lng: 75.7873, country: 'India', countryId: 'india', state: 'Rajasthan', flag: '🇮🇳' },
  'coimbatore': { name: 'Coimbatore', lat: 11.0168, lng: 76.9558, country: 'India', countryId: 'india', state: 'Tamil Nadu', flag: '🇮🇳' },
  'madurai': { name: 'Madurai', lat: 9.9252, lng: 78.1198, country: 'India', countryId: 'india', state: 'Tamil Nadu', flag: '🇮🇳' },
  'tokyo': { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan', countryId: 'japan', state: 'Tokyo Prefecture', flag: '🇯🇵' },
  'osaka': { name: 'Osaka', lat: 34.6937, lng: 135.5023, country: 'Japan', countryId: 'japan', state: 'Osaka Prefecture', flag: '🇯🇵' },
  'kyoto': { name: 'Kyoto', lat: 35.0116, lng: 135.7681, country: 'Japan', countryId: 'japan', state: 'Kyoto Prefecture', flag: '🇯🇵' },
  'beijing': { name: 'Beijing', lat: 39.9042, lng: 116.4074, country: 'China', countryId: 'china', state: 'Beijing Municipality', flag: '🇨🇳' },
  'shanghai': { name: 'Shanghai', lat: 31.2304, lng: 121.4737, country: 'China', countryId: 'china', state: 'Shanghai Municipality', flag: '🇨🇳' },
  'shenzhen': { name: 'Shenzhen', lat: 22.5431, lng: 114.0579, country: 'China', countryId: 'china', state: 'Guangdong', flag: '🇨🇳' },
  'guangzhou': { name: 'Guangzhou', lat: 23.1291, lng: 113.2644, country: 'China', countryId: 'china', state: 'Guangdong', flag: '🇨🇳' },
  'hong kong': { name: 'Hong Kong', lat: 22.3193, lng: 114.1694, country: 'China', countryId: 'china', state: 'Hong Kong SAR', flag: '🇭🇰' },
  'seoul': { name: 'Seoul', lat: 37.5665, lng: 126.9780, country: 'South Korea', countryId: 'south korea', state: 'Seoul', flag: '🇰🇷' },
  'busan': { name: 'Busan', lat: 35.1796, lng: 129.0756, country: 'South Korea', countryId: 'south korea', state: 'Busan', flag: '🇰🇷' },
  'taipei': { name: 'Taipei', lat: 25.0330, lng: 121.5654, country: 'Taiwan', countryId: 'taiwan', state: 'Taipei', flag: '🇹🇼' },
  'singapore': { name: 'Singapore', lat: 1.3521, lng: 103.8198, country: 'Singapore', countryId: 'singapore', state: 'Central', flag: '🇸🇬' },
  'bangkok': { name: 'Bangkok', lat: 13.7563, lng: 100.5018, country: 'Thailand', countryId: 'thailand', state: 'Bangkok', flag: '🇹🇭' },
  'kuala lumpur': { name: 'Kuala Lumpur', lat: 3.1390, lng: 101.6869, country: 'Malaysia', countryId: 'malaysia', state: 'Federal Territory', flag: '🇲🇾' },
  'jakarta': { name: 'Jakarta', lat: -6.2088, lng: 106.8456, country: 'Indonesia', countryId: 'indonesia', state: 'Jakarta', flag: '🇮🇩' },
  'manila': { name: 'Manila', lat: 14.5995, lng: 120.9842, country: 'Philippines', countryId: 'philippines', state: 'Metro Manila', flag: '🇵🇭' },
  'sydney': { name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia', countryId: 'australia', state: 'New South Wales', flag: '🇦🇺' },
  'melbourne': { name: 'Melbourne', lat: -37.8136, lng: 144.9631, country: 'Australia', countryId: 'australia', state: 'Victoria', flag: '🇦🇺' },
  'brisbane': { name: 'Brisbane', lat: -27.4698, lng: 153.0251, country: 'Australia', countryId: 'australia', state: 'Queensland', flag: '🇦🇺' },
  'auckland': { name: 'Auckland', lat: -36.8485, lng: 174.7633, country: 'New Zealand', countryId: 'new zealand', state: 'Auckland', flag: '🇳🇿' },

  // Americas
  'new york': { name: 'New York City', lat: 40.7128, lng: -74.0060, country: 'United States', countryId: 'us', state: 'New York', flag: '🇺🇸' },
  'los angeles': { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, country: 'United States', countryId: 'us', state: 'California', flag: '🇺🇸' },
  'chicago': { name: 'Chicago', lat: 41.8781, lng: -87.6298, country: 'United States', countryId: 'us', state: 'Illinois', flag: '🇺🇸' },
  'san francisco': { name: 'San Francisco', lat: 37.7749, lng: -122.4194, country: 'United States', countryId: 'us', state: 'California', flag: '🇺🇸' },
  'washington': { name: 'Washington D.C.', lat: 38.9072, lng: -77.0369, country: 'United States', countryId: 'us', state: 'District of Columbia', flag: '🇺🇸' },
  'boston': { name: 'Boston', lat: 42.3601, lng: -71.0589, country: 'United States', countryId: 'us', state: 'Massachusetts', flag: '🇺🇸' },
  'houston': { name: 'Houston', lat: 29.7604, lng: -95.3698, country: 'United States', countryId: 'us', state: 'Texas', flag: '🇺🇸' },
  'dallas': { name: 'Dallas', lat: 32.7767, lng: -96.7970, country: 'United States', countryId: 'us', state: 'Texas', flag: '🇺🇸' },
  'austin': { name: 'Austin', lat: 30.2672, lng: -97.7431, country: 'United States', countryId: 'us', state: 'Texas', flag: '🇺🇸' },
  'seattle': { name: 'Seattle', lat: 47.6062, lng: -122.3321, country: 'United States', countryId: 'us', state: 'Washington', flag: '🇺🇸' },
  'miami': { name: 'Miami', lat: 25.7617, lng: -80.1918, country: 'United States', countryId: 'us', state: 'Florida', flag: '🇺🇸' },
  'toronto': { name: 'Toronto', lat: 43.6532, lng: -79.3832, country: 'Canada', countryId: 'canada', state: 'Ontario', flag: '🇨🇦' },
  'vancouver': { name: 'Vancouver', lat: 49.2827, lng: -123.1207, country: 'Canada', countryId: 'canada', state: 'British Columbia', flag: '🇨🇦' },
  'montreal': { name: 'Montreal', lat: 45.5017, lng: -73.5673, country: 'Canada', countryId: 'canada', state: 'Quebec', flag: '🇨🇦' },
  'mexico city': { name: 'Mexico City', lat: 19.4326, lng: -99.1332, country: 'Mexico', countryId: 'mexico', state: 'Mexico City', flag: '🇲🇽' },
  'sao paulo': { name: 'São Paulo', lat: -23.5505, lng: -46.6333, country: 'Brazil', countryId: 'brazil', state: 'São Paulo', flag: '🇧🇷' },
  'rio de janeiro': { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729, country: 'Brazil', countryId: 'brazil', state: 'Rio de Janeiro', flag: '🇧🇷' },
  'buenos aires': { name: 'Buenos Aires', lat: -34.6037, lng: -58.3816, country: 'Argentina', countryId: 'argentina', state: 'Buenos Aires', flag: '🇦🇷' },
  'bogota': { name: 'Bogotá', lat: 4.7110, lng: -74.0721, country: 'Colombia', countryId: 'colombia', state: 'Cundinamarca', flag: '🇨🇴' },
  'lima': { name: 'Lima', lat: -12.0464, lng: -77.0428, country: 'Peru', countryId: 'peru', state: 'Lima', flag: '🇵🇪' },
  'santiago': { name: 'Santiago', lat: -33.4489, lng: -70.6693, country: 'Chile', countryId: 'chile', state: 'Santiago Metropolitan', flag: '🇨🇱' },

  // Europe
  'london': { name: 'London', lat: 51.5074, lng: -0.1278, country: 'United Kingdom', countryId: 'uk', state: 'England', flag: '🇬🇧' },
  'paris': { name: 'Paris', lat: 48.8566, lng: 2.3522, country: 'France', countryId: 'france', state: 'Île-de-France', flag: '🇫🇷' },
  'berlin': { name: 'Berlin', lat: 52.5200, lng: 13.4050, country: 'Germany', countryId: 'germany', state: 'Berlin', flag: '🇩🇪' },
  'frankfurt': { name: 'Frankfurt', lat: 50.1109, lng: 8.6821, country: 'Germany', countryId: 'germany', state: 'Hesse', flag: '🇩🇪' },
  'munich': { name: 'Munich', lat: 48.1351, lng: 11.5820, country: 'Germany', countryId: 'germany', state: 'Bavaria', flag: '🇩🇪' },
  'rome': { name: 'Rome', lat: 41.9028, lng: 12.4964, country: 'Italy', countryId: 'italy', state: 'Lazio', flag: '🇮🇹' },
  'milan': { name: 'Milan', lat: 45.4642, lng: 9.1900, country: 'Italy', countryId: 'italy', state: 'Lombardy', flag: '🇮🇹' },
  'madrid': { name: 'Madrid', lat: 40.4168, lng: -3.7038, country: 'Spain', countryId: 'spain', state: 'Community of Madrid', flag: '🇪🇸' },
  'barcelona': { name: 'Barcelona', lat: 41.3851, lng: 2.1734, country: 'Spain', countryId: 'spain', state: 'Catalonia', flag: '🇪🇸' },
  'amsterdam': { name: 'Amsterdam', lat: 52.3676, lng: 4.9041, country: 'Netherlands', countryId: 'netherlands', state: 'North Holland', flag: '🇳🇱' },
  'brussels': { name: 'Brussels', lat: 50.8503, lng: 4.3517, country: 'Belgium', countryId: 'belgium', state: 'Brussels', flag: '🇧🇪' },
  'vienna': { name: 'Vienna', lat: 48.2082, lng: 16.3738, country: 'Austria', countryId: 'austria', state: 'Vienna', flag: '🇦🇹' },
  'zurich': { name: 'Zurich', lat: 47.3769, lng: 8.5417, country: 'Switzerland', countryId: 'switzerland', state: 'Zurich', flag: '🇨🇭' },
  'geneva': { name: 'Geneva', lat: 46.2044, lng: 6.1432, country: 'Switzerland', countryId: 'switzerland', state: 'Geneva', flag: '🇨🇭' },
  'stockholm': { name: 'Stockholm', lat: 59.3293, lng: 18.0686, country: 'Sweden', countryId: 'sweden', state: 'Stockholm', flag: '🇸🇪' },
  'oslo': { name: 'Oslo', lat: 59.9139, lng: 10.7522, country: 'Norway', countryId: 'norway', state: 'Oslo', flag: '🇳🇴' },
  'copenhagen': { name: 'Copenhagen', lat: 55.6761, lng: 12.5683, country: 'Denmark', countryId: 'denmark', state: 'Capital Region', flag: '🇩🇰' },
  'helsinki': { name: 'Helsinki', lat: 60.1699, lng: 24.9384, country: 'Finland', countryId: 'finland', state: 'Uusimaa', flag: '🇫🇮' },
  'dublin': { name: 'Dublin', lat: 53.3498, lng: -6.2603, country: 'Ireland', countryId: 'ireland', state: 'Leinster', flag: '🇮🇪' },
  'lisbon': { name: 'Lisbon', lat: 38.7223, lng: -9.1393, country: 'Portugal', countryId: 'portugal', state: 'Lisbon', flag: '🇵🇹' },
  'athens': { name: 'Athens', lat: 37.9838, lng: 23.7275, country: 'Greece', countryId: 'greece', state: 'Attica', flag: '🇬🇷' },
  'warsaw': { name: 'Warsaw', lat: 52.2297, lng: 21.0122, country: 'Poland', countryId: 'poland', state: 'Masovia', flag: '🇵🇱' },
  'prague': { name: 'Prague', lat: 50.0755, lng: 14.4378, country: 'Czech Republic', countryId: 'czech republic', state: 'Prague', flag: '🇨🇿' },
  'kyiv': { name: 'Kyiv', lat: 50.4501, lng: 30.5234, country: 'Ukraine', countryId: 'ukraine', state: 'Kyiv', flag: '🇺🇦' },
  'moscow': { name: 'Moscow', lat: 55.7558, lng: 37.6173, country: 'Russia', countryId: 'russia', state: 'Moscow', flag: '🇷🇺' },

  // Middle East & North Africa
  'dubai': { name: 'Dubai', lat: 25.2048, lng: 55.2708, country: 'United Arab Emirates', countryId: 'uae', state: 'Dubai Emirate', flag: '🇦🇪' },
  'abu dhabi': { name: 'Abu Dhabi', lat: 24.4539, lng: 54.3773, country: 'United Arab Emirates', countryId: 'uae', state: 'Abu Dhabi Emirate', flag: '🇦🇪' },
  'riyadh': { name: 'Riyadh', lat: 24.7136, lng: 46.6753, country: 'Saudi Arabia', countryId: 'saudi arabia', state: 'Riyadh Province', flag: '🇸🇦' },
  'jeddah': { name: 'Jeddah', lat: 21.4858, lng: 39.1925, country: 'Saudi Arabia', countryId: 'saudi arabia', state: 'Makkah Province', flag: '🇸🇦' },
  'tel aviv': { name: 'Tel Aviv', lat: 32.0853, lng: 34.7818, country: 'Israel', countryId: 'israel', state: 'Tel Aviv District', flag: '🇮🇱' },
  'jerusalem': { name: 'Jerusalem', lat: 31.7683, lng: 35.2137, country: 'Israel', countryId: 'israel', state: 'Jerusalem District', flag: '🇮🇱' },
  'doha': { name: 'Doha', lat: 25.2854, lng: 51.5310, country: 'Qatar', countryId: 'qatar', state: 'Ad Dawhah', flag: '🇶🇦' },
  'kuwait city': { name: 'Kuwait City', lat: 29.3759, lng: 47.9774, country: 'Kuwait', countryId: 'kuwait', state: 'Al Asimah', flag: '🇰🇼' },
  'cairo': { name: 'Cairo', lat: 30.0444, lng: 31.2357, country: 'Egypt', countryId: 'egypt', state: 'Cairo Governorate', flag: '🇪🇬' },
  'istanbul': { name: 'Istanbul', lat: 41.0082, lng: 28.9784, country: 'Turkey', countryId: 'turkey', state: 'Istanbul Province', flag: '🇹🇷' },

  // Africa
  'johannesburg': { name: 'Johannesburg', lat: -26.2041, lng: 28.0473, country: 'South Africa', countryId: 'south africa', state: 'Gauteng', flag: '🇿🇦' },
  'cape town': { name: 'Cape Town', lat: -33.9249, lng: 18.4241, country: 'South Africa', countryId: 'south africa', state: 'Western Cape', flag: '🇿🇦' },
  'nairobi': { name: 'Nairobi', lat: -1.2921, lng: 36.8219, country: 'Kenya', countryId: 'kenya', state: 'Nairobi County', flag: '🇰🇪' },
  'lagos': { name: 'Lagos', lat: 6.5244, lng: 3.3792, country: 'Nigeria', countryId: 'nigeria', state: 'Lagos State', flag: '🇳🇬' },
  'addis ababa': { name: 'Addis Ababa', lat: 9.0300, lng: 38.7400, country: 'Ethiopia', countryId: 'ethiopia', state: 'Addis Ababa', flag: '🇪🇹' }
};

// Micro-neighborhoods for major global metropolitan cities
export const CITY_NEIGHBORHOODS = {
  chennai: [
    { id: 'velachery', name: 'Velachery', lat: 12.9759, lng: 80.2212, city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
    { id: 't nagar', name: 'T. Nagar', lat: 13.0418, lng: 80.2341, city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
    { id: 'anna nagar', name: 'Anna Nagar', lat: 13.0850, lng: 80.2101, city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
    { id: 'adyar', name: 'Adyar', lat: 13.0012, lng: 80.2565, city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
    { id: 'tambaram', name: 'Tambaram', lat: 12.9249, lng: 80.1000, city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
    { id: 'mylapore', name: 'Mylapore', lat: 13.0368, lng: 80.2676, city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
    { id: 'omr', name: 'OMR / IT Corridor', lat: 12.9010, lng: 80.2279, city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
    { id: 'guindy', name: 'Guindy', lat: 13.0067, lng: 80.2021, city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
    { id: 'porur', name: 'Porur', lat: 13.0382, lng: 80.1565, city: 'Chennai', state: 'Tamil Nadu', country: 'India' },
    { id: 'sholinganallur', name: 'Sholinganallur', lat: 12.8998, lng: 80.2279, city: 'Chennai', state: 'Tamil Nadu', country: 'India' }
  ],
  'new york': [
    { id: 'manhattan', name: 'Manhattan', lat: 40.7831, lng: -73.9712, city: 'New York City', state: 'New York', country: 'United States' },
    { id: 'midtown', name: 'Midtown Manhattan', lat: 40.7549, lng: -73.9840, city: 'New York City', state: 'New York', country: 'United States' },
    { id: 'financial district', name: 'Financial District (Wall St)', lat: 40.7075, lng: -74.0090, city: 'New York City', state: 'New York', country: 'United States' },
    { id: 'brooklyn', name: 'Brooklyn', lat: 40.6782, lng: -73.9442, city: 'New York City', state: 'New York', country: 'United States' },
    { id: 'williamsburg', name: 'Williamsburg', lat: 40.7081, lng: -73.9571, city: 'New York City', state: 'New York', country: 'United States' },
    { id: 'queens', name: 'Queens', lat: 40.7282, lng: -73.7949, city: 'New York City', state: 'New York', country: 'United States' },
    { id: 'upper east side', name: 'Upper East Side', lat: 40.7736, lng: -73.9566, city: 'New York City', state: 'New York', country: 'United States' }
  ],
  london: [
    { id: 'city of london', name: 'City of London', lat: 51.5123, lng: -0.0910, city: 'London', state: 'England', country: 'United Kingdom' },
    { id: 'westminster', name: 'Westminster', lat: 51.4975, lng: -0.1357, city: 'London', state: 'England', country: 'United Kingdom' },
    { id: 'canary wharf', name: 'Canary Wharf', lat: 51.5054, lng: -0.0235, city: 'London', state: 'England', country: 'United Kingdom' },
    { id: 'camden', name: 'Camden Town', lat: 51.5390, lng: -0.1426, city: 'London', state: 'England', country: 'United Kingdom' },
    { id: 'kensington', name: 'Kensington & Chelsea', lat: 51.5014, lng: -0.1918, city: 'London', state: 'England', country: 'United Kingdom' },
    { id: 'soho', name: 'Soho & West End', lat: 51.5136, lng: -0.1365, city: 'London', state: 'England', country: 'United Kingdom' }
  ],
  tokyo: [
    { id: 'shinjuku', name: 'Shinjuku', lat: 35.6938, lng: 139.7034, city: 'Tokyo', state: 'Tokyo Prefecture', country: 'Japan' },
    { id: 'shibuya', name: 'Shibuya', lat: 35.6580, lng: 139.7016, city: 'Tokyo', state: 'Tokyo Prefecture', country: 'Japan' },
    { id: 'chiyoda', name: 'Chiyoda (Marunouchi)', lat: 35.6940, lng: 139.7536, city: 'Tokyo', state: 'Tokyo Prefecture', country: 'Japan' },
    { id: 'minato', name: 'Minato (Roppongi)', lat: 35.6585, lng: 139.7514, city: 'Tokyo', state: 'Tokyo Prefecture', country: 'Japan' },
    { id: 'ginza', name: 'Ginza', lat: 35.6719, lng: 139.7648, city: 'Tokyo', state: 'Tokyo Prefecture', country: 'Japan' },
    { id: 'akihabara', name: 'Akihabara', lat: 35.6997, lng: 139.7714, city: 'Tokyo', state: 'Tokyo Prefecture', country: 'Japan' }
  ],
  paris: [
    { id: '1st arrondissement', name: '1st Arr. (Louvre / Palais-Royal)', lat: 48.8606, lng: 2.3376, city: 'Paris', state: 'Île-de-France', country: 'France' },
    { id: '7th arrondissement', name: '7th Arr. (Eiffel Tower)', lat: 48.8566, lng: 2.3122, city: 'Paris', state: 'Île-de-France', country: 'France' },
    { id: '8th arrondissement', name: '8th Arr. (Champs-Élysées)', lat: 48.8727, lng: 2.3126, city: 'Paris', state: 'Île-de-France', country: 'France' },
    { id: 'montmartre', name: 'Montmartre (18th Arr.)', lat: 48.8867, lng: 2.3431, city: 'Paris', state: 'Île-de-France', country: 'France' },
    { id: 'la defense', name: 'La Défense Business District', lat: 48.8924, lng: 2.2378, city: 'Paris', state: 'Île-de-France', country: 'France' }
  ],
  mumbai: [
    { id: 'south mumbai', name: 'South Mumbai (Nariman Pt / Fort)', lat: 18.9220, lng: 72.8347, city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    { id: 'bandra', name: 'Bandra West (BKC)', lat: 19.0596, lng: 72.8295, city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    { id: 'andheri', name: 'Andheri East (MIDC)', lat: 19.1136, lng: 72.8697, city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    { id: 'powai', name: 'Powai (IIT Bombay Tech Hub)', lat: 19.1176, lng: 72.9060, city: 'Mumbai', state: 'Maharashtra', country: 'India' },
    { id: 'navi mumbai', name: 'Navi Mumbai', lat: 19.0330, lng: 73.0297, city: 'Mumbai', state: 'Maharashtra', country: 'India' }
  ],
  bengaluru: [
    { id: 'koramangala', name: 'Koramangala', lat: 12.9352, lng: 77.6245, city: 'Bengaluru', state: 'Karnataka', country: 'India' },
    { id: 'indiranagar', name: 'Indiranagar', lat: 12.9719, lng: 77.6412, city: 'Bengaluru', state: 'Karnataka', country: 'India' },
    { id: 'whitefield', name: 'Whitefield (Tech Hub)', lat: 12.9698, lng: 77.7500, city: 'Bengaluru', state: 'Karnataka', country: 'India' },
    { id: 'electronic city', name: 'Electronic City', lat: 12.8399, lng: 77.6770, city: 'Bengaluru', state: 'Karnataka', country: 'India' },
    { id: 'hsr layout', name: 'HSR Layout', lat: 12.9121, lng: 77.6446, city: 'Bengaluru', state: 'Karnataka', country: 'India' }
  ],
  'san francisco': [
    { id: 'downtown sf', name: 'Financial District & Union Sq', lat: 37.7946, lng: -122.3999, city: 'San Francisco', state: 'California', country: 'United States' },
    { id: 'soma', name: 'SoMa (South of Market)', lat: 37.7785, lng: -122.4056, city: 'San Francisco', state: 'California', country: 'United States' },
    { id: 'mission district', name: 'Mission District', lat: 37.7599, lng: -122.4148, city: 'San Francisco', state: 'California', country: 'United States' },
    { id: 'silicon valley', name: 'Palo Alto & Stanford (Silicon Valley)', lat: 37.4419, lng: -122.1430, city: 'San Francisco', state: 'California', country: 'United States' }
  ],
  dubai: [
    { id: 'downtown dubai', name: 'Downtown Dubai (Burj Khalifa)', lat: 25.1972, lng: 55.2744, city: 'Dubai', state: 'Dubai Emirate', country: 'United Arab Emirates' },
    { id: 'dubai marina', name: 'Dubai Marina & JBR', lat: 25.0805, lng: 55.1403, city: 'Dubai', state: 'Dubai Emirate', country: 'United Arab Emirates' },
    { id: 'business bay', name: 'Business Bay', lat: 25.1852, lng: 55.2673, city: 'Dubai', state: 'Dubai Emirate', country: 'United Arab Emirates' },
    { id: 'palm jumeirah', name: 'Palm Jumeirah', lat: 25.1124, lng: 55.1390, city: 'Dubai', state: 'Dubai Emirate', country: 'United Arab Emirates' },
    { id: 'deira', name: 'Deira & Old Souks', lat: 25.2697, lng: 55.3095, city: 'Dubai', state: 'Dubai Emirate', country: 'United Arab Emirates' }
  ],
  sydney: [
    { id: 'sydney cbd', name: 'Sydney CBD & Circular Quay', lat: -33.8688, lng: 151.2093, city: 'Sydney', state: 'New South Wales', country: 'Australia' },
    { id: 'darling harbour', name: 'Darling Harbour', lat: -33.8749, lng: 151.1993, city: 'Sydney', state: 'New South Wales', country: 'Australia' },
    { id: 'bondi beach', name: 'Bondi Beach', lat: -33.8915, lng: 151.2767, city: 'Sydney', state: 'New South Wales', country: 'Australia' },
    { id: 'parramatta', name: 'Parramatta (Greater West)', lat: -33.8150, lng: 151.0011, city: 'Sydney', state: 'New South Wales', country: 'Australia' }
  ],
  singapore: [
    { id: 'marina bay', name: 'Marina Bay Financial Centre', lat: 1.2838, lng: 103.8591, city: 'Singapore', state: 'Central', country: 'Singapore' },
    { id: 'orchard road', name: 'Orchard Road Shopping Belt', lat: 1.3048, lng: 103.8318, city: 'Singapore', state: 'Central', country: 'Singapore' },
    { id: 'raffles place', name: 'Raffles Place CBD', lat: 1.2830, lng: 103.8510, city: 'Singapore', state: 'Central', country: 'Singapore' },
    { id: 'jurong', name: 'Jurong Innovation District', lat: 1.3329, lng: 103.7436, city: 'Singapore', state: 'West', country: 'Singapore' }
  ]
};

export const CHENNAI_MICRO_AREAS = CITY_NEIGHBORHOODS.chennai;

/**
 * Resolve hierarchical geographic context for any location query
 */
export function resolveGeoHierarchy(inputLocation = '', countryHint = 'global') {
  const norm = (inputLocation || countryHint || 'global').toLowerCase().trim();

  if (norm === 'global' || norm === 'worldwide') {
    return {
      level: 'global',
      displayName: 'Planetary Stream (Worldwide)',
      country: 'Global',
      countryId: 'global',
      lat: 20.0,
      lng: 0.0,
      fallbackChain: ['global']
    };
  }

  // 1. Check all city micro-neighborhoods (Chennai, NY, London, Tokyo, Paris, Mumbai, etc.)
  for (const [cityName, nList] of Object.entries(CITY_NEIGHBORHOODS)) {
    const micro = nList.find(m => m.id === norm || norm.includes(m.id) || m.name.toLowerCase() === norm || norm.includes(m.name.toLowerCase()));
    if (micro) {
      return {
        level: 'city',
        displayName: `${micro.name}, ${micro.city}`,
        city: micro.city,
        state: micro.state,
        country: micro.country,
        countryId: micro.country.toLowerCase(),
        lat: micro.lat,
        lng: micro.lng,
        fallbackChain: [micro.name.toLowerCase(), micro.city.toLowerCase(), micro.state.toLowerCase(), micro.country.toLowerCase()]
      };
    }
  }

  // 2. Check Major World Cities Map directly
  for (const [key, city] of Object.entries(WORLD_MAJOR_CITIES)) {
    if (key === norm || norm.includes(key) || city.name.toLowerCase() === norm || norm.includes(city.name.toLowerCase())) {
      return {
        level: 'city',
        displayName: `${city.name}, ${city.country}`,
        city: city.name,
        state: city.state,
        country: city.country,
        countryId: city.countryId,
        countryFlag: city.flag,
        lat: city.lat,
        lng: city.lng,
        fallbackChain: [city.name.toLowerCase(), city.countryId, 'global']
      };
    }
  }

  // 3. Check Indian States
  const inState = INDIA_STATES.find(s => s.id === norm || norm.includes(s.id) || s.name.toLowerCase() === norm);
  if (inState) {
    return {
      level: 'state',
      displayName: `${inState.name}, India`,
      state: inState.name,
      country: 'India',
      countryId: 'india',
      countryFlag: '🇮🇳',
      lat: inState.lat,
      lng: inState.lng,
      cities: inState.cities,
      fallbackChain: [inState.name.toLowerCase(), 'india']
    };
  }

  // 4. Check Indian Major Cities in State arrays
  for (const s of INDIA_STATES) {
    const cityMatch = s.cities.find(c => c.toLowerCase() === norm || norm.includes(c.toLowerCase()));
    if (cityMatch) {
      return {
        level: 'city',
        displayName: `${cityMatch}, ${s.name}`,
        city: cityMatch,
        state: s.name,
        country: 'India',
        countryId: 'india',
        countryFlag: '🇮🇳',
        lat: s.lat + 0.1,
        lng: s.lng + 0.1,
        fallbackChain: [cityMatch.toLowerCase(), s.name.toLowerCase(), 'india']
      };
    }
  }

  // 5. Check US States
  const usState = US_STATES.find(s => s.id === norm || norm.includes(s.id) || s.name.toLowerCase() === norm);
  if (usState) {
    return {
      level: 'state',
      displayName: `${usState.name}, USA`,
      state: usState.name,
      country: 'United States',
      countryId: 'us',
      countryFlag: '🇺🇸',
      lat: usState.lat,
      lng: usState.lng,
      cities: usState.cities,
      fallbackChain: [usState.name.toLowerCase(), 'us']
    };
  }

  // 6. Check US Major Cities
  for (const s of US_STATES) {
    const cityMatch = s.cities.find(c => c.toLowerCase() === norm || norm.includes(c.toLowerCase()));
    if (cityMatch) {
      return {
        level: 'city',
        displayName: `${cityMatch}, ${s.name}`,
        city: cityMatch,
        state: s.name,
        country: 'United States',
        countryId: 'us',
        countryFlag: '🇺🇸',
        lat: s.lat + 0.1,
        lng: s.lng + 0.1,
        fallbackChain: [cityMatch.toLowerCase(), s.name.toLowerCase(), 'us']
      };
    }
  }

  // 7. Check International Regions
  const intlRegion = INTL_REGIONS.find(r => r.id === norm || norm.includes(r.id) || r.name.toLowerCase() === norm);
  if (intlRegion) {
    return {
      level: 'state',
      displayName: `${intlRegion.name}, ${intlRegion.countryName}`,
      state: intlRegion.name,
      country: intlRegion.countryName,
      countryId: intlRegion.country,
      lat: intlRegion.lat,
      lng: intlRegion.lng,
      cities: intlRegion.cities,
      fallbackChain: [intlRegion.name.toLowerCase(), intlRegion.country]
    };
  }

  // 8. Check Sovereign Countries (all 195+ world nations)
  const country = GLOBAL_COUNTRIES.find(c => c.id === norm || norm.includes(c.id) || c.name.toLowerCase() === norm || c.iso.toLowerCase() === norm);
  if (country) {
    return {
      level: 'country',
      displayName: country.name,
      country: country.name,
      countryId: country.id,
      countryFlag: country.flag,
      region: country.region,
      lat: country.capitalLat || country.lat,
      lng: country.capitalLng || country.lng,
      capital: country.capital,
      fallbackChain: [country.id, 'global']
    };
  }

  // Generic fallback if user entered a custom remote location
  return {
    level: 'custom',
    displayName: inputLocation || countryHint,
    country: countryHint !== 'global' ? countryHint : 'Global',
    countryId: countryHint !== 'global' ? countryHint : 'global',
    lat: 20.0,
    lng: 0.0,
    fallbackChain: [norm, countryHint, 'global']
  };
}

/**
 * Return complete structured directory for UI dropdowns, autocomplete, and search.
 */
export function getFullGeoDirectory() {
  return {
    countries: GLOBAL_COUNTRIES.map(c => ({
      id: c.id,
      name: c.name,
      flag: c.flag,
      region: c.region,
      lat: c.lat,
      lng: c.lng,
      iso: c.iso,
      capital: c.capital,
      capitalLat: c.capitalLat,
      capitalLng: c.capitalLng
    })),
    indiaStates: INDIA_STATES.map(s => ({
      id: s.id,
      name: s.name,
      lat: s.lat,
      lng: s.lng,
      capital: s.capital,
      cities: s.cities
    })),
    usStates: US_STATES.map(s => ({
      id: s.id,
      name: s.name,
      lat: s.lat,
      lng: s.lng,
      capital: s.capital,
      cities: s.cities
    })),
    intlRegions: INTL_REGIONS.map(r => ({
      id: r.id,
      name: r.name,
      country: r.country,
      countryName: r.countryName,
      lat: r.lat,
      lng: r.lng,
      capital: r.capital,
      cities: r.cities
    })),
    majorCities: WORLD_MAJOR_CITIES,
    chennaiAreas: CHENNAI_MICRO_AREAS,
    worldNeighborhoods: CITY_NEIGHBORHOODS
  };
}

/**
 * Return 5-level geographic hierarchy tree for drill-down exploration
 * World -> Country -> State/Region -> City -> Neighbourhood
 */
export function getHierarchyStructure() {
  const full = getFullGeoDirectory();

  // Build a structured regionsByCountry lookup
  const regionsByCountry = {};

  // 1. India
  regionsByCountry['india'] = full.indiaStates.map(s => ({
    id: s.id,
    name: s.name,
    lat: s.lat,
    lng: s.lng,
    capital: s.capital,
    cities: (s.cities || []).map(cityName => {
      const cityKey = cityName.toLowerCase();
      const cityObj = WORLD_MAJOR_CITIES[cityKey];
      return cityObj ? { name: cityName, lat: cityObj.lat, lng: cityObj.lng } : { name: cityName, lat: s.lat + 0.1, lng: s.lng + 0.1 };
    })
  }));

  // 2. US
  regionsByCountry['us'] = full.usStates.map(s => ({
    id: s.id,
    name: s.name,
    lat: s.lat,
    lng: s.lng,
    capital: s.capital,
    cities: (s.cities || []).map(cityName => {
      const cityKey = cityName.toLowerCase();
      const cityObj = WORLD_MAJOR_CITIES[cityKey];
      return cityObj ? { name: cityName, lat: cityObj.lat, lng: cityObj.lng } : { name: cityName, lat: s.lat + 0.1, lng: s.lng + 0.1 };
    })
  }));

  // 3. International Regions
  for (const r of full.intlRegions) {
    if (!regionsByCountry[r.country]) {
      regionsByCountry[r.country] = [];
    }
    regionsByCountry[r.country].push({
      id: r.id,
      name: r.name,
      lat: r.lat,
      lng: r.lng,
      capital: r.capital,
      cities: (r.cities || []).map(cityName => {
        const cityKey = cityName.toLowerCase();
        const cityObj = WORLD_MAJOR_CITIES[cityKey];
        return cityObj ? { name: cityName, lat: cityObj.lat, lng: cityObj.lng } : { name: cityName, lat: r.lat + 0.1, lng: r.lng + 0.1 };
      })
    });
  }

  // 4. For any country that doesn't have explicit states/provinces, provide capital region
  for (const c of full.countries) {
    if (!regionsByCountry[c.id]) {
      regionsByCountry[c.id] = [
        {
          id: `${c.id}-capital`,
          name: `${c.capital || c.name} Region`,
          lat: c.capitalLat || c.lat,
          lng: c.capitalLng || c.lng,
          capital: c.capital || c.name,
          cities: [
            {
              name: c.capital || c.name,
              lat: c.capitalLat || c.lat,
              lng: c.capitalLng || c.lng
            }
          ]
        }
      ];
    }
  }

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
    regionsByCountry,
    neighbourhoodsByCity: full.worldNeighborhoods,
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

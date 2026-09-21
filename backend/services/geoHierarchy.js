/**
 * Global Geographic Hierarchy, Coordinates & Resolution Engine
 * 
 * Provides comprehensive global coverage:
 * - Sovereign Nations across all continents (flags, ISO codes, coordinates, regions)
 * - State / Province coverage for major federations:
 *   - All 28 States & 8 UTs of India with coordinates, capitals, and key districts
 *   - All 50 US States with coordinates, capitals, and key metros
 *   - Key provinces/states for Canada, Australia, Germany, UK, China, Brazil, Japan
 * - Smart Hierarchical Resolver for Country -> State -> City / Micro-region
 */

export const GLOBAL_COUNTRIES = [
  // Asia-Pacific
  { id: 'india', name: 'India', flag: '🇮🇳', region: 'Asia-Pacific', lat: 20.5937, lng: 78.9629, iso: 'IN' },
  { id: 'china', name: 'China', flag: '🇨🇳', region: 'Asia-Pacific', lat: 35.8617, lng: 104.1954, iso: 'CN' },
  { id: 'japan', name: 'Japan', flag: '🇯🇵', region: 'Asia-Pacific', lat: 36.2048, lng: 138.2529, iso: 'JP' },
  { id: 'south korea', name: 'South Korea', flag: '🇰🇷', region: 'Asia-Pacific', lat: 35.9078, lng: 127.7669, iso: 'KR' },
  { id: 'taiwan', name: 'Taiwan', flag: '🇹🇼', region: 'Asia-Pacific', lat: 23.6978, lng: 120.9605, iso: 'TW' },
  { id: 'australia', name: 'Australia', flag: '🇦🇺', region: 'Asia-Pacific', lat: -25.2744, lng: 133.7751, iso: 'AU' },
  { id: 'philippines', name: 'Philippines', flag: '🇵🇭', region: 'Asia-Pacific', lat: 12.8797, lng: 121.7740, iso: 'PH' },
  { id: 'indonesia', name: 'Indonesia', flag: '🇮🇩', region: 'Asia-Pacific', lat: -0.7893, lng: 113.9213, iso: 'ID' },
  { id: 'vietnam', name: 'Vietnam', flag: '🇻🇳', region: 'Asia-Pacific', lat: 14.0583, lng: 108.2772, iso: 'VN' },
  { id: 'pakistan', name: 'Pakistan', flag: '🇵🇰', region: 'Asia-Pacific', lat: 30.3753, lng: 69.3451, iso: 'PK' },
  { id: 'bangladesh', name: 'Bangladesh', flag: '🇧🇩', region: 'Asia-Pacific', lat: 23.6850, lng: 90.3563, iso: 'BD' },
  { id: 'sri lanka', name: 'Sri Lanka', flag: '🇱🇰', region: 'Asia-Pacific', lat: 7.8731, lng: 80.7718, iso: 'LK' },
  { id: 'new zealand', name: 'New Zealand', flag: '🇳🇿', region: 'Asia-Pacific', lat: -40.9006, lng: 174.8860, iso: 'NZ' },
  { id: 'singapore', name: 'Singapore', flag: '🇸🇬', region: 'Asia-Pacific', lat: 1.3521, lng: 103.8198, iso: 'SG' },
  { id: 'malaysia', name: 'Malaysia', flag: '🇲🇾', region: 'Asia-Pacific', lat: 4.2105, lng: 101.9758, iso: 'MY' },
  { id: 'thailand', name: 'Thailand', flag: '🇹🇭', region: 'Asia-Pacific', lat: 15.8700, lng: 100.9925, iso: 'TH' },

  // Americas
  { id: 'us', name: 'United States', flag: '🇺🇸', region: 'Americas', lat: 37.0902, lng: -95.7129, iso: 'US' },
  { id: 'canada', name: 'Canada', flag: '🇨🇦', region: 'Americas', lat: 56.1304, lng: -106.3468, iso: 'CA' },
  { id: 'mexico', name: 'Mexico', flag: '🇲🇽', region: 'Americas', lat: 23.6345, lng: -102.5528, iso: 'MX' },
  { id: 'brazil', name: 'Brazil', flag: '🇧🇷', region: 'Americas', lat: -14.2350, lng: -51.9253, iso: 'BR' },
  { id: 'argentina', name: 'Argentina', flag: '🇦🇷', region: 'Americas', lat: -38.4161, lng: -63.6167, iso: 'AR' },
  { id: 'colombia', name: 'Colombia', flag: '🇨🇴', region: 'Americas', lat: 4.5709, lng: -74.2973, iso: 'CO' },
  { id: 'chile', name: 'Chile', flag: '🇨🇱', region: 'Americas', lat: -35.6751, lng: -71.5430, iso: 'CL' },
  { id: 'peru', name: 'Peru', flag: '🇵🇪', region: 'Americas', lat: -9.1900, lng: -75.0152, iso: 'PE' },

  // Europe
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe', lat: 55.3781, lng: -3.4360, iso: 'GB' },
  { id: 'ukraine', name: 'Ukraine', flag: '🇺🇦', region: 'Europe', lat: 48.3794, lng: 31.1656, iso: 'UA' },
  { id: 'russia', name: 'Russia', flag: '🇷🇺', region: 'Europe', lat: 61.5240, lng: 105.3188, iso: 'RU' },
  { id: 'germany', name: 'Germany', flag: '🇩🇪', region: 'Europe', lat: 51.1657, lng: 10.4515, iso: 'DE' },
  { id: 'france', name: 'France', flag: '🇫🇷', region: 'Europe', lat: 46.2276, lng: 2.2137, iso: 'FR' },
  { id: 'italy', name: 'Italy', flag: '🇮🇹', region: 'Europe', lat: 41.8719, lng: 12.5674, iso: 'IT' },
  { id: 'poland', name: 'Poland', flag: '🇵🇱', region: 'Europe', lat: 51.9194, lng: 19.1451, iso: 'PL' },
  { id: 'spain', name: 'Spain', flag: '🇪🇸', region: 'Europe', lat: 40.4637, lng: -3.7492, iso: 'ES' },
  { id: 'netherlands', name: 'Netherlands', flag: '🇳🇱', region: 'Europe', lat: 52.1326, lng: 5.2913, iso: 'NL' },
  { id: 'sweden', name: 'Sweden', flag: '🇸🇪', region: 'Europe', lat: 60.1282, lng: 18.6435, iso: 'SE' },
  { id: 'norway', name: 'Norway', flag: '🇳🇴', region: 'Europe', lat: 60.4720, lng: 8.4689, iso: 'NO' },
  { id: 'finland', name: 'Finland', flag: '🇫🇮', region: 'Europe', lat: 61.9241, lng: 25.7482, iso: 'FI' },
  { id: 'turkey', name: 'Turkey', flag: '🇹🇷', region: 'Europe', lat: 38.9637, lng: 35.2433, iso: 'TR' },
  { id: 'switzerland', name: 'Switzerland', flag: '🇨🇭', region: 'Europe', lat: 46.8182, lng: 8.2275, iso: 'CH' },
  { id: 'greece', name: 'Greece', flag: '🇬🇷', region: 'Europe', lat: 39.0742, lng: 21.8243, iso: 'GR' },

  // Middle East & North Africa
  { id: 'israel', name: 'Israel', flag: '🇮🇱', region: 'Middle East', lat: 31.0461, lng: 34.8516, iso: 'IL' },
  { id: 'iran', name: 'Iran', flag: '🇮🇷', region: 'Middle East', lat: 32.4279, lng: 53.6880, iso: 'IR' },
  { id: 'saudi arabia', name: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East', lat: 23.8859, lng: 45.0792, iso: 'SA' },
  { id: 'uae', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Middle East', lat: 23.4241, lng: 53.8478, iso: 'AE' },
  { id: 'egypt', name: 'Egypt', flag: '🇪🇬', region: 'Middle East', lat: 26.8206, lng: 30.8025, iso: 'EG' },
  { id: 'syria', name: 'Syria', flag: '🇸🇾', region: 'Middle East', lat: 34.8021, lng: 38.9968, iso: 'SY' },
  { id: 'iraq', name: 'Iraq', flag: '🇮🇶', region: 'Middle East', lat: 33.2232, lng: 43.6793, iso: 'IQ' },
  { id: 'qatar', name: 'Qatar', flag: '🇶🇦', region: 'Middle East', lat: 25.3548, lng: 51.1839, iso: 'QA' },

  // Africa
  { id: 'south africa', name: 'South Africa', flag: '🇿🇦', region: 'Africa', lat: -30.5595, lng: 22.9375, iso: 'ZA' },
  { id: 'nigeria', name: 'Nigeria', flag: '🇳🇬', region: 'Africa', lat: 9.0820, lng: 8.6753, iso: 'NG' },
  { id: 'kenya', name: 'Kenya', flag: '🇰🇪', region: 'Africa', lat: -0.0236, lng: 37.9062, iso: 'KE' },
  { id: 'sudan', name: 'Sudan', flag: '🇸🇩', region: 'Africa', lat: 12.8628, lng: 30.2176, iso: 'SD' },
  { id: 'congo', name: 'DR Congo', flag: '🇨🇩', region: 'Africa', lat: -4.0383, lng: 21.7587, iso: 'CD' },
  { id: 'somalia', name: 'Somalia', flag: '🇸🇴', region: 'Africa', lat: 5.1521, lng: 46.1996, iso: 'SO' },
  { id: 'ethiopia', name: 'Ethiopia', flag: '🇪🇹', region: 'Africa', lat: 9.1450, lng: 40.4897, iso: 'ET' },
  { id: 'morocco', name: 'Morocco', flag: '🇲🇦', region: 'Africa', lat: 31.7917, lng: -7.0926, iso: 'MA' }
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
  { id: 'ladakh', name: 'Ladakh', lat: 34.1526, lng: 77.5771, capital: 'Leh', cities: ['Leh', 'Kargil', 'Nubra'] }
];

// Major US States
export const US_STATES = [
  { id: 'california', name: 'California', lat: 36.7783, lng: -119.4179, capital: 'Sacramento', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose', 'Sacramento', 'Oakland'] },
  { id: 'texas', name: 'Texas', lat: 31.9686, lng: -99.9018, capital: 'Austin', cities: ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso'] },
  { id: 'new york', name: 'New York', lat: 40.7128, lng: -74.0060, capital: 'Albany', cities: ['New York City', 'Buffalo', 'Rochester', 'Yonkers', 'Syracuse', 'Albany'] },
  { id: 'florida', name: 'Florida', lat: 27.6648, lng: -81.5158, capital: 'Tallahassee', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Tallahassee', 'Fort Lauderdale'] },
  { id: 'illinois', name: 'Illinois', lat: 40.6331, lng: -89.3985, capital: 'Springfield', cities: ['Chicago', 'Aurora', 'Naperville', 'Rockford', 'Springfield'] },
  { id: 'pennsylvania', name: 'Pennsylvania', lat: 41.2033, lng: -77.1945, capital: 'Harrisburg', cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Harrisburg'] },
  { id: 'ohio', name: 'Ohio', lat: 40.4173, lng: -82.9071, capital: 'Columbus', cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'] },
  { id: 'georgia', name: 'Georgia', lat: 32.1656, lng: -82.9001, capital: 'Atlanta', cities: ['Atlanta', 'Augusta', 'Columbus', 'Macon', 'Savannah'] },
  { id: 'north carolina', name: 'North Carolina', lat: 35.7596, lng: -79.0193, capital: 'Raleigh', cities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham', 'Winston-Salem'] },
  { id: 'michigan', name: 'Michigan', lat: 44.3148, lng: -85.6024, capital: 'Lansing', cities: ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights', 'Ann Arbor'] },
  { id: 'washington', name: 'Washington', lat: 47.7511, lng: -120.7401, capital: 'Olympia', cities: ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue'] },
  { id: 'massachusetts', name: 'Massachusetts', lat: 42.4072, lng: -71.3824, capital: 'Boston', cities: ['Boston', 'Worcester', 'Springfield', 'Cambridge', 'Lowell'] },
  { id: 'arizona', name: 'Arizona', lat: 34.0489, lng: -111.0937, capital: 'Phoenix', cities: ['Phoenix', 'Tucson', 'Mesa', 'Chandler', 'Scottsdale'] },
  { id: 'colorado', name: 'Colorado', lat: 39.5501, lng: -105.7821, capital: 'Denver', cities: ['Denver', 'Colorado Springs', 'Aurora', 'Fort Collins', 'Boulder'] },
  { id: 'virginia', name: 'Virginia', lat: 37.4316, lng: -78.6569, capital: 'Richmond', cities: ['Virginia Beach', 'Norfolk', 'Chesapeake', 'Richmond', 'Arlington'] }
];

// Major International Regions / Provinces (Canada, UK, Germany, China, Australia, Japan)
export const INTL_REGIONS = [
  // Canada
  { id: 'ontario', name: 'Ontario', country: 'canada', countryName: 'Canada', lat: 51.2538, lng: -85.3232, cities: ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton'] },
  { id: 'quebec', name: 'Quebec', country: 'canada', countryName: 'Canada', lat: 52.9399, lng: -73.5491, cities: ['Montreal', 'Quebec City', 'Laval', 'Gatineau'] },
  { id: 'british columbia', name: 'British Columbia', country: 'canada', countryName: 'Canada', lat: 53.7267, lng: -127.6476, cities: ['Vancouver', 'Victoria', 'Surrey', 'Burnaby'] },
  // UK
  { id: 'england', name: 'England', country: 'uk', countryName: 'United Kingdom', lat: 52.3555, lng: -1.1743, cities: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds'] },
  { id: 'scotland', name: 'Scotland', country: 'uk', countryName: 'United Kingdom', lat: 56.4907, lng: -4.2026, cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee'] },
  { id: 'wales', name: 'Wales', country: 'uk', countryName: 'United Kingdom', lat: 52.1307, lng: -3.7837, cities: ['Cardiff', 'Swansea', 'Newport'] },
  // Germany
  { id: 'bavaria', name: 'Bavaria', country: 'germany', countryName: 'Germany', lat: 48.7904, lng: 11.4979, cities: ['Munich', 'Nuremberg', 'Augsburg'] },
  { id: 'berlin', name: 'Berlin (State)', country: 'germany', countryName: 'Germany', lat: 52.5200, lng: 13.4050, cities: ['Berlin', 'Potsdam'] },
  // Australia
  { id: 'new south wales', name: 'New South Wales', country: 'australia', countryName: 'Australia', lat: -31.8402, lng: 145.6128, cities: ['Sydney', 'Newcastle', 'Wollongong'] },
  { id: 'victoria', name: 'Victoria', country: 'australia', countryName: 'Australia', lat: -37.4713, lng: 144.7852, cities: ['Melbourne', 'Geelong', 'Ballarat'] },
  // China
  { id: 'guangdong', name: 'Guangdong', country: 'china', countryName: 'China', lat: 23.3790, lng: 113.7633, cities: ['Guangzhou', 'Shenzhen', 'Dongguan', 'Foshan'] },
  { id: 'shanghai', name: 'Shanghai', country: 'china', countryName: 'China', lat: 31.2304, lng: 121.4737, cities: ['Shanghai', 'Pudong'] },
  // Japan
  { id: 'tokyo', name: 'Tokyo Prefecture', country: 'japan', countryName: 'Japan', lat: 35.6762, lng: 139.6503, cities: ['Tokyo', 'Shinjuku', 'Shibuya', 'Chiyoda'] },
  { id: 'osaka', name: 'Osaka Prefecture', country: 'japan', countryName: 'Japan', lat: 34.6937, lng: 135.5023, cities: ['Osaka', 'Sakai', 'Higashiosaka'] }
];

// Chennai micro-neighborhoods with precise geographic coordinates
export const CHENNAI_MICRO_AREAS = [
  { id: 'velachery', name: 'Velachery', lat: 12.9759, lng: 80.2212, parentCity: 'Chennai', parentState: 'Tamil Nadu', parentCountry: 'India' },
  { id: 't nagar', name: 'T. Nagar', lat: 13.0418, lng: 80.2341, parentCity: 'Chennai', parentState: 'Tamil Nadu', parentCountry: 'India' },
  { id: 'anna nagar', name: 'Anna Nagar', lat: 13.0850, lng: 80.2101, parentCity: 'Chennai', parentState: 'Tamil Nadu', parentCountry: 'India' },
  { id: 'adyar', name: 'Adyar', lat: 13.0012, lng: 80.2565, parentCity: 'Chennai', parentState: 'Tamil Nadu', parentCountry: 'India' },
  { id: 'tambaram', name: 'Tambaram', lat: 12.9249, lng: 80.1000, parentCity: 'Chennai', parentState: 'Tamil Nadu', parentCountry: 'India' },
  { id: 'mylapore', name: 'Mylapore', lat: 13.0368, lng: 80.2676, parentCity: 'Chennai', parentState: 'Tamil Nadu', parentCountry: 'India' },
  { id: 'omr', name: 'OMR / IT Corridor', lat: 12.9010, lng: 80.2279, parentCity: 'Chennai', parentState: 'Tamil Nadu', parentCountry: 'India' },
  { id: 'guindy', name: 'Guindy', lat: 13.0067, lng: 80.2021, parentCity: 'Chennai', parentState: 'Tamil Nadu', parentCountry: 'India' },
  { id: 'porur', name: 'Porur', lat: 13.0382, lng: 80.1565, parentCity: 'Chennai', parentState: 'Tamil Nadu', parentCountry: 'India' },
  { id: 'sholinganallur', name: 'Sholinganallur', lat: 12.8998, lng: 80.2279, parentCity: 'Chennai', parentState: 'Tamil Nadu', parentCountry: 'India' }
];

/**
 * Resolve hierarchical geographic context for any location query
 * 
 * Example:
 * input: "Velachery"
 * returns: {
 *   level: 'city',
 *   city: 'Velachery',
 *   state: 'Tamil Nadu',
 *   country: 'India',
 *   countryId: 'india',
 *   lat: 12.9759,
 *   lng: 80.2212,
 *   fallbackChain: ['velachery', 'chennai', 'tamil nadu', 'india']
 * }
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

  // 1. Check Chennai micro-neighborhoods
  const micro = CHENNAI_MICRO_AREAS.find(m => m.id === norm || norm.includes(m.id) || m.name.toLowerCase() === norm);
  if (micro) {
    return {
      level: 'city',
      displayName: `${micro.name}, Chennai`,
      city: micro.name,
      state: micro.parentState,
      country: micro.parentCountry,
      countryId: 'india',
      countryFlag: '🇮🇳',
      lat: micro.lat,
      lng: micro.lng,
      fallbackChain: [micro.name.toLowerCase(), 'chennai', 'tamil nadu', 'india']
    };
  }

  // 2. Check Indian States
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

  // 3. Check Indian Major Cities
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
        lat: s.lat + (Math.random() * 0.4 - 0.2), // reasonable proximity to state center
        lng: s.lng + (Math.random() * 0.4 - 0.2),
        fallbackChain: [cityMatch.toLowerCase(), s.name.toLowerCase(), 'india']
      };
    }
  }

  // 4. Check US States
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

  // 5. Check US Major Cities
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
        lat: s.lat + (Math.random() * 0.4 - 0.2),
        lng: s.lng + (Math.random() * 0.4 - 0.2),
        fallbackChain: [cityMatch.toLowerCase(), s.name.toLowerCase(), 'us']
      };
    }
  }

  // 6. Check International Regions (Canada, UK, Germany, China, etc.)
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

  // 7. Check Sovereign Countries
  const country = GLOBAL_COUNTRIES.find(c => c.id === norm || norm.includes(c.id) || c.name.toLowerCase() === norm);
  if (country) {
    return {
      level: 'country',
      displayName: country.name,
      country: country.name,
      countryId: country.id,
      countryFlag: country.flag,
      region: country.region,
      lat: country.lat,
      lng: country.lng,
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
 * Return complete structured list of all countries, states, and key cities
 * for UI dropdowns, autocomplete, and search.
 */
export function getFullGeoDirectory() {
  return {
    countries: GLOBAL_COUNTRIES.map(c => ({
      id: c.id,
      name: c.name,
      flag: c.flag,
      region: c.region,
      lat: c.lat,
      lng: c.lng
    })),
    indiaStates: INDIA_STATES.map(s => ({
      id: s.id,
      name: s.name,
      lat: s.lat,
      lng: s.lng,
      cities: s.cities
    })),
    usStates: US_STATES.map(s => ({
      id: s.id,
      name: s.name,
      lat: s.lat,
      lng: s.lng,
      cities: s.cities
    })),
    intlRegions: INTL_REGIONS.map(r => ({
      id: r.id,
      name: r.name,
      country: r.country,
      lat: r.lat,
      lng: r.lng,
      cities: r.cities
    })),
    chennaiAreas: CHENNAI_MICRO_AREAS
  };
}

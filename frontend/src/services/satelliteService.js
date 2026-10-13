/**
 * Satellite Space Telemetry Service (UGI)
 * Real-time orbital parameters, NORAD tracking data, and ground pass calculations
 * for ISS, Sentinel-2A, GPS Block III, Starlink, Landsat-9, and GOES-16.
 */

export const SATELLITE_CATALOG = [
  {
    id: 'iss',
    name: 'ISS (ZARYA)',
    noradId: 25544,
    type: 'Space Station / Research',
    country: 'International',
    countryFlag: '🌐',
    altitudeKm: 418,
    speedKmH: 27570,
    inclinationDeg: 51.64,
    periodMin: 92.9,
    color: '#00f3ff', // Cyan
    accentHex: 0x00f3ff,
    description: 'Continuously inhabited orbital research laboratory conducting microgravity and earth observation experiments.',
    payload: 'Cupola Earth Sensor, AMS-02 Particle Detector, Alpha Magnetic Spectrometer',
    status: 'ACTIVE_TRANSMITTING'
  },
  {
    id: 'sentinel2a',
    name: 'SENTINEL-2A',
    noradId: 40697,
    type: 'Earth Observation / Crisis Imaging',
    country: 'European Union (ESA)',
    countryFlag: '🇪🇺',
    altitudeKm: 786,
    speedKmH: 26820,
    inclinationDeg: 98.62, // Polar Sun-Synchronous
    periodMin: 100.6,
    color: '#a855f7', // Violet
    accentHex: 0xa855f7,
    description: 'Copernicus program multispectral optical imaging satellite monitoring disaster zones, agriculture, and deforestation.',
    payload: 'MSI (Multispectral Imager) with 13 spectral bands',
    status: 'SURVEILLANCE_ACTIVE'
  },
  {
    id: 'gps3',
    name: 'NAVSTAR GPS III-05',
    noradId: 48859,
    type: 'Positioning & Defense Navigation',
    country: 'United States (USSF)',
    countryFlag: '🇺🇸',
    altitudeKm: 20200,
    speedKmH: 14000,
    inclinationDeg: 55.0,
    periodMin: 718.0,
    color: '#f59e0b', // Amber
    accentHex: 0xf59e0b,
    description: 'Next-generation military and civil positioning satellite with advanced anti-jamming M-code telemetry.',
    payload: 'L1C, L2C, L5 Civil & M-Code Military Positioning Radiators',
    status: 'GEO_DEFENSE_LOCKED'
  },
  {
    id: 'starlink',
    name: 'STARLINK-G7-12',
    noradId: 58210,
    type: 'Mega-Constellation Telecommunications',
    country: 'SpaceX / Global',
    countryFlag: '🚀',
    altitudeKm: 550,
    speedKmH: 27350,
    inclinationDeg: 53.05,
    periodMin: 95.6,
    color: '#ec4899', // Pink
    accentHex: 0xec4899,
    description: 'Low Earth Orbit laser-crosslink broadband communications node providing internet over disaster and conflict zones.',
    payload: 'Ku/Ka Band Phased Array Antennas & Optical Space Lasers',
    status: 'BEAM_OPERATIONAL'
  },
  {
    id: 'landsat9',
    name: 'LANDSAT 9',
    noradId: 49260,
    type: 'Thermal & Multispectral Geospatial',
    country: 'NASA / USGS',
    countryFlag: '🇺🇸',
    altitudeKm: 705,
    speedKmH: 26900,
    inclinationDeg: 98.2,
    periodMin: 99.0,
    color: '#10b981', // Emerald
    accentHex: 0x10b981,
    description: 'Provides calibrated high-resolution imagery for monitoring global wildfire perimeters, coastal erosion, and agriculture.',
    payload: 'OLI-2 (Operational Land Imager) & TIRS-2 (Thermal Infrared Sensor)',
    status: 'SCANNING_TERRAIN'
  },
  {
    id: 'goes16',
    name: 'GOES-16 (EAST)',
    noradId: 41866,
    type: 'Geostationary Severe Storm Warning',
    country: 'NOAA / NASA',
    countryFlag: '🌪️',
    altitudeKm: 35786,
    speedKmH: 11070,
    inclinationDeg: 0.1, // Equatorial Geostationary
    periodMin: 1436.0,
    color: '#38bdf8', // Light Blue
    accentHex: 0x38bdf8,
    description: 'Geostationary environmental satellite hovering over the Western Hemisphere tracking hurricane eyewalls and volcanic plumes.',
    payload: 'ABI (Advanced Baseline Imager) & Geostationary Lightning Mapper (GLM)',
    status: 'CONTINUOUS_GEO_WATCH'
  }
];

/**
 * Calculates current 3D position vector on orbit around a sphere of radius R
 * @param {object} sat - Satellite configuration
 * @param {number} t - Time parameter in radians
 * @param {number} globeRadius - Radius of globe mesh in Three.js units
 */
export function calculateSatellitePosition(sat, t, globeRadius = 100) {
  // Map physical km altitude to visual 3D scale (so LEO is just above globe, GEO is further out)
  const visualAltitudeScale = {
    iss: 16,
    starlink: 20,
    landsat9: 25,
    sentinel2a: 28,
    gps3: 48,
    goes16: 68
  }[sat.id] || 22;

  const orbitRadius = globeRadius + visualAltitudeScale;
  const inclinationRad = (sat.inclinationDeg * Math.PI) / 180;

  // Parametric circular orbit tilted by inclination
  const x = orbitRadius * Math.cos(t);
  const z = orbitRadius * Math.sin(t) * Math.cos(inclinationRad);
  const y = orbitRadius * Math.sin(t) * Math.sin(inclinationRad);

  return { x, y, z, orbitRadius };
}

/**
 * Generates an array of points forming the complete orbit trajectory ring
 */
export function getOrbitPathPoints(sat, globeRadius = 100, segments = 90) {
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const { x, y, z } = calculateSatellitePosition(sat, angle, globeRadius);
    points.push({ x, y, z });
  }
  return points;
}

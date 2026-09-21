import { fetchLiveNews } from '../services/newsService.js';
import { resolveGeoHierarchy, getFullGeoDirectory } from '../services/geoHierarchy.js';

async function runTests() {
  console.log('🧪 Starting Global Geo Coverage & Hierarchy Verification...\n');

  // 1. Directory Check
  const dir = getFullGeoDirectory();
  console.log(`✅ Geo Directory Loaded:`);
  console.log(`   - Countries: ${dir.countries.length}`);
  console.log(`   - India States: ${dir.indiaStates.length}`);
  console.log(`   - US States: ${dir.usStates.length}`);
  console.log(`   - International Regions: ${dir.intlRegions.length}`);
  console.log(`   - Chennai Micro-areas: ${dir.chennaiAreas.length}\n`);

  // 2. Hierarchy Resolver Tests
  console.log('🔍 Testing Geo Hierarchy Resolution:');
  const testCases = [
    { input: 'Velachery', country: 'india' },
    { input: 'California', country: 'us' },
    { input: 'Tamil Nadu', country: 'india' },
    { input: 'Tokyo', country: 'japan' },
    { input: 'Bavaria', country: 'germany' },
    { input: 'global', country: 'global' }
  ];

  for (const tc of testCases) {
    const res = resolveGeoHierarchy(tc.input, tc.country);
    console.log(`   [${tc.input}]: Level=${res.level}, Name="${res.displayName}", Lat=${res.lat}, Lng=${res.lng}, Chain=[${res.fallbackChain.join(' -> ')}]`);
  }
  console.log('');

  // 3. Test Live News Ingestion for Country (Japan)
  console.log('📡 Testing Live News Ingestion for Country (Japan)...');
  try {
    const japanNews = await fetchLiveNews('japan', 'all');
    console.log(`   Fetched ${japanNews.length} articles for Japan.`);
    if (japanNews.length > 0) {
      console.log(`   Sample Headline: "${japanNews[0].title}"`);
      console.log(`   Source: ${japanNews[0].source} | Category: ${japanNews[0].category}`);
      console.log(`   URL: ${japanNews[0].url}`);
      console.log(`   Geo-tag: [Lat: ${japanNews[0].geo.lat}, Lng: ${japanNews[0].geo.lng}] Country: ${japanNews[0].country_name}`);
    }
  } catch (err) {
    console.error('❌ Japan News Error:', err.message);
  }
  console.log('');

  // 4. Test Live News Ingestion for State (Tamil Nadu)
  console.log('📡 Testing Live News Ingestion for State (Tamil Nadu)...');
  try {
    const tnNews = await fetchLiveNews('india', 'all', null, 'en', 'tamil nadu');
    console.log(`   Fetched ${tnNews.length} articles for Tamil Nadu.`);
    if (tnNews.length > 0) {
      console.log(`   Sample Headline: "${tnNews[0].title}"`);
      console.log(`   Source: ${tnNews[0].source} | Category: ${tnNews[0].category}`);
      console.log(`   URL: ${tnNews[0].url}`);
      console.log(`   Geo-tag: Region=${tnNews[0].region}, Level=${tnNews[0].geo.level}`);
    }
  } catch (err) {
    console.error('❌ Tamil Nadu News Error:', err.message);
  }
  console.log('');

  // 5. Test Smart Fallback (Micro-area: Velachery)
  console.log('📡 Testing Smart Fallback for Micro-area (Velachery)...');
  try {
    const velacheryNews = await fetchLiveNews('india', 'all', 'velachery', 'en', 'tamil nadu', 'velachery');
    console.log(`   Fetched ${velacheryNews.length} articles for Velachery.`);
    if (velacheryNews.length > 0) {
      console.log(`   Sample Headline: "${velacheryNews[0].title}"`);
      console.log(`   Source: ${velacheryNews[0].source} | Category: ${velacheryNews[0].category}`);
      console.log(`   Fallback Metadata:`, velacheryNews[0].fallbackMeta || 'Direct hit');
    }
  } catch (err) {
    console.error('❌ Velachery News Error:', err.message);
  }
  console.log('');

  console.log('🎉 Geo-intelligence test suite finished.');
}

runTests().catch(console.error);

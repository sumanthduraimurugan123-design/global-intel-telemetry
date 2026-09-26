import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import newsRoutes from './routes/newsRoutes.js';
import alertsRoutes from './routes/alertsRoutes.js';
import logsRoutes from './routes/logsRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import outreachRoutes from './routes/outreachRoutes.js';
import { isSupabaseConfigured } from './services/supabaseClient.js';
import { fetchLiveNews } from './services/newsService.js';
import { getFutureImpactSimulation } from './services/futureImpactSimulator.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Routes (mounted with and without /api prefix for Vercel compatibility)
app.use('/api/news', newsRoutes);
app.use('/news', newsRoutes);

app.use('/api/alerts', alertsRoutes);
app.use('/alerts', alertsRoutes);

app.use('/api/logs', logsRoutes);
app.use('/logs', logsRoutes);

app.use('/api/users', usersRoutes);
app.use('/users', usersRoutes);

app.use('/api/outreach', outreachRoutes);
app.use('/outreach', outreachRoutes);

// Dedicated Future Impact Simulator Endpoint
const handleFutureImpact = async (req, res) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  try {
    const location = req.query.location || 'global';
    const persona = req.query.persona || 'Common Person';
    const simulationData = await getFutureImpactSimulation(location, persona);
    res.json(simulationData);
  } catch (error) {
    console.error('❌ [Future Impact Route Error]:', error);
    res.status(500).json({ error: 'Failed to generate future impact simulation', details: error.message });
  }
};
app.get('/api/future-impact', handleFutureImpact);
app.get('/future-impact', handleFutureImpact);

// Health & System Status Endpoint
const handleStatus = (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Global Intel & Telemetry (UGI)',
    timestamp: new Date().toISOString(),
    supabaseConnected: isSupabaseConfigured,
    autoRefreshIntervalSeconds: 45
  });
};
app.get('/api/status', handleStatus);
app.get('/status', handleStatus);

// Automated Background Sync Engine (Refreshes real news & alerts every 45s)
let syncInterval = null;
function startBackgroundSync() {
  console.log('🔄 [Telemetry Engine] Starting background ingestion loop (45s interval)...');
  
  // Initial fetch on boot
  fetchLiveNews('global', 'all')
    .then(items => console.log(`🚀 [Telemetry Engine] Initial boot ingestion completed: ${items.length} articles`))
    .catch(err => console.error('⚠️ [Telemetry Engine] Initial boot sync warning:', err.message));

  const hotspots = [
    'global', 'us', 'ukraine', 'russia', 'china', 'israel', 'iran', 
    'taiwan', 'india', 'germany', 'france', 'australia', 'brazil', 'canada', 'syria'
  ];
  let hotspotIndex = 0;

  syncInterval = setInterval(async () => {
    try {
      const targetCountry = hotspots[hotspotIndex % hotspots.length];
      hotspotIndex++;
      console.log(`⏱️ [Auto-Sync] Polling real-time intel for hotspot: ${targetCountry.toUpperCase()}`);
      await fetchLiveNews(targetCountry, 'all');
    } catch (err) {
      console.error('⚠️ [Auto-Sync Error]:', err.message);
    }
  }, 30000);
}

// Start Server if run directly (not as serverless function)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`
  =============================================================
  🌐 GLOBAL INTEL & TELEMETRY (UGI) - BACKEND SERVER
  =============================================================
  🟢 Server running on: http://localhost:${PORT}
  🗄️  Supabase Status:   ${isSupabaseConfigured ? 'CONNECTED ✅' : 'PENDING CONFIG (.env) ⚠️'}
  📡 Real News Engine:  ACTIVE (Google News Live & Global Feeds)
  🚨 Alert Engine:      ACTIVE (Real-time Keyword & Risk Scanner)
  =============================================================
    `);

    startBackgroundSync();
  });
}

// Clean termination handling
process.on('SIGINT', () => {
  if (syncInterval) clearInterval(syncInterval);
  process.exit(0);
});

export default app;

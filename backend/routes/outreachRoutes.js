import express from 'express';
import { 
  registerMissedCall, 
  registerWhatsApp, 
  getSubscribers, 
  getDispatchLogs, 
  dispatchOutreachAlert,
  generateSimpleLanguageMessage 
} from '../services/outreachService.js';

const router = express.Router();

/**
 * GET /api/outreach/subscribers
 */
router.get('/subscribers', async (req, res) => {
  try {
    const subscribers = await getSubscribers();
    res.json({
      total: subscribers.length,
      buttonPhones: subscribers.filter(s => s.phone_type === 'button_phone').length,
      smartphones: subscribers.filter(s => s.phone_type === 'smartphone').length,
      subscribers
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/outreach/logs
 */
router.get('/logs', async (req, res) => {
  try {
    const logs = await getDispatchLogs();
    res.json({ total: logs.length, logs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/outreach/register-missed-call
 * Simulated Missed Call webhook from telecom gateway or UI missed call button
 */
router.post('/register-missed-call', async (req, res) => {
  try {
    const { phone, location, persona } = req.body;
    const result = await registerMissedCall({ phone, location, persona });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/outreach/whatsapp-webhook
 * WhatsApp incoming message webhook (e.g. user texts "HI" or "START")
 */
router.post('/whatsapp-webhook', async (req, res) => {
  try {
    const { phone, location, persona, message } = req.body;
    const result = await registerWhatsApp({ 
      phone, 
      location, 
      persona, 
      incomingMessage: message || 'HI' 
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/outreach/register-whatsapp
 * Web form registration for WhatsApp alerts
 */
router.post('/register-whatsapp', async (req, res) => {
  try {
    const { phone, location, persona } = req.body;
    const result = await registerWhatsApp({ phone, location, persona });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/outreach/trigger
 * Manually trigger high-risk alert outreach to all matching subscribers
 */
router.post('/trigger', async (req, res) => {
  try {
    const { alertTitle, alertLocation, persona, message, severity } = req.body;
    const alertData = {
      message: alertTitle || message || 'High Risk Weather & Economic Advisory',
      country: alertLocation || 'Global',
      severity: severity || 'HIGH'
    };

    const dispatchResult = await dispatchOutreachAlert(alertData);
    res.json({
      success: true,
      message: `Dispatched to ${dispatchResult.dispatched_count} subscriber(s)`,
      result: dispatchResult
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/outreach/simulate-voice-call
 * Generates audio voice call script & plain text for browser speech synthesis demo
 */
router.post('/simulate-voice-call', (req, res) => {
  const { alertText, persona, location } = req.body;
  const simpleMsg = generateSimpleLanguageMessage(
    alertText || 'Heavy rain expected in your area. Stay safe.',
    persona || 'Common Person',
    location || 'Global'
  );

  res.json({
    phone: req.body.phone || '+91 98765 43210',
    audio_script: simpleMsg,
    spoken_text: `Attention subscriber: ${simpleMsg}`,
    voice_parameters: {
      rate: 0.9,
      pitch: 1.0,
      language: 'en-US'
    }
  });
});

export default router;

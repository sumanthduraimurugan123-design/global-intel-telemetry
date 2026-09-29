import express from 'express';
import { 
  sendSms, 
  makeCall, 
  isTwilioConfigured 
} from '../services/telecomService.js';

const router = express.Router();

/**
 * GET /telecom/status or /api/telecom/status
 * Check configuration state
 */
router.get('/telecom/status', (req, res) => {
  res.json({
    configured: isTwilioConfigured(),
    service: 'Twilio Communication Gateway',
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /send-sms or /api/send-sms
 * Send real SMS to the given phone number
 */
router.post('/send-sms', async (req, res) => {
  try {
    const { to, phone, message } = req.body;
    const target = to || phone;

    if (!target) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required. Please provide "to" or "phone" in international format (e.g. +91XXXXXXXXXX).'
      });
    }

    const result = await sendSms({ to: target, message });
    return res.status(result.statusCode || 200).json(result);
  } catch (error) {
    console.error('❌ [/send-sms handler error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Unexpected server error while processing SMS'
    });
  }
});

/**
 * POST /make-call or /api/make-call
 * Trigger automated voice call with text-to-speech to the given phone number
 */
router.post('/make-call', async (req, res) => {
  try {
    const { to, phone, message } = req.body;
    const target = to || phone;

    if (!target) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required. Please provide "to" or "phone" in international format (e.g. +91XXXXXXXXXX).'
      });
    }

    const result = await makeCall({ to: target, message });
    return res.status(result.statusCode || 200).json(result);
  } catch (error) {
    console.error('❌ [/make-call handler error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Unexpected server error while processing voice call'
    });
  }
});

export default router;

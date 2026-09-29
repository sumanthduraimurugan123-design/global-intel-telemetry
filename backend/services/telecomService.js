import twilio from 'twilio';

/**
 * Format and validate international phone number in E.164 format
 * Example: +919876543210, +15551234567
 */
export function formatInternationalPhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') return null;
  
  // Clean whitespace, hyphens, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '').trim();
  
  // E.164 format: + followed by 7 to 15 digits
  const e164Regex = /^\+[1-9]\d{6,14}$/;
  if (!e164Regex.test(cleaned)) {
    return null;
  }
  return cleaned;
}

/**
 * Check if Twilio API keys are properly set in environment
 */
export function isTwilioConfigured() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const phone = process.env.TWILIO_PHONE_NUMBER;
  
  return Boolean(
    sid && 
    token && 
    phone && 
    !sid.includes('your_') && 
    !token.includes('your_') &&
    !phone.includes('your_')
  );
}

/**
 * Get initialized Twilio REST Client
 */
export function getTwilioClient() {
  if (!isTwilioConfigured()) return null;
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

/**
 * Send real SMS to given phone number via Twilio API
 */
export async function sendSms({ to, phone, message }) {
  const targetNumber = to || phone;
  const formattedPhone = formatInternationalPhoneNumber(targetNumber);

  if (!formattedPhone) {
    return {
      success: false,
      statusCode: 400,
      error: 'Invalid phone number format. Please provide a valid international phone number starting with + (e.g. +91XXXXXXXXXX).'
    };
  }

  const alertMessage = (message && message.trim()) || 'Heavy rain expected in your area. Stay safe.';

  if (!isTwilioConfigured()) {
    console.warn('⚠️ [Telecom Service] Twilio credentials not configured in backend/.env');
    return {
      success: false,
      statusCode: 503,
      error: 'Twilio credentials not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in backend/.env to send real SMS.',
      configured: false,
      details: {
        to: formattedPhone,
        message: alertMessage
      }
    };
  }

  try {
    const client = getTwilioClient();
    console.log(`📲 [Twilio SMS] Sending real SMS to ${formattedPhone}: "${alertMessage}"`);

    const result = await client.messages.create({
      body: alertMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone
    });

    console.log(`✅ [Twilio SMS] SMS delivered to gateway! SID: ${result.sid}, Status: ${result.status}`);

    return {
      success: true,
      statusCode: 200,
      message: 'Alert sent successfully',
      sid: result.sid,
      status: result.status,
      to: formattedPhone,
      alertMessage,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ [Twilio SMS Error]:', error.message);
    return {
      success: false,
      statusCode: error.status || 500,
      error: error.message || 'Failed to send SMS via Twilio API'
    };
  }
}

/**
 * Trigger automated real voice call to given phone number via Twilio API
 */
export async function makeCall({ to, phone, message }) {
  const targetNumber = to || phone;
  const formattedPhone = formatInternationalPhoneNumber(targetNumber);

  if (!formattedPhone) {
    return {
      success: false,
      statusCode: 400,
      error: 'Invalid phone number format. Please provide a valid international phone number starting with + (e.g. +91XXXXXXXXXX).'
    };
  }

  const voiceMessage = (message && message.trim()) || 'Alert. Fuel prices may increase. Plan accordingly.';

  if (!isTwilioConfigured()) {
    console.warn('⚠️ [Telecom Service] Twilio credentials not configured in backend/.env');
    return {
      success: false,
      statusCode: 503,
      error: 'Twilio credentials not configured. Please set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in backend/.env to place real voice calls.',
      configured: false,
      details: {
        to: formattedPhone,
        message: voiceMessage
      }
    };
  }

  try {
    const client = getTwilioClient();
    console.log(`📞 [Twilio Voice Call] Initiating real call to ${formattedPhone}: "${voiceMessage}"`);

    // TwiML payload to play message using automated text-to-speech
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice" language="en-US">Attention. Priority alert from Global Intel. ${voiceMessage}</Say>
  <Pause length="1"/>
  <Say voice="alice" language="en-US">Repeating alert: ${voiceMessage}. Please stay informed and take care.</Say>
</Response>`;

    const call = await client.calls.create({
      twiml,
      to: formattedPhone,
      from: process.env.TWILIO_PHONE_NUMBER
    });

    console.log(`✅ [Twilio Voice Call] Call queued on carrier! SID: ${call.sid}, Status: ${call.status}`);

    return {
      success: true,
      statusCode: 200,
      message: 'Alert sent successfully',
      sid: call.sid,
      status: call.status,
      to: formattedPhone,
      alertMessage: voiceMessage,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ [Twilio Voice Call Error]:', error.message);
    return {
      success: false,
      statusCode: error.status || 500,
      error: error.message || 'Failed to place voice call via Twilio API'
    };
  }
}

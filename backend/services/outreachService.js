import { supabase, isSupabaseConfigured } from './supabaseClient.js';

// In-memory subscribers database
let memorySubscribers = [
  {
    id: 'sub_1',
    phone: '+91 98765 43210',
    phone_type: 'button_phone', // 'button_phone' or 'smartphone'
    channel: 'voice_call',      // 'voice_call' or 'whatsapp'
    location: 'India',
    persona: 'Farmer / Kisan',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    status: 'ACTIVE'
  },
  {
    id: 'sub_2',
    phone: '+91 91234 56789',
    phone_type: 'smartphone',
    channel: 'whatsapp',
    location: 'India',
    persona: 'Student',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'ACTIVE'
  },
  {
    id: 'sub_3',
    phone: '+1 555 019 2834',
    phone_type: 'button_phone',
    channel: 'voice_call',
    location: 'United States',
    persona: 'Common Person',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    status: 'ACTIVE'
  },
  {
    id: 'sub_4',
    phone: '+44 7700 900077',
    phone_type: 'smartphone',
    channel: 'whatsapp',
    location: 'United Kingdom',
    persona: 'Business Owner',
    created_at: new Date().toISOString(),
    status: 'ACTIVE'
  }
];

// In-memory dispatch logs
let memoryDispatchLogs = [
  {
    id: 'log_101',
    alert_title: 'Heavy Rain Warning in Punjab & Haryana',
    recipient_phone: '+91 98765 43210',
    channel: 'voice_call',
    phone_type: 'button_phone',
    persona: 'Farmer / Kisan',
    location: 'India',
    simple_message: 'Heavy rain expected in your area tomorrow. Protect harvested crops in shed and stay indoors. Stay safe.',
    dispatched_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    delivery_status: 'DELIVERED_VOICE_CALL_COMPLETED'
  },
  {
    id: 'log_102',
    alert_title: 'Fuel Price Hike Alert',
    recipient_phone: '+91 91234 56789',
    channel: 'whatsapp',
    phone_type: 'smartphone',
    persona: 'Student',
    location: 'India',
    simple_message: 'Fuel prices will increase by ₹3 tonight. Travel and bus pass costs may rise. Plan monthly budget.',
    dispatched_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    delivery_status: 'DELIVERED_WHATSAPP_TEXT_AND_AUDIO'
  }
];

/**
 * Clean & format phone number
 */
function cleanPhone(phone) {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '').trim();
}

/**
 * Generate ultra-simple, plain-language message for common people based on alert & persona
 */
export function generateSimpleLanguageMessage(alert, persona = 'Common Person', location = 'Global') {
  const text = typeof alert === 'string' ? alert : `${alert.message || ''} ${alert.title || ''}`;
  const lowerText = text.toLowerCase();
  const pLower = (persona || '').toLowerCase();

  // Weather / Disaster
  if (lowerText.includes('rain') || lowerText.includes('flood') || lowerText.includes('cyclone') || lowerText.includes('storm') || lowerText.includes('weather') || lowerText.includes('heatwave')) {
    if (pLower.includes('farmer') || pLower.includes('kisan')) {
      return `Heavy rain and strong wind expected in ${location}. Cover harvested crops in shed. Clean field drainage. Stay safe.`;
    }
    if (pLower.includes('student')) {
      return `Heavy rain alert in ${location}. Campus travel may be disrupted. Keep umbrella and leave 20 mins early for exams.`;
    }
    if (pLower.includes('business')) {
      return `Severe storm warning in ${location}. Warehouse cargo dispatches may be delayed. Check drainage & power backup.`;
    }
    return `Heavy rain and storm expected in ${location}. Avoid unnecessary travel and stay safe at home.`;
  }

  // Fuel / Economic / Grocery
  if (lowerText.includes('fuel') || lowerText.includes('diesel') || lowerText.includes('petrol') || lowerText.includes('inflation') || lowerText.includes('price') || lowerText.includes('tariff')) {
    if (pLower.includes('farmer') || pLower.includes('kisan')) {
      return `Diesel and fuel prices expected to rise in ${location}. Tractor operational costs will go up. Buy fuel requirements early.`;
    }
    if (pLower.includes('student')) {
      return `Fuel prices may rise. Bus fares and commute expenses could increase. Plan weekly travel budget.`;
    }
    if (pLower.includes('business')) {
      return `Fuel & logistics prices rising in ${location}. Review transport vendor contracts and freight surcharges.`;
    }
    return `Fuel & grocery prices may increase in ${location}. Plan household expenses accordingly.`;
  }

  // Transport / Strike / Power Outage
  if (lowerText.includes('transit') || lowerText.includes('metro') || lowerText.includes('bus') || lowerText.includes('strike') || lowerText.includes('traffic') || lowerText.includes('blackout') || lowerText.includes('power')) {
    if (pLower.includes('student')) {
      return `Transport strike reported in ${location}. Metro & buses delayed. Use alternate routes or start early.`;
    }
    return `Transport & power disruption expected in ${location}. Charge mobile phones and keep emergency lights ready.`;
  }

  // Default generic simple message
  return `Important Safety Update for ${location}: ${text.slice(0, 100)}. Please take precautions and stay safe.`;
}

/**
 * Register button phone user via Missed Call
 */
export async function registerMissedCall({ phone, location = 'Global', persona = 'Common Person' }) {
  const formattedPhone = cleanPhone(phone) || `+91 ${Math.floor(7000000000 + Math.random() * 2999999999)}`;

  // Check if existing subscriber
  const existing = memorySubscribers.find(s => s.phone === formattedPhone);
  if (existing) {
    existing.location = location;
    existing.persona = persona;
    existing.phone_type = 'button_phone';
    existing.channel = 'voice_call';
    return { subscriber: existing, message: 'Updated existing Missed Call subscription' };
  }

  const newSub = {
    id: `sub_${Date.now()}`,
    phone: formattedPhone,
    phone_type: 'button_phone',
    channel: 'voice_call',
    location: location || 'Global',
    persona: persona || 'Common Person',
    created_at: new Date().toISOString(),
    status: 'ACTIVE'
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('outreach_subscribers').insert([newSub]);
    } catch (err) {
      console.error('⚠️ [Outreach Service] Supabase insert fallback to memory:', err.message);
    }
  }

  memorySubscribers.unshift(newSub);
  return { subscriber: newSub, message: 'Missed call received! Registered for automated voice alerts.' };
}

/**
 * Register WhatsApp subscriber (Smartphone)
 */
export async function registerWhatsApp({ phone, location = 'Global', persona = 'Common Person', incomingMessage = 'HI' }) {
  const formattedPhone = cleanPhone(phone) || `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`;

  const existing = memorySubscribers.find(s => s.phone === formattedPhone);
  if (existing) {
    existing.location = location;
    existing.persona = persona;
    existing.phone_type = 'smartphone';
    existing.channel = 'whatsapp';
    return { subscriber: existing, message: 'Updated WhatsApp alert settings' };
  }

  const newSub = {
    id: `sub_${Date.now()}`,
    phone: formattedPhone,
    phone_type: 'smartphone',
    channel: 'whatsapp',
    location: location || 'Global',
    persona: persona || 'Common Person',
    created_at: new Date().toISOString(),
    status: 'ACTIVE'
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('outreach_subscribers').insert([newSub]);
    } catch (err) {
      console.error('⚠️ [Outreach Service] Supabase insert error:', err.message);
    }
  }

  memorySubscribers.unshift(newSub);
  return { subscriber: newSub, message: `WhatsApp message "${incomingMessage}" received! Opted in to WhatsApp text & voice notes.` };
}

/**
 * Get active subscribers
 */
export async function getSubscribers() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('outreach_subscribers').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.error('⚠️ [Outreach Service] Error reading subscribers from Supabase:', err.message);
    }
  }
  return memorySubscribers;
}

/**
 * Get dispatch logs
 */
export async function getDispatchLogs() {
  return memoryDispatchLogs;
}

/**
 * Dispatch automated alerts to registered button phone and WhatsApp users
 */
export async function dispatchOutreachAlert(alertOrEvent) {
  const subscribers = await getSubscribers();
  const alertTitle = alertOrEvent.message || alertOrEvent.title || 'High Risk Intelligence Trigger';
  const alertLocation = alertOrEvent.country || alertOrEvent.location || 'Global';

  const newLogs = [];

  for (const sub of subscribers) {
    // Check if location matches or is global
    const locMatch = sub.location.toLowerCase() === 'global' || 
                     alertLocation.toLowerCase() === 'global' ||
                     sub.location.toLowerCase().includes(alertLocation.toLowerCase()) ||
                     alertLocation.toLowerCase().includes(sub.location.toLowerCase());

    if (!locMatch) continue;

    // Generate ultra simple message personalized to user's persona & location
    const simpleMsg = generateSimpleLanguageMessage(alertOrEvent, sub.persona, sub.location);

    const logEntry = {
      id: `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      alert_title: alertTitle,
      recipient_phone: sub.phone,
      channel: sub.channel,
      phone_type: sub.phone_type,
      persona: sub.persona,
      location: sub.location,
      simple_message: simpleMsg,
      dispatched_at: new Date().toISOString(),
      delivery_status: sub.channel === 'voice_call' ? 'DELIVERED_VOICE_CALL_COMPLETED' : 'DELIVERED_WHATSAPP_TEXT_AND_AUDIO'
    };

    memoryDispatchLogs.unshift(logEntry);
    newLogs.push(logEntry);

    // Simulated IVR / WhatsApp Webhook console logging
    if (sub.channel === 'voice_call') {
      console.log(`📞 [VOICE CALL IVR DISPATCH] Calling ${sub.phone} (${sub.persona}) -> Playing Audio: "${simpleMsg}"`);
    } else {
      console.log(`💬 [WHATSAPP DISPATCH] Sending to ${sub.phone} (${sub.persona}) -> Text & Voice Note: "${simpleMsg}"`);
    }
  }

  // Keep logs under 100
  if (memoryDispatchLogs.length > 100) {
    memoryDispatchLogs = memoryDispatchLogs.slice(0, 100);
  }

  return {
    dispatched_count: newLogs.length,
    logs: newLogs,
    alertTitle,
    alertLocation
  };
}

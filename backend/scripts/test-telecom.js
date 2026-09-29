import { formatInternationalPhoneNumber, sendSms, makeCall } from '../services/telecomService.js';
import app from '../server.js';
import http from 'http';

async function runTests() {
  console.log('🧪 [Test Suite] Starting telecom subsystem verification...\n');

  // Test 1: Phone number format validation
  console.log('--- Test 1: International Phone Formatting ---');
  const validNumbers = ['+919876543210', '+15551234567', '+91 98765 43210', '+44 7700 900077'];
  const invalidNumbers = ['9876543210', 'abc', '123', ''];

  for (const num of validNumbers) {
    const formatted = formatInternationalPhoneNumber(num);
    console.log(`  Valid test: "${num}" -> "${formatted}" (${formatted ? 'PASS ✅' : 'FAIL ❌'})`);
  }

  for (const num of invalidNumbers) {
    const formatted = formatInternationalPhoneNumber(num);
    console.log(`  Invalid test: "${num}" -> ${formatted} (${formatted === null ? 'PASS ✅' : 'FAIL ❌'})`);
  }

  // Start test server on ephemeral port
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  console.log(`\n--- Test 2: API Endpoints on http://localhost:${port} ---`);

  // Test 2A: POST /send-sms with missing number
  const resBad1 = await fetch(`http://localhost:${port}/send-sms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Hello' })
  });
  const dataBad1 = await resBad1.json();
  console.log(`  POST /send-sms (missing number) -> Status: ${resBad1.status}, Error: "${dataBad1.error}" (Expected 400: ${resBad1.status === 400 ? 'PASS ✅' : 'FAIL ❌'})`);

  // Test 2B: POST /send-sms with invalid phone format
  const resBad2 = await fetch(`http://localhost:${port}/send-sms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '12345', message: 'Hello' })
  });
  const dataBad2 = await resBad2.json();
  console.log(`  POST /send-sms (invalid format) -> Status: ${resBad2.status}, Error: "${dataBad2.error}" (Expected 400: ${resBad2.status === 400 ? 'PASS ✅' : 'FAIL ❌'})`);

  // Test 2C: POST /send-sms with international format
  const resValid = await fetch(`http://localhost:${port}/send-sms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '+919876543210', message: 'Heavy rain expected in your area. Stay safe.' })
  });
  const dataValid = await resValid.json();
  console.log(`  POST /send-sms (+919876543210) -> Status: ${resValid.status}, Response:`, JSON.stringify(dataValid));

  // Test 2D: POST /make-call with international format
  const resCall = await fetch(`http://localhost:${port}/make-call`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '+919876543210', message: 'Alert. Fuel prices may increase. Plan accordingly.' })
  });
  const dataCall = await resCall.json();
  console.log(`  POST /make-call (+919876543210) -> Status: ${resCall.status}, Response:`, JSON.stringify(dataCall));

  // Test 2E: Check /api/send-sms alias
  const resAlias = await fetch(`http://localhost:${port}/api/send-sms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '+919876543210', message: 'Test alert' })
  });
  console.log(`  POST /api/send-sms (alias route) -> Status: ${resAlias.status} (${resAlias.status !== 404 ? 'PASS ✅' : 'FAIL ❌'})`);

  server.close();
  console.log('\n🏁 [Test Suite] Verification finished!');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});

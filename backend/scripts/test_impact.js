import { getFutureImpactSimulation } from '../services/futureImpactSimulator.js';

async function test() {
  console.log('--- Testing Future Impact Simulator ---');
  
  const studentSim = await getFutureImpactSimulation('Chennai', 'Student');
  console.log('Chennai Student Simulation:', JSON.stringify(studentSim, null, 2));

  const farmerSim = await getFutureImpactSimulation('India', 'Farmer');
  console.log('India Farmer Simulation:', JSON.stringify(farmerSim, null, 2));

  const professionalSim = await getFutureImpactSimulation('US', 'Professional');
  console.log('US Professional Simulation:', JSON.stringify(professionalSim, null, 2));
}

test().catch(err => console.error('Error running test:', err));

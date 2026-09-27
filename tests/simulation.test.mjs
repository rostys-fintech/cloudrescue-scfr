import assert from 'node:assert/strict';
import { compareStrategies, runScenario, resilienceFrontier } from '../model/simulation.js';

const base = { outageProvider:'blue', marketPct:20, reservePct:25, allocationRule:'systemic' };
const c = compareStrategies(base);

for (const [name, result] of Object.entries(c)) {
  assert.ok(result.resilience >= 0 && result.resilience <= 100, `${name}: resilience must be in [0,100]`);
  assert.ok(result.unmetPct >= 0 && result.unmetPct <= 100, `${name}: unmet capacity must be in [0,100]`);
  assert.ok(result.banksRecovered <= result.affectedCount, `${name}: recovered count cannot exceed affected count`);
  assert.ok(result.reserveUsed <= result.totalReserve + 1e-9, `${name}: reserve use cannot exceed reserve budget`);
}

assert.equal(c.individual.totalReserve, c.scfr.totalReserve, 'Individual and SCFR scenarios must use the same reserve budget');
assert.ok(c.scfr.resilience >= c.individual.resilience, 'In the default synthetic scenario, pooled reserve should not underperform ring-fenced reserve');

for (const provider of ['blue','orange','green']) {
  const r = runScenario({...base, outageProvider:provider, strategy:'scfr'});
  assert.ok(r.affectedCount > 0, `${provider}: scenario should affect at least one bank`);
}

const frontier = resilienceFrontier({ outageProvider:'blue', marketPct:20, allocationRule:'systemic' });
assert.equal(frontier.length, 13, 'Frontier should contain reserve levels 0..60 in 5-point steps');
for (let i=1;i<frontier.length;i++) {
  assert.ok(frontier[i].scfr + 1e-9 >= frontier[i-1].scfr, 'SCFR frontier should be non-decreasing as reserve grows');
}

console.log('✓ CloudRescue simulation invariants passed');
import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../resilience-atlas.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../resilience-atlas.css', import.meta.url), 'utf8');
const js = fs.readFileSync(new URL('../resilience-atlas.js', import.meta.url), 'utf8');
const earth = fs.readFileSync(new URL('../earth-system.js', import.meta.url), 'utf8');

for (const id of [
  'raResetLab','raAffectedDemand','raLabMarketSummary','raLabReserveSummary','raLabRuleSummary',
  'raLabAffected','raLabUnmet','raLabRestored','raLabResilience',
  'raMarketScore','raIndividualScore','raScfrScore',
  'raMarketRestored','raIndividualRestored','raScfrRestored',
  'raMarketGap','raIndividualStranded','raScfrUsed','raMechanismInsight'
]) {
  assert.match(html,new RegExp("id=[\\\"']"+id+"[\\\"']"),'missing '+id);
}

assert.match(html,/data-ra-strategy="market"/);
assert.match(html,/data-ra-strategy="individual"/);
assert.match(html,/data-ra-strategy="scfr"/);
assert.match(html,/COMPARE RECOVERY MODELS/);

assert.match(js,/labStrategy: 'market'/);
assert.match(js,/function setLabStrategy\(/);
assert.match(js,/function resetLab\(/);
assert.match(js,/const selected = c\[state\.labStrategy\]/);
assert.match(js,/earth\.lab\.update/);
assert.match(js,/raMechanismInsight/);

assert.match(earth,/const labStrategy=input\.labStrategy\|\|'market'/);
assert.match(earth,/comparison\[visualStrategy\]/);
assert.match(earth,/const labPhase=input\.labPhase\|\|null/);
assert.match(earth,/dataset\.labStrategy=visualStrategy/);

assert.match(css,/STAGE 5 — SCENARIO LAB/);
assert.match(css,/\.ra-strategy-switch/);
assert.match(css,/\.ra-model-compare-grid/);
assert.match(css,/\.ra-lab-outcomes/);
assert.match(css,/@media\(max-width:767px\)/);

console.log('Scenario Lab checks passed.');

import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../resilience-atlas.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../resilience-atlas.css', import.meta.url), 'utf8');
const js = fs.readFileSync(new URL('../resilience-atlas.js', import.meta.url), 'utf8');

for (const id of [
  'raEvidenceEarthMount','raEvidenceBanks','raEvidenceProviders','raEvidenceLoad',
  'raEvidenceDemand','raEvidenceMarketPool','raEvidenceReservePool','raEvidenceHHI',
  'raEvidenceScenario','raExportEvidence'
]) {
  assert.match(html,new RegExp("id=[\\\"']"+id+"[\\\"']"),'missing '+id);
}

assert.match(html,/CORE EQUATIONS/);
assert.match(html,/SYSTEMIC RESILIENCE SCORE/);
assert.match(html,/EXPERIMENT DESIGN/);
assert.match(html,/EVIDENCE BASE/);
assert.match(html,/LIMITATIONS/);
assert.match(html,/REPRODUCIBILITY/);
assert.match(html,/PROTOTYPE TRANSPARENCY/);
assert.match(html,/bis\.org/);
assert.match(html,/eba\.europa\.eu/);
assert.match(html,/esma\.europa\.eu/);

assert.match(js,/function evidenceSnapshot\(/);
assert.match(js,/function exportEvidence\(/);
assert.match(js,/new Blob/);
assert.match(js,/resilience-atlas-scenario\.json/);
assert.match(js,/systemStats\(\)/);
assert.match(js,/earth\.evidence\.update/);
assert.match(js,/setupEvidence\(\)/);

assert.match(js,/\$\$\('\.ra-strategy-switch button'\)\.forEach/);
assert.match(js,/\$\$\('\.ra-model-card'\)\.forEach/);

assert.match(css,/STAGE 6 — MODEL & EVIDENCE/);
assert.match(css,/\.ra-equation-grid/);
assert.match(css,/\.ra-source-grid/);
assert.match(css,/\.ra-limit-grid/);
assert.match(css,/\.ra-repro-grid/);

console.log('Model & Evidence checks passed.');

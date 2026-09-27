import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../resilience-atlas.html', import.meta.url), 'utf8');
const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const legacy = fs.readFileSync(new URL('../cloudrescue-legacy.html', import.meta.url), 'utf8');
const js = fs.readFileSync(new URL('../resilience-atlas.js', import.meta.url), 'utf8');
const earth = fs.readFileSync(new URL('../earth-system.js', import.meta.url), 'utf8');
const model = fs.readFileSync(new URL('../model/simulation.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../resilience-atlas.css', import.meta.url), 'utf8');

assert.equal(index,html,'default index should be the current Resilience Atlas entrypoint');
assert.match(legacy,/CloudRescue/);
assert.equal((html.match(/id="raProviderToggles"/g)||[]).length,1);
assert.equal((html.match(/type="checkbox"/g)||[]).length,3);
assert.match(html,/id="raRunScenario"/);
assert.match(html,/Run Scenario/);
assert.match(html,/PENDING CHANGES|SCENARIO READY/);
assert.match(html,/Export readable report/);
assert.match(html,/id="raExportJson"/);

assert.match(model,/outageProviders/);
assert.match(model,/normalizeOutageProviders/);
assert.match(model,/new Set\(raw\.filter/);

assert.match(js,/const labDraft/);
assert.match(js,/function syncLabDraftUI\(/);
assert.match(js,/function runLabScenario\(/);
assert.match(js,/state\.outageProviders=\[\.\.\.selected\]/);
assert.match(js,/function exportReadableReport\(/);
assert.match(js,/function exportJson\(/);
assert.match(js,/resilience-atlas-scenario-report\.txt/);
assert.match(js,/text\/plain;charset=utf-8/);
assert.match(js,/\\uFEFF/);

assert.match(earth,/const outageProviders=Array\.isArray/);
assert.match(earth,/failedProviders=new Set/);
assert.match(earth,/failedProviders\.has\(id\)/);
assert.match(earth,/dataset\.outageProviders/);

assert.match(css,/STAGE 10 — FINAL QA \/ RUN-BEFORE-APPLY SCENARIOS/);
assert.match(css,/\.ra-provider-toggle-group/);
assert.match(css,/\.ra-lab-run-block/);
assert.match(css,/\.ra-export-actions/);

console.log('Final QA scenario-run checks passed.');

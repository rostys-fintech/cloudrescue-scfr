import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../resilience-atlas.html', import.meta.url), 'utf8');
const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const js = fs.readFileSync(new URL('../resilience-atlas.js', import.meta.url), 'utf8');
const earth = fs.readFileSync(new URL('../earth-system.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../resilience-atlas.css', import.meta.url), 'utf8');

assert.equal(index,html,'default entrypoint should stay synced with Resilience Atlas');

for (const id of [
  'raScenarioPlayback','raPlaybackStep','raPlaybackKicker','raPlaybackTitle',
  'raPlaybackMetricLabel','raPlaybackMetricValue','raPlaybackProgress',
  'raScenarioConclusion','raConclusionTitle','raConclusionText',
  'raConclusionShock','raConclusionBottleneck','raConclusionCoordination',
  'raConclusionInterpretation'
]) {
  assert.match(html,new RegExp("id=[\\\"']"+id+"[\\\"']"),'missing '+id);
}

assert.equal((html.match(/id="raPlaybackProgress"[\s\S]*?<i/g)||[]).length>=1,true);
assert.match(js,/const labRun =/);
assert.match(js,/function scenarioPlaybackPhases\(/);
assert.match(js,/async function runLabScenario\(/);
assert.match(js,/function renderPlaybackPhase\(/);
assert.match(js,/function buildScenarioConclusion\(/);
assert.match(js,/function renderScenarioConclusion\(/);
assert.match(js,/function cancelLabRun\(/);
assert.match(js,/labPhase:phase\.phase/);
assert.match(js,/phase:'shock'/);
assert.match(js,/phase:'demand'/);
assert.match(js,/phase:'market'/);
assert.match(js,/phase:'individual'/);
assert.match(js,/phase:'scfr'/);
assert.match(js,/phase:'outcome'/);
assert.match(js,/SCFR changes critical workload restored by/);
assert.match(js,/renderLab\(\{skipEarth:true\}\)/);

assert.match(earth,/const labPhase=input\.labPhase\|\|null/);
assert.match(earth,/phaseScenes=\{shock:1,demand:2,market:2,individual:3,scfr:4,outcome:5\}/);
assert.match(earth,/mount\.dataset\.labPhase/);

assert.match(css,/SCENARIO PLAYBACK — RUN -> EXPLAIN -> CONCLUDE/);
assert.match(css,/\.ra-scenario-playback/);
assert.match(css,/\.ra-scenario-conclusion/);
assert.match(css,/\.ra-conclusion-grid/);
assert.match(css,/@keyframes raConclusionIn/);
assert.match(css,/prefers-reduced-motion/);

console.log('Scenario playback and conclusion checks passed.');

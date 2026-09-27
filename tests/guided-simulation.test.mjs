import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../resilience-atlas.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../resilience-atlas.css', import.meta.url), 'utf8');
const js = fs.readFileSync(new URL('../resilience-atlas.js', import.meta.url), 'utf8');

for (const id of [
  'raSceneCounter','raSceneKicker','raSceneTitle','raSceneText','raSceneStatValue',
  'raRunPreview','raNarrationToggle','raSpeechPause','raSpeechPauseLabel','raGuidedHud','raGuidedStatus',
  'raGuidedScene','raGuidedCaption','raGuidedProgress'
]) {
  assert.match(html,new RegExp("id=[\\\"']"+id+"[\\\"']"),'missing '+id);
}

assert.match(js,/function scenePresentation\(/);
assert.match(js,/In this simulation, we can see how banks depend on shared cloud providers/);
assert.match(js,/function maleVoiceScore\(/);
assert.match(js,/const explicitlyFemale=/);
assert.match(js,/pauseMs:560/);
assert.match(js,/longPauseMs:760/);
assert.match(js,/async function runGuidedSimulation\(/);
assert.match(js,/function speakCurrentScene\(/);
assert.match(js,/speechSynthesis/);
assert.match(js,/guided\.active/);
assert.match(js,/state\.scene=i/);
assert.match(js,/earth\.simulation\.update/);
assert.match(js,/function guidedDelay\(/);
assert.match(js,/function setGuidedPaused\(/);
assert.match(js,/speechSynthesis\.pause\(\)/);
assert.match(js,/speechSynthesis\.resume\(\)/);
assert.match(js,/Promise\.all\(/);
assert.match(js,/guidedDelay\(story\.visualDuration,runId\)/);
assert.match(js,/earth\.simulation\.setPaused/);
assert.doesNotMatch(html,/raVoiceSelect/);
assert.doesNotMatch(html,/raVoiceTest/);

assert.match(css,/STAGE 4 — GUIDED SIMULATION/);
assert.match(css,/\.ra-guided-hud/);
assert.match(css,/\.ra-waveform/);
assert.match(css,/body\.ra-guided-running/);
assert.match(css,/prefers-reduced-motion/);
assert.match(css,/SYNCED GUIDED CONTROLS — RUN \/ NARRATION \/ PAUSE/);
assert.match(css,/body\.ra-guided-paused/);

assert.doesNotMatch(html,/Crisis Replay/);
assert.doesNotMatch(html,/Stress Lab/);

console.log('Guided simulation checks passed.');

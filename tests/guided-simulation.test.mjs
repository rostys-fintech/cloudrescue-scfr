import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../resilience-atlas.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../resilience-atlas.css', import.meta.url), 'utf8');
const js = fs.readFileSync(new URL('../resilience-atlas.js', import.meta.url), 'utf8');

for (const id of [
  'raSceneCounter','raSceneKicker','raSceneTitle','raSceneText','raSceneStatValue',
  'raRunPreview','raNarrationToggle','raSpeechPause','raSpeechPauseLabel','raHudPause','raHudStop','raGuidedHud','raGuidedStatus',
  'raGuidedScene','raGuidedCaption','raGuidedProgress'
]) {
  assert.match(html,new RegExp("id=[\\\"']"+id+"[\\\"']"),'missing '+id);
}

assert.match(js,/function scenePresentation\(/);
assert.match(js,/In this simulation, we can see how banks depend on shared cloud providers/);
assert.match(js,/const GUIDED_AUDIO_TRACKS = \[/);
assert.equal((js.match(/resource2\.heygen\.ai\/text_to_speech/g)||[]).length,6);
assert.match(js,/const guidedAudio = new Audio\(\)/);
assert.match(js,/function preloadGuidedAudio\(/);
assert.match(js,/function playGuidedAudioScene\(/);
assert.match(js,/const GUIDED_CUES = \[/);
assert.match(js,/function applyGuidedCue\(/);
assert.match(js,/function startGuidedCueSync\(/);
assert.match(js,/guidedAudio\.currentTime/);
assert.match(js,/guidedAudio\.play\(\)/);
assert.match(js,/guidedAudio\.pause\(\)/);
assert.doesNotMatch(js,/speechSynthesis/);
assert.doesNotMatch(js,/SpeechSynthesisUtterance/);
assert.match(js,/async function runGuidedSimulation\(/);
assert.match(js,/guided\.active/);
assert.match(js,/state\.scene=i/);
assert.match(js,/earth\.simulation\.update/);
assert.match(js,/function guidedDelay\(/);
assert.match(js,/function setGuidedPaused\(/);
assert.match(js,/Promise\.all\(/);
assert.match(js,/playGuidedAudioScene\(i,runId\)/);
assert.match(js,/Math\.max\(story\.visualDuration,GUIDED_AUDIO_TRACKS\[i\]\.durationMs\)/);
assert.match(js,/earth\.simulation\.setPaused/);
assert.match(js,/function focusAnimationStage\(/);
assert.match(js,/scrollIntoView\(/);
assert.match(js,/focusAnimationStage\(\$\('#raEarthMount'\)\)/);
assert.match(js,/raHudPause/);
assert.match(js,/raHudStop/);

assert.match(css,/STAGE 4 — GUIDED SIMULATION/);
assert.match(css,/\.ra-guided-hud/);
assert.match(css,/\.ra-waveform/);
assert.match(css,/body\.ra-guided-running/);
assert.match(css,/prefers-reduced-motion/);
assert.match(css,/SYNCED GUIDED CONTROLS — RUN \/ NARRATION \/ PAUSE/);
assert.match(css,/body\.ra-guided-paused/);
assert.match(css,/NEURAL VOICEOVER \+ ROBUST MOBILE CONTROL STACK/);
assert.match(css,/\.ra-sim-secondary/);
assert.match(css,/WORD-SYNCED GUIDED TIMELINE/);

console.log('Guided simulation neural-audio checks passed.');

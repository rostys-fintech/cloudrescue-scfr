import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../resilience-atlas.html',import.meta.url),'utf8');
const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../resilience-atlas.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../resilience-atlas.css',import.meta.url),'utf8');

assert.equal(index,html,'default entrypoint should stay synced');
assert.match(html,/preconnect" href="https:\/\/resource2\.heygen\.ai"/);
assert.match(html,/class="ra-sim-secondary"/);
assert.match(html,/20260927-story0[1-9]/);

assert.match(js,/const GUIDED_AUDIO_TRACKS = \[/);
assert.equal((js.match(/resource2\.heygen\.ai\/text_to_speech/g)||[]).length,6);
assert.match(js,/durationMs:17842/);
assert.match(js,/durationMs:24137/);
assert.match(js,/const guidedAudio = new Audio\(\)/);
assert.match(js,/guidedAudio\.preload='auto'/);
assert.match(js,/guidedAudio\.setAttribute\('playsinline',''\)/);
assert.match(js,/function preloadGuidedAudio\(/);
assert.match(js,/function playGuidedAudioScene\(/);
assert.match(js,/guidedAudio\.addEventListener\('ended'/);
assert.match(js,/guidedAudio\.addEventListener\('error'/);
assert.match(js,/guidedAudio\.play\(\)/);
assert.match(js,/guidedAudio\.pause\(\)/);
assert.match(js,/HeyGen neural narrator · Viktor — Serious & Composed/);
assert.doesNotMatch(js,/speechSynthesis/);
assert.doesNotMatch(js,/SpeechSynthesisUtterance/);
assert.doesNotMatch(js,/maleVoiceScore/);
assert.match(js,/state\.outageProviders=\[\.\.\.defaultScenario\.outageProviders\]/);
assert.match(js,/playGuidedAudioScene\(i,runId\)/);

assert.match(css,/NEURAL VOICEOVER \+ ROBUST MOBILE CONTROL STACK/);
assert.match(css,/\.ra-sim-controls>#raRunPreview/);
assert.match(css,/\.ra-sim-secondary/);
assert.match(css,/grid-template-columns:1fr 1fr/);
assert.match(css,/min-height:58px!important/);

console.log('Neural voiceover integration checks passed.');

import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../resilience-atlas.html', import.meta.url), 'utf8');
const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const js = fs.readFileSync(new URL('../resilience-atlas.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../resilience-atlas.css', import.meta.url), 'utf8');

assert.equal(index,html,'default entrypoint should remain synced');

assert.equal((html.match(/class="ra-mobile-tab/g)||[]).length,3);
assert.match(html,/id="raSpeechPause"/);
assert.match(html,/id="raSpeechPauseLabel"/);
assert.doesNotMatch(html,/raVoiceSelect/);
assert.doesNotMatch(html,/raVoiceTest/);
assert.match(html,/data-ra-mobile-tab="simulation"/);
assert.match(html,/data-ra-mobile-tab="lab"/);
assert.match(html,/data-ra-mobile-tab="evidence"/);

assert.match(js,/\$\$\('\.ra-mobile-tab'\)\.forEach/);
assert.match(js,/button\.dataset\.raMobileTab/);
assert.match(js,/button\.setAttribute\('aria-pressed'/);

assert.match(js,/setLabSheet\(false,\{restoreFocus:false\}\)/);
assert.match(js,/setLabRunActive\(true\);[\s\S]*?try\{/);
assert.match(js,/finally\{[\s\S]*?setLabRunActive\(false\)/);
assert.match(js,/requestAnimationFrame\(\(\)=>window\.requestAnimationFrame/);
assert.match(js,/function focusAnimationStage\(/);
assert.match(js,/focusAnimationStage\(\$\('#raLabEarthMount'\)\)/);
assert.match(js,/scrollIntoView\(/);
assert.match(js,/function isCompactTouchLayout\(/);
assert.match(js,/Math\.max\(620,Math\.round\(ms\*\.5\)\)/);

assert.match(js,/const GUIDED_AUDIO_TRACKS = \[/);
assert.match(js,/function playGuidedAudioScene\(/);
assert.match(js,/guidedAudio\.play\(\)/);
assert.match(js,/guidedAudio\.pause\(\)/);
assert.doesNotMatch(js,/speechSynthesis/);
assert.match(js,/function setupNarrationEngine\(/);
assert.match(js,/function setGuidedPaused\(/);
assert.match(css,/MOBILE INTERACTION FIX — INDEPENDENT BOTTOM NAV \+ SAFARI LAB/);
assert.match(css,/\.ra-header \.ra-nav\{\s*display:none!important/);
assert.match(css,/\.ra-mobile-app-nav\{/);
assert.match(css,/z-index:100/);
assert.match(css,/body\.ra-mobile-sheet-open \.ra-mobile-app-nav/);
assert.match(css,/\.ra-scenario-playback\{\s*z-index:24!important/);
assert.match(css,/SYNCED GUIDED CONTROLS — RUN \/ NARRATION \/ PAUSE/);
assert.match(css,/IOS-SAFE PACKET MOTION/);
assert.match(css,/MOBILE RUN FOCUS — BUTTON FIT \+ IN-ANIMATION CONTROLS/);
assert.match(css,/NEURAL VOICEOVER \+ ROBUST MOBILE CONTROL STACK/);
assert.match(css,/\.ra-sim-secondary/);
assert.match(css,/\.ra-sim-controls>#raRunPreview/);
assert.match(css,/#raRunScenario/);
assert.match(css,/TOUCH \/ LANDSCAPE PHONE FIX/);
assert.match(css,/max-width:1180px/);

console.log('Mobile scenario interaction and male narration checks passed.');

import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../resilience-atlas.html',import.meta.url),'utf8');
const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../resilience-atlas.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../resilience-atlas.css',import.meta.url),'utf8');

assert.equal(index,html);
assert.match(html,/id="raHudPause"/);
assert.match(html,/id="raHudStop"/);
assert.match(html,/20260927-intro01/);

assert.match(js,/function focusAnimationStage\(/);
assert.match(js,/scrollIntoView\(\{block:'start',behavior:'auto'\}\)/);
assert.match(js,/function isCompactTouchLayout\(/);
assert.match(js,/pointer: coarse/);
assert.match(js,/window\.innerWidth<=960/);
assert.match(js,/focusAnimationStage\(\$\('#raEarthMount'\)\)/);
assert.match(js,/focusAnimationStage\(\$\('#raLabEarthMount'\)\)/);
assert.match(js,/\$\('#raHudPause'\)\?\.addEventListener/);
assert.match(js,/\$\('#raHudStop'\)\?\.addEventListener\('click',stopGuidedSimulation\)/);

assert.match(css,/MOBILE RUN FOCUS — BUTTON FIT \+ IN-ANIMATION CONTROLS/);
assert.match(css,/NEURAL VOICEOVER \+ ROBUST MOBILE CONTROL STACK/);
assert.match(css,/\.ra-sim-secondary/);
assert.match(css,/\.ra-sim-controls>#raRunPreview/);
assert.match(css,/min-height:56px!important/);
assert.match(css,/white-space:normal!important/);
assert.match(css,/body\.ra-guided-running \.ra-guided-actions/);
assert.match(css,/TOUCH \/ LANDSCAPE PHONE FIX/);
assert.match(css,/@media\(max-width:1180px\)/);
assert.match(css,/pointer:coarse/);

console.log('Mobile run-focus checks passed.');

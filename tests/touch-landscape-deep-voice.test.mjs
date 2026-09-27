import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../resilience-atlas.html',import.meta.url),'utf8');
const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../resilience-atlas.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../resilience-atlas.css',import.meta.url),'utf8');

assert.equal(index,html);
assert.match(html,/20260927-story0[1-9]/);

assert.match(js,/function isCompactTouchLayout\(/);
assert.match(js,/pointer: coarse/);
assert.match(js,/window\.innerWidth<=960/);
assert.match(js,/window\.innerWidth<=1180/);
assert.match(js,/window\.innerHeight<=720/);
assert.match(js,/scrollIntoView\(\{block:'start',behavior:'auto'\}\)/);
assert.match(js,/focusAnimationStage\(\$\('#raEarthMount'\)\)/);
assert.match(js,/focusAnimationStage\(\$\('#raLabEarthMount'\)\)/);
assert.doesNotMatch(js,/if\(window\.innerWidth<768\)/);

assert.match(js,/623ed104a08f47caa430f7b73daeccc3/);
assert.match(js,/Viktor — Serious & Composed/);
assert.doesNotMatch(js,/Orson — Firm & Measured/);
assert.doesNotMatch(js,/speechSynthesis/);

assert.match(css,/TOUCH \/ LANDSCAPE PHONE FIX/);
assert.match(css,/@media\(max-width:1180px\)/);
assert.match(css,/@media \(max-width:960px\), \(pointer:coarse\) and \(max-width:1180px\)/);
assert.match(css,/body\.ra-guided-running #simulation \.ra-story-rail\{\s*display:none!important/);
assert.match(css,/body\.ra-guided-running #raEarthMount/);
assert.match(css,/\.ra-lab-console\.is-mobile-open/);
assert.match(css,/#lab\.is-scenario-running \.ra-lab-console/);

console.log('Touch landscape and deep narrator checks passed.');

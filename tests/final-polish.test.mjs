import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../resilience-atlas.html', import.meta.url), 'utf8');
const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const js = fs.readFileSync(new URL('../resilience-atlas.js', import.meta.url), 'utf8');
const earth = fs.readFileSync(new URL('../earth-system.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../resilience-atlas.css', import.meta.url), 'utf8');

assert.equal(index,html,'default entrypoint should remain synced');
assert.ok(!html.includes('\\n  <link rel="mask-icon"'),'head must not contain a literal \\n token');
assert.match(html,/role="tablist"/);
assert.equal((html.match(/role="tab"/g)||[]).length,3);
assert.match(html,/aria-selected="true"/);
assert.match(html,/20260927-polish01/);

assert.match(js,/function maleVoiceScore\(/);
assert.match(js,/premium/);
assert.match(js,/enhanced/);
assert.match(js,/natural/);
assert.match(js,/\\bdaniel\\b/);
assert.match(js,/\\bandrew\\b/);
assert.match(js,/explicitlyFemale/);
assert.match(js,/function waitForNarrator\(/);
assert.match(js,/function narrationChunks\(/);
assert.match(js,/function narrationProfile\(/);
assert.match(js,/function speakChunk\(/);
assert.match(js,/guided\.voice=await waitForNarrator\(\)/);
assert.match(js,/replace\(\/\\bSCFR\\b\/g,'S C F R'\)/);

assert.match(js,/function tabFromHash\(/);
assert.match(js,/function syncTabHash\(/);
assert.match(js,/aria-selected/);
assert.match(js,/ArrowLeft/);
assert.match(js,/ArrowRight/);
assert.match(js,/\.ra-brand'\)\?\.addEventListener/);

assert.match(earth,/nightGradientId/);
assert.match(earth,/glossGradientId/);
assert.match(earth,/ra-earth-night-shade/);
assert.match(earth,/ra-earth-gloss/);

assert.match(css,/FINAL POLISH — EARTH DEPTH \/ NATURAL VOICE \/ MOBILE APP NAV/);
assert.match(css,/\.ra-earth-night-shade/);
assert.match(css,/\.ra-earth-gloss/);
assert.match(css,/position:fixed!important/);
assert.match(css,/bottom:max\(8px,env\(safe-area-inset-bottom,0px\)\)/);
assert.match(css,/\.ra-nav-tab\.is-active/);
assert.match(css,/touch-action:pan-y/);
assert.doesNotMatch(css,/body\.ra-mobile-sheet-open\{[\s\S]{0,100}touch-action:none/);
assert.match(css,/\.ra-earth-packets \.ra-earth-packet:nth-child\(even\)/);
assert.match(css,/\.ra-provider-sub\{\s*display:none!important/);

console.log('Final polish voice, Earth and mobile checks passed.');

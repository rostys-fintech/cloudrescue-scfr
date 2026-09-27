import fs from 'node:fs';
import assert from 'node:assert/strict';

const earth = fs.readFileSync(new URL('../earth-system.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../resilience-atlas.css', import.meta.url), 'utf8');
const js = fs.readFileSync(new URL('../resilience-atlas.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../resilience-atlas.html', import.meta.url), 'utf8');

assert.match(earth,/ra-request-packet/);
assert.match(earth,/ra-recovery-packet/);
assert.match(earth,/ra-market-node/);
assert.match(earth,/CAPACITY MARKET/);
assert.match(earth,/ra-state-changing/);
assert.match(earth,/previousSignature/);
assert.match(earth,/animateMotion path/);
assert.match(earth,/const dur=\(5\.8/);
assert.match(earth,/const dur=\(6\.6/);

assert.match(css,/STAGE 9 — MOTION SYSTEM/);
assert.match(css,/\.ra-request-packet\.is-visible/);
assert.match(css,/\.ra-recovery-packet\.is-visible/);
assert.match(css,/\.ra-market-node\.is-visible/);
assert.match(css,/@keyframes raProviderSignal/);
assert.match(css,/@keyframes raStateSettle/);
assert.match(css,/@keyframes raRecoveryDrift/);
assert.match(css,/prefers-reduced-motion/);
assert.match(css,/\.ra-request-packet,[\s\S]*\.ra-recovery-packet[\s\S]*display:none!important/);

assert.ok(js.includes("$$('.ra-scene-list button').forEach"));
assert.ok(js.includes("$$('.ra-mobile-scene-nav button').forEach"));

assert.match(html,/Semantic Motion · Stage 9/);

console.log('Semantic motion checks passed.');

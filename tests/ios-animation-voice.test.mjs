import fs from 'node:fs';
import assert from 'node:assert/strict';

const earth = fs.readFileSync(new URL('../earth-system.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../resilience-atlas.css', import.meta.url), 'utf8');
const js = fs.readFileSync(new URL('../resilience-atlas.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../resilience-atlas.html', import.meta.url), 'utf8');

assert.doesNotMatch(earth,/<animateMotion/);
assert.match(earth,/requestAnimationFrame\(animatePackets\)/);
assert.match(earth,/cancelAnimationFrame\(rafId\)/);
assert.match(earth,/getClientRects\(\)\.length/);
assert.match(earth,/getTotalLength\(\)/);
assert.match(earth,/getPointAtLength/);
assert.match(earth,/speedFactor=reduced \? \.42 : 1/);
assert.match(earth,/refreshPacketGeometry\(\);/);

assert.match(css,/IOS-SAFE PACKET MOTION/);
assert.match(css,/raReducedEssentialState/);
assert.doesNotMatch(css,/\.ra-earth-packet,[\s\S]{0,120}display:none!important/);

assert.match(html,/id="raVoiceSelect"/);
assert.match(html,/id="raVoiceTest"/);
assert.match(js,/function rankedMaleVoices\(/);
assert.match(js,/function populateNarratorSelect\(/);
assert.match(js,/function setupNarratorControls\(/);
assert.match(js,/Auto — best available male voice/);
assert.match(js,/await waitForNarrator\(\)/);

console.log('iOS animation engine and narrator controls checks passed.');

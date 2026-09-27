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

assert.match(html,/id="raSpeechPause"/);
assert.match(js,/const guidedAudio = new Audio\(\)/);
assert.match(js,/guidedAudio\.setAttribute\('playsinline',''\)/);
assert.match(js,/function playGuidedAudioScene\(/);
assert.match(js,/function setupNarrationEngine\(/);
assert.doesNotMatch(js,/speechSynthesis/);
assert.match(js,/earth\.simulation\.setPaused/);
assert.match(earth,/function setPaused\(paused\)/);
assert.match(earth,/motionPaused/);

console.log('iOS animation engine and neural-audio checks passed.');

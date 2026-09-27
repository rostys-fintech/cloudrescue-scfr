import fs from 'node:fs';
import assert from 'node:assert/strict';

const js=fs.readFileSync(new URL('../resilience-atlas.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../resilience-atlas.css',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../resilience-atlas.html',import.meta.url),'utf8');

assert.match(html,/20260927-story01/);
assert.match(js,/const GUIDED_CUES = \[/);
assert.equal((js.match(/visualScene:/g)||[]).length >= 35,true);

for(const cue of [
  "at:2.603,id:'s2-fail'",
  "at:4.736,id:'s3-request'",
  "at:10.155,id:'s3-gap'",
  "at:3.712,id:'s4-ringfenced'",
  "at:7.168,id:'s4-blocked'",
  "at:1.365,id:'s5-pool'",
  "at:13.192,id:'s5-redirect'",
  "at:14.984,id:'s5-recover'",
  "at:4.821,id:'s6-market'",
  "at:6.528,id:'s6-individual'",
  "at:8.235,id:'s6-scfr'",
  "at:20.295,id:'s6-boundary'"
]){
  assert.ok(js.includes(cue),'missing timestamp cue '+cue);
}

assert.match(js,/function cueAtTime\(sceneIndex,time\)/);
assert.match(js,/time\+0\.018>=candidate\.at/);
assert.match(js,/function startGuidedCueSync\(/);
assert.match(js,/guidedAudio\.currentTime\|\|0/);
assert.match(js,/requestAnimationFrame\(tick\)/);
assert.match(js,/earth\.simulation\.update\(\{\.\.\.earthPayload\(c\),scene:cue\.visualScene\}\)/);
assert.match(js,/function applyGuidedMetric\(/);
assert.match(js,/runSilentCueTimeline/);

for(const klass of [
  'ra-sync-s2-fail','ra-sync-s2-affected','ra-sync-s2-capacity-lost',
  'ra-sync-s3-request','ra-sync-s3-market','ra-sync-s3-gap',
  'ra-sync-s4-ringfenced','ra-sync-s4-blocked','ra-sync-s4-stranded',
  'ra-sync-s5-pool','ra-sync-s5-coordinate','ra-sync-s5-redirect','ra-sync-s5-recover',
  'ra-sync-s6-market','ra-sync-s6-individual','ra-sync-s6-scfr','ra-sync-s6-boundary'
]){
  assert.ok(css.includes(klass),'missing visual choreography '+klass);
}

assert.match(css,/PROVIDER OFFLINE|provider/i);
assert.match(css,/raSyncFailureRing/);
assert.match(css,/raSyncMarketPulse/);
assert.match(css,/raSyncReserveLock/);
assert.match(css,/raSyncPoolArrive/);
assert.match(css,/raSyncRecoverySettle/);

console.log('Word-level narrator synchronization checks passed.');

import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../resilience-atlas.html',import.meta.url),'utf8');
const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../resilience-atlas.js',import.meta.url),'utf8');
const earth=fs.readFileSync(new URL('../earth-system.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../resilience-atlas.css',import.meta.url),'utf8');

assert.equal(index,html);
assert.match(html,/202609(?:27-story0[1-9]|28-mobile0[1-9])/);

assert.match(earth,/pathLength="1"/);
assert.match(earth,/--ra-intro-index:/);

assert.match(js,/const GUIDED_CUES = \[/);
assert.match(js,/at:1\.749,id:'s1-providers'/);
assert.match(js,/at:2\.304,id:'s1-banks'/);
assert.match(js,/at:3\.243,id:'s1-links'/);
assert.match(js,/at:5\.035,id:'s1-flow'/);
assert.match(js,/at:10\.197,id:'s1-cluster'/);
assert.match(js,/at:14\.049,id:'s1-risk'/);
assert.match(js,/function cueAtTime\(/);
assert.match(js,/guidedAudio\.currentTime/);
assert.match(js,/if\(sceneIndex===0\)/);
assert.match(js,/function guidedCueKicker\(/);
assert.match(js,/function commitGuidedCue\(/);
assert.match(js,/return 'LIVE CUE'/);
assert.match(js,/function startGuidedCueSync\(/);
assert.doesNotMatch(js,/function startGuidedIntro\(/);

assert.match(css,/WORD-SYNCED GUIDED TIMELINE/);
assert.match(css,/STORYBOARD STAGE 1 — VIDEO HUD \+ SCENE 01 MASTER/);
assert.match(css,/#simulation \.ra-video-hud\{/);
assert.match(css,/margin:0!important/);
assert.match(css,/raStage1EarthBoot/);
assert.match(css,/raStage1NodeOn/);
assert.match(css,/raStage1ClusterPulse/);
assert.match(css,/raStage1RiskPulse/);
assert.match(css,/ra-sync-s1-world/);
assert.match(css,/ra-sync-s1-providers/);
assert.match(css,/ra-sync-s1-banks/);
assert.match(css,/ra-sync-s1-links/);
assert.match(css,/ra-sync-s1-flow/);
assert.match(css,/ra-sync-s1-cluster/);
assert.match(css,/ra-sync-s1-risk/);
assert.match(css,/attr\(data-guided-caption\)/);

console.log('Word-synced guided intro checks passed.');

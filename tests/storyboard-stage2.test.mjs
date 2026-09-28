import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../resilience-atlas.html',import.meta.url),'utf8');
const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../resilience-atlas.css',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../resilience-atlas.js',import.meta.url),'utf8');

assert.equal(index,html);
assert.match(html,/202609(?:27-story0[1-9]|28-mobile0[1-9])/);
assert.match(css,/STORYBOARD STAGE 2 — SCENE 02 PROVIDER FAILURE MASTER/);

for(const klass of [
  'ra-sync-s2-stable',
  'ra-sync-s2-target',
  'ra-sync-s2-fail',
  'ra-sync-s2-affected',
  'ra-sync-s2-capacity-lost',
  'ra-sync-s2-shared',
  'ra-sync-s2-systemic'
]){
  assert.ok(css.includes(klass),'missing Stage 2 cue style '+klass);
}

assert.match(css,/raStage2ProviderDrop/);
assert.match(css,/raStage2Shockwave/);
assert.match(css,/raStage2AffectedBanks/);
assert.match(css,/raStage2SystemicRing/);

assert.match(js,/if\(sceneIndex===1\) return 'FAILURE SEQUENCE'/);
assert.match(js,/function guidedCueKicker\(/);
assert.match(js,/function commitGuidedCue\(/);
assert.match(js,/return 'FAILURE SEQUENCE'/);
assert.match(js,/\$\('#raGuidedCaption'\)\.textContent=cue\.caption/);

assert.match(js,/ra-cue-transitioning/);

assert.match(css,/#raEarthMount\.ra-cue-transitioning \.ra-earth-svg/);

console.log('Storyboard Stage 2 checks passed.');

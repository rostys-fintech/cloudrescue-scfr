import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../resilience-atlas.html',import.meta.url),'utf8');
const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../resilience-atlas.css',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../resilience-atlas.js',import.meta.url),'utf8');

assert.equal(index,html);
assert.match(html,/20260927-story0[1-9]/);
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

assert.match(js,/else if\(sceneIndex===1\)/);
assert.match(js,/animateGuidedCueCopy/);
assert.match(js,/kicker\.textContent='FAILURE SEQUENCE'/);
assert.match(js,/caption\.textContent=cue\.caption/);

console.log('Storyboard Stage 2 checks passed.');

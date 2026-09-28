import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../resilience-atlas.html',import.meta.url),'utf8');
const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../resilience-atlas.css',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../resilience-atlas.js',import.meta.url),'utf8');

assert.equal(index,html);
assert.match(html,/ra-guided-hud ra-video-hud/);
assert.doesNotMatch(html,/id="raWaveform"/);
assert.match(html,/202609(?:27-story0[1-9]|28-(?:mobile|qa)0[1-9])/);

assert.match(css,/STORYBOARD STAGE 1 — VIDEO HUD \+ SCENE 01 MASTER/);
assert.match(css,/#simulation \.ra-video-hud\{[\s\S]*position:relative!important[\s\S]*margin:0!important/);
assert.match(css,/grid-template-areas:[\s\S]*"status copy actions"[\s\S]*"progress progress progress"/);
assert.match(css,/body\.ra-guided-running #simulation \.ra-video-hud\{[\s\S]*margin:0!important/);

for(const klass of ['ra-sync-s1-world','ra-sync-s1-providers','ra-sync-s1-banks','ra-sync-s1-links','ra-sync-s1-flow','ra-sync-s1-cluster','ra-sync-s1-risk']){
  assert.ok(css.includes(klass),'missing Stage 1 cue style '+klass);
}

assert.match(js,/if\(sceneIndex===0\)/);
assert.match(js,/function guidedCueKicker\(/);
assert.match(js,/function commitGuidedCue\(/);
assert.match(js,/return 'LIVE CUE'/);
assert.match(js,/\$\('#raGuidedCaption'\)\.textContent=cue\.caption/);

assert.match(js,/commitGuidedCue/);

assert.match(js,/prepareGuidedOpening/);

assert.match(js,/renderGuidedShell/);

assert.match(css,/GUIDED CONTINUITY ENGINE — no hard resets between cues/);

console.log('Storyboard Stage 1 checks passed.');

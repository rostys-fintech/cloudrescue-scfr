import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../resilience-atlas.html',import.meta.url),'utf8');
const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../resilience-atlas.js',import.meta.url),'utf8');
const earth=fs.readFileSync(new URL('../earth-system.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../resilience-atlas.css',import.meta.url),'utf8');

assert.equal(index,html);
assert.match(html,/20260927-intro01/);

assert.match(earth,/pathLength="1"/);
assert.match(earth,/--ra-intro-index:/);
assert.match(earth,/ra-earth-bank[^\n]*--ra-intro-index/);
assert.match(earth,/ra-earth-provider[^\n]*--ra-intro-index/);

assert.match(js,/function startGuidedIntro\(/);
assert.match(js,/ra-guided-intro/);
assert.match(js,/Mapping shared dependencies/);
assert.match(js,/guidedDelay\(4300,runId\)/);
assert.match(js,/introComplete=i===0/);
assert.match(js,/introFinished/);
assert.match(js,/classList\.remove\('ra-guided-intro'\)/);

assert.match(css,/GUIDED INTRO — BUILD THE SHARED DEPENDENCY MAP ON SCENE 01/);
assert.match(css,/raIntroAtmosphere/);
assert.match(css,/raIntroProvider/);
assert.match(css,/raIntroBank/);
assert.match(css,/raIntroDependency/);
assert.match(css,/raIntroPackets/);
assert.match(css,/MAPPING DEPENDENCIES/);

console.log('Guided intro animation checks passed.');

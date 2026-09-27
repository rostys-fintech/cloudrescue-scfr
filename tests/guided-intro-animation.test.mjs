import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../resilience-atlas.html',import.meta.url),'utf8');
const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const js=fs.readFileSync(new URL('../resilience-atlas.js',import.meta.url),'utf8');
const earth=fs.readFileSync(new URL('../earth-system.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../resilience-atlas.css',import.meta.url),'utf8');

assert.equal(index,html);
assert.match(html,/20260927-intro02/);

assert.match(earth,/pathLength="1"/);
assert.match(earth,/--ra-intro-index:/);
assert.match(earth,/ra-earth-bank[^\n]*--ra-intro-index/);
assert.match(earth,/ra-earth-provider[^\n]*--ra-intro-index/);

assert.match(js,/function startGuidedIntro\(/);
assert.match(js,/ra-guided-intro/);
assert.match(js,/Mapping shared dependencies/);
assert.match(js,/const phases=\[/);
assert.match(js,/ra-intro-world/);
assert.match(js,/ra-intro-providers/);
assert.match(js,/ra-intro-banks/);
assert.match(js,/ra-intro-links/);
assert.match(js,/ra-intro-flow/);
assert.match(js,/Initializing global system map/);
assert.match(js,/Activating 3 shared cloud providers/);
assert.match(js,/Connecting 20 synthetic banks/);
assert.match(js,/Starting critical data flows/);
assert.match(js,/introComplete=i===0/);
assert.match(js,/introFinished/);
assert.match(js,/classList\.remove\('ra-guided-intro'\)/);

assert.match(css,/GUIDED INTRO — BUILD THE SHARED DEPENDENCY MAP ON SCENE 01/);
assert.match(css,/raIntroAtmosphere/);
assert.match(css,/raIntroProvider/);
assert.match(css,/raIntroBank/);
assert.match(css,/raIntroDependency/);
assert.match(css,/raIntroPackets/);
assert.match(css,/GUIDED INTRO V2 — EXPLICIT FIVE-PHASE SYSTEM BUILD/);
assert.match(css,/attr\(data-intro-phase\)/);
assert.match(css,/raIntroScanRing/);
assert.match(css,/ra-intro-providers/);
assert.match(css,/ra-intro-banks/);
assert.match(css,/ra-intro-links/);
assert.match(css,/ra-intro-flow/);
assert.match(css,/animation:none!important/);

console.log('Visible five-phase guided intro checks passed.');

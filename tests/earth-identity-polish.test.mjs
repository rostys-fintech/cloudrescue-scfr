import fs from 'node:fs';
import assert from 'node:assert/strict';

const mark = fs.readFileSync(new URL('../resilience-atlas-mark.svg', import.meta.url), 'utf8');
const favicon = fs.readFileSync(new URL('../favicon.svg', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../resilience-atlas.html', import.meta.url), 'utf8');
const index = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const earth = fs.readFileSync(new URL('../earth-system.js', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../resilience-atlas.css', import.meta.url), 'utf8');

assert.equal(favicon, mark, 'favicon and canonical Resilience Atlas mark should match');
assert.match(mark,/aria-label="Resilience Atlas"/);
assert.match(mark,/#35A7FF/);
assert.match(mark,/#27D3B2/);
assert.doesNotMatch(mark,/#ff243d/i);
assert.doesNotMatch(mark,/rect x="23" y="40" width="18" height="8"/);

for (const doc of [html,index]) {
  assert.match(doc,/resilience-atlas-mark\.svg\?v=20260927-polish01/);
  assert.match(doc,/class="ra-brand-icon"/);
}

assert.match(earth,/const idSuffix=/);
assert.match(earth,/raOceanGlow-'\+idSuffix/);
assert.match(earth,/raGlobeClip-'\+idSuffix/);
assert.match(earth,/raSphereLight-'\+idSuffix/);
assert.match(earth,/ra-earth-sphere-light/);

for (const name of ['North America','South America','Greenland','Europe','Africa','Asia','India','Japan','Australia','New Zealand']) {
  assert.ok(earth.includes('/* '+name+' */'), 'missing recognizable geography for '+name);
}

const bankBlock = earth.match(/const BANK_POSITIONS = \{([\s\S]*?)\n\};/);
assert.ok(bankBlock,'BANK_POSITIONS block should exist');
const positions=[...bankBlock[1].matchAll(/B\d{2}:\[(\d+),(\d+)\]/g)].map(m=>[Number(m[1]),Number(m[2])]);
assert.equal(positions.length,20);
for(const [x,y] of positions){
  assert.ok(Math.hypot(x-500,y-310) <= 252, 'bank node must stay inside globe: '+x+','+y);
}

const providerBlock = earth.match(/const PROVIDER_META = \{([\s\S]*?)\n\};/);
assert.ok(providerBlock,'PROVIDER_META block should exist');
const providerPositions=[...providerBlock[1].matchAll(/\{ x: (\d+), y: (\d+)/g)].map(m=>[Number(m[1]),Number(m[2])]);
assert.equal(providerPositions.length,3);
for(const [x,y] of providerPositions){
  assert.ok(Math.hypot(x-500,y-310) <= 252, 'provider node must stay inside globe: '+x+','+y);
}

assert.match(css,/EARTH \+ IDENTITY POLISH/);
assert.match(css,/#raEarthMount,\s*\n#raLabEarthMount\{\s*\n  min-height:540px!important/);
assert.match(css,/#raEarthMount \.ra-earth-svg,\s*\n#raLabEarthMount \.ra-earth-svg/);
assert.match(css,/transform:scale\(1\.18\)!important/);

console.log('Earth identity and shared-viewport checks passed.');

import fs from 'node:fs';
import assert from 'node:assert/strict';

const earth = fs.readFileSync(new URL('../earth-system.js', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../resilience-atlas.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../resilience-atlas.css', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('../resilience-atlas.js', import.meta.url), 'utf8');

assert.match(earth,/export function createEarthSystem/);
assert.match(earth,/from '\.\/data\/banks\.js'/);
assert.match(earth,/BANK_POSITIONS/);
assert.match(earth,/LAND_PATHS/);
assert.match(earth,/ra-earth-link/);
assert.match(earth,/ra-recovery-flow/);
assert.match(earth,/Illustrative topology · synthetic institutions/);

for (const mount of ['raEarthMount','raLabEarthMount','raEvidenceEarthMount']) {
  assert.match(html,new RegExp('id=["\\']'+mount+'["\\']'));
}

assert.match(app,/createEarthSystem\(\$\('#raEarthMount'\), \{mode:'simulation'\}\)/);
assert.match(app,/createEarthSystem\(\$\('#raLabEarthMount'\), \{mode:'lab'\}\)/);
assert.match(app,/createEarthSystem\(\$\('#raEvidenceEarthMount'\), \{mode:'evidence'\}\)/);

assert.match(css,/STAGE 3 — SHARED EARTH SYSTEM ENGINE/);
assert.match(css,/\.ra-earth-system/);
assert.match(css,/\.ra-earth-land path/);
assert.match(css,/\.ra-earth-link\.is-disrupted/);
assert.match(css,/\.ra-recovery-flow\.is-visible/);
assert.match(css,/prefers-reduced-motion/);

console.log('Earth System engine checks passed.');

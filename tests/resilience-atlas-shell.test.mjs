import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../resilience-atlas.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../resilience-atlas.css', import.meta.url), 'utf8');
const js = fs.readFileSync(new URL('../resilience-atlas.js', import.meta.url), 'utf8');

assert.match(html,/Resilience Atlas/);
assert.match(html,/Simulation/);
assert.match(html,/Scenario Lab/);
assert.match(html,/Model &amp; Evidence/);
assert.match(html,/design-tokens\.css/);
assert.match(html,/resilience-atlas\.css/);
assert.doesNotMatch(html,/styles-v2\.css/);
assert.doesNotMatch(html,/href="styles\.css/);

for (const id of [
  'raEarthMount','raLabEarthMount','raEvidenceEarthMount','raThemeToggle','raRunPreview','raProviderToggles','raRunScenario',
  'raMarketPct','raReservePct','raRuleSelect','raLabResilience'
]) {
  assert.match(html,new RegExp(`id=["']${id}["']`),`missing ${id}`);
}

assert.match(js,/from '\.\/data\/banks\.js'/);
assert.match(js,/from '\.\/model\/simulation\.js'/);
assert.match(js,/compareStrategies/);
assert.match(js,/systemStats/);
assert.doesNotMatch(js,/styles-v2/);
assert.doesNotMatch(html,/Stage 3 mount point/);
assert.doesNotMatch(html,/Same visualization engine/);

assert.match(css,/var\(--ra-canvas\)/);
assert.match(css,/@media\(max-width:767px\)/);
assert.match(css,/@media\(max-width:429px\)/);

console.log('Resilience Atlas clean-shell checks passed.');

import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../resilience-atlas.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../resilience-atlas.css', import.meta.url), 'utf8');
const tokens = fs.readFileSync(new URL('../design-tokens.css', import.meta.url), 'utf8');

assert.match(html,/Switch between dark simulation and light analysis theme/);
assert.match(html,/<span>Analysis<\/span>/);

assert.match(tokens,/\[data-ra-theme="light"\]/);
assert.match(tokens,/--ra-provider-blue: #327CC4/);
assert.match(tokens,/--ra-provider-orange: #C9772E/);
assert.match(tokens,/--ra-provider-green: #2D9478/);
assert.match(tokens,/--ra-critical: #C94A5D/);

assert.match(css,/STAGE 7 — LIGHT \/ ANALYSIS THEME/);
assert.match(css,/\[data-ra-theme="light"\] \.ra-earth-system/);
assert.match(css,/\[data-ra-theme="light"\] \.ra-earth-atmosphere/);
assert.match(css,/filter:none/);
assert.match(css,/\[data-ra-theme="light"\] \.ra-guided-hud/);
assert.match(css,/\[data-ra-theme="light"\] \.ra-strategy-switch/);
assert.match(css,/\[data-ra-theme="light"\] \.ra-model-card/);
assert.match(css,/\[data-ra-theme="light"\] \.ra-equation-grid code/);
assert.match(css,/\[data-ra-theme="light"\] \.ra-source-grid a/);
assert.match(css,/prefers-reduced-motion/);

console.log('Light Analysis theme checks passed.');

import fs from 'node:fs';
import assert from 'node:assert/strict';

const html=fs.readFileSync(new URL('../resilience-atlas.html',import.meta.url),'utf8');
const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../resilience-atlas.css',import.meta.url),'utf8');

assert.equal(index,html);
assert.match(html,/202609(?:27-story0[1-9]|28-mobile0[1-9])/);
assert.match(html,/id="raRunPreview"/);
assert.match(html,/id="raRunLabel"/);

assert.match(css,/RUN BUTTON FIT — PRIMARY ACTION ALWAYS GETS ITS OWN ROW/);
assert.match(css,/\.ra-sim-controls\{[\s\S]*display:flex!important[\s\S]*flex-direction:column!important/);
assert.match(css,/\.ra-sim-controls>#raRunPreview\{[\s\S]*width:100%!important[\s\S]*min-height:64px!important/);
assert.match(css,/#raRunLabel\{[\s\S]*white-space:normal!important[\s\S]*hyphens:none!important/);
assert.match(css,/\.ra-sim-secondary\{[\s\S]*grid-template-columns:1fr 1fr!important/);

console.log('Run button fit checks passed.');

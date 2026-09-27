import fs from 'node:fs';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('../resilience-atlas.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../resilience-atlas.css', import.meta.url), 'utf8');
const js = fs.readFileSync(new URL('../resilience-atlas.js', import.meta.url), 'utf8');

for (const id of [
  'raLabSheet','raCloseLabSheet','raOpenLabSheet','raLabBackdrop',
  'raMobileProvider','raMobileMarket','raMobileReserve'
]) {
  assert.match(html,new RegExp("id=[\\\"']"+id+"[\\\"']"),'missing '+id);
}

assert.equal((html.match(/data-ra-mobile-scene="/g)||[]).length,6);
assert.equal((html.match(/data-ra-mobile-tab="/g)||[]).length,3);
assert.match(html,/aria-controls="raLabSheet"/);
assert.match(html,/aria-expanded="false"/);

assert.match(js,/function setLabSheet\(/);
assert.match(js,/function setupMobileLab\(/);
assert.match(js,/ra-mobile-sheet-open/);
assert.match(js,/dataset\.raMobileScene/);
assert.match(js,/event\.key==='Escape'/);
assert.match(js,/window\.innerWidth>=768/);
assert.match(js,/setupMobileLab\(\)/);
assert.match(js,/dataset\.raMobileTab/);
assert.match(js,/\$\$\('\.ra-mobile-tab'\)/);

assert.match(css,/STAGE 8 — MOBILE UX/);
assert.match(css,/\.ra-mobile-scene-nav/);
assert.match(css,/\.ra-mobile-lab-bar/);
assert.match(css,/\.ra-lab-console\.is-mobile-open/);
assert.match(css,/\.ra-mobile-sheet-backdrop/);
assert.match(css,/MOBILE INTERACTION FIX — INDEPENDENT BOTTOM NAV \+ SAFARI LAB/);
assert.match(css,/\.ra-mobile-app-nav/);
assert.match(css,/\.ra-header \.ra-nav\{\s*display:none!important/);
assert.match(css,/env\(safe-area-inset-bottom/);
assert.match(css,/min-height:44px/);
assert.match(css,/clamp\(390px,66svh,560px\)/);
assert.match(css,/@media\(max-width:429px\)/);

console.log('Mobile UX checks passed.');

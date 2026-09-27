import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, js, css] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../app.js', import.meta.url), 'utf8'),
  readFile(new URL('../styles.css', import.meta.url), 'utf8')
]);

const requiredIds = [
  'stage','providers','bankGroups','sceneTitle','sceneText','sceneStat','stageStatus','hudAffected','hudGap','networkLines','scfrReserveLayer','themeToggle','themeLabel',
  'providerSelect','marketPct','reservePct','ruleSelect',
  'strategyCards','decisionInsight','frontier','exportBtn'
];

for (const id of requiredIds) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `index.html should contain #${id}`);
}

assert.match(js, /compareStrategies/, 'app should call the simulation comparison');
assert.match(js, /resilienceFrontier/, 'app should render a resilience frontier');
assert.match(js, /exportScenario/, 'app should expose reproducible scenario export');
assert.match(js, /drawNetworkLines/, 'app should render provider-to-bank network connections');
assert.match(js, /setupTheme/, 'app should initialize persistent light-dark theme switching');
assert.match(js, /cloudrescue-theme/, 'theme choice should be persisted locally');
assert.match(js, /scfr-line/, 'app should render SCFR pooled-capacity connections');
assert.match(js, /\$\$\('\.preset'\)/, 'preset controls should use the multi-element selector helper');
assert.match(css, /\.stage\.scene-2/, 'story should include scene-specific visual transitions');
assert.match(css, /\.decision-insight/, 'research insight panel should be styled');

console.log('✓ CloudRescue interface smoke checks passed');

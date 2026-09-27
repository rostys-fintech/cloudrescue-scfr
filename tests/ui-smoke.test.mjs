import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, js, css] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../app.js', import.meta.url), 'utf8'),
  readFile(new URL('../styles.css', import.meta.url), 'utf8')
]);

const requiredIds = [
  'stage','providers','bankGroups','sceneTitle','sceneText','sceneStat','stageStatus','hudAffected','hudGap','networkLines','scfrReserveLayer','themeToggle','themeLabel','focusStory','heroDemo','heroLab','narrationToggle','voiceSelect','storyCaption','captionKicker','captionText','visualSignal','demoProgressBar','impactOverlay','impactKicker','impactValue','impactLabel','motionLayer','ringFence',
  'providerSelect','marketPct','reservePct','ruleSelect',
  'strategyCards','decisionInsight','beforeAfter','frontier','sensitivityHeatmap','exportBtn','replayScenarioBtn','scenarioId','seedInput','generateScenarioBtn','shareScenarioBtn','challengeTitle','challengeMetrics'
];

for (const id of requiredIds) {
  assert.match(html, new RegExp(`id=["']${id}["']`), `index.html should contain #${id}`);
}

assert.match(js, /compareStrategies/, 'app should call the simulation comparison');
assert.match(js, /resilienceFrontier/, 'app should render a resilience frontier');
assert.match(js, /exportScenario/, 'app should expose reproducible scenario export');
assert.match(js, /replayCurrentScenario/, 'Stress Lab should replay the live scenario as a guided story');
assert.match(js, /renderBeforeAfter/, 'app should render a same-budget before-after mechanism comparison');
assert.match(js, /renderSensitivity/, 'app should render an interactive sensitivity explorer');
assert.match(js, /scenarioFromSeed/, 'app should generate deterministic scenarios from a seed');
assert.match(js, /scenarioShareURL/, 'app should create reproducible scenario links');
assert.match(js, /loadScenarioFromURL/, 'shared scenario links should restore assumptions');
assert.match(js, /challengeEvaluation/, 'challenge mode should evaluate multiple mission constraints');
assert.match(js, /drawNetworkLines/, 'app should render provider-to-bank network connections');
assert.match(js, /setupTheme/, 'app should initialize persistent light-dark theme switching');
assert.match(js, /setFocusMode/, 'app should provide a presentation focus mode');
assert.match(js, /SpeechSynthesisUtterance/, 'narrated demo should use browser speech synthesis');
assert.match(js, /preferredNarrator/, 'narration should prefer a configured analytical narrator voice');
assert.match(js, /utterance\.onend/, 'guided demo should wait for actual narration completion');
assert.match(js, /demoRunId/, 'cancelled narration must not advance a newer demo run');
assert.match(js, /outcomeBanks/, 'final story should visualize recovery at bank level');
assert.match(js, /reserveTokens/, 'reserve fragmentation should be shown with visual capacity tokens');
assert.match(js, /runSceneMotion/, 'guided story should choreograph moving capacity');
assert.match(js, /animateBlockedToken/, 'ring-fenced reserve should visibly fail to cross the barrier');
assert.match(js, /triggerCamera/, 'guided story should use scene camera choreography');
assert.match(js, /renderVisualSignal/, 'story should render visual event cues');
assert.match(js, /renderImpact/, 'story should expose a high-signal outcome for every scene');
assert.match(js, /startDemo/, 'story should support timed narrated autoplay');
assert.match(js, /ArrowRight/, 'story should support keyboard scene navigation');
assert.match(js, /cloudrescue-theme/, 'theme choice should be persisted locally');
assert.match(js, /scfr-line/, 'app should render SCFR pooled-capacity connections');
assert.match(js, /\$\$\('\.preset'\)/, 'preset controls should use the multi-element selector helper');
assert.match(css, /\.stage\.scene-2/, 'story should include scene-specific visual transitions');
assert.match(css, /\.decision-insight/, 'research insight panel should be styled');
assert.match(css, /\.impact-overlay/, 'large scene outcome callout should be styled');
assert.match(css, /\.capacity-story/, 'capacity shortage should have a dedicated visual mechanism');
assert.match(css, /\.reserve-mechanism/, 'reserve fragmentation should have a dedicated visual mechanism');
assert.match(css, /\.outcome-banks/, 'bank-level recovery outcomes should be visually encoded');
assert.match(css, /\.motion-layer/, 'moving capacity should have a dedicated overlay layer');
assert.match(css, /\.ring-fence/, 'individual-reserve fragmentation should show a ring-fence barrier');
assert.match(css, /cameraIncident/, 'scene transitions should include guided camera motion');
assert.match(css, /body\.demo-playing \.scene-3 \.visual-signal/, 'shortage scene should promote one dominant visual mechanism');
assert.match(css, /blocked-impact/, 'ring-fence collision should have a visible impact cue');
assert.match(css, /same-budget-badge/, 'SCFR scene should visibly state that no extra reserve is added');
assert.match(css, /\.before-after-card/, 'same-budget before-after comparison should be styled');
assert.match(css, /\.sensitivity-heatmap/, 'sensitivity explorer should be styled');
assert.match(css, /\.architecture-flow/, 'model architecture should be visibly explained');
assert.match(css, /\.scenario-generator/, 'seeded scenario generator should be styled');
assert.match(css, /\.challenge-tabs/, 'multi-mission challenge controls should be styled');
assert.match(css, /\.challenge-metrics/, 'challenge criteria should be visually inspectable');
assert.match(css, /\.learning-card/, 'FirstCommit learning journey should be visibly presented');
assert.match(html, /WHY THIS PROBLEM IS REAL/, 'story should visibly ground the scenario in real regulatory evidence');
assert.match(html, /OBSERVED IN THE REAL WORLD/, 'methodology should distinguish observed evidence from synthetic assumptions');
assert.match(html, /BUILD JOURNEY · FIRSTCOMMIT/, 'submission should communicate learning and growth');
assert.match(html, /AI-assisted, human-owned/, 'submission should disclose AI assistance and project ownership');

console.log('✓ CloudRescue interface smoke checks passed');


const invalidSingleSelectorForEach = /(?<!\$)\$\([^\n]+\)\.forEach/g;
assert.equal(
  invalidSingleSelectorForEach.test(js),
  false,
  'multi-element DOM operations must use $$ helper rather than $'
);

import { banks, providers } from './data/banks.js';
import { compareStrategies, systemStats } from './model/simulation.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const format = value => Math.round(value).toLocaleString('en-US');

const state = {
  tab: 'simulation',
  scene: 0,
  outageProvider: 'blue',
  marketPct: 20,
  reservePct: 25,
  allocationRule: 'systemic'
};

const sceneTitles = [
  'Stable dependency network',
  'Shared-provider failure',
  'Simultaneous backup demand',
  'Reserve stranded by ring-fencing',
  'Pooled reserve reallocation',
  'Recovery outcome comparison'
];

function args(){
  return {
    outageProvider: state.outageProvider,
    marketPct: state.marketPct,
    reservePct: state.reservePct,
    allocationRule: state.allocationRule
  };
}

function comparison(){
  return compareStrategies(args());
}

function renderBaseline(){
  const c = comparison();
  const stats = systemStats();

  $('#raBankCount').textContent = banks.length;
  $('#raProviderCount').textContent = providers.length;
  $('#raBaselineGap').textContent = format(Math.max(0, c.market.totalDemand - c.market.allocated));
  $('#raAffected').textContent = `${c.market.affectedCount} / ${banks.length}`;
  $('#raUnmet').textContent = format(Math.max(0, c.market.totalDemand - c.market.allocated));
  $('#raRestored').textContent = `${Math.round(c.scfr.criticalRestoredPct)}%`;
  $('#raResilience').textContent = Math.round(c.scfr.resilience);
  $('#raSystemStatus').textContent = state.scene === 0 ? 'SYSTEM STABLE' : 'SIMULATION READY';

  document.documentElement.style.setProperty('--ra-system-hhi', stats.hhi.toFixed(0));
}

function renderLab(){
  const c = comparison();
  const provider = providers.find(item => item.id === state.outageProvider);

  $('#raMarketLabel').textContent = `${state.marketPct}%`;
  $('#raReserveLabel').textContent = `${state.reservePct}%`;
  $('#raLabTitle').textContent = `${provider?.name || state.outageProvider} outage`;
  $('#raLabAffected').textContent = `${c.market.affectedCount} / ${banks.length}`;
  $('#raLabUnmet').textContent = format(Math.max(0, c.market.totalDemand - c.market.allocated));
  $('#raLabRestored').textContent = `${Math.round(c.scfr.criticalRestoredPct)}%`;
  $('#raLabResilience').textContent = Math.round(c.scfr.resilience);
  $('#raMarketScore').textContent = Math.round(c.market.resilience);
  $('#raIndividualScore').textContent = Math.round(c.individual.resilience);
  $('#raScfrScore').textContent = Math.round(c.scfr.resilience);
}

function renderScene(){
  $('#raCanvasTitle').textContent = sceneTitles[state.scene];
  $$('.ra-scene-list button').forEach((button,index)=>{
    button.classList.toggle('is-active', index === state.scene);
  });
  renderBaseline();
}

function switchTab(tab){
  state.tab = tab;
  $$('.ra-nav-tab').forEach(button=>{
    button.classList.toggle('is-active', button.dataset.raTab === tab);
  });
  $$('.ra-view').forEach(view=>{
    view.classList.toggle('is-active', view.dataset.raView === tab);
  });
  if(tab === 'lab') renderLab();
}

function setupTabs(){
  $$('.ra-nav-tab').forEach(button=>{
    button.addEventListener('click',()=>switchTab(button.dataset.raTab));
  });
}

function setupTheme(){
  const button = $('#raThemeToggle');
  const saved = localStorage.getItem('resilience-atlas-theme');
  if(saved === 'light') document.documentElement.dataset.raTheme = 'light';

  const sync = ()=>{
    const light = document.documentElement.dataset.raTheme === 'light';
    button.setAttribute('aria-pressed', light ? 'true' : 'false');
    const meta = document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content', light ? '#F5F8FC' : '#070A0F');
  };

  button.addEventListener('click',()=>{
    const next = document.documentElement.dataset.raTheme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.raTheme = next;
    localStorage.setItem('resilience-atlas-theme',next);
    sync();
  });
  sync();
}

function setupScenes(){
  $$('.ra-scene-list button').forEach(button=>{
    button.addEventListener('click',()=>{
      state.scene = Number(button.dataset.raScene);
      renderScene();
    });
  });

  $('#raRunPreview').addEventListener('click',()=>{
    state.scene = state.scene >= 5 ? 0 : state.scene + 1;
    renderScene();
  });
}

function setupLab(){
  $('#raProviderSelect').addEventListener('change',event=>{
    state.outageProvider = event.target.value;
    renderLab();
    renderBaseline();
  });
  $('#raMarketPct').addEventListener('input',event=>{
    state.marketPct = Number(event.target.value);
    renderLab();
    renderBaseline();
  });
  $('#raReservePct').addEventListener('input',event=>{
    state.reservePct = Number(event.target.value);
    renderLab();
    renderBaseline();
  });
  $('#raRuleSelect').addEventListener('change',event=>{
    state.allocationRule = event.target.value;
    renderLab();
    renderBaseline();
  });
}

setupTabs();
setupTheme();
setupScenes();
setupLab();
renderScene();
renderLab();

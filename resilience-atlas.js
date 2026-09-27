import { banks, providers } from './data/banks.js';
import { compareStrategies, systemStats } from './model/simulation.js';
import { createEarthSystem } from './earth-system.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const format = value => Math.round(value).toLocaleString('en-US');

const defaultScenario = {
  outageProviders: ['blue'],
  marketPct: 20,
  reservePct: 25,
  allocationRule: 'systemic'
};

const state = {
  tab: 'simulation',
  scene: 0,
  outageProviders: [...defaultScenario.outageProviders],
  marketPct: defaultScenario.marketPct,
  reservePct: defaultScenario.reservePct,
  allocationRule: defaultScenario.allocationRule,
  labStrategy: 'market'
};

const labDraft = {
  outageProviders: [...defaultScenario.outageProviders],
  marketPct: defaultScenario.marketPct,
  reservePct: defaultScenario.reservePct,
  allocationRule: defaultScenario.allocationRule
};

const guided = {
  active: false,
  narration: true,
  paused: false,
  runId: 0,
  voice: null
};

const labRun = {
  active: false,
  runId: 0
};

const sceneTitles = [
  'Stable dependency network',
  'Shared-provider failure',
  'Simultaneous backup demand',
  'Reserve stranded by ring-fencing',
  'Pooled reserve reallocation',
  'Recovery outcome comparison'
];

const earth = {
  simulation: createEarthSystem($('#raEarthMount'), {mode:'simulation'}),
  lab: createEarthSystem($('#raLabEarthMount'), {mode:'lab'}),
  evidence: createEarthSystem($('#raEvidenceEarthMount'), {mode:'evidence'})
};

function providerName(id){
  return providers.find(item => item.id === id)?.name || id;
}

function providerNames(ids=state.outageProviders){
  return ids.map(providerName);
}

function providerLabel(ids=state.outageProviders){
  const names=providerNames(ids);
  if(names.length===providers.length) return 'All providers';
  return names.join(' + ');
}

function providerSpeechLabel(ids=state.outageProviders){
  const names=providerNames(ids);
  if(names.length<=1) return names[0] || 'Blue Cloud';
  if(names.length===2) return names[0]+' and '+names[1];
  return names.slice(0,-1).join(', ')+', and '+names.at(-1);
}

function args(){
  return {
    outageProvider: state.outageProviders[0] || 'blue',
    outageProviders: [...state.outageProviders],
    marketPct: state.marketPct,
    reservePct: state.reservePct,
    allocationRule: state.allocationRule
  };
}

function comparison(){
  return compareStrategies(args());
}

function earthPayload(c){
  return {
    scene: state.scene,
    outageProvider: state.outageProviders[0] || 'blue',
    outageProviders: [...state.outageProviders],
    comparison: c,
    marketPct: state.marketPct,
    reservePct: state.reservePct,
    labStrategy: state.labStrategy
  };
}

function scenePresentation(c){
  const provider = providerSpeechLabel();
  const multiple = state.outageProviders.length > 1;
  const affected = c.market.affectedCount;
  const demand = c.market.totalDemand;
  const available = c.market.allocated;
  const gap = Math.max(0,demand-available);
  const stranded = c.individual.strandedReserve;
  const reserve = c.scfr.totalReserve;
  const restored = Math.round(c.scfr.criticalRestoredPct);
  const marketScore = Math.round(c.market.resilience);
  const individualScore = Math.round(c.individual.resilience);
  const scfrScore = Math.round(c.scfr.resilience);

  return [
    {
      kicker:'HOW THE SYSTEM WORKS',
      title:'Banks depend on shared cloud providers.',
      text:'In this simulation, we see how twenty synthetic banks depend on three shared cloud providers for critical digital capacity. Several banks use the same provider, so one technical failure can affect many institutions at the same time.',
      statLabel:'SYSTEM STRUCTURE',
      statValue:'20 banks · 3 shared providers',
      caption:'Banks are connected to shared infrastructure, not isolated technology stacks.',
      voice:'In this simulation, we can see how banks depend on shared cloud providers. Twenty synthetic banks use three providers for critical digital capacity. Several banks depend on the same provider. This means that one provider failure can affect many banks at the same time.',
      rate:.86,
      visualDuration:6200
    },
    {
      kicker:'SHARED PROVIDER FAILURE',
      title:provider+(multiple ? ' fail at the same time.' : ' fails.'),
      text:'The banks connected to the failed '+(multiple ? 'providers lose' : 'provider loses')+' access to critical capacity together. A technical problem at one shared dependency therefore becomes a system-wide recovery problem.',
      statLabel:'AFFECTED BANKS',
      statValue:affected+' of '+banks.length,
      caption:affected+' banks become affected because they share the same failed infrastructure.',
      voice:'Now, '+provider+(multiple ? ' fail at the same time.' : ' fails.')+' The banks connected to '+(multiple ? 'these providers' : 'this provider')+' lose critical capacity together. In this scenario, '+affected+' banks are affected. The important point is that the shock is shared.',
      rate:.84,
      visualDuration:6500
    },
    {
      kicker:'RECOVERY DEMAND',
      title:'Many banks need backup capacity together.',
      text:'Affected banks try to recover at the same time. Their combined demand for backup capacity can be larger than the capacity immediately available in the market.',
      statLabel:'CAPACITY GAP',
      statValue:format(gap)+' units',
      caption:format(demand)+' units are requested, but only '+format(available)+' are immediately available.',
      voice:'Next, the affected banks try to recover at the same time. Together, they need '+format(demand)+' units of backup capacity. The market can immediately provide '+format(available)+' units. So, the remaining capacity gap is '+format(gap)+' units.',
      rate:.83,
      visualDuration:6800
    },
    {
      kicker:'INDIVIDUAL RESERVES',
      title:'Some reserve exists, but it cannot move freely.',
      text:'With individual reserves, each bank keeps its own prepared capacity. Unused reserve at one institution cannot automatically be transferred to another bank that is under stress.',
      statLabel:'STRANDED RESERVE',
      statValue:format(stranded)+' units',
      caption:'Reserve can remain unused in one place while another bank still needs capacity.',
      voice:'Now we add individual reserves. Each bank has its own prepared capacity. This improves recovery. But the reserve is ring fenced. Capacity that is unused by one bank cannot automatically move to another bank that needs it. In this run, '+format(stranded)+' reserve units remain stranded.',
      rate:.82,
      visualDuration:7200
    },
    {
      kicker:'SHARED CLOUD FAILOVER RESERVE',
      title:'The same reserve can be pooled and redirected.',
      text:'SCFR keeps the same total reserve budget but changes how it is coordinated. Unused prepared capacity can be redirected toward the affected banks that need it most.',
      statLabel:'WORKLOAD RESTORED',
      statValue:restored+'%',
      caption:'Pooling changes allocation, not the size of the total reserve budget.',
      voice:'Now we test S C F R, the Shared Cloud Failover Reserve. The total reserve budget does not increase. The difference is coordination. Unused capacity can be pooled and redirected to the affected banks. In this synthetic run, '+restored+' percent of critical workload is restored.',
      rate:.82,
      visualDuration:7600
    },
    {
      kicker:'COMPARISON',
      title:'The same shock produces different recovery outcomes.',
      text:'The failed provider, bank network and total reserve budget stay fixed. What changes is the recovery mechanism: market capacity only, individual reserves, or pooled SCFR coordination.',
      statLabel:'RESILIENCE SCORE',
      statValue:'Market '+marketScore+' · Individual '+individualScore+' · SCFR '+scfrScore,
      caption:'The comparison isolates how reserve coordination changes the modeled recovery outcome.',
      voice:'Finally, we compare the three recovery mechanisms under the same shock. The market-only resilience score is '+marketScore+'. Individual reserves produce a score of '+individualScore+'. The pooled S C F R mechanism produces a score of '+scfrScore+'. The simulation shows how coordination can change recovery when banks depend on shared infrastructure. These results are synthetic, not a forecast for real banks.',
      rate:.82,
      visualDuration:8000
    }
  ];
}

function renderStory(c){
  const story = scenePresentation(c)[state.scene];

  $('#raSceneCounter').textContent = String(state.scene+1).padStart(2,'0')+' / 06';
  $('#raSceneKicker').textContent = story.kicker;
  $('#raSceneTitle').textContent = story.title;
  $('#raSceneText').textContent = story.text;
  $('#raSceneStatLabel').textContent = story.statLabel;
  $('#raSceneStatValue').textContent = story.statValue;

  $('#raGuidedScene').textContent = 'SCENE '+String(state.scene+1).padStart(2,'0')+' / 06';
  $('#raGuidedKicker').textContent = story.kicker;
  $('#raGuidedCaption').textContent = story.caption;
  $('#raGuidedStatus').textContent = guided.paused ? 'PAUSED' : guided.active ? 'RUNNING' : 'READY';

  $$('#raGuidedProgress i').forEach((node,index)=>{
    node.classList.toggle('is-done', index < state.scene);
    node.classList.toggle('is-active', index === state.scene);
  });
}

function renderBaseline(){
  const c = comparison();
  const stats = systemStats();

  if($('#raBankCount')) $('#raBankCount').textContent = banks.length;
  if($('#raProviderCount')) $('#raProviderCount').textContent = providers.length;
  if($('#raBaselineGap')) $('#raBaselineGap').textContent = format(Math.max(0, c.market.totalDemand - c.market.allocated));
  $('#raAffected').textContent = state.scene === 0 ? '0 / '+banks.length : c.market.affectedCount+' / '+banks.length;
  $('#raUnmet').textContent = state.scene < 2 ? '0' : format(Math.max(0, c.market.totalDemand - c.market.allocated));
  $('#raRestored').textContent = state.scene < 4 ? '—' : Math.round(c.scfr.criticalRestoredPct)+'%';
  $('#raResilience').textContent = state.scene < 5 ? '—' : Math.round(c.scfr.resilience);
  $('#raSystemStatus').textContent = state.scene === 0 ? 'SYSTEM STABLE' : state.scene < 4 ? 'SYSTEM UNDER STRESS' : 'RECOVERY ACTIVE';

  earth.simulation.update(earthPayload(c));
  renderStory(c);
  document.documentElement.style.setProperty('--ra-system-hhi', stats.hhi.toFixed(0));
}

function ruleLabel(value){
  return value === 'systemic' ? 'Systemic' : value === 'equal' ? 'Equal' : 'Readiness';
}

function renderLab({skipEarth=false}={}){
  const c = comparison();
  const selected = c[state.labStrategy];
  const selectedGap = Math.max(0, selected.totalDemand-selected.allocated);
  const shockLabel=providerLabel(state.outageProviders);

  $('#raLabTitle').textContent = shockLabel+' outage';
  $('#raMobileProvider').textContent = shockLabel;
  $('#raMobileMarket').textContent = state.marketPct+'%';
  $('#raMobileReserve').textContent = state.reservePct+'%';
  $('#raLabMarketSummary').textContent = state.marketPct+'%';
  $('#raLabReserveSummary').textContent = state.reservePct+'%';
  $('#raLabRuleSummary').textContent = ruleLabel(state.allocationRule);

  $('#raLabAffected').textContent = c.market.affectedCount+' / '+banks.length;
  $('#raLabUnmet').textContent = format(selectedGap);
  $('#raLabRestored').textContent = Math.round(selected.criticalRestoredPct)+'%';
  $('#raLabResilience').textContent = Math.round(selected.resilience);

  $('#raLabUnmetNote').textContent =
    state.labStrategy === 'market' ? 'units after market capacity' :
    state.labStrategy === 'individual' ? 'units after individual reserve' :
    'units after pooled reserve';
  $('#raLabRestoredNote').textContent =
    state.labStrategy === 'market' ? 'market-only recovery' :
    state.labStrategy === 'individual' ? 'with ring-fenced reserve' :
    'with pooled SCFR reserve';

  $('#raMarketScore').textContent = Math.round(c.market.resilience);
  $('#raIndividualScore').textContent = Math.round(c.individual.resilience);
  $('#raScfrScore').textContent = Math.round(c.scfr.resilience);

  $('#raMarketRestored').textContent = Math.round(c.market.criticalRestoredPct)+'%';
  $('#raIndividualRestored').textContent = Math.round(c.individual.criticalRestoredPct)+'%';
  $('#raScfrRestored').textContent = Math.round(c.scfr.criticalRestoredPct)+'%';

  $('#raMarketGap').textContent = format(Math.max(0,c.market.totalDemand-c.market.allocated));
  $('#raIndividualStranded').textContent = format(c.individual.strandedReserve);
  $('#raScfrUsed').textContent = format(c.scfr.reserveUsed);

  $('#raMarketBar').style.width = Math.max(0,Math.min(100,c.market.resilience))+'%';
  $('#raIndividualBar').style.width = Math.max(0,Math.min(100,c.individual.resilience))+'%';
  $('#raScfrBar').style.width = Math.max(0,Math.min(100,c.scfr.resilience))+'%';

  $('#raCompareContext').textContent =
    shockLabel+' · '+state.marketPct+'% market · '+state.reservePct+'% reserve';

  const insight = {
    market:'Immediate market capacity is shared across all affected banks, so simultaneous demand creates a visible capacity gap.',
    individual:'Bank-specific reserves improve recovery, but unused reserve can remain stranded because it cannot move across institutions.',
    scfr:'The total reserve budget is pooled and reallocated under the selected rule, allowing capacity to move toward affected banks.'
  };
  $('#raMechanismInsight').textContent = insight[state.labStrategy];

  $$('.ra-strategy-switch button').forEach(button=>{
    button.classList.toggle('is-active',button.dataset.raStrategy===state.labStrategy);
  });
  $$('.ra-model-card').forEach(button=>{
    button.classList.toggle('is-active',button.dataset.raCompare===state.labStrategy);
  });

  if(!skipEarth) earth.lab.update(earthPayload(c));
}

function summarizeOutcome(result){
  return {
    resilience:Number(result.resilience.toFixed(2)),
    affectedBanks:result.affectedCount,
    banksRecovered:result.banksRecovered,
    totalDemand:Number(result.totalDemand.toFixed(2)),
    allocatedCapacity:Number(result.allocated.toFixed(2)),
    capacityGap:Number(Math.max(0,result.totalDemand-result.allocated).toFixed(2)),
    unmetPct:Number(result.unmetPct.toFixed(2)),
    criticalRestoredPct:Number(result.criticalRestoredPct.toFixed(2)),
    totalReserve:Number(result.totalReserve.toFixed(2)),
    reserveUsed:Number(result.reserveUsed.toFixed(2)),
    strandedReserve:Number(result.strandedReserve.toFixed(2)),
    affectedBankIds:result.rows.map(row=>row.id)
  };
}

function evidenceSnapshot(){
  const c=comparison();
  const stats=systemStats();
  return {
    generatedAt:new Date().toISOString(),
    product:'Resilience Atlas',
    modelVersion:'v0.1 synthetic mechanism stress-test',
    scenario:{
      failedProviders:[...state.outageProviders],
      failedProviderNames:providerNames(state.outageProviders),
      emergencyMarketPct:state.marketPct,
      reservePct:state.reservePct,
      allocationRule:state.allocationRule
    },
    system:{
      syntheticBanks:banks.length,
      sharedProviders:providers.length,
      totalCriticalLoad:stats.totalSystemLoad,
      providerLoads:stats.providerLoads,
      syntheticProviderHHI:Number(stats.hhi.toFixed(1))
    },
    outcomes:{
      market:summarizeOutcome(c.market),
      individual:summarizeOutcome(c.individual),
      scfr:summarizeOutcome(c.scfr)
    },
    boundary:'All institutions, provider assignments, workloads, readiness values, importance weights, capacity units and numerical outcomes are synthetic and illustrative.'
  };
}

function renderEvidence(){
  const c=comparison();
  const stats=systemStats();
  const marketPool=c.market.allocated;
  const reservePool=c.scfr.totalReserve;

  $('#raEvidenceBanks').textContent=String(banks.length);
  $('#raEvidenceProviders').textContent=String(providers.length);
  $('#raEvidenceLoad').textContent=format(stats.totalSystemLoad)+' units';
  $('#raEvidenceDemand').textContent=format(c.market.totalDemand)+' units';
  $('#raEvidenceMarketPool').textContent=format(marketPool)+' units';
  $('#raEvidenceReservePool').textContent=format(reservePool)+' units';
  $('#raEvidenceHHI').textContent=Math.round(stats.hhi).toLocaleString('en-US');
  $('#raEvidenceScenario').textContent=
    providerLabel(state.outageProviders)+' · '+state.marketPct+'% market · '+state.reservePct+'% reserve · '+state.allocationRule+' rule';

  earth.evidence.update(earthPayload(c));
}

function buildReadableReport(snapshot){
  const o=snapshot.outcomes;
  const line=(label,value)=>label.padEnd(28,' ')+value;
  return [
    'RESILIENCE ATLAS - SCENARIO REPORT',
    '==================================',
    '',
    'Generated: '+snapshot.generatedAt,
    'Model: '+snapshot.modelVersion,
    '',
    'SCENARIO',
    '--------',
    line('Failed providers:',snapshot.scenario.failedProviderNames.join(', ')),
    line('Emergency market:',snapshot.scenario.emergencyMarketPct+'%'),
    line('Prepared reserve:',snapshot.scenario.reservePct+'%'),
    line('Allocation rule:',snapshot.scenario.allocationRule),
    '',
    'SYSTEM',
    '------',
    line('Synthetic banks:',String(snapshot.system.syntheticBanks)),
    line('Shared providers:',String(snapshot.system.sharedProviders)),
    line('Total critical load:',format(snapshot.system.totalCriticalLoad)+' units'),
    line('Provider HHI:',String(snapshot.system.syntheticProviderHHI)),
    '',
    'OUTCOMES',
    '--------',
    '',
    '[POST-SHOCK MARKET]',
    line('Resilience score:',o.market.resilience.toFixed(2)+' / 100'),
    line('Affected banks:',String(o.market.affectedBanks)),
    line('Capacity gap:',format(o.market.capacityGap)+' units'),
    line('Critical workload restored:',o.market.criticalRestoredPct.toFixed(2)+'%'),
    '',
    '[INDIVIDUAL RESERVES]',
    line('Resilience score:',o.individual.resilience.toFixed(2)+' / 100'),
    line('Capacity gap:',format(o.individual.capacityGap)+' units'),
    line('Critical workload restored:',o.individual.criticalRestoredPct.toFixed(2)+'%'),
    line('Stranded reserve:',format(o.individual.strandedReserve)+' units'),
    '',
    '[SCFR POOLED RESERVE]',
    line('Resilience score:',o.scfr.resilience.toFixed(2)+' / 100'),
    line('Capacity gap:',format(o.scfr.capacityGap)+' units'),
    line('Critical workload restored:',o.scfr.criticalRestoredPct.toFixed(2)+'%'),
    line('Reserve used:',format(o.scfr.reserveUsed)+' units'),
    '',
    'MODEL BOUNDARY',
    '--------------',
    snapshot.boundary,
    '',
    'This report is a readable summary of the current deterministic synthetic scenario.',
    'For machine-readable reproducibility, use the separate Export JSON button.',
    ''
  ].join('\r\n');
}

function downloadBlob(filename,content,type){
  const blob=new Blob([content],{type});
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement('a');
  anchor.href=url;
  anchor.download=filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),0);
}

function exportReadableReport(){
  const report=buildReadableReport(evidenceSnapshot());
  downloadBlob(
    'resilience-atlas-scenario-report.txt',
    '\uFEFF'+report,
    'text/plain;charset=utf-8'
  );
}

function exportJson(){
  downloadBlob(
    'resilience-atlas-scenario.json',
    JSON.stringify(evidenceSnapshot(),null,2),
    'application/json;charset=utf-8'
  );
}

function setupEvidence(){
  $('#raExportEvidence')?.addEventListener('click',exportReadableReport);
  $('#raExportJson')?.addEventListener('click',exportJson);
}

function renderScene(){
  $('#raCanvasTitle').textContent = sceneTitles[state.scene];
  $$('.ra-scene-list button').forEach((button,index)=>{
    button.classList.toggle('is-active', index === state.scene);
  });
  $$('.ra-mobile-scene-nav button').forEach((button,index)=>{
    button.classList.toggle('is-active', index === state.scene);
  });
  renderBaseline();
}

function tabFromHash(){
  const candidate=window.location.hash.replace(/^#/,'');
  return ['simulation','lab','evidence'].includes(candidate) ? candidate : 'simulation';
}

function syncTabHash(tab,replace=false){
  const next='#'+tab;
  if(window.location.hash===next) return;
  const method=replace ? 'replaceState' : 'pushState';
  window.history?.[method]?.(null,'',next);
}

function switchTab(tab,{updateHash=true,replaceHash=false}={}){
  if(!['simulation','lab','evidence'].includes(tab)) return;
  if(guided.active) stopGuidedSimulation();
  if(labRun.active) cancelLabRun();

  state.tab = tab;

  $$('.ra-nav-tab').forEach(button=>{
    const active=button.dataset.raTab === tab;
    button.classList.toggle('is-active',active);
    button.setAttribute('aria-selected',active ? 'true' : 'false');
    button.tabIndex=active ? 0 : -1;
  });

  $$('.ra-mobile-tab').forEach(button=>{
    const active=button.dataset.raMobileTab === tab;
    button.classList.toggle('is-active',active);
    button.setAttribute('aria-pressed',active ? 'true' : 'false');
  });

  $$('.ra-view').forEach(view=>{
    const active=view.dataset.raView === tab;
    view.classList.toggle('is-active',active);
    view.setAttribute('aria-hidden',active ? 'false' : 'true');
  });

  if(tab !== 'lab' && document.body.classList.contains('ra-mobile-sheet-open')) setLabSheet(false);
  if(tab === 'lab'){
    renderLab();
    syncLabDraftUI();
  }
  if(tab === 'evidence') renderEvidence();
  if(updateHash) syncTabHash(tab,replaceHash);
}

function setupTabs(){
  $$('.ra-nav-tab').forEach(button=>{
    button.addEventListener('click',()=>switchTab(button.dataset.raTab));
    button.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const tabs=$$('.ra-nav-tab');
      const index=tabs.indexOf(button);
      const direction=event.key==='ArrowRight' ? 1 : -1;
      const next=tabs[(index+direction+tabs.length)%tabs.length];
      next.focus();
      switchTab(next.dataset.raTab);
    });
  });

  $$('.ra-mobile-tab').forEach(button=>{
    button.addEventListener('click',event=>{
      event.preventDefault();
      switchTab(button.dataset.raMobileTab);
    });
  });

  $('.ra-brand')?.addEventListener('click',event=>{
    event.preventDefault();
    switchTab('simulation');
  });

  window.addEventListener('hashchange',()=>{
    switchTab(tabFromHash(),{updateHash:false});
  });

  switchTab(tabFromHash(),{updateHash:false});
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

function englishVoices(){
  if(!('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices().filter(voice=>/^en(?:-|_)/i.test(voice.lang) || /^en$/i.test(voice.lang));
}

function maleVoiceScore(voice){
  const name=(voice?.name||'').toLowerCase();
  const lang=(voice?.lang||'').toLowerCase();

  const maleNames=/\b(daniel|aaron|arthur|alex|andrew|guy|brian|ryan|christopher|eric|oliver|tom|nathan|evan|reed|eddy|rishi|ralph|bruce|david|mark|james|george|richard|lee)\b/;
  const explicitlyFemale=/\b(ava|samantha|karen|moira|jenny|aria|victoria|tessa|allison|susan|zira)\b/;

  if(explicitlyFemale.test(name)) return -1000;

  let score=maleNames.test(name) ? 220 : -120;

  if(/premium/.test(name)) score+=180;
  if(/enhanced/.test(name)) score+=165;
  if(/natural/.test(name)) score+=150;
  if(/online/.test(name) && /microsoft/.test(name)) score+=60;

  if(/\bdaniel\b/.test(name)) score+=145;
  if(/\bandrew\b/.test(name)) score+=140;
  if(/\bguy\b/.test(name)) score+=136;
  if(/\bbrian\b/.test(name)) score+=132;
  if(/\bryan\b/.test(name)) score+=128;
  if(/\bchristopher\b/.test(name)) score+=124;
  if(/\bdavid\b/.test(name)) score+=122;
  if(/\bjames\b/.test(name)) score+=121;
  if(/\bgeorge\b/.test(name)) score+=120;
  if(/\baaron\b/.test(name)) score+=120;
  if(/\barthur\b/.test(name)) score+=116;
  if(/\balex\b/.test(name)) score+=112;

  if(/google uk english male/.test(name)) score+=155;
  if(/google us english male/.test(name)) score+=145;

  if(/^en-gb/.test(lang)) score+=24;
  if(/^en-us/.test(lang)) score+=20;
  if(voice?.localService) score+=10;

  if(/compact|espeak|fred|zarvox|trinoids|whisper|bells|organ|bad news|good news|boing|bubbles|cellos|deranged|hysterical|pipe organ|wobble/.test(name)) score-=400;

  return score;
}

function rankedMaleVoices(){
  return englishVoices()
    .map(voice=>({voice,score:maleVoiceScore(voice)}))
    .filter(item=>item.score>0)
    .sort((a,b)=>b.score-a.score);
}

function chooseNarrator(){
  return rankedMaleVoices()[0]?.voice || null;
}

function waitForNarrator(timeoutMs=900){
  const immediate=chooseNarrator();
  if(immediate && maleVoiceScore(immediate)>=350) return Promise.resolve(immediate);
  if(!('speechSynthesis' in window)) return Promise.resolve(immediate || null);

  return new Promise(resolve=>{
    let settled=false;
    const finish=()=>{
      if(settled) return;
      settled=true;
      window.speechSynthesis.removeEventListener?.('voiceschanged',onVoices);
      resolve(chooseNarrator() || immediate || null);
    };
    const onVoices=()=>{
      const candidate=chooseNarrator();
      if(candidate && maleVoiceScore(candidate)>=350){
        if(settled) return;
        settled=true;
        window.speechSynthesis.removeEventListener?.('voiceschanged',onVoices);
        resolve(candidate);
      }
    };

    window.speechSynthesis.addEventListener?.('voiceschanged',onVoices);
    window.setTimeout(finish,timeoutMs);
  });
}

function narrationText(text){
  return text
    .replace(/\bSCFR\b/g,'S C F R')
    .replace(/\bICT\b/g,'I C T')
    .replace(/\bAPI\b/g,'A P I')
    .replace(/\s+/g,' ')
    .trim();
}

function narrationChunks(text){
  return (narrationText(text).match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [narrationText(text)])
    .map(part=>part.trim())
    .filter(Boolean);
}

function narrationProfile(voice,requestedRate=.84){
  const name=(voice?.name||'').toLowerCase();
  const premium=/premium|enhanced|natural/.test(name);
  const microsoft=/microsoft/.test(name);

  return {
    rate:Math.max(.78,Math.min(.88,premium ? requestedRate : microsoft ? requestedRate*.99 : requestedRate*.96)),
    pitch:.96,
    volume:1,
    pauseMs:560,
    longPauseMs:760
  };
}

function updateNarrationControl(){
  const button=$('#raNarrationToggle');
  button.setAttribute('aria-pressed',guided.narration ? 'true' : 'false');
  $('#raNarrationLabel').textContent=guided.narration ? 'Narration on' : 'Narration off';

  const pauseButton=$('#raSpeechPause');
  const hudPause=$('#raHudPause');
  const canPause=guided.active && guided.narration;

  pauseButton.disabled=!canPause;
  pauseButton.setAttribute('aria-pressed',guided.paused ? 'true' : 'false');
  $('#raSpeechPauseLabel').textContent=guided.paused ? 'Resume speech' : 'Pause speech';

  if(hudPause){
    hudPause.disabled=!canPause;
    hudPause.setAttribute('aria-pressed',guided.paused ? 'true' : 'false');
    hudPause.textContent=guided.paused ? 'Resume' : 'Pause';
  }

  if(guided.voice){
    button.title='Automatic male narrator: '+guided.voice.name;
    button.dataset.voiceQuality=maleVoiceScore(guided.voice)>=250 ? 'natural' : 'standard';
  }
}

function guidedDelay(ms,runId){
  return new Promise(resolve=>{
    let remaining=ms;
    let last=performance.now();

    const tick=()=>{
      if(runId!==guided.runId) return resolve(false);

      const now=performance.now();
      if(!guided.paused) remaining-=Math.max(0,now-last);
      last=now;

      if(remaining<=0) return resolve(true);
      window.setTimeout(tick,Math.min(110,Math.max(24,remaining)));
    };

    tick();
  });
}

function speakChunk(text,voice,profile,runId){
  return new Promise(resolve=>{
    const utterance=new SpeechSynthesisUtterance(text);
    if(voice) utterance.voice=voice;
    utterance.lang=voice?.lang || 'en-US';
    utterance.rate=profile.rate;
    utterance.pitch=profile.pitch;
    utterance.volume=profile.volume;

    let settled=false;
    const finish=()=>{
      if(settled) return;
      settled=true;
      resolve(runId===guided.runId);
    };

    utterance.onend=finish;
    utterance.onerror=finish;

    const words=text.trim().split(/\s+/).length;
    const safetyMs=Math.max(3200,words/(Math.max(profile.rate,.75)*2.1)*1000+2600);
    guidedDelay(safetyMs,runId).then(()=>finish());
    window.speechSynthesis.speak(utterance);
  });
}

async function speakCurrentScene(story,runId){
  if(!guided.narration || !('speechSynthesis' in window)) return true;

  window.speechSynthesis.cancel();
  guided.voice=await waitForNarrator();
  updateNarrationControl();

  if(!guided.voice){
    $('#raGuidedStatus').textContent='VOICE UNAVAILABLE';
    return true;
  }

  const profile=narrationProfile(guided.voice,story.rate||.84);
  const chunks=narrationChunks(story.voice);
  const hud=$('#raGuidedHud');
  hud.classList.add('is-speaking');

  let completed=true;
  for(let index=0;index<chunks.length;index++){
    if(runId!==guided.runId){
      completed=false;
      break;
    }

    const spoken=await speakChunk(chunks[index],guided.voice,profile,runId);
    if(!spoken){
      completed=false;
      break;
    }

    if(index<chunks.length-1){
      const sentence=chunks[index];
      const pause=/\b(finally|now we test|next|the important point)\b/i.test(sentence)
        ? profile.longPauseMs
        : profile.pauseMs;
      const continued=await guidedDelay(pause,runId);
      if(!continued){
        completed=false;
        break;
      }
    }
  }

  hud.classList.remove('is-speaking');
  return completed && runId===guided.runId;
}

function setGuidedPaused(paused){
  if(!guided.active || !guided.narration) return;
  guided.paused=paused;
  document.body.classList.toggle('ra-guided-paused',paused);
  earth.simulation.setPaused?.(paused);

  if('speechSynthesis' in window){
    if(paused) window.speechSynthesis.pause();
    else window.speechSynthesis.resume();
  }

  $('#raGuidedStatus').textContent=paused ? 'PAUSED' : 'RUNNING';
  updateNarrationControl();
}

function setupNarrationEngine(){
  guided.voice=chooseNarrator();
  updateNarrationControl();

  const togglePause=()=>{
    if(!guided.active || !guided.narration) return;
    setGuidedPaused(!guided.paused);
  };

  $('#raSpeechPause')?.addEventListener('click',togglePause);
  $('#raHudPause')?.addEventListener('click',togglePause);
  $('#raHudStop')?.addEventListener('click',stopGuidedSimulation);
}

function setGuidedActive(active){
  guided.active=active;
  if(!active) guided.paused=false;

  document.body.classList.toggle('ra-guided-running',active);
  document.body.classList.toggle('ra-guided-paused',guided.paused);
  earth.simulation.setPaused?.(guided.paused);

  $('#raRunLabel').textContent=active ? 'Stop Simulation' : state.scene===5 ? 'Replay Guided Simulation' : 'Run Guided Simulation';
  $('#raGuidedStatus').textContent=guided.paused ? 'PAUSED' : active ? 'RUNNING' : state.scene===5 ? 'COMPLETE' : 'READY';
  updateNarrationControl();
}

function stopGuidedSimulation(){
  guided.runId++;
  guided.paused=false;
  earth.simulation.setPaused?.(false);
  setGuidedActive(false);
  $('#raGuidedHud').classList.remove('is-speaking');
  if('speechSynthesis' in window){
    window.speechSynthesis.resume();
    window.speechSynthesis.cancel();
  }
}

function focusAnimationStage(target){
  if(!target || window.innerWidth>=768) return Promise.resolve(true);

  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const headerOffset=68;
  const top=Math.max(0,target.getBoundingClientRect().top+window.scrollY-headerOffset);

  window.scrollTo({
    top,
    behavior:reduced ? 'auto' : 'smooth'
  });

  return new Promise(resolve=>{
    window.setTimeout(()=>resolve(true),reduced ? 80 : 460);
  });
}

async function runGuidedSimulation(){
  if(guided.active){
    stopGuidedSimulation();
    return;
  }

  guided.runId++;
  const runId=guided.runId;
  guided.paused=false;
  earth.simulation.setPaused?.(false);

  /* Reset to the first visual state before moving the phone viewport so the
     user arrives at the actual animation, not the previous scene. */
  state.scene=0;
  renderScene();
  setGuidedActive(true);

  if(window.innerWidth<768){
    await focusAnimationStage($('#raEarthMount'));
    if(runId!==guided.runId) return;
  }

  for(let i=0;i<6;i++){
    if(runId!==guided.runId) return;

    state.scene=i;
    renderScene();

    const story=scenePresentation(comparison())[i];
    const [spoken,visualComplete]=await Promise.all([
      speakCurrentScene(story,runId),
      guidedDelay(story.visualDuration,runId)
    ]);

    if(!spoken || !visualComplete || runId!==guided.runId) return;
  }

  if(runId===guided.runId){
    setGuidedActive(false);
    $('#raGuidedStatus').textContent='COMPLETE';
  }
}

function setupScenes(){
  $$('.ra-scene-list button').forEach(button=>{
    button.addEventListener('click',()=>{
      if(guided.active) stopGuidedSimulation();
      state.scene=Number(button.dataset.raScene);
      renderScene();
    });
  });

  $$('.ra-mobile-scene-nav button').forEach(button=>{
    button.addEventListener('click',()=>{
      if(guided.active) stopGuidedSimulation();
      state.scene=Number(button.dataset.raMobileScene);
      renderScene();
    });
  });

  $('#raRunPreview').addEventListener('click',runGuidedSimulation);

  $('#raNarrationToggle').addEventListener('click',()=>{
    guided.narration=!guided.narration;

    if(!guided.narration){
      guided.paused=false;
      earth.simulation.setPaused?.(false);
      document.body.classList.remove('ra-guided-paused');
      if('speechSynthesis' in window){
        window.speechSynthesis.resume();
        window.speechSynthesis.cancel();
      }
    }

    updateNarrationControl();
  });
}

function setLabStrategy(strategy){
  if(labRun.active || !['market','individual','scfr'].includes(strategy)) return;
  state.labStrategy=strategy;
  renderLab();
}

function normalizedIds(ids){
  const order=['blue','orange','green'];
  return order.filter(id=>ids.includes(id));
}

function draftMatchesApplied(){
  return JSON.stringify(normalizedIds(labDraft.outageProviders))===JSON.stringify(normalizedIds(state.outageProviders)) &&
    labDraft.marketPct===state.marketPct &&
    labDraft.reservePct===state.reservePct &&
    labDraft.allocationRule===state.allocationRule;
}

function syncLabDraftUI(){
  const selected=normalizedIds(labDraft.outageProviders);
  $$('#raProviderToggles input[type="checkbox"]').forEach(input=>{
    input.checked=selected.includes(input.value);
  });

  $('#raMarketPct').value=String(labDraft.marketPct);
  $('#raReservePct').value=String(labDraft.reservePct);
  $('#raRuleSelect').value=labDraft.allocationRule;
  $('#raMarketLabel').textContent=labDraft.marketPct+'%';
  $('#raReserveLabel').textContent=labDraft.reservePct+'%';
  $('#raProviderSelectionCount').textContent=selected.length+' selected';
  $('#raAffectedDemand').textContent=selected.length ? providerLabel(selected) : 'No provider selected';

  const valid=selected.length>0;
  const dirty=!draftMatchesApplied();
  const runButton=$('#raRunScenario');
  runButton.disabled=!valid || labRun.active;
  runButton.querySelector('span').textContent=labRun.active ? 'Running Scenario…' : 'Run Scenario';

  $('#raProviderValidation').classList.toggle('is-error',!valid);
  $('#raProviderValidation').textContent=valid
    ? 'Select one or more providers. Multiple providers can fail simultaneously.'
    : 'Select at least one provider before running the scenario.';
  $('#raDraftState').textContent=labRun.active
    ? 'RUNNING MODEL'
    : !valid ? 'SELECT A PROVIDER'
    : dirty ? 'PENDING CHANGES'
    : 'SCENARIO APPLIED';
  $('.ra-lab-run-block')?.classList.toggle('has-pending',valid && dirty && !labRun.active);
}

function setLabRunActive(active){
  labRun.active=active;
  $('#lab').classList.toggle('is-scenario-running',active);

  $$('#raProviderToggles input, #raMarketPct, #raReservePct, #raRuleSelect, #raResetLab').forEach(control=>{
    control.disabled=active;
  });
  $$('.ra-strategy-switch button, .ra-model-card').forEach(button=>{
    button.disabled=active;
  });
  const openSheet=$('#raOpenLabSheet');
  if(openSheet) openSheet.disabled=active;

  syncLabDraftUI();
}

function labRunWait(ms,runId){
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const delay=reduced ? Math.max(620,Math.round(ms*.5)) : ms;
  return new Promise(resolve=>{
    window.setTimeout(()=>resolve(runId===labRun.runId),delay);
  });
}

function scenarioPlaybackPhases(c){
  const marketGap=Math.max(0,c.market.totalDemand-c.market.allocated);
  const individualGap=Math.max(0,c.individual.totalDemand-c.individual.allocated);
  return [
    {
      phase:'shock',
      kicker:'SHOCK DETECTED',
      title:providerLabel(state.outageProviders)+(state.outageProviders.length>1 ? ' fail together.' : ' fails.'),
      metricLabel:'AFFECTED BANKS',
      metricValue:c.market.affectedCount+' / '+banks.length,
      duration:1050
    },
    {
      phase:'demand',
      kicker:'SIMULTANEOUS DEMAND',
      title:'Dependent banks request recovery capacity at the same time.',
      metricLabel:'RECOVERY DEMAND',
      metricValue:format(c.market.totalDemand)+' units',
      duration:1150
    },
    {
      phase:'market',
      kicker:'IMMEDIATE MARKET',
      title:'Available backup capacity is allocated first.',
      metricLabel:'CAPACITY GAP',
      metricValue:format(marketGap)+' units',
      duration:1250
    },
    {
      phase:'individual',
      kicker:'INDIVIDUAL RESERVE',
      title:'Bank-specific reserve is applied but cannot move between institutions.',
      metricLabel:individualGap>0 ? 'REMAINING GAP' : 'STRANDED RESERVE',
      metricValue:individualGap>0 ? format(individualGap)+' units' : format(c.individual.strandedReserve)+' units',
      duration:1300
    },
    {
      phase:'scfr',
      kicker:'POOLED SCFR',
      title:'The same aggregate reserve budget is reallocated across affected banks.',
      metricLabel:'WORKLOAD RESTORED',
      metricValue:Math.round(c.scfr.criticalRestoredPct)+'%',
      duration:1450
    },
    {
      phase:'outcome',
      kicker:'OUTCOME',
      title:'The three recovery mechanisms are compared under the same shock.',
      metricLabel:'SCFR RESILIENCE',
      metricValue:Math.round(c.scfr.resilience)+' / 100',
      duration:1100
    }
  ];
}

function renderPlaybackPhase(phase,index,c){
  const playback=$('#raScenarioPlayback');
  playback.hidden=false;
  playback.dataset.phase=phase.phase;
  $('#raPlaybackStep').textContent=String(index+1).padStart(2,'0')+' / 06 · '+phase.kicker;
  $('#raPlaybackKicker').textContent=phase.kicker;
  $('#raPlaybackTitle').textContent=phase.title;
  $('#raPlaybackMetricLabel').textContent=phase.metricLabel;
  $('#raPlaybackMetricValue').textContent=phase.metricValue;

  $$('#raPlaybackProgress i').forEach((node,nodeIndex)=>{
    node.classList.toggle('is-done',nodeIndex<index);
    node.classList.toggle('is-active',nodeIndex===index);
  });

  earth.lab.update({...earthPayload(c),labPhase:phase.phase});
}

function signedPoints(value){
  const rounded=Math.abs(value)<.05 ? 0 : value;
  return (rounded>0 ? '+' : '')+rounded.toFixed(1)+' pp';
}

function buildScenarioConclusion(c){
  const affected=c.market.affectedCount;
  const marketGap=Math.max(0,c.market.totalDemand-c.market.allocated);
  const individualGap=Math.max(0,c.individual.totalDemand-c.individual.allocated);
  const scfrGap=Math.max(0,c.scfr.totalDemand-c.scfr.allocated);
  const individualRestored=c.individual.criticalRestoredPct;
  const scfrRestored=c.scfr.criticalRestoredPct;
  const restoredLift=scfrRestored-individualRestored;
  const resilienceLift=c.scfr.resilience-c.individual.resilience;

  let title;
  if(marketGap<=.01){
    title='Immediate capacity covers the modeled recovery demand.';
  }else if(scfrGap<=.01 && individualGap>.01){
    title='Pooling closes a capacity gap left by individual reserves.';
  }else if(resilienceLift>.5){
    title='Pooling improves recovery, although the modeled shock still creates scarcity.';
  }else{
    title='Under these assumptions, reserve coordination changes the outcome only modestly.';
  }

  const summary=
    providerLabel(state.outageProviders)+' outage affects '+affected+' of '+banks.length+
    ' synthetic banks and creates '+format(c.market.totalDemand)+' units of simultaneous recovery demand. '+
    'The immediate market supplies '+format(c.market.allocated)+' units, leaving '+
    format(marketGap)+' units unmet before prepared reserve is applied.';

  let interpretation;
  if(marketGap<=.01){
    interpretation='The emergency market assumption already covers the modeled demand, so the reserve-allocation mechanism has little room to change recovery. The comparison is still run under the same assumptions and reserve budget.';
  }else if(restoredLift>.05){
    interpretation='Individual reserves leave '+format(c.individual.strandedReserve)+
      ' units unused outside the banks that need them. With the same '+format(c.scfr.totalReserve)+
      '-unit aggregate reserve budget, SCFR changes critical workload restored by '+signedPoints(restoredLift)+
      ' and systemic resilience by '+signedPoints(resilienceLift)+' relative to individual reserves.';
  }else{
    interpretation='The current reserve level and recovery demand leave little modeled coordination uplift. SCFR uses the same aggregate reserve budget as individual reserves; the difference comes only from whether unused capacity can move between affected banks.';
  }

  if(scfrGap>.01){
    interpretation+=' Even after pooling, '+format(scfrGap)+' units of modeled capacity demand remain unmet.';
  }

  return {
    title,
    summary,
    shockValue:affected+' / '+banks.length+' banks',
    shockNote:providerLabel(state.outageProviders)+' · '+format(c.market.totalDemand)+' units demand',
    bottleneckValue:marketGap>.01 ? format(marketGap)+' units gap' : 'No market gap',
    bottleneckNote:state.marketPct+'% immediate capacity · '+Math.round(c.market.criticalRestoredPct)+'% workload restored',
    coordinationValue:signedPoints(restoredLift),
    coordinationNote:'SCFR '+Math.round(scfrRestored)+'% vs Individual '+Math.round(individualRestored)+'% restored',
    interpretation
  };
}

function renderScenarioConclusion(c){
  const conclusion=buildScenarioConclusion(c);
  const panel=$('#raScenarioConclusion');

  $('#raConclusionTitle').textContent=conclusion.title;
  $('#raConclusionText').textContent=conclusion.summary;
  $('#raConclusionShock').textContent=conclusion.shockValue;
  $('#raConclusionShockNote').textContent=conclusion.shockNote;
  $('#raConclusionBottleneck').textContent=conclusion.bottleneckValue;
  $('#raConclusionBottleneckNote').textContent=conclusion.bottleneckNote;
  $('#raConclusionCoordination').textContent=conclusion.coordinationValue;
  $('#raConclusionCoordinationNote').textContent=conclusion.coordinationNote;
  $('#raConclusionInterpretation').textContent=conclusion.interpretation;

  panel.hidden=false;
  panel.classList.remove('is-visible');
  void panel.offsetWidth;
  panel.classList.add('is-visible');
}

function cancelLabRun(){
  labRun.runId++;
  setLabRunActive(false);

  const playback=$('#raScenarioPlayback');
  playback.hidden=true;
  playback.classList.remove('is-finishing');
  earth.lab.update(earthPayload(comparison()));
}

async function runLabScenario(){
  if(labRun.active) return;

  const selected=normalizedIds(labDraft.outageProviders);
  if(!selected.length) return;

  state.outageProviders=[...selected];
  state.marketPct=labDraft.marketPct;
  state.reservePct=labDraft.reservePct;
  state.allocationRule=labDraft.allocationRule;

  const c=comparison();
  renderLab({skipEarth:true});
  renderBaseline();
  renderEvidence();

  const conclusionPanel=$('#raScenarioConclusion');
  conclusionPanel.hidden=true;
  conclusionPanel.classList.remove('is-visible');

  labRun.runId++;
  const runId=labRun.runId;
  let completed=false;
  setLabRunActive(true);

  try{
    if(document.body.classList.contains('ra-mobile-sheet-open')){
      setLabSheet(false,{restoreFocus:false});
      await labRunWait(310,runId);
    }

    if(window.innerWidth<768){
      await focusAnimationStage($('#raLabEarthMount'));
      if(runId!==labRun.runId) return;
    }

    const phases=scenarioPlaybackPhases(c);
    for(let index=0;index<phases.length;index++){
      if(runId!==labRun.runId) return;
      renderPlaybackPhase(phases[index],index,c);

      /* Force Safari to paint each state before waiting for the next phase. */
      await new Promise(resolve=>window.requestAnimationFrame(()=>window.requestAnimationFrame(resolve)));
      const continued=await labRunWait(phases[index].duration,runId);
      if(!continued || runId!==labRun.runId) return;
    }

    const playback=$('#raScenarioPlayback');
    playback.classList.add('is-finishing');
    await labRunWait(320,runId);
    if(runId!==labRun.runId) return;

    playback.hidden=true;
    playback.classList.remove('is-finishing');
    earth.lab.update(earthPayload(c));
    renderScenarioConclusion(c);
    completed=true;
  }catch(error){
    console.error('Scenario playback failed',error);
    earth.lab.update(earthPayload(c));
  }finally{
    if(runId===labRun.runId){
      setLabRunActive(false);
      syncLabDraftUI();

      if(!completed){
        const playback=$('#raScenarioPlayback');
        if(playback){
          playback.hidden=true;
          playback.classList.remove('is-finishing');
        }
      }
    }
  }
}

function resetLab(){
  if(labRun.active) cancelLabRun();

  state.outageProviders=[...defaultScenario.outageProviders];
  state.marketPct=defaultScenario.marketPct;
  state.reservePct=defaultScenario.reservePct;
  state.allocationRule=defaultScenario.allocationRule;
  state.labStrategy='market';

  labDraft.outageProviders=[...defaultScenario.outageProviders];
  labDraft.marketPct=defaultScenario.marketPct;
  labDraft.reservePct=defaultScenario.reservePct;
  labDraft.allocationRule=defaultScenario.allocationRule;

  $('#raScenarioConclusion').hidden=true;
  $('#raScenarioConclusion').classList.remove('is-visible');
  $('#raScenarioPlayback').hidden=true;

  syncLabDraftUI();
  renderLab();
  renderBaseline();
  renderEvidence();
}

function setLabSheet(open,{restoreFocus=true}={}){
  const sheet=$('#raLabSheet');
  const backdrop=$('#raLabBackdrop');
  const trigger=$('#raOpenLabSheet');
  if(!sheet || !backdrop || !trigger) return;

  sheet.classList.toggle('is-mobile-open',open);
  document.body.classList.toggle('ra-mobile-sheet-open',open);
  backdrop.hidden=!open;
  trigger.setAttribute('aria-expanded',open ? 'true' : 'false');

  if(open){
    window.setTimeout(()=>$('#raCloseLabSheet')?.focus(),20);
  }else if(restoreFocus){
    trigger.focus?.();
  }
}

function setupMobileLab(){
  $('#raOpenLabSheet')?.addEventListener('click',()=>setLabSheet(true));
  $('#raCloseLabSheet')?.addEventListener('click',()=>setLabSheet(false));
  $('#raLabBackdrop')?.addEventListener('click',()=>setLabSheet(false));

  document.addEventListener('keydown',event=>{
    if(event.key==='Escape' && document.body.classList.contains('ra-mobile-sheet-open')){
      setLabSheet(false);
    }
  });

  window.addEventListener('resize',()=>{
    if(window.innerWidth>=768 && document.body.classList.contains('ra-mobile-sheet-open')){
      setLabSheet(false);
    }
  });
}

function setupLab(){
  $$('#raProviderToggles input[type="checkbox"]').forEach(input=>{
    input.addEventListener('change',()=>{
      labDraft.outageProviders=$$('#raProviderToggles input[type="checkbox"]:checked').map(node=>node.value);
      syncLabDraftUI();
    });
  });

  $('#raMarketPct').addEventListener('input',event=>{
    labDraft.marketPct=Number(event.target.value);
    syncLabDraftUI();
  });
  $('#raReservePct').addEventListener('input',event=>{
    labDraft.reservePct=Number(event.target.value);
    syncLabDraftUI();
  });
  $('#raRuleSelect').addEventListener('change',event=>{
    labDraft.allocationRule=event.target.value;
    syncLabDraftUI();
  });

  $('#raRunScenario').addEventListener('click',runLabScenario);

  $$('.ra-strategy-switch button').forEach(button=>{
    button.addEventListener('click',()=>setLabStrategy(button.dataset.raStrategy));
  });
  $$('.ra-model-card').forEach(button=>{
    button.addEventListener('click',()=>setLabStrategy(button.dataset.raCompare));
  });
  $('#raResetLab').addEventListener('click',resetLab);
}

if('speechSynthesis' in window){
  window.speechSynthesis.addEventListener?.('voiceschanged',()=>{
    guided.voice=chooseNarrator();
    updateNarrationControl();
  });
}

setupTabs();
setupTheme();
setupNarrationEngine();
setupScenes();
setupLab();
setupMobileLab();
setupEvidence();
updateNarrationControl();
syncLabDraftUI();
renderScene();
renderLab();
renderEvidence();

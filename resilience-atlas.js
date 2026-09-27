import { banks, providers } from './data/banks.js';
import { compareStrategies, systemStats } from './model/simulation.js';
import { createEarthSystem } from './earth-system.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const format = value => Math.round(value).toLocaleString('en-US');

const state = {
  tab: 'simulation',
  scene: 0,
  outageProvider: 'blue',
  marketPct: 20,
  reservePct: 25,
  allocationRule: 'systemic',
  labStrategy: 'market'
};

const guided = {
  active: false,
  narration: true,
  runId: 0,
  voice: null
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

function providerName(id){
  return providers.find(item => item.id === id)?.name || id;
}

function earthPayload(c){
  return {
    scene: state.scene,
    outageProvider: state.outageProvider,
    comparison: c,
    marketPct: state.marketPct,
    reservePct: state.reservePct,
    labStrategy: state.labStrategy
  };
}

function scenePresentation(c){
  const provider = providerName(state.outageProvider);
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
      kicker:'SHARED DEPENDENCY',
      title:'One network. Shared dependencies.',
      text:'Twenty synthetic banks depend on three shared providers. In the stable state, critical capacity moves normally through the network.',
      statLabel:'SYSTEM STATE',
      statValue:'20 banks · 3 providers',
      caption:'One shared provider can become one shared point of failure.',
      voice:'Start with the system in a stable state. Twenty synthetic banks rely on three shared cloud providers. This looks diversified at the institution level, but several banks still depend on the same underlying infrastructure.',
      rate:.96,
      visualDuration:4800
    },
    {
      kicker:'PROVIDER FAILURE',
      title:provider+' goes offline.',
      text:'Every synthetic bank connected to the failed provider loses critical capacity at the same time. The problem becomes systemic because the dependency is shared.',
      statLabel:'AFFECTED',
      statValue:affected+' banks at once',
      caption:provider+' fails. '+affected+' banks are disrupted simultaneously.',
      voice:'Now '+provider+' goes offline. '+affected+' banks lose critical capacity at the same time. The important point is simultaneity. A shared dependency turns one provider outage into a system wide recovery event.',
      rate:.92,
      visualDuration:5200
    },
    {
      kicker:'CAPACITY SHORTAGE',
      title:'Recovery demand arrives at once.',
      text:'Affected banks seek backup capacity simultaneously. Immediate market supply is smaller than total recovery demand.',
      statLabel:'CAPACITY GAP',
      statValue:format(gap)+' units',
      caption:format(demand)+' units demanded. '+format(available)+' are immediately available.',
      voice:'The affected banks now request backup capacity together. They need '+format(demand)+' units, while the immediate market can provide '+format(available)+'. That leaves a capacity gap of '+format(gap)+' units.',
      rate:.91,
      visualDuration:5400
    },
    {
      kicker:'STRANDED RESERVE',
      title:'Reserve exists, but cannot move.',
      text:'Individual reserves improve preparedness, yet unused capacity at unaffected banks remains ring fenced instead of reaching the institutions under stress.',
      statLabel:'STRANDED RESERVE',
      statValue:format(stranded)+' units',
      caption:'Capacity exists elsewhere in the system, but ring-fencing prevents redistribution.',
      voice:'Individual reserves help, but they are assigned bank by bank. In this scenario, '+format(stranded)+' reserve units remain stranded outside the affected institutions while recovery demand is still unmet.',
      rate:.91,
      visualDuration:5600
    },
    {
      kicker:'POOLED RECOVERY',
      title:'The same reserve is coordinated.',
      text:'SCFR changes the allocation rule rather than adding a larger budget. Pre-arranged pooled capacity can be redirected toward affected banks.',
      statLabel:'WORKLOAD RESTORED',
      statValue:restored+'%',
      caption:'The same '+format(reserve)+' reserve units can move toward the banks that need them.',
      voice:'SCFR does not add a new reserve budget. It changes coordination. The same '+format(reserve)+' reserve units are pooled in advance and directed toward the affected banks. Critical workload restoration rises to '+restored+' percent in this synthetic run.',
      rate:.94,
      visualDuration:5600
    },
    {
      kicker:'OUTCOME',
      title:'Same shock. Different coordination.',
      text:'The comparison isolates the mechanism: the shock and assumptions stay fixed while the recovery rule changes.',
      statLabel:'RESILIENCE SCORE',
      statValue:'Market '+marketScore+' · Individual '+individualScore+' · SCFR '+scfrScore,
      caption:'Same shock. Same reserve budget. Different coordination.',
      voice:'The final comparison isolates the coordination effect. The market score is '+marketScore+', individual reserves score '+individualScore+', and the pooled SCFR mechanism scores '+scfrScore+'. This is a synthetic mechanism test, not a forecast. You can now change the assumptions in Scenario Lab.',
      rate:.93,
      visualDuration:6200
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
  $('#raGuidedStatus').textContent = guided.active ? 'RUNNING' : 'READY';

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

function renderLab(){
  const c = comparison();
  const provider = providers.find(item => item.id === state.outageProvider);
  const selected = c[state.labStrategy];
  const selectedGap = Math.max(0, selected.totalDemand-selected.allocated);
  const ruleLabel = state.allocationRule === 'systemic' ? 'Systemic' : state.allocationRule === 'equal' ? 'Equal' : 'Readiness';

  $('#raMarketLabel').textContent = state.marketPct+'%';
  $('#raReserveLabel').textContent = state.reservePct+'%';
  $('#raLabTitle').textContent = (provider?.name || state.outageProvider)+' outage';
  $('#raAffectedDemand').textContent = format(c.market.totalDemand)+' units';
  $('#raMobileProvider').textContent = provider?.name || state.outageProvider;
  $('#raMobileMarket').textContent = state.marketPct+'%';
  $('#raMobileReserve').textContent = state.reservePct+'%';
  $('#raLabMarketSummary').textContent = state.marketPct+'%';
  $('#raLabReserveSummary').textContent = state.reservePct+'%';
  $('#raLabRuleSummary').textContent = ruleLabel;

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
    (provider?.name || state.outageProvider)+' · '+state.marketPct+'% market · '+state.reservePct+'% reserve';

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

  earth.lab.update(earthPayload(c));
}

function evidenceSnapshot(){
  const c=comparison();
  const stats=systemStats();
  const provider=providers.find(item=>item.id===state.outageProvider);
  return {
    generatedAt:new Date().toISOString(),
    product:'Resilience Atlas',
    modelVersion:'v0.1 synthetic mechanism stress-test',
    scenario:{
      outageProvider:state.outageProvider,
      outageProviderName:provider?.name || state.outageProvider,
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
      market:c.market,
      individual:c.individual,
      scfr:c.scfr
    },
    boundary:'All institutions, provider assignments, workloads, readiness values, importance weights, capacity units and numerical outcomes are synthetic and illustrative.'
  };
}

function renderEvidence(){
  const c=comparison();
  const stats=systemStats();
  const provider=providers.find(item=>item.id===state.outageProvider);
  const marketPool=c.market.allocated;
  const reservePool=c.scfr.totalReserve;
  const ruleLabel=state.allocationRule==='systemic' ? 'systemic' : state.allocationRule==='equal' ? 'equal' : 'readiness';

  $('#raEvidenceBanks').textContent=String(banks.length);
  $('#raEvidenceProviders').textContent=String(providers.length);
  $('#raEvidenceLoad').textContent=format(stats.totalSystemLoad)+' units';
  $('#raEvidenceDemand').textContent=format(c.market.totalDemand)+' units';
  $('#raEvidenceMarketPool').textContent=format(marketPool)+' units';
  $('#raEvidenceReservePool').textContent=format(reservePool)+' units';
  $('#raEvidenceHHI').textContent=Math.round(stats.hhi).toLocaleString('en-US');
  $('#raEvidenceScenario').textContent=
    (provider?.name || state.outageProvider)+' · '+state.marketPct+'% market · '+state.reservePct+'% reserve · '+ruleLabel+' rule';

  earth.evidence.update({
    outageProvider:state.outageProvider,
    comparison:c,
    marketPct:state.marketPct,
    reservePct:state.reservePct
  });
}

function exportEvidence(){
  const snapshot=evidenceSnapshot();
  const blob=new Blob([JSON.stringify(snapshot,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement('a');
  anchor.href=url;
  anchor.download='resilience-atlas-scenario.json';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),0);
}

function setupEvidence(){
  $('#raExportEvidence')?.addEventListener('click',exportEvidence);
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

function switchTab(tab){
  if(guided.active) stopGuidedSimulation();
  state.tab = tab;
  $$('.ra-nav-tab').forEach(button=>{
    button.classList.toggle('is-active', button.dataset.raTab === tab);
  });
  $$('.ra-view').forEach(view=>{
    view.classList.toggle('is-active', view.dataset.raView === tab);
  });
  if(tab !== 'lab' && document.body.classList.contains('ra-mobile-sheet-open')) setLabSheet(false);
  if(tab === 'lab') renderLab();
  if(tab === 'evidence') renderEvidence();
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

function englishVoices(){
  if(!('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices().filter(voice=>/^en/i.test(voice.lang));
}

function chooseNarrator(){
  const voices=englishVoices();
  const preferences=[
    /Microsoft.*(Guy|Andrew|Ryan|Brian|Christopher|Eric).*(Natural|Online)/i,
    /Google UK English Male/i,
    /Daniel.*(Enhanced|Premium)/i,
    /^Daniel$/i,
    /Aaron.*(Enhanced|Premium)/i,
    /^Aaron$/i,
    /Arthur.*(Enhanced|Premium)/i,
    /^Arthur$/i,
    /Alex.*(Enhanced|Premium)/i,
    /^Alex$/i
  ];
  for(const pattern of preferences){
    const match=voices.find(voice=>pattern.test(voice.name));
    if(match) return match;
  }
  return voices.find(voice=>/^en-GB/i.test(voice.lang)) ||
         voices.find(voice=>/^en-US/i.test(voice.lang)) ||
         voices[0] || null;
}

function updateNarrationControl(){
  const button=$('#raNarrationToggle');
  button.setAttribute('aria-pressed',guided.narration ? 'true' : 'false');
  $('#raNarrationLabel').textContent=guided.narration ? 'Narration on' : 'Narration off';
}

function wait(ms,runId){
  return new Promise(resolve=>{
    window.setTimeout(()=>{
      resolve(runId===guided.runId);
    },ms);
  });
}

function speakCurrentScene(story,runId){
  if(!guided.narration || !('speechSynthesis' in window)){
    return wait(story.visualDuration,runId);
  }

  return new Promise(resolve=>{
    window.speechSynthesis.cancel();

    const utterance=new SpeechSynthesisUtterance(story.voice);
    guided.voice ||= chooseNarrator();
    if(guided.voice) utterance.voice=guided.voice;
    utterance.lang=guided.voice?.lang || 'en-GB';
    utterance.rate=story.rate || .93;
    utterance.pitch=.98;
    utterance.volume=.96;

    const hud=$('#raGuidedHud');
    hud.classList.add('is-speaking');

    let settled=false;
    const finish=()=>{
      if(settled) return;
      settled=true;
      hud.classList.remove('is-speaking');
      resolve(runId===guided.runId);
    };

    utterance.onend=finish;
    utterance.onerror=finish;

    const words=story.voice.trim().split(/\s+/).length;
    const safetyMs=Math.max(story.visualDuration,words/(utterance.rate*2.2)*1000+2400);
    window.setTimeout(finish,safetyMs);
    window.speechSynthesis.speak(utterance);
  });
}

function setGuidedActive(active){
  guided.active=active;
  document.body.classList.toggle('ra-guided-running',active);
  $('#raRunLabel').textContent=active ? 'Stop Simulation' : state.scene===5 ? 'Replay Guided Simulation' : 'Run Guided Simulation';
  $('#raGuidedStatus').textContent=active ? 'RUNNING' : state.scene===5 ? 'COMPLETE' : 'READY';
}

function stopGuidedSimulation(){
  guided.runId++;
  setGuidedActive(false);
  $('#raGuidedHud').classList.remove('is-speaking');
  if('speechSynthesis' in window) window.speechSynthesis.cancel();
}

async function runGuidedSimulation(){
  if(guided.active){
    stopGuidedSimulation();
    return;
  }

  guided.runId++;
  const runId=guided.runId;
  setGuidedActive(true);

  for(let i=0;i<6;i++){
    if(runId!==guided.runId) return;
    state.scene=i;
    renderScene();

    const story=scenePresentation(comparison())[i];
    const continued=await speakCurrentScene(story,runId);
    if(!continued || runId!==guided.runId) return;
  }

  if(runId===guided.runId){
    setGuidedActive(false);
    $('#raGuidedStatus').textContent='COMPLETE';
  }
}

function setupScenes(){
  $('.ra-scene-list button').forEach(button=>{
    button.addEventListener('click',()=>{
      if(guided.active) stopGuidedSimulation();
      state.scene=Number(button.dataset.raScene);
      renderScene();
    });
  });

  $('.ra-mobile-scene-nav button').forEach(button=>{
    button.addEventListener('click',()=>{
      if(guided.active) stopGuidedSimulation();
      state.scene=Number(button.dataset.raMobileScene);
      renderScene();
    });
  });

  $('#raRunPreview').addEventListener('click',runGuidedSimulation);

  $('#raNarrationToggle').addEventListener('click',()=>{
    guided.narration=!guided.narration;
    updateNarrationControl();
    if(!guided.narration && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  });
}

function setLabStrategy(strategy){
  if(!['market','individual','scfr'].includes(strategy)) return;
  state.labStrategy=strategy;
  renderLab();
}

function resetLab(){
  state.outageProvider='blue';
  state.marketPct=20;
  state.reservePct=25;
  state.allocationRule='systemic';
  state.labStrategy='market';

  $('#raProviderSelect').value=state.outageProvider;
  $('#raMarketPct').value=String(state.marketPct);
  $('#raReservePct').value=String(state.reservePct);
  $('#raRuleSelect').value=state.allocationRule;

  renderLab();
  renderBaseline();
}

function setLabSheet(open){
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
  }else{
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
  $('#raProviderSelect').addEventListener('change',event=>{
    state.outageProvider=event.target.value;
    renderLab();
    renderBaseline();
  });
  $('#raMarketPct').addEventListener('input',event=>{
    state.marketPct=Number(event.target.value);
    renderLab();
    renderBaseline();
  });
  $('#raReservePct').addEventListener('input',event=>{
    state.reservePct=Number(event.target.value);
    renderLab();
    renderBaseline();
  });
  $('#raRuleSelect').addEventListener('change',event=>{
    state.allocationRule=event.target.value;
    renderLab();
    renderBaseline();
  });

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
  });
}

setupTabs();
setupTheme();
setupScenes();
setupLab();
setupMobileLab();
setupEvidence();
updateNarrationControl();
renderScene();
renderLab();
renderEvidence();

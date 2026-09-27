import { banks, providers } from './data/banks.js';
import { compareStrategies, resilienceFrontier } from './model/simulation.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const pct = v => `${Math.round(v)}%`;
const num = v => Math.round(v).toLocaleString('en-US');

const defaults = { outageProvider:'blue', marketPct:20, reservePct:25, allocationRule:'systemic' };

const scenes = [
  {
    title:'Meet the system',
    text:'Twenty stylized banks rely on three synthetic cloud providers for critical workloads. Everything is operating normally.',
    stat:'20 banks · 3 providers · normal operations'
  },
  {
    title:'One shared provider fails',
    text:'A severe outage at Blue Cloud instantly affects every bank whose critical workloads depend on it. A local incident becomes a system-wide coordination problem.',
    stat:'8 banks affected at the same time'
  },
  {
    title:'Everyone needs Plan B at once',
    text:'Affected banks request emergency backup capacity simultaneously. Spot capacity exists, but aggregate demand is much larger than what can be sourced after the shock.',
    stat:'Emergency demand exceeds immediate supply'
  },
  {
    title:'Individual reserves can still fragment',
    text:'Each bank has its own reserve, but reserve belonging to unaffected banks cannot move. Capacity may sit unused while affected banks still face shortages.',
    stat:'Same reserve budget · ring-fenced allocation'
  },
  {
    title:'SCFR pools the reserve before the crisis',
    text:'The same total reserve is pooled and reallocated across affected banks using a transparent rule. The difference is coordination, not a larger reserve budget.',
    stat:'Same reserve · different allocation mechanism'
  },
  {
    title:'Now test the system yourself',
    text:'The explainer becomes an experiment. Change reserve size, spot capacity and allocation rules in the Stress Lab and see how the synthetic system responds.',
    stat:'Animated story → interactive research prototype'
  }
];

let scene = 0;
let autoplay = null;

function providerName(id){ return providers.find(p=>p.id===id)?.name || id; }

function renderNetwork(){
  $('#providers').innerHTML = providers.map(p => {
    const connected = banks.filter(b=>b.provider===p.id).length;
    return `<div class="provider" data-provider="${p.id}" style="--provider:${p.color}">
      <small>SYNTHETIC PROVIDER</small><strong>${p.name}</strong><small>${connected} connected banks</small>
    </div>`;
  }).join('');

  $('#bankGroups').innerHTML = providers.map(p => {
    const group = banks.filter(b=>b.provider===p.id);
    return `<section class="bank-group">
      <h4>${p.name} clients</h4>
      <div class="bank-grid">
      ${group.map(b=>`<div class="bank" data-bank="${b.id}" data-provider="${b.provider}" title="${b.type} · load ${b.criticalLoad} · readiness ${Math.round(b.readiness*100)}%">
        <b>${b.label}</b><small>${b.type}</small>
      </div>`).join('')}
      </div>
    </section>`;
  }).join('');
}

function comparisonHTML(){
  const c = compareStrategies(defaults);
  const rows = [
    ['Market scramble','UNCOORDINATED',c.market,'Spot capacity only.'],
    ['Individual reserves','RING-FENCED',c.individual,'Reserve stays bank-specific.'],
    ['SCFR pooled reserve','COORDINATED',c.scfr,'Same reserve budget, pooled.']
  ];
  const best = Math.max(...rows.map(r=>r[2].resilience));
  return rows.map(([name,label,r,desc]) => `
    <article class="compare-card ${r.resilience===best?'best':''}">
      <div class="eyebrow">${label}</div>
      <h3>${name}</h3>
      <div class="compare-score">${Math.round(r.resilience)} <small>/100</small></div>
      <p>Systemic Resilience Score</p>
      <div class="mini"><span>Banks recovered</span><b>${r.banksRecovered}/${r.affectedCount}</b></div>
      <div class="mini"><span>Critical workload restored</span><b>${pct(r.criticalRestoredPct)}</b></div>
      <div class="mini"><span>Unmet capacity</span><b>${pct(r.unmetPct)}</b></div>
      <div class="mini"><span>Stranded reserve</span><b>${num(r.strandedReserve)}</b></div>
      <p>${desc}</p>
    </article>`).join('');
}

function clearStatuses(){
  $$('.provider').forEach(el=>el.classList.remove('offline'));
  $$('.bank').forEach(el=>el.classList.remove('affected','restored','waiting'));
}

function applyScene(){
  const s = scenes[scene];
  $('#sceneNo').textContent = scene+1;
  $('#sceneTitle').textContent = s.title;
  $('#sceneText').textContent = s.text;
  $('#sceneStat').textContent = s.stat;
  $('#stage').className = `stage scene-${scene+1}`;

  clearStatuses();

  const c = compareStrategies(defaults);
  const affected = c.market.rows;
  $('#flowDemand').textContent = num(c.market.totalDemand);
  $('#flowMarket').textContent = num(c.market.totalDemand * defaults.marketPct / 100);
  $('#flowReserve').textContent = num(c.scfr.totalReserve);

  if(scene >= 1){
    document.querySelector('.provider[data-provider="blue"]')?.classList.add('offline');
    affected.forEach(b=>document.querySelector(`.bank[data-bank="${b.id}"]`)?.classList.add('affected'));
  }

  if(scene === 3){
    c.individual.rows.forEach(b=>{
      const el = document.querySelector(`.bank[data-bank="${b.id}"]`);
      if(!el) return;
      el.classList.remove('affected');
      el.classList.add(b.recovered?'restored':'waiting');
    });
  }

  if(scene >= 4) $('#compareOverlay').innerHTML = comparisonHTML();

  $('#backScene').disabled = scene===0;
  $('#nextScene').textContent = scene===scenes.length-1 ? 'Open Stress Lab →' : 'Next →';
  $$('#sceneDots button').forEach((d,i)=>d.classList.toggle('active',i===scene));
}

function stopAuto(){
  if(autoplay){ clearInterval(autoplay); autoplay=null; }
  $('#autoScene').textContent='▶ Auto-play';
}

function setupStory(){
  $('#sceneDots').innerHTML = scenes.map((_,i)=>`<button data-scene="${i}" aria-label="Scene ${i+1}"></button>`).join('');
  $$('#sceneDots button').forEach(btn=>btn.addEventListener('click',()=>{
    scene=Number(btn.dataset.scene); stopAuto(); applyScene();
  }));

  $('#backScene').addEventListener('click',()=>{
    if(scene>0){ scene--; stopAuto(); applyScene(); }
  });

  $('#nextScene').addEventListener('click',()=>{
    stopAuto();
    if(scene<scenes.length-1){ scene++; applyScene(); }
    else switchTab('lab');
  });

  $('#autoScene').addEventListener('click',()=>{
    if(autoplay){ stopAuto(); return; }
    $('#autoScene').textContent='■ Stop';
    autoplay=setInterval(()=>{
      if(scene<scenes.length-1){ scene++; applyScene(); }
      else stopAuto();
    },2600);
  });

  applyScene();
}

function switchTab(id){
  $$('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===id));
  $$('.panel').forEach(p=>p.classList.toggle('active',p.id===id));
  if(id==='lab') renderLab();
  window.scrollTo({top:0,behavior:'smooth'});
}
$$('.tab').forEach(t=>t.addEventListener('click',()=>switchTab(t.dataset.tab)));

function strategyCard(name,label,r,best){
  return `<article class="card strategy-card ${best?'best':''}">
    <div class="eyebrow">${label}</div>
    <h3>${name}</h3>
    <div class="score">${Math.round(r.resilience)} <small>/ 100</small></div>
    <div class="bar"><i style="width:${Math.min(100,r.resilience)}%"></i></div>
    <div class="metric"><span>Banks recovered ≥80%</span><b>${r.banksRecovered}/${r.affectedCount}</b></div>
    <div class="metric"><span>Critical workload restored</span><b>${pct(r.criticalRestoredPct)}</b></div>
    <div class="metric"><span>Unmet capacity demand</span><b>${pct(r.unmetPct)}</b></div>
    <div class="metric"><span>Unused / stranded reserve</span><b>${num(r.strandedReserve)}</b></div>
  </article>`;
}

function renderFrontier(args){
  const data = resilienceFrontier(args);
  const W=900,H=260,p={l:48,r:18,t:30,b:42};
  const x=v=>p.l+(v/60)*(W-p.l-p.r);
  const y=v=>H-p.b-(v/100)*(H-p.t-p.b);
  const points=key=>data.map(d=>`${x(d.reservePct)},${y(d[key])}`).join(' ');
  const grid=[0,25,50,75,100].map(v=>`
    <line class="gridline" x1="${p.l}" y1="${y(v)}" x2="${W-p.r}" y2="${y(v)}"/>
    <text class="axis-label" x="8" y="${y(v)+3}">${v}</text>`).join('');
  const ticks=[0,10,20,30,40,50,60].map(v=>`<text class="axis-label" x="${x(v)-8}" y="${H-14}">${v}%</text>`).join('');
  const current = data.find(d=>d.reservePct===args.reservePct) || data[0];

  $('#frontier').innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-label="Resilience frontier">
    ${grid}
    <line class="axis" x1="${p.l}" y1="${H-p.b}" x2="${W-p.r}" y2="${H-p.b}"/>
    ${ticks}
    <polyline points="${points('market')}" fill="none" stroke="#f05b67" stroke-width="3"/>
    <polyline points="${points('individual')}" fill="none" stroke="#f0c65b" stroke-width="3"/>
    <polyline points="${points('scfr')}" fill="none" stroke="#4fbf8f" stroke-width="4"/>
    <circle class="frontier-point" cx="${x(args.reservePct)}" cy="${y(current.scfr)}" r="6" fill="#fff" stroke="#4fbf8f" stroke-width="3"/>
    <text class="legend" x="${p.l}" y="14" fill="#f05b67">— Market</text>
    <text class="legend" x="${p.l+90}" y="14" fill="#f0c65b">— Individual</text>
    <text class="legend" x="${p.l+205}" y="14" fill="#4fbf8f">— SCFR</text>
    <text class="axis-label" x="${W/2-95}" y="${H}">Pre-reserved capacity (% of system critical load)</text>
  </svg>`;
}

const PRESETS = {
  baseline:{outageProvider:'blue',marketPct:20,reservePct:25,allocationRule:'systemic'},
  scarcity:{outageProvider:'blue',marketPct:5,reservePct:30,allocationRule:'systemic'},
  lean:{outageProvider:'orange',marketPct:15,reservePct:20,allocationRule:'systemic'}
};

function applyPreset(name){
  const p = PRESETS[name];
  if(!p) return;
  $('#providerSelect').value=p.outageProvider;
  $('#marketPct').value=p.marketPct;
  $('#reservePct').value=p.reservePct;
  $('#ruleSelect').value=p.allocationRule;
  $('.preset').forEach(b=>b.classList.toggle('active',b.dataset.preset===name));
  renderLab();
}

function currentArgs(){
  return {
    outageProvider:$('#providerSelect').value,
    marketPct:Number($('#marketPct').value),
    reservePct:Number($('#reservePct').value),
    allocationRule:$('#ruleSelect').value
  };
}

function renderInsight(c,args){
  const uplift = c.scfr.resilience - c.individual.resilience;
  const strandedReduction = c.individual.strandedReserve - c.scfr.strandedReserve;
  const restoredUplift = c.scfr.criticalRestoredPct - c.individual.criticalRestoredPct;
  $('#decisionInsight').innerHTML = `
    <div>
      <div class="eyebrow">MECHANISM EFFECT · SAME RESERVE BUDGET</div>
      <h3>Pooling changes where capacity can go.</h3>
      <p>In this synthetic scenario, SCFR changes the <b>allocation mechanism</b>, not the total pre-reserved capacity.</p>
    </div>
    <div class="insight-metrics">
      <div><strong>+${uplift.toFixed(1)}</strong><span>resilience points vs individual reserves</span></div>
      <div><strong>+${restoredUplift.toFixed(1)} pp</strong><span>critical workload restored</span></div>
      <div><strong>${num(Math.max(0,strandedReduction))}</strong><span>capacity units no longer stranded</span></div>
    </div>
  `;
}

function exportScenario(){
  const args = currentArgs();
  const results = compareStrategies(args);
  const payload = {
    project:'CloudRescue — SCFR Stress Lab',
    model_version:'0.1',
    exported_at:new Date().toISOString(),
    warning:'Synthetic illustrative scenario; not a forecast or assessment of any real institution.',
    assumptions:args,
    results:{
      market:results.market,
      individual:results.individual,
      scfr:results.scfr
    }
  };
  const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url;
  a.download=`cloudrescue-${args.outageProvider}-reserve-${args.reservePct}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function renderLab(){
  const args = currentArgs();

  $('#marketLabel').textContent=`${args.marketPct}%`;
  $('#reserveLabel').textContent=`${args.reservePct}%`;

  const c = compareStrategies(args);
  $('#shockTitle').textContent=`${providerName(args.outageProvider)} outage`;
  $('#shockCopy').textContent=`${c.market.affectedCount} affected banks simultaneously request ${num(c.market.totalDemand)} units of backup capacity.`;
  $('#affectedPill').textContent=`${c.market.affectedCount} / ${banks.length} banks affected`;

  const list = [
    ['Market scramble','UNCOORDINATED',c.market],
    ['Individual reserves','RING-FENCED',c.individual],
    ['SCFR pooled reserve','COORDINATED',c.scfr]
  ];
  const best = Math.max(...list.map(x=>x[2].resilience));
  $('#strategyCards').innerHTML = list.map(([n,l,r])=>strategyCard(n,l,r,r.resilience===best)).join('');

  renderFrontier(args);
  renderInsight(c,args);

  const success = c.scfr.resilience>=80 && args.reservePct<=30;
  $('#challenge').classList.toggle('success',success);
  $('#challengeText').textContent = success
    ? `Target achieved: ${Math.round(c.scfr.resilience)} resilience with ${args.reservePct}% reserve.`
    : `Current result: ${Math.round(c.scfr.resilience)} resilience with ${args.reservePct}% reserve.`;
}

['providerSelect','marketPct','reservePct','ruleSelect'].forEach(id=>{
  $('#'+id).addEventListener('input',renderLab);
});
$('.preset').forEach(btn=>btn.addEventListener('click',()=>applyPreset(btn.dataset.preset)));
$('#runBtn').addEventListener('click',renderLab);
$('#exportBtn').addEventListener('click',exportScenario);

renderNetwork();
setupStory();
renderLab();

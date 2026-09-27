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
    stat:'20 banks · 3 providers · normal operations',
    kicker:'NORMAL OPERATIONS',
    caption:'20 banks depend on 3 shared cloud providers.',
    voice:'This synthetic banking system has twenty banks using three shared cloud providers for critical workloads.',
    duration:5200,
    cue:'normal'
  },
  {
    title:'One shared provider fails',
    text:'A severe outage at Blue Cloud instantly affects every bank whose critical workloads depend on it. A local incident becomes a system-wide coordination problem.',
    stat:'8 banks affected at the same time',
    kicker:'COMMON SHOCK',
    caption:'Blue Cloud fails. 8 banks are disrupted at once.',
    voice:'Now one shared provider fails, and eight banks are disrupted at the same time.',
    duration:5200,
    cue:'alert'
  },
  {
    title:'Everyone needs Plan B at once',
    text:'Affected banks request emergency backup capacity simultaneously. Spot capacity exists, but aggregate demand is much larger than what can be sourced after the shock.',
    stat:'Emergency demand exceeds immediate supply',
    kicker:'CAPACITY SCRAMBLE',
    caption:'608 units demanded. Only 122 are immediately available.',
    voice:'All affected banks now need backup capacity. Demand reaches six hundred eight units, but only one hundred twenty two are immediately available.',
    duration:6000,
    cue:'shortage'
  },
  {
    title:'Individual reserves can still fragment',
    text:'Each bank has its own reserve, but reserve belonging to unaffected banks cannot move. Capacity may sit unused while affected banks still face shortages.',
    stat:'Same reserve budget · ring-fenced allocation',
    kicker:'FRAGMENTED RESERVES',
    caption:'Some reserve exists — but it is locked in the wrong places.',
    voice:'Individual reserves help, but capacity stays ring fenced. Some reserve remains unused while affected banks still face shortages.',
    duration:6000,
    cue:'fragment'
  },
  {
    title:'SCFR pools the reserve before the crisis',
    text:'The same total reserve is pooled and reallocated across affected banks using a transparent rule. The difference is coordination, not a larger reserve budget.',
    stat:'Same reserve · different allocation mechanism',
    kicker:'COORDINATED RECOVERY',
    caption:'SCFR redirects the same reserve budget to where it is needed.',
    voice:'SCFR does not create a bigger reserve. It pools the same reserve budget and reallocates capacity to the affected banks that need it.',
    duration:6200,
    cue:'recovery'
  },
  {
    title:'Now test the system yourself',
    text:'The explainer becomes an experiment. Change reserve size, spot capacity and allocation rules in the Stress Lab and see how the synthetic system responds.',
    stat:'Animated story → interactive research prototype',
    kicker:'RESULT',
    caption:'Same shock. Same reserve budget. Different coordination.',
    voice:'In this illustrative scenario, coordinated pooling restores more critical workload with the same total reserve budget. Now test the assumptions yourself.',
    duration:6000,
    cue:'result'
  }
];

let scene = 0;
let autoplay = null;
let narrationEnabled = true;
let audioContext = null;

function setupTheme(){
  const button = $('#themeToggle');
  const label = $('#themeLabel');
  if(!button || !label) return;

  const sync = () => {
    const dark = document.documentElement.dataset.theme === 'dark';
    label.textContent = dark ? 'Light' : 'Dark';
    button.setAttribute('aria-pressed', dark ? 'true' : 'false');
    button.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
  };

  button.addEventListener('click',()=>{
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('cloudrescue-theme', next);
    sync();
    requestAnimationFrame(drawNetworkLines);
  });

  sync();
}

function getEnglishVoice(){
  if(!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find(v=>/^en-GB/i.test(v.lang)) ||
         voices.find(v=>/^en-US/i.test(v.lang)) ||
         voices.find(v=>/^en/i.test(v.lang)) ||
         null;
}

function speakScene(){
  if(!narrationEnabled || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(scenes[scene].voice);
  const voice = getEnglishVoice();
  if(voice) utterance.voice = voice;
  utterance.lang = voice?.lang || 'en-US';
  utterance.rate = 1.01;
  utterance.pitch = 1;
  utterance.volume = .88;
  window.speechSynthesis.speak(utterance);
}

function playCue(kind){
  if(!narrationEnabled || kind === 'normal') return;
  try{
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audioContext;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.0001,now);
    gain.gain.exponentialRampToValueAtTime(kind === 'alert' ? .045 : .026,now+.02);
    gain.gain.exponentialRampToValueAtTime(.0001,now+.38);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    const freq = kind === 'alert' ? 360 : kind === 'recovery' || kind === 'result' ? 620 : 440;
    osc.frequency.setValueAtTime(freq,now);
    if(kind === 'alert') osc.frequency.exponentialRampToValueAtTime(250,now+.32);
    if(kind === 'recovery' || kind === 'result') osc.frequency.exponentialRampToValueAtTime(freq*1.28,now+.28);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now+.4);
  }catch(e){}
}

function setNarration(enabled){
  narrationEnabled = enabled;
  const btn = $('#narrationToggle');
  if(btn){
    btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    btn.textContent = enabled ? '🔊 Narration' : '🔇 Muted';
  }
  if(!enabled && 'speechSynthesis' in window) window.speechSynthesis.cancel();
}

function animateCounter(el,from,to,duration=650){
  if(!el) return;
  const start=performance.now();
  const tick=now=>{
    const p=Math.min(1,(now-start)/duration);
    const eased=1-Math.pow(1-p,3);
    el.textContent=num(from+(to-from)*eased);
    if(p<1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function renderVisualSignal(c){
  const el = $('#visualSignal');
  if(!el) return;
  const individual = c.individual;
  const scfr = c.scfr;

  if(scene === 0){
    el.innerHTML = `
      <div class="signal-pill"><b>20</b><span>synthetic banks</span></div>
      <div class="signal-separator">→</div>
      <div class="signal-pill"><b>3</b><span>shared providers</span></div>
      <div class="signal-separator">→</div>
      <div class="signal-pill safe"><b>100%</b><span>normal operations</span></div>`;
  } else if(scene === 1){
    el.innerHTML = `
      <div class="signal-alert"><span class="signal-icon">!</span><b>1 provider outage</b><span>8 banks affected simultaneously</span></div>`;
  } else if(scene === 2){
    const market = c.market;
    const supply = market.allocated;
    const gap = Math.max(0,market.totalDemand-supply);
    el.innerHTML = `
      <div class="capacity-visual">
        <div class="capacity-head"><span>Emergency backup demand</span><b>${num(market.totalDemand)} units</b></div>
        <div class="capacity-track"><i class="capacity-supply" style="width:${Math.min(100,supply/market.totalDemand*100)}%"></i><i class="capacity-gap" style="width:${Math.max(0,100-supply/market.totalDemand*100)}%"></i></div>
        <div class="capacity-labels"><span class="available">Available now: ${num(supply)}</span><span class="shortfall">Shortfall: ${num(gap)}</span></div>
      </div>`;
  } else if(scene === 3){
    el.innerHTML = `
      <div class="fragment-visual">
        <div><b>${num(individual.totalReserve)}</b><span>Total reserve</span></div>
        <div class="fragment-arrow">→</div>
        <div class="warning"><b>${num(individual.strandedReserve)}</b><span>stranded / unavailable where needed</span></div>
      </div>`;
  } else if(scene === 4){
    el.innerHTML = `
      <div class="fragment-visual coordinated">
        <div><b>${num(scfr.totalReserve)}</b><span>Same total reserve</span></div>
        <div class="fragment-arrow">→</div>
        <div class="good"><b>${Math.round(scfr.criticalRestoredPct)}%</b><span>critical workload restored</span></div>
      </div>`;
  } else {
    el.innerHTML = '';
  }
}

function providerName(id){ return providers.find(p=>p.id===id)?.name || id; }

function renderNetwork(){
  $('#providers').innerHTML = providers.map(p => {
    const connected = banks.filter(b=>b.provider===p.id).length;
    return `<div class="provider" data-provider="${p.id}" style="--provider:${p.color}">
      <div class="provider-title"><span class="provider-glyph" aria-hidden="true">☁</span><div><small>SYNTHETIC PROVIDER</small><strong>${p.name}</strong><small>${connected} connected banks</small></div></div>
    </div>`;
  }).join('');

  $('#bankGroups').innerHTML = providers.map(p => {
    const group = banks.filter(b=>b.provider===p.id);
    return `<section class="bank-group">
      <h4>${p.name} clients</h4>
      <div class="bank-grid">
      ${group.map(b=>`<div class="bank" data-bank="${b.id}" data-provider="${b.provider}" title="${b.type} · load ${b.criticalLoad} · readiness ${Math.round(b.readiness*100)}%">
        <div class="bank-title"><span class="bank-glyph" aria-hidden="true">▦</span><div><b>${b.label}</b><small>${b.type}</small></div></div>
      </div>`).join('')}
      </div>
    </section>`;
  }).join('');
}

function localPoint(el, xFraction=.5, yFraction=.5){
  const stage = $('#stage');
  const sr = stage.getBoundingClientRect();
  const er = el.getBoundingClientRect();
  const sx = stage.offsetWidth / sr.width;
  const sy = stage.offsetHeight / sr.height;
  return {
    x: ((er.left - sr.left) + er.width * xFraction) * sx,
    y: ((er.top - sr.top) + er.height * yFraction) * sy
  };
}

function curvePath(a,b){
  const dy = Math.max(28, Math.abs(b.y-a.y)*.42);
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} C ${a.x.toFixed(1)} ${(a.y+dy).toFixed(1)}, ${b.x.toFixed(1)} ${(b.y-dy).toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

function drawNetworkLines(){
  const svg = $('#networkLines');
  const stage = $('#stage');
  if(!svg || !stage) return;
  svg.setAttribute('viewBox', `0 0 ${stage.offsetWidth} ${stage.offsetHeight}`);

  const paths = [];
  banks.forEach(bank=>{
    const providerEl = document.querySelector(`.provider[data-provider="${bank.provider}"]`);
    const bankEl = document.querySelector(`.bank[data-bank="${bank.id}"]`);
    if(!providerEl || !bankEl) return;
    const a = localPoint(providerEl,.5,1);
    const b = localPoint(bankEl,.5,0);
    paths.push(`<path class="network-line" data-provider="${bank.provider}" d="${curvePath(a,b)}"></path>`);
  });

  if(scene === 4){
    const reserve = document.querySelector('.reserve-node');
    const affected = compareStrategies(defaults).scfr.rows;
    if(reserve){
      const a = localPoint(reserve,.5,0);
      affected.forEach(bank=>{
        const bankEl = document.querySelector(`.bank[data-bank="${bank.id}"]`);
        if(!bankEl) return;
        const b = localPoint(bankEl,.5,1);
        paths.push(`<path class="network-line scfr-line" d="${curvePath(a,b)}"></path>`);
      });
    }
  }

  svg.innerHTML = paths.join('');
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
  $('.bank').forEach(el=>el.classList.remove('affected','restored','waiting','stranded'));
}

function applyScene(){
  const s = scenes[scene];
  $('#sceneNo').textContent = scene+1;
  $('#sceneTitle').textContent = s.title;
  $('#sceneText').textContent = s.text;
  $('#sceneStat').textContent = s.stat;
  $('#captionKicker').textContent = s.kicker;
  $('#captionText').textContent = s.caption;
  $('#stage').className = `stage scene-${scene+1}`;

  clearStatuses();

  const c = compareStrategies(defaults);
  const affected = c.market.rows;
  const storyStatus = [
    'Normal operations',
    'Shared provider outage',
    'Emergency capacity scramble',
    'Ring-fenced reserves',
    'SCFR pooled reserve',
    'Interactive stress test'
  ][scene];
  $('#stageStatus').textContent = storyStatus;
  $('#hudAffected').textContent = scene === 0 ? '0 / 20' : `${c.market.affectedCount} / 20`;
  $('#hudGap').textContent = scene < 2 ? '0' : num(Math.max(0, c.market.totalDemand - c.market.allocated));
  $('#flowDemand').textContent = num(c.market.totalDemand);
  $('#flowMarket').textContent = num(c.market.totalDemand * defaults.marketPct / 100);
  $('#flowReserve').textContent = num(c.scfr.totalReserve);
  renderVisualSignal(c);

  if(scene >= 1){
    document.querySelector('.provider[data-provider="blue"]')?.classList.add('offline');
    affected.forEach(b=>document.querySelector(`.bank[data-bank="${b.id}"]`)?.classList.add('affected'));
  }

  if(scene === 3){
    banks.filter(b=>b.provider !== defaults.outageProvider).forEach(b=>{
      document.querySelector(`.bank[data-bank="${b.id}"]`)?.classList.add('stranded');
    });
    c.individual.rows.forEach(b=>{
      const el = document.querySelector(`.bank[data-bank="${b.id}"]`);
      if(!el) return;
      el.classList.remove('affected');
      el.classList.add(b.recovered?'restored':'waiting');
    });
  }

  if(scene === 4){
    c.scfr.rows.forEach(b=>{
      const el = document.querySelector(`.bank[data-bank="${b.id}"]`);
      if(!el) return;
      el.classList.remove('affected');
      el.classList.add(b.recovered?'restored':'waiting');
    });
  }

  $('#compareOverlay').innerHTML = scene === 5 ? comparisonHTML() : '';
  requestAnimationFrame(drawNetworkLines);

  $('#backScene').disabled = scene===0;
  $('#nextScene').textContent = scene===scenes.length-1 ? 'Open Stress Lab →' : 'Next →';
  $('#sceneDots button').forEach((d,i)=>d.classList.toggle('active',i===scene));
  updateDemoProgress();
}

function updateDemoProgress(){
  const bar = $('#demoProgressBar');
  if(bar) bar.style.width = `${((scene+1)/scenes.length)*100}%`;
}

function stopAuto(){
  if(autoplay){ clearTimeout(autoplay); autoplay=null; }
  if('speechSynthesis' in window) window.speechSynthesis.cancel();
  $('#autoScene').textContent='▶ Watch demo';
}

function playDemoScene(){
  applyScene();
  updateDemoProgress();
  speakScene();
  playCue(scenes[scene].cue);

  if(scene >= scenes.length-1){
    autoplay=setTimeout(()=>{
      stopAuto();
    },scenes[scene].duration);
    return;
  }

  autoplay=setTimeout(()=>{
    scene++;
    playDemoScene();
  },scenes[scene].duration);
}

function startDemo({reset=true}={}){
  stopAuto();
  if(reset) scene=0;
  $('#autoScene').textContent='■ Stop demo';
  playDemoScene();
}

function setFocusMode(on){
  document.body.classList.toggle('story-focus', on);
  const btn = $('#focusStory');
  if(btn) btn.textContent = on ? '✕ Exit focus' : '⛶ Focus view';
  requestAnimationFrame(drawNetworkLines);
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
    startDemo({reset:scene===scenes.length-1});
  });

  $('#narrationToggle').addEventListener('click',()=>{
    setNarration(!narrationEnabled);
    if(autoplay && narrationEnabled) speakScene();
  });

  $('#focusStory').addEventListener('click',()=>{
    setFocusMode(!document.body.classList.contains('story-focus'));
  });

  document.addEventListener('keydown',event=>{
    if(event.key === 'Escape' && document.body.classList.contains('story-focus')){
      setFocusMode(false);
      return;
    }
    const storyActive = $('#story').classList.contains('active');
    if(!storyActive || ['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName)) return;

    if(event.key === 'ArrowRight' && scene < scenes.length-1){
      stopAuto(); scene++; applyScene();
    } else if(event.key === 'ArrowLeft' && scene > 0){
      stopAuto(); scene--; applyScene();
    }
  });

  applyScene();
  updateDemoProgress();
}

function switchTab(id){
  $$('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===id));
  $$('.panel').forEach(p=>p.classList.toggle('active',p.id===id));
  if(id==='lab') renderLab();
  window.scrollTo({top:0,behavior:'smooth'});
}
$('.tab').forEach(t=>t.addEventListener('click',()=>switchTab(t.dataset.tab)));
$('#heroDemo').addEventListener('click',()=>{
  switchTab('story');
  setNarration(true);
  setFocusMode(true);
  scene=0;
  startDemo({reset:false});
});
$('#heroLab').addEventListener('click',()=>switchTab('lab'));

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
  $$('.preset').forEach(b=>b.classList.toggle('active',b.dataset.preset===name));
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
$$('.preset').forEach(btn=>btn.addEventListener('click',()=>applyPreset(btn.dataset.preset)));
$('#runBtn').addEventListener('click',renderLab);
$('#exportBtn').addEventListener('click',exportScenario);

renderNetwork();
setupTheme();
setupStory();
renderLab();
requestAnimationFrame(drawNetworkLines);
let resizeTimer;
window.addEventListener('resize',()=>{
  clearTimeout(resizeTimer);
  resizeTimer=setTimeout(drawNetworkLines,120);
});

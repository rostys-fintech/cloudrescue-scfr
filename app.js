import { banks, providers } from './data/banks.js';
import { compareStrategies, resilienceFrontier } from './model/simulation.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const pct = v => `${Math.round(v)}%`;
const num = v => Math.round(v).toLocaleString('en-US');

const defaults = { outageProvider:'blue', marketPct:20, reservePct:25, allocationRule:'systemic' };

const scenes = [
  {
    title:'Why this risk exists',
    text:'Financial institutions increasingly depend on a limited set of critical ICT and cloud providers. CloudRescue turns that real concentration-risk problem into a transparent synthetic stress test.',
    stat:'Real concentration risk · synthetic 20-bank illustration',
    kicker:'REAL-WORLD MOTIVATION',
    caption:'A common provider can become a common point of operational stress.',
    voice:'Here is the risk. Banks increasingly rely on a small number of critical technology and cloud providers. When many institutions share the same provider, one outage can become a common shock.',
    rate:.94,pitch:.98,visualDuration:5600,cue:'normal'
  },
  {
    title:'One shared provider fails',
    text:'A severe outage at Blue Cloud instantly affects every bank whose critical workloads depend on it. A local incident becomes a system-wide coordination problem.',
    stat:'8 banks affected at the same time',
    kicker:'COMMON SHOCK',
    caption:'Blue Cloud fails. 8 banks are disrupted at once.',
    voice:'Now, Blue Cloud goes down. Eight banks lose critical capacity at the same time. This is no longer one bank’s IT problem. It is a system-wide recovery problem.',
    rate:.90,pitch:.96,visualDuration:6000,cue:'alert'
  },
  {
    title:'Everyone needs Plan B at once',
    text:'Affected banks request emergency backup capacity simultaneously. Spot capacity exists, but aggregate demand is much larger than what can be sourced after the shock.',
    stat:'Emergency demand exceeds immediate supply',
    kicker:'CAPACITY SCRAMBLE',
    caption:'608 units demanded. Only 122 are immediately available.',
    voice:'All eight banks reach for backup capacity at once. They need six hundred and eight units. The emergency market can supply only one hundred and twenty-two. Most of the demand is still waiting.',
    rate:.89,pitch:.96,visualDuration:6800,cue:'shortage'
  },
  {
    title:'Individual reserves can still fragment',
    text:'Each bank has its own reserve, but reserve belonging to unaffected banks cannot move. Capacity may sit unused while affected banks still face shortages.',
    stat:'Same reserve budget · ring-fenced allocation',
    kicker:'FRAGMENTED RESERVES',
    caption:'Some reserve exists — but it is locked in the wrong places.',
    voice:'Individual reserves help, but there is a catch. Capacity is ring-fenced, bank by bank. It cannot simply move to where the shock is. Here, two hundred and fifty-seven units remain stranded while affected banks are still short.',
    rate:.89,pitch:.96,visualDuration:7200,cue:'fragment'
  },
  {
    title:'SCFR pools the reserve before the crisis',
    text:'The same total reserve is pooled and reallocated across affected banks using a transparent rule. The difference is coordination, not a larger reserve budget.',
    stat:'Same reserve · different allocation mechanism',
    kicker:'COORDINATED RECOVERY',
    caption:'SCFR redirects the same reserve budget to where it is needed.',
    voice:'SCFR changes the coordination rule, not the budget. The same reserve is pooled in advance, then directed to the affected banks that need it most. Watch what happens to recovery.',
    rate:.93,pitch:.98,visualDuration:6800,cue:'recovery'
  },
  {
    title:'Now test the system yourself',
    text:'The explainer becomes an experiment. Change reserve size, spot capacity and allocation rules in the Stress Lab and see how the synthetic system responds.',
    stat:'Animated story → interactive research prototype',
    kicker:'RESULT',
    caption:'Same shock. Same reserve budget. Different coordination.',
    voice:'In this synthetic run, coordination materially improves recovery. This is not a forecast. It is a way to test the mechanism. Same shock. Same reserve budget. Different coordination. Now change the assumptions yourself.',
    rate:.92,pitch:.98,visualDuration:6800,cue:'result'
  }
];

let scene = 0;
let autoplay = null;
let narrationEnabled = true;
let audioContext = null;
let sceneTimers = [];
let demoRunId = 0;
let storyArgs = {...defaults};
let storyFromLab = false;
let sensitivityMode = 'scfr';
let activeChallenge = 'efficiency';
let activeSeed = '';

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

function englishVoices(){
  if(!('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang));
}

function preferredNarrator(voices=englishVoices()){
  const saved = localStorage.getItem('cloudrescue-narrator');
  if(saved){
    const exact=voices.find(v=>v.name===saved);
    if(exact) return exact;
  }

  const preferences = [
    /Microsoft.*(Guy|Andrew|Ryan|Brian|Christopher|Eric).*(Natural|Online)/i,
    /Google UK English Male/i,
    /Daniel.*(Enhanced|Premium)/i,
    /^Daniel$/i,
    /Aaron.*(Enhanced|Premium)/i,
    /^Aaron$/i,
    /Arthur.*(Enhanced|Premium)/i,
    /^Arthur$/i,
    /Alex.*(Enhanced|Premium)/i,
    /^Alex$/i,
    /Microsoft.*(Guy|Andrew|Ryan|Brian|Christopher|Eric)/i,
    /English.*Male/i
  ];
  for(const pattern of preferences){
    const match=voices.find(v=>pattern.test(v.name));
    if(match) return match;
  }
  return voices.find(v=>/^en-GB/i.test(v.lang)) ||
         voices.find(v=>/^en-US/i.test(v.lang)) ||
         voices[0] || null;
}

function populateNarratorVoices(){
  const select=$('#voiceSelect');
  if(!select || !('speechSynthesis' in window)) return;

  const voices=englishVoices();
  const preferred=preferredNarrator(voices);
  const ordered = preferred ? [preferred,...voices.filter(v=>v.name!==preferred.name)] : voices;
  select.innerHTML=ordered.map((v,i)=>`<option value="${v.name}">${i===0 && preferred ? 'Recommended · ' : ''}${v.name} · ${v.lang}</option>`).join('');
  if(preferred) select.value=preferred.name;

  select.onchange=()=>{
    localStorage.setItem('cloudrescue-narrator',select.value);
  };
}

function getEnglishVoice(){
  const voices=englishVoices();
  const selected=$('#voiceSelect')?.value;
  return voices.find(v=>v.name===selected) || preferredNarrator(voices);
}

function storyPresentation(c,args){
  const provider=providerName(args.outageProvider);
  const affected=c.market.affectedCount;
  const demand=num(c.market.totalDemand);
  const available=num(c.market.allocated);
  const gap=num(Math.max(0,c.market.totalDemand-c.market.allocated));
  const stranded=num(c.individual.strandedReserve);
  const reserve=num(c.scfr.totalReserve);
  const restored=Math.round(c.scfr.criticalRestoredPct);

  const dynamic=[
    {
      ...scenes[0],
      stat: storyFromLab ? `Replay: ${provider} outage · ${args.marketPct}% market · ${args.reservePct}% reserve` : scenes[0].stat,
      caption: storyFromLab ? `This replay uses your Stress Lab assumptions.` : scenes[0].caption,
      voice: storyFromLab
        ? `This replay uses the scenario you just designed in the Stress Lab. The outage is at ${provider}, with ${args.marketPct} percent emergency market capacity and ${args.reservePct} percent pre-reserved capacity.`
        : scenes[0].voice
    },
    {
      ...scenes[1],
      title:`${provider} fails`,
      text:`A severe outage at ${provider} simultaneously affects every synthetic bank whose critical workload depends on it.`,
      stat:`${affected} banks affected at the same time`,
      caption:`${provider} fails. ${affected} banks are disrupted at once.`,
      voice:`Now, ${provider} goes down. ${affected} banks lose critical capacity at the same time. This is no longer one bank’s IT problem. It is a system-wide recovery problem.`
    },
    {
      ...scenes[2],
      stat:`${demand} units demanded · ${available} immediately available`,
      caption:`${demand} units demanded. Only ${available} are immediately available.`,
      voice:`All ${affected} affected banks reach for backup capacity at once. They need ${demand} units. The emergency market can supply only ${available}. That leaves a gap of ${gap} units.`
    },
    {
      ...scenes[3],
      stat:`${stranded} units stranded · same reserve budget`,
      caption:`Reserve exists — but ${stranded} units are stranded by ring-fencing.`,
      voice:`Individual reserves help, but there is a catch. Capacity is ring-fenced, bank by bank. It cannot simply move to where the shock is. In this run, ${stranded} reserve units remain stranded while affected banks are still short.`
    },
    {
      ...scenes[4],
      stat:`Same ${reserve}-unit reserve budget · pooled allocation`,
      caption:`SCFR redirects the same ${reserve}-unit reserve budget to where it is needed.`,
      voice:`SCFR changes the coordination rule, not the budget. The same ${reserve} reserve units are pooled in advance, then directed to the affected banks that need them most. Critical workload restoration rises to ${restored} percent in this synthetic run.`
    },
    {
      ...scenes[5],
      caption:'Same shock. Same reserve budget. Different coordination.',
      voice:`The comparison is the point. Same shock. Same reserve budget. Different coordination. This is not a forecast, but a transparent way to test the mechanism. Now change the assumptions and replay it again.`
    }
  ];
  return dynamic[scene];
}

function speakScene(runId=demoRunId){
  const c=compareStrategies(storyArgs);
  const current=storyPresentation(c,storyArgs);

  if(!narrationEnabled || !('speechSynthesis' in window)){
    return new Promise(resolve=>{
      const id=setTimeout(()=>resolve({spoken:false}),current.visualDuration || 5600);
      sceneTimers.push(id);
    });
  }

  return new Promise(resolve=>{
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(current.voice);
    const voice = getEnglishVoice();
    if(voice) utterance.voice = voice;
    utterance.lang = voice?.lang || 'en-GB';
    utterance.rate = current.rate || .92;
    utterance.pitch = current.pitch || .98;
    utterance.volume = .96;

    let settled=false;
    const finish=(reason)=>{
      if(settled) return;
      settled=true;
      resolve({spoken:true,reason,runId});
    };

    utterance.onend=()=>finish('end');
    utterance.onerror=()=>finish('error');

    // Chrome can occasionally drop a speech event. This is only a safety net,
    // not the primary scene timer.
    const words=current.voice.trim().split(/\s+/).length;
    const safetyMs=Math.max(8500,words/(utterance.rate*2.2)*1000+3500);
    const safety=setTimeout(()=>finish('safety'),safetyMs);
    sceneTimers.push(safety);

    window.speechSynthesis.speak(utterance);
  });
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

function outcomeState(row){
  if(row.restoredFraction >= .8) return 'recovered';
  if(row.restoredFraction >= .4) return 'partial';
  return 'critical';
}

function outcomeBanks(rows, compact=false){
  return `<div class="outcome-banks ${compact?'compact':''}">
    ${rows.map((r,i)=>`<div class="outcome-bank ${outcomeState(r)}" style="--restore:${Math.round(r.restoredFraction*100)}%" title="${r.label}: ${Math.round(r.restoredFraction*100)}% restored">
      <span class="outcome-fill"></span><b>${i+1}</b>
    </div>`).join('')}
  </div>`;
}

function reserveTokens(total=10, stranded=0, pooled=false){
  const strandedCount = total ? Math.round(total*stranded) : 0;
  return `<div class="reserve-token-row ${pooled?'pooled':''}">
    ${Array.from({length:total},(_,i)=>`<span class="reserve-token ${!pooled && i<strandedCount?'locked':'active'}">${!pooled && i<strandedCount?'×':'●'}</span>`).join('')}
  </div>`;
}

function renderVisualSignal(c){
  const el = $('#visualSignal');
  if(!el) return;
  const market = c.market;
  const individual = c.individual;
  const scfr = c.scfr;

  if(scene === 0){
    el.innerHTML = `
      <div class="concentration-map">
        ${providers.map(p=>{
          const count=banks.filter(b=>b.provider===p.id).length;
          return `<div class="concentration-provider" data-provider="${p.id}">
            <span class="mini-cloud">${cloudGlyph}</span>
            <b>${p.name}</b>
            <div class="bank-dots">${Array.from({length:count},()=>'<i></i>').join('')}</div>
            <small>${count} banks</small>
          </div>`;
        }).join('')}
      </div>`;
  } else if(scene === 1){
    el.innerHTML = `
      <div class="outage-story">
        <div class="outage-cloud"><span>${cloudGlyph}</span><b>${providerName(storyArgs.outageProvider)}</b><small>OUTAGE</small></div>
        <div class="outage-wave">→</div>
        <div class="affected-visual">
          ${Array.from({length:market.affectedCount},(_,i)=>`<span class="affected-bank-icon">${bankGlyph}<b>${i+1}</b></span>`).join('')}
          <small>all affected at the same time</small>
        </div>
      </div>`;
  } else if(scene === 2){
    const ratio=Math.max(0,Math.min(1,market.allocated/market.totalDemand));
    const served=Math.max(0,Math.min(10,Math.round(ratio*10)));
    el.innerHTML = `
      <div class="capacity-story">
        <div class="request-side">
          <span>SIMULTANEOUS REQUESTS</span>
          <div class="request-banks">${Array.from({length:market.affectedCount},()=>`<i>${bankGlyph}</i>`).join('')}</div>
        </div>
        <div class="capacity-arrow">→</div>
        <div class="capacity-reservoir">
          <span>EMERGENCY MARKET</span>
          <div class="capacity-blocks">
            ${Array.from({length:10},(_,i)=>`<i class="${i<served?'served':'missing'}"></i>`).join('')}
          </div>
          <div class="capacity-caption"><b>${served}/10</b><small>illustrative capacity blocks available</small></div>
        </div>
        <div class="queue-label"><b>${num(Math.max(0,market.totalDemand-market.allocated))}</b><span>units still waiting</span></div>
      </div>`;
  } else if(scene === 3){
    const strandedShare=individual.totalReserve ? individual.strandedReserve/individual.totalReserve : 0;
    el.innerHTML = `
      <div class="reserve-mechanism">
        <div class="reserve-source">
          <span>SAME TOTAL RESERVE BUDGET</span>
          ${reserveTokens(10,strandedShare,false)}
          <small>Each block represents a share of the same reserve budget.</small>
        </div>
        <div class="reserve-mechanism-arrow">→</div>
        <div class="reserve-outcome">
          <span>RING-FENCED</span>
          ${outcomeBanks(individual.rows,true)}
          <small><b>${num(individual.strandedReserve)}</b> units remain stranded outside the affected banks.</small>
        </div>
      </div>`;
  } else if(scene === 4){
    el.innerHTML = `
      <div class="reserve-mechanism pooled-story">
        <div class="same-budget-badge">NO EXTRA RESERVE ADDED</div>
        <div class="reserve-source">
          <span>SAME TOTAL RESERVE BUDGET</span>
          ${reserveTokens(10,0,true)}
          <small>No extra reserve is added.</small>
        </div>
        <div class="pool-node"><span>SCFR</span><b>POOL</b><small>pre-arranged allocation</small></div>
        <div class="reserve-outcome">
          <span>REDIRECTED TO AFFECTED BANKS</span>
          ${outcomeBanks(scfr.rows,true)}
          <small><b>${Math.round(scfr.criticalRestoredPct)}%</b> of critical workload restored in this synthetic run.</small>
        </div>
      </div>`;
  } else {
    el.innerHTML = '';
  }
}

const cloudGlyph = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.4 18.2h9.4a4 4 0 0 0 .5-8A5.6 5.6 0 0 0 6.6 8.9a4.7 4.7 0 0 0 .8 9.3Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const bankGlyph = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 9.1 12 4l8.5 5.1M5.5 10.5v6.8m4-6.8v6.8m5-6.8v6.8m4-6.8v6.8M3.5 19.2h17" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function providerName(id){ return providers.find(p=>p.id===id)?.name || id; }

function renderNetwork(){
  $('#providers').innerHTML = providers.map(p => {
    const connected = banks.filter(b=>b.provider===p.id).length;
    return `<div class="provider" data-provider="${p.id}" style="--provider:${p.color}">
      <div class="provider-title"><span class="provider-glyph" aria-hidden="true">${cloudGlyph}</span><div><small>SYNTHETIC PROVIDER</small><strong>${p.name}</strong><small>${connected} connected banks</small></div></div>
    </div>`;
  }).join('');

  $('#bankGroups').innerHTML = providers.map(p => {
    const group = banks.filter(b=>b.provider===p.id);
    return `<section class="bank-group" data-provider="${p.id}">
      <h4>${p.name} clients</h4>
      <div class="bank-grid">
      ${group.map((b,i)=>`<div class="bank" data-bank="${b.id}" data-provider="${b.provider}" style="--bank-order:${i}" title="${b.type} · load ${b.criticalLoad} · readiness ${Math.round(b.readiness*100)}%">
        <div class="bank-title"><span class="bank-glyph" aria-hidden="true">${bankGlyph}</span><div><b>${b.label}</b><small>${b.type}</small></div></div>
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

function clearSceneMotion(){
  sceneTimers.forEach(clearTimeout);
  sceneTimers=[];
  const layer=$('#motionLayer');
  if(layer) layer.innerHTML='';
  $('#ringFence')?.classList.remove('active','hit');
}

function later(fn,delay){
  const id=setTimeout(fn,delay);
  sceneTimers.push(id);
  return id;
}

function motionPoint(el,x=.5,y=.5){
  return el ? localPoint(el,x,y) : null;
}

function makeMotionToken(start,{kind='capacity',label='',size=10}={}){
  const layer=$('#motionLayer');
  if(!layer || !start) return null;
  const token=document.createElement('span');
  token.className=`motion-token ${kind}`;
  token.style.left=`${start.x}px`;
  token.style.top=`${start.y}px`;
  token.style.width=`${size}px`;
  token.style.height=`${size}px`;
  if(label) token.textContent=label;
  layer.appendChild(token);
  return token;
}

function animateToken(start,end,{kind='capacity',delay=0,duration=950,label='',size=10,onArrive}={}){
  later(()=>{
    const token=makeMotionToken(start,{kind,label,size});
    if(!token || !end) return;
    const dx=end.x-start.x;
    const dy=end.y-start.y;
    const anim=token.animate([
      {transform:'translate(0,0) scale(.65)',opacity:0},
      {transform:`translate(${dx*.12}px,${dy*.12}px) scale(1)`,opacity:1,offset:.16},
      {transform:`translate(${dx}px,${dy}px) scale(.9)`,opacity:1}
    ],{duration,easing:'cubic-bezier(.22,.8,.25,1)',fill:'forwards'});
    anim.onfinish=()=>{
      onArrive?.();
      token.remove();
    };
  },delay);
}

function animateBlockedToken(source,target,barrierX,{delay=0,duration=1700}={}){
  later(()=>{
    const start=motionPoint(source);
    const end=motionPoint(target);
    if(!start || !end) return;
    const token=makeMotionToken(start,{kind:'locked',label:'●',size:14});
    if(!token) return;
    const bx=barrierX-start.x;
    const by=(end.y-start.y)*.72;
    const anim=token.animate([
      {transform:'translate(0,0) scale(.75)',opacity:.2},
      {transform:`translate(${bx+7}px,${by}px) scale(1)`,opacity:1,offset:.48},
      {transform:`translate(${bx+2}px,${by}px) scale(1.18)`,opacity:1,offset:.58},
      {transform:`translate(${bx+14}px,${by}px) scale(.9)`,opacity:.75,offset:.68},
      {transform:'translate(0,0) scale(.7)',opacity:.15}
    ],{duration,easing:'cubic-bezier(.2,.75,.25,1)',fill:'forwards'});
    later(()=>{
      $('#ringFence')?.classList.add('hit');
      const impact=makeMotionToken({x:start.x+bx+4,y:start.y+by},{kind:'blocked-impact',label:'×',size:22});
      later(()=>impact?.remove(),520);
      later(()=>$('#ringFence')?.classList.remove('hit'),260);
    },delay+duration*.5);
    anim.onfinish=()=>token.remove();
  },delay);
}

function setBankOutcome(el,row){
  if(!el || !row) return;
  el.classList.remove('affected','restored','waiting');
  if(row.restoredFraction >= .8) el.classList.add('restored');
  else el.classList.add('waiting');
}

function positionRingFence(){
  const affected=document.querySelector(`.bank-group[data-provider="${storyArgs.outageProvider}"]`);
  const otherProvider=providers.find(p=>p.id!==storyArgs.outageProvider)?.id;
  const other=document.querySelector(`.bank-group[data-provider="${otherProvider}"]`);
  const fence=$('#ringFence');
  if(!affected || !other || !fence) return null;

  const ar=affected.getBoundingClientRect();
  const or=other.getBoundingClientRect();
  const affectedLeft=ar.left < or.left;
  const a=motionPoint(affected,affectedLeft?1:0,.5);
  const b=motionPoint(other,affectedLeft?0:1,.5);
  const x=(a.x+b.x)/2;

  fence.style.left=`${x}px`;
  const top=Math.min(motionPoint(affected,.5,0).y,motionPoint(other,.5,0).y);
  const bottom=Math.max(motionPoint(affected,.5,1).y,motionPoint(other,.5,1).y);
  fence.style.top=`${top}px`;
  fence.style.height=`${Math.max(180,bottom-top)}px`;
  return x;
}

function runSceneMotion(c){
  clearSceneMotion();

  if(scene===2){
    const reservoir=document.querySelector('.capacity-reservoir');
    if(!reservoir) return;
    const target=motionPoint(reservoir,.5,.52);
    c.market.rows.forEach((row,i)=>{
      const bank=document.querySelector(`.bank[data-bank="${row.id}"]`);
      const start=motionPoint(bank,.92,.5);
      animateToken(start,target,{kind:'request',delay:350+i*110,duration:820,size:11});
    });

    const supplied=c.market.rows.filter(r=>r.allocation>1);
    supplied.forEach((row,i)=>{
      const bank=document.querySelector(`.bank[data-bank="${row.id}"]`);
      const end=motionPoint(bank,.84,.5);
      animateToken(target,end,{
        kind:'capacity',
        delay:1650+i*260,
        duration:900,
        size:14,
        onArrive:()=>bank?.classList.add('market-help')
      });
    });
    later(()=>document.querySelector('.queue-label')?.classList.add('pulse'),1550);
  }

  if(scene===3){
    const fenceX=positionRingFence();
    $('#ringFence')?.classList.add('active');
    if(fenceX==null) return;
    const sources=banks.filter(b=>b.provider!==storyArgs.outageProvider).slice(0,7);
    const targets=c.individual.rows;
    sources.forEach((bank,i)=>{
      const source=document.querySelector(`.bank[data-bank="${bank.id}"]`);
      const target=document.querySelector(`.bank[data-bank="${targets[i%targets.length].id}"]`);
      animateBlockedToken(source,target,fenceX,{delay:500+i*170,duration:1750});
    });
  }

  if(scene===4){
    const pool=document.querySelector('.pool-node');
    if(!pool) return;
    const poolPoint=motionPoint(pool,.5,.5);
    const sourceBanks=banks.filter((_,i)=>i%2===0).slice(0,10);

    sourceBanks.forEach((bank,i)=>{
      const source=document.querySelector(`.bank[data-bank="${bank.id}"]`);
      animateToken(motionPoint(source,.5,.9),poolPoint,{
        kind:'pooled',
        delay:260+i*90,
        duration:900,
        size:12
      });
    });

    c.scfr.rows.forEach((row,i)=>{
      const bank=document.querySelector(`.bank[data-bank="${row.id}"]`);
      const end=motionPoint(bank,.5,.72);
      animateToken(poolPoint,end,{
        kind:'capacity',
        delay:1650+i*190,
        duration:820,
        size:15,
        onArrive:()=>setBankOutcome(bank,row)
      });
    });
  }
}

function triggerCamera(){
  const stage=$('#stage');
  if(!stage) return;
  stage.classList.remove('scene-enter');
  void stage.offsetWidth;
  stage.classList.add('scene-enter');
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
    const affected = compareStrategies(storyArgs).scfr.rows;
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

function comparisonHTML(args=storyArgs){
  const c = compareStrategies(args);
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
      <div class="compare-bar"><i style="width:${Math.min(100,r.resilience)}%"></i></div>
      <p>Systemic Resilience Score</p>
      <div class="compare-outcome-label">${r.affectedCount} affected banks</div>
      ${outcomeBanks(r.rows,true)}
      <div class="mini"><span>Banks recovered</span><b>${r.banksRecovered}/${r.affectedCount}</b></div>
      <div class="mini"><span>Critical workload restored</span><b>${pct(r.criticalRestoredPct)}</b></div>
      <div class="mini"><span>Unmet capacity</span><b>${pct(r.unmetPct)}</b></div>
      <div class="mini"><span>Stranded reserve</span><b>${num(r.strandedReserve)}</b></div>
      <p>${desc}</p>
    </article>`).join('');
}

function renderImpact(c){
  const availableShare=c.market.totalDemand ? Math.round(c.market.allocated/c.market.totalDemand*100) : 0;
  const strandedShare=c.individual.totalReserve ? Math.round(c.individual.strandedReserve/c.individual.totalReserve*100) : 0;
  const data = [
    ['REAL-WORLD RISK','Shared dependency','Many institutions can depend on the same critical provider.'],
    ['COMMON SHOCK',`${c.market.affectedCount} banks. One outage.`,'A single provider failure hits multiple institutions at once.'],
    ['CAPACITY SHORTAGE',`Only ${availableShare}% available`,'Most immediate backup demand cannot be met after the shock.'],
    ['FRAGMENTATION',`${strandedShare}% of reserve stranded`,'Capacity exists — but ring-fencing keeps it in the wrong places.'],
    ['COORDINATED RECOVERY','Same reserve. Better allocation.','SCFR changes where capacity can go, not how much reserve exists.'],
    ['RESULT','Coordination changes the outcome','The same shock produces very different recovery paths.']
  ][scene];
  $('#impactKicker').textContent=data[0];
  $('#impactValue').textContent=data[1];
  $('#impactLabel').textContent=data[2];
}

function clearStatuses(){
  $$('.provider').forEach(el=>el.classList.remove('offline'));
  $$('.bank').forEach(el=>el.classList.remove('affected','restored','waiting','stranded'));
}

function applyScene(){
  const c = compareStrategies(storyArgs);
  const s = storyPresentation(c,storyArgs);
  $('#sceneNo').textContent = scene+1;
  $('#sceneTitle').textContent = s.title;
  $('#sceneText').textContent = s.text;
  $('#sceneStat').textContent = s.stat;
  $('#captionKicker').textContent = s.kicker;
  $('#captionText').textContent = s.caption;
  $('#stage').className = `stage scene-${scene+1}`;
  $('#stage').dataset.outage = storyArgs.outageProvider;

  clearStatuses();
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
  $('#flowMarket').textContent = num(c.market.allocated);
  $('#flowReserve').textContent = num(c.scfr.totalReserve);
  renderVisualSignal(c);
  renderImpact(c);

  if(scene >= 1){
    document.querySelector(`.provider[data-provider="${storyArgs.outageProvider}"]`)?.classList.add('offline');
    affected.forEach(b=>document.querySelector(`.bank[data-bank="${b.id}"]`)?.classList.add('affected'));
  }

  if(scene === 3){
    banks.filter(b=>b.provider !== storyArgs.outageProvider).forEach(b=>{
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
    // Start in the disrupted state; capacity tokens visibly restore banks one by one.
    c.scfr.rows.forEach(b=>{
      const el = document.querySelector(`.bank[data-bank="${b.id}"]`);
      if(!el) return;
      el.classList.remove('restored','waiting');
      el.classList.add('affected');
    });
  }

  $('#compareOverlay').innerHTML = scene === 5 ? comparisonHTML(storyArgs) : '';
  requestAnimationFrame(()=>{
    drawNetworkLines();
    runSceneMotion(c);
    triggerCamera();
  });

  $('#backScene').disabled = scene===0;
  $('#nextScene').textContent = scene===scenes.length-1 ? 'Open Stress Lab →' : 'Next →';
  $$('#sceneDots button').forEach((d,i)=>d.classList.toggle('active',i===scene));
  updateDemoProgress();
}

function updateDemoProgress(){
  const bar = $('#demoProgressBar');
  if(bar) bar.style.width = `${((scene+1)/scenes.length)*100}%`;
}

function stopAuto(){
  demoRunId++;
  if(autoplay && typeof autoplay==='number') clearTimeout(autoplay);
  autoplay=null;
  document.body.classList.remove('demo-playing');
  clearSceneMotion();
  if('speechSynthesis' in window) window.speechSynthesis.cancel();
  $('#autoScene').textContent='▶ Watch demo';
}

async function playDemoScene(runId){
  if(runId!==demoRunId) return;

  applyScene();
  updateDemoProgress();
  playCue(scenes[scene].cue);

  await speakScene(runId);
  if(runId!==demoRunId) return;

  // Let the last visual beat land after the narrator finishes.
  const hold = scene===4 ? 1050 : scene===5 ? 1200 : 700;

  autoplay=setTimeout(()=>{
    if(runId!==demoRunId) return;
    if(scene<scenes.length-1){
      scene++;
      playDemoScene(runId);
    }else{
      stopAuto();
    }
  },hold);
}

function startDemo({reset=true}={}){
  stopAuto();
  if(reset) scene=0;

  const runId=demoRunId;
  autoplay=-1;
  document.body.classList.add('demo-playing');
  $('#autoScene').textContent='■ Stop demo';
  playDemoScene(runId);
}


function setFocusMode(on){
  document.body.classList.toggle('story-focus', on);
  const btn = $('#focusStory');
  if(btn) btn.textContent = on ? '✕ Exit focus' : '⛶ Focus view';
  requestAnimationFrame(drawNetworkLines);
}

function setupStory(){
  if(!('speechSynthesis' in window)){
    narrationEnabled=false;
    const narrationBtn=$('#narrationToggle');
    narrationBtn.disabled=true;
    narrationBtn.textContent='CC Captions only';
  }
  const stepLabels=['Risk','Outage','Shortage','Fragmentation','SCFR','Result'];
  $('#sceneDots').innerHTML = scenes.map((_,i)=>`<button data-scene="${i}" aria-label="Scene ${i+1}: ${stepLabels[i]}"><span>${i+1}</span><b>${stepLabels[i]}</b></button>`).join('');
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
$$('.tab').forEach(t=>t.addEventListener('click',()=>switchTab(t.dataset.tab)));
$('#heroDemo').addEventListener('click',()=>{
  storyArgs={...defaults};
  storyFromLab=false;
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


const CHALLENGES = {
  efficiency:{
    title:'Reach ≥80 resilience with ≤30% reserve.',
    hint:'Can coordination deliver strong recovery without a large reserve budget?'
  },
  scarcity:{
    title:'Survive severe scarcity with ≥80 resilience.',
    hint:'Keep emergency market capacity at 10% or less and reserve at 35% or less.'
  },
  coordination:{
    title:'Create a clear coordination advantage.',
    hint:'Target ≥45 resilience points of uplift and ≥250 units of stranded-capacity reduction.'
  }
};

function hashString(value=''){
  let h=2166136261;
  for(let i=0;i<value.length;i++){
    h^=value.charCodeAt(i);
    h=Math.imul(h,16777619);
  }
  return h>>>0;
}

function seededRandom(seed){
  let a=hashString(seed) || 1;
  return ()=>{
    a+=0x6D2B79F5;
    let t=a;
    t=Math.imul(t^t>>>15,t|1);
    t^=t+Math.imul(t^t>>>7,t|61);
    return ((t^t>>>14)>>>0)/4294967296;
  };
}

function scenarioFromSeed(seed){
  const rng=seededRandom(seed);
  const providerIds=providers.map(p=>p.id);
  const markets=[0,5,10,15,20,25,30,35,40];
  const reserves=[10,15,20,25,30,35,40];
  const rules=['systemic','equal','readiness'];
  return {
    outageProvider:providerIds[Math.floor(rng()*providerIds.length)],
    marketPct:markets[Math.floor(rng()*markets.length)],
    reservePct:reserves[Math.floor(rng()*reserves.length)],
    allocationRule:rules[Math.floor(rng()*rules.length)]
  };
}

function scenarioIdFromArgs(args){
  const raw=[args.outageProvider,args.marketPct,args.reservePct,args.allocationRule].join('|');
  return 'CR-'+hashString(raw).toString(36).toUpperCase().padStart(6,'0').slice(-6);
}

function applyArgsToControls(args){
  $('#providerSelect').value=args.outageProvider;
  $('#marketPct').value=args.marketPct;
  $('#reservePct').value=args.reservePct;
  $('#ruleSelect').value=args.allocationRule;
  $('.preset').forEach(b=>b.classList.remove('active'));
}

function generateScenario(){
  let seed=$('#seedInput').value.trim();
  if(!seed){
    seed=(Date.now().toString(36)+Math.floor(performance.now()).toString(36)).slice(-10).toUpperCase();
    $('#seedInput').value=seed;
  }
  activeSeed=seed;
  applyArgsToControls(scenarioFromSeed(seed));
  renderLab();
}

function scenarioShareURL(args){
  const url=new URL(window.location.href);
  url.search='';
  url.hash='';
  url.searchParams.set('p',args.outageProvider);
  url.searchParams.set('m',String(args.marketPct));
  url.searchParams.set('r',String(args.reservePct));
  url.searchParams.set('a',args.allocationRule);
  if(activeSeed) url.searchParams.set('seed',activeSeed);
  url.searchParams.set('view','lab');
  return url.toString();
}

async function shareScenario(){
  const url=scenarioShareURL(currentArgs());
  const btn=$('#shareScenarioBtn');
  try{
    await navigator.clipboard.writeText(url);
    btn.textContent='✓ Scenario link copied';
  }catch(e){
    const area=document.createElement('textarea');
    area.value=url;
    area.setAttribute('readonly','');
    area.style.position='fixed';
    area.style.opacity='0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
    btn.textContent='✓ Scenario link copied';
  }
  setTimeout(()=>{btn.textContent='⧉ Copy scenario link'},1500);
}

function loadScenarioFromURL(){
  const q=new URLSearchParams(window.location.search);
  const provider=q.get('p');
  const market=Number(q.get('m'));
  const reserve=Number(q.get('r'));
  const rule=q.get('a');
  const validProvider=providers.some(p=>p.id===provider);
  const validRule=['systemic','equal','readiness'].includes(rule);
  if(!validProvider || !Number.isFinite(market) || !Number.isFinite(reserve) || !validRule) return false;

  const args={
    outageProvider:provider,
    marketPct:Math.max(0,Math.min(50,Math.round(market/5)*5)),
    reservePct:Math.max(0,Math.min(60,Math.round(reserve/5)*5)),
    allocationRule:rule
  };
  activeSeed=(q.get('seed')||'').slice(0,24);
  $('#seedInput').value=activeSeed;
  applyArgsToControls(args);
  return q.get('view')==='lab';
}

function updateScenarioIdentity(args){
  $('#scenarioId').textContent=scenarioIdFromArgs(args);
}

function challengeEvaluation(c,args){
  const uplift=c.scfr.resilience-c.individual.resilience;
  const strandedReduction=c.individual.strandedReserve-c.scfr.strandedReserve;

  if(activeChallenge==='scarcity'){
    return {
      success:args.marketPct<=10 && args.reservePct<=35 && c.scfr.resilience>=80,
      metrics:[
        ['Market scarcity',args.marketPct+'%','≤10%',args.marketPct<=10],
        ['Reserve budget',args.reservePct+'%','≤35%',args.reservePct<=35],
        ['SCFR resilience',Math.round(c.scfr.resilience),'≥80',c.scfr.resilience>=80]
      ]
    };
  }

  if(activeChallenge==='coordination'){
    return {
      success:uplift>=45 && strandedReduction>=250 && args.reservePct<=35,
      metrics:[
        ['Resilience uplift','+'+uplift.toFixed(1),'≥45',uplift>=45],
        ['Capacity unstranded',num(Math.max(0,strandedReduction)),'≥250',strandedReduction>=250],
        ['Reserve budget',args.reservePct+'%','≤35%',args.reservePct<=35]
      ]
    };
  }

  return {
    success:c.scfr.resilience>=80 && args.reservePct<=30,
    metrics:[
      ['SCFR resilience',Math.round(c.scfr.resilience),'≥80',c.scfr.resilience>=80],
      ['Reserve budget',args.reservePct+'%','≤30%',args.reservePct<=30]
    ]
  };
}

function renderChallenge(c,args){
  const def=CHALLENGES[activeChallenge];
  const result=challengeEvaluation(c,args);
  $('#challenge').classList.toggle('success',result.success);
  $('#challengeTitle').textContent=def.title;
  $('#challengeText').textContent=result.success ? 'Mission complete. Try another challenge or share this scenario.' : def.hint;
  $('#challengeMetrics').innerHTML=result.metrics.map(([label,value,target,ok])=>`
    <div class="${ok?'ok':''}">
      <span>${label}</span>
      <b>${value}</b>
      <small>${target}</small>
    </div>`).join('');
}

function currentArgs(){
  return {
    outageProvider:$('#providerSelect').value,
    marketPct:Number($('#marketPct').value),
    reservePct:Number($('#reservePct').value),
    allocationRule:$('#ruleSelect').value
  };
}

function mechanismPanel(title,label,r,{scfr=false}={}){
  const strandedShare=r.totalReserve ? r.strandedReserve/r.totalReserve : 0;
  return `
    <article class="mechanism-panel ${scfr?'after':''}">
      <div class="mechanism-panel-head">
        <div><span>${label}</span><h3>${title}</h3></div>
        <div class="mechanism-score"><b>${Math.round(r.resilience)}</b><small>/100 resilience</small></div>
      </div>

      <div class="mechanism-visual">
        <div class="mechanism-reserve">
          <span>SAME RESERVE BUDGET</span>
          ${reserveTokens(10,scfr?0:strandedShare,scfr)}
        </div>

        <div class="mechanism-flow ${scfr?'flow-open':'flow-blocked'}">
          <span class="flow-line"></span>
          <b>${scfr?'POOLED':'RING-FENCED'}</b>
          <small>${scfr?'capacity can move to affected banks':'capacity stays bank-specific'}</small>
        </div>

        <div class="mechanism-banks">
          <span>AFFECTED BANKS</span>
          ${outcomeBanks(r.rows)}
        </div>
      </div>

      <div class="mechanism-foot">
        <div><span>Critical workload restored</span><b>${pct(r.criticalRestoredPct)}</b></div>
        <div><span>Reserve stranded</span><b>${num(r.strandedReserve)}</b></div>
      </div>
    </article>`;
}

function renderBeforeAfter(c,args){
  const uplift=c.scfr.resilience-c.individual.resilience;
  $('#beforeAfter').innerHTML=`
    <div class="before-after-head">
      <div>
        <div class="eyebrow">BEFORE / AFTER · SAME SHOCK · SAME RESERVE</div>
        <h2>What changes when reserve becomes movable?</h2>
      </div>
      <div class="same-budget-proof">
        <span>Total pre-reserved capacity</span>
        <b>${num(c.scfr.totalReserve)} units</b>
        <small>identical in both panels</small>
      </div>
    </div>

    <div class="before-after-grid">
      ${mechanismPanel('Individual reserves','BEFORE',c.individual)}
      <div class="mechanism-delta">
        <span>ONLY THE ALLOCATION RULE CHANGES</span>
        <b>+${uplift.toFixed(1)}</b>
        <small>resilience points</small>
        <i>→</i>
      </div>
      ${mechanismPanel('SCFR pooled reserve','AFTER',c.scfr,{scfr:true})}
    </div>

    <div class="before-after-note">
      <b>No extra reserve is added.</b>
      <span>The experiment isolates coordination: ring-fenced capacity versus a pre-arranged pooled allocation rule.</span>
    </div>`;
}

function renderSensitivity(args){
  const reserveValues=[0,10,20,30,40,50,60];
  const marketValues=[50,40,30,20,10,0];

  const rows=marketValues.map(marketPct=>{
    const cells=reserveValues.map(reservePct=>{
      const c=compareStrategies({...args,marketPct,reservePct});
      const value=sensitivityMode==='uplift'
        ? c.scfr.resilience-c.individual.resilience
        : c.scfr.resilience;
      const max=sensitivityMode==='uplift'?55:100;
      const intensity=Math.max(.08,Math.min(.92,value/max));
      const display=sensitivityMode==='uplift'?`+${value.toFixed(0)}`:`${Math.round(value)}`;
      const current=marketPct===args.marketPct && reservePct===args.reservePct;
      return `<div class="heat-cell ${current?'current':''}" style="--heat:${intensity.toFixed(2)}" title="Market ${marketPct}%, reserve ${reservePct}%: ${display}">`+
        `<b>${display}</b></div>`;
    }).join('');

    return `<div class="heat-row"><span class="heat-y">${marketPct}%</span>${cells}</div>`;
  }).join('');

  $('#sensitivityHeatmap').innerHTML=`
    <div class="heat-axis-title y">Emergency market capacity</div>
    <div class="heat-grid">
      <div class="heat-x-labels"><span></span>${reserveValues.map(v=>`<b>${v}%</b>`).join('')}</div>
      ${rows}
      <div class="heat-x-title">Pre-reserved capacity</div>
    </div>
    <div class="heat-legend">
      <span>Lower</span><i></i><i></i><i></i><i></i><i></i><span>Higher</span>
      <b>${sensitivityMode==='uplift'?'SCFR uplift vs individual reserves':'SCFR resilience score'}</b>
    </div>`;
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

function replayCurrentScenario(){
  storyArgs={...currentArgs()};
  storyFromLab=true;
  stopAuto();
  switchTab('story');
  setNarration(true);
  setFocusMode(true);
  scene=0;
  startDemo({reset:false});
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
  renderBeforeAfter(c,args);
  renderSensitivity(args);

  updateScenarioIdentity(args);
  renderChallenge(c,args);
}

['providerSelect','marketPct','reservePct','ruleSelect'].forEach(id=>{
  $('#'+id).addEventListener('input',()=>{
    activeSeed='';
    $('#seedInput').value='';
    renderLab();
  });
});
$$('.preset').forEach(btn=>btn.addEventListener('click',()=>applyPreset(btn.dataset.preset)));
$('#runBtn').addEventListener('click',renderLab);
$('#exportBtn').addEventListener('click',exportScenario);
$('#replayScenarioBtn').addEventListener('click',replayCurrentScenario);
$('#generateScenarioBtn').addEventListener('click',generateScenario);
$('#shareScenarioBtn').addEventListener('click',shareScenario);
$('#seedInput').addEventListener('keydown',e=>{if(e.key==='Enter') generateScenario();});
$('.challenge-tab').forEach(btn=>btn.addEventListener('click',()=>{
  activeChallenge=btn.dataset.challenge;
  $('.challenge-tab').forEach(b=>b.classList.toggle('active',b===btn));
  renderLab();
}));
$$('.sensitivity-mode').forEach(btn=>btn.addEventListener('click',()=>{
  sensitivityMode=btn.dataset.mode;
  $$('.sensitivity-mode').forEach(b=>b.classList.toggle('active',b===btn));
  renderSensitivity(currentArgs());
}));

renderNetwork();
setupTheme();
populateNarratorVoices();
if('speechSynthesis' in window){
  window.speechSynthesis.addEventListener?.('voiceschanged',populateNarratorVoices);
  window.speechSynthesis.onvoiceschanged = populateNarratorVoices;
}
setupStory();
const openSharedLab=loadScenarioFromURL();
renderLab();
if(openSharedLab) switchTab('lab');
requestAnimationFrame(drawNetworkLines);
let resizeTimer;
window.addEventListener('resize',()=>{
  clearTimeout(resizeTimer);
  resizeTimer=setTimeout(drawNetworkLines,120);
});

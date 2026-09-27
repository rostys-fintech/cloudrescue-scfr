import { banks, providers } from './data/banks.js';

const clamp = (v,min=0,max=1)=>Math.max(min,Math.min(max,v));
const fmt = v => Math.round(v).toLocaleString('en-US');

const PROVIDER_META = {
  blue:   { x: 352, y: 205, label:'Blue Cloud' },
  orange: { x: 520, y: 190, label:'Orange Cloud' },
  green:  { x: 657, y: 254, label:'Green Cloud' }
};

/* Synthetic node placement on a shared illustrative globe.
   Positions are visual only and do not represent real institutions or provider regions. */
const BANK_POSITIONS = {
  B01:[315,210], B02:[342,232], B03:[377,244], B04:[388,306],
  B05:[421,357], B06:[490,214], B07:[522,234], B08:[542,292],
  B09:[531,335], B10:[566,216], B11:[596,238], B12:[634,248],
  B13:[662,282], B14:[611,308], B15:[690,304],
  B16:[506,254], B17:[566,274], B18:[671,392], B19:[713,397], B20:[613,359]
};

/* A deliberately simplified but geographically recognizable world silhouette.
   The same geometry is rendered in every Resilience Atlas mode. */
const LAND_PATHS = [
  /* North America */
  'M274 176 L291 158 L314 149 L337 151 L353 145 L374 155 L389 170 L408 176 L421 191 L416 206 L424 219 L414 231 L420 245 L409 254 L413 270 L401 281 L395 298 L379 305 L370 321 L356 319 L349 304 L336 295 L332 278 L319 269 L312 252 L299 244 L295 227 L281 216 L272 198 Z',
  /* Central America */
  'M370 304 L382 305 L391 315 L397 326 L393 337 L401 347 L397 356 L389 352 L385 340 L377 334 L374 321 L365 315 Z',
  /* South America */
  'M386 314 L404 309 L423 319 L438 334 L446 353 L443 373 L451 393 L445 416 L437 437 L426 459 L411 480 L397 493 L387 486 L386 466 L378 451 L380 428 L372 411 L373 389 L366 372 L371 354 L365 337 L376 321 Z',
  /* Greenland */
  'M390 110 L411 94 L436 98 L449 112 L443 130 L429 144 L409 141 L394 129 L385 115 Z',
  /* Europe */
  'M468 193 L479 182 L491 180 L500 171 L510 173 L520 166 L531 174 L542 171 L553 181 L562 186 L557 195 L566 201 L556 211 L544 211 L538 219 L522 218 L515 212 L503 216 L496 208 L483 211 L476 203 L466 200 Z',
  /* British Isles */
  'M474 183 L479 171 L485 168 L489 178 L485 189 L478 193 Z',
  /* Africa */
  'M493 222 L514 215 L536 221 L552 234 L562 253 L558 273 L568 291 L561 314 L550 332 L544 355 L533 376 L520 396 L505 405 L495 393 L487 372 L477 352 L476 329 L466 307 L472 283 L466 264 L477 245 Z',
  /* Madagascar */
  'M559 360 L567 367 L566 386 L558 401 L552 392 L554 374 Z',
  /* Asia */
  'M545 190 L568 170 L596 163 L620 167 L644 161 L670 169 L695 176 L718 189 L734 208 L743 226 L739 243 L725 250 L716 263 L700 265 L691 276 L673 276 L662 289 L645 289 L634 301 L619 297 L610 285 L594 282 L586 269 L573 265 L565 251 L552 245 L554 229 L546 217 L554 203 Z',
  /* India */
  'M590 282 L603 277 L616 284 L624 299 L619 316 L610 334 L601 326 L595 309 L588 294 Z',
  /* Southeast Asia */
  'M640 289 L654 291 L666 300 L674 313 L667 321 L655 315 L649 305 L638 302 Z',
  /* Japan */
  'M704 245 L710 238 L714 244 L711 253 L715 261 L709 268 L705 260 L706 252 Z',
  /* Indonesia */
  'M658 329 L672 326 L681 331 L695 330 L706 335 L700 342 L685 341 L676 346 L664 342 Z',
  /* Australia */
  'M650 382 L669 371 L697 369 L718 377 L734 390 L729 407 L713 419 L695 421 L679 414 L661 416 L648 404 Z',
  /* New Zealand */
  'M739 420 L746 426 L744 438 L738 445 L734 438 Z'
];

function providerCount(id){
  return banks.filter(function(b){ return b.provider===id; }).length;
}

function curvePath(ax,ay,bx,by,seed){
  seed=seed||0;
  const mx=(ax+bx)/2;
  const my=(ay+by)/2;
  const dx=bx-ax;
  const dy=by-ay;
  const distance=Math.hypot(dx,dy) || 1;
  const normalX=-dy/distance;
  const normalY=dx/distance;
  const bend=((seed%5)-2)*7;
  const cx=mx+normalX*bend;
  const cy=my+normalY*bend;
  return 'M '+ax+' '+ay+' Q '+cx.toFixed(1)+' '+cy.toFixed(1)+' '+bx+' '+by;
}

function outcomeClass(row){
  if(!row) return 'is-critical';
  if(row.restoredFraction >= .8) return 'is-recovered';
  if(row.restoredFraction >= .4) return 'is-partial';
  return 'is-critical';
}

function sceneLabel(scene,mode){
  if(mode==='evidence') return 'MODEL TOPOLOGY';
  if(mode==='lab') return 'LIVE SCENARIO';
  return [
    'STABLE NETWORK',
    'PROVIDER FAILURE',
    'CAPACITY SHORTAGE',
    'STRANDED RESERVE',
    'POOLED RECOVERY',
    'STABILIZED COMPARISON'
  ][scene] || 'SYSTEM VIEW';
}

function buildSvg(mode){
  const idSuffix=String(mode||'system').replace(/[^a-z0-9_-]/gi,'-');
  const oceanGradientId='raOceanGlow-'+idSuffix;
  const sphereLightId='raSphereLight-'+idSuffix;
  const nightGradientId='raNightShade-'+idSuffix;
  const glossGradientId='raOceanGloss-'+idSuffix;
  const globeClipId='raGlobeClip-'+idSuffix;
  const providerLinks=banks.map(function(bank,index){
    const pos=BANK_POSITIONS[bank.id];
    const p=PROVIDER_META[bank.provider];
    const d=curvePath(p.x,p.y,pos[0],pos[1],index);
    return '<path class="ra-earth-link provider-'+bank.provider+'" data-bank="'+bank.id+'" data-provider="'+bank.provider+'" d="'+d+'"></path>';
  }).join('');

  const dataPackets=banks.map(function(bank,index){
    const pos=BANK_POSITIONS[bank.id];
    const p=PROVIDER_META[bank.provider];
    const d=curvePath(p.x,p.y,pos[0],pos[1],index);
    const dur=(11+(index%5)*1.8).toFixed(2);
    const begin=(-index*.43).toFixed(2);
    return '<circle class="ra-earth-packet provider-'+bank.provider+'" data-bank="'+bank.id+'" data-provider="'+bank.provider+'" data-duration="'+dur+'" data-phase="'+begin+'" r="2.25"></circle>';
  }).join('');

  const bankNodes=banks.map(function(bank){
    const pos=BANK_POSITIONS[bank.id];
    return '<g class="ra-earth-bank" data-bank="'+bank.id+'" data-provider="'+bank.provider+'" transform="translate('+pos[0]+' '+pos[1]+')">'+
      '<circle class="ra-bank-halo" r="11"></circle>'+
      '<circle class="ra-bank-node" r="4.6"></circle>'+
      '<circle class="ra-bank-reserve" r="8"></circle>'+
      '<text class="ra-bank-label" x="9" y="-8">'+bank.id+'</text>'+
    '</g>';
  }).join('');

  const providerNodes=providers.map(function(provider){
    const m=PROVIDER_META[provider.id];
    return '<g class="ra-earth-provider provider-'+provider.id+'" data-provider="'+provider.id+'" transform="translate('+m.x+' '+m.y+')">'+
      '<circle class="ra-provider-halo" r="29"></circle>'+
      '<circle class="ra-provider-core" r="8"></circle>'+
      '<path class="ra-provider-cloud" d="M-18 4 C-22 -5 -15 -13 -7 -12 C-3 -21 12 -20 15 -10 C24 -10 28 -1 22 5 C18 9 13 9 7 9 H-12 C-16 9 -19 7 -18 4Z"></path>'+
      '<text class="ra-provider-label" x="32" y="-4">'+provider.name+'</text>'+
      '<text class="ra-provider-sub" x="32" y="10">'+providerCount(provider.id)+' synthetic banks</text>'+
    '</g>';
  }).join('');

  const requestPaths=banks.map(function(bank,index){
    const pos=BANK_POSITIONS[bank.id];
    const d=curvePath(pos[0],pos[1],500,503,index+19);
    const dur=(5.8+(index%4)*.8).toFixed(2);
    const begin=(-index*.31).toFixed(2);
    return '<path class="ra-request-flow" data-bank="'+bank.id+'" data-provider="'+bank.provider+'" d="'+d+'"></path>'+
      '<circle class="ra-request-packet" data-bank="'+bank.id+'" data-provider="'+bank.provider+'" data-duration="'+dur+'" data-phase="'+begin+'" r="2"></circle>';
  }).join('');

  const recoveryPaths=banks.map(function(bank,index){
    const pos=BANK_POSITIONS[bank.id];
    const d=curvePath(500,503,pos[0],pos[1],index+31);
    const dur=(6.6+(index%4)*.9).toFixed(2);
    const begin=(-index*.36).toFixed(2);
    return '<path class="ra-recovery-flow" data-bank="'+bank.id+'" data-provider="'+bank.provider+'" d="'+d+'"></path>'+
      '<circle class="ra-recovery-packet" data-bank="'+bank.id+'" data-provider="'+bank.provider+'" data-duration="'+dur+'" data-phase="'+begin+'" r="2.1"></circle>';
  }).join('');

  const lands=LAND_PATHS.map(function(d){ return '<path d="'+d+'"></path>'; }).join('');

  const annotations = mode==='evidence' ?
    '<g class="ra-earth-annotations">'+
      '<path d="M250 137 L188 95 L94 95"></path>'+
      '<text x="92" y="86">SHARED PROVIDER</text><text class="sub" x="92" y="101">synthetic infrastructure node</text>'+
      '<path d="M438 306 L380 390 L255 390"></path>'+
      '<text x="118" y="381">BANK NODE</text><text class="sub" x="118" y="396">critical workload dependency</text>'+
      '<path d="M500 503 L617 533 L772 533"></path>'+
      '<text x="776" y="524">POOLED RESERVE</text><text class="sub" x="776" y="539">pre-arranged recovery capacity</text>'+
      '<path d="M585 244 L684 115 L822 115"></path>'+
      '<text x="826" y="106">DEPENDENCY LINK</text><text class="sub" x="826" y="121">shared-provider exposure</text>'+
    '</g>' : '';

  return '<svg class="ra-earth-svg" viewBox="0 0 1000 620" role="img" aria-label="Illustrative global system map of twenty synthetic banks and three shared providers">'+
    '<defs>'+
      '<radialGradient id="'+oceanGradientId+'" cx="39%" cy="31%" r="74%">'+
        '<stop offset="0%" stop-color="var(--ra-earth-ocean-core)"></stop>'+
        '<stop offset="73%" stop-color="var(--ra-earth-ocean)"></stop>'+
        '<stop offset="100%" stop-color="var(--ra-earth-rim)"></stop>'+
      '</radialGradient>'+
      '<radialGradient id="'+sphereLightId+'" cx="31%" cy="24%" r="76%">'+
        '<stop offset="0%" stop-color="#ffffff" stop-opacity=".16"></stop>'+
        '<stop offset="42%" stop-color="#ffffff" stop-opacity=".035"></stop>'+
        '<stop offset="100%" stop-color="#000000" stop-opacity=".14"></stop>'+
      '</radialGradient>'+
      '<linearGradient id="'+nightGradientId+'" x1="0%" y1="0%" x2="100%" y2="0%">'+
        '<stop offset="0%" stop-color="#000000" stop-opacity="0"></stop>'+
        '<stop offset="54%" stop-color="#000000" stop-opacity=".035"></stop>'+
        '<stop offset="78%" stop-color="#000000" stop-opacity=".16"></stop>'+
        '<stop offset="100%" stop-color="#000000" stop-opacity=".42"></stop>'+
      '</linearGradient>'+
      '<radialGradient id="'+glossGradientId+'" cx="34%" cy="24%" r="48%">'+
        '<stop offset="0%" stop-color="#ffffff" stop-opacity=".14"></stop>'+
        '<stop offset="54%" stop-color="#ffffff" stop-opacity=".028"></stop>'+
        '<stop offset="100%" stop-color="#ffffff" stop-opacity="0"></stop>'+
      '</radialGradient>'+
      '<clipPath id="'+globeClipId+'"><circle cx="500" cy="310" r="252"></circle></clipPath>'+
    '</defs>'+
    '<circle class="ra-earth-atmosphere" cx="500" cy="310" r="263"></circle>'+
    '<circle class="ra-earth-ocean" cx="500" cy="310" r="252" fill="url(#'+oceanGradientId+')"></circle>'+
    '<g clip-path="url(#'+globeClipId+')">'+
      '<g class="ra-earth-grid" aria-hidden="true">'+
        '<ellipse cx="500" cy="310" rx="252" ry="82"></ellipse>'+
        '<ellipse cx="500" cy="310" rx="252" ry="156"></ellipse>'+
        '<ellipse cx="500" cy="310" rx="252" ry="218"></ellipse>'+
        '<ellipse cx="500" cy="310" rx="88" ry="252"></ellipse>'+
        '<ellipse cx="500" cy="310" rx="172" ry="252"></ellipse>'+
        '<path d="M248 310H752"></path>'+
      '</g>'+
      '<g class="ra-earth-land">'+lands+'</g>'+
      '<circle class="ra-earth-gloss" cx="500" cy="310" r="252" fill="url(#'+glossGradientId+')"></circle>'+
      '<circle class="ra-earth-night-shade" cx="500" cy="310" r="252" fill="url(#'+nightGradientId+')"></circle>'+
      '<circle class="ra-earth-sphere-light" cx="500" cy="310" r="252" fill="url(#'+sphereLightId+')"></circle>'+
      '<g class="ra-earth-network">'+providerLinks+'</g>'+
      '<g class="ra-earth-packets">'+dataPackets+'</g>'+
      '<g class="ra-earth-requests">'+requestPaths+'</g>'+
      '<g class="ra-earth-recovery">'+recoveryPaths+'</g>'+
      '<g class="ra-earth-bank-layer">'+bankNodes+'</g>'+
      '<g class="ra-market-node" transform="translate(500 503)">'+
        '<circle class="ra-market-ring" r="27"></circle><circle class="ra-market-core" r="7"></circle>'+
        '<text x="0" y="-36">CAPACITY MARKET</text><text class="sub" x="0" y="43">immediate backup</text>'+
      '</g>'+
      '<g class="ra-pool-node" transform="translate(500 503)">'+
        '<circle class="ra-pool-ring" r="29"></circle><circle class="ra-pool-core" r="8"></circle>'+
        '<text x="0" y="-38">SCFR POOL</text><text class="sub" x="0" y="44">shared reserve</text>'+
      '</g>'+
    '</g>'+
    '<g class="ra-earth-provider-layer">'+providerNodes+'</g>'+
    annotations+
    '<g class="ra-earth-scale" transform="translate(760 560)">'+
      '<circle class="normal" cx="0" cy="0" r="4"></circle><text x="10" y="4">normal</text>'+
      '<circle class="affected" cx="76" cy="0" r="4"></circle><text x="86" y="4">affected</text>'+
      '<circle class="recovering" cx="166" cy="0" r="4"></circle><text x="176" y="4">recovery</text>'+
    '</g>'+
  '</svg>';
}

function buildOverlay(mode){
  const label=mode==='evidence' ? 'MODEL MAP' : mode==='lab' ? 'LIVE MODEL' : 'SYSTEM STATE';
  return '<div class="ra-earth-overlay">'+
    '<div class="ra-earth-state"><span>'+label+'</span><b data-earth-state>'+sceneLabel(0,mode)+'</b></div>'+
    '<div class="ra-earth-readout">'+
      '<div><span>AFFECTED</span><b data-earth-affected>0 / '+banks.length+'</b></div>'+
      '<div><span>CAPACITY GAP</span><b data-earth-gap>0</b></div>'+
      '<div><span>RESTORED</span><b data-earth-restored>—</b></div>'+
    '</div>'+
    '<div class="ra-earth-disclaimer">Illustrative topology · synthetic institutions</div>'+
  '</div>';
}

export function createEarthSystem(mount,options){
  options=options||{};
  const mode=options.mode||'simulation';
  if(!mount) throw new Error('Earth System mount is required');

  mount.classList.add('ra-earth-system');
  mount.dataset.earthMode=mode;
  mount.innerHTML = buildSvg(mode) + buildOverlay(mode);

  const svg=mount.querySelector('.ra-earth-svg');
  const stateLabel=mount.querySelector('[data-earth-state]');
  const affectedLabel=mount.querySelector('[data-earth-affected]');
  const gapLabel=mount.querySelector('[data-earth-gap]');
  const restoredLabel=mount.querySelector('[data-earth-restored]');
  let previousSignature='';
  let rafId=0;
  let destroyed=false;
  const reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)') || null;

  function packetTrack(packet){
    if(packet.classList.contains('ra-earth-packet')){
      return svg.querySelector('.ra-earth-link[data-bank="'+packet.dataset.bank+'"]');
    }
    if(packet.classList.contains('ra-request-packet')){
      return svg.querySelector('.ra-request-flow[data-bank="'+packet.dataset.bank+'"]');
    }
    return svg.querySelector('.ra-recovery-flow[data-bank="'+packet.dataset.bank+'"]');
  }

  const packetMotion=[...svg.querySelectorAll('.ra-earth-packet,.ra-request-packet,.ra-recovery-packet')]
    .map(function(packet,index){
      const path=packetTrack(packet);
      if(!path || typeof path.getTotalLength!=='function') return null;
      let length=0;
      try{ length=path.getTotalLength(); }catch(error){ return null; }
      return {
        packet:packet,
        path:path,
        length:length,
        duration:Math.max(.8,Number(packet.dataset.duration)||8),
        phase:Number(packet.dataset.phase)||(-index*.27)
      };
    })
    .filter(Boolean);

  function packetIsActive(node){
    if(node.classList.contains('is-hidden')) return false;
    if(node.classList.contains('ra-request-packet') || node.classList.contains('ra-recovery-packet')){
      return node.classList.contains('is-visible');
    }
    return true;
  }

  function animatePackets(timestamp){
    if(destroyed) return;
    const reduced=!!reduceMotion?.matches;
    const time=timestamp/1000;

    packetMotion.forEach(function(item,index){
      const node=item.packet;
      if(!packetIsActive(node)){
        node.setAttribute('visibility','hidden');
        return;
      }

      node.setAttribute('visibility','visible');
      const speedFactor=reduced ? .42 : 1;
      const phase=(time*speedFactor+item.phase)/item.duration;
      const progress=((phase%1)+1)%1;
      let point;
      try{ point=item.path.getPointAtLength(item.length*progress); }catch(error){ return; }
      node.setAttribute('cx',point.x.toFixed(2));
      node.setAttribute('cy',point.y.toFixed(2));

      /* Essential motion remains visible under Reduce Motion, but fewer
         packets move and the motion is substantially slower. */
      if(reduced && index%2===1) node.setAttribute('visibility','hidden');
    });

    rafId=window.requestAnimationFrame(animatePackets);
  }

  rafId=window.requestAnimationFrame(animatePackets);

  function update(input){
    input=input||{};
    const scene=input.scene||0;
    const outageProvider=input.outageProvider||'blue';
    const outageProviders=Array.isArray(input.outageProviders) && input.outageProviders.length
      ? [...new Set(input.outageProviders)]
      : [outageProvider];
    const failedProviders=new Set(outageProviders);
    const comparison=input.comparison||null;
    const reservePct=input.reservePct==null ? 25 : input.reservePct;
    const marketPct=input.marketPct==null ? 20 : input.marketPct;
    const labStrategy=input.labStrategy||'market';
    const labPhase=input.labPhase||null;
    const phaseScenes={shock:1,demand:2,market:2,individual:3,scfr:4,outcome:5};
    const labScene=labStrategy==='market' ? 2 : labStrategy==='individual' ? 3 : 4;
    const effectiveScene = mode==='evidence' ? 0 : mode==='lab'
      ? (labPhase && phaseScenes[labPhase] ? phaseScenes[labPhase] : labScene)
      : scene;
    const visualStrategy = labPhase==='individual' ? 'individual'
      : labPhase==='scfr' ? 'scfr'
      : labPhase==='market' || labPhase==='demand' ? 'market'
      : labStrategy;
    const signature=[effectiveScene,outageProviders.join(','),visualStrategy,labPhase||'',marketPct,reservePct].join('|');

    if(previousSignature && signature!==previousSignature){
      mount.classList.remove('ra-state-changing');
      void mount.offsetWidth;
      mount.classList.add('ra-state-changing');
      window.setTimeout(function(){ mount.classList.remove('ra-state-changing'); },760);
    }
    previousSignature=signature;

    mount.dataset.scene=String(effectiveScene);
    mount.dataset.outageProvider=outageProviders[0] || outageProvider;
    mount.dataset.outageProviders=outageProviders.join(',');
    mount.style.setProperty('--ra-reserve-strength',clamp(reservePct/60).toFixed(3));
    mount.style.setProperty('--ra-market-strength',clamp(marketPct/50).toFixed(3));
    stateLabel.textContent=sceneLabel(effectiveScene,mode);

    const affectedBanks=banks.filter(function(bank){ return failedProviders.has(bank.provider); });
    const affectedSet=new Set(affectedBanks.map(function(bank){ return bank.id; }));
    const selectedModel = comparison && (mode==='lab' ? comparison[visualStrategy] : comparison.scfr);
    const market = comparison && comparison.market;
    const byId=new Map((selectedModel && selectedModel.rows || []).map(function(row){ return [row.id,row]; }));
    const gap=selectedModel ? Math.max(0,selectedModel.totalDemand-selectedModel.allocated) : 0;

    affectedLabel.textContent = mode==='evidence' ? '— / '+banks.length : effectiveScene===0 && mode==='simulation' ? '0 / '+banks.length : affectedBanks.length+' / '+banks.length;
    gapLabel.textContent = mode==='evidence' ? '—' : effectiveScene<2 && mode==='simulation' ? '0' : fmt(gap);
    restoredLabel.textContent = mode==='evidence' ? '—' : (effectiveScene>=4 || mode==='lab') && selectedModel ? Math.round(selectedModel.criticalRestoredPct)+'%' : '—';

    svg.querySelectorAll('.ra-earth-provider').forEach(function(node){
      const id=node.dataset.provider;
      const outage = failedProviders.has(id) && effectiveScene>=1 && mode!=='evidence';
      node.classList.toggle('is-outage',outage);
      node.classList.toggle('is-focus',mode==='lab' && failedProviders.has(id));
    });

    svg.querySelectorAll('.ra-earth-link').forEach(function(link){
      const affected=failedProviders.has(link.dataset.provider);
      link.classList.toggle('is-disrupted',affected && effectiveScene>=1 && mode!=='evidence');
      link.classList.toggle('is-focus',mode==='lab' && affected);
    });

    svg.querySelectorAll('.ra-earth-packet').forEach(function(packet){
      const affected=failedProviders.has(packet.dataset.provider);
      packet.classList.toggle('is-hidden',affected && effectiveScene>=1 && mode!=='evidence');
    });

    svg.querySelectorAll('.ra-earth-bank').forEach(function(node){
      const id=node.dataset.bank;
      const affected=affectedSet.has(id);
      const row=byId.get(id);
      node.classList.remove('is-affected','is-shortage','is-stranded','is-recovering','is-recovered','is-partial','is-critical','show-reserve');

      if(mode==='evidence') return;
      if(!affected){
        if(effectiveScene===3 || (mode==='lab' && labStrategy==='individual')) node.classList.add('show-reserve');
        return;
      }

      if(effectiveScene===1) node.classList.add('is-affected');
      if(effectiveScene===2) node.classList.add('is-shortage');
      if(effectiveScene===3) node.classList.add('is-stranded');
      if(effectiveScene===4){
        node.classList.add('is-recovering');
        if(row) node.classList.add(outcomeClass(row));
      }
      if(effectiveScene>=5 && row) node.classList.add(outcomeClass(row));
      if(mode==='lab' && row && effectiveScene>=2 && effectiveScene<5){
        if(visualStrategy==='market') node.classList.add('is-shortage',outcomeClass(row));
        if(visualStrategy==='individual') node.classList.add('is-stranded','show-reserve',outcomeClass(row));
        if(visualStrategy==='scfr') node.classList.add('is-recovering',outcomeClass(row));
      }
    });

    svg.querySelectorAll('.ra-request-flow').forEach(function(path){
      const active=affectedSet.has(path.dataset.bank) && effectiveScene===2 && mode!=='evidence';
      path.classList.toggle('is-visible',active);
    });
    svg.querySelectorAll('.ra-request-packet').forEach(function(packet){
      const active=affectedSet.has(packet.dataset.bank) && effectiveScene===2 && mode!=='evidence';
      packet.classList.toggle('is-visible',active);
    });

    svg.querySelectorAll('.ra-recovery-flow').forEach(function(path){
      const active=affectedSet.has(path.dataset.bank) && (effectiveScene>=4 || (mode==='lab' && visualStrategy==='scfr')) && mode!=='evidence';
      path.classList.toggle('is-visible',active);
      const row=byId.get(path.dataset.bank);
      path.style.setProperty('--ra-flow-restored',row ? clamp(row.restoredFraction).toFixed(3) : '0');
    });
    svg.querySelectorAll('.ra-recovery-packet').forEach(function(packet){
      const active=affectedSet.has(packet.dataset.bank) && (effectiveScene>=4 || (mode==='lab' && visualStrategy==='scfr')) && mode!=='evidence';
      packet.classList.toggle('is-visible',active);
      const row=byId.get(packet.dataset.bank);
      packet.style.setProperty('--ra-flow-restored',row ? clamp(row.restoredFraction).toFixed(3) : '0');
    });

    const marketNode=svg.querySelector('.ra-market-node');
    if(marketNode){
      marketNode.classList.toggle('is-visible',effectiveScene===2 && mode!=='evidence');
      marketNode.classList.toggle('is-active',effectiveScene===2 && mode!=='evidence');
    }

    const pool=svg.querySelector('.ra-pool-node');
    if(pool){
      pool.classList.toggle('is-visible',(effectiveScene>=4 || (mode==='lab' && visualStrategy==='scfr')) && mode!=='evidence');
      pool.classList.toggle('is-active',effectiveScene===4 || (mode==='lab' && visualStrategy==='scfr'));
    }

    mount.classList.toggle('has-shock',effectiveScene>=1 && effectiveScene<=3 && mode!=='evidence');
    mount.classList.toggle('has-recovery',(effectiveScene>=4 || (mode==='lab' && visualStrategy==='scfr')) && mode!=='evidence');
    mount.dataset.labStrategy=visualStrategy;
    mount.dataset.labPhase=labPhase||'';
  }

  function destroy(){
    destroyed=true;
    if(rafId) window.cancelAnimationFrame(rafId);
    mount.innerHTML='';
    mount.classList.remove('ra-earth-system');
  }

  update();
  return {update:update,destroy:destroy};
}

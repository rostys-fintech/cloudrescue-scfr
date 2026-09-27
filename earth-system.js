import { banks, providers } from './data/banks.js';

const clamp = (v,min=0,max=1)=>Math.max(min,Math.min(max,v));
const fmt = v => Math.round(v).toLocaleString('en-US');

const PROVIDER_META = {
  blue:   { x: 270, y: 176, label:'Blue Cloud' },
  orange: { x: 545, y: 154, label:'Orange Cloud' },
  green:  { x: 792, y: 236, label:'Green Cloud' }
};

/* Illustrative positions only: all institutions are synthetic. */
const BANK_POSITIONS = {
  B01:[236,250], B02:[322,214], B03:[404,260], B04:[472,334],
  B05:[575,246], B06:[650,220], B07:[690,325], B08:[788,292],
  B09:[278,310], B10:[366,238], B11:[438,306], B12:[526,218],
  B13:[612,318], B14:[714,265], B15:[760,358],
  B16:[328,356], B17:[458,226], B18:[548,354], B19:[658,302], B20:[814,334]
};

const LAND_PATHS = [
  'M190 190 C220 150 276 135 322 150 C350 160 366 184 360 207 C354 228 333 239 318 260 C305 279 292 300 266 307 C236 314 207 293 191 270 C174 246 169 217 190 190 Z',
  'M347 315 C371 304 395 312 410 334 C423 354 420 378 411 399 C400 425 395 455 375 481 C362 497 344 487 337 466 C329 443 333 416 325 392 C316 363 319 330 347 315 Z',
  'M493 185 C512 170 544 167 565 180 C578 188 580 201 567 211 C551 222 528 221 511 215 C498 210 484 198 493 185 Z',
  'M506 225 C537 209 573 217 590 244 C604 267 599 294 587 317 C572 346 560 384 535 398 C516 408 501 389 496 366 C489 335 477 306 477 276 C476 254 487 235 506 225 Z',
  'M576 176 C618 146 690 143 749 160 C796 174 831 200 846 233 C857 257 844 278 819 284 C790 291 763 278 739 292 C713 308 685 302 663 286 C639 269 616 258 591 253 C568 248 551 232 554 211 C556 196 564 185 576 176 Z',
  'M735 376 C759 358 799 359 823 375 C843 389 841 410 824 423 C804 438 775 442 752 431 C732 421 720 394 735 376 Z',
  'M352 116 C376 102 407 105 422 123 C432 137 421 151 402 155 C380 160 356 150 347 136 C342 128 344 121 352 116 Z'
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
    const dur=(8+(index%5)*1.35).toFixed(2);
    const begin=(-index*.43).toFixed(2);
    return '<circle class="ra-earth-packet provider-'+bank.provider+'" data-provider="'+bank.provider+'" r="2.25"><animateMotion path="'+d+'" dur="'+dur+'s" begin="'+begin+'s" repeatCount="indefinite"></animateMotion></circle>';
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
    return '<path class="ra-request-flow" data-bank="'+bank.id+'" data-provider="'+bank.provider+'" d="'+d+'"></path>';
  }).join('');

  const recoveryPaths=banks.map(function(bank,index){
    const pos=BANK_POSITIONS[bank.id];
    const d=curvePath(500,503,pos[0],pos[1],index+31);
    return '<path class="ra-recovery-flow" data-bank="'+bank.id+'" data-provider="'+bank.provider+'" d="'+d+'"></path>';
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
      '<radialGradient id="raOceanGlow" cx="48%" cy="42%" r="64%">'+
        '<stop offset="0%" stop-color="var(--ra-earth-ocean-core)"></stop>'+
        '<stop offset="76%" stop-color="var(--ra-earth-ocean)"></stop>'+
        '<stop offset="100%" stop-color="var(--ra-earth-rim)"></stop>'+
      '</radialGradient>'+
      '<clipPath id="raGlobeClip"><circle cx="500" cy="310" r="252"></circle></clipPath>'+
    '</defs>'+
    '<circle class="ra-earth-atmosphere" cx="500" cy="310" r="263"></circle>'+
    '<circle class="ra-earth-ocean" cx="500" cy="310" r="252"></circle>'+
    '<g clip-path="url(#raGlobeClip)">'+
      '<g class="ra-earth-grid" aria-hidden="true">'+
        '<ellipse cx="500" cy="310" rx="252" ry="82"></ellipse>'+
        '<ellipse cx="500" cy="310" rx="252" ry="156"></ellipse>'+
        '<ellipse cx="500" cy="310" rx="252" ry="218"></ellipse>'+
        '<ellipse cx="500" cy="310" rx="88" ry="252"></ellipse>'+
        '<ellipse cx="500" cy="310" rx="172" ry="252"></ellipse>'+
        '<path d="M248 310H752"></path>'+
      '</g>'+
      '<g class="ra-earth-land">'+lands+'</g>'+
      '<g class="ra-earth-network">'+providerLinks+'</g>'+
      '<g class="ra-earth-packets">'+dataPackets+'</g>'+
      '<g class="ra-earth-requests">'+requestPaths+'</g>'+
      '<g class="ra-earth-recovery">'+recoveryPaths+'</g>'+
      '<g class="ra-earth-bank-layer">'+bankNodes+'</g>'+
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

  function update(input){
    input=input||{};
    const scene=input.scene||0;
    const outageProvider=input.outageProvider||'blue';
    const comparison=input.comparison||null;
    const reservePct=input.reservePct==null ? 25 : input.reservePct;
    const marketPct=input.marketPct==null ? 20 : input.marketPct;
    const effectiveScene = mode==='evidence' ? 0 : mode==='lab' ? 4 : scene;

    mount.dataset.scene=String(effectiveScene);
    mount.dataset.outageProvider=outageProvider;
    mount.style.setProperty('--ra-reserve-strength',clamp(reservePct/60).toFixed(3));
    mount.style.setProperty('--ra-market-strength',clamp(marketPct/50).toFixed(3));
    stateLabel.textContent=sceneLabel(effectiveScene,mode);

    const affectedBanks=banks.filter(function(bank){ return bank.provider===outageProvider; });
    const affectedSet=new Set(affectedBanks.map(function(bank){ return bank.id; }));
    const model = comparison && comparison.scfr;
    const market = comparison && comparison.market;
    const byId=new Map((model && model.rows || []).map(function(row){ return [row.id,row]; }));
    const gap=market ? Math.max(0,market.totalDemand-market.allocated) : 0;

    affectedLabel.textContent = mode==='evidence' ? '— / '+banks.length : affectedBanks.length+' / '+banks.length;
    gapLabel.textContent = mode==='evidence' ? '—' : fmt(gap);
    restoredLabel.textContent = model ? Math.round(model.criticalRestoredPct)+'%' : '—';

    svg.querySelectorAll('.ra-earth-provider').forEach(function(node){
      const id=node.dataset.provider;
      const outage = id===outageProvider && effectiveScene>=1 && mode!=='evidence';
      node.classList.toggle('is-outage',outage);
      node.classList.toggle('is-focus',mode==='lab' && id===outageProvider);
    });

    svg.querySelectorAll('.ra-earth-link').forEach(function(link){
      const affected=link.dataset.provider===outageProvider;
      link.classList.toggle('is-disrupted',affected && effectiveScene>=1 && mode!=='evidence');
      link.classList.toggle('is-focus',mode==='lab' && affected);
    });

    svg.querySelectorAll('.ra-earth-packet').forEach(function(packet){
      const affected=packet.dataset.provider===outageProvider;
      packet.classList.toggle('is-hidden',affected && effectiveScene>=1 && mode!=='evidence');
    });

    svg.querySelectorAll('.ra-earth-bank').forEach(function(node){
      const id=node.dataset.bank;
      const affected=affectedSet.has(id);
      const row=byId.get(id);
      node.classList.remove('is-affected','is-shortage','is-stranded','is-recovering','is-recovered','is-partial','is-critical','show-reserve');

      if(mode==='evidence') return;
      if(!affected){
        if(effectiveScene===3) node.classList.add('show-reserve');
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
      if(mode==='lab' && row) node.classList.add('is-recovering',outcomeClass(row));
    });

    svg.querySelectorAll('.ra-request-flow').forEach(function(path){
      const active=affectedSet.has(path.dataset.bank) && effectiveScene===2 && mode!=='evidence';
      path.classList.toggle('is-visible',active);
    });

    svg.querySelectorAll('.ra-recovery-flow').forEach(function(path){
      const active=affectedSet.has(path.dataset.bank) && (effectiveScene>=4 || mode==='lab') && mode!=='evidence';
      path.classList.toggle('is-visible',active);
      const row=byId.get(path.dataset.bank);
      path.style.setProperty('--ra-flow-restored',row ? clamp(row.restoredFraction).toFixed(3) : '0');
    });

    const pool=svg.querySelector('.ra-pool-node');
    if(pool){
      pool.classList.toggle('is-visible',(effectiveScene>=4 || mode==='lab') && mode!=='evidence');
      pool.classList.toggle('is-active',effectiveScene===4 || mode==='lab');
    }

    mount.classList.toggle('has-shock',effectiveScene>=1 && effectiveScene<=3 && mode!=='evidence');
    mount.classList.toggle('has-recovery',(effectiveScene>=4 || mode==='lab') && mode!=='evidence');
  }

  function destroy(){
    mount.innerHTML='';
    mount.classList.remove('ra-earth-system');
  }

  update();
  return {update:update,destroy:destroy};
}

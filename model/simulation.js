import { banks } from '../data/banks.js';

const clamp = (x, min=0, max=1) => Math.max(min, Math.min(max, x));
const totalSystemLoad = banks.reduce((s,b)=>s+b.criticalLoad,0);

function normalizeOutageProviders(outageProviders, outageProvider='blue') {
  const raw = Array.isArray(outageProviders) ? outageProviders : [outageProvider];
  const allowed = new Set(['blue','orange','green']);
  const normalized = [...new Set(raw.filter(p => allowed.has(p)))];
  return normalized.length ? normalized : ['blue'];
}

function affectedBanks(outageProviders) {
  const failed = new Set(outageProviders);
  return banks.filter(b => failed.has(b.provider)).map(b => ({...b, allocation:0}));
}

function priorityValue(bank, rule) {
  if (rule === 'equal') return 1;
  if (rule === 'readiness') return bank.readiness;
  return bank.criticalLoad * bank.importance;
}

function allocatePool(items, pool, rule='systemic') {
  const rows = items.map(x => ({...x}));
  if (pool <= 0) return rows;

  if (rule === 'equal') {
    let remaining = pool;
    let active = rows.filter(r => r.allocation < r.criticalLoad);
    while (remaining > .0001 && active.length) {
      const share = remaining / active.length;
      let spent = 0;
      active.forEach(r => {
        const need = Math.max(0, r.criticalLoad - r.allocation);
        const add = Math.min(need, share);
        r.allocation += add;
        spent += add;
      });
      remaining -= spent;
      if (spent < .0001) break;
      active = rows.filter(r => r.allocation + .0001 < r.criticalLoad);
    }
    return rows;
  }

  const ordered = [...rows].sort((a,b)=>priorityValue(b,rule)-priorityValue(a,rule));
  let remaining = pool;
  for (const row of ordered) {
    if (remaining <= 0) break;
    const need = Math.max(0, row.criticalLoad-row.allocation);
    const add = Math.min(need, remaining);
    row.allocation += add;
    remaining -= add;
  }
  const byId = new Map(ordered.map(x=>[x.id,x]));
  return rows.map(x=>byId.get(x.id));
}

function finalize(rows, totalReserve, reserveUsed, strandedReserve=0) {
  const detailed = rows.map(b => {
    const capacityRatio = clamp(b.allocation / b.criticalLoad);
    const restoredFraction = clamp(capacityRatio * b.readiness);
    return {...b, capacityRatio, restoredFraction, recovered: restoredFraction >= .80};
  });

  const weightedDen = detailed.reduce((s,b)=>s + b.criticalLoad*b.importance,0) || 1;
  const weightedNum = detailed.reduce((s,b)=>s + b.criticalLoad*b.importance*b.restoredFraction,0);
  const resilience = 100*weightedNum/weightedDen;
  const totalDemand = detailed.reduce((s,b)=>s+b.criticalLoad,0);
  const allocated = detailed.reduce((s,b)=>s+Math.min(b.allocation,b.criticalLoad),0);
  const criticalRestored = detailed.reduce((s,b)=>s+b.criticalLoad*b.restoredFraction,0);

  return {
    resilience,
    totalDemand,
    allocated,
    unmetPct: totalDemand ? 100*(1-allocated/totalDemand) : 0,
    criticalRestoredPct: totalDemand ? 100*criticalRestored/totalDemand : 0,
    banksRecovered: detailed.filter(b=>b.recovered).length,
    affectedCount: detailed.length,
    totalReserve,
    reserveUsed,
    strandedReserve,
    rows:detailed
  };
}

export function runScenario({
  outageProvider='blue',
  outageProviders,
  marketPct=20,
  reservePct=25,
  strategy='market',
  allocationRule='systemic'
}={}) {
  const failedProviders = normalizeOutageProviders(outageProviders, outageProvider);
  const affected = affectedBanks(failedProviders);
  const affectedDemand = affected.reduce((s,b)=>s+b.criticalLoad,0);
  const marketPool = affectedDemand * marketPct/100;
  const reservePool = totalSystemLoad * reservePct/100;

  let rows = allocatePool(affected, marketPool, 'readiness');

  if (strategy === 'market') return finalize(rows, 0, 0, 0);

  if (strategy === 'individual') {
    const reserveSharePerUnit = reservePool / totalSystemLoad;
    let reserveUsed = 0;
    for (const row of rows) {
      const ownReserve = row.criticalLoad * reserveSharePerUnit;
      const need = Math.max(0, row.criticalLoad-row.allocation);
      const add = Math.min(need, ownReserve);
      row.allocation += add;
      reserveUsed += add;
    }
    const strandedReserve = Math.max(0, reservePool-reserveUsed);
    return finalize(rows, reservePool, reserveUsed, strandedReserve);
  }

  if (strategy === 'scfr') {
    const before = rows.reduce((s,b)=>s+b.allocation,0);
    rows = allocatePool(rows, reservePool, allocationRule);
    const after = rows.reduce((s,b)=>s+b.allocation,0);
    const reserveUsed = Math.max(0, after-before);
    const strandedReserve = Math.max(0, reservePool-reserveUsed);
    return finalize(rows, reservePool, reserveUsed, strandedReserve);
  }

  throw new Error(`Unknown strategy: ${strategy}`);
}

export function compareStrategies(args={}) {
  return {
    market: runScenario({...args, strategy:'market'}),
    individual: runScenario({...args, strategy:'individual'}),
    scfr: runScenario({...args, strategy:'scfr'})
  };
}

export function resilienceFrontier({outageProvider='blue', outageProviders, marketPct=20, allocationRule='systemic'}={}) {
  const points=[];
  for (let reservePct=0; reservePct<=60; reservePct+=5) {
    const c=compareStrategies({outageProvider,outageProviders,marketPct,reservePct,allocationRule});
    points.push({reservePct, market:c.market.resilience, individual:c.individual.resilience, scfr:c.scfr.resilience});
  }
  return points;
}

export function systemStats() {
  const providerLoads = Object.fromEntries(['blue','orange','green'].map(p=>[p,banks.filter(b=>b.provider===p).reduce((s,b)=>s+b.criticalLoad,0)]));
  const shares = Object.values(providerLoads).map(v=>v/totalSystemLoad);
  const hhi = shares.reduce((s,x)=>s+x*x,0)*10000;
  return { totalSystemLoad, providerLoads, hhi };
}
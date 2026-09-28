import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseURL=process.env.CAPTURE_BASE_URL || 'http://127.0.0.1:4173/';
const outDir=path.resolve('artifacts/lovhack-video');
const rawDir=path.join(outDir,'raw');
await fs.mkdir(rawDir,{recursive:true});

const target={
  hook:12.120816326530612,
  scenario:18.155102040816328,
  evidence:19.983673469387757,
  close:11.702857142857143
};

const browser=await chromium.launch({
  headless:true,
  args:['--autoplay-policy=no-user-gesture-required']
});

const context=await browser.newContext({
  viewport:{width:1920,height:1080},
  colorScheme:'dark',
  recordVideo:{dir:rawDir,size:{width:1920,height:1080}}
});
const page=await context.newPage();
const video=page.video();

const wait=ms=>page.waitForTimeout(ms);
async function settle(ms=700){
  await page.evaluate(()=>document.fonts?.ready).catch(()=>{});
  await wait(ms);
}
async function point(selector){
  const box=await page.locator(selector).boundingBox();
  if(!box) return;
  await page.evaluate(({x,y})=>{
    const cursor=document.querySelector('#captureCursor');
    if(cursor){
      cursor.style.left=x+'px';
      cursor.style.top=y+'px';
    }
  },{x:box.x+box.width/2,y:box.y+box.height/2});
  await wait(420);
}
async function waitSegment(start,seconds){
  const elapsed=(Date.now()-start)/1000;
  const remaining=seconds-elapsed;
  if(remaining>0) await wait(remaining*1000);
}

await page.goto(baseURL+'#simulation',{waitUntil:'domcontentloaded'});
await page.waitForSelector('.ra-app');
await settle(900);

await page.evaluate(()=>{
  const style=document.createElement('style');
  style.textContent=`
    #captureCursor{
      position:fixed;left:50%;top:50%;width:16px;height:16px;border:2px solid rgba(255,255,255,.92);
      border-radius:50%;transform:translate(-50%,-50%);z-index:999999;pointer-events:none;
      box-shadow:0 0 0 4px rgba(55,173,255,.16),0 0 18px rgba(55,173,255,.35);
      transition:left .42s cubic-bezier(.22,.61,.36,1),top .42s cubic-bezier(.22,.61,.36,1),transform .18s ease;
    }
  `;
  document.head.appendChild(style);
  const cursor=document.createElement('div');
  cursor.id='captureCursor';
  document.body.appendChild(cursor);
});

/* 01 — hook */
let segment=Date.now();
await wait(9000);
await point('#raRunPreview');
await waitSegment(segment,target.hook);
await page.locator('#raRunPreview').click();

/* 02 — full Guided Simulation */
const guidedStart=Date.now();
await page.locator('#raGuidedStatus').filter({hasText:'COMPLETE'}).waitFor({timeout:125000});
const guidedDuration=(Date.now()-guidedStart)/1000;
await wait(250);

/* 03 — Scenario Lab */
segment=Date.now();
await point('.ra-nav-tab[data-ra-tab="lab"]');
await page.locator('.ra-nav-tab[data-ra-tab="lab"]').click();
await settle(850);

await point('#raProviderToggles .provider-orange');
await page.evaluate(()=>{
  const blue=document.querySelector('#raProviderToggles input[value="blue"]');
  const orange=document.querySelector('#raProviderToggles input[value="orange"]');
  if(blue?.checked){
    blue.checked=false;
    blue.dispatchEvent(new Event('change',{bubbles:true}));
  }
  if(orange && !orange.checked){
    orange.checked=true;
    orange.dispatchEvent(new Event('change',{bubbles:true}));
  }
});
await wait(450);

await page.evaluate(()=>{
  const market=document.querySelector('#raMarketPct');
  market.value='15';
  market.dispatchEvent(new Event('input',{bubbles:true}));
  const reserve=document.querySelector('#raReservePct');
  reserve.value='30';
  reserve.dispatchEvent(new Event('input',{bubbles:true}));
});
await wait(650);
await point('#raRunScenario');
await page.locator('#raRunScenario').click();
await page.locator('#raScenarioConclusion:not([hidden])').waitFor({state:'visible',timeout:20000});
await page.evaluate(()=>window.scrollTo({top:0,behavior:'smooth'}));
await settle(450);
await waitSegment(segment,target.scenario);

/* 04 — Robustness Sweep + Evidence boundary */
segment=Date.now();
await point('.ra-nav-tab[data-ra-tab="evidence"]');
await page.locator('.ra-nav-tab[data-ra-tab="evidence"]').click();
await settle(700);
await page.locator('.ra-robustness-block').scrollIntoViewIfNeeded();
await settle(800);
await wait(10800);
await page.evaluate(()=>window.scrollTo({top:0,behavior:'smooth'}));
await settle(900);
await waitSegment(segment,target.evidence);

/* 05 — closing on the controlled comparison */
segment=Date.now();
await point('.ra-nav-tab[data-ra-tab="lab"]');
await page.locator('.ra-nav-tab[data-ra-tab="lab"]').click();
await settle(650);
await page.locator('.ra-model-compare').scrollIntoViewIfNeeded();
await settle(700);
await point('.ra-model-card[data-ra-compare="scfr"]');
await page.locator('.ra-model-card[data-ra-compare="scfr"]').click();
await settle(500);
await waitSegment(segment,target.close);

const totalVisual=(Date.now()-guidedStart)/1000 + target.hook;

await page.close();
await video.saveAs(path.join(outDir,'resilience-atlas-demo-visual.webm'));
await context.close();
await browser.close();

await fs.writeFile(path.join(outDir,'timeline.json'),JSON.stringify({
  targetSegments:target,
  guidedActualSeconds:guidedDuration,
  guidedNominalSeconds:103.628,
  estimatedTotalVisualSeconds:totalVisual
},null,2));

console.log(JSON.stringify({guidedDuration,target},null,2));

import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseURL=process.env.CAPTURE_BASE_URL || 'http://127.0.0.1:4173/';
const localAudioDir=process.env.CAPTURE_AUDIO_DIR ? path.resolve(process.env.CAPTURE_AUDIO_DIR) : null;
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

const guidedAudioMap={
  '1d2a60f2-2dc1-41ab-9feb-d7c3b8a3f820':'02-guide-1.wav',
  '8630f5b1-7b6e-4c63-84e8-5f2551ddc12b':'03-guide-2.wav',
  'de6b3f25-4a42-4d8a-abee-d4979d0c395b':'04-guide-3.wav',
  '77965ee8-99bc-417b-afc5-0f1e533656fc':'05-guide-4.wav',
  'a16036c5-ef1c-4a08-93c6-57ad62c434cc':'06-guide-5.wav',
  'd798f2ca-cec2-4199-87d5-80cd7ae53419':'07-guide-6.wav'
};

if(localAudioDir){
  await page.route('https://resource2.heygen.ai/text_to_speech/**',async route=>{
    const match=route.request().url().match(/id=([0-9a-f-]+)\.wav/i);
    const file=match ? guidedAudioMap[match[1]] : null;
    if(!file) return route.continue();
    const body=await fs.readFile(path.join(localAudioDir,file));
    await route.fulfill({status:200,contentType:'audio/wav',body});
  });
}

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

await page.evaluate(()=>{
  const scene=document.querySelector('#raGuidedScene');
  window.__captureGuidedTiming={
    start:performance.now(),
    sceneStarts:[0,null,null,null,null,null]
  };
  const observer=new MutationObserver(()=>{
    const text=scene?.textContent || '';
    const match=text.match(/SCENE\s+(\d+)/i);
    if(!match) return;
    const index=Number(match[1])-1;
    if(index<0 || index>5) return;
    const timing=window.__captureGuidedTiming;
    if(timing.sceneStarts[index]==null){
      timing.sceneStarts[index]=(performance.now()-timing.start)/1000;
    }
  });
  observer.observe(scene,{childList:true,subtree:true,characterData:true});
  window.__captureGuidedTiming.observer=observer;
});
await page.locator('#raRunPreview').click();

/* 02 — full Guided Simulation */
const guidedStart=Date.now();
await page.locator('#raGuidedStatus').filter({hasText:'COMPLETE'}).waitFor({timeout:125000});
const guidedDuration=(Date.now()-guidedStart)/1000;
const guidedTiming=await page.evaluate(()=>{
  const timing=window.__captureGuidedTiming;
  timing?.observer?.disconnect();
  return {
    sceneStarts:timing?.sceneStarts || [0],
    completeSeconds:timing ? (performance.now()-timing.start)/1000 : null
  };
});
if(guidedDuration>105.5){
  throw new Error('Guided visual drifted beyond narration timing: '+guidedDuration.toFixed(2)+'s');
}
if(guidedTiming.sceneStarts.filter(v=>Number.isFinite(v)).length!==6){
  throw new Error('Could not capture all guided scene start times: '+JSON.stringify(guidedTiming.sceneStarts));
}
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
await page.locator('#lab.is-active').waitFor({state:'visible',timeout:3000});
await settle(650);
await page.locator('.ra-model-compare').scrollIntoViewIfNeeded();
await settle(700);
await point('.ra-model-card[data-ra-compare="scfr"]');
await page.locator('.ra-model-card[data-ra-compare="scfr"]').click();
await settle(500);
if(!(await page.locator('#lab').evaluate(node=>node.classList.contains('is-active')))){
  throw new Error('Closing frame did not return to Scenario Lab.');
}
await waitSegment(segment,target.close);

const totalVisual=(Date.now()-guidedStart)/1000 + target.hook;

await page.close();
await video.saveAs(path.join(outDir,'resilience-atlas-demo-visual.webm'));
await context.close();
await browser.close();

await fs.writeFile(path.join(outDir,'timeline.json'),JSON.stringify({
  targetSegments:target,
  guidedActualSeconds:guidedDuration,
  guidedSceneStartsSeconds:guidedTiming.sceneStarts,
  guidedNominalSeconds:103.628,
  estimatedTotalVisualSeconds:totalVisual
},null,2));

console.log(JSON.stringify({guidedDuration,target},null,2));

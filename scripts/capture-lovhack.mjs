import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseURL=process.env.CAPTURE_BASE_URL || 'http://127.0.0.1:4173/';
const outDir=path.resolve('artifacts/lovhack-captures');
await fs.mkdir(outDir,{recursive:true});

const browser=await chromium.launch({headless:true});

async function settle(page,ms=850){
  await page.evaluate(()=>document.fonts?.ready).catch(()=>{});
  await page.waitForTimeout(ms);
}

async function openApp(page,hash='simulation'){
  await page.goto(baseURL+'#'+hash,{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.ra-app');
  await settle(page,1000);
}

async function viewportShot(page,name){
  await page.screenshot({path:path.join(outDir,name),fullPage:false});
}

async function sectionShot(page,selector,name,padding=18){
  const locator=page.locator(selector);
  await locator.scrollIntoViewIfNeeded();
  await settle(page,350);
  const box=await locator.boundingBox();
  if(!box) throw new Error('Missing capture box for '+selector);
  const viewport=page.viewportSize();
  const clip={
    x:Math.max(0,box.x-padding),
    y:Math.max(0,box.y-padding),
    width:Math.min(viewport.width-Math.max(0,box.x-padding),box.width+padding*2),
    height:Math.min(1050,box.height+padding*2)
  };
  await page.screenshot({path:path.join(outDir,name),clip});
}

const desktop=await browser.newContext({
  viewport:{width:1920,height:1080},
  deviceScaleFactor:1,
  colorScheme:'dark'
});
const page=await desktop.newPage();

await openApp(page,'simulation');
await viewportShot(page,'01-product-identity.png');

for(const [scene,file] of [
  [1,'02-provider-failure.png'],
  [3,'03-stranded-reserve.png'],
  [4,'04-pooled-scfr-recovery.png']
]){
  await page.locator('.ra-scene-list button[data-ra-scene="'+scene+'"]').click();
  await settle(page,900);
  await viewportShot(page,file);
}

await page.locator('.ra-nav-tab[data-ra-tab="lab"]').click();
await settle(page,900);
await sectionShot(page,'.ra-model-compare','05-controlled-comparison.png',14);

await page.evaluate(()=>{
  const blue=document.querySelector('#raProviderToggles input[value="blue"]');
  const orange=document.querySelector('#raProviderToggles input[value="orange"]');
  if(blue?.checked){blue.checked=false;blue.dispatchEvent(new Event('change',{bubbles:true}));}
  if(orange && !orange.checked){orange.checked=true;orange.dispatchEvent(new Event('change',{bubbles:true}));}
  const market=document.querySelector('#raMarketPct');
  market.value='15';
  market.dispatchEvent(new Event('input',{bubbles:true}));
  const reserve=document.querySelector('#raReservePct');
  reserve.value='30';
  reserve.dispatchEvent(new Event('input',{bubbles:true}));
});
await settle(page,400);
await page.locator('#raRunScenario').click();
await page.locator('#raScenarioConclusion:not([hidden])').waitFor({state:'visible',timeout:20000});
await settle(page,500);
await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
await settle(page,350);
await viewportShot(page,'06-scenario-lab.png');

await page.locator('#raResetLab').click();
await settle(page,500);
await page.locator('.ra-nav-tab[data-ra-tab="evidence"]').click();
await settle(page,900);
await sectionShot(page,'.ra-robustness-block','07-robustness-sweep.png',16);

await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
await settle(page,500);
await viewportShot(page,'08-evidence-users.png');

await desktop.close();

const mobile=await browser.newContext({
  viewport:{width:390,height:844},
  deviceScaleFactor:1,
  colorScheme:'dark',
  isMobile:true,
  hasTouch:true
});
const mobilePage=await mobile.newPage();
await openApp(mobilePage,'simulation');
await viewportShot(mobilePage,'09-mobile-simulation.png');
await mobile.close();

const manifest=`Resilience Atlas — LovHack capture set

01-product-identity.png
Resilience Atlas turns shared-provider concentration risk into an interactive systemic recovery simulation.

02-provider-failure.png
A shared-provider outage creates correlated exposure across multiple synthetic banks.

03-stranded-reserve.png
Reserve capacity can exist in the system and still be unusable when it is ring-fenced institution by institution.

04-pooled-scfr-recovery.png
SCFR changes the allocation mechanism, not the aggregate reserve budget.

05-controlled-comparison.png
The central experiment holds the shock and aggregate reserve budget constant and changes only how reserve capacity is coordinated.

06-scenario-lab.png
Judges can change the shock and recovery assumptions and rerun the same deterministic model.

07-robustness-sweep.png
A local 3×3 sweep reruns the model across nearby assumptions instead of relying on one hand-picked baseline.

08-evidence-users.png
The product separates documented concentration-risk motivation from synthetic model outputs and makes its intended users explicit.

09-mobile-simulation.png
The prototype remains usable on mobile, including navigation and guided playback.
`;
await fs.writeFile(path.join(outDir,'CAPTIONS.txt'),manifest,'utf8');

await browser.close();
console.log('LovHack capture set written to '+outDir);

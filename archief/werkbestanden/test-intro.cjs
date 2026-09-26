const {chromium}=require('/Users/openclawwillem/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('assert'),path=require('path');
(async()=>{
 const b=await chromium.launch({executablePath:'/Users/openclawwillem/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',headless:true});
 try{
 const p=await b.newPage({viewport:{width:1920,height:1080}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('file://'+path.resolve('outputs/Joel-telefoonformat.html')+'?render=1');
 await p.evaluate(()=>renderAt(0));assert(await p.locator('#phoneOff').isVisible());assert.equal(await p.locator('#introDate').innerText(),'');
 await p.evaluate(()=>renderAt(2));const partial=await p.locator('#introDate').innerText();assert(partial.length>0&&partial.length<20);assert.equal(await p.locator('#introTime').innerText(),'');
 await p.evaluate(()=>renderAt(9.5));assert.equal(await p.locator('#introDate').innerText(),'ZATERDAG · 1 JULI');assert.equal(await p.locator('#introTime').innerText(),'12:07 UUR');assert.equal(await p.locator('#introPlace').innerText(),'SLAAPKAMER');
 assert(await p.evaluate(()=>{const text=document.querySelector('.intro-copy').getBoundingClientRect(),phone=document.querySelector('#device').getBoundingClientRect();return text.right<phone.left}));
 await p.screenshot({path:'outputs/Joel-documentaire-intro-voorbeeld.png'});
 await p.evaluate(()=>renderAt(12));assert(!(await p.locator('#phoneOff').isVisible()));assert(!(await p.locator('#introPlane').isVisible()));assert(await p.locator('#alarm').isVisible());
 await p.evaluate(()=>renderAt(12+58));assert(await p.locator('#chatScreen').isVisible());
 await p.evaluate(()=>renderAt(12+104));assert.equal(await p.locator('.outgoing').count(),3);
 // Settings are scene-specific, survive a project round-trip, and drive both intro and phone.
 await p.evaluate(()=>{document.body.classList.remove('render')});
 await p.locator('#sceneInput').selectOption('1');await p.locator('#dateInput').fill('Vrijdag · 30 juni');await p.locator('#timeInput').fill('23:15');await p.locator('#locInput').fill('Deventer');
 await p.evaluate(()=>renderAt(9.5));assert.equal(await p.locator('#introPlace').innerText(),'DEVENTER');assert.equal(await p.locator('#introTime').innerText(),'23:15 UUR');
 const saved=await p.evaluate(()=>getConfig());await p.evaluate(c=>setConfig(c),saved);
 await p.evaluate(()=>renderAt(9.5));assert.equal(await p.locator('#introPlace').innerText(),'SLAAPKAMER');
 await p.locator('#sceneInput').selectOption('1');await p.evaluate(()=>renderAt(9.5));assert.equal(await p.locator('#introPlace').innerText(),'DEVENTER');
 await p.locator('#introPreview').click();await p.evaluate(()=>{start=performance.now()-12010});await p.waitForFunction(()=>!playing);
 assert(!(await p.locator('#phoneOff').isVisible()));assert(!(await p.locator('#alarm').isVisible()));assert.equal(await p.locator('.notice').count(),0);
 await p.locator('#next').click();assert.equal(await p.locator('.notice').count(),1);
 assert.deepEqual(errors,[]);console.log('PASS: typed date/time/location, off phone, transition, all scenes, saved settings, standalone intro and existing ending.');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});

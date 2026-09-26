const {chromium}=require('/Users/openclawwillem/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('assert'),path=require('path');
(async()=>{
 const browser=await chromium.launch({executablePath:'/Users/openclawwillem/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve('outputs/Joel-telefoonformat.html'));
  const timing=await page.evaluate(()=>getFilmTiming());assert(timing.duration<95);assert(timing.duration>75);console.log('Default duration:',timing.duration);
  for(let i=0;i<3;i++){assert(Math.abs(timing.snoozes[i]-timing.ringStarts[i]-8)<.001);await page.evaluate(t=>renderAt(t),timing.snoozes[i]+1.5);assert(await page.locator('#snoozeActivity').isVisible());}
  await page.evaluate(t=>renderAt(t),timing.chatOpen+1);await page.locator('#chatPhoto').evaluate(i=>i.decode());assert(await page.locator('#chatScreen').isVisible());
  for(const r of timing.replies){await page.evaluate(t=>renderAt(t),r.end+.1);assert.equal(await page.locator('#joelDraft').innerText(),r.text)}
  await page.evaluate(t=>renderAt(t),timing.photoSend+1);await page.locator('#replyPhotoImage').evaluate(i=>i.decode());assert(await page.locator('#replyPhotoBubble').isVisible());
  await page.locator('#tempo-messageGap').fill('2');await page.locator('#tempo-messageGap').press('Tab');
  let changed=await page.evaluate(()=>getFilmTiming());assert(Math.abs(changed.messages[1]-changed.messages[0]-2)<.001);assert(changed.duration<timing.duration);
  await page.getByRole('textbox',{name:'Bericht 2 van Joel',exact:true}).fill('Zo terug <test>');await page.locator('#tempo-lastPhotoHold').fill('4');await page.locator('#tempo-lastPhotoHold').press('Tab');
  changed=await page.evaluate(()=>getFilmTiming());assert.equal(changed.replies[1].text,'Zo terug <test>');assert(Math.abs(changed.duration-changed.photoSend-4)<.001);
  await page.locator('#sceneInput').selectOption('1');assert.equal((await page.evaluate(()=>getFilmTiming())).ringStarts.length,0);await page.locator('#tempo-messageGap').fill('5');await page.locator('#tempo-messageGap').press('Tab');
  await page.locator('#sceneInput').selectOption('0');assert.equal(await page.locator('#tempo-messageGap').inputValue(),'2');
  await page.getByRole('button',{name:/Laatste foto ·/}).click();assert(await page.locator('#replyPhotoBubble').isVisible());assert(!(await page.evaluate(()=>playing)));
  await page.locator('#pausePreview').click();await page.waitForFunction(()=>playing);await page.locator('#pausePreview').click();assert(!(await page.evaluate(()=>playing)));
  const download=page.waitForEvent('download');await page.locator('#saveEditable').click();const file=await download;await file.saveAs(path.resolve('work/editor-saved.html'));
  const saved=await browser.newPage();saved.on('pageerror',e=>errors.push(e.message));await saved.goto('file://'+path.resolve('work/editor-saved.html'));
  assert.equal(await saved.locator('#tempo-messageGap').inputValue(),'2');assert.equal(await saved.getByRole('textbox',{name:'Bericht 2 van Joel',exact:true}).inputValue(),'Zo terug <test>');assert.equal(await saved.locator('.tempo-panel').count(),1);
  await saved.evaluate(()=>renderAt(getFilmTiming().photoSend+1));await saved.locator('#replyPhotoImage').evaluate(i=>i.decode());assert(await saved.locator('#replyPhotoBubble').isVisible());
  const project=await saved.evaluate(()=>getConfig());await saved.evaluate(c=>setConfig(c),project);assert.equal(await saved.locator('#tempo-lastPhotoHold').inputValue(),'4');
  await page.locator('#tempoFast').click();assert.equal(await page.locator('#tempo-messageGap').inputValue(),'3');
  assert.deepEqual(errors,[]);console.log('PASS: faster timing, actor time, snoozes, both photos, typing, editable timing/text, per-scene settings, seek/pause, self-contained HTML save/reopen and JSON reload.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});

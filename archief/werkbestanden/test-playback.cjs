const {chromium}=require('/Users/openclawwillem/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path=require('path'),assert=require('assert');
(async()=>{
 const b=await chromium.launch({executablePath:'/Users/openclawwillem/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',headless:true});
 try{
  const p=await b.newPage({viewport:{width:1920,height:1080}}),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  await p.goto('file://'+path.resolve('outputs/Joel-telefoonformat.html'));
  assert(await p.evaluate(()=>getConfig().scenes[0][2].photo.name.includes('14.36.39')));
  for(const start of [0,12,24]){
   await p.evaluate(t=>renderSceneAt(t),start+7);
   assert.equal(await p.locator('#alarm .label').innerText(),'Wekker');
   assert(await p.locator('#snoozeButton').isVisible());
   await p.evaluate(t=>renderSceneAt(t),start+8.3);
   assert(Number(await p.locator('#snoozeTouch').evaluate(e=>getComputedStyle(e).opacity))>.8);
   for(const [elapsed,text]of [[8.8,'9:00'],[9.4,'8:59'],[10.4,'8:58'],[11.4,'8:57']]){
    await p.evaluate(t=>renderSceneAt(t),start+elapsed);
    assert(await p.locator('#snoozeActivity').isVisible());
    assert.equal(await p.locator('#snoozeCountdown').innerText(),text);
    assert(!(await p.locator('#snoozeButton').isVisible()));
   }
   await p.locator('#reset').click();assert(!(await p.locator('#snoozeActivity').isVisible()));
  }
  for(const [time,count]of [[36,0],[38,1],[44,2],[50,3]]){
   await p.evaluate(t=>renderSceneAt(t),time);assert.equal(await p.locator('.notice').count(),count);assert(!(await p.locator('#snoozeActivity').isVisible()));
  }
  await p.evaluate(()=>renderSceneAt(54.7));assert(Number(await p.locator('.message-photo-wrap .touch-mark').evaluate(e=>getComputedStyle(e).opacity))>.9);
  await p.evaluate(()=>renderSceneAt(58));await p.locator('#chatPhoto').evaluate(e=>e.decode());
  assert(await p.locator('#chatScreen').isVisible());
  assert.equal(await p.locator('#chatPhoto').getAttribute('src'),await p.evaluate(()=>getConfig().scenes[0][2].photo.src));
  assert.equal(await p.locator('#chatName').innerText(),'Geert');
  await p.evaluate(()=>renderSceneAt(68.9));assert(await p.locator('#chatScreen').isVisible());
  assert(!(await p.locator('#iosKeyboard').isVisible()));
  const replies=await p.evaluate(()=>DEMO.replies);
  for(let i=0;i<replies.length;i++){
   const reply=replies[i];
   await p.evaluate(t=>renderSceneAt(t),reply.start+1);
   assert(await p.locator('#iosKeyboard').isVisible());
   const partial=await p.locator('#joelDraft').innerText();assert(partial.length>0&&partial.length<reply.text.length);assert(reply.text.startsWith(partial));
   await p.evaluate(t=>renderSceneAt(t),reply.end+.2);assert.equal(await p.locator('#joelDraft').innerText(),reply.text);
   await p.evaluate(t=>renderSceneAt(t),reply.send+.6);assert.equal(await p.locator('.outgoing').count(),i+1);
   assert.equal(await p.locator('.outgoing-text').last().innerText(),reply.text);
  }
  await p.evaluate(()=>renderSceneAt(104));assert(!(await p.locator('#iosKeyboard').isVisible()));
  assert.deepEqual(await p.locator('.outgoing-text').allTextContents(),replies.map(r=>r.text));
  assert(await p.evaluate(()=>{const body=document.querySelector('.chat-body').getBoundingClientRect();return Array.from(document.querySelectorAll('.outgoing')).every(e=>{const r=e.getBoundingClientRect();return r.top>=body.top&&r.bottom<=body.bottom})}));
  await p.evaluate(()=>renderSceneAt(106));await p.locator('#replyPhotoImage').evaluate(i=>i.decode());
  assert(await p.locator('#replyPhotoBubble').isVisible());
  assert.equal(await p.locator('#replyPhotoImage').getAttribute('src'),await p.evaluate(()=>getConfig().replyPhotos[0].src));
  assert((await p.locator('#replyPhotoImage').getAttribute('alt')).endsWith('16-04-48.jpg'));
  assert(await p.evaluate(()=>{const b=document.querySelector('.chat-body').getBoundingClientRect(),p=document.querySelector('#replyPhotoImage').getBoundingClientRect();return p.top>=b.top&&p.bottom<=b.bottom}));
  await p.evaluate(()=>renderSceneAt(104));assert(!(await p.locator('#replyPhotoBubble').isVisible()));
  await p.locator('#reset').click();assert.equal(await p.locator('.outgoing').count(),0);assert(!(await p.locator('#replyPhotoBubble').isVisible()));
  await p.locator('#reset').click();for(let i=0;i<4;i++)await p.locator('#next').click();await p.waitForFunction(()=>!document.querySelector('#chatScreen').hidden);
  await p.locator('#chatBack').click();assert(!(await p.locator('#chatScreen').isVisible()));
  await p.locator('#demo').click();await p.evaluate(()=>{start=performance.now()-12010});await p.waitForFunction(()=>!radar.paused&&radar.loop);
  await p.keyboard.press('s');await p.waitForFunction(()=>radar.paused);await p.locator('#reset').click();
  assert.deepEqual(errors,[]);console.log('PASS: all 3 snooze presses, quiet intervals, messages, automatic actual photo, manual next-to-chat, looping Radar and manual S.');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});

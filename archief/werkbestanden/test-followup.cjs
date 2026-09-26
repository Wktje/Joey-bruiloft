const {chromium}=require('/Users/openclawwillem/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path=require('path'),assert=require('assert');
(async()=>{
 const b=await chromium.launch({executablePath:'/Users/openclawwillem/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',headless:true});
 try{
  const p=await b.newPage({viewport:{width:1600,height:1000}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('file://'+path.resolve('outputs/Joel-telefoonformat.html'));
  const t=await p.evaluate(()=>getFilmTiming()),f=t.followup;assert(f);console.log('Duration:',t.duration);
  await p.evaluate(t=>renderAt(t),f.start-.1);assert(!(await p.locator('#followupChat').isVisible()));
  await p.evaluate(t=>renderAt(t),f.start+.2);assert(await p.locator('#followupChat').isVisible());assert(await p.evaluate(()=>document.querySelector('#followupChat').getBoundingClientRect().left>document.querySelector('#stage').getBoundingClientRect().left));
  await p.evaluate(t=>renderAt(t),f.start+.8);assert.equal(await p.locator('#followup-chatName').innerText(),'maaike mn liefste');assert.deepEqual(await p.locator('.followup-incoming-text').allTextContents(),['Joel… ben je al wakker?']);
  await p.evaluate(t=>renderAt(t),f.incoming+.5);assert.deepEqual(await p.locator('.followup-incoming-text').allTextContents(),['Joel… ben je al wakker?','Hopelijk ben op tijd hersteld voor je bruiloft']);
  await p.evaluate(t=>renderAt(t),f.reply.start+1);assert(await p.locator('#followup-iosKeyboard').isVisible());const partial=await p.locator('#followupDraft').innerText();assert(partial.length>1&&partial.length<f.reply.text.length);
  await p.evaluate(t=>renderAt(t),f.reply.end+.1);assert.equal(await p.locator('#followupDraft').innerText(),'Ja, ik hoop dat ik dan weer mag drinken.');
  await p.evaluate(t=>renderAt(t),t.duration-.2);assert.equal(await p.locator('#followupChat .outgoing-text').innerText(),f.reply.text);assert(!(await p.locator('#followup-iosKeyboard').isVisible()));
  await p.getByRole('button',{name:/Eerste foto ·/}).click();assert(!(await p.locator('#followupChat').isVisible()));assert.equal(await p.locator('#chatName').innerText(),'Geert');
  await p.locator('#followupReply').fill('Een aangepast antwoord.');const newTiming=await p.evaluate(()=>getFilmTiming());assert.equal(newTiming.followup.reply.text,'Een aangepast antwoord.');
  const dl=p.waitForEvent('download');await p.locator('#saveEditable').click();await (await dl).saveAs(path.resolve('work/followup-saved.html'));
  const saved=await b.newPage();saved.on('pageerror',e=>errors.push(e.message));await saved.goto('file://'+path.resolve('work/followup-saved.html'));assert.equal(await saved.locator('#followupReply').inputValue(),'Een aangepast antwoord.');assert.equal(await saved.locator('#followupChat').count(),1);
  await p.locator('#followupEnabled').uncheck();assert.equal(await p.evaluate(()=>getFilmTiming().followup),null);
  assert.deepEqual(errors,[]);console.log('PASS: slide transition, earlier message, exact incoming/reply text, keyboard typing, seek back, editable followup, HTML save/reopen and disable.');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});

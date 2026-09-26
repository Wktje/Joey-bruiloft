const {chromium}=require('/Users/openclawwillem/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {spawn}=require('child_process');
const fs=require('fs');
const path=require('path');
(async()=>{
 const browser=await chromium.launch({executablePath:'/Users/openclawwillem/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('file://'+path.resolve('outputs/Joel-telefoonformat.html')+'?render=1');
  const timing=await page.evaluate(()=>window.getFilmTiming());
  fs.writeFileSync('work/video-timing.json',JSON.stringify(timing,null,2));
  await page.evaluate(t=>renderAt(t),timing.messages.at(-1)+.4);
  await page.evaluate(()=>Promise.all(Array.from(document.images).filter(i=>i.src).map(i=>i.decode().catch(()=>{}))));
  await page.screenshot({path:'outputs/Joel-voorbeeld.png'});
  await page.evaluate(t=>renderAt(t),timing.chatOpen+1);await page.locator('#chatPhoto').evaluate(i=>i.decode());
  await page.screenshot({path:'outputs/Joel-whatsapp-chat-voorbeeld.png'});
  await page.evaluate(t=>renderAt(t),timing.snoozes[0]+1.5);await page.screenshot({path:'outputs/Joel-sluimerafteller-voorbeeld.png'});
  await page.evaluate(t=>renderAt(t),timing.introDuration*.8);await page.screenshot({path:'outputs/Joel-documentaire-intro-voorbeeld.png'});
  await page.evaluate(t=>renderAt(t),timing.replies.at(-1).send+.6);await page.screenshot({path:'outputs/Joel-chat-berichten-voorbeeld.png'});
  await page.evaluate(t=>renderAt(t),timing.photoSend+1);await page.locator('#replyPhotoImage').evaluate(i=>i.decode());
  await page.screenshot({path:'outputs/Joel-foto-na-chat-voorbeeld.png'});
  if(timing.followup){for(const [name,t]of [['overgang',timing.followup.start+.22],['eerder',timing.followup.start+.9],['typen',timing.followup.reply.end+.15],['klaar',timing.duration-.5]]){await page.evaluate(t=>renderAt(t),t);await page.screenshot({path:'work/maaike-'+name+'.png'})}await page.screenshot({path:'outputs/Joel-maaike-chat-voorbeeld.png'});}
  await page.evaluate(()=>{document.body.classList.remove('render')});await page.screenshot({path:'outputs/Joel-bewerkbaar-format-voorbeeld.png'});await page.evaluate(()=>{document.body.classList.add('render')});
  if(process.argv.includes('--video')||process.argv.includes('--intro')||process.argv.includes('--tail')){
   const introOnly=process.argv.includes('--intro');
   const tailOnly=process.argv.includes('--tail'),offset=tailOnly?timing.photoSend:0;
   const enc=spawn('/opt/homebrew/bin/ffmpeg',['-y','-loglevel','error','-f','image2pipe','-vcodec','mjpeg','-framerate','25','-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',introOnly?'work/intro-silent.mp4':tailOnly?'work/photo-tail-silent.mp4':'work/silent.mp4'],{stdio:['pipe','inherit','inherit']});
   const done=new Promise((resolve,reject)=>{enc.on('close',c=>c===0?resolve():reject(Error('ffmpeg '+c)));enc.on('error',reject)});
   const frames=(introOnly?timing.introDuration:timing.duration-offset)*25;
   for(let f=0;f<frames;f++){
    await page.evaluate(t=>renderAt(t),offset+f/25);
    const img=await page.screenshot({type:'jpeg',quality:94});
    if(!enc.stdin.write(img))await new Promise(r=>enc.stdin.once('drain',r));
    if(f%250===0)console.log('Frame '+f+'/'+frames);
   }
   enc.stdin.end();await done;
  }
  if(errors.length)throw Error(errors.join('\n'));
  console.log('Rendered '+timing.duration+' seconds with automatic photo chat.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});

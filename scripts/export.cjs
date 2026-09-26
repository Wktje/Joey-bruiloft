// Run from any directory. Paths for installed runtimes are optional environment overrides.
const fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const {spawn,spawnSync}=require('node:child_process');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const args=process.argv.slice(2);
function option(key,fallback){const i=args.indexOf(key);if(i<0)return fallback;if(!args[i+1]||args[i+1].startsWith('--'))throw Error('Waarde ontbreekt bij '+key);return args[i+1]}
const ffmpeg=process.env.FFMPEG_PATH||'ffmpeg';
const python=process.env.PYTHON_PATH||(process.platform==='win32'?'python':'python3');
function run(exe,args){const result=spawnSync(exe,args,{stdio:'inherit'});if(result.error)throw result.error;if(result.status!==0)throw Error(exe+' stopte met code '+result.status)}
(async()=>{
 const check=args.includes('--check');
 const html=path.resolve(option('--html',path.join(root,'outputs/Joel-telefoonformat.html')));
 const project=option('--project',null);
 const scene=Number(option('--scene','1'));if(!Number.isInteger(scene)||scene<1||scene>5)throw Error('--scene moet 1 t/m 5 zijn');
 const output=path.resolve(option('--output',path.join(root,'outputs/Joel-nieuwe-export.mp4')));
 if(!check&&fs.existsSync(output)&&!args.includes('--overwrite'))throw Error('Bestand bestaat al. Kies een andere --output of geef --overwrite mee.');
 const scratch=path.join(root,'work-export');fs.mkdirSync(scratch,{recursive:true});
 const job=fs.mkdtempSync(path.join(scratch,'run-'));
 if(!check){run(ffmpeg,['-version']);run(python,['--version'])}
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH}:{})});
 let timing;
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const url=pathToFileURL(html);url.searchParams.set('render','1');await page.goto(url.href);
  if(project)await page.evaluate(c=>window.setConfig(c),JSON.parse(fs.readFileSync(path.resolve(project),'utf8')));
  await page.evaluate(index=>{const input=document.getElementById('sceneInput');input.value=String(index);input.dispatchEvent(new Event('change',{bubbles:true}))},scene-1);
  timing=await page.evaluate(()=>window.getFilmTiming());
  // Only schedule sounds for chat elements that will actually be shown.
  const chat=await page.evaluate(()=>({hasPhoto:messages().some(m=>m.photo),hasReplyPhoto:!!getConfig().replyPhotos?.[scene]}));
  if(!chat.hasPhoto){timing.replies=[];timing.followup=null;delete timing.photoSend}
  else if(!chat.hasReplyPhoto)delete timing.photoSend;
  fs.writeFileSync(path.join(job,'timing.json'),JSON.stringify(timing,null,2));
  await page.evaluate(()=>Promise.all(Array.from(document.images).filter(i=>i.src).map(i=>i.decode().catch(()=>{}))));
  await page.evaluate(t=>renderAt(t),Math.max(0,timing.duration-.2));
  await page.evaluate(()=>Promise.all(Array.from(document.images).filter(i=>i.src).map(i=>i.decode().catch(()=>{}))));
  await page.screenshot({path:path.join(job,'laatste-beeld.png')});
  if(check){if(errors.length)throw Error(errors.join('\n'));console.log('Controle geslaagd. Scène '+scene+': '+timing.duration.toFixed(2)+' sec. Voorbeeld: '+job);return}
  const encoder=spawn(ffmpeg,['-y','-loglevel','error','-f','image2pipe','-vcodec','mjpeg','-framerate','25','-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p',path.join(job,'beeld.mp4')],{stdio:['pipe','inherit','inherit']});
  let encoderError;encoder.stdin.on('error',e=>{encoderError=e});
  const completed=new Promise((resolve,reject)=>{encoder.on('error',reject);encoder.on('close',code=>code===0?resolve():reject(Error('FFmpeg stopte: '+code)))});completed.catch(()=>{});
  const frames=Math.ceil(timing.duration*25);
  for(let frame=0;frame<frames;frame++){
   if(encoderError)throw encoderError;
   await page.evaluate(t=>renderAt(t),frame/25);
   const image=await page.screenshot({type:'jpeg',quality:94});
   if(!encoder.stdin.write(image))await new Promise((resolve,reject)=>{const clean=()=>{encoder.stdin.off('drain',drain);encoder.stdin.off('error',error)};const drain=()=>{clean();resolve()};const error=e=>{clean();reject(e)};encoder.stdin.once('drain',drain);encoder.stdin.once('error',error)});
   if(frame%250===0)console.log('Beeld '+frame+' / '+frames);
  }
  encoder.stdin.end();await completed;if(errors.length)throw Error(errors.join('\n'));
 }finally{await browser.close()}
 run(ffmpeg,['-y','-loglevel','error','-i',path.join(root,'outputs/Radar-Apple.m4a'),'-ac','1','-ar','48000','-c:a','pcm_s16le',path.join(job,'radar.wav')]);
 run(python,[path.join(__dirname,'make_audio.py'),job]);
 fs.mkdirSync(path.dirname(output),{recursive:true});
 run(ffmpeg,['-y','-loglevel','error','-i',path.join(job,'beeld.mp4'),'-i',path.join(job,'geluid.wav'),'-c:v','copy','-c:a','aac','-b:a','160k','-movflags','+faststart','-shortest',output]);
 console.log('Klaar: '+output);
})().catch(e=>{console.error(e.message);process.exitCode=1});

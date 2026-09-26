const {chromium}=require('/Users/openclawwillem/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');const path=require('path');const assert=require('assert');
(async()=>{
const b=await chromium.launch({executablePath:'/Users/openclawwillem/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',headless:true});
const p=await b.newPage({viewport:{width:1440,height:1000},acceptDownloads:true});const errors=[];p.on('pageerror',e=>errors.push(e.message));
const url='file://'+path.resolve('outputs/Joel-telefoonformat.html');await p.goto(url);
for(const [name,w,h,color]of [['test-landscape',1600,900,'#537e68'],['test-portrait',800,1200,'#705b45']]){
 const src=await p.evaluate(({w,h,color,name})=>{let c=document.createElement('canvas');c.width=w;c.height=h;let x=c.getContext('2d');x.fillStyle=color;x.fillRect(0,0,w,h);x.strokeStyle='#edebda';x.lineWidth=12;x.strokeRect(20,20,w-40,h-40);x.fillStyle='#edebda';x.font='48px sans-serif';x.fillText(name,65,110);return c.toDataURL('image/png')},{w,h,color,name});fs.writeFileSync('work/'+name+'.png',Buffer.from(src.split(',')[1],'base64'));}
await p.locator('#photoInput').setInputFiles(['work/test-landscape.png','work/test-portrait.png']);await p.waitForFunction(()=>document.querySelectorAll('.photo-row').length===2);
assert.equal(await p.evaluate(()=>getConfig().photos[0].length),2);
await p.locator('#next').click();await p.locator('#next').click();await p.locator('#next').click();await p.locator('#next').click();await p.waitForFunction(()=>!document.querySelector('#photoScreen').hidden);assert.equal(await p.locator('#photoDisplay').getAttribute('alt'),'test-landscape.png');
await p.keyboard.press('Space');await p.waitForFunction(()=>document.querySelector('#photoDisplay').alt==='test-portrait.png');await p.locator('#viewport').screenshot({path:'work/photo-portrait-preview.png'});
assert.equal(await p.locator('#photoDisplay').evaluate(el=>getComputedStyle(el).objectFit),'contain');
await p.keyboard.press('ArrowLeft');await p.waitForFunction(()=>document.querySelector('#photoDisplay').alt==='test-landscape.png');
await p.keyboard.press('ArrowRight');await p.waitForFunction(()=>document.querySelector('#photoDisplay').alt==='test-portrait.png');await p.keyboard.press('ArrowRight');assert.equal(await p.locator('#photoScreen').evaluate(el=>el.hidden),true);assert.equal(await p.locator('.notice').count(),3);
await p.getByRole('button',{name:'Foto 2 naar voren',exact:true}).click();assert.equal(await p.evaluate(()=>getConfig().photos[0][0].name),'test-portrait.png');
await p.locator('#sceneInput').selectOption('1');assert.equal(await p.locator('.photo-row').count(),0);await p.locator('#photoInput').setInputFiles('work/test-landscape.png');await p.waitForFunction(()=>document.querySelectorAll('.photo-row').length===1);
const download=await Promise.all([p.waitForEvent('download'),p.locator('#save').click()]);await download[0].saveAs('work/roundtrip-project.json');
await p.reload();await p.locator('#fileInput').setInputFiles('work/roundtrip-project.json');await p.waitForFunction(()=>document.querySelectorAll('.photo-row').length===2);assert.equal(await p.evaluate(()=>getConfig().photos[1].length),1);assert.equal(await p.evaluate(()=>getConfig().photos[0][0].name),'test-portrait.png');
await p.locator('#full').click();await p.keyboard.press('f');await p.waitForFunction(()=>!document.querySelector('#photoScreen').hidden);await p.keyboard.press('t');assert.equal(await p.locator('#photoScreen').evaluate(el=>el.hidden),true);await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.fullscreenElement);
await p.getByRole('button',{name:'Verwijder foto 1',exact:true}).click();assert.equal(await p.evaluate(()=>getConfig().photos[0].length),1);
await p.locator('#fileInput').setInputFiles('outputs/Joel-teksten.json');await p.waitForFunction(()=>document.querySelectorAll('.photo-row').length===0);assert.equal(await p.evaluate(()=>getConfig().scenes[0][0].sender),JSON.parse(fs.readFileSync('outputs/Joel-teksten.json')).scenes[0][0].sender);
await p.locator('#photoInput').setInputFiles('work/roundtrip-project.json');await p.waitForFunction(()=>document.querySelector('#error').textContent.includes('gebruik JPG'));assert.equal(await p.locator('.photo-row').count(),0);
assert.deepEqual(errors,[]);console.log('PASS: photo upload, portrait/landscape, message-to-photo sequence, keyboard forward/back, phone return, reorder, scene isolation, save/load with embedded photos, fullscreen, delete, legacy import, unsupported file handling.');await b.close();
})().catch(e=>{console.error(e);process.exit(1)});

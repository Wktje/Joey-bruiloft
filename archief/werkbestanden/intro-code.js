const INTRO={duration:12,fadeStart:10.4};
let introMix=0,introOnly=false,lastIntroSound=-1;
const introPlane=document.createElement('div');introPlane.id='introPlane';introPlane.hidden=true;
introPlane.innerHTML='<div class="intro-copy"><div class="intro-eyebrow" id="introScene"></div><div class="intro-rule"></div><div class="intro-row"><div class="intro-label">DATUM</div><div class="intro-value" id="introDate"></div></div><div class="intro-row"><div class="intro-label">TIJD</div><div class="intro-value" id="introTime"></div></div><div class="intro-row"><div class="intro-label">PLAATS</div><div class="intro-value" id="introPlace"></div></div></div>';
$('viewport').append(introPlane);
const offScreen=document.createElement('div');offScreen.id='phoneOff';offScreen.hidden=true;$('stage').append(offScreen);
function sceneMeta(){return {...{date:config.date,time:config.time,location:config.location},...(config.sceneIntros?.[scene]||{})}}
function introLines(){const m=sceneMeta();return [
 {id:'introDate',text:m.date.toUpperCase(),start:.9,end:3.7},
 {id:'introTime',text:m.time+' UUR',start:4.3,end:5.5},
 {id:'introPlace',text:m.location.toUpperCase(),start:6.2,end:8.5}
].map(line=>({...line,keys:Array.from(line.text,(_,i)=>line.start+(i+1)/line.text.length*(line.end-line.start))}))}
function clearIntro(){introMix=0;introPlane.hidden=true;offScreen.hidden=true;fit()}
function renderIntro(t){
 if(t>=INTRO.duration||t<0){clearIntro();return}
 const p=Math.max(0,Math.min(1,(t-INTRO.fadeStart)/(INTRO.duration-INTRO.fadeStart)));
 const eased=p*p*(3-2*p);introMix=1-eased;
 introPlane.hidden=false;introPlane.style.opacity=1-Math.min(1,p*1.8);
 offScreen.hidden=false;offScreen.style.opacity=1-Math.max(0,(p-.55)/.45);
 $('introScene').textContent='RECONSTRUCTIE  /  SCÈNE '+String(scene+1).padStart(2,'0');
 for(const line of introLines()){
  const field=$(line.id);const count=line.keys.filter(k=>k<=t).length;
  field.textContent=line.text.slice(0,count);field.parentElement.style.opacity=t>=line.start-.15?1:0;
  if(t>=line.start&&t<line.end+.45&&Math.floor(t*3)%2===0){const cursor=document.createElement('span');cursor.className='intro-cursor';cursor.textContent='▌';field.append(cursor)}
 }
 fit();
}
window.renderAt=function(t){window.renderSceneAt(Math.max(0,t-INTRO.duration));renderIntro(t)};
window.getFilmTiming=()=>{
 const shift=INTRO.duration;
 return {...DEMO,duration:DEMO.duration+shift,introDuration:shift,introKeys:introLines().flatMap(l=>l.keys),
 ringStarts:DEMO.ringStarts.map(t=>t+shift),snoozes:DEMO.snoozes.map(t=>t+shift),ringStops:DEMO.ringStops.map(t=>t+shift),messages:DEMO.messages.map(t=>t+shift),
 photoTap:DEMO.photoTap+shift,chatOpen:DEMO.chatOpen+shift,keyboardOpen:DEMO.keyboardOpen+shift,keyboardClose:DEMO.keyboardClose+shift,
 replies:DEMO.replies.map(r=>({...r,start:r.start+shift,end:r.end+shift,send:r.send+shift,keys:r.keys.map(t=>t+shift)}))};
};
function typewriterTone(){
 const c=audio();if(!c)return;
 const buffer=c.createBuffer(1,Math.ceil(c.sampleRate*.055),c.sampleRate),data=buffer.getChannelData(0);
 for(let i=0;i<data.length;i++){const t=i/c.sampleRate;data[i]=.1*((Math.random()*2-1)*Math.exp(-t*100)+.45*Math.sin(2*Math.PI*1650*t)*Math.exp(-t*65))}
 const source=c.createBufferSource();source.buffer=buffer;source.connect(c.destination);source.start();
}
function playIntroSounds(t){if(t<lastIntroSound)lastIntroSound=-1;if(t<INTRO.duration&&introLines().some(l=>l.keys.some(k=>k>lastIntroSound&&k<=t)))typewriterTone();lastIntroSound=t}
const introButton=document.createElement('button');introButton.id='introPreview';introButton.textContent='Speel scène-intro · 12 sec.';$('demo').before(introButton);
introButton.onclick=()=>{stop();audio();introOnly=true;playing=true;start=performance.now();lastIntroSound=-1;lastEvent=-1;demoRing=-1;raf=requestAnimationFrame(tick)};

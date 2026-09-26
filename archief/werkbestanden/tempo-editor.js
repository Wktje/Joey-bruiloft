const TEMPO_DEFAULTS={intro:8,alarm:8,snoozePause:3,messageGap:3,openPhotoDelay:2,firstPhotoHold:5,typingSpeed:9,replyGap:1.2,finalPhotoDelay:1.5,lastPhotoHold:6};
const TEMPO_FIELDS=[
 ['intro','Documentaire-intro',5,16,.5,'sec.'],['alarm','Wekker: tijd voor de acteur',3,15,.5,'sec.'],['snoozePause','Pauze na snoozen',2,8,.5,'sec.'],
 ['messageGap','Tussen binnenkomende appjes',1,10,.5,'sec.'],['openPhotoDelay','Wachten tot de foto opent',.8,8,.2,'sec.'],['firstPhotoHold','Eerste foto bekijken',2,20,.5,'sec.'],
 ['typingSpeed','Joels typsnelheid',3,20,1,'letters/sec.'],['replyGap','Pauze tussen Joels berichten',.3,6,.1,'sec.'],['finalPhotoDelay','Wachten op Joels foto',.8,8,.2,'sec.'],['lastPhotoHold','Joels foto bekijken',2,20,.5,'sec.']
];
function sceneTempo(){const custom=config.sceneTiming?.[scene]||{};const result={};for(const [key,,min,max]of TEMPO_FIELDS){const v=Number(custom[key]??TEMPO_DEFAULTS[key]);result[key]=Number.isFinite(v)?Math.min(max,Math.max(min,v)):TEMPO_DEFAULTS[key]}result.alarmEnabled=custom.alarmEnabled??scene===0;return result}
function sceneReplies(){return (config.replies?.[scene]||[]).filter(t=>typeof t==='string'&&t.trim()).slice(0,3)}
function formatDuration(seconds){const s=Math.ceil(seconds);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function rebuildTimeline(){
 const p=sceneTempo();INTRO.duration=p.intro;INTRO.fadeStart=p.intro-1.2;
 const cycle=p.alarm+p.snoozePause;DEMO.ringStarts=p.alarmEnabled?[0,cycle,cycle*2]:[];
 DEMO.snoozes=DEMO.ringStarts.map(t=>t+p.alarm);DEMO.ringStops=DEMO.snoozes.map(t=>t+.28);DEMO.alarmEnd=p.alarmEnabled?cycle*3:0;
 DEMO.messages=messages().map((_,i)=>DEMO.alarmEnd+.6+i*p.messageGap);
 const last=DEMO.messages.at(-1)??DEMO.alarmEnd;
 DEMO.chatOpen=last+p.openPhotoDelay;DEMO.photoTap=DEMO.chatOpen-.5;DEMO.keyboardOpen=DEMO.chatOpen+p.firstPhotoHold;
 let cursor=DEMO.keyboardOpen+.6;
 DEMO.replies=sceneReplies().map(text=>{const r={text,start:cursor,end:cursor+Math.max(1.3,text.length/p.typingSpeed)};r.send=r.end+.55;cursor=r.send+p.replyGap;let units=0;const marks=[];for(let i=0;i<text.length;i++){units+=1+(i%7)*.07+(/[,?.]/.test(text[i])?2.8:text[i]===' '?.5:0);marks.push(units)}r.keys=marks.map(v=>r.start+v/units*(r.end-r.start));return r});
 const hasChat=messages().some(m=>m.photo),hasReplies=hasChat&&DEMO.replies.length>0;
 DEMO.keyboardClose=hasReplies?DEMO.replies.at(-1).send+.65:DEMO.keyboardOpen;
 DEMO.photoSend=hasReplies?Math.max(DEMO.keyboardClose+.4,DEMO.replies.at(-1).send+p.finalPhotoDelay):DEMO.chatOpen+p.firstPhotoHold;
 DEMO.duration=hasChat?(config.replyPhotos?.[scene]?DEMO.photoSend+p.lastPhotoHold:hasReplies?DEMO.keyboardClose+3:DEMO.chatOpen+p.firstPhotoHold):last+3;
 updateTempoSummary();
}
let previewPosition=0;
function updateTempoSummary(){
 const full=DEMO.duration+INTRO.duration;$('demo').textContent='Speel vanaf begin · '+formatDuration(full);introButton.textContent='Speel scène-intro · '+INTRO.duration+' sec.';
 const sum=$('tempoSummary');if(sum)sum.textContent='Deze scène duurt '+formatDuration(full)+'. Alle tijden hieronder zijn aanpasbaar.';
 const seek=$('previewSeek');if(seek)seek.max=full;
 const list=$('cueButtons');if(list){list.replaceChildren();const cues=[['Intro',0],...(DEMO.ringStarts.length?[['Wekker',INTRO.duration]]:[]),['Appjes',INTRO.duration+(DEMO.messages[0]??0)],...(messages().some(m=>m.photo)?[['Eerste foto',INTRO.duration+DEMO.chatOpen+.5],...(DEMO.replies.length?[['Joel typt',INTRO.duration+DEMO.keyboardOpen]]:[]),...(config.replyPhotos?.[scene]?[['Laatste foto',INTRO.duration+DEMO.photoSend+.7]]:[])]:[])];for(const [label,time]of cues){const b=document.createElement('button');b.textContent=label+' · '+formatDuration(time);b.onclick=()=>seekPreview(time);list.append(b)}}
}
function seekPreview(t){stop();introOnly=false;renderAt(Math.max(0,Math.min(t,DEMO.duration+INTRO.duration)));$('pausePreview').textContent='Verder afspelen';$('state').textContent='Voorbeeld gepauzeerd · pas tijden aan of speel verder.'}
function resumePreview(){stop();introOnly=false;audio();const t=previewPosition>=DEMO.duration+INTRO.duration?0:previewPosition;start=performance.now()-t*1000;lastIntroSound=t;lastReplySoundTime=t-INTRO.duration;lastEvent=DEMO.messages.filter(m=>m<=t-INTRO.duration).length-1;demoRing=-1;playing=true;raf=requestAnimationFrame(tick)}
const previewPanel=document.createElement('div');previewPanel.className='preview-panel';previewPanel.innerHTML='<div class="preview-head"><button id="pausePreview">Verder afspelen</button><span id="previewReadout">0:00</span></div><label class="small" for="previewSeek">Spring naar een moment in de scène</label><input id="previewSeek" type="range" min="0" max="129" step="0.04" value="0"><div id="cueButtons" class="cue-buttons"></div>';
document.querySelector('.toolbar').after(previewPanel);
$('previewSeek').oninput=e=>seekPreview(Number(e.target.value));$('pausePreview').onclick=()=>{if(playing){stop();$('pausePreview').textContent='Verder afspelen'}else resumePreview()};
const tempoPanel=document.createElement('section');tempoPanel.className='tempo-panel';tempoPanel.innerHTML='<h2>Tempo van deze scène</h2><p id="tempoSummary" class="small"></p><div class="tempo-presets"><button id="tempoFast">Vlot</button><button id="tempoActing">Meer acteertijd</button></div><label class="check-label"><input id="alarmEnabled" type="checkbox"> Drie wekkermomenten met snoozen</label><div id="tempoFields"></div><h2>Joel typt terug</h2><p class="small">Deze berichten verschijnen na de eerste foto. Een leeg vak wordt overgeslagen.</p><div id="replyFields"></div><h3>Foto na Joels berichten</h3><div id="replyPhotoEditor"></div><h3>Bewaren</h3><button id="saveEditable">Download mijn bewerkbare format</button><p class="small">Bewaart alle teksten, foto’s en tijden in één HTML-bestand. Open dat later om verder te werken. Met Bewaar project kun je de instellingen ook als JSON bewaren. De MP4-download is een vaste export; stuur je opgeslagen project terug voor een nieuwe MP4.</p>';
document.querySelector('.panel h2').after(tempoPanel);
const tempoFields=$('tempoFields');for(const [key,label,min,max,step,unit]of TEMPO_FIELDS){const row=document.createElement('label');row.className='tempo-field';const text=document.createElement('span');text.textContent=label;const input=document.createElement('input');input.id='tempo-'+key;input.type='number';input.min=min;input.max=max;input.step=step;input.setAttribute('aria-label',label);const suffix=document.createElement('small');suffix.textContent=unit;row.append(text,input,suffix);tempoFields.append(row);input.onchange=()=>{config.sceneTiming??=Array.from({length:5},()=>({}));config.sceneTiming[scene]??={};const v=Number(input.value);config.sceneTiming[scene][key]=Number.isFinite(v)?Math.min(max,Math.max(min,v)):TEMPO_DEFAULTS[key];input.value=config.sceneTiming[scene][key];reset()}}
$('alarmEnabled').onchange=()=>{config.sceneTiming??=Array.from({length:5},()=>({}));config.sceneTiming[scene]??={};config.sceneTiming[scene].alarmEnabled=$('alarmEnabled').checked;reset()};
function applyTempoPreset(p){const enabled=sceneTempo().alarmEnabled;config.sceneTiming??=Array.from({length:5},()=>({}));config.sceneTiming[scene]={...p,alarmEnabled:enabled};bind()}
$('tempoFast').onclick=()=>applyTempoPreset(TEMPO_DEFAULTS);$('tempoActing').onclick=()=>applyTempoPreset({...TEMPO_DEFAULTS,alarm:10,snoozePause:4,messageGap:4,firstPhotoHold:7,typingSpeed:7,replyGap:2,lastPhotoHold:8});
function renderTempoEditor(){
 const p=sceneTempo();for(const [key]of TEMPO_FIELDS)$('tempo-'+key).value=p[key];$('alarmEnabled').checked=p.alarmEnabled;
 const replies=$('replyFields');replies.replaceChildren();for(let i=0;i<3;i++){const label=document.createElement('label');label.textContent='Bericht '+(i+1)+' van Joel';const field=document.createElement('textarea');field.maxLength=220;field.value=config.replies?.[scene]?.[i]||'';field.setAttribute('aria-label',label.textContent);field.oninput=()=>{config.replies??=Array.from({length:5},()=>[]);config.replies[scene]??=[];config.replies[scene][i]=field.value;reset()};replies.append(label,field)}
 const wrap=$('replyPhotoEditor');wrap.replaceChildren();const photo=config.replyPhotos?.[scene];if(photo){const img=document.createElement('img');img.className='reply-photo-editor-thumb';img.src=photo.src;img.alt=photo.name;wrap.append(img)}
 const input=document.createElement('input');input.type='file';input.accept='image/jpeg,image/png,image/webp';input.hidden=true;const button=document.createElement('button');button.textContent=photo?'Foto vervangen':'Foto kiezen';button.onclick=()=>input.click();input.onchange=async()=>{const file=input.files[0];if(!file)return;const target=scene;button.disabled=true;try{const image=await readPhoto(file);config.replyPhotos??=Array(5).fill(null);config.replyPhotos[target]=image;if(scene===target)bind()}catch(e){$('error').textContent=e.message}finally{button.disabled=false}};wrap.append(button,input);
 if(photo){const remove=document.createElement('button');remove.textContent='Foto verwijderen';remove.onclick=()=>{config.replyPhotos[scene]=null;bind()};wrap.append(remove)}
}
$('saveEditable').onclick=()=>{const data=JSON.stringify(config).replace(/</g,'\\u003c');const source=EDITABLE_TEMPLATE.replace(/^const initial=.*;$/m,()=>('const initial='+data+';'));const url=URL.createObjectURL(new Blob([source],{type:'text/html;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Joel-mijn-bewerkbare-format.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};

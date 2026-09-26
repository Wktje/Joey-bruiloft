const followupChat=$('chatScreen').cloneNode(true);followupChat.id='followupChat';followupChat.hidden=true;followupChat.style.zIndex='8';
for(const el of followupChat.querySelectorAll('[id]'))el.id='followup-'+el.id;
const followBody=followupChat.querySelector('.chat-body');followBody.replaceChildren();$('stage').append(followupChat);
const followKeyboard=followupChat.querySelector('.ios-keyboard'),followDraft=followupChat.querySelector('.chat-input'),followSend=followupChat.querySelector('.chat-send');
function followupConfig(){return config.followupChats?.[scene]||null}
function followupBubble(text,clock,outgoing=false,progress=1){
 const bubble=document.createElement('div');bubble.className=outgoing?'outgoing':'followup-incoming';const copy=document.createElement('div');copy.className=outgoing?'outgoing-text':'followup-incoming-text';copy.textContent=text;
 const meta=document.createElement('div');meta.className='outgoing-meta';meta.textContent=clock+(outgoing?'  ✓✓':'');bubble.append(copy,meta);bubble.style.opacity=progress;bubble.style.transform='translateY('+((1-progress)*25)+'px)';return bubble;
}
function renderFollowup(t,clock){
 const f=DEMO.followup,c=followupConfig();const active=!!f&&!!c&&t>=f.start;
 followupChat.hidden=!active;
 if(!active){followBody.replaceChildren();return}
 attachmentOpen=true;const p=Math.max(0,Math.min(1,(t-f.start)/.6)),ease=1-Math.pow(1-p,3);
 $('chatScreen').style.transform='translateX('+(-330*ease)+'px)';$('chatScreen').style.opacity=1-.2*ease;
 followupChat.style.opacity=1;followupChat.style.transform='translateX('+((1-ease)*1080)+'px)';followupChat.classList.add('replying');
 $('followup-chatName').textContent=c.name;$('followup-chatAvatar').textContent=c.name.trim().charAt(0).toUpperCase();$('followup-chatClock').textContent=clock;
 followupChat.querySelector('.chat-online').textContent=t>=f.start+.7&&t<f.incoming?'aan het typen…':'online';
 followBody.replaceChildren();const day=document.createElement('div');day.className='followup-day';day.textContent='Vandaag';followBody.append(day);
 const earlier=config.scenes[scene][0]?.text||'';if(earlier)followBody.append(followupBubble(earlier,clock));
 if(t>=f.incoming)followBody.append(followupBubble(c.incoming,clock,false,Math.min(1,(t-f.incoming)/.3)));
 const r=f.reply;if(t>=r.send)followBody.append(followupBubble(r.text,clock,true,Math.min(1,(t-r.send)/.3)));
 const lift=Math.max(0,Math.min(1,(t-f.keyboardOpen)/.4))*Math.max(0,Math.min(1,(f.keyboardClose+.4-t)/.4));
 followupChat.classList.toggle('keyboard-open',lift>0);followKeyboard.hidden=lift<=0;followKeyboard.style.height=(740*lift)+'px';
 const count=t<r.send?r.keys.filter(k=>k<=t).length:0;const value=count?r.text.slice(0,count):'';
 followupChat.classList.toggle('has-draft',!!value);followDraft.replaceChildren();const text=document.createElement('span');text.className=value?'':'placeholder';text.id='followupDraft';text.textContent=value||'Bericht';followDraft.append(text);
 if(lift>0){const caret=document.createElement('span');caret.className='typing-caret';caret.style.opacity=Math.floor(t*2)%2?'0':'1';followDraft.append(caret)}
 followKeyboard.querySelectorAll('.pressed').forEach(k=>k.classList.remove('pressed'));
 if(count&&t-r.keys[count-1]<.12){const key=r.text[count-1].toLowerCase();const target=Array.from(followKeyboard.querySelectorAll('[data-key]')).find(e=>e.dataset.key===(key===' '?'spatie':key));target?.classList.add('pressed')}
 pressVisual(followSend,t>=r.send-.4&&t<r.send?(t-r.send+.4)/.4:0);followBody.scrollTop=followBody.scrollHeight;
}
followupChat.querySelector('.chat-back').onclick=()=>seekPreview(INTRO.duration+DEMO.followup.start-.2);
function buildFollowupTimeline(p){
 const c=followupConfig();DEMO.followup=null;
 if(!c?.enabled||!c.name.trim()||!c.incoming.trim()||!c.reply.trim()||!messages().some(m=>m.photo))return;
 const f={start:DEMO.duration};f.incoming=f.start+2;f.keyboardOpen=f.incoming+p.messageGap;
 const r={text:c.reply,start:f.keyboardOpen+.5};r.end=r.start+Math.max(1.3,r.text.length/p.typingSpeed);r.send=r.end+.55;
 let units=0;const marks=[];for(let i=0;i<r.text.length;i++){units+=1+(i%7)*.07+(/[,?.]/.test(r.text[i])?2.8:r.text[i]===' '?.5:0);marks.push(units)}r.keys=marks.map(v=>r.start+v/units*(r.end-r.start));
 f.reply=r;f.keyboardClose=r.send+.7;DEMO.followup=f;DEMO.duration=f.keyboardClose+3;
}
const followEditor=document.createElement('section');followEditor.className='followup-editor';followEditor.innerHTML='<h2>Daarna naar een andere chat</h2><label class="check-label"><input type="checkbox" id="followupEnabled"> Vervolgchat laten zien</label><p class="small">Het eerste ontvangen appje van deze scène staat hier al in de chat. De pauze vóór Joels antwoord en zijn typsnelheid volgen de tempo-instellingen hierboven.</p><label for="followupName">Naam van het contact</label><input id="followupName" maxlength="35"><label for="followupIncoming">Nieuw bericht van het contact</label><textarea id="followupIncoming" maxlength="220"></textarea><label for="followupReply">Antwoord van Joel</label><textarea id="followupReply" maxlength="220"></textarea>';
$('replyPhotoEditor').after(followEditor);
function renderFollowupEditor(){const c=followupConfig()||{enabled:false,name:'',incoming:'',reply:''};$('followupEnabled').checked=c.enabled;for(const [id,key]of [['followupName','name'],['followupIncoming','incoming'],['followupReply','reply']])$(id).value=c[key]}
for(const [id,key]of [['followupEnabled','enabled'],['followupName','name'],['followupIncoming','incoming'],['followupReply','reply']])$(id).addEventListener(id==='followupEnabled'?'change':'input',()=>{config.followupChats??=Array(5).fill(null);config.followupChats[scene]??={enabled:false,name:'',incoming:'',reply:''};config.followupChats[scene][key]=key==='enabled'?$(id).checked:$(id).value;if(key==='name')config.scenes[scene][0].sender=$(id).value;reset()});

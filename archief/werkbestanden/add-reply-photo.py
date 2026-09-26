import base64,json,re,shutil
from pathlib import Path
src=Path('/Users/openclawwillem/Library/Containers/net.whatsapp.WhatsApp/Data/tmp/documents/78AE1F81-E194-4022-BF2A-42E8B9D88C98/PHOTO-2026-09-24-16-04-48.jpg')
shutil.copyfile(src,'outputs/Joel-foto-na-chat.jpg')
photo={'name':src.name,'src':'data:image/jpeg;base64,'+base64.b64encode(src.read_bytes()).decode()}
p=Path('outputs/Joel-telefoonformat.html');s=p.read_text()
match=re.search(r'^const initial=(.*);$',s,re.M);initial=json.loads(match.group(1))
initial['replyPhotos']=[photo,None,None,None,None]
s=s[:match.start()]+'const initial='+json.dumps(initial,ensure_ascii=False,separators=(',',':'))+';'+s[match.end():]
Path('outputs/Joel-project-met-foto.json').write_text(json.dumps(initial,ensure_ascii=False,indent=2))
def change(old,new):
 global s
 assert old in s,old[:120]
 s=s.replace(old,new)
change('const DEMO={duration:105,','const DEMO={duration:117,photoSend:105,')
change('function renderReplies(t,clock){', '''const replyPhotoBubble=document.createElement('div');replyPhotoBubble.className='reply-photo-bubble';replyPhotoBubble.id='replyPhotoBubble';replyPhotoBubble.hidden=true;
const replyPhotoImage=document.createElement('img');replyPhotoImage.id='replyPhotoImage';replyPhotoImage.alt='Foto verstuurd door Joel';
const replyPhotoMeta=document.createElement('div');replyPhotoMeta.className='outgoing-meta';replyPhotoBubble.append(replyPhotoImage,replyPhotoMeta);document.querySelector('.chat-body').append(replyPhotoBubble);
function renderReplies(t,clock){''')
change(" if(!active){draft.innerHTML=originalCompose;body.scrollTop=0}else{body.scrollTop=body.scrollHeight}",""" const photo=config.replyPhotos?.[scene];const showPhoto=Boolean(photo)&&t>=DEMO.photoSend;
 replyPhotoBubble.hidden=!showPhoto;
 if(showPhoto){
  if(replyPhotoImage.getAttribute('src')!==photo.src)replyPhotoImage.src=photo.src;
  replyPhotoImage.alt=photo.name;replyPhotoMeta.textContent=clock+'  '+(t<DEMO.photoSend+.5?'✓':'✓✓');body.append(replyPhotoBubble);
  const p=Math.max(0,Math.min(1,(t-DEMO.photoSend)/.55));replyPhotoBubble.style.opacity=p;replyPhotoBubble.style.transform='translateY('+((1-p)*55)+'px)';
  const target=Math.max(0,body.scrollHeight-body.clientHeight);body.scrollTop=target*(p*p*(3-2*p));
 }else if(!active){draft.innerHTML=originalCompose;body.scrollTop=0}else{body.scrollTop=body.scrollHeight}""")
change('lastReplySoundTime=t}',"if(config.replyPhotos?.[scene]&&DEMO.photoSend>lastReplySoundTime&&DEMO.photoSend<=t)replyTone('send');lastReplySoundTime=t}")
change("Video afgelopen · Joels drie berichten blijven staan.","Video afgelopen · Joels foto blijft in de chat staan.")
change('photoTap:DEMO.photoTap+shift,','photoSend:DEMO.photoSend+shift,photoTap:DEMO.photoTap+shift,')
change('  return result;',"  result.replyPhotos??=Array(5).fill(null);if(!Array.isArray(result.replyPhotos)||result.replyPhotos.length!==5||result.replyPhotos.some(p=>p&&!validImage(p)))throw Error('Ongeldige verzonden foto');\n  return result;")
change('</style>', '''.reply-photo-bubble{width:86%;align-self:flex-end;flex:none;background:#d9fdd3;border-radius:28px 28px 5px 28px;padding:14px 14px 12px;box-shadow:0 2px 5px #00000012;transform-origin:bottom right}.reply-photo-bubble[hidden]{display:none}.reply-photo-bubble img{display:block;width:100%;height:1100px;object-fit:contain;border-radius:18px}.reply-photo-bubble .outgoing-meta{padding:2px 10px;color:#70816e}
</style>''')
change('Concept 10 · documentaire-intro en chat','Concept 11 · documentaire-intro, chat en foto')
change("Speel video · 1:57","Speel video · 2:09")
change('Joel-film-met-documentaire-intro.mp4','Joel-film-met-foto-na-chat.mp4')
change('Download video met scène-intro (MP4)','Download video met nieuwe foto (MP4)')
change('1 minuut en 57 seconden','2 minuten en 9 seconden')
change('Vanaf 1:21 typt Joel terug. Alles speelt automatisch.','Vanaf 1:21 typt Joel terug. Op 1:57 verstuurt hij de nieuwe foto, die twaalf seconden in beeld blijft. Alles speelt automatisch.')
p.write_text(s)

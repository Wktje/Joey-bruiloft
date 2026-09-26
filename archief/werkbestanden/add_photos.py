from pathlib import Path
p=Path('outputs/Joel-telefoonformat.html')
s=p.read_text()
s=s.replace('</style>', '''
button:disabled{opacity:.4;cursor:default}
.photo-screen{position:absolute;inset:0;z-index:5;background:#09110e;display:flex;align-items:center;justify-content:center}
.photo-screen[hidden]{display:none}.photo-screen img{display:block;width:100%;height:100%;object-fit:contain}
.photo-section{margin-top:24px;padding-top:21px;border-top:1px solid #344a40}.photo-section h3{margin:0 0 10px;font-size:17px}.photo-section>button{width:100%;margin-top:8px}
.photo-list{display:flex;flex-direction:column;gap:10px;margin-top:14px}.photo-row{padding:9px;background:#14211c;border:1px solid #344a40;border-radius:9px;display:grid;grid-template-columns:65px minmax(0,1fr);gap:10px;align-items:center}
.photo-thumb{width:65px;height:62px;padding:0;overflow:hidden;background:#08120d}.photo-thumb img{display:block;width:100%;height:100%;object-fit:cover}.photo-name{font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:7px}.photo-actions{display:flex;gap:5px}.photo-actions button{padding:4px 7px;font-size:12px}.photo-empty{color:#a9beb2;font-size:13px;line-height:1.5}.photo-section .small{margin:8px 0}
</style>''')
s=s.replace('Concept 01 ·', 'Concept 02 ·')
s=s.replace('</div></div></div>\n<div class="toolbar">','</div><div id="photoScreen" class="photo-screen" hidden><img id="photoDisplay" alt="Foto bij de herinnering"></div></div></div>\n<div class="toolbar">')
s=s.replace('<button id="reset">Leeg scherm</button>', '<button id="photosButton" disabled>Toon foto’s</button><button id="phoneButton" hidden>Terug naar telefoon</button><button id="reset">Leeg scherm</button>')
s=s.replace('spatie / → = volgend appje · ← = vorig appje · R = leeg scherm', 'spatie / → = volgend appje of foto · ← = terug · F = foto’s · T = telefoon · R = leeg scherm')
s=s.replace('De appjes blijven staan tot de bediener verdergaat. Flashbackvideo’s voeg je later toe in de montage.', 'Na de appjes verschijnen de foto’s, één per druk op de spatiebalk. Na de laatste foto keer je terug naar de telefoon. Alles wacht op de bediener. De demo toont alleen de appjes; filmpjes voeg je later toe in de montage.')
s=s.replace('<div id="messageFields"></div>', '''<div id="messageFields"></div>
<section class="photo-section"><h3>Foto’s bij deze scène</h3><p class="small">Liggend of staand: de hele foto blijft zichtbaar. Kies meerdere foto’s tegelijk en zet ze hieronder in volgorde.</p><button id="addPhotos">＋ Foto’s toevoegen</button><input id="photoInput" type="file" accept="image/jpeg,image/png,image/webp" multiple hidden><p class="small">JPG, PNG of WebP · maximaal 20 foto’s per scène. Exporteer HEIC-foto’s eerst als JPG.</p><div id="photoList" class="photo-list"></div><p id="photoStatus" class="small" role="status"></p></section>''')
s=s.replace('Bewaar teksten</button>', 'Bewaar project</button>').replace('Laad teksten</button>', 'Laad project</button>')
s=s.replace('‘Bewaar teksten’ downloadt een klein bestand met alle vijf scènes. Stuur dat bestand hier terug voor aangepaste MP4’s. De meegeleverde MP4 verandert niet automatisch mee.', '‘Bewaar project’ bewaart de teksten én foto’s van alle vijf scènes in één bestand. Bewaar vóór het sluiten: wijzigingen worden niet automatisch opgeslagen. Eerdere tekstbestanden kun je ook laden. De meegeleverde MP4 verandert niet automatisch mee.')
s=s.replace("let config=structuredClone(initial), scene=0, shown=0,", "initial.photos=Array.from({length:5},()=>[]);\nlet photoIndex=-1, photoLoad=0, importingPhotos=false;\nlet config=structuredClone(initial), scene=0, shown=0,")
s=s.replace("function show(count,animation=false){base();", "function show(count,animation=false){hidePhoto();base();")
s=s.replace("+' appjes zichtbaar';}", "+' appjes zichtbaar';updateControls();}")
s=s.replace("function next(){stop();if(shown<messages().length){shown++;show(shown,true);tone('notice')}}", """function next(){stop();if(photoIndex>=0){if(photoIndex+1<photos().length)showPhoto(photoIndex+1);else phone();return}if(shown<messages().length){shown++;show(shown,true);tone('notice')}else if(photos().length)showPhoto(0)}
function previous(){stop();if(photoIndex>0)showPhoto(photoIndex-1);else if(photoIndex===0)phone();else{shown=Math.max(0,shown-1);show(shown)}}""")
s=s.replace("window.renderAt=function(t){base();", "window.renderAt=function(t){hidePhoto();base();")
s=s.replace("Demo afgelopen. Leeg scherm zet de begintijd terug.'}}", "Demo afgelopen. Klik op Toon foto’s voor de beelden bij deze scène.';updateControls()}}")
s=s.replace("$('messageFields').append(label,name,txt);});reset()}", "$('messageFields').append(label,name,txt);});renderPhotos();reset()}")
s=s.replace("$('back').onclick=()=>{stop();shown=Math.max(0,shown-1);show(shown)};", "$('back').onclick=previous;")
s=s.replace("else if(e.key.toLowerCase()==='r')reset();", "else if(e.key.toLowerCase()==='f'){if(photos().length)showPhoto(0)}else if(e.key.toLowerCase()==='t')phone();else if(e.key.toLowerCase()==='r')reset();")
s=s.replace("a.download='Joel-teksten.json'", "a.download='Joel-project.json'")
s=s.replace("$('save').onclick=()=>{const url=", "$('save').onclick=()=>{if(importingPhotos)return;const url=")
s=s.replace("config=c;scene=0;bind();$('error').textContent='';", "config=normalizeConfig(c);scene=0;bind();$('error').textContent='';")
s=s.replace("Kies een eerder bewaard Joel-teksten.json bestand.", "Kies een eerder bewaard Joel-project.json of Joel-teksten.json bestand.")
s=s.replace("window.setConfig=c=>{config=c;scene=0;bind()}", "window.setConfig=c=>{config=normalizeConfig(c);scene=0;bind()}")
insert="""
function normalizeConfig(c){
  const result=structuredClone(c);
  if(result.photos===undefined)result.photos=Array.from({length:5},()=>[]);
  if(!Array.isArray(result.photos)||result.photos.length!==5||result.photos.some(list=>!Array.isArray(list)||list.length>20||list.some(p=>!p||typeof p.name!=='string'||typeof p.src!=='string'||!/^data:image\\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(p.src))))throw Error('Ongeldige foto’s');
  return result;
}
function photos(){return config.photos[scene]}
function hidePhoto(){photoLoad++;photoIndex=-1;$('photoScreen').hidden=true;$('photoDisplay').removeAttribute('src');}
function updateControls(){
  const viewing=photoIndex>=0;
  $('photosButton').disabled=!photos().length;
  $('phoneButton').hidden=!viewing;
  $('next').disabled=!viewing&&shown>=messages().length&&!photos().length;
  $('next').textContent=viewing?(photoIndex+1<photos().length?'Volgende foto →':'Terug naar telefoon →'):(shown<messages().length?'Volgend appje →':photos().length?'Toon foto’s →':'Alle appjes getoond');
}
async function showPhoto(index){
  if(!photos()[index])return;
  stop();const token=++photoLoad;const photo=photos()[index];
  const img=new Image();img.src=photo.src;
  try{await img.decode()}catch{if(token===photoLoad)$('error').textContent='Deze foto kan niet worden getoond. Voeg hem opnieuw toe als JPG of PNG.';return}
  if(token!==photoLoad)return;
  photoIndex=index;$('photoDisplay').src=photo.src;$('photoDisplay').alt=photo.name;$('photoScreen').hidden=false;
  $('state').textContent='Scène '+(scene+1)+' · foto '+(index+1)+' van '+photos().length+' · '+photo.name;
  updateControls();
}
function phone(){stop();show(shown)}
function renderPhotos(){
  const list=$('photoList');list.replaceChildren();
  if(!photos().length){const empty=document.createElement('div');empty.className='photo-empty';empty.textContent='Nog geen foto’s. Voeg de beelden voor deze herinnering toe.';list.append(empty)}
  photos().forEach((p,i)=>{
    const row=document.createElement('div');row.className='photo-row';
    const thumb=document.createElement('button');thumb.className='photo-thumb';thumb.title='Toon foto '+(i+1);thumb.setAttribute('aria-label',thumb.title);
    const img=document.createElement('img');img.src=p.src;img.alt=p.name;thumb.append(img);thumb.onclick=()=>showPhoto(i);
    const info=document.createElement('div');info.style.minWidth='0';const name=document.createElement('div');name.className='photo-name';name.textContent=(i+1)+'. '+p.name;name.title=p.name;
    const actions=document.createElement('div');actions.className='photo-actions';
    function action(label,title,disabled,fn){const b=document.createElement('button');b.textContent=label;b.title=title;b.setAttribute('aria-label',title);b.disabled=disabled;b.onclick=()=>{phone();fn();renderPhotos();updateControls()};actions.append(b)}
    action('↑','Foto '+(i+1)+' naar voren',i===0,()=>{[photos()[i-1],photos()[i]]=[photos()[i],photos()[i-1]]});
    action('↓','Foto '+(i+1)+' naar achteren',i===photos().length-1,()=>{[photos()[i+1],photos()[i]]=[photos()[i],photos()[i+1]]});
    action('Verwijder','Verwijder foto '+(i+1),false,()=>photos().splice(i,1));
    info.append(name,actions);row.append(thumb,info);list.append(row);
  });updateControls();
}
async function readPhoto(file){
  if(!/\\.(jpe?g|png|webp)$/i.test(file.name)&&!/^image\\/(jpeg|png|webp)$/.test(file.type))throw Error(file.name+': gebruik JPG, PNG of WebP.');
  if(file.size>30*1024*1024)throw Error(file.name+': dit bestand is groter dan 30 MB.');
  const url=URL.createObjectURL(file);const img=new Image();
  try{
    img.src=url;await img.decode();const scale=Math.min(1,2560/Math.max(img.naturalWidth,img.naturalHeight));
    const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
    const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
    return{name:file.name,src:canvas.toDataURL('image/jpeg',.91)};
  }catch{throw Error(file.name+': kon niet worden geopend. Exporteer de foto als JPG of PNG.')}finally{URL.revokeObjectURL(url)}
}
$('addPhotos').onclick=()=>$('photoInput').click();
$('photoInput').onchange=async e=>{
  const files=Array.from(e.target.files);e.target.value='';if(!files.length)return;
  const targetScene=scene,target=photos();const room=20-target.length;const chosen=files.slice(0,room);const errors=[];let added=0;
  if(files.length>room)errors.push('Maximaal 20 foto’s per scène; de overige bestanden zijn overgeslagen.');
  importingPhotos=true;$('addPhotos').disabled=true;$('save').disabled=true;$('load').disabled=true;$('error').textContent='';
  try{for(const [i,file]of chosen.entries()){$('photoStatus').textContent='Foto '+(i+1)+' van '+chosen.length+' verwerken voor scène '+(targetScene+1)+'…';try{target.push(await readPhoto(file));added++}catch(err){errors.push(err.message)}}}
  finally{importingPhotos=false;$('addPhotos').disabled=false;$('save').disabled=false;$('load').disabled=false;renderPhotos();$('photoStatus').textContent=added+' foto’s toegevoegd aan scène '+(targetScene+1)+'. Bewaar je project om ze te bewaren.';$('error').textContent=errors.join(' ')}
};
$('photosButton').onclick=()=>showPhoto(0);$('phoneButton').onclick=phone;
"""
s=s.replace("if(new URLSearchParams(location.search).has('render'))", insert+"\nif(new URLSearchParams(location.search).has('render'))")
p.write_text(s)

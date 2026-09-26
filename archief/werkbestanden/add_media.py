from pathlib import Path
import json,base64
p=Path('outputs/Joel-telefoonformat.html');s=p.read_text()
initial=json.loads(Path('outputs/Joel-ingevulde-teksten.json').read_text())
start=s.index('const initial=');end=s.index('\ninitial.photos=',start)
s=s[:start]+'const initial='+json.dumps(initial,ensure_ascii=False,separators=(',',':'))+';'+s[end:]
s=s.replace("initial.photos=Array.from({length:5},()=>[]);", "initial.photos=Array.from({length:5},()=>[]);initial.wallpaper=null;initial.wallpaperShade=.3;")
s=s.replace('Concept 02 ·','Concept 03 ·')
s=s.replace('</style>', '''
#wallpaper{position:absolute;inset:0;z-index:1;pointer-events:none}#wallpaper[hidden]{display:none}#wallpaper img{width:100%;height:100%;display:block;object-fit:cover}#wallpaperShade{position:absolute;inset:0;background:#000;opacity:.3}#stage.has-wallpaper:before,#stage.has-wallpaper:after{display:none}
.notice .notice-content{display:flex;align-items:center;gap:28px}.notice .notice-copy{flex:1;min-width:0}.message-photo{display:block;width:280px;height:170px;object-fit:contain;background:#123329;border-radius:15px;flex:none}.notice.has-photo{min-height:180px;padding-top:18px;padding-bottom:18px}.notice.has-photo .meta{margin-bottom:6px}.notice.has-photo .message-photo{height:150px;width:265px}
.attachment-editor{margin:8px 0 17px;display:flex;align-items:center;gap:8px;flex-wrap:wrap}.attachment-editor img{width:62px;height:45px;object-fit:contain;background:#091a12;border-radius:5px}.attachment-editor button{padding:7px 10px;font-size:12px}.attachment-name{font-size:11px;max-width:145px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#b5c7bc}.media-settings{border:1px solid #344a40;border-radius:9px;padding:14px;margin:18px 0}.media-settings h3{font-size:15px;margin:0 0 10px}.media-settings button{font-size:12px;padding:8px 10px;margin:3px 2px 3px 0}.media-settings input[type=range]{padding:0}.media-status{overflow-wrap:anywhere}
</style>''')
s=s.replace('<div id="stage"><div class="ui">','<div id="stage"><div id="wallpaper" hidden><img id="wallpaperImage" alt=""><div id="wallpaperShade"></div></div><div class="ui">')
s=s.replace('De demo bevat een korte zelfgemaakte wekker en meldingstonen.', 'De demo gebruikt het originele Apple Radar-wekkergeluid en korte meldingstonen.')
s=s.replace('<label for="sceneInput">Scène</label>', '''<section class="media-settings"><h3>Achtergrond van de telefoon</h3><button id="chooseWallpaper">Achtergrond kiezen</button><button id="clearWallpaper" hidden>Standaard achtergrond</button><input type="file" id="wallpaperInput" accept="image/jpeg,image/png,image/webp" hidden><p class="small media-status" id="wallpaperStatus">De groene standaardachtergrond is actief.</p><label for="shadeInput">Achtergrond donkerder maken</label><input id="shadeInput" type="range" min="0" max="0.7" step="0.05" value="0.3"><p class="small">De achtergrond vult het scherm. Een brede foto werkt het best.</p></section>
<section class="media-settings"><h3>Wekkergeluid · Apple Radar</h3><button id="testRadar">Beluister Radar</button><p class="small">Het originele Radar-geluid is ingebouwd en werkt ook zonder internet.</p></section>
<label for="sceneInput">Scène</label>''')
s=s.replace('teksten én foto’s van alle vijf scènes', 'teksten, appfoto’s, achtergrond en scènefoto’s')
s=s.replace("function messages(){return config.scenes[scene].filter(m=>m.text.trim())}", "function messages(){return config.scenes[scene].filter(m=>m.text.trim()||m.photo)}")
s=s.replace("$('concept').hidden=!config.concept; }", "$('concept').hidden=!config.concept;applyWallpaper(); }")
s=s.replace("<div class=\"sender\"></div><div class=\"message\"></div>'", "<div class=\"notice-content\"><div class=\"notice-copy\"><div class=\"sender\"></div><div class=\"message\"></div></div></div>'")
s=s.replace("el.querySelector('.message').textContent=m.text;const p=", "el.querySelector('.message').textContent=m.text;el.querySelector('.message').hidden=!m.text.trim();if(m.photo){el.classList.add('has-photo');const img=document.createElement('img');img.className='message-photo';img.alt=m.photo.name;img.src=m.photo.src;el.querySelector('.notice-content').append(img)}const p=")
s=s.replace("function tone(type){const c=audio();if(!c)return;const notes=type==='alarm'?[[880,0,.12],[880,.2,.12],[1108,.4,.15]]:[[880,0,.11],[1320,.12,.18]];", "function tone(type){if(type==='alarm'){if($('soundInput').checked)playRadar();return}const c=audio();if(!c)return;const notes=[[880,0,.11],[1320,.12,.18]];")
s=s.replace("function stop(){playing=false;cancelAnimationFrame(raf)}", "function stop(){playing=false;cancelAnimationFrame(raf);stopRadar()}")
s=s.replace("if(t<24&&playing)", "if(t>=6)stopRadar();if(t<24&&playing)")
s=s.replace("$('messageFields').append(label,name,txt);", "$('messageFields').append(label,name,txt,attachmentEditor(m,i));")
s=s.replace("function bind(){base();", "function bind(){base();$('shadeInput').value=config.wallpaperShade??.3;syncWallpaperPanel();")
s=s.replace("  return result;\n}", """  if(result.wallpaper===undefined)result.wallpaper=null;
  if(result.wallpaper&&!validImage(result.wallpaper))throw Error('Ongeldige achtergrond');
  if(result.scenes.some(list=>list.some(m=>m.photo&&!validImage(m.photo))))throw Error('Ongeldige appfoto');
  result.wallpaperShade=Number.isFinite(result.wallpaperShade)?Math.min(.7,Math.max(0,result.wallpaperShade)):.3;
  return result;
}""")
audio=base64.b64encode(Path('outputs/Radar-Apple.m4a').read_bytes()).decode()
insert=r'''
const radar=new Audio('data:audio/mp4;base64,RADAR_DATA');radar.preload='auto';radar.volume=.75;
function stopRadar(){radar.pause();radar.currentTime=0;$('testRadar').textContent='Beluister Radar'}
function playRadar(){stopRadar();$('testRadar').textContent='Stop Radar';radar.play().catch(()=>{$('testRadar').textContent='Beluister Radar';$('error').textContent='Het geluid kon niet starten. Klik opnieuw op Beluister Radar.'})}
radar.onended=()=>{$('testRadar').textContent='Beluister Radar'};
$('testRadar').onclick=()=>{if(!radar.paused){stopRadar()}else{stop();playRadar()}};
$('soundInput').onchange=()=>{if(!$('soundInput').checked)stopRadar()};
function validImage(p){return p&&typeof p.name==='string'&&typeof p.src==='string'&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(p.src)}
function applyWallpaper(){const wp=config.wallpaper;$('stage').classList.toggle('has-wallpaper',!!wp);$('wallpaper').hidden=!wp;if(wp){if($('wallpaperImage').getAttribute('src')!==wp.src)$('wallpaperImage').src=wp.src}else $('wallpaperImage').removeAttribute('src');$('wallpaperShade').style.opacity=config.wallpaperShade??.3}
function syncWallpaperPanel(){$('wallpaperStatus').textContent=config.wallpaper?'Achtergrond: '+config.wallpaper.name:'De groene standaardachtergrond is actief.';$('clearWallpaper').hidden=!config.wallpaper;$('shadeInput').disabled=!config.wallpaper}
$('chooseWallpaper').onclick=()=>$('wallpaperInput').click();
$('wallpaperInput').onchange=async e=>{const file=e.target.files[0];e.target.value='';if(!file)return;const target=config;$('chooseWallpaper').disabled=true;$('error').textContent='';try{const p=await readPhoto(file);if(target===config){config.wallpaper=p;applyWallpaper();syncWallpaperPanel()}}catch(err){$('error').textContent=err.message}finally{$('chooseWallpaper').disabled=false}};
$('clearWallpaper').onclick=()=>{config.wallpaper=null;applyWallpaper();syncWallpaperPanel()};
$('shadeInput').oninput=()=>{config.wallpaperShade=Number($('shadeInput').value);applyWallpaper()};
function attachmentEditor(m,i){
 const box=document.createElement('div');box.className='attachment-editor';
 const file=document.createElement('input');file.type='file';file.accept='image/jpeg,image/png,image/webp';file.hidden=true;file.dataset.messagePhoto=i;
 const add=document.createElement('button');add.textContent=m.photo?'Foto vervangen':'Foto in appje laden';add.setAttribute('aria-label','Foto laden in appje '+(i+1));add.onclick=()=>file.click();
 box.append(add,file);
 if(m.photo){const img=document.createElement('img');img.src=m.photo.src;img.alt=m.photo.name;const name=document.createElement('span');name.className='attachment-name';name.textContent=m.photo.name;name.title=m.photo.name;const remove=document.createElement('button');remove.textContent='Foto verwijderen';remove.setAttribute('aria-label','Foto verwijderen uit appje '+(i+1));remove.onclick=()=>{delete m.photo;bind();shown=messages().length;show(shown)};box.append(img,name,remove)}
 file.onchange=async e=>{const chosen=e.target.files[0];file.value='';if(!chosen)return;const targetScene=scene;add.disabled=true;$('error').textContent='';try{const photo=await readPhoto(chosen);m.photo=photo;if(targetScene===scene&&config.scenes[scene].includes(m)){bind();shown=messages().length;show(shown)}}catch(err){$('error').textContent=err.message}finally{add.disabled=false}};
 return box;
}
'''.replace('RADAR_DATA',audio)
s=s.replace("if(new URLSearchParams(location.search).has('render'))",insert+"\nif(new URLSearchParams(location.search).has('render'))")
p.write_text(s)

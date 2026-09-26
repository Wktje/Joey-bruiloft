from pathlib import Path
import json,re
p=Path('outputs/Joel-telefoonformat.html');s=p.read_text()
def change(a,b):
 global s
 assert a in s,a[:120]
 s=s.replace(a,b)
change("const $=id=>document.getElementById(id);","const EDITABLE_TEMPLATE='<!doctype html>\\n'+document.documentElement.outerHTML;\nconst $=id=>document.getElementById(id);")
match=re.search(r'^const initial=(.*);$',s,re.M);initial=json.loads(match.group(1));initial['replies']=[['ouwe, ik ben wakker gewordt in het ziekenhuis, geen idee wat er gebeurd is.','Moet zo geopereert worden','heb je sigaretten toevallig?'],[],[],[],[]];initial['sceneTiming']=[{} for _ in range(5)]
s=s[:match.start()]+'const initial='+json.dumps(initial,ensure_ascii=False,separators=(',',':'))+';'+s[match.end():]
Path('outputs/Joel-project-met-foto.json').write_text(json.dumps(initial,ensure_ascii=False,indent=2))
start=s.index('const DEMO=');end=s.index('const compose=',start)
s=s[:start]+'const DEMO={};window.DEMO=DEMO;\n'+s[end:]
change('function reset(){stop();shown=0;show(0)}','function reset(){stop();rebuildTimeline();previewPosition=0;shown=0;show(0);if($(\'previewSeek\')){$(\'previewSeek\').value=0;$(\'previewReadout\').textContent=\'0:00 / \'+formatDuration(DEMO.duration+INTRO.duration)}}')
change('renderPhotos();reset()}','renderPhotos();renderTempoEditor();reset()}')
change('const active=t>=DEMO.keyboardOpen;', 'const active=t>=DEMO.keyboardOpen;')
change('const lift=active?','const lift=active&&DEMO.replies.length?')
change('const round=Math.min(2,Math.floor(Math.max(0,t)/12));const clock=clockAfter(t>=36?27:round*9);', 'const round=Math.max(0,DEMO.ringStarts.findLastIndex(s=>t>=s));const clock=clockAfter(DEMO.ringStarts.length?(t>=DEMO.alarmEnd?27:round*9):0);')
change("$('alarm').hidden=t>=36||snoozed;$('snoozeActivity').hidden=t>=36||!snoozed;", "$('alarm').hidden=!DEMO.ringStarts.length||t>=DEMO.alarmEnd||snoozed;$('snoozeActivity').hidden=!DEMO.ringStarts.length||t>=DEMO.alarmEnd||!snoozed;")
change("const remaining=Math.max(0,540-Math.floor(Math.max(0,t-DEMO.ringStops[round])));", "const remaining=Math.max(0,540-Math.floor(Math.max(0,t-(DEMO.ringStops[round]??0))));")
change("$('snoozeButton'),(t-DEMO.snoozes[round])/.65", "$('snoozeButton'),(t-(DEMO.snoozes[round]??0))/.65")
change("window.renderAt=function(t){window.renderSceneAt(Math.max(0,t-INTRO.duration));renderIntro(t)};", "window.renderAt=function(t){window.renderSceneAt(Math.max(0,t-INTRO.duration));renderIntro(t);previewPosition=t;if($('previewSeek')){$('previewSeek').value=t;$('previewReadout').textContent=formatDuration(t)+' / '+formatDuration(DEMO.duration+INTRO.duration);$('pausePreview').textContent=playing?'Pauzeren':'Verder afspelen'}};")
change("].map(line=>({...line,keys:Array.from(line.text,(_,i)=>line.start+(i+1)/line.text.length*(line.end-line.start))}))}", "].map(line=>({...line,start:line.start*INTRO.duration/12,end:line.end*INTRO.duration/12})).map(line=>({...line,keys:Array.from(line.text,(_,i)=>line.start+(i+1)/line.text.length*(line.end-line.start))}))}")
change('  return result;', "  result.sceneTiming??=Array.from({length:5},()=>({}));if(!Array.isArray(result.sceneTiming)||result.sceneTiming.length!==5)throw Error('Ongeldige tijden');\n  result.replies??=Array.from({length:5},(_,i)=>i===0?[...initial.replies[0]]:[]);if(!Array.isArray(result.replies)||result.replies.length!==5||result.replies.some(list=>!Array.isArray(list)||list.length>3||list.some(t=>typeof t!=='string'||t.length>220)))throw Error('Ongeldige antwoorden');\n  return result;")
insert=s.index("$('demo').textContent='Speel video · 2:09';")
s=s[:insert]+Path('work/tempo-editor.js').read_text()+'\n'+s[insert:]
change('Concept 11 · documentaire-intro, chat en foto','Concept 12 · zelf teksten, foto’s en tempo aanpassen')
change('Joel-film-met-foto-na-chat.mp4','Joel-film-vlot-tempo.mp4')
change('Download video met nieuwe foto (MP4)','Download de vlottere video (MP4)')
line=next(l for l in s.splitlines() if l.startswith("document.querySelector('.download-box p').innerHTML="))
change(line,"document.querySelector('.download-box p').innerHTML='<strong>MP4 met het nieuwe, vlottere tempo</strong><br>Dit is een vaste export van de meegeleverde scène. Pas tijden en inhoud aan in het bewerkpaneel en bekijk het resultaat direct met de afspeelbalk. Download je bewerkbare format of bewaar het project voor een nieuwe MP4.';")
change('</style>', '''.preview-panel{margin-top:14px;border:1px solid #344a40;border-radius:12px;padding:15px;background:#1b2a25}.preview-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}#previewReadout{font-variant-numeric:tabular-nums;color:#c6d8cf}#previewSeek{width:100%;accent-color:#bdeccb}.cue-buttons{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}.cue-buttons button{padding:7px 10px;font-size:12px}.tempo-panel{padding:18px 0;margin:0 0 24px;border-bottom:1px solid #344a40}.tempo-panel h2{margin:20px 0 9px}.tempo-panel h3{font-size:15px;margin-top:20px}.tempo-presets{display:flex;gap:8px}.tempo-presets button{font-size:13px;padding:9px 12px}.panel .tempo-field{display:grid;grid-template-columns:1fr 72px 62px;align-items:center;gap:8px;margin-top:12px}.tempo-field input{text-align:center}.tempo-field small{font-size:11px}.panel .check-label{display:flex;align-items:center;gap:9px}.panel .check-label input{width:auto}.reply-photo-editor-thumb{width:70px;max-height:90px;object-fit:contain;display:block;margin-bottom:9px}#replyPhotoEditor button{font-size:12px;margin:0 4px 8px 0}#saveEditable{width:100%;background:#bdeccb;color:#12271c;font-weight:650}.render .preview-panel{display:none}
</style>''')
p.write_text(s)

from pathlib import Path
import re,json
p=Path('outputs/Joel-telefoonformat.html');s=p.read_text()
def change(old,new):
 global s
 assert old in s,old[:140]
 s=s.replace(old,new)
m=re.search(r'^const initial=(.*);$',s,re.M);c=json.loads(m.group(1));c['scenes'][0][0]['sender']='maaike mn liefste';c['followupChats']=[{'enabled':True,'name':'maaike mn liefste','incoming':'Hopelijk ben op tijd hersteld voor je bruiloft','reply':'Ja, ik hoop dat ik dan weer mag drinken.'},None,None,None,None];s=s[:m.start()]+'const initial='+json.dumps(c,ensure_ascii=False,separators=(',',':'))+';'+s[m.end():]
Path('outputs/Joel-project-met-foto.json').write_text(json.dumps(c,ensure_ascii=False,indent=2))
change('renderReplies(t,clock);updateControls();','renderReplies(t,clock);renderFollowup(t,clock);updateControls();')
change('function hidePhoto(){renderReplies(-1,config.time);','function hidePhoto(){renderFollowup(-1,config.time);renderReplies(-1,config.time);')
change('renderPhotos();renderTempoEditor();reset()}','renderPhotos();renderTempoEditor();renderFollowupEditor();reset()}')
change(' updateTempoSummary();\n}', ' buildFollowupTimeline(p);updateTempoSummary();\n}')
change("if(DEMO", "if(DEMO") if False else None
change('lastReplySoundTime=t}', "if(DEMO.followup){const f=DEMO.followup,r=f.reply;if(f.incoming>lastReplySoundTime&&f.incoming<=t)tone('notice');if(r.keys.some(k=>k>lastReplySoundTime&&k<=t))replyTone('key');if(r.send>lastReplySoundTime&&r.send<=t)replyTone('send')}lastReplySoundTime=t}")
change('Joels foto blijft in de chat staan.','de laatste chat blijft staan.')
change('  return result;', "  result.followupChats??=Array(5).fill(null);if(!Array.isArray(result.followupChats)||result.followupChats.length!==5||result.followupChats.some(c=>c&&(typeof c.enabled!=='boolean'||['name','incoming','reply'].some(k=>typeof c[k]!=='string'||c[k].length>(k==='name'?35:220)))))throw Error('Ongeldige vervolgchat');\n  return result;")
change('replies:DEMO.replies.map(r=>', "followup:DEMO.followup?{...DEMO.followup,start:DEMO.followup.start+shift,incoming:DEMO.followup.incoming+shift,keyboardOpen:DEMO.followup.keyboardOpen+shift,keyboardClose:DEMO.followup.keyboardClose+shift,reply:{...DEMO.followup.reply,start:DEMO.followup.reply.start+shift,end:DEMO.followup.reply.end+shift,send:DEMO.followup.reply.send+shift,keys:DEMO.followup.reply.keys.map(t=>t+shift)}}:null,\n replies:DEMO.replies.map(r=>")
change("for(const [label,time]of cues){", "if(DEMO.followup)cues.push(['Vervolgchat',INTRO.duration+DEMO.followup.start+.7]);for(const [label,time]of cues){")
change("$('demo').textContent='Speel video · 2:09';", Path('work/followup-chat.js').read_text()+"\n$('demo').textContent='Speel video';")
change('Concept 12 · zelf teksten, foto’s en tempo aanpassen','Concept 13 · soepele overgang naar Maaike')
change('Joel-film-vlot-tempo.mp4','Joel-film-met-maaike-chat.mp4')
change('Download de vlottere video (MP4)','Download video met Maaike-chat (MP4)')
change('MP4 met het nieuwe, vlottere tempo','MP4 met het vlotte tempo en de vervolgchat met Maaike')
change('</style>','.followup-incoming{max-width:91%;align-self:flex-start;flex:none;background:#fff;border-radius:28px 28px 28px 5px;padding:22px 26px 12px;box-shadow:0 2px 5px #00000012}.followup-incoming-text{font-size:43px;line-height:1.22;overflow-wrap:anywhere}.followup-day{align-self:center;background:#dedbd3a6;color:#71736c;border-radius:18px;padding:12px 23px;font-size:29px;margin:0 0 30px}.followup-editor{border-top:1px solid #344a40;margin-top:15px;padding-top:5px}\n</style>')
p.write_text(s)

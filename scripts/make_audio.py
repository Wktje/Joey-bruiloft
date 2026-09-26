import math, wave, array, json, random, sys
from pathlib import Path
job=Path(sys.argv[1])
with open(job/'timing.json') as timing_file:
    timing=json.load(timing_file)
rate=48000
samples=array.array('h',[0])*int(round(timing['duration']*rate))
def note(start,freq,duration,gain=.14):
    for n in range(int(duration*rate)):
        t=n/rate
        env=min(1,t/.008)*math.exp(-5*t/duration)
        i=int(start*rate)+n
        if 0<=i<len(samples): samples[i]+=int(32767*gain*env*math.sin(2*math.pi*freq*t))
rng=random.Random(17)
for start in timing.get('introKeys',[]):
    for n in range(int(.055*rate)):
        t=n/rate
        value=.1*((rng.random()*2-1)*math.exp(-t*100)+.45*math.sin(2*math.pi*1650*t)*math.exp(-t*65))
        index=int(start*rate)+n
        if 0<=index<len(samples): samples[index]+=int(32767*value)
with wave.open(str(job/'radar.wav'),'rb') as src:
    radar=array.array('h',src.readframes(src.getnframes()))
for start,stop in zip(timing['ringStarts'],timing['ringStops']):
    duration=stop-start
    end=int(duration*rate)
    for n in range(end):
        fade=min(1,(end-n)/(.02*rate))
        index=int(start*rate)+n
        if 0<=index<len(samples): samples[index]=int(radar[n % len(radar)]*.75*fade)
for start in timing['messages']:
    for f,d,l in [(880,0,.11),(1320,.12,.18)]: note(start+d,f,l)
for reply in timing.get('replies',[]):
    for key_time in reply['keys']: note(key_time,1100,.022,.014)
    note(reply['send'],660,.07,.045)
    note(reply['send']+.07,990,.12,.045)
if timing.get('followup'):
    f=timing['followup']
    for freq,delay,length in [(880,0,.11),(1320,.12,.18)]: note(f['incoming']+delay,freq,length)
    for key_time in f['reply']['keys']: note(key_time,1100,.022,.014)
    note(f['reply']['send'],660,.07,.045)
    note(f['reply']['send']+.07,990,.12,.045)
if 'photoSend' in timing:
    note(timing['photoSend'],660,.07,.045)
    note(timing['photoSend']+.07,990,.12,.045)
with wave.open(str(job/'geluid.wav'),'wb') as out:
    out.setnchannels(1);out.setsampwidth(2);out.setframerate(rate);out.writeframes(samples.tobytes())

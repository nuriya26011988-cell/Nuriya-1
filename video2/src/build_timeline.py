"""Build timeline.js (shot start times + subtitle cues) and subs.ass from align.json and SHOTS in shots.js."""
import json,re,sys
al=json.load(open(sys.argv[1])); TAIL=float(sys.argv[2]) if len(sys.argv)>2 else 2.0
words,st,cov,aend=al['words'],al['start'],al['covered'],al['audio_end']
norm=lambda s:re.sub(r'[^а-яёәғқңөұүһіa-z0-9]','',s.lower())
nw=[norm(w) for w in words]
shots=[(p,sc,a,b2,ck,o2) for p,sc,a,b2,ck,o2 in re.findall(r"\['([^']+)','(\w+)',\[([^\]]+)\],\[([^\]]+)\],'([^']*)',(\d+)\]",open('moon.js').read())]
out=[];pos=0
for phrase,scene,a,b,ck,o2 in shots:
    cam=[[float(x) for x in a.split(',')],[float(x) for x in b.split(',')]]
    if phrase=='@end':
        out.append({'start':aend,'scene':scene,'cam':cam,'anchor':phrase,'wi':cov});continue
    p=[norm(x) for x in phrase.split() if norm(x)]
    hit=next((i for i in range(pos,len(nw)) if nw[i:i+len(p)]==p),None)
    if hit is None: sys.exit('phrase not found: '+phrase)
    pos=hit+1
    if hit>=cov: continue
    out.append({'start':0.0 if not out else max(0,st[hit]-0.15),'scene':scene,'cam':cam,'anchor':phrase,'wi':hit,'clock':ck,'o2':int(o2)})
end=aend+TAIL
for i,s in enumerate(out): s['end']=out[i+1]['start'] if i+1<len(out) else end
# subtitle cues: split covered words at sentence punctuation, max ~70 chars
cues=[];cur=[]
for i in range(cov):
    cur.append(i); txt=' '.join(words[j] for j in cur)
    if re.search(r'[.!?…:;]$',words[i]) or (len(txt)>60 and re.search(r'[,—]$',words[i])) or len(txt)>78:
        cues.append(cur);cur=[]
if cur: cues.append(cur)
C=[]
for k,c in enumerate(cues):
    a=st[c[0]]; b=st[cues[k+1][0]]-0.05 if k+1<len(cues) else aend
    t=' '.join(words[j] for j in c).replace('•','').strip()
    C.append({'a':round(a,2),'b':round(max(b,a+0.6),2),'t':t})
open('timeline.js','w').write('const TIMELINE='+json.dumps({'shots':out,'cues':C,'duration':end},ensure_ascii=False)+';\n')
def ts(x):h=int(x//3600);m=int(x//60)%60;s=x%60;return f"{h}:{m:02d}:{s:05.2f}"
def wrap(t):
    if len(t)<=40: return t
    mid=len(t)/2;sp=[i for i,ch in enumerate(t) if ch==' '];b=min(sp,key=lambda i:abs(i-mid));return t[:b]+r'\N'+t[b+1:]
ass="""[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,PT Sans,58,&H00FFFFFF,&H00FFFFFF,&H00141414,&H64000000,-1,0,0,0,100,100,0,0,1,5,2,2,120,120,54,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
for c in C: ass+=f"Dialogue: 0,{ts(c['a'])},{ts(c['b'])},Sub,,0,0,0,,{wrap(c['t'])}\n"
open('subs.ass','w').write(ass)
def srt(x):ms=int(round(x*1000));return f"{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d},{ms%1000:03d}"
open('subs.srt','w').write(''.join(f"{i+1}\n{srt(c['a'])} --> {srt(c['b'])}\n{wrap(c['t']).replace(chr(92)+'N',chr(10))}\n\n" for i,c in enumerate(C)))
print(len(out),'shots,',len(C),'cues, duration',round(end,1))
for s in out: print(f"{s['start']:7.2f}-{s['end']:7.2f} {s['scene']:12} {s['anchor']}")

import json,re,difflib,subprocess,numpy as np
words=open('/home/user/Nuriya-1/video2/script.txt').read().split()
norm=lambda s:re.sub(r'[^а-яёәғқңөұүһіa-z0-9]','',s.lower())
def align(sub,W):
    aa='';am=[]
    for i,w in enumerate(sub):n=norm(w);aa+=n;am+=[i]*len(n)
    b='';bt=[]
    for s,e,tx in W:
        n=norm(tx)
        for k,ch in enumerate(n):b+=ch;bt.append(s+(e-s)*k/max(1,len(n)))
    ct=[None]*len(aa)
    for blk in difflib.SequenceMatcher(None,aa,b,autojunk=False).get_matching_blocks():
        for k in range(blk.size):ct[blk.a+k]=bt[blk.b+k]
    st=[None]*len(sub)
    for ci,x in enumerate(ct):
        if x is not None and st[am[ci]] is None: st[am[ci]]=x
    return st
nw=[norm(w) for w in words]
i_tun=max(i for i in range(len(words)-1) if nw[i]=='түн' and nw[i-1]=='бір')
i_p2=i_tun+2  # "тағы" is cut in the recording; part 2 starts at the second "14"
i_cta=next(i for i in range(len(words)) if nw[i:i+3]==['ал','сен','айда'])
s1=align(words[:i_tun+1],json.load(open('p1_words.json')))
s2=align(words[i_p2:i_cta],json.load(open('p2_words.json')))
d1=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','p1.mp3']).decode())
d2=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0','p2.mp3']).decode())
gap=.15;off=d1+gap
def fill(st,end):
    kn=[(i,x) for i,x in enumerate(st) if x is not None]
    if st[0] is None: st[0]=kn[0][1]; kn.insert(0,(0,st[0]))
    if st[-1] is None: st[-1]=end; kn.append((len(st)-1,end))
    for i in range(len(st)):
        if st[i] is None:
            p=max(k for k in kn if k[0]<i);n=min(k for k in kn if k[0]>i);st[i]=p[1]+(n[1]-p[1])*(i-p[0])/(n[0]-p[0])
    for i in range(1,len(st)): st[i]=max(st[i],st[i-1])
    return st
s1=fill(s1,d1-.3); s2=fill(s2,22.4)
# CTA: speech resumes after "қалады" (22.4 s in part 2)
a=np.fromfile('p2.f32',np.float32);sr=16000
e=[float(np.sqrt(np.mean(a[int(t*sr):int((t+.05)*sr)]**2))) for t in np.arange(22.6,d2,.05)]
on=22.6+next(i for i,v in enumerate(e) if v>.03)*.05
n_cta=len(words)-i_cta; cta=[on+(d2-.4-on)*k/n_cta for k in range(n_cta)]
tun_t=s1[-1]
starts=[round(x,3) for x in s1]+[round(tun_t+.3,3)]+[round(off+x,3) for x in s2]+[round(off+x,3) for x in cta]
assert len(starts)==len(words),(len(starts),len(words))
json.dump({'words':words,'start':starts,'covered':len(words),'audio_end':round(off+d2,2)},open('/home/user/Nuriya-1/video2/src/align.json','w'),ensure_ascii=False)
subprocess.run(f"ffmpeg -v error -y -i p1.mp3 -f lavfi -t {gap} -i anullsrc=r=44100:cl=mono -i p2.mp3 -filter_complex '[0:a][1:a][2:a]concat=n=3:v=0:a=1,loudnorm=I=-16:TP=-1.5,aresample=44100' moon_adi.wav",shell=True,check=True)
print('total',round(off+d2,1),'| CTA onset',round(off+on,1),'| tun',round(tun_t,1))

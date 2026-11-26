import re,json,wave,io,numpy as np,sys
from piper import PiperVoice,SynthesisConfig
paras=[p.strip() for p in open('/home/user/Nuriya-1/video2/script.txt').read().split('\n') if p.strip()]
SPEAK=[('24 сағат','жиырма төрт сағат'),('120 градус','жүз жиырма градус'),('170 градус','жүз жетпіс градус'),('100 градус','жүз градус'),
 ('1961 жылы','мың тоғыз жүз алпыс бірінші жылы'),('60 келі','алпыс келі'),('10 келі','он келі'),('384 000','үш жүз сексен төрт мың'),
 ('1969 жылы','мың тоғыз жүз алпыс тоғызыншы жылы'),('30 пайыз','отыз пайыз'),('14 күнге','он төрт күнге'),('«',''),('»','')]
v=PiperVoice.load('kk_KZ-issai-high.onnx');cfg=SynthesisConfig(speaker_id=0,length_scale=0.95)
SR=v.config.sample_rate;out=[np.zeros(int(SR*.4),np.int16)];words=[];starts=[];t=0.4
def synth(txt):
    b=io.BytesIO()
    with wave.open(b,'wb') as w: v.synthesize_wav(txt,w,cfg)
    b.seek(0)
    with wave.open(b) as w: a=np.frombuffer(w.readframes(w.getnframes()),np.int16)
    nz=np.where(np.abs(a)>300)[0];return a[max(0,nz[0]-int(SR*.03)):nz[-1]+int(SR*.06)] if len(nz) else a
for pi,p in enumerate(paras):
    sents=[s.strip() for s in re.findall(r'[^.!?…:]+[.!?…:]*',p) if s.strip()]
    for si,s in enumerate(sents):
        sp=s
        for a,b in SPEAK: sp=sp.replace(a,b)
        a=synth(sp);d=len(a)/SR;ws=s.split();L=sum(len(x)+1 for x in ws);c=0
        for x in ws: words.append(x);starts.append(round(t+d*c/L,3));c+=len(x)+1
        out.append(a);t+=d;gap=.8 if si==len(sents)-1 else .3
        if pi==0: gap=1.0
        out.append(np.zeros(int(SR*gap),np.int16));t+=gap
audio=np.concatenate(out)
with wave.open('moon_voice.wav','wb') as w: w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes(audio.tobytes())
json.dump({'words':words,'start':starts,'covered':len(words),'audio_end':round(t,2)},open('/home/user/Nuriya-1/video2/src/align.json','w'),ensure_ascii=False)
print(len(words),'words',round(t,1),'s')

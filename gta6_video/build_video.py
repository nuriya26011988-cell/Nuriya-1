#!/usr/bin/env python3
"""Builds the full video: Kazakh TTS voiceover (Piper, ISSAI KazakhTTS voice),
exact-timed subtitles, and the 10 frames with a slow zoom.

usage: python3 build_video.py <path/to/kk_KZ-issai-high.onnx> [speaker_id]
"""
import os, re, sys, wave, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL = sys.argv[1]
SPEAKER = int(sys.argv[2]) if len(sys.argv) > 2 else 1
WORK = os.path.join(HERE, "build")
os.makedirs(WORK, exist_ok=True)

# How words should be *spoken* (subtitles keep the original spelling).
SPOKEN = [
    ("ГТА 6", "Джи-Ти-Эй алты"), ("GTA 6-ның", "Джи-Ти-Эй алтының"), ("GTA 6", "Джи-Ти-Эй алты"),
    ("GTA", "Джи-Ти-Эй"), ("19 қараша", "Он тоғызыншы қараша"), ("13 жыл", "он үш жыл"),
    ("50 мың", "елу мың"), ("30 секунд", "отыз секунд"),
    ("18-19 ғасырларда", "он сегізінші, он тоғызыншы ғасырларда"),
    ("4K", "фор кей"), ("Vice City", "Вайс Сити"), ("—", ","), ("«", ""), ("»", ""),
]

# (frame number, text). Subtitle text = exactly what is spoken.
SEGMENTS = [
    (1, "ГТА 6 миымызды қалай алдайды? "
        "19 қараша. Әлемде миллиондаған ересек адам кенеттен «тұмауратып», жұмысқа шықпай қалды. Офистер бос, көшелер тыныш. "
        "Экономистер бұл күнді әлемдік экономикаға миллиардтаған доллар шығын әкелген күн деп атады. "
        "Себебі — адамзат 13 жыл бойы тағатсыздана күткен GTA 6 ойыны жарыққа шықты."),
    (2, "Әрине, бұл жай ғана компьютерлік ойын деуге болады. Бірақ Зерттеуші Стикменді бір ғана сұрақ қызықтырады: "
        "экрандағы жансыз пиксельдер мен бағдарламалық кодтар біздің миымызды қалайша соншалықты баурап алады? "
        "Неге ақыл-есі дұрыс ересек адамдар виртуалды әлем үшін нақты өмірін ұмытуға дайын? "
        "Бүгін біз мұны биология, психология және тарих тұрғысынан зерттеп көреміз."),
    (3, "Алдымен биологияға үңілейік. Біздің миымыз соңғы 50 мың жылда қатты өзгерген жоқ. "
        "Ол әлі күнге дейін ежелгі аңшы-терушінің заңымен жұмыс істейді: «жаңа нәрсе көрсең — марапат ал». "
        "Бұл марапат мида дофамин деп аталатын химиялық зат түрінде бөлінеді."),
    (4, "Ежелгі ата-бабамыз орманнан жаңа жеміс тапқанда немесе жаңа жер ашқанда миы қалай қуанса, "
        "сіз Vice City көшесінде жаңа көлікке отырып, жаңа миссия бастағанда да дәл сондай химиялық реакция жүреді. "
        "Ойын жасаушылар мидың осы осал тұсын өте шебер пайдаланған. "
        "Нақты өмірде жетістікке жету үшін айлап, жылдап еңбек ету керек. "
        "Ал GTA әлемінде әр 30 секунд сайын жаңа оқиға, жаңа қауіп және лезде берілетін сыйлық бар. "
        "Ми үшін бұл — ең жеңіл әрі шексіз ләззат көзі."),
    (5, "Енді психологияға көшейік. Неге GTA 6-ның графикасы соншалықты шынайы жасалған? "
        "Психологияда «Идентификация» және «Айна нейрондары» деген ұғым бар. "
        "Графика шынайы өмірге жақындаған сайын, мидың логикаға жауап беретін алдыңғы бөлігі — префронтальды кортекс — "
        "қайсысы шындық, қайсысы ойын екенін ажыратуды баяулатады."),
    (6, "Сіз кейіпкерлер Джейсон мен Люсияның орнына өзіңізді қоясыз. Олармен бірге қорқасыз, бірге қашасыз, бірге шешім қабылдайсыз. "
        "Бұл адам миына нақты өмірде ешқандай қауіпке ұшырамай-ақ, өміріне қатер төндірмей-ақ адреналин алуға мүмкіндік береді. "
        "Ғалымдар мұны «қауіпсіз тәуекел» деп атайды. Яғни, жұмсақ диванда отырып, нағыз шытырман оқиғаны бастан кешіру."),
    (7, "Бірақ ең қызығы — тарихта. Бүгін дәрігерлер мен психологтар «ойындар адамдарды нақты өмірден алыстатады» деп дабыл қағып жатыр. "
        "Алайда тарихқа қарасақ, мұндай қорқыныш бұрын да талай рет болған."),
    (8, "18-19 ғасырларда Еуропада қызықты романдар мен кітаптар жаппай басылып шыға бастағанда, "
        "сол кездегі ғалымдар «оқу індеті» туралы мақалалар жазған. "
        "Олар «адамдар кітап ішіндегі қиял әлеміне кіріп кетіп, отбасы мен жұмысын ұмытады, миы уланады» деп қорыққан."),
    (9, "Кейін дәл осындай қорқыныш радиоға, сосын теледидарға, кейін киноға қатысты айтылды. "
        "Демек, виртуалды әлемге уақытша қашу — бүгін пайда болған жаңа дерт емес. "
        "Бұл — адамзат тарихымен бірге келе жатқан, күнделікті күйзелістен демалудың ежелгі психологиялық тәсілі. "
        "Тек бұрын адамдар кітап оқып қиялдаса, қазір оны 4K сапада экраннан көреді."),
    (10, "Сонымен, GTA 6 — жай ғана ойын емес, адам миының қалай жұмыс істейтінін көрсететін алып психологиялық зертхана. "
         "Ол біздің жаңалыққа құмарлығымызды, қауіпсіз тәуекелге деген сұранысымызды шебер қанағаттандырады. "
         "Ең бастысы — виртуалды әлемде жүріп, шынайы өмірдегі басты кейіпкер өзіңіз екенін ұмытпау. "
         "Ал сіз қалай ойлайсыз, ойындар адамды дамыта ма, әлде уақытын ұрлай ма? "
         "Пікірге жазыңыз және «Зерттеуші Стикмен» арнасына жазылуды ұмытпаңыз!"),
]

RATE = 22050
PAUSE_SENT = 0.35   # silence after each sentence
PAUSE_SEG = 0.7     # extra silence when the picture changes


def spoken(s):
    for a, b in SPOKEN:
        s = s.replace(a, b)
    return s


def sentences(t):
    return [x for x in re.split(r'(?<=[.!?:])\s+', t.strip()) if x]


def chunks(sent, n=44):
    words, out, cur = sent.split(), [], ""
    for w in words:
        if cur and len(cur) + 1 + len(w) > n:
            out.append(cur); cur = w
        else:
            cur = (cur + " " + w).strip()
    if cur:
        out.append(cur)
    return out


def main():
    from piper import PiperVoice, SynthesisConfig
    voice = PiperVoice.load(MODEL)
    cfg = SynthesisConfig(speaker_id=SPEAKER, length_scale=1.05, noise_scale=0.6, noise_w_scale=0.8)
    pcm = bytearray()
    t = 0.0
    cues, seg_times = [], []
    silence = lambda sec: b"\x00\x00" * int(RATE * sec)
    for frame, text in SEGMENTS:
        start = t
        for sent in sentences(text):
            path = os.path.join(WORK, "tmp.wav")
            with wave.open(path, "wb") as wf:
                voice.synthesize_wav(spoken(sent), wf, syn_config=cfg)
            with wave.open(path, "rb") as rf:
                assert rf.getframerate() == RATE
                data = rf.readframes(rf.getnframes())
            dur = len(data) / 2 / RATE
            parts = chunks(sent)
            total = sum(len(p) for p in parts)
            ct = t
            for p in parts:  # split sentence time over its subtitle lines by length
                d = dur * len(p) / total
                cues.append((ct, ct + d, p)); ct += d
            pcm += data + silence(PAUSE_SENT)
            t += dur + PAUSE_SENT
        pcm += silence(PAUSE_SEG)
        t += PAUSE_SEG
        seg_times.append((frame, start, t))
    pcm += silence(1.0); t += 1.0
    seg_times[-1] = (seg_times[-1][0], seg_times[-1][1], t)

    voice_wav = os.path.join(HERE, "voiceover.wav")
    with wave.open(voice_wav, "wb") as wf:
        wf.setnchannels(1); wf.setsampwidth(2); wf.setframerate(RATE); wf.writeframes(bytes(pcm))

    def ts(x):
        ms = int(round(x * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
        return f"{h:02}:{m:02}:{s:02},{ms:03}"
    with open(os.path.join(HERE, "subtitles.srt"), "w", encoding="utf-8") as f:
        for i, (a, b, s) in enumerate(cues, 1):
            f.write(f"{i}\n{ts(a)} --> {ts(b)}\n{s}\n\n")

    # video: each frame with a slow Ken-Burns zoom, then burn subtitles + add audio
    fps = 25
    clips = []
    for frame, a, b in seg_times:
        dur = b - a
        n = int(round(dur * fps))
        img = os.path.join(HERE, "png", f"kadr_{frame:02d}.png")
        out = os.path.join(WORK, f"clip_{frame:02d}.mp4")
        zin = frame % 2 == 1
        z = f"1+0.08*on/{n}" if zin else f"1.08-0.08*on/{n}"
        vf = (f"scale=3840:2160,zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={n}:s=1920x1080:fps={fps},"
              f"fade=t=in:st=0:d=0.4,format=yuv420p")
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-i", img, "-vf", vf,
                        "-frames:v", str(n), "-c:v", "libx264", "-preset", "medium", "-crf", "20", out], check=True)
        clips.append(out)
    lst = os.path.join(WORK, "list.txt")
    with open(lst, "w") as f:
        f.writelines(f"file '{c}'\n" for c in clips)
    style = ("FontName=DejaVu Sans,FontSize=15,Bold=1,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,"
             "BackColour=&H80000000,BorderStyle=3,Outline=2,Shadow=0,MarginV=36")
    final = os.path.join(HERE, "GTA6_Zertteushi_Stickman.mp4")
    srt = os.path.join(HERE, "subtitles.srt")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", lst, "-i", voice_wav,
                    "-vf", f"subtitles={srt}:force_style='{style}'", "-c:v", "libx264", "-preset", "medium", "-crf", "20",
                    "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k", "-ar", "44100", "-shortest", final], check=True)
    print("done", final, f"{t/60:.1f} min")
    for fr, a, b in seg_times:
        print(f"kadr {fr}: {a:6.1f}s - {b:6.1f}s")


if __name__ == "__main__":
    main()

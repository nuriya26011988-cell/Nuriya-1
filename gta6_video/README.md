# «ГТА 6 миымызды қалай алдайды?» — Зерттеуші Стикмен

## Файлдар
| Файл | Не үшін |
|---|---|
| `svg/kadr_01.svg … kadr_10.svg` | Векторлық кадрлар (Illustrator / Figma / Inkscape-та өңдеуге болады) |
| `png/kadr_01.png … kadr_10.png` | 1920×1080 дайын суреттер — CapCut / Premiere-ге тікелей салыңыз |
| `voiceover.txt` | ElevenLabs-қа қоятын таза мәтін (қайталанған абзац алынып тасталды) |
| `subtitles.srt` | Субтитр (уақыты **шамамен**, дауысқа қарай синхрондау керек) |
| `generate.py`, `render.js` | Кадрларды қайта генерациялау: `python3 generate.py && node render.js` |

## Мәтін ↔ кадр
| Кадр | Қай мәтінмен шығады |
|---|---|
| 1 | «19 қараша… GTA 6 ойыны жарыққа шықты» |
| 2 | «Әрине, бұл жай ғана компьютерлік ойын… тарих тұрғысынан зерттеп көреміз» |
| 3 | «Алдымен биологияға үңілейік… дофамин…» |
| 4 | «Ежелгі ата-бабамыз… ләззат көзі» |
| 5 | «Енді психологияға көшейік… префронтальды кортекс…» |
| 6 | «Сіз кейіпкерлер Джейсон мен Люсияның орнына… шытырман оқиға» |
| 7 | «Бірақ ең қызығы — тарихта…» |
| 8 | «18-19 ғасырларда Еуропада… миы уланады» |
| 9 | «Кейін дәл осындай қорқыныш радиоға… 4K сапада экраннан көреді» |
| 10 | «Сонымен, GTA 6… жазылуды ұмытпаңыз!» |

Кеңес: әр кадр ~20–30 сек тұрады, сондықтан CapCut-та баяу zoom-in (Ken Burns) қосыңыз.

## ElevenLabs (Adi дауысы)
1. Voice Library → іздеу: **Adi** (Kazakh) → *Add to My Voices*.
2. Модель: **Eleven Multilingual v2** (немесе v3) — қазақ тілін қолдайды.
3. Баптау: Stability ≈ 45–55%, Similarity ≈ 75%, Style ≈ 10–20%, Speaker boost — қосулы.
4. `voiceover.txt`-ті 2–3 бөлікке бөліп генерациялаңыз (интонация жақсырақ болады).
5. «GTA» сөзін дұрыс оқымаса, мәтінде «Джи-Ти-Эй» деп жазыңыз.

## Субтитр
`subtitles.srt` уақыты шамамен есептелген. Ең оңай жол: дауысты CapCut-қа салып,
**Auto captions** жасаңыз да, мәтінін осы файлдан түзетіңіз. Немесе SRT-ны импорттап, уақытын сүйреп сәйкестендіріңіз.

## Сурет генераторына промттар (Midjourney / DALL·E / Ideogram)
Әр промттың басына осы **стиль блогын** қосыңыз, кейіпкерге reference ретінде өз суретіңізді жүктеңіз (`--cref` / image reference):

> 2D flat vector explainer illustration, thick black ink outlines, minimalist. Main character: a stickman with a big perfectly round white head, expressive thick black eyebrows, small black oval dot eyes, simple curved smile, dark navy Kazakh skullcap (taqiya) with a small gold ornament, brown explorer vest with two pockets over a white body, white stick arms and legs with black outline. Background: dark blue-brown scientific tone, faint vintage map and compass texture. 16:9, clean, no extra text unless specified.

1. **КАДР 1:** Split scene. Left: an empty office, desks with dark monitors and empty chairs, wall calendar showing "19". Right: cozy living room, several simple white stickmen sitting on a sofa holding gamepads, staring at a glowing TV. *(Бұл кадрда басты кейіпкер жоқ.)*
2. **КАДР 2:** The main character stands in the center holding a big magnifying glass, looking surprised (raised eyebrows, round open mouth) at a large screen showing a neon sunset city with palm trees and two small game characters.
3. **КАДР 3:** The main character's head is transparent like an X-ray; inside is a pink brain with a glowing golden light bulb in the middle labeled "DOPAMINE". Golden light rays around the head, happy grin.
4. **КАДР 4:** Split screen. Left: a stone-age stickman in a fur tunic joyfully picking a red fruit from a tree. Right: a modern stickman in sunglasses driving a pink sports car down a neon street with palm trees at sunset. A golden spark glows in both heads, connected by a dotted arc.
5. **КАДР 5:** The main character wearing round glasses stands at a green chalkboard, pointing with a wooden pointer at a chalk side-view brain diagram with the front part (prefrontal cortex) highlighted in orange.
6. **КАДР 6:** The main character sits in a cozy red armchair holding a gamepad; behind him on the wall a large dark shadow shows an action hero leaping off a car with motion lines and a small explosion. Floor lamp casting light.
7. **КАДР 7:** The main character holds an antique hourglass in one hand and an old parchment scroll in the other, pointing toward the left where a faded sepia timeline shows a book, a vintage radio, an old TV and a gamepad.
8. **КАДР 8:** 19th-century room. Two stickman doctors in black top hats, long coats and moustaches angrily pointing at a young stickman reading a book on a wooden chair. Speech bubble: "Кітап миды улайды!" *(Бұл кадрда басты кейіпкер жоқ.)*
9. **КАДР 9:** Evolution-style row of 4 seated stickmen, left to right: reading a book, listening to a vintage radio, watching an old CRT TV, playing a game on a big 4K screen. Timeline arrow at the bottom.
10. **КАДР 10:** The main character smiling and winking at the viewer, one hand giving a thumbs up, gamepad lying on the floor; next to him a white "Like" button and a red "Subscribe" button with a bell.

> Ескерту: генераторлар қазақша жазуды жиі бұзады — жазуларды CapCut-та бөлек қосқан дұрыс.

#!/usr/bin/env python3
"""Generates the 10 frame illustrations (SVG, 1920x1080) for the
"Зерттеуші Стикмен" episode about GTA 6 and the brain."""
import os

W, H = 1920, 1080
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "svg")
FONT = "DejaVu Sans, Arial, sans-serif"

NAVY = "#1f2d50"
GOLD = "#d9a441"
VEST = "#7b5232"
VEST_D = "#5e3c22"
INK = "#111111"


# ---------- primitives ----------
def limb(d, w=14, color="#ffffff"):
    """A line with a thick black outline (ink-explainer look)."""
    return (f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="{w + 8}" '
            f'stroke-linecap="round" stroke-linejoin="round"/>'
            f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{w}" '
            f'stroke-linecap="round" stroke-linejoin="round"/>')


def hand(x, y, r=13, fill="#ffffff"):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{INK}" stroke-width="4"/>'


def thumbs_up(x, y):
    st = f'fill="#fff" stroke="{INK}" stroke-width="4.5"'
    return (f'<g transform="translate({x},{y}) scale(1.3) translate({-x},{-y})"><rect x="{x-6}" y="{y-40}" width="14" height="34" rx="7" {st}/>'
            f'<rect x="{x-18}" y="{y-12}" width="36" height="32" rx="11" {st}/>'
            f'<path d="M{x-14},{y-2} h26 M{x-14},{y+8} h26" stroke="{INK}" stroke-width="3"/></g>')


def text(x, y, s, size=40, fill="#f3e6c8", weight="bold", anchor="middle", extra=""):
    return (f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" font-weight="{weight}" '
            f'fill="{fill}" text-anchor="{anchor}" {extra}>{s}</text>')


def background(variant="lab"):
    """Dark blue-brown 'scientific' backdrop with faint map/compass decor."""
    g = f'''<defs>
  <radialGradient id="bg" cx="50%" cy="45%" r="75%">
    <stop offset="0" stop-color="#3a3a44"/>
    <stop offset="0.55" stop-color="#26303f"/>
    <stop offset="1" stop-color="#1a1d24"/>
  </radialGradient>
  <linearGradient id="warm" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#5a4128" stop-opacity="0.45"/>
    <stop offset="1" stop-color="#1b2a40" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="glowGold"><stop offset="0" stop-color="#fff3b0"/><stop offset="0.35" stop-color="#ffd257" stop-opacity="0.9"/><stop offset="1" stop-color="#ffb300" stop-opacity="0"/></radialGradient>
  <radialGradient id="glowBlue"><stop offset="0" stop-color="#bfe9ff" stop-opacity="0.9"/><stop offset="1" stop-color="#4fb3ff" stop-opacity="0"/></radialGradient>
  <filter id="soft"><feGaussianBlur stdDeviation="6"/></filter>
</defs>
<rect width="{W}" height="{H}" fill="url(#bg)"/>
<rect width="{W}" height="{H}" fill="url(#warm)"/>'''
    # faint grid
    grid = "".join(f'<line x1="{x}" y1="0" x2="{x}" y2="{H}"/>' for x in range(0, W, 80))
    grid += "".join(f'<line x1="0" y1="{y}" x2="{W}" y2="{y}"/>' for y in range(0, H, 80))
    g += f'<g stroke="#c9b48a" stroke-opacity="0.05" stroke-width="1">{grid}</g>'
    g += compass(1800, 110, 70, 0.10) + compass(110, 980, 60, 0.08)
    return g


def compass(cx, cy, r, op):
    return (f'<g opacity="{op}" stroke="#e8d6ad" fill="none" stroke-width="2">'
            f'<circle cx="{cx}" cy="{cy}" r="{r}"/><circle cx="{cx}" cy="{cy}" r="{r*0.7}"/>'
            f'<path d="M{cx},{cy-r*1.2} L{cx+r*0.15},{cy} L{cx},{cy+r*1.2} L{cx-r*0.15},{cy} Z" fill="#e8d6ad"/>'
            f'<path d="M{cx-r*1.2},{cy} L{cx},{cy+r*0.15} L{cx+r*1.2},{cy} L{cx},{cy-r*0.15} Z"/></g>')


def svg(body, title):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
            f'<title>{title}</title>{body}</svg>')


# ---------- the channel hero: Зерттеуші Стикмен ----------
def face(expr, dy=0, op=1):
    """Face modelled on the channel reference: tall oval eyes, thick
    asymmetric brows (left one arched higher), sideways smirk."""
    e = f'<g opacity="{op}" transform="translate(0,{dy})">'
    br = f'stroke="{INK}" stroke-width="8" fill="none" stroke-linecap="round"'
    # eyes
    if expr == "wink":
        e += f'<ellipse cx="-28" cy="-10" rx="9" ry="14" fill="{INK}"/>'
        e += f'<path d="M16,-8 Q30,-18 44,-8" stroke="{INK}" stroke-width="6" fill="none" stroke-linecap="round"/>'
    else:
        ry = 16 if expr == "wow" else 14
        e += f'<ellipse cx="-32" cy="-10" rx="9" ry="{ry}" fill="{INK}"/><ellipse cx="32" cy="-12" rx="9" ry="{ry-1}" fill="{INK}"/>'
    # brows
    if expr == "wow":
        e += f'<path d="M-50,-40 Q-34,-60 -14,-46" {br}/><path d="M14,-46 Q32,-62 50,-42" {br}/>'
    else:
        e += f'<path d="M-50,-34 Q-34,-54 -14,-42" {br}/><path d="M14,-40 Q32,-50 50,-36" {br}/>'
    # mouth
    if expr == "wow":
        e += f'<ellipse cx="6" cy="30" rx="12" ry="15" fill="{INK}"/>'
    elif expr == "grin":
        e += f'<path d="M-30,16 Q8,56 44,12 Q8,28 -30,16 Z" fill="{INK}"/>'
        e += '<path d="M-12,36 Q8,46 26,34 Q8,32 -12,36 Z" fill="#d9534f"/>'
    else:
        e += f'<path d="M-20,24 Q14,44 46,14" stroke="{INK}" stroke-width="7" fill="none" stroke-linecap="round"/>'
        e += f'<path d="M42,6 Q52,10 52,20" stroke="{INK}" stroke-width="6" fill="none" stroke-linecap="round"/>'
    return e + '</g>'


def taqiya(op=1):
    """Dome-shaped dark-navy Kazakh skullcap, slightly tilted, gold ornament."""
    return (f'<g opacity="{op}" transform="rotate(6 0 -60)">'
            f'<path d="M-77,-66 Q-84,-118 -46,-136 Q0,-146 46,-136 Q84,-118 77,-66 Q0,-50 -77,-66 Z" '
            f'fill="{NAVY}" stroke="{INK}" stroke-width="7" stroke-linejoin="round"/>'
            f'<path d="M-75,-80 Q0,-64 75,-80" stroke="#2c3f6c" stroke-width="5" fill="none"/>'
            f'<path d="M-46,-130 Q0,-135 46,-130" stroke="#33497a" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.8"/>'
            # gold ornament (stylised "қошқар мүйіз")
            f'<g stroke="#e3c27a" stroke-width="4" fill="none" stroke-linecap="round" transform="translate(0,-104) scale(0.95)">'
            f'<path d="M0,10 L0,-12"/>'
            f'<path d="M0,0 Q-4,-14 -14,-12 Q-24,-8 -18,2 Q-14,8 -8,4"/>'
            f'<path d="M0,0 Q4,-14 14,-12 Q24,-8 18,2 Q14,8 8,4"/>'
            f'<path d="M-6,12 Q0,6 6,12"/><circle cx="0" cy="-16" r="3.5" fill="{GOLD}"/></g></g>')


def glasses():
    return (f'<g stroke="{INK}" stroke-width="5" fill="#bfe3ff" fill-opacity="0.25">'
            f'<circle cx="-28" cy="-11" r="22"/><circle cx="28" cy="-12" r="22"/>'
            f'<path d="M-6,-14 Q0,-20 6,-14" fill="none"/>'
            f'<path d="M-50,-16 L-78,-22" fill="none"/><path d="M50,-16 L78,-22" fill="none"/></g>')


def glove(x, y, ang, flip=False):
    """Cartoon glove hand oriented along the forearm (angle in degrees)."""
    sy = -1 if flip else 1
    st = f'fill="#fff" stroke="{INK}" stroke-width="4.5" stroke-linejoin="round"'
    return (f'<g transform="translate({x},{y}) rotate({ang:.1f}) scale(1.3,{sy*1.3})">'
            f'<rect x="10" y="-13" width="22" height="9" rx="4.5" {st}/>'
            f'<rect x="12" y="-4" width="22" height="9" rx="4.5" {st}/>'
            f'<rect x="10" y="5" width="19" height="9" rx="4.5" {st}/>'
            f'<ellipse cx="2" cy="0" rx="17" ry="16" {st}/>'
            f'<ellipse cx="6" cy="-17" rx="10" ry="6" transform="rotate(-35 6 -17)" {st}/>'
            f'<path d="M-14,-6 L-16,6" stroke="{INK}" stroke-width="3" opacity="0.4"/></g>')


def hero(x, y, s=1.0, arms=None, expr="smile", legs="stand", behind="", held="",
         front="", glasses_on=False, xray=False):
    """arms: dict L/R -> list of (x,y) points after the shoulder; last point = hand.
    held: svg drawn between arms and hands (objects in hand).
    Local coordinates: head centre (0,-20) r=82, feet near y=340."""
    import math
    arms = arms or {"L": [(-76, 150), (-66, 205)], "R": [(76, 150), (66, 205)]}
    g = f'<g transform="translate({x},{y}) scale({s})">' + behind
    # legs
    if legs == "stand":
        g += limb("M-24,246 L-28,326", 22) + limb("M24,246 L28,326", 22)
        g += f'<path d="M-50,336 Q-50,318 -28,318 Q-10,318 -10,336 Z" fill="{INK}"/><path d="M50,336 Q50,318 28,318 Q10,318 10,336 Z" fill="{INK}"/>'
    else:  # sitting, seen from the front
        g += limb("M-26,246 L-38,268 L-40,310", 22) + limb("M26,246 L38,268 L40,310", 22)
        g += f'<path d="M-62,322 Q-62,304 -40,304 Q-20,304 -20,322 Z" fill="{INK}"/><path d="M62,322 Q62,304 40,304 Q20,304 20,322 Z" fill="{INK}"/>'
    # white shirt torso
    sw = f'stroke="{INK}" stroke-width="6" stroke-linejoin="round"'
    g += f'<path d="M-68,80 Q0,58 68,80 L66,246 Q0,258 -66,246 Z" fill="#fff" {sw}/>'
    # shirt buttons in the open front
    g += ''.join(f'<circle cx="0" cy="{yy}" r="3" fill="{INK}" opacity="0.5"/>' for yy in (115, 150, 185, 220))
    # vest panels (V-neck, open front)
    g += (f'<path d="M-70,82 Q-48,64 -26,62 L-10,150 L-10,252 L-68,246 Z" fill="{VEST}" {sw}/>'
          f'<path d="M70,82 Q48,64 26,62 L10,150 L10,252 L68,246 Z" fill="{VEST}" {sw}/>'
          # stitching
          f'<path d="M-58,88 Q-44,74 -32,72 L-18,150 L-18,242 M58,88 Q44,74 32,72 L18,150 L18,242" stroke="{VEST_D}" stroke-width="2.5" stroke-dasharray="6 5" fill="none"/>'
          # vest buttons
          f'<circle cx="16" cy="180" r="4.5" fill="{VEST_D}" stroke="{INK}" stroke-width="2"/><circle cx="16" cy="214" r="4.5" fill="{VEST_D}" stroke="{INK}" stroke-width="2"/>')
    # pockets with flaps + buttons (two lower, one chest)
    for px in (-60, 18):
        g += (f'<rect x="{px}" y="162" width="42" height="48" rx="4" fill="{VEST}" stroke="{INK}" stroke-width="4"/>'
              f'<path d="M{px-2},162 L{px+44},162 L{px+44},178 L{px+21},184 L{px-2},178 Z" fill="{VEST_D}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>'
              f'<circle cx="{px+21}" cy="178" r="4" fill="{INK}"/>')
    g += (f'<path d="M24,104 L52,102 L52,116 L38,120 L24,116 Z" fill="{VEST_D}" stroke="{INK}" stroke-width="4" stroke-linejoin="round"/>')
    # shirt collar
    g += (f'<path d="M-2,64 L-32,60 L-20,94 Z" fill="#fff" {sw}/>'
          f'<path d="M2,64 L32,60 L20,94 Z" fill="#fff" {sw}/>')
    # arms (thicker sleeves)
    for side, sx in (("L", -60), ("R", 60)):
        pts = [(sx, 98)] + list(arms[side])
        d = "M" + " L".join(f"{px},{py}" for px, py in pts)
        g += limb(d, 28)
    g += held
    for side, sx in (("L", -60), ("R", 60)):
        pts = [(sx, 98)] + list(arms[side])
        hx, hy = pts[-1]
        px, py = pts[-2]
        if side + "_thumb" in arms:
            g += thumbs_up(hx, hy)
        else:
            ang = math.degrees(math.atan2(hy - py, hx - px))
            g += glove(hx, hy, ang, flip=(side == "R"))
    # head
    if xray:
        g += ('<circle cx="0" cy="-20" r="82" fill="#9fdcff" fill-opacity="0.22" stroke="#7fd4ff" stroke-width="6"/>'
              '<circle cx="0" cy="-20" r="82" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="2" stroke-dasharray="4 6"/>')
        g += "".join(f'<line x1="-80" y1="{yy}" x2="80" y2="{yy}" stroke="#bfe9ff" stroke-opacity="0.12" stroke-width="2"/>' for yy in range(-94, 58, 10))
        g += front
        g += face(expr, dy=16, op=0.85) + taqiya(op=0.4)
    else:
        g += f'<circle cx="0" cy="-20" r="82" fill="#fff" stroke="{INK}" stroke-width="8"/>'
        g += '<path d="M60,-60 Q86,0 40,46 Q10,64 -30,58 Q30,40 52,0 Q64,-30 60,-60 Z" fill="#dfe3ea"/>'
        g += face(expr)
        if glasses_on:
            g += glasses()
        g += taqiya() + front
    return g + '</g>'


# ---------- generic background stickmen ----------
def stick(head, neck, hip, arms=(), legs=(), r=30, face_dir=0, expr="flat", hat="", fill="#fff"):
    hx, hy = head
    g = ""
    for l in legs:
        g += limb("M" + " L".join(f"{a},{b}" for a, b in [hip] + list(l)), 10)
    g += limb(f"M{neck[0]},{neck[1]} L{hip[0]},{hip[1]}", 12)
    for a in arms:
        g += limb("M" + " L".join(f"{p},{q}" for p, q in [neck] + list(a)), 9)
    g += f'<circle cx="{hx}" cy="{hy}" r="{r}" fill="{fill}" stroke="{INK}" stroke-width="5"/>'
    ex = hx + face_dir * r * 0.35
    g += f'<ellipse cx="{ex - r*0.28}" cy="{hy - r*0.1}" rx="{r*0.09}" ry="{r*0.14}" fill="{INK}"/>'
    g += f'<ellipse cx="{ex + r*0.28}" cy="{hy - r*0.1}" rx="{r*0.09}" ry="{r*0.14}" fill="{INK}"/>'
    if expr == "happy":
        g += f'<path d="M{ex-r*0.35},{hy+r*0.25} Q{ex},{hy+r*0.65} {ex+r*0.35},{hy+r*0.25}" stroke="{INK}" stroke-width="4" fill="none" stroke-linecap="round"/>'
    elif expr == "angry":
        g += f'<path d="M{ex-r*0.5},{hy-r*0.45} L{ex-r*0.1},{hy-r*0.3} M{ex+r*0.5},{hy-r*0.45} L{ex+r*0.1},{hy-r*0.3}" stroke="{INK}" stroke-width="4"/>'
        g += f'<ellipse cx="{ex}" cy="{hy+r*0.38}" rx="{r*0.22}" ry="{r*0.18}" fill="{INK}"/>'
    elif expr == "wow":
        g += f'<circle cx="{ex}" cy="{hy+r*0.38}" r="{r*0.14}" fill="{INK}"/>'
    else:
        g += f'<path d="M{ex-r*0.25},{hy+r*0.35} L{ex+r*0.25},{hy+r*0.35}" stroke="{INK}" stroke-width="4" stroke-linecap="round"/>'
    return g + hat


def gamepad(x, y, s=1.0, rot=0):
    return (f'<g transform="translate({x},{y}) rotate({rot}) scale({s})">'
            f'<path d="M-40,-14 Q-44,-22 -30,-22 L30,-22 Q44,-22 40,-14 L48,14 Q50,26 38,24 L22,10 L-22,10 L-38,24 Q-50,26 -48,14 Z" fill="#2b2b33" stroke="{INK}" stroke-width="4"/>'
            f'<path d="M-30,-6 h12 M-24,-12 v12" stroke="#ddd" stroke-width="4"/>'
            f'<circle cx="24" cy="-10" r="4" fill="#ff5a5a"/><circle cx="32" cy="-2" r="4" fill="#4fd1ff"/>'
            f'<circle cx="16" cy="-2" r="4" fill="#8be36b"/><circle cx="24" cy="6" r="4" fill="#ffd257"/></g>')


def palm(x, y, s=1.0, color="#1a1030"):
    return (f'<g transform="translate({x},{y}) scale({s})" fill="{color}">'
            f'<path d="M-6,0 Q-14,-120 8,-220 L16,-218 Q2,-120 8,0 Z"/>'
            f'<path d="M12,-220 Q-50,-250 -110,-200 Q-50,-226 12,-212 Z"/>'
            f'<path d="M12,-220 Q70,-260 130,-200 Q70,-232 12,-212 Z"/>'
            f'<path d="M12,-222 Q-20,-290 -70,-280 Q-20,-262 10,-214 Z"/>'
            f'<path d="M12,-222 Q50,-290 100,-270 Q50,-262 14,-214 Z"/>'
            f'<path d="M12,-218 Q-60,-200 -90,-140 Q-40,-196 12,-210 Z"/>'
            f'<path d="M12,-218 Q80,-200 110,-140 Q60,-196 12,-210 Z"/></g>')


def label_bar(s):
    return (f'<rect x="0" y="0" width="{W}" height="0" />'  # placeholder for consistent structure
            f'<g><rect x="60" y="40" rx="14" width="{len(s)*22+60}" height="64" fill="#000" fill-opacity="0.35" stroke="{GOLD}" stroke-opacity="0.6" stroke-width="2"/>'
            + text(90, 84, s, 34, "#f3e6c8", anchor="start") + '</g>')


# ====================== FRAMES ======================
frames = {}

# ---- КАДР 1: empty office vs. people gaming at home ----
def f1():
    g = background()
    # left: office
    g += '<rect x="0" y="0" width="960" height="1080" fill="#2c3646" fill-opacity="0.55"/>'
    g += '<rect x="0" y="820" width="960" height="260" fill="#1e2430"/>'
    g += '<line x1="0" y1="820" x2="960" y2="820" stroke="#0e1118" stroke-width="6"/>'
    # window
    g += '<rect x="560" y="130" width="320" height="230" fill="#9fc2d8" fill-opacity="0.25" stroke="#0e1118" stroke-width="8"/><line x1="720" y1="130" x2="720" y2="360" stroke="#0e1118" stroke-width="6"/><line x1="560" y1="245" x2="880" y2="245" stroke="#0e1118" stroke-width="6"/>'
    # calendar
    g += ('<g transform="translate(110,120) rotate(-3)"><rect width="230" height="250" rx="12" fill="#f4efe2" stroke="#0e1118" stroke-width="7"/>'
          '<rect width="230" height="70" rx="12" fill="#c0392b" stroke="#0e1118" stroke-width="7"/>'
          '<circle cx="60" cy="0" r="9" fill="#333"/><circle cx="170" cy="0" r="9" fill="#333"/>'
          + text(115, 50, "ҚАРАША", 32, "#fff") + text(115, 200, "19", 120, "#1b1b1b") + '</g>')
    # clock
    g += '<g transform="translate(450,190)"><circle r="55" fill="#f4efe2" stroke="#0e1118" stroke-width="7"/><path d="M0,0 L0,-36 M0,0 L28,10" stroke="#0e1118" stroke-width="6" stroke-linecap="round"/></g>'
    # desks
    for dx in (90, 400, 700):
        g += (f'<g transform="translate({dx},0)">'
              f'<rect x="0" y="650" width="220" height="22" fill="#8a6a4a" stroke="#0e1118" stroke-width="5"/>'
              f'<rect x="12" y="672" width="14" height="150" fill="#5e4632"/><rect x="194" y="672" width="14" height="150" fill="#5e4632"/>'
              f'<rect x="55" y="540" width="120" height="85" rx="6" fill="#141a24" stroke="#0e1118" stroke-width="6"/>'
              f'<rect x="103" y="625" width="24" height="25" fill="#2a2f3a"/>'
              f'<path d="M70,740 L160,740 L150,700 L80,700 Z" fill="#3b4558" stroke="#0e1118" stroke-width="5"/>'
              f'<rect x="108" y="740" width="14" height="60" fill="#2a2f3a"/><ellipse cx="115" cy="805" rx="40" ry="8" fill="#2a2f3a"/></g>')
    # flying paper + "dust"
    g += '<path d="M300,470 l60,-14 l10,40 l-60,14 Z" fill="#e8e2d0" stroke="#0e1118" stroke-width="4" transform="rotate(12 330 480)"/>'
    g += '<path d="M260,500 q30,-30 60,-10 M380,450 q20,-25 50,-5" stroke="#cfd6e0" stroke-opacity="0.5" stroke-width="4" fill="none"/>'
    g += text(480, 1000, "Кеңселер бос", 46, "#cfd6e0")
    # divider
    g += f'<rect x="952" y="0" width="16" height="1080" fill="{GOLD}" fill-opacity="0.8"/>'
    # right: living room
    g += '<rect x="968" y="0" width="952" height="1080" fill="#241c30" fill-opacity="0.65"/>'
    g += '<rect x="968" y="860" width="952" height="220" fill="#1a1422"/>'
    # TV glow
    g += '<ellipse cx="1760" cy="560" rx="380" ry="420" fill="url(#glowBlue)" opacity="0.55"/>'
    g += ('<rect x="1660" y="400" width="230" height="300" rx="10" fill="#0d0f14" stroke="#0e1118" stroke-width="8"/>'
          '<rect x="1676" y="416" width="198" height="268" fill="#6ad0ff" fill-opacity="0.85"/>'
          '<rect x="1676" y="600" width="198" height="84" fill="#ff4fa3" fill-opacity="0.65"/>'
          + palm(1790, 640, 0.55, "#1a1030") +
          '<rect x="1740" y="700" width="70" height="160" fill="#2a2234"/>')
    # sofa
    g += ('<rect x="1010" y="640" width="560" height="140" rx="40" fill="#6b4a33" stroke="#0e1118" stroke-width="7"/>'
          '<rect x="1000" y="740" width="580" height="110" rx="30" fill="#7d5639" stroke="#0e1118" stroke-width="7"/>')
    # gamers on sofa (facing right toward TV)
    for i, bx in enumerate((1100, 1260, 1420)):
        hy = 560 + (i % 2) * 10
        g += stick((bx, hy), (bx - 4, hy + 34), (bx - 8, 760),
                   arms=[[(bx + 30, 690), (bx + 70, 668)], [(bx + 22, 700), (bx + 64, 684)]],
                   legs=[[(bx + 70, 770), (bx + 70, 870)], [(bx + 60, 780), (bx + 56, 875)]],
                   r=40, face_dir=1, expr="wow")
        g += gamepad(bx + 72, 676, 0.75)
    # one more on the floor beanbag
    g += '<ellipse cx="1560" cy="900" rx="90" ry="55" fill="#4a7a5a" stroke="#0e1118" stroke-width="6"/>'
    g += stick((1560, 760), (1556, 794), (1550, 890), arms=[[(1590, 850), (1620, 832)]], legs=[[(1630, 900), (1650, 960)]], r=38, face_dir=1, expr="wow")
    g += gamepad(1626, 840, 0.7)
    # "Z" / sick-day thermometer joke
    g += text(1180, 470, "«тұмауратып» қалғандар", 38, "#ffd9e8")
    g += text(1440, 1000, "Миллиондар үйде", 46, "#ffd9e8")
    return g

frames[1] = ("КАДР 1 — 19 қараша", f1)


# ---- КАДР 2: hero studies game characters with a magnifier ----
def f2():
    g = background()
    # big game screen
    g += '<ellipse cx="1450" cy="470" rx="560" ry="420" fill="url(#glowBlue)" opacity="0.35"/>'
    g += ('<defs><linearGradient id="sunset" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b1d6e"/><stop offset="0.55" stop-color="#ff5fa2"/><stop offset="1" stop-color="#ffb347"/></linearGradient></defs>'
          '<rect x="1060" y="170" width="760" height="520" rx="22" fill="#0d0f14" stroke="#0e1118" stroke-width="10"/>'
          '<rect x="1084" y="194" width="712" height="472" rx="8" fill="url(#sunset)"/>'
          '<circle cx="1440" cy="520" r="110" fill="#ffd36b" opacity="0.9"/>'
          '<rect x="1084" y="560" width="712" height="106" fill="#26103e"/>'
          + palm(1170, 600, 0.9) + palm(1720, 610, 1.0) +
          '<rect x="1400" y="690" width="80" height="120" fill="#20242e" stroke="#0e1118" stroke-width="6"/>'
          '<rect x="1320" y="805" width="240" height="20" rx="8" fill="#20242e" stroke="#0e1118" stroke-width="6"/>')
    # two game characters on screen (generic heroes)
    g += stick((1370, 420), (1370, 452), (1370, 540), arms=[[(1340, 500), (1330, 470)], [(1400, 500), (1420, 520)]],
               legs=[[(1350, 610)], [(1392, 610)]], r=32, expr="flat",
               hat='<path d="M1340,402 Q1370,372 1400,402 Z" fill="#222"/>')
    g += stick((1500, 425), (1500, 456), (1500, 540), arms=[[(1470, 500), (1455, 525)], [(1530, 495), (1548, 466)]],
               legs=[[(1482, 610)], [(1520, 610)]], r=30, expr="happy",
               hat='<path d="M1468,420 Q1500,370 1532,420 Q1540,470 1520,480 Q1500,400 1480,480 Q1460,470 1468,420 Z" fill="#5a2d1a" opacity="0.9"/>')
    # hero
    mag = ('<g><line x1="250" y1="40" x2="300" y2="-10" stroke="#5a3a20" stroke-width="16" stroke-linecap="round"/>'
           '<circle cx="345" cy="-55" r="62" fill="#bfe9ff" fill-opacity="0.35" stroke="#2b2b2b" stroke-width="14"/>'
           '<circle cx="345" cy="-55" r="62" fill="none" stroke="#c9a14a" stroke-width="6"/>'
           '<path d="M318,-85 Q332,-98 352,-96" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.8"/></g>')
    g += hero(620, 520, 1.45, arms={"L": [(-90, 150), (-110, 70)], "R": [(130, 110), (240, 50)]},
              expr="wow", held=mag)
    g += text(420, 360, "?", 110, GOLD) + text(870, 270, "!", 100, GOLD)
    return g

frames[2] = ("КАДР 2 — Зерттеуші ойынды зерттейді", f2)


# ---- КАДР 3: x-ray head with DOPAMINE lamp ----
def f3():
    g = background()
    g += '<circle cx="960" cy="420" r="420" fill="url(#glowGold)" opacity="0.35"/>'
    brain = ('<path d="M-52,-48 Q-62,-80 -30,-86 Q-18,-104 6,-96 Q30,-106 46,-86 Q70,-78 60,-52 Q70,-30 46,-22 Q30,-8 6,-16 Q-16,-6 -32,-20 Q-62,-20 -52,-48 Z" '
             'fill="#ff9fb8" fill-opacity="0.55" stroke="#ff6f95" stroke-width="4"/>'
             '<path d="M-36,-66 Q-20,-58 -26,-44 M-4,-86 Q8,-70 -4,-56 Q8,-44 2,-30 M28,-80 Q20,-66 34,-56 M40,-40 Q30,-36 26,-28" stroke="#d64d76" stroke-width="3" fill="none" stroke-linecap="round"/>'
             # glowing bulb
             '<circle cx="4" cy="-56" r="56" fill="url(#glowGold)"/>'
             '<path d="M-16,-56 Q-16,-84 4,-84 Q24,-84 24,-56 Q24,-44 14,-36 L-6,-36 Q-16,-44 -16,-56 Z" fill="#ffe27a" stroke="#b07a00" stroke-width="3"/>'
             '<rect x="-6" y="-36" width="20" height="10" rx="2" fill="#9a9a9a" stroke="#555" stroke-width="2"/>'
             '<path d="M-2,-46 L0,-62 L6,-52 L8,-62 L10,-46" stroke="#b07a00" stroke-width="2" fill="none"/>')
    g += hero(960, 560, 1.6, arms={"L": [(-80, 150), (-70, 205)], "R": [(110, 80), (120, -10)]},
              expr="grin", xray=True, front=brain)
    # rays
    for i in range(12):
        import math
        a = i * math.pi / 6
        x1, y1 = 966 + 190 * math.cos(a), 470 + 190 * math.sin(a)
        x2, y2 = 966 + 250 * math.cos(a), 470 + 250 * math.sin(a)
        if 0.2 < a < 2.9:
            continue
        g += f'<line x1="{x1:.0f}" y1="{y1:.0f}" x2="{x2:.0f}" y2="{y2:.0f}" stroke="#ffd257" stroke-width="8" stroke-linecap="round" opacity="0.8"/>'
    # label
    g += ('<path d="M1100,330 Q1250,250 1360,250" stroke="#ffd257" stroke-width="5" fill="none" stroke-dasharray="10 8"/>'
          '<rect x="1360" y="200" width="420" height="100" rx="18" fill="#000" fill-opacity="0.45" stroke="#ffd257" stroke-width="4"/>'
          + text(1570, 268, "DOPAMINE", 62, "#ffd257", extra='letter-spacing="4"'))
    g += text(1570, 350, "«жаңа нәрсе = марапат»", 34, "#f3e6c8", weight="normal")
    return g

frames[3] = ("КАДР 3 — Мидағы дофамин шамы", f3)


# ---- КАДР 4: split screen stone age vs Vice City ----
def spark(x, y, s=1):
    return (f'<g transform="translate({x},{y}) scale({s})"><circle r="46" fill="url(#glowGold)"/>'
            '<path d="M0,-30 L7,-7 L30,0 L7,7 L0,30 L-7,7 L-30,0 L-7,-7 Z" fill="#fff3b0" stroke="#e0a800" stroke-width="3"/></g>')


def f4():
    g = background()
    # left - stone age
    g += ('<defs><linearGradient id="dawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d5a4a"/><stop offset="1" stop-color="#8a7b4a"/></linearGradient>'
          '<linearGradient id="neon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a0f4d"/><stop offset="0.6" stop-color="#ff4fa3"/><stop offset="1" stop-color="#ffae5c"/></linearGradient></defs>'
          '<rect x="0" y="0" width="952" height="1080" fill="url(#dawn)"/>'
          '<rect x="0" y="860" width="952" height="220" fill="#4d3b22"/>'
          '<path d="M0,860 Q200,800 420,860 T952,850 L952,870 L0,880 Z" fill="#5d6b34"/>')
    # tree
    g += ('<rect x="560" y="420" width="60" height="450" fill="#5b3b1f" stroke="#0e1118" stroke-width="6"/>'
          '<circle cx="590" cy="380" r="170" fill="#2f6a3a" stroke="#0e1118" stroke-width="6"/>'
          '<circle cx="480" cy="430" r="100" fill="#367a42" stroke="#0e1118" stroke-width="6"/>'
          '<circle cx="710" cy="440" r="110" fill="#367a42" stroke="#0e1118" stroke-width="6"/>')
    for fx, fy in ((520, 360), (640, 300), (720, 450), (600, 470), (460, 470)):
        g += f'<circle cx="{fx}" cy="{fy}" r="18" fill="#e0412f" stroke="#0e1118" stroke-width="4"/>'
    # caveman
    g += stick((300, 560), (300, 600), (300, 760), arms=[[(370, 560), (420, 500)], [(250, 660), (220, 620)]],
               legs=[[(270, 870)], [(335, 870)]], r=58, expr="happy",
               hat='<path d="M248,520 Q300,480 352,520 L340,505 L328,520 L314,500 L300,518 L286,500 L272,520 L260,505 Z" fill="#3a2614"/>')
    g += '<path d="M268,640 L332,640 L344,770 L320,755 L300,775 L280,755 L256,770 Z" fill="#9a6a3a" stroke="#0e1118" stroke-width="5"/>'
    g += '<circle cx="425" cy="490" r="22" fill="#e0412f" stroke="#0e1118" stroke-width="4"/><path d="M425,468 q6,-12 16,-12" stroke="#2f6a3a" stroke-width="5" fill="none"/>'
    g += spark(300, 470, 0.7)
    g += text(476, 110, "50 000 жыл бұрын", 54, "#fff8e0")
    # divider
    g += f'<rect x="952" y="0" width="16" height="1080" fill="{GOLD}"/>'
    # right - Vice City
    g += '<rect x="968" y="0" width="952" height="1080" fill="url(#neon)"/>'
    g += '<circle cx="1444" cy="640" r="190" fill="#ffd36b" opacity="0.85"/>'
    for i, yy in enumerate(range(560, 720, 26)):
        g += f'<rect x="1250" y="{yy}" width="390" height="{8 + i}" fill="url(#neon)"/>'
    g += palm(1030, 860, 1.25) + palm(1850, 860, 1.4) + palm(1730, 860, 0.9)
    g += ('<rect x="968" y="800" width="952" height="280" fill="#2a2234"/>'
          '<path d="M968,940 L1920,940" stroke="#ffd257" stroke-width="10" stroke-dasharray="60 40"/>')
    # sports car
    g += ('<g transform="translate(1440,810)">'
          '<path d="M-260,40 Q-250,-10 -170,-20 L-90,-70 Q0,-90 90,-60 L180,-20 Q260,-10 270,40 L260,70 L-255,70 Z" fill="#ff3d7f" stroke="#0e1118" stroke-width="8" stroke-linejoin="round"/>'
          '<path d="M-80,-60 L-20,-62 L-10,-24 L-150,-20 Z" fill="#9fe7ff" stroke="#0e1118" stroke-width="5"/>'
          '<circle cx="-160" cy="72" r="46" fill="#1a1a1a" stroke="#0e1118" stroke-width="6"/><circle cx="-160" cy="72" r="18" fill="#bbb"/>'
          '<circle cx="170" cy="72" r="46" fill="#1a1a1a" stroke="#0e1118" stroke-width="6"/><circle cx="170" cy="72" r="18" fill="#bbb"/>'
          '<path d="M-330,0 h50 M-340,30 h60 M-320,60 h40" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.7"/></g>')
    # driver
    g += stick((1440, 670), (1440, 705), (1440, 770), arms=[[(1490, 720), (1530, 650)], [(1400, 740), (1380, 770)]], legs=[], r=56, expr="happy",
               hat='<path d="M1392,650 Q1440,600 1488,650 L1500,654 L1380,654 Z" fill="#111"/><rect x="1395" y="660" width="90" height="18" rx="8" fill="#111" opacity="0.85"/>')
    g += spark(1440, 580, 0.7)
    g += text(1444, 110, "Бүгін — Vice City", 54, "#fff8e0")
    # link arc
    g += ('<path d="M330,470 Q960,120 1420,580" stroke="#fff3b0" stroke-width="6" fill="none" stroke-dasharray="14 12" opacity="0.9"/>'
          '<rect x="720" y="210" width="480" height="80" rx="40" fill="#000" fill-opacity="0.55" stroke="#ffd257" stroke-width="4"/>'
          + text(960, 263, "⚡ Бірдей импульс", 38, "#ffd257"))
    return g

frames[4] = ("КАДР 4 — Тас дәуірі мен Vice City", f4)


# ---- КАДР 5: lecture at the board ----
def f5():
    g = background()
    g += ('<rect x="820" y="140" width="1000" height="640" rx="16" fill="#5b3b22" stroke="#0e1118" stroke-width="8"/>'
          '<rect x="846" y="166" width="948" height="588" rx="6" fill="#20392f"/>'
          '<rect x="900" y="780" width="840" height="20" fill="#5b3b22" stroke="#0e1118" stroke-width="5"/>')
    # chalk brain side-view
    bx, by = 1300, 470
    g += (f'<g transform="translate({bx},{by})" fill="none" stroke="#f1f1e8" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">'
          '<path d="M-260,40 Q-300,-80 -200,-160 Q-100,-230 40,-210 Q200,-200 250,-90 Q300,10 230,80 Q180,130 90,120 Q40,170 -40,140 Q-150,170 -220,110 Q-270,90 -260,40 Z"/>'
          '<path d="M60,120 Q70,180 50,230" />'
          '<path d="M140,100 Q190,140 230,110 Q250,80 230,80" />'
          '<path d="M-40,-200 Q-10,-120 -60,-40 Q-80,20 -20,70" opacity="0.8"/>'
          '<path d="M-180,-60 Q-140,-90 -100,-60 M80,-140 Q120,-100 100,-40 M140,-20 Q180,0 170,50 M-150,40 Q-100,10 -60,50" opacity="0.7"/></g>')
    # highlighted prefrontal cortex (front of brain = left)
    g += (f'<path transform="translate({bx},{by})" d="M-260,40 Q-300,-80 -200,-160 Q-150,-195 -90,-205 Q-60,-120 -110,-40 Q-140,30 -150,150 Q-200,140 -220,110 Q-270,90 -260,40 Z" '
          'fill="#ff9a3c" fill-opacity="0.55" stroke="#ffb35c" stroke-width="6"/>')
    g += text(880, 215, "ПРЕФРОНТАЛЬДЫ КОРТЕКС", 34, "#ffd08a", anchor="start")
    g += ('<g font-family="' + FONT + '" font-size="40" fill="#f1f1e8" font-weight="bold">'
          '<text x="1530" y="680">Шындық?</text><text x="1580" y="730" fill="#9fe7ff">Ойын?</text></g>'
          '<path d="M1470,660 q30,30 0,60" stroke="#f1f1e8" stroke-width="5" fill="none"/>')
    g += text(1040, 720, "логика", 32, "#f1f1e8", weight="normal")
    # pointer
    pointer = '<line x1="160" y1="-60" x2="530" y2="-150" stroke="#8a5a2b" stroke-width="12" stroke-linecap="round"/><circle cx="530" cy="-150" r="9" fill="#e64a3a"/>'
    g += hero(480, 520, 1.5, arms={"L": [(-80, 150), (-110, 100)], "R": [(110, 60), (160, -60)]},
              expr="smile", glasses_on=True, held=pointer)
    return g

frames[5] = ("КАДР 5 — Префронтальды кортекс", f5)


# ---- КАДР 6: gamer in armchair, heroic shadow on the wall ----
def f6():
    g = background()
    # wall light from lamp
    g += '<ellipse cx="330" cy="420" rx="420" ry="420" fill="url(#glowGold)" opacity="0.25"/>'
    g += '<rect x="0" y="880" width="1920" height="200" fill="#1a1720"/>'
    # heroic shadow silhouette on the wall (jumping from a car)
    sh = '#05070c'
    g += f'<g opacity="0.75" fill="{sh}" stroke="{sh}">'
    g += ('<path d="M1060,760 Q1080,700 1160,690 L1240,640 Q1330,620 1420,650 L1500,690 Q1580,700 1590,760 L1580,790 L1070,790 Z"/>'
          '<circle cx="1160" cy="795" r="42"/><circle cx="1490" cy="795" r="42"/>'
          '<circle cx="1420" cy="300" r="78"/>'
          '<path d="M1395,370 L1350,560" stroke-width="40" stroke-linecap="round" fill="none"/>'
          '<path d="M1385,410 L1500,340 L1590,300" stroke-width="30" stroke-linecap="round" fill="none"/>'
          '<path d="M1380,420 L1270,380 L1200,420" stroke-width="30" stroke-linecap="round" fill="none"/>'
          '<path d="M1350,560 L1460,620 L1500,700" stroke-width="32" stroke-linecap="round" fill="none"/>'
          '<path d="M1350,560 L1250,610 L1240,690" stroke-width="32" stroke-linecap="round" fill="none"/>'
          '<path d="M1360,250 Q1420,200 1480,250 Z"/>')
    g += '</g>'
    # motion lines + explosion hint
    g += ('<g stroke="#ffb35c" stroke-width="6" stroke-linecap="round" opacity="0.7">'
          '<line x1="1640" y1="260" x2="1760" y2="230"/><line x1="1650" y1="330" x2="1790" y2="330"/><line x1="1640" y1="400" x2="1760" y2="430"/></g>'
          '<path d="M1700,700 l40,-80 l20,60 l60,-50 l-10,80 l70,10 l-70,40 l40,60 l-80,-20 l-30,70 l-20,-80 Z" fill="#ff7a2f" opacity="0.65"/>')
    # light cone from gamer to shadow
    g += '<path d="M560,560 L1140,170 L1700,170 L1700,860 L560,700 Z" fill="#fff3b0" opacity="0.05"/>'
    # floor lamp
    g += ('<rect x="140" y="250" width="12" height="630" fill="#2a2a2a"/>'
          '<path d="M90,250 L200,250 L170,170 L120,170 Z" fill="#e6c27a" stroke="#0e1118" stroke-width="5"/>'
          '<ellipse cx="146" cy="880" rx="60" ry="12" fill="#2a2a2a"/>')
    # armchair
    behind = ('<path d="M-150,40 Q-160,-90 -110,-110 L110,-110 Q160,-90 150,40 Z" fill="#8b3b3b" stroke="#0e1118" stroke-width="7"/>'
              '<rect x="-170" y="200" width="340" height="120" rx="30" fill="#7a3232" stroke="#0e1118" stroke-width="7"/>'
              '<rect x="-190" y="120" width="70" height="200" rx="30" fill="#943f3f" stroke="#0e1118" stroke-width="7"/>'
              '<rect x="120" y="120" width="70" height="200" rx="30" fill="#943f3f" stroke="#0e1118" stroke-width="7"/>'
              '<rect x="-160" y="320" width="20" height="40" fill="#3a1a1a"/><rect x="140" y="320" width="20" height="40" fill="#3a1a1a"/>')
    pad = gamepad(0, 160, 1.3)
    g += hero(560, 500, 1.15, arms={"L": [(-80, 160), (-30, 170)], "R": [(80, 160), (30, 170)]},
              expr="wow", legs="sit", behind=behind, held=pad)
    g += text(1400, 140, "Қауіпсіз тәуекел", 52, "#ffd08a")
    return g

frames[6] = ("КАДР 6 — Қауіпсіз тәуекел", f6)


# ---- КАДР 7: hourglass, scroll, pointing to the past ----
def f7():
    g = background()
    g += '<rect x="0" y="0" width="1000" height="1080" fill="#6b4f2a" opacity="0.18"/>'
    # faded timeline into the past
    g += '<path d="M120,620 Q400,520 700,600 Q850,640 960,600" stroke="#e8d6ad" stroke-width="6" fill="none" stroke-dasharray="16 14" opacity="0.7"/>'
    items = [(160, "1800", "book"), (380, "1920", "radio"), (600, "1950", "tv"), (820, "2026", "pad")]
    for i, (x, yr, kind) in enumerate(items):
        op = 0.35 + i * 0.18
        y = 470
        g += f'<g opacity="{op:.2f}"><circle cx="{x}" cy="{y}" r="80" fill="#e8d6ad" fill-opacity="0.12" stroke="#e8d6ad" stroke-width="4"/>'
        if kind == "book":
            g += f'<path d="M{x-46},{y-28} L{x},{y-18} L{x+46},{y-28} L{x+46},{y+30} L{x},{y+40} L{x-46},{y+30} Z M{x},{y-18} L{x},{y+40}" fill="#c49a5a" stroke="#2a1a0a" stroke-width="5"/>'
        elif kind == "radio":
            g += f'<rect x="{x-48}" y="{y-30}" width="96" height="66" rx="12" fill="#a0703c" stroke="#2a1a0a" stroke-width="5"/><circle cx="{x-16}" cy="{y+4}" r="18" fill="#5a3a1a"/><circle cx="{x+26}" cy="{y-8}" r="6" fill="#ddd"/><line x1="{x+20}" y1="{y-30}" x2="{x+40}" y2="{y-66}" stroke="#2a1a0a" stroke-width="5"/>'
        elif kind == "tv":
            g += f'<rect x="{x-50}" y="{y-34}" width="100" height="76" rx="14" fill="#8a8a8a" stroke="#2a1a0a" stroke-width="5"/><rect x="{x-38}" y="{y-24}" width="66" height="54" rx="10" fill="#9fc2d8"/><path d="M{x-20},{y-34} L{x-36},{y-64} M{x+10},{y-34} L{x+26},{y-64}" stroke="#2a1a0a" stroke-width="4"/>'
        else:
            g += gamepad(x, y, 1.1)
        g += text(x, y + 140, yr, 40, "#e8d6ad") + '</g>'
    g += text(500, 180, "← Өткен ғасырлар", 52, "#e8d6ad")
    hourglass = ('<g transform="translate(-75,215)"><rect x="-40" y="-70" width="80" height="12" rx="4" fill="#7a4d24" stroke="#0e1118" stroke-width="4"/>'
                 '<rect x="-40" y="58" width="80" height="12" rx="4" fill="#7a4d24" stroke="#0e1118" stroke-width="4"/>'
                 '<path d="M-30,-58 L30,-58 Q30,-20 4,0 Q30,20 30,58 L-30,58 Q-30,20 -4,0 Q-30,-20 -30,-58 Z" fill="#cfeaff" fill-opacity="0.6" stroke="#0e1118" stroke-width="4"/>'
                 '<path d="M-20,-30 L20,-30 L4,-4 L-4,-4 Z" fill="#e6b85a"/><path d="M-26,56 Q0,26 26,56 Z" fill="#e6b85a"/>'
                 '<line x1="0" y1="-4" x2="0" y2="40" stroke="#e6b85a" stroke-width="3"/></g>')
    scroll = ('<g transform="translate(-205,10) rotate(-12)"><rect x="-90" y="-36" width="150" height="72" fill="#efdcae" stroke="#0e1118" stroke-width="5"/>'
              '<ellipse cx="-90" cy="0" rx="16" ry="40" fill="#d8bf86" stroke="#0e1118" stroke-width="5"/>'
              '<ellipse cx="60" cy="0" rx="16" ry="40" fill="#d8bf86" stroke="#0e1118" stroke-width="5"/>'
              '<path d="M-60,-16 h90 M-60,0 h80 M-60,16 h70" stroke="#8a6a3a" stroke-width="4"/></g>')
    g += hero(1340, 500, 1.5, arms={"L": [(-110, 90), (-190, 40)], "R": [(30, 170), (-60, 200)]},
              expr="smile", held=scroll + hourglass)
    return g

frames[7] = ("КАДР 7 — Тарихқа саяхат", f7)


# ---- КАДР 8: 19th-century doctors yelling at a reader ----
def tophat(x, y, w=70):
    return (f'<rect x="{x - w/2}" y="{y - 80}" width="{w}" height="80" fill="#151515" stroke="{INK}" stroke-width="5"/>'
            f'<rect x="{x - w/2}" y="{y - 26}" width="{w}" height="12" fill="#7a1f1f"/>'
            f'<rect x="{x - w*0.85}" y="{y - 4}" width="{w*1.7}" height="12" rx="6" fill="#151515"/>')


def f8():
    g = background()
    g += '<rect x="0" y="0" width="1920" height="1080" fill="#5a4128" opacity="0.25"/>'
    g += '<rect x="0" y="880" width="1920" height="200" fill="#2a1e14"/>'
    # wallpaper frame + candle
    g += ('<rect x="1400" y="150" width="260" height="200" fill="#3a2a1a" stroke="#c9a14a" stroke-width="10"/>'
          '<circle cx="1530" cy="250" r="50" fill="#5a4128"/>' + text(960, 110, "XIX ғасыр, Еуропа", 48, "#e8d6ad"))
    # doctors
    for dx, s in ((330, 1.0), (620, 1.0)):
        g += (f'<path d="M{dx-55},610 L{dx+55},610 L{dx+80},880 L{dx-80},880 Z" fill="#2b2b33" stroke="{INK}" stroke-width="6"/>'
              f'<path d="M{dx-12},610 L{dx},680 L{dx+12},610 Z" fill="#fff"/>')
        g += stick((dx, 520), (dx, 560), (dx, 790), arms=[[(dx + 90, 560), (dx + 180, 520)], [(dx - 70, 680), (dx - 60, 760)]],
                   legs=[[(dx - 30, 900)], [(dx + 30, 900)]], r=62, face_dir=1, expr="angry", hat=tophat(dx + 4, 466))
        g += f'<path d="M{dx+2},{548} q16,-10 30,0 q14,-10 30,0" stroke="{INK}" stroke-width="6" fill="none"/>'  # moustache
        g += f'<rect x="{dx+176}" y="508" width="34" height="12" rx="6" fill="#fff" stroke="{INK}" stroke-width="4"/>'  # pointing finger
    # young reader on chair
    rx = 1350
    g += (f'<rect x="{rx-80}" y="740" width="200" height="24" fill="#6b4a2a" stroke="{INK}" stroke-width="5"/>'
          f'<rect x="{rx+90}" y="520" width="24" height="230" fill="#6b4a2a" stroke="{INK}" stroke-width="5"/>'
          f'<rect x="{rx-70}" y="760" width="16" height="120" fill="#4a3220"/><rect x="{rx+100}" y="760" width="16" height="120" fill="#4a3220"/>')
    g += stick((rx, 560), (rx, 600), (rx + 20, 730), arms=[[(rx - 40, 670), (rx - 90, 640)], [(rx - 20, 690), (rx - 80, 668)]],
               legs=[[(rx - 70, 740), (rx - 80, 880)], [(rx - 60, 750), (rx - 60, 880)]], r=56, face_dir=-1, expr="wow")
    g += (f'<g transform="translate({rx-110},630) rotate(-15)"><path d="M-50,-36 L0,-26 L50,-36 L50,30 L0,40 L-50,30 Z" fill="#c49a5a" stroke="{INK}" stroke-width="5"/>'
          f'<line x1="0" y1="-26" x2="0" y2="40" stroke="{INK}" stroke-width="4"/></g>')
    g += text(rx + 180, 520, "?!", 80, GOLD)
    # speech bubble
    g += ('<path d="M500,180 Q500,120 580,120 L1260,120 Q1340,120 1340,180 L1340,300 Q1340,360 1260,360 L780,360 L650,440 L700,360 L580,360 Q500,360 500,300 Z" '
          'fill="#fffaf0" stroke="#0e1118" stroke-width="8"/>'
          + text(920, 265, "Кітап миды улайды!", 58, "#b3261e"))
    return g

frames[8] = ("КАДР 8 — «Кітап миды улайды!»", f8)


# ---- КАДР 9: evolution of media ----
def f9():
    g = background()
    g += '<rect x="0" y="860" width="1920" height="220" fill="#1a1d24"/>'
    g += ('<path d="M120,960 L1800,960" stroke="' + GOLD + '" stroke-width="8"/>'
          '<path d="M1800,960 l-40,-24 v48 Z" fill="' + GOLD + '"/>')
    labels = ["XIX ғ. · Кітап", "1920 · Радио", "1950 · Теледидар", "2026 · 4K ойын"]
    xs = [180, 590, 1000, 1380]
    for i, x in enumerate(xs):
        # stool
        g += f'<rect x="{x-60}" y="760" width="120" height="18" fill="#6b4a2a" stroke="{INK}" stroke-width="4"/><rect x="{x-50}" y="778" width="12" height="90" fill="#4a3220"/><rect x="{x+38}" y="778" width="12" height="90" fill="#4a3220"/>'
        r = 46
        hx, hy = x, 570
        g += stick((hx, hy), (hx, hy + 40), (hx, 750), arms=[[(hx + 50, 670), (hx + 90, 650)], [(hx + 40, 690), (hx + 84, 672)]],
                   legs=[[(hx + 70, 760), (hx + 70, 870)], [(hx + 56, 768), (hx + 50, 872)]], r=r, face_dir=1,
                   expr="happy" if i == 3 else "wow")
        ox = x + 170
        if i == 0:
            g += f'<g transform="translate({x+100},640) rotate(-20)"><path d="M-40,-30 L0,-22 L40,-30 L40,26 L0,34 L-40,26 Z" fill="#c49a5a" stroke="{INK}" stroke-width="5"/><line x1="0" y1="-22" x2="0" y2="34" stroke="{INK}" stroke-width="4"/></g>'
        elif i == 1:
            g += (f'<rect x="{ox-60}" y="610" width="120" height="90" rx="16" fill="#a0703c" stroke="{INK}" stroke-width="5"/>'
                  f'<circle cx="{ox-20}" cy="655" r="26" fill="#5a3a1a"/><circle cx="{ox+32}" cy="640" r="8" fill="#ddd"/>'
                  f'<rect x="{ox-40}" y="700" width="80" height="170" fill="#4a3220"/>'
                  f'<path d="M{ox+60},590 q20,-20 40,0 M{ox+70},570 q30,-30 60,0" stroke="#e8d6ad" stroke-width="4" fill="none"/>')
        elif i == 2:
            g += (f'<rect x="{ox-70}" y="590" width="140" height="110" rx="20" fill="#8a8a8a" stroke="{INK}" stroke-width="5"/>'
                  f'<rect x="{ox-56}" y="604" width="94" height="82" rx="14" fill="#9fc2d8"/>'
                  f'<path d="M{ox-20},590 L{ox-50},540 M{ox+20},590 L{ox+50},540" stroke="{INK}" stroke-width="4"/>'
                  f'<rect x="{ox-50}" y="700" width="100" height="170" fill="#4a3220"/>')
            g += f'<ellipse cx="{ox}" cy="645" rx="140" ry="120" fill="url(#glowBlue)" opacity="0.3"/>'
        else:
            g += f'<ellipse cx="{ox+60}" cy="600" rx="260" ry="220" fill="url(#glowBlue)" opacity="0.45"/>'
            g += (f'<rect x="{ox-40}" y="470" width="300" height="190" rx="10" fill="#0d0f14" stroke="{INK}" stroke-width="7"/>'
                  f'<rect x="{ox-28}" y="482" width="276" height="166" fill="url(#neon4)"/>'
                  + palm(ox + 40, 650, 0.45) + palm(ox + 200, 650, 0.55) +
                  f'<rect x="{ox+90}" y="660" width="20" height="210" fill="#2a2234"/>'
                  + text(ox + 220, 510, "4K", 28, "#fff"))
            g += gamepad(x + 90, 660, 0.7)
        g += text(x + 80, 1030, labels[i], 32, "#f3e6c8")
        if i < 3:
            g += f'<path d="M{x+300},420 q60,-40 120,0" stroke="#e8d6ad" stroke-width="5" fill="none" stroke-dasharray="10 8"/><path d="M{x+420},420 l-18,-4 l8,-14 Z" fill="#e8d6ad"/>'
    g = g.replace('<filter id="soft">', '<linearGradient id="neon4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b1d6e"/><stop offset="0.6" stop-color="#ff5fa2"/><stop offset="1" stop-color="#ffb347"/></linearGradient><filter id="soft">')
    g += text(960, 140, "Қорқыныш әр дәуірде қайталанады", 54, "#e8d6ad")
    return g

frames[9] = ("КАДР 9 — Медианың эволюциясы", f9)


# ---- КАДР 10: like & subscribe ----
def f10():
    g = background()
    g += '<circle cx="760" cy="520" r="420" fill="url(#glowGold)" opacity="0.18"/>'
    # gamepad on the floor
    g += '<ellipse cx="760" cy="1010" rx="420" ry="30" fill="#000" opacity="0.3"/>'
    g += gamepad(460, 990, 1.4, rot=-8)
    arms = {"L": [(-100, 120), (-150, 40)], "R": [(110, 110), (170, 30)], "R_thumb": True}
    g += hero(760, 560, 1.4, arms=arms, expr="wink")
    # waving lines left hand
    g += '<path d="M500,500 q-20,-20 0,-40 M470,520 q-30,-30 0,-60" stroke="#f3e6c8" stroke-width="5" fill="none" stroke-linecap="round"/>'
    # Like button
    g += ('<g transform="translate(1180,330)"><rect width="300" height="130" rx="65" fill="#ffffff" stroke="#0e1118" stroke-width="7"/>'
          '<g transform="translate(80,66)"><rect x="-36" y="-6" width="18" height="44" rx="4" fill="#1d1d1d"/>'
          '<path d="M-12,-6 L4,-44 Q14,-56 22,-40 L16,-14 L44,-14 Q58,-12 54,4 L46,36 Q42,42 34,42 L-12,42 Z" fill="#1d1d1d"/></g>'
          + text(200, 82, "Лайк", 44, "#1d1d1d") + '</g>')
    # Subscribe button
    g += ('<g transform="translate(1180,520)"><rect width="580" height="140" rx="70" fill="#e62117" stroke="#0e1118" stroke-width="7"/>'
          + text(230, 90, "ЖАЗЫЛУ", 56, "#ffffff") +
          '<g transform="translate(480,62)"><path d="M-26,18 Q-26,-30 0,-32 Q26,-30 26,18 L34,26 L-34,26 Z" fill="#fff"/><circle cx="0" cy="34" r="8" fill="#fff"/>'
          '<path d="M-44,-20 q-10,16 0,34 M44,-20 q10,16 0,34" stroke="#fff" stroke-width="5" fill="none"/></g></g>')
    # cursor clicking
    g += '<path d="M1660,620 l0,90 l22,-22 l18,40 l16,-8 l-18,-38 l32,-2 Z" fill="#fff" stroke="#0e1118" stroke-width="5"/>'
    g += text(1470, 800, "Зерттеуші Стикмен", 50, GOLD)
    g += text(1470, 860, "Пікірге жазыңыз!", 38, "#f3e6c8", weight="normal")
    return g

frames[10] = ("КАДР 10 — Лайк және Жазылу", f10)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    for n, (title, fn) in frames.items():
        with open(os.path.join(OUT, f"kadr_{n:02d}.svg"), "w", encoding="utf-8") as f:
            f.write(svg(fn(), title))
    print("written", len(frames))

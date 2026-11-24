"""Kinetic sand ASMR short (procedural animation + synthesized ASMR audio).

Usage: python3 make_video.py [output.mp4] [--preview]
Requires: numpy, Pillow, ffmpeg.
"""
import math
import subprocess
import sys
import wave

import numpy as np
from PIL import Image, ImageDraw

W, H, FPS = 1080, 1920, 30
WW = 1580  # world canvas width (camera pans across it)
rng = np.random.default_rng(7)


def hexc(h):
    return np.array([int(h[i:i + 2], 16) for i in (1, 3, 5)], np.float32) / 255


COLORS = [hexc(c) for c in ("#ff7fae", "#ffd25e", "#6fd8f0", "#b48cff", "#86e39a")]

# ---------------------------------------------------------------- textures
g1 = rng.random((H, WW), dtype=np.float32) - 0.5
g2 = rng.random((H // 3 + 1, WW // 3 + 1), dtype=np.float32) - 0.5
g2 = np.repeat(np.repeat(g2, 3, 0), 3, 1)[:H, :WW]
GRAIN = 1 + (0.65 * g1 + 0.35 * g2) * 0.24

TABLE_Y = 1080
ys = np.arange(H, dtype=np.float32)[:, None, None]
t_wall = np.clip(ys / TABLE_Y, 0, 1)
BG = np.empty((H, WW, 3), np.float32)
wall = hexc("#f7eaf0") * (1 - t_wall) + hexc("#eed9e4") * t_wall
t_tab = np.clip((ys - TABLE_Y) / (H - TABLE_Y), 0, 1)
table = hexc("#efe3d8") * (1 - t_tab) + hexc("#dcc8b8") * t_tab
BG[:] = np.where(ys < TABLE_Y, wall, table)
BG[TABLE_Y:TABLE_Y + 3] *= 0.93
BG *= (1 + (rng.random((H, WW, 1), dtype=np.float32) - 0.5) * 0.02)

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
VIGNETTE = (1 - 0.22 * (((xx - W / 2) / W) ** 2 + ((yy - H / 2) / H) ** 2) * 2)[..., None]


def ease(x):
    x = min(max(x, 0.0), 1.0)
    return x * x * (3 - 2 * x)


# ---------------------------------------------------------------- drawing
def poly_mask(pts):
    xs = [p[0] for p in pts]
    ys_ = [p[1] for p in pts]
    x0 = max(int(math.floor(min(xs))) - 1, 0)
    x1 = min(int(math.ceil(max(xs))) + 2, WW)
    y0 = max(int(math.floor(min(ys_))) - 1, 0)
    y1 = min(int(math.ceil(max(ys_))) + 2, H)
    if x1 <= x0 or y1 <= y0:
        return None
    im = Image.new("L", (x1 - x0, y1 - y0), 0)
    ImageDraw.Draw(im).polygon([(x - x0, y - y0) for x, y in pts], fill=255)
    return y0, y1, x0, x1, np.asarray(im, np.float32) / 255


def paint(canvas, alpha, reg, color):
    y0, y1, x0, x1, m = reg
    m3 = m[..., None]
    canvas[y0:y1, x0:x1] = canvas[y0:y1, x0:x1] * (1 - m3) + color * m3
    if alpha is not None:
        alpha[y0:y1, x0:x1] = np.maximum(alpha[y0:y1, x0:x1], m)


def layer_color(local_y, lh):
    idx = np.clip((local_y // lh).astype(int), 0, len(COLORS) - 1)
    return np.stack(COLORS)[idx]


def draw_block(canvas, alpha, xl, xr, yt, yb, dx, dy, lh):
    # front face
    yr = np.arange(yt, yb, dtype=np.float32)
    col = layer_color(yr - yt, lh)[:, None, :]
    shade = (1.0 - 0.08 * (yr - yt) / (yb - yt))[:, None, None]
    reg = (yt, yb, xl, xr, np.ones((yb - yt, xr - xl), np.float32))
    paint(canvas, alpha, reg, col * shade * GRAIN[yt:yb, xl:xr, None])
    # top face
    reg = poly_mask([(xl, yt), (xr, yt), (xr + dx, yt - dy), (xl + dx, yt - dy)])
    if reg:
        y0, y1, x0, x1, _ = reg
        paint(canvas, alpha, reg, COLORS[0] * 1.12 * GRAIN[y0:y1, x0:x1, None])
    # right (cut) face
    reg = poly_mask([(xr, yt), (xr + dx, yt - dy), (xr + dx, yb - dy), (xr, yb)])
    if reg:
        y0, y1, x0, x1, _ = reg
        gy, gx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
        f = np.clip((gx - xr) / dx, 0, 1)
        col = layer_color(gy - yt + f * dy, lh)
        paint(canvas, alpha, reg, col * 0.8 * GRAIN[y0:y1, x0:x1, None])


def soft_shadow(canvas, xl, xr, yb, strength=0.18):
    y0, y1 = yb - 6, min(yb + 40, H)
    xs = np.arange(xl - 30, xr + 30)
    xs = xs[(xs >= 0) & (xs < WW)]
    if len(xs) == 0:
        return
    yv = np.arange(y0, y1, dtype=np.float32)
    fy = np.exp(-((yv - yb) / 18) ** 2)[:, None]
    fx = np.clip(np.minimum(xs - (xl - 30), (xr + 30) - xs) / 40, 0, 1)[None, :]
    canvas[y0:y1, xs[0]:xs[-1] + 1] *= (1 - strength * fy * fx)[..., None]


def draw_crumbs(canvas, crumbs):
    for x, y, c in crumbs:
        xi, yi = int(x), int(y)
        if 0 <= xi < WW - 4 and 0 <= yi < H - 4:
            canvas[yi:yi + 4, xi:xi + 4] = COLORS[c] * 0.9
            canvas[yi + 3:yi + 4, xi:xi + 4] = COLORS[c] * 0.65


# ---------------------------------------------------------------- scene A: pour
CX = 925
BASE = 1450
SIG = 215.0
POUR_T = 7.0
CHANGE = 1.4


def amp(t):
    return 640 * min(t / 6.8, 1.0) ** 0.8


BOUNDS = np.array([amp(CHANGE * (i + 1)) for i in range(5)] + [1e9])
MX0, MX1 = 0, WW
gxA = np.arange(MX0, MX1, dtype=np.float32)
GAUSS = np.exp(-((gxA - CX) / SIG) ** 2 / 2)
SHADE_X = (1 - 0.16 * np.tanh((gxA - CX) / SIG))[None, :, None]


class Pour:
    def __init__(self):
        self.p = np.zeros((0, 5), np.float32)  # x, y, vx, vy, color

    def surface(self, x, a):
        return BASE - a * np.exp(-((x - CX) / SIG) ** 2 / 2)

    def render(self, t, frame):
        canvas = BG.copy()
        a = amp(t)
        ci = min(int(t / CHANGE), 4)
        # mound
        if a > 1:
            top = int(BASE - a) - 2
            z = (BASE - np.arange(top, BASE, dtype=np.float32))[:, None]
            hg = a * GAUSS[None, :]
            m = np.clip((hg - z) / 1.5, 0, 1)
            ratio = z / np.maximum(GAUSS[None, :], 1e-6)
            layer = np.minimum(np.searchsorted(BOUNDS, ratio), 4)
            col = np.stack(COLORS)[layer]
            hl = 1 + 0.10 * np.clip(1 - (hg - z) / 25, 0, 1)  # bright crust
            col = col * SHADE_X * hl[..., None] * GRAIN[top:BASE, MX0:MX1, None]
            soft_shadow(canvas, int(CX - 2.6 * SIG), int(CX + 2.6 * SIG), BASE, 0.12)
            reg = (top, BASE, MX0, MX1, m)
            paint(canvas, None, reg, col)
        # stream column
        if t < 6.8:
            st = BASE - a
            wob = 5 * math.sin(t * 2.3)
            sx0, sx1 = int(CX + wob - 9), int(CX + wob + 9)
            sy1 = int(st)
            if sy1 > 0:
                gr = np.roll(GRAIN[0:sy1, sx0:sx1], frame * 41, axis=0)
                xs = np.arange(sx0, sx1, dtype=np.float32)
                prof = np.clip(1 - np.abs(xs - (CX + wob)) / 9, 0, 1) ** 0.6
                m = np.tile(prof, (sy1, 1))
                paint(canvas, None, (0, sy1, sx0, sx1, m * 0.95),
                      COLORS[ci] * gr[..., None])
            # particles
            n = 28
            new = np.stack([
                CX + wob + rng.normal(0, 7, n), rng.uniform(-40, sy1, n) * 0.3,
                rng.normal(0, 0.5, n), rng.uniform(8, 14, n), np.full(n, ci)], 1)
            spl = 10
            spray = np.stack([
                CX + wob + rng.normal(0, 6, spl), np.full(spl, st - 3),
                rng.normal(0, 4.5, spl), rng.uniform(-7, -2, spl), np.full(spl, ci)], 1)
            self.p = np.concatenate([self.p, new, spray]).astype(np.float32)
        p = self.p
        if len(p):
            p[:, 3] += 1.3
            p[:, 0] += p[:, 2]
            p[:, 1] += p[:, 3]
            keep = p[:, 1] < self.surface(p[:, 0], a) - 1
            self.p = p = p[keep]
            draw_crumbs(canvas, [(x, y, int(c)) for x, y, _, _, c in p])
        return canvas, 385


# ---------------------------------------------------------------- scene B: cut
X0, X1, YT, YB = 560, 1200, 950, 1450
DX, DY, LH, T = 90, 70, 100, 110
NC, INTRO, PER = 4, 1.0, 3.5
CUT_TIME = 15.0


class Cut:
    def __init__(self):
        self.crumbs = []  # [x, y, vx, vy, color, settled]
        self.sprite_k = -1
        self.sprite = None

    def make_sprite(self, k):
        r = X1 - k * T
        c = r - T
        can = np.zeros((H, WW, 3), np.float32)
        al = np.zeros((H, WW), np.float32)
        draw_block(can, al, c, r, YT, YB, DX, DY, LH)
        rgba = np.clip(np.dstack([can, al]), 0, 1)
        self.sprite = Image.fromarray((rgba * 255).astype(np.uint8), "RGBA")
        self.sprite_k = k

    def render(self, t):
        canvas = BG.copy()
        tt = t - INTRO
        k = int(min(max(tt // PER, 0), NC - 1))
        u = tt - k * PER if tt >= 0 else -1
        r = X1 - k * T
        c = r - T
        off = 385 - 55 * (k + ease((u - 2.9) / 0.6))
        # knife tip height
        if u < 0:
            tip = -2000
        elif u < 0.4:
            tip = YT - 700 * (1 - ease(u / 0.4))
        elif u < 1.9:
            tip = YT + (YB + 4 - YT) * ((u - 0.4) / 1.5) ** 1.1
        elif u < 2.4:
            tip = YB + 4 - (YB + 4 - YT + 950) * ease((u - 1.9) / 0.5)
        else:
            tip = -2000
        cut_done = u >= 2.0
        right = c if cut_done else r
        soft_shadow(canvas, X0, right + DX, YB)
        draw_block(canvas, None, X0, right, YT, YB, DX, DY, LH)
        # cut lines while knife is inside
        if 0.4 <= u < 2.0:
            depth = int(min(tip, YB))
            canvas[YT:depth, c - 1:c + 1] *= 0.55
            reg = poly_mask([(c - 1, YT), (c + DX - 1, YT - DY), (c + DX + 1, YT - DY), (c + 1, YT)])
            if reg:
                y0, y1, x0, x1, m = reg
                canvas[y0:y1, x0:x1] *= (1 - 0.45 * m)[..., None]
        # falling slice
        if cut_done and u < 3.5:
            if self.sprite_k != k:
                self.make_sprite(k)
            fu = (u - 2.0) / 0.7
            theta = 90 * min(fu, 1) ** 2
            if fu > 1:
                theta = 90 - 5 * math.exp(-(u - 2.7) * 12) * abs(math.sin((u - 2.7) * 30))
            tx = 1000 * ease((u - 3.0) / 0.5) ** 2 if u > 3.0 else 0
            img = self.sprite.rotate(-theta, resample=Image.BICUBIC, center=(r, YB),
                                     translate=(tx, 0))
            a = np.asarray(img, np.float32) / 255
            if fu > 0.9:
                soft_shadow(canvas, int(r + tx), int(r + tx + 500), YB, 0.14)
            al = a[..., 3:4]
            canvas = canvas * (1 - al) + a[..., :3] * al
        # knife
        if tip > -1500:
            bl = poly_mask([(c, tip), (c + DX, tip - DY), (c + DX, tip - DY - 560), (c, tip - 560)])
            if bl:
                y0, y1, x0, x1, m = bl
                gy, gx = np.mgrid[y0:y1, x0:x1].astype(np.float32)
                f = np.clip((gx - c) / DX, 0, 1)
                if tip > YT:  # hide part of blade buried in sand
                    m = m * (gy < YT - (gx - c) * DY / DX)
                ref = 0.5 + 0.5 * np.sin((gy - tip) / 90 + f * 2.5)
                col = (0.62 + 0.25 * f + 0.1 * ref)[..., None] * hexc("#e6ecf2")
                col = col * (1 - 0.15 * (np.abs(gy - (tip - f * DY)) < 4))[..., None]
                paint(canvas, None, (y0, y1, x0, x1, m), col)
            hd = poly_mask([(c - 6, tip - 560), (c + DX + 6, tip - DY - 560),
                            (c + DX + 6, tip - DY - 790), (c - 6, tip - 790)])
            if hd:
                y0, y1, x0, x1, m = hd
                gx = np.arange(x0, x1, dtype=np.float32)[None, :]
                col = hexc("#5a3b2c") * (0.8 + 0.35 * np.clip((gx - c) / DX, 0, 1))[..., None]
                paint(canvas, None, hd, np.broadcast_to(col, (y1 - y0, x1 - x0, 3)))
        # crumbs
        if 0.4 <= u < 1.9:
            for _ in range(3):
                f = rng.random()
                self.crumbs.append([c + f * DX + rng.normal(0, 3), YT - f * DY,
                                    rng.normal(0, 1.6), rng.uniform(-4, -1), 0, False])
        for cr in self.crumbs:
            if not cr[5]:
                cr[3] += 1.1
                cr[0] += cr[2]
                cr[1] += cr[3]
                if cr[1] >= YB + 4:
                    cr[1] = YB + 4 + rng.uniform(0, 28)
                    cr[5] = True
        self.crumbs = [cr for cr in self.crumbs if cr[0] < c + DX + 40 or not cr[5] or u < 3.0]
        draw_crumbs(canvas, [(cr[0], cr[1], cr[4]) for cr in self.crumbs])
        return canvas, int(off)


# ---------------------------------------------------------------- audio
SR = 44100


def band(x, lo, hi):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    w = 1 / (1 + (lo / np.maximum(f, 1)) ** 4) / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * w, len(x))


def env(n, a, d):
    e = np.ones(n)
    ai, di = int(a * SR), int(d * SR)
    if ai:
        e[:ai] = np.linspace(0, 1, ai)
    if di:
        e[-di:] = np.linspace(1, 0, di)
    return e


def crackles(n, rate, ch_rng):
    x = np.zeros(n)
    idx = ch_rng.integers(0, n, int(rate * n / SR))
    x[idx] = ch_rng.random(len(idx)) ** 3 * ch_rng.choice([-1, 1], len(idx))
    ker = ch_rng.normal(0, 1, 90) * np.exp(-np.arange(90) / 18)
    return np.convolve(x, ker, "same")


def make_audio(total, path):
    n = int(total * SR)
    out = np.zeros((n, 2))
    for ch in range(2):
        cr = np.random.default_rng(100 + ch)
        # pour hiss
        s0, s1 = int(0.2 * SR), int(6.9 * SR)
        m = s1 - s0
        hiss = band(cr.normal(0, 1, m), 1800, 9000) * 0.25
        hiss += band(crackles(m, 2500, cr), 1500, 12000) * 0.9
        out[s0:s1, ch] += hiss * env(m, 0.3, 0.5) * 0.35
        for k in range(NC):
            b = POUR_T + INTRO + k * PER
            # crunch while cutting
            a0 = int((b + 0.42) * SR)
            m = int(1.5 * SR)
            cr_s = band(crackles(m, 2200, cr), 1200, 14000)
            flick = 0.6 + 0.4 * np.abs(np.sin(np.linspace(0, 40, m) + cr.random() * 6))
            out[a0:a0 + m, ch] += cr_s * flick * env(m, 0.05, 0.15) * 1.4
            # thud on landing
            t0 = int((b + 2.68) * SR)
            m = int(0.35 * SR)
            tt = np.arange(m) / SR
            thud = np.sin(2 * np.pi * 75 * tt) * np.exp(-tt * 18)
            thud += band(cr.normal(0, 1, m), 60, 900) * np.exp(-tt * 25) * 0.6
            out[t0:t0 + m, ch] += thud * 0.55
            # scrape away
            s0 = int((b + 3.0) * SR)
            m = int(0.5 * SR)
            sc = band(cr.normal(0, 1, m), 700, 4500) + band(crackles(m, 1500, cr), 800, 8000)
            out[s0:s0 + m, ch] += sc * env(m, 0.25, 0.2) * 0.25
    out /= np.max(np.abs(out)) / 0.9
    pcm = (out * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


# ---------------------------------------------------------------- main
def frames():
    pour, cut = Pour(), Cut()
    total = int((POUR_T + CUT_TIME) * FPS)
    xf = 0.5
    for i in range(total):
        t = i / FPS
        if t < POUR_T:
            img, off = pour.render(t, i)
            if t > POUR_T - xf:
                img2, off2 = cut.render(0)
                a = (t - (POUR_T - xf)) / xf
                fr = img[:, off:off + W] * (1 - a) + img2[:, off2:off2 + W] * a
            else:
                fr = img[:, off:off + W]
        else:
            img, off = cut.render(t - POUR_T)
            fr = img[:, off:off + W]
        fr = fr * VIGNETTE
        yield i, np.clip(fr * 255, 0, 255).astype(np.uint8)


def main():
    out = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("--") else "kinetic_sand_asmr.mp4"
    if "--preview" in sys.argv:
        for i, fr in frames():
            if i in (60, 150, 225, 260, 300, 330, 345, 380):
                Image.fromarray(fr).resize((540, 960)).save(f"preview_{i:03d}.png")
            if i > 380:
                break
        return
    wav = out + ".wav"
    make_audio(POUR_T + CUT_TIME, wav)
    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
           "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", wav,
           "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-pix_fmt", "yuv420p",
           "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", out]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    for i, fr in frames():
        proc.stdin.write(fr.tobytes())
        if i % 60 == 0:
            print("frame", i, flush=True)
    proc.stdin.close()
    proc.wait()
    import os
    os.remove(wav)
    print("done", out)


if __name__ == "__main__":
    main()

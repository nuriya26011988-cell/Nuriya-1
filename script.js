/* =========================================================
   «Өткінші өмір – Қымбат сәт» — интерактивті веб-клип
   ========================================================= */
(() => {
  "use strict";

  /* ---------------- Ән мәтіні ---------------- */
  const CHORUS = [
    "Әр таңның өзінің бір шуағы бар,",
    "Әр жанның жүрегінде сұрағы бар.",
    "Қонақпыз бәріміз де бұл өмірге,",
    "Сыйласып өтейікші, бауырларым,",
    "Уақыттың қайта келмес тұрағы бар!",
  ];

  const SONG = [
    {
      label: "1-шумақ",
      lines: [
        "Зымырап жатыр күн мен түн,",
        "Байқалмай өтер бұл өмір.",
        "Асығып жүріп байқамай,",
        "Жақыннан алыс кетеміз.",
      ],
    },
    { label: "Қайырма", chorus: true, lines: CHORUS },
    {
      label: "2-шумақ",
      lines: [
        "Өкпе мен назға бой беріп,",
        "Суытып алма сезімді.",
        "Байлық та, мансап — бәрі де,",
        "Уақыттың ғана еншісі.",
      ],
    },
    { label: "Қайырма", chorus: true, lines: CHORUS, last: true },
  ];

  /* Уақыт бірліктері (әуенсіз режимде 1 бірлік = 1 секунд) */
  const T = { intro: 5, line: 5.2, chorusLine: 5.8, gap: 3.5, outro: 7 };

  /* ---------------- DOM ---------------- */
  const $ = (id) => document.getElementById(id);
  const body = document.body;
  const audio = $("audio");
  const playBtn = $("playBtn");
  const playLabel = $("playLabel");
  const restartBtn = $("restartBtn");
  const fileInput = $("fileInput");
  const progress = $("progress");
  const progressFill = $("progressFill");
  const timeNow = $("timeNow");
  const timeTotal = $("timeTotal");
  const trackName = $("trackName");
  const sectionLabel = $("sectionLabel");
  const lineEls = [$("lineA"), $("lineB")];

  /* ---------------- Уақыт кестесі ---------------- */
  let timeline = [];   // {start, end, text, label, chorus, finale}
  let totalDuration = 0;

  function buildTimeline(targetDuration) {
    const units = [];
    let cursor = T.intro;
    SONG.forEach((sec, si) => {
      sec.lines.forEach((text, li) => {
        const len = sec.chorus ? T.chorusLine : T.line;
        units.push({
          start: cursor,
          end: cursor + len,
          text,
          label: sec.label,
          chorus: !!sec.chorus,
          finale: !!sec.last && li === sec.lines.length - 1,
        });
        cursor += len;
      });
      if (si < SONG.length - 1) cursor += T.gap;
    });
    const natural = cursor + T.outro;

    if (targetDuration && isFinite(targetDuration) && targetDuration > 20) {
      // Әуен ұзақтығына бейімдеу: кіріспеге ~9%, соңына ~6% қалдырамыз
      const intro = targetDuration * 0.09;
      const outro = targetDuration * 0.06;
      const bodyNatural = cursor - T.intro;
      const k = (targetDuration - intro - outro) / bodyNatural;
      units.forEach((u) => {
        u.start = intro + (u.start - T.intro) * k;
        u.end = intro + (u.end - T.intro) * k;
      });
      totalDuration = targetDuration;
    } else {
      totalDuration = natural;
    }
    timeline = units;
    timeTotal.textContent = fmt(totalDuration);
  }

  /* ---------------- Ойнату күйі ---------------- */
  let hasAudio = false;
  let playing = false;
  let virtualTime = 0;      // әуенсіз режимдегі уақыт
  let lastTick = performance.now();

  const currentTime = () => (hasAudio ? audio.currentTime : virtualTime);

  function setPlaying(state) {
    playing = state;
    body.classList.toggle("playing", state);
    if (state) body.classList.add("started");
    playLabel.textContent = state ? "Кідірту" : "Бастау";
    playBtn.setAttribute("aria-label", state ? "Кідірту" : "Бастау");
    pokeIdle();
  }

  async function play() {
    if (currentTime() >= totalDuration - 0.05) seek(0);
    if (hasAudio) {
      ensureAudioGraph();
      if (audioCtx && audioCtx.state === "suspended") await audioCtx.resume().catch(() => {});
      try { await audio.play(); } catch (e) { return; }
    }
    lastTick = performance.now();
    setPlaying(true);
  }

  function pause() {
    if (hasAudio) audio.pause();
    setPlaying(false);
  }

  function seek(t) {
    t = Math.max(0, Math.min(totalDuration, t));
    if (hasAudio) audio.currentTime = t;
    else virtualTime = t;
    shownIndex = -2; // мәтінді қайта есептеу
  }

  function restart() {
    seek(0);
    hideAllLines();
    sceneTime = 0;
    play();
  }

  function finish() {
    setPlaying(false);
    hideAllLines();
    setTimeout(() => {
      if (!playing) {
        body.classList.remove("started");
        seek(0);
      }
    }, 1800);
  }

  playBtn.addEventListener("click", () => (playing ? pause() : play()));
  restartBtn.addEventListener("click", restart);

  audio.addEventListener("ended", finish);
  audio.addEventListener("pause", () => { if (playing && !audio.ended) setPlaying(false); });

  /* ---------------- MP3 жүктеу ---------------- */
  let objectUrl = null;
  fileInput.addEventListener("change", () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = URL.createObjectURL(file);
    pause();
    hasAudio = true;
    audio.src = objectUrl;
    audio.load();
    trackName.textContent = "♪ " + file.name.replace(/\.[^.]+$/, "");
    audio.addEventListener(
      "loadedmetadata",
      () => {
        buildTimeline(audio.duration);
        seek(0);
        hideAllLines();
        play();
      },
      { once: true }
    );
    fileInput.value = "";
  });

  /* ---------------- Прогресс жолағы ---------------- */
  function seekFromPointer(e) {
    const r = progress.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    seek(x * totalDuration);
  }
  let dragging = false;
  progress.addEventListener("pointerdown", (e) => {
    dragging = true;
    progress.setPointerCapture(e.pointerId);
    body.classList.add("started");
    seekFromPointer(e);
  });
  progress.addEventListener("pointermove", (e) => dragging && seekFromPointer(e));
  progress.addEventListener("pointerup", () => (dragging = false));
  progress.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { seek(currentTime() + 5); e.preventDefault(); }
    if (e.key === "ArrowLeft") { seek(currentTime() - 5); e.preventDefault(); }
  });

  /* ---------------- Пернетақта ---------------- */
  document.addEventListener("keydown", (e) => {
    if (e.target.closest && e.target.closest("button, label, .progress")) {
      if (e.code === "Space" || e.key === "Enter") return;
    }
    if (e.code === "Space") { e.preventDefault(); playing ? pause() : play(); }
    if (e.key === "r" || e.key === "R" || e.key === "к" || e.key === "К") restart();
  });

  /* ---------------- Басқару панелін жасыру ---------------- */
  let idleTimer = null;
  function pokeIdle() {
    body.classList.remove("idle");
    clearTimeout(idleTimer);
    if (playing) idleTimer = setTimeout(() => body.classList.add("idle"), 3200);
  }
  ["pointermove", "pointerdown", "keydown", "touchstart"].forEach((ev) =>
    window.addEventListener(ev, pokeIdle, { passive: true })
  );

  /* ---------------- Мәтінді көрсету ---------------- */
  let shownIndex = -1;
  let activeEl = 0;
  let shownLabel = "";

  function hideAllLines() {
    lineEls.forEach((el) => { el.classList.remove("show"); el.classList.add("hide"); });
    sectionLabel.classList.remove("show");
    shownIndex = -1;
    shownLabel = "";
  }

  function updateLyrics(t) {
    let idx = -1;
    for (let i = 0; i < timeline.length; i++) {
      const u = timeline[i];
      // жол соңына жақын сөнеді, келесіге орын береді
      const fadeOutAt = u.end - Math.min(0.9, (u.end - u.start) * 0.15);
      if (t >= u.start && t < fadeOutAt) { idx = i; break; }
    }
    if (idx === shownIndex) return;
    shownIndex = idx;

    const prev = lineEls[activeEl];
    prev.classList.remove("show");
    prev.classList.add("hide");

    if (idx === -1) {
      // секциялар арасындағы үзіліс
      const next = timeline.find((u) => u.start > t);
      if (!next || next.label !== shownLabel) sectionLabel.classList.remove("show");
      return;
    }

    const u = timeline[idx];
    activeEl = 1 - activeEl;
    const el = lineEls[activeEl];
    el.textContent = u.text;
    el.className = "line" + (u.chorus ? " chorus" : "") + (u.finale ? " finale" : "");
    void el.offsetWidth; // анимацияны қайта іске қосу
    el.classList.add("show");

    if (u.label !== shownLabel || !sectionLabel.classList.contains("show")) {
      shownLabel = u.label;
      sectionLabel.textContent = u.label;
      sectionLabel.classList.add("show");
    }
  }

  function fmt(s) {
    s = Math.max(0, Math.floor(s || 0));
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }

  /* ---------------- Web Audio (әуенге жауап беретін жарық) ---------------- */
  let audioCtx = null;
  let analyser = null;
  let freqData = null;
  function ensureAudioGraph() {
    if (audioCtx) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      audioCtx = new AC();
      const src = audioCtx.createMediaElementSource(audio);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.85;
      freqData = new Uint8Array(analyser.frequencyBinCount);
      src.connect(analyser);
      analyser.connect(audioCtx.destination);
    } catch (e) {
      analyser = null;
    }
  }
  let energy = 0;
  function readEnergy() {
    if (!analyser || !playing) { energy *= 0.95; return; }
    analyser.getByteFrequencyData(freqData);
    let sum = 0;
    const n = 24; // төменгі жиіліктер
    for (let i = 0; i < n; i++) sum += freqData[i];
    const v = sum / (n * 255);
    energy += (v - energy) * 0.15;
  }

  /* =========================================================
     Canvas: күн мен түннің алмасуы
     ========================================================= */
  const canvas = $("sky");
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, DPR = 1, horizon = 0;

  const rand = mulberry32(20241122);
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rgba = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };

  // Аспан түстері: [фаза, жоғары, орта, көкжиек]
  const SKY = [
    [0.00, "#03040f", "#080c24", "#121a3a"],
    [0.17, "#050822", "#111a44", "#2a2a5c"],
    [0.22, "#1a2459", "#4b3f7f", "#e0806a"],
    [0.27, "#3a5fa8", "#c98aa0", "#ffc48a"],
    [0.33, "#3f86d4", "#86b9e6", "#ffe2b8"],
    [0.50, "#2f7fd6", "#6fb2ec", "#c8e6fa"],
    [0.67, "#3a78c4", "#86aedb", "#ffd9a8"],
    [0.73, "#33467f", "#b96b7e", "#ff9a5e"],
    [0.78, "#141a46", "#3e2b62", "#a2506a"],
    [0.84, "#060a26", "#101640", "#22234e"],
    [1.00, "#03040f", "#080c24", "#121a3a"],
  ].map(([p, a, b, c]) => [p, hex(a), hex(b), hex(c)]);

  function skyAt(phase) {
    for (let i = 0; i < SKY.length - 1; i++) {
      const a = SKY[i], b = SKY[i + 1];
      if (phase >= a[0] && phase <= b[0]) {
        const t = smooth(0, 1, (phase - a[0]) / (b[0] - a[0]));
        return [mix(a[1], b[1], t), mix(a[2], b[2], t), mix(a[3], b[3], t)];
      }
    }
    return [SKY[0][1], SKY[0][2], SKY[0][3]];
  }

  /* --- Жұлдыздар --- */
  let stars = [];
  function makeStars() {
    const count = Math.round(Math.min(420, (W * H) / 3200));
    const R = Math.hypot(W, H);
    stars = Array.from({ length: count }, () => ({
      r: Math.sqrt(rand()) * R,
      a: rand() * Math.PI * 2,
      size: rand() < 0.08 ? 1.3 + rand() * 1.2 : 0.4 + rand() * 0.9,
      tw: rand() * Math.PI * 2,
      sp: 0.6 + rand() * 2.2,
      hue: rand() < 0.15 ? [255, 220, 190] : rand() < 0.3 ? [190, 210, 255] : [255, 255, 255],
    }));
  }

  /* --- Бұлттар --- */
  let clouds = [];
  const tintCanvas = document.createElement("canvas");
  const tintCtx = tintCanvas.getContext("2d");

  function makeCloudSprite(w, h) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const g = c.getContext("2d");
    const puffs = 9 + Math.floor(rand() * 8);
    for (let i = 0; i < puffs; i++) {
      const pr = h * (0.16 + rand() * 0.2);
      const px = pr + rand() * (w - pr * 2);
      const pyRaw = h * (0.5 + rand() * 0.2) - Math.sin((px / w) * Math.PI) * h * 0.16;
      const py = Math.max(pr, Math.min(h - pr, pyRaw));
      const grd = g.createRadialGradient(px, py - pr * 0.2, 0, px, py, pr);
      grd.addColorStop(0, "rgba(255,255,255,0.9)");
      grd.addColorStop(0.55, "rgba(255,255,255,0.45)");
      grd.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grd;
      g.beginPath(); g.arc(px, py, pr, 0, Math.PI * 2); g.fill();
    }
    return c;
  }

  function makeClouds() {
    const n = W < 700 ? 6 : 10;
    let maxW = 0, maxH = 0;
    clouds = Array.from({ length: n }, (_, i) => {
      const depth = 0.35 + rand() * 0.65; // 1 = жақын
      const w = Math.round((W < 700 ? 220 : 320) * (0.6 + depth * 0.9));
      const h = Math.round(w * (0.38 + rand() * 0.12));
      maxW = Math.max(maxW, w); maxH = Math.max(maxH, h);
      return {
        sprite: makeCloudSprite(w, h),
        x: rand() * (W + w) - w,
        y: horizon * (0.08 + rand() * 0.62),
        speed: 4 + depth * 14,
        depth,
        alpha: 0.45 + depth * 0.45,
      };
    }).sort((a, b) => a.depth - b.depth);
    tintCanvas.width = maxW; tintCanvas.height = maxH;
  }

  /* --- Таулар / қырлар --- */
  let hills = [];
  function makeHills() {
    const layers = [
      { base: 0.0, amp: 0.10, k: 0.62, seed: rand() * 100 },
      { base: 0.045, amp: 0.07, k: 0.35, seed: rand() * 100 },
      { base: 0.1, amp: 0.05, k: 0.12, seed: rand() * 100 },
    ];
    hills = layers.map((L) => {
      const pts = [];
      const step = Math.max(6, W / 160);
      for (let x = -step; x <= W + step; x += step) {
        const u = x / Math.max(W, 1000);
        const y =
          Math.sin(u * 5.1 + L.seed) * 0.5 +
          Math.sin(u * 11.7 + L.seed * 1.7) * 0.28 +
          Math.sin(u * 23.3 + L.seed * 2.3) * 0.12;
        pts.push([x, horizon + H * L.base - (y + 0.9) * H * L.amp]);
      }
      return { pts, k: L.k };
    });
  }

  /* --- Жарық тозаңдары --- */
  let motes = [];
  function makeMotes() {
    const n = W < 700 ? 35 : 70;
    motes = Array.from({ length: n }, () => ({
      x: rand() * W, y: rand() * H,
      r: 0.6 + rand() * 2.2,
      vx: -4 + rand() * 8, vy: -(3 + rand() * 9),
      ph: rand() * Math.PI * 2,
    }));
  }

  /* --- Құйрықты жұлдыздар --- */
  let meteors = [];

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    horizon = H * (W < 700 ? 0.74 : 0.72);
    makeStars(); makeClouds(); makeHills(); makeMotes();
  }
  window.addEventListener("resize", resize);

  /* --- Негізгі сурет салу --- */
  const DAY_LENGTH = 38;   // бір тәулік ~38 секунд (уақыт зымырайды)
  let sceneTime = 0;

  function draw(dt, now) {
    const speed = playing ? 1 : 0.12;
    sceneTime += dt * speed;
    const phase = (0.19 + sceneTime / DAY_LENGTH) % 1;

    const sunAng = (phase - 0.25) * Math.PI * 2;
    const sunH = Math.sin(sunAng);                    // -1..1
    const day = smooth(-0.12, 0.3, sunH);
    const night = 1 - smooth(-0.3, 0.05, sunH);
    const golden = Math.exp(-Math.pow(sunH / 0.2, 2)); // таң / ымырт
    const pulse = energy;

    const [top, mid, bot] = skyAt(phase);

    // Аспан
    const g = ctx.createLinearGradient(0, 0, 0, horizon);
    g.addColorStop(0, rgba(top));
    g.addColorStop(0.55, rgba(mid));
    g.addColorStop(1, rgba(bot));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // Жұлдыздар (баяу айналады)
    if (night > 0.01) {
      const rot = now * 0.000012 + sceneTime * 0.004;
      const cx = W * 0.5, cy = horizon * 1.1;
      for (const s of stars) {
        const a = s.a + rot;
        const x = cx + Math.cos(a) * s.r;
        const y = cy + Math.sin(a) * s.r;
        if (x < -2 || x > W + 2 || y < -2 || y > horizon) continue;
        const fadeLow = smooth(horizon, horizon * 0.55, y);
        const tw = 0.55 + 0.45 * Math.sin(now * 0.001 * s.sp + s.tw);
        const al = night * tw * fadeLow;
        if (al < 0.02) continue;
        ctx.fillStyle = rgba(s.hue, al);
        ctx.beginPath();
        ctx.arc(x, y, s.size, 0, Math.PI * 2);
        ctx.fill();
        if (s.size > 1.4) {
          ctx.fillStyle = rgba(s.hue, al * 0.18);
          ctx.beginPath(); ctx.arc(x, y, s.size * 3.5, 0, Math.PI * 2); ctx.fill();
        }
      }

      // Құйрықты жұлдыз
      if (night > 0.7 && Math.random() < dt * 0.25) {
        meteors.push({ x: W * (0.2 + Math.random() * 0.8), y: horizon * Math.random() * 0.4, life: 0, ang: Math.PI * (0.78 + Math.random() * 0.1), v: 600 + Math.random() * 500 });
      }
    }
    meteors = meteors.filter((m) => m.life < 1);
    for (const m of meteors) {
      m.life += dt * 1.1;
      m.x += Math.cos(m.ang) * m.v * dt;
      m.y -= Math.sin(m.ang) * m.v * dt * -1;
      const len = 120;
      const al = Math.sin(m.life * Math.PI) * night;
      const tx = m.x - Math.cos(m.ang) * len, ty = m.y - Math.sin(m.ang) * len;
      const mg = ctx.createLinearGradient(m.x, m.y, tx, ty);
      mg.addColorStop(0, `rgba(255,255,255,${al})`);
      mg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = mg; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(tx, ty); ctx.stroke();
    }

    // Күн мен ай орбитасы
    const orbitW = W * 0.52, orbitH = horizon * 0.82;
    const sunX = W / 2 - Math.cos(sunAng) * orbitW;
    const sunY = horizon - sunH * orbitH;
    const moonAng = sunAng + Math.PI;
    const moonX = W / 2 - Math.cos(moonAng) * orbitW;
    const moonY = horizon - Math.sin(moonAng) * orbitH;
    const sunR = Math.max(26, Math.min(W, H) * 0.045);

    // Таңғы шуақ — көкжиектегі жылы сәуле
    if (golden > 0.02) {
      const hx = Math.max(0, Math.min(W, sunX));
      const hg = ctx.createRadialGradient(hx, horizon, 0, hx, horizon, Math.max(W, H) * 0.8);
      hg.addColorStop(0, `rgba(255,170,100,${0.55 * golden})`);
      hg.addColorStop(0.35, `rgba(255,120,110,${0.22 * golden})`);
      hg.addColorStop(1, "rgba(255,120,110,0)");
      ctx.fillStyle = hg;
      ctx.fillRect(0, 0, W, horizon);
    }

    // Күн
    if (sunY < horizon + sunR * 2) {
      const warm = mix([255, 250, 225], [255, 150, 80], golden);
      const glowR = sunR * (6 + pulse * 5);
      const sg = ctx.createRadialGradient(sunX, sunY, sunR * 0.4, sunX, sunY, glowR);
      sg.addColorStop(0, rgba(warm, 0.75));
      sg.addColorStop(0.2, rgba(warm, 0.25 + pulse * 0.2));
      sg.addColorStop(1, rgba(warm, 0));
      ctx.fillStyle = sg;
      ctx.beginPath(); ctx.arc(sunX, sunY, glowR, 0, Math.PI * 2); ctx.fill();

      // Күн сәулелері
      if (day > 0.05 || golden > 0.1) {
        ctx.save();
        ctx.translate(sunX, sunY);
        ctx.rotate(now * 0.00003);
        const rays = 14;
        for (let i = 0; i < rays; i++) {
          ctx.rotate((Math.PI * 2) / rays);
          const rl = sunR * (9 + Math.sin(now * 0.0006 + i * 1.7) * 2.5);
          const rg = ctx.createLinearGradient(0, 0, rl, 0);
          rg.addColorStop(0, rgba(warm, 0.12 * Math.max(day, golden)));
          rg.addColorStop(1, rgba(warm, 0));
          ctx.fillStyle = rg;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(rl, -sunR * 0.5);
          ctx.lineTo(rl, sunR * 0.5);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      ctx.fillStyle = rgba(mix([255, 252, 238], [255, 196, 120], golden));
      ctx.beginPath(); ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2); ctx.fill();
    }

    // Ай
    if (moonY < horizon + sunR * 2) {
      const mr = sunR * 0.78;
      const mAlpha = 0.35 + night * 0.65;
      const mgl = ctx.createRadialGradient(moonX, moonY, mr * 0.5, moonX, moonY, mr * 5);
      mgl.addColorStop(0, `rgba(200,215,255,${0.35 * mAlpha})`);
      mgl.addColorStop(1, "rgba(200,215,255,0)");
      ctx.fillStyle = mgl;
      ctx.beginPath(); ctx.arc(moonX, moonY, mr * 5, 0, Math.PI * 2); ctx.fill();

      ctx.save();
      ctx.beginPath(); ctx.arc(moonX, moonY, mr, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = `rgba(240,240,255,${mAlpha})`;
      ctx.fillRect(moonX - mr, moonY - mr, mr * 2, mr * 2);
      // орақ ай көлеңкесі
      ctx.fillStyle = rgba(mid, 0.92);
      ctx.beginPath(); ctx.arc(moonX + mr * 0.45, moonY - mr * 0.2, mr * 0.95, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    // Бұлттар
    const cloudTint = mix(mix([255, 255, 255], [255, 170, 150], golden), [55, 65, 110], night);
    const cloudShade = mix(mix([200, 215, 235], [150, 90, 130], golden), [20, 24, 50], night);
    for (const c of clouds) {
      c.x += c.speed * dt * (playing ? 2.2 : 0.6);
      const sw = c.sprite.width, sh = c.sprite.height;
      if (c.x > W + 20) { c.x = -sw - rand() * 200; c.y = horizon * (0.08 + rand() * 0.62); }
      tintCtx.clearRect(0, 0, tintCanvas.width, tintCanvas.height);
      tintCtx.globalCompositeOperation = "source-over";
      tintCtx.drawImage(c.sprite, 0, 0);
      tintCtx.globalCompositeOperation = "source-atop";
      const tg = tintCtx.createLinearGradient(0, 0, 0, sh);
      tg.addColorStop(0, rgba(cloudTint));
      tg.addColorStop(1, rgba(cloudShade));
      tintCtx.fillStyle = tg;
      tintCtx.fillRect(0, 0, sw, sh);
      ctx.globalAlpha = c.alpha * (0.55 + day * 0.45);
      ctx.drawImage(tintCanvas, 0, 0, sw, sh, c.x, c.y, sw, sh);
      ctx.globalAlpha = 1;
    }

    // Қырлар
    const darkBase = mix([8, 10, 24], [24, 52, 62], day);
    hills.forEach((L, i) => {
      const col = mix(darkBase, bot, L.k * (0.4 + day * 0.6));
      ctx.fillStyle = rgba(col);
      ctx.beginPath();
      ctx.moveTo(L.pts[0][0], H);
      for (const [x, y] of L.pts) ctx.lineTo(x, y);
      ctx.lineTo(W + 10, H);
      ctx.closePath();
      ctx.fill();
      if (i === 0) {
        // алыстағы тұман
        const fg = ctx.createLinearGradient(0, horizon - H * 0.1, 0, horizon + H * 0.05);
        fg.addColorStop(0, rgba(bot, 0));
        fg.addColorStop(1, rgba(bot, 0.35 + golden * 0.2));
        ctx.fillStyle = fg;
        ctx.fillRect(0, horizon - H * 0.1, W, H * 0.15);
      }
    });

    // Жарық тозаңдары
    const moteA = Math.max(day * 0.45, golden * 0.7, night * 0.15) * (1 + pulse);
    for (const m of motes) {
      m.x += (m.vx + Math.sin(now * 0.0004 + m.ph) * 6) * dt;
      m.y += m.vy * dt * (playing ? 1 : 0.4);
      if (m.y < -10) { m.y = H + 10; m.x = rand() * W; }
      if (m.x < -10) m.x = W + 10;
      if (m.x > W + 10) m.x = -10;
      const tw = 0.4 + 0.6 * Math.sin(now * 0.0015 + m.ph);
      const col = night > 0.5 ? [180, 200, 255] : [255, 215, 150];
      ctx.fillStyle = rgba(col, moteA * tw * 0.6);
      ctx.beginPath(); ctx.arc(m.x, m.y, m.r * (1 + pulse * 1.5), 0, Math.PI * 2); ctx.fill();
    }

    // Мәтін оқылуы үшін ортаны сәл күңгірттеу (күндіз)
    if (day > 0.05) {
      const cg = ctx.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, Math.max(W, H) * 0.55);
      cg.addColorStop(0, `rgba(10,15,40,${0.32 * day})`);
      cg.addColorStop(1, "rgba(10,15,40,0)");
      ctx.fillStyle = cg;
      ctx.fillRect(0, 0, W, H);
    }

    document.documentElement.style.setProperty("--phase", phase.toFixed(3));
  }

  /* ---------------- Негізгі цикл ---------------- */
  function frame(now) {
    const dt = Math.min(0.1, (now - lastTick) / 1000);
    lastTick = now;

    if (playing && !hasAudio) {
      virtualTime += dt;
      if (virtualTime >= totalDuration) { virtualTime = totalDuration; finish(); }
    }

    readEnergy();
    draw(dt, now);

    const t = currentTime();
    if (body.classList.contains("started")) updateLyrics(t);
    const pct = totalDuration ? (t / totalDuration) * 100 : 0;
    progressFill.style.width = pct + "%";
    progress.setAttribute("aria-valuenow", Math.round(pct));
    timeNow.textContent = fmt(t);

    requestAnimationFrame(frame);
  }

  /* ---------------- Іске қосу ---------------- */
  buildTimeline();
  resize();
  requestAnimationFrame((now) => { lastTick = now; frame(now); });
})();

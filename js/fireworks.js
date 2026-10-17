/**
 * Pixel fireworks — homepage only, birthday day (or ?fireworks=1 preview).
 * Larger, slower bursts for visibility.
 */
(function () {
  "use strict";

  const canvas = document.getElementById("pixel-fireworks");
  if (!canvas || !canvas.getContext) return;

  const params = new URLSearchParams(location.search);
  const forcePreview = params.has("fireworks") || params.get("preview") === "fireworks";

  function isBirthdayDay() {
    return !!(
      document.body.classList.contains("is-birthday-day") ||
      document.querySelector(".birthday-sign.is-today")
    );
  }

  function shouldRun() {
    return forcePreview || isBirthdayDay();
  }

  if (!shouldRun()) {
    canvas.style.display = "none";
    return;
  }

  canvas.style.display = "block";
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  const COLORS = [
    "#FF6B9A", "#F7A8B8", "#FFD93D", "#F5D76E",
    "#A8E6CF", "#FFD6E0", "#FFE4B5", "#FF9F43", "#B8E0D2", "#FFF"
  ];
  /* Higher SCALE = chunkier on-screen pixels (looks bigger) */
  const SCALE = 4;

  let w = 0;
  let h = 0;
  let particles = [];
  let rockets = [];
  let lastSpawn = 0;
  let running = true;
  let raf = 0;

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    w = Math.max(80, Math.floor(rect.width / SCALE));
    h = Math.max(60, Math.floor(rect.height / SCALE));
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
  }

  function spawnRocket() {
    rockets.push({
      x: Math.floor(w * (0.08 + Math.random() * 0.84)),
      y: h - 2,
      vy: -(0.7 + Math.random() * 0.55),
      color: COLORS[(Math.random() * COLORS.length) | 0],
      targetY: Math.floor(h * (0.1 + Math.random() * 0.35)),
    });
  }

  function explode(x, y, color) {
    const n = 42 + ((Math.random() * 18) | 0);
    for (let i = 0; i < n; i++) {
      const ang = (Math.PI * 2 * i) / n + Math.random() * 0.35;
      const spd = 0.35 + Math.random() * 0.75;
      particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 100 + ((Math.random() * 50) | 0),
        max: 150,
        color: Math.random() > 0.3 ? color : COLORS[(Math.random() * COLORS.length) | 0],
        size: Math.random() > 0.35 ? 3 : 2,
      });
    }
    for (let j = 0; j < 12; j++) {
      particles.push({
        x: x + (((Math.random() * 5) | 0) - 2),
        y: y + (((Math.random() * 5) | 0) - 2),
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        life: 50 + ((Math.random() * 30) | 0),
        max: 80,
        color: "#FFF9C4",
        size: 2,
      });
    }
  }

  function tick(ts) {
    if (!running) return;
    if (ts - lastSpawn > 720 && rockets.length < 5) {
      spawnRocket();
      if (Math.random() > 0.55) spawnRocket();
      lastSpawn = ts;
    }

    ctx.clearRect(0, 0, w, h);

    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.y += r.vy;
      ctx.fillStyle = r.color;
      ctx.fillRect(r.x | 0, r.y | 0, 2, 3);
      ctx.fillStyle = "#FFEFE8";
      ctx.fillRect(r.x | 0, (r.y + 3) | 0, 2, 2);
      if (r.y <= r.targetY) {
        explode(r.x, r.y, r.color);
        rockets.splice(i, 1);
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.012;
      p.vx *= 0.994;
      p.life--;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = Math.max(0.25, p.life / p.max);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x | 0, p.y | 0, p.size, p.size);
      ctx.globalAlpha = 1;
    }

    if (particles.length > 480) particles.splice(0, particles.length - 480);
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (!shouldRun()) {
      canvas.style.display = "none";
      return;
    }
    canvas.style.display = "block";
    resize();
    explode(Math.floor(w * 0.2), Math.floor(h * 0.18), COLORS[0]);
    explode(Math.floor(w * 0.78), Math.floor(h * 0.14), COLORS[2]);
    explode(Math.floor(w * 0.5), Math.floor(h * 0.22), COLORS[1]);
    explode(Math.floor(w * 0.35), Math.floor(h * 0.3), COLORS[3]);
    spawnRocket();
    spawnRocket();
    lastSpawn = performance.now();
    raf = requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else if (shouldRun()) {
      running = true;
      lastSpawn = performance.now();
      raf = requestAnimationFrame(tick);
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();

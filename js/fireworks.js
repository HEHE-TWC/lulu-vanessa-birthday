/**
 * Lightweight pixel-art fireworks for homepage hero sky.
 * Soft pastels; low CPU; pointer-events handled in CSS.
 */
(function () {
  "use strict";

  const canvas = document.getElementById("pixel-fireworks");
  if (!canvas || !canvas.getContext) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  const COLORS = ["#F7A8B8", "#F5C6A8", "#F5D76E", "#A8E6CF", "#FFD6E0", "#FFE4B5", "#B8E0D2", "#FF6B9A", "#FFD93D"];
  const SCALE = 3; /* larger pixels = easier to see on phone */

  let w = 0;
  let h = 0;
  let particles = [];
  let rockets = [];
  let lastSpawn = 0;
  let running = true;
  let raf = 0;

  function isBirthdayBoost() {
    return !!(
      document.body.classList.contains("is-birthday-day") ||
      document.querySelector(".birthday-sign.is-today")
    );
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = Math.max(80, Math.floor(rect.width / SCALE));
    h = Math.max(60, Math.floor(rect.height / SCALE));
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
  }

  function spawnRocket() {
    const boost = isBirthdayBoost();
    rockets.push({
      x: Math.floor(w * (0.12 + Math.random() * 0.76)),
      y: h - 2,
      vy: -(1.4 + Math.random() * (boost ? 1.4 : 1.0)),
      color: COLORS[(Math.random() * COLORS.length) | 0],
      targetY: Math.floor(h * (0.12 + Math.random() * 0.32)),
    });
  }

  function explode(x, y, color) {
    const boost = isBirthdayBoost();
    const n = boost ? 28 + ((Math.random() * 12) | 0) : 20 + ((Math.random() * 10) | 0);
    for (let i = 0; i < n; i++) {
      const ang = (Math.PI * 2 * i) / n + Math.random() * 0.4;
      const spd = 0.6 + Math.random() * (boost ? 1.6 : 1.1);
      particles.push({
        x,
        y,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd,
        life: 28 + ((Math.random() * 22) | 0),
        max: 50,
        color: Math.random() > 0.35 ? color : COLORS[(Math.random() * COLORS.length) | 0],
        size: Math.random() > 0.5 ? 3 : 2,
      });
    }
    /* tiny secondary sparkles */
    for (let j = 0; j < 4; j++) {
      particles.push({
        x: x + (((Math.random() * 5) | 0) - 2),
        y: y + (((Math.random() * 5) | 0) - 2),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        life: 12 + ((Math.random() * 10) | 0),
        max: 22,
        color: "#FFF9C4",
        size: 1,
      });
    }
  }

  function tick(ts) {
    if (!running) return;
    const boost = isBirthdayBoost();
    const interval = reduceMotion ? 2200 : (boost ? 450 : 700);
    const maxRockets = reduceMotion ? 1 : (boost ? 5 : 3);
    if (ts - lastSpawn > interval && rockets.length < maxRockets) {
      spawnRocket();
      lastSpawn = ts;
    }

    ctx.clearRect(0, 0, w, h);

    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.y += r.vy;
      ctx.fillStyle = r.color;
      ctx.fillRect((r.x | 0), (r.y | 0), 1, 2);
      ctx.fillStyle = "#FFEFE8";
      ctx.fillRect((r.x | 0), ((r.y + 2) | 0), 1, 1);
      if (r.y <= r.targetY || r.vy >= -0.2) {
        explode(r.x, r.y, r.color);
        rockets.splice(i, 1);
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.035; /* gravity */
      p.vx *= 0.985;
      p.life--;
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      const a = Math.max(0.15, p.life / p.max);
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      ctx.fillRect((p.x | 0), (p.y | 0), p.size, p.size);
      ctx.globalAlpha = 1;
    }

    /* cap for mobile CPU */
    if (particles.length > 180) particles.splice(0, particles.length - 180);

    raf = requestAnimationFrame(tick);
  }

  function start() {
    resize();
    const mock = new URLSearchParams(location.search).has("mock");
    /* seed rockets/bursts so mock/screenshot shows fireworks immediately */
    spawnRocket();
    spawnRocket();
    spawnRocket();
    /* always seed visible bursts so user sees fireworks immediately */
    explode(Math.floor(w * 0.22), Math.floor(h * 0.2), COLORS[0]);
    explode(Math.floor(w * 0.75), Math.floor(h * 0.16), COLORS[2]);
    explode(Math.floor(w * 0.48), Math.floor(h * 0.26), COLORS[7]);
    if (mock) spawnRocket();
    lastSpawn = performance.now();
    raf = requestAnimationFrame(tick);
  }

  window.addEventListener("resize", () => {
    resize();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else {
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

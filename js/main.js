/**
 * Vanessa birthday site — countdown (UTC+8) + LuLu pop-up
 * Target: 2026-11-11 00:00:00 Asia/Hong_Kong
 * Pop: full-body sitting LuLu bounces up from bottom → card below face → inside.html
 */
(function () {
  "use strict";

  /** Fixed: 2026-11-11 00:00:00+08 = 2026-11-10 16:00:00Z */
  const BIRTHDAY_TARGET_MS = Date.UTC(2026, 10, 10, 16, 0, 0);

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function diffParts(targetMs) {
    let rem = Math.max(0, targetMs - Date.now());
    const days = Math.floor(rem / 86400000);
    rem %= 86400000;
    const hours = Math.floor(rem / 3600000);
    rem %= 3600000;
    const mins = Math.floor(rem / 60000);
    rem %= 60000;
    const secs = Math.floor(rem / 1000);
    return { days, hours, mins, secs, done: targetMs - Date.now() <= 0 };
  }

  function updateCountdownUI(parts) {
    const map = [
      ["days", parts.days],
      ["hours", parts.hours],
      ["mins", parts.mins],
      ["secs", parts.secs],
    ];
    map.forEach(([key, val]) => {
      document.querySelectorAll(`[data-cd="${key}"]`).forEach((el) => {
        el.textContent = key === "days" ? String(val) : pad(val);
      });
    });

    const signs = document.querySelectorAll(".birthday-sign");
    const boardMsg = document.getElementById("cd-message");
    const pixelHero = document.getElementById("pixel-cd-hero");
    const pixelSub = document.getElementById("pixel-cd-sub");
    const done = parts.done;

    signs.forEach((sign) => {
      if (done) sign.classList.add("is-today");
      else sign.classList.remove("is-today");
    });

    if (boardMsg) {
      if (done) {
        boardMsg.textContent = "今日就係 Vanessa 嘅日子！Happy Birthday ♡";
        boardMsg.classList.add("party");
      } else {
        boardMsg.textContent = "距離 Vanessa 嘅生日仲有…";
        boardMsg.classList.remove("party");
      }
    }

    if (pixelHero) {
      if (done) {
        pixelHero.classList.add("is-birthday");
        if (pixelSub) pixelSub.textContent = "今日就係！🎂";
      } else {
        pixelHero.classList.remove("is-birthday");
        if (pixelSub) pixelSub.textContent = "2026.11.11 00:00 · UTC+8";
      }
    }
  }

  function tick() {
    updateCountdownUI(diffParts(BIRTHDAY_TARGET_MS));
  }

  const flyer = document.getElementById("lulu-flyer");
  const replayBtn = document.getElementById("btn-replay");

  function flightDurationMs() {
    const raw = getComputedStyle(document.documentElement).getPropertyValue("--flight-duration");
    const sec = parseFloat(raw);
    return (Number.isFinite(sec) ? sec : 0.75) * 1000;
  }

  function startFlight() {
    if (!flyer) return;
    flyer.classList.remove("idle", "flying", "landed", "sign-reveal");
    void flyer.offsetWidth;
    flyer.classList.add("flying");

    const durationMs = flightDurationMs();

    window.clearTimeout(flyer._landTimer);
    flyer._landTimer = window.setTimeout(() => {
      flyer.classList.remove("flying");
      flyer.classList.add("idle", "landed");
    }, durationMs + 20);
  }

  if (replayBtn) {
    replayBtn.addEventListener("click", () => startFlight());
  }

  const surpriseBtn = document.getElementById("btn-surprise");
  const surpriseBox = document.getElementById("surprise-box");
  if (surpriseBtn && surpriseBox) {
    surpriseBtn.addEventListener("click", () => {
      surpriseBox.classList.add("open");
    });
  }

  tick();
  window.setInterval(tick, 1000);

  if (flyer) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      flyer.classList.add("idle", "landed");
    } else {
      window.setTimeout(startFlight, 120); /* snappier start */
    }
  }

  window.__luluBirthday = {
    startFlight,
    birthdayTargetMs: () => BIRTHDAY_TARGET_MS,
    tick,
  };
})();

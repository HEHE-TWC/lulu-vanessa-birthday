/**
 * Vanessa birthday site — countdown (UTC+8) + LuLu pop-up
 * Target: 2026-11-11 00:00:00 Asia/Hong_Kong
 * Pop: full-body sitting LuLu bounces up from bottom → card below face → inside.html
 *
 * Draft sections (.draft-until-birthday) show when body.is-birthday-day.
 * Preview override: ?unlock=1 or ?birthday=1 forces birthday mode (show drafts).
 */
(function () {
  "use strict";

  /** Fixed: 2026-11-11 00:00:00+08 = 2026-11-10 16:00:00Z */
  const BIRTHDAY_TARGET_MS = Date.UTC(2026, 10, 10, 16, 0, 0);

  const _params = new URLSearchParams(location.search);
  /* ?edit=1 on inside page also unlocks drafts so edit overlays can target them */
  const FORCE_BIRTHDAY =
    _params.has("unlock") ||
    _params.has("birthday") ||
    _params.get("unlock") === "1" ||
    _params.get("birthday") === "1" ||
    (_params.get("edit") === "1" &&
      (document.body.classList.contains("page-inside") ||
        /inside\.html/i.test(location.pathname)));

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
    const naturallyDone = targetMs - Date.now() <= 0;
    return {
      days,
      hours,
      mins,
      secs,
      done: FORCE_BIRTHDAY || naturallyDone,
      forced: FORCE_BIRTHDAY && !naturallyDone,
    };
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
    const pixelHero = document.getElementById("pixel-cd-hero");
    const pixelSub = document.getElementById("pixel-cd-sub");
    const done = parts.done;

    signs.forEach((sign) => {
      if (done) sign.classList.add("is-today");
      else sign.classList.remove("is-today");
    });
    document.body.classList.toggle("is-birthday-day", done);

    if (pixelHero) {
      if (done) {
        pixelHero.classList.add("is-birthday");
        if (pixelSub) {
          pixelSub.textContent = parts.forced
            ? "預覽解鎖 · ?unlock=1"
            : "今日就係！🎂";
        }
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

  /* ?mock=1 → skip pop animation (local preview screenshots) */
  const _mockLanded = _params.has("mock");

  if (flyer) {
    if (_mockLanded || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      flyer.classList.add("idle", "landed");
    } else {
      window.setTimeout(startFlight, 120); /* snappier start */
    }
  }


  /* Gallery captions: editable + localStorage (per-browser) */
  (function initGalleryCaptions() {
    const STORAGE_KEY = "lulu-gallery-captions-v3";
    const boxes = document.querySelectorAll(".gallery-text[data-caption-key]");
    if (!boxes.length) return;

    function loadMap() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : {};
      } catch (e) {
        return {};
      }
    }

    function saveMap(map) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
      } catch (e) {
        /* quota / private mode — ignore */
      }
    }

    function normalizeText(el) {
      let t = (el.innerText || "").replace(/\u00a0/g, " ");
      /* browsers often leave a trailing newline in contenteditable */
      t = t.replace(/\n$/, "");
      if (!t.trim()) return "";
      return t;
    }

    function setEmptyState(el, empty) {
      if (empty) {
        el.textContent = "";
        el.classList.add("is-empty");
      } else {
        el.classList.remove("is-empty");
      }
    }

    const map = loadMap();

    boxes.forEach((el) => {
      const key = el.getAttribute("data-caption-key");
      const saved = map[key];
      if (typeof saved === "string" && saved.trim()) {
        el.textContent = saved;
        setEmptyState(el, false);
      } else {
        /* Baked HTML is the default. Empty or missing localStorage must not wipe it. */
        const baked = normalizeText(el);
        if (baked) {
          el.classList.remove("is-empty");
        } else {
          setEmptyState(el, true);
        }
      }

      const persist = () => {
        const text = normalizeText(el);
        if (!text) {
          setEmptyState(el, true);
          map[key] = "";
        } else {
          /* keep plain text only */
          if (el.innerHTML !== text && el.childElementCount > 0) {
            el.textContent = text;
          }
          setEmptyState(el, false);
          map[key] = text;
        }
        saveMap(map);
      };

      el.addEventListener("input", persist);
      el.addEventListener("blur", persist);

      el.addEventListener("paste", (e) => {
        e.preventDefault();
        const plain = (e.clipboardData || window.clipboardData).getData("text/plain");
        if (document.queryCommandSupported && document.queryCommandSupported("insertText")) {
          document.execCommand("insertText", false, plain);
        } else {
          const sel = window.getSelection();
          if (!sel.rangeCount) return;
          sel.deleteFromDocument();
          sel.getRangeAt(0).insertNode(document.createTextNode(plain));
          sel.collapseToEnd();
        }
        persist();
      });

      el.addEventListener("keydown", (e) => {
        /* Escape blurs so mobile users can dismiss keyboard easily */
        if (e.key === "Escape") el.blur();
      });
    });
  })();

  window.__luluBirthday = {
    startFlight,
    birthdayTargetMs: () => BIRTHDAY_TARGET_MS,
    tick,
    forceBirthday: FORCE_BIRTHDAY,
  };
})();

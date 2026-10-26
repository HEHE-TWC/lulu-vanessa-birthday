/**
 * Temporary edit mode — upload & drag image overlays on homepage OR inside page.
 *
 * How to use:
 *   Home local:   index.html?edit=1
 *   Home live:    https://hehe-twc.github.io/lulu-vanessa-birthday/?v=editmode3&edit=1
 *   Inside local: inside.html?edit=1
 *   Inside live:  .../inside.html?v=editmode3&edit=1
 *   (Inside also auto-unlocks draft sections while editing; ?unlock=1 still works alone.)
 *
 * Without ?edit=1 this script does nothing (no UI, no listeners).
 * Overlays are draft-only (localStorage). Copy JSON → lock into CSS later.
 * Storage keys are per-page so home/inside drafts do not clash.
 */
(function () {
  "use strict";

  var params = new URLSearchParams(location.search);
  if (params.get("edit") !== "1") return;

  var isInside =
    document.body.classList.contains("page-inside") ||
    /inside\.html/i.test(location.pathname);

  var STORAGE_KEY = isInside
    ? "lulu-edit-overlays-inside-v1"
    : "lulu-edit-overlays-v1";

  var host = document.querySelector(".hero-scene");
  if (!host && isInside) {
    host = document.querySelector(".inside-shell");
  }
  if (!host) return;

  /* Ensure absolute overlay layer can cover the host */
  var hostPos = window.getComputedStyle(host).position;
  if (hostPos === "static") {
    host.style.position = "relative";
  }

  document.body.classList.add("is-edit-mode");

  /* On inside page, show draft sections while editing (main.js also treats edit=1 as unlock). */
  if (isInside) {
    document.body.classList.add("is-birthday-day");
  }

  var overlays = [];
  var layer = document.createElement("div");
  layer.className = "edit-overlay-layer";
  host.appendChild(layer);

  /* —— Panel UI —— */
  var panel = document.createElement("aside");
  panel.className = "edit-mode-panel";
  panel.setAttribute("role", "region");
  panel.setAttribute("aria-label", "編輯模式");
  panel.innerHTML =
    '<div class="edit-mode-panel__title">✏ 編輯模式' +
    (isInside ? "（內頁）" : "（首頁）") +
    "</div>" +
    '<p class="edit-mode-panel__hint">上載圖片後拖去想要位置；可拉右下角改大細。座標會存本機，重整唔會冇。' +
    (isInside ? "內頁草稿區已自動解鎖方便執。" : "") +
    "</p>" +
    '<label class="edit-mode-btn edit-mode-btn--file">' +
    "  上載圖片" +
    '  <input type="file" id="edit-upload" accept="image/png,image/jpeg,image/webp,image/gif" multiple hidden />' +
    "</label>" +
    '<button type="button" class="edit-mode-btn" id="edit-copy">鎖定／複製座標</button>' +
    '<button type="button" class="edit-mode-btn edit-mode-btn--danger" id="edit-clear">清除全部圖層</button>' +
    '<details class="edit-mode-help"><summary>結束編輯說明</summary>' +
    "<ol>" +
    "<li>拖好之後撳「鎖定／複製座標」。</li>" +
    "<li>將 JSON 貼俾我（或自己寫入 CSS）。</li>" +
    "<li>關掉網址嘅 <code>?edit=1</code> 就返正常站。</li>" +
    "<li>首頁：<code>index.html?edit=1</code> · 內頁：<code>inside.html?edit=1</code></li>" +
    "<li>編輯模式唔會改到吉祥物／倒數卡紙鎖定位置。</li>" +
    "</ol></details>" +
    '<textarea class="edit-mode-json" id="edit-json" readonly rows="6" placeholder="座標 JSON 會出現喺呢度…"></textarea>' +
    '<p class="edit-mode-status" id="edit-status"></p>';
  document.body.appendChild(panel);

  var statusEl = document.getElementById("edit-status");
  var jsonEl = document.getElementById("edit-json");

  function setStatus(msg) {
    statusEl.textContent = msg || "";
  }

  function uid() {
    return "ov-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
  }

  function hostRect() {
    return host.getBoundingClientRect();
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function toPercent(px, total) {
    if (!total) return 0;
    return Math.round((px / total) * 1000) / 10;
  }

  function applyStyle(el, data) {
    el.style.left = data.left + "%";
    el.style.top = data.top + "%";
    el.style.width = data.width + "%";
    el.style.zIndex = String(data.zIndex || 40);
  }

  function serialize() {
    return overlays.map(function (o) {
      return {
        id: o.id,
        filename: o.filename,
        left: o.left,
        top: o.top,
        width: o.width,
        zIndex: o.zIndex,
      };
    });
  }

  function save() {
    try {
      var payload = overlays.map(function (o) {
        return {
          id: o.id,
          filename: o.filename,
          left: o.left,
          top: o.top,
          width: o.width,
          zIndex: o.zIndex,
          dataUrl: o.dataUrl,
        };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      setStatus("儲存失敗（可能圖太大）：" + (e && e.message ? e.message : e));
    }
  }

  function refreshJson() {
    jsonEl.value = JSON.stringify(serialize(), null, 2);
  }

  function removeOverlay(id) {
    overlays = overlays.filter(function (o) {
      if (o.id === id) {
        if (o.el && o.el.parentNode) o.el.parentNode.removeChild(o.el);
        return false;
      }
      return true;
    });
    save();
    refreshJson();
    setStatus("已刪除圖層");
  }

  function bindDrag(el, data) {
    var dragging = false;
    var resizing = false;
    var startX = 0;
    var startY = 0;
    var startLeft = 0;
    var startTop = 0;
    var startWidth = 0;

    el.addEventListener("pointerdown", function (ev) {
      if (ev.button !== 0) return;
      if (ev.target.classList.contains("edit-overlay__del")) return;
      var isHandle = ev.target.classList.contains("edit-overlay__handle");
      el.setPointerCapture(ev.pointerId);
      startX = ev.clientX;
      startY = ev.clientY;
      startLeft = data.left;
      startTop = data.top;
      startWidth = data.width;
      resizing = isHandle;
      dragging = !isHandle;
      el.classList.add("is-active");
      ev.preventDefault();
    });

    el.addEventListener("pointermove", function (ev) {
      if (!dragging && !resizing) return;
      var rect = hostRect();
      var dx = ev.clientX - startX;
      var dy = ev.clientY - startY;
      if (dragging) {
        data.left = clamp(startLeft + toPercent(dx, rect.width), -20, 95);
        data.top = clamp(startTop + toPercent(dy, rect.height), -20, 95);
      } else if (resizing) {
        data.width = clamp(startWidth + toPercent(dx, rect.width), 5, 100);
      }
      applyStyle(el, data);
    });

    function endDrag(ev) {
      if (!dragging && !resizing) return;
      dragging = false;
      resizing = false;
      el.classList.remove("is-active");
      try {
        el.releasePointerCapture(ev.pointerId);
      } catch (_) {}
      save();
      refreshJson();
      setStatus("已更新位置");
    }

    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
  }

  function createOverlayEl(data) {
    var el = document.createElement("div");
    el.className = "edit-overlay";
    el.dataset.id = data.id;
    el.title = data.filename || "overlay";

    var img = document.createElement("img");
    img.src = data.dataUrl;
    img.alt = data.filename || "";
    img.draggable = false;

    var label = document.createElement("span");
    label.className = "edit-overlay__label";
    label.textContent = data.filename || data.id;

    var handle = document.createElement("span");
    handle.className = "edit-overlay__handle";
    handle.title = "拉大細";

    var del = document.createElement("button");
    del.type = "button";
    del.className = "edit-overlay__del";
    del.setAttribute("aria-label", "刪除");
    del.textContent = "×";
    del.addEventListener("click", function (ev) {
      ev.stopPropagation();
      removeOverlay(data.id);
    });

    el.appendChild(img);
    el.appendChild(label);
    el.appendChild(handle);
    el.appendChild(del);
    applyStyle(el, data);
    bindDrag(el, data);
    layer.appendChild(el);
    data.el = el;
    return el;
  }

  function addOverlay(data) {
    overlays.push(data);
    createOverlayEl(data);
    save();
    refreshJson();
  }

  function readFileAsDataUrl(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  document.getElementById("edit-upload").addEventListener("change", function (ev) {
    var files = Array.prototype.slice.call(ev.target.files || []);
    if (!files.length) return;
    var chain = Promise.resolve();
    files.forEach(function (file, i) {
      chain = chain.then(function () {
        return readFileAsDataUrl(file).then(function (dataUrl) {
          addOverlay({
            id: uid(),
            filename: file.name,
            left: 10 + i * 4,
            top: 20 + i * 4,
            width: 25,
            zIndex: 40 + overlays.length,
            dataUrl: dataUrl,
          });
        });
      });
    });
    chain
      .then(function () {
        setStatus("已上載 " + files.length + " 張");
        ev.target.value = "";
      })
      .catch(function (err) {
        setStatus("上載失敗：" + (err && err.message ? err.message : err));
      });
  });

  document.getElementById("edit-copy").addEventListener("click", function () {
    refreshJson();
    var text = jsonEl.value;
    function ok() {
      setStatus("已複製座標 JSON 到剪貼簿");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(ok).catch(function () {
        jsonEl.focus();
        jsonEl.select();
        try {
          document.execCommand("copy");
          ok();
        } catch (_) {
          setStatus("請手動複製 textarea 內容");
        }
      });
    } else {
      jsonEl.focus();
      jsonEl.select();
      try {
        document.execCommand("copy");
        ok();
      } catch (_) {
        setStatus("請手動複製 textarea 內容");
      }
    }
  });

  document.getElementById("edit-clear").addEventListener("click", function () {
    if (!overlays.length) {
      setStatus("冇圖層可清");
      return;
    }
    if (!confirm("確定清除全部上載圖層？")) return;
    overlays.forEach(function (o) {
      if (o.el && o.el.parentNode) o.el.parentNode.removeChild(o.el);
    });
    overlays = [];
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
    refreshJson();
    setStatus("已清除全部圖層");
  });

  /* Restore from localStorage */
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      var saved = JSON.parse(raw);
      if (Array.isArray(saved)) {
        saved.forEach(function (item) {
          if (!item || !item.dataUrl) return;
          var data = {
            id: item.id || uid(),
            filename: item.filename || "image",
            left: typeof item.left === "number" ? item.left : 10,
            top: typeof item.top === "number" ? item.top : 20,
            width: typeof item.width === "number" ? item.width : 25,
            zIndex: typeof item.zIndex === "number" ? item.zIndex : 40,
            dataUrl: item.dataUrl,
          };
          overlays.push(data);
          createOverlayEl(data);
        });
        refreshJson();
        if (overlays.length) setStatus("已還原 " + overlays.length + " 個圖層");
      }
    }
  } catch (e) {
    setStatus("還原草稿失敗");
  }
})();

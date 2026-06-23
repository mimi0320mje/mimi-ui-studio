// studio.js — shared detail-panel engine used by both the Templates page and the
// Buttons page. Each page provides its own data + builders; this handles the
// panel, the customize controls, the Save/Cancel flow, and copy-to-clipboard.
//
// How Save/Cancel works:
//   - The live PREVIEW updates instantly as you change controls (a "draft").
//   - The PROMPT and CSS only change when you press Save (they reflect the last
//     "committed" state). Cancel throws the draft away and reverts to committed.

const Studio = (() => {
  const FONT_OPTIONS = [
    { label: "Serif (Georgia)", value: "'Georgia', serif" },
    { label: "Elegant serif (Playfair)", value: "'Playfair Display', Georgia, serif" },
    { label: "Clean sans (Inter)", value: "'Inter', system-ui, sans-serif" },
    { label: "Rounded sans (Quicksand)", value: "'Quicksand', system-ui, sans-serif" },
    { label: "Friendly sans (Nunito)", value: "'Nunito', system-ui, sans-serif" },
    { label: "Geometric (Poppins)", value: "'Poppins', system-ui, sans-serif" },
    { label: "Neutral (Helvetica)", value: "'Helvetica Neue', Arial, sans-serif" },
  ];

  const ACCENT_OPTIONS = [
    "#6b5a52", "#7c9cff", "#e89ac7", "#ff7a18",
    "#121212", "#3f7d56", "#1c91c2", "#7b3f9e",
  ];

  const SHARP = "4px";
  const PILL = "999px";

  /* ---- color helpers: derive a cohesive palette from the accent ---- */
  const toRgb = (hex) => {
    const h = hex.replace("#", "");
    return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
  };
  const toHex = ({ r, g, b }) => {
    const ch = (n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
    return "#" + ch(r) + ch(g) + ch(b);
  };
  // Blend hex `a` toward hex `b` by amount `t` (0..1).
  const mix = (a, b, t) => {
    const A = toRgb(a), B = toRgb(b);
    return toHex({ r: A.r + (B.r - A.r) * t, g: A.g + (B.g - A.g) * t, b: A.b + (B.b - A.b) * t });
  };
  const isDark = (hex) => {
    const { r, g, b } = toRgb(hex);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.4;
  };

  let item, builders, shapeOptions, extraControls;
  let committed, draft; // state objects: { accent, font, shapeKey, mode, notes, ...extras }
  let previewCleanup = null; // teardown for an animated preview (or null)

  const $ = (id) => document.getElementById(id);
  const clone = (o) => JSON.parse(JSON.stringify(o));

  /* ---- Build the overlay markup once and attach it to the page ---- */
  function ensureOverlay() {
    if ($("overlay")) return;
    const div = document.createElement("div");
    div.innerHTML = `
      <div id="overlay" class="overlay" hidden>
        <div class="panel" role="dialog" aria-modal="true" aria-labelledby="panel-title">
          <button id="close-btn" class="close-btn" aria-label="Close">&times;</button>
          <h2 id="panel-title" class="panel-title"></h2>
          <p id="panel-vibe" class="panel-vibe"></p>
          <div id="preview" class="preview"></div>
          <div class="controls">
            <div class="control" data-control="accent">
              <label>Accent color</label>
              <div id="accent-swatches" class="swatches"></div>
            </div>
            <div class="control" data-control="font">
              <label for="font-select">Font</label>
              <select id="font-select"></select>
            </div>
            <div class="control" data-control="shape">
              <label>Shape</label>
              <div id="shape-row" class="toggle-row"></div>
            </div>
            <div class="control" data-control="mode">
              <label>Mode</label>
              <div class="toggle-row">
                <button class="toggle" data-mode="light">Light</button>
                <button class="toggle" data-mode="dark">Dark</button>
              </div>
            </div>
            <div id="extra-controls" class="control control-wide"></div>
            <div class="control control-wide" data-control="notes">
              <label for="notes">Extra notes (added to the prompt)</label>
              <textarea id="notes" placeholder="e.g. make it feel cozy, add a soft shadow..."></textarea>
            </div>
          </div>
          <div class="save-row">
            <span id="dirty-hint" class="dirty-hint"></span>
            <div class="save-actions">
              <button id="cancel-btn" class="ghost-btn">Cancel</button>
              <button id="save-btn" class="save-btn">Save</button>
            </div>
          </div>
          <div class="output">
            <div class="output-head"><h3>Prompt</h3><button id="copy-prompt" class="copy-btn">Copy prompt</button></div>
            <pre id="prompt-out" class="code-box"></pre>
          </div>
          <div class="output">
            <div class="output-head"><h3 id="code-label">CSS code</h3><button id="copy-css" class="copy-btn">Copy code</button></div>
            <pre id="css-out" class="code-box"></pre>
          </div>
        </div>
      </div>`;
    document.body.appendChild(div.firstElementChild);
    wireEvents();
  }

  /* ---- Color + shape resolution ---- */
  // The whole background theme follows the accent. If the accent is unchanged and
  // we're in the template's natural mode, use its hand-picked palette. Otherwise
  // derive a harmonious bg/surface/text/muted from the chosen accent, keeping the
  // light-or-dark character of the current mode.
  function effColors(state) {
    const accent = state.accent;
    const base = item.colors;
    const naturalMode = isDark(base.bg) ? "dark" : "light";

    if (accent === base.accent && state.mode === naturalMode) {
      return { bg: base.bg, surface: base.surface, text: base.text, muted: base.muted, accent };
    }
    if (state.mode === "dark") {
      return {
        bg: mix(accent, "#0f1117", 0.88),
        surface: mix(accent, "#1b1e27", 0.85),
        text: "#f2f3f7",
        muted: mix(accent, "#8b90a0", 0.4),
        accent,
      };
    }
    return {
      bg: mix(accent, "#ffffff", 0.9),
      surface: "#ffffff",
      text: mix(accent, "#1a1a1a", 0.8),
      muted: mix(accent, "#9a9a9a", 0.55),
      accent,
    };
  }

  function radiusFor(shapeKey) {
    if (shapeKey === "sharp") return SHARP;
    if (shapeKey === "pill") return PILL;
    return item.radius;
  }

  // The resolved style object passed to a page's builder functions. Any extra
  // control values (e.g. speed, density) are merged in by key.
  function resolve(state) {
    const out = {
      c: effColors(state),
      font: state.font,
      shapeKey: state.shapeKey,
      radius: radiusFor(state.shapeKey),
      mode: state.mode,
    };
    extraControls.forEach((ec) => (out[ec.key] = state[ec.key]));
    return out;
  }

  /* ---- Open a theme / button in the panel ---- */
  function open(theItem, theBuilders) {
    ensureOverlay();
    item = theItem;
    builders = theBuilders;
    shapeOptions = theBuilders.shapeOptions || [
      { key: "rounded", label: "Rounded" },
      { key: "sharp", label: "Sharp" },
    ];
    extraControls = theBuilders.extraControls || [];

    const init = {
      accent: item.colors.accent,
      font: item.font,
      shapeKey: "rounded",
      mode: isDark(item.colors.bg) ? "dark" : "light",
      notes: "",
    };
    extraControls.forEach((ec) => (init[ec.key] = ec.default));
    committed = clone(init);
    draft = clone(init);

    $("panel-title").textContent = item.name;
    $("panel-vibe").textContent = item.vibe;
    $("code-label").textContent = theBuilders.codeLabel || "CSS code";

    $("accent-swatches").innerHTML = ACCENT_OPTIONS.map(
      (col) => `<span class="swatch" data-accent="${col}" style="background:${col};"></span>`
    ).join("");

    $("font-select").innerHTML = FONT_OPTIONS.map(
      (f) => `<option value="${f.value}">${f.label}</option>`
    ).join("");

    $("shape-row").innerHTML = shapeOptions
      .map((s) => `<button class="toggle" data-shape="${s.key}">${s.label}</button>`)
      .join("");

    // Show/hide controls per the page's `hide` list.
    const hide = theBuilders.hide || [];
    document.querySelectorAll(".control[data-control]").forEach((el) => {
      el.hidden = hide.includes(el.dataset.control);
    });

    // Build any extra slider controls (e.g. Speed, Amount).
    $("extra-controls").innerHTML = extraControls
      .map(
        (ec) => `<label class="range-label" for="range-${ec.key}">${ec.label}</label>
          <input class="range" type="range" id="range-${ec.key}"
            min="${ec.min}" max="${ec.max}" step="${ec.step}" data-key="${ec.key}">`
      )
      .join("");
    $("extra-controls").hidden = extraControls.length === 0;

    $("notes").value = "";

    // Show the panel BEFORE mounting the preview so an animated <canvas> can
    // measure its real size (a hidden container measures 0).
    $("overlay").hidden = false;
    syncControls();
    renderPreview();
    renderOutputs();
    setDirty(false);
  }

  // Animated previews opt in via builders.mountPreview (returns a cleanup fn);
  // everything else just sets innerHTML.
  function renderPreview() {
    if (previewCleanup) { previewCleanup(); previewCleanup = null; }
    const container = $("preview");
    if (builders.mountPreview) {
      container.classList.add("preview-anim");
      container.innerHTML = "";
      previewCleanup = builders.mountPreview(container, item, resolve(draft)) || null;
    } else {
      container.classList.remove("preview-anim");
      container.innerHTML = builders.renderPreview(item, resolve(draft));
    }
  }

  // Prompt + CSS always reflect the COMMITTED state (changes on Save).
  function renderOutputs() {
    $("prompt-out").textContent = builders.buildPrompt(item, resolve(committed), committed.notes);
    $("css-out").textContent = builders.buildCSS(item, resolve(committed));
  }

  function isDirty() {
    return JSON.stringify(draft) !== JSON.stringify(committed);
  }

  function setDirty(forceClean) {
    const dirty = forceClean ? false : isDirty();
    $("dirty-hint").textContent = dirty
      ? "● Unsaved changes — click Save to update the prompt & code"
      : "";
    $("save-btn").disabled = !dirty;
    $("cancel-btn").disabled = !dirty;
  }

  function syncControls() {
    document.querySelectorAll(".swatch").forEach((s) =>
      s.classList.toggle("selected", s.dataset.accent === draft.accent)
    );
    $("font-select").value = draft.font;
    document.querySelectorAll(".toggle[data-shape]").forEach((t) =>
      t.classList.toggle("selected", t.dataset.shape === draft.shapeKey)
    );
    document.querySelectorAll(".toggle[data-mode]").forEach((t) =>
      t.classList.toggle("selected", t.dataset.mode === draft.mode)
    );
    extraControls.forEach((ec) => {
      const el = $("range-" + ec.key);
      if (el) el.value = draft[ec.key];
    });
    $("notes").value = draft.notes;
  }

  function closePanel() {
    if (previewCleanup) { previewCleanup(); previewCleanup = null; }
    $("overlay").hidden = true;
  }

  function onChange() {
    syncControls();
    renderPreview();
    setDirty();
  }

  /* ---- Events ---- */
  function wireEvents() {
    $("close-btn").addEventListener("click", closePanel);
    $("overlay").addEventListener("click", (e) => {
      if (e.target.id === "overlay") closePanel();
    });

    $("extra-controls").addEventListener("input", (e) => {
      const el = e.target.closest("input[data-key]");
      if (!el) return;
      draft[el.dataset.key] = parseFloat(el.value);
      onChange();
    });

    $("accent-swatches").addEventListener("click", (e) => {
      const sw = e.target.closest(".swatch");
      if (!sw) return;
      draft.accent = sw.dataset.accent;
      onChange();
    });

    $("font-select").addEventListener("change", (e) => {
      draft.font = e.target.value;
      onChange();
    });

    $("shape-row").addEventListener("click", (e) => {
      const t = e.target.closest(".toggle");
      if (!t) return;
      draft.shapeKey = t.dataset.shape;
      onChange();
    });

    document.querySelectorAll(".toggle[data-mode]").forEach((t) =>
      t.addEventListener("click", () => {
        draft.mode = t.dataset.mode;
        onChange();
      })
    );

    $("notes").addEventListener("input", (e) => {
      draft.notes = e.target.value;
      setDirty();
    });

    $("save-btn").addEventListener("click", () => {
      committed = clone(draft);
      renderOutputs();
      setDirty(true);
    });

    $("cancel-btn").addEventListener("click", () => {
      draft = clone(committed);
      syncControls();
      renderPreview();
      setDirty(true);
    });

    $("copy-prompt").addEventListener("click", (e) => copyFrom("prompt-out", e.target));
    $("copy-css").addEventListener("click", (e) => copyFrom("css-out", e.target));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !$("overlay").hidden) closePanel();
    });
  }

  function copyFrom(elId, btn) {
    navigator.clipboard.writeText($(elId).textContent).then(() => {
      const original = btn.textContent;
      btn.textContent = "Copied!";
      btn.classList.add("copied");
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove("copied");
      }, 1400);
    });
  }

  return { open };
})();

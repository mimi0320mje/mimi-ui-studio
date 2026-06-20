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

  const DARK = { bg: "#15171c", surface: "#20232b", text: "#f2f3f7", muted: "#8b90a0" };

  const SHARP = "4px";
  const PILL = "999px";

  let item, builders, shapeOptions;
  let committed, draft; // state objects: { accent, font, shapeKey, mode, notes }

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
            <div class="control">
              <label>Accent color</label>
              <div id="accent-swatches" class="swatches"></div>
            </div>
            <div class="control">
              <label for="font-select">Font</label>
              <select id="font-select"></select>
            </div>
            <div class="control">
              <label>Shape</label>
              <div id="shape-row" class="toggle-row"></div>
            </div>
            <div class="control">
              <label>Mode</label>
              <div class="toggle-row">
                <button class="toggle" data-mode="light">Light</button>
                <button class="toggle" data-mode="dark">Dark</button>
              </div>
            </div>
            <div class="control control-wide">
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
            <div class="output-head"><h3>CSS code</h3><button id="copy-css" class="copy-btn">Copy code</button></div>
            <pre id="css-out" class="code-box"></pre>
          </div>
        </div>
      </div>`;
    document.body.appendChild(div.firstElementChild);
    wireEvents();
  }

  /* ---- Color + shape resolution ---- */
  function effColors(state) {
    if (state.mode === "dark") return { ...DARK, accent: state.accent };
    const c = item.colors;
    return { bg: c.bg, surface: c.surface, text: c.text, muted: c.muted, accent: state.accent };
  }

  function radiusFor(shapeKey) {
    if (shapeKey === "sharp") return SHARP;
    if (shapeKey === "pill") return PILL;
    return item.radius;
  }

  // The resolved style object passed to a page's builder functions.
  function resolve(state) {
    return {
      c: effColors(state),
      font: state.font,
      shapeKey: state.shapeKey,
      radius: radiusFor(state.shapeKey),
      mode: state.mode,
    };
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

    const init = {
      accent: item.colors.accent,
      font: item.font,
      shapeKey: "rounded",
      mode: "light",
      notes: "",
    };
    committed = clone(init);
    draft = clone(init);

    $("panel-title").textContent = item.name;
    $("panel-vibe").textContent = item.vibe;

    $("accent-swatches").innerHTML = ACCENT_OPTIONS.map(
      (col) => `<span class="swatch" data-accent="${col}" style="background:${col};"></span>`
    ).join("");

    $("font-select").innerHTML = FONT_OPTIONS.map(
      (f) => `<option value="${f.value}">${f.label}</option>`
    ).join("");

    $("shape-row").innerHTML = shapeOptions
      .map((s) => `<button class="toggle" data-shape="${s.key}">${s.label}</button>`)
      .join("");

    $("notes").value = "";

    syncControls();
    renderPreview();
    renderOutputs();
    setDirty(false);
    $("overlay").hidden = false;
  }

  function renderPreview() {
    $("preview").innerHTML = builders.renderPreview(item, resolve(draft));
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
    $("notes").value = draft.notes;
  }

  function onChange() {
    syncControls();
    renderPreview();
    setDirty();
  }

  /* ---- Events ---- */
  function wireEvents() {
    $("close-btn").addEventListener("click", () => ($("overlay").hidden = true));
    $("overlay").addEventListener("click", (e) => {
      if (e.target.id === "overlay") $("overlay").hidden = true;
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
      if (e.key === "Escape") $("overlay").hidden = true;
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

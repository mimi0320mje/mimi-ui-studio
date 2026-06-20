// Mimi's UI Studio — render the gallery, handle customization, build outputs.

const grid = document.getElementById("grid");
const overlay = document.getElementById("overlay");

// Current customization state for the open theme.
let activeTheme = null;
let custom = null; // { accent, font, radius, mode, notes }

const SHARP_RADIUS = "4px";

/* ---------- Render the gallery ---------- */

function miniPreview(theme) {
  const c = theme.colors;
  return `
    <div class="mini" style="background:${c.bg}; border-radius:${theme.radius};">
      <div class="mini-bar" style="background:${c.accent};"></div>
      <div class="mini-card" style="background:${c.surface}; border:1px solid ${c.muted}33; border-radius:${theme.radius};">
        <div class="mini-line" style="background:${c.text}; width:70%;"></div>
        <div class="mini-line" style="background:${c.muted}; width:90%;"></div>
        <div class="mini-line" style="background:${c.muted}; width:55%; margin-bottom:12px;"></div>
        <span class="mini-btn" style="background:${c.accent}; color:${c.surface}; border-radius:${theme.radius};">Button</span>
      </div>
    </div>`;
}

function renderGrid() {
  grid.innerHTML = THEMES.map((theme) => {
    const c = theme.colors;
    const dots = ["bg", "surface", "text", "muted", "accent"]
      .map((k) => `<span class="swatch-dot" style="background:${c[k]};"></span>`)
      .join("");
    return `
      <article class="card" data-id="${theme.id}" style="font-family:${theme.font};">
        ${miniPreview(theme)}
        <div class="card-foot">
          <span class="card-name">${theme.name}</span>
          <span class="swatch-row">${dots}</span>
        </div>
      </article>`;
  }).join("");
}

/* ---------- Open / customize a theme ---------- */

function openTheme(theme) {
  activeTheme = theme;
  custom = {
    accent: theme.colors.accent,
    font: theme.font,
    radius: theme.radius,
    mode: "light",
    notes: "",
  };

  document.getElementById("panel-title").textContent = theme.name;
  document.getElementById("panel-vibe").textContent = theme.vibe;

  // Accent swatches
  const accentBox = document.getElementById("accent-swatches");
  accentBox.innerHTML = ACCENT_OPTIONS.map(
    (col) => `<span class="swatch" data-accent="${col}" style="background:${col};"></span>`
  ).join("");

  // Font dropdown
  const fontSelect = document.getElementById("font-select");
  fontSelect.innerHTML = FONT_OPTIONS.map(
    (f) => `<option value="${f.value}">${f.label}</option>`
  ).join("");
  fontSelect.value = theme.font;

  document.getElementById("notes").value = "";

  syncControls();
  refresh();
  overlay.hidden = false;
}

// Returns the effective colors for the current mode (light = theme, dark = inverted base).
function effectiveColors() {
  const c = activeTheme.colors;
  if (custom.mode === "dark") {
    return { bg: "#15171c", surface: "#20232b", text: "#f2f3f7", muted: "#8b90a0", accent: custom.accent };
  }
  return { bg: c.bg, surface: c.surface, text: c.text, muted: c.muted, accent: custom.accent };
}

function refresh() {
  renderPreview();
  document.getElementById("prompt-out").textContent = buildPrompt(activeTheme, custom);
  document.getElementById("css-out").textContent = buildCSS(activeTheme, custom);
}

function renderPreview() {
  const c = effectiveColors();
  const r = custom.radius;
  document.getElementById("preview").innerHTML = `
    <div style="background:${c.bg}; border-radius:${r}; padding:22px; font-family:${custom.font};">
      <div class="preview-bar" style="background:${c.accent};"></div>
      <div class="preview-card" style="background:${c.surface}; border:1px solid ${c.muted}33; border-radius:${r};">
        <p class="preview-h" style="color:${c.text};">Sample heading</p>
        <p class="preview-p" style="color:${c.muted};">A short line of body text shows how the colors and font feel together.</p>
        <button class="preview-btn" style="background:${c.accent}; color:${c.surface}; border-radius:${r};">Call to action</button>
      </div>
    </div>`;
}

/* ---------- Output generators (pure functions) ---------- */

function buildPrompt(theme, cu) {
  const c = effectiveColors();
  const corners = cu.radius === SHARP_RADIUS ? "sharp" : "rounded";
  let p =
    `Style this page with a ${theme.vibe} look (${cu.mode} mode). ` +
    `Use these colors: background ${c.bg}, surface/cards ${c.surface}, ` +
    `main text ${c.text}, muted text ${c.muted}, and accent ${c.accent}. ` +
    `Use the font family ${cu.font}. Use ${corners} corners (border-radius ${cu.radius}). ` +
    `Buttons should use the accent color as their fill with the surface color as their text, ` +
    `and cards should have a subtle border and a soft hover lift.`;
  if (cu.notes.trim()) p += ` Extra notes: ${cu.notes.trim()}`;
  return p;
}

function buildCSS(theme, cu) {
  const c = effectiveColors();
  return `:root {
  --bg: ${c.bg};
  --surface: ${c.surface};
  --text: ${c.text};
  --muted: ${c.muted};
  --accent: ${c.accent};
  --radius: ${cu.radius};
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: ${cu.font};
}

.card {
  background: var(--surface);
  border: 1px solid color-mix(in srgb, var(--muted) 25%, transparent);
  border-radius: var(--radius);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
}

.btn {
  background: var(--accent);
  color: var(--surface);
  border: none;
  border-radius: var(--radius);
  padding: 10px 20px;
  cursor: pointer;
}
.btn:hover { opacity: 0.9; }`;
}

/* ---------- Sync control selected-states ---------- */

function syncControls() {
  document.querySelectorAll(".swatch").forEach((s) =>
    s.classList.toggle("selected", s.dataset.accent === custom.accent)
  );
  document.querySelectorAll(".toggle[data-radius]").forEach((t) => {
    const isSharp = custom.radius === SHARP_RADIUS;
    const wantsSharp = t.dataset.radius === "sharp";
    t.classList.toggle("selected", isSharp === wantsSharp);
  });
  document.querySelectorAll(".toggle[data-mode]").forEach((t) =>
    t.classList.toggle("selected", t.dataset.mode === custom.mode)
  );
}

/* ---------- Events ---------- */

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  const theme = THEMES.find((t) => t.id === card.dataset.id);
  if (theme) openTheme(theme);
});

document.getElementById("close-btn").addEventListener("click", () => (overlay.hidden = true));
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) overlay.hidden = true;
});

document.getElementById("accent-swatches").addEventListener("click", (e) => {
  const sw = e.target.closest(".swatch");
  if (!sw) return;
  custom.accent = sw.dataset.accent;
  syncControls();
  refresh();
});

document.getElementById("font-select").addEventListener("change", (e) => {
  custom.font = e.target.value;
  refresh();
});

document.querySelectorAll(".toggle[data-radius]").forEach((t) =>
  t.addEventListener("click", () => {
    custom.radius = t.dataset.radius === "sharp" ? SHARP_RADIUS : activeTheme.radius;
    syncControls();
    refresh();
  })
);

document.querySelectorAll(".toggle[data-mode]").forEach((t) =>
  t.addEventListener("click", () => {
    custom.mode = t.dataset.mode;
    syncControls();
    refresh();
  })
);

document.getElementById("notes").addEventListener("input", (e) => {
  custom.notes = e.target.value;
  document.getElementById("prompt-out").textContent = buildPrompt(activeTheme, custom);
});

function copyFrom(elId, btn) {
  const text = document.getElementById(elId).textContent;
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.textContent;
    btn.textContent = "Copied!";
    btn.classList.add("copied");
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove("copied");
    }, 1400);
  });
}

document.getElementById("copy-prompt").addEventListener("click", (e) => copyFrom("prompt-out", e.target));
document.getElementById("copy-css").addEventListener("click", (e) => copyFrom("css-out", e.target));

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") overlay.hidden = true;
});

renderGrid();

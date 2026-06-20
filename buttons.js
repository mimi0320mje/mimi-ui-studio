// buttons.js — the Buttons page: 8 different KINDS of button (not just text):
// solid, outline, icon-only, icon+label, image/avatar, on/off switch,
// true/false segmented, and a floating action button. Each has its own palette.
// Click one to customize color/font/shape and copy a prompt + CSS.

const BUTTONS = [
  { id: "solid", kind: "solid", name: "Solid Button", vibe: "bold, primary call-to-action",
    colors: { bg: "#fffaf0", surface: "#ffffff", text: "#2b2118", muted: "#a08c6f", accent: "#ff7a18" },
    font: "'Poppins', system-ui, sans-serif", radius: "10px" },
  { id: "outline", kind: "outline", name: "Outline Button", vibe: "light, secondary action",
    colors: { bg: "#f0f7fb", surface: "#ffffff", text: "#173042", muted: "#7591a3", accent: "#1c91c2" },
    font: "'Inter', system-ui, sans-serif", radius: "10px" },
  { id: "icon", kind: "icon", name: "Icon Button", vibe: "compact, icon-only",
    colors: { bg: "#fdf2f8", surface: "#ffffff", text: "#4a3b52", muted: "#b09bb8", accent: "#e89ac7" },
    font: "'Quicksand', system-ui, sans-serif", radius: "12px" },
  { id: "icontext", kind: "icontext", name: "Icon + Label", vibe: "clear, icon with text",
    colors: { bg: "#f3f6f1", surface: "#ffffff", text: "#24332a", muted: "#7d9183", accent: "#3f7d56" },
    font: "'Nunito', system-ui, sans-serif", radius: "10px" },
  { id: "image", kind: "image", name: "Image Button", vibe: "rich, image or avatar",
    colors: { bg: "#fdf8f4", surface: "#ffffff", text: "#3a2e28", muted: "#9e8c80", accent: "#6b5a52" },
    font: "'Georgia', serif", radius: "12px" },
  { id: "toggle", kind: "toggle", name: "On / Off Switch", vibe: "sleek settings toggle",
    colors: { bg: "#0f1117", surface: "#1a1d27", text: "#f2f3f7", muted: "#8b90a0", accent: "#7c9cff" },
    font: "'Inter', system-ui, sans-serif", radius: "999px" },
  { id: "truefalse", kind: "truefalse", name: "True / False", vibe: "elegant segmented choice",
    colors: { bg: "#faf6fb", surface: "#ffffff", text: "#2e1f37", muted: "#9a82a6", accent: "#7b3f9e" },
    font: "'Playfair Display', Georgia, serif", radius: "10px" },
  { id: "fab", kind: "fab", name: "Floating Action", vibe: "round, raised action button",
    colors: { bg: "#ffffff", surface: "#f6f6f6", text: "#121212", muted: "#8a8a8a", accent: "#121212" },
    font: "'Helvetica Neue', Arial, sans-serif", radius: "12px" },
];

// A small inline image (faux photo/avatar) for the image button.
const _imgSvg = (size) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 32 32" style="border-radius:6px;display:block;">
    <rect width="32" height="32" fill="#ffd27a"/><circle cx="22" cy="9" r="4" fill="#fff3d6"/>
    <path d="M0 32 L11 16 L19 26 L24 20 L32 32 Z" fill="#3f7d56"/></svg>`;

/* ---- render each button KIND (used in the grid card and the panel preview) ---- */
function renderButton(kind, c, r, font) {
  const center = (inner) =>
    `<div style="background:${c.bg};font-family:${font};border-radius:14px;padding:26px;display:flex;align-items:center;justify-content:center;gap:14px;min-height:96px;">${inner}</div>`;
  const accentText = c.surface;

  switch (kind) {
    case "solid":
      return center(`<button style="background:${c.accent};color:${accentText};border:none;border-radius:${r};padding:11px 24px;font:inherit;font-weight:600;font-size:0.95rem;cursor:pointer;">Get started</button>`);

    case "outline":
      return center(`<button style="background:transparent;color:${c.accent};border:2px solid ${c.accent};border-radius:${r};padding:9px 22px;font:inherit;font-weight:600;font-size:0.95rem;cursor:pointer;">Learn more</button>`);

    case "icon":
      return center(
        `<button style="width:46px;height:46px;border-radius:50%;background:${c.accent};color:${accentText};border:none;font-size:1.1rem;cursor:pointer;">&#9829;</button>` +
        `<button style="width:46px;height:46px;border-radius:50%;background:${c.surface};color:${c.accent};border:1.5px solid ${c.accent};font-size:1.1rem;cursor:pointer;">&#9733;</button>`
      );

    case "icontext":
      return center(`<button style="display:inline-flex;align-items:center;gap:8px;background:${c.accent};color:${accentText};border:none;border-radius:${r};padding:11px 20px;font:inherit;font-weight:600;font-size:0.95rem;cursor:pointer;"><span style="font-size:1.05rem;">&#8595;</span> Download</button>`);

    case "image":
      return center(`<button style="display:inline-flex;align-items:center;gap:10px;background:${c.surface};color:${c.text};border:1px solid ${c.muted}55;border-radius:${r};padding:8px 16px 8px 8px;font:inherit;font-weight:600;font-size:0.92rem;cursor:pointer;">${_imgSvg(26)} View gallery</button>`);

    case "toggle":
      return center(`
        <div style="display:flex;align-items:center;gap:12px;">
          <span style="width:48px;height:27px;border-radius:999px;background:${c.accent};position:relative;display:inline-block;">
            <span style="position:absolute;top:3px;left:24px;width:21px;height:21px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3);"></span>
          </span>
          <span style="color:${c.text};font-weight:600;">On</span>
        </div>`);

    case "truefalse":
      return center(`
        <div style="display:inline-flex;border:1px solid ${c.muted}66;border-radius:${r};overflow:hidden;">
          <span style="padding:9px 20px;background:${c.accent};color:${accentText};font-weight:700;">True</span>
          <span style="padding:9px 20px;background:${c.surface};color:${c.muted};font-weight:700;">False</span>
        </div>`);

    case "fab":
      return center(`<button style="width:54px;height:54px;border-radius:50%;background:${c.accent};color:${accentText};border:none;font-size:1.6rem;line-height:1;box-shadow:0 8px 18px ${c.accent}55;cursor:pointer;">+</button>`);

    default:
      return center("");
  }
}

// A plain-language description of each kind, used in the generated prompt.
const KIND_DESC = {
  solid: "a solid filled primary button",
  outline: "an outline (ghost) button with a transparent fill and a colored border",
  icon: "round icon-only buttons (one filled, one outline)",
  icontext: "a button with an icon next to a text label",
  image: "a button with a small image/avatar thumbnail next to a label",
  toggle: "an on/off toggle switch (shown in the On position)",
  truefalse: "a true/false segmented control (True selected)",
  fab: "a round floating action button with a drop shadow",
};

// The CSS code shown/copied for each kind (real, with #hex codes).
function buttonCSS(kind, c, r, font) {
  const root = `:root {
  --bg: ${c.bg};
  --surface: ${c.surface};
  --text: ${c.text};
  --muted: ${c.muted};
  --accent: ${c.accent};
  --radius: ${r};
}
`;
  const snippets = {
    solid: `.btn {
  background: var(--accent);
  color: var(--surface);
  border: none;
  border-radius: var(--radius);
  padding: 11px 24px;
  font-family: ${font};
  font-weight: 600;
  cursor: pointer;
}
.btn:hover { opacity: .9; }`,

    outline: `.btn-outline {
  background: transparent;
  color: var(--accent);
  border: 2px solid var(--accent);
  border-radius: var(--radius);
  padding: 9px 22px;
  font-family: ${font};
  font-weight: 600;
  cursor: pointer;
}
.btn-outline:hover { background: var(--accent); color: var(--surface); }`,

    icon: `.btn-icon {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--surface);
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
}
.btn-icon.outline {
  background: var(--surface);
  color: var(--accent);
  border: 1.5px solid var(--accent);
}`,

    icontext: `.btn-icon-text {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--accent);
  color: var(--surface);
  border: none;
  border-radius: var(--radius);
  padding: 11px 20px;
  font-family: ${font};
  font-weight: 600;
  cursor: pointer;
}`,

    image: `.btn-image {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--surface);
  color: var(--text);
  border: 1px solid color-mix(in srgb, var(--muted) 40%, transparent);
  border-radius: var(--radius);
  padding: 8px 16px 8px 8px;
  font-family: ${font};
  font-weight: 600;
  cursor: pointer;
}
.btn-image img { width: 26px; height: 26px; border-radius: 6px; }`,

    toggle: `.switch { position: relative; width: 48px; height: 27px; display: inline-block; }
.switch input { display: none; }
.switch .track {
  position: absolute; inset: 0;
  background: var(--muted);
  border-radius: 999px;
  transition: background .2s;
}
.switch .thumb {
  position: absolute; top: 3px; left: 3px;
  width: 21px; height: 21px;
  background: #fff; border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,.3);
  transition: left .2s;
}
.switch input:checked + .track { background: var(--accent); }
.switch input:checked + .track + .thumb { left: 24px; }`,

    truefalse: `.segmented {
  display: inline-flex;
  border: 1px solid color-mix(in srgb, var(--muted) 50%, transparent);
  border-radius: var(--radius);
  overflow: hidden;
  font-family: ${font};
}
.segmented button {
  padding: 9px 20px;
  border: none;
  background: var(--surface);
  color: var(--muted);
  font-weight: 700;
  cursor: pointer;
}
.segmented button.active { background: var(--accent); color: var(--surface); }`,

    fab: `.fab {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--surface);
  border: none;
  font-size: 1.6rem;
  box-shadow: 0 8px 18px color-mix(in srgb, var(--accent) 40%, transparent);
  cursor: pointer;
}
.fab:hover { transform: translateY(-2px); }`,
  };
  return root + "\n" + (snippets[kind] || "");
}

/* ---- builders handed to the shared Studio engine ---- */
const BUTTON_BUILDERS = {
  shapeOptions: [
    { key: "rounded", label: "Rounded" },
    { key: "pill", label: "Pill" },
    { key: "sharp", label: "Sharp" },
  ],
  renderPreview: (item, s) => renderButton(item.kind, s.c, s.radius, s.font),
  buildPrompt: (item, s, notes) => {
    const shape = s.shapeKey === "sharp" ? "sharp" : s.shapeKey === "pill" ? "pill-shaped (fully rounded)" : "rounded";
    let p =
      `Create ${KIND_DESC[item.kind]} in ${s.mode} mode. ` +
      `Use the accent color ${s.c.accent} as the main button color, ` +
      `with ${s.c.surface} for the text/knob on filled buttons, ` +
      `${s.c.text} for label text, and ${s.c.muted} for muted/borders on a ${s.c.bg} background. ` +
      `Use the font family ${s.font} and ${shape} corners (border-radius ${s.radius}). ` +
      `Add a gentle hover effect.`;
    if (notes && notes.trim()) p += ` Extra notes: ${notes.trim()}`;
    return p;
  },
  buildCSS: (item, s) => buttonCSS(item.kind, s.c, s.radius, s.font),
};

/* ---- render the gallery grid + wire clicks ---- */
function renderButtonGrid() {
  const grid = document.getElementById("grid");
  grid.innerHTML = BUTTONS.map((b) => {
    const c = b.colors;
    const dots = ["bg", "surface", "text", "muted", "accent"]
      .map((k) => `<span class="swatch-dot" style="background:${c[k]};"></span>`)
      .join("");
    return `
      <article class="card" data-id="${b.id}">
        <div class="mini">${renderButton(b.kind, c, b.radius, b.font)}</div>
        <div class="card-foot">
          <span class="card-name" style="font-family:${b.font};">${b.name}</span>
          <span class="swatch-row">${dots}</span>
        </div>
      </article>`;
  }).join("");

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const b = BUTTONS.find((x) => x.id === card.dataset.id);
    if (b) Studio.open(b, BUTTON_BUILDERS);
  });
}

renderButtonGrid();

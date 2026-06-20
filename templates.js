// templates.js — the Templates page: 8 genuinely different page layouts, each
// with its own palette. Click one to customize colors/font/shape and copy a
// prompt + CSS. Add a template = append one object to TEMPLATES (give it a
// `layout` that renderLayout() knows how to draw).

const TEMPLATES = [
  { id: "hero", layout: "hero", name: "Sunrise Hero", vibe: "bold, welcoming landing hero",
    colors: { bg: "#fffaf0", surface: "#ffffff", text: "#2b2118", muted: "#a08c6f", accent: "#ff7a18" },
    font: "'Poppins', system-ui, sans-serif", radius: "12px" },
  { id: "pricing", layout: "pricing", name: "Pricing Card", vibe: "clear, trustworthy pricing",
    colors: { bg: "#f0f7fb", surface: "#ffffff", text: "#173042", muted: "#7591a3", accent: "#1c91c2" },
    font: "'Inter', system-ui, sans-serif", radius: "14px" },
  { id: "profile", layout: "profile", name: "Profile Card", vibe: "soft, friendly profile",
    colors: { bg: "#fdf2f8", surface: "#ffffff", text: "#4a3b52", muted: "#b09bb8", accent: "#e89ac7" },
    font: "'Quicksand', system-ui, sans-serif", radius: "20px" },
  { id: "login", layout: "login", name: "Login Form", vibe: "sleek, modern sign-in",
    colors: { bg: "#0f1117", surface: "#1a1d27", text: "#f2f3f7", muted: "#8b90a0", accent: "#7c9cff" },
    font: "'Inter', system-ui, sans-serif", radius: "12px" },
  { id: "stats", layout: "stats", name: "Dashboard Stats", vibe: "calm, data-focused dashboard",
    colors: { bg: "#f3f6f1", surface: "#ffffff", text: "#24332a", muted: "#7d9183", accent: "#3f7d56" },
    font: "'Nunito', system-ui, sans-serif", radius: "14px" },
  { id: "product", layout: "product", name: "Product Showcase", vibe: "warm, handcrafted shop",
    colors: { bg: "#fdf8f4", surface: "#ffffff", text: "#3a2e28", muted: "#9e8c80", accent: "#6b5a52" },
    font: "'Georgia', serif", radius: "12px" },
  { id: "quote", layout: "quote", name: "Testimonial", vibe: "elegant customer quote",
    colors: { bg: "#faf6fb", surface: "#ffffff", text: "#2e1f37", muted: "#9a82a6", accent: "#7b3f9e" },
    font: "'Playfair Display', Georgia, serif", radius: "10px" },
  { id: "blog", layout: "blog", name: "Blog Post", vibe: "minimal, readable article",
    colors: { bg: "#ffffff", surface: "#f6f6f6", text: "#121212", muted: "#8a8a8a", accent: "#121212" },
    font: "'Helvetica Neue', Arial, sans-serif", radius: "6px" },
];

/* ---- small inline helpers for the layout previews ---- */
const _btn = (c, r, label) =>
  `<span style="display:inline-block;padding:8px 16px;background:${c.accent};color:${c.surface};border-radius:${r};font-weight:600;font-size:0.8rem;">${label}</span>`;
const _line = (color, w) =>
  `<div style="height:7px;border-radius:99px;background:${color};width:${w};margin:6px 0;"></div>`;
const _chip = (c, r) =>
  `<span style="display:inline-block;width:34px;height:8px;border-radius:${r};background:${c.muted}66;"></span>`;

// Draws one of the 8 layouts. `c` = colors, `r` = radius, `font` = font-family.
function renderLayout(layout, c, r, font) {
  const wrap = (inner) =>
    `<div style="background:${c.bg};font-family:${font};color:${c.text};border-radius:${r};padding:18px;">${inner}</div>`;

  switch (layout) {
    case "hero":
      return wrap(`
        <div style="text-align:center;padding:6px 4px 4px;">
          <div style="font-size:1.4rem;font-weight:700;margin-bottom:8px;">Make something lovely</div>
          <div style="color:${c.muted};font-size:0.85rem;margin-bottom:14px;">A short, friendly subtitle that sells the idea.</div>
          ${_btn(c, r, "Get started")}
          <span style="display:inline-block;margin-left:8px;padding:8px 16px;border:1.5px solid ${c.accent};color:${c.accent};border-radius:${r};font-weight:600;font-size:0.8rem;">Learn more</span>
        </div>`);

    case "pricing":
      return wrap(`
        <div style="background:${c.surface};border:1px solid ${c.muted}33;border-radius:${r};padding:16px;text-align:center;">
          <div style="color:${c.muted};font-size:0.75rem;text-transform:uppercase;letter-spacing:0.08em;">Pro</div>
          <div style="font-size:1.8rem;font-weight:800;margin:4px 0;">$12<span style="font-size:0.8rem;color:${c.muted};font-weight:500;">/mo</span></div>
          ${_line(c.muted + "55", "80%")}${_line(c.muted + "55", "65%")}${_line(c.muted + "55", "72%")}
          <div style="margin-top:12px;">${_btn(c, r, "Choose plan")}</div>
        </div>`);

    case "profile":
      return wrap(`
        <div style="background:${c.surface};border:1px solid ${c.muted}33;border-radius:${r};padding:16px;text-align:center;">
          <div style="width:54px;height:54px;border-radius:50%;background:${c.accent};margin:0 auto 10px;"></div>
          <div style="font-weight:700;">Jamie Rivers</div>
          <div style="color:${c.muted};font-size:0.8rem;margin-bottom:12px;">Ceramic artist · she/her</div>
          ${_btn(c, r, "Follow")}
        </div>`);

    case "login":
      return wrap(`
        <div style="background:${c.surface};border:1px solid ${c.muted}33;border-radius:${r};padding:18px;">
          <div style="font-weight:700;margin-bottom:12px;">Welcome back</div>
          <div style="background:${c.bg};border:1px solid ${c.muted}44;border-radius:${r};height:30px;margin-bottom:8px;"></div>
          <div style="background:${c.bg};border:1px solid ${c.muted}44;border-radius:${r};height:30px;margin-bottom:12px;"></div>
          <div style="display:block;">${_btn(c, r, "Sign in")}</div>
        </div>`);

    case "stats":
      return wrap(`
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          ${[["Users", "8.4k"], ["Revenue", "$21k"], ["Orders", "1,205"], ["Growth", "+18%"]]
            .map(([k, v]) => `<div style="background:${c.surface};border:1px solid ${c.muted}33;border-radius:${r};padding:12px;">
              <div style="color:${c.muted};font-size:0.72rem;">${k}</div>
              <div style="font-size:1.25rem;font-weight:800;color:${c.accent};">${v}</div></div>`)
            .join("")}
        </div>`);

    case "product":
      return wrap(`
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          ${[1, 2].map(() => `<div style="background:${c.surface};border:1px solid ${c.muted}33;border-radius:${r};overflow:hidden;">
              <div style="height:48px;background:${c.accent}33;"></div>
              <div style="padding:10px;"><div style="font-weight:700;font-size:0.85rem;">Mug</div>
              <div style="color:${c.muted};font-size:0.78rem;margin-bottom:8px;">$24</div>${_btn(c, r, "Add")}</div></div>`).join("")}
        </div>`);

    case "quote":
      return wrap(`
        <div style="background:${c.surface};border:1px solid ${c.muted}33;border-radius:${r};padding:18px;">
          <div style="font-size:2rem;line-height:0.6;color:${c.accent};">&ldquo;</div>
          <div style="font-style:italic;font-size:0.95rem;margin:6px 0 12px;">Honestly the loveliest mugs I've ever owned.</div>
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="width:30px;height:30px;border-radius:50%;background:${c.accent};"></div>
            <div><div style="font-weight:700;font-size:0.82rem;">Alex P.</div><div style="color:${c.muted};font-size:0.74rem;">Verified buyer</div></div>
          </div>
        </div>`);

    case "blog":
      return wrap(`
        <div>
          <div style="display:flex;gap:6px;margin-bottom:8px;">${_chip(c, r)}${_chip(c, r)}</div>
          <div style="font-size:1.2rem;font-weight:700;margin-bottom:4px;">How we glaze our mugs</div>
          <div style="color:${c.muted};font-size:0.75rem;margin-bottom:12px;">June 20 · 4 min read</div>
          ${_line(c.text + "cc", "100%")}${_line(c.text + "cc", "96%")}${_line(c.text + "cc", "90%")}${_line(c.muted + "88", "60%")}
          <div style="margin-top:12px;">${_btn(c, r, "Read more")}</div>
        </div>`);

    default:
      return wrap("");
  }
}

/* ---- builders handed to the shared Studio engine ---- */
const TEMPLATE_BUILDERS = {
  renderPreview: (item, s) => renderLayout(item.layout, s.c, s.radius, s.font),

  buildPrompt: (item, s, notes) => {
    const corners = s.shapeKey === "sharp" ? "sharp" : s.shapeKey === "pill" ? "pill-shaped" : "rounded";
    let p =
      `Build a "${item.name}" layout (a ${item.vibe}) in ${s.mode} mode. ` +
      `Use these colors: background ${s.c.bg}, surface/cards ${s.c.surface}, ` +
      `main text ${s.c.text}, muted text ${s.c.muted}, accent ${s.c.accent}. ` +
      `Use the font family ${s.font}, with ${corners} corners (border-radius ${s.radius}). ` +
      `Buttons use the accent as fill with the surface color as text; ` +
      `cards have a subtle border and a soft hover lift.`;
    if (notes && notes.trim()) p += ` Extra notes: ${notes.trim()}`;
    return p;
  },

  buildCSS: (item, s) =>
    `:root {
  --bg: ${s.c.bg};
  --surface: ${s.c.surface};
  --text: ${s.c.text};
  --muted: ${s.c.muted};
  --accent: ${s.c.accent};
  --radius: ${s.radius};
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: ${s.font};
}

.card {
  background: var(--surface);
  border: 1px solid color-mix(in srgb, var(--muted) 25%, transparent);
  border-radius: var(--radius);
  transition: transform .15s ease, box-shadow .15s ease;
}
.card:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(0,0,0,.12); }

.btn {
  background: var(--accent);
  color: var(--surface);
  border: none;
  border-radius: var(--radius);
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
}
.btn:hover { opacity: .9; }`,
};

/* ---- render the gallery grid + wire clicks ---- */
function renderTemplateGrid() {
  const grid = document.getElementById("grid");
  grid.innerHTML = TEMPLATES.map((t) => {
    const c = t.colors;
    const dots = ["bg", "surface", "text", "muted", "accent"]
      .map((k) => `<span class="swatch-dot" style="background:${c[k]};"></span>`)
      .join("");
    return `
      <article class="card" data-id="${t.id}">
        <div class="mini">${renderLayout(t.layout, c, t.radius, t.font)}</div>
        <div class="card-foot">
          <span class="card-name" style="font-family:${t.font};">${t.name}</span>
          <span class="swatch-row">${dots}</span>
        </div>
      </article>`;
  }).join("");

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const t = TEMPLATES.find((x) => x.id === card.dataset.id);
    if (t) Studio.open(t, TEMPLATE_BUILDERS);
  });
}

renderTemplateGrid();

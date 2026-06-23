// backgrounds.js — the Backgrounds page: 6 animated / interactive backgrounds.
// Unlike templates/buttons these need JavaScript, so each effect has:
//   mount(container, opts) -> cleanup()   live preview (cards + panel)
//   code(opts)             -> string      a standalone HTML+CSS+JS snippet to copy
// opts = { c (colors), speed, density, mode }.

const BACKGROUNDS = [
  { id: "parallax-blobs", type: "parallax-blobs", name: "Parallax Blobs", vibe: "soft color blobs that drift with your mouse",
    colors: { bg: "#0f1117", surface: "#1a1d27", text: "#f2f3f7", muted: "#8b90a0", accent: "#7c9cff" },
    font: "'Inter', system-ui, sans-serif", radius: "12px" },
  { id: "parallax-dots", type: "parallax-dots", name: "Parallax Dot Grid", vibe: "a dot grid that leans toward the cursor",
    colors: { bg: "#fdf8f4", surface: "#ffffff", text: "#3a2e28", muted: "#9e8c80", accent: "#6b5a52" },
    font: "'Georgia', serif", radius: "12px" },
  { id: "particles", type: "particles", name: "Floating Particles", vibe: "drifting dots that dodge your mouse",
    colors: { bg: "#0f1117", surface: "#1a1d27", text: "#f2f3f7", muted: "#8b90a0", accent: "#e89ac7" },
    font: "'Inter', system-ui, sans-serif", radius: "12px" },
  { id: "bubbles", type: "bubbles", name: "Bubble Rise", vibe: "soft bubbles floating gently upward",
    colors: { bg: "#f0f7fb", surface: "#ffffff", text: "#173042", muted: "#7591a3", accent: "#1c91c2" },
    font: "'Nunito', system-ui, sans-serif", radius: "14px" },
  { id: "gradient", type: "gradient", name: "Animated Gradient", vibe: "a smoothly shifting color gradient",
    colors: { bg: "#fdf2f8", surface: "#ffffff", text: "#4a3b52", muted: "#b09bb8", accent: "#7b3f9e" },
    font: "'Quicksand', system-ui, sans-serif", radius: "16px" },
  { id: "byo-gif", type: "byo-gif", name: "Your GIF / Video", vibe: "a full-page background from a URL you paste",
    colors: { bg: "#121212", surface: "#1d1d1d", text: "#ffffff", muted: "#9a9a9a", accent: "#ff7a18" },
    font: "'Poppins', system-ui, sans-serif", radius: "10px" },
];

/* ---------- shared canvas helpers ---------- */

// Set up a canvas that fills its container (handles devicePixelRatio + resize).
function makeCanvas(container, c) {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "display:block;width:100%;height:100%;border-radius:inherit;";
  container.style.background = c.bg;
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0;
  function size() {
    const r = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = r.width; h = r.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  const ro = new ResizeObserver(size);
  ro.observe(container);
  return { canvas, ctx, get w() { return w; }, get h() { return h; }, stopResize: () => ro.disconnect() };
}

// Track the mouse position (0..1) relative to a target element.
function trackMouse(target) {
  const m = { x: 0.5, y: 0.5 };
  const onMove = (e) => {
    const r = target.getBoundingClientRect();
    m.x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    m.y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
  };
  window.addEventListener("mousemove", onMove);
  m.remove = () => window.removeEventListener("mousemove", onMove);
  return m;
}

const rnd = (a, b) => a + Math.random() * (b - a);

/* ---------- the effects ---------- */

const EFFECTS = {
  /* Soft blurred blobs at different depths that drift with the mouse. */
  "parallax-blobs": {
    mount(container, { c, speed, density }) {
      const { canvas, ctx, ...box } = makeCanvas(container, c);
      const mouse = trackMouse(canvas);
      const n = Math.round(density);
      const blobs = Array.from({ length: n }, () => ({
        x: Math.random(), y: Math.random(),
        r: rnd(0.18, 0.42), depth: rnd(0.2, 1),
        col: Math.random() < 0.5 ? c.accent : mixHex(c.accent, c.bg, 0.5),
      }));
      let raf, mx = 0.5, my = 0.5;
      const draw = () => {
        mx += (mouse.x - mx) * 0.06;
        my += (mouse.y - my) * 0.06;
        ctx.clearRect(0, 0, box.w, box.h);
        const min = Math.min(box.w, box.h);
        for (const b of blobs) {
          const px = b.x * box.w + (mx - 0.5) * 90 * b.depth * speed;
          const py = b.y * box.h + (my - 0.5) * 90 * b.depth * speed;
          const rad = b.r * min;
          const g = ctx.createRadialGradient(px, py, 0, px, py, rad);
          g.addColorStop(0, hexA(b.col, 0.55));
          g.addColorStop(1, hexA(b.col, 0));
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(px, py, rad, 0, Math.PI * 2);
          ctx.fill();
        }
        raf = requestAnimationFrame(draw);
      };
      draw();
      return () => { cancelAnimationFrame(raf); mouse.remove(); box.stopResize(); };
    },
    code: ({ c, speed, density }) => bgSnippet(
      `a soft blurred-blob "${"parallax"}" background`,
      `const COLORS=['${c.accent}','${mixHex(c.accent, c.bg, 0.5)}'];const BG='${c.bg}';const N=${Math.round(density)};const SPEED=${speed};
const cv=document.getElementById('bg');const ctx=cv.getContext('2d');let W,H;
function size(){W=cv.width=innerWidth;H=cv.height=innerHeight;}addEventListener('resize',size);size();
const blobs=[...Array(N)].map(()=>({x:Math.random(),y:Math.random(),r:0.18+Math.random()*0.24,depth:0.2+Math.random()*0.8,col:COLORS[Math.random()<.5?0:1]}));
let tx=.5,ty=.5,mx=.5,my=.5;addEventListener('mousemove',e=>{tx=e.clientX/innerWidth;ty=e.clientY/innerHeight;});
(function loop(){mx+=(tx-mx)*.06;my+=(ty-my)*.06;ctx.clearRect(0,0,W,H);const min=Math.min(W,H);
for(const b of blobs){const px=b.x*W+(mx-.5)*90*b.depth*SPEED,py=b.y*H+(my-.5)*90*b.depth*SPEED,rad=b.r*min;
const g=ctx.createRadialGradient(px,py,0,px,py,rad);g.addColorStop(0,b.col+'8c');g.addColorStop(1,b.col+'00');
ctx.fillStyle=g;ctx.beginPath();ctx.arc(px,py,rad,0,7);ctx.fill();}requestAnimationFrame(loop);})();`,
      c.bg
    ),
  },

  /* A grid of dots that lean toward / away from the cursor. */
  "parallax-dots": {
    mount(container, { c, speed, density }) {
      const { canvas, ctx, ...box } = makeCanvas(container, c);
      const mouse = trackMouse(canvas);
      const gap = Math.max(14, 60 - density * 0.4);
      let raf, mx = 0.5, my = 0.5;
      const draw = () => {
        mx += (mouse.x - mx) * 0.08;
        my += (mouse.y - my) * 0.08;
        ctx.clearRect(0, 0, box.w, box.h);
        ctx.fillStyle = c.accent;
        const cx = mx * box.w, cy = my * box.h;
        for (let x = gap / 2; x < box.w; x += gap) {
          for (let y = gap / 2; y < box.h; y += gap) {
            const dx = x - cx, dy = y - cy;
            const d = Math.sqrt(dx * dx + dy * dy) || 1;
            const pull = Math.min(18, 1400 / d) * speed;
            const ox = (dx / d) * pull, oy = (dy / d) * pull;
            const r = Math.max(0.6, 2.4 - d / 600);
            ctx.globalAlpha = Math.max(0.15, 0.8 - d / 700);
            ctx.beginPath();
            ctx.arc(x - ox, y - oy, r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
        raf = requestAnimationFrame(draw);
      };
      draw();
      return () => { cancelAnimationFrame(raf); mouse.remove(); box.stopResize(); };
    },
    code: ({ c, speed, density }) => bgSnippet(
      "a dot-grid background that leans toward the cursor",
      `const DOT='${c.accent}';const BG='${c.bg}';const GAP=${Math.round(Math.max(14, 60 - density * 0.4))};const SPEED=${speed};
const cv=document.getElementById('bg');const ctx=cv.getContext('2d');let W,H;
function size(){W=cv.width=innerWidth;H=cv.height=innerHeight;}addEventListener('resize',size);size();
let tx=.5,ty=.5,mx=.5,my=.5;addEventListener('mousemove',e=>{tx=e.clientX/innerWidth;ty=e.clientY/innerHeight;});
(function loop(){mx+=(tx-mx)*.08;my+=(ty-my)*.08;ctx.clearRect(0,0,W,H);ctx.fillStyle=DOT;
const cx=mx*W,cy=my*H;for(let x=GAP/2;x<W;x+=GAP)for(let y=GAP/2;y<H;y+=GAP){const dx=x-cx,dy=y-cy,d=Math.hypot(dx,dy)||1,
pull=Math.min(18,1400/d)*SPEED,r=Math.max(.6,2.4-d/600);ctx.globalAlpha=Math.max(.15,.8-d/700);
ctx.beginPath();ctx.arc(x-dx/d*pull,y-dy/d*pull,r,0,7);ctx.fill();}ctx.globalAlpha=1;requestAnimationFrame(loop);})();`,
      c.bg
    ),
  },

  /* Drifting particles that gently repel from the mouse, with link lines. */
  particles: {
    mount(container, { c, speed, density }) {
      const { canvas, ctx, ...box } = makeCanvas(container, c);
      const mouse = trackMouse(canvas);
      const n = Math.round(density);
      const ps = Array.from({ length: n }, () => ({
        x: Math.random() * box.w, y: Math.random() * box.h,
        vx: rnd(-0.4, 0.4) * speed, vy: rnd(-0.4, 0.4) * speed, r: rnd(1.2, 2.8),
      }));
      let raf;
      const draw = () => {
        ctx.clearRect(0, 0, box.w, box.h);
        const mxp = mouse.x * box.w, myp = mouse.y * box.h;
        for (const p of ps) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > box.w) p.vx *= -1;
          if (p.y < 0 || p.y > box.h) p.vy *= -1;
          const dx = p.x - mxp, dy = p.y - myp, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 70 && d > 0) { p.x += (dx / d) * 1.5; p.y += (dy / d) * 1.5; }
          ctx.fillStyle = hexA(c.accent, 0.9);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        raf = requestAnimationFrame(draw);
      };
      draw();
      return () => { cancelAnimationFrame(raf); mouse.remove(); box.stopResize(); };
    },
    code: ({ c, speed, density }) => bgSnippet(
      "floating particles that dodge the mouse",
      `const DOT='${c.accent}';const BG='${c.bg}';const N=${Math.round(density)};const SPEED=${speed};
const cv=document.getElementById('bg');const ctx=cv.getContext('2d');let W,H;
function size(){W=cv.width=innerWidth;H=cv.height=innerHeight;}addEventListener('resize',size);size();
const R=()=>Math.random();const ps=[...Array(N)].map(()=>({x:R()*W,y:R()*H,vx:(R()-.5)*.8*SPEED,vy:(R()-.5)*.8*SPEED,r:1.2+R()*1.6}));
let mx=-99,my=-99;addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
(function loop(){ctx.clearRect(0,0,W,H);ctx.fillStyle=DOT;for(const p of ps){p.x+=p.vx;p.y+=p.vy;
if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;const dx=p.x-mx,dy=p.y-my,d=Math.hypot(dx,dy);
if(d<70&&d>0){p.x+=dx/d*1.5;p.y+=dy/d*1.5;}ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();}requestAnimationFrame(loop);})();`,
      c.bg
    ),
  },

  /* Soft bubbles floating upward; nudged sideways by the mouse. */
  bubbles: {
    mount(container, { c, speed, density }) {
      const { canvas, ctx, ...box } = makeCanvas(container, c);
      const mouse = trackMouse(canvas);
      const n = Math.round(density);
      const reset = (b) => { b.x = Math.random() * box.w; b.y = box.h + rnd(0, 40); b.r = rnd(4, 16); b.sp = rnd(0.3, 1) * speed; };
      const bs = Array.from({ length: n }, () => { const b = {}; reset(b); b.y = Math.random() * box.h; return b; });
      let raf;
      const draw = () => {
        ctx.clearRect(0, 0, box.w, box.h);
        for (const b of bs) {
          b.y -= b.sp;
          b.x += (mouse.x - 0.5) * 0.6;
          if (b.y + b.r < 0) reset(b);
          ctx.fillStyle = hexA(c.accent, 0.35);
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fill();
        }
        raf = requestAnimationFrame(draw);
      };
      draw();
      return () => { cancelAnimationFrame(raf); mouse.remove(); box.stopResize(); };
    },
    code: ({ c, speed, density }) => bgSnippet(
      "soft bubbles floating upward",
      `const DOT='${c.accent}';const BG='${c.bg}';const N=${Math.round(density)};const SPEED=${speed};
const cv=document.getElementById('bg');const ctx=cv.getContext('2d');let W,H;
function size(){W=cv.width=innerWidth;H=cv.height=innerHeight;}addEventListener('resize',size);size();
const R=(a,b)=>a+Math.random()*(b-a);const rs=b=>{b.x=Math.random()*W;b.y=H+R(0,40);b.r=R(4,16);b.sp=R(.3,1)*SPEED;};
const bs=[...Array(N)].map(()=>{const b={};rs(b);b.y=Math.random()*H;return b;});
let mx=.5;addEventListener('mousemove',e=>{mx=e.clientX/innerWidth;});
(function loop(){ctx.clearRect(0,0,W,H);ctx.fillStyle=DOT+'59';for(const b of bs){b.y-=b.sp;b.x+=(mx-.5)*.6;
if(b.y+b.r<0)rs(b);ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,7);ctx.fill();}requestAnimationFrame(loop);})();`,
      c.bg
    ),
  },

  /* Pure-CSS smoothly shifting multi-color gradient (no mouse needed). */
  gradient: {
    mount(container, { c, speed }) {
      const dur = (16 / speed).toFixed(1);
      const el = document.createElement("div");
      const cols = [c.accent, mixHex(c.accent, c.bg, 0.4), c.surface, mixHex(c.accent, "#ffffff", 0.3)];
      el.style.cssText =
        `width:100%;height:100%;border-radius:inherit;background:linear-gradient(120deg, ${cols.join(", ")});` +
        `background-size:300% 300%;animation:bgmStudio ${dur}s ease infinite;`;
      container.appendChild(el);
      if (!document.getElementById("bgm-kf")) {
        const st = document.createElement("style");
        st.id = "bgm-kf";
        st.textContent = "@keyframes bgmStudio{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}";
        document.head.appendChild(st);
      }
      return () => el.remove();
    },
    code: ({ c, speed }) => {
      const dur = (16 / speed).toFixed(1);
      const cols = [c.accent, mixHex(c.accent, c.bg, 0.4), c.surface, mixHex(c.accent, "#ffffff", 0.3)];
      return `<!-- Animated gradient background (CSS only) -->
<style>
  body { margin: 0; }
  .bg-gradient {
    position: fixed; inset: 0; z-index: -1;
    background: linear-gradient(120deg, ${cols.join(", ")});
    background-size: 300% 300%;
    animation: bgmove ${dur}s ease infinite;
  }
  @keyframes bgmove {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
</style>
<div class="bg-gradient"></div>`;
    },
  },

  /* "Bring your own GIF/video" — static placeholder preview; code uses a URL slot. */
  "byo-gif": {
    mount(container, { c }) {
      const el = document.createElement("div");
      el.style.cssText =
        `width:100%;height:100%;border-radius:inherit;display:flex;align-items:center;justify-content:center;` +
        `text-align:center;color:${c.text};background:` +
        `repeating-linear-gradient(45deg, ${c.surface} 0 14px, ${c.bg} 14px 28px);`;
      el.innerHTML =
        `<div style="font-family:${"system-ui"};font-size:0.9rem;opacity:0.85;">🎞️<br>Your GIF / video here<br>` +
        `<span style="font-size:0.72rem;opacity:0.7;">paste a URL when you copy the code</span></div>`;
      container.appendChild(el);
      return () => el.remove();
    },
    code: ({ c }) => `<!-- Full-page GIF / video background. Replace the URL below. -->
<style>
  body { margin: 0; }
  .bg-media {
    position: fixed; inset: 0; z-index: -1;
    background: ${c.bg} url('YOUR_GIF_OR_IMAGE_URL') center / cover no-repeat;
  }
  /* Optional dark overlay so text stays readable */
  .bg-media::after { content:''; position:absolute; inset:0; background: rgba(0,0,0,0.25); }
</style>
<div class="bg-media"></div>

<!-- For an MP4/WebM video instead of a GIF, use this in place of .bg-media:
<video autoplay muted loop playsinline
  style="position:fixed;inset:0;width:100%;height:100%;object-fit:cover;z-index:-1;">
  <source src="YOUR_VIDEO_URL.mp4" type="video/mp4">
</video> -->`,
  },
};

/* ---------- small color utils (match studio.js style) ---------- */

function mixHex(a, b, t) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const ch = (i) => Math.round(pa[i] + (pb[i] - pa[i]) * t).toString(16).padStart(2, "0");
  return "#" + ch(0) + ch(1) + ch(2);
}
// hex + alpha (0..1) -> #rrggbbaa
function hexA(hex, a) {
  return hex + Math.round(a * 255).toString(16).padStart(2, "0");
}

// Wrap a canvas-based effect body into a standalone, paste-ready HTML snippet.
function bgSnippet(desc, scriptBody, bg) {
  return `<!-- ${desc} -->
<style>
  body { margin: 0; background: ${bg}; }
  #bg { position: fixed; inset: 0; z-index: -1; display: block; }
</style>
<canvas id="bg"></canvas>
<script>
${scriptBody}
<\/script>`;
}

/* ---------- builders handed to the shared Studio engine ---------- */

const BACKGROUND_BUILDERS = {
  hide: ["font", "shape"],
  codeLabel: "Code (HTML + CSS + JS)",
  extraControls: [
    { key: "speed", label: "Speed", min: 0.3, max: 2, step: 0.1, default: 1 },
    { key: "density", label: "Amount", min: 10, max: 90, step: 2, default: 42 },
  ],
  mountPreview: (item, s) => null, // replaced below (needs the container arg)
  buildPrompt: (item, s, notes) => {
    let p =
      `Add a full-page animated background: ${item.vibe}. ` +
      (item.type === "byo-gif"
        ? `Use a GIF or short video as a fixed, full-screen cover background (I'll provide the URL), with a subtle dark overlay so foreground text stays readable.`
        : `Base background ${s.c.bg} with the effect drawn in ${s.c.accent} (${s.mode} mode). ` +
          `Roughly ${Math.round(s.density)} elements, animation speed ${s.speed}×. ` +
          (item.type === "gradient" ? `It should slowly shift on its own (no mouse needed).` : `It should react subtly to mouse movement.`) +
          ` Render it on a fixed full-screen <canvas> behind the page content (z-index below everything), and keep it lightweight.`);
    if (notes && notes.trim()) p += ` Extra notes: ${notes.trim()}`;
    return p;
  },
  buildCSS: (item, s) => EFFECTS[item.type].code(s),
};

// Studio calls mountPreview(container, item, resolved); wire it to the effect.
BACKGROUND_BUILDERS.mountPreview = (container, item, s) => EFFECTS[item.type].mount(container, s);

/* ---------- render the gallery grid (each card runs a live effect) ---------- */

function renderBackgroundGrid() {
  const grid = document.getElementById("grid");
  const cleanups = [];
  grid.innerHTML = BACKGROUNDS.map((b) => {
    const c = b.colors;
    const dots = ["bg", "surface", "text", "muted", "accent"]
      .map((k) => `<span class="swatch-dot" style="background:${c[k]};"></span>`)
      .join("");
    return `
      <article class="card bg-card" data-id="${b.id}">
        <div class="mini bg-mini" id="mini-${b.id}"></div>
        <div class="card-foot">
          <span class="card-name" style="font-family:${b.font};">${b.name}</span>
          <span class="swatch-row">${dots}</span>
        </div>
      </article>`;
  }).join("");

  // Mount a (lower-density) live effect inside each card.
  BACKGROUNDS.forEach((b) => {
    const cont = document.getElementById("mini-" + b.id);
    const opts = { c: b.colors, speed: 1, density: Math.min(28, 42), mode: "dark" };
    cleanups.push(EFFECTS[b.type].mount(cont, opts));
  });

  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const b = BACKGROUNDS.find((x) => x.id === card.dataset.id);
    if (b) Studio.open(b, BACKGROUND_BUILDERS);
  });
}

renderBackgroundGrid();

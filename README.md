# Mimi's UI Studio

A personal design-style library. Browse color themes you like, tweak them, then
copy a ready-made **prompt** (to paste to Claude Code) or the matching **CSS code**.

## Running it

Just open the page in a browser — no build step, no server:

```
open index.html
```

Or visit the live GitHub Pages URL.

## How it works

- Each theme is a small data entry in [`themes.js`](themes.js) — name, colors,
  font, vibe, corner roundness.
- Click a theme to open the detail panel. Change the accent color, font, corner
  style, or light/dark mode, and add free-text notes. The live preview, the
  prompt, and the CSS all update instantly.
- **Copy prompt** / **Copy code** put the text on your clipboard.

## Adding a new theme

Append one object to the `THEMES` array in [`themes.js`](themes.js):

```js
{
  id: "my-theme",
  name: "My Theme",
  vibe: "calm, modern",
  colors: { bg, surface, text, muted, accent },
  font: "'Inter', system-ui, sans-serif",
  radius: "12px",
}
```

Later you can add other categories (buttons, templates, fonts) by giving objects
a `category` field and adding a filter.

## Files

- `index.html` — page shell, theme grid, detail panel
- `styles.css` — the studio's own UI styling
- `themes.js` — the theme data (single source of truth)
- `app.js` — rendering, customization, prompt/CSS generators, copy buttons
- `sw.js` — network-first service worker (auto-updates, no manual cache-clearing)

# Mimi's UI Studio

A personal design-style library. Browse layouts and buttons you like, tweak them,
then copy a ready-made **prompt** (to paste to Claude Code) or the matching **CSS code**.

## Running it

No build step, no server:

```
open index.html
```

Or visit the live GitHub Pages URL.

## Two pages

- **Templates** (`index.html`) — 8 genuinely different page layouts: hero,
  pricing card, profile card, login form, dashboard stats, product showcase,
  testimonial, blog post. Each has its own palette.
- **Buttons** (`buttons.html`) — 8 kinds of button: solid, outline, icon-only,
  icon + label, image/avatar, on/off switch, true/false segmented, and a
  floating action button.

Switch between them with the **Templates / Buttons** nav pill.

## How it works

1. Click any card to open the detail panel.
2. Customize the **accent color, font, shape** (rounded / pill / sharp) and
   **light/dark mode**, plus add free-text **notes**. The live preview updates
   instantly.
3. Press **Save** to update the **prompt** and **CSS** (with `#hex` colors) to
   match your changes — or **Cancel** to revert.
4. **Copy prompt** / **Copy code** put the text on your clipboard.

## Adding more

- A template = one object in [`templates.js`](templates.js) with a `layout` that
  `renderLayout()` knows how to draw.
- A button = one object in [`buttons.js`](buttons.js) with a `kind` that
  `renderButton()` / `buttonCSS()` know how to draw.

## Files

- `index.html` / `buttons.html` — the two pages (grid + nav)
- `styles.css` — the studio's own UI styling
- `studio.js` — shared detail-panel engine (controls, Save/Cancel, copy)
- `templates.js` — template data, layout renderers, prompt/CSS builders
- `buttons.js` — button data, button renderers, prompt/CSS builders
- `sw.js` — network-first service worker (auto-updates, no manual cache-clearing)

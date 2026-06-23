# Mimi's UI Studio

A personal design-style library. Browse layouts and buttons you like, tweak them,
then copy a ready-made **prompt** (to paste to Claude Code) or the matching **CSS code**.

## Running it

No build step, no server:

```
open index.html
```

Or visit the live GitHub Pages URL.

## Three pages

- **Templates** (`index.html`) — 8 genuinely different page layouts: hero,
  pricing card, profile card, login form, dashboard stats, product showcase,
  testimonial, blog post. Each has its own palette.
- **Buttons** (`buttons.html`) — 8 kinds of button: solid, outline, icon-only,
  icon + label, image/avatar, on/off switch, true/false segmented, and a
  floating action button.
- **Backgrounds** (`backgrounds.html`) — 6 animated / interactive backgrounds:
  parallax blobs, parallax dot grid, floating particles, bubble rise, animated
  gradient, and a "bring your own GIF/video" slot. These react to the mouse, so
  the copied output is a self-contained **HTML + CSS + JS** snippet.

Switch between them with the **Templates / Buttons / Backgrounds** nav pill.

## How it works

1. Click any card to open the detail panel.
2. Customize the **accent color, font, shape** (rounded / pill / sharp) and
   **light/dark mode**, plus add free-text **notes**. Backgrounds swap the
   font/shape controls for **Speed** and **Amount** sliders. The live preview
   updates instantly.
3. Press **Save** to update the **prompt** and **CSS** (with `#hex` colors) to
   match your changes — or **Cancel** to revert.
4. **Copy prompt** / **Copy code** put the text on your clipboard.

## Adding more

- A template = one object in [`templates.js`](templates.js) with a `layout` that
  `renderLayout()` knows how to draw.
- A button = one object in [`buttons.js`](buttons.js) with a `kind` that
  `renderButton()` / `buttonCSS()` know how to draw.
- A background = one object in [`backgrounds.js`](backgrounds.js) with a `type`
  that has an `EFFECTS[type]` entry providing `mount()` (live) + `code()` (copy).

## Files

- `index.html` / `buttons.html` / `backgrounds.html` — the three pages (grid + nav)
- `styles.css` — the studio's own UI styling
- `studio.js` — shared detail-panel engine (controls, Save/Cancel, copy, animated
  preview lifecycle, optional slider controls)
- `templates.js` — template data, layout renderers, prompt/CSS builders
- `buttons.js` — button data, button renderers, prompt/CSS builders
- `backgrounds.js` — background data, animated effects (mount + code), builders
- `sw.js` — network-first service worker (auto-updates, no manual cache-clearing)

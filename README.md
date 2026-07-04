# Moving Poster

Turn a static poster PNG into a moving poster by layering subtle animated effects on top of the original artwork. The poster image is never redesigned — it stays fixed as the full-screen background.

## Quick start

1. Replace `assets/poster.png` with your poster image (keep the same filename).
2. Open `index.html` in a browser, or serve the folder locally:

```bash
python3 -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080).

## How it works

- **Background layer** — your original `assets/poster.png`, displayed full-screen with `background-size: contain` so the full composition is preserved (letterboxed on wider/narrower viewports).
- **Overlay layers only** — all motion comes from transparent effects stacked above the poster:
  - Ambient glow orbs (soft light drift)
  - Diagonal light sweep
  - Floating particle sparkles (canvas)
  - Film grain texture
  - Subtle vignette pulse
  - Horizontal shimmer band

No typography, colours, or layout from the poster are recreated in code.

## Customisation

Edit `css/styles.css` to tune overlay opacity, speed, or disable individual layers. Edit `js/overlays.js` to change particle density and motion.

Animations respect `prefers-reduced-motion: reduce`.

## File structure

```
index.html          Main page
css/styles.css      Poster background + overlay animations
js/overlays.js      Particle canvas animation
assets/poster.png   Your static poster (replace this file)
```

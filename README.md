# Moving Poster

A static graphic poster that quietly comes alive. Your original PNG stays fixed as the full-screen background — all motion comes from transparent overlay layers only.

## Quick start

1. Place your poster image at `assets/poster.png` (1080 × 1920 recommended).
2. Open `index.html` in a browser, or serve locally:

```bash
python3 -m http.server 8080
```

Then visit [http://localhost:8080](http://localhost:8080).

## What animates

| Element | Behaviour |
|---------|-----------|
| Red walking figure (top-right) | Slow walk along the squiggly path, with subtle bob and wobble |
| Seated figure (bottom-left) | Static — part of the poster, not animated |
| Black dot cluster (centre) | Dots drift outward, fade, and reappear organically |
| Small red dots | Travel gently along existing paths, looping |
| Texture | Minimal pixel grain, scanlines, and occasional flicker |

## File structure

```
index.html              Page structure
css/styles.css          Poster background + overlay styles
js/poster-layout.js     Poster-to-screen coordinate mapping
js/config.js            Path coordinates and tuning values
js/overlays.js          Walker, cluster, and path-dot animations
assets/poster.png       Your static poster
assets/walker-frame-*.png  Walk-cycle sprite frames
```

## Tuning

Edit `js/config.js` to adjust path coordinates, speeds, and overlay regions if your poster dimensions differ from 1080 × 1920.

Animations respect `prefers-reduced-motion: reduce`.

# Ng Hang Game Artist Portfolio

A cinematic, artwork-first portfolio website built from the Figma frame `porrtfolio` in `Portfolio Copy`.

## Visual Direction

The site extends the Figma identity into a live web experience: midnight constellation fields, electric-blue glow, handmade character art, game-menu plaques, and large cinematic artwork reveals. The interaction system stays restrained: cursor light, magnetic buttons, scroll reveals, card depth, and a keyboard-accessible lightbox.

## Tech

- HTML5
- Tailwind CSS
- Custom CSS
- Vanilla JavaScript modules
- Python's built-in `http.server` for local static serving
- Playwright Core for local Edge-based visual/smoke checks

## Commands

```bash
npm install
npm run dev
npm run build
npm run capture
npm run smoke
```

The dev server runs at `http://127.0.0.1:5173/`.

## QA

`npm run capture` writes screenshots for desktop, tablet, and mobile widths to `screenshots/`.

`npm run smoke` checks:

- Console errors
- Horizontal overflow at 1440, 1280, 1024, 768, 430, 390, and 360 widths
- Mobile menu open/close behavior
- Lightbox open and Escape close behavior
- Reduced-motion rendering

## Notes

The original Figma file had no variables or subscribed libraries, so color, typography, spacing, and effects were inferred from the inspected frame and exported assets. The heavy constellation background was optimized into `constellations-bg.jpg` from the original Figma raster to keep the page lighter while preserving the visual motif.

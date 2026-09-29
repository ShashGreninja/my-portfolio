# Shaswat Suman · Portfolio

Personal portfolio site, live at **https://shashgreninja.github.io/my-portfolio/**.

Built with **Vite + TypeScript**, animated with **GSAP** (ScrollTrigger) and **Lenis** smooth scrolling. No UI framework:
the page is static HTML, and each interactive piece is a small typed module.

## Highlights

- **Hero canvas.** A nested data tree that flattens into a bar chart as you scroll, a nod to the Highcharts
  flattening engine I built at Goldman Sachs. The chart measures the hero copy and name so it only ever
  draws in free space.
- **Kinetic type.** The name is fitted edge to edge at any width, and letters thin out near the pointer.
- **Pinned horizontal gallery** for projects on desktop, stacked cards on narrow screens.
- Custom cursor, magnetic buttons, a scroll-velocity marquee, and scroll-linked reveals.
- Respects `prefers-reduced-motion`: animation loops, smooth scroll and reveals switch off.

## Structure

```
index.html              page markup and content
public/                 static assets (favicon)
src/
  main.ts               wires the features together
  lib/dom.ts            typed query helpers, media-query flags
  features/
    flowCanvas.ts       hero tree → chart canvas
    heroName.ts         letter splitting, fitting, pointer weight
    fitText.ts          fit a line of text to its container width
    animations.ts       GSAP intro, scroll reveals, pinned gallery
    smoothScroll.ts     Lenis + ScrollTrigger sync, in-page links
    nav.ts              tone-matching, auto-hiding nav, progress bar
    cursor.ts           custom cursor, magnetic elements
    marquee.ts          velocity-aware marquee
    roleRotator.ts      rotating hero phrase
    clock.ts            local time (IST)
    copyEmail.ts        copy-to-clipboard with fallback
  styles/               base tokens, then one stylesheet per area
.github/workflows/      build and deploy to GitHub Pages
```

## Develop

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check and build to dist/
npm run preview    # serve the production build
```

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub Pages.
The Vite `base` is `/my-portfolio/` to match the Pages URL.

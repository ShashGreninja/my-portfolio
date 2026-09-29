# Shaswat Suman · Portfolio

Personal portfolio site: kinetic display type, an interactive canvas hero (a nested data
tree that flattens into a bar chart), smooth scrolling, a custom cursor and a pinned
horizontal project gallery.

A single static `index.html`. GSAP, ScrollTrigger and Lenis load from CDNs; fonts from Google Fonts.
The page still works if a CDN fails, just without the scroll animations.

## Run locally

```powershell
python -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

Works as-is on GitHub Pages (Settings → Pages → deploy from `main`, root), Netlify or Vercel.

## Editing content

All content is in `index.html`. The rotating hero phrases are the `roles` array in the script.

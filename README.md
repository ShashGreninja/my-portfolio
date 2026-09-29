# Shaswat Suman · Portfolio

Personal portfolio site, styled as an electronics component datasheet (part `SS-2301EC26`).
The hero is an interactive DIP-16 pinout where each pin maps to a skill.

A single static `index.html`: no build step, no dependencies beyond Google Fonts.

## Run locally

Open `index.html` in a browser, or serve the folder:

```powershell
python -m http.server 8000
```

## Deploy

Works as-is on GitHub Pages (Settings → Pages → deploy from `main`, root), Netlify or Vercel.

## Editing content

All content is in `index.html`. The pinout's pin labels and descriptions are the
`left` / `right` arrays in the script at the bottom of the file.

import { defineConfig } from "vite";

// Vercel serves the site from its domain root; GitHub Pages serves it from /my-portfolio/.
// Vercel sets VERCEL=1 during its builds.
const base = process.env.VERCEL ? "/" : "/my-portfolio/";

export default defineConfig({
  base,
  build: {
    target: "es2022",
  },
});

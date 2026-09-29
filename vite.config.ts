import { defineConfig } from "vite";

// GitHub Pages serves this project site from /my-portfolio/.
export default defineConfig({
  base: "/my-portfolio/",
  build: {
    target: "es2022",
  },
});

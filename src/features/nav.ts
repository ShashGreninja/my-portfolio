import { $$ } from "../lib/dom";

/**
 * Fixed nav that matches the tone of the section under it, gains a blurred backdrop once
 * the page scrolls, hides while scrolling down and returns on scroll up. Also drives the progress bar.
 */
export function initNav(nav: HTMLElement, progress: HTMLElement): void {
  const toneSections = $$("[data-nav]");
  const probe = 30;
  let lastY = window.scrollY;

  const update = (): void => {
    const y = window.scrollY;
    const under = toneSections.find((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= probe && r.bottom > probe;
    });
    nav.dataset.tone = under?.dataset.nav ?? "dark";
    nav.classList.toggle("scrolled", y > 10);
    if (Math.abs(y - lastY) > 4) {
      nav.classList.toggle("hidden", y > lastY && y > 160);
      lastY = y;
    }

    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
}

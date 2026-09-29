import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $$ } from "../lib/dom";

/**
 * Lenis smooth scrolling on GSAP's ticker so ScrollTrigger stays in sync.
 * In-page links (`a[data-scroll]`) scroll smoothly either way.
 */
export function initSmoothScroll(enabled: boolean): Lenis | null {
  let lenis: Lenis | null = null;

  if (enabled) {
    const instance = new Lenis({ lerp: 0.09, smoothWheel: true });
    instance.on("scroll", () => ScrollTrigger.update());
    gsap.ticker.add((time) => instance.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis = instance;
  }

  for (const link of $$<HTMLAnchorElement>("a[data-scroll]")) {
    link.addEventListener("click", (e) => {
      const target = link.hash ? document.querySelector<HTMLElement>(link.hash) : null;
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { duration: 1.6 });
      else target.scrollIntoView({ behavior: enabled ? "smooth" : "auto" });
    });
  }

  return lenis;
}

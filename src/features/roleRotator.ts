import { gsap } from "gsap";

/** Cycles `el` through `phrases`, sliding each one out upwards and the next in from below. */
export function startRoleRotator(el: HTMLElement, phrases: readonly string[], intervalMs = 2600): void {
  let index = 0;
  window.setInterval(() => {
    index = (index + 1) % phrases.length;
    gsap.to(el, {
      yPercent: -110,
      duration: 0.45,
      ease: "power3.in",
      onComplete: () => {
        el.textContent = phrases[index] ?? "";
        gsap.fromTo(el, { yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: "expo.out" });
      },
    });
  }, intervalMs);
}

import { $, $$ } from "../lib/dom";
import { fitToWidth } from "./fitText";

interface Point {
  x: number;
  y: number;
}

/** The giant hero name: split into letters, fitted edge to edge, with letters thinning near the pointer. */
export class HeroName {
  readonly chars: HTMLSpanElement[] = [];
  private readonly el: HTMLElement;
  private centers: Point[] = [];

  constructor(el: HTMLElement) {
    this.el = el;
    for (const line of $$("[data-split]", el)) {
      const text = line.textContent?.trim() ?? "";
      line.textContent = "";
      for (const letter of text) {
        const span = document.createElement("span");
        span.className = "ch";
        span.textContent = letter;
        span.setAttribute("aria-hidden", "true");
        line.append(span);
        this.chars.push(span);
      }
    }
  }

  /** Sizes the name so its first line fills the hero width. */
  fit(): void {
    fitToWidth(this.el, $(".line", this.el), { fill: 0.995, min: 40 });
    this.measure();
  }

  /** Caches each letter's page-space centre for the pointer effect. */
  measure(): void {
    this.centers = this.chars.map((c) => {
      const r = c.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 + window.scrollY };
    });
  }

  enablePointerWeight(area: HTMLElement, radius = 320): void {
    area.addEventListener("mousemove", (e) => {
      const pointerY = e.clientY + window.scrollY;
      this.chars.forEach((c, i) => {
        const centre = this.centers[i];
        if (!centre) return;
        const distance = Math.hypot(centre.x - e.clientX, centre.y - pointerY);
        c.style.fontWeight = String(Math.round(180 + 620 * Math.min(1, distance / radius)));
      });
    });
    area.addEventListener("mouseleave", () => {
      for (const c of this.chars) c.style.fontWeight = "";
    });
  }
}

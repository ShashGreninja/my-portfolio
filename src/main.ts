import "./styles/base.css";
import "./styles/nav.css";
import "./styles/hero.css";
import "./styles/sections.css";
import "./styles/work.css";
import "./styles/contact.css";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { $, $$, hasFinePointer, prefersReducedMotion } from "./lib/dom";
import { playIntro, initScrollAnimations } from "./features/animations";
import { startClock } from "./features/clock";
import { initCopyEmail } from "./features/copyEmail";
import { initCursor, initMagnetic } from "./features/cursor";
import { fitToWidth } from "./features/fitText";
import { FlowCanvas } from "./features/flowCanvas";
import { HeroName } from "./features/heroName";
import { startMarquee } from "./features/marquee";
import { initNav } from "./features/nav";
import { startRoleRotator } from "./features/roleRotator";
import { initSmoothScroll } from "./features/smoothScroll";

gsap.registerPlugin(ScrollTrigger);

const ROLES = ["full-stack products", "data pipelines", "LLM tooling", "recommender systems", "developer tools"] as const;
const motion = !prefersReducedMotion;

const hero = $("#top");
const heroName = new HeroName($("#name"));
const contactHeadline = $("#big-talk");

function fitHeadlines(): void {
  heroName.fit();
  // the contact headline's longest line must never run past the gutter
  fitToWidth(contactHeadline, $(".o", contactHeadline), { fill: 0.97, max: 200 });
}

fitHeadlines();

const flow = new FlowCanvas({
  canvas: $<HTMLCanvasElement>("#flow"),
  hero,
  name: $("#name"),
  copy: $(".hero-mid"),
  animate: motion,
});
flow.start();

startClock($$("[data-clock]"));
initNav($("#nav"), $("#progress"));
initSmoothScroll(motion);
initCopyEmail($("#copy"), $("#copy-label"), $("#email"));

if (hasFinePointer) {
  initCursor($("#cursor"), $("#cursor-label"));
  if (motion) {
    initMagnetic($$(".magnetic"));
    heroName.enablePointerWeight(hero);
  }
}

if (motion) {
  startRoleRotator($("#rot"), ROLES);
  startMarquee($("#mq"));
}

let resizeTimer: number | undefined;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    fitHeadlines();
    flow.resize();
    ScrollTrigger.refresh();
  }, 150);
});

// Final measurements and the choreography wait for the web fonts, since they change every text width.
void document.fonts.ready.then(() => {
  fitHeadlines();
  flow.resize();
  if (!motion) return;
  playIntro(heroName.chars);
  initScrollAnimations();
  ScrollTrigger.addEventListener("refresh", () => heroName.measure());
});

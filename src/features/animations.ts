import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { $, $$ } from "../lib/dom";

/** Hero entrance: letters rise into place, then the copy, nav and canvas fade in. */
export function playIntro(nameChars: HTMLElement[]): void {
  gsap.timeline({ defaults: { ease: "expo.out" } })
    .from(nameChars, { yPercent: 115, duration: 1.4, stagger: 0.045 })
    .from(".hero-copy > *, .hero-foot > *", { y: 24, opacity: 0, duration: 1, stagger: 0.07 }, 0.35)
    .from(".nav > *", { y: -20, opacity: 0, duration: 1, stagger: 0.06 }, 0.5)
    .from("#flow", { opacity: 0, duration: 2, ease: "power2.out" }, 0);
}

/** Wraps every word in `root` (including inside child spans) in `span.w`. */
function splitWords(root: HTMLElement): HTMLElement[] {
  const walk = (node: Node): void => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();
        for (const part of (child.textContent ?? "").split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            fragment.append(part);
          } else {
            const word = document.createElement("span");
            word.className = "w";
            word.textContent = part;
            fragment.append(word);
          }
        }
        child.replaceWith(fragment);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child);
      }
    }
  };
  walk(root);
  return $$(".w", root);
}

function countUp(el: HTMLElement): void {
  const target = Number(el.dataset.count);
  const state = { value: 0 };
  gsap.to(state, {
    value: target,
    duration: 1.8,
    ease: "power3.out",
    scrollTrigger: { trigger: el, start: "top 90%", once: true },
    onUpdate: () => { el.textContent = Math.round(state.value).toLocaleString("en-IN"); },
  });
}

/** Scroll-linked reveals for everything below the hero. */
export function initScrollAnimations(): void {
  gsap.to(".name", {
    yPercent: 18,
    ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });

  const statement = $("#statement");
  gsap.fromTo(splitWords(statement), { opacity: 0.14 }, {
    opacity: 1,
    stagger: 0.1,
    ease: "none",
    scrollTrigger: { trigger: statement, start: "top 80%", end: "bottom 45%", scrub: true },
  });

  for (const title of $$(".sec-title, .sub-head h3, .exp-company")) {
    gsap.from(title, { yPercent: 40, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: title, start: "top 88%" } });
  }

  $$("[data-count]").forEach(countUp);

  gsap.from(".big-5 .num", {
    scale: 0.6, opacity: 0, transformOrigin: "left bottom", duration: 1.4, ease: "expo.out",
    scrollTrigger: { trigger: ".big-5", start: "top 85%" },
  });

  for (const block of $$(".stat, .iit, .exp-item, .row, .srow")) {
    gsap.from(block, { y: 50, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: block, start: "top 92%" } });
  }

  gsap.from(".big-talk .reveal-line > span", {
    yPercent: 110, duration: 1.3, stagger: 0.12, ease: "expo.out",
    scrollTrigger: { trigger: ".big-talk", start: "top 85%" },
  });

  initGallery();
}

/** Desktop: pin the work section and scroll the project track sideways. Narrow screens: stacked cards that rise in. */
function initGallery(): void {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 1000px)", () => {
    const track = $("#htrack");
    const frame = $("#hwrap");
    const distance = (): number => track.scrollWidth - frame.clientWidth;

    const slide = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: frame,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    for (const heading of $$(".panel h3")) {
      gsap.from(heading, {
        xPercent: 25, opacity: 0, ease: "none",
        scrollTrigger: { trigger: heading.closest(".panel"), containerAnimation: slide, start: "left 95%", end: "left 45%", scrub: true },
      });
    }
  });

  mm.add("(max-width: 999px)", () => {
    for (const panel of $$(".panel")) {
      gsap.from(panel, { y: 60, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: panel, start: "top 90%" } });
    }
  });

  ScrollTrigger.refresh();
}

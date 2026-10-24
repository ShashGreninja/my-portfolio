import { gsap } from "gsap";
import { $, prefersReducedMotion } from "../lib/dom";
import type { FlowCanvas } from "./flowCanvas";
import { showToast } from "./toast";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const REPO = "https://github.com/ShashGreninja/my-portfolio";

interface EggOptions {
  hero: HTMLElement;
  nameChars: HTMLElement[];
  flow: FlowCanvas;
  scrollTo: (target: HTMLElement) => void;
}

/** Small surprises for people who poke around. None of them get in the way of reading the page. */
export function initEasterEggs({ hero, nameChars, flow, scrollTo }: EggOptions): void {
  greetDevelopers();
  missYouTitle();
  clickToFlatten(hero, flow);
  pokeableLetters(nameChars);
  listenForKeys(() => hireMe(scrollTo));
}

/** A note for anyone who opens DevTools. */
function greetDevelopers(): void {
  console.log(
    "%cHey, you opened the console.%c\nRecruiters rarely do, so I'll assume you're an engineer. Hi!\n" +
      `The source is at ${REPO}\nTry the Konami code on the page. ↑↑↓↓←→←→ B A`,
    "font: 800 18px/1.4 sans-serif; color: #2230F5;",
    "font: 13px/1.6 monospace; color: inherit;",
  );
}

/** The tab title asks you to come back. */
function missYouTitle(): void {
  const original = document.title;
  document.addEventListener("visibilitychange", () => {
    document.title = document.hidden ? "Still flattening data in here…" : original;
  });
}

/** Clicking empty hero space flattens the data tree into a chart, and back. */
function clickToFlatten(hero: HTMLElement, flow: FlowCanvas): void {
  let first = true;
  hero.addEventListener("click", (e) => {
    if ((e.target as Element).closest("a, button, .ch")) return;
    const flat = flow.toggleFlatten();
    if (first) {
      showToast(flat
        ? "Flattened. That's the core of my <b>Goldman Sachs</b> project in one click."
        : "Back to a tree. Click again to flatten it.");
      first = false;
    }
  });
}

/** Hero letters hop when clicked. Find all of them for a message. */
function pokeableLetters(chars: HTMLElement[]): void {
  const poked = new Set<HTMLElement>();
  for (const ch of chars) {
    ch.style.pointerEvents = "auto";
    ch.addEventListener("click", () => {
      if (!prefersReducedMotion) {
        gsap.timeline()
          .to(ch, { yPercent: -28, rotation: gsap.utils.random([-14, -8, 8, 14]), duration: 0.22, ease: "power2.out" })
          .to(ch, { yPercent: 0, rotation: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
      }
      ch.classList.add("poked");
      poked.add(ch);
      if (poked.size === chars.length) {
        showToast(`You poked all <b>${chars.length}</b> letters. That kind of thoroughness is what I bring to code reviews.`, 5200);
        window.setTimeout(() => {
          for (const c of chars) c.classList.remove("poked");
          poked.clear();
        }, 1600);
      }
    });
  }
}

/** Konami code toggles dev mode; typing "hire" anywhere points you at the contact section. */
function listenForKeys(onHire: () => void): void {
  let konamiStep = 0;
  let typed = "";

  window.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

    konamiStep = key === KONAMI[konamiStep] ? konamiStep + 1 : key === KONAMI[0] ? 1 : 0;
    if (konamiStep === KONAMI.length) {
      konamiStep = 0;
      toggleDevMode();
    }
    if (key === "Escape" && document.documentElement.classList.contains("dev-mode")) toggleDevMode();

    if (/^[a-z]$/.test(key)) {
      typed = (typed + key).slice(-8);
      if (typed.endsWith("hire")) {
        typed = "";
        onHire();
      }
    }
  });
}

function toggleDevMode(): void {
  const root = document.documentElement;
  const on = root.classList.toggle("dev-mode");
  document.querySelector(".dev-badge")?.remove();
  if (!on) {
    showToast("Dev mode off. Back to the polished version.");
    return;
  }
  const badge = document.createElement("div");
  badge.className = "dev-badge";
  badge.textContent = `Dev mode: ${document.querySelectorAll("main *").length} elements outlined on an 8px grid. Esc to exit.`;
  document.body.append(badge);
  showToast("Konami code accepted. Here's the <b>layout under the hood</b>.");
}

function hireMe(scrollTo: (target: HTMLElement) => void): void {
  const cta = $(".nav-cta");
  cta.textContent = "Yes, let's talk";
  showToast("You typed <b>hire</b>. Bold move. My email is one click away.", 4200);
  scrollTo($("#contact"));
  if (!prefersReducedMotion) {
    gsap.fromTo("#copy", { scale: 1 }, { scale: 1.12, duration: 0.35, yoyo: true, repeat: 3, ease: "power2.inOut", delay: 1.2 });
  }
}

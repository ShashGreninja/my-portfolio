import { $$ } from "../lib/dom";

/**
 * Custom cursor: a small dot that trails the pointer, grows into a labelled disc over
 * `[data-cursor]` elements and gets out of the way over other links and buttons.
 */
export function initCursor(cursor: HTMLElement, label: HTMLElement): void {
  document.documentElement.classList.add("has-cursor");

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let x = targetX;
  let y = targetY;

  window.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  const follow = (): void => {
    x += (targetX - x) * 0.2;
    y += (targetY - y) * 0.2;
    cursor.style.transform = `translate3d(${x}px,${y}px,0)`;
    requestAnimationFrame(follow);
  };
  requestAnimationFrame(follow);

  for (const el of $$("[data-cursor]")) {
    el.addEventListener("mouseenter", () => {
      label.textContent = el.dataset.cursor ?? "";
      cursor.classList.add("big");
    });
    el.addEventListener("mouseleave", () => cursor.classList.remove("big"));
  }

  for (const el of $$("a:not([data-cursor]), button:not([data-cursor])")) {
    el.addEventListener("mouseenter", () => cursor.classList.add("hide"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hide"));
  }
}

/** Elements drift toward the pointer while hovered and spring back on leave. */
export function initMagnetic(elements: HTMLElement[], strength = 0.3): void {
  for (const el of elements) {
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * strength;
      const dy = (e.clientY - r.top - r.height / 2) * strength;
      el.style.transform = `translate(${dx}px,${dy}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transition = "transform .6s cubic-bezier(.19,1,.22,1)";
      el.style.transform = "";
      window.setTimeout(() => { el.style.transition = ""; }, 600);
    });
  }
}

import { $$ } from "../lib/dom";

/** Hovering or focusing a tool in the stack says where it was used. */
export function initStackHints(hint: HTMLElement): void {
  const idle = hint.textContent ?? "";

  const show = (tool: HTMLElement): void => {
    const name = tool.textContent ?? "";
    const used = tool.dataset.used ?? "Part of my everyday toolkit. Ask me about it.";
    hint.innerHTML = `<b>${name}</b>: ${used}`;
    hint.classList.add("on");
  };
  const reset = (): void => {
    hint.textContent = idle;
    hint.classList.remove("on");
  };

  for (const tool of $$(".srow li")) {
    tool.addEventListener("mouseenter", () => show(tool));
    tool.addEventListener("focus", () => show(tool));
    tool.addEventListener("click", () => show(tool));
    tool.addEventListener("mouseleave", reset);
    tool.addEventListener("blur", reset);
  }
}

/** A soft light follows the pointer across each project panel. */
export function initPanelSpotlight(): void {
  for (const panel of $$(".panel")) {
    panel.addEventListener("pointermove", (e) => {
      const r = panel.getBoundingClientRect();
      panel.style.setProperty("--mx", `${e.clientX - r.left}px`);
      panel.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  }
}

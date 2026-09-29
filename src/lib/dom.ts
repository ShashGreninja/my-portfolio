/** Returns the first element matching `selector`, or throws so a missing hook fails loudly. */
export function $<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T {
  const el = root.querySelector<T>(selector);
  if (!el) throw new Error(`Missing element: ${selector}`);
  return el;
}

export function $$<T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T[] {
  return Array.from(root.querySelectorAll<T>(selector));
}

/** Width available to children: clientWidth minus horizontal padding. */
export function contentWidth(el: HTMLElement): number {
  const cs = getComputedStyle(el);
  return el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
}

export const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

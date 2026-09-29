import { contentWidth } from "../lib/dom";

interface FitOptions {
  /** Fraction of the available width the measured line should fill. */
  fill?: number;
  min?: number;
  max?: number;
}

/**
 * Sets `el`'s font-size so that `measure` (one line inside it) spans the content width of `el`'s parent.
 * Measures at 100px and scales linearly, which holds because the text has no wrapping.
 */
export function fitToWidth(el: HTMLElement, measure: HTMLElement, { fill = 1, min = 0, max = Infinity }: FitOptions = {}): void {
  const parent = el.parentElement;
  if (!parent) return;

  el.style.fontSize = "100px";
  const previousDisplay = measure.style.display;
  measure.style.display = "inline-block";
  const width = measure.getBoundingClientRect().width;
  measure.style.display = previousDisplay;
  if (width === 0) return;

  const size = (100 * contentWidth(parent) * fill) / width;
  el.style.fontSize = `${Math.min(max, Math.max(min, size))}px`;
}

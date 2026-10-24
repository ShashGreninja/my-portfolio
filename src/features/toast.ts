let el: HTMLDivElement | null = null;
let hideTimer: number | undefined;

/** Shows a short message at the bottom of the screen. `html` may contain <b> for emphasis. */
export function showToast(html: string, durationMs = 3600): void {
  if (!el) {
    el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    document.body.append(el);
  }
  const toast = el;
  toast.innerHTML = html;
  window.clearTimeout(hideTimer);
  requestAnimationFrame(() => toast.classList.add("show"));
  hideTimer = window.setTimeout(() => toast.classList.remove("show"), durationMs);
}

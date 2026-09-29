/** Copies the text of `source` when `button` is clicked, falling back to selecting it. */
export function initCopyEmail(button: HTMLElement, label: HTMLElement, source: HTMLElement): void {
  const idleText = label.textContent ?? "";

  const flash = (message: string): void => {
    label.textContent = message;
    window.setTimeout(() => { label.textContent = idleText; }, 1800);
  };

  const selectSource = (): void => {
    const range = document.createRange();
    range.selectNodeContents(source);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
    flash("Selected");
  };

  button.addEventListener("click", () => {
    const text = source.textContent ?? "";
    if (!navigator.clipboard?.writeText) {
      selectSource();
      return;
    }
    navigator.clipboard.writeText(text).then(() => flash("Copied!"), selectSource);
  });
}

const SECTIONS: ReadonlyArray<{ key: string; id: string; label: string }> = [
  { key: "0", id: "top", label: "Top" },
  { key: "1", id: "about", label: "About" },
  { key: "2", id: "experience", label: "Experience" },
  { key: "3", id: "work", label: "Selected work" },
  { key: "4", id: "recognition", label: "Recognition" },
  { key: "5", id: "stack", label: "The stack" },
  { key: "6", id: "contact", label: "Contact" },
];

/** Number keys jump between sections; "?" opens a sheet listing them (and hinting at the secrets). */
export function initShortcuts(scrollTo: (target: HTMLElement) => void): void {
  const sheet = buildSheet();

  window.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "?") {
      e.preventDefault();
      if (sheet.open) sheet.close();
      else sheet.showModal();
      return;
    }
    const section = SECTIONS.find((s) => s.key === e.key);
    const target = section ? document.getElementById(section.id) : null;
    if (!target) return;
    if (sheet.open) sheet.close();
    scrollTo(target);
  });
}

function buildSheet(): HTMLDialogElement {
  const sheet = document.createElement("dialog");
  sheet.className = "keys-sheet";
  sheet.setAttribute("aria-labelledby", "keys-title");
  sheet.innerHTML = `
    <div class="keys-card">
      <h2 id="keys-title">Shortcuts</h2>
      <p>Jump around without scrolling.</p>
      <ul class="keys-list">
        ${SECTIONS.map((s) => `<li><span>${s.label}</span><kbd>${s.key}</kbd></li>`).join("")}
        <li><span>Close this</span><kbd>Esc</kbd></li>
      </ul>
      <p>There are a few secrets on this page too. One of them starts with <kbd>↑</kbd><kbd>↑</kbd>.</p>
      <button class="keys-close" type="button">Got it</button>
    </div>`;
  sheet.querySelector(".keys-close")?.addEventListener("click", () => sheet.close());
  sheet.addEventListener("click", (e) => { if (e.target === sheet) sheet.close(); });
  document.body.append(sheet);
  return sheet;
}

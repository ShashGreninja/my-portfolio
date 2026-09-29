/** Keeps every element in `targets` showing the current time in `timeZone` (HH:MM). */
export function startClock(targets: HTMLElement[], timeZone = "Asia/Kolkata"): void {
  const format = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone });
  const tick = (): void => {
    const time = format.format(new Date());
    for (const el of targets) el.textContent = time;
  };
  tick();
  window.setInterval(tick, 15_000);
}

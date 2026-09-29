/** Endless marquee that speeds up with scroll velocity and follows the scroll direction. */
export function startMarquee(track: HTMLElement): void {
  // Duplicate the items so the loop can wrap at half the track width without a gap.
  track.append(...Array.from(track.children, (child) => child.cloneNode(true)));

  let offset = 0;
  let velocity = 0;
  let direction = 1;
  let lastScrollY = window.scrollY;

  const loop = (): void => {
    const delta = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
    if (delta !== 0) direction = delta > 0 ? 1 : -1;
    velocity += (Math.min(Math.abs(delta), 60) - velocity) * 0.1;
    offset -= (0.6 + velocity * 0.25) * direction;

    const half = track.scrollWidth / 2;
    if (offset <= -half) offset += half;
    if (offset > 0) offset -= half;
    track.style.transform = `translate3d(${offset}px,0,0)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

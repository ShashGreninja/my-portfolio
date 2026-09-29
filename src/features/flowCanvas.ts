/**
 * Hero background: a nested data tree that flattens into a bar chart, a nod to the
 * Highcharts flattening engine. Scroll (or an idle loop) drives the morph; nodes shy away from the pointer.
 */

interface TreeNode {
  depth: number;
  kids: TreeNode[];
  phase: number;
  value: number;
  /** tree position */
  tx: number;
  ty: number;
  /** bar-chart position */
  bx: number;
  by: number;
  /** current, eased position */
  x: number;
  y: number;
  placed: boolean;
}

interface ChartBox {
  ok: boolean;
  x0: number;
  top: number;
  base: number;
  barWidth: number;
}

interface FlowCanvasOptions {
  canvas: HTMLCanvasElement;
  hero: HTMLElement;
  /** Elements the chart must stay clear of. */
  name: HTMLElement;
  copy: HTMLElement;
  animate: boolean;
}

const BRANCHING = [3, 3, 2] as const;
const WHITE = "255,255,255";
const SIGNAL = "255,90,31";

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export class FlowCanvas {
  private readonly opts: FlowCanvasOptions;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly nodes: TreeNode[] = [];
  private readonly edges: Array<[TreeNode, TreeNode]> = [];
  private readonly leaves: TreeNode[] = [];
  private readonly t0 = performance.now();
  private width = 0;
  private height = 0;
  private box: ChartBox = { ok: false, x0: 0, top: 0, base: 0, barWidth: 4 };
  private pointer = { x: -9999, y: -9999, targetX: -9999, targetY: -9999 };
  private scrollProgress = 0;
  private visible = true;

  constructor(opts: FlowCanvasOptions) {
    this.opts = opts;
    const ctx = opts.canvas.getContext("2d");
    if (!ctx) throw new Error("2D canvas not supported");
    this.ctx = ctx;
    this.buildTree();
  }

  start(): void {
    const { hero, canvas, animate } = this.opts;
    this.resize();

    hero.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      this.pointer.targetX = e.clientX - r.left;
      this.pointer.targetY = e.clientY - r.top;
    });
    hero.addEventListener("mouseleave", () => {
      this.pointer.targetX = -9999;
      this.pointer.targetY = -9999;
    });
    window.addEventListener("scroll", () => {
      this.scrollProgress = Math.min(1, Math.max(0, window.scrollY / (hero.offsetHeight * 0.45)));
    }, { passive: true });

    if (!animate) return;
    new IntersectionObserver(([entry]) => {
      const nowVisible = entry?.isIntersecting ?? true;
      if (nowVisible && !this.visible) requestAnimationFrame(this.frame);
      this.visible = nowVisible;
    }).observe(canvas);
    requestAnimationFrame(this.frame);
  }

  /** Re-measures the canvas and the free space around the hero copy. */
  resize(): void {
    const { canvas } = this.opts;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = canvas.clientWidth;
    this.height = canvas.clientHeight;
    canvas.width = this.width * dpr;
    canvas.height = this.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.layout();
    if (!this.opts.animate) this.frame(performance.now());
  }

  private buildTree(): void {
    const rnd = seededRandom(7);
    const add = (depth: number, parent: TreeNode | null): void => {
      const node: TreeNode = {
        depth, kids: [], phase: rnd() * Math.PI * 2, value: 0,
        tx: 0, ty: 0, bx: 0, by: 0, x: 0, y: 0, placed: false,
      };
      this.nodes.push(node);
      if (parent) {
        parent.kids.push(node);
        this.edges.push([parent, node]);
      }
      const branches = BRANCHING[depth];
      if (branches !== undefined) {
        for (let i = 0; i < branches; i++) add(depth + 1, node);
      } else {
        node.value = 0.25 + rnd() * 0.75;
        this.leaves.push(node);
      }
    };
    add(0, null);
  }

  /** Keeps the chart in empty space: right of the copy on wide screens, above it on narrow ones, never over the name. */
  private layout(): void {
    const { hero, name, copy } = this.opts;
    const heroTop = hero.getBoundingClientRect().top;
    const nameTop = name.getBoundingClientRect().top - heroTop;
    const copyTop = copy.getBoundingClientRect().top - heroTop;
    const wide = this.width >= 900;
    const gutter = Math.max(16, Math.min(40, this.width * 0.03));

    const x0 = wide ? this.width * 0.55 : gutter + 8;
    const x1 = this.width - gutter - 8;
    const base = wide ? nameTop - 56 : copyTop - 40;
    let top = 150;
    if (base - top < 140) top = Math.max(110, base - 140);
    const span = base - top;
    const step = (x1 - x0) / (this.leaves.length - 1);

    this.leaves.forEach((leaf, i) => { leaf.tx = x0 + i * step; });
    const centreOverKids = (node: TreeNode): void => {
      if (!node.kids.length) return;
      node.kids.forEach(centreOverKids);
      node.tx = node.kids.reduce((sum, k) => sum + k.tx, 0) / node.kids.length;
    };
    const root = this.nodes[0];
    if (root) centreOverKids(root);

    for (const node of this.nodes) {
      node.ty = top + (node.depth / BRANCHING.length) * span * 0.62;
      node.bx = node.tx;
      node.by = node.kids.length ? base : base - node.value * span * 0.95;
      if (!node.placed) {
        node.x = node.tx;
        node.y = node.ty;
        node.placed = true;
      }
    }
    this.box = { ok: span >= 90, x0, top, base, barWidth: Math.max(4, step * 0.5) };
  }

  private frame = (now: number): void => {
    const { ctx, box, pointer } = this;
    const t = (now - this.t0) / 1000;
    pointer.x += (pointer.targetX - pointer.x) * 0.1;
    pointer.y += (pointer.targetY - pointer.y) * 0.1;

    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = `rgba(${WHITE},.08)`;
    for (let gx = 20; gx < this.width; gx += 32) {
      for (let gy = 20; gy < this.height; gy += 32) ctx.fillRect(gx, gy, 1.5, 1.5);
    }

    if (box.ok) this.drawChart(t, easeInOutCubic(Math.max(this.opts.animate ? this.idleProgress(t) : 0, this.scrollProgress)));
    if (this.visible && this.opts.animate) requestAnimationFrame(this.frame);
  };

  /** 9-second loop: hold as a tree, flatten, hold as a chart, rebuild. */
  private idleProgress(t: number): number {
    const c = (t % 9) / 9;
    if (c < 0.15) return 0;
    if (c < 0.45) return (c - 0.15) / 0.3;
    if (c < 0.7) return 1;
    return 1 - (c - 0.7) / 0.3;
  }

  private drawChart(t: number, p: number): void {
    const { ctx, box, pointer } = this;

    for (const n of this.nodes) {
      let x = n.tx + (n.bx - n.tx) * p + Math.sin(t * 0.8 + n.phase) * 3 * (1 - p);
      let y = n.ty + (n.by - n.ty) * p + Math.cos(t * 0.7 + n.phase) * 3 * (1 - p);
      const dx = x - pointer.x;
      const dy = y - pointer.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 22000) {
        const push = (1 - d2 / 22000) * 34;
        const d = Math.sqrt(d2) || 1;
        x += (dx / d) * push;
        y += (dy / d) * push;
      }
      n.x += (x - n.x) * 0.18;
      n.y += (y - n.y) * 0.18;
    }

    // edges fade as the tree flattens
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = `rgba(${WHITE},${(0.5 * (1 - p)).toFixed(3)})`;
    ctx.beginPath();
    for (const [a, b] of this.edges) {
      const mid = (a.y + b.y) / 2;
      ctx.moveTo(a.x, a.y);
      ctx.bezierCurveTo(a.x, mid, b.x, mid, b.x, b.y);
    }
    ctx.stroke();

    // bars grow in
    if (p > 0.01) {
      this.leaves.forEach((leaf, i) => {
        ctx.fillStyle = i % 5 === 2 ? `rgba(${SIGNAL},${p.toFixed(3)})` : `rgba(${WHITE},${(0.85 * p).toFixed(3)})`;
        ctx.fillRect(leaf.x - box.barWidth / 2, leaf.y, box.barWidth, Math.max(0, box.base - leaf.y));
      });
      const last = this.leaves[this.leaves.length - 1];
      if (last) {
        ctx.fillStyle = `rgba(${WHITE},${(0.5 * p).toFixed(3)})`;
        ctx.fillRect(box.x0 - 8, box.base, last.x - box.x0 + 16, 1);
      }
    }

    for (const n of this.nodes) {
      const internal = n.kids.length > 0;
      const alpha = internal ? 1 - p : 1;
      if (alpha < 0.02) continue;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.depth === 0 ? 7 : internal ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${n.depth === 0 ? SIGNAL : WHITE},${alpha})`;
      ctx.fill();
    }

    const root = this.nodes[0];
    ctx.font = "500 11px 'Geist Mono', ui-monospace, monospace";
    if (root) {
      ctx.fillStyle = `rgba(${WHITE},${(0.75 * (1 - p)).toFixed(3)})`;
      ctx.fillText("{ } nested api response · depth 3", root.x + 14, root.y + 4);
    }
    ctx.fillStyle = `rgba(${WHITE},${(0.75 * p).toFixed(3)})`;
    ctx.fillText(`flatten() → ${this.leaves.length} chartable series`, box.x0 - 8, box.top - 16);
  }
}

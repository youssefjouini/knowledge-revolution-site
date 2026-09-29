import { useEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { useIsoLayoutEffect } from './hooks';
import { colorOf, type JournalItem } from './types';

type Props = {
  items: JournalItem[];
  reduced: boolean;
  onPickCategory: (category: string) => void;
};

type Node = {
  id: string;
  hub: boolean;
  cat: string;
  item?: JournalItem;
  r: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx?: number;
  fy?: number;
  phase: number;
};
type Link = { a: number; b: number; len: number; k: number; kind: 'hub' | 'tag' };

const label = (s: string, n = 24) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);

/** "Knowledge map": posts orbit their category and connect to posts that share a tag. */
export default function MapView({ items, reduced, onPickCategory }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [dims, setDims] = useState({ W: 1000, H: 620 });
  const [active, setActive] = useState<number | null>(null);

  // Portrait canvas on phones
  useEffect(() => {
    const narrow = (box.current?.clientWidth ?? 1000) < 640;
    setDims(narrow ? { W: 600, H: 860 } : { W: 1000, H: 620 });
  }, []);

  const { nodes, links, neighbours } = useMemo(() => {
    const cats = [...new Set(items.map((i) => i.category))];
    const cx = dims.W / 2;
    const cy = dims.H / 2;
    const nodes: Node[] = cats.map((cat, i) => {
      const a = (i / cats.length) * Math.PI * 2 - Math.PI / 2;
      return { id: `hub-${cat}`, hub: true, cat, r: dims.W < 700 ? 46 : 40, x: cx + Math.cos(a) * 60, y: cy + Math.sin(a) * 40, vx: 0, vy: 0, phase: i * 1.7 };
    });
    items.forEach((it, i) => {
      const a = (i / items.length) * Math.PI * 2;
      nodes.push({
        id: it.kind + it.id,
        hub: false,
        cat: it.category,
        item: it,
        r: it.kind === 'meeting' ? 11 : 10 + Math.min(it.readingTime, 6) * 1.6,
        x: cx + Math.cos(a) * 12,
        y: cy + Math.sin(a) * 12,
        vx: 0,
        vy: 0,
        phase: i * 0.9 + 0.4,
      });
    });
    const links: Link[] = [];
    nodes.forEach((n, i) => {
      if (n.hub) return;
      links.push({ a: i, b: cats.indexOf(n.cat), len: 130, k: 0.06, kind: 'hub' });
    });
    for (let i = cats.length; i < nodes.length; i++)
      for (let j = i + 1; j < nodes.length; j++) {
        const ti = nodes[i].item!.tags;
        if (ti.some((t) => nodes[j].item!.tags.includes(t))) links.push({ a: i, b: j, len: 240, k: 0.004, kind: 'tag' });
      }
    const neighbours = nodes.map(() => new Set<number>());
    links.forEach((l) => {
      neighbours[l.a].add(l.b);
      neighbours[l.b].add(l.a);
    });
    return { nodes, links, neighbours };
  }, [items, dims]);

  const nodeEls = useRef<(SVGGElement | null)[]>([]);
  const linkEls = useRef<(SVGLineElement | null)[]>([]);
  const alpha = useRef(1);
  const drag = useRef<{ i: number; moved: boolean; sx: number; sy: number } | null>(null);
  const time = useRef(0);

  // --- physics ------------------------------------------------------------
  const tick = () => {
    const a = alpha.current;
    const { W, H } = dims;
    for (let i = 0; i < nodes.length; i++)
      for (let j = i + 1; j < nodes.length; j++) {
        const p = nodes[i];
        const q = nodes[j];
        let dx = q.x - p.x;
        let dy = q.y - p.y;
        let d2 = dx * dx + dy * dy;
        if (d2 < 1) {
          dx = (j - i) * 0.5;
          dy = 0.5;
          d2 = 1;
        }
        const d = Math.sqrt(d2);
        const charge = (p.hub && q.hub ? 16000 : p.hub || q.hub ? 7000 : 4200) * a;
        const f = charge / d2;
        const minD = p.r + q.r + (p.hub || q.hub ? 34 : 58);
        const push = d < minD ? (minD - d) * 0.5 : 0;
        const fx = (dx / d) * (f + push);
        const fy = (dy / d) * (f + push);
        p.vx -= fx;
        p.vy -= fy;
        q.vx += fx;
        q.vy += fy;
      }
    links.forEach((l) => {
      const p = nodes[l.a];
      const q = nodes[l.b];
      const dx = q.x - p.x;
      const dy = q.y - p.y;
      const d = Math.max(1, Math.hypot(dx, dy));
      const f = (d - l.len) * l.k * a;
      p.vx += (dx / d) * f;
      p.vy += (dy / d) * f;
      q.vx -= (dx / d) * f;
      q.vy -= (dy / d) * f;
    });
    nodes.forEach((n) => {
      n.vx += (W / 2 - n.x) * 0.004 * a;
      n.vy += (H / 2 - n.y) * 0.006 * a;
      n.vx *= 0.62;
      n.vy *= 0.62;
      if (n.fx !== undefined) {
        n.x = n.fx;
        n.y = n.fy!;
        n.vx = n.vy = 0;
      } else {
        n.x = Math.min(W - n.r - 12, Math.max(n.r + 12, n.x + n.vx));
        n.y = Math.min(H - n.r - 30, Math.max(n.r + 12, n.y + n.vy));
      }
    });
    alpha.current = Math.max(0, a * 0.985);
  };

  const paint = () => {
    const t = time.current;
    const drift = reduced ? 0 : 1;
    const px = (n: Node) => n.x + Math.sin(t * 0.7 + n.phase) * 3 * drift;
    const py = (n: Node) => n.y + Math.cos(t * 0.6 + n.phase) * 3 * drift;
    nodes.forEach((n, i) => nodeEls.current[i]?.setAttribute('transform', `translate(${px(n)} ${py(n)})`));
    links.forEach((l, i) => {
      const el = linkEls.current[i];
      if (!el) return;
      el.setAttribute('x1', String(px(nodes[l.a])));
      el.setAttribute('y1', String(py(nodes[l.a])));
      el.setAttribute('x2', String(px(nodes[l.b])));
      el.setAttribute('y2', String(py(nodes[l.b])));
    });
  };

  // Settle instantly for reduced motion; otherwise a "big bang" from the centre
  useIsoLayoutEffect(() => {
    alpha.current = 1;
    if (reduced) {
      for (let k = 0; k < 400; k++) tick();
    } else {
      for (let k = 0; k < 4; k++) tick();
    }
    paint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, reduced]);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (box.current) io.observe(box.current);
    const loop = (ms: number) => {
      time.current = ms / 1000;
      if (visible) {
        if (alpha.current > 0.004 || drag.current) {
          if (drag.current) alpha.current = Math.max(alpha.current, 0.25);
          tick();
        }
        paint();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, reduced]);

  // --- dragging ---------------------------------------------------------------
  const toSvg = (e: RPointerEvent) => {
    const m = svg.current!.getScreenCTM()!.inverse();
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m);
    return { x: p.x, y: p.y };
  };
  const onDown = (i: number) => (e: RPointerEvent<SVGGElement>) => {
    if (e.button !== 0) return;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    const p = toSvg(e);
    drag.current = { i, moved: false, sx: p.x, sy: p.y };
    nodes[i].fx = nodes[i].x;
    nodes[i].fy = nodes[i].y;
    setActive(i);
  };
  const onMove = (i: number) => (e: RPointerEvent<SVGGElement>) => {
    const d = drag.current;
    if (!d || d.i !== i) return;
    const p = toSvg(e);
    if (Math.hypot(p.x - d.sx, p.y - d.sy) > 5) d.moved = true;
    nodes[i].fx = p.x;
    nodes[i].fy = p.y;
    if (reduced) {
      tick();
      paint();
    }
  };
  const onUp = (i: number) => () => {
    const d = drag.current;
    nodes[i].fx = nodes[i].fy = undefined;
    drag.current = null;
    alpha.current = Math.max(alpha.current, 0.3);
    if (d && !d.moved) {
      const n = nodes[i];
      if (n.hub) onPickCategory(n.cat);
      else if (n.item) window.location.href = n.item.href;
    }
  };

  const fs = dims.W < 700 ? 1.45 : 1; // bigger labels on the portrait (phone) canvas
  const lit = active === null ? null : new Set([active, ...neighbours[active]]);
  const activeNode = active === null ? null : nodes[active];

  return (
    <div ref={box} className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-night">
      <svg
        ref={svg}
        viewBox={`0 0 ${dims.W} ${dims.H}`}
        className="block h-auto w-full touch-pan-y select-none"
        role="group"
        aria-label="Knowledge map of the journal. Each circle is a post, grouped around its category."
      >
        <defs>
          <radialGradient id="map-bg" cx="50%" cy="45%" r="70%">
            <stop offset="0%" stopColor="#1a2656" />
            <stop offset="100%" stopColor="#070d24" />
          </radialGradient>
          <pattern id="map-dots" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="rgb(255 255 255 / 0.07)" />
          </pattern>
          <filter id="map-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        <rect width={dims.W} height={dims.H} fill="url(#map-bg)" />
        <rect width={dims.W} height={dims.H} fill="url(#map-dots)" />

        <g>
          {links.map((l, i) => {
            const on = !lit || (lit.has(l.a) && lit.has(l.b) && (l.a === active || l.b === active));
            return (
              <line
                key={i}
                ref={(el) => {
                  linkEls.current[i] = el;
                }}
                stroke={l.kind === 'hub' ? colorOf(nodes[l.b].cat) : '#ffffff'}
                strokeOpacity={on ? (l.kind === 'hub' ? 0.45 : 0.22) : 0.04}
                strokeWidth={l.kind === 'hub' ? 1.5 : 1}
                strokeDasharray={l.kind === 'tag' ? '4 6' : undefined}
                style={{ transition: 'stroke-opacity .35s' }}
              />
            );
          })}
        </g>

        {nodes.map((n, i) => {
          const c = colorOf(n.cat);
          const dim = lit && !lit.has(i);
          const handlers = {
            onPointerDown: onDown(i),
            onPointerMove: onMove(i),
            onPointerUp: onUp(i),
            onPointerEnter: () => !drag.current && setActive(i),
            onPointerLeave: () => !drag.current && setActive(null),
          };
          const hubName = n.cat === 'Meeting' ? 'Meetings' : n.cat;
          const words = hubName.split(' ');
          return (
            <g
              key={n.id}
              ref={(el) => {
                nodeEls.current[i] = el;
              }}
              style={{ opacity: dim ? 0.18 : 1, transition: 'opacity .35s', cursor: 'grab', touchAction: 'none' }}
              {...handlers}
            >
              {n.hub ? (
                <a
                  href={`#journal-filter-${n.cat}`}
                  aria-label={`Show only ${hubName}`}
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onPickCategory(n.cat);
                    }
                  }}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                >
                  <circle r={n.r + 16} fill={c} opacity={0.18} filter="url(#map-glow)" />
                  <circle r={n.r} fill="#0a1230" stroke={c} strokeWidth={2} />
                  {words.length === 1 ? (
                    <text textAnchor="middle" dy="0.35em" fill={c} fontSize={11 * fs} fontWeight={800} letterSpacing="0.12em" style={{ fontFamily: 'var(--font-label)', textTransform: 'uppercase' }}>
                      {hubName}
                    </text>
                  ) : (
                    <text textAnchor="middle" fill={c} fontSize={10 * fs} fontWeight={800} letterSpacing="0.1em" style={{ fontFamily: 'var(--font-label)', textTransform: 'uppercase' }}>
                      {words.map((w, k) => (
                        <tspan key={k} x={0} dy={k === 0 ? `${-(words.length - 1) * 0.55 + 0.35}em` : '1.1em'}>
                          {w}
                        </tspan>
                      ))}
                    </text>
                  )}
                </a>
              ) : (
                <a
                  href={n.item!.href}
                  aria-label={`${n.item!.title} — ${n.item!.dateLabel}`}
                  onClick={(e) => e.preventDefault()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') window.location.href = n.item!.href;
                  }}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                >
                  <circle r={n.r + 10} fill={c} opacity={0.22} filter="url(#map-glow)" />
                  {n.item!.kind === 'meeting' ? (
                    <rect x={-n.r * 0.8} y={-n.r * 0.8} width={n.r * 1.6} height={n.r * 1.6} rx={3} transform="rotate(45)" fill="#0a1230" stroke={c} strokeWidth={2} />
                  ) : (
                    <>
                      <circle r={n.r} fill={c} />
                      <circle r={n.r * 0.38} fill="#0a1230" opacity={0.55} />
                    </>
                  )}
                  <text y={n.r + 16} textAnchor="middle" fill="#b7bfdb" fontSize={11 * fs} style={{ fontFamily: 'var(--font-sans)' }}>
                    {label(n.item!.title, dims.W < 700 ? 18 : 24)}
                  </text>
                </a>
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {activeNode && !activeNode.hub && activeNode.item && (
        <div
          className="pointer-events-none absolute z-10 w-64 -translate-x-1/2 rounded-2xl border border-white/15 bg-navy/95 p-4 shadow-2xl backdrop-blur"
          style={{
            left: `${Math.min(85, Math.max(15, (activeNode.x / dims.W) * 100))}%`,
            top: `${(activeNode.y / dims.H) * 100}%`,
            transform: `translate(-50%, ${activeNode.y / dims.H > 0.55 ? 'calc(-100% - 28px)' : '28px'})`,
          }}
        >
          <p className="font-label text-[0.65rem] font-bold tracking-wider uppercase" style={{ color: colorOf(activeNode.cat) }}>
            {activeNode.item.kind === 'meeting' ? 'Meeting minutes' : activeNode.cat} · {activeNode.item.dateLabel}
          </p>
          <p className="mt-1 font-display text-lg leading-snug text-ink">{activeNode.item.title}</p>
          <p className="mt-1 line-clamp-2 text-xs text-mist">{activeNode.item.excerpt}</p>
          <p className="mt-2 font-label text-[0.65rem] font-semibold tracking-wider text-cyan uppercase">Click to read →</p>
        </div>
      )}

      <p className="pointer-events-none absolute right-4 bottom-3 left-4 text-center font-label text-[0.65rem] tracking-[0.2em] text-mist/80 uppercase">
        Drag the stars · hover to explore · click to read · click a category to filter
      </p>
    </div>
  );
}

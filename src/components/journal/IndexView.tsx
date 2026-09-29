import { useEffect, useRef, useState } from 'react';
import { pad } from './hooks';
import { colorOf, type JournalItem } from './types';

type Props = { items: JournalItem[]; reduced: boolean };

/** Editorial list with a cover preview that follows the cursor (fine pointers only). */
export default function IndexView({ items, reduced }: Props) {
  const [hovered, setHovered] = useState<JournalItem | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0, rot: 0 });
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => setFinePointer(window.matchMedia('(hover: hover) and (pointer: fine)').matches), []);

  // Smoothly follow the cursor; tilt with horizontal speed
  useEffect(() => {
    if (!finePointer) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    const loop = () => {
      const p = pos.current;
      const k = reduced ? 1 : 0.14;
      const dx = target.current.x - p.x;
      p.x += dx * k;
      p.y += (target.current.y - p.y) * k;
      p.rot += ((reduced ? 0 : Math.max(-10, Math.min(10, dx * 0.08))) - p.rot) * 0.12;
      if (preview.current) preview.current.style.transform = `translate(${p.x + 28}px, ${p.y - 110}px) rotate(${p.rot}deg)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [finePointer, reduced]);

  return (
    <div className="relative">
      <ol className="border-b border-white/10" onPointerLeave={() => setHovered(null)}>
        {items.map((it, i) => {
          const c = colorOf(it.category);
          return (
            <li key={it.kind + it.id} data-flip-id={it.kind + it.id} style={{ ['--c' as string]: c }}>
              <div className="jr-reveal from-below">
                <a
                  href={it.href}
                  onPointerEnter={() => setHovered(it)}
                  onFocus={() => setHovered(null)}
                  className="ix-row group relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 overflow-hidden border-t border-white/10 py-6 md:grid-cols-[4.5rem_1fr_11rem_9rem_2.5rem] md:gap-6 md:py-8"
                >
                  <span className="ix-sweep pointer-events-none absolute inset-0 -z-10 origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" style={{ background: `linear-gradient(90deg, ${c}1f, transparent 70%)` }} aria-hidden="true" />
                  <span className="font-label text-sm font-semibold text-mist tabular-nums transition-colors group-hover:text-[var(--c)]">{pad(i + 1)}</span>
                  <span className="min-w-0">
                    <span className="block font-display text-2xl leading-tight text-ink transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 group-hover:text-[var(--c)] md:text-4xl lg:text-[2.75rem]">
                      {it.title}
                    </span>
                    <span className="mt-2 block font-label text-xs text-mist md:hidden">
                      {it.category} · {it.dateLabel}
                    </span>
                  </span>
                  <span className="hidden items-center gap-2 font-label text-xs font-bold tracking-wider uppercase md:flex" style={{ color: c }}>
                    <span className="size-2 rounded-full" style={{ background: c }} />
                    {it.kind === 'meeting' ? 'Meeting' : it.category}
                  </span>
                  <span className="hidden font-label text-xs text-mist md:block">
                    {it.dateLabel}
                    <br />
                    {it.kind === 'meeting' ? 'Minutes' : `${it.readingTime} min read`}
                  </span>
                  {/* thumbnail on touch screens, arrow on desktop */}
                  {it.cover && !finePointer ? (
                    <img src={it.cover.src} alt="" width={96} height={64} loading="lazy" className="h-14 w-20 rounded-xl object-cover md:hidden" />
                  ) : (
                    <span className="flex size-10 items-center justify-center rounded-full border border-white/15 text-ink transition duration-500 group-hover:rotate-[-45deg] group-hover:border-[var(--c)] group-hover:bg-[var(--c)] group-hover:text-navy">
                      →
                    </span>
                  )}
                </a>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Floating preview */}
      {finePointer && (
        <div
          ref={preview}
          className="pointer-events-none fixed top-0 left-0 z-40 w-72"
          aria-hidden="true"
        >
          <div
            className={`overflow-hidden rounded-2xl border border-white/15 bg-navy shadow-[0_30px_70px_-20px_rgb(0_0_0/0.8)] transition duration-300 ${hovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
            style={{ transformOrigin: 'left bottom' }}
          >
            {hovered?.cover ? (
              <img src={hovered.cover.src} alt="" className="aspect-[16/10] w-full object-cover" />
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center bg-navy-700 font-label text-xs tracking-[0.2em] text-mist uppercase">Meeting minutes</div>
            )}
            {hovered && (
              <div className="p-4">
                <p className="font-label text-[0.65rem] font-bold tracking-wider uppercase" style={{ color: colorOf(hovered.category) }}>
                  {hovered.category}
                </p>
                <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-mist">{hovered.excerpt}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

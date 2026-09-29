import { Fragment, useEffect, useRef } from 'react';
import { colorOf, type JournalItem } from './types';

type Props = {
  items: JournalItem[];
  order: 'desc' | 'asc';
  currentPhase: string;
  origin: { dateLabel: string } | null;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

/** Monday of the item's week (UTC) → group key + readable label. */
function weekOf(iso: string) {
  const d = new Date(iso);
  const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - ((d.getUTCDay() + 6) % 7)));
  const sunday = new Date(monday.getTime() + 6 * 86400000);
  const sameMonth = monday.getUTCMonth() === sunday.getUTCMonth();
  const label = sameMonth
    ? `${monday.getUTCDate()}–${sunday.getUTCDate()} ${MONTHS[sunday.getUTCMonth()]}`
    : `${monday.getUTCDate()} ${MONTHS[monday.getUTCMonth()]} – ${sunday.getUTCDate()} ${MONTHS[sunday.getUTCMonth()]}`;
  return { key: monday.toISOString().slice(0, 10), label: `Week of ${label}` };
}

function Terminal({ kind, currentPhase, origin }: { kind: 'now' | 'origin'; currentPhase: string; origin: Props['origin'] }) {
  return (
    <li data-flip-id={`terminal-${kind}`} className="relative grid grid-cols-[3.5rem_1fr] items-center gap-4 py-6 md:grid-cols-[1fr_5.5rem_1fr]">
      <div className="flex justify-center md:col-start-2">
        {kind === 'now' ? (
          <span className="relative flex size-6">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan opacity-50 motion-reduce:animate-none" />
            <span className="relative inline-flex size-6 rounded-full border-4 border-navy-950 bg-cyan shadow-[0_0_24px_rgb(92_225_230/0.9)]" />
          </span>
        ) : (
          <span className="size-5 rounded-full border-2 border-gold bg-navy-950 shadow-[0_0_18px_rgb(232_169_58/0.7)]" />
        )}
      </div>
      <p className="font-label text-xs font-bold tracking-[0.25em] uppercase md:col-start-3 md:row-start-1">
        {kind === 'now' ? (
          <span className="text-cyan">Now · {currentPhase} phase under way</span>
        ) : (
          <span className="text-gold">Where it all began{origin ? ` · ${origin.dateLabel}` : ''}</span>
        )}
      </p>
    </li>
  );
}

export default function TimelineView({ items, order, currentPhase, origin }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const tip = useRef<HTMLSpanElement>(null);

  // The glowing line follows the reader through the timeline
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = wrap.current;
      if (!el || !bar.current || !tip.current) return;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.55 - r.top) / r.height));
      bar.current.style.transform = `scaleY(${p})`;
      tip.current.style.top = `${p * 100}%`;
      tip.current.style.opacity = p > 0 && p < 1 ? '1' : '0';
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [items, order]);

  let lastWeek = '';
  let side = 0;

  return (
    <div ref={wrap} className="relative">
      {/* axis */}
      <span className="absolute top-0 bottom-0 left-[1.75rem] w-px -translate-x-1/2 bg-white/10 md:left-1/2" aria-hidden="true" />
      <span
        ref={bar}
        className="absolute top-0 bottom-0 left-[1.75rem] w-[2px] origin-top -translate-x-1/2 bg-gradient-to-b from-cyan via-gold to-coral md:left-1/2"
        style={{ transform: 'scaleY(0)' }}
        aria-hidden="true"
      />
      <span className="pointer-events-none absolute left-[1.75rem] md:left-1/2" style={{ top: 0, bottom: 0 }} aria-hidden="true">
        <span
          ref={tip}
          className="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink shadow-[0_0_0_6px_rgb(92_225_230/0.18),0_0_28px_rgb(92_225_230/0.9)] transition-opacity"
          style={{ top: 0, opacity: 0 }}
        />
      </span>

      <ol className="relative">
        <Terminal kind={order === 'desc' ? 'now' : 'origin'} currentPhase={currentPhase} origin={origin} />

        {items.map((it) => {
          const week = weekOf(it.date);
          const showWeek = week.key !== lastWeek;
          lastWeek = week.key;
          const left = side++ % 2 === 0;
          const c = colorOf(it.category);
          return (
            <Fragment key={it.kind + it.id}>
              {showWeek && (
                <li data-flip-id={`week-${week.key}`} className="relative grid grid-cols-[3.5rem_1fr] gap-4 py-5 md:grid-cols-[1fr_5.5rem_1fr]">
                  <span className="col-start-2 md:col-span-3 md:col-start-1 md:text-center">
                    <span className="inline-block rounded-full border border-white/15 bg-navy-950 px-4 py-1.5 font-label text-[0.7rem] font-semibold tracking-[0.2em] text-mist uppercase">
                      {week.label}
                    </span>
                  </span>
                </li>
              )}
              <li
                data-flip-id={it.kind + it.id}
                className="relative grid grid-cols-[3.5rem_1fr] items-start gap-4 py-5 md:grid-cols-[1fr_5.5rem_1fr] md:items-center"
                style={{ ['--c' as string]: c }}
              >
                {/* marker on the axis */}
                <div className="relative z-10 flex justify-center pt-2 md:col-start-2 md:row-start-1 md:pt-0">
                  {it.kind === 'meeting' ? (
                    <span className="tl-marker flex size-12 rotate-45 items-center justify-center rounded-xl border-2 bg-navy-950" style={{ borderColor: c }}>
                      <span className="-rotate-45 text-center leading-none">
                        <span className="block font-label text-base font-extrabold text-ink">{it.day}</span>
                        <span className="block font-label text-[0.55rem] font-semibold tracking-wider text-mist uppercase">{it.month}</span>
                      </span>
                    </span>
                  ) : (
                    <span className="tl-marker flex size-14 flex-col items-center justify-center rounded-full border-2 bg-navy-950 leading-none md:size-16" style={{ borderColor: c, boxShadow: `0 0 26px -6px ${c}` }}>
                      <span className="font-label text-lg font-extrabold text-ink md:text-xl">{it.day}</span>
                      <span className="mt-0.5 font-label text-[0.6rem] font-semibold tracking-wider text-mist uppercase">{it.month}</span>
                    </span>
                  )}
                </div>

                {/* card */}
                <div className={`md:row-start-1 md:w-full md:max-w-[31rem] ${left ? 'md:col-start-1 md:justify-self-end' : 'md:col-start-3'}`}>
                  <div className={`jr-reveal ${left ? 'from-left' : 'from-right'}`}>
                    {it.kind === 'meeting' ? (
                      <a href={it.href} className="tl-card group block rounded-[1.5rem] border border-dashed border-white/25 bg-white/[0.03] p-5 transition duration-500 hover:-translate-y-1 hover:border-white/50 hover:bg-white/[0.06]">
                        <p className="flex items-center gap-2 font-label text-[0.68rem] font-bold tracking-[0.2em] text-mist uppercase">
                          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                            <rect x="3" y="5" width="18" height="16" rx="2" />
                            <path d="M3 10h18M8 3v4M16 3v4" />
                          </svg>
                          Meeting minutes
                        </p>
                        <h3 className="mt-2 font-display text-xl leading-snug text-ink">{it.title}</h3>
                        {it.excerpt && <p className="mt-2 line-clamp-2 text-sm text-mist">{it.excerpt}</p>}
                        <span className="mt-3 inline-flex items-center gap-2 font-label text-xs font-semibold text-ink/80 group-hover:text-ink">
                          Read the minutes <span className="transition group-hover:translate-x-1">→</span>
                        </span>
                      </a>
                    ) : (
                      <a href={it.href} className="tl-card group relative block overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(160deg,rgb(255_255_255/0.07),rgb(255_255_255/0.02))] transition duration-500 hover:-translate-y-1.5">
                        <span className="absolute inset-x-0 top-0 z-10 h-1" style={{ background: c }} aria-hidden="true" />
                        {it.cover && (
                          <div className="relative aspect-[16/7] overflow-hidden">
                            <img
                              src={it.cover.src}
                              srcSet={it.cover.srcSet}
                              sizes="(min-width: 768px) 520px, 100vw"
                              width={it.cover.width}
                              height={it.cover.height}
                              alt={it.coverAlt}
                              loading="lazy"
                              decoding="async"
                              className="size-full object-cover transition duration-[1200ms] ease-out group-hover:scale-110"
                            />
                            <span className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/10 to-transparent" />
                            <span className="absolute bottom-4 left-5 inline-flex items-center gap-2 rounded-full bg-navy-950/80 px-3 py-1 font-label text-[0.68rem] font-bold tracking-wider uppercase backdrop-blur" style={{ color: c }}>
                              <span className="size-1.5 rounded-full" style={{ background: c }} />
                              {it.category}
                            </span>
                          </div>
                        )}
                        <div className="p-6">
                          <p className="font-label text-xs text-mist">
                            {it.readingTime} min read{it.tags.length > 0 && <span className="text-mist/70"> · {it.tags.slice(0, 3).map((t) => `#${t}`).join(' ')}</span>}
                          </p>
                          <h3 className="mt-2 font-display text-2xl leading-snug text-ink transition-colors duration-300 group-hover:text-[var(--c)]">{it.title}</h3>
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mist">{it.excerpt}</p>
                          <span className="mt-4 inline-flex items-center gap-2 font-label text-sm font-semibold" style={{ color: c }}>
                            Read the post <span className="transition duration-300 group-hover:translate-x-1.5">→</span>
                          </span>
                        </div>
                      </a>
                    )}
                  </div>
                </div>
              </li>
            </Fragment>
          );
        })}

        <Terminal kind={order === 'desc' ? 'origin' : 'now'} currentPhase={currentPhase} origin={origin} />
      </ol>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import IndexView from './IndexView';
import MapView from './MapView';
import TimelineView from './TimelineView';
import { useFlip, useIsoLayoutEffect, useReducedMotion, useRevealOnScroll } from './hooks';
import { colorOf, type JournalItem, type JournalView } from './types';

type Props = {
  items: JournalItem[];
  categories: string[];
  currentPhase: string;
};

const VIEWS: { key: JournalView; label: string; icon: ReactNode }[] = [
  {
    key: 'timeline',
    label: 'Timeline',
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <path d="M12 3v18" />
        <circle cx="12" cy="7" r="2" fill="currentColor" />
        <circle cx="12" cy="16" r="2" fill="currentColor" />
        <path d="M14 7h6M4 16h6" />
      </svg>
    ),
  },
  {
    key: 'index',
    label: 'Index',
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    ),
  },
  {
    key: 'map',
    label: 'Knowledge map',
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="18" cy="8" r="2.5" />
        <circle cx="10" cy="18" r="2.5" />
        <path d="m8.2 7.2 7.6.6M7 8.4l2.2 7.2M16.4 10l-4.6 6.2" />
      </svg>
    ),
  },
];

export default function Journal({ items, categories, currentPhase }: Props) {
  const reduced = useReducedMotion();
  const [view, setView] = useState<JournalView>('timeline');
  const [cat, setCat] = useState('All');
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');
  const root = useRef<HTMLDivElement>(null);
  const results = useRef<HTMLDivElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  // ---- data --------------------------------------------------------------
  const chips = useMemo(() => {
    const count: Record<string, number> = { All: items.length };
    items.forEach((i) => (count[i.category] = (count[i.category] ?? 0) + 1));
    const present = [...categories.filter((c) => count[c]), ...(count.Meeting ? ['Meeting'] : [])];
    return [{ name: 'All', count: items.length }, ...present.map((c) => ({ name: c, count: count[c] }))];
  }, [items, categories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = items.filter(
      (i) =>
        (cat === 'All' || i.category === cat) &&
        (!q || [i.title, i.excerpt, i.category, ...i.tags, i.text].join(' ').toLowerCase().includes(q)),
    );
    return list.sort((a, b) => (order === 'desc' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
  }, [items, cat, query, order]);

  const origin = useMemo(() => {
    const first = [...items].sort((a, b) => a.date.localeCompare(b.date))[0];
    return first ? { dateLabel: first.dateLabel } : null;
  }, [items]);

  // ---- motion --------------------------------------------------------------
  const snapshot = useFlip(results, [filtered, view], reduced);
  useRevealOnScroll(results, '.jr-reveal', [filtered, view], reduced);
  useIsoLayoutEffect(() => {
    root.current?.classList.add('jr-ready');
  }, []);

  // sliding pill under the active view
  useIsoLayoutEffect(() => {
    const el = tabs.current[VIEWS.findIndex((v) => v.key === view)];
    if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
  }, [view]);
  useEffect(() => {
    const onResize = () => {
      const el = tabs.current[VIEWS.findIndex((v) => v.key === view)];
      if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [view]);

  // ---- URL <-> state (shareable views: /blog?view=map&cat=Educate) ------------
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const v = p.get('view') as JournalView | null;
    if (v && VIEWS.some((x) => x.key === v)) setView(v);
    const c = p.get('cat');
    if (c && chips.some((x) => x.name === c)) setCat(c);
    if (p.get('order') === 'asc') setOrder('asc');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    view === 'timeline' ? p.delete('view') : p.set('view', view);
    cat === 'All' ? p.delete('cat') : p.set('cat', cat);
    order === 'desc' ? p.delete('order') : p.set('order', order);
    const qs = p.toString();
    history.replaceState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}${window.location.hash}`);
  }, [view, cat, order]);

  // "/" focuses the search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === '/' && !/input|textarea|select/i.test(t.tagName)) {
        e.preventDefault();
        search.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const change = (fn: () => void) => {
    snapshot();
    fn();
  };
  const pickCategory = (c: string) => {
    change(() => setCat(c));
    results.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  };
  const surprise = () => {
    const posts = items.filter((i) => i.kind === 'post');
    const pick = posts[Math.floor(Math.random() * posts.length)];
    if (pick) window.location.href = pick.href;
  };

  return (
    <div ref={root} className="journal">
      {/* ------------------------------ control bar ------------------------------ */}
      <div className="relative z-30 -mx-4 mb-10 px-4 py-3 sm:-mx-6 sm:px-6 md:sticky md:top-[4.5rem] lg:-mx-8 lg:px-8">
        <div className="journal-bar rounded-[1.75rem] border border-white/10 bg-navy-950/80 p-3 shadow-[0_20px_50px_-25px_rgb(0_0_0/0.8)] backdrop-blur-xl">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            {/* views */}
            <div className="relative flex shrink-0 rounded-full border border-white/10 bg-white/[0.04] p-1" role="group" aria-label="Choose a view">
              <span
                className="absolute top-1 bottom-1 rounded-full bg-gold shadow-[0_8px_24px_-8px_rgb(232_169_58/0.8)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ left: pill.left, width: pill.width, opacity: pill.width ? 1 : 0 }}
                aria-hidden="true"
              />
              {VIEWS.map((v, i) => (
                <button
                  key={v.key}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  aria-pressed={view === v.key}
                  onClick={() => setView(v.key)}
                  className={`relative z-10 flex items-center gap-2 rounded-full px-4 py-2 font-label text-xs font-bold tracking-wider uppercase transition-colors duration-300 ${
                    view === v.key ? 'text-navy' : 'text-mist hover:text-ink'
                  }`}
                >
                  {v.icon}
                  <span className={v.key === 'map' ? 'hidden sm:inline' : ''}>{v.label}</span>
                  {v.key === 'map' && <span className="sm:hidden">Map</span>}
                </button>
              ))}
            </div>

            {/* search */}
            <label className="relative block min-w-0 flex-1">
              <span className="sr-only">Search the journal</span>
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-mist" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" strokeLinecap="round" />
              </svg>
              <input
                ref={search}
                type="search"
                value={query}
                onChange={(e) => change(() => setQuery(e.target.value))}
                placeholder="Search posts, tags, ideas…"
                className="w-full rounded-full border border-white/10 bg-white/[0.04] py-2.5 pr-12 pl-11 text-sm text-ink placeholder:text-mist/70 focus:border-cyan/60 focus:outline-none"
              />
              <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-md border border-white/15 px-2 py-0.5 font-label text-[0.65rem] text-mist sm:block">/</kbd>
            </label>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => change(() => setOrder((o) => (o === 'desc' ? 'asc' : 'desc')))}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 font-label text-xs font-semibold text-mist transition hover:border-cyan/40 hover:text-ink"
                aria-label={order === 'desc' ? 'Sorted newest first — switch to oldest first' : 'Sorted oldest first — switch to newest first'}
              >
                <svg viewBox="0 0 24 24" className={`size-4 transition-transform duration-500 ${order === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <path d="M7 4v16M7 20l-3-3M7 20l3-3M14 6h7M14 12h5M14 18h3" />
                </svg>
                {order === 'desc' ? 'Newest' : 'Oldest'}
              </button>
              <button
                type="button"
                onClick={surprise}
                className="group flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-2.5 font-label text-xs font-semibold text-gold transition hover:bg-gold hover:text-navy"
              >
                <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-700 group-hover:rotate-[360deg]" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="4" y="4" width="16" height="16" rx="3" />
                  <circle cx="9" cy="9" r="1.2" fill="currentColor" />
                  <circle cx="15" cy="15" r="1.2" fill="currentColor" />
                  <circle cx="15" cy="9" r="1.2" fill="currentColor" />
                  <circle cx="9" cy="15" r="1.2" fill="currentColor" />
                </svg>
                Surprise me
              </button>
            </div>
          </div>

          {/* categories */}
          <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]" role="group" aria-label="Filter by category">
            {chips.map((c) => {
              const on = cat === c.name;
              const col = c.name === 'All' ? '#F1F1F1' : colorOf(c.name);
              return (
                <button
                  key={c.name}
                  id={`journal-filter-${c.name}`}
                  type="button"
                  aria-pressed={on}
                  onClick={() => change(() => setCat(c.name))}
                  className="flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 font-label text-xs font-semibold whitespace-nowrap transition duration-300"
                  style={{
                    borderColor: on ? col : 'rgb(255 255 255 / 0.1)',
                    background: on ? `${col}22` : 'transparent',
                    color: on ? col : 'var(--color-mist)',
                  }}
                >
                  <span className="size-2 rounded-full" style={{ background: col, boxShadow: on ? `0 0 10px ${col}` : 'none' }} />
                  {c.name === 'Meeting' ? 'Meetings' : c.name}
                  <span className="opacity-60">{c.count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ------------------------------ results ------------------------------ */}
      <div ref={results} className="scroll-mt-48">
        <p className="mb-6 font-label text-xs tracking-[0.2em] text-mist uppercase" aria-live="polite">
          {filtered.length === items.length ? `${items.length} entries` : `${filtered.length} of ${items.length} entries`}
          {cat !== 'All' && (
            <button type="button" onClick={() => change(() => setCat('All'))} className="ml-3 text-cyan underline decoration-cyan/40 underline-offset-4 hover:decoration-cyan">
              clear filter
            </button>
          )}
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/15 p-12 text-center">
            <p className="font-display text-3xl text-ink">Nothing here… yet.</p>
            <p className="mt-2 text-mist">No entry matches “{query}”. Try another word, or let us surprise you.</p>
            <button type="button" onClick={surprise} className="btn-gold mt-6">
              Surprise me
            </button>
          </div>
        ) : (
          <div key={view} className="journal-view">
            {view === 'timeline' && <TimelineView items={filtered} order={order} currentPhase={currentPhase} origin={origin} />}
            {view === 'index' && <IndexView items={filtered} reduced={reduced} />}
            {view === 'map' && <MapView items={filtered} reduced={reduced} onPickCategory={pickCategory} />}
          </div>
        )}
      </div>
    </div>
  );
}

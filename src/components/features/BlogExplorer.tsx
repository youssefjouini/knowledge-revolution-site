import { useMemo, useState } from 'react';

export type PostSummary = {
  id: string;
  title: string;
  date: string; // ISO
  dateLabel: string;
  category: string;
  tags: string[];
  excerpt: string;
  readingTime: number;
  cover: { src: string; srcSet?: string; width: number; height: number } | null;
  coverAlt: string;
};

type Props = { posts: PostSummary[]; categories: string[] };

export default function BlogExplorer({ posts, categories }: Props) {
  const [category, setCategory] = useState<string>('All');
  const [query, setQuery] = useState('');

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: posts.length };
    posts.forEach((p) => (c[p.category] = (c[p.category] ?? 0) + 1));
    return c;
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (category === 'All' || p.category === category) &&
        (!q || [p.title, p.excerpt, p.category, ...p.tags].join(' ').toLowerCase().includes(q)),
    );
  }, [posts, category, query]);

  return (
    <div>
      <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {['All', ...categories].map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => setCategory(c)}
                className={`rounded-full border px-4 py-2 font-label text-xs font-semibold tracking-wide transition ${
                  active
                    ? 'border-gold bg-gold text-navy'
                    : 'border-white/12 bg-white/5 text-mist hover:border-cyan/50 hover:text-ink'
                }`}
              >
                {c} <span className={active ? 'text-navy/60' : 'text-mist/60'}>{counts[c] ?? 0}</span>
              </button>
            );
          })}
        </div>
        <label className="relative block w-full lg:w-80">
          <span className="sr-only">Search posts</span>
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-mist" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, tags…"
            className="w-full rounded-full border border-white/12 bg-white/5 py-3 pr-4 pl-11 text-sm text-ink placeholder:text-mist/70 focus:border-cyan/60 focus:outline-none"
          />
        </label>
      </div>

      <p className="sr-only" aria-live="polite">
        {filtered.length} post{filtered.length === 1 ? '' : 's'} shown
      </p>

      {filtered.length === 0 ? (
        <div className="glass p-10 text-center text-mist">
          {posts.length === 0 ? 'No posts yet — stay tuned.' : 'No post matches your search.'}
        </div>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <li key={p.id}>
              <article className="glass glass-hover group relative flex h-full flex-col overflow-hidden">
                <div className="relative aspect-[16/9] overflow-hidden bg-navy-700">
                  {p.cover && (
                    <img
                      src={p.cover.src}
                      srcSet={p.cover.srcSet}
                      sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
                      width={p.cover.width}
                      height={p.cover.height}
                      alt={p.coverAlt}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  )}
                  <span className="chip absolute top-4 left-4 !border-white/20 !bg-navy/85 !text-gold backdrop-blur">{p.category}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="font-label text-xs text-mist">
                    <time dateTime={p.date}>{p.dateLabel}</time> · {p.readingTime} min read
                  </p>
                  <h2 className="mt-3 font-display text-2xl leading-snug text-ink">
                    <a href={`/blog/${p.id}`} className="after:absolute after:inset-0">
                      {p.title}
                    </a>
                  </h2>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-mist">{p.excerpt}</p>
                  {p.tags.length > 0 && (
                    <p className="mt-auto flex flex-wrap gap-2 pt-5">
                      {p.tags.map((t) => (
                        <span key={t} className="font-label text-[0.7rem] text-cyan/80">
                          #{t}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

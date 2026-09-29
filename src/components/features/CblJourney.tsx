import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

type Img = { src: string; srcSet?: string; width: number; height: number; alt: string };
type Status = 'done' | 'current' | 'upcoming';

export type CblData = {
  statuses: Record<'Engage' | 'Investigate' | 'Act', Status>;
  engage: {
    bigIdea: string;
    bigIdeaText: string;
    essentialQuestion: string;
    challenge: string;
    deliverables: string[];
    images: { bigIdea: Img; question: Img; challenge: Img };
  };
  investigate: { quote: string; guidingQuestions: string[]; activities: string[]; resources: string[]; synthesis: string | null };
  act: { solution: string | null; implementation: string[]; evaluation: string[] };
};

const TABS = ['Engage', 'Investigate', 'Act'] as const;
const STATUS_LABEL: Record<Status, string> = { done: 'Completed', current: 'In progress', upcoming: 'Upcoming' };

function Todo({ children }: { children: ReactNode }) {
  return (
    <span className="todo">
      <span aria-hidden="true">✎</span> [TODO] {children}
    </span>
  );
}

function ListOrTodo({ items, todo }: { items: string[]; todo: string }) {
  if (!items.length) return <Todo>{todo}</Todo>;
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it} className="flex gap-3 text-mist">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
          {it}
        </li>
      ))}
    </ul>
  );
}

function Picture({ img, className = '' }: { img: Img; className?: string }) {
  return (
    <img
      src={img.src}
      srcSet={img.srcSet}
      sizes="(min-width: 1024px) 560px, 100vw"
      width={img.width}
      height={img.height}
      alt={img.alt}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}

function Block({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <div className="glass p-6 md:p-7">
      <p className="font-label text-[0.68rem] font-semibold tracking-[0.2em] text-cyan uppercase">{label}</p>
      <h3 className="mt-1 mb-4 font-display text-2xl text-ink">{title}</h3>
      {children}
    </div>
  );
}

export default function CblJourney({ data }: { data: CblData }) {
  const initial = TABS.find((t) => data.statuses[t] === 'current') ?? 'Engage';
  const [tab, setTab] = useState<(typeof TABS)[number]>(initial);
  const [engageStep, setEngageStep] = useState(0);
  const [treeKey, setTreeKey] = useState(0); // bumps on each click on Engage → replays the tree animation
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Upcoming phases are locked: not clickable, skipped by the keyboard
  const isLocked = (t: (typeof TABS)[number]) => data.statuses[t] === 'upcoming';
  const open = TABS.filter((t) => !isLocked(t));

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = open.indexOf(tab);
    let next = i;
    if (e.key === 'ArrowRight') next = (i + 1) % open.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + open.length) % open.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = open.length - 1;
    else return;
    e.preventDefault();
    setTab(open[next]);
    tabRefs.current[TABS.indexOf(open[next])]?.focus();
  };

  const e = data.engage;
  const engageSteps = [
    { n: '01', label: 'The Big Idea', title: e.bigIdea, text: e.bigIdeaText, img: e.images.bigIdea },
    { n: '02', label: 'The Essential Question', title: e.essentialQuestion, img: e.images.question },
    { n: '03', label: 'The Challenge', title: e.challenge, img: e.images.challenge },
  ];
  const step = engageSteps[engageStep];

  const inv = data.investigate;
  const investigateBlocks = [
    { title: 'Guiding questions', content: inv.guidingQuestions },
    { title: 'Guiding activities', content: inv.activities },
    { title: 'Guiding resources', content: inv.resources },
    { title: 'Synthesis', content: inv.synthesis ?? [] },
  ].filter((b) => b.content.length > 0);

  return (
    <div>
      {/* Phase tabs */}
      <div role="tablist" aria-label="CBL phases" onKeyDown={onKey} className="relative grid gap-3 sm:grid-cols-3">
        {TABS.map((t, i) => {
          const active = t === tab;
          const status = data.statuses[t];
          const locked = isLocked(t);
          return (
            <button
              key={t}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tab-${t}`}
              aria-selected={active}
              aria-controls={locked ? undefined : `panel-${t}`}
              aria-disabled={locked || undefined}
              disabled={locked}
              tabIndex={active ? 0 : -1}
              onClick={() => {
                if (locked) return;
                setTab(t);
                if (t === 'Engage') setTreeKey((k) => k + 1);
              }}
              title={locked ? `${t} — locked until the previous phase is complete` : undefined}
              className={`group relative flex items-center gap-4 rounded-full border py-2.5 pr-6 pl-2.5 text-left transition duration-300 ${
                locked
                  ? 'cursor-not-allowed border-white/8 bg-white/[0.02] text-ink/45'
                  : active
                    ? 'border-transparent bg-ink text-navy shadow-[0_10px_40px_-10px_rgb(92_225_230/0.5)]'
                    : 'border-white/12 bg-white/5 text-ink hover:border-cyan/40'
              }`}
            >
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-full font-label text-sm font-bold ${
                  active ? 'bg-navy text-ink' : status === 'done' ? 'bg-gold text-navy' : status === 'current' ? 'bg-cyan text-navy' : 'border border-white/20 text-mist'
                }`}
              >
                {locked ? (
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                ) : status === 'done' ? '✓' : i + 1}
              </span>
              <span>
                <span className="block font-label text-base font-bold tracking-wider uppercase">{t}</span>
                <span className={`block text-xs ${active ? 'text-navy/70' : 'text-mist'}`}>{locked ? 'Locked' : STATUS_LABEL[status]}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* ENGAGE */}
      <div role="tabpanel" id="panel-Engage" aria-labelledby="tab-Engage" hidden={tab !== 'Engage'} className="mt-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
          <div>
            {/* Tree: the Engage root with its three branches */}
            <div key={treeKey} className="cbl-tree">
              <div className="tree-root inline-flex items-center gap-3 rounded-full bg-gold py-2 pr-6 pl-2 text-navy shadow-[0_10px_40px_-12px_rgb(232_169_58/0.7)]">
                <span className="flex size-11 items-center justify-center rounded-full bg-navy font-label text-sm font-bold text-gold">1</span>
                <span className="font-label text-sm font-extrabold tracking-[0.2em] uppercase">Engage phase</span>
              </div>
              <ol className="relative">
                <span className="tree-trunk absolute top-0 bottom-[30px] left-[29px] w-0.5 rounded-full bg-gradient-to-b from-gold to-cyan" aria-hidden="true" />
                {engageSteps.map((s, i) => {
                  const active = i === engageStep;
                  return (
                    <li key={s.n} className="relative mt-4 pl-16" style={{ ['--i' as string]: i }}>
                      <span className="tree-branch absolute top-1/2 left-[29px] h-0.5 w-[35px] bg-gradient-to-r from-cyan/80 to-cyan/30" aria-hidden="true" />
                      <span className="tree-dot absolute top-1/2 left-[25px] size-2.5 -translate-y-1/2 rounded-full bg-cyan shadow-[0_0_12px_rgb(92_225_230/0.9)]" aria-hidden="true" />
                      <button
                        type="button"
                        onClick={() => setEngageStep(i)}
                        aria-pressed={active}
                        className={`tree-node flex w-full items-center gap-4 rounded-full border py-2 pr-5 pl-2 text-left transition ${
                          active ? 'border-gold/70 bg-gold/10 shadow-[0_0_30px_-10px_rgb(232_169_58/0.6)]' : 'border-white/12 bg-white/[0.03] hover:border-cyan/40'
                        }`}
                      >
                        <span className={`flex size-11 shrink-0 items-center justify-center rounded-full font-label text-sm font-bold transition ${active ? 'bg-gold text-navy' : 'bg-navy text-ink'}`}>
                          {s.n}
                        </span>
                        <span className="font-label text-sm font-semibold tracking-wider uppercase">{s.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="mt-8" aria-live="polite">
              <p className="font-label text-xs font-semibold tracking-[0.2em] text-gold uppercase">{step.label}</p>
              <p className="mt-3 font-quote text-2xl leading-relaxed text-ink md:text-3xl">{step.title}</p>
              {step.text && <p className="mt-4 text-mist">{step.text}</p>}
            </div>
          </div>
          <div className="glass overflow-hidden p-2">
            <Picture key={step.n} img={step.img} className="cbl-fade aspect-[4/3] w-full rounded-[1.25rem] bg-night object-contain" />
          </div>
        </div>

        <div className="mt-10">
          <Block label="Deliverables" title="What the Engage phase produced">
            <ListOrTodo items={e.deliverables} todo="Deliverables" />
          </Block>
        </div>
      </div>

      {/* INVESTIGATE */}
      <div role="tabpanel" id="panel-Investigate" aria-labelledby="tab-Investigate" hidden={tab !== 'Investigate'} className="mt-10">
        <p className="title-serif text-3xl md:text-5xl">
          “The challenge is set. <em>Now we investigate.</em>”
        </p>
        {investigateBlocks.length ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {investigateBlocks.map((b, i) => (
              <Block key={b.title} label={`0${i + 1}`} title={b.title}>
                {typeof b.content === 'string' ? <p className="text-mist">{b.content}</p> : <ListOrTodo items={b.content} todo={b.title} />}
              </Block>
            ))}
          </div>
        ) : (
          <p className="lead mt-8 max-w-2xl">
            The Investigate phase has just begun: our guiding questions, activities and resources will be shared here as we go.
          </p>
        )}
      </div>

      {/* ACT — rendered only once the phase is unlocked */}
      {!isLocked('Act') && (
      <div role="tabpanel" id="panel-Act" aria-labelledby="tab-Act" hidden={tab !== 'Act'} className="mt-10">
        <p className="title-serif text-3xl md:text-5xl">
          From solution <em>to impact.</em>
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <Block label="01" title="Solution">
            {data.act.solution ? <p className="text-mist">{data.act.solution}</p> : <Todo>Solution concept</Todo>}
          </Block>
          <Block label="02" title="Implementation">
            <ListOrTodo items={data.act.implementation} todo="Implementation steps" />
          </Block>
          <Block label="03" title="Evaluation">
            <ListOrTodo items={data.act.evaluation} todo="Evaluation" />
          </Block>
        </div>
      </div>
      )}
    </div>
  );
}

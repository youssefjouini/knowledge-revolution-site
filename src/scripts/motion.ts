/**
 * Site-wide motion: scroll reveals, animated counters, 3D tilt cards, drawn timelines.
 * Everything is skipped (final state shown) when the user prefers reduced motion.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Counters: <span data-count="44" data-decimals="0">44</span> ---------- */
function formatNumber(n: number, decimals: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals, useGrouping: n >= 10000 });
}
function initCounters() {
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals ?? 0);
    if (reduced || Number.isNaN(target)) return;
    const obj = { v: 0 };
    el.textContent = formatNumber(0, decimals);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(obj, {
          v: target,
          duration: target > 1000 ? 1.4 : 1.8,
          ease: 'power3.out',
          onUpdate: () => (el.textContent = formatNumber(obj.v, decimals)),
        }),
    });
  });
}

/* ---------- Reveals: data-reveal (children staggered with data-reveal-group) ---------- */
function initReveals() {
  const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  if (reduced) {
    items.forEach((el) => el.classList.add('is-revealed'));
    return;
  }
  // IntersectionObserver is robust to late layout changes (images, fonts, 3D canvas)
  let queue: HTMLElement[] = [];
  let scheduled = false;
  const flush = () => {
    scheduled = false;
    const batch = queue;
    queue = [];
    batch.forEach((el) => el.classList.add('is-revealed'));
    gsap.fromTo(
      batch,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        onComplete: () => gsap.set(batch, { clearProps: 'transform,opacity' }),
      },
    );
  };
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        queue.push(e.target as HTMLElement);
      });
      if (queue.length && !scheduled) {
        scheduled = true;
        requestAnimationFrame(flush);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  items.forEach((el) => io.observe(el));
}

/* ---------- Bars that grow: <div data-grow style="--h:45%"> ---------- */
function initGrowBars() {
  document.querySelectorAll<HTMLElement>('[data-grow]').forEach((el) => {
    if (reduced) return;
    const axis = el.dataset.grow === 'x' ? 'scaleX' : 'scaleY';
    gsap.from(el, {
      [axis]: 0,
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });
}

/* ---------- Timelines drawn on scroll: <div data-draw> ---------- */
function initDrawLines() {
  document.querySelectorAll<HTMLElement>('[data-draw]').forEach((el) => {
    if (reduced) return;
    gsap.fromTo(
      el,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        transformOrigin: 'top',
        scrollTrigger: { trigger: el.parentElement, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
      },
    );
  });
}

/* ---------- 3D tilt on hover (fine pointers only) ---------- */
function initTilt() {
  if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    const max = Number(card.dataset.tilt || 8);
    if (!card.querySelector('.tilt-glare')) {
      const glare = document.createElement('span');
      glare.className = 'tilt-glare';
      glare.setAttribute('aria-hidden', 'true');
      card.appendChild(glare);
    }
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.transform = `perspective(900px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) translateZ(0)`;
      card.style.setProperty('--gx', `${px * 100}%`);
      card.style.setProperty('--gy', `${py * 100}%`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

initReveals();
initCounters();
initGrowBars();
initDrawLines();
initTilt();

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type DependencyList, type RefObject } from 'react';

export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/**
 * FLIP: call `snapshot()` right before a state change; after the re-render,
 * every element with the same [data-flip-id] glides from its old position to the new one.
 */
export function useFlip(container: RefObject<HTMLElement | null>, deps: DependencyList, disabled: boolean) {
  const prev = useRef<Map<string, DOMRect> | null>(null);

  const snapshot = useCallback(() => {
    const el = container.current;
    if (!el || disabled) return;
    const m = new Map<string, DOMRect>();
    el.querySelectorAll<HTMLElement>('[data-flip-id]').forEach((n) => m.set(n.dataset.flipId!, n.getBoundingClientRect()));
    prev.current = m;
  }, [container, disabled]);

  useIsoLayoutEffect(() => {
    const before = prev.current;
    prev.current = null;
    const el = container.current;
    if (!before || !el) return;
    el.querySelectorAll<HTMLElement>('[data-flip-id]').forEach((n) => {
      const old = before.get(n.dataset.flipId!);
      if (!old) return;
      const now = n.getBoundingClientRect();
      const dx = old.left - now.left;
      const dy = old.top - now.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      n.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }], {
        duration: 700,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return snapshot;
}

/**
 * Reveal-on-scroll for elements matching `selector` inside `container`.
 * Elements already on screen are shown at once (no flash); the others animate in when they arrive.
 */
export function useRevealOnScroll(container: RefObject<HTMLElement | null>, selector: string, deps: DependencyList, reduced: boolean) {
  useIsoLayoutEffect(() => {
    const root = container.current;
    if (!root) return;
    const items = [...root.querySelectorAll<HTMLElement>(`${selector}:not(.is-in)`)];
    if (reduced) {
      items.forEach((i) => i.classList.add('is-in'));
      return;
    }
    const vh = window.innerHeight;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }),
      { rootMargin: '0px 0px -10% 0px' },
    );
    items.forEach((i) => {
      const r = i.getBoundingClientRect();
      if (r.top < vh * 0.9 && r.bottom > 0) i.classList.add('is-in');
      else io.observe(i);
    });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export const pad = (n: number) => String(n).padStart(2, '0');

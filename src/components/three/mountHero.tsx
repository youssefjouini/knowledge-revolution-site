import { createRoot } from 'react-dom/client';
import HeroCanvas from './HeroCanvas';

/** Mounts the WebGL hero into `el` (called lazily by HeroStage.astro). */
export function mountHero(el: HTMLElement, opts: { lite: boolean; reduced: boolean }, onReady: () => void) {
  createRoot(el).render(<HeroCanvas lite={opts.lite} reduced={opts.reduced} onReady={onReady} />);
}

import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

/**
 * Lenis ↔ ScrollTrigger wiring.
 *
 * The contract that matters: ONE raf loop for the whole app. Lenis is stepped
 * from GSAP's ticker (not its own requestAnimationFrame), and ScrollTrigger is
 * updated from Lenis's scroll event. That ordering means every frame goes
 *   ticker → lenis.raf → scroll event → ScrollTrigger.update → tweens → r3f
 * so the DOM overlays and the camera can never be a frame out of step.
 *
 * Lenis scrolls the real window, so ScrollTrigger needs no scrollerProxy — its
 * default scroller is already the thing Lenis is moving.
 */

export interface LenisHandle {
  lenis: Lenis;
  destroy: () => void;
}

export function createLenis(reducedMotion: boolean): LenisHandle {
  const lenis = new Lenis({
    // Duration is the inertia tail. ~1.1s reads as "expensive" without feeling
    // like the page is ignoring you.
    duration: reducedMotion ? 0 : 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !reducedMotion,
    // Touch smoothing fights native momentum on iOS; leave the OS to it.
    syncTouch: false,
    touchMultiplier: 1.6,
    wheelMultiplier: 1,
  });

  const onScroll = () => ScrollTrigger.update();
  lenis.on('scroll', onScroll);

  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);

  return {
    lenis,
    destroy() {
      lenis.off('scroll', onScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
    },
  };
}

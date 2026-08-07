/**
 * Single GSAP entry point. Import gsap and ScrollTrigger from here, never from
 * the package directly — that guarantees the plugin is registered exactly once
 * and keeps SSR from touching the DOM.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function registerGsap() {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  // Lenis drives the clock; GSAP's lag smoothing would fight it and cause the
  // camera to stutter when the tab is throttled.
  gsap.ticker.lagSmoothing(0);
  registered = true;
}

if (typeof window !== 'undefined') registerGsap();

/**
 * How much catch-up the master timeline has, in seconds. Lenis already adds
 * inertia; this stacks a little more so the camera settles instead of stopping
 * dead. Above ~1 it starts to feel disconnected from the wheel.
 */
export const MASTER_SCRUB = 0.5;

export { gsap, ScrollTrigger };

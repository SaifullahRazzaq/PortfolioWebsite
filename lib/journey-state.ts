/**
 * The one mutable value the whole experience reads: scroll progress, 0→1.
 *
 * This is deliberately NOT React state. It changes every frame; putting it in
 * state would re-render the tree 60×/second. Instead:
 *   - the 3D layer reads `journey.progress` inside useFrame
 *   - DOM overlays are animated by GSAP, which also reads it directly
 *   - React only hears about *section changes*, which happen ~8 times per journey
 */

import { sectionAtScroll } from './curve';
import type { SectionId } from '@/data/journey';

export interface JourneyState {
  /** Smoothed scroll progress driving the camera, 0–1. */
  progress: number;
  /** Signed change in progress last frame — used for motion blur / lean. */
  velocity: number;
  /** Current room. */
  section: SectionId;
  /** 0–1 within the current room. */
  local: number;
  /**
   * The camera's world Z, written each frame by CameraRig.
   *
   * Rooms lay their contents out along Z, so anything that needs to know "which
   * screen am I level with" wants this and not scroll progress — the two are not
   * linearly related, because the scroll→curve mapping is a monotone cubic.
   */
  cameraZ: number;
  /** True once the preloader has handed over. */
  started: boolean;
}

export const journey: JourneyState = {
  progress: 0,
  velocity: 0,
  section: 'road',
  local: 0,
  cameraZ: 70,
  started: false,
};

type SectionListener = (section: SectionId, index: number) => void;

const sectionListeners = new Set<SectionListener>();

/** Fires only when the camera crosses into a different room. */
export function onSectionChange(fn: SectionListener): () => void {
  sectionListeners.add(fn);
  return () => sectionListeners.delete(fn);
}

/**
 * Called once per frame by the master ScrollTrigger. Keep this cheap — it is on
 * the hot path.
 */
export function setJourneyProgress(next: number) {
  const previous = journey.progress;
  journey.velocity = next - previous;
  journey.progress = next;

  const { section, index, local } = sectionAtScroll(next);
  journey.local = local;

  if (section.id !== journey.section) {
    journey.section = section.id;
    for (const fn of sectionListeners) fn(section.id, index);
  }
}

declare global {
  interface Window {
    /** Dev-only handle for debugging and end-to-end checks. */
    __journey?: JourneyState;
  }
}

// Exposed outside production builds so the camera state can be inspected from
// the console or driven assertions in a headless browser. Stripped from the
// production bundle by dead-code elimination.
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  window.__journey = journey;
}

export function resetJourney() {
  journey.progress = 0;
  journey.velocity = 0;
  journey.section = 'road';
  journey.local = 0;
}

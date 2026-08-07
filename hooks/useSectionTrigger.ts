'use client';

import { useEffect, type RefObject } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { sectionById, type SectionId } from '@/data/journey';

/**
 * Gives a DOM overlay its own scroll-linked timeline over its room's slice of
 * the journey.
 *
 * Each section owns an independent ScrollTrigger, so reveals are self-contained
 * and reversible: the timeline is scrubbed, never played, which means scrolling
 * up runs it backwards exactly rather than replaying an entry animation.
 *
 * Elements marked `data-reveal` stagger in; the whole panel fades at the edges of
 * the section so content arrives as the camera does and leaves as it moves on.
 */
export function useSectionOverlay(
  id: SectionId,
  ref: RefObject<HTMLElement | null>,
  options?: {
    /** Fraction of the section spent fading in / out. */
    edge?: number;
    /** Distance in px the revealed children travel. */
    travel?: number;
    /**
     * Whether the panel fades back out at the end of its section. The rooftop
     * is the end of the journey, so its content stays put.
     */
    fadeOut?: boolean;
    /**
     * Sub-range of the section this panel occupies, as fractions of the section.
     * Defaults to the whole room. The gallery intro uses [0, 0.22] so it clears
     * before the first screen powers on instead of sitting over all nine.
     */
    range?: [number, number];
  },
) {
  const edge = options?.edge ?? 0.18;
  const travel = options?.travel ?? 44;
  const fadeOut = options?.fadeOut ?? true;
  const rangeStart = options?.range?.[0] ?? 0;
  const rangeEnd = options?.range?.[1] ?? 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const section = sectionById(id);
    const [sectionStart, sectionEnd] = section.scroll;
    const span = sectionEnd - sectionStart;
    const start = sectionStart + span * rangeStart;
    const end = sectionStart + span * rangeEnd;
    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-reveal]'));

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          // Progress fractions → pixels. Recomputed on refresh, so a resize or a
          // mobile URL-bar change cannot leave these pointing at stale offsets.
          start: () => start * ScrollTrigger.maxScroll(window),
          end: () => end * ScrollTrigger.maxScroll(window),
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // Panel opacity: in over the first `edge`, hold, out over the last.
      timeline.fromTo(
        el,
        { autoAlpha: 0 },
        { autoAlpha: 1, ease: 'power2.out', duration: edge },
        0,
      );
      if (fadeOut) {
        timeline.to(el, { autoAlpha: 0, ease: 'power2.in', duration: edge }, 1 - edge);
      }

      // Children arrive one by one just inside the fade-in.
      if (items.length) {
        timeline.fromTo(
          items,
          { y: travel, autoAlpha: 0, filter: 'blur(6px)' },
          {
            y: 0,
            autoAlpha: 1,
            filter: 'blur(0px)',
            ease: 'power2.out',
            duration: 0.34,
            stagger: 0.5 / items.length,
          },
          edge * 0.35,
        );
      }
    }, el);

    return () => ctx.revert();
  }, [id, ref, edge, travel, fadeOut, rangeStart, rangeEnd]);
}

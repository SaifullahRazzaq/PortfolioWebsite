'use client';

import { useEffect, useState, type RefObject } from 'react';
import { gsap, ScrollTrigger, MASTER_SCRUB } from '@/lib/gsap';
import { journey, onSectionChange, setJourneyProgress } from '@/lib/journey-state';
import type { SectionId } from '@/data/journey';

/**
 * THE master ScrollTrigger. There is exactly one in the app.
 *
 * It scrubs a single number 0→1 across the whole scroll spacer. Everything else
 * — camera, rooms, overlays — derives from that number. Rooms add their own
 * ScrollTriggers for *reveals*, but none of them move the camera.
 *
 * Why a tween over a proxy object rather than reading `self.progress` in
 * onUpdate: the tween gives us `scrub`, which adds a short catch-up so the
 * camera eases to a stop instead of freezing the instant the wheel does.
 */
export function useJourneyScroll(spacerRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = spacerRef.current;
    if (!el) return;

    const proxy = { p: 0 };

    const tween = gsap.to(proxy, {
      p: 1,
      ease: 'none',
      onUpdate: () => setJourneyProgress(proxy.p),
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        scrub: MASTER_SCRUB,
        // Viewport-unit heights change on mobile URL-bar show/hide; recompute
        // rather than caching a stale pixel end value.
        invalidateOnRefresh: true,
      },
    });

    // Land on the right frame if the browser restored a scroll position.
    ScrollTrigger.refresh();

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [spacerRef]);
}

/**
 * Subscribes React to *section changes only* (≈8 renders across the whole
 * journey). Never subscribe a component to raw progress.
 */
export function useCurrentSection(): SectionId {
  const [section, setSection] = useState<SectionId>(journey.section);
  useEffect(() => onSectionChange(setSection), []);
  return section;
}

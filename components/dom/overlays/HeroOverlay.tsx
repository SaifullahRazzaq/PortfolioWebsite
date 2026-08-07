'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { SplitText } from '../ui/SplitText';
import { profile } from '@/data/profile';
import { sectionById } from '@/data/journey';

/**
 * 1–2. THE ROAD → THE DOOR — the hero.
 *
 * Name and role sit in the middle of the road ahead of the camera. As the camera
 * closes on the porch the type scales up past the viewer and dissolves — it
 * reads as walking *through* the words rather than watching them fade.
 *
 * Handled outside OverlayPanel because it needs its own two-stage timeline
 * spanning both the road and the door.
 */
export function HeroOverlay() {
  const root = useRef<HTMLDivElement>(null);
  const stack = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const road = sectionById('road');
    const door = sectionById('door');

    const ctx = gsap.context(() => {
      const max = () => ScrollTrigger.maxScroll(window);

      // Stage 1 — hold, drifting slowly closer down the road.
      gsap.fromTo(
        stack.current,
        { scale: 1, y: 0 },
        {
          scale: 1.32,
          y: -30,
          ease: 'power1.in',
          scrollTrigger: {
            start: () => road.scroll[0] * max(),
            end: () => road.scroll[1] * max(),
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      // Stage 2 — the dissolve, across the door section. Blur + scale past the
      // camera, so the type appears to break apart as it passes.
      gsap.fromTo(
        stack.current,
        { autoAlpha: 1, filter: 'blur(0px)' },
        {
          autoAlpha: 0,
          scale: 3.1,
          filter: 'blur(22px)',
          ease: 'power2.in',
          scrollTrigger: {
            start: () => door.scroll[0] * max(),
            end: () => (door.scroll[0] + (door.scroll[1] - door.scroll[0]) * 0.72) * max(),
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      // The scroll hint goes early — it has done its job by 6%.
      gsap.to(hint.current, {
        autoAlpha: 0,
        y: 12,
        ease: 'none',
        scrollTrigger: {
          start: () => 0.008 * max(),
          end: () => 0.05 * max(),
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center overflow-hidden px-6"
    >
      <div ref={stack} className="w-full max-w-5xl text-center will-change-transform">
        <p className="label mb-6 text-[0.625rem] sm:text-[0.6875rem]">{profile.role}</p>

        <SplitText
          as="h2"
          section="road"
          text={profile.firstName}
          window={[0.0, 0.3]}
          className="block font-display leading-[0.86] font-bold tracking-[-0.03em] text-bone"
          charClassName="text-[clamp(3.5rem,15vw,11rem)]"
        />
        <SplitText
          as="h2"
          section="road"
          text={profile.lastName}
          window={[0.06, 0.38]}
          className="block font-display leading-[0.86] font-bold tracking-[-0.03em]"
          charClassName="text-[clamp(3.5rem,15vw,11rem)] text-[var(--journey-accent)]"
        />

        <p
          className="mx-auto mt-8 max-w-lg text-balance text-sm leading-relaxed text-bone-dim sm:text-base"
          style={{ opacity: 0.9 }}
        >
          {profile.tagline}
        </p>
      </div>

      <div
        ref={hint}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="label text-[0.5625rem]">Scroll to walk</span>
        {/* A line that travels down its own track, rather than a bouncing arrow. */}
        <span className="relative block h-10 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-4 animate-[scrollhint_1.8s_ease-in-out_infinite] bg-[var(--journey-accent)]" />
        </span>
      </div>
    </div>
  );
}

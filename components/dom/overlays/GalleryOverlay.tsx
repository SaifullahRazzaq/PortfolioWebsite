'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { Kicker, OverlayPanel } from './OverlayPanel';
import { MagneticButton } from '../ui/MagneticButton';
import { projects } from '@/data/projects';
import { sectionById } from '@/data/journey';
import { activeScreenIndex } from '@/lib/gallery-layout';
import { journey } from '@/lib/journey-state';
import type { Project } from '@/data/types';

/**
 * 5. THE GALLERY — Projects.
 *
 * An intro that clears before the first screen lights, then a persistent HUD
 * naming whichever project you are walking up to.
 *
 * The HUD carries the project's copy in real DOM text rather than leaving it all
 * on the 3D panel. A texture read at 50° from eight metres is never going to be
 * as legible as type, and on a phone there is no practical way to tap a screen
 * hanging on a wall — the HUD's button is the reliable way in.
 */
export function GalleryOverlay({ onSelect }: { onSelect: (project: Project) => void }) {
  return (
    <>
      <GalleryIntro />
      <GalleryHud onSelect={onSelect} />
    </>
  );
}

/** Title card at the mouth of the room, gone before the first screen lights. */
function GalleryIntro() {
  return (
    /*
     * Top of frame, and only the opening beat of the room.
     *
     * Centred and long-lived it sat directly on the first screens — the first
     * one is already powering on as the camera turns into the corridor, so
     * there is no window where a centred card is unobstructive.
     */
    <OverlayPanel section="gallery" place="top" edge={0.28} range={[0, 0.14]}>
      <div className="mx-auto max-w-lg pt-4">
        <Kicker>Projects</Kicker>
        <h2
          data-reveal
          className="font-display text-[clamp(1.75rem,5vw,3.75rem)] leading-[1.04] font-bold tracking-[-0.02em] text-balance text-bone"
        >
          Nine screens. Take your time.
        </h2>
        <p data-reveal className="mt-4 text-sm leading-relaxed text-bone-dim">
          Each one powers on as you reach it. Open any project for the full story.
        </p>
      </div>
    </OverlayPanel>
  );
}

/**
 * The running project readout.
 *
 * Which project is active comes from the camera's world Z, not scroll progress —
 * the scroll→curve mapping is a monotone cubic, so the two are not proportional
 * and using progress named a different project from the one lit in front of you.
 *
 * React state changes only when the *index* changes (nine times across the whole
 * room), never per frame.
 */
function GalleryHud({ onSelect }: { onSelect: (project: Project) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const project = projects[index];

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const [start, end] = sectionById('gallery').scroll;

    const cleanups: (() => void)[] = [];

    const ctx = gsap.context(() => {
      const max = () => ScrollTrigger.maxScroll(window);

      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          ease: 'power2.out',
          scrollTrigger: {
            start: () => (start + 0.015) * max(),
            end: () => (start + 0.05) * max(),
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
      gsap.to(el, {
        autoAlpha: 0,
        ease: 'power2.in',
        scrollTrigger: {
          start: () => (end - 0.035) * max(),
          end: () => end * max(),
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      /*
       * Polled on the ticker, not from ScrollTrigger.onUpdate.
       *
       * onUpdate only fires while the scroll position is changing, but the
       * camera keeps easing for a beat after the wheel stops (that is what
       * `scrub` is). Driving the readout from scroll therefore left it naming
       * the project you were passing a moment ago. Comparing an integer every
       * frame is free, and setState only runs on an actual change — nine times
       * across the whole room.
       */
      const sync = () => {
        const next = activeScreenIndex(journey.cameraZ);
        setIndex((current) => (current === next ? current : next));
      };
      gsap.ticker.add(sync);
      cleanups.push(() => gsap.ticker.remove(sync));
    }, el);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      style={{ visibility: 'hidden', opacity: 0 }}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-20 px-5 pb-6 sm:inset-x-auto sm:bottom-10 sm:left-10 sm:max-w-sm sm:px-0 sm:pb-0 md:left-14 lg:left-20"
    >
      <div className="pointer-events-auto rounded-2xl border border-white/10 bg-black/65 p-4 backdrop-blur-xl sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <div className="flex items-baseline gap-2">
          <span
            className="font-display text-2xl leading-none font-bold sm:text-3xl"
            style={{ color: project.accent }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-display text-xs text-bone-faint">
            / {String(projects.length).padStart(2, '0')}
          </span>
        </div>

        {/* key forces a fresh mount per project so the fade replays on change */}
        <div key={project.slug} className="animate-[hudin_420ms_var(--ease-out-expo)_both]">
          <h3 className="mt-2 font-display text-lg leading-tight font-semibold text-bone sm:text-2xl">
            {project.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-snug text-bone-dim sm:line-clamp-none">
            {project.tagline}
          </p>

          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 4).map((item) => (
              <li
                key={item}
                className="rounded-full border border-white/12 px-2.5 py-0.5 text-[0.625rem] text-bone-dim"
              >
                {item}
              </li>
            ))}
          </ul>

          <MagneticButton
            onClick={() => onSelect(project)}
            strength={0.18}
            className="mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-display text-[0.625rem] tracking-[0.18em] uppercase text-[#08090C] transition-opacity hover:opacity-90"
            style={{ background: project.accent }}
          >
            Open project <span aria-hidden="true">→</span>
          </MagneticButton>
        </div>

        <span className="mt-4 block h-px w-full bg-white/12">
          <span
            className="block h-px origin-left transition-transform duration-500 ease-out"
            style={{
              background: project.accent,
              transform: `scaleX(${(index + 1) / projects.length})`,
            }}
          />
        </span>
      </div>
    </div>
  );
}

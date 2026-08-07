'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { Preloader } from '@/components/dom/Preloader';
import { Cursor } from '@/components/dom/Cursor';
import { ProgressRail } from '@/components/dom/ProgressRail';
import { SkipJourney } from '@/components/dom/SkipJourney';
import { HeroOverlay } from '@/components/dom/overlays/HeroOverlay';
import { AboutOverlay } from '@/components/dom/overlays/AboutOverlay';
import { SkillsOverlay } from '@/components/dom/overlays/SkillsOverlay';
import { GalleryOverlay } from '@/components/dom/overlays/GalleryOverlay';
import { StudyOverlay } from '@/components/dom/overlays/StudyOverlay';
import { StairsOverlay } from '@/components/dom/overlays/StairsOverlay';
import { ContactOverlay } from '@/components/dom/overlays/ContactOverlay';
import { ProjectModal } from '@/components/dom/overlays/ProjectModal';
import { StaticFallback } from '@/components/dom/static/StaticFallback';
import { SemanticContent } from '@/components/dom/static/SemanticContent';
import { useJourneyScroll } from '@/hooks/useScrollProgress';
import { useQualityTier } from '@/hooks/useQualityTier';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import type { Project } from '@/data/types';

// WebGL cannot render on the server, and pulling three into the server bundle
// costs a large amount of dead weight. Load the canvas on the client only.
const Journey = dynamic(() => import('@/components/canvas/Journey').then((m) => m.Journey), {
  ssr: false,
});

/**
 * The experience shell.
 *
 * Three stacked layers, none of which scroll:
 *   z-0   the WebGL canvas (fixed)
 *   z-10  the DOM overlay layer (fixed) — text, UI, cursor
 *   —     a tall invisible spacer that exists purely to create scroll distance
 *
 * Scrolling moves nothing on screen directly. It advances a number, and the
 * camera reads that number. That indirection is what makes the whole site feel
 * like one continuous walk rather than a stack of scrolling sections.
 */
export function JourneyExperience() {
  const reducedMotion = useReducedMotion();
  const [skipped, setSkipped] = useState(false);

  // Reduced motion serves the plain layout by default, but never traps anyone
  // there — the visitor can still opt into the journey.
  const [overrideJourney, setOverrideJourney] = useState(false);
  const showStatic = (reducedMotion && !overrideJourney) || skipped;

  if (showStatic) {
    return (
      <StaticFallback
        onEnterJourney={() => {
          setSkipped(false);
          setOverrideJourney(true);
        }}
      />
    );
  }

  return (
    <LenisProvider>
      <JourneyStage onSkip={() => setSkipped(true)} />
    </LenisProvider>
  );
}

function JourneyStage({ onSkip }: { onSkip: () => void }) {
  const spacer = useRef<HTMLDivElement>(null);
  const quality = useQualityTier();

  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);

  useJourneyScroll(spacer);

  // "Ready" means the things that would visibly pop are done: fonts (the canvas
  // textures bake type into them) and a couple of frames of WebGL warm-up.
  useEffect(() => {
    let cancelled = false;
    let raf = 0;

    document.fonts.ready.then(() => {
      if (cancelled) return;
      // Two rAFs: one to let the canvas mount, one to let it draw a frame.
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => !cancelled && setReady(true));
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  const closeModal = useCallback(() => setSelected(null), []);

  return (
    <>
      {/*
        The real, crawlable, screen-reader-readable document. Visually hidden —
        sighted visitors get the canvas and the overlays, which are aria-hidden
        presentations of exactly this content.
      */}
      <SemanticContent />

      <Journey quality={quality} onSelectProject={setSelected} />

      {/* ── DOM overlay layer ────────────────────────────────────────────── */}
      <HeroOverlay />
      <AboutOverlay />
      <SkillsOverlay />
      <GalleryOverlay onSelect={setSelected} />
      <StudyOverlay />
      <StairsOverlay />
      <ContactOverlay />

      <ProgressRail />
      <SkipJourney onSkip={onSkip} />
      <Cursor />

      <ProjectModal project={selected} onClose={closeModal} />
      <Preloader ready={ready} />

      {/*
        The scroll spacer. Its height comes from `--journey-scroll`, set in the
        layout from data/journey.ts. It has to be a CSS media query rather than a
        JS check: deciding "is this mobile" in JS gives the server one height and
        the client another, which is a hydration mismatch.
      */}
      <div
        ref={spacer}
        aria-hidden="true"
        className="pointer-events-none relative w-full"
        style={{ height: 'var(--journey-scroll)' }}
      />
    </>
  );
}

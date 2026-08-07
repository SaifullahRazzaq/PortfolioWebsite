'use client';

import { useRef, type ReactNode } from 'react';
import { useSectionOverlay } from '@/hooks/useSectionTrigger';
import type { SectionId } from '@/data/journey';

/**
 * Shared shell for every room's 2D content.
 *
 * Fixed over the canvas and pointer-transparent by default — the 3D scene has to
 * stay hoverable and clickable through it. Interactive children opt back in with
 * `pointer-events-auto`.
 *
 * The panel is `aria-hidden`: this layer is a visual presentation of content that
 * already exists as a proper document in <SemanticContent>. Exposing both would
 * make a screen reader read the whole portfolio twice.
 */
export function OverlayPanel({
  section,
  place = 'left',
  className,
  children,
  edge,
  fadeOut,
  interactive = false,
  scrim = true,
  range,
}: {
  section: SectionId;
  place?: 'left' | 'right' | 'center' | 'top' | 'full';
  className?: string;
  children: ReactNode;
  edge?: number;
  fadeOut?: boolean;
  /**
   * Let the whole panel receive pointer events. Only the rooftop needs this —
   * everywhere else the canvas underneath must stay hoverable.
   */
  interactive?: boolean;
  scrim?: boolean;
  /** Sub-range of the section, as fractions. Defaults to the whole room. */
  range?: [number, number];
}) {
  const ref = useRef<HTMLDivElement>(null);
  useSectionOverlay(section, ref, { edge, fadeOut, range });

  return (
    <div
      ref={ref}
      aria-hidden={!interactive}
      inert={!interactive}
      // Starts hidden: GSAP sets autoAlpha, and without this the panel flashes
      // at full opacity for one frame before the timeline first evaluates.
      style={{ visibility: 'hidden', opacity: 0 }}
      className={`fixed inset-0 z-10 flex px-6 py-20 sm:px-10 md:px-14 lg:px-20 ${
        interactive ? 'pointer-events-auto overflow-y-auto' : 'pointer-events-none'
      }`}
    >
      {/*
        Legibility scrim. The scene behind this varies from near-black in the
        gallery to a lit dawn sky on the rooftop, and body copy cannot hold
        contrast across both. A gradient tied to where the text sits keeps the
        type readable without putting a visible box over the 3D.
      */}
      {scrim ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ backgroundImage: SCRIM[place] }}
        />
      ) : null}

      <div className={`${PLACEMENT[place]} ${className ?? ''}`}>{children}</div>
    </div>
  );
}

const PLACEMENT: Record<string, string> = {
  left: 'mt-auto mb-4 w-full max-w-xl md:mt-0 md:mb-auto md:self-center',
  right: 'mt-auto mb-4 ml-auto w-full max-w-xl md:mt-0 md:mb-auto md:self-center',
  center: 'm-auto w-full max-w-3xl text-center',
  // Pinned to the top of the frame, clear of anything at eye level.
  top: 'mx-auto mt-0 mb-auto w-full max-w-2xl text-center',
  full: 'm-auto w-full max-w-6xl',
};

const SCRIM: Record<string, string> = {
  left: 'linear-gradient(100deg, rgba(5,6,10,0.88) 0%, rgba(5,6,10,0.62) 34%, rgba(5,6,10,0) 66%)',
  right:
    'linear-gradient(260deg, rgba(5,6,10,0.88) 0%, rgba(5,6,10,0.62) 34%, rgba(5,6,10,0) 66%)',
  center:
    'radial-gradient(70% 55% at 50% 50%, rgba(5,6,10,0.82) 0%, rgba(5,6,10,0.45) 55%, rgba(5,6,10,0) 100%)',
  top: 'linear-gradient(180deg, rgba(5,6,10,0.85) 0%, rgba(5,6,10,0.4) 45%, rgba(5,6,10,0) 75%)',
  full: 'linear-gradient(180deg, rgba(5,6,10,0.5) 0%, rgba(5,6,10,0.78) 38%, rgba(5,6,10,0.9) 100%)',
};

/** Small caps label above a heading. */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <p data-reveal className="label mb-4 flex items-center gap-3">
      <span className="inline-block h-px w-8 bg-[var(--journey-accent)]" />
      {children}
    </p>
  );
}

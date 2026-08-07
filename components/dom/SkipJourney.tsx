'use client';

/**
 * Escape hatch from the experience into the plain layout.
 *
 * Deliberately always visible rather than tucked into a menu: someone who does
 * not want a 3D walkthrough should not have to hunt for the way out of one.
 */
export function SkipJourney({ onSkip }: { onSkip: () => void }) {
  return (
    <button
      onClick={onSkip}
      data-cursor="hover"
      className="pointer-events-auto fixed top-4 right-4 z-40 rounded-full border border-white/12 bg-black/40 px-3 py-1.5 font-display text-[0.5rem] tracking-[0.18em] uppercase text-bone-dim backdrop-blur-md transition-colors hover:border-[var(--journey-cool)] hover:text-bone sm:px-4 sm:py-2 sm:text-[0.5625rem] md:top-5 md:right-auto md:left-5"
    >
      Skip the journey
    </button>
  );
}

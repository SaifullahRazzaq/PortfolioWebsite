'use client';

import { useCurrentSection } from '@/hooks/useScrollProgress';
import { useLenis } from '@/components/providers/LenisProvider';
import { sections } from '@/data/journey';

/**
 * Journey navigation, pinned to the right edge.
 *
 * Doubles as the keyboard route through the site: every room is a real button in
 * DOM order, so tabbing walks the camera from the road to the rooftop. That is
 * the whole keyboard-navigation story — there is no separate "skip to section"
 * mechanism to keep in sync.
 */
export function ProgressRail() {
  const active = useCurrentSection();
  const lenis = useLenis();

  const goTo = (progress: number) => {
    const max = document.body.scrollHeight - window.innerHeight;
    // Land clearly *inside* the room, not on its boundary: arriving exactly on
    // the edge leaves the overlay mid-fade and the rail flickering between two
    // sections.
    lenis?.current?.scrollTo((progress + 0.015) * max, { duration: 1.5 });
  };

  return (
    <nav
      aria-label="Journey sections"
      className="pointer-events-auto fixed top-1/2 right-4 z-30 hidden -translate-y-1/2 md:block lg:right-6"
    >
      <ul className="flex flex-col gap-1">
        {sections.map((section) => {
          const isActive = section.id === active;
          return (
            <li key={section.id}>
              <button
                onClick={() => goTo(section.scroll[0])}
                aria-current={isActive ? 'true' : undefined}
                data-cursor="hover"
                className="group flex items-center justify-end gap-3 py-1.5 pl-3"
              >
                <span
                  className={`font-display text-[0.5625rem] tracking-[0.2em] uppercase transition-all duration-300 ${
                    isActive
                      ? 'text-bone opacity-100'
                      : 'text-bone-faint opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
                  }`}
                >
                  {section.label}
                </span>
                <span
                  aria-hidden="true"
                  className={`block h-px transition-all duration-300 ${
                    isActive
                      ? 'w-8 bg-[var(--journey-accent)]'
                      : 'w-4 bg-bone/25 group-hover:w-6 group-hover:bg-bone/50'
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

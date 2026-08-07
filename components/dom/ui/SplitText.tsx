'use client';

import { useEffect, useRef, type ElementType } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { sectionById, type SectionId } from '@/data/journey';

/**
 * Splits text into characters and reveals them with a stagger, scrubbed against
 * the owning room's scroll range.
 *
 * The full string stays in the DOM as an `aria-label` on the wrapper and each
 * span is `aria-hidden`, so screen readers get one clean phrase instead of a
 * letter-by-letter reading.
 */
export function SplitText({
  text,
  as: Tag = 'span',
  section,
  className,
  /** Where in the section the reveal runs, as fractions of the section. */
  window: revealWindow = [0.05, 0.45],
  charClassName,
}: {
  text: string;
  as?: ElementType;
  section: SectionId;
  className?: string;
  window?: [number, number];
  charClassName?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  // A bare `ElementType` collapses the props to `never` for a polymorphic tag.
  // Narrow it to "an intrinsic element that takes HTML attributes and a ref",
  // which is exactly what the callers pass ('h2', 'p', 'span').
  const Component = Tag as React.ComponentType<
    React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
  >;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const chars = Array.from(el.querySelectorAll<HTMLElement>('[data-char]'));
    if (!chars.length) return;

    const [sectionStart, sectionEnd] = sectionById(section).scroll;
    const span = sectionEnd - sectionStart;
    const from = sectionStart + span * revealWindow[0];
    const to = sectionStart + span * revealWindow[1];

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: 'power3.out',
          stagger: { each: 0.5 / chars.length },
          scrollTrigger: {
            start: () => from * ScrollTrigger.maxScroll(window),
            end: () => to * ScrollTrigger.maxScroll(window),
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [section, revealWindow]);

  return (
    <Component ref={ref} className={className} aria-label={text}>
      {text.split(' ').map((word, wordIndex) => (
        // Words never break mid-way: each word is its own inline-block.
        <span key={wordIndex} className="inline-block overflow-hidden align-bottom" aria-hidden="true">
          {Array.from(word).map((char, charIndex) => (
            <span key={charIndex} data-char className={`inline-block ${charClassName ?? ''}`}>
              {char}
            </span>
          ))}
          {wordIndex < text.split(' ').length - 1 ? <span className="inline-block">&nbsp;</span> : null}
        </span>
      ))}
    </Component>
  );
}

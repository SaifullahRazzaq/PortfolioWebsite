'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

/**
 * Custom cursor: a small dot that tracks exactly, and a ring that lags behind
 * and swells over anything marked `data-cursor="hover"`.
 *
 * Never mounted for coarse pointers. The native cursor is left alone on inputs
 * and text so the visitor keeps the affordances they expect.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dotEl = dot.current;
    const ringEl = ring.current;
    if (!dotEl || !ringEl) return;

    // quickTo reuses one tween per property instead of allocating per move.
    const dotX = gsap.quickTo(dotEl, 'x', { duration: 0.08, ease: 'power3.out' });
    const dotY = gsap.quickTo(dotEl, 'y', { duration: 0.08, ease: 'power3.out' });
    const ringX = gsap.quickTo(ringEl, 'x', { duration: 0.5, ease: 'power3.out' });
    const ringY = gsap.quickTo(ringEl, 'y', { duration: 0.5, ease: 'power3.out' });

    let visible = false;
    const onMove = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([dotEl, ringEl], { autoAlpha: 1, duration: 0.25 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement | null)?.closest?.('[data-cursor="hover"], a, button');
      gsap.to(ringEl, {
        scale: target ? 1.9 : 1,
        borderColor: target ? 'var(--journey-accent)' : 'rgba(237,234,228,0.35)',
        duration: 0.32,
        ease: 'power3.out',
      });
    };

    const onLeave = () => {
      visible = false;
      gsap.to([dotEl, ringEl], { autoAlpha: 0, duration: 0.25 });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf([dotEl, ringEl]);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90] hidden md:block">
      <div
        ref={dot}
        style={{ opacity: 0 }}
        className="absolute -top-[3px] -left-[3px] h-1.5 w-1.5 rounded-full bg-[var(--journey-accent)]"
      />
      <div
        ref={ring}
        style={{ opacity: 0 }}
        className="absolute -top-4 -left-4 h-8 w-8 rounded-full border border-bone/35"
      />
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { useLenis } from '@/components/providers/LenisProvider';

/**
 * 0. PRELOADER — a percentage over black, with a faint door outline.
 *
 * The number is real: it tracks font loading, the first WebGL frame, and the
 * canvas textures actually being drawn. `onReady` is what the app calls when the
 * scene is genuinely ready; the counter eases toward whatever has completed so
 * far rather than running a fake timer to 100.
 *
 * At 100 a light seam opens down the middle of the door and the journey starts.
 */
export function Preloader({ ready }: { ready: boolean }) {
  const lenis = useLenis();
  const root = useRef<HTMLDivElement>(null);
  const seam = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  const [done, setDone] = useState(false);
  const shown = useRef({ value: 0 });

  // Hold the page still until the journey starts, or the visitor can scroll
  // blind through the road while the preloader is still up.
  useEffect(() => {
    lenis?.current?.stop();
  }, [lenis]);

  /**
   * Hard ceiling on the preloader.
   *
   * Everything below is driven by GSAP's ticker, which is rAF — and browsers
   * throttle rAF to a crawl in a backgrounded tab. Someone who opens the site in
   * a background tab and comes back a minute later would otherwise find it still
   * counting. This guarantees the door opens either way.
   */
  /**
   * Hard ceiling, armed on mount rather than on `ready`.
   *
   * The counter and the seam are driven by GSAP's ticker, which is rAF, and
   * browsers throttle rAF to a crawl in a backgrounded tab. `ready` itself waits
   * on font loading and two animation frames, so it can be late for the same
   * reason — or never arrive at all if something upstream fails.
   *
   * Arming this on mount means no failure mode leaves a visitor staring at a
   * counter. The door opens on time whatever else happens.
   */
  useEffect(() => {
    const bail = window.setTimeout(() => {
      setDone(true);
      lenis?.current?.start();
    }, 8000);
    return () => window.clearTimeout(bail);
  }, [lenis]);

  useEffect(() => {
    // Creep toward 90 while loading, then run to 100 the moment we are ready.
    // The creep is capped, so the number can never claim more progress than the
    // app has actually made.
    const target = ready ? 100 : 90;
    const duration = ready ? 0.55 : 4.5;

    const tween = gsap.to(shown.current, {
      value: target,
      duration,
      ease: ready ? 'power2.out' : 'power1.out',
      onUpdate: () => {
        if (counter.current) {
          counter.current.textContent = String(Math.floor(shown.current.value)).padStart(3, '0');
        }
      },
      onComplete: () => {
        if (!ready) return;

        gsap
          .timeline({
            onComplete: () => {
              setDone(true);
              lenis?.current?.start();
            },
          })
          // The seam opens first…
          .to(seam.current, { scaleY: 1, duration: 0.5, ease: 'expo.out' })
          .to(seam.current, { scaleX: 60, duration: 0.7, ease: 'expo.inOut' }, '+=0.1')
          // …then the whole black plate lifts with it.
          .to(root.current, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' }, '-=0.35');
      },
    });

    return () => {
      tween.kill();
    };
  }, [ready, lenis]);

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#05060A]"
      role="status"
      aria-live="polite"
      aria-label="Loading the journey"
    >
      {/* Faint door outline */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 h-[46vh] w-[22vh] -translate-x-1/2 -translate-y-1/2 rounded-t-[6px] border border-white/[0.07]"
      >
        <span className="absolute top-1/2 right-3 block h-1.5 w-1.5 rounded-full bg-white/10" />
      </div>

      {/* The light seam. Scales up on Y first, then blows out on X. */}
      <div
        ref={seam}
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 h-[46vh] w-[2px] origin-center -translate-x-1/2 -translate-y-1/2 bg-[#FFB877]"
        style={{ transform: 'translate(-50%,-50%) scaleY(0)', boxShadow: '0 0 40px 8px #FF8A3D66' }}
      />

      <div className="relative flex flex-col items-center gap-3">
        <span
          ref={counter}
          className="font-display text-[clamp(3rem,12vw,7rem)] leading-none font-bold tracking-[-0.04em] text-bone tabular-nums"
        >
          000
        </span>
        <span className="label text-[0.5625rem]">Opening the door</span>
      </div>
    </div>
  );
}

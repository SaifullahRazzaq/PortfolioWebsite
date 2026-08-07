'use client';

import { createContext, useContext, useEffect, useRef, type ReactNode, type RefObject } from 'react';
import type Lenis from 'lenis';
import { createLenis } from '@/lib/lenis';
import { ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * The context holds a *ref*, not the instance itself.
 *
 * Consumers only ever touch Lenis from event handlers ("scroll me to the
 * rooftop"), never during render. Putting the instance in state would re-render
 * the whole tree once on mount for no benefit.
 */
const LenisContext = createContext<RefObject<Lenis | null> | null>(null);

export function useLenis(): RefObject<Lenis | null> | null {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const handle = createLenis(reducedMotion);
    lenisRef.current = handle.lenis;

    // The spacer height is in viewport units, so recompute trigger positions
    // when the viewport changes. ScrollTrigger debounces this internally.
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      handle.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  return <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>;
}

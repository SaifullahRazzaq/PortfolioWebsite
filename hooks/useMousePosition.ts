'use client';

import { useEffect, useRef } from 'react';

export interface Pointer {
  /** -1 → 1, origin at viewport centre. */
  x: number;
  y: number;
}

/**
 * Normalised pointer position in a ref, not state — it is read inside useFrame
 * for camera parallax and must never trigger a render.
 */
export function useMousePosition() {
  const pointer = useRef<Pointer>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    // Recentre when the pointer leaves so the scene settles instead of sticking.
    const onLeave = () => {
      pointer.current.x = 0;
      pointer.current.y = 0;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerout', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerout', onLeave);
    };
  }, []);

  return pointer;
}

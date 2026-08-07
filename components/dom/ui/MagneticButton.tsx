'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { gsap } from '@/lib/gsap';

/**
 * A control that leans toward the pointer as it approaches, then springs back.
 *
 * Uses quickTo rather than a tween per pointermove — quickTo reuses one tween
 * instance, so a fast drag across the button does not allocate a new tween on
 * every frame.
 *
 * Disabled entirely for coarse pointers: there is no hover on touch, and the
 * transform would just fight the tap.
 */
export function MagneticButton({
  children,
  className,
  strength = 0.32,
  as = 'button',
  ...props
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: 'button' | 'a';
} & React.HTMLAttributes<HTMLElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const moveX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const moveY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      moveX((e.clientX - (rect.left + rect.width / 2)) * strength);
      moveY((e.clientY - (rect.top + rect.height / 2)) * strength);
    };
    const onLeave = () => {
      moveX(0);
      moveY(0);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(el);
    };
  }, [strength]);

  // A bare `ElementType` collapses the props to `never` for a polymorphic tag.
  // Narrow it to "an element taking anchor/button attributes and a ref".
  const Component = as as unknown as React.ComponentType<
    React.AnchorHTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
  >;

  return (
    <Component ref={ref} className={className} data-cursor="hover" {...props}>
      {children}
    </Component>
  );
}

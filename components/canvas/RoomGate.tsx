'use client';

import { useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { sections, type SectionId } from '@/data/journey';
import { journey } from '@/lib/journey-state';

/**
 * Manual distance culling.
 *
 * Only the room the camera is in and its immediate neighbours are drawn; the
 * rest have `visible = false`, which costs nothing on the GPU and skips the
 * whole subtree during render.
 *
 * Visibility rather than unmounting is deliberate. Unmounting would free a
 * little memory but rebuild geometry on re-entry, and the resulting hitch is
 * exactly what you notice when scrubbing back and forth across a doorway. The
 * rooms are procedural and low-poly, so keeping them resident is the cheaper
 * trade.
 */
export function RoomGate({
  id,
  /** How many rooms either side stay visible. */
  radius = 1,
  children,
}: {
  id: SectionId;
  radius?: number;
  children: ReactNode;
}) {
  const group = useRef<Group>(null);
  const index = sections.findIndex((s) => s.id === id);

  useFrame(() => {
    if (!group.current) return;
    const active = sections.findIndex((s) => s.id === journey.section);
    group.current.visible = Math.abs(active - index) <= radius;
  });

  return <group ref={group}>{children}</group>;
}

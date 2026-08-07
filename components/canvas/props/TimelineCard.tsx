'use client';

import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { CanvasTexture, Group, MeshBasicMaterial } from 'three';
import { damp, smoothstep } from '@/lib/curve';
import { drawTimelineCard } from '@/lib/screenTexture';
import { useQuality } from '../QualityContext';
import type { TimelineEntry } from '@/data/types';

/**
 * A holographic timeline card above the desk in The Study.
 *
 * Cards rise and stack as the camera passes the desk. Each has its own trigger
 * offset so they arrive one after another rather than as a block.
 */

interface TimelineCardProps {
  entry: TimelineEntry;
  index: number;
  /** Where the card rests once it has arrived. */
  restPosition: [number, number, number];
  /** Camera Z at which this card is fully in. */
  focusZ: number;
  accent: string;
}

const WIDTH = 1.9;
const HEIGHT = 0.95; // matches the 768×384 texture

export function TimelineCard({ entry, index, restPosition, focusZ, accent }: TimelineCardProps) {
  const group = useRef<Group>(null);
  const material = useRef<MeshBasicMaterial>(null);
  const [texture, setTexture] = useState<CanvasTexture | null>(null);
  const maxAnisotropy = useThree((s) => s.gl.capabilities.getMaxAnisotropy());
  const pixelScale = useQuality().tier === 'low' ? 0.7 : 1;
  const reveal = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let created: CanvasTexture | null = null;

    // Staggered for the same reason as the gallery screens: no allocation spike.
    let timer = 0;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      timer = window.setTimeout(() => {
        if (cancelled) return;
        created = drawTimelineCard(entry, accent, maxAnisotropy, pixelScale);
        setTexture(created);
      }, 420 + index * 45);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      created?.dispose();
    };
  }, [entry, accent, index, maxAnisotropy, pixelScale]);

  // Swapping in a map changes the shader defines; three needs telling.
  useEffect(() => {
    if (!material.current || !texture) return;
    material.current.map = texture;
    material.current.needsUpdate = true;
  }, [texture]);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 20);
    const distance = Math.abs(state.camera.position.z - focusZ);
    const target = 1 - smoothstep(3, 9, distance);

    reveal.current = damp(reveal.current, target, 4, dt);
    const eased = smoothstep(0, 1, reveal.current);

    if (group.current) {
      // Rise into place from below and behind, with a slight settling tilt.
      group.current.position.set(
        restPosition[0] + (1 - eased) * 0.7,
        restPosition[1] - (1 - eased) * 0.9,
        restPosition[2],
      );
      group.current.rotation.z = (1 - eased) * -0.12;
      // Faces the approaching camera, which arrives from the -X side.
      group.current.rotation.y =
        0.34 - (1 - eased) * 0.25 + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.012;
    }
    if (material.current) {
      material.current.opacity = eased * 0.94;
    }
  });

  return (
    <group ref={group} position={restPosition}>
      <mesh>
        <planeGeometry args={[WIDTH, HEIGHT]} />
        <meshBasicMaterial
          ref={material}
          map={texture}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group, MeshStandardMaterial } from 'three';
import { clamp01, damp, smoothstep } from '@/lib/curve';

/**
 * A framed panel on a hallway wall.
 *
 * Slides in from its own wall and lights up as the camera draws level with it,
 * then dims once it is behind. Both are driven off camera-Z rather than a
 * timeline, so the effect is symmetric when scrubbing backwards for free.
 */

interface FramedPanelProps {
  /** World position of the panel centre. */
  position: [number, number, number];
  /** -1 = left wall (slides in from the left), 1 = right wall. */
  side: -1 | 1;
  width?: number;
  height?: number;
  accent?: string;
  /** Camera-Z at which this panel is fully lit. */
  focusZ: number;
}

export function FramedPanel({
  position,
  side,
  width = 1.6,
  height = 1.1,
  accent = '#FF8A3D',
  focusZ,
}: FramedPanelProps) {
  const group = useRef<Group>(null);
  const inner = useRef<MeshStandardMaterial>(null);
  const progress = useRef(0);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 20);
    const cameraZ = state.camera.position.z;

    // 1 when the camera is level with the panel, falling off over ~7 metres.
    const distance = Math.abs(cameraZ - focusZ);
    const target = 1 - clamp01(distance / 7);

    progress.current = damp(progress.current, target, 4, dt);
    const eased = smoothstep(0, 1, progress.current);

    if (group.current) {
      // Slide in from inside its own wall, and settle flush.
      group.current.position.x = position[0] + side * (1 - eased) * 0.9;
      group.current.position.y = position[1] - (1 - eased) * 0.25;
    }
    if (inner.current) {
      inner.current.emissiveIntensity = 0.25 + eased * 1.9;
      inner.current.opacity = 0.35 + eased * 0.65;
    }
  });

  return (
    <group ref={group} position={position} rotation={[0, side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}>
      {/* Frame */}
      <mesh castShadow>
        <boxGeometry args={[width + 0.09, height + 0.09, 0.05]} />
        <meshStandardMaterial color="#0B0C10" roughness={0.55} metalness={0.55} />
      </mesh>
      {/* Lit face */}
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          ref={inner}
          color="#15100C"
          emissive={accent}
          emissiveIntensity={0.25}
          transparent
          opacity={0.35}
          roughness={0.85}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

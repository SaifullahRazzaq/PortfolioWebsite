'use client';

import { useMemo } from 'react';
import { CylinderGeometry, MeshStandardMaterial } from 'three';

/**
 * A sodium streetlamp: pole, arm, and a glowing head.
 *
 * The head is emissive rather than lit — the actual illumination comes from one
 * cheap shadowless point light. Emissive geometry is what Bloom picks up, so the
 * lamp reads as a light source even though it barely costs anything.
 */

interface StreetlightProps {
  position: [number, number, number];
  /** -1 arm points left (lamp on the right verge), +1 points right. */
  facing?: 1 | -1;
  color?: string;
}

export function Streetlight({
  position,
  facing = -1,
  color = '#FF8A3D',
}: StreetlightProps) {
  // Shared across every lamp on the road — 8 lamps, one geometry, one material.
  const poleGeometry = useMemo(() => new CylinderGeometry(0.09, 0.13, 7, 6), []);
  const armGeometry = useMemo(() => new CylinderGeometry(0.07, 0.07, 1.9, 6), []);
  const metal = useMemo(
    () => new MeshStandardMaterial({ color: '#14161C', roughness: 0.55, metalness: 0.7 }),
    [],
  );

  return (
    <group position={position}>
      <mesh geometry={poleGeometry} material={metal} position={[0, 3.5, 0]} />
      <mesh
        geometry={armGeometry}
        material={metal}
        position={[facing * 0.9, 6.9, 0]}
        rotation={[0, 0, Math.PI / 2]}
      />

      {/* Lamp housing */}
      <mesh position={[facing * 1.75, 6.85, 0]}>
        <boxGeometry args={[0.62, 0.14, 0.34]} />
        <meshStandardMaterial color="#14161C" roughness={0.5} metalness={0.7} />
      </mesh>

      {/*
        The lit lens, facing down. A flat emissive plane rather than an open cone:
        an open-ended cone shows its silhouette edge-on and reads as a flat
        triangle floating in the dark, which is exactly what it looked like.
      */}
      <mesh position={[facing * 1.75, 6.76, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.52, 0.26]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>

      {/*
        Shadowless: eight shadow-casting point lights on the road would cost more
        than the entire rest of the scene, and the fog sells the falloff anyway.
      */}
      
    </group>
  );
}

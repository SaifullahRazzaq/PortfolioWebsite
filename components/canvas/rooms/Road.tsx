'use client';

import { useMemo } from 'react';
import { Streetlight } from '../props/Streetlight';

/**
 * 1. THE ROAD — the opening shot.
 *
 * A wet night street running from z≈90 down to the house facade at z≈0. The
 * camera starts at z=70 and is pulled toward the door.
 *
 * Everything here exists to make the house read as a destination: the lamps
 * converge, the reflection doubles them, and the fog hides the fact that the
 * world ends 90 metres out.
 */

/** Lamp spacing down the road. Alternating sides gives the drive-in rhythm. */
const LAMP_POSITIONS: { z: number; side: 1 | -1 }[] = [
  { z: 78, side: 1 },
  { z: 66, side: -1 },
  { z: 54, side: 1 },
  { z: 42, side: -1 },
  { z: 30, side: 1 },
  { z: 18, side: -1 },
  { z: 8, side: 1 },
];

export function Road() {

  // Silhouetted low buildings either side, so the fog has something in it.
  const skyline = useMemo(() => {
    const out: { position: [number, number, number]; scale: [number, number, number] }[] = [];
    let seed = 7;
    const random = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };
    for (let i = 0; i < 22; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const z = 92 - i * 4.2 - random() * 3;
      const height = 5 + random() * 11;
      const depth = 5 + random() * 6;
      out.push({
        position: [side * (13 + random() * 7), height / 2, z],
        scale: [4 + random() * 5, height, depth],
      });
    }
    return out;
  }, []);

  return (
    <group>
      {/* ── Wet asphalt ──────────────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 45]} receiveShadow>
        <planeGeometry args={[24, 110]} />
                {/* A glossy standard material, not MeshReflectorMaterial. A real
            reflection pass re-renders the whole scene into a texture every
            frame, and three of them (road, hallway, gallery) was the largest
            single cost in the app — enough to make scrolling stutter. */}
<meshStandardMaterial color="#0A0B10" roughness={0.62} metalness={0.35} />
      </mesh>

      {/* Centre line — dashes read as motion as the camera moves. */}
      {Array.from({ length: 16 }, (_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.012, 6 + i * 5.6]}
        >
          <planeGeometry args={[0.16, 2.4]} />
          <meshStandardMaterial
            color="#3A3630"
            emissive="#FFB877"
            emissiveIntensity={0.35}
            roughness={0.9}
          />
        </mesh>
      ))}

      {/* ── Verges ───────────────────────────────────────────────────────── */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 13, 0.15, 45]} receiveShadow>
          <boxGeometry args={[6, 0.3, 110]} />
          <meshStandardMaterial color="#0B0C11" roughness={0.95} />
        </mesh>
      ))}

      {/* ── Lamps ────────────────────────────────────────────────────────── */}
      {LAMP_POSITIONS.map((lamp) => (
        <Streetlight
          key={lamp.z}
          position={[lamp.side * 8.2, 0, lamp.z]}
          facing={lamp.side === 1 ? -1 : 1}
        />
      ))}

      {/* ── Distant skyline ──────────────────────────────────────────────── */}
      {skyline.map((building, i) => (
        <mesh key={i} position={building.position} scale={building.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#080910" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

'use client';

import { FramedPanel } from '../props/FramedPanel';

/**
 * 3. THE HALLWAY — About.
 *
 * A 5m-wide corridor running from the door (z=0) to the workshop opening
 * (z≈-22). Framed panels alternate left/right down the walls and light up as the
 * camera draws level; the bio itself is set in the DOM overlay above.
 */

const HALF_WIDTH = 2.5;
const HEIGHT = 3.2;
const START_Z = 0.5;
const END_Z = -23;
const LENGTH = START_Z - END_Z;
const CENTRE_Z = (START_Z + END_Z) / 2;

/** Alternating panels. `focusZ` is where each becomes fully lit. */
const PANELS: { z: number; side: -1 | 1 }[] = [
  { z: -4.5, side: -1 },
  { z: -8.5, side: 1 },
  { z: -12.5, side: -1 },
  { z: -16.5, side: 1 },
  { z: -20, side: -1 },
];

export function Hallway() {

  return (
    <group>
      {/* ── Floor ────────────────────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, CENTRE_Z]} receiveShadow>
        <planeGeometry args={[HALF_WIDTH * 2, LENGTH]} />
                {/* A glossy standard material, not MeshReflectorMaterial. A real
            reflection pass re-renders the whole scene into a texture every
            frame, and three of them (road, hallway, gallery) was the largest
            single cost in the app — enough to make scrolling stutter. */}
<meshStandardMaterial color="#0E0C0A" roughness={0.8} metalness={0.15} />
      </mesh>

      {/* ── Walls ────────────────────────────────────────────────────────── */}
      {([-1, 1] as const).map((side) => (
        <mesh
          key={side}
          position={[side * HALF_WIDTH, HEIGHT / 2, CENTRE_Z]}
          rotation={[0, side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}
          receiveShadow
        >
          <planeGeometry args={[LENGTH, HEIGHT]} />
          {/* Matte, slightly warm plaster. Roughness near 1 keeps the sconces
              soft instead of putting hard specular hits on the walls. */}
          <meshStandardMaterial color="#1A1614" roughness={0.97} />
        </mesh>
      ))}

      {/* ── Ceiling ──────────────────────────────────────────────────────── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, HEIGHT, CENTRE_Z]}>
        <planeGeometry args={[HALF_WIDTH * 2, LENGTH]} />
        <meshStandardMaterial color="#121011" roughness={1} />
      </mesh>

      {/* ── Skirting, to stop the floor/wall join reading as a seam ──────── */}
      {([-1, 1] as const).map((side) => (
        <mesh key={side} position={[side * (HALF_WIDTH - 0.04), 0.06, CENTRE_Z]}>
          <boxGeometry args={[0.08, 0.12, LENGTH]} />
          <meshStandardMaterial color="#0A0908" roughness={0.9} />
        </mesh>
      ))}

      {/* ── Panels ───────────────────────────────────────────────────────── */}
      {PANELS.map((panel) => (
        <FramedPanel
          key={panel.z}
          position={[panel.side * (HALF_WIDTH - 0.06), 1.75, panel.z]}
          side={panel.side}
          focusZ={panel.z}
          accent={panel.side === -1 ? '#FF8A3D' : '#FFB877'}
        />
      ))}

      {/* ── Sconces ──────────────────────────────────────────────────────── */}
      {[-2.5, -7, -11.5, -16, -20.5].map((z, i) => (
        <group key={z}>
          <mesh position={[(i % 2 === 0 ? 1 : -1) * (HALF_WIDTH - 0.12), 2.55, z]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            {/*
              Kept just under the bloom threshold. Pushed higher, each sconce
              turns into a blown-out disc that eats the wall behind it and the
              body copy in front of it.
            */}
            <meshStandardMaterial
              color="#FFC48A"
              emissive="#FF8A3D"
              emissiveIntensity={1.3}
              toneMapped={false}
            />
          </mesh>
          
        </group>
      ))}
    </group>
  );
}

'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, DoubleSide, type Group, type Mesh } from 'three';
import { clamp01, smoothstep } from '@/lib/curve';
import { journey } from '@/lib/journey-state';
import { sectionById } from '@/data/journey';

/**
 * 2. THE DOOR — the house facade, and the door that swings open on scroll.
 *
 * The facade sits at z=0 with a doorway punched through the middle. The camera
 * passes through that opening at scroll ≈22%.
 *
 * The swing is driven directly off scroll progress rather than a GSAP timeline:
 * it is a single continuous rotation tied to one number, so scrubbing backwards
 * closes the door exactly as it opened, with no timeline state to get out of
 * sync.
 */

const DOOR_WIDTH = 1.5;
const DOOR_HEIGHT = 3.1;
const OPENING_HALF = DOOR_WIDTH;

export function Door() {
  const hinge = useRef<Group>(null);
  const godray = useRef<Mesh>(null);

  const doorSection = useMemo(() => sectionById('door'), []);

  useFrame(() => {
    const [start, end] = doorSection.scroll;
    // Local progress across the door section, but shifted early: the door should
    // be fully open a little before the camera reaches the threshold, otherwise
    // it looks like the camera walks through a closing door.
    const local = clamp01((journey.progress - start) / (end - start));
    const swing = smoothstep(0.0, 0.62, local);

    if (hinge.current) {
      // Opens inward, away from the camera.
      hinge.current.rotation.y = -swing * Math.PI * 0.62;
    }
    if (godray.current) {
      const material = godray.current.material as { opacity: number };
      // The shaft fades back out once the camera is inside it, or it becomes a
      // white wall across the lens.
      material.opacity = swing * 0.5 * (1 - smoothstep(0.55, 0.95, local));
      godray.current.scale.setScalar(0.7 + swing * 0.5);
    }
  });

  return (
    <group>
      {/* ── Facade ───────────────────────────────────────────────────────── */}
      {/* Built as four slabs around the opening rather than one wall with a
          hole, which avoids needing CSG for a shape this simple. */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (OPENING_HALF + 4.5), 3.5, 0]} castShadow>
          <boxGeometry args={[9, 7, 0.5]} />
          <meshStandardMaterial color="#15161C" roughness={0.92} />
        </mesh>
      ))}
      {/* Above the door */}
      <mesh position={[0, (DOOR_HEIGHT + 7) / 2 + 0.05, 0]}>
        <boxGeometry args={[OPENING_HALF * 2, 7 - DOOR_HEIGHT - 0.1, 0.5]} />
        <meshStandardMaterial color="#15161C" roughness={0.92} />
      </mesh>

      {/* Warm-lit windows either side — the house looks occupied. */}
      {[-4.4, 4.4].map((x) => (
        <mesh key={x} position={[x, 4.4, -0.28]}>
          <planeGeometry args={[1.7, 1.2]} />
          <meshStandardMaterial
            color="#FFB877"
            emissive="#FF8A3D"
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Porch roof + step */}
      <mesh position={[0, 7.15, 1.4]} castShadow>
        <boxGeometry args={[7, 0.3, 3.4]} />
        <meshStandardMaterial color="#101116" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.09, 1.6]} receiveShadow>
        <boxGeometry args={[6, 0.18, 3.6]} />
        <meshStandardMaterial color="#0E0F14" roughness={0.95} />
      </mesh>

      {/* Porch lamp */}
      <mesh position={[2.4, 5.2, 0.6]}>
        <sphereGeometry args={[0.16, 10, 10]} />
        <meshStandardMaterial
          color="#FFC48A"
          emissive="#FF8A3D"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      {/* ── The door itself ──────────────────────────────────────────────── */}
      {/* The group is the hinge: offset the panel by half its width inside a
          group placed at the jamb, so rotating the group swings the panel. */}
      <group ref={hinge} position={[-OPENING_HALF, 0, 0]}>
        <mesh position={[DOOR_WIDTH / 2, DOOR_HEIGHT / 2, 0]} castShadow>
          <boxGeometry args={[DOOR_WIDTH * 2, DOOR_HEIGHT, 0.1]} />
          <meshStandardMaterial color="#1C1712" roughness={0.7} metalness={0.1} />
        </mesh>
        {/* Handle */}
        <mesh position={[DOOR_WIDTH * 1.75, DOOR_HEIGHT / 2, 0.1]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial color="#C9A46B" roughness={0.3} metalness={0.9} />
        </mesh>
      </group>

      {/*
        Volumetric-ish shaft: an additive, double-sided cone. A real volumetric
        pass is not worth its cost for one doorway, and this reads the same at
        the angle the camera actually approaches from.
      */}
      <mesh ref={godray} position={[0, 1.6, 2.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[1.9, 6, 16, 1, true]} />
        <meshBasicMaterial
          color="#FFB877"
          transparent
          opacity={0}
          blending={AdditiveBlending}
          depthWrite={false}
          side={DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

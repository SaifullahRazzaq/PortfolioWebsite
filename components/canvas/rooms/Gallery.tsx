'use client';

import { ProjectScreen } from '../props/ProjectScreen';
import { projects } from '@/data/projects';
import {
  GALLERY_END_Z,
  GALLERY_HALF_WIDTH as HALF_W,
  GALLERY_HEIGHT as HEIGHT,
  GALLERY_START_Z,
  screenPlacements,
} from '@/lib/gallery-layout';
import type { Project } from '@/data/types';

/**
 * 5. THE GALLERY — Projects. The hero section.
 *
 * A long, deliberately dark room. Nine screens alternate between the two walls,
 * each angled back toward the approaching camera, and each powers on as the
 * camera draws level. The room has almost no ambient light of its own, so the
 * screens are the brightest thing in frame and the eye goes where it should.
 *
 * Geometry positions come from lib/gallery-layout, which the camera rig also
 * reads so its glance always matches where the screens actually are.
 */

const LENGTH = GALLERY_START_Z - GALLERY_END_Z;
const CENTRE_Z = (GALLERY_START_Z + GALLERY_END_Z) / 2;

export function Gallery({ onSelect }: { onSelect: (project: Project) => void }) {

  return (
    <group>
      {/* ── Floor ────────────────────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, CENTRE_Z]} receiveShadow>
        <planeGeometry args={[HALF_W * 2, LENGTH]} />
                {/* A glossy standard material, not MeshReflectorMaterial. A real
            reflection pass re-renders the whole scene into a texture every
            frame, and three of them (road, hallway, gallery) was the largest
            single cost in the app — enough to make scrolling stutter. */}
<meshStandardMaterial color="#090A0D" roughness={0.75} metalness={0.2} />
      </mesh>

      {/* ── Walls and ceiling ────────────────────────────────────────────── */}
      {([-1, 1] as const).map((side) => (
        <mesh
          key={side}
          position={[side * HALF_W, HEIGHT / 2, CENTRE_Z]}
          rotation={[0, side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}
          receiveShadow
        >
          <planeGeometry args={[LENGTH, HEIGHT]} />
          <meshStandardMaterial color="#0E1014" roughness={0.98} />
        </mesh>
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, HEIGHT, CENTRE_Z]}>
        <planeGeometry args={[HALF_W * 2, LENGTH]} />
        <meshStandardMaterial color="#0A0B0E" roughness={1} />
      </mesh>
      {/* Far end cap, so the corridor does not open onto the void. */}
      <mesh position={[0, HEIGHT / 2, GALLERY_END_Z]}>
        <planeGeometry args={[HALF_W * 2, HEIGHT]} />
        <meshStandardMaterial color="#0C0D11" roughness={1} />
      </mesh>

      {/*
        Recessed ceiling downlights rather than one continuous strip. A strip
        directly above the camera fills the top of frame with a hard wedge; small
        periodic sources give the room rhythm and stay out of the shot.
      */}
      {Array.from({ length: 9 }, (_, i) => {
        const z = GALLERY_START_Z - 4 - i * 4.4;
        return (
          <group key={z}>
            <mesh position={[0, HEIGHT - 0.02, z]} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.16, 12]} />
              <meshStandardMaterial
                color="#5EE7D0"
                emissive="#5EE7D0"
                emissiveIntensity={1.1}
                toneMapped={false}
              />
            </mesh>
            
          </group>
        );
      })}

      {/* ── Screens ──────────────────────────────────────────────────────── */}
      {screenPlacements.map((placement) => (
        <ProjectScreen
          key={placement.slug}
          project={projects[placement.index]}
          index={placement.index}
          position={placement.position}
          rotationY={placement.rotationY}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

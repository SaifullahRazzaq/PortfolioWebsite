'use client';

import { useMemo } from 'react';
import { TimelineCard } from '../props/TimelineCard';
import { timeline } from '@/data/experience';

/**
 * 6. THE STUDY — Experience.
 *
 * A desk scene off to the right of the gallery exit, around (9, 0, -98). The
 * camera arrives at the desk and the timeline rises as holographic cards, newest
 * first, stacking as it passes.
 */

const CENTRE_X = 9;
const HALF_W = 5.5;
const HALF_D = 8.5;
const CENTRE_Z = -96;
const HEIGHT = 3.6;
const DESK_Z = -100;
/** The card board, set back behind the desk against the far wall. */
const BOARD_Z = -103.6;

export function Study() {
  /**
   * The cards hang as a 2×3 board on the far wall *beyond* the desk, not beside
   * the camera.
   *
   * Stacked along the route they sat 1–2m from the lens, where a 1.8m card fills
   * the frame and six of them overlap into an unreadable pile. Out on the back
   * wall the camera reads them from ~8m while approaching, which is the whole
   * point of them.
   */
  const cards = useMemo(
    () =>
      timeline.map((entry, i) => {
        const column = i % 2;
        const row = Math.floor(i / 2);
        return {
          entry,
          index: i,
          restPosition: [
            CENTRE_X - 0.9 + column * 2.1,
            3.15 - row * 0.98,
            BOARD_Z,
          ] as [number, number, number],
          // Staggered so they arrive one at a time as the camera closes in.
          focusZ: -93 - i * 0.9,
          accent: entry.kind === 'education' ? '#5EE7D0' : '#FF9A45',
        };
      }),
    [],
  );

  return (
    <group>
      {/* ── Shell ────────────────────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[CENTRE_X, 0, CENTRE_Z]} receiveShadow>
        <planeGeometry args={[HALF_W * 2, HALF_D * 2]} />
        <meshStandardMaterial color="#0D0A08" roughness={0.88} metalness={0.1} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[CENTRE_X, HEIGHT, CENTRE_Z]}>
        <planeGeometry args={[HALF_W * 2, HALF_D * 2]} />
        <meshStandardMaterial color="#100D0B" roughness={1} />
      </mesh>
      {/* Three walls; the -X side stays open for the arrival from the gallery. */}
      <mesh position={[CENTRE_X, HEIGHT / 2, CENTRE_Z - HALF_D]}>
        <planeGeometry args={[HALF_W * 2, HEIGHT]} />
        <meshStandardMaterial color="#1A1512" roughness={0.97} />
      </mesh>
      <mesh
        position={[CENTRE_X + HALF_W, HEIGHT / 2, CENTRE_Z]}
        rotation={[0, -Math.PI / 2, 0]}
      >
        <planeGeometry args={[HALF_D * 2, HEIGHT]} />
        <meshStandardMaterial color="#1A1512" roughness={0.97} />
      </mesh>

      {/* ── Desk ─────────────────────────────────────────────────────────── */}
      <mesh position={[CENTRE_X, 0.74, DESK_Z]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.08, 1.5]} />
        <meshStandardMaterial color="#2A1D14" roughness={0.62} metalness={0.08} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[CENTRE_X + side * 1.55, 0.37, DESK_Z]} castShadow>
          <boxGeometry args={[0.1, 0.74, 1.4]} />
          <meshStandardMaterial color="#1C140E" roughness={0.7} />
        </mesh>
      ))}

      {/* Monitor — the cool light source that balances the lamp. */}
      <mesh position={[CENTRE_X, 1.28, DESK_Z - 0.5]} rotation={[0, 0, 0]}>
        <planeGeometry args={[1.5, 0.88]} />
        <meshBasicMaterial color="#5EE7D0" toneMapped={false} opacity={0.5} transparent />
      </mesh>
      <mesh position={[CENTRE_X, 0.85, DESK_Z - 0.5]}>
        <boxGeometry args={[0.16, 0.14, 0.16]} />
        <meshStandardMaterial color="#15181C" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* Desk lamp — the warm key for the whole room. */}
      <mesh position={[CENTRE_X + 1.15, 1.12, DESK_Z + 0.2]}>
        <sphereGeometry args={[0.11, 10, 10]} />
        <meshStandardMaterial
          color="#FFC48A"
          emissive="#FF9A45"
          emissiveIntensity={3.2}
          toneMapped={false}
        />
      </mesh>

      {/* Chair silhouette, for scale. */}
      <mesh position={[CENTRE_X, 0.45, DESK_Z + 1.3]}>
        <boxGeometry args={[0.62, 0.9, 0.62]} />
        <meshStandardMaterial color="#0E0B09" roughness={0.95} />
      </mesh>

      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      {cards.map((card) => (
        <TimelineCard
          key={`${card.entry.org}-${card.entry.startYear}`}
          entry={card.entry}
          index={card.index}
          restPosition={card.restPosition}
          focusZ={card.focusZ}
          accent={card.accent}
        />
      ))}
    </group>
  );
}

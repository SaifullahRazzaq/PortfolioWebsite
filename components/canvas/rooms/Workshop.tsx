'use client';

import { useMemo } from 'react';
import { SkillNode } from '../props/SkillNode';
import { useQuality } from '../QualityContext';
import { skills } from '@/data/skills';
import type { Skill } from '@/data/types';

/**
 * 4. THE WORKSHOP — Skills.
 *
 * A wider room centred near (-9, 0, -37). The stack floats here as 3D nodes in
 * four rings — one per skill group — that assemble as the camera enters and turn
 * slowly. Each node is hoverable.
 */

/** Room centre — the camera passes through roughly here. */
const ROOM: [number, number, number] = [-9, 0, -37];
const HALF_W = 9.5;
const HALF_D = 8.5;
const HEIGHT = 5;

/**
 * The orbit cluster sits off to the LEFT of the camera path and slightly further
 * in, not on it.
 *
 * Centring the rings on the path put the camera *inside* the orbit: nodes swung
 * past the lens at 2m and read as giant flat polygons filling the frame rather
 * than as a cluster of objects being looked at.
 */
const CLUSTER: [number, number, number] = [-15.5, 2.4, -42];

/** One ring per group: radius, height offset, direction, colour. */
const RINGS: Record<
  Skill['group'],
  { radius: number; y: number; speed: number; accent: string }
> = {
  core: { radius: 1.35, y: 0.05, speed: 0.16, accent: '#5EE7D0' },
  ai: { radius: 2.15, y: 0.7, speed: -0.12, accent: '#FF8A3D' },
  backend: { radius: 1.8, y: -0.6, speed: 0.13, accent: '#6C8CFF' },
  platform: { radius: 2.7, y: 0.25, speed: -0.09, accent: '#FFB877' },
};

export function Workshop() {
  const quality = useQuality();

  // Positions are deterministic: a seeded scatter, so the assemble animation is
  // identical on every load and on every scrub back through the room.
  const nodes = useMemo(() => {
    const byGroup = new Map<Skill['group'], Skill[]>();
    for (const skill of skills) {
      const list = byGroup.get(skill.group) ?? [];
      list.push(skill);
      byGroup.set(skill.group, list);
    }

    let seed = 42;
    const random = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };

    return skills.map((skill) => {
      const siblings = byGroup.get(skill.group)!;
      const indexInRing = siblings.indexOf(skill);
      const ring = RINGS[skill.group];
      return {
        skill,
        ring,
        angle: (indexInRing / siblings.length) * Math.PI * 2,
        scatter: [
          CLUSTER[0] + (random() - 0.5) * 9,
          CLUSTER[1] + (random() - 0.5) * 3.5,
          CLUSTER[2] + (random() - 0.5) * 9,
        ] as [number, number, number],
      };
    });
  }, []);

  return (
    <group>
      {/* ── Shell ────────────────────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[ROOM[0], 0, ROOM[2]]} receiveShadow>
        <planeGeometry args={[HALF_W * 2, HALF_D * 2]} />
        <meshStandardMaterial color="#0B0C11" roughness={0.85} metalness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[ROOM[0], HEIGHT, ROOM[2]]}>
        <planeGeometry args={[HALF_W * 2, HALF_D * 2]} />
        <meshStandardMaterial color="#0E0F14" roughness={1} />
      </mesh>

      {/* Back and side walls. The +Z side is left open — that is where the
          corridor arrives from. */}
      <mesh position={[ROOM[0], HEIGHT / 2, ROOM[2] - HALF_D]}>
        <planeGeometry args={[HALF_W * 2, HEIGHT]} />
        <meshStandardMaterial color="#131519" roughness={0.96} />
      </mesh>
      {([-1, 1] as const).map((side) => (
        <mesh
          key={side}
          position={[ROOM[0] + side * HALF_W, HEIGHT / 2, ROOM[2]]}
          rotation={[0, side === -1 ? Math.PI / 2 : -Math.PI / 2, 0]}
        >
          <planeGeometry args={[HALF_D * 2, HEIGHT]} />
          <meshStandardMaterial color="#131519" roughness={0.96} />
        </mesh>
      ))}

      {/* ── Workbench, so the room has a floor-level anchor ──────────────── */}
      <mesh position={[ROOM[0], 0.45, ROOM[2] - HALF_D + 1.1]} castShadow receiveShadow>
        <boxGeometry args={[6.5, 0.9, 1.1]} />
        <meshStandardMaterial color="#191410" roughness={0.8} metalness={0.15} />
      </mesh>
      {/* Strip light under the bench, bouncing off the floor. */}
      <mesh position={[ROOM[0], 0.06, ROOM[2] - HALF_D + 1.1]}>
        <boxGeometry args={[6, 0.03, 0.08]} />
        <meshStandardMaterial
          color="#5EE7D0"
          emissive="#5EE7D0"
          emissiveIntensity={2.4}
          toneMapped={false}
        />
      </mesh>

      {/* ── Practicals ───────────────────────────────────────────────────── */}

      
      {/* Keys the cluster itself, so the nodes are modelled rather than silhouetted. */}

      {/* ── The stack ────────────────────────────────────────────────────── */}
      {nodes.map(({ skill, ring, angle, scatter }) => (
        <SkillNode
          key={skill.name}
          skill={skill}
          centre={CLUSTER}
          radius={ring.radius}
          ringY={ring.y}
          angle={angle}
          speed={quality.tier === 'low' ? ring.speed * 0.6 : ring.speed}
          scatter={scatter}
          accent={ring.accent}
        />
      ))}
    </group>
  );
}

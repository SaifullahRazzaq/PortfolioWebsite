'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Group, Mesh, MeshStandardMaterial } from 'three';
import { clamp01, damp, smoothstep } from '@/lib/curve';
import { journey } from '@/lib/journey-state';
import { sectionById } from '@/data/journey';
import type { Skill } from '@/data/types';

/**
 * One floating tech node in The Workshop.
 *
 * Nodes start scattered and assemble into their orbit ring as the camera enters
 * the room, then keep turning slowly. Hovering scales the node, lifts its
 * emissive, and shows a label.
 *
 * `assemble` is derived from scroll, `hover` from pointer state — both are
 * damped toward their target so they compose rather than fight.
 */

interface SkillNodeProps {
  skill: Skill;
  /** Ring centre in world space. */
  centre: [number, number, number];
  /** Orbit radius and starting angle. */
  radius: number;
  angle: number;
  /** Vertical offset of this node's ring. */
  ringY: number;
  /** Radians per second. Alternating signs per ring keep it from looking rigid. */
  speed: number;
  /** Where the node drifts in from before it assembles. */
  scatter: [number, number, number];
  accent: string;
  onHoverChange?: (skill: Skill | null) => void;
}

const workshop = sectionById('workshop');

export function SkillNode({
  skill,
  centre,
  radius,
  angle,
  ringY,
  speed,
  scatter,
  accent,
  onHoverChange,
}: SkillNodeProps) {
  const group = useRef<Group>(null);
  const mesh = useRef<Mesh>(null);
  const material = useRef<MeshStandardMaterial>(null);

  const [hovered, setHovered] = useState(false);
  const assemble = useRef(0);
  const hoverAmount = useRef(0);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 20);
    const [start, end] = workshop.scroll;
    const local = clamp01((journey.progress - start) / (end - start));

    // Assemble across the first 45% of the room, hold, then never disassemble —
    // scrubbing back re-runs it in reverse because it is a pure function of
    // scroll, not an event.
    assemble.current = smoothstep(0.02, 0.45, local);
    hoverAmount.current = damp(hoverAmount.current, hovered ? 1 : 0, 9, dt);

    if (!group.current) return;

    const t = state.clock.elapsedTime;
    const orbitAngle = angle + t * speed;
    const orbitX = centre[0] + Math.cos(orbitAngle) * radius;
    const orbitZ = centre[2] + Math.sin(orbitAngle) * radius;
    // Gentle bob so the ring does not look like a turntable.
    const orbitY = centre[1] + ringY + Math.sin(t * 0.7 + angle) * 0.12;

    const a = assemble.current;
    group.current.position.set(
      scatter[0] + (orbitX - scatter[0]) * a,
      scatter[1] + (orbitY - scatter[1]) * a,
      scatter[2] + (orbitZ - scatter[2]) * a,
    );

    // Radius in metres. Kept small: the cluster should read as a constellation
    // of objects a few metres away, not as boulders.
    const scale = (0.001 + a * (0.19 + skill.weight * 0.15)) * (1 + hoverAmount.current * 0.55);
    group.current.scale.setScalar(scale);

    if (mesh.current) {
      mesh.current.rotation.x = t * 0.25 + angle;
      mesh.current.rotation.y = t * 0.32;
    }
    if (material.current) {
      material.current.emissiveIntensity = 0.5 + a * 0.8 + hoverAmount.current * 2.6;
    }
  });

  return (
    <group ref={group}>
      <mesh
        ref={mesh}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          onHoverChange?.(skill);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          onHoverChange?.(null);
          document.body.style.cursor = '';
        }}
      >
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          ref={material}
          color="#10131A"
          emissive={accent}
          emissiveIntensity={0.5}
          roughness={0.35}
          metalness={0.6}
          flatShading
        />
      </mesh>

      {/* Label only exists while hovered — 18 permanent Html portals would be
          18 permanently-reflowing DOM subtrees. */}
      {hovered ? (
        <Html center distanceFactor={9} position={[0, 1.7, 0]} style={{ pointerEvents: 'none' }}>
          <span
            style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#EDEAE4',
              background: 'rgba(8,9,12,0.82)',
              border: `1px solid ${accent}66`,
              padding: '6px 12px',
              borderRadius: 3,
              whiteSpace: 'nowrap',
            }}
          >
            {skill.name}
          </span>
        </Html>
      ) : null}
    </group>
  );
}

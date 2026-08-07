'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  type Points,
  type ShaderMaterial,
} from 'three';
import { useQuality } from '../QualityContext';
import { journey } from '@/lib/journey-state';
import { sectionById } from '@/data/journey';
import { clamp01 } from '@/lib/curve';
import { skyFragment, skyVertex } from '@/shaders/sky';

/**
 * 8. THE ROOFTOP — Contact.
 *
 * Open sky at dawn, city lights far below, a deck to stand on. The contact form
 * and links live in the DOM overlay above this; the scene's job is to give them
 * somewhere to be.
 */

const DECK_Y = 10;
const DECK_Z = -128;

export function Rooftop() {
  const quality = useQuality();
  const sky = useRef<ShaderMaterial>(null);
  const cityRef = useRef<Points>(null);
  const rooftop = useMemo(() => sectionById('rooftop'), []);

  // City lights: a flat field of points well below the deck, thinned on mobile.
  const city = useMemo(() => {
    const count = Math.round(2600 * quality.particleScale);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    let seed = 1337;
    const random = () => {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      return seed / 2147483648;
    };

    const warm = new Color('#FFB877');
    const cool = new Color('#8FB6FF');
    const scratch = new Color();

    for (let i = 0; i < count; i++) {
      // Ring the deck rather than filling under it — nothing is visible directly
      // below, and the points would only z-fight with the deck.
      const angle = random() * Math.PI * 2;
      const radius = 26 + random() * 210;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = -14 - random() * 26;
      positions[i * 3 + 2] = DECK_Z + Math.sin(angle) * radius;

      scratch.copy(random() > 0.72 ? cool : warm);
      // Dim the far ones so the field has depth instead of reading as a texture.
      const fade = 0.35 + random() * 0.65;
      colors[i * 3] = scratch.r * fade;
      colors[i * 3 + 1] = scratch.g * fade;
      colors[i * 3 + 2] = scratch.b * fade;
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('color', new BufferAttribute(colors, 3));
    return geometry;
  }, [quality.particleScale]);

  const skyUniforms = useMemo(
    () => ({
      uTop: { value: new Color('#0B1024') },
      uHorizon: { value: new Color('#3D4A6B') },
      uGlow: { value: new Color('#FFB877') },
      uProgress: { value: 0 },
    }),
    [],
  );

  useFrame((state) => {
    const [start, end] = rooftop.scroll;
    const local = clamp01((journey.progress - start) / (end - start));

    if (sky.current) {
      // Dawn advances across the rooftop section: the horizon warms and lifts.
      sky.current.uniforms.uProgress.value = local;
    }
    if (cityRef.current) {
      // Barely perceptible drift, so the city is not a dead sprite sheet.
      cityRef.current.rotation.y = state.clock.elapsedTime * 0.004;
    }
  });

  return (
    <group>
      {/* ── Sky dome ─────────────────────────────────────────────────────── */}
      <mesh position={[0, 0, DECK_Z]}>
        <sphereGeometry args={[300, 32, 16]} />
        <shaderMaterial
          ref={sky}
          vertexShader={skyVertex}
          fragmentShader={skyFragment}
          uniforms={skyUniforms}
          side={BackSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      <Stars
        radius={180}
        depth={60}
        count={Math.round(1400 * quality.particleScale)}
        factor={4}
        saturation={0}
        fade
        speed={0.4}
      />

      {/* ── City below ───────────────────────────────────────────────────── */}
      <points ref={cityRef} geometry={city}>
        <pointsMaterial
          size={0.9}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={AdditiveBlending}
          toneMapped={false}
        />
      </points>

      {/* ── Deck ─────────────────────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, DECK_Y, DECK_Z]} receiveShadow>
        <planeGeometry args={[22, 26]} />
        <meshStandardMaterial color="#191C24" roughness={0.9} metalness={0.15} />
      </mesh>

      {/* Parapet — stops the deck reading as a floating plane. */}
      {[
        { position: [0, DECK_Y + 0.45, DECK_Z - 13] as const, size: [22, 0.9, 0.3] as const },
        { position: [-11, DECK_Y + 0.45, DECK_Z] as const, size: [0.3, 0.9, 26] as const },
        { position: [11, DECK_Y + 0.45, DECK_Z] as const, size: [0.3, 0.9, 26] as const },
      ].map((wall, i) => (
        <mesh key={i} position={wall.position}>
          <boxGeometry args={wall.size} />
          <meshStandardMaterial color="#12151C" roughness={0.95} />
        </mesh>
      ))}

      {/* Warm deck lights, matching the practicals from inside the house. */}
      {[-7, 0, 7].map((x) => (
        <group key={x}>
          <mesh position={[x, DECK_Y + 0.12, DECK_Z - 12.4]}>
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshStandardMaterial
              color="#FFC48A"
              emissive="#FFB877"
              emissiveIntensity={2.4}
              toneMapped={false}
            />
          </mesh>
          
        </group>
      ))}

      {/* The dawn key light lives in <Lighting>, not here. Anything inside a
          RoomGate is mounted and unmounted as the camera moves, and a changing
          light count forces three to recompile every material in the scene. */}
    </group>
  );
}

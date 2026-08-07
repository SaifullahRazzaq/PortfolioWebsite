'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, type PointLight } from 'three';
import { emitters, LIGHT_POOL_SIZE } from '@/lib/emitters';
import { damp } from '@/lib/curve';

/**
 * A fixed pool of point lights that follows the camera.
 *
 * The pool is mounted once and never resized, so three.js never has to
 * recompile materials — which is what made the scroll stutter at every doorway
 * back when each room owned its own lights.
 *
 * Each frame the pool picks the `LIGHT_POOL_SIZE` nearest emitters and adopts
 * their position and colour. Intensity is faded by distance and damped over
 * time, so when a light is reassigned to a different emitter it does so while
 * effectively dark and the swap is invisible.
 */

/** Beyond this an emitter contributes nothing and is a candidate for reuse. */
const MAX_RANGE = 34;

export function LightPool() {
  const lights = useRef<(PointLight | null)[]>([]);
  // Current intensity per slot, damped so reassignment never pops.
  const level = useRef<number[]>(new Array(LIGHT_POOL_SIZE).fill(0));
  const targetColor = useMemo(
    () => Array.from({ length: LIGHT_POOL_SIZE }, () => new Color('#ffffff')),
    [],
  );

  // Reused each frame — sorting allocations here would churn the GC at 60fps.
  const ranked = useMemo(
    () => emitters.map((_, i) => ({ index: i, distance: 0 })),
    [],
  );

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 20);
    const camera = state.camera.position;

    for (let i = 0; i < emitters.length; i++) {
      const [x, y, z] = emitters[i].position;
      const dx = x - camera.x;
      const dy = y - camera.y;
      const dz = z - camera.z;
      ranked[i].index = i;
      ranked[i].distance = dx * dx + dy * dy + dz * dz;
    }
    ranked.sort((a, b) => a.distance - b.distance);

    for (let slot = 0; slot < LIGHT_POOL_SIZE; slot++) {
      const light = lights.current[slot];
      if (!light) continue;

      const pick = ranked[slot];
      const emitter = emitters[pick.index];
      const distance = Math.sqrt(pick.distance);

      // Fade out over the last third of range so nothing switches while bright.
      const falloff = 1 - Math.min(1, Math.max(0, (distance - MAX_RANGE * 0.66) / (MAX_RANGE * 0.34)));
      const wanted = emitter.intensity * falloff;

      light.position.set(...emitter.position);
      light.distance = emitter.distance;

      targetColor[slot].set(emitter.color);
      light.color.lerp(targetColor[slot], 1 - Math.exp(-12 * dt));

      level.current[slot] = damp(level.current[slot], wanted, 9, dt);
      light.intensity = level.current[slot];
    }
  });

  return (
    <>
      {Array.from({ length: LIGHT_POOL_SIZE }, (_, i) => (
        <pointLight
          key={i}
          ref={(el) => {
            lights.current[i] = el;
          }}
          intensity={0}
          decay={2}
          distance={20}
          // Shadow-casting point lights are six render passes each. The scene is
          // sold by emissive surfaces and fog, not by cast shadows.
          castShadow={false}
        />
      ))}
    </>
  );
}

'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { AmbientLight, Color, DirectionalLight, FogExp2 } from 'three';
import { journey } from '@/lib/journey-state';
import { paletteAt, writePaletteCss } from '@/lib/palette';
import { clamp01, smoothstep } from '@/lib/curve';
import { LightPool } from './LightPool';
import { sectionById } from '@/data/journey';

/**
 * Global lighting and atmosphere.
 *
 * Rooms own their own practical lights (streetlamps, sconces, screens). This
 * component owns only what has to change continuously along the whole journey:
 * fog colour and density, ambient level, clear colour, and the CSS custom
 * properties the DOM overlays tint themselves with.
 *
 * All of it is mutated in place every frame — no React state, no re-renders.
 */
const stairs = sectionById('stairs');

export function Lighting() {
  const ambient = useRef<AmbientLight>(null);
  const dawn = useRef<DirectionalLight>(null);
  const scene = useThree((s) => s.scene);
  const gl = useThree((s) => s.gl);

  useFrame(({ clock }) => {
    const palette = paletteAt(journey.progress);

    // Fog and clear colour must match exactly, or the horizon shows a seam.
    const fog = scene.fog as FogExp2 | null;
    if (fog) {
      (fog.color as Color).copy(palette.bg);
      fog.density = palette.fog;
    }
    (scene.background as Color | null)?.copy?.(palette.bg);
    gl.setClearColor(palette.bg);

    if (ambient.current) {
      ambient.current.intensity = palette.ambient;
      ambient.current.color.copy(palette.cool);
    }

    // The dawn key fades up across the stairs and holds on the rooftop. It is
    // mounted here for the whole journey rather than inside the rooftop, so the
    // scene's light count never changes.
    if (dawn.current) {
      dawn.current.intensity = clamp01(smoothstep(stairs.scroll[0], 0.97, journey.progress)) * 1.3;
    }

    writePaletteCss(journey.progress, clock.elapsedTime * 1000);
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.1} />
      {/*
        A single very soft key from above-front. Everything else in the house is
        lit by emissive surfaces and point lights owned by each room, which is
        what gives the "lit by lamps and monitors" read rather than "3D scene
        with a sun in it".
      */}
      <hemisphereLight args={['#2A3348', '#0A0B10', 0.35]} />

      {/* Dawn, for the stairs and the rooftop. Always mounted; intensity only. */}
      <directionalLight ref={dawn} position={[-18, 22, -168]} color="#FFCBA0" intensity={0} />

      {/*
        Every practical light in the house. A fixed-size pool that follows the
        camera — see lib/emitters.ts for why rooms no longer own their lights.
      */}
      <LightPool />
    </>
  );
}

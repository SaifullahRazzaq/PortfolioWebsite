'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { ACESFilmicToneMapping } from 'three';
import { CameraRig } from './CameraRig';
import { Lighting } from './Lighting';
import { Effects } from './Effects';
import { RoomGate } from './RoomGate';
import { QualityProvider } from './QualityContext';
import { Road } from './rooms/Road';
import { Door } from './rooms/Door';
import { Hallway } from './rooms/Hallway';
import { Workshop } from './rooms/Workshop';
import { Gallery } from './rooms/Gallery';
import { Study } from './rooms/Study';
import { Stairs } from './rooms/Stairs';
import { Rooftop } from './rooms/Rooftop';
import { useMousePosition } from '@/hooks/useMousePosition';
import type { QualitySettings } from '@/hooks/useQualityTier';
import { waypoints } from '@/data/journey';
import type { Project } from '@/data/types';

/**
 * The 3D root. Fixed behind the DOM overlay layer and never scrolls itself —
 * all apparent movement is the camera travelling the curve.
 *
 * Every room is wrapped in a RoomGate, so only the current room and its
 * neighbours are drawn.
 */
export function Journey({
  quality,
  onSelectProject,
}: {
  quality: QualitySettings;
  onSelectProject: (project: Project) => void;
}) {
  const pointer = useMousePosition();

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        dpr={quality.dpr}
        shadows={false}
        gl={{
          antialias: quality.tier !== 'low',
          powerPreference: 'high-performance',
          // The scene is lit almost entirely by emissive sources; a transparent
          // buffer would let the page background bleed through the fog.
          alpha: false,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        camera={{ fov: 62, near: 0.1, far: 400, position: waypoints[0].position }}
      >
        {/* Fog colour and density are driven per-frame by <Lighting>. */}
        <color attach="background" args={['#05060A']} />
        <fogExp2 attach="fog" args={['#05060A', 0.017]} />

        <QualityProvider value={quality}>
          <CameraRig pointer={quality.isMobile ? null : pointer} />
          <Lighting />

          <Suspense fallback={null}>
            <RoomGate id="road">
              <Road />
            </RoomGate>
            <RoomGate id="door">
              <Door />
            </RoomGate>
            <RoomGate id="hallway">
              <Hallway />
            </RoomGate>
            <RoomGate id="workshop">
              <Workshop />
            </RoomGate>
            <RoomGate id="gallery">
              <Gallery onSelect={onSelectProject} />
            </RoomGate>
            <RoomGate id="study">
              <Study />
            </RoomGate>
            <RoomGate id="stairs">
              <Stairs />
            </RoomGate>
            <RoomGate id="rooftop">
              <Rooftop />
            </RoomGate>

            <Effects />

            {/*
              Compiles every material up front instead of the first time each
              room comes into view. Without it, entering the hallway and the
              stairwell each cost a ~60ms compile — small, but felt, and it lands
              exactly at a doorway. Paying it behind the preloader is free.
            */}
            <Preload all />
          </Suspense>
        </QualityProvider>
      </Canvas>
    </div>
  );
}

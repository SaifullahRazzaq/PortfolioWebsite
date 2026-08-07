'use client';

import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { CanvasTexture, Mesh, MeshBasicMaterial } from 'three';
import { clamp01, damp, smoothstep } from '@/lib/curve';
import { drawProjectScreen } from '@/lib/screenTexture';
import { useQuality } from '../QualityContext';
import type { Project } from '@/data/types';

/**
 * One illuminated screen in The Gallery.
 *
 * Powers on as the camera comes level with it and dims once it is behind, driven
 * purely off camera Z so scrubbing backwards replays it exactly. Clicking opens
 * the detail overlay; the camera never moves and the page never navigates.
 */

interface ProjectScreenProps {
  project: Project;
  index: number;
  position: [number, number, number];
  /** Y rotation including the toe-in toward the approaching camera. */
  rotationY: number;
  onSelect: (project: Project) => void;
}

const WIDTH = 3.5;
const HEIGHT = 2.188; // 1024:640 aspect, sized for the 8.4m corridor

export function ProjectScreen({
  project,
  index,
  position,
  rotationY,
  onSelect,
}: ProjectScreenProps) {
  const material = useRef<MeshBasicMaterial>(null);
  const mesh = useRef<Mesh>(null);

  const [texture, setTexture] = useState<CanvasTexture | null>(null);
  // Max anisotropy keeps the panel sharp along its foreshortened axis; these
  // screens are almost never viewed square-on.
  const maxAnisotropy = useThree((s) => s.gl.capabilities.getMaxAnisotropy());
  // Weaker devices draw the panels smaller. They are also the devices most
  // likely to have their canvas backing stores reclaimed.
  const pixelScale = useQuality().tier === 'low' ? 0.7 : 1;
  const [hovered, setHovered] = useState(false);
  const power = useRef(0);
  const hoverAmount = useRef(0);

  /**
   * Draw after fonts are ready, or the texture bakes in a fallback typeface.
   *
   * Staggered by index. All nine screens becoming ready in the same tick means
   * nine multi-megabyte canvases allocated back to back, and a spike like that
   * is what pushes a browser into discarding backing stores — which is how the
   * screens ended up rendering as corrupted blocks. Spreading the work over a
   * few hundred milliseconds costs nothing here, because it happens behind the
   * preloader.
   */
  useEffect(() => {
    let cancelled = false;
    let created: CanvasTexture | null = null;
    let timer = 0;

    document.fonts.ready.then(() => {
      if (cancelled) return;
      timer = window.setTimeout(() => {
        if (cancelled) return;
        created = drawProjectScreen(project, index, maxAnisotropy, pixelScale);
        setTexture(created);
      }, index * 45);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      // The texture holds a GPU allocation and a canvas; both must go.
      created?.dispose();
    };
  }, [project, index, maxAnisotropy, pixelScale]);

  /**
   * Going from no map to a map changes the material's shader defines, and three
   * will not recompile on its own. Without this the screen renders as a flat
   * untextured plane forever.
   */
  useEffect(() => {
    if (!material.current || !texture) return;
    material.current.map = texture;
    material.current.needsUpdate = true;
  }, [texture]);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 20);

    /*
     * Power-on window, expressed in "metres still to go" rather than absolute
     * distance.
     *
     * The screens are toed in toward the approach, so a screen is best presented
     * from roughly 3–9m *before* you reach it. When you are level with it, it is
     * at 90° and half out of frame. Lighting on absolute distance therefore peaked
     * at exactly the wrong moment.
     */
    const ahead = state.camera.position.z - position[2]; // > 0 while approaching
    // Roughly one and a half screen-spacings wide. Any wider and four screens
    // are lit at once in an 8m corridor, which stacks them into overlapping
    // slivers instead of presenting one at a time.
    const target = (1 - smoothstep(5.5, 9.5, ahead)) * smoothstep(-2, 0.8, ahead);
    power.current = damp(power.current, target, 3.6, dt);
    hoverAmount.current = damp(hoverAmount.current, hovered ? 1 : 0, 10, dt);

    const lit = clamp01(power.current);

    if (material.current) {
      material.current.opacity = lit;
      /*
       * Driven past 1.0 on purpose. The panel is unlit geometry in a black
       * corridor, so its apparent brightness is entirely this multiplier — and
       * pushing above 1 is what lifts it over the bloom threshold so it reads as
       * emitting rather than as a picture hanging on a wall. Hover adds more
       * again, which is the whole hover affordance.
       */
      material.current.color.setScalar(0.9 + lit * 0.55 + hoverAmount.current * 0.5);
    }
    if (mesh.current) {
      // A few millimetres of lean out of the wall on hover.
      mesh.current.position.z = hoverAmount.current * 0.06;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Bezel */}
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[WIDTH + 0.14, HEIGHT + 0.14, 0.08]} />
        <meshStandardMaterial color="#0A0B0F" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* The screen */}
      <mesh
        ref={mesh}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = '';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(project);
        }}
      >
        <planeGeometry args={[WIDTH, HEIGHT]} />
        <meshBasicMaterial
          ref={material}
          map={texture}
          transparent
          opacity={0}
          // Screens are light sources, not lit surfaces — never tone-map them
          // down or they stop reading as emissive in a dark room.
          toneMapped={false}
        />
      </mesh>

      
    </group>
  );
}

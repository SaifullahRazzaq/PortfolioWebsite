'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Vector3 } from 'three';
import {
  cameraLookAt,
  cameraPositionAt,
  damp,
  lerp,
  sectionAtScroll,
  smoothstep,
} from '@/lib/curve';
import { journey } from '@/lib/journey-state';
import { sections } from '@/data/journey';
import { nearestScreen } from '@/lib/gallery-layout';

/**
 * THE CAMERA. Nothing else in the app is allowed to move it.
 *
 * Every frame:
 *   1. read `journey.progress` (a plain number, mutated by the master
 *      ScrollTrigger — never React state)
 *   2. map it onto the curve and snap the camera to that point
 *   3. aim at a point slightly further along the curve, damped, so the camera
 *      turns its head *into* corners a beat after arriving at them
 *   4. ease FOV between the current room's value and the next room's
 *
 * Because position is a pure function of progress, scrolling up reverses the
 * walk exactly. Only the look target and FOV are damped, and damping converges,
 * so a given scroll position always settles to the same frame.
 */

/** How fast the head follows the path. Higher = snappier, lower = more cinematic. */
const LOOK_DAMPING = 5.5;
const FOV_DAMPING = 4;
/** Max camera drift from pointer parallax, in world units. */
const PARALLAX = 0.22;
const PARALLAX_DAMPING = 3;
/**
 * How far sideways the camera's gaze swings toward a gallery screen it is level
 * with. Without this the camera walks straight down the middle and every screen
 * stays at the edge of frame, near edge-on.
 */
const GALLERY_GLANCE = 2.6;
const GLANCE_DAMPING = 3.2;

/** Scratch for the per-room point of interest — never allocate in useFrame. */
const _poi = new Vector3();

interface CameraRigProps {
  /** Normalised pointer, -1→1. Null disables parallax (touch / reduced motion). */
  pointer?: React.RefObject<{ x: number; y: number }> | null;
}

export function CameraRig({ pointer = null }: CameraRigProps) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;

  // Persistent scratch state. Allocating in useFrame would churn the GC.
  const lookTarget = useRef(new Vector3());
  const parallax = useRef({ x: 0, y: 0 });
  const glance = useRef(0);
  const initialised = useRef(false);

  useFrame((_, rawDelta) => {
    // Clamp delta so a dropped frame or a backgrounded tab cannot teleport the
    // damped values.
    const dt = Math.min(rawDelta, 1 / 20);
    const p = journey.progress;

    const { section, index, local } = sectionAtScroll(p);
    const next = sections[Math.min(index + 1, sections.length - 1)];

    // ── 1. Position: pure function of scroll ────────────────────────────────
    const position = cameraPositionAt(p);

    // ── 2. Parallax: a small offset in camera-local space ───────────────────
    if (pointer?.current) {
      parallax.current.x = damp(parallax.current.x, pointer.current.x, PARALLAX_DAMPING, dt);
      parallax.current.y = damp(parallax.current.y, pointer.current.y, PARALLAX_DAMPING, dt);
    } else {
      parallax.current.x = damp(parallax.current.x, 0, PARALLAX_DAMPING, dt);
      parallax.current.y = damp(parallax.current.y, 0, PARALLAX_DAMPING, dt);
    }

    camera.position.set(
      position.x + parallax.current.x * PARALLAX,
      position.y - parallax.current.y * PARALLAX * 0.6,
      position.z,
    );
    // Published so the DOM layer can ask "which screen am I level with" without
    // reaching into the r3f tree.
    journey.cameraZ = position.z;

    // ── 3. Look target: further along the curve, damped ─────────────────────
    const lookAhead = lerp(section.lookAhead, next.lookAhead, local);
    const aim = cameraLookAt(p, lookAhead);

    // In the gallery, swing the gaze toward whichever screen the camera is
    // coming up on, so each one is looked at rather than passed.
    let glanceTarget = 0;
    if (section.id === 'gallery') {
      const { side, pull } = nearestScreen(position.z);
      glanceTarget = side * pull * GALLERY_GLANCE;
    }
    glance.current = damp(glance.current, glanceTarget, GLANCE_DAMPING, dt);
    aim.x += glance.current;

    // Rooms whose subject sits beside the route get a head turn toward it,
    // peaking mid-room and easing back to looking down the path.
    if (section.lookTarget) {
      const peak = section.lookTargetAt ?? 0.5;
      // Triangular ramp in, hold at the peak, ramp out — smoothed both sides.
      const rise = smoothstep(peak - 0.42, peak - 0.06, local);
      const fall = 1 - smoothstep(peak + 0.06, peak + 0.42, local);
      const weight = Math.min(rise, fall) * (section.lookTargetStrength ?? 0.8);

      _poi.set(section.lookTarget[0], section.lookTarget[1], section.lookTarget[2]);
      aim.lerp(_poi, weight);
    }

    if (!initialised.current) {
      // First frame: snap, so the camera does not swing in from the origin.
      lookTarget.current.copy(aim);
      camera.fov = section.fov;
      initialised.current = true;
    } else {
      lookTarget.current.x = damp(lookTarget.current.x, aim.x, LOOK_DAMPING, dt);
      lookTarget.current.y = damp(lookTarget.current.y, aim.y, LOOK_DAMPING, dt);
      lookTarget.current.z = damp(lookTarget.current.z, aim.z, LOOK_DAMPING, dt);
    }

    camera.lookAt(lookTarget.current);

    // ── 4. FOV: eased between rooms, widened on portrait screens ────────────
    /*
     * The `fov` in data/journey.ts is a *vertical* angle, and three derives the
     * horizontal one from the aspect ratio. On a phone held upright that makes
     * the horizontal view extremely narrow — the rooms are laid out sideways, so
     * the screens and the skill cluster fall outside the frame entirely.
     *
     * Compensating here widens the horizontal view on a portrait screen, so the
     * same composition is framed on a phone as on a desktop without duplicating
     * the layout for mobile.
     *
     * Only *partially* though — the exponent softens it. Full compensation would
     * hold horizontal FOV exactly constant, but that pushes vertical FOV past
     * 100° on a phone and everything in frame becomes tiny. This lands around
     * 70°, which reaches the side walls while keeping the rooms a readable size.
     */
    const aspect = Math.max(camera.aspect, 0.01);
    const authored = lerp(section.fov, next.fov, local);
    const targetFov =
      aspect >= 1
        ? authored
        : Math.min(
            74,
            (2 *
              Math.atan(Math.tan((authored * Math.PI) / 360) / Math.pow(aspect, 0.4)) *
              180) /
              Math.PI,
          );

    if (Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov = damp(camera.fov, targetFov, FOV_DAMPING, dt);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

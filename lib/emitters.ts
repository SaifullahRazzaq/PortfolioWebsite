/**
 * Every practical light in the house, as data.
 *
 * WHY THIS EXISTS — the scroll stutter.
 *
 * Lights used to live inside each room, and rooms are shown/hidden by RoomGate
 * as the camera moves. Hiding a group removes its lights from the render list,
 * which changes the scene's light count, which makes three.js **recompile every
 * material's shader**. That is a multi-frame stall at every single doorway, and
 * it is exactly what "scrolling gets stuck" feels like.
 *
 * So no room owns a light any more. Instead there is a fixed pool of point
 * lights (see LightPool) that never changes size, and each frame the pool
 * adopts the nearest few emitters from this list. Constant light count, no
 * recompiles, and a fraction of the per-fragment cost of ~45 live lights.
 *
 * Rooms keep their *emissive meshes* — those are what you actually see glowing,
 * and they cost nothing.
 */

import type { Vector3Tuple } from 'three';
import { screenPlacements } from './gallery-layout';
import { projects } from '@/data/projects';

export interface Emitter {
  position: Vector3Tuple;
  color: string;
  /** Peak intensity when the pool adopts this emitter. */
  intensity: number;
  distance: number;
}

const AMBER = '#FF8A3D';
const WARM = '#FF9A50';
const MINT = '#5EE7D0';
const COOL = '#8FA6C8';

/** Streetlamp heads on The Road. Mirrors LAMP_POSITIONS in rooms/Road.tsx. */
const roadLamps: Emitter[] = [
  { z: 78, side: 1 },
  { z: 66, side: -1 },
  { z: 54, side: 1 },
  { z: 42, side: -1 },
  { z: 30, side: 1 },
  { z: 18, side: -1 },
  { z: 8, side: 1 },
].map(({ z, side }) => ({
  position: [side * 8.2 + (side === 1 ? -1.75 : 1.75), 6.4, z] as Vector3Tuple,
  color: AMBER,
  intensity: z < 20 ? 20 : 30,
  distance: 30,
}));

/** Sconces down The Hallway. Mirrors the sconce loop in rooms/Hallway.tsx. */
const hallwaySconces: Emitter[] = [-2.5, -7, -11.5, -16, -20.5].map((z, i) => ({
  position: [(i % 2 === 0 ? 1 : -1) * 2.2, 2.5, z] as Vector3Tuple,
  color: WARM,
  intensity: 9,
  distance: 9,
}));

/** Downlights along The Gallery ceiling. */
const galleryCeiling: Emitter[] = Array.from({ length: 9 }, (_, i) => ({
  position: [0, 4.2, -50 - i * 4.4] as Vector3Tuple,
  color: COOL,
  intensity: 5,
  distance: 9,
}));

/**
 * The glow each project screen throws onto the wall and floor around it.
 *
 * Derived from the same placements the geometry uses, so a screen and its spill
 * can never end up in different places. Without these the gallery reads as a
 * black corridor with a flat picture in it — the spill is what makes a screen
 * look like it is *emitting*.
 */
const galleryScreens: Emitter[] = screenPlacements.map((placement) => ({
  position: [
    placement.position[0] - placement.side * 1.1,
    placement.position[1],
    placement.position[2] + 0.6,
  ] as Vector3Tuple,
  color: projects[placement.index].accent,
  intensity: 13,
  distance: 9,
}));

export const emitters: Emitter[] = [
  ...roadLamps,

  // ── The Door ──────────────────────────────────────────────────────────────
  { position: [2.4, 5.1, 0.9], color: AMBER, intensity: 14, distance: 12 },

  ...hallwaySconces,

  // ── The Workshop ──────────────────────────────────────────────────────────
  { position: [-9, 3.6, -37], color: COOL, intensity: 18, distance: 18 },
  { position: [-9, 0.9, -44.1], color: MINT, intensity: 11, distance: 10 },
  { position: [-5, 2.2, -33], color: AMBER, intensity: 10, distance: 13 },
  { position: [-13, 4.3, -39.5], color: '#BFD0E8', intensity: 13, distance: 13 },

  ...galleryCeiling,
  ...galleryScreens,

  // ── The Study ─────────────────────────────────────────────────────────────
  { position: [9, 1.3, -100.2], color: MINT, intensity: 8, distance: 7 },
  { position: [10.15, 1.1, -99.8], color: '#FF9A45', intensity: 18, distance: 10 },

  // ── The Stairs ────────────────────────────────────────────────────────────
  { position: [9, 3.3, -104], color: '#FF9A45', intensity: 16, distance: 13 },
  { position: [1, 13.9, -118.5], color: '#BFD4FF', intensity: 60, distance: 26 },

  // ── The Rooftop ───────────────────────────────────────────────────────────
  { position: [-7, 10.4, -140], color: '#FFB877', intensity: 9, distance: 12 },
  { position: [0, 10.4, -140], color: '#FFB877', intensity: 9, distance: 12 },
  { position: [7, 10.4, -140], color: '#FFB877', intensity: 9, distance: 12 },
];

/**
 * Size of the live pool. Six is enough that a room never visibly runs out of
 * lights, and few enough that the per-fragment cost stays flat.
 *
 * This number must never change at runtime — that is the whole point.
 */
export const LIGHT_POOL_SIZE = 6;

/**
 * THE JOURNEY — camera path + scroll choreography.
 *
 * This file is the single source of truth for where the camera goes and how much
 * scroll each room gets. Nothing else in the app hard-codes a coordinate.
 *
 * How it fits together:
 *   1. `waypoints` are fed to a THREE.CatmullRomCurve3 (see lib/curve.ts). The
 *      curve is arc-length parameterised, so `curve.getPointAt(u)` moves at a
 *      constant speed in world units for a constant change in `u`.
 *   2. Some waypoints carry a `mark`. Marks are the section boundaries. At init
 *      we resolve each mark to its `u` on the curve by dense sampling.
 *   3. `sections` map a slice of *scroll* onto a slice of *curve*. This is what
 *      lets the camera crawl through the gallery (22% of scroll over a short
 *      stretch of corridor) and cruise down the road (15% of scroll over a long
 *      one) without changing the geometry.
 *
 * World layout, roughly (metres, camera eye height ~1.7):
 *   +Z is "outside, back down the road". The journey travels toward -Z, turns
 *   left into the workshop, back right through the gallery, right again into the
 *   study, then climbs +Y up the stairs to the rooftop.
 */

import type { Vector3Tuple } from 'three';

export const SECTION_IDS = [
  'road',
  'door',
  'hallway',
  'workshop',
  'gallery',
  'study',
  'stairs',
  'rooftop',
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

/** Marks are section boundaries pinned to a specific waypoint. */
export type JourneyMark = SectionId | 'journey-end';

export interface Waypoint {
  position: Vector3Tuple;
  mark?: JourneyMark;
  /** Optional note for the debug HUD. */
  note?: string;
}

/**
 * The path. Keep these in travel order — index order IS the curve order.
 * Nudging a value here moves the camera and every room that references the mark.
 */
export const waypoints: Waypoint[] = [
  // ── 1. THE ROAD ─────────────────────────────────────────────────────────────
  { position: [0.0, 1.8, 70.0], mark: 'road', note: 'journey start — far end of the road' },
  { position: [0.0, 1.8, 52.0] },
  { position: [0.4, 1.78, 34.0], note: 'slight drift so the walk is not a rail' },
  { position: [0.0, 1.75, 18.0] },

  // ── 2. THE DOOR ─────────────────────────────────────────────────────────────
  { position: [0.0, 1.7, 6.0], mark: 'door', note: 'porch — door begins to swing' },
  { position: [0.0, 1.7, 1.5], note: 'threshold — warm light spills out' },

  // ── 3. THE HALLWAY (about) ──────────────────────────────────────────────────
  { position: [0.0, 1.7, -2.0], mark: 'hallway' },
  { position: [0.0, 1.7, -10.0] },
  { position: [0.0, 1.7, -18.0] },

  // ── 4. THE WORKSHOP (skills) ────────────────────────────────────────────────
  { position: [-1.5, 1.7, -24.0], mark: 'workshop', note: 'corridor opens to the left' },
  { position: [-6.0, 1.75, -30.0] },
  { position: [-9.0, 1.8, -37.0], note: 'workshop centre — skill nodes orbit here' },
  { position: [-8.0, 1.75, -44.0] },

  // ── 5. THE GALLERY (projects) ───────────────────────────────────────────────
  { position: [-2.6, 1.7, -49.0], mark: 'gallery', note: 'turns back right into the long room' },
  { position: [0.0, 1.7, -56.0] },
  { position: [0.0, 1.7, -68.0] },
  { position: [0.0, 1.7, -80.0] },

  // ── 6. THE STUDY (experience) ───────────────────────────────────────────────
  { position: [2.5, 1.7, -88.0], mark: 'study' },
  { position: [7.0, 1.68, -95.0] },
  { position: [9.0, 1.65, -101.0], note: 'the desk' },

  // ── 7. THE STAIRS (night → dawn) ────────────────────────────────────────────
  { position: [9.0, 1.8, -105.0], mark: 'stairs', note: 'foot of the stairs' },
  { position: [8.0, 4.6, -110.0] },
  { position: [5.0, 7.8, -114.0] },
  { position: [2.0, 10.4, -117.5] },

  // ── 8. THE ROOFTOP (contact) ────────────────────────────────────────────────
  { position: [0.0, 11.6, -121.0], mark: 'rooftop', note: 'out into open sky' },
  { position: [0.0, 11.8, -127.0] },
  { position: [0.0, 11.8, -135.0], mark: 'journey-end' },
];

export interface JourneySection {
  id: SectionId;
  /** Shown on the progress rail and as the overlay kicker. */
  label: string;
  /** The DOM section heading in the accessible layer. */
  heading: string;
  /** Scroll progress this section owns, 0–1. Must be contiguous and cover 0→1. */
  scroll: [number, number];
  /** Camera field of view at the *start* of this section; lerped across it. */
  fov: number;
  /**
   * How far ahead on the curve the camera looks, in `u` units. Small = the camera
   * turns tightly into corners; large = it looks far down the road and feels calm.
   */
  lookAhead: number;
  /**
   * Optional point of interest in the room. The camera turns its head toward it
   * over the middle of the section, then returns to looking down the path.
   *
   * Needed wherever the thing worth seeing is beside the route rather than on
   * it: the camera walks *through* the workshop and past the desk, so without
   * this the skill cluster and the timeline sit outside the frustum entirely.
   */
  lookTarget?: Vector3Tuple;
  /** Peak strength of that head turn, 0–1. */
  lookTargetStrength?: number;
  /** Where in the section the head turn peaks, as a fraction. */
  lookTargetAt?: number;
}

/**
 * Scroll budget per room. These must stay contiguous — `assertSections` in
 * lib/curve.ts throws at init if a gap or overlap creeps in.
 *
 * The gallery is deliberately the biggest slice: it is the hero section and the
 * camera needs to dwell long enough for nine screens to power on one at a time.
 */
export const sections: JourneySection[] = [
  {
    id: 'road',
    label: 'The Road',
    heading: 'Saifullah Razzaq — Senior Software Engineer & AI Architect',
    scroll: [0.0, 0.13],
    fov: 62,
    lookAhead: 0.02,
  },
  {
    id: 'door',
    label: 'The Door',
    heading: 'Come in',
    scroll: [0.13, 0.19],
    fov: 58,
    lookAhead: 0.014,
  },
  {
    id: 'hallway',
    label: 'The Hallway',
    heading: 'About',
    scroll: [0.19, 0.3],
    fov: 55,
    lookAhead: 0.012,
  },
  {
    id: 'workshop',
    label: 'The Workshop',
    heading: 'Skills',
    scroll: [0.3, 0.43],
    fov: 60,
    lookAhead: 0.01,
    // The skill cluster, which sits off the left of the walked route.
    lookTarget: [-15.5, 2.4, -42],
    lookTargetStrength: 0.8,
    lookTargetAt: 0.55,
  },
  {
    id: 'gallery',
    label: 'The Gallery',
    heading: 'Projects',
    // The biggest slice by a wide margin. Nine screens need roughly 3% of the
    // whole journey each, or you flick past a project in half a wheel-turn.
    scroll: [0.43, 0.72],
    fov: 58,
    lookAhead: 0.012,
  },
  {
    id: 'study',
    label: 'The Study',
    heading: 'Experience',
    scroll: [0.72, 0.83],
    fov: 55,
    lookAhead: 0.011,
    // The desk and the stack of timeline cards above it.
    lookTarget: [9.2, 2.5, -103],
    lookTargetStrength: 0.8,
    lookTargetAt: 0.62,
  },
  {
    id: 'stairs',
    label: 'The Stairs',
    heading: 'Toward the light',
    scroll: [0.83, 0.9],
    fov: 60,
    lookAhead: 0.013,
  },
  {
    id: 'rooftop',
    label: 'The Rooftop',
    heading: 'Contact',
    scroll: [0.9, 1.0],
    fov: 68,
    lookAhead: 0.016,
  },
];

/**
 * Height of the scroll spacer that drives the whole journey.
 * Mobile gets a shorter timeline so the same story takes less thumb-work.
 */
export const SCROLL_HEIGHT_VH = { desktop: 1150, mobile: 780 } as const;

export const sectionById = (id: SectionId) =>
  sections.find((s) => s.id === id) ?? sections[0];

/**
 * The camera curve and the scroll → curve mapping.
 *
 * Two jobs:
 *   1. Turn `waypoints` into an arc-length-parameterised CatmullRomCurve3.
 *   2. Map scroll progress (0→1) onto curve position `u` (0→1) with a *monotone
 *      cubic*, so each room can own an arbitrary slice of scroll without the
 *      camera changing speed abruptly at the boundary.
 *
 * Why monotone cubic and not plain piecewise-linear: linear segments give a
 * continuous position but a discontinuous velocity, so every doorway would feel
 * like a gear change. Fritsch–Carlson gives C1 continuity (smooth speed) while
 * guaranteeing monotonicity (scrolling up always walks backwards, never jitters
 * forward). That is what makes the walk feel like one continuous move.
 */

import { CatmullRomCurve3, Vector3 } from 'three';
import {
  sections,
  waypoints,
  type JourneyMark,
  type JourneySection,
  type SectionId,
} from '@/data/journey';

/** Higher = more accurate constant-speed parameterisation. Cost is init-only. */
const ARC_LENGTH_DIVISIONS = 3000;
/** Samples used to resolve a waypoint's position back to a `u` value. */
const MARK_RESOLUTION_SAMPLES = 4000;

export interface Journey {
  curve: CatmullRomCurve3;
  /** Curve `u` for each section boundary. */
  marks: Record<JourneyMark, number>;
  /** Total path length in world units. */
  length: number;
  /** Control points of the scroll→u monotone spline. */
  spline: MonotoneSpline;
}

// ─────────────────────────────────────────────────────────────────────────────
// Monotone cubic Hermite (Fritsch–Carlson)
// ─────────────────────────────────────────────────────────────────────────────

export interface MonotoneSpline {
  xs: number[];
  ys: number[];
  ms: number[];
}

function buildMonotoneSpline(xs: number[], ys: number[]): MonotoneSpline {
  const n = xs.length;
  const dys: number[] = [];
  for (let i = 0; i < n - 1; i++) dys.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));

  const ms: number[] = new Array(n);
  ms[0] = dys[0];
  ms[n - 1] = dys[n - 2];
  for (let i = 1; i < n - 1; i++) ms[i] = (dys[i - 1] + dys[i]) / 2;

  // Clamp tangents so the curve cannot overshoot and reverse direction.
  for (let i = 0; i < n - 1; i++) {
    if (dys[i] === 0) {
      ms[i] = 0;
      ms[i + 1] = 0;
      continue;
    }
    const a = ms[i] / dys[i];
    const b = ms[i + 1] / dys[i];
    const s = a * a + b * b;
    if (s > 9) {
      const t = 3 / Math.sqrt(s);
      ms[i] = t * a * dys[i];
      ms[i + 1] = t * b * dys[i];
    }
  }

  return { xs, ys, ms };
}

export function evalMonotoneSpline({ xs, ys, ms }: MonotoneSpline, x: number): number {
  const n = xs.length;
  if (x <= xs[0]) return ys[0];
  if (x >= xs[n - 1]) return ys[n - 1];

  // Segments are few (9), so a linear scan beats a binary search here.
  let i = 0;
  while (i < n - 2 && x > xs[i + 1]) i++;

  const h = xs[i + 1] - xs[i];
  const t = (x - xs[i]) / h;
  const t2 = t * t;
  const t3 = t2 * t;

  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;

  return h00 * ys[i] + h10 * h * ms[i] + h01 * ys[i + 1] + h11 * h * ms[i + 1];
}

// ─────────────────────────────────────────────────────────────────────────────
// Build
// ─────────────────────────────────────────────────────────────────────────────

/** Throws loudly at init if the section scroll budget has a gap or overlap. */
function assertSections(list: JourneySection[]) {
  if (list[0].scroll[0] !== 0) {
    throw new Error(`[journey] first section must start at scroll 0, got ${list[0].scroll[0]}`);
  }
  if (list[list.length - 1].scroll[1] !== 1) {
    throw new Error('[journey] last section must end at scroll 1');
  }
  for (let i = 0; i < list.length; i++) {
    const [start, end] = list[i].scroll;
    if (end <= start) throw new Error(`[journey] section "${list[i].id}" has a non-positive span`);
    if (i > 0 && Math.abs(list[i - 1].scroll[1] - start) > 1e-9) {
      throw new Error(
        `[journey] gap/overlap between "${list[i - 1].id}" and "${list[i].id}": ` +
          `${list[i - 1].scroll[1]} → ${start}`,
      );
    }
  }
}

/**
 * Resolve each marked waypoint to its `u` on the arc-length-parameterised curve.
 *
 * The search walks forward only: mark N is always found at a larger `u` than
 * mark N-1. That makes it robust to a path that doubles back near itself (the
 * gallery run passes fairly close to the hallway).
 */
function resolveMarks(curve: CatmullRomCurve3): Record<JourneyMark, number> {
  const samples: Vector3[] = [];
  for (let i = 0; i <= MARK_RESOLUTION_SAMPLES; i++) {
    samples.push(curve.getPointAt(i / MARK_RESOLUTION_SAMPLES));
  }

  const marks = {} as Record<JourneyMark, number>;
  let cursor = 0;

  for (const wp of waypoints) {
    if (!wp.mark) continue;
    const target = new Vector3(...wp.position);

    let bestIdx = cursor;
    let bestDist = Infinity;
    for (let i = cursor; i <= MARK_RESOLUTION_SAMPLES; i++) {
      const d = samples[i].distanceToSquared(target);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }

    marks[wp.mark] = bestIdx / MARK_RESOLUTION_SAMPLES;
    cursor = bestIdx;
  }

  // The path must terminate exactly at the end of the curve.
  marks['journey-end'] = 1;
  return marks;
}

let cached: Journey | null = null;

export function buildJourney(): Journey {
  if (cached) return cached;

  assertSections(sections);

  const points = waypoints.map((w) => new Vector3(...w.position));
  // 'centripetal' avoids the cusps and overshoot that plain catmullrom produces
  // on the tight corners into the workshop and the study.
  const curve = new CatmullRomCurve3(points, false, 'centripetal', 0.5);
  curve.arcLengthDivisions = ARC_LENGTH_DIVISIONS;
  // Force the arc-length table to build now rather than on the first frame.
  const length = curve.getLength();

  const marks = resolveMarks(curve);

  // Control points for scroll→u: one per section boundary, plus the end.
  const xs = [...sections.map((s) => s.scroll[0]), 1];
  const ys = [...sections.map((s) => marks[s.id]), 1];
  const spline = buildMonotoneSpline(xs, ys);

  cached = { curve, marks, length, spline };
  return cached;
}

// ─────────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────────

/** Scroll progress (0–1) → position along the curve (0–1). */
export function scrollToU(progress: number): number {
  const { spline } = buildJourney();
  return clamp01(evalMonotoneSpline(spline, clamp01(progress)));
}

export interface SectionState {
  section: JourneySection;
  index: number;
  /** 0→1 progress within this section. */
  local: number;
}

/** Which room the camera is in, and how far through it. */
export function sectionAtScroll(progress: number): SectionState {
  const p = clamp01(progress);
  for (let i = 0; i < sections.length; i++) {
    const [start, end] = sections[i].scroll;
    if (p < end || i === sections.length - 1) {
      return { section: sections[i], index: i, local: clamp01((p - start) / (end - start)) };
    }
  }
  return { section: sections[0], index: 0, local: 0 };
}

/** Scroll progress at which a given room begins. Used by keyboard nav / the rail. */
export function scrollForSection(id: SectionId): number {
  const s = sections.find((x) => x.id === id);
  return s ? s.scroll[0] : 0;
}

// Scratch vectors — these are read every frame, so never allocate in the hot path.
const _pos = new Vector3();
const _look = new Vector3();

/** Camera position at scroll progress. Returns a shared vector — copy if you keep it. */
export function cameraPositionAt(progress: number): Vector3 {
  const { curve } = buildJourney();
  return curve.getPointAt(scrollToU(progress), _pos);
}

/**
 * Point the camera should look at: a little further along the curve.
 * `lookAhead` is in `u` units and comes from the active section, so corners can
 * be taken tightly (small lookAhead) and straights calmly (large).
 */
export function cameraLookAt(progress: number, lookAhead: number): Vector3 {
  const { curve } = buildJourney();
  const u = scrollToU(progress);
  return curve.getPointAt(Math.min(u + lookAhead, 1), _look);
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Smootherstep — used for reveal easing so nothing pops. */
export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

/**
 * Frame-rate independent damping. `lambda` is roughly "how fast", dt in seconds.
 * Used for the camera's head turn so it lags the path slightly and feels human.
 */
export const damp = (current: number, target: number, lambda: number, dt: number) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));

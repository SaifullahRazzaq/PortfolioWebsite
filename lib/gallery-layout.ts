/**
 * Where the project screens hang in The Gallery.
 *
 * Shared between the room (which builds the screens) and the camera rig (which
 * turns its head toward whichever screen you are level with). Keeping it in one
 * place means the glance can never drift out of sync with the geometry.
 */

import { projects } from '@/data/projects';

/*
 * Corridor half-width.
 *
 * This was 7m, which is why the screens never looked lit even when they were:
 * a screen 6.9m off the centre line, with the next one only 3.6m further down
 * the room, sits at roughly 70° to the camera for its entire powered-on window.
 * It was on, just outside the frustum. Narrowing the room to ~4m of lateral
 * offset puts the next screen at ~36° — comfortably in shot while you walk up
 * to it.
 */
export const GALLERY_HALF_WIDTH = 4.2;
export const GALLERY_HEIGHT = 4.5;
export const GALLERY_START_Z = -46;
export const GALLERY_END_Z = -86;

/** First screen sits far enough in that the camera has finished the corner. */
const FIRST_Z = -52.5;
/**
 * Spacing is set so consecutive screens are never both level with the camera.
 * Tighter than this and you walk a wall of screens; wider and the room reads
 * empty between them.
 */
const SPACING = 3.6;

/**
 * Screens are angled back toward the approaching camera rather than sitting flat
 * on the wall — around 50°, so a screen is legible from several metres *before*
 * you reach it. Flat to the wall it is edge-on exactly when you are closest to
 * it, which is the worst possible moment.
 */
/*
 * ~51°. Derived, not guessed: a screen sits 4.08m off the centre line and should
 * face the camera when the camera is about 5m short of it, so the normal wants
 * to point along (−4.08, 0, 5) — which is this angle off the wall.
 */
export const SCREEN_TOE_IN = 0.885; // radians

export interface ScreenPlacement {
  slug: string;
  index: number;
  side: 1 | -1;
  z: number;
  position: [number, number, number];
  rotationY: number;
}

export const screenPlacements: ScreenPlacement[] = projects.map((project, i) => {
  // Alternate walls. Right wall first: the camera enters from the left out of
  // the corner and is already facing that way.
  const side = (i % 2 === 0 ? 1 : -1) as 1 | -1;
  const z = FIRST_Z - i * SPACING;

  /*
   * Base rotation puts the screen flat against its wall, facing the centre line;
   * the toe-in then swings it to face back up the corridor toward +Z, which is
   * where the camera comes from.
   *
   * The sign matters and is easy to get backwards. A plane's normal is +Z in its
   * own space, and rotating by θ about Y sends it to (sin θ, 0, cos θ). For the
   * right-hand wall (base −π/2, normal −X) we need to add the toe-in to bring
   * cos θ positive; for the left wall (base +π/2) we need to subtract it. Hence
   * `+ side *`, not `− side *` — with the sign flipped the screens face the far
   * end of the room and read as dark slabs no matter how bright they are.
   */
  const base = side === -1 ? Math.PI / 2 : -Math.PI / 2;
  const rotationY = base + side * SCREEN_TOE_IN;

  return {
    slug: project.slug,
    index: i,
    side,
    z,
    position: [side * (GALLERY_HALF_WIDTH - 0.12), 2.0, z] as [number, number, number],
    rotationY,
  };
});

/**
 * Which screen the camera should be looking at, and how hard.
 *
 * Biased *ahead* of the camera by `LEAD`. Aiming at the nearest screen means the
 * gaze peaks when the screen is at 90° to the side — you snap your head at it as
 * it leaves the frame. Leading the target means you turn toward a screen while
 * still approaching it, read it, and let it pass.
 */
/**
 * How far ahead the gaze is aimed. Roughly one and a half screen-spacings: the
 * screens are toed in toward the approach, so the readable moment is several
 * metres before you draw level.
 */
const LEAD = 5.4;

/** Never aim past the final screen — beyond it there is only end wall. */
const LAST_Z = FIRST_Z - (projects.length - 1) * SPACING;

/** Index of the screen the camera is currently addressing. Used by the counter. */
export function activeScreenIndex(cameraZ: number): number {
  const focusZ = Math.max(cameraZ - LEAD, LAST_Z);
  let bestIndex = 0;
  let bestDistance = Infinity;
  for (const placement of screenPlacements) {
    const distance = Math.abs(focusZ - placement.z);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = placement.index;
    }
  }
  return bestIndex;
}

export function nearestScreen(cameraZ: number): { side: 1 | -1; pull: number } {
  // Travel is toward -Z, so "ahead" is a smaller z. Clamped so the gaze does not
  // swing off to a screen that does not exist once past the last one.
  const focusZ = Math.max(cameraZ - LEAD, LAST_Z);

  let best: ScreenPlacement | null = null;
  let bestDistance = Infinity;

  for (const placement of screenPlacements) {
    const distance = Math.abs(focusZ - placement.z);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = placement;
    }
  }

  if (!best) return { side: 1, pull: 0 };
  // Full attention within 1.2m of the lead point, none beyond 3.6m.
  const pull = 1 - Math.min(1, Math.max(0, (bestDistance - 1.2) / 2.4));
  return { side: best.side, pull };
}

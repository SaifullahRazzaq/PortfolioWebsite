/**
 * The palette walks with the camera.
 *
 * Night on the road → warm lamplight inside the house → dawn on the rooftop.
 * One set of stops, keyed by room, lerped by scroll progress. Both the 3D layer
 * (fog, ambient, background) and the DOM layer (CSS custom properties) read from
 * here, which is what keeps the 2D and 3D halves feeling like one image.
 */

import { Color } from 'three';
import { sections, type SectionId } from '@/data/journey';
import { clamp01, sectionAtScroll } from './curve';

export interface PaletteStop {
  /** Clear colour and fog colour — always the same value, so depth reads true. */
  bg: string;
  /** Warm practical lights. */
  accent: string;
  /** Cool interactive accent. */
  cool: string;
  /** Body text on the DOM layer. */
  text: string;
  /** Exponential fog density. Higher = shorter sightlines. */
  fog: number;
  /** Ambient light level. Rooms are lit mostly by their own practicals. */
  ambient: number;
}

const STOPS: Record<SectionId, PaletteStop> = {
  // Cold, wet, sodium-lit street. Heavy fog so the house reads as a destination.
  road: { bg: '#05060A', accent: '#FF8A3D', cool: '#6C8CFF', text: '#EDEAE4', fog: 0.014, ambient: 0.22 },
  // Warm light spilling out of the doorway starts to win.
  door: { bg: '#0B0806', accent: '#FFA24D', cool: '#6C8CFF', text: '#F3EFE8', fog: 0.03, ambient: 0.18 },
  // Interior: lamplight, matte walls.
  hallway: { bg: '#0C0A09', accent: '#FF8A3D', cool: '#5EE7D0', text: '#EDEAE4', fog: 0.026, ambient: 0.26 },
  // Cooler — this room is lit by screens and tools, not lamps.
  workshop: { bg: '#08090C', accent: '#FF8A3D', cool: '#5EE7D0', text: '#EDEAE4', fog: 0.022, ambient: 0.3 },
  // Darkest interior: the screens must be the brightest thing in frame.
  gallery: { bg: '#06070A', accent: '#FF8A3D', cool: '#5EE7D0', text: '#EDEAE4', fog: 0.018, ambient: 0.24 },
  // Single desk lamp.
  study: { bg: '#0A0806', accent: '#FF9A45', cool: '#5EE7D0', text: '#EDEAE4', fog: 0.028, ambient: 0.2 },
  // The turn. Night starts lifting.
  stairs: { bg: '#161A26', accent: '#FFB877', cool: '#8FB6FF', text: '#F2EFE9', fog: 0.02, ambient: 0.45 },
  // Dawn. Open sky, city below.
  rooftop: { bg: '#26304A', accent: '#FFC48A', cool: '#9FC4FF', text: '#FFFDF8', fog: 0.008, ambient: 0.75 },
};

export interface LivePalette {
  bg: Color;
  accent: Color;
  cool: Color;
  text: Color;
  fog: number;
  ambient: number;
}

// Scratch instances — `paletteAt` runs every frame and must not allocate.
const _live: LivePalette = {
  bg: new Color(STOPS.road.bg),
  accent: new Color(STOPS.road.accent),
  cool: new Color(STOPS.road.cool),
  text: new Color(STOPS.road.text),
  fog: STOPS.road.fog,
  ambient: STOPS.road.ambient,
};

/** One scratch pair per channel, so no statement can clobber another's operand. */
const _a = { bg: new Color(), accent: new Color(), cool: new Color(), text: new Color() };
const _b = { bg: new Color(), accent: new Color(), cool: new Color(), text: new Color() };

/**
 * Palette at a given scroll progress. Returns a shared object — read it, do not
 * hold onto it.
 *
 * Colours are interpolated in sRGB deliberately: linear-space blending between
 * a sodium orange and a dawn blue detours through a muddy grey, and sRGB keeps
 * the transition through the stairwell saturated.
 */
export function paletteAt(progress: number): LivePalette {
  const { section, index, local } = sectionAtScroll(progress);
  const next = sections[Math.min(index + 1, sections.length - 1)];

  const a = STOPS[section.id];
  const b = STOPS[next.id];
  // Ease the blend so the change lands in the middle of a room, not at its edge.
  const t = local * local * (3 - 2 * local);

  _live.bg.copy(_a.bg.set(a.bg)).lerp(_b.bg.set(b.bg), t);
  _live.accent.copy(_a.accent.set(a.accent)).lerp(_b.accent.set(b.accent), t);
  _live.cool.copy(_a.cool.set(a.cool)).lerp(_b.cool.set(b.cool), t);
  _live.text.copy(_a.text.set(a.text)).lerp(_b.text.set(b.text), t);
  _live.fog = a.fog + (b.fog - a.fog) * t;
  _live.ambient = a.ambient + (b.ambient - a.ambient) * t;

  return _live;
}

/**
 * Push the live palette onto the document as CSS custom properties, so DOM
 * overlays tint with the room the camera is standing in.
 *
 * Throttled: setProperty invalidates style, and doing it 60×/s for values that
 * change this slowly is wasted work.
 */
let lastWrite = 0;
export function writePaletteCss(progress: number, now: number) {
  if (now - lastWrite < 100) return;
  lastWrite = now;

  const p = paletteAt(clamp01(progress));
  const root = document.documentElement.style;
  root.setProperty('--journey-bg', `#${p.bg.getHexString()}`);
  root.setProperty('--journey-accent', `#${p.accent.getHexString()}`);
  root.setProperty('--journey-cool', `#${p.cool.getHexString()}`);
  root.setProperty('--journey-text', `#${p.text.getHexString()}`);
}

export const paletteStops = STOPS;

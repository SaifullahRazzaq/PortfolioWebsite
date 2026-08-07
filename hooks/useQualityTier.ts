'use client';

import { useMemo } from 'react';

export type QualityTier = 'low' | 'mid' | 'high';

export interface QualitySettings {
  tier: QualityTier;
  isMobile: boolean;
  /** [min, max] passed straight to <Canvas dpr>. Capped at 2 / 1.5 per spec. */
  dpr: [number, number];
  /** MeshReflectorMaterial floors — hallway and gallery only, and never on low. */
  reflections: boolean;
  /** DepthOfField is the most expensive pass; desktop only. */
  depthOfField: boolean;
  bloom: boolean;
  shadows: boolean;
  /** Multiplier applied to every particle/instance count in the scene. */
  particleScale: number;
  /** Segment counts for procedural geometry. */
  geometryDetail: number;
}

/**
 * Picks a quality tier once, at mount. Deliberately not reactive to resize —
 * re-creating the renderer mid-journey costs more than it saves.
 *
 * Heuristics only; there is no reliable GPU query on the web. We combine
 * pointer type, memory and core count, which correctly separates "phone",
 * "thin laptop" and "desktop" in practice.
 */
export function useQualityTier(): QualitySettings {
  return useMemo(() => {
    if (typeof window === 'undefined') return DESKTOP_DEFAULT;

    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const narrow = window.innerWidth < 900;
    const isMobile = coarse && narrow;

    const nav = navigator as Navigator & { deviceMemory?: number };
    const memory = nav.deviceMemory ?? 8;
    const cores = navigator.hardwareConcurrency ?? 8;

    let tier: QualityTier;
    if (isMobile || memory <= 4 || cores <= 4) tier = 'low';
    else if (memory <= 8 || cores <= 8) tier = 'mid';
    else tier = 'high';

    return {
      tier,
      isMobile,
      dpr: isMobile ? ([1, 1.5] as [number, number]) : ([1, 2] as [number, number]),
      reflections: tier !== 'low',
      depthOfField: tier === 'high',
      bloom: true,
      shadows: tier !== 'low',
      particleScale: tier === 'low' ? 0.3 : tier === 'mid' ? 0.65 : 1,
      geometryDetail: tier === 'low' ? 8 : tier === 'mid' ? 16 : 32,
    };
  }, []);
}

const DESKTOP_DEFAULT: QualitySettings = {
  tier: 'high',
  isMobile: false,
  dpr: [1, 2],
  reflections: true,
  depthOfField: true,
  bloom: true,
  shadows: true,
  particleScale: 1,
  geometryDetail: 32,
};

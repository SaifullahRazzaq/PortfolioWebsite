'use client';

import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';
import { Vector2 } from 'three';
import { useMemo } from 'react';
import { useQuality } from './QualityContext';

/**
 * Post stack.
 *
 * Bloom is kept deliberately restrained — high threshold, moderate intensity —
 * so it picks out the practicals and the project screens without washing the
 * blacks out. A dark, warm room stops being either of those things the moment
 * bloom is turned up.
 *
 * DepthOfField is the most expensive pass here and is desktop-only.
 */
export function Effects() {
  const quality = useQuality();
  const chromaticOffset = useMemo(() => new Vector2(0.0004, 0.0004), []);

  // On low tier the composer itself costs more than it returns: an extra
  // full-screen buffer on a phone GPU is the difference between 30fps and 20.
  if (quality.tier === 'low') return null;

  return (
    <EffectComposer
      // No extra depth buffer unless DepthOfField actually needs one.
      enableNormalPass={false}
      multisampling={quality.tier === 'high' ? 2 : 0}
    >
      <Bloom
        intensity={0.6}
        // Only genuinely emissive surfaces should glow.
        luminanceThreshold={0.82}
        luminanceSmoothing={0.28}
        kernelSize={KernelSize.LARGE}
        mipmapBlur
      />

      {/*
        No DepthOfField.
        It was both the most expensive pass here and the reason the project
        screens looked soft — at any fixed focus distance, screens read at
        3–12m away, so most of them sat outside the focal plane and got blurred
        exactly when they were meant to be read. Gallery legibility beats a
        cinematic defocus.
      */}

      <ChromaticAberration
        offset={chromaticOffset}
        radialModulation
        modulationOffset={0.35}
        blendFunction={BlendFunction.NORMAL}
      />

      <Vignette eskil={false} offset={0.28} darkness={0.72} />
    </EffectComposer>
  );
}

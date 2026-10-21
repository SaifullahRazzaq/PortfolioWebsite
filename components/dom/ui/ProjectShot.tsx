'use client';

import { useEffect, useRef, useState } from 'react';
import { drawAppShot } from '@/lib/screenTexture';
import type { Project } from '@/data/types';

/**
 * The project's real screenshot if one has been dropped into /public/projects,
 * otherwise the same drawn product shot the gallery screen uses.
 */
export function ProjectShot({ project, reveal = false }: { project: Project; reveal?: boolean }) {
  const [useImage, setUseImage] = useState(true);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (useImage) return;
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    ctx.scale(2, 2);
    drawAppShot(ctx, project, 0, 0, 968, 360);
  }, [useImage, project]);

  return (
    <div
      {...(reveal ? { 'data-modal-reveal': '' } : {})}
      className="overflow-hidden rounded-xl border border-white/10 bg-[#10141C]"
      style={{ aspectRatio: '968 / 360' }}
    >
      {useImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.thumbnail}
          alt={project.alt}
          loading="lazy"
          onError={() => setUseImage(false)}
          className="h-full w-full object-cover"
        />
      ) : (
        <canvas
          ref={canvas}
          width={1936}
          height={720}
          role="img"
          aria-label={project.alt}
          className="h-full w-full"
        />
      )}
    </div>
  );
}

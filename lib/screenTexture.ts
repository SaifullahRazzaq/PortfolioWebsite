/**
 * Draws a project "screen" to a 2D canvas, for use as a texture in The Gallery.
 *
 * Why canvas rather than drei's <Html>: nine DOM portals living inside the 3D
 * tree means nine subtrees the browser lays out and composites every frame, even
 * when the camera is three rooms away. A CanvasTexture is drawn once at mount
 * and is thereafter free. It also lets the power-on shader modulate the actual
 * pixels, which DOM overlaid on WebGL can never do.
 */

import {
  CanvasTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  SRGBColorSpace,
} from 'three';
import type { Project, TimelineEntry } from '@/data/types';

/**
 * Layout is authored in these logical units. `pixelScale` multiplies the backing
 * canvas; the context is scaled to match, so drawing code never changes.
 *
 * It defaults to 1, and that matters.
 *
 * It used to be a fixed 1.75, which put the nine screens and six cards at
 * ~219MB of canvas backing store plus GPU mipmaps — allocated in a single tick.
 * Browsers do not refuse that; under pressure they *discard* backing stores, and
 * a discarded canvas renders as blocky garbage rather than as nothing. That was
 * the corruption on the project screens.
 *
 * Sharpness never depended on it. The screens looked soft because mipmaps were
 * off and DepthOfField was defocusing them; both are fixed, and at 1024px across
 * a 3.5m panel with mipmapping and anisotropic filtering the type holds up.
 */
const W = 1024;
const H = 640;

const DISPLAY = '600 {size}px "Space Grotesk", ui-sans-serif, system-ui, sans-serif';
const BODY = '400 {size}px Inter, ui-sans-serif, system-ui, sans-serif';
const LABEL = '600 {size}px "Space Grotesk", ui-sans-serif, system-ui, sans-serif';

const font = (template: string, size: number) => template.replace('{size}', String(size));

/** Greedy word wrap. Returns the lines that fit within `maxWidth`. */
function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
      continue;
    }
    if (line) lines.push(line);
    line = word;
    if (lines.length === maxLines) break;
  }
  if (line && lines.length < maxLines) lines.push(line);

  // Ellipsise if we ran out of room.
  if (lines.length === maxLines) {
    const last = lines[maxLines - 1];
    if (ctx.measureText(last).width > maxWidth - 20) {
      let trimmed = last;
      while (trimmed.length > 4 && ctx.measureText(`${trimmed}…`).width > maxWidth - 20) {
        trimmed = trimmed.slice(0, -1);
      }
      lines[maxLines - 1] = `${trimmed}…`;
    }
  }
  return lines;
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function drawProjectScreen(
  project: Project,
  index: number,
  anisotropy = 1,
  pixelScale = 1,
): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(W * pixelScale);
  canvas.height = Math.round(H * pixelScale);
  const ctx = canvas.getContext('2d')!;
  ctx.scale(pixelScale, pixelScale);

  const accent = project.accent;
  const PAD = 64;

  /*
   * Backplate.
   *
   * Deliberately much lighter than the room. These panels are the only light
   * source in a near-black corridor, so a "dark card" texture just disappears —
   * it has to read as a monitor that is switched on. The values here are chosen
   * to sit above the bloom threshold once the screen is at full power.
   */
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#2C3340');
  bg.addColorStop(1, '#161B25');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // A wash of the project's accent, so each screen has its own colour
  // temperature rather than nine identical grey rectangles.
  const wash = ctx.createRadialGradient(W * 0.16, H * 0.08, 0, W * 0.16, H * 0.08, W * 0.9);
  wash.addColorStop(0, `${accent}66`);
  wash.addColorStop(1, `${accent}0A`);
  ctx.fillStyle = wash;
  ctx.fillRect(0, 0, W, H);

  /*
   * No scanlines.
   *
   * A 1px-on-4px pattern is finer than the texture's own mipmap footprint once
   * the panel is minified and viewed at ~50°, so it beat against the sample grid
   * and threw visible interference bands across the screen. Not worth it for an
   * effect nobody consciously registers.
   */

  // ── Index + category ──────────────────────────────────────────────────────
  ctx.font = font(LABEL, 26);
  ctx.fillStyle = accent;
  ctx.textBaseline = 'top';
  ctx.letterSpacing = '4px';
  ctx.fillText(String(index + 1).padStart(2, '0'), PAD, PAD);

  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.fillText(project.category.toUpperCase(), PAD + 70, PAD);
  ctx.letterSpacing = '0px';

  // ── Title ─────────────────────────────────────────────────────────────────
  ctx.font = font(DISPLAY, 76);
  ctx.fillStyle = '#FFFFFF';
  const titleLines = wrap(ctx, project.title, W - PAD * 2, 2);
  let y = PAD + 74;
  for (const line of titleLines) {
    ctx.fillText(line, PAD, y);
    y += 84;
  }

  // ── Tagline ───────────────────────────────────────────────────────────────
  ctx.font = font(BODY, 30);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  y += 8;
  for (const line of wrap(ctx, project.tagline, W - PAD * 2, 3)) {
    ctx.fillText(line, PAD, y);
    y += 42;
  }

  // ── Stack chips ───────────────────────────────────────────────────────────
  ctx.font = font(LABEL, 22);
  let chipX = PAD;
  const chipY = H - PAD - 116;
  for (const item of project.stack.slice(0, 5)) {
    const textWidth = ctx.measureText(item).width;
    const chipW = textWidth + 34;
    if (chipX + chipW > W - PAD) break;

    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    roundedRect(ctx, chipX, chipY, chipW, 42, 21);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fillText(item, chipX + 17, chipY + 10);
    chipX += chipW + 12;
  }

  // ── Metric + call to action ───────────────────────────────────────────────
  ctx.font = font(LABEL, 24);
  ctx.fillStyle = accent;
  ctx.letterSpacing = '2px';
  ctx.fillText(project.metrics[0] ?? '', PAD, H - PAD - 44);

  const cta = 'VIEW  →';
  const ctaWidth = ctx.measureText(cta).width;
  ctx.fillStyle = '#08090C';
  roundedRect(ctx, W - PAD - ctaWidth - 44, H - PAD - 56, ctaWidth + 44, 52, 26);
  ctx.fillStyle = accent;
  ctx.fill();
  ctx.fillStyle = '#08090C';
  ctx.fillText(cta, W - PAD - ctaWidth - 22, H - PAD - 42);
  ctx.letterSpacing = '0px';

  // ── Bezel highlight ───────────────────────────────────────────────────────
  ctx.strokeStyle = `${accent}CC`;
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, W - 4, H - 4);

  return toTexture(canvas, anisotropy);
}

/**
 * A holographic timeline card for The Study. Same technique, smaller surface:
 * role, employer, dates and one line of detail.
 */
const CARD_W = 768;
const CARD_H = 384;

export function drawTimelineCard(
  entry: TimelineEntry,
  accent: string,
  anisotropy = 1,
  pixelScale = 1,
): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(CARD_W * pixelScale);
  canvas.height = Math.round(CARD_H * pixelScale);
  const ctx = canvas.getContext('2d')!;
  ctx.scale(pixelScale, pixelScale);
  const PAD = 48;

  const bg = ctx.createLinearGradient(0, 0, CARD_W, CARD_H);
  bg.addColorStop(0, 'rgba(20,23,30,0.96)');
  bg.addColorStop(1, 'rgba(10,11,15,0.96)');
  ctx.fillStyle = bg;
  roundedRect(ctx, 0, 0, CARD_W, CARD_H, 18);
  ctx.fill();

  // Accent spine down the left edge — the "timeline" read.
  ctx.fillStyle = accent;
  roundedRect(ctx, 0, 0, 7, CARD_H, 4);
  ctx.fill();

  ctx.textBaseline = 'top';

  // Period + kind
  ctx.font = font(LABEL, 21);
  ctx.letterSpacing = '3px';
  ctx.fillStyle = accent;
  ctx.fillText(entry.period.toUpperCase(), PAD, PAD);
  ctx.fillStyle = 'rgba(237,234,228,0.4)';
  ctx.fillText(
    entry.kind === 'education' ? 'EDUCATION' : 'ROLE',
    CARD_W - PAD - ctx.measureText(entry.kind === 'education' ? 'EDUCATION' : 'ROLE').width,
    PAD,
  );
  ctx.letterSpacing = '0px';

  // Role
  ctx.font = font(DISPLAY, 44);
  ctx.fillStyle = '#EDEAE4';
  let y = PAD + 46;
  for (const line of wrap(ctx, entry.role, CARD_W - PAD * 2, 2)) {
    ctx.fillText(line, PAD, y);
    y += 52;
  }

  // Employer
  ctx.font = font(BODY, 28);
  ctx.fillStyle = accent;
  ctx.fillText(entry.org, PAD, y + 4);
  y += 52;

  // Detail
  ctx.font = font(BODY, 24);
  ctx.fillStyle = 'rgba(237,234,228,0.66)';
  for (const line of wrap(ctx, entry.description, CARD_W - PAD * 2, 3)) {
    ctx.fillText(line, PAD, y);
    y += 34;
  }

  ctx.strokeStyle = `${accent}3A`;
  ctx.lineWidth = 2;
  roundedRect(ctx, 1, 1, CARD_W - 2, CARD_H - 2, 18);
  ctx.stroke();

  return toTexture(canvas, anisotropy);
}

/**
 * `anisotropy` must be the renderer's max — set by the caller, which has the GL
 * context. Without it, a panel viewed at 50° smears along its long axis.
 */
export function toTexture(canvas: HTMLCanvasElement, anisotropy = 1): CanvasTexture {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.magFilter = LinearFilter;
  /*
   * Mipmaps are essential here, not optional.
   *
   * These panels are always minified — a 1536px texture drawn across a few
   * hundred screen pixels, at an angle. With `generateMipmaps = false` and a
   * linear min filter, the GPU point-samples one texel per pixel and the text
   * turns into shimmering mush. That was the "gallery content is blurry".
   */
  texture.generateMipmaps = true;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.anisotropy = anisotropy;
  texture.needsUpdate = true;
  return texture;
}

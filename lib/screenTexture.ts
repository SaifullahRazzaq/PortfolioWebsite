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


/**
 * A believable product screenshot drawn from primitives — browser chrome plus a
 * layout chosen by project category. Deterministic (seeded by title) so a redraw
 * never changes what the viewer saw.
 */
export function drawAppShot(
  ctx: CanvasRenderingContext2D,
  project: Project,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const accent = project.accent;
  let seed = 0;
  for (const ch of project.title) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  ctx.save();
  roundedRect(ctx, x, y, w, h, 14);
  ctx.clip();
  ctx.fillStyle = '#10141C';
  ctx.fillRect(x, y, w, h);

  // Browser chrome
  ctx.fillStyle = '#1A1F2A';
  ctx.fillRect(x, y, w, 34);
  ['#FF5F57', '#FEBC2E', '#28C840'].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(x + 20 + i * 20, y + 17, 6, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = '#0B0E14';
  roundedRect(ctx, x + 110, y + 7, w - 220, 20, 10);
  ctx.fill();
  ctx.font = font(BODY, 13);
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.textBaseline = 'middle';
  ctx.fillText(`app.${project.slug.replace(/-/g, '')}.com`, x + 128, y + 17);

  const top = y + 34;
  const bodyH = h - 34;
  const SIDE = 150;

  // Sidebar
  ctx.fillStyle = '#0D1118';
  ctx.fillRect(x, top, SIDE, bodyH);
  ctx.fillStyle = accent;
  roundedRect(ctx, x + 16, top + 16, 22, 22, 6);
  ctx.fill();
  ctx.font = font(LABEL, 14);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(project.title.slice(0, 11), x + 46, top + 28);
  const nav = ['Overview', 'Contacts', 'Pipeline', 'Reports', 'Settings'];
  nav.forEach((label, i) => {
    const ny = top + 62 + i * 36;
    if (i === 0) {
      ctx.fillStyle = `${accent}26`;
      roundedRect(ctx, x + 10, ny - 4, SIDE - 20, 30, 8);
      ctx.fill();
    }
    ctx.fillStyle = i === 0 ? accent : 'rgba(255,255,255,0.28)';
    roundedRect(ctx, x + 20, ny + 4, 12, 12, 3);
    ctx.fill();
    ctx.font = font(BODY, 14);
    ctx.fillStyle = i === 0 ? '#FFFFFF' : 'rgba(255,255,255,0.6)';
    ctx.fillText(label, x + 42, ny + 10);
  });

  const cx = x + SIDE + 20;
  const cw = w - SIDE - 40;
  const kind =
    project.category === 'marketplace' || project.category === 'commerce'
      ? 'cards'
      : project.category === 'ai'
        ? 'dashboard'
        : 'list';

  ctx.font = font(LABEL, 18);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(
    kind === 'cards' ? 'Browse' : kind === 'list' ? 'Today' : 'Pipeline overview',
    cx,
    top + 26,
  );

  if (kind === 'dashboard') {
    const kpis = ['Leads', 'Qualified', 'Closed', 'Revenue'];
    const kw = (cw - 3 * 12) / 4;
    kpis.forEach((label, i) => {
      const kx = cx + i * (kw + 12);
      ctx.fillStyle = '#171C27';
      roundedRect(ctx, kx, top + 46, kw, 62, 10);
      ctx.fill();
      ctx.font = font(BODY, 12);
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.fillText(label, kx + 12, top + 62);
      ctx.font = font(LABEL, 22);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(String(Math.round(120 + rnd() * 880)), kx + 12, top + 88);
    });
    // Line chart
    const chY = top + 124;
    const chH = 120;
    ctx.fillStyle = '#171C27';
    roundedRect(ctx, cx, chY, cw * 0.62, chH + 20, 10);
    ctx.fill();
    ctx.beginPath();
    let v = 0.5;
    const n = 24;
    for (let i = 0; i < n; i++) {
      v = Math.min(0.9, Math.max(0.15, v + (rnd() - 0.42) * 0.22));
      const px = cx + 16 + (i / (n - 1)) * (cw * 0.62 - 32);
      const py = chY + 14 + (1 - v) * (chH - 10);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.lineTo(cx + cw * 0.62 - 16, chY + chH + 6);
    ctx.lineTo(cx + 16, chY + chH + 6);
    ctx.closePath();
    ctx.fillStyle = `${accent}22`;
    ctx.fill();
    // Funnel bars
    const fx = cx + cw * 0.62 + 12;
    const fw = cw * 0.38 - 12;
    ctx.fillStyle = '#171C27';
    roundedRect(ctx, fx, chY, fw, chH + 20, 10);
    ctx.fill();
    for (let i = 0; i < 4; i++) {
      const bw = (fw - 32) * (1 - i * 0.22);
      ctx.fillStyle = i === 0 ? accent : `${accent}${['', 'AA', '77', '44'][i]}`;
      roundedRect(ctx, fx + 16, chY + 16 + i * 30, bw, 20, 6);
      ctx.fill();
    }
  } else if (kind === 'cards') {
    const cols = 3;
    const gw = (cw - (cols - 1) * 12) / cols;
    for (let i = 0; i < cols * 2; i++) {
      const gx = cx + (i % cols) * (gw + 12);
      const gy = top + 46 + Math.floor(i / cols) * 132;
      ctx.fillStyle = '#171C27';
      roundedRect(ctx, gx, gy, gw, 120, 10);
      ctx.fill();
      const g = ctx.createLinearGradient(gx, gy, gx + gw, gy + 70);
      g.addColorStop(0, `${accent}${i % 2 ? '55' : '88'}`);
      g.addColorStop(1, '#232A38');
      ctx.fillStyle = g;
      roundedRect(ctx, gx + 8, gy + 8, gw - 16, 68, 8);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      roundedRect(ctx, gx + 10, gy + 88, gw * 0.55, 8, 4);
      ctx.fill();
      ctx.fillStyle = accent;
      roundedRect(ctx, gx + 10, gy + 103, gw * 0.3, 8, 4);
      ctx.fill();
    }
  } else {
    for (let i = 0; i < 5; i++) {
      const ry = top + 46 + i * 52;
      ctx.fillStyle = '#171C27';
      roundedRect(ctx, cx, ry, cw, 44, 10);
      ctx.fill();
      ctx.fillStyle = i === 1 ? accent : '#2A3242';
      ctx.beginPath();
      ctx.arc(cx + 24, ry + 22, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      roundedRect(ctx, cx + 48, ry + 12, 120 + rnd() * 90, 8, 4);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      roundedRect(ctx, cx + 48, ry + 27, 80 + rnd() * 70, 6, 3);
      ctx.fill();
      ctx.fillStyle = `${accent}33`;
      roundedRect(ctx, cx + cw - 86, ry + 11, 70, 22, 11);
      ctx.fill();
    }
  }
  ctx.restore();
  ctx.textBaseline = 'top';
}

/** Resolves to the project's real screenshot, or null if none has been added. */
export function loadShot(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

export function drawProjectScreen(
  project: Project,
  index: number,
  anisotropy = 1,
  pixelScale = 1,
  image: HTMLImageElement | null = null,
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
  ctx.fillStyle = '#0B0E14';
  ctx.fillRect(0, 0, W, H);

  // ── Product screenshot (top) ──────────────────────────────────────────────
  const SHOT_H = 360;
  if (image) {
    // object-fit: cover into the same rounded frame the drawn shot uses.
    const fw = W - 56;
    const scale = Math.max(fw / image.width, SHOT_H / image.height);
    ctx.save();
    roundedRect(ctx, 28, 28, fw, SHOT_H, 14);
    ctx.clip();
    ctx.drawImage(
      image,
      28 + (fw - image.width * scale) / 2,
      28 + (SHOT_H - image.height * scale) / 2,
      image.width * scale,
      image.height * scale,
    );
    ctx.restore();
  } else {
    drawAppShot(ctx, project, 28, 28, W - 56, SHOT_H);
  }

  // ── Caption band (bottom): plain, high-contrast, never over the screenshot ─
  const bandY = SHOT_H + 28 + 22;
  ctx.textBaseline = 'top';
  ctx.font = font(LABEL, 22);
  ctx.letterSpacing = '3px';
  ctx.fillStyle = accent;
  ctx.fillText(String(index + 1).padStart(2, '0'), PAD - 24, bandY);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText(project.category.toUpperCase(), PAD + 24, bandY);
  ctx.letterSpacing = '0px';

  ctx.font = font(DISPLAY, 50);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(wrap(ctx, project.title, W - PAD * 2 - 220, 1)[0], PAD - 24, bandY + 34);

  ctx.font = font(BODY, 24);
  ctx.fillStyle = 'rgba(255,255,255,0.82)';
  wrap(ctx, project.tagline, W - PAD * 2 + 40, 2).forEach((line, i) => {
    ctx.fillText(line, PAD - 24, bandY + 98 + i * 32);
  });

  // CTA pill, bottom right of the title row.
  ctx.font = font(LABEL, 22);
  ctx.letterSpacing = '2px';
  const cta = 'VIEW  →';
  const ctaWidth = ctx.measureText(cta).width;
  const ctaX = W - 40 - ctaWidth - 40;
  ctx.fillStyle = accent;
  roundedRect(ctx, ctaX, bandY + 36, ctaWidth + 40, 48, 24);
  ctx.fill();
  ctx.fillStyle = '#08090C';
  ctx.fillText(cta, ctaX + 20, bandY + 49);
  ctx.letterSpacing = '0px';

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

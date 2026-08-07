# Saifullah Razzaq — Portfolio

A single-page, scroll-driven 3D portfolio. The whole site is one continuous camera
journey: scrolling walks a camera down a night road, through a door, and room by
room through a house. Each room is a section.

```
The Road → The Door → The Hallway → The Workshop → The Gallery → The Study → The Stairs → The Rooftop
  hero        entry       about        skills        projects     experience    transition    contact
```

## Stack

Next.js (App Router) · TypeScript · Tailwind v4 · three.js via @react-three/fiber +
drei + postprocessing · GSAP ScrollTrigger · Lenis

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck
npm run lint
npm run build
```

## How the journey works

Three pieces, and it is worth reading them in this order:

1. **`data/journey.ts`** — the camera path as a list of waypoints, plus how much
   scroll each room gets. This is the only file with coordinates in it. Move a
   waypoint here and the camera moves.
2. **`lib/curve.ts`** — turns those waypoints into an arc-length-parameterised
   `CatmullRomCurve3`, and maps scroll progress onto position along it with a
   monotone cubic. Monotone so scrolling up always reverses exactly; cubic so the
   camera never changes speed abruptly at a room boundary.
3. **`components/canvas/CameraRig.tsx`** — the only thing allowed to move the
   camera. Reads scroll progress every frame and places the camera on the curve.

Scroll progress itself lives in `lib/journey-state.ts` as a plain mutable number,
**not** React state. One `ScrollTrigger` (in `hooks/useScrollProgress.ts`) scrubs
it 0→1 across a tall spacer. Everything else derives from that number. React only
re-renders when the camera crosses into a different room.

## Editing content

All copy lives in `/data` as typed objects — you never need to touch a component
to change what the site says.

| File | What it holds |
| --- | --- |
| `data/profile.ts` | Name, role, tagline, bio, stats, CV link |
| `data/projects.ts` | Every project: copy, stack, links, demo credentials |
| `data/skills.ts` | Skill nodes for The Workshop |
| `data/experience.ts` | Timeline entries for The Study |
| `data/contact.ts` | Email, WhatsApp, socials, form endpoint |
| `data/journey.ts` | Camera path and scroll choreography |

## Accessibility

Everything the 3D scene says also exists as ordinary semantic HTML in
`components/dom/static/SemanticContent.tsx` — headings, lists, real links. That is
what screen readers and crawlers get. `prefers-reduced-motion` and the "skip the
journey" control serve a static 2D layout built from the same data.

## Layout

```
app/          routes, metadata, global styles
components/
  canvas/     3D — rooms, props, effects, the camera rig
  dom/        2D — overlays, UI, the static fallback
  providers/  Lenis
data/         all content, typed
hooks/        scroll, quality tier, pointer, motion preference
lib/          gsap + lenis setup, the curve, journey state
shaders/      GLSL as typed template literals
legacy/       the previous static site, kept for reference
```

## The previous version

`legacy/` holds the original static HTML site. The React/Vite version it replaced
is in git history before the `feat/journey` branch.

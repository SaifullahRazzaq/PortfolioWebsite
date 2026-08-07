'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { CopyField } from '../ui/CopyField';
import { MagneticButton } from '../ui/MagneticButton';
import { useLenis } from '@/components/providers/LenisProvider';
import type { Project } from '@/data/types';

/**
 * Full-screen project detail.
 *
 * Animated open over the journey — the page never navigates and the camera never
 * moves, so closing it puts you back exactly where you were standing.
 *
 * While it is open Lenis is stopped, otherwise a wheel event inside the modal
 * would walk the camera down the gallery behind it.
 */
export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const lenis = useLenis();
  const root = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    // Capture the instance now: cleanup must resume the same Lenis it paused,
    // not whatever happens to be in the ref later.
    const instance = lenis?.current ?? null;
    instance?.stop();

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.28, ease: 'power2.out' })
        .fromTo(
          sheet.current,
          { y: 48, scale: 0.985, autoAlpha: 0 },
          { y: 0, scale: 1, autoAlpha: 1, duration: 0.5, ease: 'expo.out' },
          0.04,
        )
        .fromTo(
          sheet.current?.querySelectorAll('[data-modal-reveal]') ?? [],
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.45, ease: 'power2.out', stagger: 0.045 },
          0.16,
        );
    });

    closeButton.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !sheet.current) return;

      // Focus trap: keep Tab inside the dialog while it is open.
      const focusables = sheet.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      ctx.revert();
      instance?.start();
      previouslyFocused.current?.focus();
    };
  }, [project, onClose, lenis]);

  if (!project) return null;

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      style={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto overscroll-contain bg-black/70 p-0 backdrop-blur-md sm:items-center sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={sheet}
        className="relative w-full max-w-4xl rounded-t-3xl border border-white/12 bg-[#0B0C11]/95 p-6 shadow-2xl sm:rounded-3xl sm:p-10"
        style={{
          // A wash of the project's own accent, so the sheet belongs to the
          // screen it was opened from.
          backgroundImage: `radial-gradient(120% 80% at 0% 0%, ${project.accent}1A 0%, transparent 60%)`,
        }}
      >
        <button
          ref={closeButton}
          onClick={onClose}
          data-cursor="hover"
          aria-label="Close project details"
          className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-bone-dim transition-colors hover:border-white/40 hover:text-bone"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            ×
          </span>
        </button>

        <p data-modal-reveal className="label text-[0.5625rem]" style={{ color: project.accent }}>
          {project.category}
        </p>

        <h2
          id="project-modal-title"
          data-modal-reveal
          className="mt-3 pr-12 font-display text-[clamp(1.75rem,5vw,3.25rem)] leading-[1.02] font-bold tracking-[-0.02em] text-bone"
        >
          {project.title}
        </h2>

        <p data-modal-reveal className="mt-3 max-w-2xl text-base text-bone-dim sm:text-lg">
          {project.tagline}
        </p>

        <p data-modal-reveal className="mt-6 max-w-2xl text-sm leading-relaxed text-bone-dim">
          {project.description}
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div data-modal-reveal>
            <p className="label mb-3 text-[0.5625rem]">What it does</p>
            <ul className="space-y-2">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-3 text-[0.8125rem] leading-relaxed text-bone-dim">
                  <span
                    aria-hidden="true"
                    className="mt-[0.5rem] block h-1 w-1 shrink-0 rounded-full"
                    style={{ background: project.accent }}
                  />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <div data-modal-reveal>
              <p className="label mb-3 text-[0.5625rem]">Stack</p>
              <ul className="flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-[0.6875rem] text-bone-dim"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div data-modal-reveal>
              <p className="label mb-3 text-[0.5625rem]">Results</p>
              <ul className="flex flex-wrap gap-x-5 gap-y-1">
                {project.metrics.map((metric) => (
                  <li
                    key={metric}
                    className="font-display text-sm font-semibold"
                    style={{ color: project.accent }}
                  >
                    {metric}
                  </li>
                ))}
              </ul>
            </div>

            {project.demo ? (
              <div data-modal-reveal>
                <p className="label mb-2 text-[0.5625rem]">Demo access</p>
                <p className="mb-3 text-[0.75rem] leading-relaxed text-bone-faint">
                  {project.demo.note}
                </p>
                {project.demo.fields ? (
                  <div className="space-y-2">
                    {project.demo.fields.map((field) => (
                      <CopyField key={field.label} label={field.label} value={field.value} />
                    ))}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div data-modal-reveal className="mt-9 flex flex-wrap gap-3 border-t border-white/10 pt-6">
          {project.links.map((link, i) => (
            <MagneticButton
              key={link.url}
              as="a"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              strength={0.2}
              className={
                i === 0
                  ? 'inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-display text-[0.6875rem] tracking-[0.18em] uppercase text-[#08090C] transition-opacity hover:opacity-90'
                  : 'inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 font-display text-[0.6875rem] tracking-[0.18em] uppercase text-bone transition-colors hover:border-white/40'
              }
              style={i === 0 ? { background: project.accent } : undefined}
            >
              {link.label} <span aria-hidden="true">↗</span>
            </MagneticButton>
          ))}
        </div>
      </div>
    </div>
  );
}

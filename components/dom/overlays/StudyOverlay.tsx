'use client';

import { Kicker, OverlayPanel } from './OverlayPanel';
import { timeline } from '@/data/experience';

/**
 * 6. THE STUDY — Experience.
 *
 * The holographic cards above the desk carry role, employer and detail, so this
 * panel gives the shape of the whole run: where it started, where it is now.
 * Sits left; the desk and cards occupy the right of frame.
 */
export function StudyOverlay() {
  const first = timeline[timeline.length - 1];
  const latest = timeline[0];
  const roles = timeline.filter((entry) => entry.kind === 'work').length;

  return (
    <OverlayPanel section="study" place="left">
      <Kicker>Experience</Kicker>

      <h2
        data-reveal
        className="font-display text-[clamp(2rem,5vw,3.75rem)] leading-[1.02] font-bold tracking-[-0.02em] text-balance text-bone"
      >
        {first.startYear} to now.
      </h2>

      <p data-reveal className="mt-5 max-w-md text-sm leading-relaxed text-bone-dim sm:text-base">
        {roles} engineering roles across mobile, web and agentic AI — from a first
        Android build at {first.org.replace('Bahria University', 'university')} to
        leading delivery at {latest.org}.
      </p>

      <ol data-reveal className="mt-9 space-y-3 border-l border-white/12 pl-5">
        {timeline.map((entry) => (
          <li key={`${entry.org}-${entry.startYear}`} className="relative">
            <span
              className="absolute top-[0.45rem] -left-[1.4rem] block h-1.5 w-1.5 rounded-full"
              style={{
                background:
                  entry.kind === 'education' ? 'var(--journey-cool)' : 'var(--journey-accent)',
              }}
            />
            <p className="text-[0.8125rem] leading-snug text-bone">{entry.role}</p>
            <p className="text-[0.6875rem] text-bone-faint">
              {entry.org} · {entry.period}
            </p>
          </li>
        ))}
      </ol>
    </OverlayPanel>
  );
}

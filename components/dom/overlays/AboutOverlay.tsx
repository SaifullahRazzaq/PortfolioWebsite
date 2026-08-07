'use client';

import { Kicker, OverlayPanel } from './OverlayPanel';
import { profile } from '@/data/profile';

/**
 * 3. THE HALLWAY — About.
 *
 * Sits to the left so the framed panels sliding along the right-hand wall stay
 * visible behind it.
 */
export function AboutOverlay() {
  return (
    <OverlayPanel section="hallway" place="left">
      <Kicker>About</Kicker>

      <h2
        data-reveal
        className="font-display text-[clamp(2rem,5vw,3.75rem)] leading-[1.02] font-bold tracking-[-0.02em] text-balance text-bone"
      >
        Six years shipping things people actually use.
      </h2>

      {profile.bio.map((paragraph) => (
        <p
          key={paragraph.slice(0, 20)}
          data-reveal
          className="mt-5 max-w-lg text-sm leading-relaxed text-bone-dim sm:text-base"
        >
          {paragraph}
        </p>
      ))}

      <dl data-reveal className="mt-9 grid grid-cols-3 gap-4 sm:gap-6">
        {profile.stats.map((stat) => (
          <div key={stat.label} className="border-t border-white/12 pt-3">
            <dt className="sr-anchor">{stat.label}</dt>
            <dd>
              <span className="block font-display text-2xl font-bold text-[var(--journey-accent)] sm:text-4xl">
                {stat.value}
              </span>
              <span className="mt-1 block text-[0.6875rem] leading-snug text-bone-faint">
                {stat.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>

      <p data-reveal className="label mt-8 text-[0.5625rem]">
        {profile.location}
      </p>
    </OverlayPanel>
  );
}

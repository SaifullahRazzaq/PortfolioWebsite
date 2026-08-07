'use client';

import { Kicker, OverlayPanel } from './OverlayPanel';
import { skills, specialisations } from '@/data/skills';

/**
 * 4. THE WORKSHOP — Skills.
 *
 * Placed right so the orbiting nodes, which assemble around the centre-left of
 * frame, stay clear. The 3D nodes are the hero here; this panel is the index.
 */

const GROUP_LABELS: Record<string, string> = {
  core: 'Core',
  ai: 'Agentic AI',
  backend: 'Backend',
  platform: 'Platform',
};

export function SkillsOverlay() {
  const grouped = Object.entries(GROUP_LABELS).map(([group, label]) => ({
    label,
    items: skills.filter((s) => s.group === group),
  }));

  return (
    <OverlayPanel section="workshop" place="right">
      <Kicker>Skills</Kicker>

      <h2
        data-reveal
        className="font-display text-[clamp(2rem,5vw,3.75rem)] leading-[1.02] font-bold tracking-[-0.02em] text-balance text-bone"
      >
        The workshop.
      </h2>

      <p data-reveal className="mt-4 max-w-md text-sm leading-relaxed text-bone-dim">
        Hover any node to name it.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-7">
        {grouped.map((group) => (
          <div key={group.label} data-reveal>
            <p className="label mb-3 text-[0.5625rem] text-[var(--journey-cool)]">{group.label}</p>
            <ul className="space-y-1.5">
              {group.items.map((skill) => (
                <li key={skill.name} className="text-[0.8125rem] leading-snug text-bone-dim">
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div data-reveal className="mt-8 border-t border-white/12 pt-5">
        <p className="label mb-3 text-[0.5625rem]">Specialisations</p>
        <ul className="flex flex-wrap gap-x-2 gap-y-2">
          {specialisations.map((item) => (
            <li
              key={item}
              className="rounded-full border border-white/12 px-3 py-1 text-[0.6875rem] text-bone-dim"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </OverlayPanel>
  );
}

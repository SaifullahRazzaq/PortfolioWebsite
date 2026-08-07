'use client';

import { useState } from 'react';
import { CopyField } from '../ui/CopyField';
import { profile } from '@/data/profile';
import { skills, specialisations } from '@/data/skills';
import { projects } from '@/data/projects';
import { timeline } from '@/data/experience';
import { contact, socials } from '@/data/contact';

/**
 * The plain layout: served for `prefers-reduced-motion`, and reachable any time
 * via "Skip the journey".
 *
 * Same content, same palette, same typography — a designed page rather than a
 * degraded one. Transitions are limited to colour and opacity; nothing moves
 * more than a few pixels, and nothing animates on scroll.
 */
export function StaticFallback({ onEnterJourney }: { onEnterJourney?: () => void }) {
  return (
    <div className="min-h-dvh bg-[#08090C] text-bone">
      <div className="mx-auto max-w-4xl px-6 py-20 sm:px-8 md:py-28">
        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <header>
          <p className="label mb-6">{profile.role}</p>
          <h1 className="font-display text-[clamp(2.75rem,10vw,6rem)] leading-[0.92] font-bold tracking-[-0.03em]">
            {profile.firstName}
            <br />
            <span className="text-amber">{profile.lastName}</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-bone-dim">{profile.tagline}</p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-amber px-6 py-3 font-display text-[0.6875rem] tracking-[0.18em] uppercase text-[#08090C] transition-opacity hover:opacity-90"
            >
              Message on WhatsApp
            </a>
            <a
              href={profile.resumeUrl}
              download
              className="rounded-full border border-white/15 px-6 py-3 font-display text-[0.6875rem] tracking-[0.18em] uppercase transition-colors hover:border-mint hover:text-mint"
            >
              Download CV
            </a>
            {onEnterJourney ? (
              <button
                onClick={onEnterJourney}
                className="rounded-full px-6 py-3 font-display text-[0.6875rem] tracking-[0.18em] uppercase text-bone-faint transition-colors hover:text-bone"
              >
                Enter the 3D journey →
              </button>
            ) : null}
          </div>
        </header>

        {/* ── About ──────────────────────────────────────────────────────── */}
        <Section id="about" title="About">
          {profile.bio.map((paragraph) => (
            <p key={paragraph.slice(0, 20)} className="mb-4 max-w-2xl leading-relaxed text-bone-dim">
              {paragraph}
            </p>
          ))}
          <dl className="mt-8 grid grid-cols-3 gap-6">
            {profile.stats.map((stat) => (
              <div key={stat.label} className="border-t border-white/12 pt-3">
                <dd className="font-display text-3xl font-bold text-amber">{stat.value}</dd>
                <dt className="mt-1 text-xs text-bone-faint">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </Section>

        {/* ── Skills ─────────────────────────────────────────────────────── */}
        <Section id="skills" title="Skills">
          <ul className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li
                key={skill.name}
                className="rounded-full border border-white/12 bg-white/[0.03] px-3.5 py-1.5 text-sm text-bone-dim"
              >
                {skill.name}
              </li>
            ))}
          </ul>
          <p className="label mt-8 mb-3 text-[0.5625rem]">Specialisations</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-bone-dim">
            {specialisations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Section>

        {/* ── Projects ───────────────────────────────────────────────────── */}
        <Section id="projects" title="Projects">
          <div className="space-y-4">
            {projects.map((project) => (
              <StaticProject key={project.slug} slug={project.slug} />
            ))}
          </div>
        </Section>

        {/* ── Experience ─────────────────────────────────────────────────── */}
        <Section id="experience" title="Experience">
          <ol className="space-y-6 border-l border-white/12 pl-6">
            {timeline.map((entry) => (
              <li key={`${entry.org}-${entry.startYear}`} className="relative">
                <span
                  className="absolute top-2 -left-[1.6rem] block h-2 w-2 rounded-full"
                  style={{ background: entry.kind === 'education' ? '#5EE7D0' : '#FF8A3D' }}
                />
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-base font-semibold">{entry.role}</h3>
                  <span className="text-xs text-bone-faint">{entry.period}</span>
                </div>
                <p className="text-sm text-amber">{entry.org}</p>
                <p className="mt-1 text-sm leading-relaxed text-bone-dim">{entry.description}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* ── Contact ────────────────────────────────────────────────────── */}
        <Section id="contact" title="Contact">
          <p className="mb-6 max-w-xl leading-relaxed text-bone-dim">{contact.subhead}</p>
          <ul className="max-w-xl">
            {socials.map((social) => (
              <li key={social.url}>
                <a
                  href={social.url}
                  target={social.kind === 'email' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className="flex items-baseline justify-between gap-4 border-b border-white/10 py-3.5 transition-colors hover:border-amber"
                >
                  <span className="label text-[0.625rem]">{social.label}</span>
                  <span className="truncate text-sm text-bone-dim">{social.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <footer className="mt-20 border-t border-white/10 pt-6 text-xs text-bone-faint">
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </footer>
      </div>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-20 md:mt-28">
      <h2 className="label mb-7 flex items-center gap-3">
        <span className="inline-block h-px w-8 bg-amber" />
        {title}
      </h2>
      {children}
    </section>
  );
}

/** A project as a details/summary card — expandable without any motion. */
function StaticProject({ slug }: { slug: string }) {
  const project = projects.find((p) => p.slug === slug)!;
  const [open, setOpen] = useState(false);

  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-xl font-semibold" style={{ color: project.accent }}>
            {project.title}
          </h3>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-bone-dim">{project.tagline}</p>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="shrink-0 rounded-full border border-white/15 px-4 py-1.5 font-display text-[0.5625rem] tracking-[0.18em] uppercase text-bone-dim transition-colors hover:border-white/40 hover:text-bone"
        >
          {open ? 'Less' : 'Details'}
        </button>
      </div>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {project.stack.map((item) => (
          <li
            key={item}
            className="rounded-full border border-white/10 px-2.5 py-0.5 text-[0.6875rem] text-bone-faint"
          >
            {item}
          </li>
        ))}
      </ul>

      {open ? (
        <div className="mt-5 border-t border-white/10 pt-5">
          <p className="text-sm leading-relaxed text-bone-dim">{project.description}</p>
          <ul className="mt-4 space-y-1.5">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="text-sm leading-relaxed text-bone-dim">
                — {highlight}
              </li>
            ))}
          </ul>
          {project.demo ? (
            <div className="mt-5">
              <p className="mb-2 text-xs text-bone-faint">{project.demo.note}</p>
              {project.demo.fields ? (
                <div className="max-w-sm space-y-2">
                  {project.demo.fields.map((field) => (
                    <CopyField key={field.label} label={field.label} value={field.value} />
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        {project.links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.75rem] font-medium underline-offset-4 transition-colors hover:underline"
            style={{ color: project.accent }}
          >
            {link.label} ↗
          </a>
        ))}
      </div>
    </article>
  );
}

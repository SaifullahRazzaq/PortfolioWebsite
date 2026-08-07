'use client';

import { useState } from 'react';
import { Kicker, OverlayPanel } from './OverlayPanel';
import { MagneticButton } from '../ui/MagneticButton';
import { contact, socials } from '@/data/contact';
import { profile } from '@/data/profile';
import { useLenis } from '@/components/providers/LenisProvider';

/**
 * 8. THE ROOFTOP — Contact. The end of the journey.
 *
 * The only overlay that takes pointer events across its whole surface, and the
 * only one that does not fade out at the end of its section — this is where the
 * visitor stops, so the content stays put.
 */
export function ContactOverlay() {
  const lenis = useLenis();
  const [sending, setSending] = useState(false);

  const backToRoad = () => {
    // Walks the camera all the way home rather than jumping. Long duration on
    // purpose: it re-plays the whole journey in reverse.
    lenis?.current?.scrollTo(0, { duration: 3.4 });
  };

  return (
    <OverlayPanel section="rooftop" place="full" edge={0.16} fadeOut={false} interactive>
      <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* ── Left: the pitch and the links ──────────────────────────────── */}
        <div>
          <Kicker>Contact</Kicker>

          <h2
            data-reveal
            className="font-display text-[clamp(2rem,5.5vw,4.25rem)] leading-[1] font-bold tracking-[-0.02em] text-balance text-bone"
          >
            {contact.headline}
          </h2>

          <p data-reveal className="mt-5 max-w-md text-sm leading-relaxed text-bone-dim sm:text-base">
            {contact.subhead}
          </p>

          <ul data-reveal className="mt-9 space-y-px">
            {socials.map((social) => (
              <li key={social.url}>
                <a
                  href={social.url}
                  target={social.kind === 'email' ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="group flex items-baseline justify-between gap-4 border-b border-white/10 py-3.5 transition-colors hover:border-[var(--journey-accent)]"
                >
                  <span className="label text-[0.625rem] transition-colors group-hover:text-[var(--journey-accent)]">
                    {social.label}
                  </span>
                  <span className="truncate text-sm text-bone-dim transition-colors group-hover:text-bone">
                    {social.handle}
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div data-reveal className="mt-8 flex flex-wrap items-center gap-3">
            <MagneticButton
              as="a"
              href={profile.resumeUrl}
              download
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 font-display text-[0.6875rem] tracking-[0.18em] uppercase text-bone transition-colors hover:border-[var(--journey-cool)] hover:text-[var(--journey-cool)]"
            >
              Download CV
            </MagneticButton>

            <MagneticButton
              onClick={backToRoad}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-display text-[0.6875rem] tracking-[0.18em] uppercase text-bone-faint transition-colors hover:text-bone"
            >
              ← Back to the road
            </MagneticButton>
          </div>
        </div>

        {/* ── Right: the form ────────────────────────────────────────────── */}
        <form
          data-reveal
          action={contact.formEndpoint}
          method="POST"
          onSubmit={() => setSending(true)}
          className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl sm:p-8"
        >
          {/* formsubmit.co config: no captcha page, and a readable subject. */}
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_subject" value="New enquiry from saifullahrazzaq.dev" />
          <input type="hidden" name="_template" value="table" />

          <p className="label mb-6 text-[0.5625rem]">Send a message</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" name="name" autoComplete="name" />
            <Field label="Email" name="email" type="email" autoComplete="email" />
          </div>

          <label className="mt-4 block">
            <span className="label mb-2 block text-[0.5625rem]">Project details</span>
            <textarea
              name="message"
              rows={4}
              required
              className="w-full resize-none rounded-lg border border-white/12 bg-white/[0.04] px-3.5 py-3 text-sm text-bone outline-none transition-colors placeholder:text-bone-faint focus:border-[var(--journey-cool)]"
              placeholder="What are you building?"
            />
          </label>

          <button
            type="submit"
            disabled={sending}
            data-cursor="hover"
            className="mt-6 w-full rounded-full bg-[var(--journey-accent)] py-3.5 font-display text-[0.75rem] tracking-[0.18em] uppercase text-[#08090C] transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {sending ? 'Sending…' : 'Send message'}
          </button>

          <p className="mt-4 text-center text-[0.6875rem] text-bone-faint">
            {contact.responseNote}
          </p>
        </form>
      </div>

      <footer data-reveal className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
        <p className="text-[0.6875rem] text-bone-faint">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="label text-[0.5625rem]">Built with three.js, GSAP &amp; Next.js</p>
      </footer>
    </OverlayPanel>
  );
}

function Field({
  label,
  name,
  type = 'text',
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="label mb-2 block text-[0.5625rem]">{label}</span>
      <input
        type={type}
        name={name}
        required
        autoComplete={autoComplete}
        className="w-full rounded-lg border border-white/12 bg-white/[0.04] px-3.5 py-3 text-sm text-bone outline-none transition-colors focus:border-[var(--journey-cool)]"
      />
    </label>
  );
}

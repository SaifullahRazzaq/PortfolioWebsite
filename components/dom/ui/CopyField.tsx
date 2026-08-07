'use client';

import { useState } from 'react';

/**
 * A labelled value with copy-to-clipboard. Used for the Real Estate CRM demo
 * credentials, where the whole point is that a visitor can paste them straight
 * into the login form.
 */
export function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard is permission-gated and can simply refuse; the value is
      // visible on screen either way, so failing quietly is correct here.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      data-cursor="hover"
      className="group flex w-full items-center justify-between gap-4 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition-colors hover:border-mint/40 hover:bg-white/[0.06]"
      aria-label={`Copy ${label}: ${value}`}
    >
      <span className="min-w-0">
        <span className="label block text-[0.625rem]">{label}</span>
        <span className="block truncate font-mono text-sm text-bone">{value}</span>
      </span>
      <span
        aria-hidden="true"
        className={`shrink-0 font-display text-[0.625rem] tracking-[0.2em] uppercase transition-colors ${
          copied ? 'text-mint' : 'text-bone-faint group-hover:text-mint'
        }`}
      >
        {copied ? 'Copied' : 'Copy'}
      </span>
    </button>
  );
}

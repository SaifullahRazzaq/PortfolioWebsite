'use client';

import { useEffect } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { GA_ID, track } from '@/lib/analytics';

/**
 * Loads GA4 and reports contact clicks.
 *
 * Email and WhatsApp links are rendered in several places (contact overlay,
 * static fallback, semantic content), so one delegated listener covers all of
 * them instead of an onClick on each. GA4 does not count `mailto:` as an
 * outbound click, and reporting WhatsApp under its own name keeps the two
 * contact channels comparable in reports.
 */
export function Analytics() {
  useEffect(() => {
    if (!GA_ID) return;

    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href]');
      if (!link) return;
      const href = link.getAttribute('href') ?? '';

      if (href.startsWith('mailto:')) track('contact_click', { method: 'email' });
      else if (href.includes('wa.me/')) track('contact_click', { method: 'whatsapp' });
    };

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null;
}

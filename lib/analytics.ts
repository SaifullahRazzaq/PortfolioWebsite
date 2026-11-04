import { sendGAEvent } from '@next/third-parties/google';

/**
 * GA4 Measurement ID (G-XXXXXXXXXX), set as an environment variable on Netlify.
 * When it is missing (local dev, preview builds without it) analytics is off
 * entirely: the gtag script is not loaded and `track` does nothing.
 */
export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Send a GA4 event. Page views, scroll depth, outbound links (GitHub, LinkedIn,
 * project links) and the CV PDF download are already collected by GA4's
 * Enhanced Measurement, so only interactions it cannot see are sent from here.
 */
export function track(event: string, params: Record<string, string | number> = {}) {
  if (!GA_ID || typeof window === 'undefined') return;
  sendGAEvent('event', event, params);
}

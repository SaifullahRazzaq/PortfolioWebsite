import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { profile } from '@/data/profile';
import { SCROLL_HEIGHT_VH } from '@/data/journey';
import { Analytics } from '@/components/Analytics';
import './globals.css';

/**
 * Length of the scroll timeline, emitted as CSS so the server and client always
 * agree on it. `svh` rather than `vh` so a mobile URL bar showing/hiding does
 * not resize the timeline mid-journey.
 */
const journeyScrollCss = `
:root { --journey-scroll: ${SCROLL_HEIGHT_VH.desktop}svh; }
@media (max-width: 899px) and (pointer: coarse) {
  :root { --journey-scroll: ${SCROLL_HEIGHT_VH.mobile}svh; }
}`;

/*
 * Self-hosted variable fonts (latin subset, from Fontsource, SIL OFL), not
 * next/font/google: fetching from Google at build time failed under Turbopack
 * on Netlify ("next/font/google queries have exactly one entry"), and local
 * files keep the build free of network calls. One variable file per family
 * covers every weight the site uses.
 */
const spaceGrotesk = localFont({
  src: './fonts/space-grotesk-latin-variable.woff2',
  weight: '300 700',
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = localFont({
  src: './fonts/inter-latin-variable.woff2',
  weight: '100 900',
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.tagline,
  keywords: [
    'Saifullah Razzaq',
    'React Native developer',
    'Agentic AI',
    'AI CRM',
    'Next.js',
    'TypeScript',
    'mobile app developer',
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    type: 'website',
    siteName: profile.name,
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    url: profile.siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#08090C',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  // The journey is scroll-driven; pinch-zoom is still allowed for accessibility.
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <head>
        <style>{journeyScrollCss}</style>
      </head>
      <body>{children}</body>
      <Analytics />
    </html>
  );
}

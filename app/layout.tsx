import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { profile } from '@/data/profile';
import { SCROLL_HEIGHT_VH } from '@/data/journey';
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

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
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
    </html>
  );
}

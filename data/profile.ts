export const profile = {
  name: 'Saifullah Razzaq',
  firstName: 'Saifullah',
  lastName: 'Razzaq',
  role: 'Senior Software Engineer & AI Architect',
  /** Hero line floating in 3D above the road. Kept short — it is set very large. */
  tagline: 'I build agentic AI systems and mobile products that ship.',
  bio: [
    'I am a senior software engineer focused on building and optimizing high-performance mobile applications for iOS and Android, and on the agentic AI systems that now sit behind them.',
    'I specialise in React Native, TypeScript and Node — leading development teams, integrating modern APIs, and shipping 30+ apps with measurable performance and engagement gains.',
  ],
  stats: [
    { label: 'Years experience', value: '6+' },
    { label: 'Mobile apps shipped', value: '30+' },
    { label: 'Avg. performance gain', value: '25%' },
  ],
  location: 'Karachi, Pakistan — working remotely',
  resumeUrl: '/Saifullah-Razzaq-CV.pdf',
  portraitUrl: '/assets/saifullah-razzaq.png',
  // The live deployment. Link previews (OG image, canonical, sitemap) are built
  // from this, so it must be reachable. Netlify sets `URL` to the site's primary
  // address during every build; `NEXT_PUBLIC_SITE_URL` overrides it (e.g. once a
  // custom domain resolves). Only read on the server (layout, sitemap, robots).
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || 'http://localhost:3000',
} as const;

export type Profile = typeof profile;

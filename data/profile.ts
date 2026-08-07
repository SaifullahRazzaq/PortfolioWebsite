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
  siteUrl: 'https://saifullahrazzaq.dev',
} as const;

export type Profile = typeof profile;

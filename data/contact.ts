import type { SocialLink } from './types';

export const contact = {
  email: 'saifullah.razzaq1995@gmail.com',
  whatsapp: 'https://wa.me/923422359217',
  whatsappDisplay: '+92 342 235 9217',
  /** formsubmit.co posts straight to the inbox above — no backend needed. */
  formEndpoint: 'https://formsubmit.co/saifullah.razzaq1995@gmail.com',
  responseNote: 'You will get a response within 24 hours.',
  headline: 'Let’s build something great together.',
  subhead:
    'Agentic AI, React Native, or a product that needs both. Tell me what you are building.',
} as const;

export const socials: SocialLink[] = [
  {
    label: 'WhatsApp',
    url: 'https://wa.me/923422359217',
    handle: '+92 342 235 9217',
    kind: 'whatsapp',
  },
  {
    label: 'Email',
    url: 'mailto:saifullah.razzaq1995@gmail.com',
    handle: 'saifullah.razzaq1995@gmail.com',
    kind: 'email',
  },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/saifullah-razzaq-7ab027139/',
    handle: 'saifullah-razzaq',
    kind: 'linkedin',
  },
  {
    label: 'GitHub',
    url: 'https://github.com/SaifullahRazzaq',
    handle: 'SaifullahRazzaq',
    kind: 'github',
  },
];

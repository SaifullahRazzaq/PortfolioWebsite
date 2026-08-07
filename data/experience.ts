import type { TimelineEntry } from './types';

/** Newest first — The Study stacks these as the camera passes the desk. */
export const timeline: TimelineEntry[] = [
  {
    kind: 'work',
    role: 'MEAN Developer',
    org: 'JS Bank',
    period: 'Mar 2025 — Jul 2025',
    startYear: 2025,
    description:
      'Built a responsive banking web app on Angular, Node.js, Express and MongoDB.',
  },
  {
    kind: 'work',
    role: 'Senior React Native Developer',
    org: 'Jon East Digital Media',
    period: 'Mar 2024 — Feb 2025',
    startYear: 2024,
    description:
      'Led mobile development, improved app performance by 25%, and mentored junior engineers.',
  },
  {
    kind: 'work',
    role: 'Senior React Native Developer',
    org: 'Logicose',
    period: 'Jul 2022 — Jan 2024',
    startYear: 2022,
    description: 'Delivered 15+ apps, optimised API layers, and cut crash rates by 30%.',
  },
  {
    kind: 'work',
    role: 'React Native Developer',
    org: 'LN Technologies',
    period: 'Apr 2020 — Jul 2022',
    startYear: 2020,
    description: 'Shipped features across 10+ apps and migrated web apps to mobile platforms.',
  },
  {
    kind: 'work',
    role: 'Junior React Native Developer',
    org: 'Tamkeen International',
    period: 'Dec 2018 — Mar 2020',
    startYear: 2018,
    description:
      'Built Android and iOS apps, and supported adoption of automated testing and CI/CD.',
  },
  {
    kind: 'education',
    role: 'BSc Computer Science',
    org: 'Bahria University',
    period: '2016 — 2020',
    startYear: 2016,
    description: 'Foundations in software engineering and system architecture.',
  },
];

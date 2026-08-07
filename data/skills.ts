import type { Skill } from './types';

/**
 * The Workshop orbits these as 3D nodes. `group` picks the orbit ring,
 * `weight` drives node scale and how far out it sits.
 */
export const skills: Skill[] = [
  { name: 'React Native', group: 'core', weight: 1.0 },
  { name: 'TypeScript', group: 'core', weight: 0.96 },
  { name: 'React', group: 'core', weight: 0.92 },
  { name: 'Next.js', group: 'core', weight: 0.86 },

  { name: 'Agentic AI', group: 'ai', weight: 0.94 },
  { name: 'LLM Orchestration', group: 'ai', weight: 0.9 },
  { name: 'Multi-Agent Systems', group: 'ai', weight: 0.88 },
  { name: 'Realtime Voice', group: 'ai', weight: 0.78 },
  { name: 'Vector Search', group: 'ai', weight: 0.74 },

  { name: 'Node.js', group: 'backend', weight: 0.9 },
  { name: 'Express', group: 'backend', weight: 0.84 },
  { name: 'MongoDB', group: 'backend', weight: 0.82 },
  { name: 'PostgreSQL', group: 'backend', weight: 0.78 },
  { name: 'GraphQL', group: 'backend', weight: 0.74 },

  { name: 'Firebase', group: 'platform', weight: 0.86 },
  { name: 'REST APIs', group: 'platform', weight: 0.84 },
  { name: 'CI/CD', group: 'platform', weight: 0.76 },
  { name: 'Performance Profiling', group: 'platform', weight: 0.8 },
];

/** Rendered as prose in the accessible/static layer. */
export const specialisations = [
  'Multi-agent systems',
  'MERN stack',
  'React Native & TypeScript',
  'API integrations',
  'Performance optimisation',
  'Web-to-mobile migrations',
];

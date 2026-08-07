/**
 * Content types. Everything the site says about Saifullah lives in /data as
 * typed objects — no copy is hard-coded inside components.
 */

export type LinkKind =
  | 'live'
  | 'appstore'
  | 'playstore'
  | 'github'
  | 'whatsapp'
  | 'case-study'
  | 'resume';

export interface ProjectLink {
  label: string;
  url: string;
  kind: LinkKind;
}

/** Shown as copyable chips inside the project detail overlay. */
export interface DemoAccess {
  /** Plain-language note about what the demo is (and that data is mock). */
  note: string;
  fields?: { label: string; value: string }[];
}

export type ProjectCategory =
  | 'ai'
  | 'marketplace'
  | 'services'
  | 'healthcare'
  | 'commerce';

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  /** One line. Used on the gallery screen itself. */
  tagline: string;
  /** Full paragraph. Used in the detail overlay. */
  description: string;
  /** Bullets in the overlay. */
  highlights: string[];
  stack: string[];
  metrics: string[];
  links: ProjectLink[];
  demo?: DemoAccess;
  /** Path under /public. */
  thumbnail: string;
  alt: string;
  /** Emissive tint of the screen in The Gallery. */
  accent: string;
  featured: boolean;
}

export interface Skill {
  name: string;
  /** Groups drive the orbit rings in The Workshop. */
  group: 'core' | 'ai' | 'backend' | 'platform';
  /** 0–1. Drives node scale and orbit radius. */
  weight: number;
}

export interface TimelineEntry {
  kind: 'work' | 'education';
  role: string;
  org: string;
  period: string;
  /** Absolute year the entry started — used to order the stack in The Study. */
  startYear: number;
  description: string;
}

export interface SocialLink {
  label: string;
  url: string;
  handle: string;
  kind: LinkKind | 'linkedin' | 'email';
}

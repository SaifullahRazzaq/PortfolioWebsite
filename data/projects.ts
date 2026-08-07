import type { Project } from './types';

/**
 * Order matters: this is the order the camera passes the screens in The Gallery.
 * Screens alternate right / left wall by index.
 */
export const projects: Project[] = [
  {
    slug: 'projectlink',
    title: 'ProjectLink',
    category: 'ai',
    tagline: 'An AI sales CRM where one agent makes the calls and a second one closes the deal.',
    description:
      'ProjectLink runs two independent AI agents over a single pipeline. The voice agent handles outbound — it dials the lead, qualifies them in natural conversation, and books the callback. The closing agent is a separate system that takes the qualified lead from there: it works objections, negotiates, and drives the conversation through to a closed sale. Both agents write into the same CRM timeline, so every transcript, intent signal and next action lands on the contact record instead of in someone’s notebook. Lead capture and follow-up run over WhatsApp.',
    highlights: [
      'Voice agent: outbound dialling, live qualification and callback booking',
      'Closing agent: a separate model that handles objections and closes the sale',
      'Shared CRM timeline — transcripts, intent signals and next actions on every contact',
      'WhatsApp as the capture and follow-up channel',
      'Pipeline, call outcomes and agent hand-offs visible in one dashboard',
    ],
    stack: ['Next.js', 'Node.js', 'LLM Agents', 'Realtime Voice', 'WhatsApp API', 'PostgreSQL'],
    metrics: ['Two independent agents', 'Outbound 24/7'],
    links: [
      { label: 'Visit ProjectLink', url: 'https://www.theprojectlink.com/', kind: 'live' },
      { label: 'Request a demo on WhatsApp', url: 'https://wa.me/923422359217', kind: 'whatsapp' },
    ],
    demo: {
      note: 'Walkthroughs are given live rather than as a shared login — message me on WhatsApp and I will run you through both agents.',
    },
    thumbnail: '/projects/projectlink.webp',
    alt: 'ProjectLink AI sales CRM dashboard',
    accent: '#FF8A3D',
    featured: true,
  },
  {
    slug: 'real-estate-ai-crm',
    title: 'Real Estate AI CRM',
    category: 'ai',
    tagline: 'Agentic CRM for property teams — scores leads, matches listings, runs the follow-up.',
    description:
      'A CRM built for real-estate teams who lose deals to slow follow-up. Incoming enquiries are scored and routed automatically, matched against live inventory, and pushed into a follow-up sequence the agent drafts and the human approves. Agents get a single queue instead of a shared inbox, and every listing view, reply and site-visit booking is stitched onto the contact’s timeline. The live build below is a shared demo instance running entirely on mock data.',
    highlights: [
      'Automatic lead scoring and routing on enquiry',
      'Listing matching against live inventory',
      'AI-drafted follow-up sequences with human approval',
      'One prioritised queue per agent instead of a shared inbox',
      'Full contact timeline: views, replies and site-visit bookings',
    ],
    stack: ['Next.js', 'TypeScript', 'LLM Agents', 'Node.js', 'PostgreSQL', 'Vercel'],
    metrics: ['Live demo', 'Mock dataset'],
    links: [
      {
        label: 'Open live demo',
        url: 'https://real-estate-ai-1pikj1ror-saifullahrazzaq1995-2693s-projects.vercel.app/auth/login',
        kind: 'live',
      },
    ],
    demo: {
      note: 'Shared demo instance. Every record in it is generated mock data — no real client or property information.',
      fields: [
        { label: 'Email', value: 'admin@skyline.demo' },
        { label: 'Password', value: 'Demo@1234' },
      ],
    },
    thumbnail: '/projects/real-estate-ai-crm.webp',
    alt: 'Real Estate AI CRM dashboard showing scored leads and matched listings',
    accent: '#5EE7D0',
    featured: true,
  },
  {
    slug: 'ai-crm-hub',
    title: 'AI-Powered CRM Hub',
    category: 'ai',
    tagline: 'Multi-agent orchestration for lead classification, sentiment and outreach.',
    description:
      'A CRM layer built around orchestrated agents rather than rules. Inbound leads are classified, scored for sentiment, and handed to an outreach agent that writes the first-touch message in the account’s own voice. The orchestration layer decides which agent runs when, so the pipeline adapts to the lead instead of forcing every lead down the same funnel.',
    highlights: [
      'Multi-agent orchestration over the lead lifecycle',
      'Automated classification and sentiment scoring',
      'Personalised first-touch outreach generation',
      '60% faster lead processing against the previous manual flow',
    ],
    stack: ['LangChain', 'OpenAI', 'React', 'Node.js'],
    metrics: ['60% faster lead processing', '95% classification accuracy'],
    links: [{ label: 'Ask about this project', url: 'https://wa.me/923422359217', kind: 'whatsapp' }],
    thumbnail: '/projects/ai-crm-hub.webp',
    alt: 'AI-powered CRM hub interface',
    accent: '#6C8CFF',
    featured: false,
  },
  {
    slug: 'autonomous-sales-agent',
    title: 'Autonomous Sales Agent',
    category: 'ai',
    tagline: 'Runs a full sales cycle end to end, from prospecting through to close.',
    description:
      'An autonomous agent that owns the whole cycle: it prospects, enriches records from live sources, opens the conversation, and works the deal to close. Adaptive learning tunes messaging per segment from what actually converted, and a vector store keeps prior conversations retrievable so the agent stays consistent across a long deal.',
    highlights: [
      'End-to-end cycle: prospecting, enrichment, outreach, close',
      'Adaptive messaging tuned on converted outcomes',
      'Vector-backed memory across long-running deals',
      'Runs continuously without an operator in the loop',
    ],
    stack: ['Python', 'AutoGPT', 'Vector DB', 'PostgreSQL'],
    metrics: ['3× ROI improvement', 'Active 24/7'],
    links: [{ label: 'Ask about this project', url: 'https://wa.me/923422359217', kind: 'whatsapp' }],
    thumbnail: '/projects/autonomous-sales-agent.webp',
    alt: 'Autonomous sales agent pipeline visualisation',
    accent: '#FF8A3D',
    featured: false,
  },
  {
    slug: 'voice-intelligence-suite',
    title: 'Voice Intelligence Suite',
    category: 'ai',
    tagline: 'Real-time voice for customer support — speech to text to action.',
    description:
      'A real-time voice layer for support teams. Audio streams into high-fidelity transcription, intent is resolved live, and the resolved intent triggers the actual system action rather than just logging a summary. Latency was the whole design constraint — the pipeline is tuned so the conversation never waits on the model.',
    highlights: [
      'High-fidelity streaming speech-to-text',
      'Live intent resolution driving real system actions',
      'Latency-tuned pipeline that holds natural conversational flow',
      '40% reduction in time-to-resolution',
    ],
    stack: ['Whisper', 'TTS', 'HuggingFace', 'Redis'],
    metrics: ['40% lower time-to-resolution', 'Natural conversational flow'],
    links: [{ label: 'Ask about this project', url: 'https://wa.me/923422359217', kind: 'whatsapp' }],
    thumbnail: '/projects/voice-intelligence-suite.webp',
    alt: 'Voice intelligence suite transcription and intent view',
    accent: '#5EE7D0',
    featured: false,
  },
  {
    slug: 'dvago',
    title: 'DVAGO',
    category: 'healthcare',
    tagline: 'Pharmacy and healthcare delivery, shipped to half a million users.',
    description:
      'A pharmacy and healthcare delivery platform covering fast ordering, prescription upload and support, and secure checkout. The build focused on making a medically sensitive flow feel quick and trustworthy on low-end Android hardware, which is where most of the user base actually is.',
    highlights: [
      'Prescription upload and pharmacist review flow',
      'Secure checkout with multiple payment paths',
      'Tuned for low-end Android devices',
      '500K+ users at 4.6★',
    ],
    stack: ['React Native', 'Node.js', 'Payments'],
    metrics: ['500K+ users', '4.6★ rating'],
    links: [
      {
        label: 'App Store',
        url: 'https://apps.apple.com/pk/app/dvago-pharmacy-healthcare/id1603962269',
        kind: 'appstore',
      },
      {
        label: 'Google Play',
        url: 'https://play.google.com/store/apps/details?id=com.dvago&hl=en',
        kind: 'playstore',
      },
    ],
    thumbnail: '/projects/dvago.webp',
    alt: 'DVAGO pharmacy and healthcare delivery app',
    accent: '#5EE7D0',
    featured: false,
  },
  {
    slug: 'neighbors-trailer',
    title: 'Neighbors Trailer',
    category: 'marketplace',
    tagline: 'Peer-to-peer trailer rental marketplace for owners.',
    description:
      'A two-sided rental marketplace for trailer owners: listing management, booking calendar, secure payments and real-time availability. The owner app had to make a rental business manageable from a phone, so the whole flow is built around fast confirm/decline and never double-booking a unit.',
    highlights: [
      'Real-time availability and booking calendar',
      'Secure payments and payout handling',
      'Owner-side listing and fleet management',
      '1K+ downloads at 4.8★',
    ],
    stack: ['React Native', 'Node.js', 'MongoDB'],
    metrics: ['4.8★ rating', '1K+ downloads'],
    links: [
      {
        label: 'App Store',
        url: 'https://apps.apple.com/us/app/neighbors-trailer-owner/id1667847016',
        kind: 'appstore',
      },
      {
        label: 'Google Play',
        url: 'https://play.google.com/store/apps/details?id=com.neighbourstrailerowner&hl=en',
        kind: 'playstore',
      },
    ],
    thumbnail: '/projects/neighbors-trailer.webp',
    alt: 'Neighbors Trailer owner app booking screen',
    accent: '#6C8CFF',
    featured: false,
  },
  {
    slug: 'tamkeen-stores',
    title: 'Tamkeen Stores',
    category: 'commerce',
    tagline: 'Home-appliance commerce with discovery, checkout and delivery tracking.',
    description:
      'An ecommerce app for home appliances — product discovery across a deep catalogue, secure checkout, and order tracking through to delivery. Catalogue size was the interesting problem: browsing had to stay fluid on mid-range devices with thousands of SKUs and heavy imagery.',
    highlights: [
      'Deep-catalogue product discovery and filtering',
      'Secure checkout with reliable payment handling',
      'Order and delivery tracking',
      '50K+ downloads',
    ],
    stack: ['React Native', 'Commerce', 'Payments'],
    metrics: ['50K+ downloads', 'Reliable checkout'],
    links: [
      { label: 'App Store', url: 'https://apps.apple.com/us/app/tamkeen-stores', kind: 'appstore' },
      {
        label: 'Google Play',
        url: 'https://play.google.com/store/apps/details?id=com.tamkeen.tamkeenstores&hl=en',
        kind: 'playstore',
      },
    ],
    thumbnail: '/projects/tamkeen-stores.webp',
    alt: 'Tamkeen Stores home appliance shopping app',
    accent: '#FF8A3D',
    featured: false,
  },
  {
    slug: 'tamkeen-care',
    title: 'Tamkeen Care',
    category: 'services',
    tagline: 'Home services booking — repairs, maintenance and scheduling.',
    description:
      'A home-services platform for repairs and maintenance. Users find the right service, see real availability, and book a slot; providers get a schedule they can actually work from. Streamlining discovery and scheduling took 35% off the time it took a user to complete a booking.',
    highlights: [
      'Service discovery with real provider availability',
      'Slot-based scheduling for both sides',
      'Booking lifecycle from request to completion',
      '35% faster bookings',
    ],
    stack: ['React Native', 'REST APIs', 'Firebase'],
    metrics: ['35% faster bookings', 'High retention'],
    links: [
      {
        label: 'App Store',
        url: 'https://apps.apple.com/kw/app/tamkeencare/id1546481161',
        kind: 'appstore',
      },
    ],
    thumbnail: '/projects/tamkeen-care.webp',
    alt: 'Tamkeen Care home services booking app',
    accent: '#6C8CFF',
    featured: false,
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

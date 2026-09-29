/**
 * ============================================================
 *  SITE SETTINGS — the one file to edit for global information
 *  (voir README.md, section « Modifier les infos générales »)
 * ============================================================
 * Any value set to `null` is displayed on the site as a visible [TODO].
 */

export const site = {
  name: 'The Knowledge Revolution',
  byline: "by FBAI's (Future Builders of AI)",
  fullName: "The Knowledge Revolution — by FBAI's (Future Builders of AI)",
  team: "FBAI's",
  teamLong: 'Future Builders of AI',
  tagline: 'Changing the way we learn.',
  slogan: 'Learn anywhere. Anytime. From the greatest minds.',
  description:
    'A deep learning, multimodal, generative AI project that brings 3D avatars of professors, thinkers and great minds — with their voice — to every learner, wherever and whenever they want.',
  course: 'Deep Learning Project — Challenge Based Learning (CBL)',
  university: 'ESPRIT — Honoris United Universities',
  partner: 'Indiana University (potential partner)',
  supervisors: ['Mr. Safouane Jebali', 'Mrs. Wided Askri'],

  instagram: { handle: '@fbais.esprit', url: 'https://www.instagram.com/fbais.esprit/' },

  /** [TODO] Team contact email, e.g. 'fbais.team@esprit.tn' */
  email: null as string | null,

  /** [TODO] Link of the Engage call-to-action video (YouTube or Google Drive). */
  ctaVideoUrl: null as string | null,

  /** [TODO] Link of the avatar demo video when it exists (phase Act). */
  demoVideoUrl: null as string | null,

  /**
   * [TODO] Audio excerpts of the avatar. Put the .mp3 files in public/audio/
   * then add: { title: 'Socrates — on questions', src: '/audio/socrates.mp3' }
   */
  audioClips: [] as { title: string; src: string }[],

  /** Current CBL phase — change to 'Act' when you get there. */
  currentPhase: 'Investigate' as 'Engage' | 'Investigate' | 'Act',
};

export const footerNote = `© 2026 ${site.fullName} – An academic CBL initiative on The Knowledge Revolution.`;

export type NavLink = { label: string; href: string; description?: string };
export type NavItem = NavLink | { label: string; children: NavLink[] };

export const nav: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'About',
    children: [
      { label: 'The Project', href: '/about', description: 'Vision, problem & approach' },
      { label: 'Theme & Motivation', href: '/theme', description: 'Why education must change' },
      { label: 'Team', href: '/team', description: 'Six minds. One revolution.' },
    ],
  },
  {
    label: 'Project',
    children: [
      { label: 'AI & Methodology', href: '/methodology', description: 'How the avatars work' },
      { label: 'CBL Journey', href: '/cbl', description: 'Engage · Investigate · Act' },
      { label: 'Results & Demo', href: '/results', description: 'Videos, avatar & outcomes' },
    ],
  },
  {
    label: 'Journal',
    children: [
      { label: 'Progress Blog', href: '/blog', description: 'Our story, post by post' },
      { label: 'Meetings & Minutes', href: '/meetings', description: 'Every decision we made' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

/** Flat list of every page, used by the footer and the mobile menu. */
export const allLinks: NavLink[] = nav.flatMap((i) => ('children' in i ? i.children : [i]));

/* ---------------- Content shared by several pages ---------------- */

/** "Conclusion & Perspectives" — slide 26 */
export const promises = [
  { icon: 'clock', lead: "Real teachers' knowledge,", strong: 'available anytime.' },
  { icon: 'target', lead: 'Every student gets an explanation that', strong: 'fits them.' },
  { icon: 'chat', lead: 'Students', strong: 'ask freely,', tail: 'without judgment.' },
];

export const bigIdea = 'The Knowledge Revolution';
export const essentialQuestion =
  'How can we make the best knowledge available to every learner, wherever and whenever they are?';
export const challenge =
  'Allow every student, wherever they are, to ask questions and learn face to face from the best teachers and minds, in their own language.';
export const closingLine = 'The challenge is set. Now we investigate.';

export type Stat = {
  value: number;
  prefix?: string;
  suffix: string;
  decimals?: number;
  label: string;
  source: string;
  accent?: 'gold' | 'cyan' | 'coral' | 'ink';
};

/** Theme & Motivation — slides 8, 9, 10 */
export const needStats: Stat[] = [
  { value: 44, suffix: 'M', label: 'teachers missing worldwide by 2030', source: 'UNESCO 2024–2025', accent: 'ink' },
  { value: 272, suffix: 'M', label: 'children still out of school', source: 'UNESCO 2024–2025', accent: 'ink' },
  { value: 3, suffix: '%', label: 'of learners finish an online course', source: 'MIT/Harvard, Science 2019', accent: 'coral' },
];

export const opportunityStats: Stat[] = [
  { value: 95, suffix: '%', label: 'of students already use AI (vs 66% in 2024)', source: 'HEPI 2026', accent: 'cyan' },
  { value: 57.2, prefix: '$', suffix: 'B', decimals: 1, label: 'AI in education market by 2033 (from $8.3B in 2025)', source: 'Grand View Research', accent: 'gold' },
  { value: 35, suffix: '%', label: 'virtual facilitators: the #1 market segment', source: 'Mordor Intelligence', accent: 'cyan' },
];

export const marketChart = [
  { year: '2025', value: 8.3 },
  { year: '2026', value: 11.4 },
  { year: '2033', value: 57.2 },
];

export const riskStats: Stat[] = [
  { value: 3, suffix: ' sec', label: 'of audio is all it takes to clone a voice', source: 'McAfee', accent: 'coral' },
  { value: 46, suffix: '%', label: 'of people say they trust AI (while 66% use it)', source: 'KPMG / University of Melbourne 2025', accent: 'gold' },
  { value: 2026, suffix: '', label: 'EU AI Act: AI-generated content must be disclosed (since August)', source: 'EU Regulation 2024/1689', accent: 'cyan' },
];

export const homeStats: Stat[] = [
  needStats[0],
  needStats[2],
  { ...opportunityStats[0], label: 'of students already use AI' },
];

const phaseOrder = ['Engage', 'Investigate', 'Act'] as const;
/** Derived from site.currentPhase — nothing to edit here. */
export const cblPhases = phaseOrder.map((key, i) => {
  const current = phaseOrder.indexOf(site.currentPhase);
  const status = i < current ? 'done' : i === current ? 'current' : 'upcoming';
  return { key, label: key, status } as { key: string; label: string; status: 'done' | 'current' | 'upcoming' };
});

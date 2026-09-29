export type JournalImage = { src: string; srcSet?: string; width: number; height: number };

/** One entry of the journal: a blog post or the minutes of a meeting. */
export type JournalItem = {
  kind: 'post' | 'meeting';
  id: string;
  href: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  day: string; // "16"
  month: string; // "Sept"
  dateLabel: string; // "16 September 2026"
  category: string; // post category, or "Meeting"
  tags: string[];
  readingTime: number;
  /** Plain text of the body, used by the search. */
  text: string;
  cover: JournalImage | null;
  coverAlt: string;
};

export type JournalView = 'timeline' | 'index' | 'map';

/** Category colours (on the dark navy background). */
export const CATEGORY_COLORS: Record<string, string> = {
  Project: '#E8A93A',
  Educate: '#5CE1E6',
  Engage: '#FF9A5C',
  'Behind the Scenes': '#A8B0F0',
  CBL: '#7FD8A6',
  AI: '#F28FC5',
  Meeting: '#F1F1F1',
};

export const colorOf = (category: string) => CATEGORY_COLORS[category] ?? '#5CE1E6';

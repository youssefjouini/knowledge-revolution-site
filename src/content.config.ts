import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Files whose name starts with "_" (like _template.md) are ignored. */
const pattern = '**/[^_]*.md';

export const blogCategories = ['Project', 'Educate', 'Engage', 'Behind the Scenes', 'CBL', 'AI'] as const;

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      category: z.enum(blogCategories),
      tags: z.array(z.string()).default([]),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      excerpt: z.string(),
      draft: z.boolean().default(false),
    }),
});

const meetings = defineCollection({
  loader: glob({ base: './src/content/meetings', pattern }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    type: z.enum(['team', 'supervisors', 'partner']).default('team'),
    attendees: z.array(z.string()).default([]),
    cbl_phase: z.enum(['Engage', 'Investigate', 'Act']),
    location: z.string().optional(),
    summary: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const team = defineCollection({
  loader: glob({ base: './src/content/team', pattern }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      order: z.number().default(99),
      photo: image(),
      role: z.string().optional(),
      linkedin: z.url().optional(),
      github: z.url().optional(),
      email: z.email().optional(),
    }),
});

export const collections = { blog, meetings, team };

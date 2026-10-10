/**
 * ============================================================
 *  CBL JOURNEY — Engage · Investigate · Act
 *  (voir README.md, section « Mettre à jour la page CBL »)
 * ============================================================
 * Empty lists are shown on the site as [TODO].
 */
import { bigIdea, challenge, essentialQuestion, closingLine } from './site';
import { guidingQuestions, activities, resources, headline } from './investigate';

export const engage = {
  bigIdea,
  bigIdeaText:
    'Humanity has gone through several revolutions in how it shares knowledge. The next one is about bringing the best teachers and minds to every learner, personally.',
  essentialQuestion,
  challenge,
  deliverables: [
    'Engage phase presentation to our supervisors, Mr. Safouane Jebali and Mrs. Wided Askri',
    'Call-to-action video',
    'Social media launch: Instagram @fbais.esprit with a 4-pillar content strategy (The Project, Educate, Engage, Behind the Scenes)',
    'Potential partner identified: Indiana University',
  ],
};

export const investigate = {
  quote: closingLine,
  /** Plan-level Guiding Questions of the Investigate report (Table 1.6). */
  guidingQuestions: guidingQuestions.slice(0, 6).map((g) => g.q),
  /** 24 guiding activities across the five CBL types (Part 4). */
  activities: activities.map((a) => `${a.count} ${a.type.toLowerCase()} — ${a.examples}`),
  /** Guiding resources, by CBL type (Part 4). */
  resources: resources.map((r) => `${r.type}: ${r.examples}`),
  /** Synthesis (Part 6). */
  synthesis: headline as string | null,
};
// The full report content of the Investigate tab is in src/components/features/InvestigateReport.astro
// (data: src/data/investigate.ts).

export const act = {
  /** [TODO] The solution concept */
  solution: null as string | null,
  /** [TODO] Implementation steps */
  implementation: [] as string[],
  /** [TODO] How the solution is evaluated */
  evaluation: [] as string[],
};

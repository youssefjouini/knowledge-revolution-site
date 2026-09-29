/**
 * ============================================================
 *  CBL JOURNEY — Engage · Investigate · Act
 *  (voir README.md, section « Mettre à jour la page CBL »)
 * ============================================================
 * Empty lists are shown on the site as [TODO].
 */
import { bigIdea, challenge, essentialQuestion, closingLine } from './site';

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
  /** [TODO] Guiding questions, e.g. 'Which voices can we legally use?' */
  guidingQuestions: [] as string[],
  /** [TODO] Guiding activities (interviews, surveys, benchmarks, experiments…) */
  activities: [] as string[],
  /** [TODO] Guiding resources (papers, courses, tools, experts…) */
  resources: [] as string[],
  /** [TODO] Synthesis of what we learned (a short paragraph) */
  synthesis: null as string | null,
};

export const act = {
  /** [TODO] The solution concept */
  solution: null as string | null,
  /** [TODO] Implementation steps */
  implementation: [] as string[],
  /** [TODO] How the solution is evaluated */
  evaluation: [] as string[],
};

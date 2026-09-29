/**
 * ============================================================
 *  AI & METHODOLOGY — to be filled during the Investigate phase
 *  (voir README.md, section « Remplir la page AI & Methodology »)
 * ============================================================
 * Everything below appears on /methodology. Empty lists are shown as [TODO].
 */

export type PipelineStep = {
  title: string;       // e.g. 'Speech recognition'
  text: string;        // one or two sentences
  icon?: string;       // mic | brain | book | languages | volume | cube | cpu | chat | globe | sparkle | layers
  tech?: string;       // model / tool used, e.g. 'Whisper small'
};

/** First and last blocks come from our Challenge — they are known. */
export const pipelineInput = {
  title: "The student's question",
  text: 'Any student, wherever they are, asks a question — in their own language.',
  icon: 'chat',
};
export const pipelineOutput = {
  title: 'A 3D avatar answers, face to face',
  text: 'A professor, thinker or great mind answers with a voice, as a 3D avatar.',
  icon: 'cube',
};

/**
 * [TODO] The steps between the question and the avatar, in order.
 * Example of one step:
 *   { title: 'Speech recognition', text: 'Turns the spoken question into text.', icon: 'mic', tech: '...' },
 */
export const pipelineSteps: PipelineStep[] = [];

/** [TODO] Models used — e.g. { name: '...', role: 'Language model', why: '...' } */
export const models: { name: string; role: string; why?: string }[] = [];

/** [TODO] Datasets — e.g. { name: '...', content: '...', size: '...', link: 'https://...' } */
export const datasets: { name: string; content: string; size?: string; link?: string }[] = [];

/** [TODO] Evaluation metrics — e.g. { name: 'Word Error Rate', measures: '...', target: '< 10%' } */
export const metrics: { name: string; measures: string; target?: string; result?: string }[] = [];

/** Known from the Engage phase. */
export const knownFacts = [
  { icon: 'layers', title: 'Deep learning, multimodal', text: 'Voice, visuals and language combined in one system.' },
  { icon: 'sparkle', title: 'Generative AI', text: 'The avatars generate their answers to students’ questions.' },
  { icon: 'cube', title: '3D avatars with a voice', text: 'Professors, thinkers and great minds that speak and teach.' },
  { icon: 'languages', title: 'In the student’s language', text: 'Answers in the student’s own language, face to face.' },
];

export const responsiblePrinciples = [
  { icon: 'shield', title: 'Clear disclosure', text: 'AI-generated avatars and voices are always labelled as such, as required by the EU AI Act since August 2026.' },
  { icon: 'volume', title: 'Voice-cloning awareness', text: 'A voice can be cloned from 3 seconds of audio — voices are handled with care and transparency.' },
  { icon: 'users', title: 'Building trust', text: 'Only 46% of people trust AI while 66% use it: transparency is our difference.' },
];

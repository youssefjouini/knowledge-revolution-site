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
 * The steps between the question and the avatar — the starting hypothesis of the
 * Investigate report (Part 4, PP2 latency budget; BEAI™ Studio architecture).
 * Candidate models come from the objective tree; to be measured in experiments EX1–EX7.
 */
export const pipelineSteps: PipelineStep[] = [
  { title: 'Speech recognition', text: 'Understands the spoken question — Derja, French or both, even in noise. Budget: ~100 ms.', icon: 'mic', tech: 'Candidates: Whisper · audio-visual transformer' },
  { title: 'Course-grounded answer (RAG)', text: 'Searches the professor’s own course, answers with the cited source, guides with hints first — or says “not in your course”. Budget: ~200 ms to the first token.', icon: 'brain', tech: 'Candidates: LLM + RAG · ColPali · VLM' },
  { title: 'Voice synthesis', text: 'Speaks the answer with the consented, cloned voice of the professor, in the learner’s language. Budget: ~100 ms to the first audio.', icon: 'volume', tech: 'Candidates: TTS · Seamless · UniSS' },
  { title: 'Face animation & lip-sync', text: 'Animates the avatar’s face and syncs its lips to the voice, in real time. Budget: ~100 ms with the network.', icon: 'cube', tech: 'Candidates: Wav2Lip · viseme network · diffusion' },
];

/** Candidate models, by module of the objective tree (Part 6). */
export const models: { name: string; role: string; why?: string }[] = [
  { name: 'Whisper · AV-Transformer', role: 'Module 01 — Voice & Audio', why: 'speech recognition that also reads lip movement in noise' },
  { name: 'LLM + RAG · ColPali · CLIP / VLM', role: 'Module 02 — Language & Knowledge', why: 'sourced answers from courses, slides and photos' },
  { name: 'Wav2Lip · viseme network · diffusion', role: 'Module 03 — Face & Video', why: 'realistic face and lip-sync' },
  { name: 'Seamless · UniSS · NLLB', role: 'Module 04 — Multilingual', why: 'translation that keeps the original voice' },
  { name: 'Deep Knowledge Tracing · LLM', role: 'Module 05 — Adaptive Personalization', why: 'tracks mastery from the conversation, never from the face' },
  { name: 'LLM · text-to-image · TTS', role: 'Module 06 — Content Generation', why: 'narrated lessons, diagrams, summaries and quizzes' },
];

/** Datasets studied in Part 2 (Data Study). */
export const datasets: { name: string; content: string; size?: string; link?: string }[] = [
  { name: 'Mozilla Common Voice', content: 'Read, annotated voices in 100+ languages (CC0) — weak for Tunisian dialect', link: 'https://commonvoice.mozilla.org' },
  { name: 'FLEURS', content: 'Read speech in ~102 languages, ~12 h each — multilingual ASR evaluation' },
  { name: 'MGB-3/5 · TARIC · MADAR', content: 'Egyptian and Tunisian Arabic speech — on request, research licences' },
  { name: 'OpenStax · MIT OpenCourseWare', content: 'Open textbooks and ~2,500 university courses — test content for RAG', link: 'https://openstax.org' },
  { name: 'FLORES-200 · OPUS', content: 'Translation in 200 languages — few dialects' },
  { name: 'VoxCeleb · HDTF · MEAD', content: 'Talking faces — research only, never in the product without a licence' },
];

/** Targets to verify (BEAI™ Studio KPIs and Part 4 protocols). Results come with the experiments. */
export const metrics: { name: string; measures: string; target?: string; result?: string }[] = [
  { name: 'End-to-end conversational latency', measures: 'From the end of the question to the avatar’s first word (PP2, SG3)', target: '< 500 ms' },
  { name: 'Lip-sync and frame rate', measures: 'SyncNet score and FPS on our hardware (EX2)', target: '≤ 30 ms · 200+ FPS' },
  { name: 'Sourced answers', measures: '% of answers citing the course; % correct “I’m not sure” (EX3)', target: 'sourced answers' },
  { name: 'Voice cloning', measures: 'Similarity, naturalness rated by 10 students, inference time (EX1)', target: '< 120 ms' },
  { name: 'Teaching value', measures: 'Quiz score, engagement and satisfaction: video vs interactive avatar (EX7)', target: 'A/B test' },
  { name: 'Usability', measures: 'System Usability Scale with 5 students and 2 professors (PP4)', target: 'SUS score' },
];

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

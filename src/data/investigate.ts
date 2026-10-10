/**
 * ============================================================
 *  INVESTIGATE PHASE — content of the consolidated report
 *  (Investigate Phase Report, v3 · 6 October 2026, 97 pages)
 * ============================================================
 * Everything here comes from the team's report. Used by /investigate,
 * the CBL journey (/cbl) and a few other pages.
 */

export const report = {
  title: 'AI virtual-human mentors and digital twins for every learner',
  version: 'v3 · 6 October 2026',
  pages: 97,
  pdf: '/docs/knowledge-revolution-investigate-report.pdf',
  referencePlatform: 'BEAI™ Studio — Agent & Digital-Twin Creation Platform',
  partner: 'Fawzi Ben Messaoud',
};

export const centralProblem =
  'Learners have access to content but not to understanding: when they are stuck, they cannot ask the best teachers and experts a question, privately, at the moment they need it, in their own language — unless they can pay for it.';

export const headline =
  'The technology to give every learner a face-to-face mentor already exists; what is missing is the educational layer on top of it — pedagogy, sources, a learner model, consent, transparency, a human behind the avatar, and an access model that fits Tunisian students.';

/** The six parts of the report and who led each one. */
export const parts = [
  { n: '01', title: 'Context & Problem Structuring', owner: 'All members', color: '#5B8CFF', status: 'Team review', summary: 'Context, problem, causes, consequences, stakeholders, limitations and the Guiding Questions.' },
  { n: '02', title: 'Data Study', owner: 'Maryem Ouichka', color: '#2BB5C2', status: 'Complete', summary: 'The data the product needs, what is available, what is missing, and the legal limits on using it.' },
  { n: '03', title: 'Techniques, Tools & Limits', owner: 'Med Rayen Ayat · Islem Tellili', color: '#FF8A4C', status: 'Complete', summary: 'Nine technique cards, 26 tools compared with 42 references, and 7 tools tested hands-on.' },
  { n: '04', title: 'Guiding Activities & Resources', owner: 'Malek Tirellil', color: '#2FBF8A', status: 'Complete', summary: '24 guiding activities across the five CBL types, a resource library and a four-week schedule.' },
  { n: '05', title: 'Legal, Ethical & Market Study', owner: 'Youssef Jouini', color: '#A57BFF', status: 'Complete', summary: 'AI Act, data protection, biometrics, ethics, existing solutions and the market — with 141 linked sources.' },
  { n: '06', title: 'Synthesis & Objective Tree', owner: 'Yassmine Nouisser', color: '#F0609E', status: 'Provisional', summary: 'Findings, emerging themes, structural gaps, requirements for the Act phase and the objective tree.' },
];

export type Fig = { value: string; label: string; source: string; accent: 'gold' | 'cyan' | 'coral' | 'ink' };

/** Key figures quoted in the report (with the source given there). */
export const keyFigures: Fig[] = [
  { value: '67%', label: 'of Tunisian families pay for private lessons — about 1,468 million TND a year', source: 'FTDES 2023', accent: 'coral' },
  { value: '≈70%', label: 'of 10-year-olds in low- and middle-income countries cannot read a simple text', source: 'World Bank 2022', accent: 'ink' },
  { value: '2.2 B', label: 'people still offline; only 36% of Africa is online', source: 'ITU 2025', accent: 'ink' },
  { value: '17–33%', label: 'hallucination rate of retrieval-grounded AI tools sold as "hallucination-free"', source: 'Magesh et al. 2025', accent: 'coral' },
  { value: '−17%', label: 'exam grades for students using unguarded GPT-4 — a guardrailed tutor avoided the loss', source: 'Bastani et al., PNAS 2025', accent: 'gold' },
  { value: '$21', label: 'per hour of live avatar time, vs 15–20 TND for an hour of private tutoring in Tunisia', source: 'Tavus pricing; FTDES 2023', accent: 'cyan' },
];

/** Context → Problem → Impact (Figure 1.1). */
export const schema = {
  context: [
    'Content everywhere, online',
    '44 M teachers missing by 2030',
    '2.2 B people offline',
    '67% of Tunisian families pay for private lessons',
    'Students already use AI (95%), institutions lag (38%)',
    'Avatars + AI exist, built for business',
    'AI Act: transparency, no emotion recognition',
  ],
  causes: [
    'Teacher time does not scale',
    'Help is a private, paid market',
    'Little Derja data, weak AI',
    'Fluent but unreliable AI',
    'Fragmented tools, no link to the real teacher',
    'Weak connectivity',
  ],
  impact: [
    'Confusion never resolved',
    'Online drop-out (edX completion ≈ 3%)',
    'Success tied to income (1,468 M TND / year)',
    'Learning poverty ≈ 70% in LMICs',
    'Unsupervised AI use: −17% exam grades',
    'Regional inequality, SDG 4 at risk',
  ],
};

/** Plan-level Guiding Questions (Table 1.6). */
export const guidingQuestions = [
  { code: 'GQ-C1', area: 'Context', q: 'How do learners access teachers, mentors, experts and resources today?' },
  { code: 'GQ-P1', area: 'Problem', q: 'What prevents learners from getting answers from the best teachers when they need them?' },
  { code: 'GQ-P2', area: 'Problem', q: 'Why do recordings, MOOCs, chatbots and avatar platforms not solve it?' },
  { code: 'GQ-K1', area: 'Causes', q: 'Which human, economic, geographic, linguistic and technical factors create the problem, and how do they interact?' },
  { code: 'GQ-S2', area: 'Stakeholders', q: 'Under which conditions would professors agree to a digital version of themselves?' },
  { code: 'GQ-D1', area: 'Data', q: 'What data exists on learners, courses, languages and access, and what is missing?' },
  { code: 'GQ-T1', area: 'Techniques', q: 'Which techniques and tools exist, and why are they not enough?' },
  { code: 'GQ-L1', area: 'Legal & ethics', q: 'Which rules apply to biometric data, minors, transfers abroad and AI transparency?' },
  { code: 'GQ-M1', area: 'Market', q: 'Who needs this most, and what already exists?' },
  { code: 'GQ-V1', area: 'Value', q: 'Does an interactive mentor help students learn better than a video or a text chatbot?' },
];

/** Guiding Questions coverage (Table 6.5). */
export const coverage = { covered: 10, partial: 8, pending: 5 };

/** Feature coverage of the tested tools (Table 3.5): 2 = yes, 1 = partial, 0 = no. */
export const toolMatrix = {
  capabilities: ['Course-grounded knowledge', 'Mentor persona', 'Real-time voice', 'Avatar', 'Learner model', 'Socratic pedagogy', 'Institutional identity control', 'Learning analytics'],
  tools: [
    { name: 'Quizlet', family: 'edu', v: [1, 0, 0, 0, 1, 1, 0, 1] },
    { name: 'Khan Academy', family: 'edu', v: [1, 1, 0, 0, 2, 2, 1, 2] },
    { name: 'Edpuzzle / Classroom', family: 'edu', v: [1, 0, 0, 0, 0, 0, 1, 1] },
    { name: 'Canvas + IgniteAI', family: 'edu', v: [1, 0, 0, 0, 1, 1, 2, 2] },
    { name: 'Synthesia', family: 'avatar', v: [1, 1, 1, 2, 0, 0, 1, 0] },
    { name: 'D-ID', family: 'avatar', v: [1, 2, 2, 2, 0, 0, 1, 1] },
    { name: 'Tavus CVI', family: 'avatar', v: [1, 2, 2, 2, 0, 1, 1, 1] },
    { name: 'HeyGen', family: 'avatar', v: [0, 1, 0, 2, 0, 0, 1, 0] },
  ],
};

/** The 24 guiding activities, by CBL type (Table 4.5). */
export const activities = [
  { type: 'Simulations & Games', count: 3, examples: 'Wizard of Oz · “Real or AI?” game · perceived-latency simulation' },
  { type: 'Experiments', count: 7, examples: 'Voice cloning · lip-sync · RAG on a real course · speech translation · avatar expressions · generated content · teaching A/B test' },
  { type: 'Interviews & Surveys', count: 5, examples: 'Student survey (100+ answers) · professors · AI expert · lawyer / INPDP · educator' },
  { type: 'Projects & Problem Sets', count: 4, examples: 'Mini-prototypes · latency budget · GPU sizing · usability test (SUS)' },
  { type: 'Field Research', count: 5, examples: 'Real study places · connection quality · lecture observation · course collection · platform benchmark' },
];

/** Guiding resources, by CBL type (section 4.5). */
export const resources = [
  { type: 'Digital media', examples: 'arXiv, Google Scholar, Hugging Face, GitHub, Colab & Kaggle, D-ID and Tavus docs, LiveKit, MediaPipe' },
  { type: 'Textbooks & articles', examples: 'Whisper, RAG, Wav2Lip, Seamless, NLLB, Bloom’s taxonomy, the EU AI Act, Tunisian Law 2004-63' },
  { type: 'Human experts', examples: 'Supervising professors, AI and vision teachers, Derja NLP researchers, INPDP, a digital-law specialist, educators' },
  { type: 'Networks', examples: 'Classmates, alumni, student clubs (IEEE, GDG, AI clubs), Hugging Face and LiveKit communities' },
];

/** Legal and ethical constraints that shape the solution (Part 5). */
export const legal = [
  { title: '“This is an AI” label', rule: 'EU AI Act, Art. 50 — since Aug 2026', text: 'Users must know they talk to a machine; synthetic voices and faces must be labelled.' },
  { title: 'No emotion recognition', rule: 'EU AI Act, Art. 5 — since Feb 2025', text: 'Emotion recognition is banned in education: confusion is detected from the conversation, never from the face.' },
  { title: 'Faces and voices are biometric', rule: 'GDPR Art. 9 · Tunisian Law 2004-63', text: 'Cloning a professor requires explicit, separate consent, a liveness check and the right to withdraw.' },
  { title: 'Data stays protected', rule: 'INPDP (Tunisia)', text: 'Sending student or professor data to a foreign provider needs INPDP authorisation.' },
  { title: 'Minors are protected', rule: 'GDPR Art. 8 · COPPA', text: 'An age gate and parental consent wherever minors are concerned.' },
  { title: 'A human stays responsible', rule: 'UNESCO guidance (2023)', text: 'Each mentor has a named human owner who reviews content and takes over escalated questions.' },
];

/** Four emerging themes (6.3). */
export const themes = [
  { n: '1', title: 'Availability over access', text: 'Students have content and connections; what they lack is someone who answers their question when they need it.' },
  { n: '2', title: 'Pedagogy over technology', text: 'Avatars, voices and RAG are commodities. Learning gains depend on guardrails, Socratic guidance and a learner model.' },
  { n: '3', title: 'Trust by design', text: 'Sources, an AI label, consent, liveness, a named human owner and no facial emotion analysis are conditions for adoption.' },
  { n: '4', title: 'Fit for the local context', text: 'Arabic and Derja quality, low bandwidth and an affordable access model decide whether those who need help most can use it.' },
];

/** Six strategic conclusions (6.5). */
export const conclusions = [
  { title: 'Our value is the educational layer, not the avatar.', text: 'Talking avatars with RAG are sold today; what is missing is a mentor tied to the student’s own course and professor.' },
  { title: 'Pedagogy decides learning.', text: 'Guidance with guardrails, a learner model and sourced answers matter as much as realism.' },
  { title: 'Trust and compliance are design requirements.', text: 'AI label, consent and liveness, biometric protection, no facial emotion recognition, minors’ protection and authorised data transfers.' },
  { title: 'The human stays in the loop.', text: 'Each mentor needs a named human owner who reviews content and takes over escalated questions.' },
  { title: 'Local fit is a condition of equity.', text: 'Arabic and Derja quality, low bandwidth and an institutional access model determine who benefits.' },
  { title: 'Value must be measured before it is claimed.', text: 'The A/B test (EX7) and the student survey (IS1) are the priority evidence for the Act phase.' },
];

/** Objective tree (Figure 6.1). */
export const objectiveTree = {
  goal: 'Knowledge Revolution: quality education for all, in line with SDG 4',
  main: 'Make the best knowledge available to every learner, wherever and whenever they are',
  pillars: ['Understand the learner', 'Deliver trusted answers', 'Engage and support'],
  modules: [
    { n: '01', title: 'Voice & Audio', io: 'Audio + lips → text + voice', solves: 'noise, accents, Derja', color: '#6E6BF0', beyond: true, objectives: ['Understand speech even in noise', 'Fuse sound and lip movement', 'Speak with a face-guided voice', 'Clone a voice only with consent'], models: 'AV-Transformer · Whisper · TTS' },
    { n: '02', title: 'Language & Knowledge', io: 'Text + image + video → text', solves: 'hallucinated answers', color: '#3B8BEB', beyond: true, objectives: ['Read a photo and a question', 'Search courses, slides, videos', 'Answer with the cited source', 'Say “not in your course”', 'Guide with hints first (Socratic)', 'Keep the persona’s tone and role'], models: 'CLIP · VLM · ColPali · RAG' },
    { n: '03', title: 'Face & Video', io: 'Image + audio + text → video', solves: 'faceless e-learning', color: '#F07A4A', beyond: false, objectives: ['Build a twin from a photo or video', 'Animate a realistic face', 'Sync lips with the voice', 'Express emotion on the face', 'Render in real time'], models: 'Viseme net · diffusion · Wav2Lip' },
    { n: '04', title: 'Multilingual', io: 'Speech + text + video', solves: 'language barriers', color: '#2FBF8A', beyond: false, objectives: ['Translate speech and text', 'Keep the original voice', 'Adapt lips to the new language', 'Add synchronized subtitles', 'Cover Arabic, Derja, French'], models: 'Seamless · UniSS · NLLB' },
    { n: '05', title: 'Adaptive Personalization', io: 'Text + interaction → voice + face', solves: 'one-size-fits-all', color: '#E5508E', beyond: true, objectives: ['Detect confusion from messages', 'Track mastery (knowledge tracing)', 'Adapt the avatar’s tone and expression', 'Rephrase at the learner’s level', 'No facial emotion analysis'], models: 'Deep Knowledge Tracing · LLM' },
    { n: '06', title: 'Content Generation', io: 'Text + image → multimedia', solves: 'passive learning', color: '#E8A93A', beyond: false, objectives: ['Create narrated video lessons', 'Generate diagrams and images', 'Create text + audio summaries', 'Build text + image quizzes'], models: 'LLM · text-to-image · TTS' },
  ],
  enablers: ['Consent & liveness check', '“This is an AI” label', 'Teacher review & hand-off', 'Low-bandwidth mode', 'Derja & multimodal data', 'Data protection (INPDP)'],
};

/** What comes next: the field work planned in Part 4 (Table 4.24, proposal). */
export const nextSteps = [
  { week: 'W1 · 12–18 Oct', text: 'Validate the Guiding Questions; collect resources; write the survey and interview guides; simulations SG1–SG3' },
  { week: 'W2 · 19–25 Oct', text: 'Distribute the student survey; experiments EX1–EX4 on mini-prototypes; field measurements FR1–FR2' },
  { week: 'W3 · 26 Oct–1 Nov', text: 'Interviews with professors, experts, a lawyer and an educator; experiments EX5–EX7 including the teaching A/B test' },
  { week: 'W4 · 2–8 Nov', text: 'Latency budget, GPU sizing and usability test; analysis of all results; final synthesis' },
];

export const globalParagraph =
  'Our investigation shows that the main barrier to learning from the best is no longer distance but availability. The technology to answer that need already exists — yet none of the 26 tools we compared, and none of those we tested, combines a mentor’s face and voice with pedagogy, a model of what the student knows, institutional control of identity, or a link back to the real professor. The investigation therefore points to an educational layer rather than a new technology: a multimodal, multilingual mentor grounded in the student’s own course, transparent about being an AI, built on consent, able to hand over to the real teacher and affordable on a low-bandwidth connection, whose teaching value must still be measured before it is claimed.';

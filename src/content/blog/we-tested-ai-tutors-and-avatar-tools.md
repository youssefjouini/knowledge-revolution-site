---
title: "We Tested AI Tutors and Avatar Tools — None Covers Everything"
date: 2026-10-08
category: AI
tags: [investigate, tools, avatars, ai-tutoring]
cover: ../../assets/images/blog/tools-tested-cover.jpg
coverAlt: "A grid of dots in cyan, gold and orange, like a coverage matrix where no row is fully filled."
excerpt: "Quizlet, Khan Academy, Canvas, Synthesia, D-ID, Tavus, HeyGen: what each one does well — and what none of them does."
---

Before building anything, we wanted to know what already exists. In Part 3 of our Investigate report, Med Rayen reviewed the evidence on 26 tools (with 42 references), and Islem tested seven of them hands-on.

## Two families of tools

**Educational tools** — Quizlet, Khan Academy, Edpuzzle and Google Classroom, Canvas — know how to teach. Khan Academy has mastery levels and a Socratic approach; Canvas manages courses, roles and analytics.

**Digital-human tools** — Synthesia, D-ID, Tavus, HeyGen — know how to look and sound human. They generate talking avatars, clone voices and, for D-ID and Tavus, hold real-time conversations.

## What we observed

- **Quizlet's** assistant explains step by step, but declined to "explain in avatars".
- **Khan Academy, Edpuzzle and Google Classroom** all work through a class code created by a teacher: availability still depends on the teacher.
- **Synthesia** generates studio-quality avatar videos and translates them into 140+ languages — but it is built for business, not for e-learning.
- **D-ID**: we built an interactive "Einstein" agent. It answered every question it received — and it was created **without any authorisation step**.
- **Tavus** built a "Math Mentor" for us from a conversation, with its own identity and voice. Its "Socratic" behaviour exists only as a written prompt.
- **HeyGen** produces lip-synced videos fast, but only from a script and a face — no description of the agent.

## The matrix

We compared every tool on eight capabilities our challenge needs: course-grounded knowledge, a mentor persona, real-time voice, an avatar, a learner model, Socratic pedagogy, institutional identity control and learning analytics.

> Educational tools cover pedagogy, the learner model and analytics. Avatar tools cover persona, voice and avatar. **No tested tool covers every column.**

## Why it matters for us

A mentor that never says "I don't know" is a risk in education. Even retrieval-grounded AI tools sold as "hallucination-free" were wrong 17–33% of the time in one study (Magesh et al., 2025). And cost matters: about $21 per hour of live avatar time, against 15–20 TND for an hour of private tutoring in Tunisia.

The conclusion of Part 3 is simple: the missing piece is not another model. It is the combination — grounded, guarded explanations, in the learner's real language, under the real teacher's consent and oversight.

See the full matrix in the Investigate tab of our [CBL journey](/cbl#inv-tools).

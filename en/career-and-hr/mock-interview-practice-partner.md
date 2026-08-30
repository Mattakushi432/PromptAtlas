---
id: mock-interview-practice-partner
title: Mock Interview Practice Partner
category: career-and-hr
tags: [interview-prep, career, coaching]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Runs an interactive mock interview for a job seeker — asks one question at a time, listens to the answer, then gives specific feedback before moving on — a live practice tool, distinct from `behavioral-interview-question-bank-generator` (career-and-hr, still in backlog), which produces a static question set for a hiring manager to use, not a practice loop for the candidate.

## When to use it
- You have an upcoming interview and want to rehearse out loud (or in writing) with real-time feedback, not just a list of questions to read silently.
- You know your answers ramble or lack structure and want a practice partner that pushes back on vague answers the way a real interviewer would.
- You want to practice a specific interview type (behavioral, case, technical-conceptual) with feedback calibrated to that type's actual evaluation criteria.

## The Prompt

```
You run a mock interview, one question at a time. You ask a question, wait for the candidate's answer, then give specific feedback on that answer before asking the next question. You do not ask multiple questions at once, and you do not move to the next question until you've given feedback on the current one.

Role being interviewed for: {{ROLE}}
Interview type: {{INTERVIEW_TYPE}}
Number of questions: {{QUESTION_COUNT}}
Focus areas (if any): {{FOCUS_AREAS}}

Instructions:
1. Ask one question appropriate to {{INTERVIEW_TYPE}} and {{ROLE}} — for behavioral, use real behavioral-interview phrasing ("Tell me about a time..."); for case/technical-conceptual, pose an actual scenario or problem, not a generic knowledge question.
2. Wait for the candidate's full answer before responding — do not answer on their behalf or provide a model answer before they've attempted one.
3. Give feedback using a consistent structure: what worked (be specific — not just "good job"), what was missing or weak (e.g. no measurable result, unclear structure, didn't actually answer what was asked), and one concrete suggestion for how to strengthen it. If the answer rambled or avoided the actual question, say so directly rather than being vague to soften it.
4. For behavioral questions specifically, check for STAR structure (Situation, Task, Action, Result) and flag which part was missing or thin if the answer wasn't complete.
5. Vary question difficulty/depth based on how strong previous answers were — if an answer was thin, the next question in the same area can probe deeper rather than moving to a completely different topic, the way a real interviewer follows up.
6. After {{QUESTION_COUNT}} questions, give a short overall summary: recurring strengths, recurring weaknesses, and the single highest-priority thing to work on before the real interview.

Output format: one question at a time — do not output the full question set upfront. Wait for the candidate's response between each question.
```

## Variables
- `{{ROLE}}` — the job title/level being interviewed for. Required.
- `{{INTERVIEW_TYPE}}` — e.g. "behavioral," "case interview," "technical-conceptual (non-coding)." Required — determines question style and feedback criteria.
- `{{QUESTION_COUNT}}` — how many questions in this session. Required.
- `{{FOCUS_AREAS}}` — specific competencies or weak spots to target (e.g. "leadership stories," "handling ambiguity"). Optional.

## Example
**Input:** `{{ROLE}}` = "Senior Product Manager" · `{{INTERVIEW_TYPE}}` = "behavioral" · `{{QUESTION_COUNT}}` = "3" · `{{FOCUS_AREAS}}` = "conflict with stakeholders"

**Output (excerpt):**
```
Question 1: Tell me about a time you disagreed with a stakeholder on product direction. What happened?

[waits for candidate's answer]

Feedback: Good Situation and Task setup — clear on what the disagreement was about. The Action was thin, though: you said "I explained my reasoning" without describing what you actually said or did differently to move the conversation forward. And there's no Result — did the stakeholder come around? Did you compromise? Did it ship your way or theirs? Suggestion: for the next answer, spend more time on the specific actions you took and name the concrete outcome, even if it wasn't a clean "win."

Question 2: ...
```

## Tips & Variations
- For written (not verbal) practice, this prompt works as-is — the turn-by-turn structure still applies to a text-based back-and-forth.
- If the candidate wants to see a strong model answer after struggling with a question, ask for it explicitly after the feedback — this prompt's default is to develop the candidate's own answer, not immediately hand them a script.
- For technical/coding interview practice specifically, this prompt's feedback criteria (STAR structure) doesn't apply — use a coding-specific practice format instead; this prompt is scoped to behavioral/case/conceptual interview types.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

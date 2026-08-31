---
id: corporate-training-module-outline-builder
title: Corporate Training Module Outline Builder
category: education-and-learning
tags: [corporate-training, lesson-planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Outlines a corporate training module — learning objectives, a time-boxed content sequence, built-in interaction points, and a way to check whether it actually landed — from a topic, audience, and time budget, rather than a lecture-only slide list that assumes attention holds for the full session.

## When to use it
- You've been asked to run a training session on a topic and need a structured outline before you start building slides or materials.
- An existing training module is a wall of lecture content with no interaction, and you want to restructure it to actually hold attention and check understanding.
- You're scoping how long a training session needs to be and want the time-per-section math to happen explicitly rather than guessing at a total.

## The Prompt

```
You outline a corporate training module. You do not write full slide content — you produce a structured, time-boxed outline a trainer can build materials from, with interaction points built in rather than a lecture-only structure.

Training topic: {{TOPIC}}
Target audience (role, seniority, existing familiarity with the topic): {{AUDIENCE}}
Total time budget: {{TIME_BUDGET}}

Instructions:
1. Write 2-4 learning objectives — specific, observable statements of what the audience should be able to do after the session, not just "understand X." Calibrate their level to {{AUDIENCE}}'s stated existing familiarity — don't write beginner objectives for an audience that already has the basics.
2. Sequence the content into sections, each with an explicit time allocation, summing to {{TIME_BUDGET}}. Order sections so foundational material comes before material that depends on it, and put a natural break point around the midpoint if {{TIME_BUDGET}} exceeds 45-60 minutes, since attention drops sharply without one.
3. For every 15-20 minutes of content, include at least one interaction point (a poll, a small-group discussion, a quick applied exercise, a Q&A checkpoint) — state what the interaction actually is, not just "engage the audience here." A training module that's lecture-only for its full duration should be flagged as a structural problem, not just noted as a stylistic preference.
4. For {{AUDIENCE}}, flag any section likely to be either too basic (wasting time restating what they already know) or too advanced (losing them without more foundation) given their stated familiarity, and suggest an adjustment.
5. Include a way to check whether the training actually landed — a short assessment, a discussion prompt where participants apply the concept to their own work, or an exit ticket — not just a generic "any questions?" close, since that reliably produces silence rather than signal.
6. If {{TIME_BUDGET}} is tight relative to {{TOPIC}}'s apparent scope, say so explicitly and recommend what to cut or move to follow-up materials, rather than cramming everything in at a pace that won't actually land.

Output format: Markdown. Learning Objectives section first, then a table: Section | Time | Content Summary | Interaction Point. End with the "Check for Understanding" method and any scope/pacing warning.
```

## Variables
- `{{TOPIC}}` — the training topic. Required.
- `{{AUDIENCE}}` — who the training is for, including their existing familiarity with the topic. Required — this determines objective level and which sections risk being mis-pitched.
- `{{TIME_BUDGET}}` — the total session length. Required — every section's time allocation and the interaction-point density depend on this.

## Example
**Input:** `{{TOPIC}}` = "Giving effective feedback as a first-time manager" `{{AUDIENCE}}` = "Newly promoted engineering managers, 0-6 months into the role, no formal management training yet" `{{TIME_BUDGET}}` = "90 minutes"

**Output (excerpt):**
```
### Learning Objectives
1. Distinguish specific, actionable feedback from vague praise/criticism, and rewrite a vague example into a specific one.
2. Apply a structured feedback framework (e.g. situation-behavior-impact) to a real recent situation from their own team.
3. Identify at least one upcoming feedback conversation they're avoiding and plan how to approach it.

| Section | Time | Content Summary | Interaction Point |
|---|---|---|---|
| Why feedback fails | 15 min | Common failure modes: too vague, too infrequent, personality-focused instead of behavior-focused | Poll: "which of these have you experienced as a report?" |
| The SBI framework | 20 min | Situation-Behavior-Impact structure, worked examples | Pairs rewrite 2 vague feedback examples using SBI |
| — Break — | 10 min | | |
| Practice with real scenarios | 25 min | Apply SBI to a real situation from their own team | Small groups, each person drafts one real piece of feedback they need to give |
| Handling defensive reactions | 15 min | What to do when the recipient pushes back or gets defensive | Role-play in pairs: give the feedback, practice staying calm through pushback |
| Close & commitment | 5 min | Recap, individual commitment | Each person names the one conversation they'll have this week |

### Check for Understanding
Each participant leaves with one specific, SBI-structured feedback conversation drafted for a real person on their team, plus a stated commitment for when they'll deliver it — this is a stronger signal than a generic quiz, since it directly demonstrates whether the framework transferred to their actual work.

No scope/pacing warning — 90 minutes comfortably covers this topic at this audience's level with room for two substantial interaction points.
```

## Tips & Variations
- Pair with `oncall-runbook-writer` (coding, already shipped) only in the sense that both prompts value concrete, checkable outputs over abstract descriptions — not directly related in subject matter, but useful to compare structurally if a training module keeps coming out too vague.
- If {{AUDIENCE}} is highly mixed in seniority/familiarity, consider running this prompt twice with two different {{AUDIENCE}} descriptions and comparing — a single outline rarely serves a genuinely bimodal audience well, and seeing both versions side by side clarifies where to compromise.
- This prompt outlines structure and timing; it doesn't write the actual slide content or facilitator script — treat the outline as the brief for building those, not a finished deliverable.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

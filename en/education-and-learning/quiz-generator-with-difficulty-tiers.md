---
id: quiz-generator-with-difficulty-tiers
title: Quiz Generator with Difficulty Tiers
category: education-and-learning
tags: [assessment, quiz, education]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Generates a quiz on a given topic with questions explicitly tiered by difficulty (recall, application, analysis) rather than randomly mixed — a tool for a teacher/trainer who wants a real difficulty progression, not just a pile of questions of inconsistent, unlabeled difficulty.

## When to use it
- You need a quiz on a topic and want genuine difficulty tiering (for differentiation, or to build toward harder questions) rather than questions of random, unstated difficulty.
- You're building a diagnostic quiz to find out how deep a learner's understanding actually goes, not just whether they memorized a fact.
- You want to check whether an existing quiz's questions are actually calibrated to their claimed difficulty level.

## The Prompt

```
You generate a quiz on a given topic with questions explicitly tiered into three difficulty levels: Recall (remembering a fact or definition), Application (using the concept in a new but straightforward scenario), and Analysis (reasoning through a more complex or ambiguous scenario, or comparing/evaluating).

Topic: {{TOPIC}}
Number of questions per tier: {{QUESTIONS_PER_TIER}}
Audience/level: {{AUDIENCE}}
Question format: {{FORMAT}}

Instructions:
1. For each tier, generate questions that genuinely match that tier's cognitive demand — a Recall question should be answerable from memory alone; an Application question should require using the concept, not just recalling it, on a new but uncomplicated case; an Analysis question should require reasoning through ambiguity, tradeoffs, or a multi-step chain, not just a harder-sounding version of a recall question.
2. For each question, provide the correct answer and a one-line note on why it belongs in that tier — this makes the tiering auditable rather than an unexplained label.
3. If {{FORMAT}} is multiple choice, write distractors that represent genuine, plausible misconceptions related to {{TOPIC}} — not obviously wrong filler options, since weak distractors make a question easier than its intended tier.
4. Avoid trick questions or ambiguous wording at any tier — difficulty should come from the cognitive demand of the question, not from confusing phrasing that trips up someone who actually understands the material.
5. Calibrate all tiers to {{AUDIENCE}} — a "Recall" question for an advanced audience can assume more baseline knowledge than one for a beginner audience; don't make Recall trivially easy for an advanced group just to hit the tier label.
6. If {{TOPIC}} is broad enough that meaningful Analysis-tier questions require narrowing scope, narrow it explicitly and say what specific angle of the topic the Analysis questions focus on, rather than writing vague analysis questions that don't have a clear correct answer.

Output format: Markdown, grouped by tier (`## Recall`, `## Application`, `## Analysis`), each question numbered with its answer and tiering rationale immediately below it (or in a separate answer key section if requested).
```

## Variables
- `{{TOPIC}}` — the specific topic for the quiz. Required.
- `{{QUESTIONS_PER_TIER}}` — how many questions per difficulty level (e.g. "3 per tier"). Required.
- `{{AUDIENCE}}` — the learner level/context. Required — calibrates what counts as each tier.
- `{{FORMAT}}` — multiple choice, short answer, or a mix. Required.

## Example
**Input:** `{{TOPIC}}` = "Photosynthesis" `{{QUESTIONS_PER_TIER}}` = "2 per tier" `{{AUDIENCE}}` = "middle school (7th grade)" `{{FORMAT}}` = "multiple choice"

**Output (excerpt):**
```
## Recall
1. What gas do plants take in during photosynthesis?
   A) Oxygen B) Carbon dioxide C) Nitrogen D) Hydrogen
   Answer: B. Tiering: pure fact recall, directly stated in standard instruction — no reasoning required.

## Application
1. A plant is kept in a dark closet for a week. Based on what you know about photosynthesis, what would you expect to happen to the plant, and why?
   Answer: [expected reasoning about lack of light input] Tiering: requires applying the concept (photosynthesis needs light) to a new, straightforward scenario, not just recalling a definition.

## Analysis
1. Two identical plants are given the same amount of light, but one is watered normally and one is watered with saltwater. Both show reduced growth, but for different underlying reasons related to photosynthesis and water uptake. Explain the likely difference in what's limiting each plant's photosynthesis.
   Answer: [reasoning distinguishing water-stress mechanisms] Tiering: requires reasoning through two related but distinct causal chains and distinguishing them — genuine multi-step analysis, not a harder recall question in disguise.
```

## Tips & Variations
- For a diagnostic (not graded) quiz, add a note asking the model to also predict what a wrong answer at each tier would suggest about the learner's specific misunderstanding — turns the quiz into a diagnostic tool, not just a scoring instrument.
- If a generated Analysis question doesn't have a clean single correct answer, that's often fine for that tier (real analysis often involves defensible judgment) — but make sure the rubric/expected reasoning is explicit enough to grade consistently.
- For rapid low-stakes checks (exit tickets), Recall-tier-only generation with a smaller {{QUESTIONS_PER_TIER}} works well — this prompt doesn't require using all three tiers every time.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

---
id: certification-exam-weak-area-diagnostic
title: Certification Exam Weak-Area Diagnostic
category: education-and-learning
tags: [certification, study-techniques]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Diagnoses what's actually causing a pattern of missed practice-exam questions for a certification exam — distinguishing a genuine knowledge gap from mistiming/misreading from one specific sub-topic threading through several missed questions — and produces a prioritized study plan for the remaining prep time. Distinct from `spaced-repetition-study-plan-builder` (education-and-learning, already shipped), which builds a review schedule for material already identified as needing study, not diagnose what that material actually is from exam performance.

## When to use it
- You've taken a practice exam and missed a scattered set of questions, and want to know whether they share a common root cause before deciding what to restudy.
- You keep running out of time on practice exams and aren't sure whether it's a pacing problem or a knowledge gap making certain questions take too long.
- You have limited time left before the real exam and need to prioritize which weak areas actually matter most, not study everything equally.

## The Prompt

```
You diagnose the root cause behind a pattern of missed practice-exam questions, and produce a prioritized study plan for the remaining prep time. You distinguish genuine knowledge gaps from performance issues (timing, misreading) rather than assuming every miss means "doesn't know the material."

Certification exam: {{EXAM}}
Missed questions (topic/sub-topic tagged, plus any notes on why you think you missed each — guessed, ran out of time, misread the question, confidently wrong): {{MISSED_QUESTIONS}}
Time remaining before the exam: {{TIME_REMAINING}}

Instructions:
1. Group the missed questions by sub-topic first, not by the order they appeared — look for a sub-topic that accounts for a disproportionate share of misses, since a concentrated cluster is a stronger, more actionable signal than isolated misses spread across unrelated topics.
2. For each missed question, classify the likely cause using the notes given (or infer from the pattern if no note is given): genuine knowledge gap (didn't know the concept), timing pressure (ran out of time, had to guess), misreading (knew the concept but answered based on a misread question or a trick in the wording), or confidently-wrong (answered with certainty but was incorrect — often the most concerning category, since it suggests a misconception rather than a gap).
3. Flag confidently-wrong answers as higher priority than genuine gaps where the test-taker knew they were unsure — an unrecognized misconception is more likely to recur across multiple questions than a known gap the person can at least flag for themselves during the real exam.
4. If several misses across different sub-topics share a "ran out of time" or "misread" cause, treat this as a pacing/test-taking-strategy issue distinct from content gaps — recommend timed practice and question-reading strategy rather than more content review, since more studying won't fix a pacing problem.
5. Rank the identified content gaps by exam weight if {{EXAM}}'s topic weighting is known or can be reasonably inferred (e.g. a certification's published exam blueprint) — a small gap in a heavily-weighted domain matters more than a larger gap in a lightly-weighted one.
6. Given {{TIME_REMAINING}}, produce a prioritized plan: which gaps to address first, and whether the remaining time realistically allows addressing all identified gaps or requires accepting some risk on lower-priority ones.

Output format: Markdown with sections: Sub-Topic Clusters, Cause Classification (table: question/topic, likely cause), Priority Ranking (with exam-weight reasoning where available), and a Study Plan for {{TIME_REMAINING}}.
```

## Variables
- `{{EXAM}}` — the specific certification exam, including its topic domains/weighting if known. Required.
- `{{MISSED_QUESTIONS}}` — the missed questions, tagged by topic/sub-topic, ideally with a note on why each was likely missed. Required — without cause notes, classification in step 2 relies more heavily on inference from the pattern alone.
- `{{TIME_REMAINING}}` — how much prep time is left before the actual exam. Required — determines whether the plan can address everything or must prioritize hard.

## Example
**Input:** `{{EXAM}}` = "AWS Solutions Architect Associate" `{{MISSED_QUESTIONS}}` = "Q1 (VPC peering) — guessed, ran out of time. Q2 (IAM policy evaluation logic) — confidently wrong. Q3 (IAM role trust policies) — confidently wrong. Q4 (S3 storage class selection) — genuinely didn't know." `{{TIME_REMAINING}}` = "5 days"

**Output (excerpt):**
```
### Sub-Topic Clusters
IAM appears twice (Q2, Q3) and both are confidently-wrong — this is a stronger signal than the isolated S3 and VPC misses, suggesting a specific IAM misconception rather than two unrelated gaps.

### Cause Classification
| Question/Topic | Likely Cause |
|---|---|
| Q1 — VPC peering | Timing pressure (ran out of time, guessed) |
| Q2 — IAM policy evaluation | Confidently wrong |
| Q3 — IAM trust policies | Confidently wrong |
| Q4 — S3 storage classes | Genuine knowledge gap |

### Priority Ranking
1. (Highest) IAM policy evaluation logic and trust policies — the confidently-wrong pattern across two related sub-topics suggests a core misconception about how IAM evaluates permissions, which likely affects more exam questions than just these two, and IAM is typically heavily weighted on this exam.
2. S3 storage class selection — genuine, isolated gap, moderate exam weight.
3. VPC peering — the "ran out of time" cause suggests this may not be a content gap at all; recommend revisiting this specific question type after the IAM review to see if the answer is actually known once time pressure is removed.

### Study Plan for 5 Days
Days 1-2: Deep-dive IAM policy evaluation (explicit deny vs. allow precedence, resource-based vs. identity-based policy interaction) — this is the highest-leverage gap given the confidently-wrong pattern. Day 3: S3 storage classes. Day 4: timed practice questions specifically on VPC peering to check whether Q1 was really a knowledge gap or purely a pacing issue. Day 5: full timed practice exam to confirm the IAM misconception is resolved and check overall pacing.
```

## Tips & Variations
- Pair with `spaced-repetition-study-plan-builder` (education-and-learning, already shipped) once this diagnostic identifies which specific topics need review — that prompt schedules the review itself; this one determines what belongs on the schedule and in what priority order.
- This prompt's classification accuracy depends heavily on honest self-reported notes in {{MISSED_QUESTIONS}} — if you're not sure why you missed a question, say so explicitly rather than guessing a cause, since a wrong classification (e.g. calling a real gap "just ran out of time") leads the study plan to under-prioritize a topic that actually needs work.
- If {{TIME_REMAINING}} is very short (a day or two) and multiple high-priority gaps are identified, the plan may need to explicitly say which gaps are being deprioritized and accepted as exam risk — that's a more honest and useful output than a plan that pretends everything can be covered.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

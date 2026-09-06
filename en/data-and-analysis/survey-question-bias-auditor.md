---
id: survey-question-bias-auditor
title: Survey Question Bias Auditor
category: data-and-analysis
tags: [data-analysis, statistics]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Reviews a drafted set of survey questions before fielding for leading phrasing, double-barreled questions, unbalanced or non-exhaustive response scales, and ordering effects that would bias the results — a pre-fielding wording check, distinct from analyzing results a survey has already collected.

## When to use it
- Before sending out a customer satisfaction, employee engagement, or research survey, to catch wording issues that would skew responses before they're locked in.
- Reviewing a survey someone else drafted (a stakeholder, an external vendor) before approving it for distribution.
- After a survey produced surprising or suspiciously one-sided results, to check whether question wording — not the underlying reality — plausibly explains the skew.

## The Prompt

```
You review a set of draft survey questions for wording issues that would bias responses, before the survey is fielded.

The survey's questions, in the order they'd be shown, including response options for closed questions: {{QUESTIONS}}
What the survey is trying to measure: {{PURPOSE}}
Who will take it (approximate audience and context, e.g. "existing customers via email, 5 minutes expected"): {{AUDIENCE}}

For each question in {{QUESTIONS}}, check for:
1. Leading or loaded phrasing — wording that signals a preferred answer (e.g. "How much did you enjoy our excellent new feature?") rather than neutral phrasing.
2. Double-barreled questions — asking about two things in one question (e.g. "Was the product easy to use and worth the price?") where a respondent might feel differently about each half but can only give one answer.
3. Response-scale problems: an unbalanced scale (more positive options than negative, or vice versa), a missing "not applicable"/"no opinion" option where one is clearly needed, or a scale that doesn't actually cover the plausible range of real answers.
4. Ordering and priming effects — whether an earlier question could prime respondents' answer to a later one (e.g. an open-ended complaint question right before a satisfaction rating), or whether question order itself could introduce fatigue-driven straight-lining by the end.
5. Ambiguous terms — words that different respondents would reasonably interpret differently (e.g. "recently," "often," "the team") without the question defining which meaning is intended.

For each issue found, quote the specific problem phrase or scale, name which of the five categories it falls under, and propose a concrete rewritten version — not just a description of what's wrong.

If a question has no issues, say so explicitly rather than omitting it, so the review's coverage is clear.

Output format: Markdown, one subsection per question that has at least one issue (skip clean questions in the detailed list, but confirm their count at the end), each subsection titled with the question text, followed by: Issue Type, Problem, Rewrite. End with a one-line summary: X of Y questions need revision.
```

## Variables
- `{{QUESTIONS}}` — the full draft question set, in display order, with response options included for closed questions. Required.
- `{{PURPOSE}}` — what the survey is meant to measure. Required — some wording issues (e.g. an ambiguous term) are only a problem relative to what's actually being measured.
- `{{AUDIENCE}}` — who takes the survey and in what context. Optional but improves the ordering/fatigue analysis.

## Example
**Input:** `{{QUESTIONS}}` = "Q1: How satisfied are you with our fast, reliable support team? (Very satisfied / Satisfied / Neutral) Q2: Was the onboarding process easy and quick? (Yes/No)" `{{PURPOSE}}` = "Measure genuine satisfaction with support and onboarding to identify improvement areas." `{{AUDIENCE}}` = "Customers 30 days after signup, via email."

**Output (excerpt):**
```
### Q1: "How satisfied are you with our fast, reliable support team?"
- **Issue Type:** Leading/loaded phrasing + unbalanced scale.
- **Problem:** "fast, reliable" pre-frames support positively before asking for an opinion. The scale also only offers positive-to-neutral options with no dissatisfied options, making genuine dissatisfaction unrepresentable.
- **Rewrite:** "How satisfied are you with our support team?" (Very dissatisfied / Dissatisfied / Neutral / Satisfied / Very satisfied).

### Q2: "Was the onboarding process easy and quick?"
- **Issue Type:** Double-barreled question.
- **Problem:** Onboarding could be easy but slow, or quick but confusing — a respondent experiencing either can only answer "No" for a mixed result, collapsing two distinct signals into one.
- **Rewrite:** Split into two questions: "How easy was the onboarding process?" and "How would you rate the length of the onboarding process?" — each with its own appropriate scale.

### Summary
2 of 2 questions need revision.
```

## Tips & Variations
- Run this before every fielding, not just for new surveys — a recurring survey (quarterly NPS, annual engagement) can accumulate wording drift over successive edits by different people, and this prompt is cheap to re-run each cycle.
- If {{PURPOSE}} includes tracking change over time (a repeated survey), flag any proposed rewrite that would change a question's meaning from prior waves — fixing a biased question is good, but doing it silently breaks trend comparability; note in the output which fixes are wave-breaking.
- This prompt only reviews wording, not sampling method or distribution channel — a perfectly worded survey sent to a non-representative list still produces biased results, which is a separate methodology concern outside this prompt's scope.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

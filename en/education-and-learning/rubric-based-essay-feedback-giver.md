---
id: rubric-based-essay-feedback-giver
title: Rubric-Based Essay Feedback Giver
category: education-and-learning
tags: [feedback, assessment, education]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Gives essay feedback scored against a specific, stated rubric — not a generic "this is well-written, consider tightening the intro" pass — so the feedback traces directly to the criteria the student is actually being graded on, and a student can see exactly which rubric dimension each comment addresses.

## When to use it
- You're an instructor with a class-set of essays and a rubric, and want a consistent first pass of rubric-anchored feedback before your own review, especially useful for catching patterns across many submissions.
- You're a student who wants to self-check a draft against the actual grading rubric before submitting, rather than guessing what "good writing" means for this specific assignment.
- You're grading and want to make sure your own feedback stays anchored to the rubric rather than drifting into unrelated stylistic preferences that aren't part of what's being assessed.

## The Prompt

```
You give essay feedback scored against a specific rubric. Every piece of feedback must trace to a named rubric criterion — you do not give general writing advice disconnected from what this rubric actually assesses.

Rubric (criteria and their descriptions/levels): {{RUBRIC}}
Essay text: {{ESSAY}}
Assignment prompt/context (what the essay was supposed to address): {{ASSIGNMENT_PROMPT}}

Instructions:
1. Score the essay against each criterion in {{RUBRIC}} individually, using the rubric's own level descriptions rather than inventing your own scoring language — quote or closely paraphrase the rubric's own words for what the achieved level looks like.
2. For each criterion, give at least one specific piece of textual evidence from {{ESSAY}} (a quoted phrase or a description of a specific passage) supporting the score — not "the thesis is somewhat unclear" alone, but which sentence and why it falls short of the rubric's higher-level description.
3. For each criterion scoring below the top level, give one concrete, actionable suggestion for what would move it up — specific enough that the student knows what to actually change, not just what's wrong.
4. Check whether {{ESSAY}} actually addresses {{ASSIGNMENT_PROMPT}} at all before scoring content-related criteria — an essay that's well-written but off-topic should be flagged clearly on that basis, since that's a different problem than a well-targeted essay with craft issues.
5. Do not give feedback on aspects the rubric doesn't cover, even if you notice them — if {{RUBRIC}} doesn't include a grammar/mechanics criterion, don't mark up minor grammar issues as if they were part of the assessed criteria; note them separately as an aside only if they're severe enough to impede understanding.
6. End with a total/overall score if {{RUBRIC}} specifies how criteria combine into one, and a brief summary of the single highest-leverage change the student could make to improve the most.

Output format: Markdown, one section per rubric criterion (score, evidence, suggestion), followed by an overall score/summary section.
```

## Variables
- `{{RUBRIC}}` — the specific rubric criteria and their level descriptions. Required — feedback quality depends entirely on having the actual rubric, not a generic one.
- `{{ESSAY}}` — the essay text to assess. Required.
- `{{ASSIGNMENT_PROMPT}}` — what the essay was supposed to address, so on-topic-ness can be checked. Required.

## Example
**Input:** `{{RUBRIC}}` = "Thesis Clarity: 4=clear, arguable, specific claim stated early; 2=present but vague or buried; 0=no identifiable thesis." (abbreviated to one criterion for this example) `{{ESSAY}}` = "...In this essay I will discuss some of the effects of social media on teenagers, which are complicated and depend on many factors..." `{{ASSIGNMENT_PROMPT}}` = "Argue a specific, defensible position on social media's effect on teen mental health."

**Output (excerpt):**
```
### Thesis Clarity: 2/4
Evidence: "I will discuss some of the effects of social media on teenagers, which are complicated and depend on many factors" states a topic, not an arguable claim — it doesn't take a position that could be disagreed with, which the rubric's level-4 description requires ("clear, arguable, specific claim").
Suggestion: Replace this with a sentence that stakes out an actual position — e.g. "Social media's effect on teen mental health is primarily negative because of X and Y" — something a reader could push back on, not just a preview of topics to be discussed.

### Overall
This essay addresses the assigned topic (social media and teen mental health) but currently reads as a survey of the topic rather than an argument, which caps several rubric criteria below the top level. Highest-leverage change: rewrite the thesis as a specific, defensible claim — this affects not just the Thesis Clarity score but likely the essay's overall argumentative structure, since the body paragraphs currently have no clear claim to support.
```

## Tips & Variations
- Pair with `review-feedback-interpreter-for-juniors` (coding, already shipped) if a student wants help understanding the underlying principle behind a piece of feedback, not just what to fix — that prompt is written for code review comments but the same "explain the why, not just the what" reframing applies to essay feedback.
- For a rubric with holistic (not analytic) scoring — a single overall level rather than per-criterion scores — restructure the output to a single score with evidence spanning multiple rubric dimensions at once, rather than forcing an analytic breakdown the rubric doesn't actually use.
- This prompt scores against the rubric as given; if the rubric itself has gaps (e.g. no criterion for factual accuracy in a research essay), that's outside its scope — flag it as a separate note if it seems likely to matter for this specific essay, but don't invent a criterion to score against.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

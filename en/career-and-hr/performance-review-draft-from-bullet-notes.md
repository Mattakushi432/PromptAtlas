---
id: performance-review-draft-from-bullet-notes
title: Performance Review Draft from Bullet Notes
category: career-and-hr
tags: [performance-review, management, drafting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Turns a manager's rough bullet-point notes about a direct report into a structured, balanced performance review draft — a drafting tool for a new or time-pressed manager, distinct from `difficult-feedback-conversation-scripter` (career-and-hr, still in backlog), which scripts a live conversation about a specific hard message rather than drafting the full written review document.

## When to use it
- Review season is here and you have scattered notes (Slack messages to yourself, a running doc, half-formed thoughts) about a direct report's performance that need to become a coherent written review.
- You're a first-time manager and unsure how to structure a review that's specific and balanced rather than either all-praise or all-critique.
- You want to check your own notes for balance (are you only remembering recent events, only remembering problems, etc.) before finalizing a review.

## The Prompt

```
You draft a performance review from a manager's rough notes about a direct report. You organize and write from what the manager actually observed — you do not invent examples, strengths, or areas for improvement not grounded in the notes.

Manager's notes: {{NOTES}}
Employee's role/level: {{ROLE}}
Review period: {{PERIOD}}
Company review format (if any): {{FORMAT}}

Instructions:
1. Organize the notes into: Strengths (specific, with examples pulled from the notes — not generic praise like "great team player" without a grounding example), Areas for growth (specific and actionable, not vague like "needs to improve communication" without saying what that would look like), and (if the notes support it) a forward-looking development suggestion.
2. Check the notes for recency bias before drafting: if most of the specific examples cluster in the last few weeks of {{PERIOD}} and the notes mention little from earlier, flag this explicitly rather than silently drafting a review that overweights recent events.
3. Check the notes for a strengths/growth-areas imbalance: if the notes are almost entirely one or the other, flag that too — either the notes need supplementing before drafting, or the employee's actual performance genuinely skews that way and the review should say so honestly rather than artificially balancing it.
4. Where a note is vague (e.g. "communication issues" with no specific instance), do not invent a specific example to fill the gap — write it as a general observation and flag `[NEEDS EXAMPLE: ask yourself for a specific instance before finalizing]`.
5. Use concrete, behavioral language ("in the Q3 migration project, consistently flagged edge cases before they became bugs") over trait-based labels ("detail-oriented") where the notes support specifics — labels without examples don't help the employee understand what to keep doing.
6. If {{FORMAT}} specifies a company template/rating scale, structure the draft to match it; otherwise use a standard Strengths / Areas for Growth / Summary structure.

Output format: Markdown matching {{FORMAT}} if given, otherwise `## Strengths`, `## Areas for Growth`, `## Summary`, with any `[NEEDS EXAMPLE: ...]` flags left inline and a brief note at the top on any recency/imbalance issue found in the source notes.
```

## Variables
- `{{NOTES}}` — the manager's raw notes, however unstructured. Required.
- `{{ROLE}}` — the employee's role and level, for calibrating what's expected at that level. Required.
- `{{PERIOD}}` — the review period (e.g. "H2 2026"). Required — used for the recency-bias check.
- `{{FORMAT}}` — the company's review template/rating scale, if one exists. Optional — omit for a general structure.

## Example
**Input:** `{{NOTES}}` = "Really strong on the Q3 migration — caught issues early, good communication with the infra team. Missed the deadline on the smaller cleanup task in August though, no real explanation given. Junior dev, first review cycle." `{{ROLE}}` = "Junior Software Engineer" · `{{PERIOD}}` = "H2 2026"

**Output (excerpt):**
```
## Strengths
- Strong technical execution on the Q3 migration project: proactively identified issues before they became bugs and communicated effectively with the infrastructure team throughout.

## Areas for Growth
- Missed the August cleanup task deadline without a clear explanation provided beforehand. [NEEDS EXAMPLE: was there a specific reason — scope creep, competing priorities, unclear requirements? Worth clarifying with the employee directly rather than assuming.]

## Summary
Note: these notes lean heavily toward the Q3 migration (a larger, more visible project) with only one smaller data point from August — worth checking whether there's more to say about day-to-day work across the full period before finalizing, to avoid over-weighting one standout project.
```

## Tips & Variations
- Feed the `[NEEDS EXAMPLE: ...]` flags back into your own notes as things to recall or ask a peer manager about before the review is finalized — this prompt is meant to surface gaps, not silently paper over them.
- For a self-review draft (employee writing about themselves) rather than a manager's review, the same structure applies, but frame `{{NOTES}}` as the employee's own accomplishments list.
- If the review needs to go into a difficult conversation (a significant area for growth that the employee may be surprised by), pair this with a conversation-planning pass — drafting the written review and planning how to deliver hard feedback verbally are different skills.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

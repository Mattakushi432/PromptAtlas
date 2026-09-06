---
id: performance-calibration-prep-brief
title: Performance Calibration Prep Brief
category: career-and-hr
tags: [performance-review, hr]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Prepares a cross-team ratings-consistency brief for a performance calibration meeting — flags where similar performance levels received different ratings across managers and where a rating's written justification doesn't actually support the rating given — the HR-facing, cross-team consistency layer that runs after individual reviews are drafted, distinct from `performance-review-draft-from-bullet-notes` (career-and-hr, already shipped), which drafts one manager's single review from their own notes rather than checking consistency across many managers' completed drafts.

## When to use it
- Calibration season has arrived and you have a batch of managers' draft ratings and justifications to review before the calibration meeting, and want a structured brief flagging where inconsistency is likely to come up.
- You suspect rating inflation or a harsh outlier from a specific manager relative to peers rating similar performance levels, and want it surfaced with evidence before the meeting rather than discovered live in the room.
- You're facilitating calibration and want a prep document that gives the room specific, evidence-backed discussion points rather than starting from a raw spreadsheet of ratings with no analysis.

## The Prompt

```
You prepare a cross-team ratings-consistency brief from multiple managers' draft performance ratings and justifications, ahead of a calibration meeting. You flag genuine inconsistency with specific evidence — you do not average or smooth over rating differences, and you do not assume a difference is wrong without checking whether the underlying performance actually differs.

Managers' draft ratings and justifications (one entry per employee, with manager name and rating): {{DRAFT_RATINGS}}
Rating scale/levels in use: {{RATING_SCALE}}
Role/level groupings to compare within (which employees are actually comparable to each other): {{COMPARISON_GROUPS}}

Instructions:
1. Within each group in {{COMPARISON_GROUPS}}, compare the written justifications (not just the numeric/label ratings) for employees who received different ratings — check whether the justification text actually describes meaningfully different performance, or whether two employees with similar-sounding justifications received different ratings, which is the specific pattern calibration exists to catch.
2. Flag any justification that doesn't actually support the rating given — a justification describing solid, met-expectations performance attached to a below-expectations rating (or vice versa) is a mismatch worth flagging regardless of cross-manager comparison, since it suggests the rating itself may be miscalibrated even in isolation.
3. Identify any manager whose ratings, across their reports, skew consistently higher or lower than {{RATING_SCALE}}'s described norms or than peer managers' patterns — a single lenient or harsh manager is a common, specific calibration-meeting topic, and naming the pattern (not the manager as a person, the rating pattern) helps the room address it directly.
4. For each flagged inconsistency, state it as a specific, discussable question for the calibration meeting ("Employee A and Employee B have similarly-worded justifications around meeting core expectations with one standout project each, but received different ratings — worth discussing whether that's warranted") rather than asserting which employee's rating is wrong — calibration is a discussion process, and this brief should set up productive discussion, not pre-judge the outcome.
5. Do not flag every rating difference as suspicious — legitimately different performance should produce different ratings, and manufacturing a flag for every variance defeats the purpose of a targeted prep brief; only surface differences where the justification text doesn't clearly explain the gap.
6. Organize the output for meeting usability — a facilitator working through this live needs specific, quickly-scannable discussion points, not a dense analytical essay.

Output format: Markdown, organized by {{COMPARISON_GROUPS}}. For each group: a brief overview of the ratings distribution, then specific flagged items (the employees involved, the justification excerpts, and the discussion question). End with a "Manager Pattern Notes" section for any individual manager's rating pattern that stands out.
```

## Variables
- `{{DRAFT_RATINGS}}` — each manager's draft rating and written justification per employee. Required.
- `{{RATING_SCALE}}` — the rating scale/labels in use, so justification-to-rating fit can be assessed against what each level is actually supposed to mean. Required.
- `{{COMPARISON_GROUPS}}` — which employees are actually comparable to each other (same role/level/function), since calibration only makes sense within genuinely comparable groups, not across unrelated roles. Required.

## Example
**Input:** `{{DRAFT_RATINGS}}` = "Manager X on Employee A: 'Meets Expectations' — 'Consistently delivered on sprint commitments, led one successful cross-team initiative.' Manager Y on Employee B: 'Exceeds Expectations' — 'Consistently delivered on sprint commitments, contributed to a cross-team initiative.'" `{{RATING_SCALE}}` = "Below / Meets / Exceeds Expectations" `{{COMPARISON_GROUPS}}` = "Both mid-level backend engineers on different teams, directly comparable"

**Output (excerpt):**
```
### Mid-Level Backend Engineers (Employee A, Employee B)
Ratings distribution: A rated "Meets," B rated "Exceeds."

**Flag:** A and B's justifications describe very similar performance — both mention consistent sprint delivery and cross-team initiative involvement, with A described as having "led" the initiative (arguably a stronger signal) while B "contributed" to one, yet B received the higher rating.
Discussion question: Given A's justification describes leading (not just contributing to) a cross-team initiative, is there additional context justifying B's higher rating not captured in the written justification, or does this reflect a genuine calibration gap between Manager X and Manager Y worth aligning on?

### Manager Pattern Notes
No clear individual-manager skew identified from this sample alone — with only one comparison pair shown here, this would need more data points per manager before flagging a broader pattern; note this limitation rather than asserting a trend from a single instance.
```

## Tips & Variations
- Pair with `performance-review-draft-from-bullet-notes` (career-and-hr, already shipped) upstream of this prompt — that prompt helps individual managers draft well-evidenced reviews in the first place, which directly improves the quality of what this calibration brief has to work with; a vague source review makes inconsistency-flagging much harder.
- This brief surfaces discussion points, not verdicts — resist the temptation to let it (or the facilitator alone) decide who's "right"; calibration is meant to be a conversation between managers with direct knowledge of the work, and the brief's job is to make that conversation efficient, not to replace it.
- For a very large calibration pool, run this prompt per {{COMPARISON_GROUPS}} segment rather than all at once — a single pass across hundreds of employees produces a brief too long to be usable live in a meeting.

## Changelog
- 1.0.0 (2026-09-01): Initial version.

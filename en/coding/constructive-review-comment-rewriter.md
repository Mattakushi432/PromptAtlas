---
id: constructive-review-comment-rewriter
title: Constructive Review Comment Rewriter
category: coding
tags: [code-review, communication, feedback]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Rewrites blunt, vague, or harsh code review comments into specific, actionable, respectful ones — for a reviewer who knows something's wrong but whose first draft would land badly, or a team standardizing on kinder review culture.

## When to use it
- Before posting a review comment you're not proud of but the point still needs to be made.
- Coaching a junior reviewer whose feedback is technically right but comes across as dismissive.
- Cleaning up a batch of terse comments ("this is wrong", "bad name") into ones a contributor can actually act on.

## The Prompt

```
You rewrite code review comments to be constructive: specific, objective, and actionable, while keeping the original technical point intact. Do not soften the comment into vagueness — a constructive comment is still direct about what needs to change.

Original comment(s):
{{ORIGINAL_COMMENTS}}

Code context (optional, the line(s) the comment refers to):
{{CODE_CONTEXT}}

Desired tone (optional, default: collegial and direct): {{TONE}}

Instructions:
1. For each original comment, identify the underlying technical concern — even if the original wording is just an insult or a one-word dismissal, infer the real issue from context if possible.
2. Rewrite it using this shape: observation (what you noticed, framed at the code, not the person) + why it matters (concrete consequence) + a suggested direction (not necessarily the only fix, but a starting point).
3. Prefix each rewritten comment with a label reflecting its actual weight: `nit:` for minor/optional, `question:` for something you're unsure about rather than certain is wrong, `suggestion:` for a recommended change, `blocking:` for something that must be fixed before merge.
4. If the original comment is too vague to reconstruct a technical point from (e.g., just "no"), say so and ask what specifically was meant, rather than inventing a plausible-sounding but fabricated concern.
5. Never add sarcasm, hedging that erases the point ("maybe consider possibly..."), or unrelated praise used as a cushion.

Output format: one rewritten comment per original, in the same order, as a numbered list.
```

## Variables
- `{{ORIGINAL_COMMENTS}}` — the blunt comment(s) to rewrite, one per line. Required.
- `{{CODE_CONTEXT}}` — the code the comment is about. Optional, but improves accuracy when the original comment is terse.
- `{{TONE}}` — e.g. "direct, for a senior peer" or "extra gentle, for a first-time contributor". Optional.

## Example
**Input:** `{{ORIGINAL_COMMENTS}}` = "this function is a mess", `{{CODE_CONTEXT}}` = a 90-line function mixing input parsing, business logic, and DB writes.

**Output (excerpt):**
```
1. suggestion: This function currently handles parsing, business logic, and the database write in one block, which makes it hard to test the business logic in isolation. Consider splitting it into `parseInput()`, `calculateResult()`, and `saveResult()` — that would let you unit-test the calculation without a database.
```

## Tips & Variations
- For anonymous/async review tools, ask it to keep all comments in second person about the code ("this function...") never the author ("you wrote...").
- For a team adopting Conventional Comments, explicitly request the `nit:`/`question:`/`suggestion:`/`blocking:` labels every time, as shown above.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

---
id: review-feedback-interpreter-for-juniors
title: Review Feedback Interpreter for Juniors
category: coding
tags: [code-review, mentorship, learning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Explains the underlying reasoning behind code review comments a junior developer received on their own PR, so they learn the principle instead of just complying. Distinct from `constructive-review-comment-rewriter`, which helps the reviewer write better comments — this is for the person receiving them, trying to actually understand why.

## When to use it
- You got review comments that make sense as instructions but you don't understand why the reviewer wants the change.
- You want to internalize a pattern instead of just applying the fix and moving on, so it doesn't come up again next PR.
- Preparing to discuss review feedback with a mentor and want to arrive with real questions, not just "okay I'll change it."

## The Prompt

```
You are helping a junior developer understand the reasoning behind code review comments they received — not rewriting the comments, and not just restating what they already say.

Review comments received (paste as-is): {{REVIEW_COMMENTS}}

Code context (enough surrounding code to understand what the comments refer to): {{CODE_CONTEXT}}

For each comment:
1. Explain the underlying principle or risk it's protecting against — go one level deeper than the comment itself. If the comment says "extract this into a function," explain why: readability, testability, avoiding duplication, or something else specific to this code — not a generic definition of "why functions are good."
2. Give a concrete example of the failure mode this principle prevents — a specific way the code could go wrong or become hard to maintain if the comment is ignored, grounded in the actual code shown, not a textbook example.
3. Classify the comment as either a near-universal rule (something almost any experienced engineer would flag, regardless of team) or a team/reviewer-specific stylistic preference — say which, and note that the second kind is worth following for consistency but isn't a deep principle to internalize the same way.

If a comment is genuinely just a personal preference or minor bikeshedding with no real underlying risk (e.g., a naming preference with no clarity difference), say that honestly rather than manufacturing a deep-sounding justification for something that doesn't have one — junior developers calibrate faster when they can tell real principles from house style.
```

## Variables
- `{{REVIEW_COMMENTS}}` — the review comments received, as written. Required.
- `{{CODE_CONTEXT}}` — enough of the surrounding code for the comments to make sense out of context. Required.

## Example
**Input:** `{{REVIEW_COMMENTS}}` = "This should use a Map instead of an object for the cache — objects have prototype pollution issues here.", `{{CODE_CONTEXT}}` = a function using a plain `{}` object as an in-memory cache keyed by user-supplied string IDs.

**Output (excerpt):**
```
Underlying principle: a plain JS object inherits from Object.prototype, so keys like "constructor", "__proto__", or "toString" behave specially instead of as normal cache entries — a Map has no such inherited keys, so every key behaves uniformly.

Failure mode this prevents: since the cache key here comes from user-supplied IDs, a user (accidentally or deliberately) sending an ID of "__proto__" could interact with the object's prototype chain instead of being stored as a normal entry — in some code patterns this can even be leveraged for prototype pollution attacks. With a Map, that same key is just an ordinary key with no special behavior.

Classification: near-universal rule, not a stylistic preference. Using Map for a cache keyed by untrusted/dynamic string input is standard practice specifically because of this exact class of bug — this isn't a house-style choice.
```

## Tips & Variations
- If several comments turn out to reflect the same underlying principle, ask it to note that explicitly at the end — recognizing one recurring principle across five comments is more useful for learning than five separate explanations.
- For a comment you suspect is genuinely just house style, ask it directly rather than assuming — the honesty check in this prompt is calibrated to actually say so rather than inflate every comment's importance.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

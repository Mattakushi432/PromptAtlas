---
id: code-comment-improver
title: Code Comment Improver
category: coding
tags: [documentation, code-comments, readability]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Turns sparse, missing, or unhelpful code comments into genuinely useful ones — explaining WHY, not restating WHAT the code already says — for a specific file. Narrow scope on comments only, distinct from `naming-convention-auditor` (names) and general code review prompts.

## When to use it
- Inheriting a file with confusing logic and no comments explaining the non-obvious parts.
- Reviewing a PR where comments either don't exist or just restate the code line by line ("// increment i" above `i++`).
- Preparing a file for a new contributor and wanting the comments to carry more of the explanation burden.

## The Prompt

```
You improve code comments — adding genuinely useful ones where missing, fixing ones that just restate the code, and removing ones that add no value. You do not touch the code's logic.

Code: {{CODE}}
Language: {{LANGUAGE}}

Instructions:
1. Identify places that need a comment because the code's WHY isn't obvious from reading it: a non-obvious business rule, a workaround for a specific bug/limitation, an algorithm choice that isn't self-evident, a subtle invariant a future editor could easily break, a performance-motivated pattern that looks unusual (unrolled loop, unconventional data structure) that would otherwise look like a mistake.
2. Do NOT add a comment that just restates what the code already says in different words (`// loop through users` above `for user in users:`) — if removing the comment wouldn't confuse a reader, the comment doesn't belong.
3. Flag and remove/rewrite existing comments that are actively wrong or stale (describing behavior the code no longer has) — a wrong comment is worse than no comment, since it actively misleads.
4. For public APIs (exported functions/classes, especially in a library), write a doc comment following the language's standard convention (JSDoc, docstring, Javadoc, etc.) covering parameters, return value, and any thrown errors/exceptions — but keep it proportional; a simple getter doesn't need a paragraph.
5. For any comment marking a workaround (a fix for a specific bug in a dependency, a browser/platform quirk), include enough detail that a future reader could determine when it's safe to remove (a version number, a linked issue, a condition to check).
6. Preserve the code's actual logic exactly — this is a comment-only pass. If you notice a bug while reading, don't fix it silently; note it separately outside the comment-improvement output.
7. Keep comments concise — a comment that requires more reading time than the code it describes has usually gone too far; one to two sentences is typical, reserve longer explanations for genuinely complex invariants.

Output: the code with improved comments, followed by a short list of any comments removed and why, and (separately) any bugs noticed but not fixed.
```

## Variables
- `{{CODE}}` — the file/code to improve comments for. Required.
- `{{LANGUAGE}}` — the programming language, since doc comment conventions differ (JSDoc vs. docstrings vs. Javadoc). Required.

## Example
**Input:** `{{LANGUAGE}}` = "Python", `{{CODE}}` = a function with `retries = 3  # set retries to 3` above a retry loop, and no comment on a line that skips retrying for a specific error code.

**Output (excerpt):**
```python
retries = 3  # empirically chosen: the upstream API's rate-limit window resets within ~2 retries in practice; higher adds latency with no measured benefit

if error.code == 429:
    break  # don't retry rate-limit errors — retrying immediately worsens the rate-limit backoff on the upstream side (see INCIDENT-204)
```
*(followed by: "Removed the original `# set retries to 3` comment — it only restated the assignment with no added information.")*

## Tips & Variations
- For a codebase adopting a stricter documentation standard (e.g., requiring doc comments on all exported functions for a generated API reference), explicitly ask it to flag any public function still missing a doc comment as a distinct follow-up item.
- If reviewing a very large file, run this per logical section rather than the whole file at once, to keep the comment-quality judgment calibrated to local context rather than diluted across unrelated code.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

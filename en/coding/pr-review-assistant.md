---
id: pr-review-assistant
title: PR Review Assistant
category: coding
tags: [pull-request, code-review, best-practices]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Checks a pull request's diff against its own stated intent and a team's process conventions — scope, tests, docs, naming — before a human reviewer looks at it. It is a process gate, not a bug hunt: pair it with a dedicated security or deep-correctness review for that.

## When to use it
- Before requesting human review, to catch process gaps (missing tests/docs, unclear scope) yourself first.
- Reviewing a teammate's PR and want a fast structural pass before reading every line.
- Enforcing a team's PR checklist consistently across contributors of different experience levels.

## The Prompt

```
You are a pull request reviewer performing a process and scope check — not a deep correctness, security, or performance audit.

PR title and description:
{{PR_TITLE_AND_DESCRIPTION}}

Linked ticket/requirements (optional):
{{LINKED_TICKET}}

Diff:
{{DIFF}}

Team conventions (optional):
{{TEAM_CONVENTIONS}}

Instructions:
1. From the title, description, and linked ticket, state in one sentence what this PR claims to do.
2. Scope check: flag any hunk in the diff that doesn't serve that stated purpose ("scope creep"), and flag anything the stated purpose implies that the diff doesn't actually do ("incomplete scope").
3. Test check: for every new or changed function/branch of logic, confirm there's a corresponding test change. Flag logic changes with no test coverage change.
4. Documentation check: flag any changed public API, config option, or user-facing behavior with no corresponding doc/README/comment update.
5. Convention check: if {{TEAM_CONVENTIONS}} is provided, flag naming, file placement, or pattern choices in the diff that drift from it.
6. If you notice something that looks like a severe bug or security issue, name it briefly but explicitly say "flagging for a dedicated review — not analyzed in depth here" rather than investigating it yourself.
7. If the diff is empty, whitespace-only, or the description doesn't match any code in the diff, say so directly instead of inventing findings.

Output format: Markdown, grouped under headings Scope / Tests / Documentation / Conventions / Other. Each flagged item: one line, PASS or FLAG, with a one-sentence reason. End with a single-line verdict: "Ready for review" or "Needs changes first" plus why.
```

## Variables
- `{{DIFF}}` — the pull request diff (unified diff format works best). Required.
- `{{PR_TITLE_AND_DESCRIPTION}}` — the PR's own title and description text. Required.
- `{{LINKED_TICKET}}` — the ticket/issue text the PR claims to resolve. Optional but sharpens the scope check.
- `{{TEAM_CONVENTIONS}}` — house rules, e.g. "all new endpoints need an OpenAPI entry; no default exports." Optional.

## Example
**Input:** `{{PR_TITLE_AND_DESCRIPTION}}` = "Add percentage-off discount codes at checkout", `{{DIFF}}` = adds a `applyDiscountCode()` function and wires it into checkout, no test files touched.

**Output (excerpt):**
```
## Tests
- FLAG: `applyDiscountCode()` is new business logic (percentage math, expiry check) with no corresponding test file changes in the diff.

## Scope
- PASS: every changed file relates to the stated discount-code feature.

**Verdict:** Needs changes first — add tests for `applyDiscountCode()` before this is ready for review.
```

## Tips & Variations
- For a CI bot integration, ask for one line per flagged item only, no prose, so it's easy to post as a PR comment.
- If the team has no written conventions doc yet, drop `{{TEAM_CONVENTIONS}}` — the prompt still runs the scope/tests/docs checks on their own.
- Pair this with `code-review-assistant` for line-level correctness, security, and performance depth this prompt intentionally skips.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

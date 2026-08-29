---
id: conventional-commit-writer
title: Conventional Commit Writer
category: coding
tags: [git, commit-messages, conventions]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Writes a Conventional Commits-style message (type(scope): subject, plus body) from a diff — a single commit message, not a full PR description. For the specific, frequent task of writing a good commit message from staged changes.

## When to use it
- Committing a change and wanting a properly-typed, well-scoped commit message without writing it from scratch each time.
- Enforcing Conventional Commits in a repo (for automated changelog/semver tooling) and needing help classifying a change correctly.
- Cleaning up a messy commit message before pushing, to match team commit conventions.

## The Prompt

```
You write a Conventional Commits-format commit message from a diff — a single commit's message, not a PR description or changelog entry.

Diff: {{DIFF}}
Additional context (optional — e.g. a related ticket number, why the change was made if not obvious from the diff): {{CONTEXT}}

Instructions:
1. Determine the correct type: `feat` (new user-facing capability), `fix` (bug fix), `refactor` (no behavior change), `perf` (performance improvement), `test` (test-only changes), `docs` (documentation only), `chore` (tooling/build/dependency changes with no source impact), `style` (formatting only, no logic change). If the diff mixes types (e.g., a fix plus an unrelated refactor), pick the dominant type and note in the body that the commit also includes the secondary change — or flag that it should ideally be split into separate commits.
2. Determine the scope if the codebase's convention uses one (a module/component name in parentheses, e.g. `feat(auth):`) — infer it from the changed file paths if not stated.
3. Write the subject line: imperative mood ("add", not "added"/"adds"), no period at the end, under ~50 characters where possible, specific enough to be useful in a `git log --oneline` skim.
4. Write a body (if the change isn't trivially explained by the subject alone) covering: what changed and why — the "why" matters more than restating the diff, since the diff already shows what changed.
5. If the diff introduces a breaking change, add a `BREAKING CHANGE:` footer describing what breaks and how consumers should adapt — don't bury this in the body where changelog tooling won't find it.
6. If {{CONTEXT}} references a ticket/issue number, include it in the footer per the project's convention (e.g., `Refs: PROJ-123` or `Closes #123`) if the convention is inferable or stated.
7. If the diff is too large/mixed to summarize as one coherent commit, say so explicitly and suggest how it might be split, rather than writing an artificially vague message that covers everything loosely.

Output: the commit message, formatted exactly as it should be written (subject line, blank line, body, blank line, footer if any) — ready to paste into `git commit`.
```

## Variables
- `{{DIFF}}` — the diff to write a commit message for. Required.
- `{{CONTEXT}}` — a ticket reference or non-obvious motivation. Optional.

## Example
**Input:** `{{DIFF}}` = adds null-check and early return in `calculateDiscount()` to fix a crash when `user.membershipTier` is undefined.

**Output (excerpt):**
```
fix(checkout): guard against undefined membershipTier in discount calc

calculateDiscount() crashed when user.membershipTier was undefined
(e.g., for guest checkouts). Add an early return with the default
(no-discount) behavior in that case.
```

## Tips & Variations
- For a squash-merge workflow where the PR title becomes the commit message, ask for a single-line-only output (subject only, no body) matching PR title length constraints.
- If the team uses a stricter Conventional Commits variant with an enforced scope list, pass that list as part of {{CONTEXT}} so the scope is chosen from valid options rather than invented.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

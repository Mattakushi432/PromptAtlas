---
id: pre-merge-risk-assessment
title: Pre-Merge Risk Assessment
category: coding
tags: [code-review, risk, deployment]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Scores a diff's blast radius and merge/deploy risk — not its code quality — for someone deciding when and how carefully to merge, not what to fix. Distinct from a correctness review: the output is a risk level and a deployment recommendation, not a list of bugs.

## When to use it
- Deciding whether a diff is safe to merge right before a weekend or a high-traffic period.
- Triaging a backlog of open PRs to figure out which ones need extra caution (staged rollout, feature flag, off-hours deploy).
- Briefing an on-call engineer on what just shipped and what could go wrong.

## The Prompt

```
You are assessing deployment risk for a diff, not reviewing code quality or hunting bugs. Assume the code is already correct; your job is to judge what happens if it's wrong.

Diff:
{{DIFF}}

System context (optional — what this code is part of, its traffic/criticality): {{SYSTEM_CONTEXT}}

Deploy context (optional — timing, rollback tooling available): {{DEPLOY_CONTEXT}}

Assess across these dimensions:
1. Blast radius — what breaks if this diff has a bug: one function, one feature, one service, or something cross-cutting (auth, billing, data integrity, shared infra)?
2. Reversibility — can this be rolled back cleanly (a revert is safe), or does it involve a migration, data write, or external side effect (email sent, payment charged) that a rollback can't undo?
3. Detectability — if this breaks, would it fail loudly (error, crash, alert) or silently (wrong data, degraded UX no one notices immediately)?
4. Change surface — is this a small, isolated change or does it touch shared/critical-path code many other things depend on?
5. Prior stability — anything in the diff (concurrency, timing, external calls) with patterns known to be flaky or hard to test exhaustively?

For each dimension, give a rating (LOW/MEDIUM/HIGH) and a one-sentence reason grounded in the actual diff content — not generic risk language.

Combine into an overall risk level (LOW/MEDIUM/HIGH/CRITICAL) and a concrete recommendation: safe to merge and deploy normally; merge but deploy behind a flag/staged rollout; merge but avoid deploying before [condition]; or do not merge without [specific mitigation, e.g., a rollback plan or additional monitoring].

If the diff is too small or context-free to assess a dimension, mark it "insufficient context" rather than guessing.
```

## Variables
- `{{DIFF}}` — the diff to assess. Required.
- `{{SYSTEM_CONTEXT}}` — what the changed code is part of and how critical/high-traffic it is. Optional but sharpens blast-radius judgment.
- `{{DEPLOY_CONTEXT}}` — deploy timing, available rollback/flag tooling. Optional.

## Example
**Input:** `{{DIFF}}` = a migration that adds a `NOT NULL` column to a large `orders` table with a default value computed at write time, `{{SYSTEM_CONTEXT}}` = "orders table, ~50M rows, read/written on every checkout".

**Output (excerpt):**
```
1. Blast radius: HIGH — this touches the orders table directly involved in every checkout; a lock or failure here affects all purchases, not one feature.
2. Reversibility: MEDIUM — the column addition itself is revertible, but if it locks the table during the migration, that window isn't undoable after the fact.

**Overall risk: HIGH.** Recommendation: do not merge without a migration plan that avoids a blocking table lock (e.g., add the column nullable first, backfill, then add the constraint) and a rehearsed rollback for the migration step.
```

## Tips & Variations
- For a team without staged rollouts, drop the "behind a flag" recommendation option and ask it to choose between "safe to merge" and "do not merge without X" only.
- Feed it the actual on-call runbook as `{{DEPLOY_CONTEXT}}` so its mitigation suggestions reference real tooling instead of generic advice.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

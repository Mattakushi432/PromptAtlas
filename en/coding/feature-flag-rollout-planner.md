---
id: feature-flag-rollout-planner
title: Feature Flag Rollout Planner
category: coding
tags: [devops, feature-flags, rollout, release]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Designs a staged, flag-based rollout plan — stages, watch metrics, kill-switch conditions, and flag-removal criteria — for a specific risky change. Distinct from a deploy-level rollback plan: this is about progressively exposing a change to real traffic behind a flag, not about undoing a deployment.

## When to use it
- Shipping a change risky enough that "flip the flag to 100% and watch" isn't good enough.
- Writing the rollout section of a launch plan or design doc.
- Deciding what "safe to remove this flag" actually means before the flag becomes permanent tech debt.

## The Prompt

```
You are designing a staged, feature-flag-based rollout plan for a specific change — not a general deployment or rollback plan.

Change being rolled out: {{CHANGE_DESCRIPTION}}

Known risk factors (what could plausibly go wrong): {{RISK_FACTORS}}

Available user segments for staging (optional — e.g., internal users, beta opt-ins, percentage-based random split): {{USER_SEGMENTS}}

Produce:
1. A staged rollout table: each stage (e.g., internal-only → 1% → 10% → 50% → 100%), the specific metric or signal to watch at that stage (tied to the actual risk factors given, not generic "monitor errors"), and a minimum hold time before advancing.
2. Explicit kill-switch trigger conditions — what metric crossing what threshold should trigger a rollback, and whether that should be automatic or requires a human call.
3. Flag-removal criteria — what "fully rolled out and safe to delete this flag" concretely looks like, so it doesn't linger as permanent debt.

If the change has no meaningful way to segment users (e.g., a one-time batch job, a schema migration, an internal cron job), say explicitly that a flag-staged rollout doesn't fit this change, and suggest a different safety mechanism instead of forcing a staged-flag structure onto it.
```

## Variables
- `{{CHANGE_DESCRIPTION}}` — what's being rolled out. Required.
- `{{RISK_FACTORS}}` — the specific ways this change could go wrong. Required — without this, the watch-metrics are generic instead of targeted.
- `{{USER_SEGMENTS}}` — what staging mechanisms are actually available (internal users, beta list, percentage rollout). Optional; without it, a standard percentage-based staging is assumed.

## Example
**Input:** `{{CHANGE_DESCRIPTION}}` = "new checkout payment processor, replacing the current one", `{{RISK_FACTORS}}` = "payment failures, incorrect charge amounts, provider API downtime", `{{USER_SEGMENTS}}` = "internal employees, then percentage-based".

**Output (excerpt):**
```
Stage 1 — internal-only: watch payment success rate and charge-amount reconciliation against the old processor's logs for the same transaction types. Hold: until at least 50 internal transactions processed with zero amount mismatches.
Stage 2 — 1% of real traffic: watch payment success rate delta vs. control (old processor on remaining 99%), provider API error rate. Hold: 48 hours minimum, to catch a full day-of-week traffic cycle.

Kill-switch: automatic rollback if payment success rate on the new processor drops more than 2 percentage points below the control group's rate for any 15-minute window, or if any charge-amount mismatch is detected (zero-tolerance — human review, not just monitoring, for this one).

Flag-removal criteria: 100% traffic on new processor for 2 full weeks with no manual rollback triggered, plus the old processor's code path explicitly deleted (not just flagged off) before closing this out.
```

## Tips & Variations
- For a change with a well-known blast radius (e.g., a UI-only tweak), the kill-switch section can be dropped down to a single simple signal — don't force a heavyweight structure onto a low-risk change.
- Pair with `deployment-rollback-planner` for the underlying deploy-level rollback mechanics this rollout plan assumes exist.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

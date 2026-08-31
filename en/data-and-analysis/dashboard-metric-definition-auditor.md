---
id: dashboard-metric-definition-auditor
title: Dashboard Metric Definition Auditor
category: data-and-analysis
tags: [data-analysis, quality-assurance, consistency]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Audits a set of dashboard or report metric definitions for ambiguity and cross-team inconsistency — the specific failure where "active user" or "conversion rate" quietly means something different on two dashboards, and nobody notices until the numbers don't reconcile in a meeting.

## When to use it
- Two dashboards or reports disagree on a metric that should be the same number, and you need to find exactly where the definitions diverge before debugging the underlying data.
- You're documenting metric definitions for a data dictionary or onboarding doc and want a second pass checking for unstated edge cases before publishing them as the source of truth.
- You're inheriting ownership of a dashboard and want to verify its metric definitions are actually precise enough to be reproducible, not just familiar-sounding.

## The Prompt

```
You audit a set of metric definitions for ambiguity and inconsistency. You are not checking the underlying data or SQL — only whether the definitions themselves are precise enough that two people implementing them independently would produce the same number.

Metric definitions to audit (name + definition as currently documented, from one or more dashboards/teams): {{METRIC_DEFINITIONS}}
Known context on how metrics have been used or discussed inconsistently, if any: {{KNOWN_DISCREPANCIES}}

Instructions:
1. For each metric definition, check for an unstated time window (does "active user" mean active today, in the last 7 days, in the last 30 days? A definition without an explicit window is not implementable identically by two people).
2. Check for unstated inclusion/exclusion criteria: does "user" include internal test accounts, bot/API traffic, deleted or churned accounts? Does "conversion" count only the final step, or any step in a funnel? Flag every criterion that materially changes the count but isn't stated.
3. If {{METRIC_DEFINITIONS}} contains the same metric name defined more than once (across dashboards/teams), do a direct side-by-side comparison and state exactly where the definitions diverge — don't just note that "they might be inconsistent," pinpoint the specific differing clause.
4. Check for definitions that reference another ambiguous or undefined term (e.g. "active" used inside the definition of "engaged user" without "active" itself being pinned down elsewhere) — a chain of underspecified terms compounds ambiguity rather than resolving it.
5. For each ambiguity found, propose a precise, unambiguous restatement — specific enough that it could be turned directly into a query. Don't just flag the problem; also state a concrete fix per finding.
6. If {{KNOWN_DISCREPANCIES}} describes a specific numbers-don't-match situation, prioritize the audit toward whichever ambiguity would actually explain that discrepancy, and state explicitly if none of the definitional issues found would explain the described gap (in which case the cause is more likely in the underlying data/pipeline, not the definition).

Output format: Markdown. One entry per metric: the metric name, each ambiguity found (or "no ambiguity found" if genuinely precise), and the proposed precise restatement. If multiple definitions of the same metric name were compared, add a "Divergence" subsection showing them side by side.
```

## Variables
- `{{METRIC_DEFINITIONS}}` — the metric name(s) and their current documented definitions, from one or more sources. Required.
- `{{KNOWN_DISCREPANCIES}}` — any known case where the same metric produced different numbers in different places, if that's the trigger for this audit. Optional, but sharpens the audit toward the actual problem if provided.

## Example
**Input:** `{{METRIC_DEFINITIONS}}` = "Dashboard A defines 'active user' as: 'a user who logged in.' Dashboard B defines 'active user' as: 'a user with at least one session in the trailing 30 days.'" `{{KNOWN_DISCREPANCIES}}` = "Dashboard A shows 40% more active users than Dashboard B for the same reporting period."

**Output (excerpt):**
```
### Metric: active user

**Dashboard A — "a user who logged in"**
Ambiguities: no time window at all (logged in ever? today? this month?); "logged in" is undefined — does it count a login event, or any authenticated session? No exclusion of test/internal accounts stated.

**Dashboard B — "a user with at least one session in the trailing 30 days"**
Ambiguities: "session" is undefined (a session-start event? any authenticated request?) but otherwise has an explicit time window, which A lacks entirely.

**Divergence**
The most likely explanation for the 40% gap in {{KNOWN_DISCREPANCIES}}: Dashboard A's definition has no time window, so if it's implemented as "ever logged in" (cumulative, all-time), it will always show a larger, ever-growing number than Dashboard B's rolling 30-day window — this alone plausibly explains a large, persistent gap rather than a data-quality bug.

**Proposed restatement (apply to both):** "A user who initiated at least one authenticated session in the trailing 30 days, excluding accounts flagged as internal/test, as of the report's generation timestamp."
```

## Tips & Variations
- Pair with `event-schema-evolution-advisor` (coding, already shipped) if the divergence traces back to an actual tracking/event schema change over time rather than a documentation gap — that prompt is scoped to planning schema changes, useful once this audit identifies the definitions themselves aren't the whole story.
- Run this prompt whenever a new dashboard is proposed that reuses an existing metric name, before it ships — catching a definitional drift before a second dashboard goes live is much cheaper than reconciling two already-published numbers later.
- This prompt audits definitions as documented; if no written definition exists at all for a metric in active use, that absence is itself the top-priority finding — say so rather than trying to reverse-engineer a definition from how the metric happens to currently be implemented.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

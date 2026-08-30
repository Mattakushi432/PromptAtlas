---
id: tech-debt-prioritization-matrix
title: Tech Debt Prioritization Matrix Builder
category: coding
tags: [tech-debt, prioritization, planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Turns a raw list of known tech-debt items into an ROI-ranked prioritization matrix — for an engineering lead building a paydown plan they can actually defend in a planning meeting. Distinct from identifying new debt in code: this works from a list that already exists and needs ranking.

## When to use it
- Building the tech-debt section of a quarterly planning doc.
- A backlog of "we should really fix this someday" items has grown unmanageable and needs triage.
- Defending which debt items deserve engineering time against feature-work pressure.

## The Prompt

```
You are building a defensible tech-debt prioritization plan from a raw list of known items — you're ranking existing items, not searching for new debt.

Debt items (list, each with a short description): {{DEBT_ITEMS}}

Team context (optional — team size, current velocity, upcoming roadmap that might interact with any of these items): {{TEAM_CONTEXT}}

For each item:
1. Estimate fix effort as S / M / L, with a one-line reason.
2. Estimate the ongoing cost of NOT fixing it — state specifically which cost type applies: dev velocity drag (slows every future change in this area), incident risk (could cause an outage/data issue), onboarding friction (confuses new engineers), or scaling ceiling (will become a hard blocker at some growth threshold). Some items may have none of these clearly — say so rather than inventing a cost.
3. Plot into a simple 2x2 prioritization: high-impact/low-effort first, then high-impact/high-effort, then low-impact/low-effort, then low-impact/high-effort (candidates to explicitly deprioritize or drop).

For the top 3 items, write a one-paragraph justification written in language usable directly in a planning document — concrete enough to defend against "why isn't this a feature instead."

End with an explicit "fine to leave for now" list — not everything on a tech-debt backlog is actually worth fixing soon, and pretending otherwise undermines the credibility of the items that do matter.
```

## Variables
- `{{DEBT_ITEMS}}` — the list of known tech-debt items, each with at least a short description. Required.
- `{{TEAM_CONTEXT}}` — team size, current velocity, and any upcoming roadmap work that changes an item's urgency (e.g., a big feature about to touch the exact module that's a mess). Optional but sharpens prioritization meaningfully.

## Example
**Input:** `{{DEBT_ITEMS}}` = "1) auth module has no tests, 2) three different date-formatting utilities exist across the codebase, 3) the deploy script is a 400-line bash script only one person understands", `{{TEAM_CONTEXT}}` = "8-person team, planning to add SSO next quarter".

**Output (excerpt):**
```
Item 3 (deploy script bus factor): Effort M (needs documenting or rewriting in a more maintainable form). Cost: incident risk (if that one person is unavailable during a deploy issue, response is slower) + onboarding friction. High-impact/medium-effort.

Justification (top item): "The current deploy process depends entirely on one engineer's undocumented knowledge of a 400-line script. This is a single point of failure for shipping any fix, including incident response — the fix is bounded (document + add a runbook, or migrate to a standard tool) and removes a risk that gets worse, not better, the longer it's deferred."

Item 2 (duplicate date utilities): Effort S, Cost: mild dev velocity drag only, no incident or onboarding risk identified. Low-impact/low-effort — worth a quick cleanup PR but not worth defending time for in a planning meeting.

Fine to leave for now: Item 2 — real but minor; bundle into an unrelated PR that already touches those files rather than scheduling dedicated time.
```

## Tips & Variations
- If the team is about to build directly on top of a debt item (per `{{TEAM_CONTEXT}}`), ask it to flag that as an automatic priority bump regardless of the 2x2 placement — building new work on unstable ground compounds the original debt.
- For a single very large item, ask it to break the item down into fixable sub-tasks first, then prioritize the sub-tasks — "rewrite the auth system" isn't schedulable as one unit.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

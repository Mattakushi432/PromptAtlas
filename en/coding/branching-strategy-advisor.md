---
id: branching-strategy-advisor
title: Branching Strategy Advisor
category: coding
tags: [git, workflow, team-process]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Recommends a Git branching strategy (trunk-based, Git Flow, GitHub Flow, or a variant) based on your team's actual size and release cadence — not a generic explanation of each model. For a real team process decision, not a Git tutorial.

## When to use it
- Setting up Git workflow conventions for a new team or project.
- An existing branching strategy is causing friction (long-lived branches going stale, merge conflicts piling up, releases blocked by unrelated in-flight work) and needs reassessment.
- Explaining to a team why a specific strategy fits their situation, with reasoning they can push back on if the constraints are wrong.

## The Prompt

```
You recommend a Git branching strategy based on the specific team and release constraints given — not a generic comparison of all models.

Team size and structure (optional — e.g. "5 engineers, one team" vs. "40 engineers across 6 teams"): {{TEAM_STRUCTURE}}
Release cadence (how often code actually ships — continuous, weekly, monthly, or tied to app-store review cycles): {{RELEASE_CADENCE}}
Constraints (optional — e.g. "need to support multiple production versions simultaneously", "mobile app with app-store review delays"): {{CONSTRAINTS}}

Instructions:
1. Weigh trunk-based development (short-lived branches, frequent merges to main, feature flags for incomplete work) against the given team size and cadence: it fits well with small-to-medium teams shipping frequently/continuously, but requires either strong CI/testing discipline or feature-flag maturity to avoid shipping half-finished work — note this prerequisite explicitly rather than assuming it's already in place.
2. Weigh Git Flow (develop/release/hotfix/feature branch structure) against the constraints: it fits situations needing to support multiple released versions simultaneously (e.g., an app-store product with review delays, or software with long-term-support versions) but adds real process overhead that's wasted on a team shipping continuously with no multi-version support burden.
3. Weigh GitHub Flow / a simpler feature-branch-plus-PR model as a middle ground: short feature branches merged via PR to main, deploy from main, without Git Flow's full branch hierarchy — often the right default for a team that wants PR review but doesn't have Git Flow's multi-version constraint.
4. Give a specific recommendation with the primary reason tied to {{TEAM_STRUCTURE}} and {{RELEASE_CADENCE}} — not a hedge listing every option's pros/cons without concluding.
5. If {{CONSTRAINTS}} includes something that strongly dictates the answer (e.g., "must support 3 concurrent production versions for enterprise customers on different upgrade schedules"), let that constraint drive the recommendation even if it conflicts with what team size/cadence alone would suggest.
6. Note the specific process pieces the recommendation implies in practice: branch naming convention, PR review requirements, how releases get cut, how hotfixes are handled — a strategy name alone isn't actionable without these.
7. If an existing strategy is causing a specific described pain point, diagnose whether the pain is really a strategy mismatch or a discipline/tooling gap within the current strategy (e.g., trunk-based done without feature flags isn't really trunk-based) before recommending a wholesale switch.

Output format: Markdown with sections: Recommended Strategy (with primary reasoning), Practical Process Details, and (if applicable) Diagnosis of Current Pain Point.
```

## Variables
- `{{TEAM_STRUCTURE}}` — team size and how it's organized. Required.
- `{{RELEASE_CADENCE}}` — how often and how code actually ships. Required — this is usually the deciding factor alongside team size.
- `{{CONSTRAINTS}}` — anything that could override the default recommendation (multi-version support, review delays, compliance). Optional but can be decisive.

## Example
**Input:** `{{TEAM_STRUCTURE}}` = "8 engineers, one team", `{{RELEASE_CADENCE}}` = "deploy to production multiple times per day", `{{CONSTRAINTS}}` = "no need to support old versions; web app, no app-store delay".

**Output (excerpt):**
```
## Recommended Strategy
Trunk-based development. A small team deploying multiple times daily with no multi-version support burden is close to the ideal case for trunk-based — Git Flow's release/hotfix branch overhead would add process cost with no corresponding benefit here, since there's nothing to support in parallel.

## Practical Process Details
Short-lived feature branches (ideally under 1-2 days), merged to main via PR after review and passing CI. Incomplete features that can't ship same-day should be gated behind a feature flag rather than kept on a long-lived branch — this is the load-bearing prerequisite for trunk-based to work safely; without it, main becomes unstable.
```

## Tips & Variations
- For a monorepo with multiple independently-deployable services, note that different services within the same repo can reasonably use different release cadences even under one overall branching convention — don't force uniformity where it isn't needed.
- If the team is currently on Git Flow and considering simplifying, ask it to also outline a migration path (how to wind down long-lived develop/release branches) rather than just recommending the target state.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

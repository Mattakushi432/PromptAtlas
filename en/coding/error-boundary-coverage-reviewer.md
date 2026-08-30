---
id: error-boundary-coverage-reviewer
title: Client-Side Error Boundary Coverage Reviewer
category: coding
tags: [frontend, error-handling, resilience]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Audits a frontend application for gaps in error-boundary and fallback-UI coverage — where an unhandled component error would crash a whole page or app instead of degrading gracefully. Distinct from `accessibility-auditor` and `frontend-performance-auditor`, which check entirely different concerns.

## When to use it
- A bug in one unrelated component caused an entire page to go blank for users.
- Adding error boundaries deliberately as a resilience pass, rather than reactively after an incident.
- Reviewing a new feature area for error isolation before it ships.

## The Prompt

```
You are auditing a frontend application's error-boundary coverage — where an unhandled runtime error in one component would propagate and crash more of the app than it should, versus being contained and degraded gracefully.

App structure (component tree or routing structure, and where error boundaries currently exist, if any): {{APP_STRUCTURE}}

Framework: {{FRAMEWORK}}

Do the following:
1. Identify sections of the app with no error boundary between them and the app root — meaning an error anywhere in that subtree would crash the entire application rather than just that section.
2. Recommend boundary placement that isolates independent, non-critical sections from the rest of the app — a third-party widget, a single dashboard card, a non-essential sidebar feature — rather than relying on one single top-level boundary that still blanks the whole page when anything fails.
3. For boundaries that already exist, check whether they have a genuinely useful fallback UI (not just a blank div, and not just a generic "something went wrong" with zero recovery path — a retry action or a link back to a working state is meaningfully better) and whether the caught error is actually reported somewhere (logging, error monitoring) rather than silently swallowed, which would hide real bugs from ever being noticed.

Output: findings organized by app section, each with a severity (how critical that section is, and how large a blast radius an unhandled error there currently has) and a concrete recommendation (add a boundary here, improve this boundary's fallback, wire this boundary's catch to error reporting).

If the framework or library in use doesn't support component-level error boundaries in the same way React does, don't assume React's exact pattern applies — propose the closest equivalent mechanism actually available in {{FRAMEWORK}} instead.
```

## Variables
- `{{APP_STRUCTURE}}` — the component tree or routing structure, and existing error-boundary placement if any. Required.
- `{{FRAMEWORK}}` — the frontend framework in use. Required — error-boundary mechanisms and idioms differ significantly by framework.

## Example
**Input:** `{{APP_STRUCTURE}}` = "a dashboard app: AppRoot > DashboardPage > [SummaryCard, ChartWidget (third-party embed), RecentActivityList] — one error boundary exists at AppRoot only", `{{FRAMEWORK}}` = "React".

**Output (excerpt):**
```
Finding: single boundary at AppRoot only. Any error in ChartWidget (a third-party embed, inherently the least trustworthy piece of this tree) currently crashes the entire DashboardPage — SummaryCard and RecentActivityList would also disappear, even though neither depends on ChartWidget working. Severity: HIGH for this specific case, since third-party embeds are a statistically likely source of unexpected errors compared to first-party code.

Recommendation: add a dedicated error boundary directly around ChartWidget, with a fallback like "Chart temporarily unavailable" plus a retry button, so a failure there degrades to a missing chart rather than a blank dashboard. Do the same for RecentActivityList if it depends on a separate, independently-failable data source.

Fallback quality check: the existing AppRoot-level boundary — verify what its fallback actually renders. If it's a blank screen or an unstyled error message with no path back to a working state, that's a poor last line of defense even after adding the more granular boundaries above; it should at minimum offer a reload/retry action.

Error reporting: confirm the AppRoot boundary's `componentDidCatch` (or equivalent) actually sends the error to a monitoring service — if it only logs to the console, real production errors are going unnoticed rather than being caught and fixed.
```

## Tips & Variations
- For a framework without a built-in error-boundary primitive, ask it to propose the closest workable pattern (e.g., a wrapping component with a try/catch-equivalent for the relevant lifecycle, or a framework-specific error-handling hook) rather than forcing a React-shaped answer onto a different framework.
- Prioritize boundary placement around anything the app doesn't fully control — third-party embeds, ads, widgets — before first-party code, since those are both harder to guarantee bug-free and easier to justify isolating.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

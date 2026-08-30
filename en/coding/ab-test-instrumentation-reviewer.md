---
id: ab-test-instrumentation-reviewer
title: A/B Test Instrumentation Reviewer
category: coding
tags: [testing, experimentation, analytics]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Reviews experiment assignment and tracking code for statistical/tracking pitfalls before an A/B test launches — for the engineer implementing the experiment's instrumentation, not the data scientist designing its statistical plan.

## When to use it
- Implementing variant assignment and event tracking for a new experiment before it goes live.
- An experiment's results looked suspicious afterward, and you want to check whether the instrumentation itself was the problem.
- Reviewing a teammate's experiment code before it starts collecting data that can't be redone.

## The Prompt

```
You are reviewing A/B test instrumentation code for tracking and statistical-validity pitfalls before the experiment launches — you are not designing the experiment's hypothesis or sample size, only checking that the code correctly implements what it's supposed to measure.

Instrumentation code (assignment logic and event tracking): {{INSTRUMENTATION_CODE}}

Experiment description (what's being tested, the success metric): {{EXPERIMENT_DESCRIPTION}}

Check specifically for:
1. Assignment stability — is the variant assignment deterministic and sticky per user (same user always gets the same variant across sessions/requests), or could it be re-randomized, which would silently corrupt the experiment?
2. Assignment-before-exposure ordering — does assignment happen before the user is actually exposed to the variant, not logged after the fact based on what happened to render (a common source of sample ratio mismatch and survivorship bias)?
3. Event firing correctness — does the exposure/conversion tracking event fire exactly once per relevant user action? Check specifically for double-firing (e.g., on component re-render) and for silent non-firing on error paths (if the action fails partway, is the event still fired incorrectly, or correctly not fired?).
4. Metric-event alignment — does the actual tracked event capture what the stated success metric needs, or does it measure something adjacent that only approximates it?

Flag anything that could cause a sample ratio mismatch (the actual split between variants diverging from the intended split, e.g. 48/52 instead of 50/50) as a specific, named risk — this is a common, hard-to-notice instrumentation bug that invalidates results without an obvious error.

Output: a findings list with severity, plus an explicit verdict on whether the instrumentation is safe to launch data collection on as-is.
```

## Variables
- `{{INSTRUMENTATION_CODE}}` — the variant assignment logic and event-tracking code. Required.
- `{{EXPERIMENT_DESCRIPTION}}` — what's being tested and the success metric it's meant to measure. Required — without it, event-firing correctness can't be judged against intent.

## Example
**Input:** `{{INSTRUMENTATION_CODE}}` = a React component that calls `assignVariant(userId)` inside the render function (re-evaluated on every re-render) and fires a `trackExposure()` call in a `useEffect` with no dependency array guard, `{{EXPERIMENT_DESCRIPTION}}` = "testing a new checkout button color, success metric = click-through rate".

**Output (excerpt):**
```
Finding: `assignVariant(userId)` is called inside the render body, not memoized or gated — on any state change that triggers a re-render, this could return a different result if the underlying assignment isn't purely deterministic on userId alone (e.g., if it also factors in current timestamp). Severity: HIGH — potential silent re-randomization, would corrupt the experiment without any visible error.
Recommendation: memoize the assignment (e.g., `useMemo` keyed only on userId) or better, resolve it once server-side and pass it down as a prop.

Finding: `trackExposure()` fires inside a `useEffect` with no dependency array, meaning it re-fires on every re-render of the component, not once per actual exposure. Severity: HIGH — will inflate exposure counts and can distort the sample-ratio and conversion-rate calculations. Add a dependency array (or a ref-based "already fired" guard) so it fires exactly once per user session.

Verdict: NOT safe to launch as-is — both findings would independently invalidate results.
```

## Tips & Variations
- If the experimentation platform (Optimizely, LaunchDarkly, a homegrown system) handles assignment stability itself, focus the review on the event-tracking half only and say so explicitly rather than re-checking guarantees the platform already provides.
- For a backend-only experiment (e.g., a ranking algorithm change with no UI), adapt the "exposure" check to mean "was the user's request actually served by the code path being tested," not a rendered UI element.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

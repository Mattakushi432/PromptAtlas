---
id: feature-experiment-sample-size-sanity-checker
title: Feature Experiment Sample Size Sanity Checker
category: coding
tags: [experimentation, testing, statistics]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Checks whether a planned A/B test's traffic volume and duration can realistically reach statistical significance for its target effect size — a plan-stage sanity check, distinct from `ab-test-instrumentation-reviewer` (coding, already shipped)'s code-level tracking/instrumentation focus: this prompt runs before the test launches, checking whether it's even statistically viable as designed.

## When to use it
- You're planning an A/B test and want to check whether your available traffic can realistically detect the effect size you care about before committing engineering time to build it.
- A past test came back "inconclusive" and you want to check in hindsight whether it was ever adequately powered to detect the effect you were hoping for.
- You're deciding between testing on a low-traffic page versus a higher-traffic one, and want a concrete comparison of how long each would realistically need to run.

## The Prompt

```
You check whether a planned A/B test's traffic and duration can realistically reach statistical significance for the target effect size. You reason from the numbers given — you do not run an actual power calculation with precision beyond what's justified by the inputs, and you clearly flag when an input is a rough estimate versus a precise figure.

Baseline metric and current rate: {{BASELINE}}
Available traffic (visitors/events per day or week): {{TRAFFIC}}
Minimum effect size that would be worth detecting: {{MIN_EFFECT}}
Planned test duration: {{PLANNED_DURATION}}

Instructions:
1. Using standard sample-size estimation for a two-proportion test (or the appropriate test type for the given metric), estimate roughly how much traffic/how many conversions would be needed per variant to reliably detect {{MIN_EFFECT}} at conventional significance/power levels (95% confidence, 80% power) — show the estimate as a rough figure with the assumptions stated, not as a falsely precise number.
2. Compare that estimate against {{TRAFFIC}} and {{PLANNED_DURATION}} to state plainly whether the planned test is adequately powered, underpowered, or overpowered (more traffic/time than strictly needed) for the stated minimum effect size.
3. If underpowered, state concretely what would need to change to fix it: a longer duration (give a rough estimate of how much longer), a larger minimum effect size the test would actually be able to detect at the current traffic/duration, or more traffic (e.g. testing on a higher-traffic surface).
4. Flag the specific risk of running an underpowered test anyway: a null/inconclusive result doesn't mean "no effect," it can simply mean "not enough data to detect the effect even if it exists" — this distinction is commonly lost when interpreting results, and it's worth stating explicitly at the planning stage before the test runs.
5. If the metric isn't a simple conversion rate (e.g. a continuous metric like revenue per user, which has different variance considerations than a binary conversion), note that the standard two-proportion estimate is a rough approximation and flag that a more precise power calculation for that metric type would need the metric's actual variance, not just its mean.
6. Do not present this as a substitute for a rigorous power calculation done with real statistical tooling if the decision is high-stakes — this prompt is a fast sanity check to catch an obviously underpowered plan early, not a replacement for careful pre-registration analysis on a consequential test.

Output format: Markdown with `## Estimated Requirement`, `## Comparison to Plan` (adequately powered / underpowered / overpowered), and `## Recommendation` (concrete adjustment if underpowered).
```

## Variables
- `{{BASELINE}}` — the current metric value/conversion rate before the test. Required.
- `{{TRAFFIC}}` — realistic available traffic/event volume for the test. Required.
- `{{MIN_EFFECT}}` — the smallest change that would actually be worth acting on (e.g. "a 2 percentage point lift"). Required — without this, "enough" traffic can't be judged against anything concrete.
- `{{PLANNED_DURATION}}` — how long the test is planned to run. Required.

## Example
**Input:** `{{BASELINE}}` = "Current signup conversion rate: 3%" `{{TRAFFIC}}` = "~2,000 visitors per week to the signup page" `{{MIN_EFFECT}}` = "A 1 percentage point lift (3% -> 4%) would be worth shipping" `{{PLANNED_DURATION}}` = "2 weeks"

**Output (excerpt):**
```
## Estimated Requirement
Detecting a lift from 3% to 4% (a relative ~33% increase) at 95% confidence / 80% power roughly requires on the order of several thousand visitors per variant (rough estimate, standard two-proportion assumptions) — small absolute conversion rates with a modest absolute lift generally need larger sample sizes than intuition suggests.

## Comparison to Plan
At ~2,000 visitors/week split across 2 variants (~1,000/variant/week), 2 weeks gives roughly ~2,000 visitors per variant total — likely underpowered for reliably detecting a 1-point lift at this baseline rate, though this is a rough estimate, not a precise calculation.

## Recommendation
Options: (a) extend the test duration — roughly 2-3x longer than currently planned, as a rough order of magnitude, to approach adequate power; (b) accept that the test can only reliably detect a larger effect than 1 point at the current traffic/duration, and treat a smaller observed effect as inconclusive rather than "no effect" if it comes back null; (c) if a higher-traffic page is available to run this test on instead, that would reduce the required duration substantially.
```

## Tips & Variations
- If this check repeatedly comes back "underpowered" for tests you actually want to run, that's a signal worth escalating — it may mean the team needs either a lower bar for "worth detecting" effects, a way to pool traffic across pages, or acceptance that some ideas need to ship without a full A/B test and be evaluated differently (e.g. via a smaller-scale qualitative check).
- For a test that already ran and came back inconclusive, use this prompt retroactively with the test's actual traffic/duration to check whether it was ever adequately powered — this reframes "the test found no effect" into the more accurate "the test may not have had enough data to find an effect," which changes what to do next.
- This prompt gives a directional sanity check, not a publishable power analysis — for a test with real business stakes riding on statistical rigor, use dedicated statistical software or consult someone with formal experimentation-design expertise.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

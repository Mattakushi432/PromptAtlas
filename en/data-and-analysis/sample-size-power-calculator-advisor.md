---
id: sample-size-power-calculator-advisor
title: Sample Size / Power Calculator Advisor
category: data-and-analysis
tags: [statistics, data-analysis]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Estimates the sample size needed to reliably detect a given effect size before a test runs, or the effect size a fixed available sample can actually detect — the pre-test planning counterpart to the already-shipped `statistical-test-selector`, used before data collection starts rather than after.

## When to use it
- Before launching an A/B test or experiment, to know how many users or observations are needed before a "no significant difference" result can actually be trusted.
- When stakeholders propose a fixed test duration or traffic allocation and you want to know what effect size that plan can realistically detect.
- Reviewing a completed experiment retrospectively to check whether it was ever adequately powered to detect the effect the team hoped to see.

## The Prompt

```
You are a statistics advisor helping someone plan sample size before running a test, not analyzing a test that has already completed.

What's being tested and the metric type (e.g. "conversion rate, binary" or "average order value, continuous"): {{METRIC_TYPE}}
Baseline value and variability, if known (e.g. baseline conversion rate 4%, or mean/stddev for a continuous metric): {{BASELINE}}
Minimum effect size worth detecting — the smallest change that would actually change a decision (e.g. "a 10% relative lift" or "a $2 increase in AOV"): {{MINIMUM_EFFECT}}
Desired significance level and power, if known (default to alpha=0.05, power=0.80 if not specified): {{SIG_AND_POWER}}
Known constraint, if any (fixed available traffic or time window, or "none"): {{CONSTRAINT}}

Do the following:
1. State which standard test family applies given {{METRIC_TYPE}} (e.g. two-proportion z-test for a binary conversion metric, two-sample t-test for a continuous metric) and why.
2. Using {{BASELINE}}, {{MINIMUM_EFFECT}}, and {{SIG_AND_POWER}}, calculate the required sample size per group. Show the calculation inputs explicitly (not just the final number) so it can be sanity-checked or recomputed.
3. If {{CONSTRAINT}} limits the achievable sample below what step 2 requires, calculate instead the minimum effect size that constraint can actually detect at the desired power, so the requester knows what they're really testing for at that traffic level.
4. Flag it explicitly if {{MINIMUM_EFFECT}} is stated as a relative change against a small {{BASELINE}} (e.g. a 10% lift on a 0.5% baseline) — small relative lifts on small baselines require disproportionately large samples, and this is a common planning mistake worth surfacing rather than silently calculating past it.
5. State one plain-language caveat: this estimate assumes the metric's real-world variability matches what {{BASELINE}} states or implies — if actual variance during the test turns out higher (common with skewed metrics like revenue), the true required sample size is larger than this estimate.

Output format: Markdown with headed sections: Test Type, Required Sample Size (with the calculation shown), Constraint Impact (only if {{CONSTRAINT}} is not "none"), Caveats.
```

## Variables
- `{{METRIC_TYPE}}` — what's being tested and whether the metric is binary or continuous. Required — determines the test family and formula.
- `{{BASELINE}}` — the current value and variability of the metric. Required — the sample-size calculation's core input.
- `{{MINIMUM_EFFECT}}` — the smallest change worth detecting. Required — without this, "how many samples do I need" has no defined answer.
- `{{SIG_AND_POWER}}` — desired alpha/power, or blank to use the 0.05/0.80 default.
- `{{CONSTRAINT}}` — a hard cap on available sample, or "none".

## Example
**Input:** `{{METRIC_TYPE}}` = "Checkout conversion rate, binary." `{{BASELINE}}` = "Current conversion rate: 4%." `{{MINIMUM_EFFECT}}` = "A 10% relative lift (4% → 4.4%)." `{{SIG_AND_POWER}}` = "default" `{{CONSTRAINT}}` = "none"

**Output (excerpt):**
```
### Test Type
Two-proportion z-test — {{METRIC_TYPE}} is a binary conversion metric, comparing two proportions (control vs. treatment).

### Required Sample Size
p1 = 0.04, p2 = 0.044, difference = 0.004. Pooled variance term ≈ p1(1-p1) + p2(1-p2) = 0.0384 + 0.0421 = 0.0805. At alpha=0.05 (z=1.96) and power=0.80 (z=0.84): n ≈ (1.96+0.84)² × 0.0805 / 0.004² ≈ 7.84 × 0.0805 / 0.000016 ≈ **39,400 per group** (~78,800 total).

### Caveats
- This is a 10% *relative* lift on an already-small 4% baseline — that combination is why the required sample is this large; a 10% relative lift on a 40% baseline would need roughly 10x fewer observations. Confirm this is really the smallest lift worth detecting before committing to this sample size.
- Assumes conversion variance matches the stated baseline exactly; if actual variance is higher, true required sample is larger than 39,400/group.
```

## Tips & Variations
- Pair directly with `statistical-test-selector` (data-and-analysis, already shipped): run this prompt first to plan the sample size, then that one once data is collected to confirm the right test is still being applied given the data's actual shape.
- If {{CONSTRAINT}} forces a smaller sample than needed, don't just accept the resulting weaker detectable effect silently — feed the "Constraint Impact" output back to whoever owns the decision the test is meant to inform, since a test that can only detect large effects may not be worth running at all for a decision that hinges on a small one.
- For a metric with a long tail (revenue, session duration), explicitly note that in {{BASELINE}} rather than only giving mean/stddev — skewed distributions often need a larger sample than the normal-approximation formula in this prompt assumes, and the prompt's caveat step will flag it more precisely if told.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

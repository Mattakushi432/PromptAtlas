---
id: ab-test-result-interpreter
title: A/B Test Result Interpreter
category: data-and-analysis
tags: [experimentation, data-analysis, statistics]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Turns raw A/B test metrics into a plain-language verdict with explicit caveats — interprets what the numbers actually support (and don't), for a stakeholder who needs a clear read without a statistics background, distinct from `ab-test-instrumentation-reviewer` (coding, already shipped), which reviews the tracking/instrumentation setup before a test runs rather than interpreting results after.

## When to use it
- An A/B test has finished and you have the raw numbers, but need a clear, honest interpretation to share with stakeholders who won't parse a p-value or confidence interval themselves.
- You want a sanity check on whether your own read of the results ("variant B won") is actually statistically supported or just a difference that looks meaningful but isn't.
- You're deciding whether to ship a variant, extend a test, or call it inconclusive, and want the tradeoffs laid out clearly.

## The Prompt

```
You interpret A/B test results and produce a plain-language verdict with explicit caveats. You state what the data actually supports — you do not overstate a result as definitive when it isn't, and you do not understate a genuinely clear result out of excessive hedging.

Test setup: {{TEST_SETUP}}
Results: {{RESULTS}}
Business context (what a "win" would mean, cost of being wrong): {{CONTEXT}}

Instructions:
1. State the headline result in plain language first — which variant performed better on the primary metric, by how much, and whether the difference is statistically significant given what's provided (sample size, confidence level/p-value if given).
2. If statistical significance isn't achievable to assess from what's given (missing sample size, missing variance/confidence interval), say so explicitly rather than eyeballing a verdict from raw percentages alone — a difference that looks large in raw numbers can still be statistically meaningless with a small sample.
3. Check for common pitfalls if the data allows: was the test run long enough to cover a full business cycle (e.g. a week, to avoid day-of-week effects)? Is the sample size actually balanced between variants? Are there secondary metrics that moved in a concerning direction even if the primary metric "won"? Flag any of these that the given data can assess.
4. Distinguish "statistically significant" from "practically significant" — a statistically significant but tiny effect size may not be worth the cost/complexity of shipping it, and {{CONTEXT}} should inform that judgment explicitly.
5. Give a clear recommendation among: ship the winning variant, extend the test (state why — insufficient sample, borderline significance), or call it inconclusive/no meaningful difference — do not hedge into a non-answer when the data actually supports a clear call.
6. If asked to interpret multiple secondary metrics alongside the primary one, be explicit about which metric is the actual decision-driver per {{CONTEXT}} — don't treat every metric that moved as equally decision-relevant.

Output format: Markdown with `## Headline Verdict`, `## Statistical Read` (significance, sample size adequacy), `## Caveats`, and `## Recommendation`.
```

## Variables
- `{{TEST_SETUP}}` — what was tested, the variants, and the primary metric. Required.
- `{{RESULTS}}` — the raw numbers: sample sizes per variant, metric values, and statistical output if available (p-value, confidence interval). Required — the depth of statistical read is bounded by what's given here.
- `{{CONTEXT}}` — what a "win" is worth and the cost of shipping a wrong call. Required — without it, practical significance can't be judged, only statistical significance.

## Example
**Input:** `{{TEST_SETUP}}` = "Testing new checkout button color (blue vs. green) on conversion rate" `{{RESULTS}}` = "Control (blue): 10,200 visitors, 3.1% conversion. Variant (green): 10,150 visitors, 3.3% conversion. p-value: 0.31" `{{CONTEXT}}` = "Low cost to ship either way — this is a simple visual change"

**Output (excerpt):**
```
## Headline Verdict
Variant (green) had a slightly higher raw conversion rate (3.3% vs 3.1%), but this difference is not statistically significant (p = 0.31, well above the conventional 0.05 threshold).

## Statistical Read
With this sample size and p-value, the observed 0.2 percentage-point difference is consistent with random variation — we cannot conclude green actually outperforms blue based on this data.

## Caveats
No information given on test duration — if this ran for less than a full week, day-of-week effects could also be contributing noise not captured by the p-value alone.

## Recommendation
Inconclusive — do not ship based on this result alone. Given the low cost noted in context, either extend the test to increase sample size (most useful if there's reason to believe a real but small effect exists), or deprioritize this test if the effect size wouldn't matter much either way even if it were real.
```

## Tips & Variations
- If the raw results show a "loser" variant on the primary metric but a clear win on an important secondary metric, don't let the primary-metric verdict fully override that — flag the tension explicitly and let {{CONTEXT}} determine which matters more for this specific decision.
- This prompt interprets given statistical output; it doesn't compute significance from raw counts unless conversion counts/rates and sample sizes are explicit enough to derive it reliably — for a test lacking a p-value or confidence interval, treat the "Statistical Read" section as necessarily limited rather than inventing a number.
- For a test with more than two variants, extend `{{RESULTS}}` to include all variants and expect the interpretation to address multiple-comparison considerations (running many comparisons increases the chance of a false positive by chance) explicitly.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

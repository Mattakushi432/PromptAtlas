---
id: benchmark-comparison-fairness-auditor
title: Benchmark Comparison Fairness Auditor
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
Audits a "we beat the benchmark" comparison — against a competitor, an industry average, or a past period — for matched time windows, populations, and metric definitions before it's presented as a fair comparison, catching the common ways such claims quietly stack the deck without anyone intending to mislead.

## When to use it
- Before a comparison claim ("we outperform the industry average by 20%") goes into a deck, press release, or board update, to check it holds up under a skeptical read.
- Someone hands you a benchmark comparison that looks favorable and you want to sanity-check whether it's genuinely apples-to-apples before repeating it.
- You're designing a benchmark comparison yourself and want to build it fairly from the start rather than catch a problem after it's already been presented.

## The Prompt

```
You audit a benchmark comparison for fairness — whether it's genuinely apples-to-apples — not whether the underlying numbers are calculated correctly.

Our metric and its value: {{OUR_METRIC}}
Our metric's time window, population, and exact definition: {{OUR_CONTEXT}}
The benchmark being compared against (a competitor, industry average, or past period) and its value: {{BENCHMARK_METRIC}}
The benchmark's time window, population, and definition, as best known: {{BENCHMARK_CONTEXT}}

Check for these specific fairness gaps, and for each, state whether it applies here or is genuinely not a concern:
1. Time window mismatch: are {{OUR_CONTEXT}} and {{BENCHMARK_CONTEXT}}'s time periods the same length and same calendar period (not "our best quarter" against "their full-year average"), and free of one side benefiting from a seasonal effect the other doesn't share?
2. Population mismatch: are the two being measured over comparable populations (same customer segment, same market, same company size range), not our whole customer base against the benchmark's narrower or broader one?
3. Definition mismatch: do {{OUR_METRIC}} and {{BENCHMARK_METRIC}} use the same formula and denominator (e.g. "conversion rate" measured from the same funnel stage, "churn" counting the same events as a churn), or does a same-named metric actually differ under the hood?
4. Selection bias: was {{OUR_CONTEXT}}'s window or population chosen because it happened to look good (cherry-picked), rather than being the standard reporting period/population used consistently regardless of outcome?
5. Normalization: if scale differs (company size, user base, market maturity), has the comparison been normalized (per-user, per-capita, growth-rate rather than absolute) so a larger or older entity isn't automatically favored or disfavored by raw scale?
6. Sample size and noise: if either side's figure comes from a small sample, is the apparent gap larger than what normal period-to-period noise could produce, or could "beating" the benchmark just be noise?

Give a plain verdict: fair comparison as stated, fair with a caveat that should be disclosed, or not fair as currently framed — and if not fair, the single fix (reframe the window, restate the population, disclose the definitional difference) that would make it defensible.

Output format: Markdown, one short paragraph per numbered check (skip elaborating on checks that clearly don't apply), ending with the verdict and fix.
```

## Variables
- `{{OUR_METRIC}}` — the metric and value being presented as favorable. Required.
- `{{OUR_CONTEXT}}` — its time window, population, and definition. Required.
- `{{BENCHMARK_METRIC}}` — the comparison point and its value. Required.
- `{{BENCHMARK_CONTEXT}}` — the benchmark's time window, population, and definition, as best known — state "unknown" for anything not available rather than guessing, since an unstated benchmark context is itself a finding.

## Example
**Input:** `{{OUR_METRIC}}` = "Our churn rate: 2.1% monthly." `{{OUR_CONTEXT}}` = "Last month, measured across our enterprise-tier customers only (our largest, stickiest segment)." `{{BENCHMARK_METRIC}}` = "Industry average churn: 5% monthly, per a SaaS benchmark report." `{{BENCHMARK_CONTEXT}}` = "Unknown — the report doesn't specify company size range or plan tier, likely blends all SaaS company sizes."

**Output (excerpt):**
```
### 2. Population Mismatch
Applies, and materially: {{OUR_CONTEXT}} is enterprise-tier only — typically the lowest-churn segment for any SaaS company — while {{BENCHMARK_CONTEXT}} likely blends all tiers and company sizes, including higher-churn self-serve/SMB segments. Comparing our best-retained segment against an all-segment industry blend isn't apples-to-apples regardless of how the two numbers were each calculated correctly on their own terms.

### 3. Definition Mismatch
Unknown whether the benchmark's "churn" counts the same events as ours (e.g. does it include downgrades, or only full cancellations?) — flag as an open question rather than assume alignment.

### 4. Selection Bias
Not stated whether enterprise-only was chosen because it's the standard segment we always report, or because it happens to be our lowest-churn number available this month — worth confirming which, since the latter would be a red flag on its own.

### Verdict
Not fair as currently framed. The comparison implicitly claims "we beat the industry" but actually compares our best segment against an all-segment blend. Fix: either restate as "our enterprise-tier churn (2.1%) vs. industry average (5%, all segments)" with the segment difference disclosed, or find/compute an enterprise-specific industry benchmark for a genuinely matched comparison.
```

## Tips & Variations
- Distinct from `forecast-assumption-stress-tester` (data-and-analysis, already shipped): that prompt tests how sensitive a single projection is to its own input assumptions; this one tests whether a comparison *between two already-computed numbers* is fair, a different failure mode (apples-to-oranges) than assumption sensitivity.
- When {{BENCHMARK_CONTEXT}} comes back mostly "unknown," don't let that soften the verdict — an externally-sourced benchmark with undisclosed methodology is itself a fairness risk worth naming explicitly, not a neutral gap.
- If the audit finds the comparison is fair as stated, still check whether the *presentation* (a chart, a headline stat) implies more precision or generality than the underlying comparison supports — a fair comparison can still be framed misleadingly by omitting the caveats this prompt surfaces.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

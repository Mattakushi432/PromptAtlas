---
id: statistical-test-selector
title: Statistical Test Selector
category: data-and-analysis
tags: [statistics, data-analysis]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Recommends which statistical test actually fits a given comparison — given the data types, sample sizes, and what's being compared — instead of defaulting to a t-test or chi-squared test out of habit regardless of whether its assumptions hold.

## When to use it
- You want to compare two or more groups (conversion rates, average order value, survey scores) and aren't sure which test is actually appropriate for the data you have.
- You picked a test based on what you remember from a stats class years ago and want a sanity check on whether it's actually the right one for this specific comparison.
- You're reviewing someone else's analysis and want to verify the test they used matches the data's actual shape (distribution, sample size, paired vs. independent).

## The Prompt

```
You recommend the correct statistical test for a described comparison, and explain why — you do not default to the most commonly-known test if it doesn't fit the data.

What's being compared: {{COMPARISON}}
Type of data for the outcome being measured (continuous, categorical/binary, ordinal, count): {{DATA_TYPE}}
Number of groups being compared, and whether they're independent or paired/repeated-measures: {{GROUP_STRUCTURE}}
Approximate sample size per group: {{SAMPLE_SIZE}}

Instructions:
1. Based on {{DATA_TYPE}} and {{GROUP_STRUCTURE}}, recommend the specific test (e.g. independent-samples t-test, paired t-test, one-way ANOVA, chi-squared test of independence, Mann-Whitney U, Kruskal-Wallis) — name the test, don't just describe "a statistical test."
2. State the test's key assumptions (e.g. normality, roughly equal variance between groups, independence of observations) and flag which ones are likely to be a concern given {{SAMPLE_SIZE}} and what's known about {{COMPARISON}} — a small sample size makes normality assumptions harder to verify and more likely to matter.
3. If an assumption is likely violated or uncertain, recommend the non-parametric alternative (e.g. Mann-Whitney U instead of a t-test) as a fallback, and explain the tradeoff (non-parametric tests are more robust to assumption violations but typically have less statistical power).
4. If {{GROUP_STRUCTURE}} involves more than two groups, flag the multiple-comparisons problem if pairwise comparisons will follow the omnibus test (e.g. running an ANOVA then multiple t-tests without correction inflates the false-positive rate) and recommend a correction method (e.g. Bonferroni, Tukey's HSD).
5. If {{SAMPLE_SIZE}} is very small (rule of thumb: under ~30 per group for a continuous outcome, or expected cell counts under 5 for a chi-squared test), flag that the recommended test's reliability is limited regardless of which one is chosen, and note what a larger sample would change.
6. Do not compute a p-value or run the test yourself from the description alone — this prompt recommends which test to run, it does not substitute for actually running it on the real data.

Output format: Markdown. State the recommended test as a one-line headline, then sections: Why This Test, Assumptions to Check, Fallback If Assumptions Fail, Sample Size Note.
```

## Variables
- `{{COMPARISON}}` — what's being compared in plain language (e.g. "conversion rate between two landing page designs"). Required.
- `{{DATA_TYPE}}` — the outcome variable's data type. Required — this alone rules out most incorrect test choices.
- `{{GROUP_STRUCTURE}}` — how many groups, and whether the same subjects appear in multiple groups (paired) or different subjects per group (independent). Required.
- `{{SAMPLE_SIZE}}` — approximate size per group. Required — determines whether assumption checks and non-parametric fallbacks matter in practice.

## Example
**Input:** `{{COMPARISON}}` = "Average time-on-page for two article layouts" `{{DATA_TYPE}}` = "Continuous (seconds)" `{{GROUP_STRUCTURE}}` = "2 groups, independent (different visitors saw each layout)" `{{SAMPLE_SIZE}}` = "~40 per group"

**Output (excerpt):**
```
### Recommended test: Independent-samples t-test (or Mann-Whitney U if normality is questionable)

### Why This Test
Two independent groups, continuous outcome — the independent-samples t-test is the standard choice for comparing means between two unrelated groups.

### Assumptions to Check
Normality of time-on-page within each group (this metric is often right-skewed — a few very long sessions can pull the distribution), and roughly equal variance between the two groups.

### Fallback If Assumptions Fail
Time-on-page data is frequently non-normal in practice. If a quick check (histogram, or a formal normality test) shows clear skew, use the Mann-Whitney U test instead — it compares distributions without assuming normality, at some cost to statistical power.

### Sample Size Note
~40 per group is workable but not large — a t-test's robustness to mild normality violations improves with sample size, so if the distribution looks meaningfully skewed, prefer the Mann-Whitney U fallback here rather than trusting the t-test's assumption.
```

## Tips & Variations
- Pair with `ab-test-result-interpreter` (data-and-analysis, already shipped) once the test is run — that prompt interprets the resulting numbers into a plain-language verdict; this one only recommends which test to run beforehand.
- For a designed experiment with more than one factor (e.g. testing both layout and headline simultaneously), this prompt's single-comparison framing doesn't cover factorial designs — say so explicitly if {{COMPARISON}} describes more than one manipulated factor, since that needs a two-way ANOVA or similar, a materially different recommendation.
- If you already know the outcome is count data (e.g. number of support tickets per day), make sure {{DATA_TYPE}} says so explicitly — count data often needs a Poisson or negative-binomial approach rather than a t-test, even though a count "looks" continuous at a glance.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

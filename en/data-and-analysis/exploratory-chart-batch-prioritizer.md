---
id: exploratory-chart-batch-prioritizer
title: Exploratory Chart Batch Prioritizer
category: data-and-analysis
tags: [data-visualization, eda]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Given a fresh dataset and a business question, prioritizes which handful of exploratory charts to build first — ranked by expected information yield and relevance to the question — instead of plotting every column, so limited exploration time goes to the charts most likely to actually inform a decision.

## When to use it
- You've just gotten access to a new dataset with more columns than you have time to explore individually, and need to decide where to look first.
- A stakeholder wants "an exploratory look" at data before a deeper analysis, and you want a defensible, question-driven starting set rather than an arbitrary one.
- You're mentoring someone newer to EDA who defaults to plotting every column's histogram regardless of whether it's relevant to the question at hand.

## The Prompt

```
You prioritize which exploratory charts to build first from a dataset, given a specific business question and a limited time budget — you do not recommend chart types for a known variable pair; you decide which variables and relationships deserve a chart at all before that decision.

Dataset description (columns, types, approximate row count): {{DATASET_DESCRIPTION}}
Business question this exploration is meant to inform: {{BUSINESS_QUESTION}}
How many charts you have time to build first: {{TIME_BUDGET}}

Do the following:
1. List candidate charts worth considering: univariate distributions of columns plausibly relevant to {{BUSINESS_QUESTION}}, key bivariate relationships (a likely driver vs. the outcome the question is about), time trends if a date/timestamp column exists, and segment breakdowns if a natural grouping column exists.
2. Score each candidate on two axes: relevance to {{BUSINESS_QUESTION}} (does this variable plausibly bear on the question, or is it just available), and expected information yield (a variable with unknown/unexamined distribution or a plausible-but-unverified relationship yields more than one that's already well understood or unlikely to vary meaningfully).
3. Select the top {{TIME_BUDGET}} candidates by combined score. Ties should favor the chart most likely to change what the audience believes, not the easiest one to build.
4. For each selected chart, state: which column(s), what chart form fits (defer to `chart-type-recommender-for-a-dataset-shape` for the precise type-selection reasoning; here just name the general form — distribution, comparison, trend, relationship), and the specific question or decision it's meant to inform.
5. Explicitly list 2-3 plausible candidates that were deliberately deprioritized and why (already well-understood, low relevance to {{BUSINESS_QUESTION}}, or better addressed with a table/summary stat than a chart) — this is as valuable as the selections themselves, since it prevents someone else from independently "discovering" the same low-value chart later.

Output format: Markdown. A ranked, numbered list of the {{TIME_BUDGET}} selected charts with the fields from step 4, followed by a short "Deprioritized" section from step 5.
```

## Variables
- `{{DATASET_DESCRIPTION}}` — the dataset's columns, types, and approximate size. Required.
- `{{BUSINESS_QUESTION}}` — the question this exploration should inform. Required — without it, prioritization has no basis and defaults to "plot everything."
- `{{TIME_BUDGET}}` — how many charts there's time to build first. Required.

## Example
**Input:** `{{DATASET_DESCRIPTION}}` = "Customer table, ~50K rows: signup_date, plan_tier (free/pro/enterprise), monthly_spend, support_tickets_opened, days_since_last_login, churned (bool), acquisition_channel, company_size_employees." `{{BUSINESS_QUESTION}}` = "What's driving churn among pro-tier customers?" `{{TIME_BUDGET}}` = "4"

**Output (excerpt):**
```
### 1. Churn rate by days_since_last_login (relationship)
High relevance (engagement recency is a classic churn driver) and high yield (unexamined so far). Question it informs: is disengagement a leading indicator of churn we could act on before cancellation?

### 2. Churn rate by support_tickets_opened (relationship)
High relevance (support friction is plausible churn driver for pro tier specifically) and high yield. Question it informs: does support experience correlate with churn, or is churn driven more by product fit than service issues?

### 3. Monthly_spend distribution, churned vs. retained pro customers (comparison)
Medium-high relevance — tests whether churn concentrates at the low or high end of spend within the pro tier, informing whether it's price-sensitivity or under-realized-value driving cancellations.

### 4. Churn rate trend over signup cohort (time trend)
Medium relevance, high yield — reveals whether churn is a stable rate or worsening for more recent cohorts, which changes whether the fix is product-wide or specific to a recent change.

### Deprioritized
- acquisition_channel vs. churn: plausible but company_size and support/engagement variables are more directly actionable for a product/support intervention than channel-level attribution, which would need a separate analysis anyway.
- company_size_employees distribution alone: already well understood from prior sales reporting; a churn *relationship* would be more valuable than a standalone distribution, but competes with the 4 selected above for this budget.
```

## Tips & Variations
- Distinct from `chart-type-recommender-for-a-dataset-shape` (data-and-analysis, already shipped): that prompt picks the right chart type once you already know which variable(s) to plot; this prompt decides which variables are even worth a chart, before type selection is relevant. Use this one first, then feed each selected item into that one for the exact chart-type call.
- If {{TIME_BUDGET}} feels too small to cover the highest-relevance candidates from step 1, say so explicitly rather than force a fit — recommend the minimum viable expansion (e.g. "6 would meaningfully improve coverage; 4 forces dropping a plausible driver") instead of silently under-covering the question.
- Re-run this after each exploration round: today's "Deprioritized" list may become tomorrow's top candidates once the higher-priority charts either resolve or deepen the question.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

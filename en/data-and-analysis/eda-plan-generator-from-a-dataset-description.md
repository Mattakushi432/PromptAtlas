---
id: eda-plan-generator-from-a-dataset-description
title: EDA Plan Generator from a Dataset Description
category: data-and-analysis
tags: [eda, data-analysis, planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Generates a structured exploratory data analysis (EDA) plan from a description of a dataset and an analysis goal — a planning tool for what to check before diving into ad hoc exploration, not the analysis itself: it produces a checklist/sequence of things to investigate, tailored to the actual data shape and question.

## When to use it
- You've just gotten a new dataset and want a systematic plan for exploring it rather than poking around randomly and possibly missing something important.
- You're onboarding someone else onto a dataset and want a documented, repeatable EDA approach they can follow.
- You want to sanity-check whether your own ad hoc exploration so far actually covered the basics (missingness, distributions, obvious data quality issues) before drawing conclusions.

## The Prompt

```
You generate an exploratory data analysis plan from a dataset description and analysis goal. You tailor the plan to the actual data shape and question — you do not produce a generic EDA checklist disconnected from what's actually described.

Dataset description (columns, types, size, source): {{DATASET_DESCRIPTION}}
Analysis goal: {{GOAL}}
Known data quality concerns (if any): {{KNOWN_ISSUES}}

Instructions:
1. Start with data quality checks specific to what's described: missingness patterns (not just "check for nulls" — which columns are most likely to have meaningful vs. structural missingness given the source), obvious outliers or impossible values given the described column types, and duplicate records if the data structure makes that plausible.
2. Propose univariate checks (distributions, summary stats) for the columns most relevant to {{GOAL}} first, not an undifferentiated pass through every column — prioritize based on what the goal actually needs.
3. Propose bivariate/relationship checks specifically between variables that plausibly relate to {{GOAL}} — state why each proposed check is relevant to the goal, not just "check correlations between everything."
4. If {{KNOWN_ISSUES}} is given, make sure the plan explicitly addresses how to work around or quantify the impact of that issue, rather than a generic plan that ignores a known problem.
5. Flag any check that would require external context not in the dataset itself (e.g. domain knowledge about what a "normal" range looks like for a variable) — a check is more useful when it's clear what result would be surprising versus expected.
6. Sequence the plan logically: data quality first, then univariate, then bivariate/relationships, then (if relevant to the goal) initial hypothesis-generation — don't jump to correlation analysis before checking for basic data quality issues that could produce spurious results.

Output format: Markdown, a numbered, sequenced checklist grouped under `## Data Quality`, `## Univariate`, `## Bivariate/Relationships`, and (if relevant) `## Initial Hypotheses to Check`, each item with a one-line note on why it matters for {{GOAL}}.
```

## Variables
- `{{DATASET_DESCRIPTION}}` — columns, types, approximate size, and source/collection method. Required — vaguer descriptions produce vaguer plans.
- `{{GOAL}}` — what the analysis is ultimately trying to answer or support. Required — without it, the plan can't prioritize.
- `{{KNOWN_ISSUES}}` — any already-known data quality problems. Optional — omit if none known yet.

## Example
**Input:** `{{DATASET_DESCRIPTION}}` = "Customer transaction table: customer_id, transaction_date, amount, product_category, signup_source. ~500k rows, from production database export." `{{GOAL}}` = "Understand what drives higher customer lifetime value" `{{KNOWN_ISSUES}}` = "Some transactions have amount = 0, unclear if that's a data error or a legitimate free transaction"

**Output (excerpt):**
```
## Data Quality
1. Investigate the amount = 0 rows specifically (per known issue) — check if they cluster by product_category or signup_source, which would suggest a legitimate pattern (e.g. free trials) versus scattered randomly, which would suggest a data pipeline error. This directly affects whether these rows should be included in LTV calculations.
2. Check for duplicate transaction records (same customer_id + transaction_date + amount) — production exports sometimes have duplication from replay/retry logic; duplicates would inflate LTV figures.
3. Check date range and look for gaps — an unexpected gap could mean incomplete export rather than genuine business inactivity.

## Univariate
1. Distribution of amount (excluding/flagging the zero-value question above) — relevant to LTV since it's the core value being aggregated.
2. Distribution of transactions per customer_id — relevant since LTV is a function of both transaction frequency and amount.

## Bivariate/Relationships
1. Amount and frequency by signup_source — directly relevant to the goal: if certain acquisition sources correlate with higher LTV, that's actionable for acquisition strategy.
...
```

## Tips & Variations
- Run the "Data Quality" section first as its own pass and resolve findings there before moving to univariate/bivariate checks — proceeding with unresolved data quality issues (like the ambiguous zero-amount rows above) risks building analysis on a shaky foundation.
- For a very large or high-dimensional dataset, this prompt's plan is a starting scope, not exhaustive — expect to iterate the plan itself once initial findings suggest new relevant questions.
- Pair with `chart-type-recommender-for-a-dataset-shape` (data-and-analysis) once the plan identifies which specific relationships to visualize.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

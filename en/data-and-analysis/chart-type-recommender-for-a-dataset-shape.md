---
id: chart-type-recommender-for-a-dataset-shape
title: Chart Type Recommender for a Dataset Shape
category: data-and-analysis
tags: [data-visualization, data-analysis, planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Recommends the right chart type(s) for a specific dataset shape and the question being asked — reasons from data structure (categorical vs. continuous, number of dimensions, time-series or not) and intent, rather than defaulting to whatever chart type is most familiar or most commonly reached for by habit.

## When to use it
- You have data to visualize and default to bar/line/pie out of habit rather than considering what actually fits the data and the question.
- You're reviewing a chart someone else made and suspect the chart type is actively working against clarity (e.g. a pie chart with 12 slices).
- You're building a dashboard and want a consistent rationale for chart choice across many different metrics, not ad hoc per-chart decisions.

## The Prompt

```
You recommend chart type(s) for a given dataset shape and analytical question. You reason from the data's actual structure and what the viewer needs to understand — you do not default to a generic "safe" chart type without checking it fits.

Data shape (variables, types, cardinality): {{DATA_SHAPE}}
What the viewer needs to understand: {{QUESTION}}
Audience (technical/general, familiarity with chart types): {{AUDIENCE}}

Instructions:
1. Identify the data's actual shape first: how many variables, which are categorical vs. continuous, whether one is time, and roughly how many categories/points are involved — chart choice follows from this, not from habit.
2. Recommend a chart type that matches both the data shape and {{QUESTION}} specifically — e.g. comparing values across many categories favors a sorted bar chart over a pie chart (pie charts become unreadable past ~5-6 slices and make precise comparison hard regardless of slice count); showing change over time favors a line chart; showing distribution favors a histogram or box plot, not a bar chart of means alone.
3. Explicitly flag chart types that would technically "work" but actively mislead or obscure for this specific shape/question — e.g. a pie chart for values that don't sum to a meaningful whole, a 3D chart that distorts value comparison, or a dual-axis chart that implies a relationship between two differently-scaled metrics that isn't really there.
4. If the data shape supports more than one reasonable chart type, present the top 1-2 options with the specific tradeoff between them (e.g. "a line chart shows the trend more clearly; a bar chart makes exact period-over-period comparison easier") rather than picking one silently.
5. Calibrate to {{AUDIENCE}} — a chart type that's clear to a data-literate audience (e.g. a box plot) may need a simpler alternative or extra explanation for a general audience unfamiliar with reading it.
6. If {{DATA_SHAPE}} has high cardinality in a categorical variable (many distinct categories), address that directly — recommend a specific strategy (top-N plus "other," a different chart type, or aggregation) rather than an approach that would produce an unreadable chart with dozens of bars/slices/lines.

Output format: a recommended chart type (or 1-2 options with tradeoffs), a one-line rationale tied to the data shape and question, and an explicit note on any chart type that would be a mismatch here despite being commonly used for superficially similar data.
```

## Variables
- `{{DATA_SHAPE}}` — the variables involved, their types (categorical/continuous/time), and rough cardinality. Required.
- `{{QUESTION}}` — what the viewer specifically needs to take away (compare values, see a trend, understand distribution, see a relationship between two variables). Required — the same data shape needs different charts for different questions.
- `{{AUDIENCE}}` — how chart-literate the intended viewers are. Required — affects how much you can lean on a less-common but more-precise chart type.

## Example
**Input:** `{{DATA_SHAPE}}` = "Monthly revenue by product category, 8 categories, 24 months of data" `{{QUESTION}}` = "Show which categories are growing vs. shrinking over time" `{{AUDIENCE}}` = "General business audience, not data specialists"

**Output (excerpt):**
```
Recommended: A multi-line chart, one line per category, with revenue on the y-axis and month on the x-axis.
Rationale: The question is specifically about trend over time across categories — a line chart is the direct match for showing trend, and with 8 categories, 8 lines is still readable (past ~10-12, consider small multiples instead of one crowded chart).

Mismatch to avoid: A stacked area chart would show total revenue trend well but actively obscure individual category growth/shrinkage — a category's absolute area can look stable while its share (and the trend the question is actually asking about) is shifting significantly. Also avoid a single grouped bar chart per month (8 bars × 24 months) — this fits the data technically but produces an unreadable 192-bar chart that doesn't serve the trend question.
```

## Tips & Variations
- When cardinality is genuinely too high for any single chart to stay readable (e.g. 50 categories), the honest answer is often to aggregate (top-N + other) or use small multiples/faceting rather than forcing everything into one chart — this prompt will flag that rather than recommending a chart type that technically plots the data but can't be read.
- For a dashboard with many charts, run this prompt per metric rather than assuming one chart type fits every metric on the dashboard — different metrics on the same dashboard often have genuinely different data shapes and questions.
- This prompt recommends chart type and structure, not visual styling (color, specific tooling) — for implementation-level guidance in a specific charting library or design system, that's a separate, tool-specific step.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

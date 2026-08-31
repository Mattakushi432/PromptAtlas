---
id: cohort-analysis-setup-guide
title: Cohort Analysis Setup Guide
category: data-and-analysis
tags: [data-analysis, eda]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Plans the setup of a cohort analysis — how to define the cohorts, what metric to track per cohort, and which common pitfalls to guard against — given a dataset description and a business question, before any query gets written.

## When to use it
- You want to answer a question like "does retention differ by signup channel/plan/onboarding flow" and need to decide how to actually structure the cohort analysis before writing the SQL.
- You're reviewing an existing cohort chart/report and suspect its cohort definition or window doesn't actually match the product's real usage pattern, producing a misleading picture.
- You're new to cohort analysis for this specific dataset and want a plan that flags the pitfalls specific to your business question, not a generic cohort-analysis tutorial.

## The Prompt

```
You plan a cohort analysis setup for a described business question — you produce a plan to hand to whoever writes the actual query, not the query itself.

Business question: {{BUSINESS_QUESTION}}
Dataset description (what tables/events are available, roughly how much history): {{DATASET_DESCRIPTION}}
Product usage cadence (e.g. daily-use app, weekly, monthly/infrequent): {{USAGE_CADENCE}}

Instructions:
1. Define the cohort grouping dimension directly from {{BUSINESS_QUESTION}} — what specifically splits users into cohorts (signup date, signup channel, plan tier, onboarding flow variant) — and the time grain for the cohort itself (daily, weekly, monthly cohorts), justified against {{USAGE_CADENCE}}: a daily-use product can support tighter weekly cohorts, while an infrequently-used product needs a coarser grain or cohorts will be too sparse to read.
2. Define the metric tracked per cohort over time (retention: returned at all vs. a specific action; or a behavior metric like average revenue per cohort-period) — and be explicit about what counts as "returned" (any activity vs. the specific action that matters for {{BUSINESS_QUESTION}}).
3. Flag survivorship bias risk: if the analysis window includes recent cohorts that haven't had time to reach the same maturity as older cohorts, comparing raw retention numbers across cohorts of different ages will make recent cohorts look artificially better or worse — recommend either truncating the comparison window to what all cohorts have had time to reach, or clearly labeling incomplete cohort-periods as such.
4. Flag minimum cohort size: given what {{DATASET_DESCRIPTION}} implies about volume, estimate whether the smallest resulting cohorts (e.g. a niche signup channel) will have enough users per period to produce a meaningful retention percentage rather than noise from a handful of users.
5. Check that the cohort time grain from step 1 actually matches {{USAGE_CADENCE}} — a common pitfall is defining daily cohorts and daily retention for a product people naturally use weekly or monthly, which produces a retention curve that looks like near-total churn every single day even though usage is actually healthy at the product's real cadence.
6. If {{BUSINESS_QUESTION}} implies comparing cohorts (e.g. "does retention differ by channel"), specify what a meaningful difference would look like given expected cohort sizes, so the eventual result isn't over-interpreted from noisy small-sample differences.

Output format: Markdown with sections: Cohort Definition, Metric Tracked, Survivorship Bias Note, Minimum Cohort Size Check, Cadence Match Check. End with a one-paragraph plain description of what the resulting chart/table will look like.
```

## Variables
- `{{BUSINESS_QUESTION}}` — the specific question the cohort analysis needs to answer. Required.
- `{{DATASET_DESCRIPTION}}` — what data is available and roughly how much history/volume exists. Required — this bounds what cohort grain and comparison is actually feasible.
- `{{USAGE_CADENCE}}` — how frequently the product is naturally used. Required — this is what step 5's cadence-mismatch check depends on.

## Example
**Input:** `{{BUSINESS_QUESTION}}` = "Does user retention differ between users who signed up via referral vs. paid ads?" `{{DATASET_DESCRIPTION}}` = "Signup event with a channel field, and a daily login event, about 8 months of history, roughly 5,000 signups/month across both channels combined, referral being the smaller channel at ~15% of signups." `{{USAGE_CADENCE}}` = "Weekly-use productivity app — most active users engage a few times per week, not daily."

**Output (excerpt):**
```
### Cohort Definition
Cohort by signup week (matches {{USAGE_CADENCE}}'s weekly pattern better than daily cohorts would) × signup channel (referral vs. paid ads) as the comparison dimension.

### Cadence Match Check
{{USAGE_CADENCE}} indicates weekly, not daily, use — measuring "returned the next day" would produce a misleadingly low retention curve for a product people naturally check a few times a week rather than daily. Track "returned at least once in the following week" instead, aligned to the weekly cohort grain from step 1.

### Minimum Cohort Size Check
Referral is ~15% of ~5,000/month = ~750/month, or roughly ~175/week if evenly distributed — workable for a weekly cohort but getting thin; if the analysis needs to slice further (e.g. by referral sub-source), individual weekly cohorts within referral could drop into noisy single-digit-to-low-double-digit territory. Recommend monthly cohorts instead of weekly specifically for the referral side if a further split is needed, even though paid-ads cohorts could support weekly.

### Survivorship Bias Note
With 8 months of history, cohorts from the most recent 4-6 weeks haven't had time to show multi-month retention — exclude them from any "retention at month 3" comparison, or the newest cohorts will appear to have zero month-3 retention simply because that period hasn't happened yet for them.
```

## Tips & Variations
- Pair with `ab-test-result-interpreter` (data-and-analysis, already shipped) once actual cohort numbers come back, if the comparison between cohorts needs a statistical significance read rather than just an eyeballed chart — cohort retention differences are still subject to the same "is this difference real or noise" question a designed A/B test faces.
- If {{BUSINESS_QUESTION}} is really asking about a causal effect (does referral *cause* better retention) rather than a descriptive comparison, flag that a cohort analysis alone can't separate channel effect from selection bias (people who arrive via referral may simply be a different, more-engaged population regardless of channel) — this prompt plans a descriptive cohort setup, not a causal-inference design.
- Revisit the cohort grain decision once real data comes in — a grain that looked right from {{DATASET_DESCRIPTION}} alone sometimes needs adjusting once actual per-cohort volumes are visible.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

---
id: segment-definition-overlap-auditor
title: Segment Definition Overlap Auditor
category: data-and-analysis
tags: [data-analysis, data-visualization]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Checks a set of user/customer segment definitions for unintended overlap — cases where the same entity qualifies for two "mutually exclusive"-looking segments — that would silently double-count totals in a summed report; the segment-membership counterpart to `dashboard-metric-definition-auditor`'s focus on ambiguous metric wording.

## When to use it
- Before presenting a report that sums counts or revenue across several named segments (e.g. "New," "Returning," "At-Risk," "Churned") and assumes the segments partition the population cleanly.
- After a segment definition changes (a new rule added, a threshold adjusted) and you want to check it didn't just start overlapping with an existing segment.
- Reviewing someone else's segmentation scheme before it goes into a recurring dashboard, to catch double-counting before it becomes an ongoing reporting error.

## The Prompt

```
You audit a set of segment definitions for unintended overlap that would cause double-counting when their counts or values are summed in a report.

The segments and their definitions (the rule/condition that qualifies an entity for each): {{SEGMENTS}}
Whether these segments are presented/assumed to be mutually exclusive (e.g. summed to equal a total population): {{EXCLUSIVITY_CLAIM}}
The entity type being segmented (e.g. customer, account, session): {{ENTITY_TYPE}}

Instructions:
1. For every pair of segments in {{SEGMENTS}}, check whether their defining conditions could both be true for the same {{ENTITY_TYPE}} at the same point in time. State this concretely: describe a plausible entity that would qualify for both, or state that no such entity is possible given the conditions as written.
2. Distinguish two kinds of overlap: definitional overlap (the conditions as literally written can both be true, e.g. "spent > $100 last 30 days" and "spent > $50 last 90 days" aren't mutually exclusive) versus timing overlap (an entity could legitimately move between segments within the report's time window, inflating a period sum even if the segments are exclusive at any single instant).
3. For each overlap found, state its likely practical impact: would it cause visible double-counting in a summed total, or is it a narrower edge case affecting few entities? Don't flag every theoretical overlap as equally urgent.
4. If {{EXCLUSIVITY_CLAIM}} states or implies the segments should sum to a known total (e.g. "New + Returning + Churned = all customers"), check whether the definitions as given would actually produce that property, or whether gaps (entities matching no segment) or overlaps (entities matching more than one) would break it.
5. Propose the minimal fix for each real overlap — usually a priority order (this entity counts as segment X only if it doesn't already qualify for higher-priority segment Y) or a tightened condition, not a full redesign of the segmentation scheme.

Output format: Markdown. A pairwise overlap table (Segment A, Segment B, Overlap Type, Practical Impact, Suggested Fix), followed by one line stating whether {{EXCLUSIVITY_CLAIM}}'s summed-total assumption currently holds.
```

## Variables
- `{{SEGMENTS}}` — the named segments and their qualifying conditions. Required.
- `{{EXCLUSIVITY_CLAIM}}` — whether/how the segments are assumed to partition the population. Required — determines whether an overlap is a real problem or just worth noting.
- `{{ENTITY_TYPE}}` — what's being segmented. Required — needed to reason concretely about whether an entity could satisfy two conditions at once.

## Example
**Input:** `{{SEGMENTS}}` = "New: first purchase within last 30 days. Active: at least 1 purchase within last 90 days. At-Risk: no purchase in last 60-120 days but had a purchase before that." `{{EXCLUSIVITY_CLAIM}}` = "Report sums New + Active + At-Risk + Churned counts and presents it as 'total customer base.'" `{{ENTITY_TYPE}}` = "customer"

**Output (excerpt):**
```
| Segment A | Segment B | Overlap Type | Practical Impact | Suggested Fix |
|---|---|---|---|---|
| New | Active | Definitional | High — a customer whose first purchase was 10 days ago satisfies both "first purchase within 30 days" and "at least 1 purchase within 90 days." Every New customer is also, by these definitions, Active. | Add explicit priority: a customer counts as New only if their first purchase qualifies them; exclude New customers from the Active count, or rename Active to mean "returning, i.e., 2+ purchases within 90 days" to make the conditions non-overlapping. |
| Active | At-Risk | Timing | Low-to-medium — a customer with a purchase 85 days ago and another 15 days ago is Active, not At-Risk; the conditions as written don't overlap at a single instant, but a customer's segment can flip within the report's period, which is expected and not a double-count as long as counts are taken at a single snapshot rather than unioned across the period. | No fix needed if the report snapshots at one point in time; flag explicitly if the report instead counts "was in segment X at any point this period." |

### Exclusivity Check
{{EXCLUSIVITY_CLAIM}}'s assumption does not currently hold: the New/Active overlap means every New customer is double-counted in the summed total. Fix the priority rule above before trusting the "total customer base" figure.
```

## Tips & Variations
- Distinct from `dashboard-metric-definition-auditor` (data-and-analysis, already shipped), which flags ambiguous *wording* in how a metric is defined; this prompt checks whether a *set* of segment definitions, even if each is individually well-worded, overlaps in membership.
- Pair with `cohort-analysis-setup-guide` (data-and-analysis, already shipped) when setting up a new cohort scheme from scratch — run this audit once the cohort boundaries are drafted, before the analysis runs.
- If {{SEGMENTS}} is large (more than ~5-6 segments), consider running this in two passes: first flag which pairs are even plausible candidates for overlap (segments sharing a similar underlying metric or time window), then do the detailed pairwise check only on those.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

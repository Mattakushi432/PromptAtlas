---
id: data-story-narrative-builder-for-executives
title: Data Story Narrative Builder for Executives
category: data-and-analysis
tags: [data-analysis, data-visualization]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Turns a set of analysis findings into a narrative structured for an executive audience — headline takeaway first, each supporting point tied to a specific number, and an explicit recommended action — rather than a methodology-first walkthrough that buries the point. Distinct from `architecture-decision-stakeholder-briefing` (coding, already shipped), which translates a technical architecture decision for a non-technical audience; this prompt structures a data-analysis finding, not an engineering decision, for the same kind of audience.

## When to use it
- You've finished an analysis and have the findings, but need to turn them into a presentation or written update that leads with the answer instead of the process that got you there.
- You're preparing to present to executives who will read the first slide/paragraph and decide whether to keep engaging — and want to make sure the headline actually is the headline, not the setup.
- A colleague's draft data narrative buries the actual recommendation in the fourth paragraph, and you want a restructured version that leads with it.

## The Prompt

```
You turn a set of analysis findings into a narrative structured for an executive audience: headline first, evidence second, recommendation explicit.

Business question that prompted the analysis: {{BUSINESS_QUESTION}}
Findings (the metrics, trends, or comparisons the analysis produced): {{FINDINGS}}
Audience and what they'll do with this (e.g. "VP deciding whether to fund expansion," "board update, no decision needed this cycle"): {{AUDIENCE_CONTEXT}}

Instructions:
1. Write the headline takeaway first — one sentence stating the answer to {{BUSINESS_QUESTION}}, not a description of what was analyzed. "We should do X because Y" beats "We analyzed Z."
2. Select 2-3 supporting points from {{FINDINGS}} that most directly support the headline — not every finding the analysis produced. Each supporting point must cite a specific number; a supporting point without a number is an opinion, not evidence.
3. Order the supporting points by how directly each one supports the headline, not by the chronological order the analysis was conducted in — the audience doesn't need to follow your process, they need to be convinced of your conclusion.
4. If {{FINDINGS}} contains a data point that complicates or partially contradicts the headline, do not omit it — state it explicitly as a caveat and explain why the headline still holds despite it (or, if it genuinely undermines the headline, say so and revise the headline rather than hiding the tension).
5. End with an explicit "so what": the specific decision or action the data supports, framed for what {{AUDIENCE_CONTEXT}} actually needs to do next — a recommendation to "monitor" or "investigate further" is a legitimate answer, but only if that's genuinely the strongest supported action, not a hedge to avoid committing to a real recommendation the data supports.
6. Do not include methodology detail (how the data was pulled, what tool was used, sample construction) in the main narrative — if it's necessary for credibility or audit purposes, put it in an appendix note separate from the narrative flow.

Output format: Markdown with `## Headline`, `## Supporting Points` (numbered, each with its number and one-sentence significance), `## Caveat` (if applicable — omit the section if none), `## Recommendation`.
```

## Variables
- `{{BUSINESS_QUESTION}}` — the question the analysis was meant to answer. Required — without it, there's no way to judge which findings are actually relevant to the headline.
- `{{FINDINGS}}` — the actual metrics/trends/comparisons the analysis produced. Required.
- `{{AUDIENCE_CONTEXT}}` — who's receiving this and what decision (if any) it's meant to inform. Required — the recommendation's framing and urgency depend entirely on this.

## Example
**Input:** `{{BUSINESS_QUESTION}}` = "Should we expand the free trial from 14 to 30 days?" `{{FINDINGS}}` = "Users who convert do so at a median of day 11. Extending a pilot cohort's trial to 30 days increased conversion rate from 18% to 21%, but also increased average time-to-conversion and support ticket volume during the trial by 15%. Revenue per converted user was unchanged." `{{AUDIENCE_CONTEXT}}` = "VP of Growth deciding whether to roll this out to all new signups next quarter."

**Output (excerpt):**
```
## Headline
Extend the trial to 30 days for all new signups — the pilot shows a meaningful conversion lift with a manageable, known cost.

## Supporting Points
1. Conversion rate rose from 18% to 21% in the pilot cohort — a 3-point lift on the metric this decision is meant to move.
2. Revenue per converted user was unchanged, meaning the lift is additive rather than users converting to a lower-value plan or converting later for a smaller reason.

## Caveat
Support ticket volume during the trial period rose 15% in the pilot. This is a real cost, not to be waved away, but it's a support-capacity question, not a reason to reverse the recommendation — flag it to the support team ahead of rollout rather than treating it as a blocker.

## Recommendation
Roll out the 30-day trial to all new signups next quarter, with a heads-up to the support team to staff for the ~15% ticket-volume increase observed in the pilot. If conversion lift or support cost look meaningfully different at full scale than in the pilot, revisit after one quarter of full-rollout data.
```

## Tips & Variations
- Pair with `chart-type-recommender-for-a-dataset-shape` (data-and-analysis, already shipped) once the narrative structure is set — that prompt helps pick the right visualization for each supporting point's number, once you know which numbers actually need a chart versus a single cited figure.
- If {{FINDINGS}} is inconclusive or doesn't clearly support a specific action, resist forcing this prompt to manufacture a confident headline — an honest "here's what we know, here's what we don't, here's what would resolve it" is a legitimate output when that's genuinely where the analysis landed.
- For a recurring metrics update (not a one-off analysis), reuse the same {{BUSINESS_QUESTION}} framing each cycle so trend changes are visible period-over-period, rather than re-deriving a fresh headline structure each time that makes comparison across updates harder.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

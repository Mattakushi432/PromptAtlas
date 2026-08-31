---
id: quarterly-business-review-summarizer
title: Quarterly Business Review Summarizer
category: business-and-strategy
tags: [strategy, communication]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Synthesizes raw quarterly updates from multiple teams into one coherent QBR summary — leading with headline business results, grouping supporting detail by theme rather than by which team reported it, and explicitly flagging metrics that are notably absent rather than silently dropping them. Distinct from `data-story-narrative-builder-for-executives` (data-and-analysis, already shipped), which structures a single analysis finding into an executive narrative; this prompt synthesizes multiple teams' separate raw period updates into one business-wide review.

## When to use it
- Multiple teams have submitted their quarterly updates separately and you need one coherent QBR document rather than a stapled-together sequence of team reports.
- You want to check whether this quarter's updates are missing anything the board/leadership would expect to see reported, before it becomes obvious in the meeting itself.
- You're preparing a QBR and want the headline result stated up front rather than reconstructed by the reader from scattered team-level details.

## The Prompt

```
You synthesize multiple teams' raw quarterly updates into one coherent business review. You do not simply concatenate team reports in the order given — you restructure around business themes and lead with the actual headline result.

Raw team updates (as submitted, one per team): {{TEAM_UPDATES}}
Business context (what mattered most this quarter, per leadership priorities): {{QUARTER_CONTEXT}}
Metrics/topics this audience expects to see every quarter, if there's a standing list: {{EXPECTED_METRICS}}

Instructions:
1. State the headline business result first — the single most important takeaway across all teams' updates, judged against {{QUARTER_CONTEXT}}, not just whichever team's update happened to come first in {{TEAM_UPDATES}}.
2. Regroup the supporting content by business theme (e.g. growth, retention, product delivery, operational efficiency) rather than by which team submitted it — a single theme's story is often split across multiple team updates and reads as fragmented if left in submission order.
3. Within each theme, synthesize rather than list: if two teams' updates both bear on the same theme, connect them into one coherent point rather than presenting them as two separate bullets that happen to sit near each other.
4. If {{EXPECTED_METRICS}} is provided, check it against what {{TEAM_UPDATES}} actually reports — for any expected metric that's missing or unaddressed, add an explicit "Not reported this quarter: X" line rather than letting the omission pass silently. A metric quietly missing is itself information the audience needs, especially if it was reported in prior quarters.
5. Flag any team update that reports a number without enough context to interpret it (a metric moved, but no stated baseline or target) — note it as needing clarification rather than presenting an uninterpretable number as if it were a clear result.
6. If any two teams' updates appear to contradict each other (e.g. one team reports a launch as successful while another team's data suggests otherwise), surface the tension explicitly rather than silently picking one version to include.

Output format: Markdown. Headline result first (one paragraph). Then sections by business theme, each synthesizing the relevant team updates. A "Not Reported / Needs Clarification" section listing any {{EXPECTED_METRICS}} gaps or under-contextualized numbers. End with a one-paragraph overall quarter assessment.
```

## Variables
- `{{TEAM_UPDATES}}` — the raw updates as submitted by each team/function. Required.
- `{{QUARTER_CONTEXT}}` — what leadership considered the quarter's top priorities, used to judge which result is actually the headline. Required — without it, "headline result" defaults to whichever number is biggest rather than whichever mattered most.
- `{{EXPECTED_METRICS}}` — a standing list of metrics/topics this audience expects reported every quarter, if one exists. Optional, but sharpens the gap-detection check significantly.

## Example
**Input:** `{{TEAM_UPDATES}}` = "Sales: closed $1.2M in new ARR, up from $900K last quarter. Product: shipped the new billing system, no metrics on adoption yet. Support: ticket volume up 15%, no explanation given." `{{QUARTER_CONTEXT}}` = "Leadership's top priority this quarter was proving the new billing system doesn't create support burden." `{{EXPECTED_METRICS}}` = "New ARR, churn rate, support ticket volume, NPS"

**Output (excerpt):**
```
### Headline Result
The new billing system shipped this quarter, but the update set doesn't yet answer leadership's top priority question — whether it created support burden — since Support's 15% ticket volume increase has no stated cause, and Product's update includes no adoption data to connect the two.

### Product Delivery & Support Impact
Product shipped the new billing system this quarter. Support reported a 15% increase in ticket volume over the same period, with no stated cause — this is the single most important connection this QBR needs to make, and it currently can't be made from what's reported. Recommend explicitly asking Support/Product to categorize ticket causes before the review, since an unexplained 15% jump immediately following a billing system launch will be the first thing leadership asks about.

### Growth
Sales closed $1.2M in new ARR, up from $900K last quarter — a strong result on its own, though not what {{QUARTER_CONTEXT}} flagged as top priority this quarter.

### Not Reported / Needs Clarification
- Churn rate: expected per {{EXPECTED_METRICS}}, not included in any team's update this quarter.
- NPS: expected per {{EXPECTED_METRICS}}, not included.
- Support ticket increase: reported without a stated cause — needs clarification before the review, given its direct relevance to this quarter's top priority.
```

## Tips & Variations
- Run this before the QBR meeting, not during — the value is in surfacing gaps and connections (like the billing/support link above) with enough lead time to actually go get the missing data, not just to narrate the meeting afterward.
- Pair with `board-deck-narrative-tightener` (business-and-strategy, already shipped) once this synthesis exists, if the QBR needs to become an actual board deck rather than a written summary — that prompt restructures a drafted deck's slide order and throughline; this one produces the underlying synthesized content first.
- If {{TEAM_UPDATES}} spans many teams (10+), consider running this prompt in two passes: once per major function grouping, then a final pass synthesizing those groupings into the top-level headline and themes — a single pass across too many raw updates risks shallow synthesis rather than genuine connection-finding.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

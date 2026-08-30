---
id: investor-update-drafter
title: Investor Update Drafter
category: business-and-strategy
tags: [fundraising, investor-relations, drafting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Drafts a regular investor update (metrics, wins, challenges, asks) from a founder's rough notes — a drafting tool that organizes real information into the standard investor-update shape, distinct from a pitch deck: this is ongoing-relationship communication, honest about both good and bad news, not a persuasion document.

## When to use it
- It's time for your regular (monthly/quarterly) investor update and you have scattered notes/metrics that need to become a coherent, sendable email.
- You're behind on updates and dreading writing one because there's bad news to include — this prompt is built to help you say it honestly, not spin it away.
- You want a consistent structure across updates so investors can scan and compare over time rather than parsing a differently-organized email each time.

## The Prompt

```
You draft an investor update from a founder's rough notes. You organize what's actually happened — you do not spin bad news into false positives, and you do not invent metrics or context not in the notes.

Notes (metrics, events, challenges): {{NOTES}}
Update period: {{PERIOD}}
Specific asks (if any): {{ASKS}}

Instructions:
1. Structure the update as: Headline (one-sentence summary of the period, honest about direction — up, flat, or down), Key Metrics (the actual numbers given, with trend vs. last period if available), Wins, Challenges, and Asks (if any).
2. In Challenges, do not write around bad news with vague euphemism ("we're optimizing our approach") — state what happened plainly and, if the notes include one, what's being done about it. If the notes don't include a response to a challenge yet, don't invent one — say the team is still assessing it.
3. If {{NOTES}} shows a metric moving in a bad direction, do not bury it below several wins to soften it — investors specifically value updates that surface problems early, and burying bad news erodes trust more than the bad news itself does.
4. For {{ASKS}}, be specific about what kind of help is wanted (an intro to a specific type of contact, advice on a specific decision, not a vague "let us know if you can help") — vague asks get ignored; specific ones are actionable.
5. Keep the tone direct and factual rather than promotional — investor updates that read like marketing copy lose credibility over time, even when the news is genuinely good.
6. Keep it scannable: an investor reading many of these should be able to get the headline and key numbers in under 30 seconds even if they don't read the full thing.

Output format: Markdown with `## Headline`, `## Key Metrics`, `## Wins`, `## Challenges`, and `## Asks` (omit Asks section if none given).
```

## Variables
- `{{NOTES}}` — the founder's raw notes: metrics, events, wins, problems. Required.
- `{{PERIOD}}` — the time period this update covers. Required.
- `{{ASKS}}` — specific things the founder wants from investors this update. Optional — omit the section if there's nothing to ask.

## Example
**Input:** `{{NOTES}}` = "MRR grew from $40k to $45k this month (12.5% growth, down from 18% last month). Closed 2 new enterprise deals. Lost our head of sales unexpectedly — she gave 2 weeks notice, reason personal. Haven't started backfilling yet." `{{PERIOD}}` = "March 2026" `{{ASKS}}` = "Intros to VP Sales candidates with enterprise SaaS experience"

**Output (excerpt):**
```
## Headline
Solid revenue growth this month (12.5% MoM) alongside a significant team change: our Head of Sales departed unexpectedly, and we haven't yet started the search for a replacement.

## Key Metrics
- MRR: $45k (up from $40k, +12.5% MoM — down from 18% growth last month)

## Wins
- Closed 2 new enterprise deals in March.

## Challenges
- Our Head of Sales gave notice this month for personal reasons and has now departed. We haven't yet started actively backfilling the role — this is a gap we need to move on quickly given the enterprise momentum we're building.

## Asks
- Intros to VP Sales candidates with enterprise SaaS experience — this is now a priority hire given the gap above.
```

## Tips & Variations
- If growth is decelerating (as in the example), don't let the raw MoM percentage stand alone without the prior-period comparison — investors read trend, not just the single number, and omitting the comparison can look evasive even unintentionally.
- For a board update (a smaller, higher-context audience) rather than a broad investor update, this same structure works but can go deeper on operational detail than a wider update list would want.
- Save past updates and periodically ask this prompt to check the current draft's metrics against the last one or two for internal consistency (e.g. a number that doesn't reconcile with what was reported last time) before sending.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

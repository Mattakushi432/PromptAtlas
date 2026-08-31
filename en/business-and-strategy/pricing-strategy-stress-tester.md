---
id: pricing-strategy-stress-tester
title: Pricing Strategy Stress-Tester
category: business-and-strategy
tags: [pricing, strategy]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Stress-tests a proposed pricing strategy (tiers, price points, packaging) against realistic customer and competitor reactions — where a segment would churn, downgrade, or route around a price increase, and where a competitor's likely response undermines the plan — rather than evaluating the pricing model in a vacuum.

## When to use it
- You're proposing a pricing change (new tiers, a price increase, repackaging features across plans) and want to find the weak points before it goes to leadership or gets announced to customers.
- A pricing model looks clean on a spreadsheet but you suspect it doesn't hold up against how specific customer segments will actually behave.
- You want a structured second opinion on pricing strategy before committing engineering/billing-system work to implement it.

## The Prompt

```
You stress-test a proposed pricing strategy against realistic customer and competitor reactions. You are not validating the pricing math — you are identifying where real-world behavior would undermine the plan's assumptions.

Proposed pricing strategy (tiers, price points, what's included in each): {{PRICING_PROPOSAL}}
Current customer segments and their approximate usage/spend patterns: {{CUSTOMER_SEGMENTS}}
Known competitor pricing, if relevant: {{COMPETITOR_CONTEXT}}

Instructions:
1. For each customer segment in {{CUSTOMER_SEGMENTS}}, walk through how the proposed pricing actually affects them — do they land in a tier that costs meaningfully more for the same usage, get pushed to a tier with features they don't need, or lose access to something they currently rely on? State the specific segment-level impact, not a general "some customers may be affected."
2. Identify the most likely "gaming" or workaround behavior each segment could adopt to avoid a price increase without actually reducing their usage of the product (e.g. splitting one account into multiple to stay under a tier's usage cap, downgrading to a lower tier and workaround-ing the missing feature) — a pricing change that's easy to route around doesn't achieve its intended revenue effect.
3. Identify the segment most likely to churn outright rather than absorb or route around the change, and estimate (qualitatively, from what {{CUSTOMER_SEGMENTS}} states about their usage/spend) whether that segment's revenue loss risk is being weighed against the revenue gain from the rest.
4. If {{COMPETITOR_CONTEXT}} is provided, check whether the new pricing creates an obvious gap a competitor could exploit (a price point now meaningfully above a comparable competitor offering for the same tier) and flag it as a competitive risk, not just an internal pricing question.
5. Check for packaging inconsistencies: does a lower tier's exclusions create an awkward "why would I ever buy this tier" gap, or does a higher tier's inclusions overlap so much with a lower one that there's no clear upgrade motivation?
6. Flag any pricing change that would require existing customers to be grandfathered, migrated, or notified in a way not addressed by {{PRICING_PROPOSAL}} — a pricing model that's sound for new customers but has no stated transition plan for existing ones is an incomplete proposal, not a flaw in the pricing logic itself, but still a real gap to surface.

Output format: Markdown with sections: Segment-by-Segment Impact, Workaround/Gaming Risks, Churn Risk, Competitive Exposure (if {{COMPETITOR_CONTEXT}} given), Packaging Gaps. End with a one-paragraph summary of the single highest-risk finding and what would need to change to address it.
```

## Variables
- `{{PRICING_PROPOSAL}}` — the proposed tiers, price points, and what each tier includes/excludes. Required.
- `{{CUSTOMER_SEGMENTS}}` — the current customer base broken into segments with their approximate usage and spend patterns. Required — without this, segment-level impact can't be assessed, only generic pricing-theory commentary.
- `{{COMPETITOR_CONTEXT}}` — known competitor pricing for comparable tiers/features, if relevant to this market. Optional, but strengthens the competitive-exposure check.

## Example
**Input:** `{{PRICING_PROPOSAL}}` = "New 'Team' tier caps seats at 10 for $200/mo (was unlimited seats at that price); a new 'Business' tier at $500/mo removes the cap." `{{CUSTOMER_SEGMENTS}}` = "Segment A: ~30 customers currently on the old unlimited-seat plan with 11-15 seats each, paying $200/mo. Segment B: ~200 customers with under 10 seats, paying $200/mo." `{{COMPETITOR_CONTEXT}}` = "Main competitor offers unlimited seats at $350/mo, no tiering by seat count."

**Output (excerpt):**
```
### Segment-by-Segment Impact
Segment A (11-15 seats, currently $200/mo) is pushed above the new Team tier's 10-seat cap and must move to the $500/mo Business tier — a 150%+ price increase for no change in what they're actually using the product for.
Segment B (under 10 seats) is unaffected by the cap and continues at $200/mo under the new Team tier.

### Workaround/Gaming Risks
Segment A has an easy workaround: split into two Team-tier accounts (e.g. two 6-8 seat teams) to stay under the 10-seat cap at $200/mo each — likely still cheaper than one $500/mo Business account, while creating account-management overhead that doesn't serve either the customer or the product's actual usage tracking.

### Churn Risk
Segment A is the highest churn risk: a 150% price jump with an easy workaround available means many will either fragment their account (reducing per-account revenue below the intended $500/mo target) or churn to the competitor, who offers unlimited seats at $350/mo — cheaper than the new Business tier and without a seat cap to navigate at all.

### Competitive Exposure
The $500/mo Business tier is priced above the named competitor's $350/mo unlimited-seat offering, with no differentiating feature stated — this specific segment now has a cheaper, simpler competitor option they didn't have reason to consider before this pricing change.

Summary: The highest-risk finding is Segment A's exposure to both an easy internal workaround (account splitting) and an external competitor option priced below the new tier — either response undermines the pricing change's intended revenue gain from this segment. Consider a seat-count-based add-on price instead of a hard tier jump, to avoid creating a cliff that's both game-able and pushes customers toward a now-cheaper competitor.
```

## Tips & Variations
- Pair with `risk-register-builder` (business-and-strategy, already shipped) to formally track the highest-risk findings from this stress test (e.g. Segment A churn risk) as tracked risks with owners and mitigation, rather than letting them stay as one-off findings in this review.
- This prompt reasons from stated segment behavior; for a high-stakes pricing change, validate the workaround-likelihood findings against actual customer research or a small pilot rather than treating this analysis as sufficient on its own — behavioral predictions from a model are a starting hypothesis, not a substitute for real signal.
- If {{PRICING_PROPOSAL}} is an increase applied uniformly with no new tiers or packaging changes, several sections here (packaging gaps, tier-jump workarounds) won't apply — the prompt still works, but expect the review to concentrate on churn risk and competitive exposure instead.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

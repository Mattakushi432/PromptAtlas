---
id: competitive-battlecard-builder
title: Competitive Battlecard Builder
category: marketing-and-sales
tags: [sales-enablement, competitive-analysis]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Builds a sales battlecard for a specific competitor — honest strengths and weaknesses on both sides, the specific objection-handling talk track for common competitor claims, and disqualifying signals for when the competitor is actually the better fit — distinct from `competitive-landscape-synthesizer` (business-and-strategy, already shipped), which maps a broad competitive landscape for strategic positioning, not a live sales-call reference document for one specific competitor.

## When to use it
- A sales team keeps losing or struggling against a specific named competitor and needs a reference document reps can actually use live on a call, not a strategic market-positioning deck.
- You're onboarding new sales reps and want them to have honest, defensible talking points about a competitor rather than reps improvising (sometimes badly) when a prospect brings the competitor up.
- A competitor just shipped a new feature or changed pricing and the existing battlecard needs updating with the new specifics rather than vague, dated positioning.

## The Prompt

```
You build a sales battlecard for one specific named competitor. You are honest about your own product's real weaknesses relative to this competitor, not just where you win — a battlecard a rep can't trust because it only ever claims superiority isn't useful in an actual sales conversation.

Competitor: {{COMPETITOR}}
Your product's actual strengths and weaknesses relative to this competitor: {{COMPARISON_FACTS}}
Common claims or objections reps hear this competitor's name attached to: {{COMMON_CLAIMS}}

Instructions:
1. State genuine, specific differentiators where {{COMPARISON_FACTS}} supports a real advantage — not generic superiority claims ("we're more innovative") but concrete, checkable differences (a specific feature, a specific pricing structure, a specific integration).
2. State genuine weaknesses relative to {{COMPETITOR}} honestly, based on {{COMPARISON_FACTS}} — a rep who gets blindsided by a weakness the battlecard didn't mention loses credibility with the prospect; the battlecard should prepare them for it instead.
3. For each common claim/objection in {{COMMON_CLAIMS}}, write a specific talk-track response — not a dismissive "that's not true" but a response that acknowledges what's actually true about the claim (if anything) and reframes toward the actual decision criteria that favor your product.
4. Identify disqualifying signals: specific buyer situations where {{COMPETITOR}} is genuinely the better fit, and the rep should recognize this rather than fight a losing battle — a rep who tries to win every single deal against a competitor that's genuinely better for a specific use case burns credibility and wastes the deal cycle.
5. Flag anything in {{COMPARISON_FACTS}} or {{COMMON_CLAIMS}} that's likely to go stale quickly (a specific price point, a feature comparison tied to a product version) so the card gets flagged for review rather than silently going out of date.
6. Keep the talk-track language conversational and usable live on a call — a rep reading a dense paragraph mid-conversation doesn't work; short, quotable framings a rep could actually say out loud are more useful than comprehensive prose.

Output format: Markdown with sections: Where We Win (with proof points), Where They Win (honest), Objection Talk-Tracks (one per common claim), Disqualifying Signals (when to concede the deal), and a "Review by" flag for anything time-sensitive.
```

## Variables
- `{{COMPETITOR}}` — the specific named competitor. Required.
- `{{COMPARISON_FACTS}}` — actual, factual comparison points between the two products (features, pricing, integrations, target segment) — the more specific and current, the better the battlecard. Required.
- `{{COMMON_CLAIMS}}` — what prospects actually say this competitor claims or what reps commonly hear, if known. Optional, but sharpens the talk-tracks toward real objections rather than generic ones.

## Example
**Input:** `{{COMPETITOR}}` = "Rival Co." `{{COMPARISON_FACTS}}` = "We have native Salesforce integration, they require a third-party connector. They have a lower entry price ($15/mo vs our $29/mo) but cap at 3 users on their entry tier vs our 10. They've been in market 5 years longer and have more case studies in enterprise retail." `{{COMMON_CLAIMS}}` = "Prospects often say 'Rival Co. is cheaper' without accounting for the user cap difference"

**Output (excerpt):**
```
### Where We Win
- Native Salesforce integration (Rival Co. requires a third-party connector, adding setup complexity and an ongoing point of failure) — concrete, checkable differentiator, not a vague "better integration" claim.
- Entry tier supports 10 users vs. Rival Co.'s 3-user cap — matters specifically for a prospect evaluating team-wide adoption, not a solo user.

### Where They Win (honest)
- Lower headline entry price ($15 vs $29/mo) — true at face value; the real comparison only favors us once user count is factored in, so don't pretend the sticker-price gap doesn't exist.
- 5 years longer in market with more enterprise retail case studies — if the prospect is specifically enterprise retail and case-study-driven in their evaluation, this is a real gap we don't currently close.

### Objection Talk-Track: "Rival Co. is cheaper"
Acknowledge the headline price is real, then reframe on the metric that actually matters for a team: "Their $15/mo is real, but that's capped at 3 users — once you're above that, you're either paying per-seat overages or upgrading tiers. At 10 users, our $29/mo entry tier already covers your team; a straight per-seat comparison at your actual team size is usually more favorable for us." (Ask their actual team size before finishing this response — the reframe only lands if it's true for them specifically.)

### Disqualifying Signal
If the prospect is specifically enterprise retail and case-study-driven (wants to see peer companies in their exact vertical), don't over-invest in winning this deal — Rival Co.'s longer market presence in that specific vertical is a real, current gap, not a spin-able weakness.

Review by: the $15/$29 price comparison — flag for review if either company changes pricing, since this specific number is the crux of the most common objection.
```

## Tips & Variations
- Pair with `competitive-landscape-synthesizer` (business-and-strategy, already shipped) when building the first battlecard for a newly-significant competitor — that prompt maps the broader competitive picture first; this prompt turns one specific competitor from that map into a live, usable sales reference.
- Update this battlecard whenever {{COMPARISON_FACTS}} changes materially (a competitor ships a feature, changes pricing) rather than on a fixed schedule — a stale battlecard that reps stop trusting is worse than no battlecard, since it erodes confidence in the next one too.
- Test the "Where They Win" section with an actual sales rep before distributing widely — a battlecard's credibility depends entirely on reps trusting it's honest, and a rep who catches an omitted competitor strength in a live call will stop relying on the document for anything.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

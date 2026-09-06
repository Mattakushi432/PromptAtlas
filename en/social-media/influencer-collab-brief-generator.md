---
id: influencer-collab-brief-generator
title: Influencer Collab Brief Generator
category: social-media
tags: [influencer-marketing, social-media]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Drafts a creator/influencer collaboration brief structured to attract quality creators — clear on the campaign goal and required legal/disclosure items, but deliberately distinguishing what's required from what's merely suggested, so the creator retains enough creative latitude that experienced creators don't decline it as a restrictive corporate mandate that produces content their own audience can tell is inauthentic.

## When to use it
- You're reaching out to a creator/influencer for a collaboration and need a brief that's clear and professional without reading like a rigid script that leaves no room for the creator's own voice.
- You've had creators decline or under-deliver on past briefs and suspect the brief itself was too restrictive or too vague, rather than the creators being a poor fit.
- You want to check a drafted brief for the specific failure patterns that make experienced creators wary (over-specifying exact wording, burying legal requirements without explanation, no clarity on what's actually required vs. nice-to-have).

## The Prompt

```
You draft a creator/influencer collaboration brief. You are clear about what's actually required (campaign goal, legal/disclosure obligations, deliverable format) while deliberately preserving creative latitude on everything else — a brief that reads as a rigid script tends to produce inauthentic content and gets declined by experienced creators who protect their own voice.

Campaign goal: {{CAMPAIGN_GOAL}}
Budget range: {{BUDGET_RANGE}}
Target audience the campaign is trying to reach: {{TARGET_AUDIENCE}}
Product/brand details the creator needs to know: {{PRODUCT_DETAILS}}
Required legal/disclosure requirements (e.g. #ad, FTC disclosure language, platform-specific rules): {{LEGAL_REQUIREMENTS}}

Instructions:
1. State {{CAMPAIGN_GOAL}} clearly and explain why it matters for this specific collaboration — a creator who understands the actual goal (awareness vs. conversions vs. a specific launch) can make better creative decisions than one just following a content checklist blindly.
2. Separate deliverables into two explicit categories: Required (specific content format/count, must-include legal disclosure, any must-include product detail that's factually necessary) and Suggested (talking points, angles, or themes the creator can use, adapt, or replace with their own approach) — do not blur these into one list, since that's exactly what makes a brief feel restrictive even when most of it is actually flexible.
3. State {{LEGAL_REQUIREMENTS}} explicitly and explain briefly why each exists (e.g. "FTC requires clear and conspicuous disclosure of paid partnerships — please include #ad within the first line of the caption, not buried at the end") rather than listing legal requirements as unexplained rules, since creators are more likely to comply correctly when they understand the reason, not just the requirement.
4. Explicitly state what creative freedom the creator retains: their own voice/tone, their own visual style, and (where genuinely true) even some latitude on exact talking points as long as the required factual/legal elements are included — say this directly rather than leaving the creator to assume the brief's suggested content is actually mandatory.
5. Include practical logistics: timeline (content due date, posting window), the review/approval process if any (and how many revision rounds, since an unlimited-revisions expectation is a common source of creator frustration if not stated upfront), and payment/compensation terms tied to {{BUDGET_RANGE}}.
6. Keep the overall brief concise — a brief padded with excessive brand background or generic marketing language before getting to the actual ask reads as corporate and impersonal; lead with the collaboration ask and goal, not a company history section.

Output format: Markdown with sections: Campaign Goal, Required Deliverables, Suggested (Not Required) Talking Points/Angles, Legal & Disclosure Requirements (with brief rationale), Creative Freedom, Timeline & Process, Compensation.
```

## Variables
- `{{CAMPAIGN_GOAL}}` — what this collaboration is actually meant to achieve. Required.
- `{{BUDGET_RANGE}}` — the compensation range for this collaboration. Required.
- `{{TARGET_AUDIENCE}}` — who the campaign is trying to reach, to help the creator understand fit and angle. Required.
- `{{PRODUCT_DETAILS}}` — factual details about the product/brand the creator needs to represent it accurately. Required.
- `{{LEGAL_REQUIREMENTS}}` — the specific disclosure/legal rules that apply (varies by region, platform, and campaign type). Required — omitting this risks a brief that doesn't actually ensure compliance.

## Example
**Input:** `{{CAMPAIGN_GOAL}}` = "Drive awareness for a new plant-based protein bar launch among fitness-focused audiences" `{{BUDGET_RANGE}}` = "$800-1,200 depending on creator reach/engagement" `{{TARGET_AUDIENCE}}` = "Fitness enthusiasts, 25-40, interested in nutrition" `{{PRODUCT_DETAILS}}` = "20g protein per bar, all-natural ingredients, 3 flavors launching, available online and in select gyms starting next month" `{{LEGAL_REQUIREMENTS}}` = "FTC disclosure required (#ad or #sponsored), must be in first line of caption per platform's paid partnership tool"

**Output (excerpt):**
```
## Campaign Goal
We're launching a new plant-based protein bar and want to build awareness with fitness-focused audiences who care about nutrition, not just any general audience. We're looking for your genuine take on it, not a scripted read.

## Required Deliverables
- 1 in-feed post (photo or video, your choice of format) featuring the product
- Must mention: 20g protein per bar, all-natural ingredients (these are factual claims we need represented accurately)
- Paid partnership disclosure per Legal section below

## Suggested (Not Required) Talking Points/Angles
- Your own experience trying the product (taste, how it fits your routine)
- Comparing it to other protein bars you've used, if relevant to your content style
- The 3-flavor launch, if it fits naturally — not required to mention all three

These are starting points, not a script — use your own words and angle. If a different framing genuinely fits your content better and still covers the required factual points above, go with what feels authentic to you.

## Legal & Disclosure Requirements
FTC requires clear and conspicuous disclosure of paid partnerships. Please use your platform's built-in paid partnership tool AND include #ad or #sponsored within the first line of your caption (not buried at the end) — this protects both of us and keeps your audience's trust intact.

## Creative Freedom
Your voice, your visual style, your own words for the talking points above. We're not looking for brand-scripted language — we chose to work with you because of how you already talk to your audience.
```

## Tips & Variations
- Pair with `sales-outreach` style thinking from `cold-outreach-personalizer-at-scale` (marketing-and-sales, already shipped) when reaching out to creators who haven't worked with the brand before — the initial outreach message and this brief are different documents, but both benefit from the same "specific and genuine, not templated" principle.
- If budget allows only a narrow {{BUDGET_RANGE}}, be upfront about it rather than vague — creators (especially more established ones) often decline briefs that are vague about compensation until late in the conversation, since it reads as a negotiating tactic rather than straightforward business practice.
- For a larger campaign involving multiple creators, resist the urge to make the brief maximally prescriptive "for consistency" — genuine creator-specific authenticity across a diverse creator roster usually serves the campaign's actual reach and credibility better than uniform, obviously-scripted content across every participant.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

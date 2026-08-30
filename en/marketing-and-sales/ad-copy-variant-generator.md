---
id: ad-copy-variant-generator
title: Ad Copy Variant Generator for A/B Testing
category: marketing-and-sales
tags: [paid-ads, ad-copy, copywriting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Generates a set of ad copy variants for A/B testing from one offer/angle, each varying the actual persuasion approach (not just rewording), sized to a specified platform's character limits — a paid-ads-specific tool covering full ad structure (headline, body, CTA) against platform character limits, not a general-purpose headline generator.

## When to use it
- Setting up a new paid ad campaign and need a real test set of variants, not five near-identical rewordings of the same angle.
- An existing ad's performance has plateaued and you want fresh variants that test genuinely different angles against it.
- You need copy that fits a specific platform's character limits (Google Search Ads headlines, Meta primary text, LinkedIn ad copy) without manually counting characters.

## The Prompt

```
You generate ad copy variants for A/B testing. Each variant must use a genuinely different persuasion angle — not a reworded version of the same angle — and must fit the specified platform's character limits exactly.

Offer: {{OFFER}}
Platform: {{PLATFORM}}
Target audience: {{AUDIENCE}}
Number of variants: {{VARIANT_COUNT}}
Key proof point(s): {{PROOF_POINTS}}

Instructions:
1. Vary each variant across a genuinely different angle, drawn from: direct benefit-led, pain-point-led, social proof/proof-point-led, curiosity/question-led, urgency/scarcity-led (only if genuinely true — do not fabricate scarcity), and comparison/differentiation-led. Do not generate more variants than there are distinct angles to support — if {{VARIANT_COUNT}} exceeds the number of genuinely different angles available, say so and generate fewer rather than padding with near-duplicates.
2. Respect {{PLATFORM}}'s exact character limits for each copy element (e.g. Google Search headlines: 30 characters each; Meta primary text: no hard limit but ~125 characters before truncation on most placements) — state the character count for each element so it's verifiable, and if you're unsure of a platform's exact current limit, say so rather than guessing confidently.
3. Use {{PROOF_POINTS}} only in the variants where a proof point genuinely fits the angle (e.g. don't force a customer-count stat into a curiosity-led variant if it breaks the hook) — not every variant needs one.
4. Each variant needs a distinct, specific CTA appropriate to {{PLATFORM}}'s conventions, not a repeated generic "Learn More" across all variants.
5. Do not use unverifiable superlatives ("best," "#1," "the only") unless {{PROOF_POINTS}} actually substantiates the claim.

Output format: Markdown, one entry per variant: `### Variant N — [angle name]`, the copy broken into the platform's actual fields (e.g. Headline / Description / CTA for Google, Primary text / Headline / CTA for Meta), with a character count next to each field.
```

## Variables
- `{{OFFER}}` — what's being advertised and its core value prop. Required.
- `{{PLATFORM}}` — the specific ad platform and format (e.g. "Google Search Ads," "Meta feed ad," "LinkedIn single image ad"). Required — determines field structure and character limits.
- `{{AUDIENCE}}` — who's seeing this ad and what they likely already know. Required.
- `{{VARIANT_COUNT}}` — how many variants to generate (e.g. "4"). Required.
- `{{PROOF_POINTS}}` — real stats, customer counts, or case results. Optional but improves the social-proof-led variant specifically.

## Example
**Input:** `{{OFFER}}` = "Project management tool with built-in time tracking" · `{{PLATFORM}}` = "Google Search Ads" · `{{AUDIENCE}}` = "Small agency owners searching for PM tools" · `{{VARIANT_COUNT}}` = "3" · `{{PROOF_POINTS}}` = "Used by 5,000+ agencies"

**Output (excerpt):**
```
### Variant 1 — direct benefit-led
Headline 1: "Stop Switching Tools" (18 chars)
Headline 2: "PM + Time Tracking, One App" (27 chars)
Description: "Track time inside your project boards. No separate app, no double entry." (74 chars)

### Variant 2 — social-proof-led
Headline 1: "5,000+ Agencies Trust Us" (24 chars)
...
```

## Tips & Variations
- If testing across multiple platforms at once, run this prompt once per platform rather than one combined request — character limits and copy conventions differ enough that mixing them in one pass tends to produce copy that fits neither well.
- For a retargeting campaign (warmer audience, already familiar with the brand), note that explicitly in `{{AUDIENCE}}` — the angle mix should skew away from awareness-building and toward direct conversion angles.
- Pair with `landing-page-copy-critique` to check that the winning ad angle is actually reflected on the landing page it sends traffic to — a mismatch between ad angle and landing page framing is a common, avoidable conversion leak.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

---
id: icp-positioning-statement-drafter
title: ICP & Positioning Statement Drafter
category: marketing-and-sales
tags: [positioning, icp, marketing-strategy]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Turns rough notes about a product and its best customers into a structured ideal-customer-profile (ICP) description and a positioning statement (the classic "for X who need Y, our product is Z, unlike A, we B" shape) — a founder/early-stage tool for getting a first defensible draft down, not a full go-to-market strategy document.

## When to use it
- You're pre-seed/early-stage and have never written down your ICP or positioning formally — you know it intuitively but need it on paper to brief anyone (a hire, an investor, an agency).
- Your messaging feels scattered across the website, pitch deck, and sales calls because there's no single positioning statement anchoring them.
- You're about to enter a new segment or reposition and need a first draft to react to and sharpen, not a blank page.

## The Prompt

```
You draft an ICP (ideal customer profile) description and a positioning statement from a founder's rough notes about their product and customers. You organize and sharpen what's already implied in the notes — you do not invent a market, customer pain, or competitive claim that isn't grounded in what was given.

Product notes: {{PRODUCT_NOTES}}
Customer notes: {{CUSTOMER_NOTES}}
Known competitors/alternatives: {{COMPETITORS}}

Instructions:
1. Draft the ICP as: firmographics/demographics (company size, role, or relevant personal context), the specific trigger event or situation that makes them start looking for a solution, and what they're currently doing instead (including "nothing" as a valid current alternative).
2. Draft the positioning statement in the standard shape: "For {{TARGET_CUSTOMER}} who {{NEED_OR_TRIGGER}}, {{PRODUCT}} is a {{CATEGORY}} that {{KEY_BENEFIT}}. Unlike {{COMPETITORS}}, we {{KEY_DIFFERENTIATOR}}." Fill every slot from the notes given — if a slot has no basis in the notes (e.g. no competitor info given), leave it explicitly marked `[NEEDS INPUT: ...]` rather than inventing a plausible-sounding competitor or differentiator.
3. If {{CUSTOMER_NOTES}} describes more than one plausible customer type, do not silently pick one — present up to 2 distinct ICP candidates and flag that positioning against both at once usually dilutes the message, recommending the notes suggest focusing on one.
4. Check the differentiator specifically: if it's a feature ("we have X") rather than an outcome or a reason to believe ("which means you get Y, because Z"), flag it and suggest reframing toward the outcome the feature enables.
5. Do not use generic positioning-speak ("game-changing," "seamless," "next-generation") anywhere in the draft — if the notes contain that kind of language, translate it into something concrete or flag it as unsubstantiated.

Output format: Markdown with two sections — `## ICP` (the profile, plus alternate candidate if applicable) and `## Positioning Statement` (the filled template, plus a one-line note on any `[NEEDS INPUT: ...]` gaps).
```

## Variables
- `{{PRODUCT_NOTES}}` — what the product does, its category, and its main value prop, in the founder's own words. Required.
- `{{CUSTOMER_NOTES}}` — who's actually buying/using it today, and why, based on real observation (sales calls, user interviews) rather than a guess. Required — the quality of the ICP is bounded by how specific this is.
- `{{COMPETITORS}}` — what customers use instead, named competitors or generic alternatives ("spreadsheets," "doing it manually"). Optional but recommended — without it, the differentiator slot stays unfilled.

## Example
**Input:** `{{PRODUCT_NOTES}}` = "A tool that auto-generates onboarding checklists for new SaaS customers based on their plan tier and integrations." `{{CUSTOMER_NOTES}}` = "Customer success managers at 20-100 person B2B SaaS companies, usually the first CS hire, currently building onboarding checklists by hand in Notion or Google Docs and updating them manually per customer." `{{COMPETITORS}}` = "Generic project-management tools (Asana, Notion), or nothing formal at all."

**Output (excerpt):**
```
## ICP
- Role: First or early Customer Success hire at a 20-100 person B2B SaaS company.
- Trigger: Onboarding checklists are being maintained by hand and drifting out of sync as the product/plan tiers change.
- Current alternative: Notion/Google Docs templates manually copied and edited per customer, or no formal checklist at all.

## Positioning Statement
For early-stage B2B SaaS Customer Success teams who are maintaining onboarding checklists by hand, [Product] is an onboarding-checklist tool that auto-generates the right checklist per customer based on plan tier and integrations. Unlike generic project-management tools like Notion or Asana, we [NEEDS INPUT: specific mechanism — e.g. auto-sync with plan/integration data — not stated in product notes].
```

## Tips & Variations
- For a B2C product, replace the firmographics slot in the ICP with relevant demographic/behavioral context (life stage, existing habits) — the trigger-event and current-alternative structure still applies.
- Once the positioning statement is drafted, feed it into `tone-adapter` (writing-and-content) to produce a shorter, punchier one-liner version for a pitch deck or homepage hero, separate from this prompt's full-sentence template form.
- If you have more than a few sentences of customer notes (e.g. real interview transcripts), summarize them into 3-5 bullet points first — this prompt works from concise notes, not raw transcripts.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

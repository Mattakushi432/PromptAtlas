---
id: landing-page-copy-critique
title: Landing Page Copy Critique
category: marketing-and-sales
tags: [landing-pages, copywriting, conversion]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Critiques a landing page's copy section by section against conversion-focused criteria (clarity of offer, friction, trust signals, CTA strength) and proposes specific rewrites — a critique-and-fix tool, distinct from a copy generator: it assumes a draft already exists and needs a skeptical pass.

## When to use it
- A landing page is about to launch and needs a copy review before it goes live, especially from someone without a dedicated conversion copywriter on the team.
- A page is live but underperforming, and you want a structured hypothesis for why, section by section, rather than a vague "the copy feels off."
- You're reviewing a page drafted by someone else (agency, freelancer, teammate) and need specific, defensible feedback rather than a gut reaction.

## The Prompt

```
You critique landing page copy for conversion, section by section, and propose a specific rewrite for every finding.

Page copy (by section): {{PAGE_COPY}}
Target visitor and their state of mind arriving on this page: {{VISITOR_CONTEXT}}
Primary conversion goal: {{CONVERSION_GOAL}}

Instructions:
1. Review each section against: (a) clarity — can the visitor tell what this is and whether it's for them within 5 seconds; (b) friction — does anything create hesitation, confusion, or an unanswered objection at this point in the page; (c) trust — are claims backed by something concrete (proof, specificity) or left as unsubstantiated assertions; (d) CTA strength — is the call to action specific and low-friction relative to {{CONVERSION_GOAL}}, or generic ("Learn More," "Submit").
2. Pay specific attention to the hero section: does the headline communicate the actual value prop, or a vague aspirational statement that could apply to any product in the category? Flag generic headlines explicitly.
3. Check the page's claim-to-proof ratio: for every strong claim (a number, a superlative, a promise), is there a proof element nearby (a stat source, a testimonial, a specific example), or is it asserted alone? Flag unsubstantiated claims by name.
4. Consider {{VISITOR_CONTEXT}} throughout — copy that's fine for a warm, high-intent visitor may have too much friction for a cold visitor arriving from an ad, and vice versa (over-explaining to someone who already knows the category).
5. For every finding, give a specific rewrite, not just a description of the problem — "the headline is vague" isn't actionable on its own.
6. If a section is already strong, say so explicitly rather than inventing a nitpick — a critique that finds no genuine problems in a section builds more trust than one that manufactures issues everywhere.

Output format: Markdown, one entry per section with a finding: `### [Section name]` then `**Issue:** ...` and `**Rewrite:** ...`. End with a short "What's already working" list and a ranked top-3 "fix these first" summary.
```

## Variables
- `{{PAGE_COPY}}` — the page's copy broken into sections (hero, features, social proof, pricing, FAQ, CTA, etc.), ideally labeled. Required.
- `{{VISITOR_CONTEXT}}` — where visitors are coming from and what they know/want (e.g. "cold traffic from a paid ad, unfamiliar with the category" vs. "warm traffic from an email to existing free-trial users"). Required — the same copy can be right or wrong depending on this.
- `{{CONVERSION_GOAL}}` — the specific action the page wants (e.g. "start a free trial," "book a demo call," "download a whitepaper"). Required.

## Example
**Input:** `{{PAGE_COPY}}` = "Hero: 'The Future of Team Collaboration.' [Get Started] button." `{{VISITOR_CONTEXT}}` = "Cold traffic from a LinkedIn ad, unfamiliar with the product" · `{{CONVERSION_GOAL}}` = "Start a free trial"

**Output (excerpt):**
```
### Hero
**Issue:** Clarity — "The Future of Team Collaboration" is a generic aspirational headline that could describe nearly any collaboration tool; a cold visitor from an ad can't tell what this product actually does in 5 seconds.
**Issue:** CTA strength — "Get Started" doesn't state what happens next (sign-up form? demo booking? something else?), adding friction for a cold, unfamiliar visitor.
**Rewrite:** Headline: "[Specific mechanism] that gets your team's [specific outcome] without [specific pain point]." Button: "Start free trial — no credit card" (states the specific action and removes a common friction point up front).
```

## Tips & Variations
- For a page that's already live with analytics, add a note in `{{VISITOR_CONTEXT}}` about where visitors are actually dropping off (e.g. "40% exit after the pricing section") — this focuses the critique on the section with the most evidence behind it, rather than treating every section as equally suspect.
- Pair with `ruthless-line-editor` (writing-and-content) on any section flagged for being too wordy — this prompt identifies clarity/trust/friction problems, not length problems specifically.
- For a full page redesign brief rather than a critique of existing copy, this prompt isn't the right tool — it assumes a draft to react to, not a blank page.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

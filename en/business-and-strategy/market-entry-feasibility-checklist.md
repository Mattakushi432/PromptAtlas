---
id: market-entry-feasibility-checklist
title: Market Entry Feasibility Checklist
category: business-and-strategy
tags: [market-research, strategy]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Produces a feasibility checklist for entering a specific target market — regulatory barriers, competitive intensity, distribution access, localization needs, and capital requirements — explicitly separating what can be assessed from the given description versus what's an unknown requiring real research, rather than presenting a false sense of completeness.

## When to use it
- You're considering expanding into a new geographic or vertical market and want a structured first pass on feasibility before committing resources to deeper research.
- Leadership wants a quick read on "could we realistically enter this market" and you need a defensible checklist, not a gut-feel answer.
- You're comparing several candidate markets and want a consistent framework to evaluate each one against, rather than an ad hoc pro/con list per market.

## The Prompt

```
You produce a market-entry feasibility checklist for a specific target market and company. You clearly separate what can be assessed from the information given versus what is genuinely unknown and requires real research — you do not fill unknowns with plausible-sounding guesses presented as findings.

Target market: {{TARGET_MARKET}}
Company's current capabilities and existing markets: {{CURRENT_CAPABILITIES}}
What's already known about this target market, if anything: {{KNOWN_INFO}}

Instructions:
1. Regulatory/legal barriers: identify what regulatory considerations are typically relevant for this market/industry combination (data protection regimes, licensing requirements, import/export rules, employment law differences) and mark each as "known from {{KNOWN_INFO}}," "likely relevant, needs verification," or "not assessable without local legal counsel."
2. Competitive intensity: based on {{KNOWN_INFO}} and general knowledge of the market, assess whether this looks like a market with established incumbents, a fragmented/open market, or one where {{CURRENT_CAPABILITIES}} would be entering essentially blind — flag explicitly if there isn't enough information to assess this meaningfully rather than guessing at competitor names or share.
3. Distribution/channel access: given {{CURRENT_CAPABILITIES}}, identify whether the company has any existing channel relevant to this market (an existing partner, a digital channel that translates directly, a sales motion that requires a local presence you don't have) — this is often the single most concrete go/no-go factor and should be assessed as specifically as {{CURRENT_CAPABILITIES}} allows.
4. Localization needs: beyond translation, identify what's likely to need adaptation (payment methods, currency, regulatory-driven product changes, cultural/UX conventions) based on the target market description, and flag which of these {{CURRENT_CAPABILITIES}} already handles versus doesn't.
5. Capital requirements: give a qualitative read (low/medium/high relative to a typical market entry) on capital intensity based on what the other checklist items suggest (heavy regulatory lift, no existing distribution, extensive localization all point toward higher capital need) rather than fabricating a dollar figure with no basis.
6. Explicitly list, as a separate section, every item above marked "not assessable" — this is the actual research agenda this checklist produces, and it should be treated as the primary deliverable alongside the assessed items, not an afterthought.

Output format: Markdown with sections: Regulatory/Legal, Competitive Intensity, Distribution/Channel Access, Localization Needs, Capital Requirements (qualitative), and Research Agenda (the "not assessable" items, prioritized by which would most change the go/no-go decision if answered).
```

## Variables
- `{{TARGET_MARKET}}` — the geography or vertical being considered for entry. Required.
- `{{CURRENT_CAPABILITIES}}` — the company's existing product, distribution, and operational capabilities, and which markets it's already in. Required — feasibility is always relative to what the company already has.
- `{{KNOWN_INFO}}` — anything already researched or known about the target market. Optional, but sharpens the assessed-vs-unknown split significantly.

## Example
**Input:** `{{TARGET_MARKET}}` = "Expanding a B2B SaaS product (currently US-only) into the German market." `{{CURRENT_CAPABILITIES}}` = "Product is English-only, payment processing via a US-centric provider, no EU legal entity, fully self-serve sales motion with no local team." `{{KNOWN_INFO}}` = "Aware GDPR applies; no specific research done yet."

**Output (excerpt):**
```
### Regulatory/Legal
- GDPR data handling — known from {{KNOWN_INFO}} as relevant; needs verification of current compliance posture, since operating in the US doesn't guarantee GDPR-readiness.
- German-specific data residency or sector regulations (if applicable to the product's data type) — not assessable without local legal counsel.
- EU entity/tax registration requirements to sell and invoice locally — not assessable without a corporate/tax advisor.

### Distribution/Channel Access
{{CURRENT_CAPABILITIES}} states a fully self-serve motion with no local team — for a B2B SaaS product, this is a meaningful asset (self-serve doesn't require local sales headcount to start), but it also means there's no existing German-market relationship or partner to lean on. Assessable: entry is at least structurally possible without a local sales build-out; not assessable: whether self-serve conversion rates in the German B2B market resemble the US market without local data.

### Localization Needs
English-only product is a concrete gap — German B2B buyers commonly expect at least a German-language option, and this is assessable as a known requirement, not a guess. Payment processing via a US-centric provider likely needs verification for SEPA/local payment method support, common in German B2B purchasing.

### Research Agenda (prioritized)
1. GDPR compliance posture — highest priority, since this could be a hard blocker, not just a friction point.
2. Local payment method requirements — directly affects self-serve conversion, the company's core distribution advantage.
3. EU entity/tax setup requirements and timeline — affects how soon entry is even legally possible.
```

## Tips & Variations
- Pair with `risk-register-builder` (business-and-strategy, already shipped) to formalize the "Research Agenda" items into tracked risks/open questions with owners, rather than letting them sit as a static checklist.
- This prompt deliberately does not fabricate competitive landscape specifics or market-size estimates without real data — if {{KNOWN_INFO}} is thin, expect a checklist that's mostly a research agenda rather than a set of confident findings, which is the correct output for an under-researched market, not a limitation of the prompt.
- For comparing multiple candidate markets, run this once per market with the same {{CURRENT_CAPABILITIES}}, then compare the resulting "Research Agenda" lengths and Capital Requirements ratings as a rough relative-feasibility signal — the market with the shortest, least-blocking research agenda is often the easier near-term entry even if it's not the largest opportunity.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

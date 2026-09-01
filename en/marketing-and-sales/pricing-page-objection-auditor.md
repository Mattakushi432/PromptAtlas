---
id: pricing-page-objection-auditor
title: Pricing Page Objection Auditor
category: marketing-and-sales
tags: [pricing, conversion]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Audits a pricing page for the specific objections and hesitations it leaves unaddressed — an unclear "what's actually included" boundary between tiers, a missing answer to "why does this cost more than X," an absent path for the visitor's actual use case — rather than a general design/copy critique, since pricing pages fail specifically when they leave a buying objection unresolved, not when the copy merely reads awkwardly.

## When to use it
- A pricing page is about to launch or has been redesigned and you want a check specifically for unaddressed buying objections before it goes live, not a general copy pass.
- A pricing page converts poorly and you suspect visitors are hitting an unanswered question or hesitation rather than a generic "the copy isn't compelling" problem.
- You're comparing your pricing page against a specific competitor's and want to identify which objections they preempt that yours doesn't.

## The Prompt

```
You audit a pricing page specifically for buying objections and hesitations it leaves unaddressed. You are not reviewing general copy quality or design — you are checking whether a real visitor's actual questions get answered on the page itself.

Pricing page content (tiers, features, copy): {{PRICING_PAGE}}
Target buyer and their likely context: {{BUYER_CONTEXT}}
Known common objections from sales/support, if any: {{KNOWN_OBJECTIONS}}

Instructions:
1. Check tier boundaries: for each pair of adjacent tiers, is it actually clear what specifically changes between them, or does the visitor have to guess whether a given feature is in the lower tier? A vague or overlapping feature list between tiers creates hesitation about which tier to actually pick.
2. Check for the "why does this cost what it costs" question: does the page give any anchor for the price (a comparison to the cost of the problem it solves, a comparison to an alternative, a clear value tie-in) or does it just state a number with no framing? A bare number without value framing is the single most common pricing-page gap.
3. Check whether {{BUYER_CONTEXT}}'s likely use case actually maps cleanly onto one of the tiers — if a visitor with a realistic, common use case would have to guess which tier fits them, or would need to contact sales just to find out, that's friction worth flagging explicitly.
4. Check for missing answers to predictable questions the page doesn't address: what happens if the visitor's usage grows past a tier's limit mid-cycle, whether there's a trial/guarantee reducing the risk of committing, what the cancellation/downgrade path looks like — these don't all need answering on the page itself, but each unaddressed one is worth flagging as a candidate objection.
5. If {{KNOWN_OBJECTIONS}} is provided, check specifically whether the page addresses each one — if a known, recurring objection from actual sales conversations isn't addressed anywhere on the page, that's a higher-priority finding than a hypothetical one, since it's evidence-backed rather than inferred.
6. For each objection identified, propose a specific fix (a comparison table row, an FAQ entry, a tooltip, a reworded feature description) rather than just flagging that friction exists.

Output format: Markdown, one entry per finding: the specific unaddressed objection, why it would actually stop a visitor from converting, and the specific fix. End with a ranked top-3 "fix these first" list.
```

## Variables
- `{{PRICING_PAGE}}` — the pricing page's actual content: tiers, features, copy, FAQ if present. Required.
- `{{BUYER_CONTEXT}}` — who's actually looking at this page and what they're likely trying to figure out (a specific use case, team size, budget sensitivity). Required — objections are use-case-specific, not generic.
- `{{KNOWN_OBJECTIONS}}` — objections sales or support has actually heard from prospects, if tracked. Optional, but sharpens the audit toward evidence-backed gaps rather than only hypothetical ones.

## Example
**Input:** `{{PRICING_PAGE}}` = "Starter ($29/mo): up to 5 users, basic reporting. Pro ($79/mo): up to 20 users, advanced reporting, priority support. Enterprise: Contact us." `{{BUYER_CONTEXT}}` = "A 12-person team evaluating for the first time, budget-conscious, needs advanced reporting for a specific compliance requirement" `{{KNOWN_OBJECTIONS}}` = "Sales says prospects frequently ask 'what happens if we go over 20 users mid-year'"

**Output (excerpt):**
```
### Finding: 12-person team with a Pro-tier-required feature doesn't map cleanly to a tier
{{BUYER_CONTEXT}} needs advanced reporting (Pro-tier feature) but has only 12 users, comfortably under Pro's 20-user cap — this actually does map to Pro. But the page doesn't make this obvious at a glance; the visitor has to cross-reference their specific need (advanced reporting) against the feature list to figure out they don't need Enterprise. A team unsure whether "advanced reporting" fully covers a compliance need might default to contacting sales unnecessarily, adding friction.
Fix: add a one-line "best for" description under each tier tied to concrete scenarios (e.g. Pro: "best for teams up to 20 needing compliance-grade reporting") so a visitor with this exact profile self-identifies immediately.

### Finding: mid-cycle overage isn't addressed (confirmed via {{KNOWN_OBJECTIONS}})
Sales confirms this is a frequently-asked question, and the page doesn't answer it anywhere — a visitor evaluating growth-sensitive commitment has no way to know whether crossing 20 users mid-cycle means an abrupt tier jump, prorated billing, or something else, and may hesitate to commit without contacting sales first.
Fix: add a short FAQ entry answering the actual overage policy — this is a high-priority fix since it's evidence-backed by real sales friction, not a hypothetical.

Top 3 to fix first: 1) mid-cycle overage FAQ (evidence-backed), 2) tier "best for" scenario descriptions, 3) [third finding from full audit].
```

## Tips & Variations
- Pair with `landing-page-copy-critique` (marketing-and-sales, already shipped) for a broader copy/clarity/trust pass on the same page — that prompt covers general conversion criteria across any page type; this one is narrowly scoped to pricing-specific objections a general critique might not surface.
- If {{KNOWN_OBJECTIONS}} is available, weight it heavily over hypothetical objections generated from general pricing-page conventions — real, recurring friction reported by sales/support is stronger evidence than an inferred concern, even a plausible-sounding one.
- For a page with an "Enterprise: Contact us" tier, check specifically whether a visitor who's actually a good fit for a lower tier would be scared off into unnecessarily contacting sales due to unclear tier boundaries — this is a common, costly failure mode that inflates sales workload without a corresponding revenue benefit.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

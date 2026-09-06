---
id: vendor-supplier-concentration-risk-auditor
title: Vendor/Supplier Concentration Risk Auditor
category: business-and-strategy
tags: [risk-management]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Flags single-point-of-failure dependency on a key vendor or supplier from an actual spend breakdown, and estimates what a disruption to that specific relationship would concretely cost — not a generic "you're concentrated, diversify" warning, but the operational and financial impact of that specific vendor failing, so the finding is something a decision-maker can actually weigh against the cost of mitigating it.

## When to use it
- You're reviewing vendor/supplier spend and want to know which dependencies are actually risky, not just which vendors happen to be the largest by dollar amount — size and risk aren't the same thing.
- A vendor has had a wobble (a service outage, a financial-health rumor, a contract renewal that got contentious) and you want a concrete assessment of what losing them would actually mean before deciding how urgently to act.
- You're preparing a risk section for a board update or an investor due-diligence request and need specific, defensible numbers rather than a qualitative "we have some vendor risk."

## The Prompt

```
You audit a vendor/supplier spend breakdown for single-point-of-failure concentration risk, and estimate the concrete cost of losing each flagged relationship. You do not simply flag the largest vendors by spend — concentration risk depends on how replaceable a vendor is and how much would actually break if they were gone, not just how much they're paid.

Vendor/supplier spend breakdown (vendor, spend, what they provide): {{VENDOR_BREAKDOWN}}
What each flagged vendor's product/service is actually used for (criticality context): {{USAGE_CONTEXT}}
Known switching constraints, if any (contract lock-in, integration depth, lead time to replace): {{SWITCHING_CONSTRAINTS}}

Instructions:
1. Identify vendors that represent genuine concentration risk — not just the largest by spend, but any vendor where {{USAGE_CONTEXT}} indicates the business would be significantly disrupted if they disappeared tomorrow, even if their dollar spend is moderate. A cheap but structurally critical vendor is a bigger risk than an expensive but easily-substitutable one.
2. For each flagged vendor, estimate the concrete disruption cost if they failed or the relationship ended abruptly — direct cost (lost revenue, contractual penalties, emergency sourcing premium) and time cost (how long a realistic replacement would take, given {{SWITCHING_CONSTRAINTS}}), not just a vague "this would be bad."
3. Distinguish disruption types: a vendor that could be replaced in weeks with some pain is a different risk category than one requiring months of integration work with no viable near-term substitute — state which category each flagged vendor falls into, since the appropriate mitigation differs by category.
4. Check for correlated risk: do multiple flagged vendors share an underlying dependency (the same sub-supplier, the same specific region, the same parent company) that would mean a single disruption event affects more than one vendor relationship at once? This kind of hidden correlation is easy to miss when reviewing vendors one at a time.
5. For the highest-risk findings, propose a specific mitigation appropriate to the disruption type — a contractual change (better SLA, exit terms), a technical change (reducing integration depth to ease future switching), or a genuine diversification (a qualified backup vendor), not a generic "reduce dependency."
6. If a vendor is concentrated but genuinely low-risk given {{USAGE_CONTEXT}} (e.g. easily and quickly substitutable despite high spend), say so explicitly rather than flagging every large vendor as a risk — a report that flags everything is as unhelpful as one that flags nothing.

Output format: Markdown table: Vendor | Spend | Disruption Type (fast-replaceable / slow-replaceable-no-substitute) | Estimated Disruption Cost | Mitigation. Followed by a "Correlated Risk" note for any shared-dependency finding, and a prioritized top-3 list of what to address first.
```

## Variables
- `{{VENDOR_BREAKDOWN}}` — the actual vendor/supplier list with spend and what each provides. Required.
- `{{USAGE_CONTEXT}}` — what each significant vendor's product/service is actually used for, since criticality can't be assessed from spend alone. Required.
- `{{SWITCHING_CONSTRAINTS}}` — known lock-in, integration depth, or lead-time factors affecting how quickly a vendor could realistically be replaced. Optional, but sharpens the disruption-cost estimate significantly when provided.

## Example
**Input:** `{{VENDOR_BREAKDOWN}}` = "Cloud hosting provider: $180K/yr. Single logistics/fulfillment partner: $95K/yr. Office supplies vendor: $12K/yr." `{{USAGE_CONTEXT}}` = "Cloud hosting runs 100% of production infrastructure. Logistics partner is the sole fulfillment method for all physical orders — no backup fulfillment set up. Office supplies is exactly what it sounds like." `{{SWITCHING_CONSTRAINTS}}` = "Cloud migration to a different provider estimated at 3-4 months of engineering work given current architecture; logistics partner could theoretically be replaced but no alternative has been vetted or contracted"

**Output (excerpt):**
```
| Vendor | Spend | Disruption Type | Estimated Disruption Cost | Mitigation |
|---|---|---|---|---|
| Cloud hosting | $180K/yr | Slow-replaceable, no near-term substitute | Full production outage risk if they failed; a 3-4 month migration timeline means any acute failure has no fast recovery path — cost is effectively "the business can't operate" for the outage duration, far exceeding the annual spend figure | Reduce architectural lock-in incrementally (avoid deepening proprietary-service dependency going forward) even if a full migration isn't planned now; maintain an incident-response plan assuming no fast provider switch is possible |
| Logistics/fulfillment | $95K/yr | Slow-replaceable, no vetted substitute currently | Complete inability to fulfill physical orders until a replacement is found and onboarded — given no alternative has been vetted, realistic recovery time is unknown and could be weeks, directly blocking revenue during that window | Vet and establish a backup fulfillment relationship now, even a smaller-capacity one, so a real alternative exists rather than a from-scratch search during an actual disruption |
| Office supplies | $12K/yr | Fast-replaceable | Minimal — dozens of substitutable vendors, no meaningful switching cost | None needed — this is spend concentration without genuine risk concentration, correctly not requiring mitigation |

Correlated Risk: None identified between the flagged vendors — cloud hosting and logistics appear to be independent dependencies, not sharing an underlying sub-supplier based on {{VENDOR_BREAKDOWN}}.

Top 3 to address first: 1) Establish a vetted backup logistics option — currently zero fallback exists for a revenue-critical function. 2) Document an incident-response plan for cloud hosting failure given the multi-month replacement timeline. 3) Office supplies requires no action — correctly excluded from further mitigation work.
```

## Tips & Variations
- Pair with `third-party-api-risk-assessor` (coding, already shipped) when the vendor in question is a technical/API dependency specifically — that prompt assesses timeout/retry/fallback resilience at the integration-code level; this prompt assesses the business-level concentration and disruption-cost risk of the vendor relationship itself.
- A vendor flagged as low-risk today can become higher-risk as usage grows — revisit this audit periodically rather than treating one pass as permanent, especially for any vendor whose {{USAGE_CONTEXT}} role in the business is actively expanding.
- If {{SWITCHING_CONSTRAINTS}} is unknown for a flagged vendor, say so explicitly rather than guessing at replacement timelines — an unverified assumption about how fast a vendor could be replaced is exactly the kind of untested belief that turns into a crisis when it's wrong.

## Changelog
- 1.0.0 (2026-09-01): Initial version.

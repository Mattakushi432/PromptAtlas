---
id: strategic-plan-assumption-audit
title: Strategic Plan Assumption Audit
category: business-and-strategy
tags: [strategy, risk-management]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Extracts and challenges the unstated assumptions embedded in a multi-year strategic plan — market growth assumptions, competitive response assumptions, execution-capacity assumptions — the plan-level counterpart to `strategic-decision-pre-mortem` (business-and-strategy, already shipped)'s single-decision scope: that prompt pre-mortems one specific decision by imagining it's already failed; this prompt audits an entire multi-year plan's underlying assumption set for what's actually being taken for granted across the whole strategy, not just one decision within it.

## When to use it
- A multi-year strategic plan exists and you want to surface the assumptions it's actually built on before committing resources against it, since a plan's projections are only as good as the assumptions feeding them.
- You're reviewing someone else's strategic plan and want a systematic way to find what's been silently assumed rather than explicitly stated and justified.
- A plan is underperforming against its projections and you want to trace which specific assumption turned out wrong, rather than a vague "the plan didn't work out."

## The Prompt

```
You extract and challenge the unstated assumptions embedded in a multi-year strategic plan. You are not evaluating whether the plan's stated logic is internally consistent — you are surfacing what the plan takes for granted without stating it explicitly, and checking whether that's actually reasonable.

Strategic plan (goals, projections, key initiatives): {{STRATEGIC_PLAN}}
Time horizon the plan covers: {{TIME_HORIZON}}
Anything already known to be uncertain or debated internally about the plan: {{KNOWN_UNCERTAINTIES}}

Instructions:
1. Extract market/growth assumptions: what does {{STRATEGIC_PLAN}}'s projections implicitly assume about market size, market growth rate, or the addressable segment staying roughly as currently understood over {{TIME_HORIZON}}? State the specific implicit assumption, not just "the plan assumes growth" — e.g. "assumes the target market grows at roughly its historical 8% rate for the full 3-year period with no major disruption."
2. Extract competitive response assumptions: does the plan implicitly assume competitors stay static, or does it account for likely competitive reaction to the plan's own initiatives? A multi-year plan that doesn't address how competitors might respond to its own moves is assuming a static competitive environment, which is rarely realistic over a multi-year horizon.
3. Extract execution-capacity assumptions: does the plan assume the organization can execute at a pace or scale consistent with its actual historical execution track record, or does it implicitly require materially faster/larger execution than the organization has previously demonstrated? Flag any initiative whose timeline or scope seems to assume a step-change in execution capability without that capability-building being an explicit part of the plan itself.
4. Extract resource/capital assumptions: does the plan assume continued access to capital, talent, or other resources at the same terms/availability as currently, over the full {{TIME_HORIZON}}? A multi-year plan spanning an economic cycle implicitly assumes resource availability stays roughly constant unless stated otherwise.
5. For each extracted assumption, assess plausibility: is this a reasonable base-case assumption, a genuinely uncertain one worth flagging, or one that looks fragile given what's actually known? Distinguish these explicitly rather than treating every assumption as equally solid or equally shaky.
6. If {{KNOWN_UNCERTAINTIES}} is provided, check whether the plan's stated risk mitigations actually address those known uncertainties, or whether the plan proceeds as if they don't exist despite being internally acknowledged — a known uncertainty absent from the plan's own risk section is a specific, checkable gap worth naming directly.

Output format: Markdown with sections: Market/Growth Assumptions, Competitive Response Assumptions, Execution-Capacity Assumptions, Resource/Capital Assumptions — each assumption stated explicitly with a plausibility assessment (solid / uncertain / fragile). End with a summary of the single most fragile assumption the plan's success most depends on.
```

## Variables
- `{{STRATEGIC_PLAN}}` — the plan's stated goals, projections, and key initiatives. Required.
- `{{TIME_HORIZON}}` — the multi-year period the plan covers, since longer horizons make more assumptions genuinely uncertain. Required.
- `{{KNOWN_UNCERTAINTIES}}` — anything already flagged internally as debated or uncertain about the plan. Optional, but sharpens the check in step 6 against what's already known to be a live concern.

## Example
**Input:** `{{STRATEGIC_PLAN}}` = "3-year plan to triple revenue by expanding into 4 new geographic markets, projecting 40% YoY growth, funded by continuing the current fundraising pace" `{{TIME_HORIZON}}` = "3 years" `{{KNOWN_UNCERTAINTIES}}` = "Some internal debate about whether current investor appetite will continue given a recent market downturn in the sector"

**Output (excerpt):**
```
### Market/Growth Assumptions
Implicit assumption: 40% YoY growth is achievable across 4 new geographic markets simultaneously, with growth rates in new markets roughly comparable to whatever informed the 40% figure — likely the current core market's growth rate, though the plan doesn't state this explicitly. Plausibility: Uncertain — new-market growth rates rarely match an established core market's growth rate in the early years, and the plan doesn't appear to differentiate projected growth by market maturity.

### Competitive Response Assumptions
The plan doesn't address how competitors already present in the 4 target markets might respond to entry — no mention of competitive dynamics in the expansion markets at all. Plausibility: Fragile — expanding into markets with existing competitors without any stated view on their likely response is a significant gap for a plan of this scale.

### Resource/Capital Assumptions
Implicit assumption: continued fundraising at the current pace, unstated but required to fund the described expansion over {{TIME_HORIZON}}. Given {{KNOWN_UNCERTAINTIES}} explicitly flags internal debate about investor appetite given a sector downturn, this assumption is directly contradicted by information already known within the organization — the plan's own risk section (if one exists) should address this explicitly rather than silently assuming continuity.

### Most Fragile Assumption
The capital-availability assumption is both the most load-bearing (the entire expansion is funded by continued fundraising) and the most directly contradicted by {{KNOWN_UNCERTAINTIES}} — this is the single assumption the plan's success most depends on, and it's also the one already flagged internally as uncertain, which makes its absence from the plan's explicit risk treatment the most urgent gap to close.
```

## Tips & Variations
- Pair with `strategic-decision-pre-mortem` (business-and-strategy, already shipped) once this audit identifies the most fragile assumption — a pre-mortem can then be run specifically on the decision or initiative most dependent on that fragile assumption, going deeper than this plan-level audit does on any single point.
- Run this audit again whenever a plan's underlying conditions materially shift (a competitor enters unexpectedly, a funding environment changes) rather than only at initial plan approval — an assumption that was solid when the plan was written can become fragile without the plan itself being revisited.
- If {{KNOWN_UNCERTAINTIES}} reveals the organization already privately doubts an assumption the plan publicly treats as solid, that gap between internal knowledge and the plan's stated confidence is itself worth surfacing to leadership directly, not just noting quietly in this audit's output.

## Changelog
- 1.0.0 (2026-09-01): Initial version.

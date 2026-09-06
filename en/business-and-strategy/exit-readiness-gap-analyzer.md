---
id: exit-readiness-gap-analyzer
title: Exit Readiness Gap Analyzer
category: business-and-strategy
tags: [strategy, due-diligence]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Assesses what operational, financial, and legal gaps stand between a company's current state and being genuinely ready for an acquisition or IPO — surfaces the unglamorous readiness work (clean cap table, auditable financials, documented processes not dependent on one person's tribal knowledge) that a buyer or underwriter will actually probe, distinct from `due-diligence-question-list-generator` (business-and-strategy, already shipped), which generates the acquirer's question list for a target company, not a self-assessment of your own company's readiness before you're even in a deal process.

## When to use it
- Leadership is considering pursuing an acquisition or IPO in the next 1-3 years and wants an honest gap assessment now, while there's still time to fix findable issues before they surface in a real due-diligence process.
- You want to check whether "we could exit whenever we want to" is actually true, or whether it's an untested assumption that would fall apart the moment a real buyer or underwriter started asking questions.
- You're preparing for a specific near-term process (a term sheet is in hand, an IPO timeline has been set) and need a structured checklist of what to close out before diligence formally begins.

## The Prompt

```
You assess the gap between a company's current state and genuine exit readiness (acquisition or IPO). You identify concrete, checkable gaps — not vague maturity-model language — since exit readiness is ultimately tested by specific document requests and specific questions, not a general sense of "being a real company."

Company's current state (operational, financial, legal — as much detail as available): {{CURRENT_STATE}}
Exit type being considered: {{EXIT_TYPE}}
Timeline under consideration: {{TIMELINE}}

Instructions:
1. Check financial readiness: are financials at a standard suitable for the scrutiny {{EXIT_TYPE}} requires (audited or audit-ready, not just internally reviewed)? Is revenue recognition documented and defensible, not just "however we've always done it"? Are there any related-party transactions or founder-adjacent expenses that would need explaining or unwinding?
2. Check legal/corporate hygiene: is the cap table clean and fully documented (every option grant, every convertible note, every side letter accounted for), or are there known gaps/ambiguities that would surface as a scramble during diligence? Are IP assignments from every contributor (employees, contractors, co-founders) actually on file, not just assumed to exist?
3. Check operational dependency risk: does the business depend on undocumented tribal knowledge held by one or two specific people (a founder, an early engineer) that isn't written down anywhere — this is a common finding that materially affects perceived risk and sometimes valuation, since a buyer is implicitly pricing in key-person risk whether or not it's named explicitly.
4. Check for known skeletons that haven't been addressed: any pending litigation, regulatory issue, major customer concentration risk, or unresolved contract dispute that would surface during diligence regardless of when the process starts — flag these as needing active management (disclosure planning, remediation) rather than hoping they don't come up.
5. Given {{TIMELINE}}, triage findings into what's fixable in time versus what will need active management/disclosure during the process itself — a cap table cleanup might take months and is worth starting now regardless of exact exit timing, while a structural issue (e.g. genuine customer concentration) can't be "fixed" quickly and instead needs a credible narrative prepared for it.
6. Do not manufacture findings to seem thorough — if an area genuinely looks exit-ready based on {{CURRENT_STATE}}, say so directly rather than inventing a minor gap.

Output format: Markdown with sections: Financial Readiness, Legal/Corporate Hygiene, Operational Dependency Risk, Known Issues Needing Active Management. Each finding: what's missing/at risk, why it matters for {{EXIT_TYPE}} specifically, and whether it's fixable within {{TIMELINE}} or needs a disclosure/management strategy instead. End with a prioritized "start these now" list.
```

## Variables
- `{{CURRENT_STATE}}` — as much detail as available about the company's actual financial, legal, and operational state. Required — the assessment is only as good as the input detail.
- `{{EXIT_TYPE}}` — acquisition or IPO, since the scrutiny standard and specific requirements differ substantially. Required.
- `{{TIMELINE}}` — the timeframe under consideration, since this determines what's genuinely fixable versus what needs to be managed as a known issue instead. Required.

## Example
**Input:** `{{CURRENT_STATE}}` = "Financials reviewed internally by a part-time bookkeeper, never audited. Cap table maintained in a spreadsheet, a few early advisor grants aren't formally documented. Founding engineer holds most infrastructure knowledge undocumented. No pending litigation." `{{EXIT_TYPE}}` = "Acquisition by a strategic buyer" `{{TIMELINE}}` = "12-18 months"

**Output (excerpt):**
```
### Financial Readiness
Gap: Never-audited financials reviewed only by a part-time bookkeeper fall well short of what a strategic acquirer's finance team will expect to see in diligence — expect a request for at least 2-3 years of clean, defensible financials, ideally audited.
Fixable within 12-18 months: Yes, but should start immediately — engaging an audit firm and getting through a first audit realistically takes several months, and a first-time audit often surfaces its own cleanup work before it can complete.

### Legal/Corporate Hygiene
Gap: Cap table maintained in a spreadsheet with undocumented early advisor grants is a near-certain diligence finding — an acquirer's legal team will need every equity grant traceable to a signed document, and undocumented grants create real risk of a dispute surfacing exactly when it's most costly (mid-deal).
Fixable within 12-18 months: Yes — this is bounded, mechanical cleanup work (tracking down and formalizing each grant), worth prioritizing early since it's fully within your control and has a clear finish line.

### Operational Dependency Risk
Gap: Undocumented infrastructure knowledge concentrated in one founding engineer is a real key-person risk that a buyer will price into their assessment, whether or not they name it explicitly in a question — this is exactly the kind of institutional-knowledge gap {{CURRENT_STATE}} describes.
Fixable within 12-18 months: Partially — documentation can start now, but genuinely de-risking this (cross-training, redundancy) takes longer than paperwork alone; worth flagging as a manageable-but-not-fully-fixable item, with visible progress by exit time being the realistic goal rather than full resolution.

### Start These Now
1. Engage an audit firm — longest lead time, highest leverage to start immediately.
2. Cap table cleanup and advisor grant documentation — bounded, fully within your control.
3. Begin documenting founding engineer's tribal knowledge — won't fully close before {{TIMELINE}}, but visible progress matters more than perfection here.
```

## Tips & Variations
- Pair with `due-diligence-question-list-generator` (business-and-strategy, already shipped) once you're actually in a deal process — that prompt generates the acquirer's likely question list for a specific deal rationale; this prompt is the earlier, self-directed readiness check before you're in a live process at all.
- Revisit this assessment periodically as the company grows, not just once — findings that were minor at an earlier stage (a handful of undocumented option grants) compound into bigger cleanup projects the longer they're left unaddressed, so an earlier, smaller assessment is cheaper to act on than a comprehensive one done right before a deal starts.
- For a genuinely early-stage company where a near-term exit isn't realistically on the table, this prompt's findings are still useful as a forward-looking hygiene checklist, but temper {{TIMELINE}}-driven urgency accordingly — building these practices as you grow is cheaper than a compressed cleanup sprint later.

## Changelog
- 1.0.0 (2026-09-01): Initial version.

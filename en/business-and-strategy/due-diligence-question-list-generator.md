---
id: due-diligence-question-list-generator
title: Due Diligence Question List Generator
category: business-and-strategy
tags: [due-diligence, strategy]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Generates a due-diligence question list for a specific acquisition target, prioritized toward the questions most likely to surface a deal-breaker given the stated strategic rationale — not a generic 100-item DD template copy-pasted regardless of why the deal is being considered.

## When to use it
- You're evaluating a specific acquisition and need a question list tailored to why this deal is attractive, so diligence effort concentrates on validating (or breaking) the actual thesis, not a boilerplate checklist.
- You're preparing for management meetings with the target company and want the sharpest, most deal-relevant questions ready rather than a generic financial/legal list.
- You want a second pass on an existing DD question list to check whether it's actually targeted at this deal's specific risks or just a reused template from a prior, different deal.

## The Prompt

```
You generate a due-diligence question list for a specific acquisition, prioritized toward the questions most likely to surface a deal-breaker given the stated rationale — not a generic checklist applied regardless of context.

Acquisition target description: {{TARGET_DESCRIPTION}}
Strategic rationale for this deal: {{RATIONALE}}
Known concerns or areas of uncertainty already flagged: {{KNOWN_CONCERNS}}

Instructions:
1. Identify the single assumption {{RATIONALE}} depends on most heavily (e.g. "their technology will integrate cleanly," "their customer base doesn't overlap with ours," "their team will stay post-acquisition") and generate the sharpest possible questions across financial, legal, technical/product, team/culture, and customer-concentration areas that would directly test that assumption — these are the highest-priority questions, since they're the ones most likely to actually change the deal decision.
2. For financial diligence, go beyond generic "review the financials" — ask about revenue quality (recurring vs. one-time, customer concentration, churn), any related-party transactions, and whether reported metrics match what {{RATIONALE}} claims about the target's traction.
3. For legal diligence, ask about IP ownership clarity (especially for a technology-driven rationale), pending or historical litigation, and any change-of-control clauses in the target's material contracts that could be triggered by this acquisition.
4. For technical/product diligence, if {{RATIONALE}} involves acquiring technology or engineering capacity, ask about technical debt, key-person dependency in the engineering team, and actual (not claimed) integration complexity with the acquirer's stack.
5. For team/culture diligence, ask about retention risk for people {{RATIONALE}} depends on specifically (not generic "assess culture fit"), including whether key people have already been informally consulted about staying post-close.
6. For customer-concentration risk, ask what percentage of target revenue comes from its largest customers, and whether any major customer contracts have a change-of-control termination right that could be triggered by the acquisition itself.
7. If {{KNOWN_CONCERNS}} is provided, generate at least 2-3 additional targeted questions specifically probing each flagged concern, beyond the standard category questions above.
8. Prioritize the full list: mark the 5-8 questions most likely to surface an actual deal-breaker as "Priority 1," and the rest as standard diligence coverage — don't present all questions as equally urgent.

Output format: Markdown with sections: Priority 1 (Deal-Breaker Risk), Financial, Legal, Technical/Product, Team/Culture, Customer Concentration. Each question should be specific enough to ask directly in a management meeting, not a category label.
```

## Variables
- `{{TARGET_DESCRIPTION}}` — what the acquisition target does, its size, and any other relevant description. Required.
- `{{RATIONALE}}` — the strategic reason this acquisition is being considered. Required — this is what determines which questions are actually deal-breaker-relevant versus standard coverage.
- `{{KNOWN_CONCERNS}}` — any specific worries or red flags already identified before formal diligence begins. Optional, but sharpens the question list toward the deal's actual risk areas.

## Example
**Input:** `{{TARGET_DESCRIPTION}}` = "A 15-person startup with proprietary fraud-detection ML technology, no significant revenue yet, pre-product-market-fit." `{{RATIONALE}}` = "Acquiring primarily for the technology and the founding engineering team, to accelerate our own fraud-detection roadmap by an estimated 12 months." `{{KNOWN_CONCERNS}}` = "One of the two co-founders has mentioned wanting to start a new venture eventually."

**Output (excerpt):**
```
### Priority 1 (Deal-Breaker Risk)
- Since {{RATIONALE}} depends entirely on the engineering team staying and being productive post-close: has each key engineer (not just the founders) been individually asked, informally, whether they'd stay post-acquisition — and what specific retention terms (equity, role, autonomy) would be needed to secure that?
- Given the co-founder's stated interest in a future venture ({{KNOWN_CONCERNS}}): is that founder specifically critical to the technology (sole architect of a key system) or more replaceable within the team — and what does the target's own documentation/tests look like if that person leaves during the diligence or integration period?
- Since the acquisition rationale is "12 months of roadmap acceleration," what specifically would need to be true for that estimate to hold — is it based on a realistic integration assessment of the actual codebase, or a general sense that "good ML people can figure it out"?

### Legal
- Who owns the IP in the fraud-detection models — is it clearly assigned to the company, or could any co-founder or early contractor have a claim given how early-stage the company is?
- Are there any prior employer non-compete or IP-assignment issues for the founding team, given the company is pre-PMF and likely founded recently by people who may have come from other ML/fraud-detection companies?

### Technical/Product
- What is the actual state of the codebase's technical debt and test coverage — is the technology genuinely a 12-month accelerant, or would significant rework be needed to integrate it with the acquirer's stack?
- Beyond the founders, who else on the team has deep enough context on the core models to be a single point of failure if that person leaves?
```

## Tips & Variations
- Pair with `strategic-decision-pre-mortem` (business-and-strategy, already shipped) before diligence begins — running a pre-mortem on the acquisition decision first often surfaces the exact assumption this prompt should target as its Priority 1 questions.
- This prompt generates the question list; it doesn't answer the questions. For questions requiring specialized expertise (deep technical code review, formal legal opinion), treat the generated question as the brief for the specialist, not something to answer from general knowledge alone.
- If {{RATIONALE}} shifts during the diligence process (e.g. financial diligence reveals the "technology acceleration" thesis is less clean than assumed), re-run this prompt with the updated rationale rather than continuing to work off a Priority 1 list built for a thesis that's already shifted.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

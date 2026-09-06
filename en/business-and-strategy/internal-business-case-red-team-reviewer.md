---
id: internal-business-case-red-team-reviewer
title: Internal Business Case Red-Team Reviewer
category: business-and-strategy
tags: [strategy, decision-making]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Argues against a proposed internal business case the way a genuinely skeptical budget-holder actually would — surfaces the specific objections and weak points a real skeptic would raise, not generic devil's-advocate positions ("have you considered risks?") that any business case could equally receive, so the author can strengthen the case or honestly reconsider it before the real pitch happens in the room.

## When to use it
- You've drafted an internal business case (a budget request, a headcount ask, a new-initiative proposal) and want to pressure-test it against real skepticism before presenting it, not after a budget-holder finds the hole in the room.
- You're the budget-holder yourself and want a structured way to generate the sharpest questions to actually ask, rather than relying on whatever occurs to you live in the meeting.
- A business case has been rejected before and you want to understand specifically what a skeptical reviewer would still find weak in a revised version, not just polish the same weaknesses with better formatting.

## The Prompt

```
You argue against a proposed internal business case as a genuinely skeptical budget-holder would. You raise the specific objections a smart, informed skeptic would actually make given this specific case — not generic devil's-advocate positions that could apply to any proposal regardless of its content.

Business case (the ask, the projected value, the reasoning): {{BUSINESS_CASE}}
Who's actually reviewing/approving this, and what they're known to weigh heavily: {{REVIEWER_CONTEXT}}
Budget/resource context this competes against: {{COMPETING_CONTEXT}}

Instructions:
1. Identify the single weakest link in {{BUSINESS_CASE}}'s reasoning chain — not every possible objection, but the one place where, if a skeptic pulled on it, the whole case would be most likely to unravel. State specifically what's assumed there without adequate support.
2. Challenge the projected value/ROI specifically: is the projection based on a comparable precedent, or is it essentially invented? If based on a precedent, does that precedent actually transfer to this situation, or are there material differences the case glosses over? A skeptical reviewer's most common real objection is "where does this number actually come from," not an abstract risk concern.
3. Given {{REVIEWER_CONTEXT}}, tailor the specific objections to what this particular reviewer is known to weigh heavily — a reviewer who cares most about payback period will push differently than one who cares most about strategic alignment, and generic objections that ignore the actual reviewer's priorities are less useful than ones calibrated to them.
4. Given {{COMPETING_CONTEXT}}, raise the opportunity-cost objection explicitly: why this ask over the other things competing for the same budget/resources — a business case that only argues its own merits without addressing what it's displacing is vulnerable to exactly this question in the room.
5. Identify what a skeptic would ask about the downside case: what happens if this doesn't work, what's the actual sunk cost if it fails partway through, and is there a defined point at which the initiative would be cut rather than continuing indefinitely on the strength of the original pitch? A case with no stated failure condition invites the reviewer's suspicion that failure isn't being seriously planned for.
6. After raising the objections, note which ones {{BUSINESS_CASE}} as given already has a reasonable answer to (even if not explicitly stated) versus which ones genuinely expose an unaddressed gap — not every objection raised needs to be fatal, but the case's author needs to know which ones actually require strengthening the case versus which ones just need a prepared verbal answer.

Output format: Markdown. For each objection: the specific challenge, why a real skeptical reviewer would actually raise it (tied to {{REVIEWER_CONTEXT}} or {{COMPETING_CONTEXT}} where relevant), and whether {{BUSINESS_CASE}} already has a defensible answer or has a genuine gap. End with the single highest-priority thing to strengthen before the real pitch.
```

## Variables
- `{{BUSINESS_CASE}}` — the actual case being made: the ask, the projected value, the supporting reasoning. Required.
- `{{REVIEWER_CONTEXT}}` — who's reviewing this and what they're known to prioritize or scrutinize, if known. Optional, but sharpens which objections are actually likely to come up versus generic ones.
- `{{COMPETING_CONTEXT}}` — what else this ask is competing against for the same budget or resources. Optional, but enables the opportunity-cost objection in step 4, which is a common real-world objection this prompt would otherwise miss.

## Example
**Input:** `{{BUSINESS_CASE}}` = "Requesting budget for 2 additional engineers to build an internal tool that will save the support team an estimated 10 hours/week, paying back the headcount cost in projected productivity savings within 8 months" `{{REVIEWER_CONTEXT}}` = "CFO, known to push hard on whether projected savings ever actually materialize in past initiatives, skeptical of soft productivity claims" `{{COMPETING_CONTEXT}}` = "Competing against a customer-facing feature request from the sales team for the same engineering capacity"

**Output (excerpt):**
```
### Objection: Where does the 10 hours/week figure actually come from?
Given {{REVIEWER_CONTEXT}}'s known skepticism of soft productivity claims, this is very likely to be the first real question asked. If the 10-hour estimate is based on a time-motion study or logged support-ticket handling time, that's defensible; if it's a rough internal guess, that's a genuine gap {{BUSINESS_CASE}} as described doesn't clarify.
Gap or defensible: Unclear from {{BUSINESS_CASE}} as given — flag this as needing a stated basis for the estimate before the pitch, since this specific reviewer is known to push exactly here.

### Objection: Opportunity cost against the sales team's feature request
Given {{COMPETING_CONTEXT}}, a real question will be "why this internal tool over the customer-facing feature the sales team wants with the same 2 engineers" — an internal productivity tool has to make its case against a request with a more direct, visible revenue-facing story, which is often an easier case for a CFO to approve.
Gap or defensible: Genuine gap — {{BUSINESS_CASE}} as described doesn't address why this internal ask should win over a competing customer-facing ask; this needs an explicit comparison, not just standing on its own merits.

### Objection: Downside case — what if the 10-hour savings doesn't materialize?
Does the case have a checkpoint (e.g. at 3 months, verify actual measured time savings) or does it implicitly ask for the full 2-headcount commitment upfront with no defined re-evaluation point?
Gap or defensible: Genuine gap if no checkpoint is defined — {{REVIEWER_CONTEXT}}'s specific concern about savings not materializing is exactly addressed by a defined checkpoint, which isn't currently part of {{BUSINESS_CASE}} as described.

### Highest Priority to Strengthen
Establish and state the actual basis for the 10-hours/week estimate before the pitch — given {{REVIEWER_CONTEXT}}'s specific, known skepticism pattern, an unsupported productivity number is the single most likely point the case gets stopped on, more so than the opportunity-cost or downside-case gaps, which can be addressed with a prepared verbal answer if needed.
```

## Tips & Variations
- Pair with `pricing-strategy-stress-tester` (business-and-strategy, already shipped) or other stress-test-style prompts in this category for the specific initiative once it's approved — this prompt is scoped to the internal-approval pitch itself, not to stress-testing the initiative's execution plan once funded.
- This prompt argues against the case to strengthen it, not to talk anyone out of a genuinely good idea — if the objections raised turn out to have solid, defensible answers across the board, that's a useful confidence-building result, not a sign the exercise failed to find anything.
- For a business case being re-pitched after a prior rejection, explicitly include what objection caused the prior rejection in {{BUSINESS_CASE}} or {{REVIEWER_CONTEXT}} — this prompt should specifically check whether the revised case actually closes that prior gap, not just whether it survives a fresh generic red-team pass.

## Changelog
- 1.0.0 (2026-09-01): Initial version.

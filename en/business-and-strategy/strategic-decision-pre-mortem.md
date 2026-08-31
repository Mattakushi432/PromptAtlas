---
id: strategic-decision-pre-mortem
title: Strategic Decision Pre-Mortem
category: business-and-strategy
tags: [strategy, risk-management, decision-making]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Runs a structured pre-mortem on a proposed strategic decision — imagining it has already failed a year from now and working backward to plausible causes — to surface risks that forward-looking risk assessment tends to miss, since a pre-mortem's "assume failure" framing counteracts the optimism bias baked into most planning documents.

## When to use it
- Before committing to a major decision (a market entry, a large investment, a strategic pivot) and want to pressure-test it beyond the risks already listed in the plan itself.
- A decision has strong internal consensus and you want a structured way to surface dissenting concerns that people might otherwise hesitate to raise directly.
- You're revisiting a past decision that underperformed and want to reconstruct plausible failure paths as a learning exercise, even after the fact.

## The Prompt

```
You run a pre-mortem on a proposed strategic decision. Assume the decision has already been made and has already failed — your job is to work backward and generate plausible, specific reasons why, not to evaluate whether the decision is good going forward.

Decision being made: {{DECISION}}
Time horizon for judging success/failure: {{HORIZON}}
Current reasoning/business case for the decision: {{CURRENT_CASE}}

Instructions:
1. Frame it explicitly: "It is now {{HORIZON}} later. {{DECISION}} has failed." Generate failure narratives from that frame — this is deliberately different from listing risks prospectively, since imagining failure as already-happened tends to surface causes that a forward-looking "what could go wrong" list misses.
2. Generate at least 5 distinct failure narratives spanning different failure categories: execution failure (the plan was right but poorly executed), assumption failure (a core assumption in {{CURRENT_CASE}} turned out false), external failure (market/competitor/regulatory shift outside your control), timing failure (right idea, wrong time), and resource failure (ran out of budget/talent/attention before it could work).
3. For each narrative, be specific rather than generic — not "execution was poor" but the specific execution breakdown that plausibly happened, given what {{DECISION}} and {{CURRENT_CASE}} actually describe.
4. For each narrative, identify the earliest point at which this failure mode would likely have been visible if someone were watching for it — this turns each pre-mortem finding into an actionable early-warning signal, not just a retrospective story.
5. Explicitly check {{CURRENT_CASE}} for the single assumption it leans on most heavily, and generate at least one failure narrative that directly targets that assumption being wrong — the business case's own central assumption is often under-scrutinized precisely because everyone building the case already believes it.
6. After all narratives, rank them by a combination of plausibility and how early/reliably their warning signal could be detected — surface the ones that are both likely and detectable early as the highest-priority ones to actually monitor for.

Output format: Markdown. One entry per failure narrative: category, the specific story of what went wrong, the earliest detectable warning sign, and how to monitor for it going forward. End with a ranked top-3 "watch for these first" list.
```

## Variables
- `{{DECISION}}` — the specific strategic decision being pre-mortemed. Required.
- `{{HORIZON}}` — the time frame at which success/failure is being judged (6 months, 1 year, 3 years). Required — failure modes and their detectability differ substantially by horizon.
- `{{CURRENT_CASE}}` — the existing business case/reasoning for the decision, so the pre-mortem can target its actual assumptions rather than generic ones. Required.

## Example
**Input:** `{{DECISION}}` = "Acquiring a smaller competitor to consolidate market share." `{{HORIZON}}` = "18 months post-acquisition" `{{CURRENT_CASE}}` = "The acquired company's customer base is highly complementary to ours with minimal overlap, and their engineering team can accelerate our roadmap by 6+ months."

**Output (excerpt):**
```
### Execution failure: integration stalls, both teams operate as separate silos 18 months in
The acquired engineering team was never actually integrated into shared roadmap planning — cultural/tooling friction meant they kept shipping on their old system while the main team kept shipping on theirs, and the promised 6-month roadmap acceleration never materialized because "integration" happened on paper (org chart) but not in practice (shared codebase, shared priorities).
Earliest detectable sign: within the first 60-90 days, whether the acquired team is actually assigned joint sprints/projects with the existing team, or is still operating as an independent unit "for now."
Monitor: track cross-team PR/commit collaboration and joint sprint participation starting week 1, not just org-chart integration.

### Assumption failure: customer overlap was underestimated
{{CURRENT_CASE}}'s central assumption — minimal customer overlap — turns out wrong once the deal closes and account lists are actually compared; a meaningful chunk of the acquired company's customers were already evaluating or using your own product, meaning the deal bought less net-new market than the case assumed, and post-acquisition churn among overlapping accounts (annoyed by consolidation, forced migration, or pricing changes) erodes the case's headline logic.
Earliest detectable sign: a full account-overlap analysis, which is knowable almost immediately post-close, not 18 months out — if this wasn't done before signing, it should be the very first post-close action.
Monitor: run the overlap analysis in week 1 rather than assuming the pre-deal estimate was accurate.
```

## Tips & Variations
- Run this before finalizing a major decision, not after — its value is in surfacing early-warning signals to actually monitor, which only helps if there's still time to watch for them.
- Pair with `risk-register-builder` (business-and-strategy, already shipped) to formalize the pre-mortem's failure narratives into a tracked risk register with owners — this prompt generates the narratives and warning signs; that one formats them for ongoing tracking.
- For a decision with genuine organizational disagreement, consider running this prompt once per dissenting perspective (each producing its own {{CURRENT_CASE}} framing) rather than once from a single consensus narrative — a pre-mortem run only from the case's own assumptions will still miss failure modes that a skeptic would have named immediately.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

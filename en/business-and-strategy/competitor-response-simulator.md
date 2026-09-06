---
id: competitor-response-simulator
title: Competitor Response Simulator
category: business-and-strategy
tags: [competitive-analysis, strategy]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Given a planned strategic move, generates the most likely competitor countermoves ranked by probability and severity, and identifies how to hedge against the strongest one — reasons from the competitor's actual incentives and constraints rather than generic "they might react" hand-waving, since a specific competitor with specific resources and a specific market position has a narrower, more predictable range of realistic responses than an open-ended brainstorm suggests.

## When to use it
- You're planning a strategic move (a price change, a new feature, a market entry) and want to think through how a specific competitor is likely to respond before committing, not be caught flat-footed after the fact.
- You want to check whether a plan's success depends on a competitor not responding at all — a common blind spot when a plan is evaluated only against the current competitive state, not the state after the competitor reacts.
- You're preparing leadership for a decision and want a structured "here's what could happen next" rather than an unstructured discussion that gets stuck on best-case assumptions.

## The Prompt

```
You simulate a specific competitor's likely response to a planned strategic move, reasoning from their actual incentives, resources, and constraints — not a generic "they could retaliate" without grounding in what this specific competitor would realistically do given their actual position.

Planned move: {{PLANNED_MOVE}}
Competitor being simulated: {{COMPETITOR}}
What's known about the competitor's current position, resources, and constraints: {{COMPETITOR_CONTEXT}}

Instructions:
1. Identify {{COMPETITOR}}'s actual incentive to respond at all — does {{PLANNED_MOVE}} genuinely threaten something they care about (a core revenue segment, market share they're defending), or is it in a space they've historically ignored or ceded? A competitor with weak incentive to respond is a different scenario than one with strong incentive, and this should shape everything that follows.
2. Generate 3-4 distinct plausible responses, not variations on one theme — consider: direct matching (copying the move), a different competitive dimension entirely (competing on something else instead of matching directly), no response (a real option if {{COMPETITOR_CONTEXT}} suggests they lack the resources or incentive), and an aggressive overreaction (rare but possible if the move threatens something existential to them).
3. For each response, check it against {{COMPETITOR_CONTEXT}}'s actual constraints — a response that would require resources, capabilities, or organizational speed the competitor doesn't plausibly have is a low-probability scenario regardless of how strategically sound it would be for them in the abstract; flag when a theoretically-smart response is actually unrealistic given their real constraints.
4. Rank the responses by a combination of probability and severity to you — the response most worth planning for isn't necessarily the most likely one if a lower-probability response would be far more damaging; state this tradeoff explicitly rather than only ranking by probability.
5. For the highest-priority response (by the combined ranking), propose a specific hedge: what would you need to have in place, or what would you do differently in {{PLANNED_MOVE}} itself, to reduce the damage if this specific response happens — not a generic "stay vigilant" but a concrete contingency.
6. Flag if {{PLANNED_MOVE}}'s success case implicitly assumes no competitive response at all — if the plan's projected outcome doesn't hold under any of the plausible responses generated, that's worth surfacing explicitly before the move is finalized, not discovered after a competitor reacts.

Output format: Markdown. For each response scenario: description, probability/severity assessment, and constraint check. End with the recommended hedge for the top-priority scenario and an explicit flag if the plan's success case assumes no response.
```

## Variables
- `{{PLANNED_MOVE}}` — the specific strategic move being planned. Required.
- `{{COMPETITOR}}` — the specific competitor being simulated — this prompt works on one named competitor at a time, not a generic "the market." Required.
- `{{COMPETITOR_CONTEXT}}` — what's actually known about this competitor's position, resources, and constraints, since the simulation's realism depends entirely on this. Required.

## Example
**Input:** `{{PLANNED_MOVE}}` = "Launching a lower-priced tier to capture price-sensitive customers currently going to a cheaper competitor" `{{COMPETITOR}}` = "BudgetCo" `{{COMPETITOR_CONTEXT}}` = "BudgetCo's entire business model is built around being the cheapest option; thin margins already, limited R&D budget, but very fast at making pricing changes since it's their core lever"

**Output (excerpt):**
```
### Response 1: Immediate price cut to undercut the new tier
Probability/Severity: High probability, high severity. Given {{COMPETITOR_CONTEXT}} — pricing is BudgetCo's core competitive lever and they're fast at pricing changes — this is close to their default move, not a stretch response.
Constraint check: Plausible. Thin margins mean they can't cut indefinitely, but a reactive cut to stay below the new tier is well within their demonstrated speed and their core competency, not something requiring capability they lack.

### Response 2: Add features to justify their existing price instead of cutting further
Probability/Severity: Low probability. {{COMPETITOR_CONTEXT}} notes limited R&D budget — a features-based response would require capability investment that doesn't match their described constraints, even though it might be the theoretically sound move if they weren't margin-constrained.

### Response 3: No response (they cede this specific price point)
Probability/Severity: Low-medium probability, but worth including — if {{COMPETITOR_CONTEXT}}'s thin margins mean matching your new tier's price isn't sustainable for them even short-term, they may simply not have room to respond, ceding that specific price band.

### Recommended Hedge (for Response 1, the top-priority scenario)
Since a fast price-matching response is highly likely, don't plan the new tier's economics around capturing customers at today's BudgetCo pricing — model the tier's viability assuming BudgetCo matches within weeks, and check whether the new tier still makes sense once that undercut happens, not just against the current competitive landscape.

Flag: {{PLANNED_MOVE}}'s framing ("capture price-sensitive customers currently going to BudgetCo") implicitly assumes BudgetCo's current pricing stays static — given the high-probability price-cut response, this assumption should be explicitly revisited before finalizing the tier's pricing and margin targets.
```

## Tips & Variations
- Pair with `pricing-strategy-stress-tester` (business-and-strategy, already shipped) when the planned move is itself a pricing change — that prompt stress-tests the pricing move's impact on your own customers/segments; this prompt simulates the competitive response the pricing move might trigger, and both are worth running for a pricing-specific move.
- If {{COMPETITOR_CONTEXT}} is thin (limited real information about the competitor), say so and treat the output as a lower-confidence sketch rather than a confident prediction — a simulation grounded in guesswork about the competitor's constraints is still more structured than no analysis, but shouldn't be presented with false precision.
- For a move affecting multiple competitors differently, run this prompt once per competitor rather than trying to simulate an aggregate "the market's" response — different competitors have different incentives and constraints, and collapsing them into one generic response loses exactly the specificity this prompt is built to provide.

## Changelog
- 1.0.0 (2026-09-01): Initial version.

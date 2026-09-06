---
id: go-no-go-decision-framework-builder
title: Go/No-Go Decision Framework Builder
category: business-and-strategy
tags: [decision-making, planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Structures the explicit criteria and thresholds for a future go/no-go decision before the decision point actually arrives — so the call gets made against pre-committed, specific standards rather than improvised under the time pressure and sunk-cost pull that's usually present right when the decision needs to happen.

## When to use it
- You're starting an initiative with a natural checkpoint (a pilot, a beta, a funding milestone) and want the go/no-go criteria defined now, before there's any outcome data to bias the judgment.
- A go/no-go decision is approaching and the criteria were never made explicit, so you want to structure them retroactively before the meeting rather than let the discussion default to whoever argues most persuasively in the room.
- You suspect a past go/no-go decision went the wrong way because of sunk-cost thinking, and want a framework that would have made the actual threshold visible in advance next time.

## The Prompt

```
You structure explicit go/no-go criteria and thresholds for a future decision point. You are building the standard to judge against later — not making the call now, and not describing what you hope the outcome will be.

The initiative and its go/no-go checkpoint: {{INITIATIVE}}
What's actually being measured/observed to inform the decision: {{DECISION_INPUTS}}
Known constraints (budget, timeline, strategic context) relevant to setting thresholds: {{CONSTRAINTS}}

Instructions:
1. For each input in {{DECISION_INPUTS}}, define a specific, numeric or otherwise unambiguous threshold that would trigger "go" — not "if it's going well" but a concrete bar (a specific conversion rate, a specific cost figure, a specific completion percentage) that someone reading it later couldn't reasonably dispute whether it was met.
2. Define what triggers an explicit "no-go" as its own threshold, not just "anything short of the go bar" — a clear no-go threshold prevents the ambiguous middle ground from defaulting to continuing by inertia, which is the most common way a should-have-stopped initiative keeps going.
3. If there's a plausible middle zone between clear go and clear no-go, define it explicitly as "extend and re-evaluate" with its own specific trigger and a hard limit on how many times this extension can happen — an indefinitely renewable "let's give it more time" is not a real decision framework.
4. Check {{CONSTRAINTS}} against the thresholds: if budget or timeline constraints mean the initiative can't actually survive to reach a meaningful checkpoint at the proposed thresholds, flag this now — a threshold that can't practically be reached in time isn't a real decision criterion, just a deferred version of "we'll decide later."
5. Name who makes the final call and confirm the framework doesn't quietly leave room for that person to override a clear no-go with a good enough justification — if an override path is intended to exist, make it an explicit, named exception process (who can invoke it, what bar that requires) rather than an implicit escape hatch that undermines the whole framework.
6. Flag if {{DECISION_INPUTS}} is missing something that will obviously matter at decision time but isn't currently being tracked — a threshold defined for a metric nobody's actually collecting isn't usable when the checkpoint arrives.

Output format: Markdown table with columns: Input | Go Threshold | No-Go Threshold | Extend-and-Reevaluate Zone (if any). Followed by: Decision Owner, Override Process (if any), and a "Tracking Gaps" note for anything in step 6.
```

## Variables
- `{{INITIATIVE}}` — the initiative and what checkpoint this framework governs. Required.
- `{{DECISION_INPUTS}}` — what's actually being measured or observed that should inform the call. Required.
- `{{CONSTRAINTS}}` — budget, timeline, or strategic context that bounds what's realistic. Required — without this, thresholds risk being set in a vacuum disconnected from what's actually achievable.

## Example
**Input:** `{{INITIATIVE}}` = "3-month pilot of a new customer onboarding flow with a subset of new signups, checkpoint at end of month 3" `{{DECISION_INPUTS}}` = "Activation rate (% completing onboarding), time-to-first-value, support ticket volume from pilot cohort" `{{CONSTRAINTS}}` = "Engineering can only support running both old and new flows in parallel for 4 months max before it becomes a maintenance burden"

**Output (excerpt):**
```
| Input | Go Threshold | No-Go Threshold | Extend-and-Reevaluate Zone |
|---|---|---|---|
| Activation rate | ≥65% (vs. current 52% baseline) | <55% (below or roughly at current baseline — no clear improvement) | 55-65%: extend one additional month only, given the 4-month parallel-support ceiling in {{CONSTRAINTS}} leaves no room for multiple extensions |
| Time-to-first-value | ≤3 days median (vs. current 6 days) | >5 days median | 3-5 days: same one-month extension window as above, not evaluated independently |
| Support ticket volume | No more than 10% increase vs. baseline cohort | >25% increase | 10-25%: extend, but only if activation rate is already in its own go zone — a support-volume increase paired with weak activation is a no-go regardless |

Decision Owner: VP Product, informed by the metrics above.
Override Process: None defined — if a case arises for continuing despite a no-go reading, it requires an explicit written justification reviewed by both VP Product and VP Engineering jointly, not a unilateral call.
Tracking Gaps: None identified — all three inputs are already instrumented per {{DECISION_INPUTS}}.

Constraint check: given the 4-month parallel-support ceiling, only a single one-month extension is realistic — the framework above reflects that rather than allowing indefinite re-evaluation cycles.
```

## Tips & Variations
- Pair with `strategic-decision-pre-mortem` (business-and-strategy, already shipped) when setting up the initiative, before this framework — a pre-mortem surfaces failure modes worth watching for; this prompt then turns the metrics worth watching into an actual decision framework with real thresholds.
- Set this framework before the initiative starts, not partway through — thresholds set after some results are already in are much more vulnerable to being unconsciously calibrated to justify whatever outcome already looks likely, defeating the purpose of having pre-committed criteria at all.
- If a stakeholder pushes back on a specific threshold as "too strict" right as the checkpoint approaches, that's worth noting explicitly as a signal — a threshold that only gets challenged once the data looks unfavorable is exactly the sunk-cost pressure this framework exists to resist.

## Changelog
- 1.0.0 (2026-09-01): Initial version.

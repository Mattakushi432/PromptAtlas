---
id: agent-eval-rubric-generator
title: Agent Eval Rubric Generator
category: agents-and-automation
tags: [ai-agents, quality-assurance, assessment]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Generates a scoring rubric — criteria, pass/fail thresholds, and edge cases to test against — for evaluating an AI agent's output quality on a specific task, so runs can be graded consistently by different reviewers (or an LLM judge) instead of by ad hoc eyeballing that drifts between evaluators and over time.

## When to use it
- You're setting up an evaluation harness for an agent and need a concrete rubric to grade against, not just a vague sense of "does it look right."
- Different people on your team are judging the same agent's outputs inconsistently, and you need a shared, written standard to align on.
- You're about to make a change to an agent (prompt, tool, model) and want a rubric in place first so you can compare before/after runs on the same objective criteria.

## The Prompt

```
You generate an evaluation rubric for scoring an AI agent's output on a specific task.

Task the agent performs: {{TASK}}
Example of a good output: {{GOOD_EXAMPLE}}
Example of a bad or failed output, if available: {{BAD_EXAMPLE}}
Who will use this rubric to score outputs (a human reviewer, or an LLM-as-judge): {{SCORER}}

Instructions:
1. Derive 4-6 scoring criteria directly from what distinguishes {{GOOD_EXAMPLE}} from {{BAD_EXAMPLE}} (if provided) or from {{TASK}}'s actual requirements — not a generic list of "accuracy, clarity, helpfulness" disconnected from this specific task. Each criterion must be checkable from the output alone, without needing to inspect the agent's internal reasoning.
2. For each criterion, define what a pass looks like concretely enough that two different scorers would agree on the same output — avoid subjective language like "good tone" without specifying what "good" means for this task.
3. Identify at least 2 edge cases specific to {{TASK}} that a naive rubric would miss — cases where the output looks superficially correct but fails on close inspection (e.g. a numeric answer that's plausible but wrong, a response that answers a different question than the one asked, a correct answer presented with false confidence when the correct answer was actually "I don't know").
4. Define an overall pass/fail threshold: is this task binary pass/fail, does it need a weighted score across criteria, or does any single critical-criterion failure (e.g. a factual error) auto-fail regardless of other criteria scoring well? Justify the choice against {{TASK}}'s actual stakes.
5. If {{SCORER}} is an LLM-as-judge, add explicit instructions for that judge on how to apply each criterion consistently (e.g. what to do when a criterion is ambiguous for a given output) — an LLM judge needs the same unambiguous rubric a human does, arguably more so since it can't ask a clarifying question.
6. Flag any criterion that would be expensive or slow to check at scale (e.g. requiring a human to verify against an external source) and suggest whether it's worth keeping as a manual-only spot-check criterion versus dropping it from routine automated scoring.

Output format: Markdown table with columns: Criterion | Pass Definition | Weight/Critical?. Follow with an "Edge Cases to Test" list and a one-paragraph statement of the overall pass/fail logic.
```

## Variables
- `{{TASK}}` — the specific task the agent performs that's being evaluated. Required.
- `{{GOOD_EXAMPLE}}` — a real or representative example of a high-quality output. Required — criteria derived from an actual example are far more concrete than criteria invented in the abstract.
- `{{BAD_EXAMPLE}}` — a real or representative example of a failed output, if one exists. Optional but significantly improves the rubric's ability to catch the failure modes that actually occur.
- `{{SCORER}}` — who applies this rubric (human reviewer vs. LLM-as-judge). Required — instructions differ for each.

## Example
**Input:** `{{TASK}}` = "Agent summarizes a customer support ticket thread into a 2-3 sentence handoff note for the next agent." `{{GOOD_EXAMPLE}}` = "'Customer reports login failures since yesterday's app update, confirmed on iOS only. Already tried reinstall (no effect). Needs engineering escalation, not a standard password-reset response.'" `{{BAD_EXAMPLE}}` = "'Customer is having some issues with the app and needs help.'" `{{SCORER}}` = "LLM-as-judge, run automatically on every new summary."

**Output (excerpt):**
```
| Criterion | Pass Definition | Weight/Critical? |
|---|---|---|
| Specificity | Names the actual symptom (not "some issues") and the actual product area affected. | Critical — {{BAD_EXAMPLE}} fails here alone. |
| Prior-action awareness | States what's already been tried, if the thread shows an attempted fix, so the next agent doesn't repeat it. | High |
| Correct routing signal | If the issue needs escalation beyond a standard playbook (per the thread's content), the summary says so explicitly rather than sounding routine. | Critical |
| Length discipline | 2-3 sentences, no more — a longer "summary" defeats the point of a handoff note. | Medium |

### Edge Cases to Test
- A thread where the customer's stated problem and the actual root cause (visible from later messages) diverge — the summary should reflect the diagnosed cause, not just the customer's initial framing.
- A thread that was already resolved before handoff — the summary should say so plainly rather than describing it as an open issue needing action.

Overall pass/fail: any Critical criterion failing auto-fails the summary regardless of other scores, since a vague or misrouted handoff actively wastes the next agent's time rather than just being suboptimal.
```

## Tips & Variations
- Pair with `tool-use-trace-reviewer` (agents-and-automation, already shipped) when a rubric generated here flags a recurring failure — the trace reviewer can help pin down whether the cause is a planning error, a tool issue, or a prompt gap.
- Revise the rubric whenever a new failure mode shows up in production that the current edge cases didn't anticipate — a rubric is a living document, not a one-time artifact, especially early in an agent's life.
- For {{SCORER}} = LLM-as-judge, periodically spot-check the judge's own scoring against a human's on a sample — judge models can develop their own systematic blind spots that a rubric alone doesn't catch.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

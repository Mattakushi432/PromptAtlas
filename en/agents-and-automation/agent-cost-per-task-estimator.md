---
id: agent-cost-per-task-estimator
title: Agent Cost-per-Task Estimator
category: agents-and-automation
tags: [ai-agents, cost-optimization, planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Estimates the token and tool-call cost of a proposed agent task before running it at scale — given the task's steps, which model each step would use, and roughly how many tool calls each step involves, it produces a per-run cost range, a per-1,000-runs projection, identifies the single most expensive step, and suggests concrete levers to bring the cost down.

## When to use it
- You've designed a multi-step agent workflow and want a cost estimate before committing to run it against a large batch or in production, not after the first invoice arrives.
- You're deciding between two designs for the same task (e.g. one large model doing everything vs. a cheaper model for simple sub-steps) and want a side-by-side cost comparison, not a guess.
- Costs came in higher than expected on a running agent and you want to identify which step is actually driving the spend before deciding what to optimize.

## The Prompt

```
You estimate the token and tool-call cost of an agent task and identify the biggest cost levers.

The task, broken into its steps, with which model each step uses and roughly how much context each step reads/writes (e.g. "Step 1: classify request, GPT-4o-mini, ~200 input tokens, ~20 output tokens"): {{TASK_STEPS}}
Expected number of tool calls per run, and roughly how large each tool result is (e.g. "2 API calls per run, each returning ~1-2KB of JSON"): {{TOOL_CALL_PROFILE}}
Expected run volume (e.g. "500 runs/day", "10,000 one-time batch"): {{RUN_VOLUME}}
Current per-token pricing for each model used, if known (or "estimate using approximate current public pricing"): {{PRICING}}

Instructions:
1. For each step in {{TASK_STEPS}}, estimate its per-run token cost (input + output, at that step's model's pricing from {{PRICING}}). Show the arithmetic: tokens × price-per-token, not just a final number.
2. Fold in {{TOOL_CALL_PROFILE}}'s tool results as additional input tokens to whichever step consumes them (tool results usually get re-fed into context on the next model call) — don't undercount this; it's often the largest hidden cost in agent pipelines.
3. Sum to a total per-run cost range (state it as a range, not false-precision single number, since real token counts vary run to run).
4. Multiply by {{RUN_VOLUME}} to project total cost at that volume (daily, weekly, or one-time as appropriate) — show this as a range too.
5. Identify the single most expensive step by both per-run cost and, if different, by how much its cost would compound if {{RUN_VOLUME}} scales up 10x — a step that's cheap per-run but scales linearly with an unbounded tool-result size deserves separate flagging even if it's not the top line item today.
6. Propose concrete cost-reduction levers, ranked by expected savings: using a smaller/cheaper model for a step that doesn't need frontier-model reasoning (e.g. simple classification, extraction), truncating or summarizing an oversized tool result before it re-enters context, caching a repeated sub-call across runs, or restructuring a step to need fewer tool round-trips. Don't suggest a lever that would degrade output quality without flagging that trade-off explicitly.
7. If {{PRICING}} was estimated rather than given exactly, state that the whole estimate should be treated as directional, not a firm budget number, and name what would need confirming (current published rates for the specific models named) to tighten it.

Output format: Markdown with a per-step cost table (Step, Model, Est. Tokens, Est. Cost/Run), then sections: Total Cost/Run, Projected Cost at {{RUN_VOLUME}}, Most Expensive Step, Cost-Reduction Levers (ranked).
```

## Variables
- `{{TASK_STEPS}}` — the task's steps, with model and rough token usage per step. Required.
- `{{TOOL_CALL_PROFILE}}` — expected tool calls per run and their result size. Required — this is frequently the hidden majority of agent cost.
- `{{RUN_VOLUME}}` — expected number of runs and time frame. Required — turns a per-run number into an actual budget conversation.
- `{{PRICING}}` — known per-token pricing for the models used, or a request to estimate from public rates. Optional but sharpens accuracy.

## Example
**Input:** `{{TASK_STEPS}}` = "Step 1: classify support ticket urgency, GPT-4o-mini, ~300 input / 10 output tokens. Step 2: draft a response, GPT-4o, ~800 input (includes ticket history) / 200 output tokens." `{{TOOL_CALL_PROFILE}}` = "1 API call per run to fetch full ticket history, returning ~1.5KB JSON (~400 tokens), fed into Step 2's input." `{{RUN_VOLUME}}` = "2,000 tickets/day" `{{PRICING}}` = "estimate using approximate current public pricing"

**Output (excerpt):**
```
| Step | Model | Est. Tokens | Est. Cost/Run |
|---|---|---|---|
| 1. Classify urgency | GPT-4o-mini | 300 in / 10 out | ~$0.00005-0.00007 |
| 2. Draft response | GPT-4o | 1,200 in (800 + 400 from tool result) / 200 out | ~$0.005-0.007 |

### Total Cost/Run
~$0.005-0.007 per ticket — Step 2 dominates, driven by both the larger model and the tool result folded into its input.

### Projected Cost at 2,000 tickets/day
~$10-14/day, or roughly $300-420/month at steady volume.

### Most Expensive Step
Step 2 (draft response) — both the current largest line item and the one that scales worst, since ticket history length is unbounded per-ticket; a handful of unusually long tickets could spike this step's cost well past the estimate above.

### Cost-Reduction Levers (ranked)
1. Truncate or summarize ticket history to the last N messages before Step 2, rather than passing the full history — likely the single largest lever, since it caps Step 2's input growth regardless of ticket age.
2. Consider whether Step 1's classification could also gate which tickets get the full GPT-4o treatment in Step 2 vs. a cheaper model for low-urgency tickets — worth testing whether output quality holds up for the low-urgency subset.
3. Caching is unlikely to help here since ticket content differs per run — skip this lever for this specific task.
```

## Tips & Variations
- Distinct from `automation-roi-scoping-worksheet` (agents-and-automation, already shipped), which estimates human time saved vs. build/maintenance cost for a manual-process automation — this prompt is specifically about per-run model/token spend for an agent task already being built or running, a different cost axis entirely.
- Re-run this after applying a cost-reduction lever to confirm the actual savings match the estimate — a truncation lever's real savings depend on how much of the original context was actually redundant, which this prompt can't verify without seeing the before/after.
- If {{RUN_VOLUME}} is a projection rather than a known number, run the estimate at both the expected volume and a pessimistic 3-5x volume — cost problems that look trivial at expected volume can become a real budget conversation if the task scales faster than planned.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

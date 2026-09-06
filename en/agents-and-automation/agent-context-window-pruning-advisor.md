---
id: agent-context-window-pruning-advisor
title: Agent Context-Window Pruning Advisor
category: agents-and-automation
tags: [ai-agents, memory, agent-design]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Decides what to drop, summarize, or keep verbatim from a long-running agent's accumulated context (old tool results, resolved sub-tasks, superseded plans) to stay under a token budget without losing state the task still depends on, and returns a reusable pruning policy rather than a one-off list.

## When to use it
- A long-running agent session is approaching its context window limit and needs a principled policy for what to summarize or drop next, not an ad-hoc guess.
- Designing an agent's memory-management strategy before it ships, so context handling is decided deliberately rather than reactively once overflow first happens in production.
- Debugging an agent that lost track of an earlier constraint or decision after a long session — working out, in hindsight, what should have been kept verbatim instead of summarized away.

## The Prompt

```
You are an agent memory-management advisor. Given an inventory of a long-running agent's accumulated context and its still-in-progress task, decide what to keep, summarize, or drop to fit a token budget.

Context inventory (a list of items currently held in context, each with roughly what it is and how old/recent it is): {{CONTEXT_INVENTORY}}
The task still in progress, in the agent's own words or a summary of its current goal: {{CURRENT_TASK}}
Token budget: current usage vs. target ceiling: {{TOKEN_BUDGET}}

Do the following:
1. Classify every item in {{CONTEXT_INVENTORY}} into one of three buckets: task-critical (removing or summarizing it would risk the agent re-deciding something already settled, or forgetting a constraint {{CURRENT_TASK}} still depends on), reference (useful if referenced again but not actively load-bearing right now), or stale (superseded by a later item, or belongs to a sub-task that's already fully resolved).
2. For every task-critical item, state explicitly why it must stay — name the specific downstream step in {{CURRENT_TASK}} that would break without it. Don't mark something task-critical by default; justify it.
3. For every reference item, propose a compact summary (2-3 sentences max) that preserves the fact it would be needed for, and state what detail is being deliberately dropped.
4. For every stale item, confirm why it's safe to drop entirely — name what superseded it or what sub-task it belonged to that's now closed.
5. Total the token savings from steps 3-4 against {{TOKEN_BUDGET}}; if still over budget after summarizing all reference items, flag which task-critical items would need to move to reference status next and the specific risk of doing so (be honest here — don't just silently downgrade something to make the budget work).
6. Output a short reusable rule, not just this one-time list: a 2-3 sentence heuristic this agent (or a similar one) can apply going forward without re-running this full analysis every time (e.g. "drop full tool-call payloads older than N turns once their result has been summarized into the running plan; never drop a stated user constraint, only the evidence that produced it").

Output format: three labeled lists (Task-Critical / Reference — Summarized / Stale — Dropped), a budget-fit verdict, and the reusable rule.
```

## Variables
- `{{CONTEXT_INVENTORY}}` — the items currently held in the agent's context, each with a rough description and age. Required.
- `{{CURRENT_TASK}}` — the task still in progress, so criticality can be judged against a real goal rather than guessed. Required.
- `{{TOKEN_BUDGET}}` — current token usage versus the target ceiling. Required — drives whether pruning has to go beyond summarizing into downgrading task-critical items.

## Example
**Input:** `{{CONTEXT_INVENTORY}}` = "1) Full API docs page fetched 40 turns ago (used once, early). 2) User's stated constraint: 'never write to the prod database directly.' 3) Full stack trace from a bug fixed 15 turns ago. 4) Draft migration plan, revised 3 times, latest revision 2 turns ago. 5) Tool output: full contents of a 200-line config file fetched 5 turns ago, still being edited." `{{CURRENT_TASK}}` = "Finish writing and validating the migration plan from item 4, then apply it to staging." `{{TOKEN_BUDGET}}` = "18,000 / 12,000 target tokens — need to cut ~6,000."

**Output (excerpt):**
```
### Task-Critical
- Item 2 (prod-write constraint) — the migration plan in item 4 must respect this; dropping it risks the agent proposing a direct prod write later.
- Item 4 (latest migration plan revision) — this is the task itself; only the latest revision is needed, not the two earlier drafts.
- Item 5 (config file, still being edited) — actively referenced by the in-progress plan.

### Reference — Summarized
- Item 1 (API docs page) → "Auth endpoint requires a bearer token in the X-Auth header; rate limit is 100 req/min." (~1,800 tokens saved)

### Stale — Dropped
- Item 3 (old stack trace) — bug it describes is already fixed and confirmed; no longer referenced by item 4. (~2,400 tokens saved)

### Budget-Fit Verdict
~4,200 tokens saved so far, ~1,800 short of the 6,000 target. No task-critical item is safe to downgrade without risk — recommend instead trimming item 5's config file to only the sections still being edited, rather than sacrificing the prod-write constraint or the current plan.

### Reusable Rule
Drop tool outputs once their finding has been folded into a later decision; keep the latest revision of any evolving plan and drop earlier revisions outright; never summarize away a stated user constraint, only the evidence that produced it.
```

## Tips & Variations
- Pair with `long-running-agent-checkpoint-resume-designer` (agents-and-automation, backlog) once that ships — a checkpoint format is exactly the kind of compact, task-critical summary this prompt's step 3 produces.
- If the agent uses a hierarchical/sub-agent architecture, run this per sub-agent rather than on the whole shared context — a sub-agent's stale items are often a parent's task-critical ones.
- Distinct from `automation-roi-scoping-worksheet` (already shipped), which estimates whether building an automation is worth it; this prompt manages an already-running agent's live memory, not a build decision.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

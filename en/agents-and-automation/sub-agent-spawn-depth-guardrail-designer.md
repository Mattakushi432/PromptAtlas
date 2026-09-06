---
id: sub-agent-spawn-depth-guardrail-designer
title: Sub-Agent Spawn & Depth Guardrail Designer
category: agents-and-automation
tags: [multi-agent-workflows, guardrails, cost-optimization]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Designs concrete limits on how many sub-agents a parent agent may spawn and how deep a delegation chain may recurse — max fan-out, max depth, per-branch budget, and what happens when a limit is hit — given a description of the orchestration pattern, to prevent runaway recursive delegation before it happens rather than after a cost incident.

## When to use it
- Building a multi-agent system where a parent agent can delegate to sub-agents that can themselves delegate further, and no explicit ceiling exists yet on how far that can go.
- After (or before) a cost or runtime incident where an agent's delegation fanned out further than intended, to design the specific limit that would have caught it.
- Reviewing an existing orchestration pattern for a hidden unbounded-recursion risk before it ships to a setting where task complexity is unpredictable.

## The Prompt

```
You design spawn and recursion guardrails for a multi-agent system. Given the orchestration pattern below, propose concrete numeric limits and the behavior when each is hit.

Orchestration pattern (how a parent agent decides to spawn a sub-agent, and whether those sub-agents can spawn further sub-agents themselves): {{ORCHESTRATION_PATTERN}}
Typical task complexity (how much fan-out or depth a normal, well-behaved task actually needs): {{TYPICAL_COMPLEXITY}}
Cost/latency ceiling per top-level task (a rough token, dollar, or wall-clock budget for one full run): {{COST_CEILING}}

Do the following:
1. Propose a max fan-out limit (how many direct sub-agents one parent may spawn at once) and a max depth limit (how many levels of delegation are allowed below the top-level agent), each justified against {{TYPICAL_COMPLEXITY}} — set limits with real headroom above normal use, not the bare minimum that would technically work, since overly tight limits break legitimate complex tasks.
2. State the total-node ceiling implied by fan-out × depth (worst case), and check it against {{COST_CEILING}} — if the worst case would blow the budget even within the proposed fan-out/depth limits, tighten one of them and say which, with the reasoning.
3. Design what happens when a limit is hit mid-task: a hard stop with an error, a fallback to completing the remaining work non-delegated (single-agent), or an escalation to a human — pick based on how reversible/costly a truncated result would be for this pattern, and state the reasoning, not just the choice.
4. Flag the specific failure mode this guards against for {{ORCHESTRATION_PATTERN}} as described (e.g. "a sub-agent re-delegating a slightly-reworded version of its own task to a new sub-agent, looping without making progress" vs. "a genuinely wide fan-out task that legitimately needs many parallel sub-agents").
5. Note where the limit should be enforced (in the orchestrator's dispatch logic, not just as an instruction in the sub-agent's own prompt) — a text-only limit inside a system prompt is not a real guardrail since a sub-agent can't reliably self-enforce a global budget it can't see.

Output format: Markdown with sections Proposed Limits, Worst-Case Check, Limit-Hit Behavior, Failure Mode Guarded Against, Enforcement Point.
```

## Variables
- `{{ORCHESTRATION_PATTERN}}` — how sub-agents get spawned and whether they can spawn further sub-agents. Required.
- `{{TYPICAL_COMPLEXITY}}` — how much fan-out/depth a normal task actually needs, so limits aren't set arbitrarily tight or loose. Required.
- `{{COST_CEILING}}` — a rough per-run budget (tokens, dollars, or wall-clock time) to check the worst case against. Required.

## Example
**Input:** `{{ORCHESTRATION_PATTERN}}` = "A research-planner agent can spawn up to one sub-agent per identified sub-question; each sub-agent can itself spawn further sub-agents if it decides its sub-question needs further breakdown. No current limit on how many times this can recurse." `{{TYPICAL_COMPLEXITY}}` = "Normal research tasks break into 3-6 sub-questions; a sub-question needing further breakdown is rare, usually only one level deep." `{{COST_CEILING}}` = "~$2 in model spend per top-level research task."

**Output (excerpt):**
```
### Proposed Limits
- Max fan-out: 8 direct sub-agents per parent (normal use is 3-6; headroom for unusually broad tasks without allowing near-unbounded spawning).
- Max depth: 2 levels below the top-level agent (normal use rarely needs a second breakdown; a third level almost certainly signals a sub-agent re-delegating rather than genuinely decomposing further).

### Worst-Case Check
8 fan-out × 2 depth = up to 64 sub-agent invocations in the worst case. At a rough $0.03/invocation average, that's ~$1.92 — within the $2 ceiling but with little margin; recommend max depth of 2 stands but max fan-out should include a secondary per-level cap (e.g. depth-2 sub-agents capped at 4 fan-out, not 8) to keep worst-case comfortably under budget.

### Limit-Hit Behavior
Hard stop with a structured error naming which limit was hit and the partial results gathered so far, rather than a silent fallback — a research task's value depends on knowing which sub-questions were actually covered, so a silently-truncated result without that flag could be mistaken for a complete one.

### Failure Mode Guarded Against
A sub-agent that decides its sub-question is "still too broad" repeatedly instead of producing a partial answer — depth limit forces it to answer with what it has by level 2 rather than recursing indefinitely on a genuinely open-ended question.

### Enforcement Point
Enforce fan-out and depth counters in the orchestrator's dispatch function (a shared counter passed down and checked before every spawn call), not as an instruction inside each sub-agent's own prompt — a sub-agent has no visibility into how many siblings or ancestors already exist.
```

## Tips & Variations
- Distinct from `multi-agent-handoff-protocol-designer` (already shipped), which designs the trigger/payload/acknowledgment mechanics of one handoff between two agents; this prompt designs the aggregate-scale limit across the whole delegation tree, not any single handoff's mechanics.
- Distinct from `retry-fallback-policy-designer` (already shipped), which covers per-tool-call retry/give-up logic for a single agent's tool failures, not the fan-out/recursion shape of spawning other agents.
- If {{ORCHESTRATION_PATTERN}} allows sub-agents to spawn agents of a genuinely different type (not just recursive copies of themselves), consider a separate per-agent-type budget rather than one global counter — a cheap classifier sub-agent and an expensive tool-using sub-agent shouldn't share the same fan-out ceiling.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

---
id: multi-agent-shared-state-conflict-reviewer
title: Multi-Agent Shared-State Conflict Reviewer
category: agents-and-automation
tags: [multi-agent-workflows, race-conditions, concurrency]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Reviews a description of how multiple agents concurrently read and write a piece of shared state (a shared document, a task queue, a KV store, a shared file) and flags where two agents' overlapping writes could race, silently overwrite each other, or leave the state in an inconsistent half-updated shape — with concrete fixes (locking, versioning, ownership splitting) rather than a generic "add a mutex" comment.

## When to use it
- You're designing or reviewing a multi-agent system where more than one agent writes to the same shared resource (a shared task list, a shared scratchpad document, a shared cache) and want to know where that's actually unsafe before it ships.
- An intermittent bug is showing up where one agent's update seems to vanish or get overwritten, and you suspect a race between two agents rather than a single-agent logic error.
- You're about to add a second concurrent writer to a piece of state that previously had only one, and want to know what changes before you do.

## The Prompt

```
You review a multi-agent system's shared-state design for concurrency conflicts.

The shared state and what it holds: {{SHARED_STATE}}
The agents that read/write it, and what each one does to it (read-only, append, overwrite a field, delete): {{AGENTS_AND_ACCESS}}
How access is currently coordinated, if at all (e.g. "no coordination — each agent just calls the API directly", "a lock file", "last-write-wins", "unknown"): {{CURRENT_COORDINATION}}

Instructions:
1. Map access patterns: for each agent in {{AGENTS_AND_ACCESS}}, classify its operations on {{SHARED_STATE}} as read, append-only, or read-modify-write (read a value, compute something from it, write it back). Read-modify-write is the dangerous pattern — flag every instance.
2. Identify concrete race windows: for each read-modify-write operation, describe the specific interleaving that causes data loss or corruption (e.g. "Agent A reads count=5, Agent B reads count=5 before A writes, both compute 6, B's write clobbers A's increment — net count is 6 instead of 7"). Use the actual field/operation names from {{SHARED_STATE}}, not a generic example.
3. Assess {{CURRENT_COORDINATION}}: state plainly whether it actually prevents the race windows found in step 2, or only appears to (e.g. "last-write-wins" prevents corruption but silently discards one agent's update, which may itself be the real bug).
4. Recommend the cheapest fix that closes each race window, in order of preference: (a) split ownership so only one agent ever writes a given field, (b) make writes append-only/idempotent so ordering doesn't matter, (c) add optimistic concurrency (version/etag check before write, retry on conflict), (d) add a lock only as a last resort, since it's the option most likely to introduce deadlocks or throughput bottlenecks between agents. Justify why lower-numbered options weren't sufficient for cases where you reach for (c) or (d).
5. Flag any single point of failure the fix introduces (e.g. a lock holder that crashes mid-update leaving state locked forever) and how to bound it (a lease timeout, not an indefinite lock).

Output format: Markdown report with sections: Access Pattern Map, Race Windows Found, Coordination Assessment, Recommended Fixes (one subsection per race window, cheapest-fix-first), Residual Risks.
```

## Variables
- `{{SHARED_STATE}}` — the shared resource and what it holds. Required.
- `{{AGENTS_AND_ACCESS}}` — the agents involved and what each does to the state. Required — this is the entire basis for the access-pattern map.
- `{{CURRENT_COORDINATION}}` — how access is coordinated today, or "unknown"/"none" if it isn't. Required — drives whether the review is "harden this" or "there is nothing here yet."

## Example
**Input:** `{{SHARED_STATE}}` = "A shared JSON task queue file: a list of task objects, each with a `status` field (pending/in_progress/done)." `{{AGENTS_AND_ACCESS}}` = "Agent A (dispatcher) reads the list, picks the first `pending` task, sets its status to `in_progress`, writes the file back. Agent B (same logic, second instance for throughput) does the identical read-pick-write." `{{CURRENT_COORDINATION}}` = "none — each agent just reads and rewrites the file directly."

**Output (excerpt):**
```
### Access Pattern Map
Both Agent A and Agent B perform an identical read-modify-write on the task list: read all tasks, find the first `pending`, flip its status, write the whole file back.

### Race Windows Found
Classic double-dispatch: A reads the list, sees task #3 as the first `pending`. Before A writes back, B also reads the list — still sees task #3 as `pending` (A's write hasn't landed yet). Both A and B independently flip task #3 to `in_progress` and write back; whichever writes last wins, but both agents now believe *they* claimed task #3 and both start working it. Net effect: task #3 is processed twice, and whatever task the losing write's other changes touched is silently lost if the file write isn't atomic per-task.

### Coordination Assessment
{{CURRENT_COORDINATION}} = none. This does nothing to prevent the double-dispatch above — it's not a partial mitigation, it's the direct cause.

### Recommended Fixes
**Double-dispatch on task claim** — cheapest fix: (a) split ownership isn't viable here since both agents need to pick from the same pool, so it doesn't apply. (b) append-only doesn't fit a status-flip. (c) optimistic concurrency: have each agent claim a task by writing `in_progress` with its own agent-id and a version/timestamp, then re-read to confirm its own id won; if not, treat the task as claimed by the other agent and pick the next `pending` one instead. This is the standard fix and needs no lock. Reserve (d) a real lock only if the storage layer can't support a compare-and-swap style claim at all (e.g. a plain shared file with no atomic rename).

### Residual Risks
If the claim uses a lock file instead of compare-and-swap, an agent that crashes after acquiring the lock but before releasing it will leave the queue stuck — bound this with a lease timeout (e.g. 30s), not an indefinite hold.
```

## Tips & Variations
- Distinct from `multi-agent-handoff-protocol-designer` (already shipped): that prompt designs a sequential, single-owner-at-a-time handoff between two agents; this one reviews *concurrent* access where two agents can act on the same state at the same moment — a handoff protocol done right is actually one way to avoid needing this review at all, worth noting when the fix in step 4 turns out to be "give one agent exclusive ownership."
- If {{AGENTS_AND_ACCESS}} describes more than 2-3 agents touching the same state, ask for the busiest/riskiest pair first rather than trying to map every pairwise interleaving in one pass — the combinatorics get unreadable past a handful of agents.
- Pair with `retry-fallback-policy-designer` (already shipped) once a fix introduces optimistic-concurrency retries — that prompt covers the retry/backoff policy itself, this one only identifies that a retry is needed and why.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

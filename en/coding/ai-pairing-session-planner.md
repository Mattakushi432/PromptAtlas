---
id: ai-pairing-session-planner
title: AI Pairing Session Planner
category: coding
tags: [ai-agents, pair-programming, workflow]
target_models: [Claude Code, Cursor, GitHub Copilot]
difficulty: beginner
version: 1.0.1
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Plans how to structure a pair-programming session with an AI for a specific task — who drives which parts, checkpoints, when to accept AI suggestions vs. push back — a session-structure plan, distinct from `ai-coding-prompt-writer` (crafting one prompt) and `agent-task-splitter` (multi-agent task decomposition). For deciding how to work with AI on a task, not what to say to it.

## When to use it
- Starting a substantial task with an AI coding assistant and wanting a deliberate plan for the session rather than open-ended back-and-forth.
- New to AI-pair-programming and wanting a concrete structure to follow instead of figuring out the working rhythm by trial and error.
- A task has a mix of parts well-suited to AI (boilerplate, well-specified logic) and parts that need human judgment (architecture decisions, ambiguous requirements) and you want to plan the division deliberately.

## The Prompt

```
You plan how to structure a pair-programming session with an AI coding assistant for a specific task — a session plan, not a single prompt.

Task description: {{TASK_DESCRIPTION}}
My experience level with this codebase/domain (optional — affects how much I should drive vs. defer): {{EXPERIENCE_LEVEL}}
Time available (optional): {{TIME_AVAILABLE}}

Instructions:
1. Break the task into phases and, for each, recommend who should drive: AI-driven (well-specified, mechanical, or boilerplate-heavy work where AI output can be quickly verified) versus human-driven with AI assisting (architecture decisions, ambiguous requirements, anything where getting it wrong is costly to unwind) versus genuinely collaborative (design discussion before implementation).
2. Recommend explicit checkpoints: points in the session where you should stop and review AI output critically before continuing, rather than accepting a long uninterrupted AI-driven stretch — the longer AI works unchecked, the more a wrong early assumption compounds.
3. Identify the specific things worth clarifying with the AI BEFORE it starts generating code (constraints, existing patterns to follow, what's explicitly out of scope) since catching a misunderstanding before code exists is far cheaper than after.
4. Recommend a verification approach for each AI-driven phase — what you'll actually check (does it run, do the tests pass, does the logic match intent) rather than accepting output on the basis that it looks reasonable.
5. If {{EXPERIENCE_LEVEL}} indicates unfamiliarity with the codebase/domain, weight the plan toward more frequent checkpoints and more human-driven phases, since verifying AI output well requires enough context to know what "correct" looks like.
6. If {{TIME_AVAILABLE}} is tight, recommend which phases to prioritize for AI-driven speed and which (if any) can be deferred or simplified, rather than trying to cover everything shallowly.
7. Note the failure mode to watch for specifically: accepting AI output because reviewing it carefully feels slower than just moving on — flag this as the primary risk this plan is designed to guard against.

Output format: Markdown, phases in order, each with: who drives, why, and the checkpoint/verification for that phase.
```

## Variables
- `{{TASK_DESCRIPTION}}` — the task to plan a session for. Required.
- `{{EXPERIENCE_LEVEL}}` — your familiarity with the relevant codebase/domain. Optional but affects how much verification rigor to build in.
- `{{TIME_AVAILABLE}}` — how much time is available for the session. Optional.

## Example
**Input:** `{{TASK_DESCRIPTION}}` = "implement a new payment webhook handler, including signature verification and idempotency", `{{EXPERIENCE_LEVEL}}` = "familiar with the codebase, new to this specific payment provider's webhook format".

**Output (excerpt):**
```
## Phase 1: Clarify webhook contract and idempotency approach — Human-driven, with AI research assistance
Before any code: confirm the exact webhook payload shape and signature verification method from the provider's docs, and decide the idempotency key strategy (likely the provider's event ID). Getting this wrong is expensive to unwind since it affects the endpoint's whole shape.

## Phase 2: Implement signature verification — AI-driven
Well-specified once the method is confirmed in Phase 1; this is a mechanical implementation of a documented crypto verification step.
Checkpoint: verify against the provider's official test payload/signature pair, not just "the code looks right" — signature verification bugs are silent and dangerous.

## Phase 3: Implement the handler logic and idempotency check — AI-driven, human review before merge
Checkpoint: since idempotency is a correctness-critical, easy-to-get-subtly-wrong area, review the AI's implementation against a specific scenario: what happens if the exact same webhook is delivered twice in quick succession?
```

## Tips & Variations
- For a task that's mostly exploratory (you don't yet know the right approach), weight the plan toward more human-driven discussion phases before handing off implementation, since AI works best once the approach is decided, not while it's still being figured out.
- Revisit the plan mid-session if the task turns out easier or harder than expected — this is a starting structure, not a rigid script.

## Changelog
- 1.0.1 (2026-08-30): Narrowed `target_models` to the actual agentic coding tools this prompt targets (Claude Code, Cursor, GitHub Copilot) instead of the generic chat-model list.
- 1.0.0 (2026-08-29): Initial version.

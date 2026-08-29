---
id: agent-task-splitter
title: Agent Task Splitter
category: coding
tags: [ai-agents, task-planning, multi-agent-workflows]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Breaks a feature into agent-sized subtasks for a multi-agent coding workflow — sequenced, scoped, with clear boundaries and handoff points — for orchestrating several AI agents (or several sequential agent sessions) on one feature. Distinct from `agent-architecture-audit`-type prompts: this is task decomposition, not architecture design.

## When to use it
- A feature is large enough that one AI agent session working on all of it risks losing focus or producing an unfocused, hard-to-review diff.
- Using a multi-agent workflow (parallel or sequential agents, each with a scoped task) and needing the actual task breakdown before dispatching work.
- Deciding which parts of a feature are safe to parallelize across agents versus which have dependencies requiring sequential execution.

## The Prompt

```
You break a feature into agent-sized subtasks for a multi-agent (or sequential multi-session) coding workflow — concrete, scoped tasks with clear boundaries, not a generic project plan.

Feature description: {{FEATURE_DESCRIPTION}}
Codebase context (optional — relevant existing structure/patterns): {{CODEBASE_CONTEXT}}
Execution model (optional — "parallel agents working simultaneously" vs. "sequential sessions, one at a time"): {{EXECUTION_MODEL}}

Instructions:
1. Decompose the feature into subtasks scoped to what one agent session can complete coherently: focused enough to produce a reviewable, single-purpose diff, not so granular that coordination overhead exceeds the value of splitting.
2. Identify true dependencies between subtasks (subtask B needs a type/interface/migration that subtask A creates) versus false dependencies (subtasks that only feel related but don't actually block each other) — only sequence what genuinely must be sequenced.
3. If {{EXECUTION_MODEL}} is parallel, explicitly identify which subtasks can safely run concurrently without file/merge conflicts (touching disjoint files/modules) and flag any pair that's risky to parallelize (both likely to touch the same file) even if not strictly dependent.
4. For each subtask, define a clear boundary: what files/areas it should touch, and explicitly what it should NOT touch — this is the single most important thing for keeping agent-produced diffs mergeable, since an under-scoped task description is the most common cause of an agent wandering into unrelated code.
5. Define the interface/contract each subtask hands off to the next (a function signature, a data shape, an API contract) BEFORE either subtask is dispatched, if subtasks are sequential/dependent — agreeing the contract upfront avoids one agent's implementation choice silently breaking the next agent's assumptions.
6. For each subtask, state what "done" looks like concretely (a specific test passing, a specific behavior demonstrable) so a coordinating process (human or agent) can verify completion before dispatching dependent work.
7. Flag any part of the feature that's ambiguous enough that a subtask agent would likely need to make a judgment call — resolve that ambiguity in the task breakdown itself rather than leaving it for an agent to guess inconsistently across subtasks.

Output format: Markdown, one entry per subtask, in dependency/execution order: name, scope (touches/doesn't touch), inputs needed from prior subtasks, definition of done. Followed by a dependency graph description (which subtasks block which, which can run in parallel).
```

## Variables
- `{{FEATURE_DESCRIPTION}}` — the full feature to decompose. Required.
- `{{CODEBASE_CONTEXT}}` — relevant existing structure the subtasks need to fit into. Optional but improves scoping accuracy.
- `{{EXECUTION_MODEL}}` — parallel or sequential agent execution. Optional but changes what needs to be flagged (parallelization safety vs. just sequencing).

## Example
**Input:** `{{FEATURE_DESCRIPTION}}` = "add a 'saved searches' feature: users can save a search query, view their saved searches, and get notified when new results match", `{{EXECUTION_MODEL}}` = "sequential sessions".

**Output (excerpt):**
```
### Subtask 1: Data model and API for saving/listing searches
Scope: new `saved_searches` table/migration, `POST /api/saved-searches` and `GET /api/saved-searches` endpoints. Does NOT touch notification logic or frontend.
Definition of done: endpoints tested and functional; a saved search can be created and retrieved via API.

### Subtask 2: Frontend UI for saving and viewing searches
Depends on: Subtask 1's API contract (exact request/response shape).
Scope: a "save this search" button on the search results page, a "saved searches" list page. Does NOT touch backend or notification logic.
Definition of done: a user can save a search from the UI and see it in their saved list.

### Subtask 3: Notification job for new matching results
Depends on: Subtask 1's data model (needs to query saved searches).
Scope: a background job comparing new results against saved searches and triggering a notification. Does NOT touch the UI beyond a notification display if one doesn't already exist.
Definition of done: a test demonstrating a new matching result triggers a notification for the relevant saved search.

**Parallelization note:** Subtask 2 and Subtask 3 can run in parallel once Subtask 1 is complete — they don't touch the same files and neither depends on the other's output.
```

## Tips & Variations
- For a genuinely novel/ambiguous feature, run a smaller planning pass first (or use a dedicated planning agent) before this decomposition — this prompt works best when the feature's overall shape is already reasonably clear.
- If using literal parallel agents, explicitly ask for a suggested file-ownership map (which subtask "owns" which files) as an extra collision-avoidance measure beyond the dependency analysis alone.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

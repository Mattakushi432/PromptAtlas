---
id: ai-coding-prompt-writer
title: AI Coding Prompt Writer
category: coding
tags: [ai-agents, prompt-engineering, developer-productivity]
target_models: [Claude Code, Cursor, GitHub Copilot]
difficulty: intermediate
version: 1.0.1
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Helps a developer turn a rough coding task into a well-formed prompt for an AI coding agent (Claude Code, Cursor, Copilot Chat, etc.) — a meta-prompt that improves the next prompt, not a spec document itself. Distinct from `spec-from-vague-request` (produces a spec artifact): this coaches prompt-writing skill and produces a ready-to-send prompt.

## When to use it
- About to ask an AI coding agent for something non-trivial and wanting the first prompt to actually work, instead of iterating five times to get there.
- A previous AI coding session went badly (wrong assumptions, scope creep, hallucinated APIs) and you want to understand what about the prompt caused it.
- Teaching a team how to prompt AI coding tools more effectively by seeing their actual task reworked, not reading generic prompting tips.

## The Prompt

```
You help me turn a rough coding task into an effective prompt for an AI coding agent — producing a ready-to-send prompt, not just general prompting advice.

My rough task description: {{ROUGH_TASK}}
Target AI tool (optional — e.g. "Claude Code with repo access", "ChatGPT with no codebase access", "Cursor"): {{TARGET_TOOL}}
Relevant codebase context I could include (optional — file paths, existing patterns, constraints): {{AVAILABLE_CONTEXT}}

Instructions:
1. Identify what's underspecified in {{ROUGH_TASK}} that would cause an AI agent to guess wrong: missing acceptance criteria (what does "done" look like), missing constraints (which existing patterns/libraries must be used vs. avoided), ambiguous scope (does this include tests? migration? just the happy path?).
2. If {{TARGET_TOOL}} has repo/codebase access, recommend what specific context to point it at (particular files, an existing similar implementation to follow as a pattern) rather than re-explaining everything in prose the agent could just read from the code.
3. If {{TARGET_TOOL}} has no codebase access, identify what context must be pasted inline since the agent can't discover it itself (relevant existing code, the actual error message, the specific library version) — a prompt to a context-blind tool needs to be more self-contained.
4. Add explicit boundaries: what NOT to change (don't touch unrelated files, don't refactor beyond the task, don't add new dependencies without asking) if the task is the kind where an agent might reasonably over-scope — this is a common source of unwanted sprawling diffs.
5. Specify the verification step you want the agent to do before considering the task complete (run the tests, check a specific behavior) so the interaction includes a self-check rather than ending at "I made the change."
6. If the task is large enough that a single prompt risks an unfocused result, suggest breaking it into a sequence of smaller prompts instead, and show the first one.
7. Produce the actual improved prompt text, ready to paste — not a description of what a good prompt would contain.

Output format: Markdown with sections: What Was Underspecified, Improved Prompt (in a code block, ready to use), and (if relevant) Suggested Follow-Up Prompts.
```

## Variables
- `{{ROUGH_TASK}}` — the task as you'd naturally describe it, unpolished. Required.
- `{{TARGET_TOOL}}` — the specific AI coding tool this prompt is for, since context-access differs. Optional but sharply affects what needs to be included inline.
- `{{AVAILABLE_CONTEXT}}` — relevant codebase details you could include. Optional.

## Example
**Input:** `{{ROUGH_TASK}}` = "add caching to the user profile endpoint, it's slow", `{{TARGET_TOOL}}` = "Claude Code with repo access".

**Output (excerpt):**
```
## What Was Underspecified
No acceptance criteria for "slow" (how slow, and what's an acceptable target?), no caching strategy specified (TTL? invalidation on profile update?), no boundary on which endpoint file(s) to touch if there are multiple similar endpoints.

## Improved Prompt
Add caching to the `GET /api/users/:id/profile` endpoint in `src/routes/users.ts` — it currently takes ~800ms due to a multi-table join. Use the existing Redis caching pattern already established in `src/routes/orders.ts` (cache-aside, 5-minute TTL) rather than introducing a new caching approach. Invalidate the cache entry when the profile is updated via `PUT /api/users/:id/profile` in the same file. Don't touch other endpoints. After implementing, run the existing test suite for this route and add a test confirming the cache is invalidated on update.
```

## Tips & Variations
- For an agent with autonomous multi-step execution (able to run commands, read multiple files), explicitly note it should investigate the existing pattern itself before implementing, rather than assuming the pattern description in the prompt is exhaustive.
- Keep a small personal library of prompts that worked well for recurring task types (add an endpoint, add a migration, add a test) and reuse/adapt them instead of starting fresh each time.

## Changelog
- 1.0.1 (2026-08-30): Narrowed `target_models` to the actual agentic coding tools this prompt targets (Claude Code, Cursor, GitHub Copilot) instead of the generic chat-model list.
- 1.0.0 (2026-08-29): Initial version.

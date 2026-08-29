---
id: spec-from-vague-request
title: Spec from Vague Request
category: coding
tags: [ai-agents, specification, requirements]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Turns a vague feature request ("make it easier to find old orders", "the dashboard should be smarter") into a clear technical spec an AI coding agent (or a human) can actually implement — surfacing the ambiguities rather than silently resolving them. Distinct from `ai-coding-prompt-writer` (crafts a prompt for one task) and `adr-drafter` (documents a decision already made): this turns an unclear ask into an implementable spec.

## When to use it
- A stakeholder or product request is too vague to hand directly to an engineer or AI agent without someone first figuring out what it actually means.
- Preparing a well-formed ticket/spec before delegating implementation, so the implementer isn't the one making product decisions by default.
- Reviewing your own vague idea before starting to build, to catch that you don't actually know what "done" looks like yet.

## The Prompt

```
You turn a vague feature request into a clear technical specification — surfacing what's ambiguous and proposing specific resolutions, not silently picking interpretations and hiding the ambiguity.

Vague request (verbatim, as given): {{VAGUE_REQUEST}}
Context (optional — the product/system this is for, who requested it, any known constraints): {{CONTEXT}}

Instructions:
1. Identify every point of genuine ambiguity in the request — a vague adjective ("easier," "smarter," "better") that could mean several different concrete things, an unstated scope boundary (does this apply to all users or a specific segment?), an implied but unconfirmed behavior.
2. For each ambiguity, propose a specific, reasonable interpretation — don't just list open questions with no proposed answer, since that pushes the work back onto whoever reads the spec. Make a call and clearly mark it as an assumption to confirm, so it's easy for a reviewer to accept or override quickly.
3. Write concrete acceptance criteria: specific, testable statements of what must be true for this feature to be considered done — not a restatement of the vague request in slightly more words.
4. Define explicit scope boundaries: what this feature explicitly does NOT include, especially anything a reasonable reader might assume is included but isn't — this prevents scope creep during implementation and prevents a reviewer from being surprised by what's missing.
5. Note edge cases the spec needs to address even though the original request didn't mention them (what happens with zero results, with a very large number of results, for a user without permission) — a spec that only covers the typical case will produce an implementation with the same gap.
6. If the request implies a UI/UX change, describe the specific behavior/interaction, not just the outcome — "easier to find" needs to become a specific mechanism (a filter, a search, a sort option) for anyone to implement it.
7. Keep the spec's length proportional to the feature's actual complexity — don't pad a genuinely simple request with unnecessary structure, but don't undersell a request that's more complex than it initially sounds.

Output format: Markdown with sections: Assumptions Made (each flagged for confirmation), Acceptance Criteria, Explicit Non-Goals, Edge Cases to Handle.
```

## Variables
- `{{VAGUE_REQUEST}}` — the request as originally given, unedited. Required.
- `{{CONTEXT}}` — background on the product/system and requester. Optional but improves the quality of proposed interpretations.

## Example
**Input:** `{{VAGUE_REQUEST}}` = "make it easier to find old orders", `{{CONTEXT}}` = "e-commerce admin dashboard; requested by a support team lead who fields customer order lookup requests".

**Output (excerpt):**
```markdown
## Assumptions Made
- "Easier to find" is interpreted as: add a search-by-order-date-range and search-by-customer-email filter to the existing orders list, since the requester is on the support team and typically looks up orders by customer info or approximate date, not by order ID (which is already searchable). **Confirm this interpretation with the requester** — it could alternatively mean improving search relevance/ranking rather than adding new filter fields.
- "Old orders" is assumed to mean orders older than 90 days, since the existing list already defaults to showing recent orders — confirm whether there's a specific threshold in mind.

## Acceptance Criteria
- A support user can filter the orders list by a date range spanning any period, including orders older than 90 days.
- A support user can filter/search by customer email and see matching orders regardless of order age.

## Explicit Non-Goals
- This does not change how orders are archived or stored — it's a search/filter UI change only, not a data retention change.
- This does not add full-text search across order contents (line items, notes) — only date range and customer email, per the assumed scope above.

## Edge Cases to Handle
- Zero matching orders for a given filter: show a clear "no orders found" state, not a blank/broken list.
- A customer email that matches multiple accounts (if email isn't unique in this system): clarify with requester whether this is possible and how it should be handled.
```

## Tips & Variations
- For a request that turns out to have very few real ambiguities, produce a short spec rather than padding it — the goal is clarity, not a mandatory template length.
- If multiple stakeholders might have different implicit interpretations of the same vague request, explicitly flag where interpretations could reasonably diverge between them, not just present one person's likely intent.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

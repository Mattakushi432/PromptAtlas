---
id: tool-schema-reviewer
title: Tool / Function Schema Reviewer
category: agents-and-automation
tags: [tool-use, schema-review, agent-design]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Reviews a function-calling / tool schema for ambiguity, missing constraints, and unsafe defaults before it ships — the schema, not the agent, is usually the root cause when an agent keeps calling a tool wrong.

## When to use it
- Defining a new tool for an agent and want a second pair of eyes before wiring it up.
- Debugging why an agent keeps misusing a tool.
- Auditing an existing set of tool definitions for consistency.

## The Prompt

```
You are reviewing a tool/function schema that an AI agent will use to call an external system. Bad schemas cause silent misuse — vague parameter names, missing constraints, and undocumented error behavior are the most common root causes of an agent calling a tool wrong.

Schema to review:
{{TOOL_SCHEMA}}

Context (optional): {{USAGE_CONTEXT}}

Review it for:
1. **Ambiguous parameters** — any name/description a model could misinterpret (units, format, whether a field is an ID vs. a name, optional vs. required).
2. **Missing constraints** — value ranges, enums, or formats that exist in reality but aren't encoded (e.g. a "currency" field with no enum, an "amount" with no sign/range).
3. **Undocumented failure modes** — what happens on a not-found ID, a permission error, a timeout — is that described anywhere the model can act on it?
4. **Dangerous defaults** — any parameter that, if omitted, does something destructive or expensive by default instead of failing safe.
5. **Redundant or overlapping tools** — if {{USAGE_CONTEXT}} mentions other tools, flag any that could be confused with this one.

For each issue: quote the exact field, explain the concrete failure it enables (not just "unclear"), and give the corrected schema fragment.

If the schema has no issues in a category, say so explicitly. End with one line: ready to ship, or needs revision — and why.
```

## Variables
- `{{TOOL_SCHEMA}}` — the tool/function definition (JSON Schema, OpenAPI fragment, or plain description). Required.
- `{{USAGE_CONTEXT}}` — optional: what other tools exist alongside it, or how it's typically called.

## Example
**Input:** `{{TOOL_SCHEMA}}` defines `issue_refund(order_id: string, amount: number)` with no currency field, no max value, and no documented error behavior.

**Output (excerpt):**
```
## Missing constraints
- `amount` has no currency field or maximum value — an agent could issue a refund in the wrong currency, or for an unbounded amount.
  Fix: add `currency: enum [USD, EUR, ...]` and `amount: number, maximum: <order total>`.

**Verdict:** Needs revision — the unbounded `amount` is a real financial-risk gap.
```

## Tips & Variations
- For MCP tool definitions specifically, check whether the `description` field alone (without external docs) is enough for a model to use the tool correctly.
- For multi-tool systems, run this once per tool, then a separate pass comparing all tool descriptions pairwise for overlap.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

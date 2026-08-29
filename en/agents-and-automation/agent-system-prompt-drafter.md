---
id: agent-system-prompt-drafter
title: Agent System Prompt Drafter
category: agents-and-automation
tags: [system-prompt, agent-design, drafting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Turns a role description into a complete, testable system prompt — identity, scope, tool usage, output format, guardrails, and escalation — instead of a vague one-paragraph persona.

## When to use it
- Standing up a new agent or assistant and you need a real starting system prompt, not a blank page.
- Turning an internal "what should this bot do" doc into an actual prompt.
- Rewriting an existing system prompt that grew organically and lost structure.

## The Prompt

```
You are a prompt engineer who writes production system prompts for AI agents. Given a description of a role, write a complete system prompt for it.

Context:
- Role / job description: {{ROLE_DESCRIPTION}}
- Available tools (if any): {{AVAILABLE_TOOLS}}
- Hard constraints (must never do): {{CONSTRAINTS}}
- Target platform/model (if known): {{TARGET_MODEL}}

Write a system prompt with these sections, in this order:
1. **Identity** — one or two sentences: who the agent is and what it's for.
2. **Scope** — what it should and should not handle; explicitly name adjacent tasks it should decline or hand off.
3. **Tool usage** — for each tool in {{AVAILABLE_TOOLS}}, one line on when to use it and when not to.
4. **Output format** — the default shape of its responses (length, structure, tone).
5. **Guardrails** — concrete behaviors derived from {{CONSTRAINTS}}, phrased as instructions, not warnings (e.g. "Never do X" rather than "X could be risky").
6. **Escalation** — what it does when a request is ambiguous, out of scope, or it isn't confident.

Rules:
- Every section must be concrete enough to test — no "be helpful and safe" filler.
- If {{AVAILABLE_TOOLS}} is empty, omit the Tool usage section entirely rather than inventing tools.
- If {{CONSTRAINTS}} is empty, infer 2-3 obvious guardrails from the role itself and say you inferred them.
- Keep the whole prompt under 400 words unless the role is unusually complex — a bloated system prompt is a design smell, not thoroughness.
```

## Variables
- `{{ROLE_DESCRIPTION}}` — required: what the agent is for.
- `{{AVAILABLE_TOOLS}}` — optional list of tools/functions it can call.
- `{{CONSTRAINTS}}` — optional hard "never do" list.
- `{{TARGET_MODEL}}` — optional, e.g. "Claude", "GPT-4o" — some models need more explicit instruction than others.

## Example
**Input:** `{{ROLE_DESCRIPTION}}` = "A support bot for a SaaS billing product that can look up invoices and issue refunds under $50 without approval." `{{AVAILABLE_TOOLS}}` = "lookup_invoice(id), issue_refund(id, amount)". `{{CONSTRAINTS}}` = "Never issue a refund over $50; never share other customers' data."

**Output (excerpt):**
```
## Tool usage
- `lookup_invoice(id)` — use whenever a customer references an invoice, order, or charge by ID or approximate date.
- `issue_refund(id, amount)` — use only after confirming the charge and amount with the customer; never call it speculatively.

## Guardrails
- Never call `issue_refund` with an amount over $50 — escalate instead.
- Never return another customer's invoice or account data, even if asked "on their behalf."
```

## Tips & Variations
- For a coding agent instead of a chat bot, replace "Tool usage" with "Command usage" and add a section on when to ask for confirmation before destructive actions.
- For a stricter compliance context, add a "Logging" section describing what must be recorded.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

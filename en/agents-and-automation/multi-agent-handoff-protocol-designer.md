---
id: multi-agent-handoff-protocol-designer
title: Multi-Agent Handoff Protocol Designer
category: agents-and-automation
tags: [multi-agent-workflows, agent-design, workflow]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Designs the handoff protocol between two or more agents in a multi-agent system: what triggers a handoff, exactly what context gets passed, and what happens if the receiving agent can't complete the task — the specific mechanics that make multi-agent systems fail silently or loop forever when left implicit.

## When to use it
- You're splitting a task between specialized agents (e.g. a planner agent and an executor agent, or a triage agent routing to domain-specific agents) and want the handoff itself designed before wiring it up, not improvised in code.
- A multi-agent system is producing incomplete or contradictory results, and you suspect information is being lost or duplicated at the boundary between agents rather than within either agent individually.
- You're adding a new agent to an existing multi-agent system and need to define how it receives work from, and returns work to, the agents already in place.

## The Prompt

```
You design the handoff protocol between agents in a multi-agent system — the contract at the boundary, not either agent's internal logic.

Sending agent and its role: {{SENDING_AGENT}}
Receiving agent and its role: {{RECEIVING_AGENT}}
Task being handed off: {{TASK_DESCRIPTION}}
Current handoff mechanism, if any (e.g. shared memory, a queue message, a direct function call): {{CURRENT_MECHANISM}}

Instructions:
1. Define the trigger: the exact condition under which {{SENDING_AGENT}} initiates the handoff (task complete, task out of scope, confidence below a threshold, an explicit tool call). Vague triggers like "when appropriate" are not acceptable — specify an observable condition.
2. Define the payload: exactly what context {{RECEIVING_AGENT}} needs to continue the task without re-deriving it — but no more than that. List each field, and for each one, justify why the receiving agent needs it (padding the handoff with the sender's full conversation history "just in case" causes context bloat and dilutes what actually matters).
3. Define acknowledgment: does {{RECEIVING_AGENT}} confirm receipt and understanding before {{SENDING_AGENT}} considers the handoff complete, or is it fire-and-forget? Fire-and-forget handoffs risk the task silently stalling if the receiving agent errors before starting.
4. Define the failure path: what happens if {{RECEIVING_AGENT}} determines it cannot complete {{TASK_DESCRIPTION}} (out of its capability, missing information, a tool failure)? Specify whether it hands back to {{SENDING_AGENT}}, escalates to a human, or retries with different agent — an undefined failure path is what turns a stuck handoff into an infinite loop between two agents each assuming the other should act.
5. Define loop prevention: if handoffs can flow in both directions (e.g. the receiving agent can hand back for clarification), specify a maximum handoff count or an explicit escalation condition to prevent the two agents bouncing the task back and forth indefinitely.
6. If {{CURRENT_MECHANISM}} is provided, evaluate whether it can actually carry the payload and acknowledgment you've defined (e.g. a fire-and-forget queue message can't easily support synchronous acknowledgment) and flag the gap.

Output format: Markdown with sections: Trigger, Payload (as a field list), Acknowledgment, Failure Path, Loop Prevention. End with a sequence diagram in text form showing one successful handoff and one failed handoff.
```

## Variables
- `{{SENDING_AGENT}}` — the agent initiating the handoff and its role in the system. Required.
- `{{RECEIVING_AGENT}}` — the agent receiving the task and its role. Required.
- `{{TASK_DESCRIPTION}}` — the specific task being handed off. Required.
- `{{CURRENT_MECHANISM}}` — the existing transport mechanism for the handoff, if one already exists. Optional — omit when designing from scratch.

## Example
**Input:** `{{SENDING_AGENT}}` = "Triage agent — classifies incoming support tickets and routes them." `{{RECEIVING_AGENT}}` = "Billing-specialist agent — resolves billing-category tickets." `{{TASK_DESCRIPTION}}` = "A support ticket classified as billing-related needs to be resolved." `{{CURRENT_MECHANISM}}` = "Triage agent calls a `route_to_billing_agent(ticket_id)` function with no payload beyond the ID."

**Output (excerpt):**
```
### Trigger
Triage agent hands off when its classification confidence for "billing" category exceeds 0.8. Below that threshold, it should not hand off — see Failure Path for what happens instead.

### Payload
- `ticket_id` — receiving agent needs it to look up the full ticket; already present.
- `classification_confidence` — lets the billing agent's own logic decide whether to trust the routing or re-verify; not currently passed.
- `triage_agent_notes` — any billing-relevant detail triage already extracted (e.g. "customer mentions a duplicate charge"), so the billing agent doesn't have to re-read and re-parse the raw ticket from scratch.

Gap: {{CURRENT_MECHANISM}} passes only `ticket_id` — confidence and notes are being silently dropped at the handoff, forcing the billing agent to redo triage-level work.

### Failure Path
If the billing agent determines the ticket isn't actually a billing issue (misclassified), it hands back to the triage agent with a `reclassify` flag and its own reasoning — not directly to a human, since a single misroute doesn't yet warrant escalation.

### Loop Prevention
Cap at 2 reclassification round-trips between triage and billing; a 3rd failed handoff escalates to a human queue rather than continuing to bounce.
```

## Tips & Variations
- Pair with `agent-task-splitter` (coding, already shipped) earlier in the process — that prompt decides how to split a feature into agent-sized subtasks; this one designs the mechanics of passing one subtask from one agent to another once the split is decided.
- If the multi-agent system has more than two agents, run this once per handoff edge rather than trying to design all handoffs in a single pass — each boundary has its own failure modes and payload needs.
- For handoffs to a human rather than another agent, the same structure applies, but the payload should be optimized for human readability (a summary, not raw internal state) rather than for another model to parse.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

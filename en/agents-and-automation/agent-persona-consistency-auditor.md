---
id: agent-persona-consistency-auditor
title: Agent Persona Consistency Auditor
category: agents-and-automation
tags: [agent-design, system-prompt, quality-assurance]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Audits a long agent conversation transcript against its system prompt's defined persona, tone, and behavioral constraints, flagging the specific points where the agent's actual behavior drifted from what the system prompt specified — rather than a general "did this feel off" read of the transcript.

## When to use it
- Users or reviewers report an agent's tone or behavior feels inconsistent over a long conversation, but it's not obvious from spot-checking a few messages exactly where or why.
- You're testing a new or revised system prompt and want to confirm the persona holds up over a long, multi-turn conversation rather than only the first few exchanges typically used in quick manual testing.
- You're debugging a specific complaint (e.g. "the agent got rude" or "it started making promises it shouldn't") and need to trace exactly when the behavior diverged from spec.

## The Prompt

```
You audit an agent conversation transcript against its system prompt for persona and constraint drift.

System prompt (defines the intended persona, tone, and any hard constraints): {{SYSTEM_PROMPT}}
Conversation transcript to audit: {{TRANSCRIPT}}

Instructions:
1. Extract the specific, checkable persona/behavior claims from {{SYSTEM_PROMPT}} — tone descriptors (e.g. "formal," "empathetic," "concise"), things the agent must always do (e.g. "always cite a source"), and things it must never do (e.g. "never guarantee a specific outcome," "never discuss pricing for other customers"). Ignore vague aspirational language in the system prompt that isn't actually checkable against a transcript.
2. Walk {{TRANSCRIPT}} turn by turn and flag every point where the agent's actual message conflicts with one of the extracted claims — quote the specific agent message and name which persona/constraint it violates.
3. Distinguish drift that's a plausible reasonable adaptation (e.g. shifting slightly more informal after the user's own tone relaxed, if {{SYSTEM_PROMPT}} doesn't forbid this) from drift that's a genuine violation (e.g. breaking a hard "never" constraint, or reverting from a specified tone to a generic assistant voice with no clear trigger).
4. Note whether drift, once it starts, tends to compound (each subsequent message drifting further) or is a one-off lapse the agent recovers from on its own — this distinction matters for whether the fix is a stronger initial instruction or a mid-conversation reinforcement mechanism.
5. If a hard constraint (a "never") is violated even once, flag it as critical regardless of how minor it seems in isolation — hard constraints in a system prompt typically exist because a single violation has outsized consequences (compliance, safety, liability), not because of average-case impact.
6. If {{TRANSCRIPT}} is long, note roughly where in the conversation (by turn number or topic shift) drift tends to concentrate, if a pattern exists — this often points to a specific trigger (a certain user request type, or simply conversation length) rather than random inconsistency.

Output format: Markdown. For each drift instance: turn number, quoted agent message, the specific persona/constraint claim it conflicts with, and severity (critical for hard-constraint violations, moderate for tone drift). End with a one-paragraph summary: does drift concentrate around a specific trigger, and is it compounding or self-correcting.
```

## Variables
- `{{SYSTEM_PROMPT}}` — the agent's system prompt defining its intended persona and constraints. Required.
- `{{TRANSCRIPT}}` — the full conversation transcript to audit. Required — a partial transcript risks missing the point where drift actually begins.

## Example
**Input:** `{{SYSTEM_PROMPT}}` = "You are a calm, patient support agent. Never promise a specific refund amount or timeline — always say a specialist will confirm details." `{{TRANSCRIPT}}` = "[Turn 12, after several rounds of an increasingly frustrated customer] Agent: 'I completely understand your frustration — you'll get your full $89.99 refunded within 3-5 business days, I promise.'"

**Output (excerpt):**
```
### Turn 12 — Critical
Agent message: "you'll get your full $89.99 refunded within 3-5 business days, I promise."
Conflicts with: the explicit "never promise a specific refund amount or timeline" constraint — this is a direct violation, not a tone-drift judgment call.
Severity: critical, regardless of the customer's frustration justifying a more reassuring tone — the constraint exists specifically for situations like this one, where an agent under conversational pressure might want to over-promise to de-escalate.

Summary: The single flagged violation appears at turn 12, following several turns of escalating customer frustration (turns 8-11) — the drift is not gradual/compounding but a discrete lapse that coincides with rising conversational pressure, suggesting the fix is reinforcing the constraint specifically for high-frustration moments rather than a general persona-strength issue.
```

## Tips & Variations
- Pair with `guardrail-prompt-hardener` (agents-and-automation, already shipped) once this audit identifies a recurring violation pattern — that prompt strengthens the system prompt itself against the specific failure this one surfaced.
- Run this periodically on a sample of production transcripts, not only during initial testing — persona drift sometimes only appears under real user behavior (frustration, edge-case requests) that scripted test conversations don't reproduce.
- If {{SYSTEM_PROMPT}} contains no genuinely checkable "never" constraints, the critical-severity findings in this audit will be empty by design — that's a sign the system prompt itself may need harder constraints added, not that the audit found nothing.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

---
id: human-in-the-loop-approval-gate-designer
title: Human-in-the-Loop Approval Gate Designer
category: agents-and-automation
tags: [ai-agents, guardrails, risk]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Decides which of an agent's planned actions require an explicit human approval step before executing — given a list of candidate actions with their reversibility and blast radius — and designs the approval UX itself (what's shown, the safe default, and timeout behavior), rather than just producing a blanket "ask before anything risky" rule.

## When to use it
- Designing a new agent that can take real-world actions (send an email, modify a record, spend money, deploy code) and deciding upfront which of those actions need a human checkpoint.
- After an incident where an agent took an action that, in hindsight, should have been gated — working out the specific rule that would have caught it without over-gating everything else.
- Reviewing an existing agent's action list for gates that are either missing (a risky action runs silently) or excessive (routine actions constantly interrupt the human, training them to rubber-stamp everything).

## The Prompt

```
You design human-approval gates for an agent's action set. Given the candidate actions below, decide which need a gate and design the gate itself.

Candidate actions, each with a rough description of what it does: {{CANDIDATE_ACTIONS}}
For each action, its reversibility (easily undone, undoable with effort, effectively irreversible) and blast radius (affects only the requesting user, affects other users, affects external/public state): {{REVERSIBILITY_AND_BLAST_RADIUS}}
How often this agent runs and how tolerant the workflow is of interruption (e.g. real-time chat vs. an overnight batch job): {{INTERRUPTION_TOLERANCE}}

Do the following:
1. For each action, decide: no gate (proceed automatically), soft gate (proceed automatically but notify the human, reversible after the fact), or hard gate (must get explicit approval before executing) — base this on the reversibility/blast-radius combination, not on how "important" the action sounds. An easily-undone action affecting only the requesting user needs no gate even if it looks dramatic; an effectively-irreversible action with external blast radius needs a hard gate even if it looks routine.
2. For every hard-gated action, design what the human actually sees at approval time: the specific decision being asked (not "approve this action?" — name what will happen and to what), the information needed to judge it well, and what happens on no-response (default to blocking, not to proceeding, unless {{INTERRUPTION_TOLERANCE}} explicitly allows a timeout-based fallback).
3. Flag any action where {{INTERRUPTION_TOLERANCE}} conflicts with the gate decision from step 1 (e.g. a real-time chat context that can't tolerate a hard gate on a moderately-risky action) — propose a soft-gate-plus-fast-undo alternative rather than silently downgrading the gate.
4. Estimate the interruption rate this design implies given a typical session, and flag if too many hard gates would likely train the human to approve without reading (a known failure mode) — if so, suggest which gates could be batched or which actions could be redesigned to be more reversible instead of gated.
5. Output the final policy as a simple table: action, gate level, and one-line reasoning — someone should be able to look up any action and see its gate level without re-reading the full analysis.

Output format: Markdown with sections Per-Action Analysis, Hard-Gate UX Design, Interruption-Tolerance Conflicts, Over-Gating Check, Final Policy Table.
```

## Variables
- `{{CANDIDATE_ACTIONS}}` — the agent's set of possible actions, each briefly described. Required.
- `{{REVERSIBILITY_AND_BLAST_RADIUS}}` — per-action reversibility and scope of impact. Required — this is the actual basis for the gate decision, not the action's surface-level "sounds risky" impression.
- `{{INTERRUPTION_TOLERANCE}}` — how the agent runs and how much interruption the workflow can absorb. Required — the same gate decision needs a different UX in a real-time chat versus an overnight batch job.

## Example
**Input:** `{{CANDIDATE_ACTIONS}}` = "1) Draft a reply email (not sent). 2) Send an email to an external customer. 3) Update an internal ticket's status. 4) Issue a refund. 5) Delete a customer's account." `{{REVERSIBILITY_AND_BLAST_RADIUS}}` = "1: easily undone, only affects a draft. 2: undoable with effort (a follow-up correction email), affects an external customer. 3: easily undone, only affects internal state. 4: undoable with effort (a reversal transaction), affects external financial state. 5: effectively irreversible, affects external customer data." `{{INTERRUPTION_TOLERANCE}}` = "Runs as a real-time support-chat assistant; the human agent is present and actively supervising the conversation."

**Output (excerpt):**
```
### Per-Action Analysis
1. No gate — draft only, trivially reversible, no external effect.
2. Soft gate — undoable but externally visible; notify the human agent with the drafted email before send, allow a brief cancel window, don't require a click-to-approve given real-time chat tolerance.
3. No gate — internal, easily undone.
4. Hard gate — external financial effect, undoable only with effort (a visible reversal, not a clean undo).
5. Hard gate — effectively irreversible, external customer-data impact.

### Hard-Gate UX Design
Action 4: shown as "Issue a $[amount] refund to [customer]? Reason given: [reason]." with the customer's order history visible alongside, defaulting to blocked on no response (real-time context means a human is present, so no timeout fallback is needed).
Action 5: shown as "Permanently delete [customer]'s account, including [specific data named]? This cannot be undone." with an explicit confirmation phrase required, not a single click, given irreversibility.

### Interruption-Tolerance Conflicts
None — real-time chat with an actively supervising human tolerates hard gates on the two genuinely high-stakes actions without disrupting flow, since the human is already present.

### Over-Gating Check
Only 2 of 5 actions are hard-gated; low risk of approval fatigue at this rate. If a 6th action were added that also warranted a hard gate, revisit whether some could be merged into one combined approval per conversation turn.

### Final Policy Table
| Action | Gate | Reasoning |
|---|---|---|
| Draft reply | None | Reversible, internal only |
| Send email | Soft | Externally visible but correctable |
| Update ticket | None | Reversible, internal only |
| Issue refund | Hard | External financial, hard to undo |
| Delete account | Hard | Irreversible, external data impact |
```

## Tips & Variations
- Distinct from `guardrail-prompt-hardener` (already shipped), which hardens a system prompt against adversarial/jailbreak inputs; this prompt is a design-time decision about normal, non-adversarial actions and where a human checkpoint belongs given cost of being wrong, not a defense against manipulation.
- If the agent's action set changes often, re-run step 5's table generation as a lightweight recurring check rather than the full analysis — only actions whose reversibility or blast radius genuinely changed need re-analysis.
- For a batch/overnight agent (`{{INTERRUPTION_TOLERANCE}}` = low tolerance for real-time interruption), hard gates typically become "queue for morning review" rather than a blocking synchronous prompt — say so explicitly in step 2 rather than defaulting to a chat-style approval UI that doesn't fit the workflow.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

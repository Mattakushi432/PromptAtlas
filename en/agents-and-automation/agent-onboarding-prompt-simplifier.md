---
id: agent-onboarding-prompt-simplifier
title: Agent Onboarding Prompt Simplifier
category: agents-and-automation
tags: [system-prompt, prompt-engineering, refactoring]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Trims an agent's system prompt that has grown bloated over time from accumulated edge-case patches ("if the user asks X, do Y instead", added one at a time after each incident) back to a clear, maintainable core — consolidating redundant instructions, removing rules the current design no longer needs, and generalizing narrow patches into principles — without silently dropping coverage the accumulated patches were actually protecting.

## When to use it
- An agent's system prompt has been edited many times over months, each time appending a new special-case rule, and it's now long enough that you're not confident every rule in it still matters or doesn't contradict another one.
- You're about to hand an agent's system prompt to someone else to maintain and want it to read as an intentional design rather than an archaeological record of past incidents.
- A prompt is approaching a context-budget concern and you want to shrink it without silently regressing behavior it was patched to handle.

## The Prompt

```
You simplify a bloated agent system prompt back to a clear, maintainable core.

The current system prompt, in full: {{CURRENT_PROMPT}}
What you know about why specific rules were added, if available (e.g. "the rule about not revealing internal tool names was added after an incident where a user tricked the agent into listing them"): {{RULE_HISTORY}}

Instructions:
1. Inventory every distinct instruction in {{CURRENT_PROMPT}} as a numbered list, each with a one-line paraphrase of what behavior it controls.
2. Group instructions that are really one principle stated multiple times or in overlapping special cases (e.g. three separate "if user says X/Y/Z, refuse" rules that are all instances of "refuse requests for category C") and propose a single generalized rule that covers all of them — verify the generalization doesn't accidentally widen or narrow the covered cases versus the originals combined.
3. Flag instructions that look redundant with the model's default behavior or with another instruction elsewhere in the prompt (contradicts, or is a strict subset of, a broader rule already stated) as candidates for removal — but do not remove anything tied to a specific incident in {{RULE_HISTORY}} without saying so explicitly, since those often encode a real, non-obvious failure mode.
4. Flag instructions that look like they were written for a capability, integration, or use case the current design description no longer has (guess based on internal contradiction or clearly stale references, e.g. mentioning a tool that isn't in the current toolset) and mark them as remove-candidates requiring human confirmation, not automatic deletions.
5. Produce the simplified prompt: consolidated principles first, remaining genuinely distinct special-case rules after, in the same voice/format as the original. Keep every behavior the original enforced unless step 3 or 4 explicitly justified dropping it.
6. Produce a coverage diff: a short list mapping each original numbered instruction (from step 1) to where it landed in the simplified version (merged into rule #N, kept as-is, or removed with reason) so nothing silently disappears.

Output format: Markdown with sections: Original Instruction Inventory, Consolidation Groups, Remove Candidates (Confirmed vs. Needs Human Review), Simplified Prompt, Coverage Diff.
```

## Variables
- `{{CURRENT_PROMPT}}` — the full text of the current, bloated system prompt. Required.
- `{{RULE_HISTORY}}` — any known context for why specific rules exist, if available. Optional, but strongly recommended — without it, step 3's redundancy calls are more likely to miss a real incident-driven rule.

## Example
**Input:** `{{CURRENT_PROMPT}}` (abbreviated) = "...Rule 4: If the user asks about pricing, never give a specific number, redirect to sales. Rule 9: If the user asks about enterprise pricing specifically, never give a specific number, redirect to sales. Rule 14: If the user asks about discount pricing, never give a specific number, redirect to sales..." `{{RULE_HISTORY}}` = "Rules 4, 9, 14 were added at different times after different support tickets, no known distinct reasoning between them."

**Output (excerpt):**
```
### Consolidation Groups
Rules 4, 9, and 14 are the same principle applied to three specific phrasings of the same request category ("what does it cost"). {{RULE_HISTORY}} confirms no distinct reasoning separates them — they were added incrementally rather than designed together.

Proposed consolidation: "Rule 4 (consolidated): For any pricing-related question — general, enterprise, discount, or otherwise — never state a specific number; redirect to sales." Verified this covers all three original phrasings with no narrowing (all three were "never give a number, redirect" verbatim) and no widening beyond pricing questions specifically.

### Remove Candidates
None flagged for full removal from this excerpt — all three original rules encode the same real constraint, so they're merged, not dropped.

### Coverage Diff
- Original Rule 4 → merged into consolidated Rule 4.
- Original Rule 9 → merged into consolidated Rule 4.
- Original Rule 14 → merged into consolidated Rule 4.
```

## Tips & Variations
- Distinct from `guardrail-prompt-hardener` (already shipped): that prompt *adds* guardrails to a prompt that's missing them; this one goes the opposite direction, *removing/consolidating* accumulated rules in a prompt that already has too many, without weakening what those rules protect against.
- Distinct from `agent-persona-consistency-auditor` (already shipped): that prompt audits a conversation transcript for drift from an established persona; this one audits the system prompt document itself, before any conversation happens.
- If {{RULE_HISTORY}} is unavailable for most rules, say so plainly and treat every rule as if it might be incident-driven by default — bias the remove-candidate list toward "needs human review" rather than "confirmed safe to remove" when history is missing, since the cost of silently dropping a real guardrail is much higher than the cost of a slightly longer review pass.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

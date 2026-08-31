---
id: prompt-chain-failure-point-diagnostic
title: Prompt-Chain Failure Point Diagnostic
category: agents-and-automation
tags: [prompt-engineering, debugging, ai-agents]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Given a multi-step prompt chain (each step's prompt, its input, and its output) and a bad final result, isolates which specific step most likely introduced the error — distinguishing "this step's own output was wrong" from "this step's output was fine but the next step misused it." Distinct from `tool-use-trace-reviewer` (agents-and-automation, already shipped), which diagnoses tool-call traces in an agent's execution; this prompt diagnoses a fixed sequence of LLM prompt steps (no tool calls), the common shape of a prompt-chaining pipeline (extract → summarize → classify → generate, for example).

## When to use it
- A multi-step prompt chain produced a wrong final output and you have the intermediate input/output of each step, but it's not obvious by inspection which step is actually at fault.
- You're debugging an intermittent chain failure and want to narrow down which step to focus prompt-engineering effort on, rather than rewriting every step's prompt speculatively.
- You changed one step's prompt and want to confirm the fix didn't just move the failure downstream to the next step instead of resolving it.

## The Prompt

```
You diagnose which step in a multi-step prompt chain is the most likely source of a bad final output.

The chain, as a sequence of steps in order: {{CHAIN_STEPS}}
(For each step, this should include: the step's prompt/instruction, its actual input, and its actual output.)
The final output that was produced: {{FINAL_OUTPUT}}
What's wrong with it: {{OBSERVED_PROBLEM}}

Instructions:
1. Walk {{CHAIN_STEPS}} in order. For each step, evaluate its output against two questions separately: (a) is this step's output a correct, faithful response to its own prompt and input, and (b) does this step's output contain everything the next step actually needs.
2. Identify the first step where either (a) or (b) fails. This is the most likely origin point — a later step's bad output is often a correct consequence of bad input it received, not an independent new error.
3. Explicitly distinguish two failure shapes for the identified step: "own-output error" (the step's prompt was answered incorrectly or incompletely, given the input it received) versus "input-handoff error" (the step's own output was fine, but a later step ignored, misread, or dropped part of it).
4. If a downstream step's prompt itself is the problem (e.g. its instructions don't tell it to use a field the previous step actually provided), name that as a distinct "step-prompt design gap" rather than blaming the previous step for not being clearer than it needed to be.
5. If more than one step shows a problem, state whether the later one is a downstream consequence of the first (most common) or a second, independent issue (state your reasoning either way).
6. If {{CHAIN_STEPS}} doesn't give you enough information to distinguish two candidate origin points (e.g. two steps both look plausible and the chain doesn't show enough of a step's reasoning to tell), say so explicitly rather than picking one arbitrarily.

Output format: Markdown. For each step: a one-line verdict (clean / own-output error / input-handoff error / step-prompt design gap). Then a "Root Cause" section identifying the earliest problem step, its failure shape, and the specific fix (a prompt change and to which step). End with: does fixing this one step plausibly resolve {{OBSERVED_PROBLEM}}, or is more than one fix needed?
```

## Variables
- `{{CHAIN_STEPS}}` — the full sequence of chain steps, each with its prompt, actual input, and actual output. Required.
- `{{FINAL_OUTPUT}}` — the chain's final result. Required.
- `{{OBSERVED_PROBLEM}}` — what's specifically wrong with the final output. Required — without a concrete target, "diagnose the chain" has no direction.

## Example
**Input:** `{{CHAIN_STEPS}}` = "Step 1 (extract): prompt asks to extract customer name and order ID from a support email; input is the raw email; output is `{name: 'J. Alvarez', order_id: 'ORD-4521'}`. Step 2 (generate): prompt asks to draft a reply using the customer's name and order ID; input is Step 1's output; output is 'Hi there, thanks for reaching out about your order.'" `{{FINAL_OUTPUT}}` = "'Hi there, thanks for reaching out about your order.'" `{{OBSERVED_PROBLEM}}` = "The reply doesn't use the customer's name or reference the specific order ID, even though both were successfully extracted in Step 1."

**Output (excerpt):**
```
Step 1 (extract): Clean — correctly extracted both `name` and `order_id` from the input, and both are present in its output.
Step 2 (generate): Input-handoff error — Step 1's output contained everything needed, but Step 2's output ignores both fields entirely.

### Root Cause
Origin: Step 2, input-handoff error. Step 1 did its job; the failure is in Step 2 not making use of data that was actually available to it. Checking Step 2's prompt: it says "draft a reply using the customer's name and order ID" but never specifies where those values come from in its input — if Step 2's input is passed as a raw JSON blob without an explicit instruction to reference `{name}` and `{order_id}` by field name in the output, this is a step-prompt design gap, not a one-off model mistake.
Fix: revise Step 2's prompt to explicitly reference the input fields by name (e.g. "Address the customer as {{name}} and mention order {{order_id}} in the first sentence") rather than assuming the model will notice and use them unprompted.

Fixing Step 2 alone plausibly resolves this — Step 1's output is already correct and doesn't need changes.
```

## Tips & Variations
- Pair with `agent-eval-rubric-generator` (agents-and-automation, already shipped) once a fix is applied — use it to build a small regression check for this specific failure shape so a future prompt edit doesn't reintroduce it silently.
- If the chain includes tool calls in addition to prompt steps, use `tool-use-trace-reviewer` (agents-and-automation, already shipped) for those steps instead — this prompt assumes a pure prompt-in/prompt-out chain and won't correctly diagnose tool-call-specific failure modes like a stale or malformed tool result.
- For chains longer than 4-5 steps, consider running this prompt on a truncated sub-chain first (stopping at the midpoint) to bisect which half of the chain the problem originates in, before running the full diagnostic — this narrows {{CHAIN_STEPS}} and improves diagnostic accuracy on very long chains.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

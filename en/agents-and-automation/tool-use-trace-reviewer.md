---
id: tool-use-trace-reviewer
title: Tool-Use Trace Reviewer
category: agents-and-automation
tags: [tool-use, debugging, ai-agents]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Reads an agent's actual tool-call trace (the sequence of tool calls, arguments, and results from a completed or failed run) and diagnoses what went wrong — distinguishing a bad tool schema, a planning/reasoning error, and a bad tool result as separate root causes, rather than a general "the agent messed up." Distinct from `tool-schema-reviewer` (agents-and-automation, already shipped), which reviews a tool's definition before deployment; this prompt reviews an actual execution trace after the fact.

## When to use it
- An agent produced a wrong or incomplete result and you have its tool-call trace, but it's not obvious from the final output alone whether the agent planned badly, misused a tool, or got bad data back from a tool.
- You're debugging an intermittent agent failure and want a systematic pass through the trace rather than eyeballing it for what looks wrong.
- You're evaluating whether a recent change (a new tool, a schema tweak, a prompt edit) fixed a known failure pattern, by comparing traces before and after.

## The Prompt

```
You review an AI agent's tool-call trace to diagnose the root cause of an unexpected or incorrect outcome.

Task the agent was given: {{TASK}}
Tool-call trace (sequence of calls, arguments, and results): {{TRACE}}
What went wrong (the observed bad outcome): {{OBSERVED_PROBLEM}}

Instructions:
1. Walk the trace in order and identify the first point where behavior diverges from what {{TASK}} required — not just where the final wrong output appeared, since an early misstep often only becomes visible several steps later.
2. Classify that divergence into one of these root-cause categories, and justify the classification against the specific evidence in {{TRACE}}:
   - **Planning error**: the agent called a reasonable tool, but chose the wrong one, wrong order, or wrong arguments given what it already knew at that point.
   - **Tool result misinterpretation**: the tool returned correct data, but the agent's next action shows it misread or ignored part of that result.
   - **Bad tool result**: the tool itself returned incorrect, stale, or unexpectedly-shaped data, and the agent's handling of it was otherwise reasonable.
   - **Schema/description gap**: the agent's call was a plausible reading of the tool's description, but the description was ambiguous or missing a constraint that would have prevented the misuse — flag this even though fixing it belongs in the schema, not the trace.
3. If multiple divergences are visible, list each with its own classification rather than picking only the most obvious one — a downstream failure is sometimes a second, independent issue rather than a consequence of the first.
4. Note anything in the trace that shows correct recovery (the agent noticed a bad result and retried or corrected course) — this rules out that step as the cause and is useful signal for what's already working.
5. Do not speculate about the agent's internal reasoning beyond what {{TRACE}} shows; if the trace lacks enough detail to distinguish two candidate causes (e.g. no visibility into intermediate reasoning), say so explicitly rather than guessing.

Output format: Markdown. For each divergence found: the step number, root-cause category, the evidence from {{TRACE}} supporting that classification, and the fix (prompt-level, schema-level, or tool-level, as applicable). End with a one-line primary root cause if one dominates, or "multiple independent causes" if not.
```

## Variables
- `{{TASK}}` — what the agent was asked to accomplish. Required.
- `{{TRACE}}` — the actual sequence of tool calls, their arguments, and their results. Required.
- `{{OBSERVED_PROBLEM}}` — the specific bad outcome observed (wrong final answer, incomplete task, an error surfaced to the user). Required — without it, the review has no target to diagnose toward.

## Example
**Input:** `{{TASK}}` = "Cancel the customer's subscription and confirm the refund amount." `{{TRACE}}` = "1) `get_subscription(customer_id)` → returns subscription with `status: active, plan: annual, next_billing: 2026-11-01`. 2) `cancel_subscription(subscription_id)` → returns `{cancelled: true}`. 3) Agent tells user: 'Your subscription is cancelled and a refund is being processed.'" `{{OBSERVED_PROBLEM}}` = "No refund was actually issued — the customer received a cancellation but no refund."

**Output (excerpt):**
```
### Step 3: Planning error
The agent told the user a refund was being processed, but no `issue_refund` or equivalent tool was ever called in the trace. `cancel_subscription`'s result (`{cancelled: true}`) contains no refund information — the agent appears to have assumed a refund is an automatic consequence of cancellation rather than a separate step it needed to trigger itself.
Fix: the agent's instructions should explicitly state whether refunds are automatic on cancellation or require a separate tool call, and if the latter, the agent must call it before claiming one is in progress.

Primary root cause: planning error — the agent fabricated a completed action (refund) that no tool call actually performed.
```

## Tips & Variations
- Pair with `tool-schema-reviewer` (agents-and-automation, already shipped) whenever this prompt's output includes a "schema/description gap" finding — fix the underlying schema so the same misreading doesn't recur across future traces.
- For high-volume agent systems, run this prompt against a sample of failed traces rather than one at a time, and look for a repeated root-cause category across the sample — a single schema gap often explains many superficially-different individual failures.
- If {{TRACE}} includes the model's intermediate reasoning/thoughts (not just tool calls), include that in the input — it substantially improves the accuracy of the planning-error vs. misinterpretation distinction in step 2.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

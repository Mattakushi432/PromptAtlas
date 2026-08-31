---
id: retry-fallback-policy-designer
title: Retry & Fallback Policy Designer
category: agents-and-automation
tags: [ai-agents, error-handling, resilience]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Designs the decision logic an agent should follow when a tool call fails: when to retry the same tool, when to try an alternate tool, when to ask the human for input, and when to give up — the agent-level policy layer, distinct from `retry-storm-prevention-advisor` (coding, already shipped), which designs network-level backoff/jitter timing for services, not what an agent should decide to do next after a failure.

## When to use it
- You're building an agent that calls tools which can fail (rate limits, timeouts, invalid input, permission errors) and want its failure-handling behavior designed explicitly, rather than left to whatever the model improvises.
- An agent is retrying a failing tool call indefinitely (or giving up too eagerly on a transient failure) and you need a concrete policy to fix the behavior.
- You're adding a new tool with an alternate/fallback tool available for the same job and want to define exactly when the agent should switch to it.

## The Prompt

```
You design the retry and fallback policy an agent should follow after a tool call fails.

Tool and what it does: {{TOOL}}
Failure modes this tool can return (e.g. rate limit, timeout, invalid input, not found, permission denied): {{FAILURE_MODES}}
Available fallback (an alternate tool, a cached/default value, or human handoff — if any): {{FALLBACK_OPTION}}
Task criticality (does the task need to complete now, or can it be deferred/skipped): {{CRITICALITY}}

Instructions:
1. For each failure mode in {{FAILURE_MODES}}, classify it as retryable (transient — a timeout, a rate limit) or non-retryable (the same call will fail again — invalid input, permission denied, not found) — retrying a non-retryable failure just wastes time and tool calls without changing the outcome.
2. For retryable failure modes, specify a maximum retry count and whether retries should use backoff — and if so, at what scale (agents typically don't need sub-second backoff precision the way high-throughput services do, but should still avoid hammering a rate-limited API in a tight loop).
3. For non-retryable failure modes, specify the immediate next action: correct and retry once with fixed input (only if the agent has enough information to actually fix what was wrong), switch to {{FALLBACK_OPTION}}, or stop and report the failure — don't default to "just try again."
4. If {{FALLBACK_OPTION}} exists, specify exactly which failure modes should trigger falling back to it versus continuing to retry the primary tool, and whether the fallback's result should be flagged to the user as lower-confidence/degraded (e.g. a cached value that might be stale) or presented as equivalent.
5. Given {{CRITICALITY}}, specify the final give-up behavior: if all retries and fallbacks are exhausted, does the agent skip this part of the task and continue, halt and report to the user, or escalate to a human — and what it tells the user in each case (a silent skip on a critical task is a distinct, worse failure mode than an explicit "I couldn't complete X").
6. Flag any failure mode in {{FAILURE_MODES}} that isn't clearly retryable or non-retryable (e.g. an ambiguous 5xx error) and recommend treating it conservatively (as non-retryable, or with a low retry count) rather than assuming it's safe to retry aggressively.

Output format: Markdown table with columns: Failure Mode | Retryable? | Max Retries | Fallback Trigger | Give-Up Behavior. Follow with a short paragraph describing what the user sees in the worst case (all options exhausted).
```

## Variables
- `{{TOOL}}` — the tool being protected by this policy. Required.
- `{{FAILURE_MODES}}` — the known ways this tool can fail. Required.
- `{{FALLBACK_OPTION}}` — an alternate tool, default value, or human-handoff path, if one exists. Optional — omit if there's genuinely no fallback available.
- `{{CRITICALITY}}` — whether the task this tool serves must complete now or can be deferred/skipped. Required — this determines whether give-up is silent, reported, or escalated.

## Example
**Input:** `{{TOOL}}` = "`send_confirmation_email(order_id)`" `{{FAILURE_MODES}}` = "SMTP timeout, invalid recipient address, rate limit from email provider" `{{FALLBACK_OPTION}}` = "None — no alternate delivery channel configured" `{{CRITICALITY}}` = "Non-blocking — the order itself is already placed successfully; the email is a courtesy notification."

**Output (excerpt):**
```
| Failure Mode | Retryable? | Max Retries | Fallback Trigger | Give-Up Behavior |
|---|---|---|---|---|
| SMTP timeout | Yes | 3, with simple backoff (e.g. 5s/15s/45s) | N/A — no fallback | Log failure, do not block or notify the user in-flow; queue for a later batch retry if the system supports it. |
| Invalid recipient address | No | 0 | N/A — no fallback | Flag on the order record for manual follow-up; do not retry, since the same address will fail again. |
| Rate limit from provider | Yes | 3, with backoff respecting any Retry-After the provider returns | N/A — no fallback | Same as SMTP timeout — queue for later. |

Worst case: since {{CRITICALITY}} is non-blocking and there's no fallback channel, exhausting retries results in a silently unsent confirmation email — the order still succeeds from the user's perspective. This is acceptable given criticality, but the failure should still be logged/flagged internally so it doesn't go unnoticed indefinitely.
```

## Tips & Variations
- Pair with `tool-use-trace-reviewer` (agents-and-automation, already shipped) after deploying this policy — if failures keep reaching the give-up state more often than expected, the trace reviewer can help determine whether the policy itself or the underlying tool is the problem.
- When {{CRITICALITY}} is high and no fallback exists, resist the urge to invent a low-quality automatic fallback (e.g. guessing at missing required input) just to avoid failing — an honest failure with a clear report is safer than a fabricated result the agent presents with false confidence.
- If the same tool is called from multiple different tasks with different criticality, define the policy per call site rather than once per tool — a payment-confirmation email's failure handling looks very different from a marketing-newsletter send's.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

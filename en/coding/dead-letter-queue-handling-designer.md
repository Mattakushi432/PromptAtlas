---
id: dead-letter-queue-handling-designer
title: Dead-Letter Queue Handling Designer
category: coding
tags: [message-queues, resilience, backend]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Designs how a message consumer should handle a dead-letter queue (DLQ): what triggers moving a message there, what triage metadata to attach, how to alert on DLQ growth, and a safe replay procedure. Distinct from `job-queue-backlog-diagnostician` (coding, already shipped), which debugs a live, growing backlog of messages still waiting to be processed — this prompt designs the handling of messages that have already permanently failed processing.

## When to use it
- You're building a new queue consumer and want to design its DLQ strategy upfront, rather than discovering messages are silently dropped or retried forever once something goes wrong in production.
- Your team has a DLQ that's accumulated messages nobody has a clear process for triaging or replaying, and you want a concrete design to bring it under control.
- You're deciding between "retry forever," "drop silently," and "dead-letter" for a specific failure type and want a reasoned recommendation rather than a default.

## The Prompt

```
You design dead-letter queue (DLQ) handling for a specific message consumer, given its failure modes and operational constraints.

Consumer and message type: {{CONSUMER_CONTEXT}}
Current retry behavior (if any): {{CURRENT_RETRY_BEHAVIOR}}
Failure types this consumer can encounter: {{FAILURE_TYPES}}

Instructions:
1. Recommend the specific trigger for moving a message to the DLQ: a maximum retry-attempt count, and/or specific error types that should dead-letter immediately without retrying (e.g. a schema-validation failure that will never succeed on retry, versus a transient timeout that should retry first). Distinguish poison messages (will never succeed) from transient failures (may succeed later) within {{FAILURE_TYPES}} explicitly.
2. Specify what metadata to attach to a dead-lettered message for triage: the original message, the failure reason/exception, the number of attempts made, timestamps of first and last attempt, and the consumer version/deployment that processed it — enough that someone triaging later doesn't need to reconstruct context from logs.
3. Recommend alerting: what DLQ growth rate or absolute count should page/notify someone, and whether a single dead-lettered message of a specific severity (e.g. anything payment-related) should alert immediately rather than waiting for a volume threshold.
4. Design a safe replay procedure: how a triaged, fixed message gets reprocessed — replayed individually after manual review, replayed in bulk only after the root cause is confirmed fixed, and how replay avoids reintroducing the same failure in a loop (e.g. resetting the attempt counter without addressing the root cause).
5. Specify a retention/expiry policy for the DLQ itself — how long dead-lettered messages are kept before being archived or purged, so it doesn't silently grow unbounded while also not discarding messages before anyone had a chance to triage them.
6. If {{CURRENT_RETRY_BEHAVIOR}} indicates unlimited retries with no DLQ today, explicitly call out the risk: a poison message retried forever can block a FIFO-ordered queue's downstream messages, or silently consume worker capacity indefinitely.

Output format: Markdown with sections: Dead-letter trigger, Metadata to attach, Alerting thresholds, Replay procedure, Retention policy. End with a one-line summary of what changes operationally versus {{CURRENT_RETRY_BEHAVIOR}} today.
```

## Variables
- `{{CONSUMER_CONTEXT}}` — what the consumer does and what kind of messages it processes. Required.
- `{{CURRENT_RETRY_BEHAVIOR}}` — the existing retry/failure handling, if any (e.g. "no DLQ, retries indefinitely" or "3 retries then message is dropped"). Required — the design changes based on the current gap.
- `{{FAILURE_TYPES}}` — the known ways processing can fail for this consumer (validation errors, downstream timeouts, data conflicts, etc.). Required.

## Example
**Input:** `{{CONSUMER_CONTEXT}}` = "Order-fulfillment consumer processing 'order.paid' events to trigger warehouse dispatch." `{{CURRENT_RETRY_BEHAVIOR}}` = "No DLQ currently — after 3 retries with fixed 5s delay, the message is logged and dropped." `{{FAILURE_TYPES}}` = "Downstream warehouse API timeout (transient); malformed event missing a required SKU field (poison); warehouse API rejecting an unknown SKU (poison, but needs human decision)."

**Output (excerpt):**
```
### Dead-letter trigger
- Malformed events missing a required field: dead-letter immediately, no retry — this will never succeed since retrying doesn't fix a missing field.
- Warehouse API timeout: retry up to 5 times with exponential backoff (up from the current fixed 3/5s, since a longer backoff gives a transient blip more room to clear); dead-letter after exhausting retries.
- Unknown-SKU rejection: dead-letter after 1 retry (to rule out a transient catalog-sync lag) — this needs human decision, not more retries.

### Metadata to attach
Original event payload, failure reason (categorized: malformed / timeout / rejected-sku), attempt count, first-attempt and last-attempt timestamps, consumer deployment version.

### Alerting thresholds
Any malformed-event dead-letter: alert immediately (indicates an upstream producer bug affecting potentially many orders). Timeout/rejected-sku dead-letters: alert if DLQ count exceeds 10 in a rolling hour, since a handful is expected human-triage volume but a spike indicates a systemic issue (e.g. warehouse API outage).

### Replay procedure
After a producer fix for malformed events, or a catalog-sync fix for rejected SKUs, replay affected messages individually via a triage tool that resets the attempt count and re-publishes to the live queue — never bulk-replay without confirming the specific root cause per failure category, since a bulk replay of unresolved poison messages just re-fills the DLQ.

Summary: Replaces silent-drop-after-3-tries with categorized handling — poison messages skip straight to DLQ instead of wasting retries, transient timeouts get more retry headroom, and nothing is lost without a triage record.
```

## Tips & Variations
- Pair with `job-queue-backlog-diagnostician` (coding, already shipped) when the *live* queue is also growing unexpectedly — that prompt diagnoses why not-yet-processed messages are piling up; this prompt is for messages that have already exhausted processing attempts.
- If {{CONSUMER_CONTEXT}} involves ordered/FIFO message processing, explicitly flag the head-of-line blocking risk in the output: a single stuck message can block all subsequent messages for the same partition/key until it's dead-lettered, which changes how urgently the dead-letter trigger needs to fire.
- For consumers processing sensitive data (PII, payment details), note in the metadata step whether the full original payload is safe to retain in the DLQ as-is, or whether it needs redaction before storage for triage.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

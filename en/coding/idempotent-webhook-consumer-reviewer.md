---
id: idempotent-webhook-consumer-reviewer
title: Idempotent Webhook Consumer Reviewer
category: coding
tags: [webhooks, idempotency, backend]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Reviews the receiving side of a webhook integration for deduplication and ordering handling — the consumer-side counterpart to `webhook-delivery-reliability-reviewer` (coding, already shipped)'s sender-side focus: that prompt reviews how you send webhooks reliably; this one reviews how you correctly handle receiving them, including duplicates and out-of-order delivery.

## When to use it
- You're building or reviewing a webhook receiver/consumer endpoint and want to check it handles the realities of webhook delivery (retries causing duplicates, no ordering guarantee) rather than assuming each event arrives exactly once in order.
- You've had a production incident from a duplicate or out-of-order webhook event and want a systematic review to catch similar gaps elsewhere.
- You're integrating with a new third-party webhook provider and want to verify your consumer code is built for that provider's actual delivery guarantees (or lack thereof), not an idealized model.

## The Prompt

```
You review a webhook consumer's handling of deduplication and event ordering. You check for the specific failure modes caused by real-world webhook delivery: retried/duplicate deliveries and out-of-order arrival — not general code quality.

Consumer/handler code: {{CONSUMER_CODE}}
Webhook provider and its documented delivery guarantees: {{PROVIDER_GUARANTEES}}
Event types handled: {{EVENT_TYPES}}

Instructions:
1. Check for deduplication: does the handler use the event's unique ID (or an equivalent idempotency key) to detect and skip already-processed events, or does it process every incoming request as if it's guaranteed to be new? Most webhook providers explicitly guarantee at-least-once delivery, meaning retries and duplicates are expected, not edge cases.
2. Check where deduplication state is stored and its lifetime — an in-memory-only dedupe set is lost on restart/deploy and won't catch duplicates delivered after that point; check whether the dedupe store is durable and has a sensible retention window relative to how long the provider might retry.
3. Check for ordering assumptions: does the handler logic assume events for the same resource arrive in the order they were generated? If {{PROVIDER_GUARANTEES}} doesn't explicitly guarantee ordering (most providers don't, especially across retries), flag any logic that would produce wrong state if a later-generated event is processed before an earlier one (e.g. an "updated" event processed before the "created" event for the same resource).
4. Check the handler's response behavior: does it return a success response only after the event is durably processed (or durably queued for processing), or could it return success and then fail to actually process the event — which would cause the provider to stop retrying an event that was never actually handled?
5. Check that handler failures result in an appropriate non-success response (so the provider retries) rather than swallowing an error and returning success, which would silently drop the event.
6. If {{PROVIDER_GUARANTEES}} isn't provided, flag that the review's confidence is limited — different providers have meaningfully different retry/ordering/signing behavior, and generic advice about "webhooks in general" can miss provider-specific gaps.

Output format: Markdown, one entry per finding: the issue, why it matters given {{PROVIDER_GUARANTEES}}, and the fix. End with an explicit checklist status: deduplication (present/absent/partial), ordering handling (present/absent/not applicable), and failure-response correctness (correct/incorrect).
```

## Variables
- `{{CONSUMER_CODE}}` — the webhook receiving endpoint/handler code. Required.
- `{{PROVIDER_GUARANTEES}}` — the specific provider's documented delivery guarantees (at-least-once vs. exactly-once, ordering guarantees if any, retry schedule). Required — the correct handling depends entirely on what the provider actually guarantees.
- `{{EVENT_TYPES}}` — the specific event types this consumer handles, since ordering sensitivity often varies by event type. Required.

## Example
**Input:** `{{CONSUMER_CODE}}` = "Handler receives event, immediately calls `processOrderUpdate(event.data)` which writes to the database, then returns 200. No check against event.id before processing." `{{PROVIDER_GUARANTEES}}` = "At-least-once delivery, no ordering guarantee, retries for 24 hours on non-2xx response" `{{EVENT_TYPES}}` = "order.created, order.updated, order.cancelled"

**Output (excerpt):**
```
### Finding: no deduplication against event.id
The handler processes every incoming event unconditionally. Given the provider's at-least-once guarantee, retries (from network issues, timeouts, etc.) will cause the same event.id to be delivered more than once, and `processOrderUpdate` will run multiple times for the same logical event.
Fix: check event.id against a durable store of already-processed event IDs before calling `processOrderUpdate`; skip and return 200 if already processed.

### Finding: no ordering handling for order.updated vs. order.created
Given no ordering guarantee from the provider, an `order.updated` event could arrive and be processed before the corresponding `order.created` event for the same order, which — depending on `processOrderUpdate`'s implementation — could either fail (order doesn't exist yet) or create an inconsistent state.
Fix: either make `processOrderUpdate` handle a not-yet-created order gracefully (e.g. upsert semantics), or add a sequencing check using event timestamps/version numbers rather than assuming delivery order reflects creation order.

Checklist: Deduplication — absent. Ordering handling — absent. Failure-response correctness — correct (returns 200 only after processing attempt, though the missing dedup means duplicate processing isn't actually prevented).
```

## Tips & Variations
- If `{{PROVIDER_GUARANTEES}}` indicates the provider does guarantee ordering and exactly-once delivery for your specific plan/configuration, some of these checks become unnecessary — don't apply generic webhook-hardening advice past what the actual provider contract requires, since added complexity without a real risk it addresses is its own cost.
- Pair with `webhook-delivery-reliability-reviewer` (coding, already shipped) when you own both sides of a webhook integration (e.g. an internal event system) — that prompt reviews the sending side's retry/backoff/signing; this one reviews the receiving side's dedup/ordering.
- For high-volume webhook consumers, also check the dedup store's own scalability (e.g. a dedup table that grows unbounded without a retention/cleanup policy) — this prompt flags the correctness gap, but the operational cost of the fix is worth reviewing too.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

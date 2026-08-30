---
id: webhook-delivery-reliability-reviewer
title: Webhook Delivery Reliability Reviewer
category: coding
tags: [backend, webhooks, reliability]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Reviews an outbound webhook delivery system's retry, backoff, signing, and ordering behavior — for a backend engineer building or reviewing a system that pushes events to external subscriber URLs. Distinct from `api-error-handling-auditor`, which covers a service's own inbound API idempotency, not the guarantees made to outbound webhook subscribers.

## When to use it
- Building a webhook delivery system for the first time and want to check it against known reliability pitfalls.
- Subscribers are reporting missed, duplicated, or out-of-order webhook events.
- Adding webhooks to a product and deciding what delivery guarantees to actually promise in the docs.

## The Prompt

```
You are reviewing an outbound webhook delivery system for reliability — specifically, what happens when a subscriber's endpoint is slow, erroring, or temporarily unreachable, and whether the guarantees made to subscribers are actually upheld by the code.

Webhook delivery code: {{WEBHOOK_CODE}}

Delivery guarantees needed (at-least-once vs. best-effort, whether ordering matters for the events being sent): {{DELIVERY_GUARANTEES_NEEDED}}

Check:
1. Retry and backoff — on subscriber failure (5xx response, timeout, connection refused), is there a retry strategy, and does it back off (exponentially or otherwise) rather than retrying tightly? Is there a bounded maximum (retry count or total duration) so a permanently dead subscriber endpoint doesn't retry forever?
2. Payload signing — is each webhook payload signed (e.g., HMAC with a per-subscriber secret) so the receiving endpoint can verify the request actually came from you and wasn't forged or tampered with in transit?
3. Subscriber-side idempotency support — does each delivery include a stable delivery ID or event ID, so a subscriber that receives the same event twice (due to a retry after a response that was sent but lost in transit) can deduplicate on their own side?
4. Ordering — if {{DELIVERY_GUARANTEES_NEEDED}} states ordering matters, does the delivery mechanism actually preserve order (e.g., single-threaded delivery per subscriber, or a sequence number subscribers can use to reorder) — or could parallel delivery/retries cause events to arrive out of the order they occurred?

For each gap, state concretely what could go wrong for a subscriber as a result (a duplicate charge processed twice on their side, a stale state overwrite from an out-of-order event) — not just "this violates best practice."

If {{DELIVERY_GUARANTEES_NEEDED}} states best-effort/no ordering guarantee, don't flag the absence of strict ordering or infinite retry as a defect — judge the implementation against what was actually promised, not a maximal standard.
```

## Variables
- `{{WEBHOOK_CODE}}` — the outbound webhook delivery code. Required.
- `{{DELIVERY_GUARANTEES_NEEDED}}` — what's actually promised to subscribers (at-least-once or best-effort, ordering required or not). Required — the review standard depends entirely on this.

## Example
**Input:** `{{WEBHOOK_CODE}}` = a delivery function that POSTs an event payload with no signature header, retries 3 times immediately on failure with no delay, and includes no event ID in the payload, `{{DELIVERY_GUARANTEES_NEEDED}}` = "at-least-once delivery, ordering not required".

**Output (excerpt):**
```
Finding: no payload signing. Severity: HIGH. Subscribers have no way to verify a webhook actually came from this system rather than a forged request to their endpoint — this is a security gap for any subscriber that takes action based on webhook content (e.g., triggering a refund on a "refund.issued" event).
Fix: add an HMAC signature header computed with a per-subscriber secret, and document the verification process for subscribers.

Finding: retries fire immediately, 3 times, with no backoff. Severity: MEDIUM. Against a subscriber endpoint that's struggling (e.g., briefly overloaded), tight immediate retries add load exactly when it's least helpful, and 3 attempts total is thin for a stated at-least-once guarantee against a longer outage.
Fix: exponential backoff (e.g., 1s, 30s, 5min, ...) with a longer total retry window (e.g., 24 hours) before giving up and surfacing the failure.

Finding: no event/delivery ID in the payload. Severity: MEDIUM given at-least-once is the stated guarantee — retries are expected, but with no ID, subscribers have no way to detect and dedupe a webhook they already successfully processed once.
Fix: include a stable, unique event ID in every payload, generated once per logical event, and unchanged across retries of the same delivery.
```

## Tips & Variations
- For a system that also needs to expose delivery status to subscribers (e.g., a dashboard showing failed deliveries), ask it to additionally check whether failure/retry state is actually persisted and queryable, not just retried in-memory and lost on a process restart.
- If ordering genuinely matters (e.g., state-transition events), ask it to specifically evaluate whether concurrent delivery across subscribers could still preserve per-subscriber order even if overall throughput is parallelized.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

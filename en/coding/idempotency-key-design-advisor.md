---
id: idempotency-key-design-advisor
title: Idempotency Key Design Advisor
category: coding
tags: [backend, idempotency, api-design]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Designs an idempotency mechanism — key strategy, dedup window, replay behavior — for a new write endpoint before it ships. Distinct from `api-error-handling-auditor`, which audits idempotency in an already-built API: this is the plan-stage design that happens before the endpoint is written.

## When to use it
- Designing a new endpoint with a real side effect (charges money, sends an email, creates a resource) that a client might retry.
- Deciding between client-generated and server-generated idempotency keys for a new API.
- A past incident involved duplicate side effects from a retried request, and you want to design it correctly this time.

## The Prompt

```
You are designing an idempotency mechanism for a new write endpoint before it's built — not reviewing an existing one.

Endpoint description (what write operation it performs, and its real-world side effect): {{ENDPOINT_DESCRIPTION}}

Client retry behavior (why/how a client might retry — network timeout, mobile app backgrounding and resuming, an aggressive client-side retry policy): {{CLIENT_RETRY_BEHAVIOR}}

Storage context (optional — what's available for tracking dedup state, e.g. Redis, a database table): {{STORAGE_CONTEXT}}

Design:
1. Key strategy — client-generated (client sends an `Idempotency-Key` header/field) vs. server-generated (derived from request content). Recommend one with reasoning tied to the actual retry scenario described.
2. Dedup window — how long a key must be remembered, with reasoning tied to how long the described retry behavior could plausibly take to resolve.
3. Replay behavior — on a retry with the same key, exactly what happens: return the cached original response without re-executing the side effect. Specify what gets cached (full response, or just success/failure + relevant IDs).
4. Conflict behavior — what happens if the same key arrives with a materially different payload (reject as a conflict, don't silently execute either version).
5. Concurrent-request handling — what happens if a retry arrives while the original request for that key is still being processed (return a "still processing" response or block briefly — don't let both proceed and double-execute the side effect).

Output as a short design spec with these five sections, each with a concrete recommendation, not just options listed.
```

## Variables
- `{{ENDPOINT_DESCRIPTION}}` — the write operation and its real side effect. Required.
- `{{CLIENT_RETRY_BEHAVIOR}}` — why and how the client might retry. Required — this drives the dedup window and key-strategy recommendation.
- `{{STORAGE_CONTEXT}}` — available infrastructure for tracking idempotency state. Optional; without it, a generic recommendation (e.g., "a keyed store with TTL") is given.

## Example
**Input:** `{{ENDPOINT_DESCRIPTION}}` = "POST /charges — charges a customer's saved card", `{{CLIENT_RETRY_BEHAVIOR}}` = "mobile app may retry on network timeout up to 3 times over 30 seconds; app can also be killed and relaunched, retrying up to an hour later", `{{STORAGE_CONTEXT}}` = "Redis available".

**Output (excerpt):**
```
1. Key strategy: client-generated. The client should generate a UUID before the first attempt and reuse it across retries, including after app relaunch — a server-generated key can't survive a killed app, since the client has no way to know what key the server would assign to a request it never got a response for.

2. Dedup window: at least 24 hours, not 30 seconds. The described retry behavior includes app relaunch up to an hour later, and payment retries specifically should err toward a long window — a duplicate charge is a much worse outcome than briefly rejecting a legitimate new charge attempt with a stale key.

4. Conflict behavior: if the same Idempotency-Key arrives with a different amount or card, return 409 Conflict — never guess which payload was "intended."

5. Concurrent handling: on a retry arriving while the original charge is still processing, return 409 with a "request in progress, retry shortly" response — do not queue a second charge attempt against the payment processor while the first is unresolved.
```

## Tips & Variations
- For a strictly internal/trusted-client API where you control both ends, server-generated keys derived from a natural request identifier (e.g., an order ID) can be simpler than requiring clients to generate UUIDs — note that tradeoff explicitly if the client isn't a third party.
- Pair with `api-error-handling-auditor` once the endpoint is built, to verify the design was actually implemented as specified.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

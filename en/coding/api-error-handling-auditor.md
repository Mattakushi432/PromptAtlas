---
id: api-error-handling-auditor
title: API Error Handling Auditor
category: coding
tags: [api-design, error-handling, idempotency]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Audits an API's idempotency guarantees and error-handling consistency — specifically whether safe retries are actually safe and whether error responses are predictable — for an API expected to be called by real clients over unreliable networks. Distinct from `api-versioning-advisor` and `rest-endpoint-designer`: this is a correctness audit of behavior under failure, not a design-from-scratch prompt.

## When to use it
- Before shipping an API that clients will retry on failure, to confirm retries won't cause duplicate side effects (double charges, duplicate records).
- Investigating a bug report of duplicate data creation that's suspected to come from client retry behavior.
- Standardizing error response shape across an API that grew organically and now has inconsistent error formats per endpoint.

## The Prompt

```
You audit an API's idempotency behavior and error-handling consistency — not general endpoint design or naming.

API endpoints and their implementation (or description of behavior): {{API_DETAILS}}
Known client retry behavior (optional — e.g. "mobile client retries POST requests up to 3 times on timeout"): {{RETRY_BEHAVIOR}}

Instructions:
1. For each state-changing endpoint (POST, PUT, PATCH, DELETE), determine whether it's actually idempotent as implemented — not just whether the HTTP method is conventionally idempotent (PUT/DELETE are supposed to be, but a bad implementation can still break this).
2. For POST endpoints specifically (not idempotent by HTTP convention), check whether there's an idempotency mechanism (client-supplied idempotency key, natural dedup key) — flag any POST that creates a resource with no way to prevent a retried request from creating a duplicate.
3. For each endpoint, trace what happens if a client sends the same request twice due to a network timeout where the first request actually succeeded server-side but the response was lost: does the second attempt error usefully, silently duplicate the effect, or return the original result?
4. Audit error response consistency: do all endpoints use the same error body shape (error code, message, field-level validation details)? Flag any endpoint returning a differently-shaped error, a bare string, or an unstructured 500 for a case that should be a handled 4xx.
5. Check status code correctness: a validation failure returning 500 instead of 400/422, or a not-found case returning 200 with an empty body instead of 404 — these break client error-handling logic that switches on status code.
6. If {{RETRY_BEHAVIOR}} is provided, specifically trace whether the described retry pattern is safe given the endpoints' actual idempotency, and flag any combination that would produce duplicate effects in practice.

Output format: Markdown with sections: Idempotency Findings (per endpoint), Error Response Consistency Findings, and a "Highest Risk" callout for any finding that could cause real data duplication or corruption under retry.
```

## Variables
- `{{API_DETAILS}}` — the endpoints and how they're implemented, or a behavioral description if code isn't available. Required.
- `{{RETRY_BEHAVIOR}}` — how clients actually retry failed requests. Optional but makes the idempotency analysis concrete rather than theoretical.

## Example
**Input:** `{{API_DETAILS}}` = "POST /orders creates an order and charges a payment method; no idempotency key support", `{{RETRY_BEHAVIOR}}` = "client retries any request that times out, up to 2 times".

**Output (excerpt):**
```
### Idempotency Findings
**POST /orders — HIGHEST RISK**
No idempotency key mechanism exists. If the initial request succeeds server-side (order created, payment charged) but the response is lost to a network timeout, the client's retry will create a second order and a second charge — this is a real double-charge risk given the stated retry behavior, not a theoretical one.
Recommendation: accept a client-supplied `Idempotency-Key` header; on a retried request with a seen key, return the original response instead of re-executing the charge.
```

## Tips & Variations
- For payment or other financial endpoints specifically, treat any idempotency finding as automatically HIGHEST RISK regardless of stated retry behavior — the consequence severity alone justifies it.
- If auditing a GraphQL API instead of REST, adapt the idempotency questions to mutations specifically, since GraphQL queries are inherently read-only/idempotent by convention.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

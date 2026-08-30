---
id: third-party-api-risk-assessor
title: Third-Party API Integration Risk Assessor
category: coding
tags: [backend, resilience, integrations]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Assesses the resilience of code that calls an external, third-party API — timeouts, retries, fallback behavior — against how critical that call actually is to the user flow it's part of. For an engineer integrating a new external dependency, not an API contract/design review.

## When to use it
- Adding a new integration with a payment processor, shipping provider, email service, or any external API.
- A past incident traced back to an external API being slow or down and taking your own service down with it.
- Reviewing whether an integration's error handling matches how critical the call actually is.

## The Prompt

```
You are assessing the resilience of code that calls a third-party API — specifically, whether it handles that external dependency being slow, erroring, or fully down. Assume the integration's happy-path logic is correct; your job is what happens when the external side misbehaves.

Integration code: {{INTEGRATION_CODE}}

Criticality of this external call (is it on the critical path of a core user flow that must succeed, or is it best-effort/non-blocking): {{EXTERNAL_API_CRITICALITY}}

Check:
1. Timeout — is an explicit, reasonable timeout set on the call, rather than relying on a library/platform default that may be too long or effectively infinite?
2. Retry strategy — does retry logic exist for transient failures, and does it use backoff (not a tight retry loop that could amplify load on an already-struggling external service)?
3. Circuit-breaker or fallback — for a sustained external outage, is there a mechanism to stop hammering the failing API and either fail fast or serve a fallback, rather than every request individually waiting out the full timeout?
4. Failure propagation — when the external call ultimately fails, what happens to the calling request? Does it fail the entire user action, or degrade gracefully (e.g., skip a non-essential enrichment step and continue)? Judge whether this matches the stated {{EXTERNAL_API_CRITICALITY}} — a best-effort call that takes down a core flow on failure is a mismatch worth flagging even if the code "works."

For each gap found, propose the specific fix (a timeout value with reasoning, a backoff strategy, or a fallback behavior) rather than just noting the gap exists.

If criticality is stated as best-effort but the review finds the call is actually structured to block/fail the core flow, call that mismatch out explicitly as the top finding — it's usually more important than any individual missing timeout.
```

## Variables
- `{{INTEGRATION_CODE}}` — the code that calls the external API. Required.
- `{{EXTERNAL_API_CRITICALITY}}` — whether this call is on the critical path of a must-succeed flow or is best-effort/non-blocking. Required — resilience requirements are judged relative to this, not in the abstract.

## Example
**Input:** `{{INTEGRATION_CODE}}` = a checkout flow that calls a third-party fraud-scoring API synchronously with no timeout set, and fails the entire checkout if the call throws, `{{EXTERNAL_API_CRITICALITY}}` = "best-effort — fraud score is a nice-to-have signal, not a hard requirement to complete checkout".

**Output (excerpt):**
```
Finding (top): stated criticality is best-effort, but the code fails the entire checkout if the fraud API call throws — this is a criticality mismatch. A best-effort enrichment call should never be able to block a core revenue flow. Severity: HIGH.
Fix: wrap the fraud-score call so a failure or timeout logs a warning and proceeds with checkout using a "unscored" fallback state, rather than propagating the exception up to fail the transaction.

Finding: no explicit timeout is set on the HTTP client used for this call — relying on the library default risks a slow fraud API stalling checkout requests for however long that default is. Severity: MEDIUM.
Fix: set an explicit timeout (e.g., 500ms, given this is a best-effort signal that shouldn't be worth waiting long for) and treat a timeout the same as any other failure in the fallback path above.
```

## Tips & Variations
- For a genuinely critical call (e.g., the payment processor itself), the fallback recommendation changes from "degrade gracefully" to "fail fast with a clear user-facing error and a retry option" — tell it explicitly if the call truly cannot be made best-effort.
- Pair with `caching-strategy-advisor` if the external data changes slowly — a short-lived cache is often a better resilience fix than deeper retry logic.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

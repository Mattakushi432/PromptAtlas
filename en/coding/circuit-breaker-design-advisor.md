---
id: circuit-breaker-design-advisor
title: Circuit Breaker Design Advisor
category: coding
tags: [resilience, distributed-systems, backend]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Designs circuit-breaker thresholds and fallback behavior for a call to a flaky or slow downstream dependency — when to trip open, how to probe recovery, and what degraded response to return while open — given the dependency's actual criticality. This is a plan-stage prompt: it decides whether and when to stop calling a struggling dependency at all, distinct from `retry-storm-prevention-advisor` (coding, already shipped), which designs backoff/jitter for retries assuming calls should keep happening.

## When to use it
- You're adding a call to an external service or another internal service and want to design its circuit-breaker behavior before writing the integration, not retrofit it after an outage.
- A downstream dependency's failures are currently cascading into your own service's failures (slow calls piling up, threads/connections exhausted) and you want a concrete threshold/fallback design, not just "add a circuit breaker" as advice.
- You're reviewing an existing circuit-breaker configuration and suspect its thresholds are miscalibrated (tripping too eagerly on transient blips, or not tripping fast enough during a real outage).

## The Prompt

```
You design circuit-breaker behavior for a call to a specific downstream dependency, given its failure characteristics and criticality to the calling service.

Downstream dependency and what it's used for: {{DEPENDENCY}}
How critical this call is to the caller's core function: {{CRITICALITY}}
Known failure/latency characteristics (e.g. typical latency, how it fails when unhealthy): {{FAILURE_PROFILE}}

Instructions:
1. Recommend concrete trip-to-open conditions: a failure-rate threshold (e.g. >50% of the last N requests failing) and/or a latency threshold (e.g. p95 latency exceeding X for Y consecutive requests), calibrated against {{FAILURE_PROFILE}}'s normal behavior so the breaker doesn't trip on ordinary variance.
2. Recommend the evaluation window: a fixed request count (e.g. last 20 requests) vs. a time window (e.g. last 10 seconds) — note the tradeoff (low-traffic endpoints need a time-based or minimum-sample-size window, or a request-count window may never fill during an outage).
3. Recommend open-state duration and half-open probing: how long to stay fully open before allowing a small number of probe requests through, and how many consecutive probe successes are required to close again versus a single probe failure reopening it.
4. Given {{CRITICALITY}}, specify concrete fallback behavior while open: a cached/stale last-known-good response, a safe default value, degrading a feature gracefully (e.g. hiding a non-essential widget), or failing fast with a clear error — and justify the choice against what breaks for the end user in each option.
5. Flag if {{CRITICALITY}} suggests the call shouldn't have a soft-fail fallback at all (e.g. a payment-authorization call) — in that case the correct design is failing fast and loud rather than degrading silently, and the circuit breaker's role is limiting blast radius (protecting the caller's own resources) rather than providing a fallback experience.
6. Note any resource-isolation consideration if {{FAILURE_PROFILE}} indicates the dependency being slow (not just erroring) risks exhausting threads/connections on the caller — a circuit breaker without an accompanying timeout/bulkhead won't prevent pile-up before it trips.

Output format: Markdown with sections: Trip conditions, Evaluation window, Half-open recovery, Fallback behavior, Resource-isolation notes. End with a one-paragraph plain-language summary of the resulting user-facing behavior during an outage of {{DEPENDENCY}}.
```

## Variables
- `{{DEPENDENCY}}` — the downstream service/call being protected and its purpose. Required.
- `{{CRITICALITY}}` — how essential this call is to the caller's core function (e.g. "blocks checkout" vs. "powers a recommendation widget"). Required — fallback design is meaningless without this.
- `{{FAILURE_PROFILE}}` — what's known about how this dependency behaves normally and when unhealthy (typical latency, error modes, whether it fails fast or hangs). Required.

## Example
**Input:** `{{DEPENDENCY}}` = "Third-party product-recommendation API, called on the product detail page to show 'customers also bought'." `{{CRITICALITY}}` = "Non-essential — enhances the page but the page fully works without it." `{{FAILURE_PROFILE}}` = "Normally responds in ~200ms; during past incidents has hung for 10+ seconds rather than erroring quickly, and error rate has spiked to 100% during provider outages."

**Output (excerpt):**
```
### Trip conditions
Trip open when either: failure rate exceeds 50% over the evaluation window, or p95 latency exceeds 1.5s (well above the ~200ms normal baseline, tight enough to catch the known hanging-failure mode before it accumulates).

### Fallback behavior
Given non-essential criticality: while open, simply omit the "customers also bought" section from the page rather than showing an error or blocking the page. No cached fallback needed — an empty section degrades gracefully with no user-facing error.

### Resource-isolation notes
Since {{FAILURE_PROFILE}} shows this dependency has hung for 10+ seconds during incidents rather than failing fast, pair the circuit breaker with a hard request timeout well under that (e.g. 2s) — without it, requests will pile up on hung connections before the failure-rate/latency thresholds accumulate enough samples to trip.

Summary: During a recommendation-API outage, users see the product page load normally without the recommendations section — no visible error, no added latency beyond the enforced 2s timeout on any in-flight calls made just before the breaker trips.
```

## Tips & Variations
- Pair with `third-party-api-risk-assessor` (coding, already shipped) earlier in the process — that prompt assesses whether a given external call has adequate timeout/retry/fallback resilience at all; this prompt designs the specific circuit-breaker parameters once you've decided a breaker is warranted.
- For a call where {{CRITICALITY}} is high but no safe fallback value exists (the payment-authorization case), don't force this prompt's fallback-behavior step to produce one — explicitly instruct it to recommend fail-fast-and-alert instead, since a fabricated "safe default" for money-moving logic is worse than an honest error.
- If the same dependency is called from multiple places with different criticality (e.g. the same recommendation API also powering a critical checkout upsell elsewhere), run this prompt separately per call site rather than assuming one circuit-breaker configuration fits every caller.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

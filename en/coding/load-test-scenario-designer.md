---
id: load-test-scenario-designer
title: Load Test Scenario Designer
category: coding
tags: [testing, performance, load-testing]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Designs the load-test scenarios and traffic scripts to actually run against a system — the plan-stage counterpart to `load-test-result-interpreter`, which interprets results after a test has already run. This is for deciding what to test and how to simulate realistic traffic, before any test executes.

## When to use it
- Preparing for a known traffic spike (a launch, a sale event, a marketing push).
- Establishing a load-test baseline before a major refactor, so results are comparable afterward.
- Deciding what realistic traffic patterns to simulate instead of defaulting to a flat, unrealistic ramp.

## The Prompt

```
You are designing load-test scenarios to run against a system, before any test executes — not interpreting results from a test that already happened.

System description (the endpoints/flows involved): {{SYSTEM_DESCRIPTION}}

Expected traffic (peak requests/second, and the reason for the test — a specific launch, general capacity planning): {{EXPECTED_TRAFFIC}}

Known traffic shape (optional — bursty vs. steady ramp, or a specific mix of user journeys observed historically): {{KNOWN_TRAFFIC_SHAPE}}

Design:
1. A realistic traffic mix across the endpoints/flows involved — not hammering a single endpoint in isolation, since real traffic is a blend and some endpoints are more expensive per-request than others.
2. A ramp pattern matching the actual expected shape — a sudden spike (e.g., a marketing email drop) and a gradual ramp (organic growth) stress fundamentally different things (autoscaling reaction time vs. sustained capacity), so the pattern should match {{KNOWN_TRAFFIC_SHAPE}} if given, or be stated as an assumption if not.
3. Think-time/pacing between simulated user actions that mimics real user behavior, rather than a tight loop that would generate an unrealistically dense request pattern no real user traffic resembles.
4. Concrete pass/fail criteria — specific latency percentiles (not just average) and error-rate thresholds, tied to real SLOs if any were mentioned in {{SYSTEM_DESCRIPTION}}.

Output: a scenario spec (stages, traffic mix, ramp shape, pass/fail criteria) plus a sketch of how this would translate into a tool's config (e.g., k6 stages or a Locust user-behavior class) — enough to hand to an engineer to implement, not full working test code.

If no real traffic data is available to base the shape on, say so explicitly and propose a reasonable conservative default (e.g., a gradual ramp over the test's early stages, holding at peak, then a cooldown) rather than inventing a specific shape with false precision.
```

## Variables
- `{{SYSTEM_DESCRIPTION}}` — the endpoints/flows being tested. Required.
- `{{EXPECTED_TRAFFIC}}` — peak RPS and the reason for the test. Required.
- `{{KNOWN_TRAFFIC_SHAPE}}` — any known real-world pattern the traffic follows. Optional; without it, a conservative default shape is proposed and flagged as an assumption.

## Example
**Input:** `{{SYSTEM_DESCRIPTION}}` = "an e-commerce site: browse (60% of traffic), add-to-cart (25%), checkout (15%)", `{{EXPECTED_TRAFFIC}}` = "peak 500 RPS during a Black Friday sale, versus normal ~50 RPS", `{{KNOWN_TRAFFIC_SHAPE}}` = "historically a sharp spike at the sale's exact start time, not a gradual ramp".

**Output (excerpt):**
```
Traffic mix: maintain the 60/25/15 browse/cart/checkout ratio across the test, not a flat single-endpoint hammer — checkout is likely the most expensive per-request (payment processing, inventory locks), so even at 15% of volume it may dominate resource usage; don't under-represent it just because it's a smaller share of requests.

Ramp pattern: given the known sharp-spike shape, the scenario should ramp from ~50 RPS to 500 RPS within 1-2 minutes, not over 10+ minutes — a gradual ramp would test autoscaling's steady-state behavior but miss whether the system survives the actual shock of a near-instant 10x jump, which is the real risk here.

Pass/fail criteria: p95 latency under 2s and error rate under 1% sustained through the peak plateau (not just at the moment of the spike) — a system that survives the initial spike but degrades over the following 10 minutes at sustained peak load is still a failure.
```

## Tips & Variations
- For a system with strong caching, ask it to specifically vary request parameters (different product IDs, different users) rather than repeating identical requests, which would test the cache far more than the real system.
- Pair with `load-test-result-interpreter` after the test runs — this prompt designs what to run; that one interprets what came back.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

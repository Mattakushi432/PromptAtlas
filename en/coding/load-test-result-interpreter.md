---
id: load-test-result-interpreter
title: Load Test Result Interpreter
category: coding
tags: [performance, load-testing, capacity-planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Interprets actual load-test output (latency percentiles, throughput, error rate under increasing load) to flag likely bottlenecks — grounded in real measured data, distinct from `scalability-bottleneck-predictor`'s forward-looking projection without test data. For after a load test has run and results need to be understood.

## When to use it
- A load test just completed and the raw numbers (percentiles, throughput curves, error rates) need translating into "here's what's actually limiting this system."
- Comparing load test results before/after a change to determine whether the change actually improved capacity or just moved the bottleneck.
- Deciding whether a system is ready for a specific traffic target based on load test evidence, not a guess.

## The Prompt

```
You interpret load test results to identify the actual bottleneck — grounded in the specific numbers given, not general load-testing advice.

Load test results (latency percentiles at various load levels, throughput, error rate, resource utilization if available): {{LOAD_TEST_RESULTS}}
System under test (optional — what it does, known architecture): {{SYSTEM_DESCRIPTION}}
Test methodology (optional — ramp-up pattern, request mix, duration): {{TEST_METHODOLOGY}}

Instructions:
1. Identify the load level where behavior degrades qualitatively, not just quantitatively — the point where latency stops scaling linearly with load and starts climbing sharply (the classic sign of a resource saturating), or where error rate starts rising from near-zero. This inflection point is more informative than any single data point.
2. Distinguish latency degradation from throughput degradation from error-rate degradation — they can appear at different load levels and imply different bottlenecks (rising latency with stable throughput suggests queueing; falling throughput suggests a hard resource limit; rising errors suggest a hard failure point like connection pool exhaustion or timeouts).
3. If resource utilization data (CPU, memory, DB connections, thread pool usage) is included, correlate it with the inflection point — a CPU saturating right where latency spikes points strongly at compute-bound bottleneck; a stable CPU with rising latency points more at I/O wait, lock contention, or an external dependency.
4. If percentile data is given (p50/p95/p99), reason about what a growing gap between p50 and p99 under load implies: a widening tail with a stable median often indicates a subset of requests hitting a specific slow path (a cache miss, a specific query, GC pauses) rather than uniform slowdown.
5. State the load level at which the system is genuinely healthy (error rate near zero, latency within acceptable bounds) as a concrete capacity figure, not just "it handled the test" — this is often the most actionable single number from the whole test.
6. If {{SYSTEM_DESCRIPTION}} or {{TEST_METHODOLOGY}} suggests an obvious confound (e.g., the load generator itself became the bottleneck, or the test ran against a non-production-representative environment), flag that as a caveat on the results' validity before drawing architecture conclusions from them.
7. Recommend the next diagnostic step to confirm the hypothesized bottleneck (a specific metric to add to the next test run, a profiler to attach at the inflection load level) rather than jumping straight to an architectural fix from inference alone.

Output format: Markdown with sections: Inflection Point, Bottleneck Hypothesis (with supporting evidence), Safe Capacity Estimate, Next Diagnostic Step.
```

## Variables
- `{{LOAD_TEST_RESULTS}}` — the actual test output (percentiles, throughput, errors, resource metrics). Required.
- `{{SYSTEM_DESCRIPTION}}` — what's being tested and its architecture. Optional but helps ground the bottleneck hypothesis in something concrete.
- `{{TEST_METHODOLOGY}}` — how the test was run. Optional but helps catch confounds in the results.

## Example
**Input:** `{{LOAD_TEST_RESULTS}}` = "at 100 req/s, p50=50ms p99=120ms, 0% errors; at 200 req/s, p50=55ms p99=800ms, 0.1% errors; at 300 req/s, p50=200ms p99=4000ms, 8% errors (timeouts)", `{{SYSTEM_DESCRIPTION}}` = "API backed by a single Postgres instance with a connection pool of 20".

**Output (excerpt):**
```
## Inflection Point
Between 200 and 300 req/s: p50 jumps from 55ms to 200ms (nearly 4x) and error rate jumps from 0.1% to 8%, with the errors specifically being timeouts — this is a sharp qualitative change, not gradual degradation.

## Bottleneck Hypothesis
Connection pool exhaustion is the most likely cause given the system description: a pool of 20 connections combined with request queueing once concurrent demand exceeds pool capacity would produce exactly this signature — requests queue waiting for a connection, latency balloons, and requests eventually time out waiting. The stable p50 up to 200 req/s followed by a sharp cliff (rather than gradual CPU-bound degradation) is more consistent with a hard resource limit like pool size than with compute saturation.

## Safe Capacity Estimate
~200 req/s is the safe operating ceiling based on this data — at 300 req/s the system is well past healthy operation.

## Next Diagnostic Step
Re-run the test at 250-300 req/s while monitoring Postgres connection pool utilization directly (active vs. idle vs. waiting connections) to confirm pool exhaustion specifically, rather than inferring it purely from latency/error shape.
```

## Tips & Variations
- For a before/after comparison (testing a fix), run this prompt on both result sets and explicitly ask for a comparison: did the inflection point move to a higher load level, or did the bottleneck just shift to a different resource?
- If the load test tool provides a full time-series rather than just summary percentiles, feeding in the time-series data (or a description of its shape) can surface warm-up effects or degradation-over-time patterns that summary percentiles alone hide.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

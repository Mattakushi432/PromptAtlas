---
id: scalability-bottleneck-predictor
title: Scalability Bottleneck Predictor
category: coding
tags: [architecture, scalability, capacity-planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Predicts where a given architecture will break first under a specific growth projection — not a general performance audit of current behavior (see `frontend-performance-auditor`/`hot-path-profiling-guide` for that), but a forward-looking capacity analysis. For planning ahead of growth, not diagnosing a current slowdown.

## When to use it
- Planning for a projected 10x growth in users/traffic and wanting to know what breaks first, before it actually happens.
- Prioritizing a scalability roadmap when you can't fix everything at once and need to know what's genuinely urgent.
- Evaluating a proposed architecture change by checking whether it actually addresses the real bottleneck or just moves it.

## The Prompt

```
You predict where an architecture will hit its first scaling limits under a specific growth projection — this is forward-looking capacity planning, not a review of current performance.

Current architecture description (components, data stores, how they connect, rough current scale): {{ARCHITECTURE_DESCRIPTION}}
Growth projection (what's expected to grow, by how much, over what timeframe): {{GROWTH_PROJECTION}}
Known current headroom (optional — e.g. "database is at 40% CPU currently"): {{CURRENT_HEADROOM}}

Instructions:
1. For each major component in the architecture, reason about how its resource usage scales with the growth projection — linearly, worse than linearly (e.g., an O(n²) algorithm, a full-table scan that grows with row count), or is it actually decoupled from this growth (e.g., a stateless service behind a load balancer)?
2. Identify single points of failure or non-horizontally-scalable components explicitly — a single database write node, a synchronous call chain, an in-memory cache that doesn't share state across instances.
3. Rank the predicted bottlenecks by which will be hit FIRST under the given growth trajectory, not just which is theoretically worst — a component with worse asymptotic scaling but huge current headroom may break later than one with better scaling but almost no headroom left.
4. For each predicted bottleneck, state the specific failure mode (what actually happens: requests queue up, latency degrades gracefully, hard errors, data corruption from a race condition becoming more likely at higher concurrency) and roughly when/at what scale it's likely to bite, if inferable.
5. For the top 1-2 predicted bottlenecks, suggest the general shape of a fix (not full implementation detail) — e.g., "read replicas," "move to an async queue," "shard by tenant" — and note if the fix requires significant lead time to implement, which affects how early it needs to start.
6. If the growth projection or architecture description is too vague to predict specific numbers, say what additional information (current query patterns, actual load test data) would sharpen the prediction, and give your best qualitative ranking anyway.

Output format: Markdown, ranked list of predicted bottlenecks (soonest-to-hit first), each with component, scaling behavior, failure mode, and suggested fix direction.
```

## Variables
- `{{ARCHITECTURE_DESCRIPTION}}` — the system's current components and how they interact. Required.
- `{{GROWTH_PROJECTION}}` — what's expected to grow and by how much. Required.
- `{{CURRENT_HEADROOM}}` — known current resource utilization, if available. Optional but sharpens the timeline estimate.

## Example
**Input:** `{{ARCHITECTURE_DESCRIPTION}}` = "single Postgres instance handles both reads and writes for all user data; app servers are stateless behind a load balancer", `{{GROWTH_PROJECTION}}` = "10x user growth over 12 months", `{{CURRENT_HEADROOM}}` = "DB at 35% CPU, app servers at 15%".

**Output (excerpt):**
```
### 1. Postgres single instance — predicted first bottleneck
Scaling behavior: reads and writes both hit the same instance; at 10x traffic, read load alone likely exceeds what a single instance can serve, since app-server scaling (stateless, horizontal) doesn't relieve DB pressure.
Failure mode: query latency degrades under connection/CPU saturation, eventually causing request timeouts cascading back through the app layer.
Estimated timing: with 35% current CPU headroom and roughly linear scaling of read load with user count, this likely becomes critical well before the full 10x is reached — closer to 3-4x growth.
Fix direction: introduce read replicas for read-heavy endpoints now; this requires connection-routing changes in the app layer, which has meaningful lead time — start before the bottleneck is actually hit.

### 2. App servers — not a near-term bottleneck
Stateless and horizontally scaled behind a load balancer; scaling behavior is roughly linear and headroom is high. Not predicted to be the limiting factor within this growth window.
```

## Tips & Variations
- Feed it real load-test or production percentile latency data as `{{CURRENT_HEADROOM}}` for a much more quantitatively grounded prediction than architecture description alone allows.
- For a multi-tenant system, explicitly ask it to consider "noisy neighbor" effects (one tenant's growth affecting others) as a distinct bottleneck category from raw aggregate load.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

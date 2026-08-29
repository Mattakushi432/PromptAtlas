---
id: caching-strategy-advisor
title: Caching Strategy Advisor
category: coding
tags: [performance, caching, backend]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Recommends a caching strategy — where to cache, what pattern (cache-aside, write-through, etc.), TTL, and invalidation approach — for a specific backend access pattern. Distinct from `state-management-advisor` (frontend client state) and `sql-query-optimizer` (query-level, not caching-layer): this is system-level caching design.

## When to use it
- A specific read path is slow or expensive (a heavy computation, an aggregation query, an external API call) and caching is being considered.
- Deciding on a cache invalidation strategy for data that changes, to avoid serving stale data indefinitely or invalidating so aggressively the cache provides no benefit.
- Reviewing a proposed caching layer before implementation to catch invalidation gaps or an inappropriate TTL choice.

## The Prompt

```
You recommend a caching strategy for a specific access pattern — concrete choices (where, what pattern, TTL, invalidation), not general caching theory.

What's being cached (the data/computation and why it's expensive): {{CACHE_TARGET}}
Access pattern (read frequency vs. write frequency, how many distinct keys, staleness tolerance): {{ACCESS_PATTERN}}
Available caching infrastructure (optional — e.g. "Redis available", "in-process memory cache only, single instance"): {{INFRASTRUCTURE}}

Instructions:
1. Confirm caching is actually warranted given the access pattern: a read:write ratio close to 1:1 with low staleness tolerance may not benefit much from caching — say so if the case for caching is weak, rather than designing a cache for its own sake.
2. Recommend a specific pattern: cache-aside (application checks cache, falls back to source on miss, populates cache) for most read-heavy cases; write-through (cache updated synchronously with the source on write) when read-after-write consistency matters and write volume is manageable; write-behind/write-back only when write latency is critical and eventual persistence is acceptable, with the durability risk explicitly flagged.
3. Recommend a specific TTL based on the actual staleness tolerance described, not a default like "5 minutes" — if the data changes rarely, a longer TTL reduces cache-miss cost; if staleness has real consequences (e.g., pricing data), a short TTL or event-driven invalidation is worth the extra complexity.
4. Design invalidation explicitly, not just expiration: when the underlying data changes, is the specific cache key or keys invalidated at write time (accurate but requires the write path to know about the cache), or does the system rely purely on TTL expiry (simpler but tolerates staleness up to the TTL window)? Recommend based on how bad staleness actually is for this use case.
5. Address cache key design: does the key correctly capture everything that affects the cached value (a cache key missing a relevant parameter causes serving wrong data to a subset of requests) — this is a common, subtle source of cache-correctness bugs.
6. Address the thundering herd / cache stampede risk if the target has high read volume and the underlying computation is expensive: recommend a mitigation (request coalescing, a short lock/single-flight pattern, staggered TTLs) if a cache miss under load could overwhelm the source.
7. If {{INFRASTRUCTURE}} is limited (no shared cache, single instance only), account for that constraint explicitly rather than recommending Redis by default — an in-process cache has different invalidation-across-instances implications that must be addressed if the app runs on multiple instances.

Output format: Markdown with sections: Should You Cache This?, Recommended Pattern, TTL & Invalidation, Cache Key Design, Stampede Mitigation (if relevant).
```

## Variables
- `{{CACHE_TARGET}}` — what's being cached and why it's costly to compute/fetch. Required.
- `{{ACCESS_PATTERN}}` — read/write frequency, key cardinality, staleness tolerance. Required — this drives every recommendation in the prompt.
- `{{INFRASTRUCTURE}}` — what caching infrastructure is actually available. Optional but affects feasibility of some patterns.

## Example
**Input:** `{{CACHE_TARGET}}` = "a dashboard aggregation query that joins across 5 tables, takes ~800ms", `{{ACCESS_PATTERN}}` = "read 200x more often than the underlying data changes; staleness of up to 5 minutes is acceptable", `{{INFRASTRUCTURE}}` = "Redis available, app runs on 4 instances".

**Output (excerpt):**
```
## Should You Cache This?
Yes — a 200:1 read:write ratio with a real, expensive computation (800ms, 5-table join) and meaningful staleness tolerance (5 minutes) is close to an ideal caching case.

## Recommended Pattern
Cache-aside using Redis (shared across your 4 instances, avoiding the per-instance inconsistency an in-process cache would have here) — check Redis first, compute and populate on miss.

## TTL & Invalidation
TTL-based expiry at 5 minutes is sufficient given the stated staleness tolerance — explicit write-time invalidation isn't necessary here since the underlying data changes infrequently relative to reads, and building invalidation logic for 5 joined tables adds real complexity for marginal freshness benefit.

## Stampede Mitigation
Given the 800ms computation cost and shared cache across instances, add single-flight request coalescing (e.g., a short-lived lock key in Redis) so a cache-miss under concurrent load triggers one recomputation, not 4+ simultaneous 800ms queries when the TTL expires under load.
```

## Tips & Variations
- For a cache that's proving to have low hit rate in practice, ask it to help diagnose why (key design too granular, TTL too short, access pattern more write-heavy than assumed) rather than just re-recommending a strategy from scratch.
- If the data has a natural "changed" event already available (a message queue, a DB trigger), explicitly mention it — event-driven invalidation becomes a much stronger recommendation when the infrastructure for it already exists.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

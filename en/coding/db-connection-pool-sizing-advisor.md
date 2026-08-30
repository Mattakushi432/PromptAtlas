---
id: db-connection-pool-sizing-advisor
title: Database Connection Pool Sizing Advisor
category: coding
tags: [databases, backend, performance]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Recommends database connection pool size and timeout settings given expected application concurrency and the database's own connection limits. Distinct from `n-plus-one-detector` (query patterns) and `sql-query-optimizer` (individual query performance): this is about how many connections the application should hold open at once, not what those connections query.

## When to use it
- Setting up a new service's database connection pool for the first time.
- Diagnosing "too many connections" or "connection pool exhausted" errors from the database.
- Scaling an existing service (more instances, more traffic) and revisiting pool settings that were never reconsidered since launch.

## The Prompt

```
You are recommending database connection pool settings — not query optimization, specifically how many connections the application should hold open and for how long.

Application concurrency (expected concurrent request/worker count — e.g., number of app instances × threads or workers per instance): {{APP_CONCURRENCY}}

Database connection limit (the database's max connections, and how many other services or pools share that same limit): {{DB_CONNECTION_LIMIT}}

Query profile (optional — typical query duration: fast key lookups vs. longer-running analytical queries): {{QUERY_PROFILE}}

Recommend:
1. A pool size range with explicit reasoning — not "the default," tied to the actual concurrency given and the fact that a connection held open during a long-running query blocks that slot from serving any other request in the meantime (so a pool sized only for request count, ignoring query duration, undersizes for slow-query workloads).
2. A connection acquisition timeout — how long a request should wait for a pool connection to become available before failing, rather than queuing indefinitely and turning a pool-exhaustion event into a cascading pileup of stuck requests.
3. An idle connection timeout — how long an unused connection stays open before being recycled, balancing connection-reuse efficiency against holding connections the database could otherwise serve to other consumers.
4. Whether the requested pool size, multiplied across all application instances, risks exceeding the database's total connection limit once other consumers sharing that limit are accounted for — this is the most common version of this mistake: sizing one instance's pool correctly while ignoring the fleet-wide total.

Recommend what to monitor after deploying the setting (pool exhaustion/wait-time events, actual connection utilization over time) rather than treating the initial number as final — pool sizing is something to tune with real data, not solve once from first principles alone.
```

## Variables
- `{{APP_CONCURRENCY}}` — expected concurrent request/worker count per instance, and how many instances run. Required.
- `{{DB_CONNECTION_LIMIT}}` — the database's max connections and what else shares that limit. Required — without it, no pool size can be judged safe.
- `{{QUERY_PROFILE}}` — typical query duration. Optional; without it, a conservative assumption (mixed fast/slow queries) is used.

## Example
**Input:** `{{APP_CONCURRENCY}}` = "10 app instances, each with a pool of up to 20 connections requested", `{{DB_CONNECTION_LIMIT}}` = "PostgreSQL max_connections = 100, shared with a separate analytics service using ~15 connections", `{{QUERY_PROFILE}}` = "mostly fast key lookups under 50ms, occasional report queries taking several seconds".

**Output (excerpt):**
```
Fleet-wide math check (top finding): 10 instances × 20 connections requested = 200 connections at full pool utilization, against a database limit of 100 total, 15 of which are already claimed by the analytics service — leaving only 85 for this application. The requested per-instance size of 20 is not safe at this fleet size; it only looks reasonable when considered per-instance in isolation.

Recommended pool size: ~8 connections per instance (8 × 10 = 80, leaving headroom under the 85 available) rather than 20 — this is a meaningful downward revision driven entirely by the fleet-wide total, not by anything wrong with 20 as a per-instance number in isolation.

Connection acquisition timeout: ~3 seconds. Given the query profile includes occasional multi-second report queries that can hold a connection longer, requests waiting for a free connection should fail relatively fast rather than queuing behind a slow report query indefinitely — a fast, clear failure is easier to handle upstream than a slow cascade.

Monitor after deploying: pool wait-time p99 and pool-exhaustion event count — if wait times are consistently near zero, there may be room to right-size down further; if exhaustion events appear, the 8-per-instance number needs revisiting before it becomes a production incident.
```

## Tips & Variations
- If a connection-pooling proxy (PgBouncer, RDS Proxy) sits between the app and database, ask it to factor that in explicitly — the proxy's own pool sizing, not just the app's, becomes the actual constraint against the database's limit.
- For a database with wildly different query duration classes mixed together (fast lookups and slow reports on the same pool), ask it to consider whether a separate pool for the slow-query workload would prevent report queries from starving fast lookups of connections.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

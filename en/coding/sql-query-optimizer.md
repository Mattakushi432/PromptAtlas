---
id: sql-query-optimizer
title: SQL Query Optimizer
category: coding
tags: [databases, sql, performance]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.1
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Rewrites a slow SQL query into an optimized version and recommends the specific indexes needed, given the query and its schema — a concrete fix, not a general "here's how indexes work" explainer. For a real slow query someone needs to fix.

## When to use it
- A specific query is timing out or showing up as the slowest in a database's slow-query log and needs a concrete fix.
- Reviewing a new query before it ships to production, to catch an obvious full-table-scan pattern early.
- Deciding what index to add without over-indexing a table that's already write-heavy.

## The Prompt

```
You optimize a slow SQL query given its schema and (if available) its execution plan. Produce a rewritten query and specific index recommendations, not general advice.

Slow query: {{SLOW_QUERY}}
Relevant schema (tables, columns, existing indexes, approximate row counts): {{SCHEMA}}
Execution plan output, if available (EXPLAIN/EXPLAIN ANALYZE): {{EXECUTION_PLAN}}
Database engine: {{DATABASE_ENGINE}}

Instructions:
1. Identify the specific cause(s) of slowness: missing index causing a sequential/table scan, a non-sargable predicate (a function wrapped around an indexed column, preventing index use), an unnecessary subquery that could be a join, a SELECT * pulling unneeded columns/rows, an implicit type conversion breaking index usage, or a join order the planner is choosing poorly.
2. If an execution plan is provided, cite specific evidence from it (e.g., "Seq Scan on orders, cost=... rows=50000" ) rather than guessing at the cause.
3. Provide the rewritten query with the same result semantics — output must be provably equivalent to the original for correct inputs, not just faster and "close enough."
4. Recommend specific index(es): exact columns, order (for composite indexes, order matters for which query patterns benefit), and index type if the engine supports options (B-tree vs. partial vs. covering/included columns).
5. Note the write-side cost of each recommended index (every index slows down INSERT/UPDATE/DELETE on that table) — don't recommend indexes without acknowledging this tradeoff, especially on a write-heavy table.
6. If the query is slow for a reason no index or rewrite can fix (e.g., it's fundamentally aggregating over too much data for an OLTP query), say so and suggest an architectural alternative (materialized view, pre-aggregation, caching) rather than forcing a query-level fix.
7. If {{EXECUTION_PLAN}} isn't provided, say what you'd want to see in one to confirm your diagnosis, but give your best diagnosis from the query and schema alone anyway.

Output format: Markdown with sections: Diagnosis, Rewritten Query, Recommended Indexes (with tradeoffs), and (if applicable) Architectural Note.
```

## Variables
- `{{SLOW_QUERY}}` — the query to optimize. Required.
- `{{SCHEMA}}` — relevant table definitions, existing indexes, and rough table sizes. Required.
- `{{DATABASE_ENGINE}}` — e.g. "PostgreSQL 16", "MySQL 8". Required — index syntax and optimizer behavior differ by engine.
- `{{EXECUTION_PLAN}}` — actual EXPLAIN output. Optional but turns guesswork into diagnosis.

## Example
**Input:** `{{SLOW_QUERY}}` = `SELECT * FROM orders WHERE YEAR(created_at) = 2026`, `{{SCHEMA}}` = `orders(id, created_at, ...)`, no index on `created_at`, `{{DATABASE_ENGINE}}` = "MySQL 8".

**Output (excerpt):**
```
## Diagnosis
`YEAR(created_at) = 2026` wraps an indexed-candidate column in a function, making it non-sargable — even with an index on `created_at`, MySQL can't use it for this predicate and falls back to a full table scan.

## Rewritten Query
```sql
SELECT * FROM orders WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01';
```

## Recommended Indexes
`CREATE INDEX idx_orders_created_at ON orders(created_at);` — a simple B-tree index now usable by the range predicate. Tradeoff: minor write overhead on every order insert; acceptable given orders are read far more often than written on this table.
```

## Tips & Variations
- Paste the actual `EXPLAIN (ANALYZE, BUFFERS)` (Postgres) or `EXPLAIN FORMAT=JSON` (MySQL) output for a much more precise diagnosis than schema alone allows.
- For a query that's slow due to a bad join order, ask it to also suggest a query hint or restructuring (e.g., a CTE materializing an intermediate result) if the planner can't be trusted to pick well.

## Changelog
- 1.0.1 (2026-08-30): Normalized tag from `database` to canonical `databases` (see `docs/tags.md`).
- 1.0.0 (2026-08-29): Initial version.

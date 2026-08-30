---
id: database-index-bloat-auditor
title: Database Index Bloat Auditor
category: coding
tags: [databases, performance, code-review]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Identifies indexes that are unused or redundant — adding write overhead and storage cost without a corresponding read benefit — from a schema and query-pattern description, distinct from `sql-query-optimizer` (coding, already shipped)'s focus on speeding up a specific slow query: this prompt looks at the whole index inventory for waste, not one query's performance.

## When to use it
- Your database has accumulated indexes over time (often added reactively per slow query) and you suspect some are no longer earning their write-overhead cost.
- You're reviewing a migration that adds a new index and want to check it isn't redundant with an existing one before it ships.
- Write performance has degraded and you want a systematic pass to find indexes that could be dropped, rather than guessing which ones matter.

## The Prompt

```
You audit a set of database indexes for ones that are unused or redundant. You reason from the schema, the actual query patterns given, and (if provided) real usage statistics — you do not guess at query patterns not described, and you do not recommend dropping an index without a clear reason grounded in what's given.

Schema and current indexes: {{SCHEMA_AND_INDEXES}}
Known query patterns: {{QUERY_PATTERNS}}
Index usage statistics (if available, e.g. from pg_stat_user_indexes or equivalent): {{USAGE_STATS}}

Instructions:
1. Identify redundant indexes: an index that's a strict prefix of another composite index on the same table is generally redundant (e.g. an index on `(a)` is usually redundant if an index on `(a, b)` exists, since the composite index can serve queries that only filter on `a`) — flag these explicitly, noting the specific redundant pair.
2. If {{USAGE_STATS}} is provided, flag indexes with zero or near-zero scans as candidates for removal — but check them against {{QUERY_PATTERNS}} first, since a low-traffic but critical query (e.g. a rare but important admin operation) can have a low scan count while still being necessary.
3. If {{USAGE_STATS}} isn't provided, reason from {{QUERY_PATTERNS}} alone: flag any index that doesn't match any described query's filter/sort/join columns as a candidate needing usage-stat verification, rather than a confirmed removal — without real usage data, this check identifies candidates to investigate, not a final verdict.
4. Check for indexes that duplicate what a unique constraint or primary key already provides — a manually added index covering the same columns as an existing unique constraint is redundant overhead.
5. For each flagged index, state the specific write-cost tradeoff being given up if kept (extra work on every insert/update/delete touching that column) versus the risk of removing it (a query that will slow down or a constraint that will stop being enforced, if applicable) — a removal recommendation should be a clear net positive, not just "this looks unused."
6. Never recommend removing an index enforcing a uniqueness constraint or otherwise required for data integrity, even if it appears to have low read usage — usage stats measure read/scan activity, not the integrity role an index may also be playing.

Output format: Markdown table: Index | Verdict (redundant / candidate for removal / needs usage-stat verification / keep) | Reasoning. End with a note on any index where {{USAGE_STATS}} would materially change the verdict if provided.
```

## Variables
- `{{SCHEMA_AND_INDEXES}}` — the table schema(s) and every current index, including composite indexes and their column order. Required.
- `{{QUERY_PATTERNS}}` — the actual queries/access patterns run against these tables, as completely as available. Required.
- `{{USAGE_STATS}}` — real index usage statistics from the database, if available. Recommended — significantly increases confidence over reasoning from query patterns alone.

## Example
**Input:** `{{SCHEMA_AND_INDEXES}}` = "orders table: index on (customer_id), index on (customer_id, created_at), unique index on (order_number)" `{{QUERY_PATTERNS}}` = "Queries filter orders by customer_id alone (recent order count), and by customer_id + date range (order history page)." `{{USAGE_STATS}}` = "Not available"

**Output (excerpt):**
```
| Index | Verdict | Reasoning |
|---|---|---|
| (customer_id) | Candidate for removal, needs usage-stat verification | This is a strict prefix of (customer_id, created_at) — the composite index can serve a customer_id-only query as well, making the single-column index likely redundant. Without usage stats, this is a strong candidate, not a confirmed removal — worth checking pg_stat_user_indexes (or equivalent) before dropping. |
| (customer_id, created_at) | Keep | Directly serves the described order-history-by-date-range query pattern. |
| (order_number) unique | Keep | Enforces uniqueness constraint — never a removal candidate regardless of read usage. |

Note: if usage stats were available and confirmed (customer_id) has near-zero scans independent of (customer_id, created_at), this would move from "candidate" to a confirmed removal recommendation.
```

## Tips & Variations
- Always verify against real usage statistics before actually dropping an index in production, even when this prompt's reasoning-only pass is confident — query patterns change, and an index that looks redundant from a snapshot of known queries may serve a query pattern not captured in {{QUERY_PATTERNS}}.
- For a very large schema, run this per table or per feature area rather than the whole database at once — makes findings easier to prioritize and reduces the chance of missing a real usage pattern buried in a huge combined input.
- Pair with `sql-query-optimizer` (coding, already shipped) when a specific query is slow — that prompt helps decide whether a *new* index would help; this one audits whether *existing* indexes are worth their cost.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

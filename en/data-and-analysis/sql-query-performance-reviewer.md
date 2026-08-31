---
id: sql-query-performance-reviewer
title: SQL Query Performance Reviewer (Analyst-Facing)
category: data-and-analysis
tags: [sql, data-analysis]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Reviews an analytical/reporting SQL query for the specific slowness patterns common in ad hoc analyst queries — unnecessary joins before aggregation, missing filter pushdown, and expensive window functions over huge partitions — distinct from `sql-query-optimizer` (coding, already shipped), which optimizes a production application query with schema/index changes in scope; this prompt is for an analyst iterating in a query editor without index-changing privileges, focused on rewriting the query itself.

## When to use it
- An analytical query in a BI tool or notebook is taking minutes to run and you want to know which part is slow before waiting through another run to test a guess.
- You're writing a new report query against a large table and want a sanity check before running it, since a bad join order or an unfiltered scan can be expensive at analytical data volumes.
- You inherited a slow dashboard query from a colleague and need to understand why it's slow well enough to explain the fix, not just paste a faster version.

## The Prompt

```
You review an analytical SQL query for performance issues an analyst can fix by rewriting the query — not by adding indexes or changing the schema, which are out of scope for this review.

Query: {{QUERY}}
Table sizes (approximate row counts for the tables involved): {{TABLE_SIZES}}
Database/engine (e.g. PostgreSQL, BigQuery, Snowflake, Redshift): {{ENGINE}}

Instructions:
1. Check filter placement: are `WHERE` conditions applied before expensive operations (joins, aggregations) where possible, or does the query join/aggregate the full unfiltered table and filter afterward? Filtering late means the engine does unnecessary work on rows that get discarded anyway.
2. Check join order and type: given {{TABLE_SIZES}}, is the query joining large tables together before filtering them down, or joining a huge table against another huge table when one side could be pre-aggregated or filtered first? Flag any join that looks like it multiplies row counts unnecessarily (a fan-out join) before a later aggregation collapses them back down.
3. Check for `SELECT *` or selecting far more columns than the query's actual output needs — on column-oriented engines (BigQuery, Snowflake, Redshift) in particular, this can multiply the data scanned even though it doesn't change row count.
4. Check window functions: are they partitioned appropriately, or computed over a partition so large it's effectively re-sorting/re-scanning most of the table? Flag any window function applied before a filter that could have reduced the partition size first.
5. Check for repeated subqueries or CTEs that recompute the same expensive aggregation multiple times instead of computing it once and reusing it (materializing it as a single CTE referenced multiple times, where {{ENGINE}} supports that efficiently).
6. If {{ENGINE}} is a columnar/cloud warehouse (BigQuery, Snowflake, Redshift), specifically check for patterns that scan more partitions/data than needed (e.g. missing a partition-key filter on a date column, if the table is partitioned by date) — flag this even if you can't see the table's actual partitioning, and ask whether one exists.

Output format: Markdown. For each finding: what's slow, why (in terms of {{TABLE_SIZES}} and query structure, not generic advice), and the rewritten query fragment. End with the full rewritten query if multiple findings combine into one coherent rewrite, or say "single targeted fix, see above" if only one change is needed.
```

## Variables
- `{{QUERY}}` — the analytical SQL query to review. Required.
- `{{TABLE_SIZES}}` — approximate row counts for the tables involved (exact figures not needed — "millions" vs. "a few thousand" is often enough to change the recommendation). Required — without it, join-order and filter-pushdown advice is guesswork.
- `{{ENGINE}}` — the specific database/warehouse engine. Required — the highest-impact fixes (partition pruning, columnar scan cost) are engine-specific.

## Example
**Input:** `{{QUERY}}` = "`SELECT * FROM events e JOIN users u ON e.user_id = u.id WHERE e.event_date = '2026-08-30' AND u.country = 'US'`" `{{TABLE_SIZES}}` = "events: ~2 billion rows total, ~5 million per day. users: ~10 million rows." `{{ENGINE}}` = "BigQuery, events table partitioned by event_date"

**Output (excerpt):**
```
### Finding: filter is present but SELECT * scans unnecessary columns
On BigQuery, `SELECT *` scans every column in both tables even though the query likely only needs a handful. Given `events` has ~2 billion rows, scanning all columns instead of the 4-5 actually needed multiplies bytes-scanned cost significantly.
Fix: replace `SELECT *` with the explicit columns actually used downstream.

### Finding: join happens before the country filter narrows `users`
`users` (10 million rows) is joined in full before `u.country = 'US'` is applied. Since the filter is in the same WHERE clause, most engines' optimizers will push this down automatically on BigQuery — but confirm via the query plan rather than assuming; if not pushed down automatically, pre-filter `users` in a CTE before the join.

Rewritten query:
`SELECT e.event_id, e.event_date, e.event_type, u.id, u.country FROM events e JOIN (SELECT id, country FROM users WHERE country = 'US') u ON e.user_id = u.id WHERE e.event_date = '2026-08-30'`

The `event_date` filter already benefits from partition pruning since the table is partitioned by that column — this is likely already scanning only one day's partition, not the full 2 billion rows.
```

## Tips & Variations
- Pair with `n-plus-one-detector` (coding, already shipped) only if this query is actually being called repeatedly from application code — for a one-off analytical query run in a BI tool, that's out of scope here.
- If {{ENGINE}}'s query plan/explain output is available, include it as additional context — this prompt's review from query text alone is a reasonable first pass, but an actual execution plan will show which step is genuinely the bottleneck rather than which step looks suspicious.
- For a query that's slow specifically because of an aggregation over the full history when only a recent window is actually needed for the report, make sure that requirement is stated in {{QUERY}} or context — this prompt won't invent a date filter you didn't ask for even if it would obviously help.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

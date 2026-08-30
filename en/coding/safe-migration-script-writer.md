---
id: safe-migration-script-writer
title: Safe Migration Script Writer
category: coding
tags: [databases, migrations, devops]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.1
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Writes a database migration script (up and down) with explicit attention to production safety — locking behavior, backfill strategy, reversibility — for a schema change that needs to ship without downtime. For writing the actual migration, distinct from designing the target schema (`schema-designer-from-requirements`) or assessing a diff's general risk (`pre-merge-risk-assessment`).

## When to use it
- Writing a migration for a table with meaningful production traffic/row count, where a naive migration could lock the table or cause downtime.
- Adding a NOT NULL column, a new constraint, or an index to an existing large table.
- Needing a migration that's genuinely reversible, not just one with an empty or destructive `down` method.

## The Prompt

```
You write a database migration script with production safety as the primary concern — not just correctness of the schema change itself.

Desired schema change: {{SCHEMA_CHANGE}}
Table size/traffic context (optional but important — e.g. "orders table, ~40M rows, read/written continuously"): {{TABLE_CONTEXT}}
Database engine and migration tool (optional, e.g. "PostgreSQL, using Rails migrations" or "MySQL, using Flyway"): {{ENGINE_AND_TOOL}}

Instructions:
1. Determine whether the desired change requires a table-level lock on this engine/version, and for how long relative to table size — if it does, break the change into multiple safer steps instead of one blocking statement (e.g., add a column as nullable first, backfill in batches, then add a NOT NULL constraint separately; add an index CONCURRENTLY rather than a blocking index build).
2. If a backfill is needed, write it as a batched operation (not a single UPDATE touching millions of rows at once), and note the batch size tradeoff (too small = slow migration, too large = long lock/lag).
3. Write a genuine `down`/rollback migration that actually reverses the change — if full reversal is impossible (e.g., a dropped column's data is gone), say so explicitly rather than writing a `down` method that silently does nothing or errors.
4. Flag any step that can't be run inside a transaction on this engine (e.g., some DDL in MySQL, or CONCURRENTLY operations in Postgres which can't run in a transaction block) and structure the migration accordingly.
5. Note the deployment ordering constraint if the migration and an application code change are coupled (e.g., "deploy this migration before the code that starts writing to the new column, or you'll get write errors during rollout") — this is a common source of migration incidents.
6. If {{TABLE_CONTEXT}} isn't provided, default to the safest multi-step approach rather than assuming the table is small, and say you're doing so.

Output: the migration script (up and down), followed by a short deployment-order note if relevant.
```

## Variables
- `{{SCHEMA_CHANGE}}` — the change to make (add column, add constraint, add index, rename, etc.). Required.
- `{{ENGINE_AND_TOOL}}` — database engine and migration framework, since locking behavior and syntax differ significantly. Required.
- `{{TABLE_CONTEXT}}` — table size and traffic pattern. Optional but strongly affects whether a naive single-step migration is safe.

## Example
**Input:** `{{SCHEMA_CHANGE}}` = "add a NOT NULL `status` column with default 'pending' to the orders table", `{{TABLE_CONTEXT}}` = "40M rows, continuously written", `{{ENGINE_AND_TOOL}}` = "PostgreSQL 16".

**Output (excerpt):**
```sql
-- Step 1: add column as nullable, no default (fast, metadata-only in PG 11+)
ALTER TABLE orders ADD COLUMN status text;

-- Step 2: backfill in batches (run outside a single transaction, e.g. via a script)
-- UPDATE orders SET status = 'pending' WHERE status IS NULL AND id BETWEEN :batch_start AND :batch_end;

-- Step 3: add NOT NULL constraint after backfill completes (validated separately to avoid a full table scan lock)
ALTER TABLE orders ADD CONSTRAINT orders_status_not_null CHECK (status IS NOT NULL) NOT VALID;
ALTER TABLE orders VALIDATE CONSTRAINT orders_status_not_null;
```
*(followed by: "Deployment order: ship this migration's Step 1-3 fully before deploying application code that assumes `status` is always present, to avoid the app reading NULLs mid-backfill.")*

## Tips & Variations
- For a migration tool with a built-in "safe migrations" linter (e.g., strong_migrations for Rails), ask it to also note which of its steps that linter would flag, so the output is pre-vetted.
- Pair with `pre-merge-risk-assessment` for the broader deployment-risk framing once the migration script itself is written.

## Changelog
- 1.0.1 (2026-08-30): Normalized tag from `database` to canonical `databases` (see `docs/tags.md`).
- 1.0.0 (2026-08-29): Initial version.

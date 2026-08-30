---
id: migration-lock-risk-auditor
title: Migration Lock & Downtime Risk Auditor
category: coding
tags: [database, migrations, downtime, safety]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Audits an already-written database migration script for locking and downtime risk before it runs against production. Distinct from writing a new migration from scratch — this reviews one that already exists, statement by statement, against the actual locking behavior of the target database engine.

## When to use it
- Reviewing a migration PR before it merges, especially against a large or high-traffic table.
- A migration ran surprisingly slowly or caused an incident, and you want to understand why in hindsight.
- Establishing which migrations on a team need a maintenance window vs. which are safe to run online.

## The Prompt

```
You are auditing a database migration script for locking and downtime risk before it runs in production. Assume the migration is logically correct; your job is what happens to a live, running database while it executes.

Migration script:
{{MIGRATION_SCRIPT}}

Database engine and version: {{DB_ENGINE}}

Table context (optional — approximate row count, read/write traffic pattern): {{TABLE_CONTEXT}}

For each statement in the script:
1. State what kind of lock it takes on this specific engine/version (e.g., ACCESS EXCLUSIVE, metadata-only lock, no lock with online DDL support) — ground this in actual documented locking behavior for {{DB_ENGINE}}, not generic SQL assumptions.
2. State whether it rewrites the whole table or is a fast metadata-only change.
3. Rate the risk (LOW / MEDIUM / HIGH) with reasoning that references the table context if given (e.g., a full-table rewrite is LOW risk on an empty table and HIGH risk on one with 50M rows under constant write load).

Where risk is MEDIUM or HIGH, propose a safer rewrite — e.g., splitting an "add NOT NULL column" into add-nullable → backfill in batches → add constraint, or using the engine's online/concurrent DDL feature if one exists.

Finish with an overall verdict (safe to run anytime / needs a maintenance window / needs to be rewritten before running) and, if a rewrite was proposed, the full safer script.

If the script contains no schema-altering statements (pure data manipulation), assess row-lock and write-lock contention risk instead of table-level locking.
```

## Variables
- `{{MIGRATION_SCRIPT}}` — the migration script (SQL, or an ORM migration file) to audit. Required.
- `{{DB_ENGINE}}` — the database engine and version (e.g., "PostgreSQL 15", "MySQL 8.0"). Required — locking behavior differs meaningfully by engine.
- `{{TABLE_CONTEXT}}` — approximate row count and traffic pattern of the affected table(s). Optional, but sharpens the risk rating significantly.

## Example
**Input:** `{{MIGRATION_SCRIPT}}` = `ALTER TABLE orders ADD COLUMN priority INT NOT NULL DEFAULT 0;`, `{{DB_ENGINE}}` = "PostgreSQL 11", `{{TABLE_CONTEXT}}` = "orders table, ~50M rows, constant read/write traffic".

**Output (excerpt):**
```
Statement: ALTER TABLE orders ADD COLUMN priority INT NOT NULL DEFAULT 0
- Lock: ACCESS EXCLUSIVE for the duration of the rewrite. On PostgreSQL <11, adding a NOT NULL column with a non-null default forces a full table rewrite while holding this lock.
- Table rewrite: yes, on PG 11 this specific case (constant default) is optimized to avoid a rewrite — but the ACCESS EXCLUSIVE lock is still taken briefly to update the catalog, which can queue behind long-running transactions on a busy table.
- Risk: MEDIUM — brief lock, but on a table with constant traffic it can still cause a lock-wait pileup if it queues behind an existing long transaction.

Recommendation: run during a low-traffic window, or explicitly cap lock_timeout and retry, so a queued lock doesn't stall the whole traffic queue.

Overall verdict: needs a maintenance window or a lock_timeout guard, not a rewrite.
```

## Tips & Variations
- For engines with strong online-DDL tooling (e.g., MySQL with `pt-online-schema-change` or native `ALGORITHM=INSTANT`), ask it to explicitly check whether that tooling changes the verdict.
- Feed it the output of `EXPLAIN` or the engine's own migration-timing logs as extra `{{TABLE_CONTEXT}}` if a migration already ran and you're doing a postmortem instead of a pre-merge review.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

---
id: backup-restore-drill-planner
title: Database Backup & Restore Drill Planner
category: coding
tags: [databases, disaster-recovery, operations]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Plans a concrete restore-drill exercise to validate that database backups actually work end-to-end — not just that a backup job runs and reports success, which is a much weaker guarantee. Distinct from `migration-lock-risk-auditor` and `safe-migration-script-writer`, which concern schema changes, not backup/restore validation.

## When to use it
- Backups have been running for a while but have never actually been restored and tested.
- Establishing a regular disaster-recovery drill cadence.
- After a near-miss where a restore was needed and the process turned out to be unclear or slow.

## The Prompt

```
You are planning a restore drill to validate that database backups actually work — not just that the backup job completes successfully, which only proves the backup process ran, not that the resulting backup is usable.

Backup setup (backup method, frequency, retention period, and where backups are stored): {{BACKUP_SETUP}}

RTO/RPO targets (optional — recovery time objective and recovery point objective, if formally defined): {{RTO_RPO_TARGETS}}

Design a drill that:
1. Actually restores a backup to a genuinely separate environment — not the production database, and not merely simulating the restore — since a restore that's never actually been executed carries real unknown risk regardless of how confident the backup job's success logs look.
2. Verifies the restore with real checks beyond "the restore command exited 0": row counts on key tables matching expectations, a specific known record's presence and correct value, and application-level smoke tests run against the restored database (can the app actually start and serve a request against this restored data).
3. Measures and records how long the actual restore took, compared against any stated RTO — a backup strategy is only as good as its actual restore time, which is frequently untested and can be surprisingly long for large databases.
4. Identifies what is explicitly NOT covered by the drill as designed — for example, restoring only the latest backup doesn't validate that an older point-in-time restore works the same way, if point-in-time recovery within a stated RPO window is actually a requirement.

Output: a drill procedure (steps, in order), the specific validation checks to run against the restored database, the actual-restore-time measurement to record, and a recommended drill cadence given how often the underlying schema and data patterns change enough to warrant re-testing (a drill done once a year on a system with frequent schema migrations may not reflect current reality).

If no RTO/RPO targets are defined, don't invent them — recommend the drill happen anyway to establish a real, measured baseline (how long does a restore actually take, right now, with the current data volume), which can then inform setting realistic targets afterward rather than picking numbers first and hoping the system can meet them.
```

## Variables
- `{{BACKUP_SETUP}}` — backup method, frequency, retention, and storage location. Required.
- `{{RTO_RPO_TARGETS}}` — formally defined recovery objectives, if any exist. Optional; without them, the drill still proceeds and produces a baseline measurement instead of a pass/fail against a target.

## Example
**Input:** `{{BACKUP_SETUP}}` = "automated nightly full PostgreSQL dumps, retained 30 days, stored in S3", `{{RTO_RPO_TARGETS}}` = "none formally defined".

**Output (excerpt):**
```
Drill procedure: (1) provision a genuinely separate PostgreSQL instance (not production, not staging if staging shares any infrastructure dependency with prod that could mask a real restore issue), (2) download the most recent nightly dump from S3, (3) run the actual restore command against the fresh instance, timing it from start to finish, (4) run validation checks (below) against the restored instance, (5) tear down the drill instance once validated.

Validation checks: row count on the `users` and `orders` tables compared against a recorded count from right before the backup was taken (a restore that silently drops or truncates data due to a dump/restore version mismatch would still often "succeed" without this check); presence and correct value of a specific known test record seeded for this purpose; run the application's own health-check/smoke-test suite pointed at the restored database to confirm the app can actually start and serve a basic request against it, not just that the SQL restore itself succeeded.

RTO baseline: since no RTO is formally defined, record the actual wall-clock restore time from this drill as the real baseline (e.g., "full restore took 47 minutes for the current data volume") — this number should directly inform any RTO target set afterward, rather than picking an aspirational number first and discovering during a real incident that it's not achievable.

Not covered by this drill: this only validates restoring the MOST RECENT nightly backup. If a future incident requires restoring an OLDER backup (e.g., to recover from data corruption introduced 3 days ago, requiring a restore from before that point), that hasn't been separately validated here — if that's a realistic recovery scenario, a second drill variant restoring an older backup from the 30-day retention window is worth doing at least once to confirm older backups are equally restorable, not just the newest one.
```

## Tips & Variations
- If the database uses point-in-time recovery (PITR) via WAL/binlog replay rather than periodic full dumps, adapt the drill to specifically test restoring to an arbitrary point in time, not just the latest available state — PITR's whole value proposition is the arbitrary-point capability, so that's specifically what needs validating, not just "can we restore at all."
- Schedule the drill cadence based on how often the schema changes, not on a fixed calendar interval alone — a system that just went through several migrations is a better candidate for a fresh drill than the calendar alone would suggest.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

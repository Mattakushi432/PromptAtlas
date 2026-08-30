---
id: batch-job-retry-auditor
title: Batch Job Idempotency & Retry Auditor
category: coding
tags: [devops, batch-jobs, idempotency, reliability]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Audits a scheduled or batch job for safe-to-rerun and safe-to-overlap behavior before it runs unattended in production. Distinct from `migration-lock-risk-auditor` (schema changes) and `ci-pipeline-debugger` (an already-failing pipeline): this is about jobs that run repeatedly on a schedule, reviewed before an incident forces the question.

## When to use it
- Reviewing a new cron job or background job before it ships.
- An on-call engineer needs to know whether it's safe to manually rerun a job that failed partway through.
- A job occasionally seems to double-process records, and you're not sure if it's an overlap or a rerun problem.

## The Prompt

```
You are auditing a scheduled/batch job for idempotency and safe-rerun behavior — assume the job's core business logic is correct; your job is what happens when it runs twice, overlaps with itself, or fails partway through.

Job code: {{JOB_CODE}}

Schedule context (how often it runs, and what's known about what happens if two runs overlap): {{SCHEDULE_CONTEXT}}

Check:
1. Idempotency on rerun — if the exact same run happens twice against the same data (e.g., manually rerun after a false-alarm failure), does it double-process records (double-charge, double-send an email, duplicate a database write), or does it correctly no-op on already-processed items?
2. Overlap protection — if the schedule allows two instances to run concurrently (a long run overlapping the next scheduled trigger), is there a lock, flag, or other mechanism preventing both from processing the same records simultaneously? If none exists, say so as a finding even if overlaps haven't happened yet.
3. Partial-failure state — if the job fails midway through a batch, does it leave processed/unprocessed records in a clearly distinguishable state (a status column, a checkpoint) so a rerun or investigation can tell what already happened? Or does a mid-batch crash leave ambiguous state that makes safe recovery guesswork?
4. Safe manual rerun — could an on-call engineer manually trigger a rerun of this job without side effects like duplicate emails, duplicate charges, or duplicate external API calls? Answer this directly as a yes/no with the specific reason.

For each gap, propose a concrete fix (e.g., a processed-items table with a unique constraint, an advisory lock keyed on the job name, a checkpoint column) rather than a general "add idempotency" note.

End with an explicit "safe to rerun: yes/no/conditionally" verdict a runbook could reference directly.
```

## Variables
- `{{JOB_CODE}}` — the scheduled/batch job's code. Required.
- `{{SCHEDULE_CONTEXT}}` — how often it runs and any known facts about overlap behavior. Required — this determines how seriously to weight the overlap-protection check.

## Example
**Input:** `{{JOB_CODE}}` = a nightly job that queries all "pending" invoices and sends a reminder email for each, marking them "reminded" only after the whole batch completes, `{{SCHEDULE_CONTEXT}}` = "runs nightly at 2am, typically completes in 5 minutes, no known overlap history".

**Output (excerpt):**
```
Finding: partial-failure state is unsafe. Records are only marked "reminded" after the ENTIRE batch completes — if the job crashes after sending 200 of 500 emails, none are marked reminded, and a rerun (manual or the next scheduled run) will resend all 500, including the 200 already-reminded invoices. Severity: HIGH — this is a customer-facing duplicate-email bug waiting to happen on any partial failure.
Fix: mark each invoice "reminded" immediately after its individual email send succeeds, not after the whole batch — this makes a rerun naturally idempotent, since already-reminded invoices won't be re-queried as "pending reminder needed."

Finding: no overlap lock exists. At a 5-minute typical runtime against a 24-hour schedule, overlap risk is currently low, but there's no guard if the job ever slows down (e.g., invoice volume grows). Severity: LOW given current runtime, but flag as a cheap preventive fix (e.g., a simple advisory lock).

Safe to rerun: NO, not until the per-record marking fix above is made — a manual rerun today would re-send reminder emails to everyone already reminded in a partial prior run.
```

## Tips & Variations
- If the job writes to an external system with its own idempotency support (e.g., an email provider that dedupes by a message ID you control), ask it to check whether that's actually being used rather than assuming your own job logic is the only safety net.
- For a job with no natural "processed" marker (e.g., a pure computation with no per-record state), ask it to propose adding a lightweight checkpoint mechanism specifically for this case rather than forcing the same pattern used for record-based jobs.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

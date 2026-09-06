---
id: long-running-agent-checkpoint-resume-designer
title: Long-Running Agent Checkpoint/Resume Designer
category: agents-and-automation
tags: [ai-agents, planning, reliability]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Designs how a long-running agent task persists its progress — what state to snapshot, at what granularity, and after which steps — so an interruption (crash, timeout, deliberate pause) can be followed by a resume that picks up from the last safe point instead of restarting the whole task or, worse, silently re-doing an already-completed side-effecting step.

## When to use it
- You're building an agent task that takes minutes to hours (a multi-document research pass, a bulk data-migration agent, a long tool-use chain) and need it to survive a process restart without losing all progress.
- An existing long-running agent has no resume logic and a recent crash forced a full restart, including re-doing steps that had already completed (and, worse, redoing ones with side effects) — you want a proper checkpoint design instead of a quick patch.
- You're deciding how granular checkpoints should be (after every tool call vs. after every major phase) and want the trade-offs made explicit before implementing either extreme.

## The Prompt

```
You design a checkpoint/resume scheme for a long-running agent task.

The task, described as its major phases and, within each phase, the individual steps (especially noting which steps have side effects like writing to a database, sending a message, or charging money): {{TASK_DESCRIPTION}}
Expected total task duration and how it's expected to fail (e.g. "process restarts on deploy," "runs on a serverless function with a 15-minute timeout," "network calls to a flaky third-party API"): {{FAILURE_MODE}}
What storage is available for checkpoint state (a database, a file, a durable queue, or "none yet, recommend one"): {{AVAILABLE_STORAGE}}

Instructions:
1. Identify natural checkpoint boundaries within {{TASK_DESCRIPTION}} — points where the task's state can be fully described by a small, serializable snapshot (e.g. "phase 2 complete, processed items 1-340 of 1,000, next item is 341") rather than needing the full in-memory reasoning trace. Prefer boundaries after side-effecting steps complete, not mid-step.
2. For each side-effecting step, specify explicitly: does resuming after this step re-execute it (safe only if the step is idempotent) or does the checkpoint need to record that it already ran (so resume skips straight past it)? Flag any step where neither is currently true — an unsafe gap that needs either an idempotency fix or an explicit "already ran" marker before this design is safe.
3. Define what the checkpoint snapshot actually contains: the minimum state needed to resume correctly (current phase, current item/index, any accumulated partial results, any external side-effect markers) — not the full conversation/reasoning history, which is usually unnecessary and expensive to persist.
4. Recommend a checkpoint frequency given {{FAILURE_MODE}}: a 15-minute serverless timeout needs checkpoints well inside that window with margin for the write itself; a flaky third-party API call suggests checkpointing around each external call rather than only at phase boundaries.
5. Using {{AVAILABLE_STORAGE}} (or recommending one if "none yet"), specify exactly what gets written and when — on every checkpoint, or only at coarser intervals with an accepted amount of re-work on resume (state this trade-off explicitly: e.g. "checkpointing every 50 items instead of every item accepts re-processing up to 49 items on resume, in exchange for 50x fewer writes").
6. Design the resume logic: given a stored checkpoint, what does the resumed run read first, how does it validate the checkpoint is still valid (e.g. the underlying data hasn't changed incompatibly since the checkpoint was written), and what happens if no checkpoint exists (first run) vs. a checkpoint exists but looks corrupted or stale.
7. Note any step where checkpointing itself could fail (a write to {{AVAILABLE_STORAGE}} timing out) and what the task should do in that case — proceeding without a successful checkpoint write silently reintroduces the original problem.

Output format: Markdown with sections: Checkpoint Boundaries, Side-Effect Safety Table (Step, Idempotent?, Resume Handling), Snapshot Contents, Checkpoint Frequency & Trade-off, Resume Logic, Checkpoint-Write Failure Handling.
```

## Variables
- `{{TASK_DESCRIPTION}}` — the task's phases and steps, with side-effecting steps flagged. Required.
- `{{FAILURE_MODE}}` — expected duration and how/why the task is likely to be interrupted. Required — this drives checkpoint frequency and urgency.
- `{{AVAILABLE_STORAGE}}` — what durable storage exists for checkpoint state, or a request to recommend one. Required.

## Example
**Input:** `{{TASK_DESCRIPTION}}` = "Agent processes a batch of 1,000 customer records: Phase 1 - fetch each record from a source API (read-only). Phase 2 - transform and validate each record. Phase 3 - write each validated record to the destination database (side effect) and send a completion webhook per record (side effect)." `{{FAILURE_MODE}}` = "Runs on a serverless function with a 15-minute timeout; large batches will span multiple invocations." `{{AVAILABLE_STORAGE}}` = "A Postgres database is available."

**Output (excerpt):**
```
### Checkpoint Boundaries
After each record completes Phase 3 (both the DB write and the webhook send) — not after Phase 1 or 2 alone, since those phases have no side effects to protect and re-doing them on resume is cheap and harmless.

### Side-Effect Safety Table
| Step | Idempotent? | Resume Handling |
|---|---|---|
| Phase 3 DB write | Yes, if using an upsert keyed on record ID | Safe to re-run on resume even if it's uncertain whether it completed before the interruption. |
| Phase 3 webhook send | No — sending it twice notifies the customer twice | Needs an explicit "webhook sent" marker per record, written to Postgres in the same transaction as the DB write, so resume can check this marker before resending. |

### Snapshot Contents
Per checkpoint: the ID of the last fully-completed record (DB write + webhook both confirmed), not the full record data itself — Phase 1/2 can re-fetch and re-transform cheaply on resume, so there's no need to persist intermediate transformed data.

### Checkpoint Frequency & Trade-off
Checkpoint after every single record, not batched — given the 15-minute timeout and unknown per-record processing time, batching checkpoints (e.g. every 20 records) risks losing confirmation of exactly which webhooks already fired if the function is killed mid-batch. The write cost of one Postgres update per record is cheap relative to the risk of a duplicate customer-facing webhook.

### Resume Logic
On start, query Postgres for the highest last-completed record ID; resume Phase 1 from the next record. If no checkpoint row exists, this is the first invocation — start from record 1. If the checkpoint row exists but the batch's source data has since changed (e.g. record count shrank below the checkpoint's index), flag this as a stale checkpoint requiring manual review rather than silently resuming into an inconsistent state.

### Checkpoint-Write Failure Handling
If the Postgres write confirming "webhook sent" fails after the webhook actually sent, the task must not proceed as if unconfirmed — treat this as ambiguous and require a manual reconciliation pass afterward rather than either blindly resending (risking a duplicate) or blindly skipping (risking a missed webhook that the customer never received).
```

## Tips & Variations
- Distinct from `retry-fallback-policy-designer` (agents-and-automation, already shipped), which designs per-tool-call retry/fallback logic for a single failed call — this prompt operates at the macro level of an entire long-running task's progress, deciding what survives a full process interruption, not how one call retries within a still-running process.
- The side-effect safety table (step 2) is the part most worth double-checking by hand — a step that looks idempotent (e.g. "upsert by ID") can quietly stop being so if a later code change switches to an auto-incrementing insert; re-verify this table whenever the underlying step's implementation changes, not just when the checkpoint design is first written.
- If {{AVAILABLE_STORAGE}} is "none yet," lean toward whatever storage the task's own side effects already write to (as in the example, reusing the destination Postgres database) rather than introducing a new storage system solely for checkpoints — one less moving part to keep consistent.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

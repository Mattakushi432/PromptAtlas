---
id: log-volume-cost-auditor
title: Log Volume & Cost Auditor
category: coding
tags: [devops, observability, cost-optimization]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Audits logging statements in code for excessive volume or cardinality that drives up observability platform costs. For an engineer facing a high logging bill or unmanageably noisy logs — distinct from `oncall-runbook-writer` and `incident-root-cause-analyzer`, which use logs during an incident rather than review the logging code itself.

## When to use it
- An observability/logging platform bill has grown unexpectedly and needs a root-cause pass.
- Logs are so noisy that finding real signal during an incident is genuinely hard.
- Reviewing new code's logging statements before merge, to catch a volume problem while it's cheap to fix.

## The Prompt

```
You are auditing logging statements in code for volume and cardinality that drives up observability cost — not reviewing log content for correctness or debugging value in general, specifically what's expensive to keep at its current logging level and destination.

Code with logging statements: {{CODE_WITH_LOGGING}}

Traffic context (optional — roughly how often the logged code path executes in production, e.g., "this endpoint serves ~10,000 requests/minute at peak"): {{TRAFFIC_CONTEXT}}

Flag:
1. Log statements inside hot paths — high-frequency loops, or per-request/per-item logging — set at a level (info/debug) that will accumulate to significant volume given the stated traffic. A single log line inside a loop that runs per item in a large collection, at production traffic, can dwarf every other log source combined.
2. High-cardinality fields logged as separately-indexed/structured fields (e.g., a raw user ID, session ID, or full request body logged as an indexed field on every request) — many observability platforms charge based on unique field-value combinations, and high-cardinality indexed fields inflate cost far more than raw log volume alone suggests.
3. For each flagged statement, recommend one specific fix: remove it entirely (genuinely not useful), downgrade to a lower level that's sampled or filtered before ingestion, sample it (log only 1 in N occurrences) rather than every one, or convert it to a metric (a counter/histogram) instead of a per-occurrence log line, since a metric captures the same signal at a fraction of the cost when the goal is "how often does X happen" rather than "show me every instance of X."

Distinguish log statements genuinely worth keeping at their current level (rare events, actual errors, anything needed for a specific debugging or audit purpose) from ones that are just verbose by habit — don't recommend a blanket "log less" without a specific reason per statement.

If a flagged high-volume statement turns out to be genuinely necessary for a compliance or audit requirement, note that constraint explicitly rather than recommending its removal, and suggest routing it to a separate, appropriately-priced destination (a cheaper log tier, cold storage) instead of the primary high-cost observability pipeline.
```

## Variables
- `{{CODE_WITH_LOGGING}}` — the code containing the logging statements to audit. Required.
- `{{TRAFFIC_CONTEXT}}` — how often the relevant code path runs in production. Optional, but sharpens which statements are actually worth flagging as high-volume versus merely present.

## Example
**Input:** `{{CODE_WITH_LOGGING}}` = a request handler that logs `logger.info("Processing request", { userId, requestBody })` on every call, `{{TRAFFIC_CONTEXT}}` = "this endpoint handles ~5,000 requests/minute at peak".

**Output (excerpt):**
```
Finding: `logger.info("Processing request", { userId, requestBody })` fires on every request at up to 5,000/minute — that's up to 7.2 million log lines/day from this single statement alone, each carrying a high-cardinality `userId` field as structured data and an unbounded `requestBody` payload.
Fix: this is a strong candidate for multiple changes at once — (a) drop `requestBody` from the log entirely unless there's a specific debugging need for full payload visibility (if there is, sample it — e.g., log full payload on 1 in 1000 requests, or only on requests that error), (b) if the goal is just "track request volume," replace this log line with a counter metric instead (`requests_total` incremented per call), which captures the volume signal at a tiny fraction of the cost of 7.2M structured log lines/day, (c) keep `userId` only in an error-path log (when something actually goes wrong), not on every successful request.

Severity: HIGH — this single statement, at the stated traffic, is plausibly the largest single contributor to log volume/cost in this service.
```

## Tips & Variations
- If the observability platform's specific pricing model is known (per-GB ingested, per-unique-series, per-log-line), mention it — the right fix (drop vs. sample vs. convert to metric) can depend on exactly what's being charged for.
- For a codebase-wide pass rather than one file, ask it to prioritize findings by estimated traffic × verbosity rather than reviewing files in isolation — a rarely-called endpoint's verbose logging matters far less than a hot endpoint's.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

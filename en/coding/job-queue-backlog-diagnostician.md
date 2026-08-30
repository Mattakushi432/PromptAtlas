---
id: job-queue-backlog-diagnostician
title: Background Job Queue Backlog Diagnostician
category: coding
tags: [backend, message-queues, debugging]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Diagnoses why a background job or message queue's backlog is growing — a genuine producer/consumer throughput mismatch, a poison message stuck retrying, or a stalled consumer. Distinct from `batch-job-retry-auditor` (idempotency/rerun safety of a single scheduled job) and `incident-root-cause-analyzer` (general incident investigation): this is specifically calibrated to the growing-backlog symptom in a queue-based system.

## When to use it
- A queue's depth/backlog metric is climbing steadily and it's unclear whether it's a capacity problem or a stuck-message problem.
- Deciding whether to scale consumers, or first fix a specific bad message before scaling.
- A queue backlog spiked suddenly and needs quick triage of which failure mode it actually is.

## The Prompt

```
You are diagnosing why a job/message queue's backlog is growing — distinguishing between a few structurally different causes that need different fixes, not just recommending "scale up" by default.

Queue metrics (backlog/depth trend over time, producer rate, consumer throughput/processing rate if known): {{QUEUE_METRICS}}

Consumer behavior (what's known about consumer error rates, retry behavior, and processing time per message): {{CONSUMER_BEHAVIOR}}

Distinguish between these hypotheses:
1. Genuine throughput mismatch — producer rate durably exceeds consumer processing capacity. Evidence: backlog grows steadily and proportionally to the rate gap, consumer error rate is normal/low, consumers are actively processing (not idle).
2. Poison message — one or a few specific messages repeatedly fail and retry, consuming consumer capacity without ever completing. Evidence: an elevated retry-count or error-rate concentrated on specific messages rather than a uniform slowdown across all traffic; overall consumer capacity may look fine in aggregate while still not draining the backlog.
3. Stalled or crashed consumer — throughput has dropped to near-zero rather than merely being insufficient. Evidence: consumer processing rate metric near zero, not just lower than producer rate; likely paired with a consumer health-check or process-status signal if available.

For each hypothesis, state the specific evidence in `{{QUEUE_METRICS}}`/`{{CONSUMER_BEHAVIOR}}` that would confirm or rule it out, and the corresponding fix: scale consumer count/capacity for a genuine throughput mismatch, add a dead-letter queue and move poison messages out of the main retry path (so they stop consuming capacity from healthy messages) for a poison-message problem, or restart/investigate the specific stalled consumer for the third case.

Rank the hypotheses by fit to the evidence actually given, rather than listing all three with equal weight.

If no per-message visibility exists — only an aggregate queue-depth number — say so explicitly and recommend adding at minimum message-age and per-message retry-count visibility before this diagnosis can be made with real confidence next time, rather than guessing blind now between throughput and poison-message causes that look identical at the aggregate level.
```

## Variables
- `{{QUEUE_METRICS}}` — backlog trend, producer rate, and consumer throughput if known. Required.
- `{{CONSUMER_BEHAVIOR}}` — what's known about consumer error rates, retries, and processing time. Required — this is what separates a poison-message diagnosis from a throughput one.

## Example
**Input:** `{{QUEUE_METRICS}}` = "backlog has grown steadily from 200 to 15,000 messages over 6 hours, producer rate ~50 msg/min, consumer throughput reported at ~48 msg/min", `{{CONSUMER_BEHAVIOR}}` = "error rate is 2% overall, no obvious concentration on specific message types, consumers show active CPU usage the whole time".

**Output (excerpt):**
```
Top hypothesis: genuine throughput mismatch. Producer rate (~50/min) very slightly exceeds consumer throughput (~48/min) — a gap of only ~2 msg/min, but sustained over 6 hours that's enough to explain the observed growth (roughly 2/min × 360min ≈ 720, which undershoots the actual 14,800 backlog growth — this gap doesn't fully explain the magnitude, which is worth flagging as a discrepancy rather than accepting the throughput-mismatch explanation at face value).

Given the magnitude doesn't fully match a pure throughput-gap explanation, also check: is the reported "~48 msg/min" consumer throughput an average that includes a period of much lower actual throughput (e.g., a temporary near-stall that's since recovered, masked by averaging over the full 6-hour window)? Request throughput broken into smaller time buckets rather than a single 6-hour average before fully ruling out hypothesis 3 (a temporary stall).

Poison-message hypothesis: LESS LIKELY as the dominant cause given a 2% error rate with no concentration mentioned — a poison-message problem usually shows a spike in retries/errors on specific message IDs, which isn't described here. Still worth a quick check (look for any message with an unusually high retry count) before ruling it out entirely, since "no obvious concentration" from a quick look isn't the same as confirmed absence.

Recommended next step: get time-bucketed throughput data before deciding between scaling consumers (if it's genuinely a sustained rate gap) versus investigating a specific stall window (if the averaged number is hiding a real dip) — the current data is consistent with either, and scaling consumers alone won't help if the real cause was a temporary stall that's already resolved.
```

## Tips & Variations
- If the queue system supports dead-letter queues natively (SQS DLQ, RabbitMQ DLX, etc.) and one isn't configured, flag that as a standing gap regardless of the current diagnosis — it's cheap insurance against future poison-message incidents becoming backlog incidents.
- For a queue with highly variable message processing cost (some messages take 10ms, others take 10s), ask it to consider whether a small number of unusually expensive messages could explain an apparent throughput mismatch without any of them technically being "poison" (failing) — just slow.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

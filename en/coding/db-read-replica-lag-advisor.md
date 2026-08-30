---
id: db-read-replica-lag-advisor
title: Database Read Replica Lag Advisor
category: coding
tags: [database, backend, scalability]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Advises where stale-read risk from read-replica lag is acceptable versus where a specific operation needs read-your-writes routing to the primary. For an engineer deciding how to route reads across primary/replica databases — distinct from `db-connection-pool-sizing-advisor` (connection count, not read routing) and `caching-strategy-advisor` (cache staleness, not replica staleness).

## When to use it
- Introducing read replicas to scale read traffic and deciding which queries are safe to route there.
- A bug report turned out to be a user not seeing their own just-written data — a classic replica-lag symptom.
- Designing a read-routing layer between application code and primary/replica databases.

## The Prompt

```
You are advising on read-routing between a primary database and read replicas, specifically judging which reads are safe against replica lag and which are not.

Read operations (list of read operations/queries and the context they occur in — e.g., "user profile page load right after a profile edit", "public product listing page"): {{READ_OPERATIONS}}

Replication lag profile (typical and worst-case lag, e.g., "usually under 100ms, occasionally spikes to 2-3s under load"): {{REPLICATION_LAG_PROFILE}}

For each read operation, classify it as:
1. Safe-for-replica — a stale read here has no meaningful consequence (e.g., a public listing showing a view count that's a few hundred milliseconds old).
2. Needs-primary — the read follows a write by the same user/session in a way where staleness would be visibly wrong (e.g., showing the pre-edit value immediately after that same user's own edit).
3. Needs-a-read-your-writes-strategy — a hybrid case: route to the primary briefly after a relevant write (e.g., a session-sticky window immediately following a write, or checking a version/timestamp on the replica before trusting its data), then fall back to the replica once safe.

Ground each classification in actual user-experience impact, not a mechanical "is this read adjacent to a write" rule — a read that's technically write-adjacent but where staleness is imperceptible or harmless (e.g., a "last updated" timestamp nobody is watching in real time) can still be safe-for-replica.

For the hybrid cases, recommend a specific read-your-writes strategy and state its tradeoffs (a fixed sticky-window duration is simple but either too short to be safe or too long to get replica benefits; a version-check approach is more precise but adds complexity).

Given the stated replication lag profile, flag explicitly if any recommended threshold-based strategy (e.g., "wait 200ms then read replica") would be unsafe under the worst-case lag spike, not just the typical case — a strategy that only accounts for typical lag isn't actually safe.
```

## Variables
- `{{READ_OPERATIONS}}` — the read operations to classify, with enough context to judge user-experience impact of staleness. Required.
- `{{REPLICATION_LAG_PROFILE}}` — typical and worst-case replication lag. Required — the safety of any threshold-based strategy depends entirely on the worst case, not the average.

## Example
**Input:** `{{READ_OPERATIONS}}` = "(1) user's own order history page, loaded right after placing an order; (2) public 'trending products' listing", `{{REPLICATION_LAG_PROFILE}}` = "usually under 150ms, spikes to 4s under peak load".

**Output (excerpt):**
```
(1) User's own order history right after placing an order: NEEDS-PRIMARY or needs-a-read-your-writes-strategy. This is the canonical stale-read failure mode — the user just performed the write and will notice immediately if their new order isn't there. Given the lag profile spikes to 4 seconds under peak load, a fixed short sticky-window (e.g., "read primary for 500ms after a write") would NOT be safe during peak load spikes; either route this specific page to primary unconditionally for a longer window (e.g., 5s, covering the worst case) or use a version-check strategy against the replica instead of a fixed timer.

(2) Public 'trending products' listing: SAFE-FOR-REPLICA. No individual user's write is being reflected here; a few-hundred-ms-to-few-second staleness on a trending list is imperceptible and inconsequential — route unconditionally to replica, no special handling needed.
```

## Tips & Variations
- If the application already has a natural place to track "this session just wrote to table X" (e.g., existing session state), prefer a session-sticky read-your-writes strategy over a global timer — it only forces primary reads for the specific user who actually needs it, not all traffic.
- For a system where replica lag is consistently very low and stable (not spiky), a shorter fixed sticky-window becomes a reasonable simplification — tell it explicitly if lag is stable rather than spiky, since the recommended strategy should differ.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

---
id: flaky-test-investigator
title: Flaky Test Investigator
category: coding
tags: [testing, debugging, ci]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Generates ranked hypotheses for why a specific test fails intermittently rather than consistently — timing, shared state, ordering, external dependencies — for an engineer who's tired of re-running CI and wants a real investigation plan.

## When to use it
- A test fails ~1 in 20 runs with no code change, and re-running "fixes" it.
- A test only fails when run in a specific order or in parallel with other tests, never in isolation.
- Deciding whether to quarantine a flaky test or actually fix it, and needing to know which is more likely true.

## The Prompt

```
You are investigating a flaky (intermittently failing) test. The goal is a ranked list of hypotheses and how to test each one — not a guaranteed diagnosis from static analysis alone, since flakiness by nature needs runtime evidence.

Test code: {{TEST_CODE}}
Code under test (optional): {{CODE_UNDER_TEST}}
Failure pattern (e.g., "fails ~5% of runs", "only fails in CI, never locally", "only fails when run after test X"): {{FAILURE_PATTERN}}
Failure output/stack trace from a failing run (if available): {{FAILURE_OUTPUT}}

Consider these flakiness categories and rule in/out each based on the evidence given:
1. Race conditions / async timing — assertions running before async work completes, missing awaits, arbitrary sleep()s masking real waits.
2. Shared mutable state — global variables, singletons, or a shared database/fixture leaking state between tests, especially if failure correlates with test order.
3. Test isolation failures — setup/teardown not fully resetting state (files, mocks, time, random seeds) between runs.
4. External dependencies — network calls, real clock (`Date.now()`, `time.time()`), randomness, or filesystem behavior not mocked/frozen, so results vary run to run.
5. Resource contention — CPU/memory pressure in CI causing timing-sensitive assertions (timeouts, ordering) to fail only under load.
6. Non-deterministic ordering — the test itself or the code under test relies on iteration order (e.g., of a hash map/set) that isn't guaranteed.

For each hypothesis you rate as plausible, explain the specific evidence pointing to it, and give a concrete way to confirm it (e.g., "add a log of the actual vs. expected timestamp," "run the test 100x in isolation vs. 100x in the full suite and compare failure rates," "run with a fixed random seed").

Rank hypotheses by how well they fit the stated failure pattern — "only fails in CI" points strongly toward resource contention or environment differences, "only fails after test X" points strongly toward shared state, etc. Don't present all hypotheses as equally likely if the pattern clearly favors one.

If there isn't enough information to rule anything in or out, say what specific data (failure logs across N runs, a way to reproduce locally) would let you narrow it down.
```

## Variables
- `{{TEST_CODE}}` — the flaky test's source. Required.
- `{{FAILURE_PATTERN}}` — how the flakiness manifests (frequency, conditions under which it happens/doesn't). Required — this is the strongest signal for ranking.
- `{{CODE_UNDER_TEST}}` — the function/module being tested. Optional but often necessary to spot race conditions.
- `{{FAILURE_OUTPUT}}` — the actual error/assertion failure from a real failing run. Optional but very high-value.

## Example
**Input:** `{{FAILURE_PATTERN}}` = "fails only when run after `test_creates_user`, never in isolation", `{{TEST_CODE}}` = a test that queries `SELECT COUNT(*) FROM users` and asserts it equals 1.

**Output (excerpt):**
```
### 2. Shared mutable state — HIGH confidence
The failure pattern (only after `test_creates_user`) is close to a textbook signature of shared state: `test_creates_user` likely inserts a row into `users` that isn't cleaned up, so this test's `COUNT(*) = 1` assertion fails because the count is actually 2.
Confirm: check whether both tests share a database/transaction without a rollback between them, and check `test_creates_user`'s teardown.
```

## Tips & Variations
- If you have CI logs from several failing runs, paste multiple `{{FAILURE_OUTPUT}}` samples — a pattern across failures (same assertion vs. different ones each time) is diagnostic on its own.
- For a "quarantine or fix" decision, explicitly ask it to also estimate fix effort per hypothesis so you can weigh cost against the test's value.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

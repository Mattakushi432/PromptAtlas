---
id: concurrency-bug-hunter
title: Concurrency Bug Hunter
category: coding
tags: [debugging, concurrency, race-conditions, multithreading]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Hypothesizes the source of a concurrency bug — race condition, deadlock, or data race — from suspect code plus a symptom description. Distinct from memory-leak hunting (allocation growth over time) and flaky-test investigation (test-specific intermittency): this targets concurrent-access bugs directly in application logic, regardless of whether they surface in a test or in production.

## When to use it
- A bug reproduces intermittently and involves multiple threads, goroutines, async tasks, or actors touching shared state.
- Diagnosing a hang or deadlock that doesn't happen every time.
- Reviewing concurrent code before it ships, to hunt for races proactively rather than after an incident.

## The Prompt

```
You are hunting for a concurrency bug's source — race condition, deadlock, or data race — from code and a symptom description. Reason about interleavings explicitly; don't just describe what the code does when run single-threaded.

Suspect code: {{CODE}}

Symptom (what goes wrong, how often it reproduces, and whether it's a hang, crash, or wrong result): {{SYMPTOM}}

Concurrency model in use (threads, goroutines, async/await, actors, etc.): {{CONCURRENCY_MODEL}}

Analyze:
1. Shared mutable state accessed without apparent synchronization — name the specific variables/fields and which code paths touch them concurrently.
2. Possible lock-ordering issues that could deadlock — two or more locks acquired in inconsistent order across different code paths.
3. TOCTOU (time-of-check-to-time-of-use) gaps — a check and a subsequent action on the same state that isn't atomic together.

Rank your hypotheses by how well each matches the reported symptom — a hang/no-progress symptom points toward deadlock or livelock; an intermittent wrong-value or corrupted-state symptom points toward a data race; a "works fine under light load, fails under heavy load" symptom points toward a race that needs tight timing to trigger.

For the top-ranked hypothesis, propose:
- A minimal reproduction approach (a specific stress test, forced interleaving, or tool like a race detector) to confirm it before trusting the hypothesis.
- A concrete fix (the specific synchronization primitive or restructuring needed), not just "add a lock somewhere."

If the code shows no shared mutable state accessed concurrently, say so and suggest the bug likely lives elsewhere (an external system, a genuine logic bug unrelated to concurrency) rather than forcing a concurrency explanation onto it.
```

## Variables
- `{{CODE}}` — the suspect concurrent code path. Required.
- `{{SYMPTOM}}` — what goes wrong, how often, and its type (hang, crash, wrong result). Required — this is what drives hypothesis ranking.
- `{{CONCURRENCY_MODEL}}` — the concurrency primitives in play (OS threads, goroutines, async/await, actor model). Required — the failure modes and fixes differ meaningfully by model.

## Example
**Input:** `{{CODE}}` = a Go service with a shared `map[string]int` cache accessed from multiple goroutines without a mutex, `{{SYMPTOM}}` = "occasional panic: 'concurrent map read and map write', roughly once a day under production load", `{{CONCURRENCY_MODEL}}` = "goroutines".

**Output (excerpt):**
```
Shared mutable state: the `cache` map is read in `Get()` and written in `Set()`, both called from request-handling goroutines with no mutex or sync.Map in between — this is a textbook Go data race, and the panic message confirms it directly (Go's runtime detects concurrent map access and panics rather than silently corrupting).

Ranking: this hypothesis matches the symptom exactly — the panic message names the exact failure mode, so no further hypothesis-ranking is needed here; this is confirmed, not just likely.

Repro: run the existing code under `go test -race` with concurrent `Get`/`Set` calls in a loop — it should trigger reliably within seconds rather than the ~daily production rate, since the race detector doesn't need the same unlucky timing production traffic does.

Fix: wrap the map with a `sync.RWMutex` (RLock for Get, Lock for Set) or replace it with `sync.Map` if the access pattern is read-heavy — given single-key writes here, `sync.RWMutex` is likely the better fit since it also protects compound read-then-write sequences the map alone can't.
```

## Tips & Variations
- If a race detector or thread sanitizer is available for the language (Go's `-race`, TSan for C/C++/Rust), always suggest confirming the hypothesis with it before treating the fix as done — reasoning from code alone is a hypothesis, not a proof.
- For deadlock symptoms specifically, ask it to draw out the lock-acquisition order as an explicit sequence per code path — deadlocks are usually easiest to spot once orderings are laid out side by side rather than read as prose.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

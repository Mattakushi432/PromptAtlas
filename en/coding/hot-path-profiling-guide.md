---
id: hot-path-profiling-guide
title: Hot Path Profiling Guide
category: coding
tags: [performance, profiling, debugging]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Generates a step-by-step profiling plan for a specific slow endpoint or code path — what to instrument, in what order, and what each result would tell you — for before profiling data exists. Distinct from `load-test-result-interpreter` (interprets results after the fact): this is the methodology for producing that data in the first place.

## When to use it
- An endpoint is known to be slow but hasn't been profiled yet, and you need a systematic plan rather than randomly adding timing logs.
- Onboarding a developer who's new to profiling and needs a concrete methodology to follow for a real slow endpoint, not abstract profiling theory.
- Deciding which profiling tool/technique is actually appropriate for a specific suspected bottleneck type before spending time on the wrong one.

## The Prompt

```
You generate a step-by-step profiling plan for a specific slow endpoint/code path — a methodology to follow, producing the data needed to diagnose the actual bottleneck, not a diagnosis itself (since no profiling data exists yet).

Slow endpoint/operation description (what it does, roughly how slow, any existing clues): {{SLOW_OPERATION}}
Stack/language: {{STACK}}
What's already been tried or ruled out, if anything: {{ALREADY_TRIED}}

Instructions:
1. Start with the coarsest-grained measurement first: total wall-clock time broken into its major phases (e.g., request parsing, DB query time, business logic, serialization, network) — before profiling any individual phase in detail, establish which phase actually dominates the total time, since profiling the wrong phase wastes effort.
2. Based on the described symptoms, hypothesize the 1-2 most likely dominant phases (e.g., "if this endpoint does a heavy DB join, database time is the first suspect") and recommend measuring those first, rather than a blanket "profile everything."
3. For whichever phase turns out to dominate, recommend the specific profiling technique/tool appropriate to it: a CPU profiler (flame graph) for compute-bound code, a DB query profiler/EXPLAIN for query time, a distributed trace (if the system is multi-service) for cross-service latency, an I/O/network trace for external call time.
4. Sequence the plan so each step's result determines whether the next step is needed — this is a decision tree, not a flat checklist: "if DB time dominates, go to step 3a (query profiling); if application code time dominates, go to step 3b (CPU profiling)."
5. For each profiling step, state what specific signal in the result would confirm or rule out that phase as the bottleneck — not just "run a profiler," but what pattern in its output to look for.
6. Flag any measurement technique that could distort the result (e.g., a debug-build profiler adding overhead that changes relative timings, a profiler running in an environment that doesn't match production load characteristics) so the plan accounts for measurement validity.
7. If {{ALREADY_TRIED}} rules out some hypotheses, skip those steps in the plan rather than including them for completeness.

Output format: Markdown as a numbered, branching plan — each step names the tool/technique, what to look for in the result, and which next step to take based on the outcome.
```

## Variables
- `{{SLOW_OPERATION}}` — the slow endpoint/operation and available context. Required.
- `{{STACK}}` — the language/framework/infrastructure, since profiling tools are stack-specific. Required.
- `{{ALREADY_TRIED}}` — what's already been measured or ruled out. Optional but avoids redundant steps.

## Example
**Input:** `{{SLOW_OPERATION}}` = "a report-generation endpoint takes 3-5 seconds, no idea which part", `{{STACK}}` = "Python / Django / PostgreSQL".

**Output (excerpt):**
```
## Step 1: Coarse phase breakdown
Add timing around the three major phases: (a) fetching data from the DB, (b) computing the report in Python, (c) serializing/rendering the response. Use `time.perf_counter()` around each phase, or Django's `django-silk`/`django-debug-toolbar` for a quick built-in breakdown without manual instrumentation.
→ Look for: which phase accounts for the majority of the 3-5s. Proceed to 2a if DB time dominates, 2b if Python computation dominates, 2c if serialization dominates.

## Step 2a: DB time dominates → query profiling
Enable Django's query log or use `django-debug-toolbar`'s SQL panel to see every query issued and its individual timing. Look specifically for: an N+1 pattern (many small queries instead of one), or one specific query taking a disproportionate share of DB time.
→ If N+1 found: this is a `select_related`/`prefetch_related` fix, not a deep profiling problem — stop here.
→ If one slow query found: proceed to `EXPLAIN ANALYZE` on that specific query for index/plan-level diagnosis.

## Step 2b: Python computation dominates → CPU profiling
Use `cProfile` (or `py-spy` for lower-overhead sampling in a closer-to-production run) to get a flame graph of where CPU time is spent inside the computation phase.
→ Look for: a single function consuming a disproportionate share of samples — that's your optimization target.
```

## Tips & Variations
- For a suspected memory-related slowdown (not raw CPU time) alongside latency, note that separately — this prompt's phase breakdown is time-focused; pair with `memory-leak-hunter` if allocation/GC pressure is also suspected.
- Once the plan produces actual profiling data, feed the results into a fresh analysis (or `load-test-result-interpreter` if it's aggregate load data) rather than trying to interpret the numbers within this same planning-focused prompt.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

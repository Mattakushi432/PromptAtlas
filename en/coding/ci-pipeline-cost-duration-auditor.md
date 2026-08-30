---
id: ci-pipeline-cost-duration-auditor
title: CI Pipeline Cost & Duration Auditor
category: coding
tags: [devops, ci-cd, cost-optimization]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Audits a CI pipeline configuration for redundant, slow, or poorly-cached steps that drive up build-minutes cost and developer wait time. Distinct from `ci-pipeline-debugger`, which diagnoses why a pipeline is failing — this is for a pipeline that works correctly but is expensive or slow.

## When to use it
- CI minutes cost has grown noticeably, or the PR feedback loop has gotten slower over time without an obvious single cause.
- Reviewing a new pipeline configuration before it becomes the team's default, to catch waste early.
- Periodic pipeline-hygiene review, separate from any specific failure investigation.

## The Prompt

```
You are auditing a CI pipeline configuration for cost and duration waste — the pipeline works and passes; your job is what's making it slower or more expensive than it needs to be.

Pipeline configuration: {{PIPELINE_CONFIG}}

Duration breakdown (optional — per-step timing, if available): {{DURATION_BREAKDOWN}}

Check for:
1. Missing or ineffective caching — dependency installs, build artifacts, or Docker layer caching that redo identical work on every run instead of being cached and reused when inputs haven't changed.
2. Redundant work across parallel jobs — multiple jobs each independently repeating the same setup (e.g., installing the same dependencies separately in 5 parallel test-shard jobs) instead of sharing a cached setup step or a pre-built artifact.
3. Steps that run unconditionally but could be conditional or skipped — e.g., running a full test suite or a heavy build step on a change that only touched documentation, when path-based conditional execution could skip it safely.
4. Runner sizing mismatches — an unnecessarily large/expensive runner type used for a lightweight step, or the reverse (an undersized runner making a heavy step artificially slow).

For each finding, give the specific fix and a rough estimated time/cost impact (order-of-magnitude, not false precision) so findings can be prioritized by actual payoff rather than reviewed in file order.

If the pipeline is already well-optimized, say so plainly rather than manufacturing marginal findings to seem thorough, and note what to monitor going forward (e.g., cache hit rate, per-step duration trend) to catch future regression before it becomes a real cost problem again.
```

## Variables
- `{{PIPELINE_CONFIG}}` — the CI pipeline configuration file(s). Required.
- `{{DURATION_BREAKDOWN}}` — per-step timing data, if available. Optional, but sharpens which findings are actually worth prioritizing versus theoretically wasteful but practically tiny.

## Example
**Input:** `{{PIPELINE_CONFIG}}` = a GitHub Actions workflow with 5 parallel test-shard jobs, each running `npm install` independently with no cache configured, `{{DURATION_BREAKDOWN}}` = "each shard takes ~90s for install, ~3min for tests".

**Output (excerpt):**
```
Finding: no dependency caching configured, and each of 5 parallel shards independently runs `npm install` (~90s each). Total wasted time: ~7.5 minutes of runner time per pipeline run spent on identical, repeated installs (5 × 90s), none of which needed to happen more than once.
Fix: add dependency caching keyed on the lockfile hash (e.g., `actions/cache` keyed on `package-lock.json`'s hash) so a cache hit skips the install almost entirely on unchanged dependencies — this alone should cut each shard's ~90s install down to a few seconds on a cache hit.

Estimated impact: roughly 85-90% reduction in the ~7.5 minutes of aggregate install time per run (cache misses only on lockfile changes), translating directly to both lower billed minutes and faster PR feedback since shards run in parallel and the slowest one gates the whole pipeline's completion.

Severity: HIGH — this is very likely the single largest waste source in this configuration given how mechanically repeated the work is across shards.
```

## Tips & Variations
- If `{{DURATION_BREAKDOWN}}` isn't available, ask it to first recommend adding basic per-step timing/reporting before further optimization — auditing blind risks fixing a step that felt slow but wasn't actually the bottleneck.
- For a monorepo specifically, pair this with `monorepo-build-graph-bottleneck-finder` — that prompt covers package-dependency-graph structure driving unnecessary rebuilds, which is a different root cause from pipeline-configuration waste covered here.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

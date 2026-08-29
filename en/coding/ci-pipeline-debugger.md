---
id: ci-pipeline-debugger
title: CI Pipeline Debugger
category: coding
tags: [devops, ci-cd, debugging]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Diagnoses a failing CI pipeline from its log output — distinguishing a real code/test failure from an environment, caching, or flakiness issue — and gives a specific fix. For a real failing pipeline, distinct from the general `works-on-my-machine-diagnostic` (which covers any cross-environment bug, not specifically CI).

## When to use it
- A CI run failed and the log output is long/noisy, making it hard to find the actual failure among setup/teardown noise.
- A pipeline step fails intermittently and you need to distinguish "this is a real bug" from "this is CI flakiness" before spending time debugging code that isn't broken.
- A pipeline that worked yesterday fails today with no code change, and you need to find what changed in the environment (a dependency version, a runner image update, a cache).

## The Prompt

```
You diagnose a failing CI pipeline from its log output — distinguishing real code/test issues from CI-environment-specific causes, not assuming it's automatically a code bug.

CI log output (the relevant failing section, plus surrounding context if available): {{CI_LOG}}
CI platform/config (optional, e.g. GitHub Actions workflow YAML, CircleCI config): {{CI_CONFIG}}
What changed recently, if known (a code diff, a dependency bump, no known change): {{RECENT_CHANGES}}

Instructions:
1. Isolate the actual failure from surrounding log noise — quote the specific error, not the whole log, and identify which pipeline step it occurred in.
2. Classify the failure type: a genuine test/code failure (the code is actually wrong), a CI-environment difference (different OS/dependency version/locale/timezone than local dev), a caching issue (stale cache serving outdated dependencies or build artifacts), a flakiness pattern (timing-dependent test, external service dependency, resource contention on a shared runner), or a CI configuration issue (a misconfigured step, a missing secret/env var, an incorrect working directory).
3. If {{CI_CONFIG}} is provided, check it for common misconfigurations relevant to the failure: missing or incorrect caching keys, steps running in the wrong order/directory, environment variables not properly passed to the failing step, or a matrix/parallelism configuration causing resource contention.
4. If {{RECENT_CHANGES}} shows no code change but the pipeline started failing, focus specifically on what could have changed in the CI environment itself: a dependency's transitive update (no lockfile, or a lockfile not being honored), a CI platform's base image update, an external service the CI depends on changing behavior.
5. Distinguish "flaky, needs quarantining or a stability fix" from "consistently broken, needs a real fix" based on the evidence given (a single failure vs. a described pattern of intermittent failures) — don't recommend quarantining a test that's actually reliably catching a real bug.
6. Give the specific fix: a code change, a CI config change, a cache-clearing step, or a dependency pin — not "check your CI configuration" as a vague directive.

Output format: Markdown with sections: Isolated Failure, Classification, Root Cause, Fix.
```

## Variables
- `{{CI_LOG}}` — the relevant CI log output. Required.
- `{{CI_CONFIG}}` — the pipeline configuration file. Optional but often necessary to diagnose environment/config-caused failures.
- `{{RECENT_CHANGES}}` — what changed (or didn't) before the pipeline started failing. Optional but very high-value for distinguishing code bugs from environment drift.

## Example
**Input:** `{{CI_LOG}}` = a `npm ci` step failing with a lockfile integrity mismatch error, `{{RECENT_CHANGES}}` = "no code change, worked yesterday".

**Output (excerpt):**
```
## Isolated Failure
`npm ci` fails with "Invalid: lock file's X does not satisfy Y" during the dependency install step.

## Classification
CI-environment/dependency issue, not a code bug — `npm ci` is failing at install time, before any test code runs.

## Root Cause
This error pattern typically means `package-lock.json` is out of sync with `package.json` (someone edited `package.json` directly without regenerating the lockfile, or the lockfile wasn't committed after a local `npm install`), OR — since you report no code change and it worked yesterday — a transitive dependency's registry metadata changed in a way that broke the previously-cached resolution.

## Fix
Run `npm install` locally to regenerate `package-lock.json`, verify the diff looks reasonable (no unexpected major version jumps), commit it, and re-run CI. If it recurs without any local change, check whether the CI cache key includes a hash of the lockfile — a stale cache serving an old lockfile against a new registry state is the likely secondary cause.
```

## Tips & Variations
- For a flaky test specifically (not a pipeline config issue), hand off to `flaky-test-investigator` for a deeper per-test investigation once this prompt has confirmed the failure is flakiness rather than a real bug.
- Paste multiple failing runs' logs together if the failure is intermittent — a pattern across runs (same step failing vs. different ones) is diagnostic on its own.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

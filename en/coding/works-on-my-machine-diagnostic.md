---
id: works-on-my-machine-diagnostic
title: "\"Works on My Machine\" Diagnostic"
category: coding
tags: [debugging, environment, troubleshooting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Runs a systematic checklist to find why code behaves differently across environments (your machine, a teammate's, CI, staging, production) instead of debugging the code's logic. For the specific, recurring pain of "it works here but not there."

## When to use it
- A bug reproduces on one machine/environment but not another, and the code itself looks correct.
- CI fails but the same test passes locally, or vice versa.
- Onboarding a new environment (new laptop, new container base image) and something subtly breaks.

## The Prompt

```
You are diagnosing an environment-specific bug — the code's logic is not the suspect; the difference between environments is. Work through this checklist systematically rather than guessing at the code.

Bug description: {{BUG_DESCRIPTION}}
Environment where it works: {{WORKING_ENV}}
Environment where it fails: {{FAILING_ENV}}
Relevant config/output (env vars, dependency lock files, Dockerfile, CI config — whatever's available): {{ENV_DETAILS}}

Checklist — for each category, state whether it's a plausible cause given the details provided, and if so, what to check to confirm:
1. Runtime/language version drift — interpreter, compiler, or SDK version mismatch.
2. Dependency version drift — lock file present but not honored, or no lock file at all; transitive dependency differences.
3. Environment variables/configuration — a variable set in one environment, missing or different in the other.
4. Filesystem/path assumptions — case sensitivity, path separators, working directory assumptions, absolute vs. relative paths.
5. Timezone/locale differences — date parsing, number formatting, sorting behavior that depends on system locale.
6. Data/state differences — a database, cache, or seed data that differs between environments and changes code behavior.
7. Network/permissions differences — firewall, DNS, service account permissions, or connectivity that differs (e.g., CI has no internet access to an external API).
8. Concurrency/resource differences — CPU core count, available memory, or timing differences exposing a race condition only under certain load.

For each category marked plausible, give the specific command or check to run to confirm it (e.g., "run `node --version` in both environments and diff the output").

If the details given rule out most categories confidently, say so and focus the output on the 1-2 remaining plausible causes rather than listing all 8 with equal weight.
```

## Variables
- `{{BUG_DESCRIPTION}}` — what goes wrong and how it's observed. Required.
- `{{WORKING_ENV}}` — description of the environment where it works (OS, versions, how it's run). Required.
- `{{FAILING_ENV}}` — same, for the environment where it fails. Required.
- `{{ENV_DETAILS}}` — any concrete config, version output, or files available from either environment. Optional but very high-value.

## Example
**Input:** `{{BUG_DESCRIPTION}}` = "date filter returns wrong results", `{{WORKING_ENV}}` = "my laptop, macOS, local dev server", `{{FAILING_ENV}}` = "CI container", `{{ENV_DETAILS}}` = "CI Dockerfile sets no TZ; local machine is set to America/New_York".

**Output (excerpt):**
```
### 5. Timezone/locale differences — PLAUSIBLE, likely cause
The CI container has no `TZ` set, which typically defaults to UTC, while your local machine runs America/New_York. A date filter comparing `new Date()` boundaries would shift by several hours between the two, especially near midnight.
Check: run `date` in the CI container and compare to local; if they differ, this is very likely the cause. Fix by setting `TZ` explicitly in the Dockerfile/CI config, or making the date logic timezone-explicit rather than relying on system default.
```

## Tips & Variations
- Paste the actual `diff` of two environments' dependency lock files or `env` output directly into `{{ENV_DETAILS}}` for much sharper results than a description.
- For container-to-container drift (e.g., staging vs. prod), ask it to also consider base image differences and multi-stage build caching.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

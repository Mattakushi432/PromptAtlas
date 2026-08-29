---
id: test-coverage-gap-finder
title: Test Coverage Gap Finder
category: coding
tags: [testing, coverage, code-review]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Compares a function/module against its existing tests to find untested branches, edge cases, and error paths — a gap report, not a full replacement test suite. For a developer who already has tests and wants to know what's still exposed.

## When to use it
- Before merging a PR, to check whether new tests actually cover the new logic's branches, not just execute the happy path.
- Auditing an existing module's test suite before relying on it as a refactoring safety net.
- Prioritizing where to spend limited testing time by finding the highest-risk untested paths first.

## The Prompt

```
You are comparing code against its existing tests to find coverage gaps — not writing a full new test suite, and not just reporting a numeric coverage percentage.

Code:
{{CODE}}

Existing tests:
{{EXISTING_TESTS}}

Instructions:
1. Enumerate every distinct logical branch in the code: each `if`/`else`, each loop's zero/one/many-iteration cases, each early return, each catch/error path, each default parameter/fallback value being used.
2. For each branch, determine whether the existing tests actually exercise it — not just whether the function is called somewhere, but whether a test input specifically drives execution down that branch and asserts on its outcome.
3. Report only the branches that are NOT covered, each with: what input would exercise it, and what the test should assert.
4. Separately flag any branch that IS "covered" by a test that calls it but doesn't meaningfully assert on the result (e.g., calls the function and only checks it didn't throw) — this is a coverage gap in practice even if a coverage tool would mark the line as hit.
5. Prioritize the gaps: mark which ones are highest-risk to leave untested (e.g., an error-handling path for a payment failure) versus lower-risk (a rarely-hit formatting branch).
6. If the existing tests already cover everything meaningfully, say so plainly rather than inventing minor gaps to report.

Output format: Markdown, one entry per gap, ordered by risk (highest first). Each entry: the branch/condition, why it's not covered, a concrete input that would exercise it, and what to assert.
```

## Variables
- `{{CODE}}` — the function/module to check. Required.
- `{{EXISTING_TESTS}}` — the current test file(s) for that code. Required.

## Example
**Input:** `{{CODE}}` = a `parseConfig(raw)` function with a fallback to defaults when a field is missing, `{{EXISTING_TESTS}}` = tests that only cover the case where all fields are present.

**Output (excerpt):**
```
### Gap: missing-field fallback path — HIGH risk
`parseConfig` falls back to a default value when `raw.timeout` is undefined, but no test exercises this path.
Input to exercise it: `parseConfig({ ...validConfig, timeout: undefined })`.
Assert: the returned config's `timeout` equals the documented default, not `undefined`.
```

## Tips & Variations
- Paste an actual coverage tool's line/branch report alongside `{{EXISTING_TESTS}}` for a hybrid check — line coverage tells you what ran, this prompt tells you what was meaningfully verified.
- For a merge-gate check, ask it to end with a single PASS/FAIL line based on whether any HIGH-risk gap remains.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

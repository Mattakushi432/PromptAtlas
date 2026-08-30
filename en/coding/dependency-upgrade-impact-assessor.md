---
id: dependency-upgrade-impact-assessor
title: Dependency Upgrade Impact Assessor
category: coding
tags: [dependencies, migration, planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Assesses the breaking-change impact of a major dependency version bump against how the dependency is actually used in a codebase, and produces an upgrade plan. For routine major-version upgrades — distinct from `dependency-cve-triage`, which triages the security risk of a specific known vulnerability, not a planned version bump.

## When to use it
- Planning a major-version upgrade of a core framework or library.
- Deciding whether an upgrade is safe to do in one PR or needs to be staged through intermediate versions.
- Scoping how much manual testing an upgrade actually needs, versus what tooling will catch automatically.

## The Prompt

```
You are assessing the impact of upgrading a dependency across a major version boundary, grounded in how it's actually used in this codebase — not a generic "here's what changed" summary.

Dependency: {{DEPENDENCY_NAME}}
Current version: {{CURRENT_VERSION}}
Target version: {{TARGET_VERSION}}
Usage context (how the dependency is actually used in the codebase — key APIs called, patterns relied on): {{USAGE_CONTEXT}}

If you have reliable knowledge of this specific upgrade's breaking changes, use it. If you're not confident about the exact breaking changes for this specific version range, say so explicitly and ask for the changelog/migration guide to be pasted in, rather than inventing plausible-sounding breaking changes for a library version you don't actually know with confidence.

Given the breaking changes (known or provided):
1. Cross-reference each breaking change against {{USAGE_CONTEXT}} — flag which ones actually apply to how this codebase uses the dependency, and explicitly note which documented breaking changes do NOT apply here because this codebase doesn't use that API/pattern.
2. Propose an upgrade sequencing — whether to jump directly to {{TARGET_VERSION}} or stage through intermediate versions (relevant when a dependency's own migration guides recommend incremental upgrades for large version jumps).
3. Classify what needs manual testing versus what a type-checker, linter, or the test suite will likely catch automatically — this shapes how much manual verification time to budget.

Output: an "applies to this codebase" breaking-changes list (with the ones that don't apply explicitly excluded, not silently omitted — state that they were checked and ruled out), then a sequencing recommendation, then a testing scope estimate.
```

## Variables
- `{{DEPENDENCY_NAME}}` — the dependency being upgraded. Required.
- `{{CURRENT_VERSION}}` / `{{TARGET_VERSION}}` — the version range for the upgrade. Required.
- `{{USAGE_CONTEXT}}` — how the dependency is actually used in the codebase (key APIs, patterns, configuration). Required — this is what turns a generic changelog into a codebase-specific impact assessment.

## Example
**Input:** `{{DEPENDENCY_NAME}}` = "React", `{{CURRENT_VERSION}}` = "17", `{{TARGET_VERSION}}` = "18", `{{USAGE_CONTEXT}}` = "uses ReactDOM.render at the app root, no use of React.Suspense or lazy-loaded components, no third-party class-component libraries with known incompatibilities, uses React Testing Library for tests".

**Output (excerpt):**
```
Applies to this codebase:
- `ReactDOM.render` is deprecated in favor of `createRoot` — this codebase uses it at the app root, so this change is required, not optional busywork. Fix is mechanical (swap the root API) but changes rendering behavior (automatic batching applies more broadly), which is the part worth manual testing.
- Automatic batching changes: state updates in promises/timeouts/native event handlers now batch by default, where they didn't in React 17. Given no explicit reliance on synchronous re-render-after-state-update timing was mentioned, this is a "test for it, don't assume it's fine" item rather than a known-safe change.

Ruled out (checked, does not apply here): React 18's Suspense re-suspension behavior change (a boundary that suspends again after already resolving now fully unmounts and remounts its subtree instead of just hiding it) — usage context states Suspense/lazy-loaded components aren't used, so this specific behavior change has nothing to affect here.

Sequencing: direct upgrade to 18 is reasonable here — React's own upgrade path doesn't require staging through an intermediate version for a 17→18 jump, unlike some frameworks with larger jumps.

Testing scope: type-checker/linter will catch the `ReactDOM.render` API removal automatically (it won't compile). Automatic batching behavior changes will NOT be caught by types — this needs manual/exploratory testing specifically around any code that reads state immediately after triggering an update inside a timeout or promise callback.
```

## Tips & Variations
- Paste the dependency's actual migration guide or changelog directly into the prompt alongside `{{USAGE_CONTEXT}}` for any upgrade where breaking-change accuracy really matters — this removes any reliance on the model's own knowledge being current or complete.
- For a monorepo with many internal consumers of the dependency, run this once per consumer's `{{USAGE_CONTEXT}}` rather than one pass for the whole repo — different parts of a large codebase are often affected by entirely different subsets of the breaking changes.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

---
id: monorepo-build-graph-bottleneck-finder
title: Monorepo Build Graph Bottleneck Finder
category: coding
tags: [devops, monorepo, build-tooling]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Identifies which package's position in a monorepo's build/test dependency graph is slowing down CI for the whole repository — a structural analysis of the package graph itself. Distinct from `ci-pipeline-cost-duration-auditor`'s focus on the CI pipeline configuration (steps, caching, runner choice): this looks at the underlying package dependency structure that the pipeline is built on top of.

## When to use it
- CI takes a long time on a monorepo and it's unclear whether the problem is pipeline configuration or the package structure itself.
- Deciding whether to restructure a package's dependencies to reduce rebuild/retest cascades.
- A small, frequent change to one package seems to trigger a disproportionately large amount of CI work.

## The Prompt

```
You are analyzing a monorepo's package dependency graph to find structural bottlenecks — not the CI pipeline configuration itself (caching, steps, runners), the underlying graph of which packages depend on which.

Package graph description (the packages and their dependency relationships, or a build-tool-generated dependency graph if available): {{PACKAGE_GRAPH_DESCRIPTION}}

Build tool in use (Nx, Turborepo, Bazel, Lerna, etc. — affects how graph-aware caching and affected-package detection actually work): {{BUILD_TOOL}}

1. Identify packages with unusually broad fan-out — packages that many other packages depend on — where a small, frequent change to that package triggers a disproportionately large rebuild/retest cascade across the whole dependent set.
2. For each broad-fan-out package found, distinguish a genuinely necessary broad dependency (a core, deliberately shared utility that legitimately needs to be depended on widely) from one that exists mostly by accident (e.g., a small utility function that's become a de facto dependency of nearly everything because it sits in an otherwise large, loosely-organized shared package — where isolating just the used piece into its own minimal package would shrink the effective dependency graph for everyone who only needs that one function).
3. Check whether the build tool's affected-package detection is actually configured and working correctly — rebuilding and retesting the entire monorepo on every change, when using a build tool specifically designed to detect and build only what's affected, is a common misconfiguration that looks like a graph problem but is actually a tooling-configuration problem, and needs to be ruled out before recommending any package restructuring.

Output: ranked bottleneck packages by estimated CI-time impact, for each one whether the recommended fix is graph restructuring (splitting an overly-broad package into more granular pieces) or tooling configuration (fixing affected-detection so unaffected packages stop being rebuilt), and a rough estimated impact per fix.

If the build tool in use has no real graph-awareness at all (e.g., a flat script that always builds and tests everything regardless of what changed), say plainly that this is the actual root cause before any package-level graph restructuring is considered — restructuring the package graph provides no benefit without tooling that can actually exploit that structure to skip unaffected work.
```

## Variables
- `{{PACKAGE_GRAPH_DESCRIPTION}}` — the packages and their dependency relationships. Required.
- `{{BUILD_TOOL}}` — the build/monorepo tool in use. Required — graph-aware caching and affected-detection behavior (and how to check whether it's working correctly) differ significantly by tool.

## Example
**Input:** `{{PACKAGE_GRAPH_DESCRIPTION}}` = "a `shared-utils` package containing ~40 unrelated utility functions is depended on by all 25 other packages in the monorepo; changing any single function in `shared-utils` currently triggers a full rebuild/retest of all 25 dependents", `{{BUILD_TOOL}}` = "Nx, with `nx affected` configured in CI".

**Output (excerpt):**
```
Bottleneck: `shared-utils` has fan-out of 25 (all other packages depend on it), and it's a single coarse-grained package bundling ~40 unrelated functions. Any change anywhere in `shared-utils` — even to one function used by only 2 of the 25 dependents — currently rebuilds/retests all 25, because Nx's dependency graph is at package granularity, not function granularity; it correctly sees "shared-utils changed" and correctly rebuilds everyone who depends on the package, even though most of them don't actually use the specific function that changed.

Classification: this is a genuinely-broad dependency that exists partly by accident — the package itself being a single unit is the accident, not the fact that utilities are shared. The fix is graph restructuring: split `shared-utils` into several smaller, purpose-grouped packages (e.g., `date-utils`, `string-utils`, `validation-utils`) so a change to one function's package only triggers rebuilds for the subset of the 25 packages that actually depend on that specific smaller package, not all 25 every time.

Tooling check: confirm `nx affected` is actually configured to use package-level (not repo-wide) change detection correctly in CI — since it's already configured per the input, the bottleneck here is genuinely graph structure, not a tooling misconfiguration; if it hadn't been configured, that would be the higher-priority fix to make before any restructuring, since restructuring alone wouldn't help a pipeline that rebuilds everything regardless of the graph.

Estimated impact: splitting `shared-utils` as described would likely reduce the average dependent-count triggered per change from 25 to roughly 3-8 (depending on how evenly the 40 functions' actual usage is distributed across the 25 packages) — worth confirming with real usage data before committing to a specific split boundary, rather than splitting arbitrarily.
```

## Tips & Variations
- Before recommending a package split, ask it to check whether the build tool can show real per-change affected-package counts from CI history — actual historical data on "how many packages typically get rebuilt per PR" is stronger evidence than a structural analysis alone for prioritizing which bottleneck to fix first.
- For a monorepo where package granularity is already fine-grained but CI is still slow, the bottleneck is more likely pipeline configuration (caching, parallelism) than graph structure — pair with `ci-pipeline-cost-duration-auditor` in that case instead.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

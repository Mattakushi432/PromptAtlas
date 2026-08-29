---
id: dead-code-finder
title: Dead Code Finder
category: coding
tags: [refactoring, dead-code, maintenance]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Identifies code paths and dependencies that are likely unused, based on evidence in the given context — reachability, exports never imported, feature flags stuck permanently on/off — with an honest confidence level per finding. For cleaning up a codebase, distinct from a general code-smell pass: this is specifically about "can this be deleted."

## When to use it
- Suspecting a module, function, or dependency is no longer used and wanting a second opinion before deleting it.
- Cleaning up after a feature was fully rolled out (or fully rolled back) and its flag/branch logic is now permanently one-sided.
- Onboarding onto a codebase and wanting to know what's safe to ignore versus what's load-bearing.

## The Prompt

```
You are looking for likely-dead code — code that appears unreachable, unused, or permanently short-circuited — based only on the evidence given. State your confidence level honestly; static analysis from a code excerpt can't prove something is truly dead the way a real usage-tracing tool can.

Code/module to analyze: {{CODE}}
Additional context (optional — e.g. other files that might reference this, known feature flag states, package.json/imports elsewhere in the repo): {{ADDITIONAL_CONTEXT}}

Look for:
1. Unreachable code — code after an unconditional return/throw/break, or inside a condition that's always false given visible constants.
2. Unused exports/functions — defined but, based on the given context, never imported or called anywhere visible.
3. Permanently one-sided feature flags/conditionals — a flag check where all visible evidence suggests it's always true or always false now (e.g., a flag named `enableLegacyFlow` that every caller sets to `false`).
4. Unused dependencies — imports that are present but whose exported members are never referenced in the visible code.
5. Commented-out code blocks — flag these separately as a documentation/cleanup issue, not the same as truly dead executable code.

For each finding, state your CONFIDENCE (HIGH: strong, direct evidence in what was given; MEDIUM: suggestive but you can't rule out an unseen caller; LOW: speculative) — do not present MEDIUM/LOW findings with the same certainty as HIGH ones.

For MEDIUM/LOW confidence findings, say exactly what additional check would raise or lower your confidence (e.g., "grep the full repo for `oldPricingLogic` to confirm no remaining callers").

Never claim something is dead code just because you personally don't see its use — distinguish "not used in what I can see" from "definitely unused."

Output format: Markdown, grouped by finding type, each with confidence level and the check that would confirm it.
```

## Variables
- `{{CODE}}` — the code/module to analyze. Required.
- `{{ADDITIONAL_CONTEXT}}` — other repo context that affects confidence (other files, flag configs, package manifests). Optional but significantly improves accuracy.

## Example
**Input:** `{{CODE}}` = a module exporting `formatLegacyDate()`, `{{ADDITIONAL_CONTEXT}}` = "grep across the repo shows no remaining imports of formatLegacyDate".

**Output (excerpt):**
```
### Unused export — `formatLegacyDate` — HIGH confidence
No import of `formatLegacyDate` appears anywhere in the provided repo-wide grep results, and it's not part of this module's declared public API surface (no `index.ts` re-export found).
Confirming check already done: repo-wide grep for the identifier. Recommend deletion after a final check of any dynamic/string-based imports (e.g., `require(variableName)`), which grep can't catch.
```

## Tips & Variations
- Pair with an actual static analysis tool's output (ts-prune, knip, vulture, deadcode) as `{{ADDITIONAL_CONTEXT}}` — this prompt is strongest at explaining/confirming tool output and catching things simple reachability tools miss (like permanently one-sided flags), not replacing the tool entirely.
- For a large deletion PR, ask it to also flag any finding that's exported from a package's public API (vs. purely internal) as higher-risk to remove, since external consumers might exist outside the visible codebase.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

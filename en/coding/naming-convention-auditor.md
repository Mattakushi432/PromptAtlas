---
id: naming-convention-auditor
title: Naming Convention Auditor
category: coding
tags: [refactoring, naming, readability]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Flags unclear, misleading, or inconsistent identifier names in a file and proposes specific better names — a narrow pass on naming only, not general code smells or structure. For a fast, focused readability improvement.

## When to use it
- A file's logic is fine but the names (`data`, `temp`, `flag2`, `handleThing`) make it hard to follow.
- Reviewing a PR where inconsistent naming (mixing `userId`/`user_id`/`uid` for the same concept) is creating confusion.
- Preparing a file for a new contributor and wanting its names to carry more of the explanation themselves.

## The Prompt

```
You audit identifier names only — variables, functions, classes, parameters — not logic, structure, or other code smells. Stay narrowly focused on naming.

Code:
{{CODE}}

Naming convention to follow (optional, e.g. "camelCase, booleans prefixed with is/has"): {{NAMING_CONVENTION}}

Instructions:
1. Flag names that don't reveal intent: generic names (`data`, `temp`, `obj`, `flag`, `handleThing`) that could mean many things, and names that require reading the implementation to understand.
2. Flag misleading names: a name that implies something the code doesn't actually do (e.g., `getUser` that also has a side effect of writing to a database — the name promises a pure read).
3. Flag inconsistency: the same concept referred to by different names in different places (`userId` vs `user_id` vs `uid` for what is clearly the same value), or the same name used for conceptually different things.
4. Flag names that violate the given {{NAMING_CONVENTION}}, if provided (e.g., a boolean not prefixed with is/has/should/can).
5. For each flagged name, propose a specific replacement, not just "pick a better name" — and briefly justify why the replacement is clearer.
6. Do not flag names that are already clear just to pad the report — a well-named file should come back with few or no findings.
7. Don't touch logic, only names — if you notice a bug while reading, don't report it here (this prompt is naming-only).

Output format: Markdown, one entry per flagged name: `original` → `proposed`, with a one-sentence reason.
```

## Variables
- `{{CODE}}` — the code to audit for naming. Required.
- `{{NAMING_CONVENTION}}` — house naming rules to check against. Optional.

## Example
**Input:** `{{CODE}}` = a function with a parameter `d` used as a discount percentage, and a function `checkUser(u)` that actually creates a user if one doesn't exist.

**Output (excerpt):**
```
- `d` → `discountPercent` — a single letter gives no hint this is a percentage, not an amount or a flag.
- `checkUser` → `getOrCreateUser` — the current name implies a pure check/read, but the function has a side effect (creates a user record); the name should reflect that.
```

## Tips & Variations
- For a large file, ask it to only report the top 10 highest-impact naming issues (names used in the most places) rather than an exhaustive list.
- Combine with a project's actual style guide as `{{NAMING_CONVENTION}}` for house-rule enforcement rather than generic naming advice.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

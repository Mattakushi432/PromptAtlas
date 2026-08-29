---
id: code-smell-detector
title: Code Smell Detector
category: coding
tags: [code-smells, anti-patterns, refactoring]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Scans a file for classic design-level code smells — long methods, god classes, feature envy, primitive obsession, shotgun surgery — rather than bugs or security issues. For an engineer who suspects a file has "gone bad" structurally and wants it named precisely.

## When to use it
- Before a refactor, to get a prioritized list of what's actually wrong structurally, not just a gut feeling.
- Onboarding onto an unfamiliar file and wanting to know its structural weak points fast.
- Periodic hygiene passes on files that keep coming up in "this is hard to change" conversations.

## The Prompt

```
You are a software design reviewer specializing in code smells (Fowler-style anti-patterns) — not correctness bugs, not security issues, not style nits. Only structural/design smells.

Language: {{LANGUAGE}}
File contents:
{{FILE_CONTENTS}}

Check for these smell categories, and only report what's actually present:
- Long Method / Long Function — doing too many distinct things to describe in one sentence.
- Large Class / God Object — a class or module with too many responsibilities or reasons to change.
- Feature Envy — a method that uses another object's data more than its own.
- Primitive Obsession — using raw strings/numbers/arrays where a dedicated type/value object would clarify intent and prevent misuse.
- Shotgun Surgery — evidence that a single conceptual change would require edits scattered across many unrelated-looking places (infer from duplicated logic/constants).
- Duplicated Code — near-identical logic blocks that should be one.
- Long Parameter List — functions taking so many parameters that call sites are error-prone.
- Inappropriate Intimacy — two classes/modules reaching into each other's internals instead of using a clean interface.

For each smell found: name it, quote the specific location (function/class name), explain in one sentence why it hurts (not "this is bad practice" — the actual maintenance cost), and suggest the specific refactoring pattern that fixes it (e.g., "Extract Method", "Replace Primitive with Object", "Extract Class").

Do not report a smell just to fill space — a clean file with no smells is a valid and expected outcome; say so plainly.

Output format: Markdown, one entry per smell found, ordered by how much it's likely costing the team (worst first). End with a one-line summary: how many smells found, and the single highest-priority fix.
```

## Variables
- `{{FILE_CONTENTS}}` — the file to scan. Required.
- `{{LANGUAGE}}` — e.g. "TypeScript", "Go", "Ruby". Required — smell thresholds and idioms vary by language.

## Example
**Input:** `{{LANGUAGE}}` = "Python", `{{FILE_CONTENTS}}` = a 300-line `OrderProcessor` class handling validation, pricing, inventory, email, and logging.

**Output (excerpt):**
```
### 1. Large Class / God Object — `OrderProcessor`
`OrderProcessor` owns validation, pricing, inventory deduction, email dispatch, and logging — five unrelated reasons for this class to change. A pricing rule tweak risks breaking inventory logic through shared state.
Fix: Extract Class — split into `OrderValidator`, `PricingCalculator`, `InventoryService`, with `OrderProcessor` left as a thin orchestrator.

**Summary:** 3 smells found. Highest priority: extract `OrderProcessor`'s five responsibilities before adding any more logic to it.
```

## Tips & Variations
- For legacy code you can't refactor yet, ask it to add "risk if left as-is" — turns this into a technical-debt-register entry rather than a to-do.
- Restrict to one or two smell categories (e.g., only Duplicated Code and Long Method) when triaging a huge file, to avoid an overwhelming report.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

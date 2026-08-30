---
id: unfamiliar-module-explainer
title: Unfamiliar Module Explainer
category: coding
tags: [onboarding, code-comprehension, explain]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Explains a specific unfamiliar file or module to someone new to it — what it does, how it's structured, and what's non-obvious about it — the "walk me through this" conversation with a patient senior engineer. Distinct from a whole-repository onboarding guide: this is scoped to one piece of code someone is actually staring at right now.

## When to use it
- You've been handed a file or module you didn't write and need to modify it safely.
- Onboarding to a new codebase and working through it file by file.
- Reviewing inherited code before an incident or feature work touches it.

## The Prompt

```
You are a patient senior engineer walking a newcomer through a piece of code they haven't seen before. Explain it, don't just summarize what it obviously does — assume they can read the syntax but not the intent.

Code:
{{CODE}}

Specific question or confusion (optional): {{QUESTION}}

Reader's experience level: {{EXPERIENCE_LEVEL}}

Provide:
1. Summary — one plain-language paragraph: what this module is for and where it likely fits in a larger system.
2. Structure walkthrough — the main entry points, key functions/classes, and each one's responsibility, in the order a reader would naturally traverse them.
3. Non-obvious decisions — anything that looks unusual, clever, or historically motivated, with your best-supported explanation for why it's probably done this way. Clearly mark anything you're speculating about rather than reading directly from the code.
4. Footguns — anything a newcomer modifying this code is likely to get wrong or break without realizing it.

If a specific question was given, answer it directly first, then continue with the fuller walkthrough.

Calibrate depth and jargon to {{EXPERIENCE_LEVEL}} — don't explain basic language syntax to a senior reader, and don't assume framework-specific idioms are obvious to a junior one.

If the code is too obfuscated, minified, or fragmentary to determine real structure or intent, say plainly what can and can't be determined from it alone, rather than guessing confidently.
```

## Variables
- `{{CODE}}` — the file or module to explain. Required.
- `{{QUESTION}}` — a specific point of confusion to prioritize answering. Optional.
- `{{EXPERIENCE_LEVEL}}` — the reader's background (e.g., "junior developer, comfortable with JavaScript but new to this codebase"). Required — it materially changes what needs explaining.

## Example
**Input:** `{{CODE}}` = a 150-line `PaymentReconciler` class with retry logic and an unusual double-write to two tables, `{{EXPERIENCE_LEVEL}}` = "mid-level backend developer, new to this repo".

**Output (excerpt):**
```
Summary: This class reconciles payment records between our internal ledger and the payment provider's webhook events — it's the safety net that catches cases where a webhook arrived but our own state didn't update.

Non-obvious decisions: It writes to both `reconciliation_log` and `ledger_adjustments` in the same transaction. This looks redundant, but `reconciliation_log` is append-only and used for audit trails, while `ledger_adjustments` is what actually affects account balances — likely split this way so financial audits have an immutable record separate from mutable balance state. (Speculative — no comment in the code confirms this, but it matches common practice for financial reconciliation.)

Footgun: the retry loop catches all exceptions generically and re-queues, including on data-validation errors that will never succeed on retry — modifying this without narrowing the catch could quietly infinite-loop a permanently bad record.
```

## Tips & Variations
- Paste in the actual git blame or commit messages for the file as extra context if you have them — it turns "probably" into "confirmed by the commit history."
- For a whole subsystem rather than one file, run this per-file first, then ask for a synthesis pass across the outputs.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

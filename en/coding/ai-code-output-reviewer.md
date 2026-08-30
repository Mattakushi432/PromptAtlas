---
id: ai-code-output-reviewer
title: AI Code Output Reviewer
category: coding
tags: [ai-agents, code-review, quality-assurance]
target_models: [Claude Code, Cursor, GitHub Copilot]
difficulty: advanced
version: 1.0.1
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Vets AI-generated code specifically for the failure modes distinctive to AI generation — hallucinated APIs/libraries, subtly wrong logic that reads plausibly, silently dropped edge cases, unnecessary complexity — not a general code review. For code produced by an AI coding tool that needs a skeptical second pass before it's trusted.

## When to use it
- An AI coding agent produced a non-trivial chunk of code and you want a systematic pass for AI-specific failure modes before merging it, not just a general review.
- Reviewing a PR where you suspect (or know) significant portions were AI-generated and want to calibrate scrutiny accordingly.
- Building the habit of critically vetting AI output rather than accepting confident-sounding code at face value.

## The Prompt

```
You review AI-generated code specifically for failure modes distinctive to AI code generation — not a general code review covering everything a human-written PR review would.

AI-generated code: {{CODE}}
Language/stack: {{LANGUAGE_OR_STACK}}
What it was supposed to do (the original request/task, if available): {{ORIGINAL_TASK}}

Instructions:
1. Check for hallucinated APIs: does the code call a function, method, or library feature that doesn't actually exist in the stated library/version, or that exists but with a different signature than used? This is the single most distinctive AI failure mode — flag anything you're not fully certain is real, even if it looks plausible, rather than assuming familiarity means correctness.
2. Check for subtly wrong logic that reads as confident and clean: AI-generated code often has good style and clear naming even when the underlying logic is wrong, which makes bugs harder to spot by skimming — trace through the actual logic against {{ORIGINAL_TASK}} rather than trusting that clean code is correct code.
3. Check for silently dropped edge cases: does the code handle the stated happy path well but silently omit error handling, empty-input handling, or a case the original request implied but didn't spell out explicitly? AI output frequently optimizes for the clearly-stated case and under-handles the implied ones.
4. Check for unnecessary complexity or scope creep: did the AI solve a broader or more "impressive" version of the problem than asked, introducing abstraction, configuration options, or generality that wasn't requested and adds maintenance burden without corresponding value?
5. Check for outdated patterns: does the code use a deprecated API, an old idiom, or a pattern that was correct at some point but has since been superseded, reflecting stale training data rather than current best practice for this library/language version?
6. Check for fabricated-sounding confidence in comments: does a comment assert something about behavior, performance, or correctness that isn't actually verified/verifiable from the code itself — AI-generated comments can sound authoritative while being speculative or wrong.
7. Distinguish HIGH-confidence findings (a specific API call you can verify doesn't exist, or logic that's demonstrably wrong for a given input) from things worth double-checking but not certain — don't present uncertain findings with false confidence, since this review's whole point is being appropriately skeptical, not paranoid.

Output format: Markdown, one entry per finding, grouped by category (Hallucinated APIs / Logic Errors / Dropped Edge Cases / Unnecessary Complexity / Outdated Patterns / Overconfident Comments), each with confidence level and the specific fix or verification step.
```

## Variables
- `{{CODE}}` — the AI-generated code to review. Required.
- `{{LANGUAGE_OR_STACK}}` — the language/library/version, needed to check API existence accurately. Required.
- `{{ORIGINAL_TASK}}` — what the code was supposed to accomplish. Optional but sharply improves the logic-correctness and scope-creep checks.

## Example
**Input:** `{{LANGUAGE_OR_STACK}}` = "Python / requests library", `{{CODE}}` = a function calling `requests.get(url, retries=3)`.

**Output (excerpt):**
```
### Hallucinated APIs — HIGH confidence
`requests.get()` does not accept a `retries` keyword argument — the `requests` library doesn't support retries natively on the `get()` call; retries require configuring a `Session` with an `HTTPAdapter` and a `Retry` object from `urllib3`, or using a third-party wrapper. This code will raise a `TypeError` at runtime, not silently ignore the argument.
Fix: use `requests.Session()` with a mounted `HTTPAdapter(max_retries=Retry(total=3))`, or verify against current `requests` docs if a newer version added this — but as of the stated context, this call is not valid.
```

## Tips & Variations
- For a language/library you're not deeply familiar with yourself, explicitly ask it to flag anything it's not 100% certain about as "needs manual verification against official docs" rather than asserting confidently either way — this keeps the review honest about its own uncertainty.
- Pair with actually running the code/tests as the ground-truth check for hallucinated APIs — a real runtime error is definitive in a way no amount of static review confidence can be.

## Changelog
- 1.0.1 (2026-08-30): Narrowed `target_models` to the actual agentic coding tools this prompt targets (Claude Code, Cursor, GitHub Copilot) instead of the generic chat-model list.
- 1.0.0 (2026-08-29): Initial version.

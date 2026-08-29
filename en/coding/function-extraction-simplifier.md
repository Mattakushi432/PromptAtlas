---
id: function-extraction-simplifier
title: Function Extraction Simplifier
category: coding
tags: [refactoring, readability, clean-code]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Refactors one long function into several smaller, well-named ones with identical behavior — producing actual refactored code, not just a list of what's wrong. For a developer who's decided to fix a long function and wants a concrete first draft of the split.

## When to use it
- A function has grown past the point of being readable in one glance and needs breaking up.
- Preparing to add a new feature to a long function and want to simplify its structure first, before adding more.
- Reviewing someone else's long function and wanting to propose a concrete extraction instead of just saying "this is too long."

## The Prompt

```
You refactor a long function into smaller, well-named functions with IDENTICAL external behavior — same inputs produce same outputs, same side effects in the same order, same errors under the same conditions. This is Extract Method refactoring, not a rewrite.

Function to refactor:
{{FUNCTION_CODE}}

Language: {{LANGUAGE}}
Naming/style conventions to follow (optional): {{STYLE_CONVENTIONS}}

Instructions:
1. Identify natural extraction boundaries: a block that computes one distinct thing, has a describable purpose independent of the rest, and doesn't share so much mutable local state with its surroundings that extraction would require passing back five values.
2. For each extracted function, give it a name that describes what it does (not "helper1", "part2") — the name should make the original function readable almost like prose once the extraction is done.
3. Keep the extracted functions at the same level of abstraction as each other within the original function's new body — don't leave one giant inline block next to five one-line extracted calls.
4. Preserve behavior exactly: if the original has early returns, side effects in a specific order, or error handling, the refactored version must produce identical observable behavior for every input, including edge cases.
5. Do not "improve" logic while extracting (fixing a suspected bug, changing an algorithm) — if you notice something that looks like a bug, note it separately after the refactor, don't silently fix it.
6. Show the final result: the original function's new, short body plus all extracted functions, ready to paste in.
7. Briefly explain each extraction's boundary rationale — why that block deserved its own function.

Output: the refactored code (all functions), followed by a short rationale per extraction.
```

## Variables
- `{{FUNCTION_CODE}}` — the long function to refactor. Required.
- `{{LANGUAGE}}` — e.g. "Python", "Java", "TypeScript". Required.
- `{{STYLE_CONVENTIONS}}` — naming/formatting conventions to match (e.g. "private methods prefixed with _"). Optional.

## Example
**Input:** `{{FUNCTION_CODE}}` = a 60-line `processOrder()` that validates input, calculates pricing, applies discounts, and sends a confirmation email, all inline.

**Output (excerpt):**
```python
def process_order(order):
    validate_order(order)
    price = calculate_price(order)
    price = apply_discounts(order, price)
    send_confirmation_email(order, price)
    return price

def validate_order(order):
    ...

def calculate_price(order):
    ...
```
*(followed by rationale: "validate_order isolates all input-checking logic, which had no dependency on pricing state, into a single-purpose guard clause block...")*

## Tips & Variations
- For languages/codebases that discourage many small free functions (e.g., a strict OOP style), ask for extraction into private methods on the same class instead of standalone functions.
- If the function is entangled with too much shared mutable state to extract cleanly, ask it to say so explicitly and suggest a larger restructuring (e.g., introducing a small state object) rather than forcing an awkward split.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

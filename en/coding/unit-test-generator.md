---
id: unit-test-generator
title: Unit Test Generator
category: coding
tags: [testing, unit-tests, tdd]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Writes runnable unit tests — including edge cases, not just the happy path — from a function's signature and implementation, in a specific test framework. For a developer who wants a real first draft of tests, not a checklist of what to test.

## When to use it
- Just wrote a function and want test coverage before moving on, following a test-after workflow.
- Inheriting untested legacy code and need a baseline test suite before refactoring it safely.
- Practicing TDD and want a starting set of test cases to critique and adjust before implementing.

## The Prompt

```
You write unit tests. Generate a complete, runnable test file for the function below using the specified test framework — not pseudocode, not a description of what to test.

Function/module to test:
{{FUNCTION_CODE}}

Language and test framework: {{LANGUAGE_AND_FRAMEWORK}}
Existing test file conventions to match (optional, e.g. naming, setup/teardown style): {{TEST_CONVENTIONS}}

Instructions:
1. Test the happy path first: typical valid inputs and their expected outputs.
2. Test edge cases specific to this function's logic: empty/null/undefined inputs, boundary values (zero, negative, max size), type mismatches if the language allows them at runtime, and any input that would hit a different branch in the code.
3. If the function has side effects (I/O, mutation, external calls), test those explicitly — don't just test the return value if the function does more than compute one.
4. If the function can throw/reject, test that it does so under the right conditions, and that it does NOT do so under valid ones.
5. Use descriptive test names that state the behavior under test (e.g. `returns empty array when input list is empty`), not `test1`, `test2`.
6. If you can't determine the correct expected output for a case from the code alone (the function's logic is ambiguous or looks buggy), don't invent one — write the test with a `// TODO: confirm expected behavior` comment instead of guessing.
7. Group related tests with `describe`/`context` blocks (or the framework's equivalent) rather than one flat list.

Output: a single complete test file, ready to run, including necessary imports.
```

## Variables
- `{{FUNCTION_CODE}}` — the function/module source to test. Required.
- `{{LANGUAGE_AND_FRAMEWORK}}` — e.g. "TypeScript / Vitest", "Python / pytest", "Go / testing package". Required.
- `{{TEST_CONVENTIONS}}` — existing project test style to match. Optional.

## Example
**Input:** `{{FUNCTION_CODE}}` = a `calculateDiscount(price, percentOff)` function that throws on negative price, `{{LANGUAGE_AND_FRAMEWORK}}` = "TypeScript / Vitest".

**Output (excerpt):**
```ts
describe('calculateDiscount', () => {
  it('applies the percentage discount to a valid price', () => {
    expect(calculateDiscount(100, 20)).toBe(80);
  });

  it('throws when price is negative', () => {
    expect(() => calculateDiscount(-10, 20)).toThrow();
  });

  it('returns the original price when percentOff is 0', () => {
    expect(calculateDiscount(100, 0)).toBe(100);
  });
});
```

## Tips & Variations
- For a TDD workflow, ask it to generate tests from a function *signature and docstring only*, before the implementation exists — it'll produce tests against the intended contract instead of the actual code.
- If the codebase mocks a specific way (e.g., a custom test-utils module), paste an existing test file as `{{TEST_CONVENTIONS}}` so the output matches style exactly.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

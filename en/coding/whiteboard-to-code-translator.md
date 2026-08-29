---
id: whiteboard-to-code-translator
title: Whiteboard-to-Code Translator
category: coding
tags: [algorithms, interview-prep, code-generation]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Turns a described algorithm (in plain language, pseudocode, or a whiteboard-style sketch description) into clean, working code in a target language — a translation task, distinct from `interview-problem-generator` (creates a new problem) and `mock-interview-conductor` (interactive interview practice). For getting from "here's my approach" to actual runnable code quickly.

## When to use it
- Worked out an algorithm's logic on paper/whiteboard (or described it verbally in an interview practice session) and need it turned into real code to verify it actually works.
- Have a clear mental model of an approach but want help translating it into idiomatic code in a specific language rather than writing boilerplate by hand.
- Reviewing whether your described approach, once made concrete as code, actually handles the cases you assumed it would.

## The Prompt

```
You translate a described algorithm into clean, working code in a target language — faithful to the described logic, not a different approach that happens to solve the same problem.

Algorithm description (plain language, pseudocode, or whiteboard-style steps): {{ALGORITHM_DESCRIPTION}}
Target language: {{LANGUAGE}}
Function signature or I/O format, if specified (optional): {{SIGNATURE}}

Instructions:
1. Translate the described logic faithfully — if the description has a specific approach (e.g., "use two pointers moving toward each other"), implement that approach, don't silently substitute a different algorithm that solves the same problem, even if it's more efficient. If you notice the described approach has a flaw, implement it as described first, then flag the flaw separately.
2. Use idiomatic patterns for {{LANGUAGE}} rather than a literal line-by-line transliteration of pseudocode — e.g., use the language's actual iteration/collection idioms rather than manually managing indices where the language has a cleaner built-in way.
3. If the description is ambiguous about a specific detail (e.g., "sort the list" without specifying ascending/descending, or unclear about how to handle a tie), make a reasonable choice and note the assumption explicitly, rather than silently picking one interpretation.
4. Handle the edge cases the description implies even if not explicitly stated (empty input, single-element input) if they're natural implications of the described logic — but don't add defensive handling for cases the algorithm's description doesn't actually need to handle, since that would be adding logic beyond what was described.
5. Use clear variable names that reflect the algorithm's actual roles (not `i`, `j`, `temp` for everything) unless the description itself uses those exact names and changing them would reduce traceability back to the original description.
6. If {{SIGNATURE}} specifies an exact function signature or I/O format, match it exactly — a translation that's logically correct but doesn't match the required interface isn't actually usable.
7. After the code, briefly state the resulting time/space complexity of the implemented algorithm, so you can confirm it matches your expectation from when you designed the approach.

Output: the code in a fenced block, followed by a one-line complexity note and any assumptions flagged.
```

## Variables
- `{{ALGORITHM_DESCRIPTION}}` — the algorithm as described, in whatever form it currently exists. Required.
- `{{LANGUAGE}}` — the target programming language. Required.
- `{{SIGNATURE}}` — the required function signature or I/O format. Optional.

## Example
**Input:** `{{ALGORITHM_DESCRIPTION}}` = "use two pointers starting at both ends of a sorted array, moving inward, to find a pair summing to a target value", `{{LANGUAGE}}` = "Python", `{{SIGNATURE}}` = "def two_sum_sorted(arr: list[int], target: int) -> tuple[int, int] | None".

**Output (excerpt):**
```python
def two_sum_sorted(arr: list[int], target: int) -> tuple[int, int] | None:
    left, right = 0, len(arr) - 1
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return (left, right)
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return None
```
*(Complexity: O(n) time, O(1) space — matches the two-pointer approach as described. Assumption: returns indices, not values, since the signature's return type suggests a pair of positions; flag if values were intended instead.)*

## Tips & Variations
- If translating a described approach that you're not fully confident is correct, ask it to also generate a couple of quick test cases based on the description so you can verify the translated code actually behaves as intended before relying on it.
- For interview practice specifically, do this translation step yourself first without help, then use this prompt only to check your translation against a faithful reference — using it to write the code from the start skips the practice value.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

---
id: big-o-complexity-analyzer
title: Big O Complexity Analyzer
category: coding
tags: [algorithms, performance, code-analysis]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Derives the actual time and space complexity of a given function through rigorous code analysis — loop nesting, recursion, data structure operation costs — with worked reasoning, not just a stated Big-O label. For analyzing real, possibly non-obvious code, distinct from explaining a complexity concept in the abstract.

## When to use it
- Reviewing a function's performance characteristics before it ships, especially one operating on data that could grow large.
- Suspecting a piece of code is slower than it looks and wanting a rigorous derivation, not a guess.
- Comparing two implementations of the same logic to determine which actually scales better, when it's not obvious from reading alone.

## The Prompt

```
You derive the actual time and space complexity of the given code through step-by-step analysis — show the reasoning, not just the final Big-O label.

Function/code: {{CODE}}
Language: {{LANGUAGE}}
Relevant context (optional — e.g. "n is the array length, m is a separate input size"): {{CONTEXT}}

Instructions:
1. Identify the dominant input variable(s) and name them explicitly (n, m, etc.) — if there are multiple independent inputs affecting cost differently (e.g., a nested loop over two different collections of different sizes), use separate variables rather than collapsing everything into one n.
2. Walk through the code structurally: for each loop, state its iteration count in terms of the input variables; for each nested loop, multiply; for each function call, substitute its own complexity (recursively analyzing helper functions called, not treating them as free).
3. For any data structure operation (list append, dict/hash lookup, set membership check, array insertion at an index), use its ACTUAL complexity for the language/implementation in question, not an assumed O(1) for everything — a Python list `.insert(0, x)` is O(n), not O(1); an unindexed field lookup that requires a table scan is not O(1) even though it looks like a simple lookup.
4. For recursive code, set up and solve (or clearly reason through) the recurrence relation — state the recurrence itself, not just the final answer, so the derivation is checkable.
5. Distinguish best-case, average-case, and worst-case complexity where they genuinely differ (e.g., quicksort's average vs. worst case) and state which case is most relevant to flag as the practical concern.
6. Analyze space complexity separately from time complexity, including any auxiliary space used (a hash map built during the algorithm, recursion call stack depth) — don't just report time complexity and assume space is obviously the same.
7. If the code's complexity is worse than a well-known optimal approach for this problem, name the better approach and its complexity, but don't rewrite the code unless asked — the goal here is accurate analysis, not automatic optimization.

Output format: Markdown with sections: Variables Used, Step-by-Step Derivation, Time Complexity (best/average/worst if they differ), Space Complexity, and (if relevant) a note on a better-known approach.
```

## Variables
- `{{CODE}}` — the function/code to analyze. Required.
- `{{LANGUAGE}}` — the programming language, since data structure operation costs are implementation-specific. Required.
- `{{CONTEXT}}` — clarification of what input variables represent, if not obvious from the code. Optional but helps for multi-input functions.

## Example
**Input:** `{{LANGUAGE}}` = "Python", `{{CODE}}` = a function that, for each element in a list of size n, checks membership in another list (not a set) of size m.

**Output (excerpt):**
```
## Step-by-Step Derivation
The outer loop runs n times (once per element of the first list). Inside it, `x in other_list` on a Python `list` (not a `set`) is an O(m) linear scan, not O(1) — this is a common mistake, since `in` on a set would be O(1) average case, but this is a list.
Total: n iterations × O(m) per iteration = O(n × m).

## Time Complexity
O(n·m) — worst case and average case are the same here since list membership check is linear regardless of where the match is found on average.

## Space Complexity
O(1) auxiliary space — no additional data structures are built proportional to input size.

## Note
If `other_list` is converted to a `set` once before the loop (O(m) one-time cost), the membership check becomes O(1) average case, dropping total complexity to O(n + m) — a significant improvement if this function is called with large lists.
```

## Tips & Variations
- For recursive functions with memoization, explicitly ask it to analyze the complexity WITH and WITHOUT the memoization to make the improvement concrete, rather than only analyzing the optimized version.
- If comparing two implementations, paste both and ask for a side-by-side derivation ending in a direct comparison table, rather than running this prompt twice separately.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

---
id: data-structure-selector
title: Data Structure Selector
category: coding
tags: [algorithms, data-structures, learning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Recommends which data structure or algorithm fits a described problem, with reasoning tied to the problem's actual access patterns — an upfront design choice, distinct from `big-o-complexity-analyzer` (analyzes existing code after the fact). For deciding what to reach for before writing the solution.

## When to use it
- Starting to solve a problem (interview practice or real code) and unsure which data structure would make it tractable.
- Reviewing your own choice of data structure before committing to an implementation, to catch an inefficient choice early.
- Learning to recognize which problem characteristics point to which data structure, building pattern-matching intuition over time.

## The Prompt

```
You recommend a data structure/algorithm for a described problem, with reasoning tied to the problem's actual requirements — not a survey of every possible option.

Problem description (what operations are needed, roughly how much data, any performance requirement): {{PROBLEM_DESCRIPTION}}

Instructions:
1. Identify the specific operations the problem actually requires and how often each is used: lookups, insertions, deletions, range queries, ordered traversal, finding min/max, checking membership — the mix of operations needed is what determines the right structure, not the problem's surface description alone.
2. Recommend a specific data structure (not a vague category) — e.g., "a hash map" is more actionable than "some kind of fast lookup structure," and "a min-heap" is more actionable than "a structure for finding minimums."
3. Justify the choice against the specific operations identified in step 1: state which operation is the bottleneck for a naive approach and how the recommended structure specifically addresses it (e.g., "a sorted array supports binary search lookup in O(log n), but insertion is O(n); if insertions are frequent, a balanced BST or skip list keeps both at O(log n)").
4. If multiple structures would work but with different tradeoffs, name the top 2 and state the specific tradeoff between them (e.g., a hash map for O(1) average lookup vs. a sorted structure if ordered iteration is also needed) rather than picking one silently when the choice genuinely depends on a detail not given.
5. Flag if the described problem has a common named pattern (two-pointer, sliding window, union-find, topological sort) so the solver can look up the pattern's standard technique rather than reinventing it.
6. If the problem's scale is small enough that the "obvious" simple structure is fine and a more sophisticated one would be premature optimization, say so explicitly rather than always recommending the theoretically optimal structure regardless of actual need.
7. Briefly note the resulting time/space complexity for the primary operations once the recommended structure is used, so the impact of the choice is concrete.

Output format: Markdown with sections: Key Operations Identified, Recommended Structure (with justification), Alternative (if a real tradeoff exists), Resulting Complexity.
```

## Variables
- `{{PROBLEM_DESCRIPTION}}` — the problem, including what operations are needed and roughly how much data. Required.

## Example
**Input:** `{{PROBLEM_DESCRIPTION}}` = "need to process a stream of numbers and, at any point, be able to quickly report the current median".

**Output (excerpt):**
```
## Key Operations Identified
Frequent insertion (one number at a time, streaming) and frequent "find the median" queries interleaved with insertions — not a one-time sort followed by static queries.

## Recommended Structure
Two heaps: a max-heap holding the smaller half of the numbers seen so far, and a min-heap holding the larger half, kept balanced in size (differing by at most 1). The median is always at the top of one (or the average of both tops if sizes are equal).

## Resulting Complexity
Insertion: O(log n) per number (heap push/pop to rebalance). Median query: O(1) (just peek the top(s)). This beats re-sorting on every query (O(n log n) per query) or a naive single sorted structure with O(n) insertion.
```

## Tips & Variations
- For interview practice specifically, ask it to also name the "pattern family" the problem belongs to (e.g., "this is a classic two-heap / median-maintenance pattern") so you build recognition for similarly-shaped future problems, not just a solution to this one.
- If the actual data scale is very large (doesn't fit in memory, needs external/distributed structures), say so explicitly — this changes the answer entirely from in-memory data structure selection to a systems-design question.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

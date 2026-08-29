---
id: interview-problem-generator
title: Interview Problem Generator
category: coding
tags: [algorithms, interview-prep, assessment]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Generates a coding-interview practice problem with a grading rubric, by topic and difficulty — a self-contained practice artifact, distinct from `mock-interview-conductor` (which runs a live Socratic interview) and `whiteboard-to-code-translator` (translates an already-described algorithm). For building a problem bank or generating fresh practice material.

## When to use it
- Preparing for technical interviews and wanting fresh practice problems targeted at a specific topic/difficulty rather than reusing well-known problems you might have memorized solutions to.
- An interviewer or team building an internal interview question bank and wanting a new problem with a rubric ready to use.
- Practicing a specific weak area (e.g., graph algorithms, dynamic programming) with problems generated for that exact gap.

## The Prompt

```
You generate a coding interview practice problem with a grading rubric — a complete, self-contained problem, not a description of what kind of problem would be good.

Topic (optional — e.g. "dynamic programming", "graphs", "arrays/two-pointer"; if omitted, choose a common interview topic): {{TOPIC}}
Difficulty: {{DIFFICULTY}}
Target language for the reference solution (optional): {{LANGUAGE}}

Instructions:
1. Write a clear, self-contained problem statement: the scenario, precise input/output format, and explicit constraints (input size bounds, value ranges) — an interview problem with ambiguous constraints produces ambiguous, hard-to-grade solutions.
2. Include 2-3 examples with input, expected output, and a one-line explanation of why — enough for a solver to verify their understanding of the problem before starting to code.
3. Design the problem so its stated constraints actually distinguish between approaches of different complexity — if a brute-force solution and an optimal solution would both trivially pass given the stated constraints, the constraints aren't doing their job; tighten them so the intended optimization is genuinely necessary.
4. Write a grading rubric covering: correctness (does it produce right output on typical and edge-case inputs), complexity (does it meet the expected time/space complexity for this difficulty level — state what that expected complexity is), and code quality (readable variable names, no obviously dead code) as a much lower-weighted tertiary criterion.
5. List the specific edge cases a complete solution must handle (empty input, single-element input, all-duplicate values, maximum constraint size) — these are what actually separates a working solution from a broken one in practice.
6. Provide a reference solution in {{LANGUAGE}} (or a common language if unspecified) that meets the expected complexity, so the rubric's complexity bar is concretely demonstrated, not just asserted.
7. Note common wrong approaches or mistakes specific to this problem (a classic off-by-one, a naive approach that looks right but fails a specific edge case) so a grader knows what to watch for even without seeing this exact rubric item violated.

Output format: Markdown with sections: Problem Statement, Examples, Constraints, Grading Rubric, Edge Cases to Handle, Reference Solution, Common Mistakes.
```

## Variables
- `{{DIFFICULTY}}` — e.g. "easy", "medium", "hard" (or a specific level like "senior engineer, system-design-adjacent"). Required.
- `{{TOPIC}}` — the algorithmic area to focus on. Optional — a generator can pick a well-rounded topic if omitted.
- `{{LANGUAGE}}` — the language for the reference solution. Optional, defaults to a common interview language (Python or similar).

## Example
**Input:** `{{TOPIC}}` = "sliding window", `{{DIFFICULTY}}` = "medium".

**Output (excerpt):**
```markdown
## Problem Statement
Given a string `s` and an integer `k`, find the length of the longest substring that contains at most `k` distinct characters.

## Constraints
1 <= s.length <= 10^5, 0 <= k <= 26 (lowercase English letters only) — the input size rules out an O(n²) brute-force check of every substring within a reasonable time limit, requiring the sliding window approach.

## Grading Rubric
- Correctness (60%): passes typical cases and edge cases below.
- Complexity (30%): must run in O(n) time — an O(n²) brute-force solution should be flagged as not meeting the bar for this difficulty, even if correct.
- Code quality (10%): clear variable names for window boundaries and character counts.

## Edge Cases to Handle
- k = 0: the answer should be 0 (no substring can have 0 distinct characters unless the substring itself is empty).
- k >= number of distinct characters in s: the answer is the full string length.
- Empty string input.
```

## Tips & Variations
- For building a company-specific question bank, ask it to also generate 2-3 natural follow-up questions an interviewer could ask if the candidate solves the base problem quickly (a common technique for calibrating a stronger candidate).
- Regenerate with the same topic/difficulty but explicitly ask for a different concrete scenario if the first output feels too close to a very well-known existing problem.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

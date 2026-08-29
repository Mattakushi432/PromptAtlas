---
id: mock-interview-conductor
title: Mock Interview Conductor
category: coding
tags: [interview-prep, socratic, algorithms]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Conducts a Socratic mock technical (algorithmic) coding interview — presenting a problem, asking follow-up questions, probing complexity and edge cases — rather than a solved worked example. Distinct from `interview-problem-generator` (produces a static problem+rubric) and `system-design-walkthrough-coach` (system design, not algorithmic coding): this is a live, interactive practice interview.

## When to use it
- Practicing technical interviews and wanting the actual back-and-forth experience (being asked to clarify, justify complexity, handle a follow-up twist), not just a problem to solve alone.
- Building comfort with thinking out loud under interview-style questioning before a real interview.
- Practicing handling a specific interview failure mode (going quiet while thinking, not stating complexity, missing an edge case until prompted) in a low-stakes setting.

## The Prompt

```
You conduct a mock technical coding interview — acting as the interviewer, asking Socratic follow-up questions, not just presenting a problem and grading a final answer.

Topic/difficulty (optional): {{TOPIC_AND_DIFFICULTY}}
Specific problem to use, if you have one in mind (optional — otherwise generate one appropriate to the topic/difficulty): {{SPECIFIC_PROBLEM}}
My experience level (optional, affects how much you probe vs. guide): {{EXPERIENCE_LEVEL}}

Instructions:
1. Present the problem statement clearly, then wait for me to ask clarifying questions or state my initial approach before offering anything — a real interview doesn't hand you a fully-specified problem upfront; let me demonstrate whether I ask about constraints/edge cases unprompted, and only clarify what I explicitly ask about.
2. As I describe my approach, ask questions that probe understanding rather than confirming or denying: "what would that do if the input were empty?", "what's the time complexity of that step?", "why did you choose that data structure?" — push me to justify choices rather than validating them for me.
3. If I propose a suboptimal approach, don't immediately say it's wrong — ask a question that would lead me to notice the inefficiency myself (e.g., "how would this scale if n were a million?") before revealing it directly.
4. If I get stuck, offer a graduated hint rather than the answer: first a question nudging toward the relevant concept, then a stronger hint only if I'm still stuck after that, then the direct answer only as a last resort — mirroring how a reasonable real interviewer would help without simply solving it for me.
5. Once I have a working approach, ask me to state the time/space complexity explicitly and challenge me to justify it, not just accept a stated Big-O without explanation.
6. Ask at least one edge-case question I haven't already addressed (empty input, single element, all-duplicate values, or whatever's relevant to this specific problem) to check whether I proactively consider them.
7. At the end, give a brief, honest debrief: what I did well, what a real interviewer would likely flag as a gap (missed edge case, didn't state complexity unprompted, jumped to code before clarifying requirements), and one specific thing to practice.

Keep your own turns short — this is a dialogue where I do most of the thinking out loud, not a lecture.
```

## Variables
- `{{TOPIC_AND_DIFFICULTY}}` — the algorithmic area and difficulty level to practice. Optional.
- `{{SPECIFIC_PROBLEM}}` — a specific problem to use instead of a generated one. Optional.
- `{{EXPERIENCE_LEVEL}}` — affects how much scaffolding vs. how adversarial the questioning should be. Optional.

## Example
**Input:** `{{TOPIC_AND_DIFFICULTY}}` = "arrays, medium".

**Output (excerpt):**
```
Here's the problem: Given an array of integers, find the maximum sum of any contiguous subarray.

Go ahead — feel free to ask me any clarifying questions before you start, or just tell me how you'd approach it.
```
*(user responds; interviewer continues with follow-up questions based on the response — e.g., if the user immediately proposes a nested-loop approach: "okay, walk me through what that would do for an array of size 10,000 — how many operations roughly?" — rather than stating it's inefficient)*

## Tips & Variations
- For practicing specifically the "think out loud" skill (not just solving correctly), explicitly ask it to flag any moment you go silent for too long without narrating your thinking, since real interviewers often note this as a gap even when the final solution is correct.
- After several rounds on the same topic, ask for a harder variant of a similar problem to check whether the pattern recognition actually transferred, not just memorized one specific problem's solution.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

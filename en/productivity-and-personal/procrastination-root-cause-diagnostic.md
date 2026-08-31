---
id: procrastination-root-cause-diagnostic
title: Procrastination Root-Cause Diagnostic
category: productivity-and-personal
tags: [productivity, decision-making]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Diagnoses the actual underlying cause of procrastination on a specific task — distinguishing task-aversion (the task itself feels unpleasant), overwhelm (the task is too large/undefined to start), fear of a bad outcome, a genuine prioritization signal (it's being avoided because it's not actually important), and simple friction (starting is harder than it should be for a mundane reason) — rather than defaulting to generic "just start small" advice that only helps some of these causes.

## When to use it
- You keep putting off a specific task and generic productivity advice ("break it into smaller steps," "just start") hasn't worked, suggesting the actual cause isn't the one that advice assumes.
- You want to figure out whether a recurring avoidance pattern across several tasks shares a common root cause, rather than treating each instance as unrelated.
- You're not sure whether you're procrastinating on something or legitimately deprioritizing it, and want help telling those two apart honestly.

## The Prompt

```
You diagnose the actual cause of procrastination on a specific task, from a fixed set of distinct root-cause categories — you do not default to generic productivity advice before identifying which category actually applies here.

Task being avoided: {{TASK}}
How long it's been avoided, and any pattern in the avoidance (e.g. keep starting and stopping, haven't opened it at all, keep doing other things instead): {{AVOIDANCE_PATTERN}}
What comes to mind when you think about starting it (optional, if known): {{ASSOCIATED_FEELING}}

Instructions:
1. Work through these candidate causes against what's given, rather than assuming one: task-aversion (the work itself is unpleasant — boring, tedious, or unenjoyable, independent of outcome), overwhelm (the task is too large, vague, or multi-step to know where to start), fear of outcome (avoiding starting because of what a bad result might mean — judgment, failure, a hard conversation the task might trigger), genuine deprioritization (it's actually not that important, and the avoidance is an accurate signal rather than a problem to fix), and friction (some small practical barrier — the tool isn't set up, the file's not findable — that's disproportionately blocking starting despite the task itself being fine).
2. Use {{AVOIDANCE_PATTERN}} as evidence: repeatedly starting and quickly stopping suggests overwhelm or task-aversion more than fear (fear usually prevents starting at all); doing unrelated productive things instead of this task suggests avoidance of something specific about this task, not general unproductivity; never having opened it at all combined with a long delay can suggest either overwhelm or a low actual priority — ask which, if the pattern alone doesn't distinguish them.
3. If {{ASSOCIATED_FEELING}} is given, weight it heavily — dread or anxiety points toward fear of outcome; a flat "ugh, boring" points toward task-aversion; "I don't even know where to start" points toward overwhelm; genuine indifference ("I guess I should but...") points toward deprioritization.
4. Do not assume it's a motivation or discipline problem by default — that framing is rarely the actual cause and tends to add unhelpful self-judgment on top of whatever the real cause is.
5. Once a most-likely cause is identified, give a fix matched specifically to that cause, not a generic one: for overwhelm, help break down the very next concrete action (not the whole task); for fear of outcome, name specifically what outcome is being avoided and whether it's actually likely; for task-aversion, consider pairing it with something enjoyable or timeboxing it tightly rather than an open-ended session; for deprioritization, explicitly permit dropping or deferring it rather than forcing motivation for something that shouldn't be a priority; for friction, just identify and remove the specific small barrier.
6. If more than one cause plausibly applies, say so and rank them rather than forcing a single answer — procrastination often has a primary and a secondary cause, and treating only one can leave the real blocker in place.

Output format: Markdown. State the most likely cause first with the evidence for it, a secondary cause if applicable, then the cause-matched suggestion.
```

## Variables
- `{{TASK}}` — the specific task being avoided. Required.
- `{{AVOIDANCE_PATTERN}}` — how the avoidance is actually showing up (duration, whether work was started and abandoned, what's being done instead). Required — this is the primary diagnostic evidence.
- `{{ASSOCIATED_FEELING}}` — what comes to mind when starting is considered, if the person can identify it. Optional, but sharpens the diagnosis significantly when available.

## Example
**Input:** `{{TASK}}` = "Writing a difficult performance review for a direct report." `{{AVOIDANCE_PATTERN}}` = "Opened the document three times over two weeks, wrote a sentence or two each time, then closed it and did other work instead." `{{ASSOCIATED_FEELING}}` = "A knot in my stomach thinking about how they'll react to the critical feedback."

**Output (excerpt):**
```
Most likely cause: Fear of outcome. {{ASSOCIATED_FEELING}} ("a knot in my stomach thinking about how they'll react") is a direct, specific dread response tied to the anticipated consequence of the task (the report's reaction), not to the writing task itself. The pattern of opening and writing a little before stopping is also consistent with approaching the hard part (the critical feedback) and backing off before reaching it, rather than not knowing how to write a review at all.

Secondary cause: some task-aversion may also be present (performance reviews are often generically unpleasant to write), but the specific, named dread about a particular person's reaction points to fear of outcome as primary.

Suggestion: Rather than trying to write the whole review in one sitting, name explicitly what you're afraid will happen if you deliver this feedback — write that fear down as a sentence, then assess honestly whether it's likely (will they actually react as badly as imagined, or is that anticipation worse than the likely reality?). Often, drafting the hardest sentence first — the specific critical feedback itself — rather than starting from the top, breaks the avoidance faster, since the anticipated hard part is what's actually being circled.
```

## Tips & Variations
- Pair with `difficult-feedback-conversation-scripter` (career-and-hr, already shipped) if the diagnosed cause is fear of outcome tied to a hard conversation specifically — that prompt helps script the actual conversation, which often reduces the fear once the vague dread becomes a concrete, rehearsed plan.
- If deprioritization is the diagnosed cause, resist the instinct to find a way to force motivation anyway — the more useful outcome is often explicitly deciding to drop or delegate the task, which this prompt should say plainly rather than softening into more productivity advice.
- For a recurring pattern across multiple different tasks (not just one), consider running this prompt on 2-3 recent examples and comparing the diagnosed causes — a consistent cause across different tasks is a stronger signal than any single instance.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

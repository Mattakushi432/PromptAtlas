---
id: parents-homework-help-script
title: Parent's Homework-Help Script
category: education-and-learning
tags: [tutoring, education]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Coaches a parent on how to help a child through a specific homework problem without just handing over the answer — what to ask, what to say when the parent themselves doesn't remember the material, and how to tell productive struggle from genuine frustration that needs more direct help. Distinct from `socratic-tutor-for-a-specific-concept` (education-and-learning, already shipped), which is the tutoring script delivered directly to the learner; this prompt coaches the parent on how to run that kind of interaction themselves, including managing their own uncertainty.

## When to use it
- Your child is stuck on a homework problem and your instinct is to just tell them the answer to move on, but you want to help them actually work through it instead.
- You don't remember the material well enough to explain it confidently and need a way to help productively anyway, without pretending to know something you don't.
- You want to know when to back off and let your child keep struggling versus when continued struggle is just frustration with no learning happening.

## The Prompt

```
You coach a parent on how to help their child through a specific homework problem, without doing the problem for them or handing over the answer directly.

Homework problem/topic: {{PROBLEM}}
Child's age/grade level: {{CHILD_LEVEL}}
Parent's own comfort with this material (confident, rusty, doesn't remember it at all): {{PARENT_COMFORT}}
What the child has tried so far, if known: {{CHILD_ATTEMPT}}

Instructions:
1. Give the parent 3-4 specific guiding questions to ask, in a sensible order, tailored to {{PROBLEM}} and {{CHILD_LEVEL}} — not generic "what do you think?" prompts, but questions that actually narrow toward the specific concept the child needs, similar in spirit to Socratic questioning but written for a parent who isn't a trained tutor to use directly.
2. If {{PARENT_COMFORT}} indicates the parent is rusty or doesn't remember the material, give the parent a short, plain-language refresher of just enough of the underlying concept for them to ask informed questions and recognize a correct answer — be explicit that this is for the parent's own confidence, not something to recite to the child.
3. Explicitly coach the parent on what to say if the child asks something the parent genuinely doesn't know: model honest phrasing ("I'm not sure either — let's figure it out together" or "let's look that up") rather than bluffing or deflecting, since kids notice bluffing and it undermines trust more than admitting uncertainty does.
4. Give the parent a concrete way to distinguish productive struggle from unproductive frustration: productive struggle usually still shows some forward movement (trying different approaches, partial progress) even if slow; genuine frustration often shows repeated identical failed attempts, rising emotional distress, or the child shutting down — describe what each looks like in practice, not just in the abstract.
5. If {{CHILD_ATTEMPT}} is provided, have the parent's first question build directly on what the child already tried, rather than starting over from scratch — this validates the child's effort and often reveals exactly where the misunderstanding is.
6. Give the parent a clear signal for when to step in more directly (explain the concept themselves, or say it's fine to leave it for tomorrow/ask the teacher) rather than pushing through indefinitely — persistence has a legitimate limit, especially for younger children or late in the evening.

Output format: Markdown with sections: Quick Refresher (only if {{PARENT_COMFORT}} needs it), Guiding Questions (in order), If You Don't Know Something, Struggle vs. Frustration signals, When to Step In.
```

## Variables
- `{{PROBLEM}}` — the specific homework problem or topic the child is stuck on. Required.
- `{{CHILD_LEVEL}}` — the child's age or grade level. Required — calibrates both the refresher's depth and the guiding questions' phrasing.
- `{{PARENT_COMFORT}}` — how well the parent remembers this material. Required — determines whether a refresher is needed and how much the parent can lean on their own knowledge versus guided questions alone.
- `{{CHILD_ATTEMPT}}` — what the child has already tried, if known. Optional, but sharpens the first guiding question if provided.

## Example
**Input:** `{{PROBLEM}}` = "Long division: 156 ÷ 12" `{{CHILD_LEVEL}}` = "4th grade" `{{PARENT_COMFORT}}` = "Rusty — hasn't done long division by hand in years, would need to think about the steps" `{{CHILD_ATTEMPT}}` = "Child wrote 156 ÷ 12 and then stopped, said 'I don't know where to start.'"

**Output (excerpt):**
```
### Quick Refresher
Long division answers "how many times does 12 fit into 156, working left to right in chunks." Start with the leftmost digits of 156 that are at least as big as 12 (here, "15"), figure out how many times 12 fits into 15 (once, with 3 left over), bring down the next digit to make "36," then figure out how many times 12 fits into 36 (3 times exactly). Answer: 13. This is just so you can follow along and recognize whether your child's steps make sense — you don't need to explain it this formally to them.

### Guiding Questions
1. "You wrote the problem down — what does division actually mean here? If you had 156 cookies and wanted to split them into groups of 12, what are you trying to find out?" (builds on what they already wrote, per {{CHILD_ATTEMPT}}, and reconnects to the concept before the procedure)
2. "Let's look at just the first part of 156 — the 15. Do you think 12 fits into 15 zero times, once, or more than once?"
3. "If 12 fits into 15 once, how much of the 15 is 'used up,' and how much is left over?"
4. "Now we bring down the next number, the 6, to join that leftover — what number does that make?"

### If You Don't Know Something
If your child asks a question about why a step works and you're not sure, it's fine to say: "That's a good question — I'm a little rusty on the reason for that step too, let's think about it together" or "let's look that up after we finish this one." Don't guess at an explanation you're not confident in — a wrong explanation is worse than an honest "let's find out."

### Struggle vs. Frustration
Productive struggle here looks like: your child trying a step, getting it wrong, and adjusting when you ask a follow-up question — some forward motion, even if slow. Frustration looks like: repeating "I don't know" without attempting a guess, tears, or pushing the paper away — if you see that, it's time to step in more directly rather than asking another question.

### When to Step In
If after 2-3 guiding questions your child is still stuck and showing frustration signals (not just taking their time), it's fine to work through one full example together step-by-step, narrating your thinking out loud, then have them try a similar problem on their own. That's not "giving the answer" — it's showing the process once before asking for independent application.
```

## Tips & Variations
- Pair with `socratic-tutor-for-a-specific-concept` (education-and-learning, already shipped) if the child is old enough and the parent wants a ready-made turn-by-turn script to read from directly, rather than guiding questions the parent adapts themselves — that prompt is written to be used with the learner directly; this one is written to coach the parent's own approach.
- For a subject the parent genuinely can't help with at all (a foreign language they don't speak, an unfamiliar new-math method), the honest move is often for the "Refresher" section to say so plainly and suggest the child ask their teacher rather than stretching this prompt past what it can responsibly support.
- Revisit the "When to Step In" guidance as the child gets older — the right threshold for stepping in shifts significantly between early elementary and middle school, and what counts as productive struggle at 8 looks different at 13.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

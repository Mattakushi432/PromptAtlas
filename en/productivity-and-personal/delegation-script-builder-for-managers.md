---
id: delegation-script-builder-for-managers
title: Delegation Script Builder for Managers
category: productivity-and-personal
tags: [delegation, management, productivity]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Drafts what a manager should actually say when delegating a specific task (context, success criteria, decision-making authority, check-in points) — a delegation-conversation planning tool, distinct from `weekly-priorities-planner-from-a-brain-dump` (productivity-and-personal), which decides what to do this week, not how to hand a specific task to someone else clearly.

## When to use it
- You're about to delegate something and know you tend to under-explain (leading to the wrong output) or over-explain (leading to micromanagement) — want a clear, calibrated script.
- A task you delegated before went sideways because the person didn't have context you assumed was obvious, and you want to avoid repeating that.
- You're delegating something with real ambiguity in it and need to think through, before the conversation, exactly how much decision-making latitude to actually hand over.

## The Prompt

```
You draft what a manager should say when delegating a specific task, covering context, success criteria, decision-making authority, and check-in points. You work from the manager's actual situation — you do not invent context about the task or the person that wasn't given.

Task being delegated: {{TASK}}
Who it's being delegated to (experience level, familiarity with this type of task): {{DELEGATE}}
What "done well" looks like: {{SUCCESS_CRITERIA}}
Decision-making latitude intended: {{AUTHORITY_LEVEL}}

Instructions:
1. Draft the delegation conversation with: why this task matters / how it fits the bigger picture (context most managers skip, which is exactly what causes misaligned output), what success looks like specifically (not just "do a good job"), what decisions the delegate can make independently vs. what needs to come back to the manager, and when/how check-ins will happen.
2. Calibrate the level of detail to {{DELEGATE}}'s experience level — more scaffolding and more explicit boundaries for someone newer to this type of task; less prescriptive detail (and more emphasis on outcome, less on process) for someone experienced, where over-specifying process reads as micromanagement.
3. Make {{AUTHORITY_LEVEL}} explicit and concrete — don't just say "use your judgment," specify actual examples of the kind of decision that's theirs to make versus the kind that needs manager input, since "use your judgment" without examples is exactly the vague delegation that leads to either paralysis or overreach.
4. If {{SUCCESS_CRITERIA}} is vague as given (e.g. "make it good"), push back and ask for something more concrete before drafting — a delegation script built on vague success criteria will just reproduce that vagueness in the actual conversation.
5. Propose a specific, appropriately-spaced check-in point (not "check in whenever," and not so frequent it undermines the delegation) based on the task's timeline and {{DELEGATE}}'s experience level.
6. Flag if the task, as described, seems like something that genuinely shouldn't be delegated yet (missing prerequisite context the delegate doesn't have, or stakes too high for the stated authority level) — delegation scripts shouldn't paper over a task that isn't actually ready to hand off.

Output format: a short script/talking-points outline (not a verbatim transcript) organized under Context / Success Criteria / Decision Authority / Check-ins, ready for the manager to use as a conversation guide.
```

## Variables
- `{{TASK}}` — the specific task being delegated. Required.
- `{{DELEGATE}}` — who's receiving it and their relevant experience level. Required — calibrates detail and scaffolding.
- `{{SUCCESS_CRITERIA}}` — what a good outcome looks like. Required.
- `{{AUTHORITY_LEVEL}}` — how much decision-making latitude is intended (e.g. "can make all implementation decisions, but check before changing the deadline or budget"). Required.

## Example
**Input:** `{{TASK}}` = "Redesigning our onboarding email sequence" `{{DELEGATE}}` = "Mid-level marketer, has written individual emails before but never owned a full sequence redesign" `{{SUCCESS_CRITERIA}}` = "Improve activation rate from the current sequence, keep brand voice consistent" `{{AUTHORITY_LEVEL}}` = "Can decide content/structure/timing independently; check before changing which product features are highlighted, since that ties to broader positioning"

**Output (excerpt):**
```
### Context
Explain why this matters now: activation rate has been flat, and the current sequence hasn't been touched in over a year. This isn't just "make the emails better" — it's specifically about improving the activation number, so that's the metric that defines success here.

### Success Criteria
Improved activation rate vs. the current sequence's baseline (share the actual current number so there's a concrete target to measure against — "improve" without a baseline is unmeasurable). Brand voice consistency — point to 1-2 examples of on-voice copy as a reference, don't just say "keep it consistent" without an anchor.

### Decision Authority
You own: email content, sequence structure, send timing/cadence. Check with me before: changing which product features are highlighted in the sequence — that connects to broader positioning decisions above this task's scope. Example of an in-scope call: deciding to add a 4th email to the sequence. Example of a check-first call: deciding to lead with a different core feature than what we currently emphasize.

### Check-ins
Given this is a first full sequence redesign (not just an email), suggest a check-in after the first draft outline (before full copy is written) rather than waiting until the whole thing is done — catches misalignment early without requiring approval on every individual email.
```

## Tips & Variations
- If you find yourself specifying authority-level examples for nearly every possible decision, that's a signal the task might not be ready to fully delegate yet — genuine delegation requires some real ambiguity being handed over, not every decision pre-answered.
- After the task is complete, it's worth a brief retro against this script: did the actual check-ins happen as planned, and did anything come back to the manager that should have been in the delegate's authority (or vice versa)? This calibrates the next delegation.
- For delegating an ongoing responsibility (not a one-off task), this prompt's structure still applies but the check-in cadence should be framed as recurring/ongoing rather than a single milestone check.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

---
id: weekly-priorities-planner-from-a-brain-dump
title: Weekly Priorities Planner from a Brain Dump
category: productivity-and-personal
tags: [task-planning, productivity, planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Turns an unstructured brain dump of tasks/worries/to-dos into a prioritized weekly plan — organizes and forces real prioritization decisions on what's already in your head, not a generic productivity framework applied to an empty list.

## When to use it
- You have a messy list of everything on your mind for the week (tasks, half-formed obligations, things you're worried about forgetting) and need it turned into an actual plan.
- You tend to treat everything as equally urgent and want to be forced into genuine prioritization rather than working through the list in whatever order it was written.
- You want a gut-check on whether your week is realistically scoped before it starts, not discover the overload on Wednesday.

## The Prompt

```
You turn an unstructured brain dump into a prioritized weekly plan. You force real prioritization decisions — you do not just reformat the list in its original order with headers added.

Brain dump: {{BRAIN_DUMP}}
Fixed commitments this week (meetings, appointments): {{FIXED_COMMITMENTS}}
Realistic available focus time: {{AVAILABLE_TIME}}

Instructions:
1. Sort every item from {{BRAIN_DUMP}} into: Must do this week (real deadline or real consequence for slipping), Should do this week (important but no hard deadline), and Could wait (nice to do, no real cost to deferring) — do not default everything to "must do," which is the most common brain-dump failure mode.
2. For anything genuinely ambiguous between tiers, ask what the actual consequence of not doing it this week would be — if there's no real consequence, it's not a "must."
3. Check the "Must do" list against {{AVAILABLE_TIME}}: if the must-dos alone exceed available time, say so explicitly and force a harder call (what actually gets bumped down or off, not a vague "try to fit it all in").
4. Distribute "Must do" and "Should do" items across specific days considering {{FIXED_COMMITMENTS}} — don't schedule deep-focus tasks into days already packed with meetings, and flag if a day has essentially no available focus time left.
5. For any item that's vague enough to not be actionable as stated ("deal with the budget thing"), flag it and ask for the concrete next action rather than scheduling a vague task that won't actually get started.
6. Keep "Could wait" items visible but explicitly deprioritized — don't just drop them silently, since an item disappearing from view is different from a deliberate decision to defer it.

Output format: Markdown with `## Must Do`, `## Should Do`, `## Could Wait` sections, then a `## This Week's Schedule` day-by-day placement of the Must/Should items, and a flag if the week is overloaded relative to {{AVAILABLE_TIME}}.
```

## Variables
- `{{BRAIN_DUMP}}` — the raw, unstructured list of everything on your mind. Required.
- `{{FIXED_COMMITMENTS}}` — meetings/appointments already locked into the week. Required — used to check realistic scheduling.
- `{{AVAILABLE_TIME}}` — a realistic estimate of actual focus time available (not total hours in the week). Required — without this, the plan can't flag overload.

## Example
**Input:** `{{BRAIN_DUMP}}` = "Finish the Q3 report (due Friday), respond to that client email from last week, look into the new CRM tool, book dentist appointment, prep for Monday's team meeting, think about the hiring plan, fix the broken build pipeline (blocking the team)" `{{FIXED_COMMITMENTS}}` = "Team meeting Monday 10am, 1:1s Tuesday and Thursday afternoon" `{{AVAILABLE_TIME}}` = "~4 hours of real focus time per day"

**Output (excerpt):**
```
## Must Do
- Fix the broken build pipeline — blocking the team, real ongoing cost every day it's not fixed.
- Finish the Q3 report — hard deadline Friday.
- Prep for Monday's team meeting — fixed commitment already on the calendar, needs prep beforehand.

## Should Do
- Respond to that client email — likely has a real but softer cost to delay; worth doing early in the week before it becomes urgent.
- Think about the hiring plan — important but no hard deadline stated.

## Could Wait
- Look into the new CRM tool — no stated urgency, genuinely deferrable.
- Book dentist appointment — real but low-stakes, doesn't need to happen this specific week unless there's a reason not stated.

## This Week's Schedule
Monday: [prep done before 10am] Team meeting. Afternoon: start build pipeline fix (highest priority, blocking others).
...

Flag: none — Must Do items fit within ~4hrs/day focus time across the week, though Monday is tight given the meeting prep + team meeting itself.
```

## Tips & Variations
- If the plan flags overload every week, that's worth addressing structurally (renegotiating scope, delegating, or being honest that the role/workload needs adjustment) rather than repeatedly forcing an unrealistic week to "fit."
- For a team or shared brain dump rather than individual, this prompt's tiering logic still works but needs an owner assigned per item — consider pairing with `delegation-script-builder-for-managers` (productivity-and-personal) for items that should move to someone else.
- Revisit mid-week if something urgent and unplanned comes in — re-run the prompt with the new item added rather than manually re-prioritizing from memory, so the tiering logic stays consistent.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

---
id: habit-tracker-reflection-prompt-generator
title: Habit Tracker Reflection Prompt Generator
category: productivity-and-personal
tags: [habit-building, productivity]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Generates a specific reflection prompt from raw habit-tracking data (what was tracked, the actual streak/miss pattern) — surfaces the pattern the data actually shows rather than a generic "how did this week go?" question, so the reflection targets what's really happening instead of inviting a vague self-report.

## When to use it
- You've been tracking a habit for a while and the raw check-mark data isn't turning into any real insight — you want a reflection question sharp enough to actually surface why it's working or not.
- A habit has stalled or you keep breaking a streak at a similar point, and want a prompt that targets that specific pattern rather than restarting with the same generic motivation.
- You're doing a periodic (weekly/monthly) habit review and want the reflection question to change based on what actually happened, not a static template repeated every time regardless of outcome.

## The Prompt

```
You generate a specific, pattern-targeted reflection question from raw habit-tracking data — not a generic "how did it go" prompt, but a question aimed at the actual pattern the data shows.

Habit being tracked: {{HABIT}}
Tracking data (dates/days completed vs. missed, over the tracked period): {{TRACKING_DATA}}
Anything already noticed or suspected about the pattern (optional): {{SUSPECTED_PATTERN}}

Instructions:
1. Identify the actual pattern in {{TRACKING_DATA}} first — not just the completion rate, but the shape: is it a slow decline, consistent except for specific days (e.g. always misses Mondays), an all-or-nothing streak-then-collapse pattern, or genuinely inconsistent with no visible pattern?
2. Generate a reflection question that targets that specific pattern, not a generic one — for a day-of-week pattern, ask about what's different on that day; for a streak-then-collapse pattern, ask what happens right before the collapse rather than asking generally "what got in the way."
3. If {{SUSPECTED_PATTERN}} is given, don't just confirm it — check whether {{TRACKING_DATA}} actually supports it or suggests something else, and frame the question to test the suspicion rather than assume it's correct.
4. Avoid a question that only invites a vague self-report ("did you feel motivated?") — prefer a question that asks for a specific, checkable detail (what time of day, what happened right before/after, what was different about the days it worked).
5. If the data shows the habit is actually going well (high completion, no concerning pattern), don't manufacture a problem to reflect on — generate a question aimed at what's making it work, so that can be reinforced or replicated for other habits.
6. Keep it to one primary question, not a list of five — a single sharp question that matches the data is more likely to get a real answer than a checklist that invites skimming.

Output format: one reflection question, followed by a one-sentence note on what pattern in {{TRACKING_DATA}} it's targeting and why.
```

## Variables
- `{{HABIT}}` — the habit being tracked. Required.
- `{{TRACKING_DATA}}` — the actual completion/miss data over the tracked period, as specific as available (dates, days of week, streak lengths). Required — the question is generated from this pattern, not from the habit description alone.
- `{{SUSPECTED_PATTERN}}` — anything already suspected about why it's going well or poorly. Optional, but the prompt will check it against the data rather than accept it uncritically.

## Example
**Input:** `{{HABIT}}` = "Morning workout" `{{TRACKING_DATA}}` = "Completed Mon-Thu every week for the last 5 weeks. Missed every Friday and Saturday. Completed Sunday about half the time." `{{SUSPECTED_PATTERN}}` = "I assumed I was just losing motivation by the end of the week."

**Output (excerpt):**
```
Reflection question: What's actually different about your Thursday night and Friday morning routine compared to Monday-Wednesday — specifically, what time do you go to bed, and is there a standing Thursday-night event (social plans, a later dinner, etc.) that's changing your Friday morning?

Targeting: The data shows a consistent, sharp Friday/Saturday drop-off, not a gradual motivation decline across the week (Mon-Thu is actually perfect) — this contradicts {{SUSPECTED_PATTERN}}'s "losing motivation by end of week" theory and points instead at something specific happening around Thursday night/Friday morning. The question targets that specific transition point rather than general end-of-week motivation, since the data doesn't actually support a gradual-decline story.
```

## Tips & Variations
- Pair with `weekly-priorities-planner-from-a-brain-dump` (productivity-and-personal, already shipped) if the reflection surfaces a scheduling conflict (e.g. a recurring Thursday-night commitment) — that prompt can help restructure the week around the newly identified constraint rather than just noting it.
- Run this periodically (weekly or monthly) rather than daily — a single day's data rarely shows a real pattern; the value here comes from spotting shapes across at least 2-3 weeks of tracking.
- If {{TRACKING_DATA}} is too sparse to show a real pattern yet (under ~2 weeks), say so rather than forcing a question from noise — a premature pattern-based question can send the reflection down a false trail.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

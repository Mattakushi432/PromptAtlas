---
id: spaced-repetition-study-plan-builder
title: Spaced-Repetition Study Plan Builder
category: education-and-learning
tags: [study-techniques, planning, education]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Builds a spaced-repetition review schedule for a set of study topics ahead of a deadline (exam, certification) — schedules genuine increasing-interval review of each topic, not a generic daily study checklist that treats every topic as equally due every day.

## When to use it
- You have a fixed exam/deadline and a list of topics to learn, and want a schedule that actually uses spaced repetition rather than cramming everything the week before.
- You're partway through studying and some topics need more review than others (based on how well you know them), and want a plan that reflects that instead of treating everything uniformly.
- You want to sanity-check whether your current ad hoc study schedule actually has enough repetition spacing before the exam, or if it's front- or back-loaded in a way that will hurt retention.

## The Prompt

```
You build a spaced-repetition study schedule for a set of topics ahead of a deadline. You schedule each topic for review at increasing intervals (not a fixed daily rotation) — topics reviewed successfully get longer gaps before their next review; topics that are weaker get reviewed sooner and more often.

Topics: {{TOPICS}}
Deadline: {{DEADLINE}}
Available study time: {{AVAILABLE_TIME}}
Current confidence per topic (if known): {{CONFIDENCE}}

Instructions:
1. Schedule each topic's first review soon (within a day or two of when it's first studied), then increase the interval before its next review each time it's successfully reviewed — use roughly doubling intervals as a starting heuristic (e.g. 1 day, 3 days, 7 days, 14 days) rather than fixed daily repetition, adjusted by {{CONFIDENCE}} if given.
2. If {{CONFIDENCE}} indicates a topic is already weak, schedule it more frequently and don't let its interval grow as quickly as a topic marked strong — spacing should be earned by demonstrated recall, not applied uniformly.
3. Distribute topics across available days so no single day is overloaded — check {{AVAILABLE_TIME}} against the total review load and flag explicitly if the schedule doesn't actually fit (too many topics for the available time before {{DEADLINE}}), rather than silently cramming an unrealistic number of reviews into each session.
4. Schedule a final comprehensive review pass covering all topics in the last few days before {{DEADLINE}}, separate from the topic-specific spaced reviews — this is the integration/synthesis pass, not a substitute for the spaced repetition itself.
5. For each scheduled session, specify which topics are due for review that day and roughly how long each should take, not just a vague "study for 2 hours."
6. If {{TOPICS}} includes clearly prerequisite relationships (topic B depends on understanding topic A), sequence the first study session for A before B, even if spacing logic alone wouldn't have ordered them that way.

Output format: a day-by-day schedule (Markdown table or list) from now until {{DEADLINE}}, each entry listing the date, topics due, and estimated time — plus a flag if the schedule is unrealistic given {{AVAILABLE_TIME}}.
```

## Variables
- `{{TOPICS}}` — the list of topics/subtopics to study. Required.
- `{{DEADLINE}}` — the exam/deadline date. Required.
- `{{AVAILABLE_TIME}}` — realistic study time per day/week. Required — without this, the schedule can't check feasibility.
- `{{CONFIDENCE}}` — current self-assessed confidence per topic, if known (e.g. "strong on X, weak on Y and Z"). Optional — improves interval calibration but not required for a first draft.

## Example
**Input:** `{{TOPICS}}` = "Cell structure, Photosynthesis, Cellular respiration, Genetics basics" `{{DEADLINE}}` = "14 days from now" `{{AVAILABLE_TIME}}` = "1 hour per day, 7 days a week" `{{CONFIDENCE}}` = "Comfortable with cell structure already, weak on genetics"

**Output (excerpt):**
```
| Day | Topics due | Est. time |
|---|---|---|
| Day 1 | First study: Cell structure (30 min), First study: Photosynthesis (30 min) | 60 min |
| Day 2 | First study: Cellular respiration (30 min), First study: Genetics basics (30 min, weak area — extra initial pass) | 60 min |
| Day 3 | Review: Cell structure (1-day interval, since already comfortable — quick check) | 20 min |
...
| Day 5 | Review: Genetics basics (shorter interval than other topics given weak starting confidence) | 30 min |
...

Flag: none — 4 topics across 14 days at ~1 hour/day fits comfortably with room for the final review pass in the last 2-3 days.
```

## Tips & Variations
- Update {{CONFIDENCE}} as you actually go through reviews (not just at the start) and regenerate the schedule partway through if a topic turns out weaker or stronger than initially assessed — spaced repetition works best when intervals reflect real, current performance, not a one-time guess.
- For language learning vocabulary (many small items rather than a few broad topics), this prompt's logic still applies but works better chunked into smaller batches per session rather than listing hundreds of individual words in `{{TOPICS}}` at once.
- If the deadline flag comes back unrealistic, don't just compress the schedule to fit — that defeats the purpose of spacing; instead consider dropping the lowest-priority topic(s) or genuinely increasing available study time.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

---
id: podcast-show-notes-and-timestamp-generator
title: Podcast Show Notes and Timestamp Generator
category: voice-and-audio
tags: [podcast, documentation]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Generates show notes (summary, key topics, guest bio blurb) plus accurate timestamped chapter markers from a raw episode transcript or detailed outline — documents an already-recorded episode, distinct from `podcast-episode-outline-from-raw-notes` (voice-and-audio, already shipped), which plans an episode's structure before recording rather than producing publish-ready notes after the fact.

## When to use it
- You just finished recording an episode and have a raw transcript or your recording-session notes, and need publish-ready show notes and chapter markers before the episode goes live.
- Your show notes have been thin or inconsistent between episodes and you want a repeatable process that reliably produces a summary, topic list, and timestamps from whatever raw material you have.
- You're going back through older episodes to add timestamped chapters retroactively (many podcast platforms now support them) and want a consistent format across a backlog of episodes.

## The Prompt

```
You generate podcast show notes and timestamped chapter markers from a raw transcript or detailed outline. You produce notes and timestamps that reflect what was actually discussed — you do not invent topics or guest details not present in the source material.

Raw transcript or detailed outline: {{RAW_CONTENT}}
Guest name and role, if applicable: {{GUEST_INFO}}
Episode number/title, if known: {{EPISODE_INFO}}

Instructions:
1. Write a 2-4 sentence compelling summary that captures what makes this specific episode worth listening to — not a generic "in this episode we discuss X" but something that would make someone scrolling a podcast app decide to click.
2. Extract a list of key topics/segments actually covered, in the order they occurred — each as a short, specific phrase (not "various topics" or an overly broad category that could describe any episode).
3. If {{GUEST_INFO}} is provided, write a short bio blurb (1-2 sentences) — use only what {{GUEST_INFO}} states or what's evident from the transcript itself; do not invent credentials, book titles, or background details not actually given.
4. Generate timestamped chapter markers: if {{RAW_CONTENT}} includes timestamps, use them directly; if it doesn't, generate topic-based chapter labels without fabricated timestamps and flag clearly that timing needs to be added manually against the actual audio.
5. Keep chapter labels specific and scannable — "Why most budgeting apps fail" rather than "Budgeting discussion" — since chapter markers are what a listener scans to jump to a specific part.
6. If {{EPISODE_INFO}} is provided, use it in a suggested title/episode heading; if not, suggest one based on the strongest topic or moment identified in {{RAW_CONTENT}}, clearly marked as a suggestion.

Output format: Markdown with sections: Summary, Guest Bio (if applicable), Key Topics (bulleted), Timestamped Chapters (numbered, with `[NEEDS TIMESTAMP]` placeholders if {{RAW_CONTENT}} lacks actual timing).
```

## Variables
- `{{RAW_CONTENT}}` — the raw transcript or detailed session outline/notes. Required.
- `{{GUEST_INFO}}` — the guest's name and role/background, if the episode features one. Optional — omit the bio section entirely if there's no guest.
- `{{EPISODE_INFO}}` — the episode number or working title, if already decided. Optional.

## Example
**Input:** `{{RAW_CONTENT}}` = "[00:00] Intro, welcome guest Maria Chen. [02:15] Maria explains why she left corporate finance to start a budgeting app. [11:40] Discussion of the 'envelope method' vs. modern app-based budgeting. [24:00] Common mistakes people make when starting to budget. [33:20] Where to find Maria's app and closing." `{{GUEST_INFO}}` = "Maria Chen, founder of a budgeting app, former corporate finance analyst" `{{EPISODE_INFO}}` = "Episode 47"

**Output (excerpt):**
```
### Summary
Maria Chen left a stable corporate finance career to build a budgeting app — and in this episode, she explains why the old-school "envelope method" might actually beat most modern budgeting apps, plus the single mistake nearly everyone makes when they start budgeting for the first time.

### Guest Bio
Maria Chen is the founder of a budgeting app and a former corporate finance analyst.

### Key Topics
- Why Maria left corporate finance to start a budgeting app
- Envelope method vs. modern app-based budgeting
- Common first-time budgeting mistakes

### Timestamped Chapters
1. [00:00] Intro & welcoming Maria Chen
2. [02:15] Why Maria left corporate finance
3. [11:40] Envelope method vs. app-based budgeting
4. [24:00] Common budgeting mistakes
5. [33:20] Where to find Maria's app & closing
```

## Tips & Variations
- Pair with `raw-transcript-cleanup-pass` (voice-and-audio, already shipped) first if {{RAW_CONTENT}} is a messy auto-generated transcript with filler words and errors — cleaning it up first makes topic extraction and summary quality noticeably better than working from raw ASR output.
- If {{RAW_CONTENT}} has no timestamps at all (just a topic outline from memory, not from the actual recording), be explicit with the client/host that all `[NEEDS TIMESTAMP]` placeholders require a pass against the actual audio before publishing — guessed timestamps that don't match the real audio are worse than no timestamps.
- For a show with a consistent recurring segment structure (a warm-up question, a main topic, a listener Q&A), consider adding that structure as context so chapter labels stay consistent in naming across episodes, not just accurate within a single one.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

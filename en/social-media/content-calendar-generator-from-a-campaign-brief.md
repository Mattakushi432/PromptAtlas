---
id: content-calendar-generator-from-a-campaign-brief
title: Content Calendar Generator from a Campaign Brief
category: social-media
tags: [content-calendar, social-media, planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Turns a campaign brief (goal, key dates, themes) into a structured content calendar (post dates, platform, content angle, format) — a planning tool that sequences content toward the campaign's actual goal, not a generic "post something every day" filler calendar.

## When to use it
- You have a campaign brief (a launch, a seasonal push, an event) and need a structured posting schedule rather than deciding what to post day-by-day reactively.
- You want to check whether your planned content actually builds toward the campaign goal in a logical sequence, or is just a scattered pile of individually-fine posts.
- You're handing off content planning to someone else and need a documented calendar with enough context (angle, not just topic) for them to execute without guessing your intent.

## The Prompt

```
You build a content calendar from a campaign brief. You sequence content toward the campaign's actual goal — you do not fill the calendar with generic, disconnected posts just to hit a posting frequency.

Campaign brief (goal, key dates, themes): {{BRIEF}}
Posting frequency/platforms: {{CADENCE}}
Campaign duration: {{DURATION}}

Instructions:
1. Identify the campaign's actual arc from {{BRIEF}} — most campaigns have a natural sequence (e.g. build awareness → build anticipation → announce/launch → sustain momentum → wrap-up), and posts should be sequenced to serve that arc, not randomly distributed across the duration.
2. For each scheduled post, specify: date, platform, content angle (the specific idea/hook, not just a topic label like "product features"), and format (single image, carousel, video, thread, etc.) — an angle like "feature X" is not specific enough; "how feature X solves [specific pain point], told through a before/after" is.
3. Anchor posts around {{BRIEF}}'s key dates explicitly — a launch date needs dedicated pre-launch build-up posts and a distinct launch-day post, not just business-as-usual content that happens to fall on that date.
4. Vary content angle and format across the calendar even within one campaign theme — repeating the same angle/format every post in a row, even if individually fine, reads as repetitive to a follower seeing the whole sequence.
5. Match {{CADENCE}} exactly — if the requested frequency doesn't realistically support the number of distinct angles the campaign needs, flag that rather than padding with filler content or repeating angles too closely together.
6. If {{BRIEF}} is thin on a specific theme relative to how many posts need to be scheduled around it, flag that gap explicitly rather than inventing campaign messaging not actually in the brief.

Output format: a Markdown table (Date | Platform | Angle | Format) sequenced across {{DURATION}}, with the campaign's key dates clearly marked, followed by a brief note on the overall arc logic.
```

## Variables
- `{{BRIEF}}` — the campaign's goal, key dates, and core themes/messaging. Required.
- `{{CADENCE}}` — posting frequency and which platforms (e.g. "3x/week on Instagram, daily on X"). Required.
- `{{DURATION}}` — the campaign's start and end dates. Required.

## Example
**Input:** `{{BRIEF}}` = "Launching a new product feature on March 15. Key theme: this solves the #1 customer complaint (manual data entry). Want awareness building beforehand and momentum after launch." `{{CADENCE}}` = "3x/week on LinkedIn and X" `{{DURATION}}` = "March 1 - March 22 (3 weeks)"

**Output (excerpt):**
```
| Date | Platform | Angle | Format |
|---|---|---|---|
| Mar 1 | LinkedIn | "The #1 complaint we hear from customers" — sets up the pain point without revealing the solution yet, builds curiosity | Single image/text post |
| Mar 4 | X | Same pain-point framing, shorter/punchier version for X's format | Text post |
| Mar 8 | LinkedIn | Behind-the-scenes: how the team approached solving it — builds anticipation with process, not spec details | Carousel |
| Mar 15 | LinkedIn + X | Launch day: direct announcement, clear before/after framing of the pain point now solved | Video demo |
| Mar 18 | LinkedIn | Early user reaction/testimonial (if available by then) — momentum-building social proof | Text + quote graphic |
...

Arc logic: Weeks 1-2 build awareness around the pain point without revealing the solution (curiosity-driving), launch day delivers the payoff directly, and the final week sustains momentum with real usage/proof rather than repeating the announcement.
```

## Tips & Variations
- If real engagement data becomes available partway through the campaign (e.g. one angle clearly outperforming another), it's worth regenerating the remaining calendar with that signal factored in rather than rigidly sticking to the original plan.
- For a multi-person content team, this calendar's "angle" column is the part most worth reviewing together before execution — misalignment on angle (not just topic) is a common source of a campaign feeling incoherent across contributors.
- Pair with `platform-native-post-adapter` (social-media) once each calendar slot's angle is set — this prompt plans what to post and when; that one adapts the actual content into each platform's native form.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

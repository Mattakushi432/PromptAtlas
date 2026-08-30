---
id: short-form-video-hook-generator
title: Short-Form Video Hook Generator
category: social-media
tags: [short-form-video, social-media, copywriting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Generates opening-line hook variants for a short-form video (TikTok/Reels/Shorts) from a video topic — focused specifically on the first 1-3 seconds that determine whether a viewer keeps watching, distinct from a full script tool: it produces hooks to choose from and test, not the whole video.

## When to use it
- You know what your short-form video is about but the opening line feels generic ("Hey guys, today I want to talk about...") and you suspect that's costing you retention in the first few seconds.
- You want several genuinely different hook angles to test against each other rather than one hook you're not sure is actually strong.
- You're scripting several videos on a similar topic and want hooks that don't all use the same structural trick, so your content doesn't feel formulaic across a series.

## The Prompt

```
You generate short-form video hooks: the first 1-3 seconds of spoken/on-screen text designed to stop a scroll. Each hook must use a genuinely different angle — not the same structure reworded.

Video topic: {{TOPIC}}
Target viewer: {{AUDIENCE}}
Number of hook variants: {{VARIANT_COUNT}}

Instructions:
1. Generate hooks using distinct angles drawn from: a specific counterintuitive claim ("X isn't the problem — Y is"), a direct callout to the target viewer ("If you [specific situation], watch this"), a curiosity gap ("The thing nobody tells you about X"), a bold/specific number or stat, an in-media-res moment (starting mid-action or mid-story rather than with a setup), or a direct question that the target viewer would genuinely stop to answer in their head. Do not generate more variants than there are genuinely different angles available for this specific topic — flag it if {{VARIANT_COUNT}} exceeds that.
2. Every hook must be deliverable in under 3 seconds when spoken at a natural pace — if a hook is too long to actually function as a fast hook, cut it down rather than presenting an overlong line as a hook.
3. Avoid generic opener patterns regardless of angle ("Hey guys," "So today I wanted to talk about," "Let's talk about") — these are exactly the openers that cost retention, and a "hook" that starts with one of these isn't actually a hook.
4. Ground each hook in something specific to {{TOPIC}}, not a generic hook template that could apply to almost any video ("You won't believe what happened when..." applied to literally anything is not a real hook, it's a template).
5. Calibrate language and reference points to {{AUDIENCE}} — a hook that assumes context the target viewer doesn't have won't land in the first second, which is exactly the window it needs to land in.
6. For each hook, note which angle it uses so the angles are auditable and comparably distinct, not accidentally overlapping.

Output format: a numbered list of hooks, each with a one-line note on its angle category.
```

## Variables
- `{{TOPIC}}` — what the video is actually about. Required.
- `{{AUDIENCE}}` — who the video is for, including what they already know/care about. Required — affects which angles will actually land.
- `{{VARIANT_COUNT}}` — how many hook options to generate. Required.

## Example
**Input:** `{{TOPIC}}` = "Most people set up their morning routine wrong because they copy what works for other people instead of designing around their own energy patterns" `{{AUDIENCE}}` = "People who've tried and failed at morning routines before" `{{VARIANT_COUNT}}` = "4"

**Output (excerpt):**
```
1. "Your 5am morning routine is failing because you're not a morning person — and that's fine." (Angle: counterintuitive claim + direct callout)
2. "I tried 6 different morning routines before I figured out what everyone gets wrong." (Angle: in-media-res, specific number)
3. "If you've ever felt like a failure for not being able to stick to a morning routine, this isn't your fault." (Angle: direct callout to a specific pain/shame point)
4. "What if the problem isn't your discipline — it's that you copied someone else's energy pattern?" (Angle: direct question + reframe)
```

## Tips & Variations
- Test multiple hook variants across similar videos rather than assuming one hook type works universally for your content — retention data per hook angle over time is far more reliable than guessing which angle "should" work best.
- Once a hook is selected, this prompt's job is done — for the rest of the video's structure/pacing, that's a separate scripting step outside this prompt's scope; a strong hook with a weak follow-through still loses the viewer, just a few seconds later.
- For a hook that needs on-screen text as well as spoken audio (common in short-form video), note that the two don't have to be identical — spoken hook and text-overlay hook can reinforce each other with slightly different phrasing rather than one just repeating the other verbatim.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

---
id: podcast-episode-outline-from-raw-notes
title: Podcast Episode Outline from Raw Notes
category: voice-and-audio
tags: [podcast, planning, content-creation]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Turns rough topic notes/talking points into a structured podcast episode outline (segments, talking points, transitions, timing) — a planning tool for recording, not a script: it structures what to cover and in what order, leaving the actual language for natural delivery.

## When to use it
- You have scattered notes/ideas for an episode and need them organized into a recordable structure before you sit down to record.
- You tend to ramble or lose the thread mid-recording and want a tighter outline to keep you on track without scripting every word.
- You're planning a guest interview and need a structured outline of topics/questions that still leaves room for organic conversation.

## The Prompt

```
You turn raw episode notes into a structured podcast outline: segments, key talking points per segment, transition notes between segments, and rough timing. You organize what's already in the notes — you do not invent new talking points or facts not present in the input.

Episode topic/notes: {{NOTES}}
Episode format: {{FORMAT}}
Target episode length: {{LENGTH}}
Guest (if any): {{GUEST_CONTEXT}}

Instructions:
1. Organize {{NOTES}} into segments with a clear purpose each (e.g. intro/hook, main topic breakdown, guest interview, listener question, wrap-up/call-to-action) appropriate to {{FORMAT}}.
2. For each segment, list key talking points as brief prompts/bullets, not full sentences to read verbatim — this is an outline for natural delivery, not a script; over-specifying the exact wording defeats the purpose of an outline.
3. Add a one-line transition note between segments (e.g. "pivot from the story into the main lesson") so the flow between topics doesn't feel abrupt when recording live.
4. Assign rough time estimates per segment that sum to {{LENGTH}} — if the notes contain more content than fits {{LENGTH}} well, flag it explicitly and suggest what to cut or move to a future episode, rather than cramming everything in shallowly.
5. If {{GUEST_CONTEXT}} is provided, include a distinct "interview questions" segment with specific, open-ended questions tailored to the guest's actual background/expertise (from {{GUEST_CONTEXT}}), not generic interview questions that could apply to any guest.
6. For the hook/intro, propose something specific to this episode's content, not a generic "welcome back to the show" — a strong hook should make clear why a listener should care about this specific episode.

Output format: Markdown, one section per segment with a time estimate, bullet talking points, and the transition note leading into the next segment.
```

## Variables
- `{{NOTES}}` — the raw, unstructured notes/ideas for the episode. Required.
- `{{FORMAT}}` — e.g. "solo commentary," "guest interview," "co-host conversation," "narrative/storytelling." Required — changes segment structure significantly.
- `{{LENGTH}}` — target episode length. Required — used to check realistic pacing.
- `{{GUEST_CONTEXT}}` — the guest's background and relevant expertise, if this is an interview episode. Optional — omit for solo/co-host formats.

## Example
**Input:** `{{NOTES}}` = "Want to talk about why most people fail at habit building. Key points: motivation fades, need systems not goals, environment design matters more than willpower, my own story of failing at gym habits for years until I changed my environment." `{{FORMAT}}` = "solo commentary" `{{LENGTH}}` = "20 minutes"

**Output (excerpt):**
```
## Hook / Intro (1-2 min)
- Open with the personal story hook: years of failing at gym habits — not a generic "welcome" opener, lead directly with the tension (why does this keep failing?).
Transition: pivot from "here's my failure" into "here's what I learned changes the equation."

## Main Segment: Why Motivation-Based Habits Fail (5-6 min)
- Motivation fades — it's not a reliable long-term driver
- The systems-vs-goals distinction
Transition: from the "why it fails" framing into the "what actually works" framing.

## Main Segment: Environment Design (6-7 min)
- Environment design matters more than willpower — the core reframe
- Tie back to personal story: what specifically changed in the environment
...
```

## Tips & Variations
- If the outline's time estimates consistently overshoot your target length once you actually record, that's useful calibration data — note your own actual pace and adjust future outline requests to account for it (e.g. request outlines for 15 minutes if you consistently run 25% over).
- For a recurring show format, save the segment structure that works and reuse it as a template — only the talking-point content needs regenerating per episode, not the overall shape.
- Pair with `raw-transcript-cleanup-pass` (voice-and-audio) after recording — this prompt structures the plan going in; that one cleans up what actually got said coming out.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

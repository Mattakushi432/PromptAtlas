---
id: video-script-beat-sheet-builder
title: Video Script Beat Sheet Builder
category: writing-and-content
tags: [scriptwriting, copywriting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Plans a video's structure as a beat sheet (the sequence of narrative/informational beats and roughly how long each should run) before any script prose is written — catches pacing and structure problems while they're still cheap to fix, distinct from writing dialogue or narration line-by-line, which locks in a structure that's expensive to restructure after the fact.

## When to use it
- You're planning a video (explainer, tutorial, brand story, short-form content) and want to nail down the structure and pacing before writing actual script lines, so a structural problem doesn't get discovered mid-script.
- You have a rough idea of what the video should cover but it's not yet clear what order things should go in or how long each part should actually take relative to the whole.
- You're reviewing someone else's video script and suspect a pacing problem (the setup drags, the payoff feels rushed) — reducing it to a beat sheet makes the structural issue visible separate from the prose quality.

## The Prompt

```
You build a beat sheet for a video — the sequence of narrative/informational beats and their relative timing — before any script prose is written. You are planning structure and pacing, not writing dialogue or narration lines.

Video concept/topic: {{VIDEO_CONCEPT}}
Target total length: {{TARGET_LENGTH}}
Video type (explainer, tutorial, brand story, short-form hook-driven): {{VIDEO_TYPE}}

Instructions:
1. Break the video into distinct beats — each beat is one functional unit (a hook, a problem statement, a specific step, a turning point, a call to action) not a scene-by-scene shot list and not full script prose.
2. Assign each beat an approximate time allocation that sums to {{TARGET_LENGTH}}, and justify allocations that aren't roughly even — e.g. a hook for a short-form video needs disproportionate attention relative to its brief screen time, while a tutorial's main instructional steps should get the bulk of the runtime, not the intro.
3. Calibrate structure to {{VIDEO_TYPE}}: a short-form hook-driven video needs the hook resolved or escalated within the first few seconds or it loses viewers; a tutorial needs a clear step sequence with a recap; a brand story typically needs a recognizable narrative arc (situation, tension, resolution) rather than a flat feature list.
4. Flag any beat that's disproportionately long relative to how much it actually needs to convey, or disproportionately short for something that needs real explanation — pacing problems are much cheaper to catch and fix at the beat-sheet stage than after full script prose is written around a bad structure.
5. Check the ending: does the final beat give the viewer something concrete to do or think (a specific call to action, a clear takeaway), or does the video just stop once the content runs out? A beat sheet that ends on "and that's it" rather than a deliberate closing beat is a structural gap, not a minor detail to patch later.
6. If {{VIDEO_CONCEPT}} tries to cover more ground than {{TARGET_LENGTH}} can reasonably fit, say so explicitly and recommend what to cut, rather than allocating unrealistically short time to too many beats — a beat sheet that looks complete on paper but can't actually be delivered at the stated pace isn't a usable plan.

Output format: a numbered list of beats, each with: beat name, one-line description of what happens in it, and time allocation (with running total). End with a one-line note on the ending beat's specific call-to-action/takeaway, or a flag if one is missing.
```

## Variables
- `{{VIDEO_CONCEPT}}` — the video's topic/concept, in whatever level of detail currently exists. Required.
- `{{TARGET_LENGTH}}` — the intended total video length. Required — beat timing can't be planned without a real length target.
- `{{VIDEO_TYPE}}` — the category of video, since pacing conventions differ substantially by type. Required.

## Example
**Input:** `{{VIDEO_CONCEPT}}` = "A 60-second video explaining why our app's new offline mode matters, aimed at existing users who don't know about the feature yet" `{{TARGET_LENGTH}}` = "60 seconds" `{{VIDEO_TYPE}}` = "Short-form, hook-driven"

**Output (excerpt):**
```
1. Hook — open on a relatable frustration moment (losing connection mid-task, app becomes unusable) — 0:00-0:06 (running total: 0:06)
2. Problem naming — name the specific pain point explicitly: "you lose your work when your connection drops" — 0:06-0:12 (0:12)
3. Feature reveal — introduce offline mode as the direct answer to the just-named problem, showing the actual UI/experience — 0:12-0:30 (0:30)
4. Proof/specificity — one concrete detail that makes the claim credible (what exactly stays available offline, how sync works when reconnected) — 0:30-0:48 (0:48)
5. Call to action — where to find/enable the feature, stated as a specific action, not a vague "check it out" — 0:48-0:60 (1:00)

Ending beat: gives a specific action (where to enable offline mode) rather than ending on the feature explanation alone — no flag needed.

Note on beat 3: allocated the largest single chunk (18 seconds) since it's carrying the actual feature reveal and needs to visually demonstrate the UI, not just state the feature exists — this is the core content the hook promised, so it earns the most time.
```

## Tips & Variations
- Pair with `short-form-video-hook-generator` (social-media, already shipped) specifically for beat 1 in a short-form video — that prompt is scoped to generating the hook itself; this prompt plans where that hook fits in the overall structure and how much runtime the rest of the video actually needs.
- Once the beat sheet is approved, write script prose beat-by-beat rather than all at once — it's much easier to keep pacing on target when writing to a specific time allocation per beat than writing freely and hoping the total comes out right.
- For a video with a hard, non-negotiable runtime (a 15-second ad slot), treat step 6's "if it doesn't fit, cut something" check as mandatory, not optional — a beat sheet that technically fits the time budget on paper often runs long once actual dialogue/narration pacing is accounted for, so leave real margin rather than allocating every second.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

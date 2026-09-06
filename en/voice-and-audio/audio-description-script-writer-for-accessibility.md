---
id: audio-description-script-writer-for-accessibility
title: Audio Description Script Writer for Accessibility
category: voice-and-audio
tags: [scriptwriting, accessibility]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Writes an audio description script that narrates visually-conveyed information for blind and low-vision viewers — describes what's happening on screen concisely enough to fit the available gaps in existing dialogue/narration, without describing so little that plot-relevant visual information is lost or so much that it talks over dialogue.

## When to use it
- You're producing accessible video content and need an audio description track written for a scene or full piece, not just a general summary of what happens.
- You have a draft audio description that either talks over existing dialogue or misses visually-essential plot information, and want it checked and rewritten against the actual timing constraints.
- You're new to writing audio description and want a starting script that follows the discipline (objective description, no interpretation, fits the silence gaps) rather than freeform narration.

## The Prompt

```
You write an audio description script that narrates visually-conveyed information for blind and low-vision viewers. You describe only what is objectively visible — you do not interpret characters' emotions or intentions unless those are conveyed through a specific visible action worth describing (a clenched fist, not "he feels angry").

Scene/content description (what's happening visually, shot by shot if possible): {{SCENE_DESCRIPTION}}
Available silence gaps for description (timestamps or approximate duration between dialogue lines): {{AVAILABLE_GAPS}}
What existing dialogue/narration already conveys (so it isn't redundantly re-described): {{EXISTING_AUDIO}}

Instructions:
1. Identify what visual information in {{SCENE_DESCRIPTION}} is actually necessary to follow the plot/content and isn't already conveyed by {{EXISTING_AUDIO}} — a visual detail already implied by dialogue ("look at that scar" when a character then describes the scar) doesn't need separate narration.
2. Describe objectively and concretely: what's visible, not what it means — "she slams the door and walks away" rather than "she's furious," letting the described action itself convey the emotion the way a sighted viewer would infer it from watching, not by stating the interpretation directly.
3. Fit each description to its available time slot in {{AVAILABLE_GAPS}} — write the description first for completeness, then tighten it to fit the actual available duration; a description that's accurate but too long to fit before the next dialogue line starts is not usable as written.
4. Prioritize when a gap is too short for everything relevant: essential plot/character information (a significant action, a new character's entrance, a scene/location change) takes priority over secondary visual detail (background elements, minor gestures) when both can't fit.
5. Use present tense and active, concise verbs — audio description convention favors "she opens the drawer" over "she is in the process of opening the drawer," since brevity matters more here than in general narration.
6. Flag any point where {{AVAILABLE_GAPS}} appears too short for any version of the truly essential information to fit — this is a real production constraint (the content itself may need a longer pause added, or the description moved to a different point) and shouldn't be silently worked around with an incomplete or rushed description.

Output format: a timed script — each entry showing the gap/timestamp, the description text, and its estimated spoken duration versus the available gap. Flag any gap where the essential description doesn't fit within the available time.
```

## Variables
- `{{SCENE_DESCRIPTION}}` — what's happening visually in the content, ideally shot-by-shot or beat-by-beat. Required.
- `{{AVAILABLE_GAPS}}` — the actual silence windows available for description, with timing. Required — without real timing constraints, the description can't be checked for whether it actually fits.
- `{{EXISTING_AUDIO}}` — what the existing dialogue/narration/sound already conveys, so description doesn't redundantly restate it. Required — without this, descriptions risk either gap-filling with already-known information or missing what's genuinely not covered.

## Example
**Input:** `{{SCENE_DESCRIPTION}}` = "A woman enters a dimly lit kitchen, opens a drawer, and pulls out an old photograph. She stares at it for a long moment before placing it on the counter." `{{AVAILABLE_GAPS}}` = "4-second silence gap right after she enters, before any dialogue" `{{EXISTING_AUDIO}}` = "No dialogue in this beat; ambient music only, no lyrics"

**Output (excerpt):**
```
### Gap: 0:00-0:04 (4-second silence after entrance)
Description: "She opens a drawer and takes out an old photograph."
Estimated spoken duration: ~2.5 seconds — fits within the 4-second gap with room to spare.

Note: The full scene includes her staring at the photo and placing it on the counter, but that additional detail doesn't fit in this single 4-second gap alongside the drawer/photograph action, which is the higher-priority plot-relevant detail (introduces the photograph as a significant object). If a later gap exists before the scene continues, the staring/placing beat could be described there instead — flag if no such gap exists, since that detail would then be lost entirely rather than just delayed.
```

## Tips & Variations
- Pair with `sound-design-brief-from-a-scene-description` (voice-and-audio, already shipped) when a scene needs both accessibility description and a sound design pass — they're separate deliverables, but both start from the same scene breakdown, so drafting them together avoids re-describing the same scene from scratch twice.
- Audio description conventions vary somewhat by industry/region (broadcast vs. streaming vs. museum/gallery audio guides) — if a specific style guide applies, provide its key rules as additional context, since this prompt's defaults follow general best practice, not any single standard's exact house style.
- For content with frequent, tightly-timed visual information (fast-paced action, rapid scene changes), expect more flagged "doesn't fit" gaps than for slower-paced content — that's a real signal to raise with the production team about extended/gap-inserted description tracks, not something to solve by cramming description into an unrealistic timeframe.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

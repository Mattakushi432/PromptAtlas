---
id: environment-concept-art-mood-board-set
title: Environment Concept Art Mood Board Set
category: creative-and-visual
tags: [concept-art, illustration]
target_models: [Midjourney, DALL-E 3, Stable Diffusion]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Builds a base environment description plus a small set (3-4) of variant prompts exploring different times-of-day/lighting or different framings of the same location — the same consistency discipline as a character sheet, applied to one setting instead of one character, so a mood board reads as one coherent place rather than several unrelated environments.

## When to use it
- You're establishing a location for a game, animation, or illustrated story and want a mood board that explores the same place under different lighting/framing, not four disconnected environments.
- You've generated environment concepts separately and they don't feel like the same world (different architecture details, different color temperature, different scale cues) and need a tighter base description to anchor them.
- You want to present a location's range early in pre-production — a wide establishing shot, a close detail shot, a key vantage point — before committing further art direction time.

## The Prompt

```
[BASE LOCATION DESCRIPTION — reuse verbatim across every variant]
{{LOCATION_DESCRIPTION}}, {{ART_STYLE}}

[VARIANT — change only this line per generation]
{{TIME_OF_DAY_OR_FRAMING}}

Full prompt per variant: {{LOCATION_DESCRIPTION}}, {{TIME_OF_DAY_OR_FRAMING}}, {{ART_STYLE}}, environment concept art, consistent world design --ar {{ASPECT_RATIO}}
```

## Variables
- `{{LOCATION_DESCRIPTION}}` — an exhaustive, fixed description of the location's unchanging defining features: architecture/terrain type, key landmarks, materials and color palette, scale cues, and any unique identifying elements. Required — reused verbatim across every variant, the same way a character's base description is; small wording drift between variants is a common cause of the set no longer reading as one place.
- `{{ART_STYLE}}` — the rendering style, kept identical across the set (e.g. "painterly matte painting, muted earth tones," "stylized low-poly 3D render"). Required.
- `{{TIME_OF_DAY_OR_FRAMING}}` — the one thing that changes per image: either a lighting condition (e.g. "golden hour, long shadows," "overcast midday, flat diffuse light," "moonlit night, cool blue tones") or a framing choice (e.g. "wide establishing shot from a distant hilltop," "close detail shot of the main entrance," "a key vantage point looking down the main street"). Required.
- `{{ASPECT_RATIO}}` — kept identical across the set unless a specific variant needs a different composition (e.g. a wide establishing shot might warrant a wider ratio than a detail shot). Optional to vary, but state explicitly when it changes.

## Example
**Input:** `{{LOCATION_DESCRIPTION}}` = "A cliffside coastal village, whitewashed stone houses with terracotta roofs stacked up a steep hillside, a stone stairway winding down to a small harbor, weathered wooden fishing boats, sparse windswept pine trees" · `{{ART_STYLE}}` = "painterly matte painting, warm Mediterranean color palette" · `{{ASPECT_RATIO}}` = "16:9"

**Variant 1 — Wide establishing shot, golden hour:**
```
A cliffside coastal village, whitewashed stone houses with terracotta roofs stacked up a steep hillside, a stone stairway winding down to a small harbor, weathered wooden fishing boats, sparse windswept pine trees, wide establishing shot from a distant hilltop, golden hour, long warm shadows, painterly matte painting, warm Mediterranean color palette, environment concept art, consistent world design --ar 16:9
```

**Variant 2 — Close detail shot, overcast:**
```
A cliffside coastal village, whitewashed stone houses with terracotta roofs stacked up a steep hillside, a stone stairway winding down to a small harbor, weathered wooden fishing boats, sparse windswept pine trees, close detail shot of the stone stairway and harbor, overcast midday, flat diffuse light, painterly matte painting, warm Mediterranean color palette, environment concept art, consistent world design --ar 16:9
```

## Tips & Variations
- Pair with `consistent-character-sheet-prompt-series` (creative-and-visual, already shipped) as the direct conceptual parallel — both rely on an identical, verbatim-reused base description plus one changing variable per generation; use both together when a character needs to be shown established in this same location.
- If two variants meant to be the "same place" end up with visibly different architectural details or proportions (a common failure since even an exhaustive base description doesn't lock down every detail), note which specific detail drifted and add it explicitly to {{LOCATION_DESCRIPTION}} for the next regeneration round rather than regenerating blind.
- For a location that needs to support both daytime and nighttime scenes in production, generate the lighting variants early and check they still read as clearly the same place at a glance — if the night variant loses recognizable landmarks entirely, add a specific "still visible at night" cue (e.g. "lit windows," "moonlit rooftops") to that variant's prompt.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

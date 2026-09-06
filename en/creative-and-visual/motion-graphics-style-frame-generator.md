---
id: motion-graphics-style-frame-generator
title: Motion Graphics Style Frame Generator
category: creative-and-visual
tags: [concept-art, consistency]
target_models: [Midjourney, DALL-E 3, Stable Diffusion]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Builds a base motion-graphics visual system (color palette, shape/line language, typography treatment, implied motion character) plus a small set of key style frames — a title/intro card, a data/info frame, a transition frame, and an outro/CTA card — establishing a motion graphics piece's look before any actual animation work begins. Distinct from a narrative shot storyboard: there's no recurring subject or story beat here, just a graphic design system expressed as still frames an animator or motion designer can approve and build from.

## When to use it
- You're kicking off a motion graphics piece (explainer video, title sequence, brand intro, data-viz segment) and need to lock a visual style before animating, since re-styling after animation work has started is expensive.
- Stakeholders need to approve a "look" — palette, iconography, typography — for a motion piece, and still frames are faster and cheaper to iterate on than test animations.
- You've received motion graphics footage or a style board that felt inconsistent between segments (title card vs. data screen vs. outro) and want a tighter base specification to unify them.

## The Prompt

```
[VISUAL SYSTEM — reuse verbatim across every style frame]
{{COLOR_PALETTE}}, {{SHAPE_AND_LINE_LANGUAGE}}, {{TYPOGRAPHY_TREATMENT}}, {{MOTION_IMPLIED_STYLE}}

[FRAME 1 — Title/intro card]
Title card design, "{{TITLE_TEXT}}", {{COLOR_PALETTE}}, {{SHAPE_AND_LINE_LANGUAGE}}, {{TYPOGRAPHY_TREATMENT}}, {{MOTION_IMPLIED_STYLE}}, motion graphics style frame, flat vector design --ar {{ASPECT_RATIO}}

[FRAME 2 — Data/info frame]
Data visualization frame showing {{DATA_CONCEPT}}, {{COLOR_PALETTE}}, {{SHAPE_AND_LINE_LANGUAGE}}, {{TYPOGRAPHY_TREATMENT}}, {{MOTION_IMPLIED_STYLE}}, motion graphics style frame, flat vector design --ar {{ASPECT_RATIO}}

[FRAME 3 — Transition frame]
Abstract transition frame built from {{TRANSITION_MOTIF}}, {{COLOR_PALETTE}}, {{SHAPE_AND_LINE_LANGUAGE}}, {{MOTION_IMPLIED_STYLE}}, motion graphics style frame, flat vector design --ar {{ASPECT_RATIO}}

[FRAME 4 — Outro/CTA card]
Outro card design, "{{CTA_TEXT}}", {{COLOR_PALETTE}}, {{SHAPE_AND_LINE_LANGUAGE}}, {{TYPOGRAPHY_TREATMENT}}, {{MOTION_IMPLIED_STYLE}}, motion graphics style frame, flat vector design --ar {{ASPECT_RATIO}}
```

## Variables
- `{{COLOR_PALETTE}}` — a specific, named palette (e.g. "electric violet, deep navy, and a single warm coral accent") kept identical across all four frames. Required.
- `{{SHAPE_AND_LINE_LANGUAGE}}` — the graphic vocabulary (e.g. "rounded geometric shapes, thick consistent line weight, no gradients"). Required.
- `{{TYPOGRAPHY_TREATMENT}}` — how type should look and behave (e.g. "bold condensed sans-serif, oversized, tight tracking"). Required for frames carrying text.
- `{{MOTION_IMPLIED_STYLE}}` — how the style should read even though these are stills (e.g. "implies snappy, elastic motion," "implies slow, floating drift") — this cues the animator on intended motion character, not just static look. Required.
- `{{TITLE_TEXT}}` / `{{CTA_TEXT}}` — the actual text content for the title and outro cards. Required for those two frames.
- `{{DATA_CONCEPT}}` — what the data/info frame should visualize (e.g. "a rising bar chart comparing three growth metrics"). Required for Frame 2.
- `{{TRANSITION_MOTIF}}` — a graphic motif the transition should be built from (e.g. "overlapping expanding circles," "a shattering grid"). Required for Frame 3.
- `{{ASPECT_RATIO}}` — kept identical across the set, matching the final delivery format (e.g. "16:9" for a landscape explainer, "9:16" for a vertical social cut). Required.

## Example
**Input:** `{{COLOR_PALETTE}}` = "electric violet, deep navy, single warm coral accent" · `{{SHAPE_AND_LINE_LANGUAGE}}` = "rounded geometric shapes, thick consistent line weight, no gradients" · `{{TYPOGRAPHY_TREATMENT}}` = "bold condensed sans-serif, oversized, tight tracking" · `{{MOTION_IMPLIED_STYLE}}` = "implies snappy, elastic motion" · `{{TITLE_TEXT}}` = "Meet Flowpath" · `{{DATA_CONCEPT}}` = "a rising line chart showing weekly active users climbing over 6 months" · `{{TRANSITION_MOTIF}}` = "overlapping expanding circles" · `{{CTA_TEXT}}` = "Try it free" · `{{ASPECT_RATIO}}` = "16:9"

**Frame 1 — Title/intro card:**
```
Title card design, "Meet Flowpath", electric violet, deep navy, single warm coral accent, rounded geometric shapes, thick consistent line weight, no gradients, bold condensed sans-serif, oversized, tight tracking, implies snappy, elastic motion, motion graphics style frame, flat vector design --ar 16:9
```

**Frame 2 — Data/info frame:**
```
Data visualization frame showing a rising line chart showing weekly active users climbing over 6 months, electric violet, deep navy, single warm coral accent, rounded geometric shapes, thick consistent line weight, no gradients, bold condensed sans-serif, oversized, tight tracking, implies snappy, elastic motion, motion graphics style frame, flat vector design --ar 16:9
```

**Frame 4 — Outro/CTA card:**
```
Outro card design, "Try it free", electric violet, deep navy, single warm coral accent, rounded geometric shapes, thick consistent line weight, no gradients, bold condensed sans-serif, oversized, tight tracking, implies snappy, elastic motion, motion graphics style frame, flat vector design --ar 16:9
```

## Tips & Variations
- Pair with `short-form-video-storyboard-prompt-sequence` (creative-and-visual, already shipped) for the narrative counterpart: that prompt tracks a story with a recurring subject across live-action-style shots, while this one tracks a graphic design system with no subject continuity at all. Use the storyboard prompt when the piece has character- or footage-driven beats, and this one when it's abstract/graphic-driven.
- These frames are style references for an animator, not the animation itself — hand the approved set to whoever builds the piece along with `{{MOTION_IMPLIED_STYLE}}`'s intent described in plain language, since a still frame alone can't specify timing, easing, or transition mechanics.
- If a frame breaks the palette or shape language (a common drift point when `{{DATA_CONCEPT}}` or `{{TRANSITION_MOTIF}}` pulls toward a different visual metaphor than the rest of the set), regenerate it directly alongside one already-approved frame rather than in isolation, so drift is visible immediately.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

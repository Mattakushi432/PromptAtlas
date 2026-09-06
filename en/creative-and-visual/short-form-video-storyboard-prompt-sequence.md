---
id: short-form-video-storyboard-prompt-sequence
title: Short-Form Video Storyboard Prompt Sequence
category: creative-and-visual
tags: [short-form-video, consistency]
target_models: [Midjourney, DALL-E 3, Stable Diffusion]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Builds a base visual-style specification plus a sequence of 4-6 storyboard-frame prompts for a short-form video concept — each frame prompt covers one distinct beat/shot while reusing an identical style specification (and, where a subject recurs across frames, an identical subject description) so the frames read as one planned sequence instead of unrelated single images. This is a storyboard planning tool for pre-production, not a video-generation prompt — each frame is a still image to plan and pitch the sequence before shooting or generating actual motion.

## When to use it
- You're planning a short-form video (a product demo, a brand story beat, a social ad) and want a visual storyboard to pitch or shot-list before committing to production or a video-generation tool.
- You've generated a few storyboard frames independently and they don't feel like the same video — different lighting, different subject appearance, inconsistent framing — and need a more disciplined base prompt to bring the sequence in line.
- You want to test whether a shot sequence actually reads clearly as a story beat-to-beat before spending production time or video-generation credits on the full sequence.

## The Prompt

```
[BASE VISUAL STYLE — reuse verbatim across every frame]
{{VISUAL_STYLE}}, {{COLOR_GRADE}}, {{CAMERA_TREATMENT}}

[RECURRING SUBJECT — reuse verbatim across every frame that includes it; omit if no recurring subject]
{{SUBJECT_DESCRIPTION}}

[FRAME 1 — {{BEAT_1_LABEL}}]
{{BEAT_1_SHOT}}

[FRAME 2 — {{BEAT_2_LABEL}}]
{{BEAT_2_SHOT}}

[FRAME 3 — {{BEAT_3_LABEL}}]
{{BEAT_3_SHOT}}

Full prompt per frame: {{SUBJECT_DESCRIPTION (if present in that frame)}}, {{BEAT_N_SHOT}}, {{VISUAL_STYLE}}, {{COLOR_GRADE}}, {{CAMERA_TREATMENT}}, storyboard frame, cinematic still --ar {{ASPECT_RATIO}}
```

## Variables
- `{{VISUAL_STYLE}}` — the overall rendering/production style, kept identical across every frame (e.g. "clean commercial product photography style," "warm handheld documentary style"). Required — this is the primary lever for the sequence reading as one production.
- `{{COLOR_GRADE}}` — a specific, named color treatment reused across frames (e.g. "warm golden-hour tones, slightly desaturated shadows"), not a vague "nice colors" — inconsistent color grading is one of the most common reasons a storyboard sequence looks disjointed.
- `{{CAMERA_TREATMENT}}` — lens/framing character kept consistent (e.g. "shallow depth of field, 35mm lens look," "wide-angle, slight fisheye distortion"). Required.
- `{{SUBJECT_DESCRIPTION}}` — if a person, product, or object recurs across multiple frames, an exhaustive fixed description of it (same discipline as `consistent-character-sheet-prompt-series`'s base description) — reused verbatim in every frame it appears in. Omit this block entirely if no subject recurs (e.g. a purely product/environment sequence).
- `{{BEAT_1_LABEL}}` / `{{BEAT_2_LABEL}}` / `{{BEAT_3_LABEL}}` (extend to 4-6 as needed) — a short label naming what story beat this frame covers (e.g. "Problem," "Product Reveal," "Payoff"). Required — naming the beat, not just the shot, keeps the sequence anchored to the story arc rather than becoming a series of pretty but disconnected images.
- `{{BEAT_1_SHOT}}` / `{{BEAT_2_SHOT}}` / `{{BEAT_3_SHOT}}` — the specific shot content and framing for that beat (e.g. "close-up on frustrated hands struggling with tangled cables," "wide shot, product on a pedestal, dramatic single light source"). Required per frame.
- `{{ASPECT_RATIO}}` — kept identical across the sequence, typically matching the target platform (e.g. "9:16" for vertical social video). Required.

## Example
**Input:** `{{VISUAL_STYLE}}` = "clean modern commercial style, minimal set design" · `{{COLOR_GRADE}}` = "cool blue-grey shadows, warm skin tones" · `{{CAMERA_TREATMENT}}` = "shallow depth of field, 50mm lens look" · `{{SUBJECT_DESCRIPTION}}` = "a sleek matte-black wireless earbuds case, rounded rectangle shape, subtle logo on lid" · `{{ASPECT_RATIO}}` = "9:16"

**Frame 1 — Problem:**
```
a sleek matte-black wireless earbuds case, rounded rectangle shape, subtle logo on lid, close-up on a tangled mess of old wired earbuds on a desk, frustrated hand reaching to untangle them, clean modern commercial style, minimal set design, cool blue-grey shadows, warm skin tones, shallow depth of field, 50mm lens look, storyboard frame, cinematic still --ar 9:16
```

**Frame 2 — Product Reveal:**
```
a sleek matte-black wireless earbuds case, rounded rectangle shape, subtle logo on lid, case opening with a soft glow, earbuds visible inside, centered hero shot on clean surface, clean modern commercial style, minimal set design, cool blue-grey shadows, warm skin tones, shallow depth of field, 50mm lens look, storyboard frame, cinematic still --ar 9:16
```

**Frame 3 — Payoff:**
```
a sleek matte-black wireless earbuds case, rounded rectangle shape, subtle logo on lid, person wearing the earbuds, relaxed confident expression, walking outdoors in soft daylight, clean modern commercial style, minimal set design, cool blue-grey shadows, warm skin tones, shallow depth of field, 50mm lens look, storyboard frame, cinematic still --ar 9:16
```

## Tips & Variations
- Pair with `consistent-character-sheet-prompt-series` (creative-and-visual, already shipped) if {{SUBJECT_DESCRIPTION}} is a human character rather than a product — that prompt's pose/expression variant structure can generate the character reference frames to keep in sync with this sequence's beats.
- These are still-frame storyboard prompts, not motion-generation prompts — treat the output as a pitch/planning artifact to confirm the shot sequence and visual direction before moving to actual video production or a dedicated video-generation tool, where framing, timing, and motion get specified separately.
- If a frame's result breaks visual consistency with the others (wrong color grade, subject drifted), don't just regenerate that one frame in isolation — regenerate it alongside an already-approved frame using the identical base specification, and compare them side by side, since isolated regeneration makes drift harder to catch.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

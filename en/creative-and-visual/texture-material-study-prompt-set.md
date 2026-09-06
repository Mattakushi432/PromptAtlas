---
id: texture-material-study-prompt-set
title: Texture/Material Study Prompt Set
category: creative-and-visual
tags: [illustration, photography, consistency]
target_models: [Midjourney, DALL-E 3, Stable Diffusion]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Generates a small set of close-up material-study prompts — for example a fabric weave, brushed metal, or wood grain, shown in a few finish or condition variants — for a described surface, producing reference/mood-board-quality macro texture images rather than a finished product or environment shot.

## When to use it
- You're building a materials mood board for a product, interior, or game asset and need close-up reference images showing how a specific material should actually look and feel.
- You want to compare a few finish or condition variations of the same base material (e.g. matte vs. glossy vs. weathered) before committing to a direction.
- You need texture reference images for a designer or 3D artist to match, not the finished rendered object the material will eventually cover.

## The Prompt

```
[BASE MATERIAL DESCRIPTION — reuse verbatim across every variant]
{{MATERIAL}}, {{MATERIAL_COLOR}}

[VARIANT — change only this line per image]
{{FINISH_OR_CONDITION}}

Full prompt per variant: extreme close-up macro texture study of {{MATERIAL}}, {{MATERIAL_COLOR}}, {{FINISH_OR_CONDITION}}, {{LIGHTING_DIRECTION}}, texture filling the entire frame, no object silhouette visible, only surface detail, ultra high detail, shallow depth of field --ar 1:1
```

## Variables
- `{{MATERIAL}}` — the concrete material being studied (e.g. "coarse linen weave fabric," "brushed stainless steel," "raw oak wood grain"). Required.
- `{{MATERIAL_COLOR}}` — the specific color or finish tone of that material. Required.
- `{{FINISH_OR_CONDITION}}` — the one thing that changes per image in the set (e.g. "matte finish, slightly worn," "high-gloss lacquered finish," "weathered and sun-bleached"). Required.
- `{{LIGHTING_DIRECTION}}` — kept identical across every variant in the set (e.g. "raking side light emphasizing texture depth"). Required — texture legibility depends heavily on light angle, so this is the highest-leverage variable for a set that's supposed to read as one study.

## Example
**Input:** `{{MATERIAL}}` = "coarse linen weave fabric" · `{{MATERIAL_COLOR}}` = "natural undyed oatmeal tone" · `{{LIGHTING_DIRECTION}}` = "raking side light from the left, emphasizing the weave's texture depth"

**Variant 1 — Raw, matte:**
```
extreme close-up macro texture study of coarse linen weave fabric, natural undyed oatmeal tone, matte finish, tightly woven, slightly irregular hand-loomed texture, raking side light from the left, emphasizing the weave's texture depth, texture filling the entire frame, no object silhouette visible, only surface detail, ultra high detail, shallow depth of field --ar 1:1
```

**Variant 2 — Weathered:**
```
extreme close-up macro texture study of coarse linen weave fabric, natural undyed oatmeal tone, weathered and sun-faded, a few loose frayed fibers, raking side light from the left, emphasizing the weave's texture depth, texture filling the entire frame, no object silhouette visible, only surface detail, ultra high detail, shallow depth of field --ar 1:1
```

## Tips & Variations
- Keep `{{LIGHTING_DIRECTION}}` identical across all variants in a set — raking or angled light is what actually reveals texture depth; flat frontal lighting flattens fine surface detail and defeats the purpose of a material study.
- Pair with `environment-concept-art-mood-board-set` (creative-and-visual, already shipped) when a material study needs to graduate into an actual environment: lock down the material's look here first, then carry the exact `{{MATERIAL}}` and `{{MATERIAL_COLOR}}` wording into that prompt's `{{LOCATION_DESCRIPTION}}` so the surface reads consistently at both macro and full-scene scale.
- These are reference-quality studies, not seamless tileable texture maps — if a genuinely tileable texture is needed for 3D work, a dedicated texture-generation tool built for tiling is a better fit than a single-frame image generator output.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

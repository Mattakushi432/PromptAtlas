---
id: photoreal-product-shot-prompt-builder
title: Photoreal Product Shot Prompt Builder
category: creative-and-visual
tags: [product-mockups, photography, prompt-engineering]
target_models: [Midjourney, DALL-E 3, Stable Diffusion]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Builds a detailed, photoreal product-photography prompt from a product description — a prompt-writing template that fills in the specific technical/stylistic details (lighting, lens, background, composition) that separate a convincing product shot from an obviously-generated one.

## When to use it
- You need a product mockup image (for a landing page, ad, or listing) and don't have access to real product photography yet.
- Your generated product shots keep looking flat or artificial, and you suspect the prompt is missing the technical photography vocabulary that actually controls realism.
- You need several consistent-style shots of the same product concept (different angles) and want a reusable base prompt structure.

## The Prompt

```
Professional product photography of {{PRODUCT}}, {{ANGLE}} angle, positioned on {{SURFACE_OR_BACKGROUND}}, {{LIGHTING_SETUP}} lighting, shot on {{CAMERA_LENS}}, shallow depth of field, sharp focus on product with soft background blur, {{COLOR_MOOD}} color grading, commercial product photography, ultra high detail, {{ADDITIONAL_STYLE_NOTES}} --ar {{ASPECT_RATIO}} --style raw --v 6
```

## Variables
- `{{PRODUCT}}` — the specific product, described concretely (material, color, distinguishing features) — "a matte black ceramic coffee mug with a thin gold rim," not just "a mug." Required — vague product descriptions produce generic, unconvincing results.
- `{{ANGLE}}` — e.g. "three-quarter front," "top-down flat lay," "eye-level straight-on." Required — controls composition.
- `{{SURFACE_OR_BACKGROUND}}` — e.g. "a light gray seamless studio backdrop," "a rustic wooden table with soft natural light from a window." Required.
- `{{LIGHTING_SETUP}}` — e.g. "three-point softbox," "single large diffused overhead," "golden hour natural light." Required — this is one of the highest-leverage terms for realism; vague lighting terms ("nice lighting") produce weak results.
- `{{CAMERA_LENS}}` — e.g. "85mm macro lens," "50mm prime lens." Required — real camera/lens terminology reliably pushes the model toward photographic (not illustrative) rendering.
- `{{COLOR_MOOD}}` — e.g. "warm and inviting," "cool and clean, high contrast." Required.
- `{{ADDITIONAL_STYLE_NOTES}}` — any brand-specific or context-specific detail (e.g. "minimalist Scandinavian aesthetic," "matches a luxury skincare brand's visual identity"). Optional.
- `{{ASPECT_RATIO}}` — e.g. "1:1," "4:5," "16:9" depending on the platform this will be used on. Required.

## Example
**Input:** `{{PRODUCT}}` = "a matte black ceramic coffee mug with a thin gold rim" · `{{ANGLE}}` = "three-quarter front" · `{{SURFACE_OR_BACKGROUND}}` = "a light gray seamless studio backdrop" · `{{LIGHTING_SETUP}}` = "three-point softbox" · `{{CAMERA_LENS}}` = "85mm macro lens" · `{{COLOR_MOOD}}` = "warm and inviting" · `{{ADDITIONAL_STYLE_NOTES}}` = "minimal steam rising from the coffee" · `{{ASPECT_RATIO}}` = "4:5"

**Filled prompt:**
```
Professional product photography of a matte black ceramic coffee mug with a thin gold rim, three-quarter front angle, positioned on a light gray seamless studio backdrop, three-point softbox lighting, shot on 85mm macro lens, shallow depth of field, sharp focus on product with soft background blur, warm and inviting color grading, commercial product photography, ultra high detail, minimal steam rising from the coffee --ar 4:5 --style raw --v 6
```

## Tips & Variations
- If results still look artificial, the most common fix is tightening `{{LIGHTING_SETUP}}` — vague lighting terms are the single biggest cause of a plasticky, obviously-generated look; naming a specific real-world lighting setup (softbox, ring light, golden hour) reliably helps more than adding more general "realistic" or "photorealistic" keywords.
- For a series of shots of the same product at different angles, keep every variable identical except `{{ANGLE}}` — this maintains visual consistency across the set far better than varying multiple parameters at once.
- Different image models respond differently to parameter flags (`--ar`, `--style raw`, `--v`) — the flags shown are Midjourney-style; for DALL-E 3 or Stable Diffusion, drop platform-specific flags and rely on the descriptive prompt text alone, adjusting aspect ratio through that tool's own settings instead.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

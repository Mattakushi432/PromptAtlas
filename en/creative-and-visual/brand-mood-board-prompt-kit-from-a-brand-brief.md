---
id: brand-mood-board-prompt-kit-from-a-brand-brief
title: Brand Mood Board Prompt Kit from a Brand Brief
category: creative-and-visual
tags: [product-mockups, illustration]
target_models: [Midjourney, DALL-E 3, Stable Diffusion]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Generates a small set of genuinely varied mood-board image prompts from a brand brief — spanning distinct visual territories (texture/material, lifestyle photography, abstract pattern, typography mood) rather than color variations on one idea — giving a marketing designer real range to react to before a brand direction is chosen. Distinct from `logo-concept-direction-generator` (creative-and-visual, already shipped), which generates specific logo mark concepts for an already-narrowing decision; this prompt covers the earlier, broader mood/texture exploration stage before a logo is even on the table.

## When to use it
- You're kicking off brand visual exploration and want a genuinely varied starting mood board, not five images that are all the same idea with the color swapped.
- A first mood-board generation attempt came back visually narrow (every image the same photographic style, just different subjects) and you need prompts structured to actually diverge across visual territory, not just content.
- You want AI-generated mood-board imagery as directional inspiration for a designer or client conversation — not final brand assets (this generates exploratory reference imagery, not usable production photography or licensed stock replacements).

## The Prompt

```
[BRAND FOUNDATION — reuse across all four prompts]
{{BRAND_ADJECTIVES}}, {{TARGET_AUDIENCE}}, differentiated from {{COMPETITOR_VISUAL_CLICHE}}

[TERRITORY 1 — Texture/Material]
close-up macro texture study, {{MATERIAL_DIRECTION}}, {{BRAND_ADJECTIVES}}, no text, abstract composition --ar 1:1

[TERRITORY 2 — Lifestyle Photography]
lifestyle photograph, {{LIFESTYLE_SCENE}}, {{BRAND_ADJECTIVES}}, natural lighting, candid moment, shot for {{TARGET_AUDIENCE}} --ar 4:5

[TERRITORY 3 — Abstract Pattern]
abstract pattern design, {{PATTERN_MOTIF}}, {{BRAND_ADJECTIVES}}, repeating geometric composition, flat design --ar 1:1

[TERRITORY 4 — Typography Mood]
typography mood board, large expressive lettering, {{TYPOGRAPHY_MOOD}}, {{BRAND_ADJECTIVES}}, minimal composition, on textured paper background --ar 4:5
```

## Variables
- `{{BRAND_ADJECTIVES}}` — 3-4 adjectives capturing the brand's actual personality (e.g. "warm, artisanal, unpretentious" vs. "sleek, precise, technical"). Required — reused in all four prompts as the throughline that makes four visually different images still feel like one brand exploration.
- `{{TARGET_AUDIENCE}}` — who the brand is for, since this shapes which lifestyle scenes and material choices read as authentic vs. generic. Required.
- `{{COMPETITOR_VISUAL_CLICHE}}` — a specific visual pattern common among competitors that this exploration should deliberately avoid (e.g. "the minimalist white-and-sage-green look every skincare brand uses"). Required — naming what to differentiate from is what keeps a mood board from converging on the same territory as everyone else in the category.
- `{{MATERIAL_DIRECTION}}` — for Territory 1: a specific material/texture concept tied to the brand (e.g. "raw unglazed ceramic, natural linen weave," "brushed aluminum, matte rubber"). Required for that prompt.
- `{{LIFESTYLE_SCENE}}` — for Territory 2: a specific, concrete scene rather than a generic "person using product" (e.g. "hands kneading dough on a flour-dusted wooden counter, morning light"). Required for that prompt.
- `{{PATTERN_MOTIF}}` — for Territory 3: a specific shape/motif source tied to the brand concept, not a generic geometric pattern (e.g. "motifs derived from topographic map contour lines" for an outdoors brand). Required for that prompt.
- `{{TYPOGRAPHY_MOOD}}` — for Territory 4: the letterform character being explored (e.g. "bold condensed sans-serif, high contrast," "loose expressive hand-lettering"). Required for that prompt.

## Example
**Input:** `{{BRAND_ADJECTIVES}}` = "warm, artisanal, unhurried" · `{{TARGET_AUDIENCE}}` = "home cooks who value slow, intentional cooking over convenience" · `{{COMPETITOR_VISUAL_CLICHE}}` = "the bright white minimalist studio-photography look most meal-kit brands use" · `{{MATERIAL_DIRECTION}}` = "raw unglazed stoneware, natural linen" · `{{LIFESTYLE_SCENE}}` = "hands kneading dough on a flour-dusted wooden counter, soft morning window light" · `{{PATTERN_MOTIF}}` = "motifs derived from wheat stalks and grain textures" · `{{TYPOGRAPHY_MOOD}}` = "loose expressive hand-lettering, slightly imperfect"

**Territory 1 — Texture/Material:**
```
close-up macro texture study, raw unglazed stoneware, natural linen, warm, artisanal, unhurried, no text, abstract composition --ar 1:1
```

**Territory 2 — Lifestyle Photography:**
```
lifestyle photograph, hands kneading dough on a flour-dusted wooden counter, soft morning window light, warm, artisanal, unhurried, natural lighting, candid moment, shot for home cooks who value slow, intentional cooking over convenience --ar 4:5
```

**Territory 3 — Abstract Pattern:**
```
abstract pattern design, motifs derived from wheat stalks and grain textures, warm, artisanal, unhurried, repeating geometric composition, flat design --ar 1:1
```

**Territory 4 — Typography Mood:**
```
typography mood board, large expressive lettering, loose expressive hand-lettering, slightly imperfect, warm, artisanal, unhurried, minimal composition, on textured paper background --ar 4:5
```

## Tips & Variations
- If all four territories still feel visually similar despite the different prompts, the likely cause is {{BRAND_ADJECTIVES}} being too generic (adjectives that could describe half the category) rather than the prompt structure — sharpen the adjectives to something more specific to this brand before regenerating.
- Once a territory resonates, narrow further within it rather than jumping straight to logo work — generate 2-3 more variations within the winning territory (different material, different lifestyle scene) to confirm the direction holds up before moving to `logo-concept-direction-generator` (creative-and-visual, already shipped) for actual mark exploration.
- These four territories are a starting structure, not a fixed requirement — for a brand where typography or pattern genuinely isn't relevant to the category, swap that territory for another angle (e.g. a packaging-mockup territory) rather than forcing an irrelevant one into the set.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

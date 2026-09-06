---
id: product-packaging-mockup-prompt-set
title: Product Packaging Mockup Prompt Set
category: creative-and-visual
tags: [product-mockups, product-design, consistency]
target_models: [Midjourney, DALL-E 3, Stable Diffusion]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Builds a base packaging description plus three angle-specific variant prompts — front-facing, three-quarter hero angle, and on-shelf retail context — for a described product's packaging, so a reviewer sees the same package from the angles an actual packaging pitch needs instead of one flat front view.

## When to use it
- You're presenting a packaging design direction and need more than a single front-on shot to sell the concept — a hero angle and a realistic shelf-context shot show how it actually reads in the wild.
- You're pitching a packaging concept to a client or stakeholder and want a "shelf-ready" context image alongside clean studio views.
- Previous separate attempts at front, angled, and shelf shots didn't look like the same box — different proportions, different label placement, different color reading between them.

## The Prompt

```
[BASE PACKAGING DESCRIPTION — reuse verbatim across every angle]
{{PRODUCT_NAME}} packaging, {{PACKAGING_TYPE}}, {{DESIGN_DESCRIPTION}}, {{BRAND_COLORS}}

[ANGLE 1 — Front-facing]
{{PRODUCT_NAME}} packaging, {{PACKAGING_TYPE}}, {{DESIGN_DESCRIPTION}}, {{BRAND_COLORS}}, straight-on front view, centered composition, on plain white studio background, soft even lighting, commercial product photography, ultra high detail --ar 1:1

[ANGLE 2 — Three-quarter hero angle]
{{PRODUCT_NAME}} packaging, {{PACKAGING_TYPE}}, {{DESIGN_DESCRIPTION}}, {{BRAND_COLORS}}, three-quarter angle view showing front and side panel, slight downward camera angle, on plain white studio background, soft directional lighting with subtle shadow, commercial product photography, ultra high detail --ar 4:5

[ANGLE 3 — On-shelf retail context]
{{PRODUCT_NAME}} packaging, {{PACKAGING_TYPE}}, {{DESIGN_DESCRIPTION}}, {{BRAND_COLORS}}, positioned on a retail store shelf among {{SHELF_CONTEXT}}, realistic retail lighting, shallow depth of field with shelf background softly blurred, commercial photography --ar 16:9
```

## Variables
- `{{PRODUCT_NAME}}` — the product/brand name as it appears on the packaging. Required.
- `{{PACKAGING_TYPE}}` — the physical packaging structure (e.g. "a rectangular cardboard box," "a cylindrical tin," "a stand-up resealable pouch"). Required — structure changes how each angle needs to read.
- `{{DESIGN_DESCRIPTION}}` — the packaging's actual visual design: logo placement, imagery, typography treatment, described concretely rather than vaguely. Required.
- `{{BRAND_COLORS}}` — the specific named palette (e.g. "matte forest green with a metallic gold foil logo"). Required — reused verbatim across all three angles to keep the packaging looking like the same object.
- `{{SHELF_CONTEXT}}` — for Angle 3 only: what surrounds it on the shelf (e.g. "similar competing snack boxes, softly blurred," "other products from the same line, in a neat row"). Required for that angle.

## Example
**Input:** `{{PRODUCT_NAME}}` = "Northbound Granola" · `{{PACKAGING_TYPE}}` = "a stand-up resealable kraft-paper pouch" · `{{DESIGN_DESCRIPTION}}` = "a hand-drawn mountain range illustration across the top third, brand name in a bold serif below it, a small nutrition callout in the lower corner" · `{{BRAND_COLORS}}` = "natural kraft brown base with deep forest green and a single mustard-yellow accent" · `{{SHELF_CONTEXT}}` = "other granola and snack bar boxes, softly blurred"

**Angle 1 — Front-facing:**
```
Northbound Granola packaging, a stand-up resealable kraft-paper pouch, a hand-drawn mountain range illustration across the top third, brand name in a bold serif below it, a small nutrition callout in the lower corner, natural kraft brown base with deep forest green and a single mustard-yellow accent, straight-on front view, centered composition, on plain white studio background, soft even lighting, commercial product photography, ultra high detail --ar 1:1
```

**Angle 3 — On-shelf retail context:**
```
Northbound Granola packaging, a stand-up resealable kraft-paper pouch, a hand-drawn mountain range illustration across the top third, brand name in a bold serif below it, a small nutrition callout in the lower corner, natural kraft brown base with deep forest green and a single mustard-yellow accent, positioned on a retail store shelf among other granola and snack bar boxes, softly blurred, realistic retail lighting, shallow depth of field with shelf background softly blurred, commercial photography --ar 16:9
```

## Tips & Variations
- Keep the BASE PACKAGING DESCRIPTION word-for-word identical across all three angles — only the angle/context terms should change. This is the same consistency discipline as `isometric-icon-set-prompt-generator` and `environment-concept-art-mood-board-set` (creative-and-visual, already shipped), applied here to one packaging design instead of a set of icons or a location.
- Pair with `photoreal-product-shot-prompt-builder` (creative-and-visual, already shipped) when the product itself — not just its packaging — also needs a hero shot: that prompt controls the photographic-realism vocabulary (lighting setup, lens, camera terms) for a single product image, while this one holds one packaging design constant across the specific angles a packaging review actually needs.
- Treat these as pitch/exploration-stage mockups, not print-ready packaging files — real production packaging needs an actual dieline, bleed, and print-ready color separation that an image generator does not produce.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

---
id: brand-photography-style-guide-prompt-kit
title: Brand Photography Style Guide Prompt Kit
category: creative-and-visual
tags: [photography, product-mockups, consistency]
target_models: [Midjourney, DALL-E 3, Stable Diffusion]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Builds a reusable brand photography "style DNA" — a fixed lighting setup, color grade, framing rule, and lens language — plus a series of subject-specific prompts (product close-up, lifestyle moment, flat-lay, empty space) that all read as shot by the same photographer for the same brand, rather than a set of individually-styled images that happen to share a subject matter. This is the photographic-system counterpart to icon- and character-consistency prompts: the discipline that keeps many different subjects feeling like one brand's photography.

## When to use it
- You're establishing or documenting a brand's photographic style before generating (or briefing) a batch of images across different subject types — product, lifestyle, space — and need them to look like one cohesive visual system, not a grab-bag of separately-styled photos.
- Previously generated brand images used inconsistent lighting, color temperature, or framing, and stakeholders keep flagging that the visual feel doesn't match across assets.
- You want a written photography style guide (lighting, color grade, framing, lens language) that can be handed to a photographer or reapplied consistently as new subjects get added to the brand's image library over time.

## The Prompt

```
[PHOTOGRAPHY STYLE DNA — reuse verbatim across every subject]
{{LIGHTING_SETUP}}, {{COLOR_GRADE}}, {{FRAMING_RULE}}, {{CAMERA_LENS_LANGUAGE}}, {{BRAND_MOOD}}

[SUBJECT — change only this line per shot]
{{SUBJECT_AND_CONTEXT}}

Full prompt per shot: {{SUBJECT_AND_CONTEXT}}, {{LIGHTING_SETUP}}, {{COLOR_GRADE}}, {{FRAMING_RULE}}, {{CAMERA_LENS_LANGUAGE}}, {{BRAND_MOOD}}, professional brand photography, consistent photographic style --ar {{ASPECT_RATIO}}
```

## Variables
- `{{LIGHTING_SETUP}}` — a fixed, specific lighting description reused across every subject (e.g. "soft diffused window light from camera-left, gentle fill, no harsh shadows"). Required — this is the single biggest lever for whether a photo set reads as one consistent brand system rather than several unrelated shoots.
- `{{COLOR_GRADE}}` — a specific, named color-grading direction kept identical across the set (e.g. "warm film-like tones, slightly lifted blacks, muted saturation"), not a vague "nice colors." Required.
- `{{FRAMING_RULE}}` — a consistent compositional rule applied regardless of subject (e.g. "generous negative space around the subject, off-center rule-of-thirds placement"). Required.
- `{{CAMERA_LENS_LANGUAGE}}` — real camera/lens vocabulary kept constant across the set (e.g. "shot on 50mm prime, shallow depth of field"). Required — consistent lens language is part of what makes very different subjects feel like the same shoot.
- `{{BRAND_MOOD}}` — 2-3 adjectives describing the brand's photographic personality (e.g. "unhurried, warm, tactile" vs. "crisp, precise, high-energy"). Required.
- `{{SUBJECT_AND_CONTEXT}}` — the one thing that changes per shot: what's being photographed and its immediate context (e.g. "a hand pouring coffee into a ceramic cup on a wooden counter," "a person reading by a sunlit window," "an empty studio corner with a single plant"). Required.
- `{{ASPECT_RATIO}}` — kept identical across the set unless different placements (a social crop vs. a wide hero banner) genuinely require different ratios. Required.

## Example
**Input:** `{{LIGHTING_SETUP}}` = "soft diffused window light from camera-left, gentle fill, no harsh shadows" · `{{COLOR_GRADE}}` = "warm film-like tones, slightly lifted blacks, muted saturation" · `{{FRAMING_RULE}}` = "generous negative space around the subject, off-center rule-of-thirds placement" · `{{CAMERA_LENS_LANGUAGE}}` = "shot on 50mm prime, shallow depth of field" · `{{BRAND_MOOD}}` = "unhurried, warm, tactile" · `{{ASPECT_RATIO}}` = "4:5"

**Shot 1 — Product close-up** (`{{SUBJECT_AND_CONTEXT}}` = "a hand pouring coffee into a matte ceramic cup on a wooden counter"):
```
a hand pouring coffee into a matte ceramic cup on a wooden counter, soft diffused window light from camera-left, gentle fill, no harsh shadows, warm film-like tones, slightly lifted blacks, muted saturation, generous negative space around the subject, off-center rule-of-thirds placement, shot on 50mm prime, shallow depth of field, unhurried, warm, tactile, professional brand photography, consistent photographic style --ar 4:5
```

**Shot 2 — Lifestyle** (`{{SUBJECT_AND_CONTEXT}}` = "a person reading a book by a sunlit window, coffee mug nearby"):
```
a person reading a book by a sunlit window, coffee mug nearby, soft diffused window light from camera-left, gentle fill, no harsh shadows, warm film-like tones, slightly lifted blacks, muted saturation, generous negative space around the subject, off-center rule-of-thirds placement, shot on 50mm prime, shallow depth of field, unhurried, warm, tactile, professional brand photography, consistent photographic style --ar 4:5
```

## Tips & Variations
- Pair with `photoreal-product-shot-prompt-builder` (creative-and-visual, already shipped) when you only need one polished hero product shot rather than a whole cross-subject style system — that prompt goes deeper on single-shot technical realism, while this one prioritizes reuse across many different subjects over time.
- If two shots in the set still feel photographically mismatched despite an identical style DNA block, check `{{LIGHTING_SETUP}}` and `{{CAMERA_LENS_LANGUAGE}}` first — those two variables carry more of the "same photographer" signal than `{{COLOR_GRADE}}` alone, since generation models tend to honor color words more loosely than lighting and lens words.
- Save the exact style DNA block once it's dialed in and treat it as a living brand asset — reuse it verbatim, not paraphrased, for every new subject added months later, the same discipline `consistent-character-sheet-prompt-series` (creative-and-visual, already shipped) uses to keep a character recognizable across a growing set of images.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

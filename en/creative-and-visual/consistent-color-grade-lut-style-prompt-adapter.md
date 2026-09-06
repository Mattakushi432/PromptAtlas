---
id: consistent-color-grade-lut-style-prompt-adapter
title: Consistent Color-Grade LUT-Style Prompt Adapter
category: creative-and-visual
tags: [style-transfer, consistency]
target_models: [Midjourney, DALL-E 3, Stable Diffusion]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Applies one described color-grade "look" (shadow/highlight treatment, color cast, contrast, texture) consistently across a set of otherwise-varied image prompts — different subjects, compositions, even different base styles — so a mixed batch (a product render, a lifestyle photo, an illustration) reads as one graded campaign, without touching any prompt's own subject or style vocabulary. Distinct from swapping an entire art style onto one held-constant subject (that's `style-transfer-prompt-adapter`'s job): this holds each prompt's subject and style constant and unifies only the color treatment layered on top, the way a real production LUT unifies footage shot on different cameras.

## When to use it
- You have a batch of already-working prompts for a campaign (different products, scenes, or even different visual styles) and need them to feel like one unified shoot once color-graded.
- A client or brand guideline specifies a signature color mood (e.g. "always teal-and-orange," "desaturated except for the brand red") that needs to survive across a varied set of generated assets.
- You're assembling a mood board or campaign preview from mismatched sources and want a quick, consistent grading pass applied uniformly before deciding which images need more work.

## The Prompt

```
[COLOR-GRADE SPECIFICATION — reuse verbatim, appended to every prompt in the set]
{{GRADE_NAME}}, shadows: {{SHADOW_TREATMENT}}, highlights: {{HIGHLIGHT_TREATMENT}}, color cast: {{COLOR_CAST}}, contrast: {{CONTRAST_LEVEL}}, texture: {{GRAIN_OR_TEXTURE}}

[APPLYING TO PROMPT 1 — do not alter its existing subject/style terms]
{{EXISTING_PROMPT_1}}, {{GRADE_NAME}} color grade, {{SHADOW_TREATMENT}}, {{HIGHLIGHT_TREATMENT}}, {{COLOR_CAST}}, {{CONTRAST_LEVEL}}, {{GRAIN_OR_TEXTURE}}

[APPLYING TO PROMPT 2 — same grade block, different original prompt]
{{EXISTING_PROMPT_2}}, {{GRADE_NAME}} color grade, {{SHADOW_TREATMENT}}, {{HIGHLIGHT_TREATMENT}}, {{COLOR_CAST}}, {{CONTRAST_LEVEL}}, {{GRAIN_OR_TEXTURE}}
```

## Variables
- `{{GRADE_NAME}}` — a specific, named look (e.g. "teal-and-orange cinematic grade," "sun-bleached film grade") rather than a vague "nice colors." Required.
- `{{SHADOW_TREATMENT}}` — how shadows render (e.g. "crushed, cool blue-black shadows"). Required.
- `{{HIGHLIGHT_TREATMENT}}` — how highlights render (e.g. "soft, slightly warm blown highlights"). Required.
- `{{COLOR_CAST}}` — an overall tint applied across the image (e.g. "subtle warm amber cast across midtones"). Required.
- `{{CONTRAST_LEVEL}}` — the contrast character (e.g. "high contrast, punchy" vs. "low contrast, flat film-like"). Required.
- `{{GRAIN_OR_TEXTURE}}` — any texture layer (e.g. "fine 35mm film grain," "clean, no grain"). Optional but recommended — grain/texture consistency is as visible as color when comparing images side by side.
- `{{EXISTING_PROMPT_1}}` / `{{EXISTING_PROMPT_2}}` (extend to as many prompts as the set needs) — the varied, already-working prompts whose subject and style should stay untouched; only the grade block gets appended to each.

## Example
**Input:** `{{GRADE_NAME}}` = "teal-and-orange cinematic grade" · `{{SHADOW_TREATMENT}}` = "deep teal, slightly crushed shadows" · `{{HIGHLIGHT_TREATMENT}}` = "warm orange, softly blown highlights" · `{{COLOR_CAST}}` = "subtle warm cast on skin tones, cool cast elsewhere" · `{{CONTRAST_LEVEL}}` = "high contrast, punchy" · `{{GRAIN_OR_TEXTURE}}` = "fine 35mm film grain" · `{{EXISTING_PROMPT_1}}` = "A pair of running shoes on a concrete studio floor, dramatic side lighting, product photography" · `{{EXISTING_PROMPT_2}}` = "A runner tying their shoelaces on a city sidewalk at dawn, candid lifestyle photography"

**Applying to Prompt 1:**
```
A pair of running shoes on a concrete studio floor, dramatic side lighting, product photography, teal-and-orange cinematic grade color grade, deep teal, slightly crushed shadows, warm orange, softly blown highlights, subtle warm cast on skin tones, cool cast elsewhere, high contrast, punchy, fine 35mm film grain
```

**Applying to Prompt 2:**
```
A runner tying their shoelaces on a city sidewalk at dawn, candid lifestyle photography, teal-and-orange cinematic grade color grade, deep teal, slightly crushed shadows, warm orange, softly blown highlights, subtle warm cast on skin tones, cool cast elsewhere, high contrast, punchy, fine 35mm film grain
```

## Tips & Variations
- Pair with `style-transfer-prompt-adapter` (creative-and-visual, already shipped): that prompt swaps an entire art style while holding one subject constant; this one holds every prompt's own subject and style constant and unifies only the color grade across several different subjects and styles. Use them together on a campaign that needs both — adapt outlier prompts to a shared style first, then run this pass to lock in one shared color mood on top.
- The most common failure is over-specifying the grade so heavily it fights a term already in the original prompt (e.g. grading "crushed cool shadows" onto a prompt that already says "bright, high-key lighting"). If one prompt resists the grade, check for a conflicting lighting term in it first before assuming the grade description itself is wrong.
- For genuine post-production LUT application (not prompt-time color direction), treat this prompt's output as a starting point only — a real LUT applied in a color grading tool to final renders will always be more precise and consistent than baking the look into the generation prompt.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

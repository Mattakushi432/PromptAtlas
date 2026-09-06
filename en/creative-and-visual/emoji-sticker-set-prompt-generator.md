---
id: emoji-sticker-set-prompt-generator
title: Emoji/Sticker Set Prompt Generator
category: creative-and-visual
tags: [illustration, consistency, character-design]
target_models: [Midjourney, DALL-E 3, Stable Diffusion]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Builds a base sticker-style specification — mascot description, art style, outline/border treatment, and palette — plus a series of per-expression variant prompts for a small, visually consistent chat sticker or emoji pack, the emoji-scale counterpart to `isometric-icon-set-prompt-generator`: same base-plus-variant consistency discipline, applied to one recurring mascot's expressions in a die-cut sticker format instead of a set of unrelated flat/3D icons.

## When to use it
- You need a small sticker or emoji pack (roughly 6-12 pieces) for a messaging app, Discord server, or brand chat pack, featuring one mascot across different expressions or reactions, and want them to look like one cohesive pack rather than separately generated pieces.
- You've generated a few stickers already and they don't match (different outline thickness, different proportions, different color saturation) and need a tighter base prompt to bring the rest of the pack in line.
- You're prototyping a sticker pack's visual direction before commissioning a final vector or illustrator pass.

## The Prompt

```
[BASE STICKER STYLE — reuse verbatim across every sticker]
{{MASCOT_BASE_DESCRIPTION}}, {{ART_STYLE}}, {{OUTLINE_AND_BORDER}}, {{COLOR_PALETTE}}

[VARIANT — change only this line per sticker]
{{EXPRESSION_OR_REACTION}}

Full prompt per sticker: {{MASCOT_BASE_DESCRIPTION}}, {{EXPRESSION_OR_REACTION}}, {{ART_STYLE}}, {{OUTLINE_AND_BORDER}}, {{COLOR_PALETTE}}, chibi proportions, sticker pack style, centered composition, plain background --ar {{ASPECT_RATIO}}
```

## Variables
- `{{MASCOT_BASE_DESCRIPTION}}` — an exhaustive, fixed description of the mascot's unchanging visual traits: species/shape, colors, distinguishing features (e.g. "a round orange fox mascot, big head, small body, white belly patch, two small pointed ears"). Required — reuse this text identically across every sticker in the pack; small wording changes between stickers are a common cause of drift.
- `{{ART_STYLE}}` — the rendering approach kept identical across the pack (e.g. "flat vector illustration, minimal shading," "soft 2D cartoon with subtle gradient"). Required.
- `{{OUTLINE_AND_BORDER}}` — the sticker-specific format treatment (e.g. "bold 4px black outline, thick white die-cut sticker border around the whole shape"). Required — this is what makes the set read as chat/messaging stickers rather than generic character illustrations.
- `{{COLOR_PALETTE}}` — a specific, named palette reused across the pack (e.g. "palette of orange, white, and charcoal linework"), not a vague "colorful." Required.
- `{{EXPRESSION_OR_REACTION}}` — the one thing that changes per sticker (e.g. "laughing with eyes closed, tears of joy," "shocked, wide eyes, hands on cheeks," "waving hello, one paw raised"). Required.
- `{{ASPECT_RATIO}}` — kept identical across the pack, typically square (1:1) for stickers and emoji. Required.

## Example
**Input:** `{{MASCOT_BASE_DESCRIPTION}}` = "a round orange fox mascot, big head, small body, white belly patch, two small pointed ears" · `{{ART_STYLE}}` = "flat vector illustration, minimal shading" · `{{OUTLINE_AND_BORDER}}` = "bold 4px black outline, thick white die-cut sticker border" · `{{COLOR_PALETTE}}` = "palette of orange #F4A261, white, and charcoal #264653 linework" · `{{ASPECT_RATIO}}` = "1:1"

**Sticker 1 — Laughing:**
```
a round orange fox mascot, big head, small body, white belly patch, two small pointed ears, laughing with eyes closed, tears of joy, flat vector illustration, minimal shading, bold 4px black outline, thick white die-cut sticker border, palette of orange #F4A261, white, and charcoal #264653 linework, chibi proportions, sticker pack style, centered composition, plain background --ar 1:1
```

**Sticker 2 — Waving hello:**
```
a round orange fox mascot, big head, small body, white belly patch, two small pointed ears, waving hello, one paw raised, big smile, flat vector illustration, minimal shading, bold 4px black outline, thick white die-cut sticker border, palette of orange #F4A261, white, and charcoal #264653 linework, chibi proportions, sticker pack style, centered composition, plain background --ar 1:1
```

## Tips & Variations
- Pair with `isometric-icon-set-prompt-generator` (creative-and-visual, already shipped) for the same base-plus-variant consistency discipline applied to unrelated UI/product icons instead of one mascot's expressions — use that prompt for a settings/folder/chart-style icon system, this one for a chat sticker pack built around a single recurring character.
- For a mascot-less emoji set (e.g. a themed weather or food emoji pack with no recurring character), swap `{{MASCOT_BASE_DESCRIPTION}}` for a shared object-category style description and treat `{{EXPRESSION_OR_REACTION}}` as the changing object instead — the same base-style-plus-variant structure still holds.
- If the pack needs to work as real platform stickers or emoji (Telegram, Discord, Slack), check that platform's exact required canvas size and transparency rules before finalizing — `{{OUTLINE_AND_BORDER}}` approximates the die-cut sticker look, but a true transparent-background export usually needs a background-removal pass afterward.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

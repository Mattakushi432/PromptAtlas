---
id: ui-mockup-prompt-for-a-specific-app-screen
title: UI Mockup Prompt for a Specific App Screen
category: creative-and-visual
tags: [ui-mockups, product-design, prompt-engineering]
target_models: [Midjourney, DALL-E 3, Stable Diffusion]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Builds a prompt for generating a UI mockup image of a specific app screen — for early visual exploration and mood/direction, not for production-ready UI (generated UI mockups are for inspiration and stakeholder communication, not pixel-accurate, implementable interfaces).

## When to use it
- You're in early concept exploration for an app's visual direction and want quick mockup imagery to react to before investing in real design tool work.
- You want to communicate a visual mood/style direction to a designer or stakeholder ("something like this") rather than a literal spec.
- You need placeholder UI imagery for a pitch deck or marketing mockup showing "the app" without needing an actual functioning design file.

## The Prompt

```
Mobile app UI design mockup, {{SCREEN_TYPE}} screen, {{APP_CATEGORY}} app, {{DESIGN_STYLE}} design style, {{COLOR_SCHEME}} color scheme, showing {{KEY_ELEMENTS}}, clean modern interface, {{DEVICE_FRAME}}, UI/UX design, high fidelity mockup, Figma-style presentation --ar {{ASPECT_RATIO}}
```

## Variables
- `{{SCREEN_TYPE}}` — the specific screen (e.g. "onboarding," "dashboard/home," "settings," "checkout flow"). Required.
- `{{APP_CATEGORY}}` — the app's domain (e.g. "fitness tracking," "food delivery," "personal finance"). Required — steers appropriate iconography and content conventions.
- `{{DESIGN_STYLE}}` — e.g. "minimalist flat design," "neumorphic," "glassmorphism with depth," "bold and colorful, Gen-Z targeted." Required — vague style terms produce generic, uninspired results.
- `{{COLOR_SCHEME}}` — specific colors or a described palette (e.g. "deep navy and warm coral accent," "monochrome with a single bright green accent"). Required.
- `{{KEY_ELEMENTS}}` — the specific UI elements that should be visible (e.g. "a bottom navigation bar, a large hero card, three stat widgets"). Required — without this, the model invents generic UI elements that may not reflect the actual product concept.
- `{{DEVICE_FRAME}}` — e.g. "shown in an iPhone frame," "shown as a flat screen without device chrome." Required — affects composition and how the image can be used.
- `{{ASPECT_RATIO}}` — matched to device frame if used (e.g. "9:19.5" for a modern phone screen) or a presentation-friendly ratio if not framed.

## Example
**Input:** `{{SCREEN_TYPE}}` = "dashboard/home" · `{{APP_CATEGORY}}` = "personal finance / budgeting" · `{{DESIGN_STYLE}}` = "minimalist flat design with soft rounded cards" · `{{COLOR_SCHEME}}` = "deep navy background, mint green accent, white cards" · `{{KEY_ELEMENTS}}` = "a large balance summary card at top, a spending breakdown chart, a horizontal scrollable list of recent transactions, a bottom tab bar" · `{{DEVICE_FRAME}}` = "shown in a modern iPhone frame" · `{{ASPECT_RATIO}}` = "9:19.5"

**Filled prompt:**
```
Mobile app UI design mockup, dashboard/home screen, personal finance / budgeting app, minimalist flat design with soft rounded cards design style, deep navy background with mint green accent and white cards color scheme, showing a large balance summary card at top, a spending breakdown chart, a horizontal scrollable list of recent transactions, a bottom tab bar, clean modern interface, shown in a modern iPhone frame, UI/UX design, high fidelity mockup, Figma-style presentation --ar 9:19.5
```

## Tips & Variations
- Treat any generated mockup as a mood/direction reference, not a design deliverable — text labels, icons, and precise spacing will not be reliably legible or correct, and no generated mockup should be handed to engineering as an implementation spec.
- For exploring multiple style directions for the same screen, keep `{{SCREEN_TYPE}}`, `{{APP_CATEGORY}}`, and `{{KEY_ELEMENTS}}` identical across generations and vary only `{{DESIGN_STYLE}}` and `{{COLOR_SCHEME}}` — this isolates style as the actual variable being compared, the same discipline as `consistent-character-sheet-prompt-series` (creative-and-visual) applies to character work.
- Once a direction is validated, hand the winning example (not the prompt alone) to a designer working in a real design tool — the generated image is a reference for translating into an actual, editable, accessible interface, not a substitute for that work.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

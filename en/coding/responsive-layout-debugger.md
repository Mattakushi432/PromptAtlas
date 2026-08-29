---
id: responsive-layout-debugger
title: Responsive Layout Debugger
category: coding
tags: [frontend, css, responsive-design]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Diagnoses why a layout breaks at specific screen sizes — overflow, wrapping, overlap — from the actual CSS/markup and a description of the symptom, rather than a general "how does responsive design work" explanation. For a specific, reproducible layout bug.

## When to use it
- A layout looks fine on desktop but breaks (overflows, elements overlap, text wraps badly) at a specific viewport width.
- Debugging a layout issue that only a QA report or a screenshot from a specific device described, without direct access to reproduce it.
- Learning to read CSS layout bugs systematically instead of randomly tweaking widths until something looks right.

## The Prompt

```
You diagnose a responsive layout bug from the code and symptom description — not a general responsive design tutorial.

HTML/JSX and relevant CSS: {{CODE}}
Symptom (what breaks, and at what viewport width/device): {{SYMPTOM}}
Screenshot description, if no image is available (optional): {{VISUAL_DESCRIPTION}}

Instructions:
1. Identify the specific CSS mechanism causing the symptom: a fixed width/min-width that doesn't shrink, a flex/grid item without a shrink/wrap allowance, an image without a max-width constraint, a media query with an off-by-one breakpoint boundary, content (like a long unbreakable string/URL) that doesn't wrap, or a parent with `overflow: hidden` masking a deeper issue.
2. Trace the layout algorithm being used (flexbox, grid, or normal flow) and reason about it correctly — flexbox and grid have different default behaviors for shrinking/growing that are frequently misunderstood, so be precise about which one applies here.
3. If multiple CSS rules could plausibly interact to cause the symptom (e.g., a flex-basis conflicting with a min-width), trace through the cascade and computed values rather than guessing at a single cause.
4. Give the specific fix: the exact CSS property/value change, not "make it responsive." If there are multiple valid fixes (e.g., `flex-shrink`, `min-width: 0`, or `overflow-wrap`), pick the one that addresses the root cause rather than papering over the symptom, and say why.
5. Note if the fix could have side effects at other viewport widths (a fix for mobile that changes desktop behavior) and say what to verify after applying it.
6. If the symptom description is too vague to diagnose confidently (e.g., "it looks weird on mobile"), ask for the specific breakpoint and what "weird" means (overflow? overlap? wrong order?) rather than guessing.

Output format: Markdown with sections: Root Cause, Fix (with code), Side Effects to Verify.
```

## Variables
- `{{CODE}}` — the relevant HTML/JSX and CSS. Required.
- `{{SYMPTOM}}` — what breaks and at what viewport size. Required.
- `{{VISUAL_DESCRIPTION}}` — a description of what's visually wrong, if no screenshot is available to share. Optional but helps when the code alone doesn't make the bug obvious.

## Example
**Input:** `{{CODE}}` = a flex row containing a fixed-width sidebar and a text block, `{{SYMPTOM}}` = "on screens under 400px, the text block's long words overflow past the container edge instead of wrapping".

**Output (excerpt):**
```
## Root Cause
The text block is a flex item without `min-width: 0`. Flex items default to `min-width: auto`, which means a flex item won't shrink smaller than its content's intrinsic minimum size — for text containing a long unbreakable word/URL, that minimum can exceed the available space, causing overflow instead of wrapping.

## Fix
```css
.text-block {
  min-width: 0;
  overflow-wrap: break-word;
}
```
`min-width: 0` allows the flex item to shrink below its content's natural minimum; `overflow-wrap: break-word` ensures any remaining long unbreakable content wraps instead of overflowing.

## Side Effects to Verify
Confirm the text block doesn't become uncomfortably narrow at in-between widths now that it can shrink further than before — check 400-600px specifically.
```

## Tips & Variations
- If you have access to browser DevTools, paste the actual computed style values for the broken element at the failing viewport width — this turns diagnosis from inference into confirmation.
- For a CSS Grid layout instead of flexbox, the same "min-width: auto by default" trap exists as `minmax(auto, ...)` — ask it to check for the grid-specific version of this issue if grid is in use.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

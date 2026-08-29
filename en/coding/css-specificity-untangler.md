---
id: css-specificity-untangler
title: CSS Specificity Untangler
category: coding
tags: [frontend, css, debugging]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Diagnoses why a specific CSS rule isn't applying (or is being overridden) by tracing specificity, source order, and cascade layers — and fixes it without reaching for `!important` as a default. For a specific "why isn't my style applying" bug, distinct from responsive/layout-breaking bugs.

## When to use it
- A CSS rule that looks correct isn't visually applying, and you suspect another rule is winning the specificity/cascade battle.
- Inheriting a stylesheet with scattered `!important` declarations and wanting to understand and untangle the actual specificity war underneath them.
- Debugging a style that only breaks in one specific context (e.g., inside a particular parent component) due to an unexpectedly higher-specificity ancestor rule.

## The Prompt

```
You diagnose why a specific CSS rule isn't taking effect, tracing the actual cascade mechanics — specificity, source order, `!important`, and cascade layers if in use — rather than reaching for `!important` as the default fix.

CSS rules in play (the one that should apply, and any others that might be competing): {{CSS_RULES}}
The element's relevant HTML (classes/IDs/attributes present): {{ELEMENT_HTML}}
What's expected vs. what's actually happening: {{SYMPTOM}}

Instructions:
1. Calculate the specificity of every competing rule using the standard (inline, ID, class/attribute/pseudo-class, element/pseudo-element) weighting, and show the calculation, not just the winner — this is the core diagnostic step.
2. If specificities are equal, the tiebreaker is source order (later wins) — check the actual order rules appear in the stylesheet(s) and note if a build/bundling process might reorder them unexpectedly (e.g., CSS Modules, styled-components injection order).
3. Check for `!important` on any competing rule — if present, note that no amount of specificity increase on the "should apply" rule will win, and `!important` in the losing rule (if you control it) or on the intended rule (as a last resort, and flagged as technical debt) are the only ways around it.
4. If CSS cascade layers (`@layer`) are in use, factor that in: layer order overrides specificity entirely for rules in different layers, so a low-specificity rule in a later layer beats a high-specificity rule in an earlier layer — check this before concluding specificity is the issue.
5. Recommend the fix that addresses the root cause with the lowest specificity increase necessary — prefer adjusting the losing selector's specificity to just barely win, or restructuring to avoid the conflict (e.g., using a cascade layer, or removing an overly broad competing selector), over reaching for `!important`.
6. If existing `!important` declarations are part of the problem, note which ones are load-bearing (removing them would break something else) versus removable as part of the fix.

Output format: Markdown with sections: Specificity Breakdown (each competing rule with its calculated specificity), Root Cause, Fix.
```

## Variables
- `{{CSS_RULES}}` — the competing CSS rules, in their actual source order if possible. Required.
- `{{ELEMENT_HTML}}` — the element's classes, IDs, and relevant attributes. Required — specificity calculation depends on exactly what selectors match.
- `{{SYMPTOM}}` — what style is expected and what's actually rendering. Required.

## Example
**Input:** `{{CSS_RULES}}` = `.card .title { color: blue; }` and `#sidebar .card-title { color: red; }`, `{{ELEMENT_HTML}}` = `<h2 id="sidebar" class="card-title">...</h2>` nested inside `.card`, `{{SYMPTOM}}` = "expected blue, getting red".

**Output (excerpt):**
```
## Specificity Breakdown
- `.card .title` — two classes → specificity (0,2,0). Note: this selector actually doesn't match the element at all — the element has class `card-title`, not `title`, so this rule isn't even competing (a naming mismatch, not a specificity loss).
- `#sidebar .card-title` — one ID + one class → specificity (1,1,0), higher than any class-only selector.

## Root Cause
This isn't actually a specificity war — `.card .title` doesn't match the element because of the class name mismatch (`title` vs. `card-title`). `#sidebar .card-title` is the only rule that matches, hence red.

## Fix
Fix the intended selector to `.card .card-title` (or rename the element's class) so it actually targets the element; then compare specificity again — (0,2,0) vs (1,1,0) still favors the ID selector, so also consider whether `#sidebar` should be an ID selector here at all, or whether it should be scoped differently.
```

## Tips & Variations
- Paste the actual computed styles panel output from browser DevTools (which shows the winning rule and the ones it beat, struck through) as additional `{{CSS_RULES}}` context — it gives ground truth rather than requiring the model to simulate cascade resolution from scratch.
- For a CSS-in-JS setup (styled-components, Emotion), note that injection order (which can be runtime-dependent) matters as much as specificity — flag this as a distinct failure mode if the symptom is inconsistent across page loads.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

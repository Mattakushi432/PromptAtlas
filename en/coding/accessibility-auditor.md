---
id: accessibility-auditor
title: Accessibility Auditor
category: coding
tags: [frontend, accessibility, a11y]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Audits a UI component's markup for accessibility issues — semantic HTML, ARIA usage, keyboard operability, focus management, color contrast where inferable — against WCAG, with a fix for every finding. For a specific component being reviewed, not a whole-site audit.

## When to use it
- Reviewing a new or existing component before it ships, to catch accessibility gaps a purely visual review would miss.
- A screen reader user or accessibility tool flagged an issue and you need a systematic pass to find related problems in the same component.
- Learning accessibility best practices by seeing them applied to real code you wrote, not abstract guidelines.

## The Prompt

```
You audit a UI component's markup for accessibility issues against WCAG 2.1 AA, and provide a specific fix for every finding — not just a citation of the guideline violated.

Component code (HTML/JSX/template): {{COMPONENT_CODE}}
Component's purpose/interaction model (optional, e.g. "a modal dialog that opens on button click"): {{COMPONENT_PURPOSE}}

Instructions:
1. Check semantic HTML usage: are interactive elements actual `<button>`/`<a>` elements rather than a `<div>` with a click handler? Is heading hierarchy correct? Are lists/tables marked up as such rather than div soup styled to look like one?
2. Check ARIA usage: is `role`/`aria-*` used only where semantic HTML can't express the pattern (custom widgets), and not redundantly on elements with correct native semantics already? Flag both missing ARIA where needed AND incorrect/redundant ARIA that a screen reader would announce confusingly.
3. Check keyboard operability: can every interactive element be reached and activated via keyboard alone (Tab, Enter/Space, Escape for dismissible content, arrow keys for composite widgets like menus/tabs)? Flag any mouse-only interaction (hover-only reveal, click-only without a keyboard equivalent).
4. Check focus management: for dynamic content (modals, dropdowns, route changes), does focus move to the new content appropriately, and return to a sensible place when it closes? Flag any focus trap issues or focus lost to `<body>`.
5. Check labeling: does every form input have an associated, programmatically-linked label (not just visual proximity)? Do icon-only buttons have accessible names (`aria-label` or visually-hidden text)?
6. If color/contrast can be assessed from provided CSS values, flag insufficient contrast; if colors aren't provided, note that contrast couldn't be checked rather than skipping the category silently.
7. For every finding, give the specific code fix, not just "add appropriate ARIA attributes."

Output format: Markdown, one entry per finding, grouped by category (Semantic HTML / ARIA / Keyboard / Focus / Labeling / Contrast), each with a WCAG success criterion reference, why it matters (concrete user impact, not just "it's required"), and the fix.
```

## Variables
- `{{COMPONENT_CODE}}` — the component markup to audit. Required.
- `{{COMPONENT_PURPOSE}}` — what the component does and how it's meant to be interacted with. Optional but helps judge whether ARIA patterns are correctly applied for the intended widget type.

## Example
**Input:** `{{COMPONENT_CODE}}` = a custom dropdown built from `<div>`s with `onClick` handlers, no keyboard support, `{{COMPONENT_PURPOSE}}` = "a select-style dropdown for choosing a country".

**Output (excerpt):**
```
### Keyboard
FINDING — the dropdown trigger is a `<div onClick={...}>` with no keyboard handler; a keyboard-only user cannot open it at all.
WCAG 2.1.1 (Keyboard) — all functionality must be operable through a keyboard interface.
Impact: keyboard and screen reader users cannot select a country at all — this blocks the feature entirely for them, not just a minor inconvenience.
Fix: use a `<button>` element (natively focusable and Enter/Space-activatable) instead of a `<div>`, or if the div must remain, add `tabIndex={0}`, `role="button"`, and an `onKeyDown` handler for Enter/Space.
```

## Tips & Variations
- Follow up by asking it to also generate the equivalent automated test assertions (e.g., using `@testing-library` + `jest-axe`) for the findings that are mechanically testable.
- For a component library (not a single page), ask it to prioritize findings by how many places in the app the component is likely reused, since a fix there has outsized impact.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

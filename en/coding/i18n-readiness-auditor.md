---
id: i18n-readiness-auditor
title: Internationalization Readiness Auditor
category: coding
tags: [frontend, i18n, localization]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Audits frontend code for internationalization readiness — hardcoded strings, manual date/number formatting, pluralization, and layout assumptions that break under translation — before a product expands to new locales. Distinct from `accessibility-auditor` (a11y, not localization) and `responsive-layout-debugger` (screen size, not text length/direction).

## When to use it
- A product is about to launch in a new locale and needs a pass to find un-internationalized code.
- Reviewing new frontend code for i18n readiness before it merges, in a codebase that already supports multiple locales.
- Investigating why a specific locale's UI looks broken (layout, formatting) compared to the default.

## The Prompt

```
You are auditing frontend code for internationalization readiness — not accessibility, not responsive layout for screen size, specifically the concerns that break when the same UI needs to work in a different language or locale.

Code (component or page): {{CODE}}

Target locales (optional — specific languages/regions being planned for, useful for flagging RTL or specific formatting needs): {{TARGET_LOCALES}}

Flag:
1. Hardcoded user-facing strings not routed through an i18n/translation layer (a literal string passed directly into JSX/templates instead of a translation key/function call).
2. String concatenation or interpolation that assumes a specific word order (e.g., building a sentence by concatenating translated fragments) — this breaks in languages with different grammar/word order and should use a single translatable template string with placeholders instead.
3. Manually formatted dates, numbers, or currency (hand-rolled formatting logic) instead of locale-aware formatting APIs (e.g., `Intl.DateTimeFormat`, `Intl.NumberFormat`) that adapt to the user's locale automatically.
4. Missing or incorrect pluralization handling — text that works for singular/plural in English but doesn't account for languages with different pluralization rules (some languages have more than two plural forms).
5. Layout assumptions that would break under text expansion — many languages run meaningfully longer than English for the same meaning, so fixed-width containers or truncation-free assumptions are a risk — and, if {{TARGET_LOCALES}} includes an RTL language (Arabic, Hebrew), whether the layout uses logical properties (start/end) instead of hardcoded left/right.

For each finding, quote the specific code and state concretely what breaks (a garbled sentence, a truncated button, a wrong plural form) rather than a generic "this isn't localized" note.

If the code already routes everything through a translation layer and uses locale-aware formatting correctly, say so as a passing verdict rather than inventing minor findings.
```

## Variables
- `{{CODE}}` — the component or page to audit. Required.
- `{{TARGET_LOCALES}}` — specific locales being planned for, if known. Optional; without it, general i18n-readiness principles are applied without locale-specific RTL/pluralization detail.

## Example
**Input:** `{{CODE}}` = a React component rendering `` `You have ${count} new message` + (count !== 1 ? 's' : '') ``, and a date shown via manual `${month}/${day}/${year}` string formatting, `{{TARGET_LOCALES}}` = "Spanish, Arabic".

**Output (excerpt):**
```
Finding: pluralization handled by hand with `count !== 1 ? 's' : ''`. This is an English-only pluralization pattern (add "s" for plural). Spanish and Arabic both have different pluralization rules than this binary singular/plural check — Arabic in particular has multiple plural forms depending on the count. Fix: use an i18n library's pluralization support (e.g., ICU MessageFormat via a library like `i18next` or `FormatJS`), which lets each locale define its own plural rules instead of hardcoding English's.

Finding: date is manually formatted as `${month}/${day}/${year}`, hardcoding US date order (MM/DD/YYYY). This is not just untranslated text — it's actively the wrong format for most locales, including Spanish-speaking ones, which typically use DD/MM/YYYY. Fix: use `Intl.DateTimeFormat(locale).format(date)` so the format adapts automatically per user locale.

Finding: no RTL consideration visible in the layout code shown — with Arabic in target locales, check that spacing/alignment uses logical CSS properties (`margin-inline-start` instead of `margin-left`) rather than assuming LTR layout.
```

## Tips & Variations
- For a codebase not yet using any i18n library, ask it to also recommend a library appropriate to the framework in use (e.g., `react-i18next`, `next-intl`, `FormatJS`) rather than just flagging the gaps with no path forward.
- Run this on a whole page/flow rather than one component when preparing for an actual locale launch — pluralization and date-format bugs are often scattered across many small components rather than concentrated in one place.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

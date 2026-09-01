---
id: bilingual-content-parity-checker
title: Bilingual Content Parity Checker
category: writing-and-content
tags: [editing, localization]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Checks a translated or localized piece against its source for meaning drift, tone mismatch, and dropped/added content — beyond literal translation accuracy, since a translation can be word-for-word correct while the localized version reads more formally, omits a nuance, or adds emphasis the source didn't have, all of which change what the piece actually communicates without being a literal mistranslation.

## When to use it
- You have a translated version of a piece (marketing copy, a product description, documentation) and want a check that it says the same thing with the same emphasis as the source, not just that individual words were translated correctly.
- You don't speak the target language yourself and need a way to verify a translator's or localization tool's output is faithful before publishing, beyond trusting the translation blindly.
- You're maintaining parallel-language content (like this repository's own bilingual prompts) and want a systematic check that both versions still say the same thing after one side gets edited.

## The Prompt

```
You check a translated/localized piece against its source language for meaning drift — not literal word-for-word translation accuracy, but whether the localized version actually communicates the same thing with the same emphasis, tone, and completeness as the source.

Source language text: {{SOURCE_TEXT}}
Localized/translated text: {{LOCALIZED_TEXT}}
Target language and any relevant localization convention (e.g. "native localization expected, not literal translation" vs. "should stay close to source wording"): {{LOCALIZATION_CONVENTION}}

Instructions:
1. Check for meaning drift: does any specific claim, qualifier, or nuance in {{SOURCE_TEXT}} come through differently in {{LOCALIZED_TEXT}} — a hedge ("may," "in some cases") that became an absolute statement, a specific example generalized into something vaguer, or vice versa. Quote both versions for each finding.
2. Check for tone mismatch: does {{LOCALIZED_TEXT}} read more formal, more casual, warmer, or more distant than {{SOURCE_TEXT}} intends — even when the literal content matches, a register shift changes how a reader experiences the piece. This is especially worth checking when {{LOCALIZATION_CONVENTION}} calls for native localization rather than literal translation, since register choices are exactly where a translator's own voice can unintentionally diverge from the source's.
3. Check for dropped content: any sentence, qualifier, caveat, or example present in {{SOURCE_TEXT}} that's simply missing from {{LOCALIZED_TEXT}} — flag this even if the overall meaning seems preserved, since an omitted caveat can matter even when it doesn't change the piece's general gist.
4. Check for added content: anything in {{LOCALIZED_TEXT}} not grounded in {{SOURCE_TEXT}} — an example invented for local flavor, an emphasis added that wasn't in the original. Distinguish genuinely appropriate localization (e.g. adapting a culturally-specific reference) from unintended addition — this distinction depends on {{LOCALIZATION_CONVENTION}}, so state which you believe it is for each finding.
5. Check structural parity: do the pieces have the same number of sections/paragraphs communicating the same points in roughly the same order, or has the localized version reorganized/merged/split content in a way that changes emphasis (e.g. merging two distinct points into one, burying a point that was prominent in the source)?
6. If {{LOCALIZATION_CONVENTION}} explicitly calls for native localization rather than literal translation, don't flag genuinely natural-sounding adaptations as errors — the goal of this check is fidelity of meaning and completeness, not literalness, and over-flagging natural localization choices as "drift" defeats the purpose of allowing native localization in the first place.

Output format: Markdown. For each finding: the category (meaning drift / tone / dropped content / added content / structural), both the source and localized text quoted, and why it matters. End with an overall parity verdict: faithful localization, or specific issues to address.
```

## Variables
- `{{SOURCE_TEXT}}` — the original-language text. Required.
- `{{LOCALIZED_TEXT}}` — the translated/localized version to check. Required.
- `{{LOCALIZATION_CONVENTION}}` — whether the target expects close literal translation or native, idiomatic localization. Required — this materially changes what counts as an issue versus an appropriate adaptation.

## Example
**Input:** `{{SOURCE_TEXT}}` = "Our support team typically responds within 24 hours, though response times may be longer during peak periods." `{{LOCALIZED_TEXT}}` = "[Translation back-rendered in English for this example] Our support team responds within 24 hours." `{{LOCALIZATION_CONVENTION}}` = "Native localization expected for marketing copy, but factual claims about service commitments should stay precise"

**Output (excerpt):**
```
### Finding: Dropped hedge — service commitment claim
Source: "typically responds within 24 hours, though response times may be longer during peak periods."
Localized: "responds within 24 hours" — the hedge ("typically," "may be longer during peak periods") is missing entirely, turning a qualified expectation into an unqualified promise.
Why it matters: given {{LOCALIZATION_CONVENTION}} specifically calls out that factual service commitments should stay precise, this isn't a stylistic simplification — it changes what's actually being promised to the reader, which could create a support expectation the team doesn't actually guarantee.

### Overall Verdict
Specific issue to address — the dropped hedge on response time is a meaningful factual change, not an acceptable localization simplification given the stated convention. Recommend restoring the qualifier in the localized version before publishing.
```

## Tips & Variations
- For checking this repository's own bilingual prompt pairs specifically, use `{{LOCALIZATION_CONVENTION}}` = "native localization expected per project convention, not literal translation" — per `CLAUDE.md`, the `uk/` files here are meant to read as natively written, so this prompt should focus on meaning/completeness fidelity, not phrasing closeness.
- If you don't speak the target language, you're relying on this prompt's own bilingual capability to do the comparison — for anything high-stakes (a legal document, a safety instruction), have a human bilingual speaker verify the finding rather than trusting an AI-only check as final.
- Run this whenever either language version gets edited, not just at initial translation time — content that started in parity commonly drifts when one language gets a quick edit and the other doesn't, and that drift compounds silently over multiple edit rounds if never re-checked.

## Changelog
- 1.0.0 (2026-09-01): Initial version.

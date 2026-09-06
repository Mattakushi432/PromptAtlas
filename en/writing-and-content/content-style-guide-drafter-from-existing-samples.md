---
id: content-style-guide-drafter-from-existing-samples
title: Content Style Guide Drafter from Existing Samples
category: writing-and-content
tags: [brand-voice, content-creation]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Reverse-engineers a written style guide from a set of existing on-brand content samples — identifies the actual, consistent patterns across the samples (sentence rhythm, vocabulary choices, what the voice avoids) and documents them as concrete, checkable rules rather than vague adjectives, so a new writer can actually match the voice instead of guessing from "friendly but professional."

## When to use it
- A brand's voice exists implicitly across published content but was never documented, and a new writer or agency needs something concrete to work from beyond "read our old posts and match the vibe."
- You want to check whether your own sense of "our voice" actually matches what the published content shows, since intuition about house style often drifts from what's actually consistently published.
- You're onboarding a freelance writer or AI-assisted workflow and need a style guide specific enough to catch a mismatch, not a generic adjective list ("friendly, bold, authentic") that could describe any brand.

## The Prompt

```
You reverse-engineer a written style guide from a set of existing on-brand content samples. You document the actual, observable patterns across the samples — you do not invent generic brand-voice adjectives unsupported by what's actually in the text.

Content samples (multiple pieces, ideally from different formats): {{SAMPLES}}
What these samples represent (all official brand content, one specific channel, a specific author's writing): {{SAMPLE_SCOPE}}

Instructions:
1. Identify sentence-level patterns across {{SAMPLES}}: typical sentence length and variation, contraction usage (consistently used or consistently avoided), sentence-starter patterns, and punctuation habits (em dashes, exclamation point frequency) — quote specific examples from {{SAMPLES}} for each pattern claimed, not just an assertion that a pattern exists.
2. Identify vocabulary patterns: recurring word choices, a level of technicality/jargon that's consistent across samples, and words or phrasings that are conspicuously absent given the topic (e.g. never uses "solutions" or "leverage" even where a similar brand typically would) — the absences are often as informative as the presences.
3. Identify structural patterns: how pieces typically open (a question, a direct statement, a scene-setting anecdote), how they typically close, and any recurring structural device (a consistent use of subheadings, a recurring closing CTA pattern).
4. Identify what the voice actively avoids — if {{SAMPLES}} consistently lacks something common in the genre (no first-person "I," no rhetorical questions, no humor), name this as an explicit rule rather than letting it stay implicit, since "don't do X" is often the most useful guidance for a new writer who'd otherwise default to X.
5. For each identified pattern, phrase it as a checkable rule a writer could self-audit against ("sentences average under 20 words; use contractions consistently; avoid rhetorical questions") rather than a vague descriptor ("conversational tone") — a rule a writer can verify against their own draft is more useful than an adjective they have to interpret.
6. If {{SAMPLES}} shows genuine inconsistency on some dimension (some pieces use contractions, others don't, with no clear pattern by format or topic), say so explicitly rather than forcing a rule the actual samples don't support — a fabricated rule is worse than an honest "inconsistent, worth deciding on going forward."

Output format: Markdown with sections: Sentence-Level Patterns, Vocabulary, Structure, What to Avoid, each rule with a quoted example from {{SAMPLES}}. End with a "Genuinely Inconsistent" section for anything the samples don't clearly support one way.
```

## Variables
- `{{SAMPLES}}` — the actual content samples to analyze, ideally 3+ pieces and from more than one format if possible (a blog post, an email, a social caption) to distinguish genuine voice patterns from format-specific conventions. Required.
- `{{SAMPLE_SCOPE}}` — what these samples represent, since a style guide derived from one author's writing is narrower than one derived from a brand's full published output. Required — affects how confidently a pattern can be claimed as "the brand voice" versus one contributor's individual style.

## Example
**Input:** `{{SAMPLES}}` = "[3 blog post excerpts, all starting with a short, punchy one-sentence paragraph; consistent contraction use; no exclamation points across any sample; each ends with a direct, specific next-step CTA rather than a generic 'learn more']" `{{SAMPLE_SCOPE}}` = "All published blog content from the last 6 months, multiple authors"

**Output (excerpt):**
```
### Sentence-Level Patterns
- Opens consistently with a short, punchy single-sentence paragraph before expanding — e.g. "Here's the thing nobody tells you about onboarding." followed by a longer explanatory paragraph. Rule: open with one short standalone sentence, not a scene-setting paragraph.
- Contractions used consistently across all 3 samples ("it's," "you'll," "we're") — no sample uses the expanded form. Rule: always use contractions.
- Zero exclamation points across all 3 samples despite topics that could invite them. Rule: avoid exclamation points entirely, even for genuinely exciting content.

### What to Avoid
- No sample uses a generic "Learn More" CTA — each ends with a specific action ("See the 3-step checklist," "Try it on your next onboarding flow"). Rule: never use a generic CTA; state the specific next action.

### Genuinely Inconsistent
Subheading usage varies — 2 of 3 samples use subheadings, 1 doesn't, with no clear pattern tied to piece length or topic. Not confident enough to state a rule here; worth deciding explicitly going forward rather than leaving it to individual writer preference.
```

## Tips & Variations
- Revisit this periodically as new content publishes, rather than treating the first draft as permanent — a style guide derived from 6 months of samples should be checked against newer samples occasionally to confirm the patterns are still actually being followed, not just documented once and forgotten.
- If {{SAMPLE_SCOPE}} is narrow (one author's writing rather than the full brand), label the resulting guide explicitly as that author's style, not "the brand voice" — presenting one contributor's individual patterns as official brand style can create confusion later when other contributors' equally-valid content doesn't match it.
- Pair with `tone-adapter` (writing-and-content, already shipped) once the guide exists — that prompt can apply the documented voice rules to adapt a specific new piece, using this prompt's output as the concrete target rather than a vague brief.

## Changelog
- 1.0.0 (2026-09-01): Initial version.

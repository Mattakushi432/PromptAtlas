---
id: voice-consistency-checker-across-a-script
title: Voice Consistency Checker Across a Script
category: voice-and-audio
tags: [tts, consistency]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Checks a long script for tone/character drift — places where the narrator's voice quietly shifts register, formality, or personality across sections that should sound like the same speaker — the kind of inconsistency that's hard to catch reading in short bursts but becomes obvious once a full recording is assembled.

## When to use it
- You've written a long script (an audiobook chapter, a multi-section explainer, a long-form ad campaign) over multiple sessions and suspect the voice drifted somewhere along the way.
- Multiple writers contributed to different sections of the same script and you need a check that the combined result reads as one consistent voice, not a patchwork.
- You're revising a script and want to verify a specific edited section still matches the established voice of the surrounding unedited text.

## The Prompt

```
You check a script for tone/character voice consistency across its full length — you identify where the established voice shifts unintentionally, not where it should intentionally shift (e.g. a deliberate tonal beat is not a drift).

Script: {{SCRIPT}}
Intended voice/character description: {{VOICE_DESCRIPTION}}
Any sections with an intentional tone shift, if known (so they're not flagged as drift): {{INTENTIONAL_SHIFTS}}

Instructions:
1. Establish the baseline voice from {{VOICE_DESCRIPTION}} and, if it's thin or generic, infer the actual voice being used from the script's own opening section — note explicitly which source (the description or the opening text) you're using as the baseline.
2. Read through {{SCRIPT}} section by section, checking for drift along specific dimensions: formality level (contractions, sentence complexity, register), personality markers (humor, warmth, directness), vocabulary level (simple vs. technical/elevated), and address style (does it consistently address the listener the same way — "you," a name, no direct address at all).
3. For each drift found, quote the specific passage, name which dimension shifted, and contrast it with a passage from elsewhere in the script that represents the established baseline — a vague "this feels different" isn't useful; the comparison needs to be concrete.
4. Cross-reference against {{INTENTIONAL_SHIFTS}} before flagging anything as drift — a deliberate, described tonal shift (e.g. "gets more urgent in the warning section") is not an inconsistency and shouldn't be flagged as one, even if it would otherwise look like drift by the same dimensional checks.
5. Distinguish severity: a drift a listener would consciously notice as jarring versus a subtler shift that only shows up on close comparison but might not actually disrupt the listening experience — both are worth noting, but they don't need equal urgency.
6. If most of the script is consistent and only one or two sections drift, say so directly rather than implying a pervasive problem — the fix scope should match the actual severity found.

Output format: Markdown. For each drift found: the passage, the dimension that shifted, a baseline comparison passage, severity (jarring / subtle), and a suggested revision direction (not a full rewrite, just guidance on what to adjust). End with an overall consistency verdict.
```

## Variables
- `{{SCRIPT}}` — the full script to check. Required.
- `{{VOICE_DESCRIPTION}}` — the intended voice/character, if one was defined upfront. Optional — if thin or missing, the prompt infers a baseline from the script's own opening.
- `{{INTENTIONAL_SHIFTS}}` — any sections where the tone is meant to change on purpose, so they're excluded from drift flagging. Optional, but prevents false positives on deliberate tonal beats.

## Example
**Input:** `{{SCRIPT}}` = "[Opening] Hey there — so you've probably wondered why your plants keep dying, right? Don't worry, we've all been there. [Later section] Subsequently, it is imperative that one considers the optimal moisture parameters for successful cultivation." `{{VOICE_DESCRIPTION}}` = "Friendly, casual, like a knowledgeable friend giving advice" `{{INTENTIONAL_SHIFTS}}` = "none"

**Output (excerpt):**
```
### Drift found: formality level, later section
Passage: "Subsequently, it is imperative that one considers the optimal moisture parameters for successful cultivation."
Dimension: Formality — this passage uses formal, impersonal register ("one considers," "imperative," "subsequently") that contradicts the established casual, direct-address baseline.
Baseline comparison: The opening ("Hey there — so you've probably wondered... Don't worry, we've all been there") establishes a casual, second-person, conversational voice per {{VOICE_DESCRIPTION}}.
Severity: Jarring — a listener would very likely notice the shift from "hey there, don't worry" to "it is imperative that one considers," since the register change is large and the address style (second-person "you" vs. impersonal "one") flips entirely.
Suggested direction: Rewrite in the same casual second-person register, e.g. "So — how much water does your plant actually need? Getting that right makes all the difference."

### Overall verdict
One significant drift found in an otherwise consistent script — the issue is localized to this section rather than pervasive; a targeted rewrite of the flagged passage should resolve it.
```

## Tips & Variations
- Pair with `voiceover-script-with-delivery-direction-annotations` (voice-and-audio, already shipped) after fixing any flagged drift — that prompt adds delivery/pacing annotation once the underlying voice consistency is confirmed, since annotating a script that still has voice drift bakes the inconsistency into the delivery direction too.
- For a script assembled from multiple contributors, run this check specifically at the section boundaries where authorship changed — drift is disproportionately likely to cluster right at those seams rather than being evenly distributed.
- If {{VOICE_DESCRIPTION}} itself turns out to be too vague to meaningfully check against (e.g. just "professional"), sharpen it first — a thin voice description makes every dimension check less precise, since there's no clear baseline to compare drift against beyond the script's own opening.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

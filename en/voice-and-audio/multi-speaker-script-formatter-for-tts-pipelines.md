---
id: multi-speaker-script-formatter-for-tts-pipelines
title: Multi-Speaker Script Formatter for TTS Pipelines
category: voice-and-audio
tags: [tts, scriptwriting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Reformats a multi-character dialogue script into the platform-correct structure a multi-voice TTS pipeline actually needs — speaker tags, voice assignment, and clean turn boundaries — and flags any turn where who's speaking is ambiguous in the source, since an ambiguous speaker attribution that a human reader could infer from context will silently misassign a voice in an automated pipeline.

## When to use it
- You have a dialogue script written in prose/screenplay style and need it converted into the specific tagged format your TTS platform requires before it can generate multi-voice audio.
- You're switching between TTS platforms with different multi-speaker syntax and need the same script reformatted for the new platform's requirements.
- A TTS output assigned the wrong voice to a line, and you suspect the source script has an ambiguous or missing speaker attribution the pipeline guessed wrong on.

## The Prompt

```
You reformat a multi-character dialogue script into the exact structure a TTS pipeline requires. You flag any speaker turn that's ambiguous in the source rather than silently guessing who's speaking.

Dialogue script: {{DIALOGUE_SCRIPT}}
TTS platform and its multi-speaker syntax requirements: {{TTS_PLATFORM_SYNTAX}}
Speaker-to-voice mapping, if already decided: {{VOICE_ASSIGNMENTS}}

Instructions:
1. Parse the script into individual speaker turns, identifying who's speaking for each line based on explicit attribution (a name before a colon, a "said" tag) or clear unambiguous context (a direct back-and-forth exchange between two established speakers).
2. Reformat each turn into the exact structure specified by {{TTS_PLATFORM_SYNTAX}} — the specific tag format, attribute names, and syntax the platform requires, not a generic or approximate version of it.
3. If {{VOICE_ASSIGNMENTS}} is provided, apply the specified voice ID/name to each speaker's turns consistently throughout. If it's not provided, list the distinct speakers found and leave a clear placeholder for voice assignment rather than guessing which voice should be used.
4. Flag any turn where the speaker is genuinely ambiguous from the source text — e.g. a line with no attribution in a scene with more than two speakers, or a pronoun-only reference ("she said") where more than one female character is present in the scene. Do not silently assign these to a guessed speaker; list them separately as needing manual confirmation.
5. Preserve non-dialogue content (stage directions, sound cues) in whatever form {{TTS_PLATFORM_SYNTAX}} specifies for non-spoken content — some platforms need these stripped entirely, others support them as separate markup; check {{TTS_PLATFORM_SYNTAX}} rather than assuming.
6. Keep turn boundaries clean — if a single speaker's dialogue spans multiple sentences without interruption, keep it as one turn rather than needlessly splitting it, since unnecessary turn breaks can introduce unwanted pauses in some TTS pipelines.

Output format: the reformatted script in {{TTS_PLATFORM_SYNTAX}}'s exact structure, followed by a "Needs Manual Confirmation" list of any ambiguous speaker turns with their approximate location in the script.
```

## Variables
- `{{DIALOGUE_SCRIPT}}` — the source dialogue script in prose or screenplay style. Required.
- `{{TTS_PLATFORM_SYNTAX}}` — the specific target platform's multi-speaker markup requirements (tag format, required attributes). Required — without the actual target syntax, this prompt can only produce a generic tagged format that may not be directly usable.
- `{{VOICE_ASSIGNMENTS}}` — which voice ID/name maps to which speaker, if already decided. Optional — if omitted, speakers are identified and placeholder-flagged rather than assigned.

## Example
**Input:** `{{DIALOGUE_SCRIPT}}` = "Maya: Did you finish the report? Jordan: Almost — just need the last section. She sighed and closed her laptop." `{{TTS_PLATFORM_SYNTAX}}` = "XML-style: `<speaker id=\"NAME\">text</speaker>` per turn, non-dialogue wrapped in `<direction>text</direction>`" `{{VOICE_ASSIGNMENTS}}` = "Maya: voice_id 'en-US-Wavenet-F', Jordan: voice_id 'en-US-Wavenet-D'"

**Output (excerpt):**
```
<speaker id="Maya" voice="en-US-Wavenet-F">Did you finish the report?</speaker>
<speaker id="Jordan" voice="en-US-Wavenet-D">Almost — just need the last section.</speaker>
<direction>She sighed and closed her laptop.</direction>

Needs Manual Confirmation:
- "She sighed and closed her laptop" — the pronoun "she" is ambiguous between Maya and Jordan without knowing Jordan's gender/pronouns from context; this line has been kept as a non-dialogue direction (not assigned as a speaker line) rather than guessing which character it refers to. Confirm the intended subject before finalizing if this needs to be spoken content rather than a stage direction.
```

## Tips & Variations
- Pair with `voice-consistency-checker-across-a-script` (voice-and-audio, already shipped) before reformatting if the dialogue script is long — checking each character's voice/tone consistency in the original prose form is easier to review than after it's been split into fragmented platform-specific tags.
- If {{TTS_PLATFORM_SYNTAX}} isn't precisely known, provide the platform's documentation excerpt for the multi-speaker feature rather than a vague platform name alone — "Google Cloud TTS" alone isn't enough to produce exact, usable markup, since the precise attribute names and required structure matter for the output to actually work.
- For a script with a narrator role in addition to character dialogue, make sure {{VOICE_ASSIGNMENTS}} explicitly includes a narrator voice — narrator lines are easy to accidentally leave unassigned since they don't always have an explicit "Narrator:" tag in source prose.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

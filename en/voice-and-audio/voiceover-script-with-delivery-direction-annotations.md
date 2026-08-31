---
id: voiceover-script-with-delivery-direction-annotations
title: Voiceover Script with Delivery Direction Annotations
category: voice-and-audio
tags: [voiceover, scriptwriting, audio]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Adds pacing, emphasis, and tone annotations to a voiceover script — turns plain script text into direction a narrator (human or TTS) can actually perform, distinct from `tts-pronunciation-fix-list-generator` (voice-and-audio, still in backlog), which flags mispronunciation risk rather than annotating performance/delivery.

## When to use it
- You have a voiceover script but it reads flat when performed — you suspect it needs explicit delivery direction, not different words.
- You're briefing a voice actor who isn't in the room with you and needs the direction written into the script itself.
- You're feeding a script into a TTS pipeline that supports emphasis/pacing markup and need those cues added systematically rather than by ear.

## The Prompt

```
You annotate a voiceover script with delivery direction: pacing, emphasis, tone, and pause markers. You do not rewrite the script's actual words unless a specific phrase is genuinely unreadable aloud — your job is annotation, not rewriting content.

Script: {{SCRIPT}}
Intended tone/character: {{TONE}}
Delivery context (ad, explainer, narration, character voice): {{CONTEXT}}

Instructions:
1. Mark emphasis on the specific word(s) per sentence that carry the intended meaning — not every sentence needs emphasis marked, and marking too many words as emphasized defeats the purpose (if everything is emphasized, nothing is).
2. Add pause markers `[pause]` or `[brief pause]` where a natural breath or beat change should happen — particularly before/after a key point, a tonal shift, or a punchline, not mechanically at every comma.
3. Annotate tone shifts explicitly where the script's mood changes (e.g. `[shift: more urgent]`, `[shift: warmer, more personal]`) rather than expecting the performer to infer it from content alone.
4. Add pacing notes (`[faster]`, `[slow down]`) where the content's meaning benefits from a specific pace — e.g. slowing down for a critical instruction, speeding up for an energetic list.
5. If a sentence is grammatically fine on the page but would be genuinely awkward or ambiguous when read aloud (e.g. an acronym that needs to be spelled out, a sentence structure that creates a garden-path reading when spoken), flag it and suggest a minimal wording fix — this is the one case where light rewriting is appropriate, and it should be flagged as a suggested change, not silently applied.
6. Calibrate annotation density to {{CONTEXT}} — a 15-second ad needs tighter, more deliberate annotation per word; a longer narration can have sparser annotation focused on major beats.

Output format: the script with inline annotations in brackets, plus a one-line legend at the top explaining the annotation conventions used, and a separate list of any suggested wording fixes (flagged, not silently applied).
```

## Variables
- `{{SCRIPT}}` — the voiceover script text. Required.
- `{{TONE}}` — the intended overall tone/character (e.g. "warm and reassuring," "high-energy and playful," "authoritative but approachable"). Required.
- `{{CONTEXT}}` — what this voiceover is for (ad, product explainer, audiobook narration, character voice for a game). Required — changes annotation density and style.

## Example
**Input:** `{{SCRIPT}}` = "Most people think saving money means giving things up. It doesn't. It means making smarter choices about what actually matters to you." `{{TONE}}` = "warm, conversational, a little reassuring" `{{CONTEXT}}` = "30-second ad for a budgeting app"

**Output (excerpt):**
```
Legend: **bold** = emphasis, [pause] = brief pause, [shift: ...] = tone shift note

Most people think saving money means giving things **up**. [pause] It **doesn't**. [shift: warmer, slower — this is the reassurance moment] It means making **smarter** choices about what actually **matters** to you.

Suggested wording fixes: none — the script reads naturally aloud as written.
```

## Tips & Variations
- If a human voice actor is performing this (not TTS), keep annotations as guidance rather than rigid instructions — a good performer will use them as a starting interpretation and may find an even better delivery; over-annotating can constrain a skilled performer more than it helps.
- For TTS pipelines specifically, check which markup syntax the target TTS tool actually supports (SSML tags, specific platform markup) before finalizing — the bracket notation here is a human-readable intermediate format, not necessarily the exact syntax a TTS engine will parse.
- If most sentences in a script are coming back with `[shift: ...]` notes, that's a sign the script itself has too many disconnected tonal jumps — that's worth addressing at the writing level, not just annotating around.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

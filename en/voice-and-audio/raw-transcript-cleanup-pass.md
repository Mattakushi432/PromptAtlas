---
id: raw-transcript-cleanup-pass
title: Raw Transcript Cleanup Pass
category: voice-and-audio
tags: [transcription, editing, audio]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Cleans up a raw speech-to-text transcript (filler words, false starts, run-on sentences) into readable text while preserving the speaker's actual meaning and voice — a cleanup pass for a transcript that already exists, not a transcription tool itself.

## When to use it
- You have a raw auto-generated transcript (from a podcast, interview, or meeting) full of "um," false starts, and run-on sentences, and need a readable version for show notes, an article, or a written record.
- You want to check whether an edited transcript accidentally changed what the speaker actually meant while cleaning up the speech patterns.
- You're preparing a transcript for publication and need it readable without losing the speaker's natural voice and word choices.

## The Prompt

```
You clean up a raw speech-to-text transcript into readable text. You remove filler words, false starts, and excessive repetition, and break run-on spoken sentences into readable written sentences — you preserve the speaker's actual meaning, word choices, and voice; you do not paraphrase, formalize, or "improve" their ideas.

Raw transcript: {{TRANSCRIPT}}
Speaker context (if multiple speakers, names/labels): {{SPEAKERS}}
Cleanup level: {{CLEANUP_LEVEL}}

Instructions:
1. Remove filler words ("um," "uh," "like" used as a verbal tic, not as a real word) and false starts ("I think— well, what I mean is—") where they add no meaning — but keep them if the speaker's specific verbal habit is meaningful to the content (e.g. genuine hesitation before a difficult admission can be meaningful; reflexive "um" before every sentence generally isn't).
2. Break run-on spoken sentences into properly punctuated written sentences without changing word choice or meaning — spoken language naturally runs sentences together in ways that don't read well on the page, but the fix is punctuation and sentence boundaries, not rewording.
3. Preserve the speaker's actual word choices, idioms, and sentence structure where they're grammatically fine — do not "upgrade" casual or informal phrasing to sound more polished, since that changes the speaker's voice, not just cleans up speech artifacts.
4. Where the speaker genuinely restarted or corrected themselves mid-thought (not just a verbal filler, but an actual change of what they were saying), keep only the final, corrected version — reflect what they ultimately meant, not the abandoned first attempt.
5. Match cleanup intensity to {{CLEANUP_LEVEL}}: "light" removes only fillers/false starts and fixes punctuation; "moderate" additionally tightens run-on sentences into cleaner sentence breaks without changing wording; "heavy" (only if explicitly requested) can lightly restructure for readability while still preserving voice and meaning — never silently apply a heavier cleanup than requested.
6. If {{SPEAKERS}} indicates multiple speakers, keep clear speaker labels and don't merge or misattribute lines between them.

Output format: the cleaned transcript with speaker labels preserved (if applicable), formatted as readable paragraphs or dialogue.
```

## Variables
- `{{TRANSCRIPT}}` — the raw transcript text. Required.
- `{{SPEAKERS}}` — speaker names/labels if there are multiple, so attribution stays correct. Required for multi-speaker transcripts.
- `{{CLEANUP_LEVEL}}` — light / moderate / heavy, as defined in the instructions. Required — without this, cleanup intensity is a guess.

## Example
**Input:** `{{TRANSCRIPT}}` = "so um, I think the the main thing is like, when we started this project we didn't really — we didn't have a clear plan, you know, and that's, I think that's what caused most of the, the delays honestly" `{{CLEANUP_LEVEL}}` = "moderate"

**Output (excerpt):**
```
I think the main thing is, when we started this project, we didn't have a clear plan. And that's what caused most of the delays, honestly.
```

## Tips & Variations
- For a transcript that will be published verbatim as a legal or official record, use `{{CLEANUP_LEVEL}}` = "light" or don't use this prompt at all — some contexts require the literal transcript, filler words and all, and cleanup would be inappropriate regardless of readability.
- If a specific speaker's authentic voice (their characteristic phrasing, sentence rhythm) is important to preserve (e.g. a personality-driven podcast), say so explicitly and lean toward "light" cleanup even if the raw transcript is messy — heavier cleanup risks flattening exactly the voice that makes the content distinctive.
- For long transcripts, process in chunks by natural topic breaks rather than one massive pass — easier to verify meaning was preserved when checking smaller sections, and reduces the risk of drift in voice/style across a very long single output.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

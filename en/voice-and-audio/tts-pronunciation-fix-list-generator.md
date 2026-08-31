---
id: tts-pronunciation-fix-list-generator
title: TTS Pronunciation Fix List Generator
category: voice-and-audio
tags: [tts, audio]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Scans a script for words likely to be mispronounced by a TTS engine — proper nouns, acronyms, domain jargon, and heteronyms (words spelled the same but pronounced differently depending on meaning) — and generates phonetic respellings or SSML phoneme suggestions for each, rather than relying on hearing a bad rendering after the fact.

## When to use it
- You're about to run a script through a TTS pipeline and want to catch likely mispronunciations before generating audio, rather than after paying for a generation and discovering the errors.
- A TTS output mispronounced specific words and you want systematic fixes (not just for the words already caught, but similar words elsewhere in the script that would fail the same way).
- You're localizing or reusing a script across TTS engines/voices and want to verify pronunciation-risk words are flagged consistently, since different engines handle the same tricky word differently.

## The Prompt

```
You scan a script for words likely to be mispronounced by a TTS engine, and generate a fix for each.

Script: {{SCRIPT}}
TTS platform/engine, if known (affects available fix syntax): {{TTS_PLATFORM}}
Domain-specific terms already known to be tricky, if any: {{KNOWN_RISKY_TERMS}}

Instructions:
1. Scan for proper nouns (names, brands, places) that aren't common dictionary words — these are the single most common TTS mispronunciation source, since the engine has no reliable pronunciation to fall back on.
2. Scan for acronyms and initialisms, and determine for each whether it should be read as letters (spelled out) or as a word (an acronym pronounced as a single word) — flag any that a TTS engine might get wrong by default (e.g. reading "NASA" letter-by-letter, or reading an acronym meant to be spelled out as if it were a word).
3. Scan for heteronyms — words spelled identically but pronounced differently by meaning (e.g. "lead" the metal vs. "lead" as in guide, "read" past vs. present tense, "record" noun vs. verb) — flag each instance with which pronunciation the context actually requires, since a TTS engine frequently guesses wrong without disambiguating context.
4. Scan for domain jargon or technical terms unlikely to be in a general TTS pronunciation dictionary, plus anything in {{KNOWN_RISKY_TERMS}}.
5. For each flagged term, provide a phonetic respelling in plain, readable form (e.g. "Xiomara" → "see-oh-MAR-ah") AND, if {{TTS_PLATFORM}} is known and supports it, the platform-appropriate markup (e.g. SSML `<phoneme>` tag with IPA or platform-specific alphabet) — provide the plain respelling regardless of platform, since that's useful even without markup support.
6. Do not flag common words with standard, unambiguous pronunciation just to appear thorough — a long list of unnecessary flags is as unhelpful as missing real risks, since it buries the words that actually need attention.

Output format: Markdown table with columns: Term | Risk Type (proper noun / acronym / heteronym / jargon) | Correct Pronunciation Context | Phonetic Respelling | Platform Markup (if applicable). End with a count of flagged terms and a one-line note if {{TTS_PLATFORM}} wasn't specified (limiting markup usefulness).
```

## Variables
- `{{SCRIPT}}` — the script text to scan. Required.
- `{{TTS_PLATFORM}}` — the specific TTS engine/platform, if known, since phoneme markup syntax differs across engines. Optional — the plain phonetic respelling is still generated without it.
- `{{KNOWN_RISKY_TERMS}}` — any terms already known to cause problems, from past experience with this script or a similar one. Optional, but ensures those are covered explicitly rather than relying on the scan alone to catch them.

## Example
**Input:** `{{SCRIPT}}` = "Our CEO, Siobhan Ó Riain, will present the Q3 results. Please read the report before the meeting — it's a quick read." `{{TTS_PLATFORM}}` = "Amazon Polly" `{{KNOWN_RISKY_TERMS}}` = "none provided"

**Output (excerpt):**
```
| Term | Risk Type | Correct Pronunciation Context | Phonetic Respelling | Platform Markup |
|---|---|---|---|---|
| Siobhan Ó Riain | Proper noun | Irish name, non-obvious spelling-to-sound mapping | "shiv-AWN oh REE-an" | `<phoneme alphabet="ipa" ph="ʃɪˈvɔːn oʊ ˈriːən">Siobhan Ó Riain</phoneme>` |
| Q3 | Acronym-like | Read as "Q-three" (letter + number), not spelled fully out or misread as a word | "cue THREE" | `<say-as interpret-as="characters">Q3</say-as>` |
| read (first instance) | Heteronym | "Please read the report" — imperative, present tense, pronounced "reed" | "reed" | N/A — context-dependent, ensure surrounding text disambiguates |
| read (second instance) | Heteronym | "it's a quick read" — noun, pronounced "reed" here too (not "red"), but genuinely ambiguous without context; confirm intended meaning | "reed" (as intended) | N/A |

4 terms flagged. Both instances of "read" happen to share the same intended pronunciation here, but are flagged individually since heteronym risk should be checked per-instance, not assumed consistent across a script.
```

## Tips & Variations
- Pair with `voiceover-script-with-delivery-direction-annotations` (voice-and-audio, already shipped) — that prompt annotates pacing/tone/emphasis; this one is scoped specifically to pronunciation correctness, a different and complementary layer of script preparation before recording or TTS generation.
- If the same script will be run through multiple TTS engines or voices, re-run this check per platform when {{TTS_PLATFORM}} changes — markup syntax and default pronunciation dictionaries differ enough between engines that a fix verified on one platform may not transfer directly to another.
- For a script reused repeatedly (an evergreen ad, a recurring intro), save the fix list alongside the script itself so future edits can be checked against known-risky terms without re-scanning from scratch each time.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

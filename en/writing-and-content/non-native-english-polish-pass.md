---
id: non-native-english-polish-pass
title: Non-Native English Polish Pass
category: writing-and-content
tags: [editing, localization, copywriting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Fixes phrasing, idiom, and grammar issues in writing by a non-native English speaker without erasing the writer's voice or over-formalizing it — distinct from `ruthless-line-editor` (targets length, not correctness) and `tone-adapter` (changes register on already-correct English). For a draft that's understandable but reads as visibly non-native in ways the writer wants smoothed.

## When to use it
- You wrote something in English as a second (or third) language and want it to read naturally, without losing your actual phrasing choices to a generic "professional English" rewrite.
- You're editing a non-native colleague's draft and want specific, respectful fixes rather than a wholesale rewrite that erases their voice.
- The draft has a mix of genuinely wrong grammar and just slightly non-idiomatic phrasing, and you need both fixed without over-correcting things that are already fine.

## The Prompt

```
You polish English writing by a non-native speaker. You fix grammar errors and non-idiomatic phrasing. You do not rewrite sentences that are already correct just to sound more "native" or more formal, and you do not flatten the writer's voice into generic business English.

Passage: {{PASSAGE}}
Writer's native language (if known): {{NATIVE_LANGUAGE}}
Register: {{REGISTER}}

Instructions:
1. Fix genuine grammar errors (verb tense, articles, subject-verb agreement, preposition choice) — these are unambiguous corrections, not style preferences.
2. Fix non-idiomatic phrasing — word-for-word constructions from another language that read as odd or unclear in English — but only when the current phrasing would actually confuse or distract an English-speaking reader, not merely because a different native speaker might phrase it differently.
3. Do not touch: sentences that are already grammatically correct and clear, even if a native speaker might phrase them slightly differently — over-editing here is exactly the failure mode this prompt exists to avoid.
4. If {{NATIVE_LANGUAGE}} is provided, use it to anticipate common transfer errors from that language (e.g. article omission is common from languages without articles) — but still verify against the actual text rather than assuming an error is present.
5. Match {{REGISTER}} — do not "upgrade" casual writing to formal English as a side effect of fixing errors.
6. If a sentence's meaning is genuinely ambiguous (not just non-idiomatic, but unclear what was meant), do not guess-and-fix silently — mark it `[UNCLEAR: possible meanings — a) ... b) ...]` and ask instead of picking one.

Output format: the polished passage, followed by a "Changes made" list — each entry showing the original phrase, the fix, and a one-phrase reason (e.g. "'informations' -> 'information' — uncountable noun"). If nothing needed fixing in a section, don't list it.
```

## Variables
- `{{PASSAGE}}` — the text to polish. Required.
- `{{NATIVE_LANGUAGE}}` — the writer's first language, if known. Optional — improves error anticipation but not required.
- `{{REGISTER}}` — the intended formality (e.g. "casual Slack message," "formal cover letter"). Required — prevents unwanted formalization.

## Example
**Input:** `{{PASSAGE}}` = "I have three years of experience in marketing and I am responsible of the social media campaigns. I think this experiences will be useful for this position." · `{{NATIVE_LANGUAGE}}` = "French" · `{{REGISTER}}` = "formal cover letter"

**Output (excerpt):**
```
I have three years of experience in marketing, and I am responsible for the social media campaigns. I think this experience will be useful for this position.

Changes made:
- "responsible of" -> "responsible for" — fixed preposition (common transfer from French "responsable de")
- "this experiences" -> "this experience" — "experience" is uncountable here; fixed the determiner ("this" not "these") to match
```
Note "I think" was left untouched — it's already correct, and this prompt doesn't upgrade it to "I believe" just to sound more formal.

## Tips & Variations
- For a technical document (README, API docs) rather than prose, add "technical writing — keep sentences short and literal, don't add stylistic flourish" to `{{REGISTER}}`.
- If the writer wants to learn from the corrections rather than just get a fixed version, ask for the "Changes made" list grouped by error pattern (e.g. all article errors together) instead of in passage order — easier to spot a recurring pattern to watch for next time.
- For a passage with heavy jargon or code mixed in, wrap non-English-prose sections (code blocks, proper nouns) out of scope explicitly, or the model may "fix" things that were never meant to be edited.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

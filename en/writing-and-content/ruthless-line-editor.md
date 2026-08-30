---
id: ruthless-line-editor
title: Ruthless Line Editor
category: writing-and-content
tags: [editing, copywriting, readability]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Cuts a passage's word count by a target percentage while preserving its meaning and voice — a mechanical tightening pass, distinct from `tone-adapter` (changes register, not length) and `non-native-english-polish-pass` (fixes phrasing/idiom, not primarily length). For a draft that says the right thing in too many words.

## When to use it
- A draft is over a hard length limit (a newsletter, an ad, a form field with a character cap) and needs to be cut without losing the point.
- Your own writing tends to run long, and you want a fast pass that removes throat-clearing, redundancy, and hedge words before a human edit.
- You're editing someone else's draft and need a defensible, specific list of cuts rather than a vague "make it tighter" note.

## The Prompt

```
You are a ruthless line editor. You cut word count without changing what the passage actually says — you remove redundancy, hedging, throat-clearing, and inflated phrasing, you do not remove content, examples, or claims the writer needs.

Passage: {{PASSAGE}}
Target cut: {{TARGET_CUT_PERCENT}}
Voice to preserve: {{VOICE_NOTES}}

Instructions:
1. Cut toward {{TARGET_CUT_PERCENT}} of the original word count. State the original and final word count so the cut is verifiable.
2. Remove, in this priority order: throat-clearing openers ("It's important to note that..."), redundant restatement of a point already made, hedge-word stacking ("might potentially perhaps"), and inflated phrasing where a shorter word means the same thing ("utilize" -> "use").
3. Do not cut: specific examples, numbers/data, the argument's actual claims, or anything flagged in {{VOICE_NOTES}} as intentional (e.g. a deliberate repeated phrase for rhythm).
4. Preserve sentence-level voice — if the original is conversational, the tightened version should still read conversational, not compressed into clipped fragments unless that's the requested voice.
5. If {{TARGET_CUT_PERCENT}} genuinely can't be hit without cutting actual content (not just padding), say so explicitly and cut as far as you honestly can, rather than deleting a real point to hit the number.
6. If the passage is already tight (little to no removable padding), say so rather than making cosmetic changes to look like you did something.

Output format: the edited passage, followed by a short "Cuts made" list (3-6 bullets, each naming the specific type of cut, e.g. "removed 2 hedge-word stacks," "cut a redundant restatement in paragraph 3") and the word-count-before/after line.
```

## Variables
- `{{PASSAGE}}` — the text to tighten. Required.
- `{{TARGET_CUT_PERCENT}}` — how much shorter it should get (e.g. "20%", "cut to under 150 words"). Required.
- `{{VOICE_NOTES}}` — anything intentional that shouldn't be flagged as padding (e.g. "the repeated 'no excuses' phrase is deliberate"). Optional — omit if there's nothing to protect.

## Example
**Input:** `{{PASSAGE}}` = "It's important to note that our new pricing plan, which we've been working on for quite some time, is designed to potentially help customers who might possibly be looking for ways to save money on their monthly subscription costs." · `{{TARGET_CUT_PERCENT}}` = "50%"

**Output (excerpt):**
```
Our new pricing plan helps customers save money on their monthly subscription.

Cuts made:
- Removed throat-clearing opener ("It's important to note that...")
- Removed hedge-word stack ("potentially... might possibly")
- Cut irrelevant backstory ("which we've been working on for quite some time")

Word count: 38 -> 12 (68% cut)
```

## Tips & Variations
- Set `{{TARGET_CUT_PERCENT}}` to a hard character count instead of a percentage for form fields, meta descriptions, or ad copy with strict limits.
- For a passage that needs both tightening and a tone shift (e.g. formal -> casual), run `tone-adapter` first, then this prompt — doing both in one pass tends to blur which change caused what.
- If the model consistently under-cuts, add "if in doubt, cut more, not less" to `{{VOICE_NOTES}}` — some models default conservative on this task.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

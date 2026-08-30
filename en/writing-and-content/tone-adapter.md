---
id: tone-adapter
title: Tone Adapter
category: writing-and-content
tags: [tone, brand-voice, copywriting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Rewrites a passage to a specified tone/brand voice while keeping its meaning intact — a register change, distinct from `ruthless-line-editor` (changes length, not register) and `non-native-english-polish-pass` (fixes phrasing errors, not voice). For content that says the right thing but sounds wrong for where it's going.

## When to use it
- The same core message needs to go out in two different voices (e.g. a formal support-ticket reply vs. a casual social post) and rewriting from scratch each time is slower than adapting one source.
- A marketing team has brand voice guidelines and a draft that doesn't match them yet.
- You're merging content from multiple writers and need everything to read as one consistent voice before publishing.

## The Prompt

```
You rewrite a passage into a specified target tone/voice without changing what it says. You change register, word choice, sentence rhythm, and formality — you do not add or remove claims, examples, or the underlying argument.

Passage: {{PASSAGE}}
Target tone: {{TARGET_TONE}}
Tone to avoid: {{AVOID}}
Context: {{CONTEXT}}

Instructions:
1. Identify every distinct claim/point in the passage before rewriting, so you can verify none are dropped or added afterward.
2. Rewrite fully into {{TARGET_TONE}} — this means genuinely different sentence structure and word choice, not just swapping a few adjectives while keeping the original's sentence shapes.
3. If {{AVOID}} is provided, actively steer away from those qualities (e.g. avoid "corporate," avoid "overly casual for a legal context") rather than just not adding them.
4. Preserve any specific facts, numbers, names, or claims exactly — tone changes wording, not content.
5. If {{TARGET_TONE}} is inherently in tension with something in the passage (e.g. "playful" tone applied to a data-breach notification), flag that tension explicitly rather than forcing a tone that would misfire in {{CONTEXT}}, and suggest the closest tone that still fits the target direction.
6. Keep length roughly comparable to the original (within ~20%) unless the tone shift itself naturally changes it (e.g. formal-to-casual often shortens sentences) — don't pad or over-cut as a side effect.

Output format: the rewritten passage, followed by a short "What changed" note (2-4 bullets on the specific tonal shifts made, e.g. "shortened sentences, dropped passive voice, added direct address").
```

## Variables
- `{{PASSAGE}}` — the text to retone. Required.
- `{{TARGET_TONE}}` — the desired voice, described concretely (e.g. "warm but professional, like a helpful colleague, not a script" rather than just "friendly"). Required.
- `{{AVOID}}` — qualities to steer away from. Optional but recommended — narrows a vague target tone significantly.
- `{{CONTEXT}}` — where this will be published/sent and to whom (e.g. "reply to an angry customer on a support ticket"). Required — the same target tone can land differently depending on context.

## Example
**Input:** `{{PASSAGE}}` = "We regret to inform you that your requested refund has been denied due to the item falling outside our 30-day return policy window." · `{{TARGET_TONE}}` = "warm, human, apologetic without being defensive" · `{{AVOID}}` = "corporate, legalistic" · `{{CONTEXT}}` = "email reply to a customer support ticket"

**Output (excerpt):**
```
I'm sorry — I wasn't able to approve this refund. It came in just outside our 30-day return window, so I'm not able to process it through our normal system...

What changed:
- Replaced passive "we regret to inform you" with direct first-person "I'm sorry"
- Reframed the policy citation as a limitation on the writer's ability to help, not a rule being enforced against the customer
- Shortened and split the single long sentence into shorter, warmer ones
```

## Tips & Variations
- For brand-voice consistency work, paste 2-3 example sentences of the target voice into `{{TARGET_TONE}}` instead of describing it abstractly — concrete examples anchor the rewrite far better than adjectives alone.
- Chain with `ruthless-line-editor` afterward if the retoned version also needs to hit a length limit — doing tone and length in one pass tends to undercut the tone change.
- For a passage going out in multiple tones at once (e.g. one incident write-up needing an internal-engineering version and a customer-facing version), run this prompt twice with different `{{TARGET_TONE}}`/`{{CONTEXT}}` pairs rather than asking for both in one response — keeps each version fully committed to its register.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

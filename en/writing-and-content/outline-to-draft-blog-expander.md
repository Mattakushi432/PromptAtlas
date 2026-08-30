---
id: outline-to-draft-blog-expander
title: Outline-to-Draft Blog Expander
category: writing-and-content
tags: [blog, drafting, content-creation]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Expands a bullet-point outline into a full first-draft blog post in a specified voice — a drafting tool for a solo creator or content team who already knows what they want to say and needs it turned into readable prose, not an idea generator that decides what the post should argue.

## When to use it
- You have a rough outline (headings, bullet points, half-sentences) and need a coherent first draft to edit, not a blank page to stare at.
- You're producing content regularly enough that writing every post from scratch is the bottleneck, and editing a solid draft is faster than drafting one.
- You want the expansion to sound like a specific voice (yours, your brand's) rather than generic AI-blog prose.

## The Prompt

```
You expand a bullet-point outline into a full first-draft blog post. You do not invent new arguments, claims, or structure beyond what the outline implies — you write the prose that fills in what the outline already decided.

Outline: {{OUTLINE}}
Target voice/tone: {{VOICE}}
Target length: {{TARGET_LENGTH}}
Audience: {{AUDIENCE}}

Instructions:
1. Follow the outline's structure and ordering exactly — do not reorder sections, merge them, or add new top-level sections it didn't include. If a bullet is genuinely too thin to expand into a coherent paragraph, expand it as briefly as the idea supports rather than padding it with filler.
2. Write in {{VOICE}} consistently across the whole draft — vary sentence length and structure the way a human writer would, not uniform textbook-length sentences throughout.
3. Open with a hook appropriate to {{AUDIENCE}} that earns the first paragraph — do not restate the title as the first sentence.
4. Where the outline implies an example, statistic, or specific claim without providing one, mark it inline as `[NEEDS SOURCE: <what's needed>]` rather than inventing a fact, statistic, or citation.
5. Match {{TARGET_LENGTH}} within roughly 15% — if the outline is too thin to reach it without padding, say so explicitly at the end instead of padding, and if it's too dense to fit within it, note which sections you condensed most.
6. End with a closing that lands the outline's implied takeaway — do not add a generic "In conclusion" summary that just repeats the intro.
7. If {{OUTLINE}} is empty or just a title with no structure, do not draft anything — ask for at least a rough section list first.

Output format: the full draft in Markdown with the outline's headings preserved as `##`/`###`, ready to paste into an editor. Any `[NEEDS SOURCE: ...]` markers stay inline where they occur.
```

## Variables
- `{{OUTLINE}}` — the bullet-point or heading-level outline to expand. Required.
- `{{VOICE}}` — a short description of the target voice (e.g. "conversational, first-person, occasional dry humor" or "authoritative but plain-language, no jargon"). Required — this is what keeps the draft from reading as generic AI prose.
- `{{TARGET_LENGTH}}` — approximate word count (e.g. "900-1100 words"). Required.
- `{{AUDIENCE}}` — who's reading this and what they already know (e.g. "developers new to the topic" vs. "domain experts"). Required — changes vocabulary and how much is explained.

## Example
**Input:** `{{OUTLINE}}` = "1. Why most onboarding emails get ignored (too generic, sent on autopilot). 2. The 3-email sequence that actually gets read: welcome+one clear next step, social proof at day 3, direct ask at day 7. 3. Why this order matters (trust before ask)." `{{VOICE}}` = "conversational, second-person, a bit blunt" · `{{TARGET_LENGTH}}` = "700-800 words" · `{{AUDIENCE}}` = "solo founders doing their own email marketing"

**Output (excerpt):**
```
## Why most onboarding emails get ignored

You've probably sent one. "Welcome to [Product]! Here are 12 things you can do." Nobody reads that. It's not that your product isn't good — it's that the email asked for zero specific action and read like it was written for everyone, which means it was written for no one...

## The 3-email sequence that actually gets read

Three emails. That's it.

**Email 1 (day 0):** Welcome, plus exactly one next step — not a feature tour...
```

## Tips & Variations
- For a technical/documentation-style post instead of a marketing blog, set `{{VOICE}}` to something like "precise, minimal adjectives, code-comment tone" — the prompt adapts without needing a separate variant.
- If you want the draft to include a suggested title and meta description, add that as an extra outline bullet rather than a separate prompt — the model will draft it as part of the same pass.
- Pair with `ruthless-line-editor` for the tightening pass once you have a full draft — this prompt is deliberately generous with structure-preserving expansion, not compression.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

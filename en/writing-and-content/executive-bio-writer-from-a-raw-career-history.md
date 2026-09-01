---
id: executive-bio-writer-from-a-raw-career-history
title: Executive Bio Writer from a Raw Career History
category: writing-and-content
tags: [content-creation, copywriting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Turns a raw resume or career history into a polished executive bio at multiple standard lengths (one-line, one-paragraph, full) that stay consistent with each other — the same core narrative compressed differently, not three unrelated drafts — since bios get requested in different lengths for different contexts (a conference program, a speaker introduction, a website "About" page) and inconsistency between them undermines credibility.

## When to use it
- You need a bio for a conference submission, panel introduction, press mention, or website, and only have a raw resume/LinkedIn history to work from.
- You have an existing bio in one length but need it adapted to a different length for a new context, and want the shorter/longer versions to stay narratively consistent rather than drifting into different framings.
- You're helping an executive or colleague who's uncomfortable writing about themselves and needs a draft to react to and edit, not a blank page.

## The Prompt

```
You write an executive bio at three standard lengths from a raw career history, keeping all three versions narratively consistent — the same core story compressed differently, not three separately-conceived drafts that happen to describe the same person.

Raw career history (resume, LinkedIn export, notes): {{CAREER_HISTORY}}
Context this bio is for (conference speaker page, company website, press kit): {{CONTEXT}}
Specific angle or achievement to emphasize, if any: {{EMPHASIS}}

Instructions:
1. Identify the through-line first — what's the one sentence that captures who this person is professionally, before writing any length variant. Every version should trace back to this same core framing, even when compressed to a single line.
2. Write the full-length version (100-150 words) first: current role and what it actually involves, 1-2 specific career highlights with concrete detail (not vague "extensive experience"), and relevant credentials/background — grounded in {{CAREER_HISTORY}}'s actual specifics, not generic executive-bio language that could describe any senior person in the field.
3. Write the one-paragraph version (40-60 words) by compressing the full version, keeping the through-line and the single strongest highlight — not by writing a separate, shorter draft that might emphasize something different.
4. Write the one-line version (15-25 words) as the through-line itself, refined into one credible sentence — typically: role + organization + one distinguishing detail.
5. If {{EMPHASIS}} is given, make sure it survives into all three lengths in some form, even the one-liner — not just featured in the full version and dropped from the shorter ones.
6. Match tone and register to {{CONTEXT}} — a conference speaker bio can be slightly more personality-forward than a formal press-kit bio, and a company website bio may need to tie more explicitly back to the company's mission than an independent speaker bio would.

Output format: Markdown with three labeled sections (Full, Paragraph, One-Line), each containing only the bio text itself, ready to use as-is.
```

## Variables
- `{{CAREER_HISTORY}}` — the raw resume, LinkedIn export, or career notes to draw from. Required.
- `{{CONTEXT}}` — what this bio is for, since register and framing shift by context. Required.
- `{{EMPHASIS}}` — a specific achievement or angle that should be foregrounded, if there's a reason for one (e.g. the bio is for a talk specifically about a certain topic). Optional.

## Example
**Input:** `{{CAREER_HISTORY}}` = "VP of Engineering at Acme Corp (2021-present), led team from 12 to 60 engineers. Previously Director of Engineering at TechStart (2018-2021), shipped their core platform migration. Started as a backend engineer at BigCo. Speaks occasionally at industry conferences on engineering scaling." `{{CONTEXT}}` = "Conference speaker page for a talk on scaling engineering teams" `{{EMPHASIS}}` = "The 12-to-60 team growth, since the talk is specifically about scaling"

**Output (excerpt):**
```
### Full
[Name] is VP of Engineering at Acme Corp, where they've grown the engineering organization from 12 to 60 engineers over three years while keeping delivery velocity intact — the exact challenge at the center of this talk. Before Acme, they led the core platform migration as Director of Engineering at TechStart, and started their career as a backend engineer at BigCo. They speak regularly at industry conferences on the practical realities of scaling engineering teams.

### Paragraph
[Name] is VP of Engineering at Acme Corp, where they grew the team from 12 to 60 engineers over three years without losing delivery velocity. They speak regularly on the practical realities of engineering scaling.

### One-Line
[Name], VP of Engineering at Acme Corp, who scaled engineering from 12 to 60 while keeping delivery on track.
```

## Tips & Variations
- Pair with `tone-adapter` (writing-and-content, already shipped) if the same bio needs to be adapted for a meaningfully different register than what this prompt's {{CONTEXT}}-based calibration produces (e.g. a much more casual internal-newsletter bio) — that prompt handles a broader tone shift than this one's built-in context calibration covers.
- Update all three lengths together whenever the underlying facts change (a promotion, a new highlight worth featuring) rather than patching just the version currently in use — a stale one-liner next to an updated full bio is a common, easily-avoided inconsistency.
- If {{CAREER_HISTORY}} is genuinely thin for the intended {{CONTEXT}} (e.g. a first-time conference speaker with limited public speaking history), don't pad with vague superlatives to fill the space — a shorter, accurate bio reads better than an inflated one, and this is worth saying explicitly rather than working around silently.

## Changelog
- 1.0.0 (2026-09-01): Initial version.

---
id: ux-microcopy-reviewer
title: UX Microcopy Reviewer
category: writing-and-content
tags: [ux-writing, microcopy, editing]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Audits UI microcopy — button labels, error messages, empty states, tooltips, confirmation dialogs — for clarity, tone consistency, and actionability, and proposes specific rewrites for each finding. A critique-and-fix tool for interface text, not a general copy generator.

## When to use it
- You're reviewing a feature before ship and want a pass over its UI strings specifically (not the whole product) for clarity and consistency.
- Error messages or empty states were written ad hoc by different engineers/designers and read inconsistently across the product.
- You need to defend specific microcopy changes to a team (not just "this is bad") — each finding needs a concrete reason and fix.

## The Prompt

```
You review UI microcopy (button labels, error messages, empty states, tooltips, confirmation/destructive-action dialogs) for clarity, tone consistency, and actionability, and propose a specific rewrite for every finding.

Microcopy strings: {{STRINGS}}
Product voice guidelines (if any): {{VOICE_GUIDELINES}}
Context notes: {{CONTEXT}}

Instructions:
1. Review each string against these criteria: (a) clarity — does it say what happened/what to do without jargon or ambiguity; (b) actionability — for errors/empty states, does it tell the user what to do next, not just what went wrong; (c) tone consistency — does it match {{VOICE_GUIDELINES}} and the tone of the other strings; (d) appropriate weight — does a destructive/irreversible action's copy make the stakes clear, and does a low-stakes action avoid unnecessary alarm.
2. For every string with a finding, give: the original, the issue (one of the four criteria above, named specifically), and a rewritten version.
3. For error messages specifically: flag any that state only what's wrong ("Something went wrong") without a next step, and any that expose raw technical detail (stack traces, internal error codes) to an end user without a plain-language layer above it.
4. For destructive-action confirmations (delete, cancel subscription, etc.): verify the copy names the specific consequence (not just "Are you sure?") and that the confirm button's label states the action, not a generic "OK"/"Yes."
5. If a string is already good, don't invent a finding for it just to have something to say — say explicitly which strings passed with no changes needed.
6. Keep rewrites genuinely shippable — actual button-label-length copy, not a paragraph explaining what the button should say.

Output format: Markdown, one entry per string with a finding: `**Original:** ... **Issue:** ... **Rewrite:** ...`. End with a one-line summary of which strings passed unchanged.
```

## Variables
- `{{STRINGS}}` — the microcopy to review, ideally with a location label (e.g. "delete-project-modal: 'Are you sure?'"). Required.
- `{{VOICE_GUIDELINES}}` — brand/product voice notes if they exist. Optional — without it, the review still checks clarity/actionability/weight but tone consistency is judged only against the strings' own internal consistency.
- `{{CONTEXT}}` — anything about the feature/user that changes what "clear" means here (e.g. "used by non-technical end users," "internal admin tool for engineers"). Recommended — an audience note materially changes what counts as jargon.

## Example
**Input:** `{{STRINGS}}` = "delete-account-modal: 'Are you sure?' [Cancel] [OK]" · `{{CONTEXT}}` = "consumer app, end users are non-technical"

**Output (excerpt):**
```
**Original:** "Are you sure?" [Cancel] [OK]
**Issue:** Appropriate weight — this is an irreversible, destructive action, but the copy doesn't name the consequence, and the confirm button label ("OK") doesn't state what it does.
**Rewrite:** "Delete your account? This permanently removes your data and can't be undone." [Cancel] [Delete account]

Summary: 1 string reviewed, 1 finding, 0 passed unchanged.
```

## Tips & Variations
- For a full audit across a feature, pass every string in the flow at once rather than one at a time — cross-string consistency (does every error use the same "what happened + what to do" pattern) is only checkable in aggregate.
- If the product has a formal voice guide, paste its actual example phrases into `{{VOICE_GUIDELINES}}` rather than summarizing it — concrete examples anchor tone judgments better than adjectives like "friendly."
- Pair with `tone-adapter` if a whole batch of strings needs a tone shift after this review identifies the inconsistency, rather than rewriting tone string-by-string here.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

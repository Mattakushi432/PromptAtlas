---
id: strategic-options-comparison-matrix-builder
title: Strategic Options Comparison Matrix Builder
category: business-and-strategy
tags: [strategy, decision-making]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Structures 2-4 genuinely distinct strategic paths side by side against the same criteria — checks that the options actually differ in substance rather than being minor variations dressed up as alternatives, and that the comparison criteria are applied evenly rather than favoring whichever option was already the presenter's preference, avoiding both a false binary (only two options considered when more exist) and an uneven comparison (the preferred option evaluated generously, others evaluated harshly).

## When to use it
- You're presenting a strategic decision to leadership and want the options laid out fairly, not structured so the "right" answer is obviously predetermined by how the comparison itself was built.
- You suspect a decision has been framed as a false binary (option A vs. the status quo) when there are other genuinely viable paths that haven't been seriously considered.
- You want to check your own thinking before presenting — is your preferred option actually winning on the merits, or does the comparison only look that way because of how it's structured?

## The Prompt

```
You structure a comparison matrix for genuinely distinct strategic options, applying the same criteria evenly to each. You check that the options are actually different in substance, not variations of the same underlying path — and you check that the comparison doesn't quietly favor one option through uneven treatment.

Options under consideration (however roughly described): {{OPTIONS}}
Decision criteria that matter for this choice: {{CRITERIA}}
Any option that appears to be the presenter's preference, if known: {{PRESUMED_PREFERENCE}}

Instructions:
1. Check whether {{OPTIONS}} actually represents genuinely distinct paths, or whether some are minor variations of the same underlying strategy dressed up as separate options (e.g. "aggressive expansion" and "moderate expansion" might be the same strategy at different speeds, not two different strategies) — if so, say so explicitly and suggest whether they should be merged or genuinely differentiated before proceeding.
2. Check whether {{OPTIONS}} represents a false binary — if only two options are given but a third genuinely viable path exists (a hybrid, a "do nothing differently," a smaller-scope pilot version of one of the options), name it explicitly even though it wasn't in the original list, since a comparison structured for two paths can quietly foreclose consideration of a better third path.
3. Score each option against every criterion in {{CRITERIA}} using the same standard — apply identical rigor when assessing risk/cost/feasibility for each option rather than giving the presumed-preferred option (if {{PRESUMED_PREFERENCE}} is stated) a more generous read on the same criterion than the alternatives receive.
4. For each score, give specific reasoning, not just a rating — a table with numbers alone invites the reader to trust the aggregate without checking the underlying judgment; the reasoning is what actually makes the comparison auditable.
5. If {{PRESUMED_PREFERENCE}} is stated, explicitly check whether that option's evaluation reads more favorably than the others on any criterion without a substantively different justification — call this out directly if found, since an unconsciously uneven comparison is one of the most common ways strategic decision-making processes produce a predetermined answer dressed up as analysis.
6. Do not force a single recommended winner if the options genuinely trade off against each other with no clear best choice given {{CRITERIA}} — state that honestly, including which criterion the decision actually hinges on, rather than manufacturing false confidence in one option.

Output format: Markdown table (rows = options, columns = criteria, cells = score + brief reasoning). Followed by a "Comparison Integrity Check" section addressing steps 1, 2, and 5 explicitly, and a recommendation section (or an honest "genuinely close, hinges on X" if that's the actual read).
```

## Variables
- `{{OPTIONS}}` — the strategic paths being compared, however roughly described initially. Required.
- `{{CRITERIA}}` — what actually matters for this decision (cost, risk, time-to-value, strategic fit, reversibility). Required — without stated criteria, the comparison has nothing consistent to score against.
- `{{PRESUMED_PREFERENCE}}` — which option, if any, appears to already be favored going into this comparison. Optional, but sharpens the fairness check in step 5 significantly when provided honestly.

## Example
**Input:** `{{OPTIONS}}` = "A) Acquire a smaller competitor to gain their customer base. B) Build the equivalent capability in-house over 18 months. C) Partner with the competitor instead of acquiring them." `{{CRITERIA}}` = "Speed to market, capital required, integration risk, strategic control" `{{PRESUMED_PREFERENCE}}` = "Leadership has been leaning toward Option A (acquisition)"

**Output (excerpt):**
```
| Option | Speed to Market | Capital Required | Integration Risk | Strategic Control |
|---|---|---|---|---|
| A) Acquire | Fast — immediate customer base access | High — acquisition price plus integration costs | High — cultural/systems integration is the most common way acquisitions underdeliver on projected value | High — full ownership and control post-integration |
| B) Build in-house | Slow — 18 months minimum before comparable capability exists | Moderate — spread over 18 months, no acquisition premium | Low — no external integration, but execution risk on the build itself | High — full control throughout |
| C) Partner | Fast — comparable speed to acquisition without the integration step | Low — no acquisition price, ongoing partnership costs instead | Low — no integration since operations stay separate | Low — dependent on partner's continued cooperation and terms |

### Comparison Integrity Check
Distinctness: All three options represent genuinely different strategic postures (own outright, build alone, share control) rather than variations of one approach — no merge needed.
False binary check: {{OPTIONS}} already includes three paths, not two, so no additional option is being surfaced here.
Preference fairness check: {{PRESUMED_PREFERENCE}} indicates leadership favors Option A. Reviewing the scores: Option A's "High" integration risk is scored on the same basis as the reasoning would require for any acquisition (a well-documented general risk category, not softened here) — the comparison doesn't appear to under-score A's risk relative to the others. Worth explicitly noting to leadership that A carries the highest capital requirement and highest integration risk of the three, since a presumed preference can make it easy to under-weight exactly those two criteria in discussion.

### Recommendation
Genuinely close between A and C depending on how much weight leadership places on strategic control versus capital efficiency and integration risk — this decision hinges specifically on that tradeoff, not on one option being objectively superior across all criteria.
```

## Tips & Variations
- Pair with `pre-merge-risk-assessment`-style thinking or `strategic-decision-pre-mortem` (business-and-strategy, already shipped) on whichever option this comparison leads toward — this prompt compares options at the selection stage; a pre-mortem then stress-tests the chosen path specifically once it's selected.
- If {{PRESUMED_PREFERENCE}} isn't stated because you'd rather the comparison be built blind to it, that's a reasonable choice — the fairness check in step 5 becomes a general request to flag any option that reads unusually favorably rather than a targeted check against a named preference.
- For a decision with more than 4 genuinely distinct options, consider narrowing to the most viable 3-4 before running this prompt rather than comparing everything at once — a matrix with too many options tends to produce shallow scoring on each rather than the depth of reasoning that makes the comparison actually useful.

## Changelog
- 1.0.0 (2026-09-01): Initial version.

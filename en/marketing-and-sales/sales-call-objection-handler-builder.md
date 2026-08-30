---
id: sales-call-objection-handler-builder
title: Sales Call Objection Handler Builder
category: marketing-and-sales
tags: [sales-enablement, objection-handling, sales]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Builds a reference sheet of responses to common sales objections for a specific product/offer — for an SDR or sales enablement manager preparing a rep (often a new one) for live calls, not a script to read verbatim.

## When to use it
- Onboarding a new SDR/AE and want them equipped with solid objection responses before their first calls, without writing a full script that sounds robotic on the phone.
- Reps are handling a recurring objection inconsistently or poorly, and you want a documented, agreed-upon response the team can align on.
- A new pricing model, competitor, or market condition has introduced a new objection type reps haven't seen scripted responses for yet.

## The Prompt

```
You build a sales objection-handling reference sheet: for each objection, a response structure a rep can internalize and adapt in their own words, not a verbatim script.

Product/offer: {{OFFER}}
Objections to cover: {{OBJECTIONS}}
Known differentiators/proof points: {{PROOF_POINTS}}
Sales motion: {{SALES_MOTION}}

Instructions:
1. For each objection in {{OBJECTIONS}}, structure the response as: acknowledge (a genuine one-line acknowledgment, not a dismissive "I understand, but..."), reframe (what's actually true or what the objection is really about), and respond (the specific answer, using {{PROOF_POINTS}} where relevant to that objection — do not force an unrelated proof point in).
2. Do not write full verbatim scripts — write the response as bullet points/talking points a rep adapts in their own voice on a live call, since a memorized script that gets interrupted mid-sentence sounds worse than an adapted one.
3. Distinguish objections that are really about price/budget from objections that are really about risk/trust from objections that are really about timing — the same surface objection ("it's too expensive") can be any of the three, and the response should match which one it actually is, noted explicitly.
4. If an objection in {{OBJECTIONS}} doesn't have a strong honest response given {{PROOF_POINTS}} (e.g. a real competitive gap), say so plainly and suggest the best honest partial response rather than inventing an unconvincing rebuttal — a rep caught overselling on a weak claim loses more trust than one who's honest about a gap.
5. Adjust formality/pacing to {{SALES_MOTION}} — a high-touch enterprise motion supports a longer reframe; a high-volume SDR motion needs something usable in a 15-second window before the prospect moves on.
6. Flag any objection that's actually a disqualifying signal (the prospect genuinely isn't a fit) rather than an objection to overcome — pushing past a real disqualifier wastes both sides' time.

Output format: Markdown, one entry per objection: `### "{{objection as the prospect would say it}}"` followed by Acknowledge / Reframe / Respond as short bullet points, and a one-line note on the underlying objection type (price/risk/timing/disqualifier).
```

## Variables
- `{{OFFER}}` — what's being sold and its core value prop. Required.
- `{{OBJECTIONS}}` — the specific objections to cover, ideally in the prospect's actual words if you have them (e.g. real call notes), not paraphrased. Required.
- `{{PROOF_POINTS}}` — case studies, data, guarantees, or specific product facts reps can lean on. Recommended — without it, responses stay generic.
- `{{SALES_MOTION}}` — e.g. "high-volume outbound SDR calls, 15-30 min," "enterprise sales cycle, multi-call, technical buyer." Required — changes pacing and depth.

## Example
**Input:** `{{OFFER}}` = "A code review tool that catches security issues before merge" · `{{OBJECTIONS}}` = "\"We already use a linter, isn't that enough?\"" · `{{PROOF_POINTS}}` = "Linters catch style/syntax issues; this tool caught a hardcoded-secret leak for [Company X] that their linter missed entirely" · `{{SALES_MOTION}}` = "mid-market outbound, single call to a dev team lead"

**Output (excerpt):**
```
### "We already use a linter, isn't that enough?"
- **Acknowledge:** Fair question — linters do catch a lot, and if that's covering what you need, we're not the right fit.
- **Reframe:** Linters check style and syntax; they're not built to catch security-specific issues like leaked secrets or injection risks — different problem, different tool.
- **Respond:** [Company X]'s linter was in place and passing when a hardcoded secret shipped to a PR — our tool caught it before merge. Worth a look at what a linter structurally can't check for.

Objection type: risk/trust (they believe existing tooling already covers this — not a price or timing objection).
```

## Tips & Variations
- For objection-handling roleplay practice rather than a reference sheet, pair the output with an actual live conversation simulation — this prompt is the prep material, not the practice partner itself.
- If the team disagrees on the right response to an objection, generate 2 alternate `Respond` variants for that one objection and use it as a discussion starter rather than treating the first output as final.
- Revisit this sheet whenever `{{PROOF_POINTS}}` materially changes (new case study, new competitor) — a reference sheet built on stale proof points erodes rep credibility over time.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

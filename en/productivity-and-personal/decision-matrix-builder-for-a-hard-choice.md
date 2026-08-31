---
id: decision-matrix-builder-for-a-hard-choice
title: Decision Matrix Builder for a Hard Choice
category: productivity-and-personal
tags: [decision-making, productivity, planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Builds a weighted decision matrix (options × criteria, weighted and scored) for a hard personal or professional choice — structures the tradeoffs you already sense but haven't made explicit, rather than telling you what to decide.

## When to use it
- You're stuck between options and keep going in circles because the tradeoffs are in your head unstructured rather than laid out clearly.
- You want to check whether your gut-feel choice actually holds up once the criteria that matter to you are made explicit and weighted.
- You need to explain a decision to someone else (a partner, a manager, a board) and want a structured artifact, not just "I have a feeling about this."

## The Prompt

```
You build a weighted decision matrix for a hard choice. You structure the decision-maker's own stated criteria and honest option assessments — you do not decide for them or inject criteria they didn't mention as if they were given.

The decision: {{DECISION}}
Options: {{OPTIONS}}
Criteria that matter (if known): {{CRITERIA}}

Instructions:
1. If {{CRITERIA}} isn't given or seems incomplete, ask what actually matters for this decision before building the matrix — a matrix built on guessed criteria produces a confident-looking but ungrounded answer.
2. For each criterion, ask the decision-maker to weight its relative importance (or accept weights if already given) — do not assume all criteria matter equally, since that's rarely true and flattens the real tradeoff.
3. Score each option against each criterion on a consistent scale (e.g. 1-5), and ask for the reasoning behind non-obvious scores rather than silently assigning them — if you're inferring a score rather than being told it, say so explicitly (`[INFERRED: ...]`).
4. Calculate weighted totals, but explicitly frame the result as one input to the decision, not the final verdict — a decision matrix surfaces the structure of a tradeoff; it doesn't override judgment on factors that resist quantification (gut feeling, values, risk tolerance not captured in the criteria).
5. After the totals, check for a close call: if the top two options are within a small margin, say so explicitly and note which criterion, if it were weighted differently, would flip the outcome — this is often more useful than the raw ranking, because it shows what the decision actually hinges on.
6. If a criterion is stated in a way that's really about avoiding a decision (e.g. "which one is safer" without defining what safety means here), ask for it to be made concrete before scoring, rather than scoring against a vague criterion.

Output format: a Markdown table (rows = options, columns = criteria + weighted total), followed by a `### What This Hinges On` section addressing any close call.
```

## Variables
- `{{DECISION}}` — a one-line description of the decision being made. Required.
- `{{OPTIONS}}` — the specific options being weighed. Required.
- `{{CRITERIA}}` — what matters in making this choice, if already known. Optional — the prompt will ask if this is missing or thin.

## Example
**Input:** `{{DECISION}}` = "Whether to take a new job offer or stay at my current company" `{{OPTIONS}}` = "Stay at current company; Take the new offer" `{{CRITERIA}}` = "Compensation (weight: high), growth opportunity (weight: high), team/culture fit (weight: medium), commute (weight: low)"

**Output (excerpt):**
```
| Criterion (weight) | Stay | New Offer |
|---|---|---|
| Compensation (high) | 3/5 — current comp is fine but hasn't grown in 2 years | 5/5 — new offer is a meaningful raise |
| Growth opportunity (high) | 2/5 — [INFERRED: you mentioned feeling stuck in earlier conversation — confirm this is accurate] | 4/5 — new role has a clearer path to more scope |
| Team/culture fit (medium) | 5/5 — known, trusted team | 2/5 — unknown, only met 3 people in interviews |
| Commute (low) | 4/5 | 3/5 |
| **Weighted total** | ... | ... |

### What This Hinges On
The two options are close once weighted. The single largest swing factor is Team/Culture Fit — you're rating the new offer low there specifically because it's unknown, not because you have negative signal. If that score reflects genuine uncertainty rather than a real red flag, it may be worth weighting it as neutral rather than low until you have more information (e.g. talking to a future teammate), which would shift the total meaningfully toward the new offer.
```

## Tips & Variations
- Don't treat the weighted total as the final answer if it conflicts strongly with your gut — that conflict is itself useful information, either that a criterion is mis-weighted or that something not captured in the matrix (values, risk tolerance) is actually driving your real preference.
- For a decision with more than a handful of criteria, resist the urge to add every possible factor — a matrix diluted across 15 criteria of similar weight tends to produce a wash that doesn't actually clarify anything; keep it to the 4-6 criteria that genuinely differentiate the options.
- For a reversible, low-stakes decision, this level of structure is often overkill — this prompt is most valuable for genuinely hard, high-stakes, or hard-to-reverse choices where the effort of structuring is worth it.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

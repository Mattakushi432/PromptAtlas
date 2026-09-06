---
id: new-market-sizing-sanity-checker
title: New Market Sizing Sanity-Checker
category: business-and-strategy
tags: [market-research]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Stress-tests a TAM/SAM/SOM market-sizing estimate's actual methodology and assumptions before it gets used to anchor a strategic decision — checks for the specific errors that make sizing estimates look precise while being built on shaky foundations (a pure top-down estimate with no bottom-up cross-check, double-counted adjacent markets, an unrealistic capture-rate assumption) and identifies which single assumption the whole estimate is most sensitive to.

## When to use it
- A market-sizing estimate (TAM/SAM/SOM) is about to be used to justify a strategic decision — a market entry, a fundraise, a resource allocation — and you want it checked before it anchors that decision, not after the decision's already been made on a number that doesn't hold up.
- You're reviewing someone else's market-sizing work (a team member's, a consultant's, an investor's own estimate) and want a structured way to identify where it's actually solid versus where it's built on an unexamined assumption.
- You want to check your own market-sizing methodology before presenting it, since numbers that look impressively precise often invite less scrutiny than they deserve.

## The Prompt

```
You stress-test a market-sizing estimate's methodology and assumptions. You are not questioning whether the market is attractive — you are checking whether the specific numbers given are actually derived soundly, and which assumption the estimate is most sensitive to.

Market sizing as given (TAM/SAM/SOM figures and how they were derived): {{SIZING_ESTIMATE}}
What decision this sizing is meant to inform: {{DECISION_CONTEXT}}
Source/methodology details, if provided (top-down from an industry report, bottom-up from unit economics, a hybrid): {{METHODOLOGY}}

Instructions:
1. Identify whether {{SIZING_ESTIMATE}} was built top-down (starting from a broad industry figure and narrowing), bottom-up (starting from a unit of value — customers, transactions — and building up), or claims to be both — if it's purely top-down with no bottom-up cross-check (or vice versa), flag this explicitly, since a single-method estimate with no cross-validation is the most common source of an unreliable sizing number that still looks authoritative.
2. Check for double-counting: does the addressable-market definition overlap with an adjacent market segment in a way that inflates the figure — e.g. counting the same potential customer in two different market categories that were added together rather than treated as overlapping.
3. Check the SOM (serviceable obtainable market) capture-rate assumption specifically — what percentage of the SAM does the estimate assume can realistically be captured, and is that percentage benchmarked against a comparable real company's actual market share achievement, or is it an unsupported round number (a suspiciously common pattern: assuming exactly 1%, 5%, or 10% capture with no stated reasoning for that specific figure)?
4. Check the estimate's actual precision against its apparent precision — a TAM stated to the nearest million dollars built on inputs that are themselves rough estimates (an industry report's own approximate figures) has false precision; flag this if present, since it can make a shaky estimate look more rigorous than its actual inputs support.
5. Identify which single assumption the overall estimate is most sensitive to — if changing one input by a plausible margin (a growth-rate assumption, a price-point assumption, the capture-rate assumption) would swing the final number dramatically, name that specific assumption as the one actually worth the most additional scrutiny, rather than treating every input as equally load-bearing.
6. Given {{DECISION_CONTEXT}}, assess whether the estimate's current level of rigor is actually sufficient for the stakes of this specific decision — a rough sizing estimate might be entirely adequate for an early exploratory conversation but insufficient to anchor a major resource-allocation or fundraising decision; state which situation {{DECISION_CONTEXT}} actually represents.

Output format: Markdown with sections: Methodology Assessment (top-down/bottom-up/cross-validated), Double-Counting Check, Capture-Rate Assessment, Precision-vs-Rigor Check, Most-Sensitive Assumption, and a verdict on whether the estimate's rigor matches what {{DECISION_CONTEXT}} actually requires.
```

## Variables
- `{{SIZING_ESTIMATE}}` — the actual TAM/SAM/SOM figures and however much detail exists on how they were derived. Required.
- `{{DECISION_CONTEXT}}` — what strategic decision this sizing estimate is meant to inform, since the required rigor scales with the stakes. Required.
- `{{METHODOLOGY}}` — additional detail on the sizing methodology if available beyond what's implicit in {{SIZING_ESTIMATE}}. Optional, but improves the accuracy of the methodology assessment.

## Example
**Input:** `{{SIZING_ESTIMATE}}` = "TAM: $12B (from an industry report on the broader software category). SAM: $2.4B (20% of TAM, described as 'the portion relevant to our specific segment'). SOM: $120M (5% capture of SAM within 5 years)." `{{DECISION_CONTEXT}}` = "Being used to justify a $15M Series A raise for market entry" `{{METHODOLOGY}}` = "Entirely top-down, no bottom-up cross-check performed"

**Output (excerpt):**
```
### Methodology Assessment
Purely top-down with no bottom-up cross-check, confirmed by {{METHODOLOGY}}. This is the single biggest structural gap in the estimate — a bottom-up check (e.g. "how many potential customers exist, at what average price point, does that independently arrive near $2.4B?") would either corroborate the top-down figure or reveal a large discrepancy worth investigating before this number anchors a $15M raise.

### Double-Counting Check
The SAM's "20% of TAM" narrowing is stated as a round number with no described derivation logic — it's unclear whether this 20% was derived from an actual addressable-segment analysis or is itself a rough guess dressed up as a percentage. Flag: this isn't confirmed double-counting, but the lack of stated derivation logic makes it impossible to rule out.

### Capture-Rate Assessment
5% SOM capture within 5 years — no benchmark given against a comparable company's actual achieved market share at a similar stage. This is exactly the "suspiciously round number" pattern to flag: 5% is a common default assumption in pitch materials specifically because it sounds modest and achievable, not because it's been derived from a comparable case.

### Precision-vs-Rigor Check
$120M SOM stated to three significant figures, built on a chain of top-down percentage-narrowing with no bottom-up support — the apparent precision (a specific dollar figure) substantially overstates the actual rigor of the underlying derivation.

### Most-Sensitive Assumption
The SOM capture-rate (5%) is the most sensitive input — moving it to 2% or 10% would move the bottom-line SOM by more than doubling or halving it, and it's also the least-supported assumption in the chain (no comparable benchmark given). This is the single assumption most worth additional scrutiny before the estimate anchors {{DECISION_CONTEXT}}.

### Verdict
Given {{DECISION_CONTEXT}} is a $15M Series A raise, the current level of rigor (purely top-down, unbenchmarked capture rate, no cross-validation) is insufficient for the stakes involved. Recommend a bottom-up cross-check and a benchmarked capture-rate assumption before this number is presented as the basis for the raise, not because the market is necessarily unattractive, but because the specific number currently can't be defended under investor scrutiny.
```

## Tips & Variations
- Pair with `market-entry-feasibility-checklist` (business-and-strategy, already shipped) once the sizing estimate is confirmed sound — that prompt covers the broader feasibility question (regulatory, competitive, distribution barriers) beyond just whether the market is large enough; sizing rigor and feasibility are separate checks that both matter for a market-entry decision.
- A market-sizing estimate built for an early, low-stakes exploratory conversation doesn't need the same rigor as one anchoring a major fundraise or resource-allocation decision — use {{DECISION_CONTEXT}} honestly rather than holding every sizing exercise to fundraise-grade rigor regardless of what it's actually being used for.
- If a bottom-up cross-check genuinely can't be performed (no reliable unit-economics data exists yet), say so as a real limitation rather than treating this prompt's methodology check as something that can always be fully satisfied — an early-stage estimate is sometimes honestly top-down-only, and the right response is flagging that limitation explicitly to decision-makers, not fabricating a bottom-up number to check a box.

## Changelog
- 1.0.0 (2026-09-01): Initial version.

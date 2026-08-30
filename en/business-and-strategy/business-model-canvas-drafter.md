---
id: business-model-canvas-drafter
title: Business Model Canvas Drafter
category: business-and-strategy
tags: [business-model, strategy, planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Turns a founder's rough notes about a business idea into a structured Business Model Canvas (the standard 9-block framework: customer segments, value propositions, channels, customer relationships, revenue streams, key resources, key activities, key partnerships, cost structure) — organizes and pressure-tests what's already implied, not a generator of business ideas from nothing.

## When to use it
- You have a business idea in your head but haven't formalized it into a structure you can share, pressure-test, or iterate on.
- You want to spot the weakest/least-thought-through blocks in your current thinking before pitching or building.
- You're revising an existing model after new information (a failed assumption, new market feedback) and need to see the downstream effects on other blocks.

## The Prompt

```
You draft a Business Model Canvas from a founder's rough notes about a business idea. You organize and sharpen what's already implied — you do not invent customer segments, revenue numbers, or partnerships not grounded in the notes.

Business notes: {{NOTES}}
Stage (idea / early traction / scaling): {{STAGE}}

Instructions:
1. Fill all 9 canvas blocks (Customer Segments, Value Propositions, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partnerships, Cost Structure) from the notes. For any block with no basis in the notes, mark it `[NEEDS INPUT: ...]` rather than inventing a plausible-sounding entry.
2. Check for internal consistency across blocks: does the Value Proposition block actually address the Customer Segments block; do the Revenue Streams block plausibly follow from the Value Propositions; do the Key Activities support what the Value Propositions promise. Flag any block that doesn't line up with another rather than silently smoothing over the gap.
3. If {{NOTES}} describes more than one plausible customer segment with meaningfully different needs, don't merge them into one vague segment — list them separately and flag that the value proposition may need to differ per segment.
4. Weight the depth of each block to {{STAGE}}: an idea-stage canvas can have more `[NEEDS INPUT: ...]` gaps in Revenue Streams/Cost Structure since those are genuinely less known yet; a scaling-stage canvas should have those blocks filled with real, not hypothetical, figures if the notes provide them.
5. End with the single weakest, least-supported block and why — the most useful output of a first pass isn't a complete-looking canvas, it's knowing where the real thinking still needs to happen.

Output format: Markdown, one section per block (`### Customer Segments`, etc.), plus a closing `### Weakest Block` section.
```

## Variables
- `{{NOTES}}` — the founder's rough description of the business idea, as detailed as available. Required.
- `{{STAGE}}` — idea / early traction / scaling. Required — changes how much gap-marking is expected vs. concerning.

## Example
**Input:** `{{NOTES}}` = "App that matches freelance graphic designers with small businesses needing quick logo/branding work. Designers set their rate, businesses browse portfolios. Take a cut of each transaction." `{{STAGE}}` = "idea"

**Output (excerpt):**
```
### Customer Segments
1. Freelance graphic designers seeking quick-turnaround client work.
2. Small businesses needing logo/branding work, likely price- and speed-sensitive given "quick work" framing.

### Value Propositions
For designers: [NEEDS INPUT: what's the pitch beyond "get clients" — lower fees than competitors? better clients? faster payment?]
For businesses: Fast access to vetted designers at a set rate, browsable by portfolio.

### Revenue Streams
Transaction fee ("cut of each transaction") — percentage not specified. [NEEDS INPUT: what percentage, and is it charged to designer, business, or split?]
...

### Weakest Block
Value Propositions for the designer side — the notes describe the mechanism (set a rate, get browsed) but not why a designer would choose this platform over competitors like Fiverr/Upwork. This is worth resolving before Channels or Customer Relationships can be meaningfully drafted, since acquisition strategy depends on knowing the actual differentiator.
```

## Tips & Variations
- Once the canvas is drafted, feed the "Weakest Block" finding into a dedicated research/validation pass (customer interviews, competitor research) rather than trying to fill the gap with more assumptions.
- For a pivot scenario, run this prompt on both the old and new model side by side to see exactly which blocks changed — this makes the pivot's real scope visible rather than a vague "we're pivoting" statement.
- This prompt doesn't validate market size, unit economics viability, or competitive strength — it only organizes and checks internal consistency of what's given; pair with dedicated market-research or unit-economics analysis for those questions.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

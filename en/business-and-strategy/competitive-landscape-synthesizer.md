---
id: competitive-landscape-synthesizer
title: Competitive Landscape Synthesizer
category: business-and-strategy
tags: [competitive-analysis, market-research, strategy]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Organizes raw research notes about several competitors into a structured comparison (positioning, strengths, weaknesses, likely strategic direction) and surfaces the actual competitive gaps — a synthesis tool for research already gathered, not a live web-research tool: it works from what you feed it, and says so when a comparison needs more input.

## When to use it
- You've gathered scattered notes on competitors (their websites, pricing pages, reviews, sales calls where they came up) and need it organized into something presentable and useful for a decision.
- You're prepping for a strategy discussion and need the competitive picture synthesized rather than restating raw notes.
- You want to check your own competitive assumptions against what the actual notes support, rather than what you've been assuming.

## The Prompt

```
You synthesize raw competitor research notes into a structured comparison and identify genuine competitive gaps. You work only from the notes given — you do not invent competitor features, pricing, or market share not present in the input, and you say explicitly when the notes are too thin to support a claim.

Our positioning: {{OUR_POSITIONING}}
Competitor notes: {{COMPETITOR_NOTES}}
Decision this analysis will inform: {{DECISION_CONTEXT}}

Instructions:
1. For each competitor in {{COMPETITOR_NOTES}}, synthesize: their apparent positioning/target segment, stated or inferable strengths, stated or inferable weaknesses, and (if the notes support it) their likely next strategic move. Mark any of these `[THIN: notes don't cover this]` rather than filling the gap with a plausible-sounding guess.
2. Build a comparison specifically relative to {{OUR_POSITIONING}} — don't just list each competitor in isolation; state where each one directly overlaps with us and where they clearly don't compete for the same customer.
3. Identify genuine white space: segments, use cases, or feature areas that the notes suggest no competitor (including us) currently serves well — distinguish this from a segment nobody serves because it's genuinely unattractive (small, low-willingness-to-pay) versus one that's underserved because of a real gap.
4. Flag any competitor claim in the notes that reads as marketing language rather than verified fact (e.g. "industry-leading," "#1 rated") and treat it as unverified rather than as established fact in the synthesis.
5. Tie the synthesis explicitly back to {{DECISION_CONTEXT}} — end with what this comparison specifically implies for that decision, not a generic "here's the landscape" summary disconnected from why the analysis was requested.

Output format: Markdown, one section per competitor with the four elements above, a `### Comparison vs. Us` table, a `### White Space` section, and a closing `### Implication for [decision]` section.
```

## Variables
- `{{OUR_POSITIONING}}` — a short description of our own product/positioning, for comparison. Required.
- `{{COMPETITOR_NOTES}}` — raw research notes on each competitor, however informal. Required — synthesis quality is bounded by input quality here.
- `{{DECISION_CONTEXT}}` — what this analysis needs to inform (a pricing decision, a feature prioritization call, a go/no-go on entering a segment). Required — without it, the synthesis stays generic.

## Example
**Input:** `{{OUR_POSITIONING}}` = "Project management tool built specifically for small creative agencies, with time-tracking built in." `{{COMPETITOR_NOTES}}` = "Asana: general-purpose, huge feature set, no native time-tracking, popular with larger teams. Harvest: dedicated time-tracking tool, minimal project management features, well-loved by agencies specifically." `{{DECISION_CONTEXT}}` = "Whether to invest further in time-tracking features or pivot toward broader PM feature parity with Asana."

**Output (excerpt):**
```
### Asana
Positioning: General-purpose PM for teams of many sizes/industries. Strengths: breadth of features, brand recognition, large team traction. Weaknesses: no native time-tracking (per notes) — a gap we currently fill. Likely next move: [THIN: notes don't cover Asana's roadmap or recent announcements].

### Harvest
Positioning: Dedicated time-tracking, agency-loved. Strengths: strong agency affinity, focused product. Weaknesses: minimal PM features (per notes) — the inverse gap from Asana.

### White Space
The notes suggest a real gap between "broad PM, no time-tracking" (Asana) and "great time-tracking, thin PM" (Harvest) — exactly the combination our positioning claims to fill. This is corroborating evidence for staying the current course rather than chasing Asana's feature breadth.

### Implication for time-tracking vs. feature-parity decision
Based on these notes, pivoting toward Asana-style broad feature parity would move us into direct competition with a much larger, better-resourced player, while deepening time-tracking keeps us in the gap neither major competitor fills well.
```

## Tips & Variations
- This prompt does not fetch live data — for time-sensitive competitive moves (a recent pricing change, a new competitor launch), verify against current sources before acting on synthesis built from older notes.
- For a board-facing version of the output, pair with a tightening/tone pass (see `writing-and-content` category) to compress this into a slide-ready summary rather than the full working synthesis.
- Re-run this periodically (quarterly is common) rather than treating one synthesis as permanent — competitive positions shift, and stale competitive analysis can anchor strategy to an outdated picture.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

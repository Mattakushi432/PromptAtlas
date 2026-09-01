---
id: sales-deck-narrative-reviewer
title: Sales Deck Narrative Reviewer
category: marketing-and-sales
tags: [sales-enablement, sales]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Reviews a sales deck's slide-by-slide narrative for whether it actually builds toward a decision — flags where the story loses the thread, where a slide states a feature without connecting it to the buyer's actual problem, and where the ask at the end doesn't follow logically from what came before — distinct from `board-deck-narrative-tightener` (business-and-strategy, already shipped), which is scoped to internal/investor board narrative structure, not a sales deck's buyer-persuasion arc.

## When to use it
- A sales deck exists (slide-by-slide content, not full visual design) and you want a check on whether it actually persuades in sequence, not just whether each individual slide looks fine.
- Deals are stalling after the deck is presented and you suspect the deck's narrative doesn't actually build a case for buying, even if individual slides are polished.
- You're reviewing a deck built by a new sales rep or an outside agency and want structured feedback beyond "looks good" or a vague gut reaction.

## The Prompt

```
You review a sales deck's narrative arc slide by slide — you check whether the sequence actually builds a persuasive case toward the ask, not just whether individual slides are well-written.

Deck content (slide-by-slide, titles and key points): {{DECK_CONTENT}}
Target buyer and their actual pain point/context: {{BUYER_CONTEXT}}
The ask at the end of the deck (what you want them to do next): {{THE_ASK}}

Instructions:
1. Check the opening: does the deck establish the buyer's actual problem (per {{BUYER_CONTEXT}}) before pivoting to the product, or does it open with company background/credentials the buyer doesn't yet have reason to care about? A deck that opens with "About Us" before the buyer's problem is established is solving the seller's need to introduce themselves before the buyer's need to see relevance.
2. For each feature or capability slide, check whether it's explicitly tied back to the specific pain point established earlier, or presented as a standalone feature list — a feature slide disconnected from the buyer's stated problem reads as generic capability-dumping rather than a case being built.
3. Check for narrative gaps: does each slide follow logically from the one before it, or does the deck jump between points without a connecting thread a listener could follow if they missed one slide's context? Flag specific transitions that feel like non-sequiturs.
4. Check the proof/evidence placement: does supporting evidence (case studies, data, testimonials) appear near the specific claim it supports, or is it clustered separately (e.g. all case studies on one late slide) disconnected from the claims they'd actually reinforce?
5. Check whether {{THE_ASK}} follows logically from everything before it — does the deck actually build toward this specific ask, or does the ask feel like it could be swapped for a different one without changing anything earlier in the deck? A well-built narrative makes the ask feel like the obvious next step, not a bolt-on close.
6. Flag any slide that doesn't serve the narrative at all — a slide that's neither building the problem case, presenting relevant proof, nor moving toward the ask is a candidate for cutting, even if the content on it is individually accurate.

Output format: Markdown. Walk the deck slide-by-slide, flagging narrative gaps/disconnects where found (slide name, the issue, a suggested fix or reordering). End with an overall verdict on whether the arc builds toward {{THE_ASK}} and the single highest-leverage structural change.
```

## Variables
- `{{DECK_CONTENT}}` — the deck's actual slide-by-slide content (titles, key bullet points, not full visual design). Required.
- `{{BUYER_CONTEXT}}` — who this deck is being presented to and their actual pain point/situation. Required — narrative relevance can't be judged without knowing what problem the deck is supposed to be solving for this specific buyer.
- `{{THE_ASK}}` — what the deck is building toward (a demo, a pilot commitment, a contract signature). Required — without a stated destination, "does the narrative build toward it" can't be assessed.

## Example
**Input:** `{{DECK_CONTENT}}` = "Slide 1: About Us (founded 2019, 200 employees, funding). Slide 2: Our Platform Features (list of 8 features). Slide 3: Case Study — Company X. Slide 4: Pricing. Slide 5: Next Steps — Schedule a Pilot." `{{BUYER_CONTEXT}}` = "VP Ops at a logistics company struggling with manual shipment tracking causing delayed customer notifications" `{{THE_ASK}}` = "Commit to a 30-day pilot"

**Output (excerpt):**
```
### Slide 1: About Us
Issue: Opens with company background before establishing the buyer's problem — {{BUYER_CONTEXT}}'s actual pain (manual tracking causing delayed notifications) isn't mentioned anywhere before this. The buyer has no reason yet to care about founding year or headcount.
Fix: Open instead with the specific problem — a slide naming the manual-tracking/delayed-notification pain point directly, ideally with a concrete cost (delayed notifications causing X% customer complaints, or similar) before any company background.

### Slide 2: Our Platform Features
Issue: 8 features listed with no connection back to the tracking/notification problem — a buyer skimming this has to do the work of figuring out which of the 8 features actually solves their specific issue.
Fix: Reorder to lead with the 1-2 features that directly solve the tracking/notification pain, explicitly labeled as such ("Real-time tracking → eliminates the delayed-notification problem"), before listing the remaining features as additional value.

### Narrative Gap: Slide 3 to Slide 4
Case study (Slide 3) isn't clearly connected to Slide 4's pricing — if the case study demonstrates a specific ROI or outcome, that number should carry forward to justify the pricing ask, rather than pricing being presented as a standalone fact disconnected from the value just demonstrated.

### Overall Verdict
The deck's individual slides are reasonable, but the sequence doesn't build a case — it opens with seller-centric content, presents features disconnected from the buyer's actual problem, and doesn't carry proof forward to justify the ask. Highest-leverage fix: restructure the opening to establish {{BUYER_CONTEXT}}'s problem first, then re-sequence feature/proof slides around solving that specific problem, so {{THE_ASK}} (a pilot) reads as the natural next step rather than a close bolted onto an unconnected feature tour.
```

## Tips & Variations
- Pair with `board-deck-narrative-tightener` (business-and-strategy, already shipped) if you're reviewing an internal or investor deck instead — that prompt is built for that narrative context specifically; this one assumes an external buyer-persuasion arc with a specific commercial ask, which is a different structural job.
- Run this before a deck is used live, not after a string of stalled deals — a narrative gap is often invisible to the person who built the deck (they know the connective logic in their head even if it's not on the slides), which is exactly why an outside structural review catches it.
- For a deck used across many different buyer contexts (a general template, not built for one specific prospect), run this prompt with the most common {{BUYER_CONTEXT}} the deck is actually used against — a template deck can't be narratively perfect for every buyer, but it should build a coherent case for the most frequent one.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

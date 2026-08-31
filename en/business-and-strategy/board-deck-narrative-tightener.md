---
id: board-deck-narrative-tightener
title: Board Deck Narrative Tightener
category: business-and-strategy
tags: [strategy, communication]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Tightens a drafted board deck's narrative structure — where the throughline gets lost, where a slide buries its actual takeaway under supporting detail, where the story arc would land harder in a different order — rather than adjusting tone or wordsmithing individual lines. Distinct from `tone-adapter` (writing-and-content, already shipped), which adjusts register/voice for a given audience; this prompt restructures the deck's logical flow and works from a slide-by-slide content summary, not full slide text.

## When to use it
- You've drafted the content for a board deck (as a slide-by-slide outline or bullet summary) and want a structural pass before turning it into actual slides.
- A deck feels "off" but you can't pinpoint why — this prompt surfaces whether it's a throughline problem, a burial problem, or an ordering problem specifically, rather than a vague sense that it needs work.
- You're combining input from multiple contributors (different functional leads each owning a section) and want to check the combined deck still tells one coherent story rather than reading as stapled-together sections.

## The Prompt

```
You tighten a board deck's narrative structure. You work only from the slide-by-slide content summary given — you are not wordsmithing sentences, you are restructuring the story.

Deck content, slide by slide (title + key points per slide): {{DECK_CONTENT}}
Deck's stated purpose (what decision or understanding it needs to drive): {{PURPOSE}}
Audience (the board's existing context/familiarity with the business): {{AUDIENCE_CONTEXT}}

Instructions:
1. State the deck's actual throughline as you read it — the one sentence a reader would walk away with if they only remembered one thing. If no single throughline is discernible from the slide sequence, say so explicitly; a deck without one is the single most common board-deck failure.
2. For each slide, check whether its actual takeaway is stated up front or buried under supporting detail — flag any slide where a reader has to read three bullets deep to find out what the slide is actually claiming.
3. Check the slide order against {{PURPOSE}}: does the sequence build toward the decision/understanding {{PURPOSE}} needs, or does it wander through background before getting there? Propose a reordering if the current sequence delays the point past where {{AUDIENCE_CONTEXT}} suggests patience will run out.
4. Flag any slide that doesn't clearly serve {{PURPOSE}} — interesting context that isn't load-bearing for the actual ask or update is a candidate to cut or move to an appendix, not to keep "just in case."
5. Check for redundancy: does more than one slide make essentially the same point with different supporting data? Flag it rather than let both survive independently diluting each other.
6. Given {{AUDIENCE_CONTEXT}}, flag any slide that over-explains something the board already knows (wasting their limited attention) or under-explains something genuinely new that needs more setup than it currently has.

Output format: Markdown. Start with the stated throughline (or its absence). Then, slide by slide: current takeaway, issue found (burial/ordering/redundancy/purpose-mismatch, or "no issue"), and the fix. End with a proposed slide order if a reordering is recommended.
```

## Variables
- `{{DECK_CONTENT}}` — the deck's content as a slide-by-slide outline (title and key points per slide, not full slide text). Required.
- `{{PURPOSE}}` — what decision or understanding this deck needs to drive in the board. Required — without it, "does this slide serve the purpose" can't be assessed.
- `{{AUDIENCE_CONTEXT}}` — what the board already knows/expects, and their general attention patterns for this kind of update. Required — it determines both pacing and what counts as over- vs. under-explained.

## Example
**Input:** `{{DECK_CONTENT}}` = "Slide 1: Company history and mission. Slide 2: Team growth over the past year. Slide 3: Market landscape overview. Slide 4: Q3 revenue results, mixed with a note about a competitor's product launch. Slide 5: The ask — approval for a $2M budget increase for Q4 hiring." `{{PURPOSE}}` = "Get board approval for the $2M Q4 hiring budget increase." `{{AUDIENCE_CONTEXT}}` = "This board has been engaged with the company for 3 years and doesn't need a mission recap."

**Output (excerpt):**
```
### Throughline
No clear throughline currently — the deck spends 3 of 5 slides on background (history, team growth, market landscape) before reaching Q3 results and the actual ask, which only appears on the final slide.

### Slide 1: Company history and mission
Issue: purpose-mismatch. {{AUDIENCE_CONTEXT}} states this board has 3 years of history with the company — this slide re-explains what they already know, spending attention that should go toward the actual ask.
Fix: cut entirely, or compress to a single-sentence reminder if there's a specific reason to reference the mission for this particular ask.

### Slide 4: Q3 revenue results, mixed with a competitor product launch note
Issue: burial. Two distinct points (your own results, a competitive development) are combined on one slide, and the competitor note risks overshadowing your own results if it's the more dramatic detail.
Fix: split into two slides, or move the competitor note into the appendix unless it's directly relevant to justifying the hiring ask.

### Proposed slide order
1. The ask (budget increase) stated up front, with the one-sentence reason
2. Q3 revenue results (the evidence supporting the ask)
3. Team growth (context for why more hiring specifically)
4. Market landscape (only if it's load-bearing for the ask — otherwise appendix)
Cut: company history/mission slide, given {{AUDIENCE_CONTEXT}}.
```

## Tips & Variations
- Run this before the deck goes to design/formatting, not after — restructuring finished slides is far more expensive than restructuring an outline.
- Pair with `risk-register-builder` (business-and-strategy, already shipped) if the deck needs to address board-anticipated risks explicitly — this prompt won't generate risk content, only tell you where a risk slide belongs in the narrative arc if one exists.
- For a recurring board deck (quarterly updates), save the throughline this prompt surfaces each time — a pattern of "no clear throughline" across multiple quarters is itself a signal worth raising with whoever owns deck construction.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

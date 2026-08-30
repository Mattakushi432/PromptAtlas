---
id: case-study-interview-to-draft-converter
title: Case Study Interview-to-Draft Converter
category: marketing-and-sales
tags: [case-studies, drafting, copywriting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Converts a raw customer interview transcript (or notes) into a structured case study draft (challenge/solution/results narrative) — a drafting tool that organizes and writes from what the customer actually said, distinct from a generic testimonial generator: it works from real transcript content, not from a company description alone.

## When to use it
- You just finished a customer interview for a case study and have a messy transcript or notes to turn into a coherent draft.
- You need a first draft fast to send back to the customer for approval/quotes review, rather than manually structuring the narrative from scratch.
- You have several interviews of similar customers and want consistent case study structure across all of them.

## The Prompt

```
You convert a customer interview transcript into a structured case study draft, using the customer's own words and specifics wherever possible. You do not invent results, quotes, or details not present in the transcript.

Interview transcript/notes: {{TRANSCRIPT}}
Company/product context: {{PRODUCT_CONTEXT}}
Target length: {{TARGET_LENGTH}}

Instructions:
1. Structure the draft as: Challenge (the situation before, in the customer's own framing, not a generic problem statement), Solution (what they did/how they adopted the product, per what's in the transcript), Results (specific outcomes — pull any number, metric, or concrete before/after the customer mentioned).
2. Pull direct quotes from {{TRANSCRIPT}} for the most compelling, specific statements — do not paraphrase a strong direct quote into weaker indirect narration. Mark quotes clearly and attribute them.
3. If the transcript doesn't contain a specific number/metric for results, do not invent one or round a vague statement into a precise-sounding stat (e.g. don't turn "it saved us a lot of time" into "saved 40% of time") — report the qualitative result as given and mark `[NEEDS METRIC: ask customer for a specific number if available]`.
4. Where the transcript has ambiguous or unclear statements, do not guess at what the customer meant — mark `[UNCLEAR: verify with customer — original said "..."]` rather than smoothing it into a confident claim.
5. Keep the customer as the protagonist of the narrative — the product should appear as what enabled their result, not as the subject of the story.
6. Match {{TARGET_LENGTH}}; if the transcript doesn't have enough substantive content to reach it without padding, say so rather than inflating with generic industry commentary not from the interview.

Output format: Markdown with `## Challenge`, `## Solution`, `## Results` sections, pulled quotes formatted as blockquotes with attribution, and any `[NEEDS METRIC: ...]` / `[UNCLEAR: ...]` markers left inline.
```

## Variables
- `{{TRANSCRIPT}}` — the interview transcript or detailed notes. Required — the draft's quality and honesty are bounded by how much real content is here.
- `{{PRODUCT_CONTEXT}}` — a short description of the product/company, for framing the solution section accurately. Required.
- `{{TARGET_LENGTH}}` — approximate word count or "short" (300-500 words) vs. "full" (800-1200 words) case study. Required.

## Example
**Input:** `{{TRANSCRIPT}}` = "...before we used the tool, our on-call rotation was a mess, people got paged for stuff that wasn't even urgent. Q: any numbers on that? A: I don't have an exact number but it was definitely most of our pages... after switching, it's way more manageable, my team actually trusts the pages now..." `{{PRODUCT_CONTEXT}}` = "An alerting/on-call tool with smart severity routing" · `{{TARGET_LENGTH}}` = "short (300-500 words)"

**Output (excerpt):**
```
## Challenge
> "Before we used the tool, our on-call rotation was a mess — people got paged for stuff that wasn't even urgent."

The team's on-call rotation was generating alert fatigue: the majority of pages [NEEDS METRIC: customer said "most of our pages" but gave no specific number — ask for an estimate or exact figure if available] weren't genuinely urgent, eroding trust in the paging system.

## Solution
[Draws on {{PRODUCT_CONTEXT}} + transcript details about adoption...]

## Results
> "It's way more manageable, my team actually trusts the pages now."

The team reports restored trust in the paging system and a more manageable on-call load, though a specific quantified improvement wasn't captured in this interview. [NEEDS METRIC: ...]
```

## Tips & Variations
- Send the `[NEEDS METRIC: ...]` and `[UNCLEAR: ...]` markers back to the customer as specific follow-up questions rather than a generic "can you review this?" ask — it gets sharper, faster responses.
- For a shorter pull-quote/testimonial (not a full case study) from the same transcript, ask for just the Results section's strongest quote in isolation rather than running the full prompt.
- Once the customer approves the draft, this is a strong candidate for `tone-adapter` (writing-and-content) if the case study needs to be adapted into a shorter version for a different channel (e.g. a sales one-pager vs. a blog post).

## Changelog
- 1.0.0 (2026-08-30): Initial version.

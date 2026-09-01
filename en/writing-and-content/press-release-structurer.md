---
id: press-release-structurer
title: Press Release Structurer
category: writing-and-content
tags: [pr, copywriting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Structures raw announcement facts into a standard press release format (headline, dateline, lead paragraph answering who/what/when/where/why, supporting quotes, boilerplate) — enforces the inverted-pyramid discipline of leading with the most newsworthy fact rather than burying it under company-history preamble, distinct from `crisis-response-statement-drafter` (social-media, already shipped), which drafts a response to something that already happened publicly, not an announcement of planned news.

## When to use it
- You have the raw facts of an announcement (a launch, a funding round, a partnership, an executive hire) and need them structured into an actual press release format, not just a summary paragraph.
- A drafted release buries the actual news under company background or mission-statement preamble, and you want it restructured to lead with what's newsworthy.
- You're including quotes from executives or partners and want to check they read like something a person would actually say, not generic corporate-quote filler.

## The Prompt

```
You structure raw announcement facts into a standard press release format. You lead with the single most newsworthy fact — you do not bury it under company background, mission statements, or preamble that a journalist would skip past to find the actual news.

Announcement facts: {{FACTS}}
Company/organization background (for boilerplate): {{BACKGROUND}}
Quotes or quote sources (who's available to be quoted, on what angle): {{QUOTE_SOURCES}}

Instructions:
1. Identify the single most newsworthy fact in {{FACTS}} — not necessarily the fact the company is proudest of, but the one an outside journalist or reader would find most significant — and lead the headline and first sentence with it.
2. Write the headline in plain, factual language stating what happened — avoid marketing superlatives ("revolutionary," "game-changing") that read as promotional rather than newsworthy; a journalist evaluating whether to cover this is more persuaded by a clear factual headline than by hype language.
3. Write the lead paragraph to answer who/what/when/where/why in the first 1-2 sentences — this is the inverted-pyramid convention: a reader (or an editor cutting for space) should get the essential news even if they stop reading after the lead.
4. Structure supporting paragraphs in descending order of newsworthiness, not chronological or narrative order — the second paragraph should be the second-most-important fact, not "next, let's talk about our history."
5. If {{QUOTE_SOURCES}} is provided, draft a quote that sounds like something a specific person would actually say — a concrete point of view or detail, not generic phrases ("we're thrilled," "this represents our commitment to excellence") that could be attributed to any executive at any company announcing anything.
6. Place company background/boilerplate at the end, clearly separated, using {{BACKGROUND}} — this is standard convention specifically so it doesn't compete with the actual news for the reader's attention in the opening paragraphs.

Output format: the structured press release with clear section breaks: Headline, Dateline placeholder, Lead paragraph, Supporting paragraphs (newsworthiness-ordered), Quote(s), Boilerplate, Media contact placeholder.
```

## Variables
- `{{FACTS}}` — the raw facts of the announcement (what happened, key numbers, relevant parties). Required.
- `{{BACKGROUND}}` — company/organization background for the boilerplate section. Required.
- `{{QUOTE_SOURCES}}` — who's available to be quoted and what angle they'd speak to, if quotes are needed. Optional — if omitted, the release is drafted without quotes rather than inventing an attributed quote from an unspecified person.

## Example
**Input:** `{{FACTS}}` = "Company raised $12M Series A led by Acme Ventures, to expand engineering team from 8 to 25 people and launch in 3 new markets (UK, Germany, France) by end of year." `{{BACKGROUND}}` = "Founded 2023, provides supply-chain visibility software for mid-market manufacturers, currently serves 40 customers in the US" `{{QUOTE_SOURCES}}` = "CEO Jane Kim, can speak to why this funding specifically enables European expansion"

**Output (excerpt):**
```
### Headline
[Company] Raises $12M Series A to Expand into UK, Germany, and France

### Lead Paragraph
[Company], a supply-chain visibility software provider for mid-market manufacturers, today announced a $12 million Series A funding round led by Acme Ventures. The company will use the funding to grow its engineering team from 8 to 25 people and launch in three new European markets — the UK, Germany, and France — by the end of the year.

### Quote
"European mid-market manufacturers are dealing with the exact supply-chain visibility gaps we solved for our US customers, but almost nobody is building for their specific compliance and integration requirements," said Jane Kim, CEO of [Company]. "This funding lets us hire the engineers who actually understand those markets instead of retrofitting our US product and hoping it translates."

### Boilerplate
[Company], founded in 2023, provides supply-chain visibility software for mid-market manufacturers and currently serves 40 customers across the United States.
```

## Tips & Variations
- If {{FACTS}} contains multiple genuinely newsworthy angles (e.g. both a large funding number and a notable investor name), the headline can only lead with one — pick whichever a journalist in this specific industry would find more significant, not whichever the company prefers to emphasize.
- Pair with `crisis-response-statement-drafter` (social-media, already shipped) if the announcement is actually a response to a negative event rather than planned news — that prompt is built for the honesty-under-uncertainty discipline a crisis statement needs, which this prompt's newsworthiness-first structure doesn't address.
- For a release with no genuinely newsworthy angle (a minor internal reorganization, a routine product update), consider whether a press release is the right format at all — restructuring thin news into press-release format doesn't make it more newsworthy, and an unconvincing release can cost credibility with press contacts for future, more genuine announcements.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

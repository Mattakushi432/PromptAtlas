---
id: cold-outreach-personalizer-at-scale
title: Cold Outreach Personalizer at Scale
category: marketing-and-sales
tags: [sales-outreach, personalization, drafting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Turns raw prospect research notes into a personalized opening line/paragraph for cold outreach, one prospect at a time — a personalization tool for the "who am I writing to" input, distinct from `cold-email-sequence-drafter` (writing-and-content), which designs the multi-email sequence structure and angle progression rather than personalizing a single opener from research.

## When to use it
- You have a list of prospects with a few research notes each (LinkedIn activity, company news, a mutual connection) and need genuinely personalized openers, not "I noticed you work at {{COMPANY}}" mail-merge personalization.
- Your reply rate on outreach is low specifically at the opener — the offer and sequence are fine, but the first line reads as generic despite having real research behind it.
- You're doing account-based outreach at moderate scale (tens to low hundreds of prospects) where per-prospect manual writing doesn't scale but pure mail-merge feels hollow.

## The Prompt

```
You write one personalized opening line/paragraph for cold outreach, based on real research notes about a specific prospect. You do not write generic personalization (restating their job title or company name) — you use something specific from the notes that a template couldn't have produced.

Prospect research notes: {{PROSPECT_NOTES}}
What we're reaching out about: {{OUTREACH_PURPOSE}}
Desired opener length: {{LENGTH}}

Instructions:
1. Find the single most specific, relevant detail in {{PROSPECT_NOTES}} to anchor the opener — relevant means it plausibly connects to {{OUTREACH_PURPOSE}}, not just any interesting fact about the prospect. A detail that's specific but irrelevant to the outreach purpose reads as stalker-ish rather than thoughtful; skip it in favor of a more relevant, even if less striking, detail.
2. Write the opener so it could only have been written about this specific prospect — if you could swap in a different prospect's name and company and the line would still make sense, it's not personalized enough; revise.
3. Do not restate information the prospect already knows about themselves as if it's an insight (e.g. "I saw you're the VP of Sales at {{COMPANY}}" — they know their own title). Use the research to make an observation or ask a specific question instead.
4. If {{PROSPECT_NOTES}} is thin (e.g. only a job title and company name, no real research), say so explicitly rather than manufacturing false personalization from nothing — recommend gathering at least one more specific data point before this prompt can do its job well.
5. Keep the tone natural and conversational, matching how a person (not a mail-merge system) would actually open a message.
6. Respect {{LENGTH}} — a single opening line for a short cold email is different from a 2-3 sentence opener for a LinkedIn message with more room.

Output format: the opener text, followed by a one-line note on which specific detail from the research it's anchored to and why it connects to {{OUTREACH_PURPOSE}}.
```

## Variables
- `{{PROSPECT_NOTES}}` — raw research about this one prospect (recent posts, company news, mutual connections, role changes, etc.). Required.
- `{{OUTREACH_PURPOSE}}` — what you're reaching out about, concretely. Required — without it, "relevant" personalization can't be judged.
- `{{LENGTH}}` — target length (e.g. "one sentence," "2-3 sentences"). Required.

## Example
**Input:** `{{PROSPECT_NOTES}}` = "VP of Engineering at a Series B fintech. Posted on LinkedIn last week about their team finally killing their last on-call PagerDuty escalation from a specific legacy payment service." `{{OUTREACH_PURPOSE}}` = "Introducing a code review tool that catches issues before they cause incidents" · `{{LENGTH}}` = "one sentence"

**Output (excerpt):**
```
Opener: "Saw your post about finally retiring that legacy payment service's on-call escalations — curious whether the root causes were mostly things a pre-merge review would've caught, or genuinely runtime-only issues."

Anchor: the specific LinkedIn post about killing a named legacy escalation — connects directly to the outreach purpose (pre-merge issue detection) by asking a real, non-generic question about root cause, rather than pivoting straight to a pitch.
```

## Tips & Variations
- For true scale (hundreds+ of prospects), batch this by running it once per prospect with their individual notes rather than asking for many openers in one pass — quality degrades when the model has to juggle many prospects' details at once.
- If `{{PROSPECT_NOTES}}` consistently comes back thin across a list, that's a signal to invest in better research/data enrichment before scaling outreach, not to lower this prompt's bar for what counts as personalization.
- Feed the resulting opener into `cold-email-sequence-drafter` (writing-and-content) as the opening line of Email 1 — the two prompts are meant to be chained: sequence structure from one, per-prospect opener personalization from this one.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

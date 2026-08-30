---
id: cold-email-sequence-drafter
title: Cold Email Sequence Drafter
category: writing-and-content
tags: [email, sales-outreach, drafting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Drafts a multi-email cold outreach sequence (initial email plus follow-ups) for a specific offer and audience — a sequence-structure and drafting tool, distinct from a single-email generator: it plans escalation/angle variation across emails, not just one message.

## When to use it
- You're starting outbound outreach for a product/service and need a first-draft sequence to personalize per prospect, not a single generic template.
- Your current sequence gets replies on email 1 or not at all — the follow-ups feel like the same email restated, and you need genuinely different angles across the sequence.
- You're testing a new offer/ICP and want a quick draft sequence to react to and edit, rather than starting from a blank page.

## The Prompt

```
You draft a cold email outreach sequence: one initial email plus a specified number of follow-ups, each taking a genuinely different angle rather than restating the previous email more urgently.

Offer: {{OFFER}}
Target audience/persona: {{AUDIENCE}}
Number of emails: {{EMAIL_COUNT}}
Tone: {{TONE}}
Key proof point(s): {{PROOF_POINTS}}

Instructions:
1. Email 1: lead with a specific, credible reason this specific audience should care — not a generic value-prop opener. Keep it short (under 100 words) and end with a low-friction call to action (a question, not "let's schedule a 30-minute call").
2. Each follow-up must use a distinct angle from the ones before it — vary among: a different proof point/case example, a different pain point the offer addresses, a piece of relevant content/insight offered with no ask, or a direct "should I stop reaching out" close for the final email. Do not just re-send email 1 with "just following up" prepended.
3. Use {{PROOF_POINTS}} only where you have them — if fewer proof points are given than emails needing one, note which emails don't have a real proof point to lean on rather than inventing a fabricated statistic or case study.
4. Keep every email skimmable on a phone: short paragraphs (1-3 sentences), no walls of text, one clear ask per email.
5. Write in {{TONE}} — cold outreach that sounds like a template gets ignored regardless of offer quality.
6. Flag anywhere the draft would benefit from prospect-specific personalization (e.g. "[mention their recent product launch here]") rather than leaving it fully generic.

Output format: Markdown, one section per email (`### Email 1 - Subject: ...` etc.), each with a subject line, the body, and a one-line note on that email's specific angle.
```

## Variables
- `{{OFFER}}` — what's being offered/sold and its core value prop. Required.
- `{{AUDIENCE}}` — the specific persona/role being emailed, including what they likely already care about. Required — generic audience descriptions produce generic emails.
- `{{EMAIL_COUNT}}` — how many emails in the sequence (e.g. "1 initial + 3 follow-ups"). Required.
- `{{TONE}}` — e.g. "direct and low-pressure, not salesy" or "casual, peer-to-peer." Required.
- `{{PROOF_POINTS}}` — real case studies, stats, or results to draw on. Optional but strongly recommended — without it, follow-up variety suffers.

## Example
**Input:** `{{OFFER}}` = "A code review tool that catches security issues before merge" · `{{AUDIENCE}}` = "Engineering managers at 50-200 person SaaS companies" · `{{EMAIL_COUNT}}` = "1 initial + 2 follow-ups" · `{{TONE}}` = "direct, peer-to-peer, no hype" · `{{PROOF_POINTS}}` = "Caught a hardcoded-secret leak for [Company X] before it hit prod"

**Output (excerpt):**
```
### Email 1 — Subject: quick one on your PR review process
Angle: direct pain-point opener, no proof point needed yet.

Hi {{FIRST_NAME}} — how's your team catching security issues in PRs today? Most eng managers I talk to say it's "hope the reviewer notices," which works until it doesn't.

We built a tool that flags the stuff manual review misses. Worth a 2-line reply either way — even a "not now" helps me not waste your time later.

### Email 2 — Subject: the thing that almost shipped
Angle: proof point / case example.
...
```

## Tips & Variations
- For a shorter 2-email sequence, drop the "different pain point" angle and keep only the strongest proof point angle for the follow-up — don't force variety the sequence length can't support.
- Pair with `tone-adapter` if the drafted sequence needs to shift from this prompt's default direct tone to something more formal for a different vertical (e.g. enterprise/legal buyers).
- For an inbound (not cold) sequence — e.g. trial-signup nurture — this prompt still works if `{{AUDIENCE}}` notes the warmer starting context; the angle-variation logic in step 2 still applies.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

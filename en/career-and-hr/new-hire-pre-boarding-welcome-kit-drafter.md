---
id: new-hire-pre-boarding-welcome-kit-drafter
title: New-Hire Pre-Boarding Welcome Kit Drafter
category: career-and-hr
tags: [onboarding, hr]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Drafts the first-touchpoint welcome communication a new hire receives before their day-one start — what to expect, what to bring or prepare, who they'll meet, and basic logistics — an earlier stage than `30-60-90-day-onboarding-plan-builder` (career-and-hr, already shipped)'s working plan for after they've actually started, aimed at reducing pre-start anxiety rather than structuring their first three months of work.

## When to use it
- A new hire has accepted an offer and you need to send a welcome communication before their start date that actually reduces first-day uncertainty, not a bare-bones "see you Monday" email.
- Your company's pre-boarding communication has been inconsistent (sometimes forgotten entirely, sometimes just a calendar invite with no context) and you want a repeatable draft to adapt per hire.
- A new hire has asked specific questions ahead of their start date (what to wear, what to bring, parking/access) and you want those folded into one coherent welcome communication rather than answered piecemeal over email.

## The Prompt

```
You draft a pre-boarding welcome communication for a new hire, sent before their day-one start. Your goal is reducing first-day uncertainty and making them feel genuinely expected, not just confirming a start date.

New hire's role and start date: {{ROLE_AND_START_DATE}}
Logistics (location/remote, what to bring, access/equipment, dress code if relevant): {{LOGISTICS}}
Who they'll meet on day one, and any planned first-day structure: {{DAY_ONE_PLAN}}

Instructions:
1. Open with genuine, specific welcome — not generic "we're so excited!" language, but something that references the actual role or team they're joining, so it doesn't read as a template blasted to every new hire regardless of role.
2. State exactly what to expect on day one: what time to arrive/log on, who greets them, and the rough shape of the first day (per {{DAY_ONE_PLAN}}) — uncertainty about "what actually happens when I show up" is one of the most common sources of new-hire anxiety before starting, and specificity here directly addresses it.
3. Cover logistics from {{LOGISTICS}} completely but concisely — what to bring (ID, equipment if BYOD), what's provided, dress code if it's not obvious from context, access/parking/badge information — organized so a nervous new hire can scan it quickly rather than parse a wall of text.
4. Introduce who they'll meet by name and role, not just a headcount — "you'll meet Priya, your manager, and Tom, who'll be your onboarding buddy for the first few weeks" gives them something concrete to hold onto, versus "you'll meet the team."
5. Include a low-pressure way to ask questions before day one (a specific contact, not just "reach out if you have questions" with no named person) — a new hire is often hesitant to ask what feels like a "dumb question" without a clear, low-stakes channel to ask it through.
6. Keep the tone warm but not over-the-top — excessive enthusiasm in a first communication can read as insincere or as covering for a chaotic onboarding process; specific, competent, genuinely welcoming lands better than superlative-heavy hype.

Output format: the welcome communication as ready-to-send prose (email or message format), with logistics organized under a clear sub-heading for easy scanning.
```

## Variables
- `{{ROLE_AND_START_DATE}}` — the new hire's role/title and their confirmed start date. Required.
- `{{LOGISTICS}}` — practical details: location or remote setup, what to bring, equipment/access provisioning, dress code if relevant. Required — this is the section a new hire will actually reference, so it needs to be complete.
- `{{DAY_ONE_PLAN}}` — who they'll meet and the rough structure of their first day, if planned. Required — without this, the welcome can't actually reduce day-one uncertainty, only logistics uncertainty.

## Example
**Input:** `{{ROLE_AND_START_DATE}}` = "Product Designer, starting Monday March 9th" `{{LOGISTICS}}` = "Fully remote. Laptop shipped and should arrive by Friday. No dress code. Slack/email access activates the morning of start date." `{{DAY_ONE_PLAN}}` = "9am video call with manager (Priya) for a welcome chat, 10am team intro during weekly standup, 11am paired session with onboarding buddy (Tom) to walk through current design system"

**Output (excerpt):**
```
Subject: Excited for Monday, [Name] — here's what to expect

Hi [Name],

We're genuinely glad to have you joining the design team as our new Product Designer starting Monday, March 9th — this role's been open for a while and we're looking forward to having a dedicated design voice on our current redesign work.

**What to expect Monday**
- 9:00am: Welcome video call with Priya (your manager) — just a chat, nothing to prepare.
- 10:00am: Quick intro to the team during our weekly standup — you'll get to put faces to names.
- 11:00am: Paired session with Tom (your onboarding buddy for the first few weeks) walking through our current design system.

**Before Monday**
- Your laptop is shipped and should arrive by Friday — if it hasn't by end of day Thursday, let us know.
- Slack and email access activate the morning of your start date — no action needed from you beforehand.
- Fully remote, no dress code — come as you are.

**Questions before Monday?**
Reach out directly to Priya at [contact] — genuinely, no question is too small. She'd rather hear from you now than have you wondering on Sunday night.

Looking forward to Monday,
[Sender]
```

## Tips & Variations
- Pair with `30-60-90-day-onboarding-plan-builder` (career-and-hr, already shipped) once the new hire has actually started — this prompt covers the pre-start welcome; that one structures their first three months of work, and the two are meant to be sent at different stages, not combined into one document.
- If {{DAY_ONE_PLAN}} isn't actually finalized yet when this needs to be sent, don't invent specifics — send a version with confirmed logistics and a note that a fuller day-one agenda will follow, rather than fabricating a schedule that might not hold.
- For a hire relocating or needing visa/legal-status logistics beyond standard onboarding, keep those details in a separate, more formal communication from HR/legal rather than folding them into this welcome message's warmer tone — mixing the two can make necessary legal/logistics content feel buried, or make the welcome message feel unnecessarily formal.

## Changelog
- 1.0.0 (2026-09-01): Initial version.

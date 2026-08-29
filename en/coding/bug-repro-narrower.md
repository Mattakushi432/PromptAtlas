---
id: bug-repro-narrower
title: Bug Reproduction Narrower
category: coding
tags: [debugging, bug-reports, triage]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Turns a vague, underspecified bug report into a minimal, executable reproduction plan — for triaging an incoming ticket before touching any code, not for diagnosing a bug you can already reproduce.

## When to use it
- A support ticket or user report says something broke, with no clear steps.
- You're triaging a backlog of bug reports and need to know what to ask before investigating.
- Handing a bug off to someone else and want a concrete starting point instead of a vague description.

## The Prompt

```
You are triaging a bug report to figure out how to reproduce it — you are not debugging or fixing anything yet.

Bug report (as submitted, however vague): {{BUG_REPORT}}

System context (optional — what the system does, relevant to interpreting the report): {{SYSTEM_CONTEXT}}

Do the following:
1. List what's missing from the report to actually reproduce it: exact steps, environment (browser/OS/app version), account or data state, and expected vs. actual result.
2. Propose the smallest set of clarifying questions to ask the reporter — no more than 5, ordered by which answer would narrow things down fastest.
3. Draft a best-guess minimal reproduction plan assuming the most likely answers to those questions, clearly labeled as a hypothesis to verify, not a confirmed repro.

If the report already contains everything needed to reproduce it (clear steps, environment, expected vs. actual), say so explicitly and just restate the reproduction steps cleanly — don't invent missing-info questions that don't apply.
```

## Variables
- `{{BUG_REPORT}}` — the raw bug report or ticket text, as submitted. Required.
- `{{SYSTEM_CONTEXT}}` — brief description of what the system/feature does, to help interpret ambiguous report language. Optional.

## Example
**Input:** `{{BUG_REPORT}}` = "checkout is broken, tried twice and it just doesn't work", `{{SYSTEM_CONTEXT}}` = "e-commerce checkout flow: cart → shipping → payment → confirmation".

**Output (excerpt):**
```
Missing info: which step fails (shipping, payment, confirmation), what "doesn't work" means (error message, blank screen, hang, wrong result), browser/device, whether any items were in the cart, whether payment was actually attempted.

Questions to ask (ranked):
1. At which screen exactly does it stop working — shipping, payment, or confirmation?
2. Do you see an error message, or does the page just not respond?
3. What browser and device are you using?

Best-guess minimal repro (hypothesis — verify before deep debugging): add an item to cart → proceed to payment step → submit with a test card → observe whether the page hangs or errors. Most likely candidates given "tried twice and it just doesn't work": a stuck loading state or a silently failing payment API call.
```

## Tips & Variations
- For internal bug reports from teammates who can be asked follow-ups directly, skip straight to the question list and drop the hypothesis section.
- If the report includes a screenshot or log snippet, add it inline in `{{BUG_REPORT}}` — the missing-info list will adjust to only flag what's genuinely still absent.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

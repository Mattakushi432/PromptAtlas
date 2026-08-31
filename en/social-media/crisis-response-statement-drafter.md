---
id: crisis-response-statement-drafter
title: Crisis Response Statement Drafter
category: social-media
tags: [crisis-communication, pr, drafting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Drafts a public crisis response statement for a specific situation — careful, situation-specific, and honest about what is and isn't yet known, distinct from a generic PR-crisis template: it works from the actual facts and constraints of this specific situation, not a fill-in-the-blank apology template.

## When to use it
- Something has gone wrong publicly (an outage, a data incident, a product failure, a controversial internal decision that leaked) and a public statement is needed quickly but needs to be right, not just fast.
- You want to check a drafted statement for common crisis-communication failure patterns (non-apology, over-promising, legal hedge language that reads as evasive) before it goes out.
- You're preparing a statement while facts are still emerging and need language that's honest about uncertainty without looking evasive.

## The Prompt

```
You draft a public crisis response statement for a specific situation. You work only from the facts and constraints given — you do not invent details about what happened, what caused it, or what's being done that weren't provided, and you do not paper over genuine uncertainty with confident-sounding language.

Situation: {{SITUATION}}
Known facts (and explicitly what's NOT yet known): {{FACTS}}
Audience: {{AUDIENCE}}
Constraints (legal review needed, ongoing investigation, etc.): {{CONSTRAINTS}}

Instructions:
1. Open by directly acknowledging what happened in plain language — do not open with a non-apology structure ("We're sorry you feel that way" or "We're sorry if anyone was affected") when {{FACTS}} establishes that something did actually happen and did actually affect people; state the impact plainly.
2. State clearly what is known and, separately, what is not yet known — do not blur this line by implying more certainty than {{FACTS}} actually supports; readers and journalists specifically probe for overclaiming in crisis statements, and getting caught overclaiming does more damage than the honest uncertainty would have.
3. If {{CONSTRAINTS}} indicates an ongoing investigation or legal review limits what can be said, acknowledge that constraint explicitly ("we're still investigating the root cause and will share more once confirmed") rather than silently omitting information in a way that reads as evasive without explanation.
4. State concrete next steps or actions being taken, using only what's actually in {{FACTS}}/{{CONSTRAINTS}} — do not promise specific remediation, timelines, or outcomes that haven't actually been decided, since an unfulfillable promise made under crisis pressure compounds the original problem later.
5. Match tone and formality to {{AUDIENCE}} and the severity of {{SITUATION}} — avoid corporate-jargon distancing language ("we take this very seriously," "your privacy is our top priority") unless backed immediately by something concrete; these phrases have become recognized as low-credibility crisis-comms clichés precisely because they're used without substance behind them.
6. Keep the statement as short as the situation allows while still being complete — crisis statements that are needlessly long tend to bury the actual acknowledgment and action under defensive padding.

Output format: the draft statement in plain prose, followed by a short "Flags for review" note listing anything that should be checked with legal/leadership before publishing (especially any claim resting on facts not fully confirmed).
```

## Variables
- `{{SITUATION}}` — what happened, in plain terms. Required.
- `{{FACTS}}` — what's confirmed, and explicitly what's still unknown or unconfirmed. Required — the statement's honesty depends on this distinction being clear going in.
- `{{AUDIENCE}}` — who this statement is primarily for (customers, the public, employees, press). Required — affects tone, detail level, and what needs explaining vs. can be assumed as context.
- `{{CONSTRAINTS}}` — legal, investigative, or organizational limits on what can be said or promised. Required — without this, the draft may promise something that isn't actually authorized yet.

## Example
**Input:** `{{SITUATION}}` = "A security incident exposed some customer email addresses (not passwords or payment info) due to a misconfigured database" `{{FACTS}}` = "Confirmed: ~15,000 email addresses exposed, no evidence passwords/payment data affected, issue found and fixed within 6 hours of detection. Not yet known: exact duration of exposure before detection, whether any addresses were actually accessed by an unauthorized party." `{{AUDIENCE}}` = "Affected customers, via email + public statement" `{{CONSTRAINTS}}` = "Legal has approved this draft framing; full forensic investigation ongoing, results expected in ~1 week"

**Output (excerpt):**
```
We're writing to let you know about a security incident that exposed some customer email addresses, including yours. Here's what we know so far, and what we're still finding out.

What happened: A misconfigured database exposed approximately 15,000 customer email addresses. We found and fixed the issue within 6 hours of detecting it. We have no evidence that passwords or payment information were affected.

What we don't yet know: We don't yet know exactly how long the database was exposed before we found it, or whether any email addresses were actually accessed by an unauthorized party during that window. A full forensic investigation is underway, and we expect results within about a week.

What we're doing: [specific remediation steps from FACTS/CONSTRAINTS would go here — none were provided in this example beyond the fix itself, so this section would need author input before finalizing]

We'll update you as soon as we have more information from the investigation.

Flags for review: This draft states "no evidence passwords or payment data affected" — confirm this framing (vs. a stronger "were not affected") is still accurate given the investigation is ongoing, since "no evidence yet" and "confirmed not affected" are different claims and the wrong one could need retraction later.
```

## Tips & Variations
- Always have this reviewed by legal/leadership before publishing, especially the "Flags for review" items — this prompt is built to draft carefully and avoid common failure patterns, but it cannot verify facts or authorize commitments; that responsibility stays with the humans who have full context.
- For a situation still actively unfolding (facts changing hour to hour), draft a shorter initial holding statement first (acknowledge + "more soon") rather than a full statement that will be outdated within hours — use this prompt again for the fuller follow-up once more facts are confirmed.
- If multiple audiences need different statements (e.g. a shorter public tweet vs. a fuller customer email), draft the fuller version first and then adapt it down — cutting a complete, careful statement is safer than trying to write a short version first and expand it under time pressure.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

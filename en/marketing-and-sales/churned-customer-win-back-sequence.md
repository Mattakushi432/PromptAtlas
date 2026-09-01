---
id: churned-customer-win-back-sequence
title: Churned-Customer Win-Back Sequence
category: marketing-and-sales
tags: [sales, email]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Drafts a multi-touch win-back email sequence for a churned customer, calibrated to the actual reason they left — a different sequence for someone who churned on price than someone who churned because a feature they needed was missing — rather than a generic "we miss you, come back!" campaign that ignores why the customer actually left in the first place.

## When to use it
- You have a segment of churned customers and want a win-back sequence that addresses their actual churn reason, not a one-size-fits-all "we've made improvements!" email that ignores what specifically drove them away.
- A specific former customer's situation has genuinely changed (a blocking feature shipped, pricing changed, a known issue was fixed) and you want a targeted, honest re-engagement message rather than a generic reactivation blast.
- You want to check whether an existing win-back sequence actually engages with the churn reason or just apologizes vaguely and asks for another chance without addressing anything specific.

## The Prompt

```
You draft a win-back email sequence for a churned customer, calibrated to their actual reason for leaving. You do not write a generic "we miss you" campaign — every email must engage with the specific churn reason, not paper over it with enthusiasm.

Churn reason (as specifically as known): {{CHURN_REASON}}
What has actually changed since they left, if anything (new feature, pricing change, fixed issue): {{WHAT_CHANGED}}
Customer context (how long they were a customer, how they used the product): {{CUSTOMER_CONTEXT}}

Instructions:
1. Do not send a win-back sequence at all if {{WHAT_CHANGED}} doesn't actually address {{CHURN_REASON}} — say so explicitly rather than drafting hollow re-engagement copy for a problem that's still unresolved; a win-back attempt that ignores an unaddressed churn reason usually just re-confirms the original decision to leave.
2. Email 1 should directly acknowledge the specific reason they left (not a vague "we know things didn't work out") and lead with what's actually changed relevant to that specific reason — this is the core of the entire sequence; if this email doesn't land, the rest doesn't matter.
3. Do not apologize generically or over-explain internal reasons for the delay in fixing the issue — a brief, honest acknowledgment followed quickly by the actual change is more credible than a long justification.
4. Email 2 (if the first doesn't get a response) should add a different angle — new evidence the change actually works (a specific improvement metric, other customers' results), not just a repeat of email 1's message with more urgency.
5. Email 3 (final touch) should be short and give the customer an easy, low-commitment path back (a trial period, a call to ask questions, a no-pressure "here if you want it") rather than a hard-sell final push — a churned customer being pressured after two prior emails is more likely to unsubscribe than convert.
6. Use {{CUSTOMER_CONTEXT}} to calibrate tone and specificity — a long-tenured customer who churned reluctantly warrants a different tone (more personal, referencing their history) than a short-lived trial user who churned quickly.

Output format: Markdown. If {{WHAT_CHANGED}} doesn't address {{CHURN_REASON}}, say so and stop there rather than drafting the sequence. Otherwise, three labeled emails (Email 1, Email 2, Email 3) each with subject line and body, plus a one-line note on the specific angle each email takes.
```

## Variables
- `{{CHURN_REASON}}` — why the customer actually left, as specifically as known (missing feature, price, poor support experience, switched to a competitor, no longer needed the product). Required — the entire sequence depends on addressing the real reason, not a generic one.
- `{{WHAT_CHANGED}}` — what's actually different now relative to {{CHURN_REASON}}, if anything. Required — the prompt checks this against the churn reason before drafting anything.
- `{{CUSTOMER_CONTEXT}}` — how long they were a customer and how they used the product, to calibrate tone. Required.

## Example
**Input:** `{{CHURN_REASON}}` = "Churned because the product lacked a specific integration (Salesforce) they needed for their workflow" `{{WHAT_CHANGED}}` = "Native Salesforce integration shipped 2 months ago" `{{CUSTOMER_CONTEXT}}` = "18-month customer, churned reluctantly after repeatedly asking for this integration, used the product daily before leaving"

**Output (excerpt):**
```
### Email 1
Subject: The Salesforce integration you asked for is live
Body: "Hi [Name] — I know the missing Salesforce integration was the reason you moved on after 18 months with us, and I wanted to reach out directly rather than send a generic 'we miss you' email. It's live now — native, not a workaround. Given how much you used to rely on the product day to day, I thought you'd want to know directly rather than find out later. Happy to walk you through it if useful, no pressure either way."
Angle: Direct acknowledgment of the specific reason + the specific fix, personal tone matching an 18-month relationship.

### Email 2 (if no response)
Subject: How the Salesforce integration is working for teams like yours
Body: "Following up briefly — since launching the Salesforce integration, teams with a similar setup to what you had are seeing [specific result, e.g. reporting X hours saved weekly]. If the integration gap was the only thing holding you back, it might be worth a second look."
Angle: New evidence (real-world results) rather than repeating email 1's announcement with more urgency.

### Email 3 (final touch)
Subject: No pressure — just leaving the door open
Body: "I won't keep following up after this — just wanted to leave the door open. If you want to pick back up, I'm happy to set you up again or answer any questions first. Either way, thanks for being a customer for as long as you were."
Angle: Low-commitment, low-pressure close that respects a "no" without one more hard push.
```

## Tips & Variations
- If {{CHURN_REASON}} is price and nothing has actually changed on price, this prompt will (per instruction 1) flag that a win-back sequence isn't warranted yet — that's a real, useful output, not a failure to produce a sequence; don't override it by asking for a sequence anyway without a genuine price change to point to.
- Pair with `comment-response-drafter-for-common-question-types` (social-media, already shipped) if the churned customer's original complaint also showed up publicly (a review, a social comment) — that prompt handles the public-facing response; this one handles the private win-back attempt, and the two should stay consistent in tone and substance if both are happening.
- For a batch of churned customers with the same churn reason, draft the sequence once per reason (not once per customer) and personalize only {{CUSTOMER_CONTEXT}}-driven details (tenure, usage pattern) per send — drafting from scratch for each individual customer doesn't scale and isn't necessary once the reason-specific core message is right.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

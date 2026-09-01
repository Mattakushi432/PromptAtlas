---
id: testimonial-request-message-drafter
title: Testimonial Request Message Drafter
category: writing-and-content
tags: [email, case-studies]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Drafts a short, specific request for a customer testimonial that references the customer's actual experience or outcome and gives them something concrete to respond to, rather than a generic "would you mind leaving us a review?" that puts the entire burden of composing something on the customer. Distinct from `case-study-interview-to-draft-converter` (marketing-and-sales, already shipped)'s longer-form structured interview process — this is a short, low-effort outreach message asking for a quote or short testimonial, not a full case-study interview.

## When to use it
- You want to ask a satisfied customer for a testimonial or quote and know the specific positive outcome they had, but want the ask itself to be easy for them to respond to rather than an open-ended "tell us what you think."
- A generic testimonial-request template has been getting low response rates, and you suspect it's because it asks too much of the customer (a blank page to fill) rather than giving them something specific to react to.
- You have several customers with different specific outcomes and want each request personalized to their actual experience rather than sending the same generic ask to everyone.

## The Prompt

```
You draft a short, specific testimonial request email that references the customer's actual experience and gives them something concrete to respond to. You do not write a generic "would you mind leaving a review?" ask that puts the full burden of composing a testimonial on the customer.

Customer's specific experience/outcome (what actually happened, in your own words): {{CUSTOMER_OUTCOME}}
Relationship context (how long they've been a customer, any prior interaction relevant to the ask): {{RELATIONSHIP_CONTEXT}}
Where the testimonial will be used, if relevant (website, case study, social proof for a specific page): {{USAGE_CONTEXT}}

Instructions:
1. Reference the specific outcome from {{CUSTOMER_OUTCOME}} directly in the opening — not a generic "we hope you're enjoying the product" but the actual specific thing that happened, so the customer immediately knows this isn't a mass-blast template.
2. Make the ask easy to respond to: instead of an open "would you write us a testimonial?", give a specific, answerable prompt (e.g. "Would you be willing to share a sentence or two about [the specific outcome]?" or a 1-2 question format) — a customer who has to compose something from scratch is far less likely to respond than one who can answer a direct question.
3. Keep it genuinely short — this is a low-effort ask, and a long email undercuts that by making the ask itself feel like a bigger commitment than it actually is.
4. If {{USAGE_CONTEXT}} is provided, mention where the testimonial might be used — this isn't just transparency, it also helps the customer calibrate tone (a quote for a formal case study reads differently than one for a casual social post) and gives them a reason the ask matters.
5. Make clear that a short, informal response is genuinely fine — don't imply they need to write polished marketing copy themselves; offer that you can lightly edit for length/clarity with their approval, which lowers the effort bar further.
6. Match tone to {{RELATIONSHIP_CONTEXT}} — a long-standing customer warrants a warmer, more personal ask than someone recently onboarded; don't use the same register for both.

Output format: a short email/message, ready to send, with subject line if it's an email. Keep it under 100 words in the body unless {{RELATIONSHIP_CONTEXT}} specifically calls for a warmer, longer approach.
```

## Variables
- `{{CUSTOMER_OUTCOME}}` — the specific positive result or experience this customer had, as concretely as known. Required — a generic ask without a specific outcome to reference defeats the purpose of this prompt.
- `{{RELATIONSHIP_CONTEXT}}` — how long they've been a customer and any relevant prior interaction, to calibrate tone. Required.
- `{{USAGE_CONTEXT}}` — where the testimonial would actually be used, if there's a specific plan. Optional, but helps the customer calibrate their response.

## Example
**Input:** `{{CUSTOMER_OUTCOME}}` = "Cut their monthly reporting time from about 6 hours to under 1 hour after switching to our automated dashboard" `{{RELATIONSHIP_CONTEXT}}` = "Customer for 8 months, has emailed support twice with positive feedback unprompted" `{{USAGE_CONTEXT}}` = "Would potentially feature on our website's customer stories page"

**Output (excerpt):**
```
Subject: Quick favor — mind if we share your story?

Hi [Name],

You mentioned a while back that switching to the dashboard cut your monthly reporting time from around 6 hours down to under an hour — that's honestly one of my favorite outcomes we've heard, and I'd love to feature it (with your OK) on our customer stories page.

Would you be up for a sentence or two, in your own words, about that time savings and what it's meant for you? No need to make it polished — send it however it comes out, and I'll check back with you before we'd use it anywhere.

Totally fine to say no, too — just thought I'd ask since it's such a good story.

Thanks either way,
[Your name]
```

## Tips & Variations
- Pair with `case-study-interview-to-draft-converter` (marketing-and-sales, already shipped) if the customer responds enthusiastically and there's appetite for a fuller case study — this prompt's short ask is often the right first touch before committing to a longer interview process, rather than leading with a bigger time ask that gets a lower response rate.
- If {{CUSTOMER_OUTCOME}} is genuinely vague (you don't actually know a specific result, just that they seem happy), don't force a specific-sounding claim you're not sure of — either get more specific first-hand context before asking, or use a more general (but still personal, not templated) ask that doesn't overstate what you actually know.
- For a customer response that comes back rougher than expected, offer light editing with their approval rather than either using it verbatim if it's unclear, or heavily rewriting it without checking back — the offer to lightly edit (with sign-off) in the original ask sets this expectation up front.

## Changelog
- 1.0.0 (2026-09-01): Initial version.

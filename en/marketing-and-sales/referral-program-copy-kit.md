---
id: referral-program-copy-kit
title: Referral Program Copy Kit
category: marketing-and-sales
tags: [sales, conversion]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Generates the full set of copy touchpoints a referral program actually needs — the ask (in-app or email), the share message the referrer sends, the landing page the referred friend sees, and the reward confirmation — kept consistent with each other so the story a referrer tells matches what their friend actually experiences, rather than each piece drafted in isolation.

## When to use it
- You're launching a referral program and need the copy for every touchpoint (the ask, the shareable message, the referred-friend landing page, the reward confirmation) drafted together so they tell one consistent story.
- An existing referral program's copy feels disjointed — the ask promises one thing, the landing page emphasizes something else — and you want it audited and rewritten for consistency.
- You want the actual share message pre-written for the referrer, since a referral program that makes the referrer compose their own message from scratch gets far fewer shares than one with a ready-to-send draft.

## The Prompt

```
You write the full set of copy for a referral program's key touchpoints, kept consistent with each other — the reward and value proposition described in the ask must match what the share message promises, which must match what the referred-friend landing page delivers.

Product/service being referred: {{PRODUCT}}
Referral incentive (for referrer and/or referred friend): {{INCENTIVE}}
Where the ask will appear (in-app moment, email, post-purchase): {{ASK_CONTEXT}}

Instructions:
1. Write the ask — the moment the existing customer is invited to refer — timed and worded for {{ASK_CONTEXT}} specifically (a post-purchase ask reads differently than an in-app prompt after a positive action, or a dedicated email). State the incentive clearly and specifically, not vaguely ("get rewards!" vs. the actual reward amount/type).
2. Write the share message — the actual text the referrer will send to their friend, pre-composed so the referrer doesn't have to write their own pitch from scratch. This should sound like something a real person would forward, not marketing copy the referrer would feel awkward sending verbatim — write it in first person, from the referrer's perspective.
3. Write the referred-friend landing page copy — what the friend sees when they click the referral link. This must deliver on exactly what the share message promised (the same incentive, the same value framing) — a mismatch between what the referrer's message promises and what the landing page actually offers is the most common referral-program trust failure.
4. Write the reward confirmation — what both the referrer and referred friend see once the referral completes and the reward is earned, confirming specifically what they got and when/how to use it, not just a generic "thanks!"
5. Check {{INCENTIVE}} for asymmetry that needs different messaging for each side (e.g. referrer gets account credit, friend gets a discount) — make sure each piece of copy addresses the incentive relevant to its specific audience rather than a one-size-fits-all description.
6. Keep every touchpoint's stated value consistent — the exact reward amount/terms mentioned in the ask, the share message, and the landing page should match exactly; a discrepancy (even a rounding difference) undermines trust at the exact moment the program is asking someone to vouch for the product to a friend.

Output format: Markdown with four labeled sections: The Ask, Share Message, Referred-Friend Landing Page, Reward Confirmation (referrer + friend versions if the incentive differs by side).
```

## Variables
- `{{PRODUCT}}` — the product/service being referred. Required.
- `{{INCENTIVE}}` — what the referrer and/or referred friend actually get, stated specifically (amount, type, any conditions). Required — vague incentive framing produces vague, less-effective copy across every touchpoint.
- `{{ASK_CONTEXT}}` — where/when the ask happens, since this affects tone and framing. Required.

## Example
**Input:** `{{PRODUCT}}` = "A project management app" `{{INCENTIVE}}` = "Referrer gets $20 account credit; referred friend gets 1 month free (normally a 14-day trial)" `{{ASK_CONTEXT}}` = "In-app prompt shown after a user completes their 10th task, a moment of demonstrated product value"

**Output (excerpt):**
```
### The Ask
"Loving getting things done? Invite a teammate or friend and you'll both win: you get $20 account credit, they get a full month free (instead of the usual 14-day trial)." [Share the love]

### Share Message
"Hey — I've been using [Product] to stay on top of my projects and it's actually made a difference. If you sign up with my link, you get a full month free instead of the usual 14-day trial, and I get a bit of credit too. Worth a look: [link]"

### Referred-Friend Landing Page
Headline: "[Referrer name] gave you a full month free."
Body: "Normally [Product] starts with a 14-day trial — but since [referrer name] sent you here, you get 30 days instead. No credit card required to start." [Start my free month]

### Reward Confirmation
Referrer: "🎉 [Friend name] just signed up — $20 credit has been added to your account. Check your billing page to see it applied to your next invoice."
Friend: "You're in! Your free month runs through [date] — no charge until then. [Explore the app]"
```

## Tips & Variations
- Pair with `content-calendar-generator-from-a-campaign-brief` (social-media, already shipped) if the referral program launch also needs organic social promotion beyond the direct in-product touchpoints — that prompt plans the surrounding campaign content, while this one covers the transactional referral-flow copy itself.
- If {{INCENTIVE}} has an expiration or cap (e.g. "first 500 referrals only"), make sure that constraint appears consistently wherever relevant (the ask and the confirmation, at minimum) rather than only in fine print the referrer wouldn't see before sharing.
- For a referral program with a tiered incentive (bigger reward for more referrals), draft the base single-referral flow first with this prompt, then extend the reward-confirmation copy to acknowledge tier progress once the base flow is solid — don't try to convey the full tier structure in the initial ask, which tends to overload a moment that should stay simple.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

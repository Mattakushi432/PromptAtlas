---
id: comment-response-drafter-for-common-question-types
title: Comment Response Drafter for Common Question Types
category: social-media
tags: [community-management, social-media]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Drafts a reply to a social media comment or DM that matches its actual type — a genuine question, a complaint, praise, spam, or a sales objection — rather than a one-size-fits-all friendly reply, since each type needs a structurally different response and misreading the type produces a tone-deaf reply (e.g. a chipper "thanks for reaching out!" to an angry complaint).

## When to use it
- You're managing comments/DMs at volume and want fast, on-brand drafts to review and send rather than writing every reply from scratch.
- A specific comment is ambiguous or emotionally loaded and you want a second opinion on how to read its actual intent before replying.
- You're training a new community manager and want example replies that demonstrate the different response patterns different comment types actually need.

## The Prompt

```
You draft a reply to a social media comment, matched to its actual type. You do not default to one generic "thanks so much!" tone regardless of what the comment actually is — a complaint, a question, and praise each need a structurally different response.

Comment/DM text: {{COMMENT}}
Platform: {{PLATFORM}}
Brand voice: {{BRAND_VOICE}}
Relevant context (a known issue, a policy, a product detail the reply may need to reference): {{CONTEXT}}

Instructions:
1. Classify the comment's actual type first: genuine question, complaint/negative experience, praise/positive, spam/irrelevant, or a sales objection/hesitation — state the classification, since the response structure depends entirely on getting this right.
2. For a genuine question: answer it directly and specifically using {{CONTEXT}} if relevant — don't deflect to "DM us!" if the question has a public answer that would also help other readers seeing the thread.
3. For a complaint: acknowledge the specific issue (not a generic "sorry to hear that"), and only move the conversation to DM/support if genuinely necessary for account-specific troubleshooting — moving every complaint to DM immediately can read as trying to hide the issue rather than resolve it.
4. For praise: respond specifically to what was praised, not a generic "thank you so much! 🙏" — a specific acknowledgment reads as genuine attention, a generic one reads as a bot response.
5. For spam/irrelevant comments: recommend no reply (or a minimal one if platform norms expect some acknowledgment), rather than drafting an earnest response to content that doesn't warrant one.
6. For a sales objection or hesitation ("too expensive," "does this work for X use case"): address the actual objection with specific, honest information from {{CONTEXT}} — don't paper over a real limitation with vague positivity, since a prospect who later discovers the limitation feels misled.
7. Match length and tone to {{PLATFORM}} norms and {{BRAND_VOICE}} — a reply that's appropriately brief on X can feel dismissive on a platform where longer, warmer replies are the norm.

Output format: Markdown. State the classification first, then the drafted reply, then a one-line note on why this response type/structure fits the comment (useful for training or quick sanity-checking before sending).
```

## Variables
- `{{COMMENT}}` — the actual comment or DM text to respond to. Required.
- `{{PLATFORM}}` — the specific platform, since tone/length norms differ. Required.
- `{{BRAND_VOICE}}` — the brand's voice/personality guidelines. Required.
- `{{CONTEXT}}` — any relevant background the reply might need (a known outage, a return policy, a product spec) — Optional, but required in practice for anything beyond a generic reply to be accurate rather than vague.

## Example
**Input:** `{{COMMENT}}` = "This broke after literally 2 uses. Absolute waste of money, do not buy" `{{PLATFORM}}` = "Instagram" `{{BRAND_VOICE}}` = "Warm, direct, no corporate jargon" `{{CONTEXT}}` = "Product has a 1-year warranty covering manufacturing defects; support email is support@brand.com"

**Output (excerpt):**
```
Classification: Complaint/negative experience

Reply: "That's not the experience we want you to have, and it shouldn't happen after 2 uses — that sounds like a defect, and it's covered under our 1-year warranty. Can you email support@brand.com with your order number? We'll get a replacement sorted."

Why this fits: Acknowledges the specific problem (broke after 2 uses) rather than a generic apology, states the concrete resolution path (warranty + specific email) rather than a vague "we'll look into it," and moves to a private channel only because account-specific action (processing a replacement) genuinely requires it — not as a way to avoid the public conversation.
```

## Tips & Variations
- Pair with `constructive-review-comment-rewriter` (coding, already shipped) if you need to soften your own internal notes about a harsh comment before sharing them with a team — that prompt is built for code review tone, but the reframing pattern applies to any blunt-to-constructive rewrite.
- For a comment that's genuinely ambiguous between two types (e.g. reads as both a complaint and a question), address both in the reply rather than forcing a single classification — note the ambiguity explicitly rather than picking one interpretation and ignoring the other.
- Build a running {{CONTEXT}} reference doc for recurring issues (a known bug, common policy questions) so replies stay consistent across different people managing comments, not just accurate on any single reply.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

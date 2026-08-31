---
id: reviewer-comment-response-drafter
title: Reviewer Comment Response Drafter
category: research-and-academic
tags: [peer-review, academic-writing, drafting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Drafts a point-by-point response to peer reviewer comments — organizes each comment, a proposed response, and what (if anything) changed in the manuscript, in the standard response-letter format journals expect, without inventing changes that weren't actually made.

## When to use it
- You've received reviewer comments and need to draft a structured response letter before revising, or alongside revising.
- You want to check that your planned responses actually address what each reviewer asked, rather than a response that talks around the comment.
- You're managing conflicting reviewer comments (Reviewer 1 wants X, Reviewer 2 wants the opposite) and need help drafting a response that handles the tension honestly.

## The Prompt

```
You draft a point-by-point response to peer reviewer comments. You organize the response in the standard format (each comment, response, and manuscript change) — you do not invent a manuscript change that wasn't actually described as made, and you do not write a response that avoids the substance of what the reviewer actually asked.

Reviewer comments: {{COMMENTS}}
What was actually changed/added in response (author's notes): {{CHANGES_MADE}}
Points being pushed back on (if any, with reasoning): {{PUSHBACK}}

Instructions:
1. For each comment in {{COMMENTS}}, quote or closely paraphrase it, then respond directly to what it's actually asking — do not write a response that's adjacent to the comment but doesn't address its core concern.
2. Where {{CHANGES_MADE}} indicates a specific change was made, describe it specifically (e.g. "We have added a paragraph in Section 3.2 clarifying..." with enough detail to be verifiable) rather than a vague "We have addressed this."
3. Where {{PUSHBACK}} indicates the authors are not making a requested change, write a respectful, substantive justification — engage with the reviewer's underlying concern rather than dismissing it, and if the pushback reasoning given is thin, flag that it may need strengthening before submission rather than papering over a weak justification.
4. If a comment isn't addressed anywhere in {{CHANGES_MADE}} or {{PUSHBACK}}, do not silently skip it or invent a response — flag it explicitly as needing the authors' input before the response letter can be finalized.
5. For comments that request something the current data/study design genuinely cannot support (e.g. a new experiment that wasn't run), be honest about that limitation in the response rather than implying more was done than actually was — reviewers and editors notice overclaiming, and it damages credibility more than an honest limitation.
6. Keep the tone professional and appreciative of the review process throughout, even where pushing back — this is a genre with real conventions, and a defensive or dismissive tone undermines an otherwise strong response.

Output format: Markdown, organized by reviewer (`## Reviewer 1`, `## Reviewer 2`, etc.), each comment numbered with **Comment:**, **Response:**, and **Manuscript Change:** (or "No change made — see response" if pushing back).
```

## Variables
- `{{COMMENTS}}` — the reviewer comments, ideally organized by reviewer. Required.
- `{{CHANGES_MADE}}` — the author's own notes on what was actually changed in response to each comment. Required — the response letter's accuracy depends on this being real, not inferred.
- `{{PUSHBACK}}` — any comments the authors are not fully complying with, and their reasoning. Optional — omit if there's no pushback needed.

## Example
**Input:** `{{COMMENTS}}` = "Reviewer 1, Comment 3: The sample size seems small for the claims made in the discussion — please justify or temper the claims." `{{CHANGES_MADE}}` = "Added a sentence to the limitations section acknowledging sample size, and softened 'demonstrates' to 'suggests' in two places in the discussion." `{{PUSHBACK}}` = "None for this comment"

**Output (excerpt):**
```
### Comment 3
**Comment:** "The sample size seems small for the claims made in the discussion — please justify or temper the claims."
**Response:** We agree the sample size warrants more cautious language. We have tempered our claims accordingly and added explicit acknowledgment of this limitation.
**Manuscript Change:** In the Discussion section, we changed "demonstrates" to "suggests" in two instances (paragraphs 2 and 4) to better reflect the strength of evidence supported by our sample size. We also added a sentence to the Limitations section explicitly noting the sample size constraint and its implications for generalizability.
```

## Tips & Variations
- If multiple reviewers give conflicting requests, address both comments individually but consider adding a brief editor-facing note (outside the point-by-point structure) explaining the tension and how it was resolved — this is common practice and helps the editor understand the tradeoff without having to piece it together from two separate responses.
- Draft this alongside (not after) making the actual manuscript changes — trying to reconstruct exactly what changed from memory after the fact risks the kind of vague "we have addressed this" response this prompt is built to avoid.
- For a desk-reject-adjacent situation (major revisions requested with a real risk of rejection), it's worth having a colleague or advisor review the drafted response before submission — this prompt drafts a solid structural response but doesn't replace domain expert judgment on whether the scientific substance of the response is actually sufficient.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

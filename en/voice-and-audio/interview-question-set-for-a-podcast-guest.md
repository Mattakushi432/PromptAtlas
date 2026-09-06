---
id: interview-question-set-for-a-podcast-guest
title: Interview Question Set for a Podcast Guest
category: voice-and-audio
tags: [podcast]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Generates a structured interview question set for a specific podcast guest and episode theme — a warm-up question, a logically-building sequence of core questions, at least one question aimed at surfacing something genuinely new rather than what the guest already says in every other interview, and a closing question — rather than a flat list of unconnected questions in no particular order.

## When to use it
- You're prepping for a podcast interview and want a question set with actual structure and flow, not a brainstorm dump you'll have to reorder live.
- Your guest has done many interviews already and you want to avoid asking the same questions they've answered a dozen times elsewhere, digging for something fresher instead.
- You're a newer podcast host and want a repeatable structure (warm-up → building core questions → a differentiating question → close) to apply consistently across episodes rather than reinventing prep each time.

## The Prompt

```
You generate a structured interview question set for a podcast guest, built with intentional sequence and flow, not a flat unordered list.

Guest background/expertise: {{GUEST_BACKGROUND}}
Episode theme/focus: {{EPISODE_THEME}}
What the guest has likely already covered in other public interviews, if known: {{ALREADY_COVERED}}

Instructions:
1. Write one warm-up question: low-stakes, easy for the guest to answer comfortably, that still connects to {{EPISODE_THEME}} rather than being pure small talk disconnected from the episode's actual subject.
2. Write a sequence of 4-6 core questions that build on each other logically — each question should follow naturally from where the previous answer would likely leave off, not jump between unrelated angles of {{EPISODE_THEME}}. Order them from foundational/scene-setting toward more specific or provocative.
3. Include at least one question specifically designed to surface something the guest hasn't already said in other public interviews — if {{ALREADY_COVERED}} is given, explicitly avoid those angles and instead ask about a specific edge case, a disagreement they might have with conventional wisdom in their field, or a concrete recent example rather than their general philosophy (which is what's usually already covered).
4. Avoid yes/no or single-fact questions in the core sequence — phrase questions to invite a story, a specific example, or a reasoned opinion, since those produce better audio content than a fact the host could have just stated themselves.
5. Write one closing question that gives the guest a natural, satisfying way to wrap up — often something forward-looking (what's next for them/their work) or a chance to leave listeners with a specific, actionable takeaway, rather than an abrupt end.
6. Keep the total set focused rather than exhaustive — 6-8 questions total is usually enough for a substantive conversation; a much longer list tends to produce a rushed, checklist-feeling interview rather than a natural conversation with room to follow interesting tangents.

Output format: Markdown with sections: Warm-Up, Core Questions (numbered, in sequence), Differentiating Question (marked explicitly, with a one-line note on why it's likely to surface something new), Closing. Keep each question as a single, clearly-phrased sentence.
```

## Variables
- `{{GUEST_BACKGROUND}}` — the guest's relevant expertise, role, or story. Required.
- `{{EPISODE_THEME}}` — what this specific episode is actually about, since a guest with broad expertise still needs a focused angle. Required.
- `{{ALREADY_COVERED}}` — topics or angles the guest has likely already discussed extensively elsewhere, if known (from their other podcast appearances, talks, or writing). Optional, but sharpens the differentiating question significantly when available.

## Example
**Input:** `{{GUEST_BACKGROUND}}` = "A climate scientist who has spent 15 years studying coral reef bleaching, has given many talks and interviews about the general crisis." `{{EPISODE_THEME}}` = "What actually works in reef restoration efforts, beyond just diagnosing the problem." `{{ALREADY_COVERED}}` = "Has extensively covered the causes and severity of bleaching in prior interviews; rarely discussed specific restoration project outcomes."

**Output (excerpt):**
```
### Warm-Up
What first drew you to studying reefs specifically, rather than marine biology more broadly?

### Core Questions
1. For listeners who know reefs are in trouble but not much else — what does a reef restoration project actually involve, day to day?
2. What's a restoration approach that sounded promising on paper but didn't hold up in practice?
3. Is there a specific reef or project you'd point to as genuinely working, and what made the difference there?

### Differentiating Question
What's a claim about reef restoration that's become common in public discussion that you think is actually overstated or wrong?
Why it's likely to surface something new: {{ALREADY_COVERED}} indicates prior interviews focused on causes/severity, not restoration specifics — this asks the guest to take a specific, potentially contrarian position on restoration claims, which is a different and more specific ask than the general-crisis framing they've likely answered many times before.

### Closing
If someone listening wanted to actually support restoration work in a way that matters, beyond donating vaguely to "ocean charities," what's one concrete thing they could look into?
```

## Tips & Variations
- Pair with `mock-interview-practice-partner` (career-and-hr, already shipped) if you want to rehearse the interview flow yourself before recording — that prompt is built for job-interview practice specifically, but the turn-by-turn practice structure transfers to rehearsing a podcast host role.
- If {{ALREADY_COVERED}} is genuinely unknown, it's worth a quick search of the guest's recent interviews before finalizing the differentiating question — a guessed "fresh" angle that turns out to be their most common talking point defeats the purpose of that question.
- Treat this question set as a map, not a script to follow rigidly — the best moments in an interview often come from following an unexpected answer rather than moving straight to the next planned question; the sequence here is meant to give a strong starting structure, not replace real-time listening.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

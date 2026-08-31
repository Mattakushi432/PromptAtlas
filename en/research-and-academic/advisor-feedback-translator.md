---
id: advisor-feedback-translator
title: Advisor Feedback Translator
category: research-and-academic
tags: [academic-writing, feedback]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Unpacks terse, shorthand advisor feedback ("this needs more rigor," "unclear," a single "?" in the margin) into a concrete, actionable revision plan — bridges the gap between how experienced academics compress feedback and what a student actually needs to know to act on it, without inventing specifics the advisor didn't actually convey.

## When to use it
- Your advisor left brief comments (a word, a phrase, a question mark) on a draft, and you understand roughly what they mean but not specifically enough to know what to actually change.
- You got verbal feedback in a meeting that you jotted down in shorthand, and by the time you sit down to revise, the notes are too compressed to act on directly.
- You want to check your own interpretation of ambiguous feedback against a few plausible readings before spending a week revising in a direction the advisor didn't actually mean.

## The Prompt

```
You translate terse advisor feedback into a concrete, actionable revision plan. You do not invent specifics the advisor didn't actually convey — where the feedback is genuinely ambiguous, you present the plausible interpretations rather than picking one and presenting it as certain.

Terse feedback (as given, however short): {{FEEDBACK}}
The specific passage/section it refers to: {{PASSAGE}}
Any context on the advisor's known priorities or prior feedback patterns (optional): {{ADVISOR_CONTEXT}}

Instructions:
1. For each piece of feedback in {{FEEDBACK}}, identify what it most plausibly means given {{PASSAGE}} — a single word like "unclear" attached to a specific sentence usually points at a specific ambiguity in that sentence; connect the feedback to the actual textual feature it's likely responding to, not a generic interpretation of the word.
2. If {{ADVISOR_CONTEXT}} is given, use it to disambiguate — an advisor known for prioritizing methodological rigor giving the comment "more rigor" likely means something different (a specific analytical gap) than a generalist advisor using the same phrase might mean (broader argument support).
3. If a piece of feedback genuinely supports more than one reasonable interpretation, present 2-3 candidate readings rather than guessing one — each with what a revision under that reading would concretely involve, so the student can bring the options back to the advisor rather than gambling on a wrong guess.
4. For each interpreted piece of feedback, translate it into a specific, checkable revision action — not "add more rigor" but "add a sentence justifying why this specific statistical test was chosen over the alternative, since that's the gap {{PASSAGE}} seems to leave open."
5. If multiple pieces of feedback in {{FEEDBACK}} point at the same underlying issue (e.g. "unclear" in three different places all near claims that lack supporting evidence), group them and name the shared underlying pattern rather than treating each as an isolated fix — the actual root cause is often one recurring gap, not several unrelated ones.
6. If a piece of feedback seems to genuinely need clarification from the advisor rather than being confidently interpretable even with context, say so explicitly and suggest a specific, low-effort question to ask (a one-line email, not a full meeting request) rather than guessing and revising in a possibly-wrong direction.

Output format: Markdown. For each piece of feedback: the likely meaning (or candidate readings if ambiguous), the specific revision action, and whether it's confidently interpretable or worth confirming with the advisor. End with a note on any shared underlying pattern across multiple feedback items.
```

## Variables
- `{{FEEDBACK}}` — the terse feedback as actually given (can be very short — a word, a phrase, a symbol). Required.
- `{{PASSAGE}}` — the specific text the feedback refers to. Required — feedback this compressed can't be interpreted without the passage it's attached to.
- `{{ADVISOR_CONTEXT}}` — the advisor's known priorities, style, or prior feedback patterns, if known. Optional, but substantially sharpens interpretation when available.

## Example
**Input:** `{{FEEDBACK}}` = "vague — ?" `{{PASSAGE}}` = "Prior research suggests this approach may be effective in similar contexts." `{{ADVISOR_CONTEXT}}` = "Advisor consistently pushes for specific citations rather than general claims like 'prior research suggests.'"

**Output (excerpt):**
```
### Feedback: "vague — ?"
Likely meaning: Given {{ADVISOR_CONTEXT}}'s known pattern of pushing for specific citations over general claims, "vague" most plausibly targets "prior research suggests" as an unsupported general claim — no specific study is cited, and "similar contexts" isn't defined (similar how? same population, same method, same outcome measure?).

Revision action: Replace the general claim with specific citations — e.g. "Smith (2021) and Jones (2019) found this approach effective in [specific context]," naming which contexts those studies actually examined rather than the vague "similar contexts." If no specific supporting citation actually exists for this claim, that's a more serious gap than a wording fix — the claim itself may need to be dropped or reframed as a hypothesis rather than an established finding.

Confidence: Confidently interpretable given {{ADVISOR_CONTEXT}}'s consistent pattern — no need to confirm with the advisor before revising.
```

## Tips & Variations
- Pair with `methodology-section-critique` (research-and-academic, already shipped) if the translated feedback points at a methods gap specifically — that prompt can do a fuller pass once this one has identified which section actually needs the deeper critique.
- Build {{ADVISOR_CONTEXT}} up over time from repeated feedback sessions — an advisor's shorthand becomes much more interpretable once a pattern of what they typically mean by common terse comments ("tighten this," "so what?") is established from several rounds.
- When a candidate interpretation is presented as one of several plausible readings, don't silently pick the one that's easiest to act on — bring the actual ambiguity back to the advisor when it's cheap to ask, since guessing wrong costs more revision time than a one-line clarifying question would.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

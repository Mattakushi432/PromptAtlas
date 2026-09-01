---
id: reference-check-question-set-builder
title: Reference Check Question Set Builder
category: career-and-hr
tags: [interview-prep, hr]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Designs a reference-check question set tied to specific concerns or open questions left by the interview loop — gives the reference concrete scenarios to speak to rather than generic prompts that invite polite, low-information praise — distinct from `mock-interview-practice-partner` (career-and-hr, already shipped) and `interview-panel-feedback-synthesizer` (career-and-hr, already shipped), which prepare candidates and synthesize panel feedback respectively; this prompt is scoped to the reference-check stage that follows the interview loop, targeting exactly what the loop couldn't answer.

## When to use it
- The interview loop is done and left a specific open question or soft concern (how the candidate handles ambiguity, whether a strength observed in interviews holds up in daily work) and you want reference questions that actually probe it, not a generic reference-check script.
- You're about to make reference calls and want to avoid the common failure of asking broad questions ("what's it like to work with them?") that produce pleasant but uninformative answers.
- You want to check whether your planned reference questions would actually surface useful signal, or whether they're likely to just confirm what you already believe.

## The Prompt

```
You design a reference-check question set targeted at specific open questions or concerns from an interview loop. You give the reference concrete scenarios to speak to — you do not write generic reference-check questions that invite vague, low-information praise regardless of what's actually still uncertain about the candidate.

Open questions/concerns from the interview loop (what's still uncertain about the candidate): {{OPEN_QUESTIONS}}
Role the candidate is being considered for: {{ROLE}}
Reference's relationship to the candidate (former manager, peer, direct report): {{REFERENCE_RELATIONSHIP}}

Instructions:
1. For each item in {{OPEN_QUESTIONS}}, write a specific behavioral question that asks the reference to describe an actual situation, not a general opinion — "can you describe a specific time [candidate] had to handle a project with ambiguous or shifting scope — what did they actually do?" rather than "how do they handle ambiguity?", which invites a generic, hard-to-verify answer.
2. Calibrate each question to {{REFERENCE_RELATIONSHIP}} — a former manager can speak to performance management and growth trajectory in ways a peer can't; a peer can speak to day-to-day collaboration in ways a manager who saw only outcomes might not have direct visibility into; don't ask a peer reference a question only their manager could meaningfully answer.
3. Avoid leading questions that signal the desired answer — "they're great at handling ambiguity, right?" gets agreement, not information; phrase questions neutrally enough that a genuinely mixed or negative answer is just as easy to give as a positive one.
4. Include at least one question that would surface a genuine concern if one exists, not just confirmatory questions — something like "is there anything you'd want their next manager to know or watch for?" gives room for an honest reference to flag something real without requiring them to volunteer criticism unprompted.
5. For {{ROLE}}, include one question tied to a specific requirement of that role (not just general work-style questions) — if the role requires significant cross-functional coordination and that's untested in the interview loop, ask specifically about the candidate's track record on that, not a generic "are they a team player" question.
6. Keep the set focused — 5-7 targeted questions the reference can actually engage with in a typical 15-20 minute call, not an exhaustive list that turns the call into a rushed checklist read-through.

Output format: Markdown, numbered question list. For each question: the question itself, and a one-line note on which open question/concern from {{OPEN_QUESTIONS}} it's targeting.
```

## Variables
- `{{OPEN_QUESTIONS}}` — the specific things the interview loop left unresolved or uncertain about the candidate. Required — without a specific target, the questions default to generic reference-check boilerplate.
- `{{ROLE}}` — the role being considered, since questions should connect to its actual requirements. Required.
- `{{REFERENCE_RELATIONSHIP}}` — how this specific reference knew the candidate, since it determines what they can credibly speak to. Required.

## Example
**Input:** `{{OPEN_QUESTIONS}}` = "Interview loop left it unclear how the candidate handles genuinely ambiguous scope — all technical rounds involved well-defined problems. Also some inconsistency in interview feedback about whether they proactively communicate blockers or wait to be asked." `{{ROLE}}` = "Senior Product Engineer, expected to often work from loosely-defined problems" `{{REFERENCE_RELATIONSHIP}}` = "Former direct manager, worked together for 18 months"

**Output (excerpt):**
```
1. "Can you describe a specific project where the scope was genuinely unclear or kept shifting — what did [candidate] actually do to move it forward, and how did that compare to how other engineers on your team handled similar situations?"
Targets: the untested ambiguous-scope concern — asks for a concrete comparison point, not just a description in isolation.

2. "When [candidate] hit a blocker on a project, did they typically flag it proactively, or did you or others usually have to ask what was going on? Can you think of a specific example either way?"
Targets: the inconsistent interview-feedback signal on proactive communication — phrased neutrally so either answer is easy to give, and asks for a concrete instance rather than a general characterization.

3. "Is there anything about how they'd handle a role that's frequently working from loosely-defined problems — like this one — that you'd want their next manager to know or watch for?"
Targets: an open-ended check for role-relevant concerns beyond what's already been specifically asked, calibrated to a former manager who can speak to growth areas a peer might not have visibility into.
```

## Tips & Variations
- Pair with `interview-panel-feedback-synthesizer` (career-and-hr, already shipped) to generate {{OPEN_QUESTIONS}} in the first place — that prompt's "Loop Coverage Notes" output (competencies the panel didn't clearly assess) is a natural direct input to this prompt's targeting.
- If a reference gives a vague or evasive answer to a targeted question, that itself can be informative — a reference who won't engage with a specific scenario question about a real concern sometimes signals more than an enthusiastic non-answer to a generic one, though it's not proof of anything on its own.
- For a reference who's clearly a hand-picked, highly favorable choice by the candidate (common and expected), the "anything to watch for" style question (step 4) is still worth asking — a reference chosen for favorability will still often give an honest, mild flag if asked directly and given room to.

## Changelog
- 1.0.0 (2026-09-01): Initial version.

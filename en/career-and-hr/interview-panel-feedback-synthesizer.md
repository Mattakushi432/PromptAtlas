---
id: interview-panel-feedback-synthesizer
title: Interview Panel Feedback Synthesizer
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
Turns multiple interviewers' independent, often inconsistently-formatted notes into a structured hire/no-hire synthesis — surfaces genuine disagreement between panelists rather than averaging it away, and flags when panelists evaluated different things entirely because the interview loop wasn't well-coordinated, distinct from `mock-interview-practice-partner` (career-and-hr, already shipped), which prepares a candidate for interviews rather than synthesizing panel feedback after they've happened.

## When to use it
- A candidate has completed a multi-interviewer loop and you need to synthesize scattered, differently-formatted feedback into a coherent recommendation before a hiring decision meeting.
- Panelists gave meaningfully different assessments and you want that disagreement surfaced clearly rather than smoothed into a false consensus average.
- You're debriefing after a loop and want to check whether the panel actually covered the role's key competencies collectively, or left a gap because two interviewers accidentally covered the same ground.

## The Prompt

```
You synthesize multiple interviewers' independent feedback on a candidate into a structured summary. You surface genuine disagreement between panelists explicitly — you do not average conflicting assessments into a falsely smooth consensus.

Panelist feedback (as given, one entry per interviewer): {{PANELIST_FEEDBACK}}
Key competencies the loop was meant to assess: {{COMPETENCIES}}
Role and level: {{ROLE}}

Instructions:
1. Map each panelist's feedback to the competencies in {{COMPETENCIES}} it actually addresses — this reveals coverage: which competencies were assessed by multiple panelists (redundant but consistent, or redundant and conflicting), and which weren't clearly assessed by anyone.
2. Where panelists agree on a competency, state the consensus and the specific evidence cited (not just "everyone liked them on X") — the specific behavioral evidence matters more for the hiring decision than the aggregate sentiment.
3. Where panelists disagree on a competency, state the disagreement explicitly and clearly — do not resolve it into a single averaged score or a vague middle-ground summary; a genuine split between panelists is important decision-relevant information, not noise to smooth over.
4. Flag any competency in {{COMPETENCIES}} that no panelist's feedback clearly addresses — this is a coverage gap in the loop itself (not a candidate weakness) and should be named as such, since it means the panel can't actually speak to whether the candidate meets that bar.
5. Note if two or more panelists appear to have covered largely the same ground (e.g. both ran similar technical questions) — this signals the loop wasn't well-coordinated and left a different area under-assessed, which is worth surfacing for the current decision and for improving the next loop's structure.
6. End with a synthesized recommendation only if the panelist feedback actually supports a clear one — if the panel is genuinely split on a decision-critical competency, say that explicitly rather than manufacturing a confident recommendation the underlying feedback doesn't support.

Output format: Markdown, one section per competency in {{COMPETENCIES}}: consensus or disagreement, supporting evidence quoted from panelists, and coverage status. End with a "Loop Coverage Notes" section (gaps, redundancy) and a recommendation section (or explicit "genuinely split, needs discussion" if warranted).
```

## Variables
- `{{PANELIST_FEEDBACK}}` — each interviewer's notes/feedback, as given, ideally labeled by panelist. Required.
- `{{COMPETENCIES}}` — the key competencies or signals the interview loop was designed to assess. Required — without this, coverage gaps and redundancy can't be identified.
- `{{ROLE}}` — the role and level being hired for, since this contextualizes what a given competency assessment should actually weigh. Required.

## Example
**Input:** `{{PANELIST_FEEDBACK}}` = "Interviewer A (system design round): Strong — walked through tradeoffs clearly, asked good clarifying questions. Interviewer B (coding round): Solid coding, but seemed to struggle articulating why they chose one approach over another. Interviewer C (system design round, second one): Weak — didn't consider scalability at all until prompted." `{{COMPETENCIES}}` = "System design ability, coding proficiency, communication/reasoning-articulation" `{{ROLE}}` = "Senior Backend Engineer"

**Output (excerpt):**
```
### System Design Ability
Disagreement: Interviewer A rated this strong (clear tradeoff articulation, good clarifying questions), while Interviewer C rated it weak (didn't consider scalability until prompted) — in the same competency area, from two separate system-design rounds. This is a genuine, decision-relevant split, not noise: it might indicate inconsistent performance across two sessions, or that the two interviewers weighted different things as "good" system design. Worth asking A and C directly what specifically drove the different read before the decision meeting, rather than averaging to "moderate."

### Communication / Reasoning-Articulation
Interviewer B's note ("struggled articulating why they chose one approach over another") is the only feedback that clearly addresses this competency — no other panelist's notes speak to it directly. Single-source signal on a decision-relevant competency; worth noting this isn't independently corroborated.

### Loop Coverage Notes
Redundancy: two separate system-design rounds (A and C) covered largely the same competency, with conflicting results, while coding proficiency (B) and communication (also mostly B) each got comparatively less independent coverage. Consider for the next loop: differentiate what each system-design round is meant to probe, rather than running two similar rounds.

### Recommendation
Not straightforward — system design shows a genuine split between two independent assessors, which is the most decision-critical competency for {{ROLE}}. Recommend a follow-up conversation or a tie-breaking assessment on system design specifically before a final call, rather than proceeding on an averaged read of conflicting signal.
```

## Tips & Variations
- Pair with `mock-interview-practice-partner` (career-and-hr, already shipped) on the candidate-preparation side of the process — that prompt helps a candidate prepare before a loop; this prompt synthesizes what actually happened after, and the two serve opposite sides of the same interview process.
- If a genuine split surfaces on a decision-critical competency, resist the urge to let this prompt's output alone resolve it — the recommendation here is "get more signal" (a follow-up conversation, a tie-breaking round), not a forced decision; a real disagreement between skilled interviewers usually means more data is needed, not a coin flip.
- Track recurring "Loop Coverage Notes" findings across multiple hiring loops for the same role — a redundancy or gap that shows up repeatedly across candidates is a structural problem with the interview loop design itself, worth fixing once rather than re-discovering every hire.

## Changelog
- 1.0.0 (2026-09-01): Initial version.

---
id: exit-interview-question-set-theme-synthesizer
title: Exit Interview Question Set + Theme Synthesizer
category: career-and-hr
tags: [exit-interview, hr, planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Two-part tool for an HR/People team: generates a tailored exit interview question set for a departing employee's specific situation, and separately synthesizes recurring themes across multiple completed exit interviews — a planning-and-analysis pair, not a single-use question generator.

## When to use it
- An employee is departing and you want a question set tailored to their specific situation (voluntary vs. involuntary, tenure, role) rather than a generic fixed script every time.
- You've accumulated several exit interview notes/transcripts and want to identify recurring patterns rather than treating each one as an isolated data point.
- Leadership is asking "why are people leaving" and you need a synthesized, evidence-based answer rather than anecdotal impressions from whoever remembers the most recent departures.

## The Prompt

```
You perform one of two tasks: (A) generate an exit interview question set tailored to a specific departure, or (B) synthesize recurring themes across multiple exit interview notes. Use the task specified below.

Task: {{TASK}} (A: generate questions, or B: synthesize themes)

--- For Task A ---
Departure context: {{DEPARTURE_CONTEXT}}
Tenure and role: {{TENURE_ROLE}}

--- For Task B ---
Exit interview notes/transcripts (multiple): {{INTERVIEW_NOTES}}

Instructions for Task A:
1. Tailor questions to {{DEPARTURE_CONTEXT}} — a voluntary departure to a competitor gets different questions than a departure due to burnout or a departure following a reorg; do not use one fixed script regardless of context.
2. Include open-ended questions that invite honest specifics ("What was the tipping point, if there was one?") over closed or leading questions ("Was it about compensation?") that presuppose an answer.
3. Include at least one question specifically probing manager/team experience and one probing whether the departure was preventable from the company's side — these are the questions most likely to surface actionable signal, and are also the ones easiest to omit for social-comfort reasons.
4. Keep the set to a reasonable length for a single conversation (8-12 questions) — a longer list either doesn't get asked in full or produces shallow answers to each.

Instructions for Task B:
1. Read across all provided {{INTERVIEW_NOTES}} and identify themes that appear in multiple interviews — do not report a theme from a single interview as if it were a pattern.
2. For each identified theme, state how many/which interviews it appeared in (even approximately) so the synthesis is falsifiable, not just an impression.
3. Distinguish themes that are actionable (something the company could plausibly change) from ones that aren't (e.g. "wanted to relocate for family reasons") — leadership needs the actionable ones prioritized, not buried among the non-actionable.
4. If the notes are too few or too thin to support a genuine pattern (e.g. only 2 interviews, or notes lacking real detail), say so explicitly rather than presenting a weak signal as a confident finding.

Output format for Task A: a numbered question list with a one-line note on the intent behind each question. Output format for Task B: Markdown, one section per theme with supporting interview count and 1-2 representative (anonymized) quotes, ranked by how many interviews support it, ending with an actionable-vs-not-actionable split.
```

## Variables
- `{{TASK}}` — "A" or "B", which mode to run. Required.
- `{{DEPARTURE_CONTEXT}}` (Task A) — voluntary/involuntary, known reason if any, relationship with manager. Required for Task A.
- `{{TENURE_ROLE}}` (Task A) — how long they were there and their role/level. Required for Task A.
- `{{INTERVIEW_NOTES}}` (Task B) — multiple sets of exit interview notes, ideally anonymized already. Required for Task B — needs at least a few interviews for a real pattern to be findable.

## Example
**Input:** `{{TASK}}` = "B" · `{{INTERVIEW_NOTES}}` = "[5 anonymized exit interview summaries, 3 of which independently mention unclear promotion criteria as a frustration]"

**Output (excerpt):**
```
### Theme: Unclear promotion criteria
Appeared in 3 of 5 interviews. Representative quotes: "I never really understood what I needed to do differently to get to the next level" / "Promotion felt like a black box, not something I could work toward."
Actionable: Yes — this is a process/communication gap the company can address directly (e.g. publishing leveling criteria).

### Theme: Wanted to relocate closer to family
Appeared in 1 of 5 interviews.
Actionable: No — a personal life circumstance, not something to weight as an organizational signal from this data alone.
```

## Tips & Variations
- Run Task A fresh for every departure rather than reusing a saved question set — the context-tailoring is the point, not a formality.
- For Task B, re-run the synthesis periodically (e.g. quarterly) as new interviews accumulate rather than only once — a single pattern from 3 interviews becomes much more (or less) confident evidence once there are 10.
- If a theme keeps surfacing as actionable but nothing changes about it release over release, that itself is worth naming explicitly to leadership — a recurring "known issue, still unaddressed" theme is a different, more urgent signal than a first-time finding.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

---
id: stay-interview-question-designer
title: Stay Interview Question Designer
category: career-and-hr
tags: [retention, hr]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Designs a proactive "stay interview" question set for a current, valued employee — asked before they're considering leaving, aimed at surfacing what's actually keeping them engaged and what would make them start looking elsewhere — the retention-focused counterpart to `exit-interview-question-set-theme-synthesizer` (career-and-hr, already shipped)'s after-the-fact departure scope, and structured deliberately to not feel like a performance review or a trap.

## When to use it
- You manage or support a valued employee and want to proactively check in on their engagement before any signal of them looking elsewhere, rather than waiting for a resignation to find out what mattered to them.
- You've had a near-miss (someone almost left, or you learned late that someone was unhappy) and want a repeatable structure to catch this earlier with others.
- HR/People wants to establish a regular stay-interview cadence for key roles or high performers and needs a question set that actually surfaces honest signal rather than polite, guarded answers.

## The Prompt

```
You design a stay interview question set for a current employee — a proactive, retention-focused conversation, not a performance review and not a trap. The questions should invite honest reflection on what's working and what could push them to leave, asked in a way that feels genuinely curious rather than evaluative.

Employee context (role, tenure, why this conversation is happening now): {{EMPLOYEE_CONTEXT}}
Who's conducting the conversation (direct manager, skip-level, HR/People): {{INTERVIEWER}}
Anything specific you're hoping to learn or already suspect: {{FOCUS_AREAS}}

Instructions:
1. Open with a question that establishes genuine positive engagement before anything else — what's actually working, what they look forward to — not as a throwaway warm-up, but because starting with what's good gives real texture to compare the harder questions against later.
2. Include a direct question about what would make them consider leaving — phrased as a real, answerable question ("What would make you start looking elsewhere?") rather than a euphemism that lets them give a safe non-answer; if {{INTERVIEWER}} is the direct manager, note that this specific question may get a more guarded answer than if asked by HR/People or a skip-level, and adjust framing accordingly.
3. Ask about their actual day-to-day experience of the role versus what they expected or were told when they joined or were promoted — a gap here (more of X than expected, less of Y than hoped) is one of the most common, addressable drivers of quiet disengagement.
4. Ask specifically about their relationship with their direct manager if {{INTERVIEWER}} isn't that manager — this question needs a different, more trusted asker than the manager themselves, since an honest answer about the manager relationship is unlikely if the manager is the one asking.
5. Ask about their sense of growth/advancement specifically, not just satisfaction generally — "do you see a path here for what you want next" surfaces a different, often more decision-relevant signal than "are you happy," since someone can be satisfied day-to-day while still planning to leave for lack of a visible path.
6. Keep the set to 6-10 questions for a single conversation, not an exhaustive survey — a stay interview works better as a genuine conversation with room to follow up on answers than as a checklist to complete.

Output format: a numbered question list with a one-line note on the intent behind each question and who's best positioned to ask it if that varies from {{INTERVIEWER}}. End with a short note on how to open the conversation so it doesn't feel like a review.
```

## Variables
- `{{EMPLOYEE_CONTEXT}}` — the employee's role, tenure, and why this conversation is happening now (regular cadence, a specific concern, a key-person retention priority). Required.
- `{{INTERVIEWER}}` — who's conducting the conversation, since some questions land differently depending on whether it's their manager, a skip-level, or HR/People. Required.
- `{{FOCUS_AREAS}}` — anything specific already suspected or hoped to learn (a compensation concern, a growth-path question, team dynamics). Optional, but sharpens question selection toward what's actually relevant for this person.

## Example
**Input:** `{{EMPLOYEE_CONTEXT}}` = "Senior engineer, 3 years tenure, strong performer, this is part of a new quarterly stay-interview practice for senior ICs, no specific concern flagged yet" `{{INTERVIEWER}}` = "Skip-level manager (not their direct manager)" `{{FOCUS_AREAS}}` = "None specific — this is a proactive check-in, not triggered by a concern"

**Output (excerpt):**
```
1. What's a part of your work right now that you actually look forward to? — Intent: establishes genuine positive baseline before harder questions, and often surfaces what to protect/expand rather than assuming it's obvious.
2. What would make you start looking elsewhere, even if you're not looking now? — Intent: the core stay-interview question, asked directly rather than euphemistically; being a skip-level rather than their direct manager should make this easier to answer honestly.
3. How's your day-to-day experience of the role compared to what you expected when you joined/were leveled up? — Intent: surfaces expectation-reality gaps, a common quiet-disengagement driver.
4. How's your relationship with [direct manager's name] — anything about that working relationship you wish were different? — Intent: this question specifically benefits from being asked by a skip-level rather than the manager themselves, since an honest answer about the manager relationship needs a different, trusted asker.
5. Do you see a path here toward what you actually want next, career-wise? — Intent: surfaces growth-path signal distinct from general day-to-day satisfaction.

Opening note: Frame this explicitly as separate from performance review — something like "This isn't about your performance, which is strong — I want to hear honestly what's working and what isn't, so we can act on it before it becomes a reason to leave" sets the tone before the questions start.
```

## Tips & Variations
- Pair with `exit-interview-question-set-theme-synthesizer` (career-and-hr, already shipped) at the organizational level — if stay-interview themes across multiple employees start resembling exit-interview themes from people who've already left, that's a strong signal the same underlying issue is driving both, worth surfacing to leadership together rather than treating the two data sources separately.
- If {{FOCUS_AREAS}} reveals a specific known concern (e.g. a recent reorg, a compensation freeze), weight the question set toward that area explicitly rather than running the fully generic set — a stay interview that ignores an elephant in the room reads as either oblivious or evasive.
- Don't treat a single stay interview as conclusive — a person's honest answer in one conversation is a data point, not a verdict; the real value comes from doing this regularly enough that a shift in someone's answers over time becomes visible.

## Changelog
- 1.0.0 (2026-09-01): Initial version.

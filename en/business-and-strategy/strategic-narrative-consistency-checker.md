---
id: strategic-narrative-consistency-checker
title: Strategic Narrative Consistency Checker
category: business-and-strategy
tags: [strategy, communication]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Checks whether the story told to investors, employees, and customers about the company's direction is actually the same underlying narrative, or has quietly diverged into different — sometimes conflicting — versions, given drafted or described communications to each audience. Flags specific inconsistencies rather than assuming messaging naturally stays aligned across audiences, since each audience's communications are usually drafted separately by different people at different times, which is exactly how a narrative drifts without anyone deciding it should.

## When to use it
- You're preparing communications for multiple audiences around the same time (an investor update, an all-hands, a customer announcement) and want to check they tell compatible stories before they all go out.
- Someone internally has noticed the company's messaging feels inconsistent across channels and you want a systematic check of where and how it actually diverges, not just a vague feeling confirmed.
- You're inheriting communications responsibility and want to audit whether the existing narrative across audiences is actually coherent before you start drafting new material on top of it.

## The Prompt

```
You check whether communications to different audiences about the company's direction tell the same underlying story. You flag specific inconsistencies with the exact conflicting statements — not a vague "messaging could be tighter," but the specific claim in one audience's communication that contradicts or sits awkwardly against a specific claim made to another audience.

Communications by audience (as many as available — investors, employees, customers, press): {{AUDIENCE_COMMUNICATIONS}}
The actual underlying strategic direction, as you understand it (for cross-checking, not for the audiences to see): {{ACTUAL_DIRECTION}}
Time period these communications span: {{TIME_PERIOD}}

Instructions:
1. Extract the core narrative claim from each audience's communication in {{AUDIENCE_COMMUNICATIONS}} — the specific story being told about where the company is headed and why, not a full summary but the load-bearing claim (e.g. "aggressive growth phase," "consolidating and focusing," "pivoting toward X").
2. Compare the extracted claims pairwise across audiences — where two audiences' core narratives are compatible (different emphasis appropriate to that audience, but not actually contradictory), say so explicitly; where they genuinely conflict (a growth story to investors alongside a headcount-freeze/stability story to employees with no reconciling context), name the specific conflicting statements.
3. Distinguish audience-appropriate emphasis from genuine inconsistency — it's normal and expected for the same underlying direction to be framed differently for investors (financial framing) versus employees (day-to-day impact framing) versus customers (product/value framing); only flag it when the underlying substance actually differs, not when the framing differs for a legitimately different audience.
4. Cross-check each audience's narrative against {{ACTUAL_DIRECTION}} — flag any audience communication that has drifted from the actual strategic direction, even if it's internally consistent with other communications to that same audience, since a narrative can be self-consistent within one audience's series of updates while still having drifted from what's actually true.
5. Note the specific risk each flagged inconsistency creates — an investor-employee conflict risks eroding trust if an employee sees the investor-facing materials (increasingly likely given how information crosses those boundaries); a customer-facing inconsistency risks a specific customer-facing credibility problem. Name the plausible way each inconsistency could actually surface as a problem, not just that it's theoretically inconsistent.
6. If {{TIME_PERIOD}} spans a genuine strategic shift (the direction actually changed partway through), distinguish a legitimate evolution properly communicated as such from an unacknowledged drift — a real strategy change isn't itself an inconsistency if all audiences were told about the change; the problem is when the shift happened in messaging without being named as a shift.

Output format: Markdown. For each audience: the extracted core narrative claim. Then a "Cross-Audience Conflicts" section listing specific inconsistencies with quoted statements from each side and the concrete risk each creates. End with an overall verdict: narrative is coherent, or specific reconciliation needed before more communications go out.
```

## Variables
- `{{AUDIENCE_COMMUNICATIONS}}` — the actual or drafted communications to each audience, as many as are available for comparison. Required — the check needs real text to compare, not a summary of what each audience was generally told.
- `{{ACTUAL_DIRECTION}}` — your own honest understanding of the real strategic direction, used only for cross-checking each audience's narrative against reality, not shown to any audience. Required.
- `{{TIME_PERIOD}}` — the span these communications cover, since a genuine strategic evolution over time needs to be distinguished from unacknowledged drift. Required.

## Example
**Input:** `{{AUDIENCE_COMMUNICATIONS}}` = "Investor update (last month): 'We're entering an aggressive growth phase, targeting 3x headcount over 18 months to capture the expanding market opportunity.' All-hands (this week): 'We're focusing on efficiency and sustainable growth — no major hiring push planned for the next two quarters.'" `{{ACTUAL_DIRECTION}}` = "Board actually did approve a slower, more selective growth plan than the investor update suggested — the investor update was written before that decision was finalized" `{{TIME_PERIOD}}` = "Last 6 weeks"

**Output (excerpt):**
```
### Investors — Core Narrative
"Aggressive growth phase, targeting 3x headcount over 18 months" — a fast, high-investment growth story.

### Employees — Core Narrative
"Focusing on efficiency and sustainable growth — no major hiring push" — a measured, efficiency-first story.

### Cross-Audience Conflicts
Direct conflict: The investor update's "3x headcount over 18 months" and the all-hands "no major hiring push planned for the next two quarters" describe substantively different growth trajectories, not just different framing of the same plan — this isn't investors getting the financial angle and employees getting the day-to-day angle on the same story; these are two different stories.
Risk: If an employee sees the investor update (a real possibility — investor materials circulate more widely than intended), the "no major hiring push" message from leadership will read as either outdated or dishonest, damaging trust regardless of which version was more accurate at the time each was written.

Cross-check against {{ACTUAL_DIRECTION}}: The employee-facing message is closer to the actual board-approved direction; the investor update reflects an earlier, since-superseded plan. This is drift, not a properly-communicated evolution — investors haven't been told the plan changed since that update went out.

### Overall Verdict
Specific reconciliation needed before further communications go out: investors need an update reflecting the actual board-approved (slower) growth plan before the gap between what they were told and current reality widens further, and before an employee-investor cross-reference surfaces the inconsistency externally.
```

## Tips & Variations
- Pair with `investor-update-drafter` (business-and-strategy, already shipped) once a reconciling investor communication needs to be drafted — that prompt drafts the actual update; this prompt is what determines a reconciling update is needed in the first place and what it needs to address.
- Run this check before sending communications, not just as a retrospective audit — the highest-value use is catching a coming inconsistency before three different pieces of messaging go out in the same week, not discovering the conflict after the fact.
- If {{ACTUAL_DIRECTION}} itself is genuinely unsettled (leadership hasn't actually finalized a direction), that's worth surfacing as the root cause — inconsistent messaging is often a symptom of an underlying strategic decision that was never actually made, not just a communications-coordination failure.

## Changelog
- 1.0.0 (2026-09-01): Initial version.

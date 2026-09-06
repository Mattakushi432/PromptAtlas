---
id: individual-development-plan-idp-drafter
title: Individual Development Plan (IDP) Drafter
category: career-and-hr
tags: [career-pathing, coaching]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Drafts a direct report's individual development plan by combining actual performance signal with their stated career interest — the manager-facing counterpart to `career-path-options-explorer` (career-and-hr, already shipped), which helps a job seeker explore their own options self-directedly; this prompt is for a manager building a concrete growth plan for someone they manage, grounded in specific observed strengths/gaps rather than generic development-area templates.

## When to use it
- You manage someone and need to draft a concrete individual development plan tied to their actual performance and stated interests, not a generic template with placeholder competencies.
- A direct report has expressed interest in a specific direction (a promotion, a lateral move, a skill area) and you want to translate that into a concrete plan with real actions, not just a restated goal.
- You're preparing for a career-conversation 1:1 and want a draft to react to and refine together with the direct report, rather than starting from a blank page in the room.

## The Prompt

```
You draft an individual development plan for a direct report, combining their actual performance signal with their stated career interest. You ground every development area in specific observed behavior or feedback — you do not fill the plan with generic competency-template language disconnected from this specific person.

Direct report's stated career interest/goal: {{CAREER_GOAL}}
Actual performance signal (strengths, gaps, recent feedback): {{PERFORMANCE_SIGNAL}}
Timeframe for this plan: {{TIMEFRAME}}

Instructions:
1. Identify the specific gap between {{PERFORMANCE_SIGNAL}}'s current state and what {{CAREER_GOAL}} actually requires — not a generic "needs more leadership experience" but the specific, observable capability gap given what's actually known about this person's current performance.
2. For each development area, ground it in specific evidence from {{PERFORMANCE_SIGNAL}} — a development area with no cited evidence reads as a template filled in with a plausible-sounding gap rather than something grounded in this person's actual situation.
3. For each development area, propose 1-2 concrete actions with a realistic scope for {{TIMEFRAME}} — a stretch project, a specific skill-building activity, a mentorship pairing — not a vague "seek out opportunities to develop this," which gives the person nothing to actually act on.
4. Check that the plan's ambition is calibrated to {{TIMEFRAME}} — a development plan that would genuinely require years compressed into a 6-month plan sets up disappointment; if {{CAREER_GOAL}} is a longer-horizon goal than {{TIMEFRAME}} covers, say so explicitly and frame this plan as one leg of a longer journey rather than implying the full goal is reachable in this window.
5. Include at least one existing strength to leverage, not just gaps to close — a development plan that's entirely deficit-focused reads as a corrective action plan rather than genuine growth support, even when that's not the intent.
6. Note what success/progress checking looks like at the end of {{TIMEFRAME}} — a specific way to assess whether the plan actually moved the needle, not just "revisit in the next review cycle" with no criteria.

Output format: Markdown with sections: Goal & Gap Summary, Development Areas (each with grounding evidence + concrete actions), Strength to Leverage, and Progress Check at end of {{TIMEFRAME}}.
```

## Variables
- `{{CAREER_GOAL}}` — the direct report's stated interest or goal, as specifically as known. Required.
- `{{PERFORMANCE_SIGNAL}}` — actual, specific performance information — strengths, gaps, recent feedback, notable projects. Required — without this, development areas can't be grounded in anything real.
- `{{TIMEFRAME}}` — the period this plan covers. Required — calibrates ambition and realistic scope of proposed actions.

## Example
**Input:** `{{CAREER_GOAL}}` = "Wants to move from senior engineer to engineering manager within the next year or two" `{{PERFORMANCE_SIGNAL}}` = "Strong technical performer, frequently helps unblock teammates informally, but has never led a project with formal cross-team coordination or given anyone direct feedback on their work; peer feedback mentions they're 'great to work with' but sometimes avoid difficult conversations" `{{TIMEFRAME}}` = "6 months"

**Output (excerpt):**
```
### Goal & Gap Summary
{{CAREER_GOAL}} (EM within 1-2 years) requires demonstrated experience with formal leadership responsibilities — project coordination across teams and giving direct, sometimes difficult feedback — neither of which {{PERFORMANCE_SIGNAL}} shows evidence of yet, despite strong informal helpfulness. This 6-month plan can't close the full gap to EM-readiness, but can build the specific missing evidence needed to make that case credibly later.

### Development Area: Cross-Team Project Leadership
Evidence: {{PERFORMANCE_SIGNAL}} shows informal unblocking of teammates but no formal, named leadership of a cross-team initiative — this is a specific, checkable gap against the EM goal's requirement.
Actions: Propose them as lead for [a specific upcoming cross-team project scoped to the team's actual roadmap] — a real project, not a manufactured leadership exercise. Pair with a monthly check-in specifically on coordination challenges encountered, not general project status.

### Development Area: Direct, Sometimes-Difficult Feedback
Evidence: Peer feedback notes they avoid difficult conversations — directly relevant since EM role requires giving hard feedback regularly, and this is a specific, named gap rather than an inferred one.
Actions: Start with lower-stakes practice — have them deliver structured feedback in a peer-review or retro context where the stakes are lower than a formal report relationship, before this becomes something they need to do "for real" as a manager.

### Strength to Leverage
Their informal unblocking behavior and "great to work with" peer sentiment is genuine relationship-building capital — this is a real asset for a future EM role, not something to treat as separate from the development areas; the cross-team project (above) should draw on this existing strength, not require them to build trust from scratch.

### Progress Check at 6 Months
Specific check: did the cross-team project actually happen and did they lead it (not just participate)? Did they deliver at least one instance of documented direct feedback (even informal) that they can point to? These are concrete, checkable — not "does it feel like they've grown."
```

## Tips & Variations
- Pair with `career-path-options-explorer` (career-and-hr, already shipped) before this prompt if {{CAREER_GOAL}} itself is still vague — that prompt helps the direct report explore and sharpen their own direction first; this prompt then builds the concrete plan once the goal is actually clear enough to plan against.
- Share the draft with the direct report and revise together rather than presenting it as finished — a development plan the person had no hand in shaping tends to feel imposed rather than owned, even when the content is accurate.
- If {{PERFORMANCE_SIGNAL}} is thin (a newer report, limited observed history), say so honestly in the output rather than inventing plausible-sounding gaps — a plan built on genuinely limited signal should acknowledge that and lean more on near-term observation than on committing to specific development areas prematurely.

## Changelog
- 1.0.0 (2026-09-01): Initial version.

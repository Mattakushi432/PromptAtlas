---
id: internal-mobility-pitch-drafter
title: Internal Mobility Pitch Drafter
category: career-and-hr
tags: [career-pathing]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Drafts a concrete pitch for an internal transfer or promotion aimed at a specific decision-maker — translates the employee's actual track record into a case relevant to the target role's needs, rather than a restated resume — distinct from `career-path-options-explorer` (career-and-hr, already shipped), which helps someone explore open-ended possible directions before a direction is chosen; this prompt assumes the target role is already decided and focuses entirely on building the concrete case to a specific audience.

## When to use it
- You've decided on a specific internal move (a target role, a promotion, a transfer to a different team) and need to make a concrete case to the person who'll actually decide, not just restate your resume at them.
- You want to check whether your track record, as you'd currently describe it, actually maps to what the target role needs, or whether there's a real gap you should address head-on rather than hope goes unnoticed.
- You're preparing for a conversation with your manager about supporting an internal move and want a structured pitch to bring rather than a vague "I'm interested in X."

## The Prompt

```
You draft a pitch for an internal transfer or promotion aimed at a specific decision-maker. You translate the person's actual track record into a case relevant to what the target role specifically needs — you do not restate a generic resume summary disconnected from why this particular audience should say yes.

Target role and what it actually requires: {{TARGET_ROLE}}
Decision-maker and their likely priorities/concerns: {{DECISION_MAKER}}
Actual track record relevant to this move (specific projects, results, skills demonstrated): {{TRACK_RECORD}}

Instructions:
1. Identify what {{DECISION_MAKER}} most likely needs to be convinced of — not generic "why I'm good," but the specific thing this specific decision-maker would be evaluating (can this person handle the scope, is the timing right, is there a backfill concern for their current role) — and structure the pitch to address that directly rather than a one-size-fits-all case.
2. For each requirement of {{TARGET_ROLE}}, connect it to specific evidence from {{TRACK_RECORD}} — not a claimed trait ("I'm a strong leader") but a specific instance that demonstrates it ("I led the migration project end to end, including coordinating with three other teams on timeline"). A pitch built on unsupported claims is easy for a decision-maker to discount.
3. If {{TRACK_RECORD}} has a genuine gap against {{TARGET_ROLE}}'s requirements, don't paper over it — name the gap directly and pair it with either evidence of relevant adjacent experience or a concrete plan for closing it, since a decision-maker who notices an unaddressed gap the pitch ignored trusts the rest of the pitch less.
4. Address the practical concern a decision-maker in {{DECISION_MAKER}}'s position would likely have about the transition itself — timing, handoff of current responsibilities, whether this is a sudden ask or something building over time — proactively, rather than leaving it for the decision-maker to raise and appear unprepared for.
5. Keep the pitch concrete and specific rather than aspirational language ("I'm passionate about X," "I'd love the opportunity to grow") — decision-makers evaluating an internal move are typically looking for evidence of readiness now, not enthusiasm alone.
6. End with a specific, low-friction ask — what you're actually requesting from {{DECISION_MAKER}} (a formal application, a trial project, a conversation with the hiring manager, sponsorship in a specific conversation) rather than a vague "let me know what you think."

Output format: Markdown with sections: Why Now / Why Me (the core case), Requirement-by-Requirement Fit (mapping {{TARGET_ROLE}}'s needs to {{TRACK_RECORD}} evidence, gaps named honestly), Transition Considerations, and The Ask.
```

## Variables
- `{{TARGET_ROLE}}` — the specific role being pursued and its actual requirements. Required.
- `{{DECISION_MAKER}}` — who's being pitched and what they likely care about in this specific decision. Required — the pitch's framing depends entirely on this audience.
- `{{TRACK_RECORD}}` — the employee's actual relevant experience, projects, and results. Required — without specifics, the pitch collapses into generic self-advocacy language.

## Example
**Input:** `{{TARGET_ROLE}}` = "Team Lead for the Platform team — requires technical depth in the platform's core systems plus some people-management responsibility for 2-3 engineers" `{{DECISION_MAKER}}` = "Current Platform team manager, likely concerned about whether candidate can handle people management with zero formal experience, and whether their current team (a different team) can absorb the loss" `{{TRACK_RECORD}}` = "3 years on Platform-adjacent team, deep familiarity with the core systems from cross-team integration work; informally mentored 2 junior engineers over the past year with positive feedback from both; current team has a strong second-in-command who could take on more responsibility"

**Output (excerpt):**
```
### Why Now / Why Me
[Decision-maker], I'd like to be considered for the Platform Team Lead role. Over the past 3 years working on Platform-adjacent integration work, I've built deep familiarity with the core systems the role centers on, and over the past year I've been informally mentoring two junior engineers — both have given positive feedback on that mentorship, which is the closest signal I have to the people-management side of this role, even though it hasn't been formal.

### Requirement-by-Requirement Fit
**Technical depth in core platform systems:** 3 years of cross-team integration work directly with these systems — [specific example of a project demonstrating this].
**People management for 2-3 engineers:** Genuine gap — I have no formal management experience. What I do have: 12 months of informal mentorship of two junior engineers, both of whom gave positive feedback ([specific example if available]). I'm not claiming this equals formal management experience, but it's real signal about how I'd approach it, and I'd want to be upfront that formal people-management would be new to me.

### Transition Considerations
My current team has a strong second-in-command who's ready to take on more scope — I've already had an informal conversation with them about this, so a transition wouldn't leave my current team without coverage. Happy to support a reasonable handoff timeline.

### The Ask
I'd like to formally apply when the role opens, and would appreciate 20 minutes to talk through the people-management gap directly and hear what would help you feel confident about that part specifically.
```

## Tips & Variations
- Pair with `career-path-options-explorer` (career-and-hr, already shipped) before this prompt if the target role itself isn't fully decided yet — that prompt helps sharpen the direction first; this prompt assumes the direction is already chosen and focuses entirely on the concrete case.
- Don't skip step 3's honest gap-naming even when it's tempting to — a decision-maker evaluating an internal move usually already has some visibility into the person's actual background, and a pitch that ignores an obvious gap reads as either unaware or evasive, both of which cost more credibility than naming the gap directly would.
- If {{DECISION_MAKER}} is genuinely unknown (a promotion committee rather than one person, for instance), draft toward the most likely shared priorities of that group rather than defaulting to a single-person framing — the prompt still works, but {{DECISION_MAKER}} should describe the group's likely concerns collectively.

## Changelog
- 1.0.0 (2026-09-01): Initial version.

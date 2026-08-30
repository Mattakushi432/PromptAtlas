---
id: 30-60-90-day-onboarding-plan-builder
title: 30-60-90 Day Onboarding Plan Builder
category: career-and-hr
tags: [onboarding, management, planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Builds a structured 30-60-90 day onboarding plan for a new hire from role notes and team context — a planning tool for a hiring manager, with concrete milestones and checkpoints per phase, not a generic checklist template with the role name swapped in.

## When to use it
- You have a new hire starting soon and want a real plan tailored to their specific role and team, not a copy-pasted generic template.
- Your team's onboarding has been inconsistent across hires, and you want a repeatable structure to adapt per role going forward.
- You're a new hire yourself and want to draft your own 30-60-90 plan to propose to your manager, showing initiative and clarifying expectations early.

## The Prompt

```
You build a 30-60-90 day onboarding plan for a new hire, tailored to their specific role and team context. You do not produce a generic checklist that would apply to any role — every milestone should be grounded in what this specific role and team actually need.

Role: {{ROLE}}
Team/company context: {{TEAM_CONTEXT}}
Key early priorities: {{PRIORITIES}}
Who they'll work with: {{KEY_COLLABORATORS}}

Instructions:
1. Structure the plan across three phases with a distinct theme each: Days 1-30 (learn: understand systems, team, and context — minimal independent output expected), Days 31-60 (contribute: start doing real work with support, on lower-stakes or well-scoped tasks), Days 61-90 (own: take ownership of a specific area or project with reduced oversight).
2. For each phase, give 3-5 concrete milestones specific to {{ROLE}} and {{PRIORITIES}} — not generic ("meet the team," "get comfortable with tools") unless genuinely tailored (e.g. "shadow the on-call rotation once" is specific; "get comfortable with tools" is not).
3. Include specific check-in points with {{KEY_COLLABORATORS}} at natural moments (e.g. end of week 1, end of day 30) rather than only at the phase boundaries — frequent early check-ins catch misalignment before it compounds.
4. For each phase, note what a manager should be watching for as a signal of on-track vs. off-track progress — this makes the plan useful for the manager checking in, not just the new hire following steps.
5. If {{PRIORITIES}} conflicts with the standard learn/contribute/own progression (e.g. an urgent priority needs real contribution in week 2), flag that explicitly and adjust the phase boundaries rather than forcing a rigid 30/60/90 split that doesn't fit the actual situation.
6. Keep milestones achievable and specific enough to be a real checkpoint (something that's either done or not) rather than an ongoing vague goal ("build relationships") without a concrete marker.

Output format: Markdown with `## Days 1-30`, `## Days 31-60`, `## Days 61-90` sections, each with milestones, check-in points, and manager signals to watch for.
```

## Variables
- `{{ROLE}}` — the job title and a brief description of core responsibilities. Required.
- `{{TEAM_CONTEXT}}` — team size, how the team works, what tools/systems are core to the role. Required — genericness comes from skipping this.
- `{{PRIORITIES}}` — the specific things this hire needs to be productive on early (a project, a system, a relationship to build). Required.
- `{{KEY_COLLABORATORS}}` — who they'll need to check in with or learn from (manager, specific teammates, cross-functional partners). Required.

## Example
**Input:** `{{ROLE}}` = "Backend Engineer joining the payments team" · `{{TEAM_CONTEXT}}` = "5-person team, owns the payment processing service, uses a specific internal deploy pipeline" · `{{PRIORITIES}}` = "Get up to speed on the payment reconciliation system, which is about to need a rework" · `{{KEY_COLLABORATORS}}` = "Manager, the one engineer who built the original reconciliation system, the finance team stakeholder"

**Output (excerpt):**
```
## Days 1-30
- Milestone: Complete a guided walkthrough of the payment processing service architecture with the engineer who built the reconciliation system.
- Milestone: Ship one small, well-scoped fix in the reconciliation codebase (with pairing/review) to get familiar with the deploy pipeline without high stakes.
- Check-in: End of week 1 with manager — initial impressions, any blockers getting environment set up.
- Manager signal: By day 30, can explain the reconciliation system's data flow back in their own words without prompting — if not, more pairing time is needed before contribute-phase work begins.

## Days 31-60
...
```

## Tips & Variations
- If the new hire is drafting their own plan to propose upward, frame the check-ins as "I'll check in with you at these points" rather than passive milestones — makes the plan feel proactive rather than a request for hand-holding.
- For a role with a probation/ramp period tied to a different timeline (e.g. 90 days isn't the actual milestone that matters), adjust the phase lengths to match — the learn/contribute/own structure generalizes even if the day counts don't stay 30/60/90.
- Revisit the plan at each phase boundary rather than treating it as fixed on day 1 — priorities shift, and a plan that isn't updated becomes a checklist nobody follows.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

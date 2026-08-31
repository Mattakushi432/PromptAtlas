---
id: okr-draft-to-critique-pass
title: OKR Draft-to-Critique Pass
category: business-and-strategy
tags: [okr, strategy, planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Critiques a drafted set of OKRs (Objectives and Key Results) for the specific structural flaws that make OKRs useless in practice — key results that are actually tasks in disguise, objectives with no clear owner, and key results that can be "achieved" without moving the objective at all — rather than a generic "OKRs should be SMART" pass.

## When to use it
- You've drafted OKRs for a team or company and want a rigorous check before they're finalized and cascaded down to sub-teams.
- A team's OKRs consistently get marked "achieved" but the underlying objective clearly didn't happen, and you want to find where the key results decoupled from the actual goal.
- You're reviewing OKRs written by someone else (a report, a peer team) and want a structured way to give useful feedback rather than a vague "these could be tighter."

## The Prompt

```
You critique a draft set of OKRs for structural flaws that make them fail in practice, not for generic SMART-goal wording issues.

Draft OKRs (objectives with their key results): {{DRAFT_OKRS}}
Team/scope these OKRs are for: {{SCOPE}}
Time period: {{PERIOD}}

Instructions:
1. For each key result, check whether it's actually a task/output ("launch feature X," "ship the redesign") rather than a measurable result of that work ("increase activation rate from 40% to 50%"). Flag task-disguised-as-KR explicitly — this is the single most common OKR failure mode, since a shipped feature that doesn't move the metric still gets marked "done."
2. For each key result, check whether it's actually achievable in a way that doesn't require the objective to be true — could someone technically hit this KR through a shortcut that doesn't serve the objective (e.g. "increase signups" hit via a low-quality acquisition channel that doesn't help retention)? Flag any KR with an easy "gaming" path.
3. Check each objective has key results that, if all achieved, would genuinely constitute the objective being achieved — not a loosely related set of activities that could all succeed while the objective itself remains unmet.
4. Check for missing ownership: does it require guessing who's accountable for a KR, or is it clear? An OKR with diffuse or unstated ownership rarely gets tracked.
5. Check key results are actually measurable with data the team can access on a reasonable cadence — a KR requiring data that's hard/slow to get will silently stop being tracked mid-period.
6. Given {{PERIOD}}, flag any objective that's too large to meaningfully progress within that timeframe (a multi-year initiative framed as a quarterly OKR) versus one that's trivially achievable regardless of effort (sandbagged).
7. For {{SCOPE}}, check whether these OKRs are actually within this team's control, or depend heavily on another team's work without that dependency being acknowledged.

Output format: Markdown. For each objective: list its key results, flag each specific issue found (or "no issues found" if genuinely solid), and propose a corrected version of any flawed key result. End with a one-paragraph overall verdict on whether this OKR set is ready to finalize.
```

## Variables
- `{{DRAFT_OKRS}}` — the draft objectives and their key results. Required.
- `{{SCOPE}}` — which team/org this is for, to assess ownership and control. Required.
- `{{PERIOD}}` — the time period these OKRs cover (a quarter, a half). Required — sizing/scope checks depend on this.

## Example
**Input:** `{{DRAFT_OKRS}}` = "Objective: Improve product onboarding. KR1: Launch the new onboarding flow. KR2: Write 5 new help-center articles." `{{SCOPE}}` = "Growth team" `{{PERIOD}}` = "Q4"

**Output (excerpt):**
```
### Objective: Improve product onboarding

**KR1: Launch the new onboarding flow** — Task disguised as a KR. Launching is an output, not a result; the flow could launch and still fail to improve onboarding. Corrected: "Increase Day-1 activation rate from X% to Y% for users who go through the new onboarding flow."

**KR2: Write 5 new help-center articles** — Same issue: an activity count, not a measurable outcome. It's also easily gameable (5 low-quality articles satisfy the KR without helping anyone). Corrected: "Reduce onboarding-related support ticket volume by X%" or "Increase self-serve resolution rate for onboarding questions to Y%," whichever is the actual intended effect of writing the articles.

**Overall verdict:** Not ready to finalize. Both key results are outputs rather than outcomes, meaning this objective could be marked "achieved" (flow launched, articles written) while onboarding itself doesn't measurably improve. Rewrite both KRs around the actual metric the objective is meant to move before finalizing.
```

## Tips & Variations
- Pair with `strategic-decision-pre-mortem` (business-and-strategy, already shipped) once OKRs pass this structural critique — that prompt stress-tests a specific decision or initiative for how it could fail, useful for the highest-risk objective in the set once the OKRs themselves are well-formed.
- If {{DRAFT_OKRS}} includes company-level OKRs that sub-team OKRs are meant to cascade from, run this prompt on the company-level set first — structural flaws at the top compound as they cascade down.
- This prompt won't tell you whether the objective itself is the right strategic priority — it only checks whether the OKRs as written would actually measure and drive that objective. Pair with a separate strategic-prioritization pass if the objective's importance itself is in question.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

---
id: risk-register-builder
title: Risk Register Builder
category: business-and-strategy
tags: [risk-management, strategy, planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Builds a structured risk register (risk description, likelihood, impact, mitigation, owner) from a plan or project description — surfaces risks the plan itself implies, distinct from a generic risk checklist: it reasons from the specific plan given, not a boilerplate list of common business risks.

## When to use it
- You're kicking off a project/initiative and want to surface risks systematically before they surface themselves mid-execution.
- Leadership wants a documented risk register for a specific plan (a launch, an expansion, a major process change) rather than a generic template.
- You want to check an existing plan for risks you may have missed by reasoning through it from an outside perspective.

## The Prompt

```
You build a risk register from a plan or project description. You identify risks that plausibly follow from the specific details of this plan — you do not paste in a generic list of common business risks unconnected to what's actually described.

Plan/project description: {{PLAN}}
Timeline: {{TIMELINE}}
Known constraints (budget, team, dependencies): {{CONSTRAINTS}}

Instructions:
1. Identify risks by reasoning through the plan's actual dependencies, assumptions, and sequencing — for each risk, state which specific part of the plan it comes from, not a generic category label alone.
2. For each risk, assess likelihood (Low/Medium/High) and impact (Low/Medium/High) based on what's stated in {{PLAN}}/{{CONSTRAINTS}} — if there isn't enough information to assess one honestly, say `Unclear — needs more input` rather than defaulting to Medium as a placeholder.
3. Propose a specific mitigation for each risk, not a generic one ("monitor closely" isn't a mitigation) — the mitigation should be something concretely actionable given the plan's actual resources per {{CONSTRAINTS}}.
4. Suggest an owner role (not necessarily a named person) for each risk based on who in the plan would realistically be positioned to monitor/act on it.
5. Sort the register by likelihood × impact (highest first) so the highest-priority risks are immediately visible, not buried in a list ordered by when they occur to the reader.
6. If {{TIMELINE}} is aggressive relative to what {{PLAN}} describes, flag timeline risk explicitly as its own entry — schedule risk is one of the most commonly under-documented risk types precisely because it's uncomfortable to name.
7. Do not pad the register to look thorough — 5-8 well-reasoned, plan-specific risks are more useful than 20 generic ones diluting the signal.

Output format: a Markdown table with columns Risk | Likelihood | Impact | Mitigation | Owner, sorted by priority, followed by a one-line note on any risk you couldn't confidently assess.
```

## Variables
- `{{PLAN}}` — the plan or project description, as detailed as available. Required.
- `{{TIMELINE}}` — the planned schedule/deadlines. Required — used for the timeline-risk check.
- `{{CONSTRAINTS}}` — known limits (budget, team size, external dependencies). Required — without this, mitigations default to generic rather than realistic given actual resources.

## Example
**Input:** `{{PLAN}}` = "Launching a new product line in a new geographic market within 4 months, relying on a single local distribution partner we haven't worked with before." `{{TIMELINE}}` = "4 months to launch" `{{CONSTRAINTS}}` = "Small team, no local legal counsel yet, budget locked"

**Output (excerpt):**
```
| Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|
| Single new distribution partner underperforms or the relationship breaks down, with no backup channel | Medium | High | Establish clear performance checkpoints in the partner agreement within the first 30 days, and scope (even informally) what a fallback distribution option would look like before launch, not after a problem emerges. | Partnerships lead |
| No local legal counsel in place before a new-market launch that likely has local regulatory requirements | Medium | High | Engage local counsel for at least a compliance review before launch, even if full ongoing counsel isn't budgeted — a locked budget doesn't mean zero spend is possible for a one-time review. | Legal/Ops |
| 4-month timeline relative to a first-time market entry with a new, untested partner | High | Medium | Explicitly flagged: this is an aggressive timeline for a first market entry with an unproven partner relationship — consider whether a phased/soft launch reduces risk without abandoning the 4-month target. | Project lead |
...
```

## Tips & Variations
- Revisit the register at key milestones, not just once at kickoff — risks change as a plan executes, and a stale register gives false confidence.
- For a risk register that needs to go to a board or investor, this output is a strong starting draft, but pair with `tone-adapter` (writing-and-content) if the raw table needs a narrative summary alongside it for that audience.
- This prompt reasons only from what's given — for risks requiring real external data (market volatility, regulatory specifics), verify against actual sources rather than trusting a plausible-sounding but ungrounded risk entry.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

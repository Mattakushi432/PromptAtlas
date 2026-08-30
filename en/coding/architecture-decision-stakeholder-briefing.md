---
id: architecture-decision-stakeholder-briefing
title: Architecture Decision Briefing for Non-Technical Stakeholders
category: coding
tags: [architecture, communication, stakeholder-management]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Translates a technical architecture or system-design decision into business-tradeoff language for a non-technical stakeholder — an exec, a PM, or a customer. Distinct from `adr-drafter` (a formal record written for engineers) and `system-design-walkthrough-coach` (teaches an engineer through Socratic questions): this produces a short briefing for someone who won't read the technical reasoning.

## When to use it
- Briefing an exec or PM on a technical decision before they need to make a resourcing or timeline call informed by it.
- A customer or partner is asking "why does X work the way it does" and the honest answer is a technical tradeoff.
- Preparing talking points before a meeting where a technical decision will get non-technical pushback.

## The Prompt

```
You are translating a technical architecture decision into language a non-technical stakeholder can actually use to make a decision or understand an impact — not simplifying it into something inaccurate, and not writing a technical document.

Technical decision (the decision made and its technical reasoning — an ADR, design doc excerpt, or plain description): {{TECHNICAL_DECISION}}

Stakeholder concern (optional — what this person actually cares about: cost, timeline, risk, user experience): {{STAKEHOLDER_CONCERN}}

Produce a short briefing that:
1. States the decision and its consequences in terms of cost, timeline, risk, and user-facing impact — not implementation mechanics. If {{STAKEHOLDER_CONCERN}} is given, lead with that angle specifically.
2. Translates any technical tradeoff terms into concrete, accurate consequences a non-technical person would actually notice or care about — e.g., don't say "eventually consistent," say "a user might briefly see slightly outdated information for a few seconds after making a change, then it catches up" — accurate, not dumbed-down to the point of being wrong.
3. Anticipates the 2–3 questions this stakeholder would realistically ask next (about cost, risk, or timeline implications) and answers them preemptively in the briefing, rather than waiting to be asked.

If the decision genuinely has no meaningful business-facing consequence — it's a purely internal technical choice with no cost, timeline, risk, or user impact worth mentioning — say that plainly. "This doesn't change anything you'd notice, we made this choice for internal maintainability reasons" is itself a complete and useful briefing; don't manufacture stakeholder-relevant stakes that aren't really there.
```

## Variables
- `{{TECHNICAL_DECISION}}` — the decision and its technical reasoning. Required.
- `{{STAKEHOLDER_CONCERN}}` — what this specific stakeholder cares about most. Optional; without it, the briefing covers cost/timeline/risk/UX evenly.

## Example
**Input:** `{{TECHNICAL_DECISION}}` = "Decided to use an eventually-consistent replicated read model for the dashboard instead of querying the primary database directly, to keep dashboard load from impacting core transaction performance.", `{{STAKEHOLDER_CONCERN}}` = "a customer asked why their dashboard numbers sometimes lag behind actions they just took".

**Output (excerpt):**
```
Why dashboard numbers can lag briefly: we made a deliberate choice to have the dashboard read from a separate, slightly-delayed copy of the data rather than the live system that processes transactions. This means that right after a customer takes an action, the dashboard might take a few seconds — typically under 10 — to reflect it, rather than updating instantly.

Why we did this: querying the live transaction system directly for every dashboard view would compete for the same resources used to actually process customer transactions. Under heavy load, that risks slowing down the core product experience (transactions themselves) to make the dashboard feel slightly faster — we chose to protect the more critical path.

Anticipated questions:
- "Can we make this instant instead?" — Technically possible, but it would mean dashboard traffic directly competing with transaction processing for database resources, which is the exact tradeoff we were avoiding. It's a real option, but a costlier one (more infrastructure, more engineering time) that we'd want to scope deliberately, not one line of config.
- "Is this a bug?" — No, it's expected behavior by design, though we can consider whether a brief "updating..." indicator on the dashboard would make the lag feel intentional rather than confusing.
```

## Tips & Variations
- For a decision that's genuinely still being debated (not yet finalized), ask it to frame the output as "the tradeoff we're weighing" rather than "the decision we made," so it can double as a discussion aid, not just a fait-accompli briefing.
- Pair with `adr-drafter` — write the ADR for the engineering record first, then feed that ADR in as `{{TECHNICAL_DECISION}}` to generate the stakeholder version from it.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

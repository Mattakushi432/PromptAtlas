---
id: post-acquisition-integration-milestone-planner
title: Post-Acquisition Integration Milestone Planner
category: business-and-strategy
tags: [due-diligence, planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Sequences the first 100 days of integration work after an acquisition closes — systems integration, team and culture integration, customer communication, and retention-critical early actions — the post-close counterpart to `due-diligence-question-list-generator` (business-and-strategy, already shipped)'s pre-close scope: that prompt generates the questions to ask before a deal closes, this one plans the actual work once it has.

## When to use it
- A deal has just closed or is about to, and you need a concrete first-100-days integration plan rather than a vague "we'll figure out integration as we go" approach that risks losing the customers, employees, or momentum the deal was meant to preserve.
- You're reviewing an existing integration plan and want to check it actually sequences retention-critical actions early enough, rather than defaulting to whatever's operationally easiest to do first.
- You've been through a poorly-integrated acquisition before and want a structured plan that explicitly addresses what went wrong last time (key people leaving, customers churning during the transition, systems integration dragging on with no clear milestones).

## The Prompt

```
You plan the first 100 days of post-acquisition integration work. You sequence actions by what's actually time-sensitive for retention (people and customers) versus what can follow at a more deliberate pace (full systems integration) — you do not default to a purely operational/systems-first sequence that risks losing the people and customers the deal depends on while integration work happens in the background.

Deal context (what was acquired, why, and what the acquirer is trying to preserve/gain): {{DEAL_CONTEXT}}
Key retention risks identified (specific people, customer segments, or capabilities at risk of leaving/churning during integration): {{RETENTION_RISKS}}
Systems/operational integration scope (what actually needs to be combined — tech stack, processes, reporting lines): {{INTEGRATION_SCOPE}}

Instructions:
1. Sequence retention-critical actions in the first 1-2 weeks, not later — for each risk named in {{RETENTION_RISKS}}, plan the specific early action that addresses it (a direct conversation with a flight-risk key employee about their role and incentives, a customer communication clarifying what will and won't change for them) — waiting until systems integration is further along to address retention risk is a common sequencing mistake that lets the risk materialize before it's addressed.
2. For culture/team integration, plan specific early actions beyond a generic "welcome" — a joint kickoff is not itself an integration plan; specify what changes for the acquired team's day-to-day work in the first month (reporting lines, tools, meeting cadence) so ambiguity doesn't fill the vacuum where clarity should be.
3. For customer communication, plan the specific message and timing given {{DEAL_CONTEXT}} — customers of the acquired company need to hear what changes and what doesn't, ideally before they hear it from a less controlled source (a competitor, industry press, a worried account rep); state the recommended timing relative to close, not just that communication should happen "early."
4. For {{INTEGRATION_SCOPE}}, sequence systems/operational work realistically — not everything needs to happen in the first 100 days, and forcing a full technical integration onto an aggressive timeline is a common source of the exact operational disruption that damages the retention outcomes step 1 and 2 were trying to protect. Identify what's genuinely urgent (security/access risks from running two separate systems, for instance) versus what can follow a more measured timeline.
5. Flag any dependency between the retention actions and the systems actions — e.g. a promised change to a key employee's role might depend on an org-structure decision that also affects systems integration scope, and sequencing one without accounting for the other risks contradicting a commitment already made.
6. Build in a specific checkpoint (30/60/90 days) to actually assess whether the retention risks in {{RETENTION_RISKS}} materialized despite the plan — an integration plan that doesn't check its own retention assumptions against reality can't catch a flight risk that's still developing until it's too late to act on it.

Output format: Markdown with sections: Week 1-2 (Retention-Critical), Days 15-30 (Team/Culture), Customer Communication (with specific timing), Systems Integration Sequence (urgent vs. deferred), Cross-Dependencies, and 30/60/90-Day Checkpoints.
```

## Variables
- `{{DEAL_CONTEXT}}` — what was acquired and what the acquirer is actually trying to preserve or gain from the deal. Required — integration priorities depend on what the deal was actually for.
- `{{RETENTION_RISKS}}` — specific people, customer segments, or capabilities identified as at risk during the transition. Required — without named risks, retention actions can't be targeted.
- `{{INTEGRATION_SCOPE}}` — what systems/processes/reporting structures actually need to be combined. Required.

## Example
**Input:** `{{DEAL_CONTEXT}}` = "Acquired a 12-person data analytics team primarily to gain their specific ML expertise and their existing enterprise customer relationships; not primarily for their tech stack, which will likely be sunset eventually" `{{RETENTION_RISKS}}` = "Two senior ML engineers are the primary reason for the acquisition and have competing offers elsewhere; the acquired company's 3 largest customers have close relationships with the founding team specifically" `{{INTEGRATION_SCOPE}}` = "Eventually migrate off their tech stack onto the acquirer's platform; combine reporting lines into the acquirer's engineering org"

**Output (excerpt):**
```
### Week 1-2 (Retention-Critical)
Direct 1:1 conversations with both senior ML engineers within the first week — not a group announcement, individual conversations addressing their specific role, autonomy, and any retention incentives directly, since {{RETENTION_RISKS}} names them as the deal's core rationale and they have competing offers. This cannot wait for the broader integration plan to take shape.
Direct outreach from the founding team (not a generic company announcement) to the 3 largest customers, reassuring continuity of the relationship — given {{RETENTION_RISKS}} specifically flags the founder-customer relationship as the retention risk, the founders themselves should be visibly involved in this outreach, not delegated to an account management team the customers don't yet know.

### Days 15-30 (Team/Culture)
Clarify reporting lines for the 12-person team explicitly — per {{INTEGRATION_SCOPE}}, they'll eventually report into the acquirer's engineering org, but the first-month plan should specify an interim structure (who they report to now, whether team identity/autonomy is preserved short-term) rather than leaving this genuinely ambiguous while the org-structure decision is finalized, since ambiguity here directly compounds the flight risk named in step 1.

### Customer Communication
Given {{DEAL_CONTEXT}}'s specific retention risk around the founder-customer relationship, recommend communication timing at announcement (not delayed) with the founders directly involved — a delayed or founder-absent communication increases the risk that customers hear about the change from another source first and interpret the silence as instability.

### Systems Integration Sequence
Urgent (first 100 days): access/security consolidation — ensure the acquired team isn't left on separately-managed credentials/access longer than necessary, a common security gap during integration.
Deferred (beyond 100 days): the full tech-stack migration per {{INTEGRATION_SCOPE}} — given {{DEAL_CONTEXT}} states the tech stack itself wasn't the acquisition rationale, forcing this onto an aggressive 100-day timeline risks disrupting the ML engineers' actual work during the exact period retention is most fragile. Deliberately sequence this later.

### Cross-Dependencies
The interim reporting-line clarity promised in Days 15-30 depends on the org-structure decision — if that decision is still pending, say so explicitly to the team rather than making a commitment that later needs walking back, which would compound the exact ambiguity risk being addressed.

### 30/60/90-Day Checkpoints
Day 30: confirm both flagged ML engineers are still engaged (not just "hasn't quit yet" — an actual conversation about how the transition is landing for them). Day 60: check whether the 3 key customer relationships have stabilized post-outreach. Day 90: assess whether the interim reporting structure needs to become permanent or was genuinely a placeholder.
```

## Tips & Variations
- Pair with `due-diligence-question-list-generator` (business-and-strategy, already shipped) before close — the retention risks and integration scope this prompt plans around should ideally be identified during diligence, not discovered for the first time after the deal has already closed.
- If {{RETENTION_RISKS}} wasn't seriously assessed before close, that's worth naming as a gap in the integration plan itself, since a plan built on an incomplete risk picture will systematically under-prioritize retention actions for risks nobody named.
- For a much smaller or much larger acquisition than this prompt's default scope assumes, adjust the timeline proportionally — a 3-person acqui-hire needs a lighter version of this same sequencing logic, while a large, multi-country acquisition needs the same priorities stretched over a longer, more complex timeline rather than compressed into literally 100 days.

## Changelog
- 1.0.0 (2026-09-01): Initial version.

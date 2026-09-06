---
id: job-description-drafter-from-role-requirements
title: Job Description Drafter from Role Requirements
category: career-and-hr
tags: [job-descriptions, hr]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-01
---

## Description
Drafts a complete job description from a hiring manager's raw notes on what the role actually needs — distinct from `job-description-bias-auditor` (career-and-hr, backlog, community-reserved issue #11), which critiques an existing JD for biased language rather than generating one from scratch; this prompt is the generation counterpart, producing the first draft a bias audit would later review.

## When to use it
- A hiring manager has given you rough notes on a role (responsibilities, must-haves, team context) and you need an actual, postable job description structured properly, not a reformatted bullet dump.
- You're drafting a new role from scratch and want a starting structure that separates genuine requirements from nice-to-haves, since JDs that list everything as required scare off qualified candidates who don't check every box.
- You want to check whether the raw requirements as given would actually produce a postable JD, or whether something essential (level, comp range signal, location/remote policy) is missing before drafting.

## The Prompt

```
You draft a complete job description from a hiring manager's raw role requirements. You separate genuine must-haves from nice-to-haves — you do not inflate every mentioned skill into a hard requirement, since an inflated requirements list narrows the candidate pool without improving hire quality.

Raw role notes (responsibilities, context, requirements as given): {{ROLE_NOTES}}
Level/seniority: {{LEVEL}}
Team/company context relevant to the JD: {{TEAM_CONTEXT}}

Instructions:
1. Draft a role summary (2-3 sentences) that states what the person will actually do and why the role exists — not a generic mission-statement paragraph that could describe any role at any company.
2. Draft responsibilities as concrete, specific statements of what the person will do, not vague categories — "own the design and delivery of X system" rather than "responsible for engineering tasks."
3. Separate requirements into Required and Preferred based on {{ROLE_NOTES}} — if {{ROLE_NOTES}} lists everything with equal weight, flag which items genuinely gate the hire (the role is unworkable without them) versus which are a bonus, and ask for confirmation if it's unclear which category something belongs in rather than guessing and defaulting everything to required.
4. Check for a common JD failure: requiring a specific number of years of experience as a proxy for a skill level — if {{ROLE_NOTES}} states a years requirement, check whether it's actually gating for a skill/capability that could be stated more directly (avoiding excluding a qualified candidate who reached the same capability faster, or through a different path).
5. Flag anything essential for a postable JD that {{ROLE_NOTES}} doesn't mention: compensation range or a note on why it's omitted, remote/hybrid/onsite policy, and reporting structure — these are commonly missing from raw hiring-manager notes but expected by candidates and increasingly required by law in some jurisdictions.
6. Keep language plain and specific rather than reaching for buzzwords ("rockstar," "ninja," "wear many hats" as an unexplained catch-all) — these read as vague to serious candidates and don't communicate real information about the role.

Output format: Markdown with standard JD sections: Role Summary, Responsibilities, Requirements (Required / Preferred split), and a "Missing from notes" list of anything flagged in step 5 that needs hiring-manager input before posting.
```

## Variables
- `{{ROLE_NOTES}}` — the hiring manager's raw notes on the role. Required.
- `{{LEVEL}}` — the seniority/level of the role, since this affects both tone and what counts as a reasonable requirement. Required.
- `{{TEAM_CONTEXT}}` — relevant context about the team/company that should inform the JD (team size, what the role reports into, notable context a candidate would want). Optional, but improves specificity.

## Example
**Input:** `{{ROLE_NOTES}}` = "Need someone to own our data pipeline reliability. Should know Python, Airflow, some SQL. 5+ years experience. Nice if they've worked with Kafka. Team is 4 people, growing." `{{LEVEL}}` = "Senior Data Engineer" `{{TEAM_CONTEXT}}` = "Reports to Head of Data, team of 4 currently, hiring to support scaling to more data sources"

**Output (excerpt):**
```
### Role Summary
We're hiring a Senior Data Engineer to own the reliability of our data pipelines as we scale to support significantly more data sources. You'll work closely with a 4-person data team reporting to our Head of Data, with direct ownership over pipeline architecture and incident response.

### Requirements
**Required:**
- Strong proficiency in Python and SQL
- Production experience with Airflow (or a comparable orchestration tool) — {{ROLE_NOTES}}'s "5+ years experience" is better expressed as this specific capability requirement; flagging for confirmation whether 5+ years is a hard cutoff or a rough proxy for this level of hands-on orchestration experience.

**Preferred:**
- Experience with Kafka or similar streaming/messaging systems

### Missing from notes
No compensation range or note on why it's omitted — flag for hiring manager before posting, since many candidates now expect this and it may be legally required depending on jurisdiction. No remote/hybrid/onsite policy stated.
```

## Tips & Variations
- Pair with `job-description-bias-auditor` (career-and-hr, backlog — community issue [#11](https://github.com/Mattakushi432/PromptAtlas/issues/11)) once that prompt is drafted — this one produces the first draft; that one would review it for biased or exclusionary language before posting.
- If {{ROLE_NOTES}} genuinely can't distinguish required from preferred for a specific item, don't force a split — flag it explicitly as needing hiring-manager clarification rather than guessing, since miscategorizing a nice-to-have as required directly shrinks the qualified applicant pool.
- For a role being posted in multiple markets/jurisdictions, note that compensation-range disclosure requirements vary — flag this as a legal-check item rather than assuming one jurisdiction's convention applies everywhere.

## Changelog
- 1.0.0 (2026-09-01): Initial version.

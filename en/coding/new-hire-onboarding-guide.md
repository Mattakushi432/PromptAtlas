---
id: new-hire-onboarding-guide
title: New Hire Onboarding Guide
category: coding
tags: [documentation, onboarding, team-process]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Generates a new-hire onboarding guide for a specific repository — dev environment setup, codebase orientation, team practices — broader than a README's quick-start scope. For preparing a real onboarding document, not a generic "how to onboard engineers" template.

## When to use it
- A new engineer is joining and there's no structured onboarding doc, or the existing one is stale.
- Standardizing onboarding across a growing team so ramp-up doesn't depend entirely on tribal knowledge from whoever happens to be free that week.
- Auditing whether current onboarding materials actually cover what a new hire needs in their first week.

## The Prompt

```
You write a new-hire onboarding guide for a specific repository/team — a first-week document, not a full architecture reference.

Repository/codebase description (what it does, tech stack, architecture at a high level): {{REPO_DESCRIPTION}}
Dev environment setup steps (the actual commands/tools needed): {{SETUP_STEPS}}
Team practices (optional — code review process, deployment cadence, communication norms, on-call if relevant): {{TEAM_PRACTICES}}
Existing onboarding doc to revise, if any (optional): {{EXISTING_DOC}}

Instructions:
1. Order content by what a new hire actually needs in sequence: environment setup and getting the codebase running first (before anything else matters), then a codebase orientation (major components, where to find things), then team process (how code review/deployment actually works here), then where to go for help.
2. Write setup steps as exact, runnable commands with expected outcomes at each step ("you should now see X") so a new hire can self-diagnose when something doesn't match, rather than a wall of prose.
3. For codebase orientation, don't attempt to explain everything — cover the handful of concepts/components that unlock understanding the rest (the core domain model, the main request flow, where business logic lives vs. where it doesn't) rather than an exhaustive file-by-file tour.
4. Include a concrete first task or two if inferable (a "good first issue" type suggestion, or a specific small area to make a first small change in) — an onboarding guide that ends at "now you're set up" without a next step wastes the momentum of day one.
5. Document team practices as specific, actionable norms ("PRs need one approval before merge, use the #eng-reviews channel to ping for review") rather than vague statements ("we value code quality").
6. Note who/where to ask for help for different kinds of questions (a specific Slack channel, a specific person's area of expertise) rather than a generic "ask if you have questions."
7. If {{EXISTING_DOC}} is provided, preserve accurate parts and flag/correct anything stale, rather than a full rewrite from scratch.

Output format: Markdown with sections: Environment Setup, Codebase Orientation, Team Practices, Getting Help, Suggested First Task.
```

## Variables
- `{{REPO_DESCRIPTION}}` — what the codebase does and its architecture at a high level. Required.
- `{{SETUP_STEPS}}` — the actual dev environment setup commands. Required.
- `{{TEAM_PRACTICES}}` — how the team actually works (review, deploy, communication). Optional but significantly improves real-world usefulness.
- `{{EXISTING_DOC}}` — a current onboarding doc to revise. Optional.

## Example
**Input:** `{{REPO_DESCRIPTION}}` = "a Django monolith backing an e-commerce site, with a separate React frontend repo", `{{SETUP_STEPS}}` = "docker-compose up, then python manage.py migrate && python manage.py runserver", `{{TEAM_PRACTICES}}` = "PRs need 1 approval, deploys happen automatically on merge to main via CI".

**Output (excerpt):**
```markdown
## Environment Setup
1. `docker-compose up` — starts Postgres and Redis. You should see both services log "ready to accept connections" within ~30 seconds.
2. `python manage.py migrate` — applies the database schema. Expect a list of migration names scrolling by with no errors.
3. `python manage.py runserver` — starts the app at http://localhost:8000. You should see the login page.

## Codebase Orientation
The core domain model lives in `apps/orders/models.py` and `apps/inventory/models.py` — start there rather than trying to read every app. Business logic for pricing/discounts is centralized in `apps/orders/services/pricing.py`, not scattered across views — if you're looking for "where does X get calculated," check there first.

## Team Practices
- PRs require 1 approval before merge.
- Merging to `main` triggers an automatic production deploy via CI — there's no separate manual deploy step, so a merged PR is live within minutes.
```

## Tips & Variations
- For a distributed/remote team, add a section on communication norms specifically (response-time expectations, which channels are synchronous vs. async) since this is often the biggest unstated assumption new hires trip on.
- If the team runs a structured onboarding buddy/mentor program, note where the human-guided parts fit relative to this self-serve document, so the guide doesn't duplicate what the buddy is expected to cover conversationally.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

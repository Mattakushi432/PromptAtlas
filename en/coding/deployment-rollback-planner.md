---
id: deployment-rollback-planner
title: Deployment Rollback Planner
category: coding
tags: [devops, deployment, incident-response]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Generates a specific, step-by-step rollback plan for a specific deployment change — code, config, or infra — before it ships, so a rollback isn't improvised during an incident. Distinct from `safe-migration-script-writer` (database-specific) and `pre-merge-risk-assessment` (general risk level, not a step-by-step plan).

## When to use it
- Preparing to deploy a change with any risk of needing to roll back, and wanting the rollback procedure written down before deploying, not figured out under pressure during an incident.
- A deployment is coupled with other changes (a migration, a config flag, a third-party integration) where "just revert the code" isn't a complete rollback.
- Writing a runbook entry for a recurring type of deployment so the rollback procedure doesn't need to be reinvented each time.

## The Prompt

```
You write a specific, step-by-step rollback plan for a deployment — assume it needs to be followed by someone under time pressure during an incident, not read as a general policy document.

Deployment description (what's changing — code, config, infra, feature flag): {{DEPLOYMENT_DESCRIPTION}}
Coupled changes (optional — e.g. "this deploy also requires a DB migration", "a config flag must flip at the same time"): {{COUPLED_CHANGES}}
Deployment tooling (optional — e.g. "Kubernetes with ArgoCD", "a simple CI/CD pipeline with a deploy script"): {{DEPLOY_TOOLING}}

Instructions:
1. State the specific rollback mechanism for the primary change: a `kubectl rollout undo`, a previous container image tag to redeploy, a feature flag flip back to off, a Terraform revert and re-apply — the exact command or action, not "revert the deployment."
2. If {{COUPLED_CHANGES}} includes anything not trivially reversible (a database migration, a message queue schema change, a third-party API state change), address it explicitly: can it be rolled back cleanly, or does the rollback plan need to account for forward-compatibility instead (the old code must keep working against the new schema/state, because the migration itself can't be undone)?
2a. If a coupled change genuinely can't be undone, say so plainly and describe the actual mitigation (e.g., "the migration is one-way; if a rollback is needed, the previous code version must be confirmed compatible with the new schema before rolling back — verify this BEFORE deploying, not during the incident").
3. Specify the verification steps to confirm the rollback actually worked — not just "deploy the old version," but what to check afterward (error rates back to baseline, a specific health check passing, a canary metric recovering) and how long to wait before declaring the rollback successful.
4. Note any manual step that can't be automated (clearing a cache, notifying a downstream team, manually reverting a config value in a dashboard) since these are the steps most likely to be forgotten under pressure.
5. State the rollback's own risk: is rolling back itself completely safe, or does it have side effects (e.g., in-flight requests processed by the new version but not the old one, causing a brief inconsistency)? Don't present rollback as risk-free if it isn't.
6. If {{DEPLOY_TOOLING}} is provided, use its actual mechanism (specific commands/UI steps) rather than a generic description.

Output format: Markdown with sections: Rollback Trigger Criteria (when to actually roll back, briefly), Rollback Steps (numbered, in order), Verification, Known Limitations.
```

## Variables
- `{{DEPLOYMENT_DESCRIPTION}}` — what's being deployed. Required.
- `{{COUPLED_CHANGES}}` — anything that must change alongside the primary deployment. Optional but critical when present — this is the most common source of an incomplete rollback plan.
- `{{DEPLOY_TOOLING}}` — the actual deployment mechanism/platform. Optional but makes the plan directly executable rather than generic.

## Example
**Input:** `{{DEPLOYMENT_DESCRIPTION}}` = "new checkout flow behind a feature flag, deployed via Kubernetes", `{{COUPLED_CHANGES}}` = "a new required field was added to the orders table via a backward-compatible migration (nullable) before this deploy", `{{DEPLOY_TOOLING}}` = "Kubernetes with a standard deploy pipeline".

**Output (excerpt):**
```
## Rollback Steps
1. Flip the `new-checkout-flow` feature flag back to `false` in the flag management system — this is the fastest mitigation and doesn't require a redeploy, so do this FIRST if the issue is isolated to the new flow's logic.
2. If the issue isn't resolved by the flag flip (e.g., a crash in code that runs regardless of the flag), roll back the deployment: `kubectl rollout undo deployment/checkout-service`.

## Known Limitations
The orders table migration (new nullable field) is NOT rolled back by this procedure — it's backward-compatible by design, so the old code version continues to work fine with the new schema (it simply ignores the new nullable field). No migration rollback is needed or should be attempted.
```

## Tips & Variations
- For a deployment with no feature flag (a straight code deploy), the plan simplifies to steps 2+ only — don't force a flag-flip step that doesn't exist.
- Feed the output into the team's incident runbook template if it has one, so this rollback plan is discoverable during an actual incident rather than living only in a PR description.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

---
id: disaster-recovery-plan-drafter
title: Disaster Recovery Plan Drafter
category: coding
tags: [disaster-recovery, infrastructure, documentation]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Drafts an RTO/RPO-driven disaster recovery plan for a described system — a runnable step-by-step recovery procedure with named responsible roles, not just a backup policy statement. Distinct from `backup-restore-drill-planner` (coding, already shipped), which plans a drill to *test* an existing backup/restore mechanism, and `deployment-rollback-planner` (coding, already shipped), which handles rolling back a bad application deploy rather than recovering from infrastructure loss, data corruption, or a regional outage.

## When to use it
- You're building a new critical system and need a first-draft DR plan before an audit or compliance requirement forces the question.
- Your organization has backups and replication in place but no actual written recovery procedure — if the primary region went down right now, no one has a step-by-step document to follow.
- You're revising an existing DR plan after a near-miss or after infrastructure changed (new database, new region, new dependency) that the old plan doesn't account for.

## The Prompt

```
You draft a disaster recovery plan for the described system, built around explicit recovery objectives and a runnable recovery procedure.

System description (components, data stores, current region/deployment topology): {{SYSTEM_DESCRIPTION}}
Existing backup/replication mechanisms already in place: {{EXISTING_BACKUP_STRATEGY}}
Business-stated tolerance for downtime and data loss, if already defined: {{RTO_RPO_TARGETS}}

Instructions:
1. If {{RTO_RPO_TARGETS}} isn't provided, propose a reasonable RTO (recovery time objective) and RPO (recovery point objective) based on the system's described criticality, and flag explicitly that these need business sign-off — don't silently assume acceptable downtime/data-loss numbers for a system you don't have full context on.
2. Enumerate the specific disaster scenarios this plan covers (e.g. full region outage, primary database corruption, accidental mass-deletion, ransomware/compromise) — a single generic "disaster recovery" procedure that doesn't distinguish these often fails in practice because the correct response differs by scenario.
3. For each scenario, check whether {{EXISTING_BACKUP_STRATEGY}} can actually meet the RPO from item 1 — e.g. nightly backups cannot meet a 1-hour RPO regardless of how good the restore procedure is; call this out as a gap to close, not something the plan can paper over.
4. Write the step-by-step recovery procedure for the most severe scenario (typically full region/primary loss) as an ordered, unambiguous checklist: detection/declaration criteria (who declares a disaster and based on what signal), failover or restore steps in order, verification steps to confirm the recovered system is actually correct (not just "up"), and the point at which normal operations resume.
5. Assign a named role (not necessarily a named person) to each major step — who declares the disaster, who executes the failover, who verifies data integrity, who communicates status to stakeholders — since an unowned step is a step that won't happen under pressure.
6. Note what this plan explicitly does NOT cover if the scope is narrower than "every possible disaster" (e.g. it covers infrastructure/data loss but not a security breach's forensic/legal response) — an overclaiming DR plan is worse than a scoped one that's honest about its limits.
7. Recommend a review/drill cadence (tied to `backup-restore-drill-planner`, coding, already shipped, for the actual test mechanics) so the plan doesn't go stale as the system evolves.

Output format: Markdown. Sections: RTO/RPO (stated or proposed, with the gap-vs-current-backup-strategy called out if any), Scenarios Covered, Recovery Procedure (numbered checklist with owner per step), Explicitly Out of Scope, Review Cadence.
```

## Variables
- `{{SYSTEM_DESCRIPTION}}` — the system's components, data stores, and current deployment topology (regions, redundancy already in place). Required.
- `{{EXISTING_BACKUP_STRATEGY}}` — what backup/replication mechanisms already exist (frequency, retention, cross-region or not). Required — the plan's realism depends entirely on what's actually possible given this.
- `{{RTO_RPO_TARGETS}}` — the business-stated acceptable downtime and data loss, if already defined. Optional — the prompt proposes reasonable defaults and flags them for sign-off if this is missing.

## Example
**Input:** `{{SYSTEM_DESCRIPTION}}` = "E-commerce order system: application servers in us-east-1, primary Postgres database (single-region, no read replica), Redis cache (ephemeral, rebuildable)." `{{EXISTING_BACKUP_STRATEGY}}` = "Nightly automated Postgres snapshot, retained 14 days, stored in the same region." `{{RTO_RPO_TARGETS}}` = "Not yet defined by the business."

**Output (excerpt):**
```
### RTO/RPO
Not yet defined — proposing RTO of 4 hours and RPO of 1 hour for a revenue-generating order system, pending business sign-off; these are draft targets, not agreed ones.

Gap: current nightly-only, same-region snapshot cannot meet a 1-hour RPO (up to 24 hours of order data could be lost) and cannot survive a full us-east-1 regional outage at all (backup lives in the same region as the primary). Closing this gap (cross-region backup replication, more frequent snapshots or WAL streaming) is a prerequisite for this plan to be more than aspirational.

### Recovery Procedure (full region outage scenario)
1. [Owner: on-call SRE] Declare disaster if us-east-1 is confirmed unreachable via [monitoring signal] for >10 minutes and status page confirms a regional AWS issue.
2. [Owner: on-call SRE] Provision application servers in the designated failover region using [IaC template reference].
3. [Owner: on-call SRE] Restore latest available Postgres snapshot into the failover region's database instance.
4. [Owner: engineering lead] Verify data integrity: row counts on key tables match expected range, spot-check the 10 most recent orders present in the snapshot against known-good values if available.
5. [Owner: engineering lead] Update DNS/traffic routing to point at the failover region.
6. [Owner: on-call SRE] Confirm application health checks pass and a synthetic test order completes successfully before declaring recovery complete.
7. [Owner: incident commander] Communicate resolution and known data-loss window to stakeholders.

### Explicitly Out of Scope
This plan covers infrastructure/data-loss recovery only — it does not cover a security-breach forensic or legal response, or Redis cache recovery (rebuildable, not a data-loss concern).

### Review Cadence
Quarterly review; run an actual restore drill per `backup-restore-drill-planner` (coding, already shipped) at the same cadence, since an untested restore step is not a validated one.
```

## Tips & Variations
- If {{EXISTING_BACKUP_STRATEGY}} reveals the RPO gap shown in the example, treat closing that gap as a prerequisite deliverable, not a footnote — a DR plan built on a backup strategy that structurally can't meet its own stated RPO is not actually a recovery plan, it's a description of how much will be lost.
- Use `backup-restore-drill-planner` (coding, already shipped) to design the actual test of the restore steps this plan specifies — this prompt drafts the plan and procedure; that one designs how to verify it actually works.
- For systems with multiple independent failure domains (e.g. separate databases per service in a microservices architecture), consider running this prompt once per critical data store rather than one plan that vaguely covers "the system," since recovery procedures and owners often differ meaningfully by component.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

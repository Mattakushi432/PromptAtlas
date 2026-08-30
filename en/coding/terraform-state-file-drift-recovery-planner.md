---
id: terraform-state-file-drift-recovery-planner
title: Terraform State File Drift Recovery Planner
category: coding
tags: [terraform, infrastructure-as-code, incident-response]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Plans a safe path to reconcile a corrupted or out-of-sync Terraform state file with real infrastructure — distinct from `iac-drift-detector` (coding, already shipped)'s focus on detecting ongoing code-vs-reality drift: this prompt handles the higher-stakes recovery scenario where the state file itself is broken, lost, or badly diverged, not routine drift monitoring.

## When to use it
- Your Terraform state file is corrupted, was accidentally deleted, or has diverged badly enough from real infrastructure that `terraform plan` shows an alarming, hard-to-interpret diff.
- You're recovering from a botched manual change made directly in the cloud console that Terraform doesn't know about, and need a safe path back to state accuracy without destroying real resources.
- You're about to run a risky state-modifying operation (`terraform import`, state surgery) and want a reviewed plan before touching production state, since state mistakes can be destructive and hard to reverse.

## The Prompt

```
You plan a safe recovery path to reconcile a corrupted or out-of-sync Terraform state file with real infrastructure. You prioritize not destroying or orphaning real resources above speed — every step must be reasoned about for its blast radius before being recommended.

Situation description: {{SITUATION}}
Current state file status: {{STATE_STATUS}}
Real infrastructure status (what actually exists, if known): {{REAL_INFRA_STATUS}}
Risk tolerance / constraints (maintenance window, can't-touch resources): {{CONSTRAINTS}}

Instructions:
1. Before proposing any state-modifying command, insist on a state file backup (or confirm one already exists) — `terraform state` operations can be destructive, and a backup is the single highest-leverage safety step available before any recovery action.
2. Classify the situation's actual scope: is state fully lost (needs full `terraform import` reconstruction), partially diverged (some resources need import/removal from state), or apparently corrupted but resources are all real and trackable (may be recoverable without touching real infrastructure at all)? The right approach differs substantially by which of these it actually is.
3. For any resource that exists in state but not in reality (or vice versa), propose the specific, minimal-blast-radius fix: `terraform state rm` for a resource that's in state but shouldn't be tracked (never `terraform destroy`, which would attempt to delete the real resource), or `terraform import` for a real resource missing from state — get this direction right, since applying the wrong one risks actually deleting real infrastructure.
4. Sequence the recovery steps so that no `terraform apply` runs against an unreconciled state — insist on running `terraform plan` after each reconciliation step and reviewing the diff before proceeding, rather than batching all fixes and applying once at the end blind.
5. Flag any step that would affect a resource listed in {{CONSTRAINTS}} as untouchable, and propose how to route around it (e.g. excluding that resource from the current recovery pass) rather than including it in a batch operation that could affect it.
6. If {{REAL_INFRA_STATUS}} is incomplete or uncertain, say so explicitly and recommend which specific commands (`terraform state list`, cloud provider CLI queries) would need to be run first to get enough certainty before proceeding — do not propose destructive-adjacent state operations based on assumed rather than confirmed infrastructure state.

Output format: Markdown, a numbered, sequential recovery plan, each step with: the specific command/action, what it does and does not affect, and a `terraform plan`-and-review checkpoint between steps that touch state. End with a `### Verification` section describing how to confirm state now matches reality.
```

## Variables
- `{{SITUATION}}` — what happened (state corrupted, deleted, manual out-of-band change, etc.). Required.
- `{{STATE_STATUS}}` — what's known about the current state file's contents/condition. Required.
- `{{REAL_INFRA_STATUS}}` — what's actually known to exist in the real infrastructure. Required — recovery planning depends heavily on how much of this is actually known versus assumed.
- `{{CONSTRAINTS}}` — any resources that must not be touched, maintenance windows, or risk tolerance notes. Required.

## Example
**Input:** `{{SITUATION}}` = "An engineer manually deleted and recreated an S3 bucket directly in the AWS console to fix an urgent issue, without going through Terraform" `{{STATE_STATUS}}` = "State still references the original bucket by its old resource ID" `{{REAL_INFRA_STATUS}}` = "New bucket exists with the same name but a different underlying resource ID; old bucket no longer exists" `{{CONSTRAINTS}}` = "Production bucket, cannot have any downtime, no maintenance window needed for read-only state operations"

**Output (excerpt):**
```
1. **Backup state first.** Confirm a state backup exists (or run `terraform state pull > backup.tfstate`) before any further action — this is non-negotiable given production is involved.
2. **Classify:** Partially diverged — one specific resource (the S3 bucket) is out of sync; the rest of state is presumed unaffected pending step 3's confirmation.
3. **Confirm scope:** Run `terraform state list` and compare against known real infrastructure to confirm no other resources were affected by the manual change beyond the bucket in question.
4. **Remove stale reference:** `terraform state rm aws_s3_bucket.this` — this only removes the old (now-nonexistent) bucket from Terraform's tracking; it does not attempt to delete anything, since the resource it refers to no longer exists.
   Checkpoint: run `terraform plan` — expect it to show a plan to *create* the bucket, since state no longer tracks it. Do NOT apply yet.
5. **Import the real resource:** `terraform import aws_s3_bucket.this <new-bucket-id>` — brings the actual current bucket under Terraform's tracking using its real, current resource ID.
   Checkpoint: run `terraform plan` again — expect little to no diff if the bucket's actual configuration matches what's declared in code; any remaining diff shows configuration drift beyond just the resource ID, which needs separate review before applying.
...

### Verification
After the plan shows no unexpected diff, `terraform state show aws_s3_bucket.this` should reflect the new bucket's actual attributes, confirming state and reality are reconciled without any apply having touched the live bucket.
```

## Tips & Variations
- For a full state loss (not just one resource), the same step 1 (backup, if anything is recoverable) and step 4-5 pattern (plan-checkpoint before any apply) still applies, just repeated across many more resources — consider scripting the `terraform import` calls if the scope is large, but keep the plan-and-review checkpoint before the first real `apply` regardless of scale.
- After any state recovery, it's worth a root-cause conversation about why the manual out-of-band change happened — a recovered state doesn't prevent the same drift from recurring if the underlying process gap (e.g. console access without a Terraform-first workflow) isn't addressed.
- This prompt plans the recovery; always have a second engineer review the plan before executing state-modifying commands against production, given how easily a wrong `state rm` vs. `destroy` choice can cause real data loss.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

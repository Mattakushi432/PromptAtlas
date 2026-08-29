---
id: iac-drift-detector
title: Infrastructure-as-Code Drift Detector
category: coding
tags: [devops, terraform, infrastructure, drift]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Flags likely drift between an IaC definition and a described actual state of live infrastructure — for the moment you suspect "someone changed this in the console" before you trust a `plan`/`apply` to do the right thing. Distinct from a general Terraform/K8s best-practices review: this compares declared state against a specific reported actual state.

## When to use it
- A `terraform plan` shows unexpected changes and you need to understand whether applying it is safe or would undo a manual fix.
- Before a routine `apply`, when you suspect console changes happened outside the pipeline (an incident hotfix, a one-off manual tweak).
- Periodic drift audits on infrastructure that multiple people can touch outside of code.

## The Prompt

```
You are auditing for drift between infrastructure-as-code and the actual live state of infrastructure — identifying what's out of sync and how risky it would be to reconcile, not applying anything.

IaC code: {{IAC_CODE}}

Actual state (a `plan` output, console description, or manual notes on what's actually deployed): {{ACTUAL_STATE_DESCRIPTION}}

Tool: {{TOOL}}

For each resource where declared and actual state differ:
1. Name the resource and the specific attribute(s) that differ, with declared value vs. actual value.
2. Classify it as safe-to-reconcile-via-apply (applying the code would harmlessly correct the drift) or risky-if-applied (applying would destroy/recreate a resource, cause downtime, or silently revert something someone changed live for a real reason — e.g., an emergency capacity bump or hotfix).
3. Recommend one of: apply the code to force reality back to match, update the code to match reality (import the change into version control), or investigate first (when you can't tell from the given info whether the drift was intentional).

Output a table of all divergences, then a prioritized reconciliation plan ordered by risk — handle risky items first, with the specific reasoning for why each is risky.

If no drift is found, say so plainly and suggest a routine cadence for re-checking rather than inventing findings.
```

## Variables
- `{{IAC_CODE}}` — the Terraform/CloudFormation/Pulumi definition to compare. Required.
- `{{ACTUAL_STATE_DESCRIPTION}}` — a `plan` output, console export, or manual description of what's actually deployed. Required.
- `{{TOOL}}` — the IaC tool in use (Terraform, Pulumi, CloudFormation, etc.) — changes how drift is typically surfaced and reconciled. Required.

## Example
**Input:** `{{IAC_CODE}}` declares an RDS instance with `instance_class = "db.t3.medium"`; `{{ACTUAL_STATE_DESCRIPTION}}` = "terraform plan shows it wants to change instance_class from db.t3.large to db.t3.medium", `{{TOOL}}` = "Terraform".

**Output (excerpt):**
```
Resource: aws_db_instance.main, attribute instance_class — declared: db.t3.medium, actual: db.t3.large.
Classification: RISKY IF APPLIED. A downgrade from t3.large to t3.medium on a live database causes a restart/brief downtime, and a size mismatch this specific (one size up, not a typo-level difference) suggests someone intentionally resized it, likely under load pressure — not accidental console drift.
Recommendation: investigate first — check recent incident history or ask the team before applying; if the resize was a deliberate capacity fix, update the code to `db.t3.large` instead of reverting it.

Reconciliation plan: 1) confirm with team whether the resize was intentional (RISKY — do this first), ...
```

## Tips & Variations
- Paste raw `terraform plan` output directly as `{{ACTUAL_STATE_DESCRIPTION}}` — no need to summarize it first.
- For Kubernetes, feed it `kubectl diff` output against the manifest and ask it to flag drift caused by autoscalers/operators separately from drift caused by manual `kubectl edit` — the former is often expected, not risky.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

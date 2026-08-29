---
id: terraform-reviewer
title: Terraform Reviewer
category: coding
tags: [devops, terraform, infrastructure-as-code]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Reviews Terraform/IaC code for risk and best-practice violations — state management, drift risk, overly permissive security groups/IAM, hardcoded secrets — as a targeted infrastructure review, distinct from the Kubernetes-manifest and CI-pipeline reviews in this category. For a real Terraform change before it's applied.

## When to use it
- Reviewing a Terraform PR before `apply`, especially one touching security groups, IAM, or state configuration.
- Auditing existing Terraform code for drift risk or security gaps after inheriting an infrastructure repo.
- Learning IaC best practices by seeing them applied as feedback on real code rather than reading a style guide.

## The Prompt

```
You review Terraform code for risk and best-practice violations — security, state management, and change-safety — not HCL syntax or formatting (that's `terraform fmt`'s job).

Terraform code: {{TERRAFORM_CODE}}
Cloud provider: {{CLOUD_PROVIDER}}
Context (optional — e.g. "this manages the production VPC", "this is a new microservice's infra"): {{CONTEXT}}

Instructions:
1. Check for hardcoded secrets or sensitive values (API keys, passwords, connection strings) in plain HCL rather than sourced from a secrets manager, environment variable, or marked `sensitive = true` — flag any such value even if it looks like a placeholder, since these get committed to version control.
2. Check security group / firewall rule permissiveness: any rule allowing `0.0.0.0/0` ingress on a sensitive port (SSH, RDP, database ports, admin interfaces) is a high-severity finding unless explicitly justified by context (e.g., a public web server's port 443). Flag overly broad egress rules too, not just ingress.
3. Check IAM/permission scoping: are policies using wildcard actions/resources (`"Action": "*"`, `"Resource": "*"`) where a scoped policy would work? Flag any role/policy granting broader access than the described resource plausibly needs.
4. Check state management practices: is remote state configured (not local state, which risks loss and prevents team collaboration)? Is state locking configured (preventing concurrent applies from corrupting state)? If visible, is the state backend itself appropriately access-controlled and encrypted?
5. Check for resources at risk of unintended replacement: a change to an immutable attribute that forces resource recreation (check for `# forces replacement` implications) on a stateful resource (a database, a resource holding data) is a data-loss risk that needs explicit callout, not just noting the plan would show it.
6. Check for missing `prevent_destroy` lifecycle protection on critical, hard-to-recreate resources (a production database, a resource with significant manual configuration) where accidental deletion via `terraform destroy` or a misconfigured `apply` would be catastrophic.
7. Check for drift risk: resources partially managed outside Terraform (manual console changes to a Terraform-managed resource) that the code can't detect — flag if the context suggests this is likely (e.g., mentions of manual hotfixes).

Output format: Markdown, one entry per finding, grouped by category (Secrets / Network Security / IAM / State Management / Data-Loss Risk / Drift), each with severity and the specific HCL fix.
```

## Variables
- `{{TERRAFORM_CODE}}` — the Terraform/HCL code to review. Required.
- `{{CLOUD_PROVIDER}}` — e.g. "AWS", "GCP", "Azure". Required — resource types and IAM models differ substantially.
- `{{CONTEXT}}` — what this infrastructure supports and its criticality. Optional but sharpens severity and helps judge whether a broad rule is justified.

## Example
**Input:** `{{TERRAFORM_CODE}}` = an `aws_security_group` resource with an ingress rule allowing port 5432 (Postgres) from `0.0.0.0/0`, `{{CLOUD_PROVIDER}}` = "AWS", `{{CONTEXT}}` = "database security group for the production order service".

**Output (excerpt):**
```
### Network Security — CRITICAL
Ingress rule allows TCP 5432 (PostgreSQL) from `0.0.0.0/0` — the production database port is open to the entire internet.
Fix:
```hcl
ingress {
  from_port   = 5432
  to_port     = 5432
  protocol    = "tcp"
  security_groups = [aws_security_group.app_servers.id]
}
```
Scope the rule to the specific security group of the application servers that need database access, not an open CIDR block. If external access is genuinely needed (e.g., for a specific admin IP), use a narrowly scoped CIDR, not `0.0.0.0/0`.
```

## Tips & Variations
- Pair with actual `terraform plan` output as additional context when reviewing a real change — the plan shows exactly what will be created/modified/destroyed, which is stronger evidence than reading the HCL alone for spotting unintended resource replacement.
- For a large module, ask it to prioritize findings by blast radius (a VPC-level misconfiguration affects everything downstream) rather than reviewing resources in file order.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

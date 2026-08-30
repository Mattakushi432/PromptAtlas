---
id: multi-tenant-isolation-reviewer
title: Multi-Tenant Data Isolation Reviewer
category: coding
tags: [databases, multi-tenancy, security]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Audits a schema or query layer for cross-tenant data leakage risk in a multi-tenant application — for a senior engineer reviewing tenant-scoping before a feature ships. Narrower than a general security review: this is specifically about one tenant seeing or affecting another tenant's data.

## When to use it
- Reviewing a new feature's queries/ORM code before it ships, in a multi-tenant SaaS product.
- After onboarding a new engineer to a multi-tenant codebase, to catch scoping mistakes early.
- Investigating whether a reported data-visibility bug could be a tenant-isolation failure.

## The Prompt

```
You are reviewing code specifically for cross-tenant data isolation risk — not general security or code quality. Assume authentication itself works; your job is whether an authenticated user of Tenant A could ever see or affect Tenant B's data.

Schema or query code: {{SCHEMA_OR_QUERY_CODE}}

Tenancy model in use (shared tables with a tenant_id column, schema-per-tenant, or database-per-tenant): {{TENANCY_MODEL}}

For a shared-table model, check:
1. Every query that reads or writes tenant-scoped data includes a tenant filter (a WHERE tenant_id = ... clause, or an ORM default scope that enforces it automatically) — flag any query missing it, quoting the specific line.
2. Foreign key relationships and joins don't allow traversing from one tenant's row to another tenant's row (e.g., a join on a shared lookup table that isn't itself tenant-scoped, when it should be).
3. The tenant_id used to scope a query is derived from the authenticated session/auth context, never taken directly from client-supplied request input (a client-supplied tenant_id can be tampered with).

For a schema-per-tenant or database-per-tenant model, check instead:
1. The connection/schema routing logic can't fall back to a default or wrong tenant's connection on an error path.
2. No code path constructs a cross-tenant connection intentionally without an explicit, audited reason (e.g., an admin tool) — and if one exists, that it's gated separately from normal user-facing code paths.

For each finding, quote the specific code, explain the concrete leakage scenario (not "this could theoretically leak" — describe the actual sequence of actions that would expose Tenant B's data to Tenant A), and rate severity (LOW/MEDIUM/HIGH/CRITICAL — any confirmed cross-tenant read or write is at least HIGH).

If every relevant code path is properly scoped, say so explicitly as a passing verdict rather than manufacturing a minor finding to seem thorough.
```

## Variables
- `{{SCHEMA_OR_QUERY_CODE}}` — the schema definition, ORM models, or query/repository code to review. Required.
- `{{TENANCY_MODEL}}` — how tenancy is implemented (shared-table, schema-per-tenant, db-per-tenant). Required — the checks differ substantially by model.

## Example
**Input:** `{{SCHEMA_OR_QUERY_CODE}}` = an ORM query `Order.where(status: 'pending')` inside a controller action, with `tenant_id` present as a column but not referenced in the query, `{{TENANCY_MODEL}}` = "shared tables with a tenant_id column".

**Output (excerpt):**
```
Finding: `Order.where(status: 'pending')` has no tenant filter and no evidence of a default scope enforcing one automatically. Severity: CRITICAL.
Concrete leakage: any authenticated user hitting this action would receive pending orders across ALL tenants, not just their own — this isn't a theoretical edge case, it's the default behavior of the query as written.
Fix: either add `.where(tenant_id: current_tenant.id)` explicitly, or — preferably — verify the ORM's default scope is actually applied here and isn't being bypassed by an `.unscoped` call elsewhere in the chain.

Verdict: 1 CRITICAL finding. Do not ship until fixed.
```

## Tips & Variations
- If the ORM has a default-scoping mechanism (e.g., Rails' `default_scope`, a custom base repository class), ask it to specifically verify the scope is actually active on the query in question rather than assuming it's globally guaranteed — scopes are frequently bypassed accidentally via raw SQL or `.unscoped`.
- For a database-per-tenant model, feed it the connection-routing middleware/code specifically, since that's where the actual risk concentrates rather than in individual queries.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

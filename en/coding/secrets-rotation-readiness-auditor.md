---
id: secrets-rotation-readiness-auditor
title: Secrets Rotation Readiness Auditor
category: coding
tags: [security, secrets-management, operations]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Audits whether a service can actually rotate a credential (API key, database password, certificate) without downtime. Distinct from `secrets-leak-detector`, which looks for exposed or hardcoded secrets — not whether rotating a properly-managed secret is operationally possible without an outage.

## When to use it
- Establishing a credential rotation policy and need to verify services can actually support it in practice, not just on paper.
- A rotation attempt caused an outage and you want to understand the specific gap for next time.
- A compliance requirement mandates periodic rotation and you're checking real operational readiness.

## The Prompt

```
You are auditing whether a service can rotate a specific credential without downtime — not whether the credential is currently exposed or leaked, which is a different concern; assume the credential itself is properly managed and focus purely on whether rotating it is operationally safe.

Service code or configuration (how the credential is loaded and used — an env var read once at startup vs. re-read periodically, whether the service can hold a single active credential or multiple): {{SERVICE_CODE_OR_CONFIG}}

Credential type (API key, database password, TLS certificate, etc. — rotation mechanics differ meaningfully by type): {{CREDENTIAL_TYPE}}

Check:
1. Load timing — is the credential loaded once at process startup (meaning rotation requires a full restart or redeploy to take effect, not a live rotation), or can it be reloaded from its source without restarting the process?
2. Dual-validity support — can the service accept and correctly use two valid credentials simultaneously during a transition window? This is the key mechanism for zero-downtime rotation: create the new credential at the source while the old one is still valid, let both work briefly, switch the service over, then retire the old credential — rather than a hard cutover that requires the credential source and the service to change at the exact same instant.
3. Downstream sequencing — for credential types with dependencies (a database that must have the new password created and granted before the app can switch to it; a TLS cert that clients must trust before it becomes the sole cert served), check whether a rotation plan actually sequences these correctly rather than assuming a single atomic swap.

Output a readiness verdict: can rotate live with zero downtime / requires a brief service restart but no full outage / requires a scheduled downtime window — with the specific gap(s) causing anything short of live rotation, and what would need to change to reach zero-downtime rotation if that's the actual goal.

If the credential type has no dual-validity support at the provider level (some legacy or third-party systems only support a single active key with no overlap period), say that plainly rather than proposing a dual-credential transition window that isn't actually achievable — recommend the realistic mitigation instead (a short, scheduled, well-communicated maintenance window) rather than an idealized plan the underlying system can't support.
```

## Variables
- `{{SERVICE_CODE_OR_CONFIG}}` — how the service loads and uses the credential. Required.
- `{{CREDENTIAL_TYPE}}` — the type of credential being rotated. Required — rotation mechanics (and what dual-validity even means) differ significantly by type.

## Example
**Input:** `{{SERVICE_CODE_OR_CONFIG}}` = "the database password is read from an environment variable once in the app's startup code and stored in a module-level constant used for all subsequent connections", `{{CREDENTIAL_TYPE}}` = "PostgreSQL database password".

**Output (excerpt):**
```
Load timing: FAILS live-reload requirement. The password is read once at startup into a module-level constant — there is no code path that re-reads it later, so rotating the password at the database level would cause every subsequent connection attempt from this running process to fail authentication until the process is restarted with the new value. This means rotation currently requires a coordinated restart, not a live rotation.

Dual-validity support: PostgreSQL itself supports having a user with the old password still valid while a new password is set via `ALTER ROLE ... PASSWORD`, briefly maintaining backward compatibility at the database level — but this service's own code doesn't exploit that, since it holds only one credential in memory with no mechanism to pick up the new one without a restart.

Readiness verdict: requires a brief service restart, not a full downtime window, IF restarts themselves are fast and don't drop in-flight connections badly (check the service's graceful-shutdown/restart behavior separately). To reach true zero-downtime rotation: add a credential-reload mechanism (e.g., a periodic re-read of the env var / secret store, or a SIGHUP handler that reloads config) so a rolling restart isn't even needed — the running process would pick up the new password on its own within the reload interval.

Sequencing for a coordinated restart approach in the meantime: (1) set the new password at the database via ALTER ROLE while the old one remains valid, (2) deploy/restart the service with the new password configured, (3) once all instances are confirmed on the new password, only then invalidate the old one at the database — never invalidate the old password before every instance has successfully switched.
```

## Tips & Variations
- If the service already uses a secrets manager with native rotation support (AWS Secrets Manager rotation, HashiCorp Vault dynamic secrets), ask it to specifically check whether the service integrates with that rotation lifecycle (e.g., a rotation Lambda that coordinates the dual-validity window automatically) rather than assuming the secrets manager's rotation feature alone guarantees the service is ready.
- For TLS certificates specifically, ask it to address the client-trust sequencing explicitly (new cert must be trusted before old cert is retired, which may itself take time to propagate for external clients) since this differs meaningfully from a simple password-style credential.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

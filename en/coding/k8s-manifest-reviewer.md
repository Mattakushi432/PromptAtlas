---
id: k8s-manifest-reviewer
title: Kubernetes Manifest Reviewer
category: coding
tags: [devops, kubernetes, security]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Reviews a Kubernetes manifest for common misconfigurations — missing resource limits, weak security context, absent/misconfigured probes, secret handling — against production-readiness norms, not a YAML syntax check. For a manifest before it ships to a cluster.

## When to use it
- Reviewing a new Deployment/StatefulSet/Pod manifest before it's applied to a production cluster.
- Auditing existing manifests for security or reliability gaps after an incident traced back to a misconfiguration.
- Onboarding a team onto Kubernetes and wanting a systematic checklist applied to their first manifests rather than learning gaps the hard way.

## The Prompt

```
You review a Kubernetes manifest for production-readiness issues — resource management, security posture, health checking, and secret handling — not YAML syntax or basic validity.

Manifest: {{MANIFEST}}
Context (optional — e.g. "this runs a stateless API", "this handles payment processing"): {{WORKLOAD_CONTEXT}}

Instructions:
1. Check resource requests/limits: are both `requests` and `limits` set for CPU and memory? Missing requests mean the scheduler can't place the pod sensibly; missing memory limits risk the pod consuming unbounded memory and getting OOM-killed unpredictably or starving neighbors. Flag any container with no resource specification at all as a high-priority finding.
2. Check security context: is the container running as root (no `runAsNonRoot`/`runAsUser`)? Is `allowPrivilegeEscalation` left at its permissive default? Are unnecessary Linux capabilities retained instead of dropped (`drop: [ALL]` plus only the specific capabilities actually needed)? Is the root filesystem writable when it doesn't need to be (`readOnlyRootFilesystem: true` where applicable)?
3. Check health probes: is a `livenessProbe` present (without one, Kubernetes can't restart a hung container) and a `readinessProbe` present (without one, traffic may route to a pod that isn't actually ready)? Check that probe timing (`initialDelaySeconds`, `periodSeconds`, `failureThreshold`) is plausible for the workload — a probe that's too aggressive for a slow-starting app causes crash-loop restarts of a healthy app.
4. Check secret handling: are secrets referenced via `secretKeyRef`/mounted secret volumes rather than hardcoded as plain environment variable values in the manifest? Flag any credential-looking value in a plain `env` block.
5. Check for missing or overly permissive service account configuration: is a specific ServiceAccount used (not the default with broad permissions), and if RBAC is visible, is it scoped to what the workload actually needs?
6. Check replica count and update strategy for anything described as production-critical in {{WORKLOAD_CONTEXT}} — a single-replica Deployment for a critical service is a single point of failure, and `Recreate` strategy on a service that needs zero-downtime deploys causes an outage on every rollout.
7. For each finding, give the specific YAML fix, not just "add resource limits."

Output format: Markdown, one entry per finding, grouped by category (Resources / Security / Probes / Secrets / RBAC / Availability), each with severity and the specific YAML fix.
```

## Variables
- `{{MANIFEST}}` — the Kubernetes manifest YAML to review. Required.
- `{{WORKLOAD_CONTEXT}}` — what the workload does and its criticality. Optional but sharpens severity judgments (a payment service's missing readiness probe is more severe than a batch job's).

## Example
**Input:** `{{MANIFEST}}` = a Deployment with no `resources` block, no `securityContext`, and a `DATABASE_PASSWORD` env var set to a plaintext value.

**Output (excerpt):**
```
### Secrets — CRITICAL
`DATABASE_PASSWORD` is set as a plaintext value in the `env` block, visible to anyone with read access to the manifest/pod spec (including via `kubectl describe`).
Fix:
```yaml
env:
  - name: DATABASE_PASSWORD
    valueFrom:
      secretKeyRef:
        name: db-credentials
        key: password
```
(with the actual value stored in a `Secret` object, ideally sourced from an external secret manager rather than committed to the manifest repo.)

### Resources — HIGH
No `resources.requests`/`resources.limits` specified — the scheduler has no basis for placement decisions, and the container can consume unbounded memory.
Fix: add explicit requests/limits sized to the workload's actual observed usage, e.g. `resources: { requests: { cpu: "100m", memory: "128Mi" }, limits: { cpu: "500m", memory: "256Mi" } }`.
```

## Tips & Variations
- For a Helm chart instead of a raw manifest, ask it to review the rendered output (`helm template`) rather than the chart templates directly, since defaults and overrides can obscure the actual applied configuration.
- Pair with an actual policy-as-code tool's output (OPA/Gatekeeper, Kyverno, kube-score) as additional context — this prompt is strongest at explaining findings and prioritizing them by real-world impact, not replacing automated policy enforcement.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

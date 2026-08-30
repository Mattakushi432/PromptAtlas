---
id: feature-deprecation-sunset-planner
title: Feature Deprecation & Sunset Planner
category: coding
tags: [planning, deprecation, migration]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Plans a staged deprecation of an internal API, feature, or endpoint — the consumer migration path, communication plan, and a hard-cutoff date. Distinct from `deployment-rollback-planner` (undoing a recent deploy) and `legacy-code-modernizer` (modernizing a pattern in place, not retiring a feature entirely).

## When to use it
- Retiring an old API version or feature now that a replacement exists.
- An internal endpoint has known consumers and needs a clean, staged sunset instead of a surprise deletion.
- Planning the communication and timeline for a deprecation, not just the technical removal.

## The Prompt

```
You are planning the staged deprecation of a feature/API that has active consumers — the plan needs to get to zero usage safely, not just announce an end date and hope.

Feature being deprecated: {{FEATURE_DESCRIPTION}}

Known consumers (who or what currently uses it): {{KNOWN_CONSUMERS}}

Replacement (what consumers should migrate to, if there is one): {{REPLACEMENT}}

Produce a staged plan:
1. Announce — communicate the deprecation and timeline to known consumers, with a clear migration path to {{REPLACEMENT}} if one exists.
2. Soft-deprecate — add usage warnings (logging, a deprecation header on responses, a dashboard flagging remaining callers) so remaining usage becomes visible and trackable, not just theoretically declining.
3. Hard cutoff — remove the feature, only once usage has actually dropped to zero (or an explicitly accepted residual level), not simply because a calendar date arrived.

For each stage, specify: what communication needs to happen and to whom, and what concrete signal (not just elapsed time) confirms it's safe to proceed to the next stage — usage metrics genuinely dropping, not an assumption that everyone read the announcement.

Address what to do about consumers discovered via the soft-deprecation logging that weren't on the original known list — these need direct outreach before the hard cutoff, not just inclusion in the general announcement they may have missed.

If the feature has no clear replacement — it's being removed outright, not replaced by something else — adjust the plan to focus on migration-away guidance (how consumers should adapt without it) rather than migration-to guidance.
```

## Variables
- `{{FEATURE_DESCRIPTION}}` — what's being deprecated. Required.
- `{{KNOWN_CONSUMERS}}` — who or what currently uses it, as far as known. Required.
- `{{REPLACEMENT}}` — what consumers should move to, if applicable. Optional — omit if the feature is being removed with no direct replacement.

## Example
**Input:** `{{FEATURE_DESCRIPTION}}` = "the v1 /search endpoint, being replaced by v2 which supports filtering", `{{KNOWN_CONSUMERS}}` = "the mobile app (confirmed on v1), an internal analytics dashboard (unconfirmed, found via old documentation)", `{{REPLACEMENT}}` = "v2 /search endpoint".

**Output (excerpt):**
```
Announce (week 0): notify the mobile app team directly with the migration guide to v2; separately confirm whether the analytics dashboard is actually still calling v1 rather than assuming the old documentation is current — this consumer's status is unconfirmed and needs direct verification, not inclusion in a broadcast announcement they might miss.

Soft-deprecate (week 2 onward): add a deprecation warning header to all v1 responses and log caller identity (API key or service name) on every v1 request, so any consumer not on the known list surfaces here rather than staying invisible until the cutoff breaks them.

Signal to proceed to cutoff: v1 request volume at genuinely zero (or an explicitly accepted residual, e.g., "under 5 requests/day from a known, accepted legacy source") for at least 2 consecutive weeks — not simply "8 weeks have passed since the announcement."

Hard cutoff (earliest week 10, contingent on the above signal): remove v1 endpoint code, with a short grace-period fallback (e.g., a 410 Gone response with a link to v2) rather than a silent 404, so any missed consumer gets a clear, actionable error rather than a confusing failure.
```

## Tips & Variations
- If the feature has zero external/customer-facing consumers and is purely internal, the communication stage can be much lighter (a Slack post vs. a formal announcement) — don't apply the same ceremony to a low-stakes internal cleanup as to a customer-facing API sunset.
- Pair with `dependency-cve-triage` in reverse: if a *dependency* forces this deprecation (e.g., an upstream library removing the API this feature was built on), note that constraint explicitly since it changes the achievable timeline.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

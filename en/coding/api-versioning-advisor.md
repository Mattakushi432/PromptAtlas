---
id: api-versioning-advisor
title: API Versioning Advisor
category: coding
tags: [api-design, versioning, backend]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Recommends a specific API versioning strategy (URL path, header, media-type, or none) given your actual constraints — client control, release cadence, breaking-change frequency — rather than a generic list of versioning approaches. For a team about to make this decision, not researching versioning theory.

## When to use it
- Building a new public or partner-facing API and needing to decide on a versioning approach before the first client integrates.
- An internal API is starting to have external consumers and needs a real versioning strategy instead of "we'll just tell people when it breaks."
- Revisiting an existing versioning approach that's causing friction (too many versions maintained, or breaking changes landing without warning).

## The Prompt

```
You recommend a specific API versioning strategy based on the constraints given — not a generic overview of all approaches.

API context (who consumes it — internal only, a few known partners, or the public; how often you expect breaking changes): {{API_CONTEXT}}
Constraints (e.g. "clients can't easily update quickly", "we control all clients", "need to support old mobile app versions for years"): {{CONSTRAINTS}}
Current approach, if any (optional): {{CURRENT_APPROACH}}

Instructions:
1. Weigh the main strategies against the given constraints specifically: URL path versioning (/v1/, /v2/), header-based versioning (a custom header or Accept header media type), and no formal versioning (additive-only changes with a deprecation policy for anything else).
2. Recommend one primary strategy, with reasoning tied directly to {{API_CONTEXT}} and {{CONSTRAINTS}} — e.g., "since you control all clients and can force updates, no formal versioning with strict additive-change discipline is lower overhead than maintaining parallel versions."
3. If breaking changes are expected to be rare, favor a strategy that avoids the overhead of maintaining multiple live versions; if they're expected to be frequent or client control is weak, favor a strategy that gives clients explicit control over when they adopt changes.
4. Define what counts as a "breaking change" for the recommended strategy (e.g., removing a field, changing a field's type, changing required-ness) so the team has a concrete boundary, not just a strategy name.
5. Recommend a deprecation policy alongside the versioning strategy: how versions get sunset, how much notice clients get, and how deprecation is communicated (headers, changelog, direct outreach for known partners).
6. If {{CURRENT_APPROACH}} is given and it's causing a specific problem, address that problem directly in the recommendation rather than proposing an unrelated ideal-world strategy.

Output format: Markdown with sections: Recommended Strategy (with reasoning), What Counts as Breaking, Deprecation Policy.
```

## Variables
- `{{API_CONTEXT}}` — who consumes the API and how often breaking changes are expected. Required.
- `{{CONSTRAINTS}}` — factors limiting the choice (client update speed, team size, backward-compat needs). Required.
- `{{CURRENT_APPROACH}}` — the existing strategy, if revisiting one. Optional.

## Example
**Input:** `{{API_CONTEXT}}` = "public API consumed by third-party developers building integrations, breaking changes happen a few times a year", `{{CONSTRAINTS}}` = "third-party developers can't be forced to update on our schedule".

**Output (excerpt):**
```
## Recommended Strategy
URL path versioning (`/v1/...`, `/v2/...`). Since third-party developers control their own update schedule and can't be forced to migrate, they need an explicit, stable way to keep using an older contract while you evolve the API. Path versioning is also the most discoverable/debuggable option for external developers reading docs or a URL in a log line, which matters when you don't control their tooling.

## What Counts as Breaking
Removing or renaming a field, changing a field's type, adding a new required request field, or changing existing status code semantics. Adding new optional fields or new endpoints is non-breaking and doesn't require a version bump.

## Deprecation Policy
Support the previous major version for a minimum of 12 months after a new version ships; announce deprecation via a response header (`Deprecation: true`, `Sunset: <date>`) plus a changelog entry, and directly email registered API key holders 3 months before sunset.
```

## Tips & Variations
- For an internal-only API where you control every client, explicitly ask it to weigh "no versioning, additive-only" more heavily — this is often the right answer and gets underweighted if the prompt defaults to enterprise-API thinking.
- If GraphQL is in play instead of REST, note that field-level deprecation (`@deprecated` directive) replaces most of the need for whole-API versioning — ask for that alternative explicitly.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

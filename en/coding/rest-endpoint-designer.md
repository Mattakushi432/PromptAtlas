---
id: rest-endpoint-designer
title: REST Endpoint Designer
category: coding
tags: [api-design, rest, backend]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Designs a set of REST endpoints — methods, paths, status codes, request/response shapes — from a plain-language feature description. For starting a new API surface from scratch, not reviewing or documenting an existing one.

## When to use it
- Starting a new feature that needs a REST API and wanting a solid first draft of the endpoint contract before writing implementation code.
- Aligning a frontend and backend team on an API shape before either side starts building.
- Reviewing whether a proposed set of endpoints follows REST conventions consistently before it ships.

## The Prompt

```
You design REST API endpoints from a feature description. Output a concrete endpoint contract, not prose describing general REST principles.

Feature description: {{FEATURE_DESCRIPTION}}
Existing API conventions to match (optional — e.g. URL structure, auth pattern, pagination style already used elsewhere): {{EXISTING_CONVENTIONS}}
Resource naming preferences (optional): {{NAMING_PREFERENCES}}

Instructions:
1. Identify the resource(s) implied by the feature and model the endpoints around resources and their relationships, using nouns in URLs (not verbs) and standard HTTP methods for actions (GET/POST/PUT/PATCH/DELETE).
2. For each endpoint, specify: method, path (with path parameters marked), a one-line purpose, request body shape (if applicable), response body shape, and the full set of realistic status codes (not just 200 — include the actual error cases this operation could hit: 400 validation, 401/403 auth, 404 not found, 409 conflict where applicable, 422 for semantic validation failures).
3. Handle collections properly: list endpoints should support pagination (specify the pagination style — cursor or offset — and say why, given the resource's likely size/access pattern), and filtering/sorting parameters if the feature implies them.
4. Be consistent about response envelope shape across all endpoints (either always wrap in an envelope with metadata, or never — don't mix).
5. If {{EXISTING_CONVENTIONS}} is provided, follow it exactly rather than defaulting to generic REST best practices where they conflict.
6. Flag any part of the feature description that's ambiguous about resource ownership or cardinality (e.g., "can a user have multiple X, or exactly one?") rather than silently picking one interpretation.
7. Note any endpoint that doesn't cleanly fit REST's resource model (an action that's more like an RPC call, e.g., "send password reset email") and design it as a sub-resource action (`POST /users/{id}/password-reset`) rather than forcing an awkward resource shape.

Output format: Markdown table or list, one entry per endpoint, in the order a client would typically use them (create → read → update → delete, collection before item where relevant).
```

## Variables
- `{{FEATURE_DESCRIPTION}}` — what the feature needs to let users/clients do. Required.
- `{{EXISTING_CONVENTIONS}}` — the API's established patterns (auth, pagination, envelope shape, versioning). Optional but keeps new endpoints consistent with existing ones.
- `{{NAMING_PREFERENCES}}` — resource naming style if the team has one (plural nouns, specific casing, etc.). Optional.

## Example
**Input:** `{{FEATURE_DESCRIPTION}}` = "users can create, view, and cancel meal-delivery subscriptions; each user can have at most one active subscription".

**Output (excerpt):**
```
| Method | Path | Purpose | Request Body | Success | Errors |
|---|---|---|---|---|---|
| POST | /users/{userId}/subscription | Create a new subscription | `{ planId, deliveryDay }` | 201 + subscription object | 400 (invalid plan), 401, 409 (user already has an active subscription) |
| GET | /users/{userId}/subscription | Get the user's active subscription | — | 200 + subscription object, or 404 if none exists | 401, 403 |
| DELETE | /users/{userId}/subscription | Cancel the active subscription | — | 204 | 401, 404 (no active subscription to cancel) |
```

## Tips & Variations
- For a public-facing API, ask it to add rate-limit headers and versioning strategy to the contract explicitly.
- If the team uses GraphQL instead, this prompt doesn't transfer directly — see a schema-design prompt instead; REST's resource/verb model doesn't map onto GraphQL's query/mutation model.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

---
id: api-contract-consistency-reviewer
title: API Contract Consistency Reviewer
category: coding
tags: [api-design, rest, graphql, consistency]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Reviews a set of API endpoints for internal consistency — naming, pagination, error shapes, status codes, versioning — not for the correctness of any single endpoint's implementation. Built for a tech lead running an API design review before a contract ships or gets merged with endpoints designed by different people.

## When to use it
- Before publishing API docs, when endpoints were built by different developers or teams over time.
- Reviewing a new batch of endpoints against an existing API's established conventions.
- Periodic consistency audits on a growing API surface.

## The Prompt

```
You are reviewing a set of API endpoints for internal consistency, not for the correctness or security of any single endpoint's implementation — assume each endpoint works; your job is whether they agree with each other.

Endpoints (paths, methods, request/response shapes):
{{API_ENDPOINTS}}

Style guide or existing conventions (optional — if omitted, infer the dominant convention from the endpoints themselves and treat outliers as inconsistencies): {{STYLE_GUIDE}}

Check consistency across these dimensions:
1. Naming — casing (snake_case vs camelCase), pluralization of resource names, verb usage in paths.
2. Resource nesting — consistent depth and pattern for nested resources.
3. Pagination — same pagination style (cursor vs offset), same parameter names, same response envelope shape across list endpoints.
4. Error responses — same error object shape, same field names for error code/message, consistent use of HTTP status codes for equivalent failure types.
5. Versioning — consistent versioning mechanism (URL path, header) applied the same way everywhere.
6. Auth — consistent header/token conventions across endpoints that require auth.

For each inconsistency found, name the specific endpoints involved, quote the conflicting pieces, rate its severity (MINOR — cosmetic; MODERATE — will confuse API consumers; MAJOR — will break client code or cause real bugs), and give the concrete fix (which side should change, and to what).

If fewer than two endpoints are provided, say there isn't enough to compare and stop — don't invent a convention to check against.

End with a verdict: fully consistent, or a count of inconsistencies by severity.
```

## Variables
- `{{API_ENDPOINTS}}` — two or more endpoint definitions (path, method, request/response shape). Required.
- `{{STYLE_GUIDE}}` — an explicit API style guide to check against. Optional; without it, the dominant pattern among the endpoints is used as the baseline.

## Example
**Input:** `{{API_ENDPOINTS}}` = `GET /users?page=2&per_page=20` returning `{ users: [...], total_count, page }`, and `GET /orders?cursor=abc123&limit=20` returning `{ data: [...], next_cursor }`.

**Output (excerpt):**
```
1. Pagination — MAJOR. `/users` uses offset pagination (`page`/`per_page`) with an envelope keyed `users`/`total_count`/`page`; `/orders` uses cursor pagination (`cursor`/`limit`) with an envelope keyed `data`/`next_cursor`. Two different pagination models on the same API forces every client to special-case list endpoints. Fix: standardize on one pagination style (cursor is generally safer at scale) and one envelope shape across all list endpoints.

Verdict: 1 MAJOR inconsistency found.
```

## Tips & Variations
- Paste in an OpenAPI/Swagger spec directly as `{{API_ENDPOINTS}}` — it doesn't need to be reformatted first.
- For a GraphQL schema, ask it to check field naming, connection/edge pattern consistency, and error-as-data vs. thrown-error consistency instead of REST-specific dimensions.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

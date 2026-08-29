---
id: openapi-doc-generator
title: OpenAPI Doc Generator
category: coding
tags: [api-design, documentation, openapi]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Drafts OpenAPI/Swagger documentation from existing endpoint code — reverse-documenting an API that was built without a spec, or that has drifted from one. For getting a spec into existence from real code, not designing new endpoints (see `rest-endpoint-designer` for that).

## When to use it
- An API was built without an OpenAPI spec and now needs one for a client SDK generator, API gateway, or partner documentation.
- An existing OpenAPI spec has drifted out of sync with the actual code and needs to be regenerated/reconciled.
- Onboarding a new consumer team who needs documentation and the only source of truth is the implementation itself.

## The Prompt

```
You generate an OpenAPI 3.x specification from existing endpoint implementation code. Document what the code actually does, not what it should ideally do — if the implementation has inconsistencies, document them faithfully rather than silently "fixing" them in the spec.

Endpoint code: {{ENDPOINT_CODE}}
Existing OpenAPI spec to update, if reconciling drift (optional): {{EXISTING_SPEC}}
API metadata (title, version, base path — optional): {{API_METADATA}}

Instructions:
1. For each endpoint, extract: path, HTTP method, path/query/header parameters (with types and whether required), request body schema, and every response the code can actually produce (not just the success case) with accurate status codes.
2. Infer schema types and constraints from the code as precisely as possible: nullable fields, enums (from validation logic or type definitions), string formats (email, date-time, uuid) where the code actually validates them, not just where a field name suggests it.
3. Where the code's actual behavior is ambiguous or inconsistent (e.g., a field is sometimes present in responses and sometimes omitted, inconsistent error shapes across similar endpoints), flag it as a comment/note rather than guessing at a clean shape — this documents technical debt rather than hiding it.
4. Include authentication/security scheme definitions if the code shows how auth is checked (bearer token, API key header, etc.).
5. Write a brief but genuinely useful `description` for each endpoint and each non-obvious field — not a restatement of the field name (a field named `status` needs its actual possible values and meaning documented, not "The status").
6. If {{EXISTING_SPEC}} is provided, reconcile it: keep manually-written descriptions/examples where they're still accurate, but correct any parameter, schema, or response that has drifted from what the code now actually does, and flag each correction made.

Output: valid OpenAPI 3.x YAML, plus a short list of any ambiguities or inconsistencies flagged during generation.
```

## Variables
- `{{ENDPOINT_CODE}}` — the route/handler implementation to document. Required.
- `{{EXISTING_SPEC}}` — a prior spec to reconcile against, if one exists. Optional.
- `{{API_METADATA}}` — title, version, servers/base path for the spec's info block. Optional.

## Example
**Input:** `{{ENDPOINT_CODE}}` = an Express handler for `GET /users/:id` that returns a user object or a 404 with `{ error: string }`, and validates `id` is a UUID before querying.

**Output (excerpt):**
```yaml
/users/{id}:
  get:
    summary: Get a user by ID
    parameters:
      - name: id
        in: path
        required: true
        schema:
          type: string
          format: uuid
    responses:
      '200':
        description: The requested user
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/User'
      '404':
        description: No user exists with the given ID
        content:
          application/json:
            schema:
              type: object
              properties:
                error:
                  type: string
```

## Tips & Variations
- For a large codebase, run this per-route-file rather than on the whole API at once, then merge the resulting specs — this keeps each generation accurate and avoids truncation.
- Feed the generated spec into an actual OpenAPI validator afterward (e.g., Spectral) to catch any structural issues the model's YAML output might have introduced.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

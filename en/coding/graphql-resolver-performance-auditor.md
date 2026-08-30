---
id: graphql-resolver-performance-auditor
title: GraphQL Resolver Performance Auditor
category: coding
tags: [backend, graphql, performance]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Audits GraphQL resolver implementation code for runtime performance issues — missing batching, redundant per-field database calls, missing caching. Distinct from `graphql-schema-reviewer`, which critiques the schema definition (SDL) itself for design-time N+1 risk and over-fetching shape: this reviews the actual resolver code that executes at runtime, where a well-designed schema can still be poorly implemented, or vice versa.

## When to use it
- A GraphQL API is slow under real query load despite a reasonable schema design.
- Reviewing new resolver code before it merges, to catch a performance issue before it ships.
- Investigating why a specific query type is disproportionately slow.

## The Prompt

```
You are auditing GraphQL resolver implementation code for runtime performance — not the schema shape (assume the schema design itself is reasonable; your job is how the resolvers actually execute against it).

Resolver code: {{RESOLVER_CODE}}

Schema context (optional — the relevant type definitions, if useful for understanding the resolver's role): {{SCHEMA_CONTEXT}}

Check:
1. N+1 execution — any resolver that fetches related/nested data with a per-parent database call that runs once for every item in a list (e.g., a `Post.author` resolver that queries the database separately for each post in a list of 50, instead of batching all 50 author lookups into one query).
2. Batching correctness — if a batching mechanism (DataLoader or equivalent) is in use, verify it's actually scoped correctly: a new instance per request, not a shared/module-level instance that would leak cached data across unrelated requests (a subtle bug that's easy to introduce and easy to miss in review).
3. Caching opportunities — expensive or frequently-repeated computations within a resolver that aren't cached, where the underlying data doesn't change within the scope of a request or a short TTL.
4. Query complexity/depth limiting — whether any protection exists against a single deeply-nested or broadly-fanned-out query being catastrophically expensive to execute, whether malicious or just an unintentionally expensive client query.

For each finding, quote the specific resolver and describe the concrete query pattern that would trigger the problem (e.g., "a query requesting `posts { author { name } }` for a 100-post list would trigger 100 separate author lookups") rather than a generic "this could be slow."

If a batching library is already in use, don't treat its mere presence as sufficient — verify the scoping is actually correct, since a misconfigured DataLoader (e.g., instantiated once at module load instead of per-request) is a real and common failure mode, not a hypothetical one.
```

## Variables
- `{{RESOLVER_CODE}}` — the resolver implementation code to audit. Required.
- `{{SCHEMA_CONTEXT}}` — relevant type definitions, if it helps clarify the resolver's role. Optional.

## Example
**Input:** `{{RESOLVER_CODE}}` = a `Post.author` resolver that runs `db.users.findById(post.authorId)` directly, with no DataLoader or batching visible anywhere in the resolver map.

**Output (excerpt):**
```
Finding: N+1 execution in `Post.author`. Pattern that triggers it: any query requesting a list of posts with their authors — `posts { author { name } }` — will run one `findById` call per post in the result set, so a 50-post list triggers 50 separate database round-trips instead of one batched query. Severity: HIGH, scales linearly with list size and is likely the dominant cost on any list-of-posts query.

Fix: introduce a DataLoader for user lookups, batching `findById` calls made within the same GraphQL execution tick into a single `WHERE id IN (...)` query, and instantiate it fresh per request (e.g., in the GraphQL context factory) — not as a module-level singleton, which would leak one request's cached users into another's response.
```

## Tips & Variations
- For a federated/subgraph GraphQL setup, ask it to specifically check for N+1 patterns introduced at the gateway/composition layer, not just within a single subgraph's resolvers — federation can introduce its own batching gaps.
- Pair with `n-plus-one-detector` if the underlying database access is via an ORM — that prompt catches ORM-level N+1 patterns generally, while this one is specifically calibrated to the GraphQL resolver execution model (per-field resolution across a result set).

## Changelog
- 1.0.0 (2026-08-30): Initial version.

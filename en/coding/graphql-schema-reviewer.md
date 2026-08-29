---
id: graphql-schema-reviewer
title: GraphQL Schema Reviewer
category: coding
tags: [api-design, graphql, performance]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Critiques a GraphQL schema specifically for N+1 query risk, over-fetching/under-fetching design, and unbounded list fields — a schema-design-quality review distinct from a general API design pass and from REST endpoint design entirely. For a schema before or after implementation, when resolver performance is the concern.

## When to use it
- Designing a new GraphQL schema and wanting to catch N+1 risks before resolvers are even written.
- A GraphQL API is experiencing performance problems and you suspect the schema shape itself, not just missing DataLoader batching, is the root cause.
- Reviewing a schema PR where reviewers keep missing resolver-performance implications because they're reviewing types, not access patterns.

## The Prompt

```
You review a GraphQL schema specifically for performance-relevant design issues — N+1 risk, over/under-fetching, unbounded lists — not general type design or naming.

Schema (SDL): {{SCHEMA}}
Known query patterns clients actually use (optional, but very high-value): {{QUERY_PATTERNS}}
Resolver implementation details (optional, if available): {{RESOLVER_DETAILS}}

Instructions:
1. For every field that returns a list of a type with its own resolvable fields, identify whether resolving those nested fields across the list risks an N+1 pattern (one query per list item) rather than a single batched query — flag it even if DataLoader-style batching might already be in place, since the schema shape itself should be evaluated independently of implementation mitigations.
2. Flag any list field with no pagination arguments (no `first`/`after` or `limit`/`offset`) — an unbounded list is both a performance risk and a potential DoS vector if a client can request an arbitrarily large result set.
3. Identify over-fetching risk: a type that always returns a large/expensive field (e.g., a full document body) even when most queries don't need it — recommend whether it should be a separate field behind an explicit opt-in, or use `@defer`-style patterns if the schema supports it.
4. Identify under-fetching / chatty-query risk: a schema shape that forces clients to make multiple round-trip queries to assemble what's conceptually one screen's worth of data, when a single well-designed query could serve it.
5. Check for circular/deeply nested relationships that could allow a malicious or naive client to construct an extremely expensive query (e.g., `friends { friends { friends { ... } } }`) — flag if there's no query depth/complexity limiting mentioned or apparent.
6. For each finding, state the specific query shape that would trigger the problem, not just the abstract risk.

Output format: Markdown, one entry per finding, grouped by category (N+1 Risk / Unbounded Lists / Over-fetching / Under-fetching / Query Complexity), each with the triggering query pattern and a suggested schema change.
```

## Variables
- `{{SCHEMA}}` — the GraphQL SDL to review. Required.
- `{{QUERY_PATTERNS}}` — real or expected client queries against this schema. Optional but sharply improves relevance — theoretical schema issues that no client query would ever trigger are lower priority.
- `{{RESOLVER_DETAILS}}` — how fields are actually resolved (batched, per-item DB calls, etc.). Optional.

## Example
**Input:** `{{SCHEMA}}` = a `Post` type with a `comments: [Comment!]!` field (no pagination args) and each `Comment` has an `author: User!` field.

**Output (excerpt):**
```
### N+1 Risk
`Comment.author` — for any query fetching a post's comments and each comment's author, resolving `author` per comment risks one query per comment unless batched (e.g., via DataLoader). Triggering query: `{ post(id: "1") { comments { author { name } } } }`. Recommend confirming DataLoader batching is in place for `Comment.author`, and note this explicitly in resolver docs since it's not visible from the schema alone.

### Unbounded Lists
`Post.comments: [Comment!]!` has no pagination arguments — a post with 10,000 comments would return all of them in one response. Recommend converting to a connection pattern: `comments(first: Int, after: String): CommentConnection!`.
```

## Tips & Variations
- Feed it actual query logs or a client's `.graphql` query files as `{{QUERY_PATTERNS}}` — this turns the review from theoretical into "these are the specific queries your users run, and here's what breaks."
- For a schema using a specific server framework (Apollo, GraphQL Yoga, etc.), ask it to note framework-specific mitigations available (e.g., Apollo's automatic persisted queries, cost-based query complexity limiting) rather than only generic advice.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

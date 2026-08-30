---
id: graphql-query-cost-estimation-designer
title: GraphQL Query Cost Estimation Designer
category: coding
tags: [graphql, rate-limiting, api-design]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Designs a query-cost-scoring scheme to reject expensive GraphQL queries before execution — a proactive protection design, distinct from `graphql-resolver-performance-auditor` (coding, already shipped)'s post-hoc review of already-slow resolvers: this prompt designs the cost model and enforcement point itself, for preventing expensive queries from running at all, not diagnosing why a specific one was slow after the fact.

## When to use it
- Your GraphQL API's flexible query shape means clients can construct deeply nested or highly duplicative queries that are expensive regardless of individual resolver efficiency, and you want protection at the query-acceptance layer.
- You've had (or want to prevent) an incident where a single malicious or accidental query brought down the API by requesting an enormous amount of data through legitimate-looking nested fields.
- You're designing public API access (third-party developers, not just your own frontend) and need cost-based protection since you can't control what queries external clients will construct.

## The Prompt

```
You design a query-cost-scoring scheme for a GraphQL API: a way to estimate a query's cost before execution and reject queries above a threshold. You design the scoring model and enforcement point specifically for this schema's actual structure — you do not propose a generic "just limit query depth" solution without checking whether that's sufficient for the schema's actual risk shape.

Schema structure (key types, relationships, especially list/connection fields): {{SCHEMA_STRUCTURE}}
Known expensive resolvers or operations: {{EXPENSIVE_OPERATIONS}}
Client types (internal frontend, third-party API consumers, etc.): {{CLIENT_TYPES}}

Instructions:
1. Design a cost-scoring formula appropriate to {{SCHEMA_STRUCTURE}} — a simple depth limit alone is often insufficient because it doesn't account for breadth (a shallow but very wide query with many list fields can be as expensive as a deep one); propose scoring that accounts for both depth and multiplicative list-field breadth (a list field's cost should multiply the cost of its selected sub-fields, since each item in the list incurs that sub-selection cost).
2. Assign higher cost weights to fields tied to {{EXPENSIVE_OPERATIONS}} specifically (e.g. a field that triggers an expensive database join or an external API call should cost more than a field reading from a simple cached lookup) — a uniform per-field cost misses the actual expense distribution across the schema.
3. Design where in the request lifecycle cost is calculated: ideally before execution begins (static analysis of the query AST against the cost model), not after resolvers have already started running, since the goal is to reject expensive queries before they consume resources, not just measure cost after the fact.
4. Design the threshold and its enforcement per {{CLIENT_TYPES}} — an internal frontend client making a known, reviewed set of queries may reasonably have a higher or different threshold than an untrusted third-party API consumer whose query shapes aren't controlled or reviewed.
5. Design the rejection response to be actionable, not just a bare error: tell the client roughly why the query was rejected (e.g. which part of the query contributed most to the cost) so legitimate clients can adjust their query rather than hitting an opaque wall.
6. Flag any part of {{SCHEMA_STRUCTURE}} where cost is genuinely hard to estimate statically (e.g. a field whose actual cost depends on runtime data not knowable from the query shape alone, like a search field with highly variable result-processing cost) — for these, note that static cost-scoring alone may need to be paired with a runtime safeguard (a hard execution timeout) rather than relying on pre-execution estimation alone.

Output format: Markdown with `## Cost Model` (the scoring formula and field-weight approach), `## Enforcement Point`, `## Threshold Strategy per Client Type`, `## Rejection Response Design`, and a `## Gaps` section for anything static analysis alone can't cover.
```

## Variables
- `{{SCHEMA_STRUCTURE}}` — the schema's key types and relationships, especially any list/connection fields that could be nested or requested at scale. Required.
- `{{EXPENSIVE_OPERATIONS}}` — which specific fields/resolvers are known to be disproportionately expensive (external calls, expensive joins, computed fields). Required — without this, the cost model defaults to uniform weighting, which usually doesn't reflect reality.
- `{{CLIENT_TYPES}}` — who queries this API and how trusted/reviewed their query patterns are. Required — threshold strategy depends heavily on this.

## Example
**Input:** `{{SCHEMA_STRUCTURE}}` = "User type has a `posts` connection (paginated list), each Post has a `comments` connection, each Comment has an `author` field (another User) — so queries can nest User -> posts -> comments -> author arbitrarily" `{{EXPENSIVE_OPERATIONS}}` = "The `comments` field triggers a non-indexed query on a large table; `author` on a Comment does an extra database round-trip not covered by existing batching" `{{CLIENT_TYPES}}` = "Internal frontend (reviewed queries) and a public third-party developer API (unreviewed)"

**Output (excerpt):**
```
## Cost Model
Base cost per field, multiplied through list/connection boundaries: a `posts` connection requesting N items multiplies the cost of everything selected under it by N (bounded by the query's actual `first`/`limit` argument, not an assumed max, to avoid over-penalizing a query that explicitly requests few items). `comments` gets a higher base weight given its non-indexed query cost; `author` on Comment gets an elevated weight given the extra un-batched round-trip, until that's fixed at the resolver level.

## Enforcement Point
Static cost calculation against the parsed query AST before execution begins, using each field's declared weight and the requested list sizes from query arguments — reject before any resolver runs if total estimated cost exceeds the client's threshold.

## Threshold Strategy per Client Type
Internal frontend: a generous threshold, since its queries are code-reviewed and won't change without a deploy — cost limiting here is a safety net for accidental regressions, not the primary defense. Third-party API: a materially stricter threshold, since these queries are unreviewed and adversarial-shape queries (deeply nested User->posts->comments->author chains) are the primary risk this design needs to prevent.

## Rejection Response Design
On rejection, return which specific field path contributed the most cost (e.g. "comments.author nested under posts exceeded the allowed multiplier") rather than a bare "query too expensive" — lets a legitimate third-party developer understand what to restructure.

## Gaps
Cost estimation here assumes list sizes come from explicit query arguments (first/limit) — if any connection field lacks enforced pagination arguments entirely, that's a separate, more urgent issue (unbounded list queries) to fix before cost-scoring alone can be relied on for that field.
```

## Tips & Variations
- If `{{EXPENSIVE_OPERATIONS}}` reveals that most of the cost concentration comes from a small number of specific resolvers, it's often worth fixing those resolvers directly (batching, caching, indexing) alongside — not instead of — adding cost-based protection; the cost model is a safety net, not a substitute for fixing genuinely fixable resolver inefficiency.
- For a schema that changes often, design the field-weight assignment to be a maintained, reviewable artifact (not a one-time calculation) — weights should be revisited whenever a new expensive field is added, similar to how `{{EXPENSIVE_OPERATIONS}}` needs updating over time.
- Pair with `graphql-resolver-performance-auditor` (coding, already shipped) when investigating why specific fields ended up in `{{EXPENSIVE_OPERATIONS}}` in the first place — that prompt diagnoses resolver-level performance; this one designs the query-level admission control built around those findings.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

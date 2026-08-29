---
id: n-plus-one-detector
title: N+1 Detector
category: coding
tags: [database, orm, performance]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Spots N+1 query patterns in ORM code (Active Record, Django ORM, Sequelize, Prisma, etc.) at the application code level — distinct from `graphql-schema-reviewer`'s schema-shape analysis and from `sql-query-optimizer`'s single-query tuning. For a codebase where the query pattern, not the query itself, is the problem.

## When to use it
- A page or endpoint is slow and you suspect it's issuing one query per row in a loop rather than a single batched query.
- Reviewing a PR that adds a loop over an ORM relationship, before it ships and causes a production slowdown under real data volume.
- Auditing a controller/service layer for N+1 patterns that unit tests wouldn't catch (since test fixtures are usually too small to expose the problem).

## The Prompt

```
You detect N+1 query patterns in ORM code — code that issues one additional query per item in a collection, instead of a single batched query — and show the fix using the ORM's actual batching mechanism.

Code: {{CODE}}
ORM/framework: {{ORM_FRAMEWORK}}

Instructions:
1. Trace every loop (explicit `for`/`each`, or implicit via template rendering/serialization) that accesses a relationship or associated field on each item — this is the core N+1 signature: fine in isolation, one extra query per iteration in aggregate.
2. For each N+1 found, state the specific triggering pattern (e.g., "accessing `.author` inside the loop over `posts` without eager-loading") and estimate query count growth (e.g., "1 query for posts + N queries for authors, where N = post count").
3. Distinguish real N+1s from queries that only look similar but aren't (e.g., a single query already using a join, or a loop that doesn't actually touch the database each iteration) — false positives erode trust in the review.
4. Provide the fix using the ORM's actual eager-loading/batching mechanism for this framework (e.g., `.includes()` in Active Record, `select_related`/`prefetch_related` in Django, `include` in Sequelize, `include` in Prisma) — not a generic "batch your queries" statement.
5. If eager-loading everything would over-fetch data that's rarely needed, note that tradeoff and suggest a more targeted fix (e.g., a dedicated query for just the needed fields) instead of blindly eager-loading the full relationship.
6. Check for the less obvious variant: an N+1 hidden behind a method call or serializer that itself queries per item, not just a directly visible loop over a relationship access.
7. If no N+1 pattern is present, say so plainly rather than inventing one.

Output format: Markdown, one entry per N+1 found: location, triggering pattern, estimated query growth, and the specific fix with corrected code.
```

## Variables
- `{{CODE}}` — the controller/service/view code to check. Required.
- `{{ORM_FRAMEWORK}}` — e.g. "Ruby on Rails / Active Record", "Django ORM", "Prisma". Required — the fix mechanism is framework-specific.

## Example
**Input:** `{{ORM_FRAMEWORK}}` = "Ruby on Rails / Active Record", `{{CODE}}` = `@posts.each { |post| render partial: 'post', locals: { author_name: post.author.name } }`.

**Output (excerpt):**
```
### N+1: `post.author` accessed in loop — location: the `.each` block
Triggering pattern: `post.author.name` is called once per post without eager-loading `author`. Estimated growth: 1 query for `@posts` + N queries (one per post) for `author`.

Fix:
```ruby
@posts = Post.includes(:author)
@posts.each { |post| render partial: 'post', locals: { author_name: post.author.name } }
```
`.includes(:author)` batches all authors into a single additional query instead of one per post.
```

## Tips & Variations
- Pair with actual query logs (e.g., Rails' `bullet` gem output, or a raw SQL log from a request) as additional evidence — real logs confirm the N+1 is happening in practice, not just in theory.
- For a GraphQL resolver layer instead of a traditional controller, this prompt still applies to the resolver's own ORM calls, but also see `graphql-schema-reviewer` for the schema-shape-level version of the same risk.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

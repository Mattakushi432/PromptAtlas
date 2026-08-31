---
id: natural-language-to-sql-query-drafter
title: Natural-Language-to-SQL Query Drafter
category: data-and-analysis
tags: [sql, data-analysis, code-generation]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Drafts a SQL query from a natural-language question against a described schema, with explicit assumptions called out — distinct from `sql-query-performance-reviewer` (data-and-analysis, still in backlog), which critiques an already-written query's performance rather than drafting a new one from a plain-language request.

## When to use it
- You know what question you want answered but don't want to hand-write the SQL, especially for a query with several joins or conditions.
- You're prototyping a query against an unfamiliar schema and want a first draft to check and adjust rather than starting from scratch.
- You want to check whether your own draft query actually matches your intended question, by having it independently re-derived from the plain-language request.

## The Prompt

```
You draft a SQL query from a natural-language question, given a schema description. You state every assumption you had to make explicitly — you do not silently guess at ambiguous business logic (e.g. what counts as an "active" user) and present the query as if the definition were certain.

Schema (tables, columns, relationships): {{SCHEMA}}
Question: {{QUESTION}}
SQL dialect: {{DIALECT}}

Instructions:
1. Identify every ambiguous term or business-logic decision in {{QUESTION}} that the schema alone doesn't resolve (e.g. "recent" — last 7 days? 30? "active" — logged in when? made a purchase?) and state the specific assumption you're making for each, rather than picking one silently.
2. Write the query using only tables/columns that exist in {{SCHEMA}} — if answering the question requires data not present in the schema, say so explicitly rather than fabricating a plausible-sounding column name.
3. Use joins appropriate to the described relationships (not a cross join or an assumed relationship not stated in the schema) — if the relationship between two needed tables isn't clear from {{SCHEMA}}, flag that rather than guessing the join condition.
4. Write the query in {{DIALECT}}-appropriate syntax (e.g. date functions, string concatenation, `LIMIT` vs `TOP` differ meaningfully across PostgreSQL/MySQL/SQL Server/BigQuery) rather than generic SQL that may not actually run.
5. For aggregate queries, be explicit about the grain of the result (one row per what?) since a subtly wrong `GROUP BY` is one of the most common sources of a technically-running-but-wrong query.
6. If the question is genuinely ambiguous enough that two meaningfully different queries could answer it, present both briefly rather than committing to one silently — better to surface the fork than to guess and be wrong.

Output format: the SQL query in a code block, preceded by a short "Assumptions" list for anything ambiguous, and followed by a one-line note on the result's grain (what one row represents).
```

## Variables
- `{{SCHEMA}}` — table names, columns, types, and how tables relate (foreign keys or described relationships). Required — a vague schema description produces a query full of guesses.
- `{{QUESTION}}` — the plain-language question to answer. Required.
- `{{DIALECT}}` — the specific SQL dialect (PostgreSQL, MySQL, BigQuery, SQL Server, etc.). Required — syntax differences matter for a query that actually runs.

## Example
**Input:** `{{SCHEMA}}` = "users(id, email, created_at, country); orders(id, user_id, amount, created_at, status)" `{{QUESTION}}` = "Which countries have the highest average order value from active customers this year?" `{{DIALECT}}` = "PostgreSQL"

**Output (excerpt):**
```sql
-- Assumptions:
-- 1. "active customers" interpreted as users with at least one order with status = 'completed' this year (schema has no explicit "active" flag)
-- 2. "this year" interpreted as the current calendar year (using CURRENT_DATE)
-- 3. "average order value" calculated only over orders with status = 'completed', to exclude cancelled/refunded orders from skewing the average

SELECT
  u.country,
  AVG(o.amount) AS avg_order_value
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE o.status = 'completed'
  AND o.created_at >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY u.country
ORDER BY avg_order_value DESC;
```
Grain: one row per country.
```

## Tips & Variations
- Always review the "Assumptions" list before running the query — this is the part most likely to diverge from what you actually meant, especially for business terms like "active" that don't have one universal definition.
- For a recurring reporting query rather than a one-off, once the assumptions are validated, save the finalized query rather than re-deriving it each time — this prompt is best for drafting and exploration, not as a substitute for a maintained reporting query.
- If the generated query is slow or looks structurally odd once run against real data volume, pair with `sql-query-performance-reviewer` (data-and-analysis, backlog) for a dedicated performance pass — this prompt optimizes for correctness and clarity, not query performance.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

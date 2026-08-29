---
id: schema-designer-from-requirements
title: Schema Designer from Requirements
category: coding
tags: [database, schema-design, data-modeling]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Designs a database schema — tables, columns, types, relationships, constraints — from a plain-language feature description. For starting new data modeling from scratch, distinct from optimizing an existing query or auditing normalization level.

## When to use it
- Starting a new feature or service and needing a first-draft schema before writing any migration.
- Translating a product requirements doc into a concrete data model that a team can review before committing to it.
- Reviewing whether a proposed schema actually supports all the access patterns the feature needs.

## The Prompt

```
You design a relational database schema from a feature description. Output concrete DDL-level detail, not an abstract entity list.

Feature description: {{FEATURE_DESCRIPTION}}
Known access patterns (how the data will actually be queried — optional but very high-value): {{ACCESS_PATTERNS}}
Database engine: {{DATABASE_ENGINE}}
Constraints (optional — e.g. "must integrate with an existing users table", "expect high write volume on X"): {{CONSTRAINTS}}

Instructions:
1. Identify the entities implied by the feature and design a table per entity, with columns, types, and nullability — choose types deliberately (don't default everything to a generic string/text) and justify any non-obvious type choice.
2. Model relationships explicitly: foreign keys with the correct cardinality (one-to-many, many-to-many via a join table, etc.), and specify ON DELETE behavior (CASCADE, RESTRICT, SET NULL) based on what makes sense for the actual data — don't default to CASCADE everywhere without considering whether it's safe.
3. Add constraints beyond just foreign keys: NOT NULL where a field is genuinely required, UNIQUE where the business rule demands it, CHECK constraints for simple invariants (e.g., a price must be non-negative) rather than leaving validation entirely to application code.
4. If {{ACCESS_PATTERNS}} is provided, verify the schema actually supports them efficiently — flag if a described access pattern would require a full scan or an awkward join given the proposed design, and adjust (e.g., add a denormalized column, a composite index) rather than leaving it as a known problem.
5. Recommend indexes for the access patterns given, beyond the ones implied by primary/foreign keys alone.
6. Flag any requirement in the feature description that's ambiguous about cardinality or ownership (e.g., "a project has members" — can a user belong to multiple projects, and is there a role per membership?) rather than silently picking an interpretation.
7. If {{CONSTRAINTS}} mentions integrating with existing tables, don't redesign those tables — only design what's new, and show exactly how new tables reference existing ones.

Output format: Markdown with a table per entity (columns, types, constraints) in DDL-adjacent form, followed by a relationship summary and index recommendations.
```

## Variables
- `{{FEATURE_DESCRIPTION}}` — what the feature needs to store and how entities relate. Required.
- `{{DATABASE_ENGINE}}` — e.g. "PostgreSQL 16", "MySQL 8". Required — type names and constraint syntax differ.
- `{{ACCESS_PATTERNS}}` — how the data will be queried in practice. Optional but sharply improves index/denormalization decisions.
- `{{CONSTRAINTS}}` — integration points or scale considerations. Optional.

## Example
**Input:** `{{FEATURE_DESCRIPTION}}` = "users can create projects and invite other users as members with a role (owner/editor/viewer)", `{{DATABASE_ENGINE}}` = "PostgreSQL 16".

**Output (excerpt):**
```
### projects
| Column | Type | Constraints |
|---|---|---|
| id | uuid | PRIMARY KEY |
| owner_id | uuid | NOT NULL, FK -> users(id) ON DELETE RESTRICT |
| name | text | NOT NULL |
| created_at | timestamptz | NOT NULL DEFAULT now() |

### project_members (join table)
| Column | Type | Constraints |
|---|---|---|
| project_id | uuid | NOT NULL, FK -> projects(id) ON DELETE CASCADE |
| user_id | uuid | NOT NULL, FK -> users(id) ON DELETE CASCADE |
| role | text | NOT NULL, CHECK (role IN ('owner','editor','viewer')) |
| PRIMARY KEY | (project_id, user_id) | — ensures a user can't be added to the same project twice |

**Note:** `projects.owner_id` uses `ON DELETE RESTRICT` rather than CASCADE — deleting a user who owns projects shouldn't silently delete those projects; ownership should be transferred first.
```

## Tips & Variations
- For a NoSQL/document store instead, this prompt's join-table modeling doesn't transfer directly — ask explicitly for embedded-vs-referenced document design tradeoffs instead.
- Once the schema is approved, feed it into `safe-migration-script-writer` to generate the actual migration rather than hand-writing DDL from this draft.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

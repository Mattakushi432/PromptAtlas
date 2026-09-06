---
id: data-dictionary-generator-from-schema-and-sample
title: Data Dictionary Generator from a Schema + Sample
category: data-and-analysis
tags: [documentation, data-modeling, data-analysis]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Drafts a human-readable data dictionary — one entry per column with a plain-language description, inferred value domain, and flagged caveats — from a table's schema plus a small sample of real rows, for documenting a table nobody wrote docs for.

## When to use it
- You inherited a database table or reporting view with no documentation and need a quick, readable reference before building on top of it.
- Onboarding a new analyst or engineer onto a dataset and want a starting-point data dictionary they can correct rather than write from scratch.
- Before exposing a table to a BI tool or external consumers, and want a first-pass description of every column to review and tighten.

## The Prompt

```
You draft a human-readable data dictionary for a database table, given its schema and a small sample of real rows.

Table name and schema (column names, types, and any stated constraints): {{SCHEMA}}
Sample rows (a handful of real or representative rows): {{SAMPLE_ROWS}}
Known business context, if any (what the table is for, who owns it): {{CONTEXT}}

For each column in {{SCHEMA}}, produce:
1. A one-sentence plain-language description of what the column represents, inferred from its name, type, and the values seen in {{SAMPLE_ROWS}} — write this for a reader unfamiliar with the table, not a restatement of the column name.
2. Its apparent value domain from {{SAMPLE_ROWS}} (e.g. an enum's observed values, a numeric range, a free-text field) — state "insufficient sample to determine" rather than guessing if {{SAMPLE_ROWS}} doesn't show enough variation.
3. A flagged caveat if something in {{SAMPLE_ROWS}} looks inconsistent with the column's stated type/constraint (e.g. a nullable column with no nulls in the sample — note this could just be sample size, not a guarantee; or a "boolean-looking" column stored as a string with inconsistent casing).
4. Whether the column looks like a primary key, foreign key, or derived/computed value, if inferable from naming convention or {{CONTEXT}} — mark this as an inference, not a confirmed fact, unless {{SCHEMA}} states it explicitly.

After the per-column dictionary, add a short "Open Questions" section listing anything a human reviewer should confirm before this dictionary is trusted (e.g. ambiguous column names, apparent inconsistencies, missing {{CONTEXT}}).

Output format: Markdown table with columns: Column, Description, Value Domain, Caveats, Key Type (inferred). Followed by the Open Questions list.
```

## Variables
- `{{SCHEMA}}` — table name, column names, types, and constraints. Required.
- `{{SAMPLE_ROWS}}` — a handful of real or representative rows. Required — this is the primary evidence for descriptions and caveats; without it, the dictionary is guesswork from names alone.
- `{{CONTEXT}}` — business context/ownership. Optional but improves description quality and key-type inference.

## Example
**Input:** `{{SCHEMA}}` = "Table: orders. Columns: order_id (uuid, not null), customer_id (uuid, not null), status (varchar(20), not null), total_cents (integer, not null), created_at (timestamp, not null), refunded_at (timestamp, nullable)." `{{SAMPLE_ROWS}}` = "3 rows: status values seen = 'pending', 'shipped', 'refunded'; total_cents ranges 999-45000; refunded_at is null in 2 of 3 rows, populated in the 'refunded' row." `{{CONTEXT}}` = "Owned by the orders team; feeds the finance revenue dashboard."

**Output (excerpt):**
```
| Column | Description | Value Domain | Caveats | Key Type (inferred) |
|---|---|---|---|---|
| order_id | Unique identifier for one customer order. | UUID, unique per row (inferred from naming, not directly confirmable from a 3-row sample). | None observed. | Primary key (inferred from name + not-null + uniqueness convention). |
| customer_id | Identifies which customer placed the order. | UUID. | None observed. | Foreign key to a customers table (inferred — not stated in schema). |
| status | Current lifecycle state of the order. | Observed: pending, shipped, refunded. Insufficient sample to confirm this is the complete enum — likely also includes states like "cancelled" or "delivered" not seen in these 3 rows. | None observed beyond sample-size limitation. | Not a key. |
| total_cents | Order total in cents (minor currency unit). | Observed range: 999-45000 (i.e. $9.99-$450.00). | Column name implies cents, not dollars — confirm this convention holds consistently before using in the finance dashboard. | Not a key. |
| refunded_at | Timestamp when the order was refunded, if applicable. | Null for non-refunded orders; populated for the 'refunded'-status row in the sample. | Correlates with status = 'refunded' in this sample — worth confirming this is enforced (e.g. via a constraint or application logic) rather than coincidental. | Not a key. |

### Open Questions
- Is total_cents' "cents" naming convention consistent across all monetary columns in this schema, or specific to this table?
- Does status have a fixed enum constraint at the database level, or is "pending/shipped/refunded" just what appeared in this small sample?
- Confirm customer_id's foreign-key target table with the orders team, since {{SCHEMA}} doesn't state it explicitly.
```

## Tips & Variations
- Pair with `dashboard-metric-definition-auditor` (data-and-analysis, already shipped) once metrics get built on top of this table — that prompt catches ambiguous *metric* definitions, while this one documents the underlying *columns* those metrics are computed from.
- The more rows given in {{SAMPLE_ROWS}}, the more reliable the value-domain and caveat sections — a 3-row sample (as in the example) is enough to demonstrate the format but should be treated as a draft to verify against a larger export before trusting it fully.
- If {{SCHEMA}} includes columns this prompt can't confidently interpret even with a sample (e.g. an opaque JSON blob column), it's fine for the dictionary to say so plainly rather than fabricate a plausible-sounding description.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

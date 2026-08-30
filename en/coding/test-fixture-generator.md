---
id: test-fixture-generator
title: Test Fixture Generator
category: coding
tags: [testing, fixtures, mock-data]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.1
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Generates a handful of realistic mock/fixture data matching a given schema — for one test case or a quick local check — instead of hand-writing sample objects one by one. For a developer who needs plausible data at small scale, not a data-generation library setup. For populating a whole local/demo environment at volume with cross-table relationships intact, see `test-data-seeder-designer` instead.

## When to use it
- Writing a test that needs several realistic records (users, orders, products) and hand-authoring each is tedious.
- Needing a small batch of realistic-looking records for a quick local check, not a fully seeded environment.
- Needing edge-case fixtures deliberately (empty strings, boundary numbers, unicode names) to stress-test validation logic.

## The Prompt

```
You generate realistic test fixture data matching a schema. The data should look like it could plausibly exist in production — varied, not obviously fake or repetitive — while strictly conforming to the schema's types and constraints.

Schema (JSON Schema, TypeScript interface, database DDL, or a description): {{SCHEMA}}
Number of records: {{RECORD_COUNT}}
Special requirements (optional — e.g. "include 2 records with edge-case values", "dates should span the last year", "names should include non-Latin scripts"): {{SPECIAL_REQUIREMENTS}}

Instructions:
1. Strictly conform to the schema: correct types, respect required/optional fields, respect any enums, min/max, or format constraints (email format, UUID format, etc.).
2. Make the data varied and realistic — different names, plausible value ranges, no obviously sequential/fake-looking patterns (avoid "Test User 1", "Test User 2" unless explicitly asked for placeholder-style data).
3. Maintain any implied referential relationships (e.g., if a field is clearly a foreign key referencing another entity type also being generated, keep the IDs consistent).
4. If {{SPECIAL_REQUIREMENTS}} asks for edge cases, generate those as a clearly-labeled separate subset, not blended invisibly into the "normal" records.
5. Never generate data that looks like real people's actual PII (use clearly fictional but plausible-sounding names, not real celebrities or public figures).
6. Output in the format implied by the schema type (JSON array for JSON Schema/TS interface, SQL INSERT statements for DDL) unless a different output format is requested.
```

## Variables
- `{{SCHEMA}}` — the data shape to generate against. Required.
- `{{RECORD_COUNT}}` — how many records to generate. Required.
- `{{SPECIAL_REQUIREMENTS}}` — edge cases, distributions, or constraints beyond the schema itself. Optional.

## Example
**Input:** `{{SCHEMA}}` = TypeScript interface `{ id: string; email: string; age: number; plan: 'free' | 'pro' }`, `{{RECORD_COUNT}}` = 3, `{{SPECIAL_REQUIREMENTS}}` = "include one edge case with age at the minimum allowed value (13)".

**Output (excerpt):**
```json
[
  { "id": "usr_4f1a2c", "email": "priya.nandan@example.com", "age": 34, "plan": "pro" },
  { "id": "usr_9b7e10", "email": "marcus.oduya@example.com", "age": 13, "plan": "free" },
  { "id": "usr_2d88f3", "email": "lena.vogt@example.com", "age": 61, "plan": "free" }
]
```

## Tips & Variations
- For load/perf testing, ask for a much larger `{{RECORD_COUNT}}` with an explicit note to keep the output as compact JSON (no pretty-printing) to stay within response limits.
- Pin down a `{{SPECIAL_REQUIREMENTS}}` set of adversarial inputs (max-length strings, SQL-special characters, emoji) when the goal is fuzzing validation logic rather than realistic seed data.

## Changelog
- 1.0.1 (2026-08-30): Narrowed scope to small-batch fixtures to remove overlap with the newer `test-data-seeder-designer`, which now owns whole-environment seeding at volume.
- 1.0.0 (2026-08-29): Initial version.

---
id: test-data-seeder-designer
title: Local/Demo Environment Test Data Seeder Designer
category: coding
tags: [testing, developer-experience, seed-data]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Designs a seed-data script that populates a local or demo environment with a realistic, referentially-consistent volume of data. Distinct from `test-fixture-generator`, which produces small, targeted fixture data for one specific unit/integration test case: this is for populating a whole environment for manual exploration, demos, or local development, at a larger scale, with cross-table relationships intact.

## When to use it
- A fresh local environment starts completely empty, and manual data entry to get it usable is tedious.
- Preparing a demo environment that needs to look genuinely realistic, not just technically non-empty.
- Onboarding — pair this with `local-env-bootstrap-generator`'s environment setup so a new developer gets a populated environment, not just a running one.

## The Prompt

```
You are designing a seed-data script for a local or demo environment — not a targeted fixture for one specific test case, and not production data migration.

Schema description (tables/models and their relationships): {{SCHEMA_DESCRIPTION}}

Volume and realism needs (how much data is needed, and whether it must look genuinely realistic for a demo audience versus just be non-empty for development): {{VOLUME_AND_REALISM_NEEDS}}

Design a seed script (or describe its structure clearly enough to implement) that:
1. Creates records in dependency order — parents before children, respecting foreign key constraints, rather than assuming the database will silently sort it out.
2. Generates internally consistent data — an order's line items reference products that actually exist in the seeded product set; a user's orders reference that same seeded user; no orphaned or dangling references.
3. Varies the data enough to exercise realistic states, not just N identical happy-path records — include some empty states (a user with zero orders), some large collections (a user with many orders), and enough variety in field values that the environment doesn't look artificially uniform.
4. Is idempotent and safely re-runnable — running it again against an already-seeded database shouldn't fail on unique-constraint violations or silently create duplicate data; it should either skip existing records or clear-and-reseed explicitly, and say which approach it takes.

Output: the seed script structure (real code if the target language/ORM is clear from `{{SCHEMA_DESCRIPTION}}`, otherwise clear pseudocode), plus a short note on what specifically makes the generated data realistic rather than merely present.

If the schema has a genuinely large number of interdependent tables, propose seeding in explicit, named dependency-ordered phases (e.g., "phase 1: users and products, no dependencies; phase 2: orders, depends on phase 1") rather than one flat, undifferentiated script — this makes partial failures much easier to debug.
```

## Variables
- `{{SCHEMA_DESCRIPTION}}` — the tables/models and their relationships. Required.
- `{{VOLUME_AND_REALISM_NEEDS}}` — how much data and how realistic it needs to look. Required — a quick dev-only seed and a stakeholder-facing demo seed have very different bars.

## Example
**Input:** `{{SCHEMA_DESCRIPTION}}` = "users, products, orders (belongs to user), order_items (belongs to order, references product)", `{{VOLUME_AND_REALISM_NEEDS}}` = "needs to look realistic for a sales demo — around 20 users, 50 products, varied order histories".

**Output (excerpt):**
```
Phase 1 (no dependencies): seed 50 products with varied names/prices/categories — avoid "Product 1", "Product 2" naming, since this is demo-facing; use a realistic-sounding name generator or a curated static list.

Phase 2 (depends on phase 1): seed 20 users, then for each user generate a varied number of orders (weight toward 2-5 orders per user, but include at least 2 users with zero orders and 1 "power user" with 15+ orders, so the demo shows realistic distribution rather than uniform data).

Phase 3 (depends on phase 2): for each order, generate 1-4 order_items referencing products from the phase-1 set only — never a randomly generated product ID that might not exist.

Idempotency: this script checks for an existing seed marker record before running and exits early with a message if already seeded, rather than either failing on duplicate unique constraints or silently doubling the data — re-running requires an explicit `--reset` flag that truncates and reseeds intentionally.
```

## Tips & Variations
- For a demo environment specifically, ask it to also vary timestamps realistically (orders spread across the last several months, not all created at the exact seed-run moment) — an all-identical-timestamp dataset is a common tell that data is seeded rather than real.
- Pair directly with `local-env-bootstrap-generator` — that prompt sets up the running environment; this one populates it, and the two outputs can be wired into the same setup script.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

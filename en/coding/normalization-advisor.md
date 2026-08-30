---
id: normalization-advisor
title: Normalization Advisor
category: coding
tags: [databases, normalization, data-modeling]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.1
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Recommends how normalized (or deliberately denormalized) a given data model should be, based on its actual read/write patterns — not a textbook recitation of normal forms. For a specific schema decision, distinct from full schema design or query optimization.

## When to use it
- Deciding whether to normalize a repeated piece of data into its own table or leave it duplicated for read performance.
- Reviewing a schema that feels "off" — either overly normalized (too many joins for a simple read) or overly flat (update anomalies from duplicated data) — and wanting a clear recommendation.
- Explaining to a junior developer why a specific denormalization choice is deliberate rather than sloppy.

## The Prompt

```
You recommend a normalization level for a specific data model, based on its actual read/write patterns — not a generic "always normalize to 3NF" rule.

Data model (tables/fields, or a description of the entities and their relationships): {{DATA_MODEL}}
Read/write pattern (how this data is actually queried and updated, and roughly how often each): {{ACCESS_PATTERN}}

Instructions:
1. Identify any current or proposed denormalization (duplicated data, a value stored in multiple places) and any current over-normalization (data split across tables in a way that every common read requires multiple joins).
2. For each duplicated field, name the specific update anomaly risk it creates: what breaks if the duplicated copies get out of sync, and how likely that is given the actual write pattern (a field that's written in exactly one place is lower risk than one updated from several code paths).
3. For each highly-normalized relationship causing read overhead, weigh the join cost against the write-consistency benefit given the actual read frequency — a rarely-read, frequently-written relationship should usually stay normalized; a frequently-read, rarely-written one is a reasonable denormalization candidate.
4. Make a specific recommendation per field/relationship, not a single "normalize everything" or "denormalize everything" verdict — most real schemas are a deliberate mix.
5. If recommending denormalization, specify how consistency will be maintained (a database trigger, an application-level write path that updates both copies, a periodic reconciliation job) — denormalizing without a consistency plan is the actual anti-pattern, not denormalization itself.
6. If the access pattern isn't provided, ask for it as the single most important missing piece of information, since normalization tradeoffs can't be judged without it — but give a conservative default recommendation (favor normalization) in the meantime.

Output format: Markdown, one entry per field/relationship in question, with a clear recommendation (normalize / denormalize / keep as-is) and the reasoning tied to the stated access pattern.
```

## Variables
- `{{DATA_MODEL}}` — the schema or entity/relationship description in question. Required.
- `{{ACCESS_PATTERN}}` — how the data is actually read and written, and roughly how often. Required — without this, normalization advice is generic.

## Example
**Input:** `{{DATA_MODEL}}` = "orders table stores `customer_name` and `customer_email` directly, duplicated from the customers table, instead of just a `customer_id` foreign key", `{{ACCESS_PATTERN}}` = "order history is read constantly (customer support, reporting); customer email changes are rare but happen".

**Output (excerpt):**
```
### `orders.customer_name` / `orders.customer_email` (duplicated from `customers`)
Recommendation: keep denormalized, with a caveat.
This is defensible: order history should show the customer's name/email AS THEY WERE AT THE TIME OF THE ORDER, not their current values — an order is a historical record, and orders read far more often than customer emails change. This isn't really "denormalization risk," it's intentional point-in-time snapshotting.
Caveat: make sure this is actually the intended semantics (a support agent might expect to see the CURRENT email, not the historical one) — confirm with product before treating this as settled.
```

## Tips & Variations
- For a NoSQL document store, reframe the question as embedding vs. referencing rather than table normalization — the underlying tradeoff (read convenience vs. update consistency) is the same, but the mechanism differs.
- If evaluating an entire schema rather than one field, run this per relationship rather than trying to get one holistic verdict — normalization decisions are local, not global.

## Changelog
- 1.0.1 (2026-08-30): Normalized tag from `database` to canonical `databases` (see `docs/tags.md`).
- 1.0.0 (2026-08-29): Initial version.

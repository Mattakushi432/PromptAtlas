---
id: sharding-strategy-advisor
title: Sharding Strategy Advisor
category: coding
tags: [databases, scalability, data-modeling]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Recommends a horizontal sharding/partitioning key and strategy (hash, range, or directory-based) given a table's growth projection and query access patterns, and flags which of your existing queries would become expensive or impossible cross-shard queries under a candidate key — distinct from `normalization-advisor` (coding, already shipped)'s single-node schema-shape focus and `multi-tenant-isolation-reviewer` (coding, already shipped)'s data-leakage focus, neither of which addresses horizontal scale-out.

## When to use it
- A table is projected to outgrow a single database instance and you need to choose a shard key before write volume forces a rushed decision.
- You're evaluating a sharding proposal someone else wrote and want to stress-test it against your actual query patterns before committing to it (shard keys are expensive to change later).
- You're deciding between hash-based, range-based, and directory/lookup-based sharding for a specific workload and want the tradeoffs made concrete against your data, not generic pros/cons.

## The Prompt

```
You are a database architect recommending a sharding strategy. You optimize for the fewest cross-shard queries on the workload's hottest access patterns, not textbook sharding theory in the abstract.

Table/entity and its schema: {{TABLE_SCHEMA}}
Growth projection (current size, rate, and time horizon): {{GROWTH_PROJECTION}}
The application's actual query patterns, ranked by frequency: {{QUERY_PATTERNS}}
Candidate shard keys under consideration (if any): {{CANDIDATE_KEYS}}

Instructions:
1. Propose 1-2 shard key candidates (or evaluate {{CANDIDATE_KEYS}} if given) and, for each, classify every query in {{QUERY_PATTERNS}} as single-shard (fast, routes cleanly to one shard), scatter-gather (must fan out to all/most shards), or impossible-as-written (requires a cross-shard join/transaction the database can't do atomically).
2. For each candidate key, recommend hash-based, range-based, or directory/lookup-based partitioning specifically for that key, and state the concrete tradeoff: hash gives even write distribution but kills range scans; range enables efficient range queries but risks hot shards from sequential/time-based keys; directory-based adds a lookup-service dependency but allows rebalancing without changing the key.
3. Flag hotspot risk explicitly: if a candidate key has a skewed value distribution (e.g. one tenant/customer dominating volume, or a monotonically increasing key like a timestamp or auto-increment ID under range sharding), name the resulting hot shard risk.
4. Identify which of the highest-frequency queries in {{QUERY_PATTERNS}} would become scatter-gather or impossible under each candidate — this is usually the deciding factor, more than growth projection alone.
5. Address resharding: state how painful changing the key later would be given {{GROWTH_PROJECTION}}'s timeline, and whether the recommended approach supports adding shards without a full re-key (e.g. consistent hashing vs. a fixed modulo scheme).
6. Give a final recommendation: shard key, partitioning method, and the specific queries that will need to change (denormalization, application-side fan-out, or a secondary index/lookup table) as a result.

Output format: Markdown. A table of candidate keys × {{QUERY_PATTERNS}} classification (single-shard/scatter-gather/impossible). Below it, the final recommendation with rationale, hotspot risk called out explicitly, and the specific query/application changes required.
```

## Variables
- `{{TABLE_SCHEMA}}` — the table/entity's schema, including its natural identifiers and foreign-key relationships. Required.
- `{{GROWTH_PROJECTION}}` — current row count/size, growth rate, and the time horizon being planned for. Required — sharding decisions are relative to a timeline, not an abstract "big enough" threshold.
- `{{QUERY_PATTERNS}}` — the actual read/write query patterns hitting this table, ranked by frequency or importance. Required — this is what makes the recommendation concrete rather than generic.
- `{{CANDIDATE_KEYS}}` — shard keys already under consideration, if any. Optional; if omitted, the prompt proposes candidates from the schema.

## Example
**Input:** `{{TABLE_SCHEMA}}` = "orders(id, customer_id, region, created_at, status, total)" `{{GROWTH_PROJECTION}}` = "40M rows now, growing 15M/month, must handle 3 years at current rate" `{{QUERY_PATTERNS}}` = "1) get orders for a customer (very high frequency), 2) get today's orders across all customers for fraud review (high frequency), 3) get orders in a date range for a region (medium frequency)" `{{CANDIDATE_KEYS}}` = "customer_id, created_at"

**Output (excerpt):**
```
| Candidate key | Query 1 (by customer) | Query 2 (today, all customers) | Query 3 (date range + region) |
|---|---|---|---|
| customer_id (hash) | single-shard | scatter-gather (all shards) | scatter-gather |
| created_at (range) | scatter-gather (customer's orders spread across time-based shards) | single-shard (recent shard) | single-shard-ish (one or two adjacent shards) |

### Recommendation: hash-sharded on customer_id
Query 1 is your highest-frequency pattern and must stay fast — hash-sharding on customer_id makes it single-shard while created_at-range sharding would scatter every customer's order history across shards as it ages.

Hotspot risk: low for customer_id under hash sharding, since hashing distributes even a skewed customer-size distribution across shards evenly at the row level — unlike range-sharding on created_at, which would concentrate all writes on the single "current time" shard.

Required changes: Query 2 (today's orders across all customers) becomes scatter-gather under this key — fine at high frequency but not free; consider a separate time-partitioned fraud-review table fed by change-data-capture rather than querying the sharded orders table directly. Query 3 also becomes scatter-gather; if region-level reporting is frequent enough to matter, add a secondary read-optimized store rather than re-keying orders.

Resharding: use consistent hashing (not fixed modulo) so shards can be added later without rehashing the full dataset — given the 3-year growth horizon, this will very likely be needed at least once.
```

## Tips & Variations
- If {{QUERY_PATTERNS}} shows most traffic is single-shard-friendly under the obvious key but one dashboard/reporting query is scatter-gather, don't let that one query drive the shard key choice — route it to a separate analytics store instead, per the recommendation's "required changes" section.
- Distinct from `normalization-advisor` (coding, already shipped): that prompt decides how to shape the schema on a single node; this one decides how to split an already-shaped schema across nodes. Run normalization first if the schema itself isn't settled yet.
- For multi-tenant systems specifically, also run `multi-tenant-isolation-reviewer` (coding, already shipped) after picking a shard key — tenant-based sharding has isolation implications (a tenant's shard placement itself can leak information) that this prompt doesn't cover.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

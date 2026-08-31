---
id: full-text-search-index-designer
title: Full-Text Search Index Designer
category: coding
tags: [databases, search, data-modeling]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Designs a full-text search approach — native database full-text indexing versus a dedicated search engine — and the specific index/relevance strategy for a described dataset and query needs (typo tolerance, faceting, ranking signals), for when you're building a search feature from scratch rather than optimizing one known-slow query, which is `sql-query-optimizer` (coding, already shipped)'s job.

## When to use it
- You're adding a search feature to an app and need to decide whether your existing database's full-text capabilities are enough or you need a dedicated search engine, before building either.
- You've outgrown `LIKE '%term%'` queries and want a concrete plan for what replaces them, sized to your actual data volume and query needs rather than the biggest tool available.
- You're designing the index/field/ranking configuration for a search engine you've already chosen and want it matched to your specific ranking and faceting requirements.

## The Prompt

```
You design a full-text search solution matched to the described dataset and query requirements — you don't default to recommending a dedicated search engine when the database's native full-text search would genuinely suffice, and you don't default to native search when the requirements clearly need a dedicated engine.

Dataset being searched (fields, approximate volume, update frequency): {{DATASET}}
Search requirements (typo tolerance, faceting/filtering, ranking signals needed, multi-language support): {{SEARCH_REQUIREMENTS}}
Current database in use: {{CURRENT_DATABASE}}
Expected query volume and latency requirement: {{QUERY_VOLUME}}

Instructions:
1. Decide native full-text index (e.g. Postgres tsvector/GIN, MySQL FULLTEXT) vs. a dedicated search engine (e.g. Elasticsearch, Meilisearch, Typesense, Algolia) based on {{SEARCH_REQUIREMENTS}} — state explicitly which requirement(s), if any, native search cannot satisfy (typo tolerance/fuzzy matching, complex faceted filtering at scale, sub-100ms latency at high query volume, relevance tuning beyond basic ranking) and which are satisfied either way.
2. If native full-text search is recommended, specify the concrete index type and configuration for {{CURRENT_DATABASE}} (e.g. a generated tsvector column with a GIN index and which fields feed it, with what weighting).
3. If a dedicated engine is recommended, specify: which fields are indexed vs. stored-only, the analyzer/tokenizer choice relevant to {{SEARCH_REQUIREMENTS}}'s language needs, and how the engine's index stays in sync with {{CURRENT_DATABASE}} (dual-write, change-data-capture, or periodic reindex) — sync strategy is a real operational cost, not an afterthought.
4. Design the ranking approach: which fields/signals from {{SEARCH_REQUIREMENTS}} contribute to relevance (text match, recency, popularity, explicit boost fields) and roughly how they should be weighted relative to each other.
5. If faceting/filtering is required, specify which fields need to be filterable/aggregatable and confirm the chosen approach supports combining full-text relevance ranking with structured filters efficiently (not a full-text search followed by an application-side filter pass, which doesn't scale).
6. Flag the specific tradeoff of the recommendation given {{QUERY_VOLUME}}: added infrastructure/ops cost for a dedicated engine, or a search-quality ceiling for staying native.

Output format: Markdown. A one-paragraph recommendation (native vs. dedicated engine, with the deciding requirement named). Below it: index/field configuration, sync strategy (if applicable), ranking design, and the explicit tradeoff being accepted.
```

## Variables
- `{{DATASET}}` — the fields being searched, approximate record volume, and how often the data changes. Required.
- `{{SEARCH_REQUIREMENTS}}` — the specific search capabilities needed: typo tolerance, faceted filtering, ranking signals, language support. Required — this is what determines native vs. dedicated engine.
- `{{CURRENT_DATABASE}}` — the database already in use, since native full-text capabilities differ significantly by database. Required.
- `{{QUERY_VOLUME}}` — expected search query volume and any latency requirement. Optional but sharpens the infrastructure-cost tradeoff discussion.

## Example
**Input:** `{{DATASET}}` = "products table: name, description, category, brand — 80,000 rows, updated a few times per day" `{{SEARCH_REQUIREMENTS}}` = "typo tolerance needed (users misspell brand names), faceted filtering by category/brand/price range, no multi-language requirement" `{{CURRENT_DATABASE}}` = "PostgreSQL 15" `{{QUERY_VOLUME}}` = "~500 searches/day, no strict latency SLA"

**Output (excerpt):**
```
Recommendation: use a dedicated search engine (Meilisearch or Typesense) rather than Postgres's native full-text search. The deciding requirement is typo tolerance — Postgres's tsvector/GIN full-text search does prefix and stemmed matching but has no built-in fuzzy/typo-tolerant matching without significant custom work (trigram extensions help but don't match dedicated engines' out-of-the-box typo handling). At 80,000 rows and ~500 searches/day, this is well within a lightweight engine like Meilisearch's comfortable range, so the added infrastructure is proportionate rather than overkill.

Index configuration: index name, description, brand as searchable text fields (brand weighted higher, since brand misspellings are the stated pain point); category, brand, and a price-range bucket as filterable/facetable attributes.

Sync strategy: given updates happen only a few times per day at this volume, a scheduled reindex (e.g. every 15 minutes or on-write via a simple background job) is sufficient — full change-data-capture infrastructure would be disproportionate to this update frequency.

Ranking: primary signal is text-match relevance (brand and name matches ranked above description-only matches); no strong case for a popularity/recency boost given the requirements described — add one later only if search results feel misranked in practice.

Tradeoff accepted: an added service to operate (even a lightweight one) versus staying fully in Postgres — justified here specifically because typo tolerance was a named, non-negotiable requirement.
```

## Tips & Variations
- If {{SEARCH_REQUIREMENTS}} has no typo-tolerance or complex-faceting needs and {{DATASET}} is small, push back toward native search even if a dedicated engine "would also work" — the sync-strategy and extra-service operational cost is real and shouldn't be paid without a requirement that needs it.
- Use `sql-query-optimizer` (coding, already shipped) instead of this prompt when the actual problem is one specific slow query against an existing schema, not designing a search feature's architecture from scratch.
- For search over user-generated or moderated content, also consider whether ranking needs a manual-override/pinning mechanism (e.g. promoted results) — this prompt's ranking design step covers algorithmic signals but flag explicitly if editorial override is also a requirement, since it changes the index/ranking design meaningfully.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

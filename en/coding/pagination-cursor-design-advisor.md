---
id: pagination-cursor-design-advisor
title: API Pagination Cursor Design Advisor
category: coding
tags: [backend, api-design, pagination]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Designs a cursor-based pagination scheme for a specific data-access pattern — cursor encoding, tie-breaking, and stability under concurrent inserts/deletes — before an endpoint ships. Distinct from `api-contract-consistency-reviewer`, which checks that an existing API's pagination *style* is applied consistently across endpoints, not how to design a new cursor's actual mechanics from scratch.

## When to use it
- Building a new paginated list endpoint and deciding between offset and cursor pagination.
- Already committed to cursor pagination and need to design what the cursor actually encodes.
- A paginated list is showing duplicate or skipped items when rows are inserted/deleted while a user pages through it.

## The Prompt

```
You are designing the actual mechanics of a cursor-based pagination scheme for a specific endpoint — not just recommending "use cursor pagination" as a category, the concrete design of what the cursor contains and how it behaves.

Sort order (what the list is sorted by): {{SORT_ORDER}}

Data mutability (optional — how often rows are inserted or deleted in this data set while a user might realistically be paging through it, e.g., a mostly-static catalog vs. a live activity feed): {{DATA_MUTABILITY}}

Design:
1. What the cursor should encode — typically the sort key's value at the last item of the current page, plus a tie-breaker (a unique, stable ID) rather than a simple offset/index, so pagination remains stable as rows are inserted or deleted elsewhere in the set (an offset-based scheme skips or duplicates items under concurrent mutation; a properly designed cursor does not).
2. Explicit tie-breaking if the primary sort key isn't guaranteed unique — e.g., sorting by `created_at` where multiple rows can share the exact same timestamp; without a tie-breaker, rows with identical sort-key values can be skipped or duplicated across pages.
3. What happens to a user's pagination if rows are inserted or deleted ahead of their current cursor position while they're paging, given `{{DATA_MUTABILITY}}` — state the actual guarantee this design provides (e.g., "a properly encoded cursor will not skip or duplicate previously-seen items, but a newly inserted item ahead of the cursor may or may not appear depending on where it sorts relative to the cursor position — state which").
4. Whether the cursor should be opaque (e.g., base64-encoded, not meant to be parsed or constructed by the client) so the internal encoding can change later without breaking API consumers who might otherwise come to depend on its literal structure.

Output: the cursor design (what it encodes and how it's constructed/decoded), a concrete example cursor value and what it represents, and an explicit statement of what stability guarantee this gives under the described data mutability.

If `{{SORT_ORDER}}` isn't on an indexed column, flag that as a separate performance problem independent of the pagination design itself — cursor pagination correctness doesn't fix a missing index, and an unindexed sort will be slow regardless of how well the cursor is designed.
```

## Variables
- `{{SORT_ORDER}}` — what the paginated list is sorted by. Required.
- `{{DATA_MUTABILITY}}` — how often the underlying data changes while a user might be paging through it. Optional; without it, the design defaults to assuming meaningful mutability and designs for stability regardless.

## Example
**Input:** `{{SORT_ORDER}}` = "sorted by `created_at` descending (newest first)", `{{DATA_MUTABILITY}}` = "a live activity feed — new rows are inserted constantly, existing rows are never deleted".

**Output (excerpt):**
```
Cursor encoding: the cursor should encode (created_at, id) of the last item on the current page — created_at alone isn't sufficient since multiple activity events can share the same timestamp at high insert rates, so id serves as the tie-breaker (assuming id is a monotonically increasing or otherwise stable unique value). Example cursor (before opaque-encoding): {"created_at": "2026-08-30T14:22:01.500Z", "id": 48213} — base64-encode this JSON so the client treats it as an opaque token.

Query construction: the next page's query becomes `WHERE (created_at, id) < (:cursor_created_at, :cursor_id) ORDER BY created_at DESC, id DESC LIMIT :page_size` — the compound comparison (not two separate WHERE conditions) is what correctly handles the tie-breaking case.

Stability guarantee: since this is an insert-only feed (per the stated data mutability) sorted newest-first, new rows are always inserted "ahead of" (newer than) any cursor position a user currently holds — a user paging backward in time will never see a duplicate or skip a previously-seen item, and won't see newly-inserted items appear retroactively in already-fetched pages, since those pages only ever contain items older than the cursor at fetch time.

Indexing note: this pagination design requires a composite index on (created_at, id) to perform well — confirm this index exists, since an unindexed sort on a large, constantly-growing feed table will be slow independent of how correct the cursor logic above is.
```

## Tips & Variations
- For a mostly-static data set (`{{DATA_MUTABILITY}}` indicates low mutation), the correctness guarantees matter less in practice, but designing for them anyway costs little extra and future-proofs the endpoint if mutability assumptions change later.
- If the API needs bidirectional pagination (both "next" and "previous"), ask it to explicitly address whether the same cursor encoding supports reversing direction cleanly, or whether a separate "previous cursor" needs to be returned alongside the "next cursor" in each page's response.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

---
id: microservice-boundary-advisor
title: Microservice Boundary Advisor
category: coding
tags: [architecture, microservices, system-design]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Proposes where to draw service boundaries when splitting a monolith into separately deployable services, based on data ownership and coupling — not a module/file split within one deployment (see `monolith-decomposition-planner` for that). For a team seriously evaluating a services split, not chasing microservices as a trend.

## When to use it
- A monolith has grown to the point where teams are blocked on each other's deploys and a services split is being seriously considered.
- Scaling a specific part of the system independently (e.g., a write-heavy ingestion path) requires it to be deployable separately from the rest.
- Evaluating whether a proposed service boundary is actually sound before committing engineering months to the split.

## The Prompt

```
You are proposing service boundaries for splitting a monolith into separately deployable services — this is about deployment/data/team boundaries, not just code organization within one deployable unit.

Monolith description (domains/modules, how they currently interact, data model overview): {{MONOLITH_DESCRIPTION}}
Reason for considering a split (optional — e.g. "team scaling", "independent deploy cadence needed", "one module needs different scaling characteristics"): {{SPLIT_MOTIVATION}}
Constraints (optional — e.g. "must support a gradual migration, not a big-bang cutover", "team size/count"): {{CONSTRAINTS}}

Instructions:
1. Identify candidate bounded contexts based on the domain model: group functionality by what data it owns and changes together, using the language of the business domain, not technical layers (not "the database layer" as a service).
2. For each candidate service, state: its core responsibility, what data it owns (and would become the source of truth for), and what it would need to expose to other services (API/events).
3. Explicitly flag any boundary that would require synchronous calls across services for a single user-facing operation to complete — this is a warning sign, not automatically disqualifying, but it should be named and its latency/failure-mode cost acknowledged.
4. Flag any data that multiple candidate services would need to read or write — this needs a clear ownership decision (one service owns it and others call it, or it's genuinely duplicated with a defined sync strategy) rather than being left ambiguous.
5. Consider team boundaries if given: a service split that doesn't align with how teams are organized tends to create more coordination overhead, not less (Conway's Law) — flag this mismatch if present.
6. If {{SPLIT_MOTIVATION}} suggests the actual problem doesn't require a services split (e.g., the real issue is deploy pipeline speed, or database contention that could be solved with better indexing/caching), say so directly rather than designing a split for its own sake.
7. If {{CONSTRAINTS}} requires gradual migration, sequence the boundaries: which service should be extracted first (usually the most isolated, least chatty with the rest) and why.

Output format: Markdown with sections: Proposed Service Boundaries (each with responsibility/data ownership/interfaces), Cross-Service Coupling Risks, Recommendation (including whether a split is actually warranted).
```

## Variables
- `{{MONOLITH_DESCRIPTION}}` — the current system's domains, modules, and how they interact. Required.
- `{{SPLIT_MOTIVATION}}` — why a split is being considered. Optional but sharpens the recommendation.
- `{{CONSTRAINTS}}` — migration approach, team structure, or other limits. Optional.

## Example
**Input:** `{{MONOLITH_DESCRIPTION}}` = an e-commerce monolith with order processing, inventory, and notifications tightly coupled through shared database tables, `{{SPLIT_MOTIVATION}}` = "notifications needs independent scaling during flash sales".

**Output (excerpt):**
```
### Proposed Service Boundaries
1. **Notification Service** — Owns: notification templates, delivery status, send history. Responsibility: send order/inventory-related notifications via email/SMS/push. Needs: an event feed from Order and Inventory services (e.g., `order.confirmed`, `inventory.low`) rather than direct database access.

### Cross-Service Coupling Risks
Notifications currently reads directly from the `orders` table for order details to include in emails — this needs to become either an API call to the Order service or an event payload carrying the needed data, not a shared table.

### Recommendation
A split is warranted for Notifications specifically — its independent scaling need is real and its current coupling (shared table reads) is the actual blocker, not deploy cadence. Extract Notifications first as it's the most isolated of the three domains.
```

## Tips & Variations
- For a team unfamiliar with Domain-Driven Design vocabulary, ask it to explain "bounded context" and "aggregate" briefly as it uses them, so the proposal is self-explanatory.
- If evaluating a boundary someone else already proposed, paste their proposed split as `{{MONOLITH_DESCRIPTION}}` and ask it to critique that specific boundary rather than propose from scratch.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

---
id: event-schema-evolution-advisor
title: Event Schema Evolution Advisor
category: coding
tags: [backend, event-driven, schema-design, messaging]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Plans backward-compatible changes to an event/message schema consumed by multiple independent services. For an engineer evolving a shared event contract in an event-driven architecture — distinct from `schema-designer-from-requirements` (initial database schema design) and `api-versioning-advisor` (synchronous REST APIs, not async event contracts).

## When to use it
- Adding or changing a field on an event type that multiple services already consume.
- Deciding whether a proposed change is safely additive or requires a new event version.
- A breaking change to an event schema is genuinely unavoidable and needs a migration plan.

## The Prompt

```
You are planning a change to an event/message schema that's already consumed by multiple services — your job is compatibility, not just what the new schema should look like.

Current schema: {{CURRENT_SCHEMA}}

Proposed change: {{PROPOSED_CHANGE}}

Consumer context (known consumers, and how strict their deserialization is — schema validation that rejects unknown fields vs. lenient/ignore-unknown-fields parsing): {{CONSUMER_CONTEXT}}

1. Classify the change as additive-safe (a new optional field, a wholly new event type existing consumers can ignore) or breaking (removing/renaming a field, changing a field's type, making a previously-optional field required, changing the semantic meaning of an existing field while keeping its name/type the same).
2. For a breaking change, propose a compatibility strategy: dual-writing both old and new schema shapes during a transition window, publishing the new shape as a new event type/topic version with an explicit deprecation timeline for the old one, or — if the change is a type widening (e.g., int to a larger numeric type) — noting that widening is generally safe while narrowing never is.
3. Specify concretely what each consumer needs to do, and by when, for the transition to complete safely.

If consumers are not fully known — the event is published to a shared topic anyone could subscribe to — flag that even an "additive-safe" change carries residual risk if consumer strictness is unknown, and recommend a way to find actual subscribers (schema registry usage stats, topic subscriber lists, a broadcast announcement with a response deadline) before treating "additive" as automatically risk-free.
```

## Variables
- `{{CURRENT_SCHEMA}}` — the event/message schema as it exists today. Required.
- `{{PROPOSED_CHANGE}}` — the change being considered. Required.
- `{{CONSUMER_CONTEXT}}` — known consumers and how strict their parsing is. Required — this determines whether an "additive" change is actually safe for every consumer or only the lenient ones.

## Example
**Input:** `{{CURRENT_SCHEMA}}` = an `OrderPlaced` event with fields `order_id`, `user_id`, `total_amount`, `{{PROPOSED_CHANGE}}` = "rename `total_amount` to `total_amount_cents` and change its type from decimal to integer", `{{CONSUMER_CONTEXT}}` = "3 known consumers: billing service (strict schema validation), analytics pipeline (lenient, logs unknown fields), a partner-facing webhook relay (unknown strictness)".

**Output (excerpt):**
```
Classification: BREAKING. This is both a rename and a type change to an existing field — any consumer reading `total_amount` will get a missing field, and any consumer doing type-strict parsing on the old shape will fail outright.

Compatibility strategy: dual-write both fields during a transition window — publish both `total_amount` (old, decimal, unchanged) and `total_amount_cents` (new, integer) on every event for a fixed period (e.g., 8 weeks), rather than swapping instantly.

Consumer actions:
- Billing service (strict validation): must be updated to read `total_amount_cents` before the old field is ever removed — strict validation means it can't silently tolerate an extra field being added, so confirm its schema allows unknown/additional fields during the transition, or coordinate a simultaneous deploy.
- Partner-facing webhook relay: strictness unknown — this is the highest-risk consumer. Do not assume it's safe; contact the partner directly and get explicit confirmation before removing the old field, since a break here is externally visible and harder to fix quickly.
```

## Tips & Variations
- If a schema registry with compatibility-mode enforcement is in use (e.g., Confluent Schema Registry in BACKWARD/FORWARD mode), ask it to also state which compatibility mode the proposed change would violate, if any — this often surfaces a check the tooling already partially automates.
- For a genuinely new consumer being added rather than a schema change, this prompt isn't the right fit — use it specifically when the schema itself is changing under existing consumers.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

---
id: consumer-driven-contract-test-designer
title: Consumer-Driven Contract Test Designer
category: coding
tags: [testing, integration-testing, microservices]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Designs consumer-driven contract tests (Pact-style) between two independently deployed services: what the consumer expects from the provider's API, how to structure the contract, and how to wire it into CI so a provider change that would break the consumer fails before it ships. Distinct from `integration-test-scenario-planner` (coding, already shipped)'s broader end-to-end scenario design and `api-contract-consistency-reviewer` (coding, already shipped)'s review of naming/pagination consistency across your own endpoints — this prompt is specifically about the consumer-provider contract-testing pattern between two separately owned/deployed services.

## When to use it
- Two teams own a consumer and a provider service independently, and a provider change has broken the consumer in production more than once without either team catching it before deploy.
- You're introducing contract testing to a microservices setup for the first time and need help designing the actual contract content and CI wiring, not just "use Pact."
- You're deciding whether a given consumer-provider relationship actually needs contract testing versus being adequately covered by existing integration or end-to-end tests.

## The Prompt

```
You design consumer-driven contract tests between a consumer and a provider service, including the contract content and how to enforce it in CI.

Consumer service and what it calls on the provider (endpoints, fields it actually reads): {{CONSUMER_USAGE}}
Provider service and its current API surface for the relevant endpoints: {{PROVIDER_API}}
CI/deployment setup for both services (shared pipeline, separate pipelines, deploy order constraints): {{CI_SETUP}}

Instructions:
1. From {{CONSUMER_USAGE}}, extract exactly what the consumer depends on: which endpoints, which request shape it sends, and — critically — which specific response fields it actually reads and relies on. A contract should assert only what's actually consumed, not the provider's entire response schema; asserting unused fields creates false-positive contract breaks when the provider changes something the consumer never looked at.
2. Draft the contract content: for each interaction, the expected request (method, path, relevant params/body) and the expected response shape (status code, the specific fields from step 1 with their expected types/format, not full example values that would make the contract brittle to irrelevant data changes).
3. Design the CI wiring: the consumer's pipeline publishes the contract (e.g. to a Pact Broker or equivalent) after its tests pass; the provider's pipeline verifies its actual implementation against all contracts published by its consumers before the provider is allowed to deploy. Be explicit about this direction — verification happens on the provider's side, gated on deploy, not as an afterthought.
4. Address the deploy-order question given {{CI_SETUP}}: if the provider must never deploy a contract-breaking change, its pipeline needs a real gate (fail the build) tied to contract verification results, not just a notification that's easy to ignore.
5. Flag any consumer usage in {{CONSUMER_USAGE}} that reads fields inconsistently or optionally (e.g. sometimes checks a field's presence, sometimes assumes it exists) — this ambiguity needs to be resolved into a definite contract expectation, since an contract can't assert "maybe present."
6. Note what contract testing does NOT replace: it verifies the provider matches what consumers expect at the interface level, but doesn't replace end-to-end tests for actual business-logic correctness across the full flow — state this limitation explicitly so contract tests aren't treated as a full integration-test replacement.

Output format: Markdown. A "Contract Content" section (interaction-by-interaction expected request/response), a "CI Wiring" section (consumer-side publish step, provider-side verify-and-gate step, tool-agnostic but naming a specific tool like Pact if {{CI_SETUP}} suggests one fits), and a "Ambiguities to Resolve" section for anything flagged in step 5.
```

## Variables
- `{{CONSUMER_USAGE}}` — the consumer service's actual calls to the provider: endpoints, request shape, and which response fields it reads. Required.
- `{{PROVIDER_API}}` — the provider's current API for the relevant endpoints. Required.
- `{{CI_SETUP}}` — how both services' CI/CD pipelines currently work, including any deploy-order constraints or shared infrastructure. Required — the enforcement design depends entirely on this.

## Example
**Input:** `{{CONSUMER_USAGE}}` = "Checkout service calls `GET /users/{id}` on the User service, reads `id`, `email`, and `loyaltyTier` from the response; ignores all other fields." `{{PROVIDER_API}}` = "User service's `GET /users/{id}` currently returns id, email, loyaltyTier, createdAt, lastLoginAt, and a dozen other profile fields." `{{CI_SETUP}}` = "Separate pipelines per service, both deploy independently to the same environment; no current coordination mechanism."

**Output (excerpt):**
```
### Contract Content
Interaction: GET /users/{id}
Expected request: path param `id` (string, UUID format)
Expected response: 200 status; body contains `id` (string), `email` (string, non-null), `loyaltyTier` (string, one of a known enum if the consumer branches on specific values — confirm which values checkout branches on). No assertion on createdAt, lastLoginAt, or other fields checkout doesn't read.

### CI Wiring
Consumer (Checkout) pipeline: after its own tests pass, generate the Pact contract from a consumer-side contract test and publish it to a shared Pact Broker, tagged with the checkout service's version/branch.
Provider (User) pipeline: before deploy, run Pact's provider verification against all contracts currently published by consumers (including checkout's) targeting the User service's real implementation; fail the build (block deploy) if any contract fails verification. Given {{CI_SETUP}}'s independent pipelines, this verification step must be added to the User service's own pipeline, not assumed to happen elsewhere.

### Ambiguities to Resolve
Confirm the exact set of `loyaltyTier` values checkout branches on — if checkout only checks for a specific tier vs. "anything else," the contract can assert a narrower, more stable expectation than a full enum match.
```

## Tips & Variations
- Reserve this for consumer-provider pairs with real independent-deploy risk and a history of breakage — for two services always deployed together in lockstep by the same team, contract testing's coordination overhead may not pay for itself; `integration-test-scenario-planner` (coding, already shipped) may be sufficient there.
- If {{PROVIDER_API}} has multiple consumers, design one contract per consumer rather than one shared contract asserting the union of everyone's usage — that's what keeps each consumer's contract narrow and prevents one consumer's requirements from over-constraining what the provider can change for everyone else.
- Pair with `api-consumer-impact-mapper` (coding, already shipped) when planning a provider-side breaking change — that prompt maps which consumers would be affected before the change ships; this prompt is the mechanism that then catches the break automatically in CI rather than relying on the mapping being remembered.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

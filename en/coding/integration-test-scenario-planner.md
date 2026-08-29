---
id: integration-test-scenario-planner
title: Integration Test Scenario Planner
category: coding
tags: [testing, integration-testing, planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Designs end-to-end test scenarios (in plain language, not code) from a feature specification — covering system interactions and cross-component flows, for QA planning before or alongside implementation. Distinct from unit-test generation: this operates at the feature/flow level, across components.

## When to use it
- Planning QA coverage for a new feature before writing any test code, so scenarios can be reviewed by non-engineers too.
- A feature touches multiple services/components and unit tests alone won't catch integration bugs between them.
- Handing test scenarios to a QA team or automation engineer to implement in whatever framework they use.

## The Prompt

```
You design integration/end-to-end test scenarios from a feature specification. Output scenarios in plain language (Given/When/Then or similar), not code — these will be implemented separately in whatever test framework/tool the team uses.

Feature specification: {{FEATURE_SPEC}}
System components involved (optional): {{SYSTEM_COMPONENTS}}
Existing test scenarios already covered (optional, to avoid duplication): {{EXISTING_SCENARIOS}}

Instructions:
1. Identify every distinct user-facing flow implied by the spec, not just the primary happy path.
2. For each flow, write a scenario in Given/When/Then form: the starting state, the action taken, and the expected outcome — specific enough that two different people would implement the same test from it.
3. Explicitly include: the happy path; at least one permission/authorization edge case if the feature involves access control; at least one failure/error scenario (a dependency is down, invalid input, a race between two users); and any cross-component interaction implied by {{SYSTEM_COMPONENTS}} (e.g., "an order confirmation triggers both a database write and an email send — verify both, and verify behavior if the email service is unavailable").
4. Note any scenario that requires specific test data setup (seeded accounts, a particular system state) as a precondition, not buried in the "when" step.
5. Flag any scenario that's expensive/slow to test end-to-end and suggest whether it's better covered at a lower test level instead (a note, not a full removal — the scenario should still be documented).
6. Prioritize scenarios: mark which are must-have before release versus nice-to-have.

Output format: Markdown, grouped by flow, each scenario numbered and in Given/When/Then form.
```

## Variables
- `{{FEATURE_SPEC}}` — the feature description or requirements doc. Required.
- `{{SYSTEM_COMPONENTS}}` — services/systems the feature touches (helps surface cross-component scenarios). Optional but valuable.
- `{{EXISTING_SCENARIOS}}` — scenarios already planned/automated, to avoid duplicating effort. Optional.

## Example
**Input:** `{{FEATURE_SPEC}}` = "users can cancel a subscription; cancellation takes effect at the end of the billing period, not immediately", `{{SYSTEM_COMPONENTS}}` = "billing service, email service, user-facing app".

**Output (excerpt):**
```
### Flow: Subscription cancellation
1. **[Must-have] Standard cancellation**
   Given an active subscription mid-billing-period
   When the user cancels
   Then the subscription status becomes "cancelling", access continues until period end, and a confirmation email is sent

2. **[Must-have] Email service unavailable during cancellation**
   Given an active subscription and the email service is down
   When the user cancels
   Then the cancellation still succeeds and is recorded, and the email is retried/queued rather than silently dropped
```

## Tips & Variations
- For a regulated domain (payments, healthcare), ask it to add an explicit "compliance-relevant scenarios" section covering audit trail and data-handling requirements.
- Feed it `{{EXISTING_SCENARIOS}}` from the last planning session so incremental feature updates only generate the delta, not a full re-plan.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

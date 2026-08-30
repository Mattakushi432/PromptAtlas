---
id: synthetic-monitoring-scenario-designer
title: Synthetic Monitoring Scenario Designer
category: coding
tags: [devops, observability, monitoring]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Designs synthetic-check scenarios — scripted, periodic checks that simulate real user actions — for a critical user flow. Distinct from load testing (which tests capacity under volume) and incident analysis (which is reactive, after something already broke): synthetic monitoring is proactive and continuous, meant to catch a break before real users hit it.

## When to use it
- A critical flow (login, checkout, a core feature) has no proactive monitoring and problems are only discovered via user complaints.
- Setting up health checks that go meaningfully beyond a simple "is the homepage up" ping.
- A past outage in a specific flow went undetected for hours because nothing was actually testing that flow end-to-end.

## The Prompt

```
You are designing a synthetic monitoring scenario for a critical user flow — a proactive, continuous, scripted check, not a load test and not a post-incident analysis.

Critical flow (the user journey, described step by step): {{CRITICAL_FLOW_DESCRIPTION}}

Failure history (optional — what's broken in this flow before, if known): {{FAILURE_HISTORY}}

Design:
1. A scripted check that walks through the actual multi-step flow described, not just a ping against a single endpoint — a login flow's synthetic check should actually attempt to log in, not just confirm the login page loads.
2. Pass/fail criteria for each step that check actual expected content or state, not just an HTTP status code — a broken flow can easily still return 200 OK with the wrong content (an error message rendered inside a 200 response, a form that silently fails to submit), so verify the meaningful outcome, not just that a response arrived.
3. A check frequency and an alerting threshold — how many consecutive failures should occur before paging someone, calibrated to avoid alert fatigue from single transient blips (a flaky network hiccup) while still catching a real, sustained break quickly.
4. An explicit statement of what this synthetic check deliberately does NOT catch — issues only visible under real concurrent load (a load-testing concern, not this one), or problems affecting only a subset of real users/regions that the synthetic check doesn't run from — so it isn't mistaken for complete coverage on its own.

If `{{FAILURE_HISTORY}}` is provided, make sure the designed scenario specifically would have caught that past failure — if it wouldn't have, say so explicitly and adjust the scenario, since a synthetic check that wouldn't catch the exact failure that motivated building it has a real gap.

If the critical flow requires authentication or session state that's awkward for an external synthetic checker to maintain, address it directly — propose a dedicated synthetic test account and a token/session refresh approach — rather than skipping the hardest, and often most important, part of the flow to check.
```

## Variables
- `{{CRITICAL_FLOW_DESCRIPTION}}` — the user journey being monitored, step by step. Required.
- `{{FAILURE_HISTORY}}` — a past incident in this flow, if one exists. Optional, but strongly recommended when available — it's the best available ground truth for whether the designed check is actually good enough.

## Example
**Input:** `{{CRITICAL_FLOW_DESCRIPTION}}` = "checkout: add item to cart → proceed to payment → submit test card → see order confirmation page with an order number", `{{FAILURE_HISTORY}}` = "once, the payment step silently failed and showed a generic 'processing' spinner forever, with no error and no confirmation, undetected for 3 hours".

**Output (excerpt):**
```
Scripted check: (1) add a known test product to cart, (2) proceed to payment, (3) submit using a dedicated test payment method that doesn't actually charge, (4) wait for and verify the order confirmation page renders with a non-empty order number matching an expected format.

Pass/fail for step 4 specifically (the step relevant to the past failure): fail if the confirmation page doesn't appear within a defined timeout (e.g., 15 seconds) — this directly catches the "infinite processing spinner" failure mode from the failure history, since a check that only verified "got a 200 from the payment endpoint" would NOT have caught this (the spinner scenario likely did return a 200 to start processing, with the actual failure being an indefinite hang afterward).

Frequency/alerting: run every 5 minutes; page after 2 consecutive failures (10 minutes) rather than 1, to avoid paging on a single transient blip, while still catching a sustained break in well under the 3 hours the real incident took to notice.

What this does NOT catch: real payment processor outages affecting only certain card types or regions not covered by the test payment method; issues only appearing under real concurrent checkout load (that's `load-test-scenario-designer`'s job, not this one); and anything specific to a real user's account state that a dedicated synthetic test account wouldn't reproduce.
```

## Tips & Variations
- For a flow with no prior failure history to validate against, ask it to explicitly list the most plausible failure modes for a flow like this one (based on the steps described) and confirm the designed check would catch each — this substitutes for real incident ground truth when none exists yet.
- Pair with `load-test-scenario-designer` for capacity concerns and `oncall-runbook-writer` for what to do once a synthetic check actually pages someone — this prompt only covers detection design, not response.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

---
id: regression-test-prioritizer
title: Regression Test Prioritizer
category: coding
tags: [testing, regression, qa]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Ranks which existing tests from a large suite to run first given a specific diff and limited time — for a QA lead or engineer who can't run the full regression suite before a deadline and needs a defensible subset, not a random sample.

## When to use it
- A full regression suite takes hours but you have 20 minutes before a release window.
- Deciding which manual QA checks to prioritize given a diff, when automated coverage is incomplete.
- Justifying to a release manager why a specific subset of tests was run instead of everything.

## The Prompt

```
You are prioritizing which tests to run given limited time, based on relevance to a specific diff — not general test suite health.

Diff: {{DIFF}}
Available tests (names/descriptions, and ideally what area/component each covers): {{TEST_SUITE}}
Time budget (optional — e.g. "can run 15 of these"): {{TIME_BUDGET}}

Instructions:
1. Map the diff's changes to the code areas/components they touch.
2. For each test in {{TEST_SUITE}}, assess relevance: does it directly exercise the changed code, does it exercise code that calls or is called by the changed code, or is it unrelated?
3. Also weight by risk, not just relevance: a test covering a rarely-touched but high-consequence path (payments, auth, data deletion) ranks higher than an equally-relevant but low-consequence one (a tooltip's text), even if both are "directly relevant."
4. Rank all tests from most to least important to run given this specific diff, not by some general notion of test importance.
5. If {{TIME_BUDGET}} is given, draw a clear line: "run these N first; if time allows, these next; skip these unless surprises appear."
6. For any high-risk area touched by the diff that has NO existing test covering it, flag that explicitly as a gap — this is often more valuable than the ranking itself.
7. Justify each top-priority pick in one sentence tied to the actual diff content, not a generic "this seems important."

Output format: Markdown, a numbered ranked list (highest priority first) with one-line justifications, followed by a "Coverage Gaps" section for anything the diff risks that no test currently covers.
```

## Variables
- `{{DIFF}}` — the change being tested. Required.
- `{{TEST_SUITE}}` — the available tests, with enough description to judge relevance (names alone are weak; a one-line description of what each covers is much better). Required.
- `{{TIME_BUDGET}}` — how many tests/how much time is available. Optional but sharpens the cutoff.

## Example
**Input:** `{{DIFF}}` = changes to the discount-code validation logic in checkout, `{{TEST_SUITE}}` = a list including "checkout_flow_happy_path", "discount_code_expiry", "unrelated_profile_settings_test", `{{TIME_BUDGET}}` = "run 2".

**Output (excerpt):**
```
1. **discount_code_expiry** — directly exercises the validation logic changed in this diff; highest relevance and moderate business risk (incorrect expiry handling could let expired codes work).
2. **checkout_flow_happy_path** — doesn't test the changed logic directly, but validates the surrounding checkout flow still completes end-to-end; a safety net against an integration break.

**Skip unless time allows:** unrelated_profile_settings_test — no code path overlap with this diff.

## Coverage Gaps
No existing test covers a discount code being applied twice in the same session — the diff changes how codes are marked "used," and this concurrent-use scenario is untested.
```

## Tips & Variations
- For CI integration, ask it to output just the ranked test names (no prose) so the list can be piped directly into a test runner's include filter.
- If your suite has historical flakiness data, add it to `{{TEST_SUITE}}` descriptions — a relevant-but-flaky test may need re-running twice to trust, which affects the time budget math.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

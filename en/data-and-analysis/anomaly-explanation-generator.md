---
id: anomaly-explanation-generator
title: Anomaly Explanation Generator
category: data-and-analysis
tags: [data-analysis, anomaly-detection]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Given a metric spike or drop and surrounding context, drafts a ranked set of plausible, checkable hypotheses for what caused it — a starting point for investigation, not a diagnosis, since the model cannot see the actual data behind the anomaly.

## When to use it
- A dashboard metric moved sharply and you need a first-pass list of what to check before you have time to dig into the raw data yourself.
- You're writing an incident summary or Slack update about a metric anomaly and want a structured set of hypotheses to investigate in parallel rather than guessing serially.
- You want a sanity check on your own working theory for an anomaly — does it hold up against the other plausible explanations, or is there an obvious alternative you haven't considered?

## The Prompt

```
You generate plausible, checkable hypotheses for the cause of a described metric anomaly. You do not claim to know the actual cause — you rank candidate explanations by plausibility and state exactly what data would confirm or rule out each one.

Metric and the anomaly: {{ANOMALY_DESCRIPTION}}
Timing (when it started, how it's trending — sudden step change vs. gradual drift): {{TIMING}}
Known context (recent deploys, marketing campaigns, seasonal patterns, other metrics that moved around the same time): {{CONTEXT}}

Instructions:
1. Generate 4-6 distinct hypotheses spanning different categories: a genuine underlying change (real user behavior shift), a measurement/instrumentation issue (a tracking bug, a broken pipeline, a schema change upstream), an external factor (seasonality, a holiday, a competitor action, a platform-wide issue), and an internal change (a recent deploy, a pricing change, a campaign launch) — don't cluster all hypotheses in one category just because the first idea that comes to mind fits there.
2. For each hypothesis, state what specific data or check would confirm or rule it out (e.g. "check error rates/pipeline logs for the affected time window" for an instrumentation hypothesis, "check whether the change is isolated to one segment/geography/platform" for a measurement-bug hypothesis, since a real behavior shift is more likely to show up broadly while a tracking bug is often isolated to one platform or event type).
3. Use {{TIMING}} to weight plausibility: a sudden step change aligned exactly with a known deploy or campaign timestamp in {{CONTEXT}} is more likely a direct effect of that change than a coincidence; a gradual drift over weeks is less likely to be a single instrumentation bug and more likely a genuine trend or slow external factor.
4. If {{CONTEXT}} mentions other metrics that moved at the same time, use that to distinguish a broad, correlated shift (suggesting a shared cause like a pipeline issue or a platform-wide event) from an isolated single-metric move (suggesting something specific to that metric's definition or tracking).
5. Rank the hypotheses by plausibility given {{TIMING}} and {{CONTEXT}}, but do not present the top-ranked one as confirmed — the ranking reflects prior likelihood given the available context, not a conclusion.
6. If {{CONTEXT}} is sparse (no known deploys, campaigns, or other metric movements), say so explicitly and note that the instrumentation-issue and measurement-artifact hypotheses deserve extra weight when there's no other explanation readily available — a mysterious anomaly with no known cause is often a data-quality issue rather than a real behavior change.

Output format: Markdown, ranked list of hypotheses (most to least plausible). For each: the hypothesis, why it's plausible given {{TIMING}}/{{CONTEXT}}, and the specific check that would confirm or rule it out. End with a one-line note on what to check first given time constraints.
```

## Variables
- `{{ANOMALY_DESCRIPTION}}` — which metric moved, and by roughly how much. Required.
- `{{TIMING}}` — when the anomaly started and its shape (sudden vs. gradual). Required — this substantially changes which hypotheses are plausible.
- `{{CONTEXT}}` — anything else known that might be relevant: deploys, campaigns, seasonality, other metrics moving. Optional, but the fewer facts given, the more the output leans on generic categories rather than a targeted ranking.

## Example
**Input:** `{{ANOMALY_DESCRIPTION}}` = "Daily signups dropped from ~500/day to ~150/day." `{{TIMING}}` = "Sudden step change, started exactly at the beginning of yesterday, has stayed flat at the lower level since." `{{CONTEXT}}` = "A frontend deploy went out yesterday morning touching the signup form. No known campaign changes. Other metrics (page views, login rate) look normal."

**Output (excerpt):**
```
1. **Broken signup form from yesterday's deploy** (most plausible) — the step change aligns exactly with the deploy timestamp, and the drop is isolated to signups specifically (page views and logins are normal), which points at something specific to the signup flow rather than a site-wide issue.
   Check: test the signup form manually post-deploy across browsers/devices; check frontend error logs for the signup page starting at the deploy timestamp; check if the drop is uniform across traffic sources or concentrated in one (e.g. only mobile, suggesting a responsive-layout bug in the deploy).

2. **Signup tracking/analytics broken by the same deploy** (plausible, distinct from #1) — the deploy touched the signup form, which could mean the tracking event fires less reliably rather than fewer people actually signing up. This would look identical in the metric but requires checking actual signup counts in the database, not just the tracked event count.
   Check: compare the tracked signup event count against the actual count of new user rows created in the database for the same period — if the database count is normal but the tracked metric dropped, it's a tracking bug, not a real drop.

3. **Coincidental external factor** (less plausible) — the exact alignment with the deploy timestamp and the isolation to signups specifically make an unrelated external cause (seasonality, a competitor, a platform issue) less likely here, though not impossible.
   Check: compare against the same day of week from prior weeks to rule out a weekly pattern coinciding by chance.

First check given time constraints: compare tracked signup events against actual database signup rows for the affected period — this single check distinguishes hypothesis #1 (real drop) from #2 (tracking artifact) fastest.
```

## Tips & Variations
- This prompt generates hypotheses to investigate, not conclusions — always follow up by actually running the suggested checks before communicating a cause to stakeholders as anything more certain than "leading theory, still investigating."
- Pair with `incident-root-cause-analyzer` (coding, already shipped) if the anomaly turns out to be a genuine system incident rather than a metric-definition or measurement issue — that prompt is scoped to ranking root-cause hypotheses from logs/symptoms for an engineering incident, while this one is scoped to a business/analytics metric anomaly and doesn't assume log access.
- If the anomaly is a gradual drift rather than a sudden change, expect the hypothesis mix to shift toward genuine trend/seasonality explanations and away from single-event causes like a specific deploy — a slow drift rarely traces to one instantaneous change.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

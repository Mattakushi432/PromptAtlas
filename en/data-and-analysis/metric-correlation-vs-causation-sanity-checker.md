---
id: metric-correlation-vs-causation-sanity-checker
title: Metric Correlation vs. Causation Sanity-Checker
category: data-and-analysis
tags: [statistics, data-analysis]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Given two metrics that moved together, lists plausible confounders and runs a lightweight structured check for whether the relationship is likely causal or more likely coincidental — the two-metric, causal-claim counterpart to `anomaly-explanation-generator`'s single-metric spike diagnosis.

## When to use it
- Someone notices two metrics moved together (e.g. "email opens went up right when revenue went up") and is about to draw a causal conclusion from that alone.
- You want a lightweight first-pass gut check before commissioning a full causal-inference study or A/B test.
- Reviewing a stakeholder's report or slide that implies causation from a correlation, to push back with specific plausible alternative explanations rather than a vague "correlation isn't causation."

## The Prompt

```
You sanity-check whether an observed relationship between two metrics is likely causal or more likely coincidental/confounded — you do not run a full causal-inference analysis, only a lightweight structured first-pass check.

Metric A and its recent movement: {{METRIC_A}}
Metric B and its recent movement: {{METRIC_B}}
Time window and granularity over which they moved together: {{TIME_WINDOW}}
The causal claim being considered (e.g. "A caused B", "B caused A", "some third factor caused both"): {{CLAIM}}
Any known context (recent product/marketing/seasonal changes, other metrics that also moved in this window): {{CONTEXT}}

Instructions:
1. State the temporal relationship: did {{METRIC_A}}'s movement clearly precede {{METRIC_B}}'s within {{TIME_WINDOW}}, did they move simultaneously, or is the ordering unclear from what's given? Causation requires the proposed cause to precede the effect — flag immediately if {{CLAIM}}'s direction is inconsistent with the actual timing.
2. List 3-5 plausible confounders — a third factor from {{CONTEXT}} or a reasonable inference that could independently explain both metrics moving together (e.g. a seasonal effect, a simultaneous but unrelated launch, a shared upstream metric both depend on).
3. Check for reverse causation: could {{CLAIM}}'s effect plausibly be the actual cause of what's labeled the cause, given the domain? State this explicitly rather than assuming the claimed direction is the only one considered.
4. Assess mechanism plausibility: is there a concrete, describable mechanism by which {{METRIC_A}} could actually cause {{METRIC_B}} (or vice versa), or does the claim rest on the correlation alone with no stated mechanism? A claim with no plausible mechanism should be treated more skeptically regardless of how clean the correlation looks.
5. Propose one lightweight next check — not a full experiment design, but the fastest way to gain more confidence one way or the other (e.g. checking whether the relationship held in a prior period without the suspected cause, checking a segment where the suspected cause didn't occur, or a rough dose-response check across sub-groups).
6. Give a plain verdict: likely causal, likely confounded/coincidental, or genuinely inconclusive from what's given — with the single strongest piece of evidence driving that verdict.

Output format: Markdown with sections: Temporal Relationship, Plausible Confounders, Reverse-Causation Check, Mechanism Plausibility, Suggested Next Check, Verdict.
```

## Variables
- `{{METRIC_A}}` — first metric and its movement. Required.
- `{{METRIC_B}}` — second metric and its movement. Required.
- `{{TIME_WINDOW}}` — the time window/granularity both moved over. Required — needed for the temporal-precedence check.
- `{{CLAIM}}` — the causal claim being evaluated. Required — the check is directional, so simply saying "these two moved together" isn't enough.
- `{{CONTEXT}}` — known concurrent changes or other correlated metrics. Optional but strengthens the confounder list.

## Example
**Input:** `{{METRIC_A}}` = "Weekly email open rate: rose from 22% to 31%." `{{METRIC_B}}` = "Weekly signups: rose from 400 to 520." `{{TIME_WINDOW}}` = "Both measured over the same 4 weeks, week-over-week." `{{CLAIM}}` = "Higher email open rates caused the signup increase." `{{CONTEXT}}` = "A new referral program launched in week 2, and the marketing team also changed the email subject-line format in week 1."

**Output (excerpt):**
```
### Temporal Relationship
Open rate rose starting week 1 (subject-line change); signups rose more sharply starting week 2 (referral program launch). The claimed direction (open rate → signups) is at least temporally plausible for week 1's movement, but week 2's larger signup jump aligns better with the referral program than with the open-rate trend, which was already rising by then.

### Plausible Confounders
- The referral-program launch in week 2 is a strong independent candidate — referral links plausibly drive signups directly, with no need for the email channel.
- The subject-line format change could itself be part of a broader campaign refresh that also touched signup-page copy or targeting, which would inflate signups independent of open rate.
- Seasonal or day-of-week effects aren't ruled out — 4 weeks is short enough that a single external event (e.g. a competitor's outage, a press mention) could coincide.

### Reverse-Causation Check
Unlikely here — signups causing higher email open rates has no plausible mechanism (new signups wouldn't retroactively raise open rates on already-sent emails), so reverse causation isn't a serious concern for this specific pair.

### Mechanism Plausibility
A plausible mechanism exists (an opened email contains a signup CTA, so more opens could mean more click-throughs to signup) — but it's weakened by the referral program being a simultaneous, more direct signup driver introduced in the same window.

### Suggested Next Check
Compare signup counts specifically from referral-program links versus organic/email-attributed signups for week 2 onward — if referral-attributed signups account for most of the increase, the open-rate correlation is likely a coincidental confound rather than the driver.

### Verdict
Likely confounded — the referral-program launch is a more direct, better-timed candidate cause for the signup increase than the open-rate rise, though a genuine but smaller open-rate contribution isn't ruled out. Attribution data (the suggested next check) would resolve this quickly.
```

## Tips & Variations
- Pair with `ab-test-result-interpreter` (data-and-analysis, already shipped) once a next check turns into an actual controlled experiment — that prompt evaluates the experiment's result once you have it.
- Distinct from `anomaly-explanation-generator` (already shipped), which diagnoses a single metric's own spike or drop against candidate root causes; this prompt specifically evaluates a claimed causal relationship *between two* metrics that moved together.
- If {{CONTEXT}} is thin, push back and ask for it before running this prompt — the confounder list and verdict are only as good as what's known about what else happened in {{TIME_WINDOW}}; "no known context" is a legitimate answer but should be stated explicitly rather than silently assumed.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

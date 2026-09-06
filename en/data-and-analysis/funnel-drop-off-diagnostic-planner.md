---
id: funnel-drop-off-diagnostic-planner
title: Funnel Drop-Off Diagnostic Planner
category: data-and-analysis
tags: [eda, data-analysis]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Plans which segments and funnel steps to slice a conversion funnel by in order to isolate where and for whom drop-off actually concentrates — a prioritized investigation plan produced before pulling any data, not the resulting analysis itself.

## When to use it
- Overall funnel conversion is underperforming or has dropped, and the team needs a structured plan for where to look rather than pulling every possible cut of the data.
- A new funnel just launched and you want a plan for which slices to check first once enough volume accumulates.
- A stakeholder asks a broad "why are people dropping off" question and you need to narrow it into a concrete, prioritized list of hypotheses to check.

## The Prompt

```
You plan which segments and steps to slice a conversion funnel by, to prioritize a drop-off investigation — you don't have or analyze the actual data, you plan the slicing strategy.

The funnel's steps in order: {{FUNNEL_STEPS}}
Step-level conversion rates, if known (or "not yet known" if this is pre-launch planning): {{STEP_RATES}}
Dimensions/segments actually available to slice by (e.g. device type, traffic source, new vs. returning, geography, plan tier): {{AVAILABLE_DIMENSIONS}}
Any existing hypothesis or suspicion about where the problem is, if any: {{EXISTING_HYPOTHESIS}}

Do the following:
1. If {{STEP_RATES}} is known, identify which single step has the largest proportional drop-off (not just the largest absolute number) — that step is where slicing effort should concentrate first, since fixing a small step's problem yields less than fixing the biggest leak.
2. For that highest-priority step (or, if {{STEP_RATES}} is unknown, for the step in {{FUNNEL_STEPS}} most likely to be a bottleneck based on typical funnel shapes), propose the top 3-5 dimensions from {{AVAILABLE_DIMENSIONS}} to slice by, ranked by how likely each is to reveal a concentrated (not evenly spread) drop-off pattern. Justify each ranking with a concrete reason tied to that step's nature (e.g. "device type is high-priority for a form-fill step because mobile form UX commonly underperforms desktop").
3. For each proposed slice, state the specific pattern that would confirm the hypothesis versus the pattern that would rule it out — e.g. "if mobile conversion at this step is meaningfully lower than desktop, the UX hypothesis is supported; if they're comparable, look elsewhere first."
4. If {{EXISTING_HYPOTHESIS}} is given, place it explicitly in the ranked list at whatever priority it actually deserves given the reasoning above — don't automatically rank it first just because it was mentioned; state plainly if the data-driven priority order suggests checking something else first.
5. Note any segment combination worth checking jointly rather than separately (e.g. "mobile + first-time visitor," if that intersection is plausible for a materially different pattern than either dimension alone) — but only propose one or two such combinations, not every possible cross, to keep the plan actionable.

Output format: Markdown. A ranked list of dimension slices to pull for the highest-priority step, each with: Rank, Dimension, Reason, Confirming Pattern, Ruling-Out Pattern. End with one line naming which step this plan targets and why it was chosen over the others.
```

## Variables
- `{{FUNNEL_STEPS}}` — the funnel's steps in order. Required.
- `{{STEP_RATES}}` — known conversion rate per step, or "not yet known." Strongly recommended when available — it's what identifies the highest-priority step.
- `{{AVAILABLE_DIMENSIONS}}` — the segments/dimensions actually trackable in the data. Required — the plan can only recommend slices that exist.
- `{{EXISTING_HYPOTHESIS}}` — any prior suspicion about the cause, or "none."

## Example
**Input:** `{{FUNNEL_STEPS}}` = "Landing page view → Sign-up form started → Sign-up form completed → First action taken." `{{STEP_RATES}}` = "View→Started: 40%. Started→Completed: 55%. Completed→First action: 85%." `{{AVAILABLE_DIMENSIONS}}` = "Device type, traffic source, geography, browser." `{{EXISTING_HYPOTHESIS}}` = "Someone on the team suspects the form is too long."

**Output (excerpt):**
```
### Targeted Step: Sign-up form started → Sign-up form completed (55% — the largest proportional drop-off of the three transitions)

1. **Rank 1 — Device type.** Reason: form-abandonment is one of the most device-sensitive funnel behaviors; a long form is disproportionately harder to complete on mobile. Confirming pattern: mobile completion rate meaningfully below desktop's. Ruling-out pattern: rates are comparable across device — points away from a form-length/UX issue on this axis.
2. **Rank 2 — Browser.** Reason: a completion-step drop can indicate a technical failure (validation bug, autofill conflict) specific to one browser rather than a UX issue. Confirming pattern: one browser's completion rate is an outlier low compared to the rest. Ruling-out pattern: rates are similar across browsers.
3. **Rank 3 — Traffic source.** Reason: lower-intent traffic (e.g. paid ads vs. organic) often abandons mid-form at a higher rate, which would suggest an intent/targeting issue rather than a form problem. Confirming pattern: one source's completion rate is notably lower even after controlling for device.

### Existing hypothesis placement
{{EXISTING_HYPOTHESIS}} ("form is too long") isn't directly testable via {{AVAILABLE_DIMENSIONS}} alone — it would explain a uniformly low completion rate across all slices rather than a concentrated one. If Rank 1-3 all come back roughly even (no dimension shows a concentrated pattern), that result itself supports the form-length hypothesis by elimination; it isn't ranked first because the available dimensions test it only indirectly.

### Worth checking jointly
Mobile + paid traffic — if both the device and source hypotheses are individually weak but this specific intersection shows a much steeper drop, it points to a mobile ad-landing-experience issue specifically, not a general mobile or general paid-traffic problem.
```

## Tips & Variations
- Pair with `cohort-analysis-setup-guide` (data-and-analysis, already shipped) once a suspect segment is confirmed — that prompt helps set up tracking a fix's effect on that specific cohort going forward.
- If {{STEP_RATES}} shows every step performing similarly (no clear single worst step), say so explicitly rather than forcing a false priority ranking — a genuinely even funnel may mean the issue is upstream of the funnel entirely (traffic quality) rather than in any one step.
- This prompt only plans which cuts to pull, not how to interpret ambiguous results once pulled — once a slice shows a pattern, a separate correlation-vs-causation check is worth running before concluding the segment itself is the cause rather than something merely correlated with it.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

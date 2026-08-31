---
id: forecast-assumption-stress-tester
title: Forecast Assumption Stress-Tester
category: data-and-analysis
tags: [data-analysis, forecasting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Stress-tests a forecast by identifying which of its input assumptions the output projection is most sensitive to, and what happens to that projection under plausible pessimistic and optimistic variations of each one — surfaces a forecast that looks precise but actually rests on one shaky assumption, rather than checking the forecast's arithmetic.

## When to use it
- You're about to make a decision (a hiring plan, a budget, an inventory order) based on a forecast and want to know how much the recommendation would change if one of its underlying assumptions turned out to be wrong.
- Someone hands you a forecast with a single confident-looking number and you want to push back constructively by identifying exactly which assumption that confidence actually depends on.
- You're building a forecast yourself and want to identify, before presenting it, which input is doing the most work — so you can flag it explicitly rather than let the single output number imply more certainty than it has.

## The Prompt

```
You stress-test a forecast by identifying which input assumptions its output is most sensitive to, not by re-deriving or validating the forecast's math.

Forecast method (e.g. linear extrapolation, cohort-based, run-rate, a growth-rate model): {{METHOD}}
Key input assumptions and their assumed values (e.g. "monthly growth rate: 8%", "churn: 3%/month", "seasonality factor for Q4: 1.3x"): {{ASSUMPTIONS}}
The output projection (the headline number(s) the forecast produces): {{PROJECTION}}
Time horizon of the forecast: {{HORIZON}}

Instructions:
1. For each assumption in {{ASSUMPTIONS}}, reason about how much the final {{PROJECTION}} would change if that one assumption moved to a plausible pessimistic value and a plausible optimistic value, holding the others fixed — plausible meaning a realistic range given what's typically observed for that kind of input, not an extreme edge case chosen to make a dramatic point.
2. Identify which assumption(s) the projection is most sensitive to — where a modest, realistic change in the input produces a large change in the output — versus which ones barely move the projection even under a wide range of values. Compounding assumptions (e.g. a growth rate applied over a long {{HORIZON}}) are usually far more sensitive than one-time or additive assumptions.
3. For the most sensitive assumption(s), state explicitly how confident the underlying evidence for that specific input actually is (if stated or inferable) — a forecast's overall precision is bounded by its shakiest high-sensitivity input, not by how many decimal places the output is reported to.
4. If {{HORIZON}} is long relative to how far the underlying data/trend has actually been observed (e.g. extrapolating 12 months of trend to 3 years), flag that extrapolation risk explicitly and separately from individual-assumption sensitivity — a longer horizon compounds even small per-period assumption errors.
5. Produce a simple range, not just a point estimate: given the most sensitive assumption(s)' plausible pessimistic-to-optimistic spread, restate {{PROJECTION}} as a range rather than the original single number, and note whether that range would actually change the decision the forecast is meant to inform.
6. Do not recommend a "correct" value for any assumption — you're not validating whether {{ASSUMPTIONS}} are accurate, only how much the output depends on each one.

Output format: Markdown. A ranked list of assumptions from most to least sensitive, with the pessimistic/optimistic projection swing for each. End with a restated projection range and one line on whether the range spans a meaningfully different decision than the original point estimate.
```

## Variables
- `{{METHOD}}` — the forecasting approach used. Required — sensitivity analysis differs meaningfully between a compounding growth-rate model and a simple linear extrapolation.
- `{{ASSUMPTIONS}}` — the specific named inputs and their assumed values. Required — this is what gets stress-tested.
- `{{PROJECTION}}` — the forecast's output number(s). Required, as the baseline to compare swings against.
- `{{HORIZON}}` — how far out the forecast projects. Required — determines how much compounding assumptions matter.

## Example
**Input:** `{{METHOD}}` = "Growth-rate model: current MRR × (1 + monthly growth rate) compounded monthly." `{{ASSUMPTIONS}}` = "Current MRR: $200K. Monthly growth rate: 10%. Churn is netted into the growth rate, not modeled separately." `{{PROJECTION}}` = "$620K MRR at 12 months." `{{HORIZON}}` = "12 months"

**Output (excerpt):**
```
### 1. Monthly growth rate (most sensitive)
At 10%/month compounded over 12 months, MRR reaches ~$620K. At a more conservative 6%/month (still plausible, especially if recent growth has been driven by one-time factors), 12-month MRR is ~$400K — a $220K swing from a 4-point change in one assumption. At an optimistic 13%/month, projection reaches ~$830K. This single assumption, compounded over 12 months, dominates the entire forecast's range.

### 2. Churn netted into growth rate, not modeled separately
Because churn isn't broken out, the "10% growth" figure implicitly assumes churn stays constant relative to gross growth. If churn is actually accelerating (common as a customer base matures), the net growth rate could erode over the 12 months even if gross new-business growth holds steady — this isn't a swing on a stated assumption, it's a structural risk the model doesn't separately account for. Flag this as a gap, not just a sensitivity.

### Restated Projection
$400K–$830K at 12 months, not a single $620K figure — the growth-rate assumption alone spans a range wide enough that decisions requiring confidence in a specific number (e.g. a hiring plan sized to $620K) should be reconsidered against the lower end of this range, not the point estimate.
```

## Tips & Variations
- Pair with `ab-test-result-interpreter` (data-and-analysis, already shipped) when the forecast's growth-rate assumption is itself based on an experiment result — that prompt can assess whether the underlying experiment result is statistically solid enough to justify the assumption's stated confidence.
- If {{ASSUMPTIONS}} includes more than 3-4 inputs, consider running this prompt in two passes: a first pass to triage which assumptions are even plausible candidates for high sensitivity (usually the ones compounded over {{HORIZON}} or applied multiplicatively), then a deeper pass only on those.
- This prompt deliberately doesn't validate whether {{ASSUMPTIONS}}' values themselves are well-chosen — pair it with actual historical data or a domain expert's judgment for that; sensitivity analysis tells you which assumption matters most, not whether it's correct.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

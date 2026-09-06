---
id: regression-model-sanity-check-reviewer
title: Regression Model Sanity-Check Reviewer
category: data-and-analysis
tags: [statistics, data-analysis]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Reviews a fitted regression model's diagnostics — residual patterns, multicollinearity signals, influential points, and coefficient plausibility — for red flags that should raise doubt about trusting its coefficients or predictions, before the model's output is used to inform a decision.

## When to use it
- You or a colleague fit a regression model and want a structured red-flag check before presenting its coefficients as "the effect of X on Y."
- A regression's coefficient sign or magnitude looks surprising and you want a systematic pass through the usual failure modes rather than guessing at one.
- Reviewing someone else's regression-based analysis before it's used to justify a decision (a pricing change, a resourcing call) that assumes the coefficients are trustworthy.

## The Prompt

```
You review a fitted regression model's diagnostics for red flags, given a description of the model and available diagnostic output — you do not refit the model or have access to the raw data, only what's described.

Model specification (dependent variable, independent variables, model type — OLS/logistic/etc.): {{MODEL_SPEC}}
Available diagnostics (whatever subset is known: residual plot description, VIF values, coefficient table with p-values/std errors, R², influential-point indicators like Cook's distance): {{DIAGNOSTICS}}
The claim or decision this model's output is meant to support: {{CLAIM}}

Instructions:
1. Residual patterns: based on {{DIAGNOSTICS}}' residual description (or state "not provided, cannot assess" if absent), check for signs of non-linearity, heteroscedasticity, or non-normality that would undermine standard-error-based inference (p-values, confidence intervals) even if the coefficient point estimates are usable.
2. Multicollinearity: if VIF or correlation data is given, flag any independent variable with a VIF above ~5-10 (or clearly correlated predictors) and explain concretely what this does to that variable's coefficient (inflated standard error, unstable sign, unreliable individual attribution) — rather than a generic "multicollinearity is present" statement.
3. Influential points: if Cook's distance, leverage, or similar is given, flag whether a small number of points appear to be driving the fit, and note that this is a specific risk for {{CLAIM}} if the influential points aren't representative of the population the claim is meant to generalize to.
4. Coefficient plausibility: check whether {{MODEL_SPEC}}'s coefficient signs and rough magnitudes (from {{DIAGNOSTICS}}) are directionally consistent with domain expectations stated or implied in {{CLAIM}} — an unexpected sign or an implausibly large magnitude is a stronger red flag than a merely "significant" p-value, and worth surfacing even without a formal diagnostic for it.
5. Fit quality in context: state what {{DIAGNOSTICS}}' R² (or equivalent) does and doesn't tell you about {{CLAIM}} — a low R² doesn't invalidate a genuine, useful effect, and a high R² doesn't validate a causal claim; don't let this metric alone drive the verdict.
6. For every flag raised, state whether it primarily threatens the model's predictive usefulness, its coefficient-level causal/explanatory interpretation, or both — {{CLAIM}} likely rests on one of these more than the other, and the diagnosis should say which threat actually matters for it.
7. If {{DIAGNOSTICS}} is missing information needed for a check (e.g. no residual plot description given), say so explicitly rather than skipping the section silently — a reviewer relying on this output should know what wasn't checkable.

Output format: Markdown with sections: Residual Patterns, Multicollinearity, Influential Points, Coefficient Plausibility, Fit Quality in Context, and a final Verdict stating whether {{CLAIM}} is well-supported, supported with caveats, or not well-supported by this model as diagnosed — naming the single most load-bearing flag if not fully supported.
```

## Variables
- `{{MODEL_SPEC}}` — dependent/independent variables and model type. Required.
- `{{DIAGNOSTICS}}` — whatever diagnostic output is available; partial is fine, but state which checks can't be run without it. Required (even if partial).
- `{{CLAIM}}` — what the model's output is meant to support. Required — the same diagnostics matter differently depending on whether the claim is predictive or causal/explanatory.

## Example
**Input:** `{{MODEL_SPEC}}` = "OLS: monthly_revenue ~ ad_spend + price + competitor_count + season_index." `{{DIAGNOSTICS}}` = "R² = 0.81. VIF: ad_spend 2.1, price 1.8, competitor_count 8.7, season_index 1.5. Coefficient on competitor_count: +340 (p=0.03), positive sign. Residual plot described as funnel-shaped, wider at higher fitted values." `{{CLAIM}}` = "More competitors in a market causes higher revenue for us, so we should enter more competitive markets."

**Output (excerpt):**
```
### Residual Patterns
The funnel-shaped residual plot indicates heteroscedasticity — variance of errors increases with fitted values. This means the reported p-values and confidence intervals (including competitor_count's p=0.03) are likely understated in reliability; consider this a caution flag on the "significant" label itself, not just the coefficient.

### Multicollinearity
competitor_count's VIF of 8.7 is in the concerning range (above ~5) — its coefficient is likely unstable and its standard error inflated. Combined with the heteroscedasticity flag above, the p=0.03 on this specific variable should be treated with real skepticism rather than as solid evidence.

### Influential Points
Not assessable — no Cook's distance or leverage information was provided in {{DIAGNOSTICS}}.

### Coefficient Plausibility
A positive coefficient on competitor_count (more competitors → higher revenue) is directionally surprising relative to the stated claim's own economic logic — competition typically pressures revenue down via price/customer-split effects, not up. A surprising sign combined with high VIF is a strong combined red flag, not two independent minor ones.

### Fit Quality in Context
R² = 0.81 indicates the model explains variance in monthly_revenue well overall, but this says nothing about whether competitor_count's specific coefficient is a reliable causal estimate — a model can fit well overall while being unreliable about one particular, collinear predictor.

### Verdict
Not well-supported. The competitor_count coefficient — the one {{CLAIM}} depends on entirely — is undermined by both high multicollinearity (VIF 8.7) and an implausible sign given the claim's own stated logic, further weakened by heteroscedasticity affecting the reliability of its p-value. Do not use this model to justify entering more competitive markets without addressing the multicollinearity (e.g. dropping or combining correlated predictors) and investigating the sign reversal first.
```

## Tips & Variations
- Distinct from `sql-query-performance-reviewer` and `statistical-test-selector` (both already shipped) — this prompt assumes a model has already been fit and diagnosed, reviewing its trustworthiness rather than selecting a test or optimizing a query.
- Pair with `forecast-assumption-stress-tester` (data-and-analysis, already shipped) if this regression's output is itself feeding into a forecast — that prompt stress-tests the forecast's assumptions, one of which may be this model's coefficient.
- This prompt works from whatever diagnostics are given, including partial information — a reviewer with only a coefficient table and no residual plot should still get a useful partial review with explicit "not assessable" notes, rather than the prompt refusing to proceed.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

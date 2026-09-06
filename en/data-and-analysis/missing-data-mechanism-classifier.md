---
id: missing-data-mechanism-classifier
title: Missing Data Mechanism Classifier
category: data-and-analysis
tags: [data-cleaning, statistics]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Helps classify whether missingness in a dataset is likely MCAR, MAR, or MNAR based on described patterns and available correlated columns, and states what that classification implies for handling — rather than defaulting to mean/mode imputation everywhere regardless of why the data is actually missing.

## When to use it
- Before choosing a missing-data handling method (deletion, simple imputation, multiple imputation), to check whether the missingness pattern actually supports that method's assumptions.
- A stakeholder or reviewer asks "why is this column missing so often, and does it matter?" and you need a structured, evidence-based answer rather than a guess.
- You're documenting a dataset's known limitations and want a defensible characterization of its missingness mechanism rather than a vague "some values are missing."

## The Prompt

```
You help classify the likely mechanism behind missing data in a specific column, and what that implies for handling — you do not perform the imputation itself.

The column with missing values, and its role in the analysis: {{MISSING_COLUMN}}
The missingness pattern as observed (e.g. "missing more often for older accounts," "appears roughly random across the dataset," "missing tends to co-occur with unusually low values in a related column," "missing entirely for one data source, present for another"): {{MISSINGNESS_PATTERN}}
Other columns available that might correlate with whether a value is missing: {{OTHER_COLUMNS}}
What the data will be used for downstream (a report, a predictive model, a one-off analysis): {{DOWNSTREAM_USE}}

Do the following:
1. Reason through the classic three mechanisms against {{MISSINGNESS_PATTERN}} and {{OTHER_COLUMNS}}: MCAR (missing completely at random — missingness is unrelated to any observed or unobserved value), MAR (missing at random conditional on observed data — missingness relates to other columns you can see, not to the missing value itself), MNAR (missing not at random — missingness relates to the value that would have been observed, e.g. high earners systematically not reporting income). State which is most plausible and why, citing the specific evidence in {{MISSINGNESS_PATTERN}} that supports it.
2. State your confidence level explicitly and why it's bounded: true classification generally can't be proven without the actual missing values, especially distinguishing MAR from MNAR — say what would need to be true for your classification to be wrong.
3. Recommend a handling approach matched to the classification: MCAR generally makes simple approaches (listwise deletion, mean/median imputation) defensible since missingness introduces no systematic bias; MAR calls for imputation that uses the correlated columns in {{OTHER_COLUMNS}} (e.g. regression or multiple imputation conditioned on those columns), since ignoring them would bias results; MNAR is a red flag that no imputation method can fully fix on its own — recommend domain investigation into *why* the value is missing, and if imputation is still necessary, explicit sensitivity analysis showing how conclusions change under different assumptions about the missing values.
4. Give one concrete diagnostic that would increase confidence in the classification (e.g. compare missingness rate across known subgroups in {{OTHER_COLUMNS}}, run a logistic regression predicting "is missing" from observed columns and check if it's meaningfully predictive, or if any ground truth exists for a subsample, compare missing vs. observed distributions).
5. Given {{DOWNSTREAM_USE}}, state explicitly whether defaulting to mean/mode imputation would introduce a meaningful bias for this specific use case, and if so, what direction that bias would likely run.

Output format: Markdown with headed sections: Likely Mechanism (with evidence), Confidence & Caveats, Recommended Handling, Diagnostic to Increase Confidence, Bias Risk for This Use Case.
```

## Variables
- `{{MISSING_COLUMN}}` — the column with missing values and its role in the analysis. Required.
- `{{MISSINGNESS_PATTERN}}` — the observed pattern of missingness. Required — this is the primary evidence the classification is built on.
- `{{OTHER_COLUMNS}}` — other available columns that might correlate with missingness. Required for distinguishing MAR from MCAR/MNAR.
- `{{DOWNSTREAM_USE}}` — what the data will be used for. Required — the same missingness mechanism carries different real-world risk for a one-off report versus a predictive model that will drive decisions at scale.

## Example
**Input:** `{{MISSING_COLUMN}}` = "self-reported annual income, used as a feature in a credit-risk model." `{{MISSINGNESS_PATTERN}}` = "Missing for about 15% of applicants; anecdotally, customer support has noted some applicants skip this field when their income is unusually high or unusually low, presumably out of privacy concern." `{{OTHER_COLUMNS}}` = "employment status, requested loan amount, applicant age, zip code." `{{DOWNSTREAM_USE}}` = "predictive model feature."

**Output (excerpt):**
```
### Likely Mechanism
MNAR is the leading hypothesis. {{MISSINGNESS_PATTERN}} directly suggests the missingness relates to the value itself (unusually high or low income), not just to other observed columns — the textbook MNAR signature. This isn't yet confirmed (it's based on anecdotal support observation, not measured evidence), but it's specific enough to treat as the working hypothesis rather than defaulting to MCAR.

### Confidence & Caveats
Moderate-low confidence. The evidence is anecdotal, not measured. If a formal check (see Diagnostic below) shows missingness is actually well-predicted by employment status or requested loan amount alone, the mechanism would look more like MAR instead, which changes the recommended handling meaningfully.

### Recommended Handling
Given the MNAR hypothesis, do not default to mean imputation — it would systematically pull imputed values toward the center and mute exactly the high/low income signal you're trying to capture for a credit-risk model, likely biasing the model's treatment of the highest- and lowest-risk applicants. Recommend: (1) add a missingness indicator as its own model feature, since "did not report income" may itself carry signal correlated with risk; (2) if imputation is still wanted, condition it on employment status, requested loan amount, and zip code rather than an unconditional mean; (3) treat any imputed income values as lower-confidence and consider a sensitivity check on model outputs with vs. without them.

### Diagnostic to Increase Confidence
Run a logistic regression predicting "income is missing" from employment status, requested loan amount, applicant age, and zip code. If it's strongly predictive, that supports MAR (missingness explained by observed data). If it has little predictive power, that's more consistent with the MNAR hypothesis — the missingness relates to the unobserved income value itself, not to what's visible in the other columns.

### Bias Risk for This Use Case
High. This is a predictive model that will influence real credit decisions — an MNAR mechanism handled with naive mean imputation risks systematically mis-scoring exactly the applicants at the income extremes, which is a fairness and accuracy risk, not just a statistical nicety.
```

## Tips & Variations
- Pair with `data-cleaning-script-generator-from-a-messy-sample` (data-and-analysis, already shipped) once a handling approach is chosen here — that prompt can generate the actual cleaning/imputation script, informed by this prompt's classification rather than a default choice.
- If {{DOWNSTREAM_USE}} is a one-off exploratory report rather than a model or repeated pipeline, the bar for handling can reasonably be lower (a documented caveat may suffice) — say so explicitly rather than recommending the same rigor regardless of stakes.
- This prompt classifies the mechanism and recommends a handling *direction*; it does not replace a statistician's judgment on borderline cases where MAR and MNAR are genuinely hard to distinguish even with the diagnostic — treat its output as a well-reasoned starting hypothesis, not a settled conclusion.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

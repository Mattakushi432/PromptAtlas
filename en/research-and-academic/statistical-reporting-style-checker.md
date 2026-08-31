---
id: statistical-reporting-style-checker
title: Statistical Reporting Style Checker
category: research-and-academic
tags: [research-design, statistics]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Checks a results section's statistical reporting against a target journal or style guide's formatting requirements — correct notation, required effect sizes and confidence intervals present, p-values formatted correctly — a mechanical compliance check, not a review of whether the statistics themselves are the right analysis for the research question.

## When to use it
- You're preparing a manuscript for a specific journal and want to check statistical reporting matches that journal's required style (e.g. APA 7th edition) before submission, since formatting non-compliance is a common and avoidable cause of desk-reject or revision requests.
- You're revising after a reviewer flagged incomplete statistical reporting (missing effect sizes, improperly formatted p-values) and want a systematic pass to catch every instance, not just the one the reviewer happened to mention.
- You're checking a co-author's or student's draft results section for style compliance before it goes out, especially useful when the paper reports many individual statistical tests that are easy to check inconsistently by eye.

## The Prompt

```
You check statistical reporting in a results section against a specified style guide's formatting requirements. You check compliance with reporting format and completeness — you do not evaluate whether the statistical tests chosen are appropriate for the research design, which is a separate methodological question.

Results section text: {{RESULTS_TEXT}}
Target style guide (e.g. APA 7th edition, a specific journal's author guidelines): {{STYLE_GUIDE}}
Type of statistics primarily reported (e.g. t-tests, ANOVA, regression, chi-squared): {{STATS_TYPE}}

Instructions:
1. Check p-value formatting against {{STYLE_GUIDE}}'s specific requirements: correct notation (italicized p, no leading zero per APA convention, exact value vs. threshold reporting rules, how very small p-values should be reported).
2. Check that every reported test statistic includes all elements {{STYLE_GUIDE}} requires for that statistic type — for a t-test: t-value, degrees of freedom, p-value, and (per most modern style guides including APA 7th) an effect size; for ANOVA: F-value, both degrees of freedom, p-value, effect size (e.g. η²); for regression: coefficient, standard error or confidence interval, and significance. Flag every instance missing a required element, not just the first one found.
3. Check for confidence intervals where {{STYLE_GUIDE}} requires them alongside or instead of significance testing — many modern style guides (including current APA guidance) now expect CIs reported for key effects, not just significance results.
4. Check notation consistency throughout {{RESULTS_TEXT}}: is the same statistic formatted the same way every time it's reported, or does formatting drift partway through (e.g. p-values formatted correctly in the first paragraph but inconsistently later)?
5. Check that statistics are reported in the specific numerical precision {{STYLE_GUIDE}} specifies (commonly 2 decimal places for most values, more for p-values near a threshold) — flag both under- and over-precision relative to the guide's convention.
6. If {{STYLE_GUIDE}} isn't a widely-known style (a specific journal's own author guidelines rather than APA/MLA/etc.), and specific requirements aren't fully knowable from the name alone, say so explicitly and check against the general modern-reporting-standard conventions while flagging that the actual journal guidelines should be consulted directly for anything this check can't confirm.

Output format: Markdown. For each non-compliant instance: the exact text as written, the specific rule violated, and the corrected format. Group by issue type (p-value formatting, missing effect size, missing CI, precision, consistency) rather than listing in text order, so patterns are visible. End with a compliance summary: fully compliant, or count of issues by category.
```

## Variables
- `{{RESULTS_TEXT}}` — the results section text with its statistical reporting. Required.
- `{{STYLE_GUIDE}}` — the specific target style guide or journal's formatting requirements. Required — compliance can't be checked against an unspecified standard.
- `{{STATS_TYPE}}` — the primary type(s) of statistics reported, since required elements differ by test type. Required.

## Example
**Input:** `{{RESULTS_TEXT}}` = "The treatment group showed significantly higher scores than control (t=2.87, p=0.005). A second comparison found no significant difference (t = 1.12, p = .264)." `{{STYLE_GUIDE}}` = "APA 7th edition" `{{STATS_TYPE}}` = "Independent-samples t-tests"

**Output (excerpt):**
```
### Missing effect size
- "t=2.87, p=0.005" — no effect size reported (e.g. Cohen's d). APA 7th requires an effect size accompany every reported significance test. Corrected: "t(df) = 2.87, p = .005, d = [value]" — degrees of freedom are also missing, see below.
- "t = 1.12, p = .264" — same issue: no effect size, and also no degrees of freedom.

### Missing degrees of freedom
- Neither reported t-value includes degrees of freedom, which APA 7th requires as t(df) = value, not a bare t-value.

### Notation inconsistency
- "p=0.005" (no spaces, leading zero) in the first instance versus "p = .264" (spaced, no leading zero — correct APA format) in the second — the first instance uses inconsistent and non-compliant formatting compared to the second within the same results section.

Compliance summary: Not fully compliant — 2 missing effect sizes, 2 missing degrees-of-freedom values, 1 p-value formatting inconsistency (leading zero + spacing) to correct before submission.
```

## Tips & Variations
- This prompt checks format and completeness, not statistical validity — pair with `methodology-section-critique` (research-and-academic, already shipped) if you also need a substantive check of whether the chosen tests and reported comparisons are actually appropriate for the research design, a different question from formatting compliance.
- For a paper reporting many statistics across a long results section, run this in sections rather than all at once if {{RESULTS_TEXT}} is very long — the group-by-issue-type output is most useful when the volume of findings stays manageable enough to actually act on.
- {{STYLE_GUIDE}} requirements evolve (APA 6th vs. 7th differ on several conventions checked here, e.g. effect-size and CI expectations) — confirm which edition or version applies before running this, since checking against the wrong version's rules will produce confidently wrong findings.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

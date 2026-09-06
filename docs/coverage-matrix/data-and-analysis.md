# Coverage Matrix: Data & Analysis

- **Sub-domain**: exploratory data analysis, SQL query writing, data visualization, statistical testing, dashboarding, data cleaning, forecasting, A/B test analysis, data storytelling
- **Persona**: analyst, data scientist, business stakeholder reading a report, engineer writing ad hoc queries
- **JTBD stage**: plan → generate → critique → explain
- **Output format**: SQL, chart spec, table, narrative summary

## Shipped

1. [EDA Plan Generator from a Dataset Description](../../en/data-and-analysis/eda-plan-generator-from-a-dataset-description.md) — EDA / plan / analyst.
2. [Natural-Language-to-SQL Query Drafter](../../en/data-and-analysis/natural-language-to-sql-query-drafter.md) — SQL / generate.
3. [A/B Test Result Interpreter](../../en/data-and-analysis/ab-test-result-interpreter.md) — A/B test analysis / explain.
4. [Chart Type Recommender for a Dataset Shape](../../en/data-and-analysis/chart-type-recommender-for-a-dataset-shape.md) — visualization / plan.
5. `statistical-test-selector` — statistical testing / plan / beginner — recommends the correct test (parametric or non-parametric) given data type, group structure, and sample size.
6. `sql-query-performance-reviewer` — SQL / critique / intermediate — reviews an analyst-facing reporting query for filter pushdown, join order, and columnar-scan cost, distinct from `sql-query-optimizer` (coding)'s schema/index-changing scope.
7. `anomaly-explanation-generator` — explain / intermediate — given a metric spike/drop and context, ranks plausible hypotheses (real shift, instrumentation bug, external factor, internal change) with a specific check per hypothesis.
8. `data-cleaning-script-generator-from-a-messy-sample` — data cleaning / generate / intermediate — generates an auditable, step-by-step cleaning script from a messy data sample and target schema.
9. `dashboard-metric-definition-auditor` — dashboarding / critique / intermediate — flags ambiguous or cross-dashboard-inconsistent metric definitions and proposes a precise restatement.
10. `cohort-analysis-setup-guide` — EDA / plan / intermediate — plans a cohort analysis setup (cohort definition, tracked metric, common pitfalls) for a business retention question.
11. `forecast-assumption-stress-tester` — forecasting / critique / advanced — identifies which input assumptions a forecast is most sensitive to and stress-tests the projection under plausible variations.
12. `data-story-narrative-builder-for-executives` — data storytelling / generate / intermediate (business stakeholder) — structures analysis findings into a headline-first executive narrative with a stated "so what," distinct from `architecture-decision-stakeholder-briefing` (coding)'s technical-decision framing.
13. `sample-size-power-calculator-advisor` — statistical testing / plan / beginner — estimates the sample size needed to detect a given effect size before running a test, the pre-test counterpart to `statistical-test-selector`.
14. `data-pipeline-freshness-auditor` — data cleaning / critique / intermediate — reviews a reporting pipeline's refresh cadence against how the dashboard is actually used, distinct from `dashboard-metric-definition-auditor`'s definition-consistency focus.
15. `survey-question-bias-auditor` — data collection / critique / intermediate — reviews survey questions for leading phrasing, double-barreled questions, and response-scale issues before fielding.
16. `funnel-drop-off-diagnostic-planner` — EDA / plan / intermediate — plans which segments/steps to slice a conversion funnel by to isolate where and for whom drop-off concentrates, distinct from `cohort-analysis-setup-guide`'s post-identification tracking setup.
17. `metric-correlation-vs-causation-sanity-checker` — explain / critique / intermediate — given two metrics that moved together, lists plausible confounders and a rough test for whether the relationship is likely causal, distinct from `anomaly-explanation-generator`'s single-metric spike/drop diagnosis.
18. `data-dictionary-generator-from-schema-and-sample` — documentation / generate / beginner — drafts human-readable column descriptions and known caveats from a table schema and sample rows, distinct from `dashboard-metric-definition-auditor`'s derived-metric-wording focus.
19. `segment-definition-overlap-auditor` — dashboarding / critique / intermediate — checks a set of user/customer segments for unintended overlap that would double-count in a summed report.
20. `regression-model-sanity-check-reviewer` — statistical testing / critique / advanced — reviews a fitted regression's diagnostics (residual patterns, multicollinearity, influential points) for red flags before trusting its coefficients.
21. `automation-handoff-reconciliation-checklist` — dashboarding / document / intermediate — a checklist for handing off a manually-built report to an automated pipeline without silently changing its numbers (renamed from the backlog's "Report Automation Handoff Checklist" for filename clarity).
22. `benchmark-comparison-fairness-auditor` — data storytelling / critique / intermediate — checks whether a "we beat the benchmark" comparison uses matched time windows, populations, and definitions before it's presented as a fair comparison.
23. `exploratory-chart-batch-prioritizer` — visualization / plan / beginner — given a fresh dataset and a business question, prioritizes which handful of exploratory charts to build first, distinct from `chart-type-recommender-for-a-dataset-shape`'s chart-type-for-a-known-variable scope.
24. `missing-data-mechanism-classifier` — data cleaning / plan / intermediate — helps classify whether missingness in a dataset is likely MCAR/MAR/MNAR and what that implies for handling it, rather than defaulting to mean-imputation everywhere.

## Backlog — ideas ready to draft

_Drawn down to 0 again this session (2026-09-06) — the 12 items above cleared the entire refilled backlog. Refilled below from the coverage matrix's dimension-crossing method (§6.1) before the next data-and-analysis session._

1. **Multiple-Comparisons Correction Advisor** — statistical testing / plan — decides whether and how to correct for multiple comparisons (Bonferroni, FDR) given how many tests/metrics are being checked at once, the natural next step after `statistical-test-selector`/`sample-size-power-calculator-advisor`.
2. **Data Lineage Tracer for a Confusing Number** — debug — given a metric that looks wrong, traces back through the likely transformation steps (raw source → cleaning → joins → aggregation) to find where the number probably diverged from expectation.
3. **Outlier Treatment Decision Guide** — data cleaning / plan — helps decide whether a detected outlier should be removed, capped, kept, or investigated further, given its likely cause and the analysis's purpose.
4. **KPI Tree Decomposition Builder** — dashboarding / plan — decomposes a single top-line KPI into its component drivers as a tree, to identify which sub-metric to investigate when the top-line moves.
5. **Statistical Significance vs. Practical Significance Explainer** — explain — given a statistically significant result, assesses and explains whether the effect size is actually large enough to matter for the decision at hand.
6. **Data Retention/Archival Policy Advisor** — data cleaning / plan — recommends what granularity and duration to retain raw vs. aggregated data for, given query patterns and storage cost constraints.
7. **Cross-Tool Metric Reconciliation Diagnostic** — critique — given the same metric reported differently by two tools/systems (e.g. Google Analytics vs. internal warehouse), diagnoses the likely sources of divergence.
8. **Longitudinal Survey Panel Attrition Assessor** — data collection / critique — assesses whether dropout in a repeated-measures survey panel is likely to bias results and what to check before trusting later waves.
9. **Data Visualization Accessibility Reviewer** — visualization / critique — reviews a chart design for colorblind-safe palettes, sufficient contrast, and non-color-dependent encoding before it ships to a wide audience.
10. **Experiment Guardrail Metric Selector** — plan — given a primary A/B test metric, recommends guardrail metrics to monitor so a "winning" primary metric doesn't hide a harmful side effect.
11. **Time Series Seasonality Diagnostic** — EDA / plan — helps identify whether a time series exhibits meaningful seasonality (and at what period) before choosing a forecasting or decomposition method.
12. **Analyst Handback Documentation Template** — documentation / document — a template for documenting an ad hoc analysis's assumptions, caveats, and reproduction steps well enough that another analyst can pick it up later without re-deriving context.

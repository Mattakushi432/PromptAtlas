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

## Backlog — ideas ready to draft

_Drawn down to 0 this session (2026-08-31) — the 8 items above cleared the entire starter backlog. Refilled below from the coverage matrix's dimension-crossing method (§6.1) before the next data-and-analysis session._

1. **Sample Size / Power Calculator Advisor** — statistical testing / plan — estimates the sample size needed to detect a given effect size before running a test, the pre-test counterpart to `statistical-test-selector`.
2. **Data Pipeline Freshness/Staleness Auditor** — data cleaning / critique — reviews a reporting pipeline's refresh cadence against how the dashboard is actually used, to catch silently-stale data being presented as current.
3. **Survey Question Bias Auditor** — data collection / critique — reviews survey questions for leading phrasing, double-barreled questions, and response-scale issues before fielding.
4. **Funnel Drop-Off Diagnostic Planner** — EDA / plan — plans which segments/steps to slice a conversion funnel by to isolate where and for whom drop-off concentrates.
5. **Metric Correlation vs. Causation Sanity-Checker** — explain / critique — given two metrics that moved together, lists plausible confounders and a rough test for whether the relationship is likely causal.
6. **Data Dictionary Generator from a Schema + Sample** — documentation / generate — drafts human-readable column descriptions and known caveats from a table schema and sample rows.
7. **Segment Definition Overlap Auditor** — dashboarding / critique — checks a set of user/customer segments for unintended overlap that would double-count in a summed report.
8. **Regression Model Sanity-Check Reviewer** — statistical testing / critique — reviews a fitted regression's diagnostics (residual patterns, multicollinearity, influential points) for red flags before trusting its coefficients.
9. **Report Automation Handoff Checklist** — dashboarding / document — a checklist for handing off a manually-built report to an automated pipeline without silently changing its numbers.
10. **Benchmark/Comparison Fairness Auditor** — data storytelling / critique — checks whether a "we beat the benchmark" comparison uses matched time windows, populations, and definitions before it's presented as a fair comparison.
11. **Exploratory Chart Batch Prioritizer** — visualization / plan — given a fresh dataset and a business question, prioritizes which handful of exploratory charts to build first rather than plotting every column.
12. **Missing Data Mechanism Classifier** — data cleaning / plan — helps classify whether missingness in a dataset is likely MCAR/MAR/MNAR and what that implies for how to handle it, rather than defaulting to mean-imputation everywhere.

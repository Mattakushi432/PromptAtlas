---
id: automation-handoff-reconciliation-checklist
title: Automation Handoff Reconciliation Checklist
category: data-and-analysis
tags: [checklist, automation, data-analysis]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-09-06
---

## Description
Produces a checklist for safely handing off a manually-built report to an automated pipeline (a dashboard, a scheduled query) without silently changing the numbers it produces — checks that the automated version reconciles against the manual baseline on definitions, filters, time windows, and rounding before the manual process is retired.

## When to use it
- A recurring manual report (a spreadsheet someone rebuilds every week) is being replaced by an automated dashboard or scheduled query, and you want to verify the automated version actually reproduces the same numbers before cutting over.
- Stakeholders have started asking why "the new dashboard" shows a different number than "the old report" for the same period, and you need a structured way to find where the two diverge.
- You're the one retiring your own manual process and want a defensible record that the handoff was verified, not just assumed to match.

## The Prompt

```
You produce a handoff checklist verifying that an automated report reproduces a manual report's numbers before the manual version is retired.

The manual report's process, described in plain language (source data, filters, calculations, any manual adjustments or known workarounds): {{MANUAL_PROCESS}}
The automated version replacing it (the query, dashboard, or pipeline logic): {{AUTOMATED_VERSION}}
Known caveats or manual "hacks" baked into the current process, if any (e.g. "we manually exclude test accounts by name," "currency is converted at month-end rate, not daily"): {{KNOWN_CAVEATS}}
How many past reporting periods should be reconciled side-by-side before cutover: {{RECONCILIATION_WINDOW}}

Produce a checklist covering:
1. Metric definition parity: does {{AUTOMATED_VERSION}} compute the exact same formula (same numerator, denominator, aggregation) as {{MANUAL_PROCESS}}, not just a same-named metric that happens to differ in a subtle way?
2. Filter/segment parity: do inclusion/exclusion filters match exactly, including any filters implied by {{KNOWN_CAVEATS}} that might not be obvious from {{MANUAL_PROCESS}}'s description alone (test accounts, internal users, a specific excluded region)?
3. Time handling parity: do date/time-zone boundaries, period cutoffs, and any point-in-time vs. as-of-today logic match? This is the single most common silent-mismatch source when a manual process ran on a different cadence or time zone than the automated one.
4. Rounding and aggregation-order parity: does {{AUTOMATED_VERSION}} round/sum in the same order as {{MANUAL_PROCESS}} (e.g. summing raw values then rounding, versus rounding then summing) — these can diverge by small but real amounts.
5. Historical reconciliation: for each of the last {{RECONCILIATION_WINDOW}} periods, both versions should be run side-by-side and any discrepancy explained (a real bug, or a known, accepted definitional shift) before being signed off as matching — not assumed to match because they look close.
6. Caveat migration: for each item in {{KNOWN_CAVEATS}}, confirm explicitly whether it's been replicated in {{AUTOMATED_VERSION}}, deliberately dropped (and who approved dropping it), or missed.
7. Cutover safety net: recommend running both versions in parallel for at least one more cycle after reconciliation looks clean, and a named owner who signs off before the manual version is actually retired.

Output format: Markdown checklist grouped under the 7 headings above, each item phrased as a yes/no check plus what to do if it fails.
```

## Variables
- `{{MANUAL_PROCESS}}` — the manual process being replaced, described in plain language. Required.
- `{{AUTOMATED_VERSION}}` — the automated pipeline/query/dashboard replacing it. Required.
- `{{KNOWN_CAVEATS}}` — known manual adjustments or workarounds baked into the current process. Optional but strongly recommended — this is where silent mismatches most often hide.
- `{{RECONCILIATION_WINDOW}}` — how many past periods to compare side-by-side before cutover. Required.

## Example
**Input:** `{{MANUAL_PROCESS}}` = "Weekly revenue-by-region spreadsheet: pulls raw transactions from the billing export, excludes rows tagged 'internal test,' converts non-USD amounts using the rate on the last day of the week, sums by region." `{{AUTOMATED_VERSION}}` = "A SQL view joining transactions to a daily FX-rate table, converting each transaction at its own transaction-date rate, filtered on `account_type != 'test'`." `{{KNOWN_CAVEATS}}` = "The 'internal test' tag is applied manually and inconsistently — some test accounts are tagged `account_type = 'internal'` instead." `{{RECONCILIATION_WINDOW}}` = "4 weeks"

**Output (excerpt):**
```
### 1. Metric Definition Parity
Same base metric (summed transaction revenue by region) — pass.

### 2. Filter/Segment Parity
Risk found: automated filter (`account_type != 'test'`) doesn't clearly cover manual filter's actual practice (excluding rows "tagged internal test," which per {{KNOWN_CAVEATS}} sometimes uses `account_type = 'internal'` instead of `'test'`). Action: confirm with whoever tags test accounts whether `'internal'` should also be excluded, then update the automated filter to match, not just the documented rule.

### 3. Time Handling Parity
Mismatch found: manual process converts currency once at the week's last-day rate; automated converts per-transaction at its own daily rate. These will diverge for any week with FX movement, more so for high-value transactions early in the week. This is a real methodology difference, not just an implementation detail — flag to stakeholders whether the automated (more accurate) method should become the new standard, with prior periods noted as using the older method.

### 5. Historical Reconciliation
Run both versions for the last 4 weeks. Given the FX-timing difference above, expect a small but nonzero delta each week — confirm the delta's size is consistent with FX movement alone (not also masking a filter bug) before signing off.

### 6. Caveat Migration
"Internal test" tagging inconsistency: not yet replicated — needs the account_type fix from #2 before cutover.

### 7. Cutover Safety Net
Recommend running both in parallel for one additional cycle after the account_type fix lands, with the finance stakeholder who owns the weekly report as sign-off owner before the spreadsheet is retired.
```

## Tips & Variations
- Distinct from `dashboard-metric-definition-auditor` (data-and-analysis, already shipped): that prompt audits whether metric *definitions* are precisely and consistently stated across dashboards; this one verifies that an automated *implementation* actually reproduces a specific manual process's numbers during a handoff, which is a narrower, transition-specific safety check.
- If {{KNOWN_CAVEATS}} comes back "none that I know of," treat that as a prompt to actually interview whoever built the manual process rather than skip step 6 — undocumented manual workarounds are the norm, not the exception, for reports that have existed for more than a few months.
- Pair with `data-cleaning-script-generator-from-a-messy-sample` (data-and-analysis, already shipped) if the reconciliation in step 5 turns up a data-quality issue in the source data itself rather than a logic mismatch between the two report versions.

## Changelog
- 1.0.0 (2026-09-06): Initial version.

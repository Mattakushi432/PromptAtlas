---
id: data-cleaning-script-generator-from-a-messy-sample
title: Data Cleaning Script Generator from a Messy Sample
category: data-and-analysis
tags: [data-analysis, data-cleaning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Given a small representative sample of messy raw data and a target clean schema, generates an auditable, step-by-step data-cleaning script — each step names the specific pattern it fixes and why — rather than a black-box transformation an analyst has to trust blindly against the full dataset it was never shown.

## When to use it
- You have a raw export (CSV, a spreadsheet, a query result) with inconsistent formatting, missing values, or mixed types in one column, and want a cleaning script drafted from a representative sample before running it against the full dataset.
- You're about to hand-write repetitive cleaning code and want a first draft that already names the specific issues in your sample, so you're reviewing and adjusting rather than writing from scratch.
- A cleaning script someone else wrote is producing unexpected results, and you want to see whether it's actually handling every pattern visible in a fresh sample of the real data.

## The Prompt

```
You generate a data-cleaning script from a representative sample of messy data. Every cleaning step must be explicit and auditable — name the specific pattern it targets and why, so the person running it can verify each step against the full dataset rather than trusting a black-box transform.

Messy data sample: {{MESSY_SAMPLE}}
Target clean schema/format (column names, types, expected value formats): {{TARGET_SCHEMA}}
Tool/language for the script (e.g. pandas, SQL, dplyr): {{TOOL}}

Instructions:
1. Inventory every distinct data-quality issue visible in {{MESSY_SAMPLE}} before writing any code — inconsistent formatting (dates in multiple formats, inconsistent casing), missing/null values and how they're represented (empty string vs. "N/A" vs. actual null), likely duplicate rows (exact or near-duplicate), mixed types within one column (numbers stored as text with stray characters), and any values that don't match {{TARGET_SCHEMA}}'s expected format.
2. For each issue found, write one cleaning step in {{TOOL}}, and comment it with what pattern it targets and what it does NOT handle — e.g. a regex that strips a specific currency symbol should note it won't catch a different symbol not seen in the sample, so the analyst knows to check for that on the full data.
3. Order the steps so that dependencies are respected (e.g. deduplicate before aggregating, standardize types before comparing values) and so a broken early step doesn't silently corrupt everything downstream — reference the exact issue each step depends on resolving first.
4. Do not silently drop or impute rows/values without flagging it as a decision, not an automatic default — if a cleaning step would drop rows (e.g. unparseable dates) or fill a value (e.g. defaulting missing values to zero), call this out explicitly as something the analyst should confirm is the right call for the actual data, since the sample may not represent every case in the full dataset.
5. Add a final validation step that checks the cleaned output actually matches {{TARGET_SCHEMA}} (correct types, no unexpected nulls in required fields, values within expected ranges/formats) so a silent failure in an earlier step doesn't go unnoticed.
6. Explicitly flag any pattern that might exist in the full dataset but doesn't appear in {{MESSY_SAMPLE}} and therefore isn't handled by this script — a small sample cannot guarantee coverage of every messy pattern in the real data.

Output format: Markdown. First, a numbered "Issues Found" list from step 1. Then the full commented script. End with a "Not Handled" section listing anything from step 6, and a one-line instruction to re-run this prompt with a fresh sample if the full-data run surfaces new unhandled patterns.
```

## Variables
- `{{MESSY_SAMPLE}}` — a representative excerpt of the actual raw data, ideally including known edge cases if you're aware of any. Required — the script's coverage is bounded by what's visible here.
- `{{TARGET_SCHEMA}}` — the desired clean output: column names, types, and expected value formats. Required.
- `{{TOOL}}` — the language/library the script should be written in. Required.

## Example
**Input:** `{{MESSY_SAMPLE}}` = "rows include: `'2026-01-05', '01/06/2026', 'Jan 7 2026'` in a date column; a price column with values like `'$19.99', '20', 'N/A', ''`; two rows that look like duplicates of the same order with slightly different capitalization in the customer name." `{{TARGET_SCHEMA}}` = "order_date: ISO date (YYYY-MM-DD); price: float; customer_name: string, title case" `{{TOOL}}` = "pandas"

**Output (excerpt):**
```
### Issues Found
1. Dates in three different formats (ISO, MM/DD/YYYY, "Mon D YYYY").
2. Price column mixes currency-prefixed strings, plain numbers, "N/A", and empty strings.
3. Likely near-duplicate rows differing only in name capitalization.

### Script
```python
# Issue 1: parse mixed date formats. Handles ISO, MM/DD/YYYY, and "Mon D YYYY" as seen in the sample.
# Does NOT handle DD/MM/YYYY — if the full data includes non-US date order, this will misparse silently. Verify format consistency before trusting this on the full dataset.
df['order_date'] = pd.to_datetime(df['order_date'], format='mixed', errors='coerce')

# Issue 2: normalize price. Strips '$' and commas, treats 'N/A' and '' as missing rather than 0.
# Decision flag: rows with unparseable price become NaN, not 0 — confirm this is correct before any downstream sum/average, since NaN vs. 0 changes aggregate results differently.
df['price'] = df['price'].replace(['N/A', ''], pd.NA)
df['price'] = df['price'].astype(str).str.replace('[$,]', '', regex=True)
df['price'] = pd.to_numeric(df['price'], errors='coerce')

# Issue 3: deduplicate on a case-insensitive customer_name + likely other identifying columns (adjust based on what actually identifies a unique order).
df['customer_name_normalized'] = df['customer_name'].str.strip().str.lower()
df = df.drop_duplicates(subset=['customer_name_normalized', 'order_date'], keep='first')
df['customer_name'] = df['customer_name'].str.title()
df = df.drop(columns=['customer_name_normalized'])

# Validation
assert df['order_date'].notna().all() or df['order_date'].isna().sum() < len(df) * 0.05, "Unexpectedly high date-parse failure rate — check for an unhandled date format."
assert df['price'].dtype == float
```

### Not Handled
No negative prices seen in the sample — if the full data can have refunds/negative amounts, add a check for that; this script currently treats a negative price the same as any other numeric value without flagging it.
```

## Tips & Variations
- Pair with `test-fixture-generator` (coding, already shipped) in reverse — if you want to stress-test this cleaning script before running it on real data, generate synthetic messy fixtures covering edge cases beyond what {{MESSY_SAMPLE}} showed, then confirm the script handles or explicitly rejects them.
- Always run the generated script's validation step against the full dataset, not just the sample — the "Not Handled" section exists specifically because a sample can't prove absence of a pattern, only its presence.
- If the messy data comes from multiple source systems with different quirks (e.g. two CRMs merged into one export), consider running this prompt once per source system rather than pooling a sample across both, since the resulting script may otherwise average away system-specific patterns that need separate handling.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

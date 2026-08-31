---
id: personal-finance-budget-sanity-checker
title: Personal Finance Budget Sanity-Checker
category: productivity-and-personal
tags: [personal-finance, productivity]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Sanity-checks a personal budget for internal inconsistencies and unrealistic assumptions — categories that don't sum correctly, spending categories suspiciously absent given stated lifestyle, and savings targets that aren't actually achievable given the numbers already stated — not investment or tax advice, and not a judgment on spending choices themselves.

## When to use it
- You've drafted a budget and want a check for math errors and internal inconsistencies before committing to it, the kind of mistakes that are hard to spot in your own spreadsheet.
- Your actual spending keeps diverging from your budget and you suspect the budget itself was unrealistic from the start, not that you're failing to follow it.
- You're setting a savings goal and want to check whether the numbers in your own stated budget actually support reaching it in the stated timeframe.

## The Prompt

```
You sanity-check a personal budget for internal consistency and realism. You do not give investment, tax, or legal advice, and you do not judge spending choices as good or bad — you check whether the numbers as given are internally consistent and achievable.

Budget (income and expense categories with amounts): {{BUDGET}}
Stated savings goal, if any (amount and timeframe): {{SAVINGS_GOAL}}
Anything about lifestyle/circumstances relevant to spending categories (optional): {{CONTEXT}}

Instructions:
1. Check the arithmetic: do the listed expense categories plus stated savings actually sum to (or below) the stated income? Flag any gap explicitly with the actual numbers, not just "this doesn't add up."
2. Check for commonly-missing categories given {{CONTEXT}} — irregular but predictable expenses (annual insurance premiums, car maintenance, gifts/holidays, subscriptions) that often get left out of a monthly budget because they don't recur every single month, even though they're real and predictable over a year.
3. Check whether any category looks implausibly low or high relative to typical proportions for the stated income level or {{CONTEXT}} — not to impose a "correct" number, but to flag "this looks unusually low/high — is that intentional, or did something get miscounted?"
4. If {{SAVINGS_GOAL}} is given, calculate whether the budget's stated monthly savings amount actually reaches the goal within the stated timeframe — do the arithmetic explicitly rather than eyeballing it, and if it doesn't work, state the actual gap (how much more per month, or how much longer it would take at the current rate).
5. Check for double-counting or overlap between categories (e.g. "groceries" and "food" both listed separately when they likely overlap) that would make the total look more precise than it actually is.
6. Do not recommend specific spending cuts or reallocations unless asked — this prompt's job is to check the numbers as given, not to redesign the budget's priorities, which are the person's own choice to make.

Output format: Markdown with sections: Arithmetic Check, Commonly-Missing Categories, Proportion Flags, Savings Goal Feasibility (if {{SAVINGS_GOAL}} given). End with a one-line summary: internally consistent, or specific issues to resolve.
```

## Variables
- `{{BUDGET}}` — the income and expense categories with their amounts. Required.
- `{{SAVINGS_GOAL}}` — a stated savings target and timeframe, if the budget is meant to support one. Optional — omit if there's no specific goal to check against.
- `{{CONTEXT}}` — relevant lifestyle/circumstance details (renting vs. owning, has kids, self-employed) that affect which categories are plausible or commonly missed. Optional, but improves the missing-category and proportion checks.

## Example
**Input:** `{{BUDGET}}` = "Income: $4,500/mo. Rent: $1,500. Groceries: $400. Transportation: $200. Subscriptions: $50. Savings: $500. (Total expenses + savings: $2,650)" `{{SAVINGS_GOAL}}` = "$15,000 down payment in 18 months" `{{CONTEXT}}` = "Owns a car, no kids, renting"

**Output (excerpt):**
```
### Arithmetic Check
Listed expenses + savings total $2,650 against $4,500 income — that leaves $1,850/mo unaccounted for. Either there are unlisted categories, or this budget is significantly incomplete as drafted.

### Commonly-Missing Categories
Given {{CONTEXT}} (owns a car): no category for car insurance, registration, or maintenance — "Transportation" at $200/mo likely covers fuel/parking but these irregular costs (an annual insurance premium, occasional repairs) are easy to leave out and often the reason a budget looks fine on paper but doesn't match actual spending. Also missing: any category for irregular annual costs (gifts, holidays) and no discretionary/miscellaneous category at all, which given the $1,850 unaccounted gap is likely where much of the actual spending is going unlabeled.

### Savings Goal Feasibility
At the stated $500/mo, reaching $15,000 in 18 months requires $833/mo ($15,000 ÷ 18) — the current budgeted savings rate falls short by $333/mo. At $500/mo, the goal would take 30 months instead of 18, given no other changes.

Summary: Not internally consistent — $1,850/mo of income is unaccounted for in the stated categories, and as budgeted, the savings goal will take significantly longer than stated. Resolve the missing $1,850 first; it likely contains both the missing categories noted above and slack that could close the savings gap.
```

## Tips & Variations
- Pair with `decision-matrix-builder-for-a-hard-choice` (productivity-and-personal, already shipped) if the budget check reveals a genuine tradeoff decision (e.g. cut discretionary spending vs. extend the savings timeline) — that prompt structures the choice once this one has surfaced that a choice is actually needed.
- This prompt intentionally stays out of investment/tax territory — for questions about where to put savings, tax-advantaged accounts, or debt payoff strategy, that's a different kind of advice this prompt isn't scoped to give, and a qualified professional is the right resource for decisions with real financial stakes.
- Run this whenever income or a major recurring expense changes (a raise, a rent increase), not just once at initial budget creation — a budget that was internally consistent when made can drift out of sync silently.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

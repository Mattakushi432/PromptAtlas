---
id: automation-roi-scoping-worksheet
title: Automation ROI Scoping Worksheet
category: agents-and-automation
tags: [automation, planning, cost-optimization]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Produces a plain-language worksheet estimating whether a specific manual process is actually worth automating — time currently spent, a rough build/maintenance cost estimate, the break-even point, and risk factors like how often the process changes and how costly an automation mistake would be — for deciding whether to build before any recipe or code gets written.

## When to use it
- Someone on the team proposed automating a manual process and you want a quick, structured gut-check on whether it's actually worth the build effort before committing time to it.
- You have several candidate processes to automate and limited time, and want a comparable estimate across them to prioritize.
- An existing automation is under discussion for removal or a rebuild, and you want to reassess whether its original ROI case still holds given how the process has changed since.

## The Prompt

```
You produce a plain-language worksheet estimating whether a manual process is worth automating.

The manual process, described in plain language: {{PROCESS}}
How often it happens and roughly how long it takes each time: {{FREQUENCY_AND_TIME}}
Rough estimate of build effort, if known (or "unknown" to have this prompt estimate it from the process description): {{BUILD_EFFORT}}
How often the process itself changes (rarely, occasionally, frequently) and how tolerant it is of an automation getting it wrong (low/medium/high stakes if it errs): {{VOLATILITY_AND_STAKES}}

Instructions:
1. Calculate current time cost: using {{FREQUENCY_AND_TIME}}, estimate total person-hours per month currently spent on {{PROCESS}}. Show the arithmetic, not just the result.
2. Estimate build cost: if {{BUILD_EFFORT}} is given, use it; if "unknown," estimate a rough range (e.g. "a few hours in a no-code tool" vs. "several days of custom integration work") based on how many systems and conditional branches {{PROCESS}} appears to involve, and state this is a rough estimate requiring validation, not a firm quote.
3. Estimate ongoing maintenance cost: a one-time build isn't the full cost — flag time spent monitoring, fixing breakages when a connected system changes, or handling edge cases the automation doesn't cover. Weight this against {{VOLATILITY_AND_STAKES}}'s "how often it changes" answer — a frequently-changing process implies meaningfully higher ongoing cost than a stable one.
4. Calculate a rough break-even point: given the time saved per month (from step 1) versus the build cost (from step 2) plus ongoing maintenance (from step 3), estimate roughly how many months until the automation has paid for itself in time saved. State this as a range, not a false-precision single number.
5. Assess risk given {{VOLATILITY_AND_STAKES}}'s stakes answer: if getting this process wrong occasionally would be low-stakes (easily caught and corrected) versus high-stakes (customer-facing, financial, hard to reverse), state how that should affect the automation's design (e.g. requiring a human-approval step before high-stakes actions) rather than just noting it as a caveat.
6. Give a plain verdict: worth automating now, worth automating but only with a simpler/cheaper first version, or not worth it yet — and the single biggest factor driving that verdict (time saved, build cost, volatility, or stakes).

Output format: Markdown worksheet with labeled sections: Current Time Cost, Build Cost Estimate, Ongoing Maintenance Estimate, Break-Even Point, Risk Assessment, Verdict.
```

## Variables
- `{{PROCESS}}` — the manual process being considered for automation, described in plain language. Required.
- `{{FREQUENCY_AND_TIME}}` — how often it happens and roughly how long each instance takes. Required — this is the entire basis for the time-savings calculation.
- `{{BUILD_EFFORT}}` — a known build-effort estimate, or "unknown" to have the prompt produce a rough one. Optional.
- `{{VOLATILITY_AND_STAKES}}` — how often the process changes and how costly a mistake would be. Required — this drives both the maintenance estimate and the risk assessment.

## Example
**Input:** `{{PROCESS}}` = "Every time a new employee starts, HR manually creates accounts in Slack, Google Workspace, and the HR system, then emails IT a checklist." `{{FREQUENCY_AND_TIME}}` = "About 4 new hires per month, roughly 45 minutes of manual work each time." `{{BUILD_EFFORT}}` = "unknown" `{{VOLATILITY_AND_STAKES}}` = "The account-creation steps rarely change; getting it wrong (e.g. missing a system) is medium-stakes — the new hire is blocked on day one but it's caught and fixed quickly."

**Output (excerpt):**
```
### Current Time Cost
4 hires/month × 45 minutes = 180 minutes (3 hours) of HR time per month, plus whatever time IT spends acting on the emailed checklist (not specified — worth quantifying separately).

### Build Cost Estimate
{{BUILD_EFFORT}} unknown — estimating: 3 systems (Slack, Google Workspace, HR system) with a straightforward trigger (new-hire record created) and no complex conditional branches described. This looks like a few hours of setup in a no-code tool (e.g. Zapier/Make), not a custom-integration-scale project. Rough estimate: 3-6 hours of one person's time — validate against the actual APIs/admin consoles involved before committing to this range.

### Break-Even Point
At 3 hours/month saved and ~4-6 hours of build cost, break-even is roughly 1.5-2 months, assuming minimal ongoing maintenance (see below).

### Risk Assessment
Medium-stakes, low-volatility: worth automating, but since a missed step blocks a new hire on day one, the automation should send a confirmation summary to HR after running (not run silently) so a missed step is caught immediately rather than discovered by the new hire.

### Verdict
Worth automating now — fast break-even, low volatility keeps maintenance cost low, and the medium-stakes risk is manageable with a simple confirmation-summary safeguard rather than requiring a full human-approval gate.
```

## Tips & Variations
- Pair with `no-code-automation-recipe-builder` (agents-and-automation, already shipped) immediately after a "worth automating" verdict — that prompt turns the now-justified automation into an actual buildable recipe.
- If {{VOLATILITY_AND_STAKES}} indicates high stakes (financial, customer-facing, hard to reverse), treat a low break-even point as less persuasive on its own — a fast-payback automation that occasionally does real damage isn't actually a good trade, and the worksheet's step 5 should weigh that explicitly rather than letting the break-even number dominate the verdict.
- This worksheet estimates time and risk, not team morale or error-proneness of the manual version — if the manual process is itself highly error-prone (not just slow), that's a separate, often stronger case for automating that this prompt doesn't directly capture; mention it explicitly in {{PROCESS}} if it applies so the verdict can account for it.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

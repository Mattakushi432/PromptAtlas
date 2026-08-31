---
id: feature-flag-sprawl-auditor
title: Feature Flag Sprawl Auditor
category: coding
tags: [feature-flags, dead-code, devops]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Flags feature flags that are safe to delete because the code no longer has any real variance behind them — a code-level dead-flag detector, distinct from `tech-debt-prioritization-matrix` (coding, already shipped)'s general ROI-ranked paydown planning and from `feature-flag-rollout-planner` (coding, already shipped)'s rollout-stage design: this prompt is specifically about finding flags whose both branches have converged or whose flag check is now unreachable.

## When to use it
- Your codebase has accumulated feature flags over time and you suspect several are fully rolled out (or fully killed) but the flag checks were never removed.
- You want a systematic pass before a cleanup sprint, rather than manually hunting for stale flags one at a time.
- A new engineer keeps asking what a given flag does and nobody's sure if it's still meaningfully gating anything.

## The Prompt

```
You audit feature flags in a codebase for ones that are safe to delete — flags where the code no longer has any real variance behind them, because one branch is dead, unreachable, or the flag's value has been effectively constant for a long time. You flag candidates for removal; you do not delete code yourself.

Flag usage locations (grep results or code snippets): {{FLAG_USAGES}}
Flag configuration/current values (if available): {{FLAG_CONFIG}}
Flag age/rollout history (if known): {{FLAG_HISTORY}}

Instructions:
1. For each flag, check whether both the true and false branches of its check are still reachable in practice, or whether one branch is dead code (e.g. the false branch does something no longer possible given other application state, or the flag has been at 100% rollout for a documented period per {{FLAG_HISTORY}}).
2. Flag a candidate as "safe to delete, keep the true-branch code" when the flag is effectively always true given {{FLAG_CONFIG}}/{{FLAG_HISTORY}} — state which branch survives and which should be removed.
3. Flag a candidate as "safe to delete, keep the false-branch code" when the flag was fully rolled back or never fully launched and is now effectively always false — this is the case most easily missed, since a flag added for a launch that later got reverted often gets forgotten rather than cleaned up.
4. Do not flag a flag as removable just because it looks stale by age alone — check for actual evidence of fixed/converged behavior (100% rollout with no planned experiment continuation, an explicit "fully launched" note, or literally unreachable branches) rather than guessing from age. If {{FLAG_HISTORY}}/{{FLAG_CONFIG}} isn't given, say explicitly that removability can't be confirmed from usage locations alone.
5. Distinguish a genuinely dead flag from an intentional permanent kill-switch (e.g. an emergency-disable flag that's meant to stay at "on" indefinitely but exist for incident response) — a kill-switch flag being at a stable value is not evidence it's dead; flag this distinction explicitly rather than recommending removal of an intentional safety mechanism.
6. For each flag flagged as removable, note every file location where its check appears, so the removal scope is concretely visible before anyone commits to the cleanup.

Output format: Markdown, one entry per flag: name, verdict (safe to delete / keep — reason / needs more info), which branch survives if removable, and all file locations where the check appears.
```

## Variables
- `{{FLAG_USAGES}}` — grep results or code snippets showing every place a given flag is checked. Required.
- `{{FLAG_CONFIG}}` — the flag's current configured value/rollout percentage, if available from the flag management system. Recommended — without it, verdicts stay tentative.
- `{{FLAG_HISTORY}}` — when the flag was introduced and any known rollout milestones. Optional but improves confidence in the verdict significantly.

## Example
**Input:** `{{FLAG_USAGES}}` = "`if (flags.newCheckoutFlow) { renderNewCheckout() } else { renderLegacyCheckout() }` — appears in CheckoutPage.tsx, CheckoutAnalytics.ts" `{{FLAG_CONFIG}}` = "newCheckoutFlow: 100% rollout, no experiment currently attached" `{{FLAG_HISTORY}}` = "Introduced 14 months ago for a checkout redesign launch"

**Output (excerpt):**
```
### Flag: newCheckoutFlow
Verdict: Safe to delete — keep the true-branch code (`renderNewCheckout()`).
Reasoning: 100% rollout with no attached experiment, stable for an extended period per history — the false branch (`renderLegacyCheckout()`) is effectively dead code at this point.
Locations to update: CheckoutPage.tsx (conditional render), CheckoutAnalytics.ts (flag-gated analytics event).
Note: confirm with the checkout team that `renderLegacyCheckout()` isn't kept intentionally as a fallback kill-switch before removing — 100% rollout alone doesn't rule out an intentional safety net, though nothing in the provided history suggests that's the intent here.
```

## Tips & Variations
- Run this periodically (e.g. quarterly) rather than only during a dedicated cleanup sprint — flag sprawl compounds gradually, and catching it early keeps each cleanup pass small.
- For a flag flagged "needs more info," that's itself useful signal — it usually means the flag's ownership or rollout status isn't clearly tracked anywhere, which is a process gap worth fixing independent of this specific flag's fate.
- Pair with `dead-code-finder` (coding, already shipped) for a broader dead-code pass once flag-related dead branches are confirmed and removed — this prompt is scoped specifically to flag-gated code, not dead code in general.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

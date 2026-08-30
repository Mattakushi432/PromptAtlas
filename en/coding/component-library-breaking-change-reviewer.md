---
id: component-library-breaking-change-reviewer
title: Shared Component Library Breaking-Change Reviewer
category: coding
tags: [frontend, design-systems, api-design]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Assesses a proposed change to a shared design-system/component library's blast radius across consuming teams and apps, before publishing a new version. The frontend/component-library counterpart to `api-consumer-impact-mapper`'s backend API focus — applied to prop APIs, visual defaults, and behavior contracts instead of endpoint contracts.

## When to use it
- Changing a shared component's prop API, default styling, or behavior and need to know which consuming apps would break.
- Deciding whether a change is genuinely a patch/minor version or secretly a major breaking change.
- Publishing a new design-system version and preparing consumers for what actually changes for them.

## The Prompt

```
You are assessing the blast radius of a proposed change to a shared component library across the teams/apps that consume it — you are not reviewing the implementation quality of the change itself.

Proposed change (what's changing in the component — a prop rename/removal, a default value change, a behavior change): {{PROPOSED_CHANGE}}

Known consumers (apps/teams known to use this component, and how, if known): {{KNOWN_CONSUMERS}}

Usage discovery methods (optional — a monorepo-wide code search, the component library's own usage analytics if it has any): {{USAGE_DISCOVERY_METHODS}}

1. Classify the change: patch-safe (no consumer-visible behavior or appearance change), needs-a-minor-version-with-deprecation-path (additive or has a backward-compatible transition), or genuinely-major/breaking (an existing consumer's current usage would visibly break or look wrong without changes on their end).
2. For each known consumer, assess whether their described usage pattern is actually affected — a default styling change might be invisible to a consumer who always explicitly overrides that specific prop, while it would break one who relies on the default.
3. Specifically flag a "visual-only" breaking change category if relevant — a spacing, color, or sizing shift is often waved off as "not really breaking" because nothing throws an error, but it can still break a consuming team's design intent, layout assumptions, or accessibility contrast ratios. Treat this as a real breaking-change category, not a lesser concern than a functional break.
4. Propose a discovery plan for consumers not on the known list, using whatever discovery methods are actually available, rather than treating the known list as necessarily complete.

Output: classification, per-consumer impact assessment, discovery plan for unknowns, and a recommended version bump.

If the change is genuinely additive (a new optional prop, a new variant that doesn't change any existing behavior), confirm that plainly rather than assuming every component library change warrants this full level of scrutiny — over-applying a heavyweight review to trivially safe changes wastes reviewer time and trains people to skip the review for things that actually matter.
```

## Variables
- `{{PROPOSED_CHANGE}}` — what's changing in the component. Required.
- `{{KNOWN_CONSUMERS}}` — apps/teams known to use the component and how. Required.
- `{{USAGE_DISCOVERY_METHODS}}` — tooling available to find consumers not already known. Optional; without it, general discovery approaches are suggested.

## Example
**Input:** `{{PROPOSED_CHANGE}}` = "changing the default `size` prop on the Button component from 'medium' to 'small'", `{{KNOWN_CONSUMERS}}` = "Checkout app (uses Button extensively, doesn't override `size` on ~80% of usages, per a quick grep), Admin Dashboard app (explicitly sets `size` on every Button usage, confirmed via code review)".

**Output (excerpt):**
```
Classification: genuinely-major/breaking, despite looking like "just a default value tweak." A default-value change is functionally invisible in the component's API surface but visually breaking for any consumer relying on the old default — this is exactly the "visual-only breaking change" category that's easy to under-classify.

Checkout app: AFFECTED, significant. ~80% of Button usages don't override `size`, meaning most buttons across this app would silently shrink — this is a real visual regression across a large surface area, not a minor styling nuance, and likely needs explicit review/approval from that team before shipping, not just a changelog note.

Admin Dashboard app: NOT AFFECTED. Explicitly sets `size` on every usage per code review — the default change has zero visible effect here. Worth a brief FYI so they're not alarmed by the changelog entry, but no action needed on their end.

Recommended version bump: major, not minor or patch — even though no prop was removed or renamed, the visible behavior change for a majority-usage consumer (Checkout) meets the bar for a breaking change under semver's actual intent (a change that could reasonably break someone relying on current behavior), not just its literal API-shape definition.
```

## Tips & Variations
- For a component library with visual regression testing already in place (e.g., Chromatic, Percept), ask it to note explicitly that the regression-test suite is the fastest way to get a definitive, per-consumer answer to "does this actually look different" rather than relying solely on manual reasoning about default values.
- If the library publishes usage analytics (which apps actually render which components, from real telemetry), prioritize that over code-search-based discovery — it captures dynamic usage patterns a static grep would miss.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

---
id: cross-platform-vs-native-advisor
title: Cross-Platform vs. Native Advisor
category: coding
tags: [mobile, architecture, decision-making]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Recommends cross-platform (React Native, Flutter) versus native (Swift/Kotlin) development given a project's actual constraints — team skills, performance needs, platform-specific feature requirements — rather than a generic pros/cons list. For a real build-or-choose decision at project start.

## When to use it
- Starting a new mobile app and deciding on the framework approach before any code is written.
- An existing native app is considering a cross-platform rewrite (or vice versa) and needs a grounded case, not framework hype.
- Justifying a mobile stack choice to stakeholders with reasoning tied to the actual project, not a link to a comparison blog post.

## The Prompt

```
You recommend cross-platform vs. native mobile development based on the specific constraints given — not a generic framework comparison.

App description (what it does, key features): {{APP_DESCRIPTION}}
Team constraints (existing skills, team size, timeline): {{TEAM_CONSTRAINTS}}
Platform-specific requirements (optional — e.g. "needs deep integration with HealthKit/Health Connect", "heavy custom animations", "AR features"): {{PLATFORM_REQUIREMENTS}}

Instructions:
1. Identify any hard requirement that forces (or strongly favors) native: deep OS-specific API integration with no mature cross-platform bridge, performance-critical work (complex real-time graphics, heavy background processing), or a platform-exclusive feature. If none exist, say so explicitly rather than inventing a reason to favor native.
2. Weigh team constraints heavily: a team with strong web/JS/Dart skills and no native mobile experience has a real cost switching to native (hiring, ramp-up time) that a generic comparison ignores; a team with existing strong iOS/Android expertise loses less by going native and may gain less from cross-platform's main promise (shared codebase) if they'd need to learn a new framework anyway.
3. If recommending cross-platform, name the specific framework (React Native vs. Flutter) based on the constraints — team's existing language familiarity (JS/TS favors React Native, nothing in particular favors Flutter unless the team knows Dart or wants a more consistent rendering engine across platforms) matters more than which framework is more popular in the abstract.
4. Be honest about cross-platform's real costs even when recommending it: occasional need to drop into native modules for platform-specific features, potential lag in adopting brand-new OS features, and app size/startup time differences — don't oversell it as strictly equivalent to native.
5. Be honest about native's real costs even when recommending it: two codebases to maintain, two sets of platform expertise needed, slower feature velocity for straightforward CRUD-style screens that don't need platform-specific polish.
6. Give a specific recommendation with the single strongest reason it follows from the stated constraints, not a hedge that lists every consideration without concluding.

Output format: Markdown with sections: Requirements Analysis, Team Fit, Recommendation (with primary reasoning), Costs to Accept.
```

## Variables
- `{{APP_DESCRIPTION}}` — what the app does and its key features. Required.
- `{{TEAM_CONSTRAINTS}}` — the team's existing skills, size, and timeline. Required — this is usually the deciding factor.
- `{{PLATFORM_REQUIREMENTS}}` — any platform-specific technical needs. Optional but can be a hard constraint if present.

## Example
**Input:** `{{APP_DESCRIPTION}}` = "a social app with feed, messaging, and standard CRUD screens, no heavy graphics", `{{TEAM_CONSTRAINTS}}` = "3 web developers with strong React/TypeScript experience, no prior mobile experience, 4-month timeline", `{{PLATFORM_REQUIREMENTS}}` = "none specific to either platform".

**Output (excerpt):**
```
## Requirements Analysis
Nothing in the app description forces native — feed, messaging, and CRUD screens are well-supported by both major cross-platform frameworks with no exotic OS integration needed.

## Team Fit
The team's strong React/TypeScript background is a significant point in favor of React Native specifically over Flutter — they can be productive almost immediately using existing JS/React knowledge, versus a from-scratch ramp-up on Dart and Flutter's widget model for both frameworks equally if going cross-platform, or a much larger ramp-up cost if going fully native (learning Swift/Kotlin from zero for a 3-person, 4-month project is a real risk to the timeline).

## Recommendation
React Native. The primary reason: this team's existing skillset directly transfers, which matters more here than any framework-level technical tradeoff given the app's straightforward feature set and tight 4-month timeline.

## Costs to Accept
Expect to write a small number of native modules if any platform-specific polish is wanted later (e.g., custom push notification handling); budget minor extra QA time for platform-specific edge cases React Native doesn't perfectly abstract away.
```

## Tips & Variations
- If evaluating a rewrite of an existing native app, add the existing app's pain points (development velocity, hiring difficulty) as an explicit constraint — the calculus differs meaningfully from a greenfield decision.
- For a team already split between iOS and Android native devs with no interest in learning a new framework, explicitly ask it to weigh "stay native but share more logic via a common backend/API layer" as a middle-ground option.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

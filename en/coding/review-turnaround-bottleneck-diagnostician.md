---
id: review-turnaround-bottleneck-diagnostician
title: Code Review Turnaround Bottleneck Diagnostician
category: coding
tags: [code-review, team-process, engineering-management]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Diagnoses why a team's PR review cycle is slow from a description of the actual review process — a team-level process diagnosis for an engineering manager, distinct from `pr-review-assistant` (reviews the content of one PR) and `constructive-review-comment-rewriter` (improves comment tone). This doesn't look at any PR's content — it looks at why PRs sit around.

## When to use it
- PRs are sitting open for days and it's unclear why.
- Inheriting a team with a review process that feels slow, without knowing which part is actually the bottleneck.
- Preparing for a retro specifically about review turnaround time.

## The Prompt

```
You are diagnosing a team-level bottleneck in code review turnaround time — not reviewing any specific PR's content, and not proposing generic "review faster" advice.

Process description (how reviewers get assigned, team size, typical PR size, any available metrics like median time-to-first-review): {{PROCESS_DESCRIPTION}}

Observed symptoms (what's actually happening — e.g., PRs sit completely unreviewed for days, or get an initial review quickly but go through many slow rounds of back-and-forth): {{SYMPTOMS}}

1. Hypothesize the likely bottleneck category, ranked by how well each fits the stated symptoms: assignment/ownership ambiguity (no single clearly responsible reviewer, so everyone assumes someone else will pick it up), reviewer overload (too few people doing review relative to PR volume, a capacity problem not a process one), PR size (large diffs naturally take longer and get deprioritized in favor of quicker wins), time-zone/async gaps (reviewer and author rarely have overlapping working hours), or lack of review norms/SLA (no shared expectation of how quickly a review should happen).
2. For each hypothesis, propose one concrete, testable process change — not a vague "communicate better," but something specific enough to actually try (e.g., a rotation-based auto-assignment, a soft PR-size limit with a "split this up" norm, an explicit 1-business-day first-response SLA).
3. Specify what metric would confirm or deny each hypothesis if the change were tried — so this becomes a testable diagnosis, not just a guess to accept on faith.

If the process described sounds reasonable on its own terms but PR volume is simply too high for the team's size, say that plainly — it's a staffing/capacity problem, not a process bug, and no process tweak will fix a genuine capacity shortfall.
```

## Variables
- `{{PROCESS_DESCRIPTION}}` — how the review process actually works today, team size, and any available metrics. Required.
- `{{SYMPTOMS}}` — the specific, observed pattern of slowness. Required — different symptom patterns point to different bottlenecks.

## Example
**Input:** `{{PROCESS_DESCRIPTION}}` = "8-person team, no formal reviewer assignment — author picks whoever they think is free, no SLA", `{{SYMPTOMS}}` = "PRs often sit completely unreviewed for 2-3 days before anyone comments".

**Output (excerpt):**
```
Top hypothesis: assignment/ownership ambiguity. With no formal assignment and authors picking reviewers ad hoc, there's a real risk of diffusion of responsibility — if the author guesses wrong about who's free, the PR can sit invisible to everyone who'd actually pick it up, since no single person is notified as "responsible."

Suggested change to test: rotation-based auto-assignment (e.g., a round-robin bot that assigns exactly one primary reviewer per PR) rather than author-guesses-who's-free.

Validation metric: track median time-to-first-comment before and after — if this hypothesis is right, it should drop noticeably within 1-2 weeks of the rotation starting, since PRs would no longer depend on the author correctly guessing availability.

(Secondary hypothesis, lower fit: reviewer overload — worth checking PR volume vs. team size, but the "sits with zero comments" pattern specifically points more toward nobody being clearly on the hook than toward everyone being too busy to get to it.)
```

## Tips & Variations
- If metrics are genuinely unavailable (no tracked time-to-first-review), ask it to recommend the single cheapest metric to start tracking before making any process change — diagnosing without a baseline risks not knowing if a fix actually worked.
- For a distributed/remote team, weight the time-zone-gap hypothesis more heavily and ask it to specifically check whether `{{PROCESS_DESCRIPTION}}` mentions any overlap-hours consideration at all.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

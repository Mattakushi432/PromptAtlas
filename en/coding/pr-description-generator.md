---
id: pr-description-generator
title: PR Description Generator
category: coding
tags: [git, pull-request, documentation]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Generates a clear, complete PR description from a diff and a linked ticket — summary, changes, test plan — the document a reviewer reads before diving into code. Distinct from `conventional-commit-writer` (single commit message) and `pr-review-assistant` (reviews a PR, doesn't write its description).

## When to use it
- Opening a PR and wanting a description that actually helps the reviewer, not a one-line "fixes bug" that gives no context.
- A PR has grown to touch several files and needs a description that ties the changes back to the stated goal so a reviewer isn't left guessing why each change was made.
- Standardizing PR description quality across a team without everyone having to remember the same template by heart.

## The Prompt

```
You write a pull request description from a diff and (if available) a linked ticket — a document meant to help a reviewer understand the change quickly, not a changelog entry.

Diff: {{DIFF}}
Linked ticket/issue (optional — the requirement or bug report this PR addresses): {{TICKET}}
PR template to follow, if the repo has one (optional): {{PR_TEMPLATE}}

Instructions:
1. Write a summary (2-4 sentences) stating what this PR does and why — the "why" should tie back to {{TICKET}} if provided, not just restate what files changed.
2. List the specific changes made, grouped logically (not just a flat file list) — e.g., "Backend: added validation to X endpoint" / "Frontend: updated form to show new error state" — so a reviewer can navigate the diff with a map instead of reading files in whatever order they appear.
3. Call out anything a reviewer should pay particular attention to: a risky change, a non-obvious design decision, a place where you're specifically unsure and want feedback — don't bury these in the diff for the reviewer to discover unprompted.
4. Write a test plan: what was actually tested (specific scenarios, not "tested manually"), and what a reviewer could check themselves to verify the change works — concrete steps or commands, not a vague assurance.
5. If the diff includes anything outside the stated scope of {{TICKET}} (opportunistic cleanup, an unrelated fix bundled in), call it out explicitly as a separate note, so a reviewer doesn't have to figure out on their own whether it was intentional.
6. If {{PR_TEMPLATE}} is provided, fill it in exactly rather than using a different structure, even if this prompt's default sections would organize the information differently.
7. Keep it honest: if something wasn't tested, say so rather than implying coverage that doesn't exist — an inflated test plan actively harms review quality by giving false confidence.

Output format: Markdown following {{PR_TEMPLATE}} if given, otherwise: Summary, Changes, Notes for Reviewers, Test Plan.
```

## Variables
- `{{DIFF}}` — the PR's diff. Required.
- `{{TICKET}}` — the linked requirement/bug report text. Optional but sharply improves the "why" section.
- `{{PR_TEMPLATE}}` — the repo's PR template, if it has one. Optional.

## Example
**Input:** `{{DIFF}}` = adds rate limiting middleware to the `/api/login` endpoint, `{{TICKET}}` = "Bug report: attackers can brute-force login by hitting the endpoint thousands of times with no throttling".

**Output (excerpt):**
```markdown
## Summary
Adds rate limiting to `/api/login` to prevent brute-force credential stuffing attacks, addressing the reported bug where unlimited login attempts were allowed with no throttling.

## Changes
- Backend: added `rateLimitMiddleware` to the login route, limiting to 5 attempts per IP per 15 minutes.
- Backend: added a `429 Too Many Requests` response with a `Retry-After` header when the limit is exceeded.

## Notes for Reviewers
The rate limit window (5/15min) is a first pass based on typical brute-force patterns — flag if you think this should be configurable via env var rather than hardcoded, since we may want to tune it post-launch.

## Test Plan
- Manually verified: 6 rapid login attempts from the same IP correctly returns 429 on the 6th.
- Manually verified: attempts from a different IP are not affected by another IP's rate limit.
- Not yet tested: behavior under a distributed/rotating-IP attack — rate limiting alone won't fully address that; noting as a known limitation, not blocking this PR.
```

## Tips & Variations
- For a squash-merge repo where the PR description becomes part of the permanent commit history, ask for a slightly more concise version optimized for that audience (future git-log readers) rather than only the live-review audience.
- If the diff is very large, ask it to also flag which specific files are most worth reviewing first (highest-risk logic) versus which are mechanical (renames, generated file updates).

## Changelog
- 1.0.0 (2026-08-29): Initial version.

---
id: scheduled-job-timezone-correctness-auditor
title: Scheduled Job Timezone Correctness Auditor
category: coding
tags: [batch-jobs, devops, code-review]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Audits cron/scheduled-job configurations for daylight-saving-time and timezone-handling bugs — checks specifically for the failure modes that only appear at DST transitions or across timezone boundaries, not general job-scheduling review.

## When to use it
- You're reviewing a new scheduled job before it ships and want to check it won't misbehave twice a year at DST transitions.
- You've had a job run twice, not run at all, or run at an unexpected time and suspect a timezone/DST bug rather than a logic bug.
- You're auditing an existing set of scheduled jobs (especially ones inherited from another team or written a while ago) for latent DST bugs that haven't been triggered yet.

## The Prompt

```
You audit scheduled job configurations for daylight-saving-time and timezone-handling bugs. You check specifically for the failure modes that manifest at DST transitions or across timezone/server-location boundaries — not general code quality or scheduling logic unrelated to time handling.

Job schedule configuration(s): {{JOB_CONFIGS}}
Timezone(s) the schedule is intended to represent (e.g. "9am Eastern Time, always"): {{INTENDED_TIMEZONE_BEHAVIOR}}
Server/scheduler timezone configuration: {{SERVER_TIMEZONE}}

Instructions:
1. Check whether each schedule uses a fixed UTC offset or a named timezone (e.g. "America/New_York") — a fixed-offset schedule (e.g. "always run at UTC-5") will silently drift by an hour relative to local wall-clock time across a DST transition, which is almost never the actual intent when {{INTENDED_TIMEZONE_BEHAVIOR}} describes a local time like "9am Eastern."
2. For schedules using a named timezone, check for the "nonexistent time" and "ambiguous time" DST edge cases: a schedule set to run at a specific local time that falls in the spring-forward gap (e.g. 2:30am on the day clocks skip from 2am to 3am) or the fall-back ambiguous hour (e.g. 1:30am occurring twice) — flag any schedule whose configured time falls in these windows, since behavior here is scheduler-implementation-dependent and easy to get wrong.
3. Check for mismatches between {{SERVER_TIMEZONE}} and the schedule's assumed timezone — a schedule written assuming server-local time on a server actually running in UTC (or vice versa) is a common source of jobs running at the wrong wall-clock time entirely, independent of any DST issue.
4. For jobs with dependencies on other jobs (e.g. "run report generation after data sync completes"), check whether the dependency is time-based (a fixed offset between two scheduled times) or event-based (triggered by the prior job's actual completion) — a fixed-offset dependency is vulnerable to both DST drift and to either job's runtime varying, causing the dependent job to run before its prerequisite has actually finished.
5. Flag any schedule where {{INTENDED_TIMEZONE_BEHAVIOR}} is ambiguous or not clearly stated — a schedule can be technically correct for one interpretation of intent and wrong for another, so unclear intent is itself worth surfacing before judging correctness.
6. Note that not every DST-adjacent-seeming issue is actually a bug: if {{INTENDED_TIMEZONE_BEHAVIOR}} genuinely wants "every 24 hours regardless of local time" (e.g. a job whose timing doesn't matter to end users), a fixed-UTC schedule is correct, not a bug — don't flag intended UTC-fixed behavior as an error.

Output format: Markdown, one entry per finding: the specific job/schedule, the issue, why it manifests (DST transition, timezone mismatch, dependency timing), and the fix. End with a summary noting any jobs that are correct as-is given their actual intent.
```

## Variables
- `{{JOB_CONFIGS}}` — the cron expressions/scheduler configuration for each job under review. Required.
- `{{INTENDED_TIMEZONE_BEHAVIOR}}` — what the schedule is actually supposed to represent in human terms. Required — correctness can't be judged without knowing the actual intent.
- `{{SERVER_TIMEZONE}}` — what timezone the server/scheduler itself is configured to, if known. Required — a common and easy-to-miss source of bugs.

## Example
**Input:** `{{JOB_CONFIGS}}` = "Cron: `0 9 * * *` running on a server with system timezone set to UTC" `{{INTENDED_TIMEZONE_BEHAVIOR}}` = "Should run at 9am Eastern Time (America/New_York) every day, since this triggers a report for US-based business users" `{{SERVER_TIMEZONE}}` = "UTC"

**Output (excerpt):**
```
### Finding: fixed-offset schedule will drift relative to intended local time across DST
The cron expression `0 9 * * *` on a UTC-configured server runs at a fixed 9am UTC year-round. Eastern Time is UTC-5 in winter (EST) and UTC-4 in summer (EDT) — so this job actually runs at 4am Eastern in winter and 5am Eastern in summer, never at the intended 9am Eastern.
Fix: use a scheduler/library that supports named-timezone scheduling (e.g. `America/New_York` directly) rather than a fixed cron offset computed for one particular season, so the job tracks local wall-clock time correctly across DST transitions.

Summary: 1 job reviewed, 1 finding (timezone mismatch causing a large, non-DST-related offset error, compounded by DST drift on top of that). No jobs found to be correctly configured as-is.
```

## Tips & Variations
- The most common real-world instance of this bug class is exactly the example shown: a schedule computed once in UTC for a specific intended local time, which is correct for one season and wrong for the other — always check whether a "fixed offset" schedule was actually meant to represent local time before assuming it's correct.
- For jobs where the exact minute of execution genuinely doesn't matter (e.g. a nightly cleanup job with no user-facing timing requirement), it's worth explicitly documenting that in {{INTENDED_TIMEZONE_BEHAVIOR}} so future reviews don't flag correct UTC-fixed behavior as a bug.
- This prompt reviews configuration, not runtime behavior — for a job you suspect is already misbehaving, cross-check the audit's findings against actual job run logs around the last DST transition to confirm the predicted failure mode actually occurred.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

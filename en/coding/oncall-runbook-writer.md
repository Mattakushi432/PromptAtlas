---
id: oncall-runbook-writer
title: On-Call Runbook Writer
category: coding
tags: [documentation, incident-response, operations]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Writes an on-call runbook for a specific service — alerts, common failure modes, diagnostic steps, escalation — a reference for whoever is paged at 3am. Distinct from `deployment-rollback-planner` (one specific deployment's rollback) and `incident-root-cause-analyzer` (active incident investigation): this is standing operational documentation.

## When to use it
- A service is going on-call rotation for the first time and needs a runbook before the first page happens.
- An existing runbook is stale (references removed alerts, outdated dashboards) and needs a refresh grounded in current reality.
- After an incident revealed a gap in the runbook (a failure mode with no documented response), updating it to cover the new case.

## The Prompt

```
You write an on-call runbook for a specific service — written for someone who's been paged and needs to act fast, not a general service overview.

Service description (what it does, key dependencies, architecture at a high level): {{SERVICE_DESCRIPTION}}
Known alerts/failure modes (optional — what typically pages, and what's usually wrong when it does): {{KNOWN_ALERTS}}
Escalation path (optional — who to page next, when to escalate): {{ESCALATION_PATH}}

Instructions:
1. Structure around alerts/symptoms, not around the service's architecture — someone on-call starts from "I got paged for X" and needs to find the relevant section immediately, not read the whole doc to locate it.
2. For each known alert/symptom, give: what it means (what's actually failing when this fires), the most likely causes ranked by probability, the specific diagnostic steps to run (a dashboard to check, a log query, a specific command) in the order that narrows down the cause fastest, and the corresponding mitigation for each likely cause.
3. Distinguish "stop the bleeding" mitigation (a fast action to reduce user impact, like a rollback or scaling up, even if it doesn't fix the root cause) from "actual fix" (addressing the root cause) — an on-call runbook's primary job is enabling the former quickly; the latter can often wait for business hours.
4. Include the specific escalation criteria: what conditions mean "handle it yourself" versus "page someone else now" (a clear threshold, not "use your judgment" alone) — vague escalation guidance is a common cause of a lone on-call engineer struggling too long before getting help.
5. Link out to (or name) the specific dashboards, logs, and tools referenced, using their actual names/URLs if given, not generic placeholders like "check your monitoring."
6. Note any known false-positive pattern for a given alert (an alert that fires under a specific benign condition) so on-call doesn't waste time chasing a non-issue.
7. If {{KNOWN_ALERTS}} isn't comprehensive, still structure the runbook to be extended incrementally — note explicitly which sections are placeholders for alerts not yet documented, rather than silently omitting them.

Output format: Markdown, one section per alert/failure mode: Symptom, Likely Causes (ranked), Diagnostic Steps, Mitigation, Escalation Criteria. Plus a top-level Escalation Path section.
```

## Variables
- `{{SERVICE_DESCRIPTION}}` — what the service does and its key dependencies. Required.
- `{{KNOWN_ALERTS}}` — the actual alerts configured and what they usually mean. Required for a runbook with real content — without this, output degrades to generic on-call advice.
- `{{ESCALATION_PATH}}` — who to escalate to and when. Optional but important for a complete runbook.

## Example
**Input:** `{{SERVICE_DESCRIPTION}}` = "payment processing service, depends on a third-party payment gateway and Postgres", `{{KNOWN_ALERTS}}` = "PagerDuty alert 'PaymentErrorRateHigh' fires when error rate exceeds 5% over 5 minutes; usually caused by either the payment gateway being down or a DB connection issue".

**Output (excerpt):**
```markdown
## Alert: PaymentErrorRateHigh

**Symptom:** Error rate on payment processing exceeds 5% over a 5-minute window.

**Likely Causes (ranked):**
1. Third-party payment gateway outage or degraded performance.
2. Database connection pool exhaustion.
3. A recent deploy introduced a bug (check deploy timeline first if this started right after a release).

**Diagnostic Steps:**
1. Check the payment gateway's public status page first (fastest to rule in/out) — if they're reporting an incident, this is almost certainly the cause.
2. If the gateway is healthy, check the DB connection pool dashboard for saturation.
3. Check the deploy timeline against the alert's start time — if they align within a few minutes, suspect the deploy first regardless of the above.

**Mitigation:**
- If gateway outage: no action fixes this directly; monitor their status page and communicate expected impact to stakeholders. Consider enabling the payment retry queue if not already active.
- If DB pool exhaustion: see [runbook section on DB connection pool issues].
- If recent deploy: roll back per the standard deployment rollback procedure.

**Escalation Criteria:** If error rate exceeds 20% or the incident lasts more than 15 minutes without a clear cause identified, page the payments team lead immediately — don't wait for the standard 30-minute escalation window given the revenue impact.
```

## Tips & Variations
- For a service with a formal SLO, tie escalation criteria directly to SLO burn rate rather than a raw error-rate threshold, if that data is available — it's a more principled trigger than an arbitrary percentage.
- After any real incident, feed the postmortem back into this prompt to generate the runbook update for the newly-discovered failure mode, keeping the runbook a living document rather than a one-time artifact.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

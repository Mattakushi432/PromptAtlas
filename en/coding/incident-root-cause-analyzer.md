---
id: incident-root-cause-analyzer
title: Incident Root Cause Analyzer
category: coding
tags: [incident-response, debugging, root-cause-analysis]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Ranks root-cause hypotheses for a production incident from symptoms, logs, and a timeline — a broader, systems-level analysis than a single flaky test or stack trace, meant for someone running an incident or writing its postmortem.

## When to use it
- Actively responding to an incident and need a structured way to reason about multiple signals under time pressure.
- Writing a postmortem and want a systematic pass over the evidence before settling on "the" root cause.
- Handing off an in-progress incident to another engineer and needing to summarize current leads.

## The Prompt

```
You are helping analyze a production incident's root cause from the symptoms and evidence below. Multiple contributing factors are common in real incidents — resist collapsing to a single cause if the evidence supports more than one.

Incident summary: {{INCIDENT_SUMMARY}}
Timeline of events (deploys, alerts, config changes, traffic changes — whatever is known): {{TIMELINE}}
Symptoms observed: {{SYMPTOMS}}
Logs/metrics/error excerpts: {{LOGS_OR_METRICS}}
System architecture context (optional): {{SYSTEM_CONTEXT}}

Instructions:
1. Build a brief timeline-ordered narrative of what's known to have happened, distinguishing confirmed facts from things still assumed.
2. Generate root-cause hypotheses, and for each: state the causal chain it implies (what happened → what that caused → what that caused → observed symptom), what evidence supports it, and what evidence would contradict it.
3. Rank hypotheses by how well they explain ALL the observed symptoms, not just one — a hypothesis that explains 3 of 4 symptoms and requires a coincidence for the 4th ranks below one that explains all 4 cleanly.
4. Flag any correlation being treated as causation (e.g., "a deploy happened around the same time" is a lead, not proof) and say what would be needed to confirm it (e.g., checking if the deploy's diff plausibly causes this symptom).
5. Identify what data is missing that would most efficiently disambiguate between the top hypotheses — the single most valuable next piece of evidence to gather.
6. Do not declare a definitive root cause if the evidence doesn't support one confidently — say which hypothesis is leading and why, and what confirming it requires.

Output format: Markdown with sections: Timeline, Hypotheses (ranked, each with supporting/contradicting evidence), Most Valuable Next Evidence to Gather.
```

## Variables
- `{{INCIDENT_SUMMARY}}` — a short description of the incident (what broke, user impact). Required.
- `{{SYMPTOMS}}` — the observable effects (errors, latency, wrong data, etc.). Required.
- `{{TIMELINE}}` — known events with timestamps: deploys, config changes, alerts, traffic spikes. Required — this is often the strongest signal.
- `{{LOGS_OR_METRICS}}` — actual log lines, error rates, or dashboard readings. Optional but high-value.
- `{{SYSTEM_CONTEXT}}` — relevant architecture (services involved, dependencies). Optional.

## Example
**Input:** `{{INCIDENT_SUMMARY}}` = "checkout error rate spiked to 40%", `{{TIMELINE}}` = "14:02 deploy of payment-service v2.3.1, 14:05 error rate begins climbing", `{{SYMPTOMS}}` = "500 errors from payment-service, no change in traffic volume".

**Output (excerpt):**
```
## Hypotheses (ranked)
1. **Payment-service v2.3.1 deploy introduced a regression** — HIGH confidence.
   Causal chain: deploy at 14:02 → error onset at 14:05 (consistent with rollout speed) → 500s specifically from payment-service, not upstream services → matches "no traffic change" (rules out a load-driven cause).
   Supporting evidence: timing correlation is tight (3 min) and errors are isolated to the deployed service.
   Contradicting/untested: haven't confirmed the deploy's diff actually touches the failing code path.

## Most Valuable Next Evidence to Gather
Pull the diff for v2.3.1 and check whether it touches the code path producing the 500s — this would confirm or eliminate hypothesis #1 almost immediately.
```

## Tips & Variations
- For a live incident, ask it to keep updating the ranked list as you paste in new evidence, rather than restarting the analysis from scratch each time.
- For the postmortem's final write-up, ask it to separate "root cause" from "contributing factors" from "why it wasn't caught sooner" as distinct sections once the investigation has converged.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

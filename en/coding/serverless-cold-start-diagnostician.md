---
id: serverless-cold-start-diagnostician
title: Serverless Cold-Start Diagnostician
category: coding
tags: [devops, serverless, performance]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Diagnoses causes of excessive cold-start latency in a specific serverless function — for an engineer whose function's cold starts are hurting a latency-sensitive path. Distinct from other performance prompts in this library that target different runtime environments (browser, mobile) and problem types.

## When to use it
- A serverless function (Lambda, Cloud Functions, Azure Functions, etc.) has noticeably slow first-invocation latency.
- Deciding whether to pay for provisioned/reserved concurrency versus actually fixing the underlying cold-start cause.
- A function's cold start regressed after adding a new dependency and you want to know why.

## The Prompt

```
You are diagnosing the cause of excessive cold-start latency in a specific serverless function — not general performance tuning, specifically the first-invocation startup cost.

Function configuration (runtime/language, memory setting, approximate deployment package size if known, VPC attachment status): {{FUNCTION_CONFIG}}

Initialization code (code that runs at module/top level, outside the handler function, on cold start): {{INIT_CODE}}

Observed cold-start time: {{OBSERVED_COLD_START_TIME}}

Check:
1. Deployment package size and unnecessary dependencies — a bloated bundle (unused libraries, dev dependencies accidentally included) increases the time the platform spends loading the package before your code even runs.
2. What runs at module/top-level scope versus inside the handler — heavy initialization outside the handler (e.g., opening a database connection, loading a large config file) runs on every cold start; check whether it could be lazily initialized on first use, or whether connections could be reused across warm invocations instead of recreated.
3. VPC attachment — historically a significant cold-start cost on some platforms due to ENI provisioning, though this has improved significantly on some providers/versions; note explicitly if you're uncertain whether this still applies to the stated platform rather than asserting an outdated fact as current.
4. Inherent runtime/language cold-start characteristics — some language runtimes have meaningfully higher baseline cold-start overhead than others, independent of your code.

Rank the likely contributors by estimated impact given what's actually shown in `{{INIT_CODE}}` and `{{FUNCTION_CONFIG}}`, with a concrete fix for each ranked item.

If `{{INIT_CODE}}` looks minimal and the package is small, say so plainly — the cold start may be dominated by platform/runtime overhead outside the code's control, in which case provisioned concurrency (paying to keep instances warm) is the realistic fix rather than further code changes, and recommending more code archaeology would be a waste of the engineer's time.
```

## Variables
- `{{FUNCTION_CONFIG}}` — runtime, memory, package size, and VPC status. Required.
- `{{INIT_CODE}}` — the code that runs outside the handler on cold start. Required.
- `{{OBSERVED_COLD_START_TIME}}` — the actual measured cold-start latency. Required — without a number, "excessive" has no anchor.

## Example
**Input:** `{{FUNCTION_CONFIG}}` = "Node.js 20, 256MB memory, VPC-attached, package size ~45MB", `{{INIT_CODE}}` = "imports the full AWS SDK v2 (not v3 modular), opens a new database connection at module scope on every cold start", `{{OBSERVED_COLD_START_TIME}}` = "~2.5 seconds".

**Output (excerpt):**
```
Top contributor: importing the full AWS SDK v2 rather than the modular v3 SDK (or only the specific v3 clients needed) — this is a common, high-impact cause of package bloat, and v2's full bundle is significantly larger than importing just `@aws-sdk/client-s3` or whichever specific client is actually used. Fix: migrate to AWS SDK v3 with only the needed service clients imported.

Second contributor: opening a new database connection at module scope on every cold start. This is correctly placed outside the handler for reuse across warm invocations (good), but on every cold start it still adds full connection-establishment latency to the critical path. If the database supports it, consider a connection-pooling proxy (e.g., RDS Proxy) that keeps warm connections available, so a cold Lambda instance connects to a already-warm proxy rather than establishing a fresh TCP+TLS+auth handshake every time.

VPC attachment: given this platform (AWS Lambda) and assuming a reasonably recent Lambda networking model (Hyperplane ENIs), VPC-attachment cold-start cost has been substantially reduced in recent years — don't assume this is still the dominant factor it historically was without checking the specific runtime/networking generation in use.

At 2.5s with a 45MB package and the SDK issue identified, code-level fixes are likely to meaningfully help here — this isn't a case where provisioned concurrency is the only lever.
```

## Tips & Variations
- If cold starts are already minimized at the code level and the remaining latency is still unacceptable for the use case, ask it to estimate the cost tradeoff of provisioned concurrency explicitly rather than just recommending it — "pay for N always-warm instances" has a real dollar cost worth stating.
- For a platform other than AWS Lambda, tell it explicitly — cold-start characteristics (especially around VPC/networking and language runtime overhead) vary meaningfully between providers, and it should avoid carrying over AWS-specific assumptions.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

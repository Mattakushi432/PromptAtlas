---
id: rate-limiting-strategy-designer
title: Rate Limiting Strategy Designer
category: coding
tags: [backend, rate-limiting, api, abuse-prevention]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Designs a rate-limiting strategy for an API endpoint — algorithm choice, concrete limits, and response behavior — given its traffic pattern and abuse concerns. For designing this before an endpoint ships, not auditing a rate limiter already in production.

## When to use it
- Adding a new public or partner-facing API endpoint that doesn't have rate limiting yet.
- An endpoint is expensive to serve (heavy computation, third-party API cost) and needs protection before launch.
- Deciding what axis to key limits on (per-user, per-IP, per-API-key) for a specific access pattern.

## The Prompt

```
You are designing a rate-limiting strategy for an API endpoint before it ships — not reviewing or debugging one already in place.

Endpoint description (what it does, rough cost to serve one request): {{ENDPOINT_DESCRIPTION}}

Normal traffic pattern (typical request shape from legitimate users): {{TRAFFIC_PATTERN}}

Abuse concern (what you're actually worried about — scraping, credential stuffing, cost abuse, denial of service): {{ABUSE_CONCERN}}

Provide:
1. A recommended algorithm (fixed window, sliding window, token bucket, or leaky bucket) with reasoning tied specifically to the traffic pattern given — not a default recommendation.
2. Concrete limit numbers (requests per time window) and the axis to key them on (per-IP, per-authenticated-user, per-API-key, global) — with reasoning for why that axis fits the abuse concern.
3. Response behavior: what happens when a client is over the limit — hard block with 429 and a `Retry-After` header, or a softer degrade/throttle — and why.
4. A residual-risk note: what this strategy does NOT protect against (e.g., distributed abuse from many IPs/accounts), so it isn't oversold as a complete solution.

If the traffic pattern described is highly bursty for legitimate reasons (e.g., a webhook receiver that gets a batch delivery, a bulk-upload feature), explain why naive fixed-window limits would break legitimate usage and adjust the algorithm/limits accordingly rather than defaulting to a flat number.
```

## Variables
- `{{ENDPOINT_DESCRIPTION}}` — what the endpoint does and its approximate cost per request. Required.
- `{{TRAFFIC_PATTERN}}` — what normal, legitimate usage looks like (steady, bursty, scheduled). Required — this drives the algorithm choice.
- `{{ABUSE_CONCERN}}` — the specific abuse scenario being defended against. Required — the right key axis depends entirely on this.

## Example
**Input:** `{{ENDPOINT_DESCRIPTION}}` = "search endpoint that triggers a full-text query against a large index", `{{TRAFFIC_PATTERN}}` = "steady low-volume for most users, occasional legitimate rapid typing-triggered autocomplete calls", `{{ABUSE_CONCERN}}` = "scraping the full result set via automated pagination".

**Output (excerpt):**
```
Algorithm: sliding window log or token bucket, not fixed window — autocomplete traffic is naturally bursty within short windows, and a fixed window would either let a burst through right at the window boundary (double the intended rate) or falsely throttle legitimate rapid typing.

Limits: 60 requests/minute per authenticated user (generous enough for autocomplete bursts), plus a stricter 500 requests/hour per user as a second ceiling to catch sustained scraping that stays under the per-minute limit. Key on user ID, not IP — scraping via a single account is the realistic threat here, and IP-based limiting would hurt users on shared corporate NAT.

Response: 429 with Retry-After for the per-minute limit (recoverable, client should back off); for the per-hour ceiling, degrade to a smaller result page size instead of a hard block, since it's more likely to be a real power user than an attacker.

Residual risk: this doesn't stop scraping distributed across many free accounts — that needs account-creation-rate limiting or anomaly detection, which is out of scope for endpoint-level rate limiting alone.
```

## Tips & Variations
- For a genuinely public, unauthenticated endpoint, ask it to design both an IP-based and a cost-based (e.g., CAPTCHA-triggered) fallback tier, since IP-only limiting is weak against distributed abuse.
- Pair with `caching-strategy-advisor` when the abuse concern is really about compute cost — sometimes a cache absorbs load more effectively than a stricter limit.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

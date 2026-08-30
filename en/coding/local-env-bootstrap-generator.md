---
id: local-env-bootstrap-generator
title: Local Dev Environment Bootstrap Generator
category: coding
tags: [devops, onboarding, developer-experience]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Generates the actual setup scripts and config a new developer runs to get a working local environment — not a narrative document. Distinct from a repo-wide onboarding guide: this produces runnable bootstrap tooling (scripts, `.env.example`, a verification step), not process/culture documentation.

## When to use it
- Onboarding is still "ask someone on Slack how to get this running locally."
- Standardizing local setup across a team where everyone's environment drifted differently.
- Before writing a full onboarding guide, to get the technical bootstrap solved first.

## The Prompt

```
You are a developer experience engineer producing runnable local-environment setup tooling — not a prose guide.

Stack description (languages/runtimes, services, databases, required env vars): {{STACK_DESCRIPTION}}

Target operating systems to support: {{OS_TARGETS}}

Existing setup notes (optional — whatever informal instructions currently exist, even if incomplete): {{EXISTING_SETUP_NOTES}}

Produce:
1. A bootstrap script (or set of scripts, one per OS if needed) that: checks/installs required tool versions, brings up local services matching the stack (prefer Docker Compose where it fits), and fails loudly with a clear message if a prerequisite is missing rather than silently continuing.
2. A `.env.example` file listing every required environment variable with an inline comment explaining what it's for and where to get a real value (even if that's "ask a teammate for the shared dev credentials").
3. A verification step — a single command a new developer can run that actually proves the environment works (e.g., hits a health endpoint, runs a smoke test), not just "the install commands exited 0."
4. An explicit "what this does NOT automate" list — anything that requires human action (requesting access to a secrets vault, joining a Slack channel, getting added to a cloud account) should be called out as a manual step, not faked as automated.

If the stack has OS-specific dependencies (native compiled libraries, platform-specific tooling), branch the script logic per OS explicitly and say so — don't silently produce a script that only works on one platform while claiming to support all of {{OS_TARGETS}}.
```

## Variables
- `{{STACK_DESCRIPTION}}` — languages/runtimes, services, databases, and required environment variables. Required.
- `{{OS_TARGETS}}` — which operating systems the setup must support (e.g., "macOS and Linux only", "macOS, Linux, and Windows via WSL"). Required.
- `{{EXISTING_SETUP_NOTES}}` — any current informal setup instructions to build on instead of starting from zero. Optional.

## Example
**Input:** `{{STACK_DESCRIPTION}}` = "Node.js 20 API, PostgreSQL 15, Redis, requires DATABASE_URL, REDIS_URL, JWT_SECRET", `{{OS_TARGETS}}` = "macOS and Linux".

**Output (excerpt):**
```
#!/usr/bin/env bash
set -euo pipefail

command -v node >/dev/null || { echo "Node.js 20 required — install via nvm"; exit 1; }
NODE_MAJOR=$(node -v | cut -d. -f1 | tr -d v)
[ "$NODE_MAJOR" -eq 20 ] || { echo "Node 20 required, found $(node -v)"; exit 1; }

docker compose up -d postgres redis
...

# .env.example
DATABASE_URL=postgres://dev:dev@localhost:5432/app_dev   # local Postgres from docker-compose; no action needed
JWT_SECRET=                                                # ask a teammate for the shared dev JWT secret — do not generate your own, tokens must be verifiable across the team's local envs

Verification: run `npm run dev:healthcheck` — this hits GET /health and confirms both Postgres and Redis are reachable, not just that the process started.

Does NOT automate: getting added to the team's shared 1Password vault for JWT_SECRET; VPN access if the API needs to reach a staging service.
```

## Tips & Variations
- For a polyglot monorepo, ask it to produce one top-level bootstrap script that delegates to per-service setup scripts, rather than one monolithic script.
- Feed it your team's actual `.env` (with values redacted, keys intact) as `{{EXISTING_SETUP_NOTES}}` so the generated `.env.example` doesn't miss any variable.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

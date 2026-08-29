---
id: secrets-leak-detector
title: Secrets Leak Detector
category: coding
tags: [security, secrets, code-review]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Spots likely hardcoded secrets and credentials in code — API keys, passwords, tokens, connection strings — with a confidence rating per finding, for general application code (any language). Distinct from `terraform-reviewer`'s IaC-specific secrets check: this is for regular source code, tests, configs, and scripts.

## When to use it
- Reviewing a PR or file before commit/merge, especially one touching config, environment setup, or third-party integrations.
- Auditing an existing codebase (especially an old one, or one inherited from another team) for secrets that were committed at some point.
- Preparing a repository for open-sourcing or for wider internal access, needing a sweep for anything that shouldn't be visible.

## The Prompt

```
You scan code for likely hardcoded secrets and credentials — not a general security review, just this one category.

Code/files to scan: {{CODE}}
Context (optional — e.g. "this is test fixture code", "this is a config file for local dev only"): {{CONTEXT}}

Instructions:
1. Flag values matching common secret patterns: API keys (provider-specific prefixes like `sk-`, `AKIA`, `ghp_`, etc. where recognizable), passwords assigned as plain string literals, JWT tokens, private key material (`-----BEGIN PRIVATE KEY-----` or similar), database connection strings with embedded credentials, OAuth client secrets, webhook signing secrets.
2. Flag high-entropy strings assigned to variables with credential-suggestive names (`token`, `secret`, `key`, `password`, `auth`) even if they don't match a known provider pattern — a suspicious-looking random string in a suspicious variable is still worth flagging even without a recognized prefix.
3. Distinguish an ACTUAL hardcoded secret from a reference to one: `process.env.API_KEY` or `os.environ["API_KEY"]` is not a leak (it's reading from environment, which is correct); `const API_KEY = "sk-abc123..."` is a leak. Don't flag the variable name pattern alone — flag the actual embedded value.
4. Rate your confidence per finding: HIGH (matches a known provider's key format, or is unambiguously credential-shaped), MEDIUM (high-entropy string in a suggestively-named variable, plausible but not certain), LOW (could be a secret or could be a non-sensitive random ID/token — flag for human judgment).
5. Distinguish real secrets from placeholder/example values that are clearly not live credentials (`"your-api-key-here"`, `"xxxxxxxx"`, values in a `.env.example` file explicitly meant as a template) — note these separately as "not a leak" rather than flagging them with the same severity.
6. If {{CONTEXT}} indicates this is test/fixture code, still flag HIGH-confidence real-looking secrets (test fixtures sometimes accidentally contain real credentials copy-pasted from a real environment) but note the lower prior likelihood.
7. For each real finding, recommend the specific remediation: move to environment variable / secret manager, and note that the exposed secret should be ROTATED, not just removed from code (since it may already be in git history).

Output format: Markdown, one entry per finding: the value's location, confidence level, and the fix — followed by a separate "Not Flagged (Placeholders)" section for anything that looked secret-shaped but was judged non-sensitive.
```

## Variables
- `{{CODE}}` — the code/files to scan. Required.
- `{{CONTEXT}}` — what kind of file this is (test, config, production code). Optional but helps calibrate confidence.

## Example
**Input:** `{{CODE}}` = a config file with `const STRIPE_SECRET_KEY = "sk_live_51H..."` and, separately, `const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PK`.

**Output (excerpt):**
```
### HIGH confidence — `STRIPE_SECRET_KEY`
Value `sk_live_51H...` matches Stripe's live secret key format exactly, hardcoded as a string literal.
Fix: move to an environment variable / secret manager immediately. Since this key is committed to code (likely in version control history), it must be ROTATED in the Stripe dashboard — removing it from the file alone doesn't invalidate an already-exposed key.

### Not flagged
`STRIPE_PUBLISHABLE_KEY` is read from `process.env`, not hardcoded — this is a reference, not a leak. (Also, Stripe's publishable keys are designed to be exposed client-side and aren't secret by design, unlike the key above.)
```

## Tips & Variations
- Pair with an actual secret-scanning tool's output (gitleaks, trufflehog, GitHub secret scanning) as additional context — this prompt is strongest at explaining findings and separating real leaks from placeholders/false positives that scanners often over-flag.
- For a pre-open-sourcing sweep, explicitly ask it to also flag internal hostnames, employee names/emails, and internal URLs alongside secrets, since that sweep often happens at the same time.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

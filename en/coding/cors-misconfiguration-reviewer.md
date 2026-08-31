---
id: cors-misconfiguration-reviewer
title: CORS Misconfiguration Reviewer
category: coding
tags: [security, backend, api-design]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Reviews a backend's CORS (Cross-Origin Resource Sharing) configuration for the specific misconfigurations that turn a convenience feature into a credential-leaking hole — reflected origins, wildcard-plus-credentials combinations, and overly broad preflight caching — rather than general API security review.

## When to use it
- You're setting up or reviewing CORS headers for an API that serves browser clients and want to confirm the config doesn't accidentally allow any origin to read authenticated responses.
- A security scanner or pentest flagged "CORS misconfiguration" and you need to understand exactly which setting is the problem and why, not just that one exists.
- You're adding a new frontend origin (a new subdomain, a partner's site) to an allowlist and want to verify the change doesn't widen access further than intended.

## The Prompt

```
You review a backend's CORS configuration for the specific failure modes that let an untrusted origin read data it shouldn't be able to.

CORS configuration (headers/middleware code or config): {{CORS_CONFIG}}
Whether authenticated requests (cookies, Authorization headers) rely on this API: {{USES_CREDENTIALS}}
Known legitimate origins that should be allowed: {{ALLOWED_ORIGINS}}

Instructions:
1. Check for a wildcard `Access-Control-Allow-Origin: *` combined with `Access-Control-Allow-Credentials: true` — this combination is invalid per spec and browsers reject it, but check whether the code instead achieves the equivalent unsafe effect by reflecting the request's `Origin` header back unconditionally while allowing credentials, which browsers do accept and which allows any site to read authenticated responses.
2. If an origin allowlist exists, check how it's matched: a substring or unanchored regex check (e.g. matching any origin containing "example.com") can be bypassed by an attacker-controlled origin like `evil-example.com.attacker.net` or `example.com.attacker.net`. Confirm matching is exact or a properly anchored suffix match against {{ALLOWED_ORIGINS}}.
3. Check the `Access-Control-Allow-Methods` and `Access-Control-Allow-Headers` values aren't wider than what {{ALLOWED_ORIGINS}} actually needs — an unnecessarily permissive preflight response doesn't itself leak data, but widens what a compromised or malicious allowed origin could do.
4. Check `Access-Control-Max-Age`: a very long preflight cache duration means a since-revoked origin or changed policy stays effectively in force in browsers that already cached the preflight, until it expires.
5. If {{USES_CREDENTIALS}} is true, confirm the allowlist is not derived from anything attacker-influenceable (e.g. echoing a `Referer`-derived value, or trusting an origin passed as a request parameter) — the source of truth must be a fixed, server-side list.
6. Flag any origin in the config that isn't in {{ALLOWED_ORIGINS}} and ask whether it's intentional (e.g. a leftover staging/localhost entry accidentally shipped to production).

Output format: Markdown. For each finding: the specific line/setting, the exploit scenario in one sentence, severity (critical/high/medium), and the fix. End with a one-line verdict: safe as configured, or not safe — until [specific fix].
```

## Variables
- `{{CORS_CONFIG}}` — the actual CORS headers, middleware configuration, or framework-specific CORS setup code. Required.
- `{{USES_CREDENTIALS}}` — whether the API's browser clients send cookies or auth headers cross-origin (true/false). Required — the severity of every finding here depends on whether credentials are in play.
- `{{ALLOWED_ORIGINS}}` — the list of origins that should legitimately be allowed. Required.

## Example
**Input:** `{{CORS_CONFIG}}` = "Express middleware: `res.header('Access-Control-Allow-Origin', req.headers.origin); res.header('Access-Control-Allow-Credentials', 'true')`" `{{USES_CREDENTIALS}}` = "true — API is called with a session cookie from the browser app" `{{ALLOWED_ORIGINS}}` = "https://app.example.com, https://admin.example.com"

**Output (excerpt):**
```
### Finding: reflected Origin + credentials = any site can read authenticated responses
The middleware reflects whatever `Origin` header the request sends back as the allowed origin, with credentials enabled. Any website a logged-in user visits can make a credentialed fetch to this API from JavaScript and read the response, since the browser will accept this origin as "allowed."
Severity: critical.
Fix: replace the reflection with an exact-match check against a fixed allowlist (https://app.example.com, https://admin.example.com); only echo the request's Origin back when it matches an entry in that list, otherwise omit the CORS headers entirely.

Verdict: not safe — until the origin reflection is replaced with an allowlist match.
```

## Tips & Variations
- This prompt assumes a browser-facing API; if {{USES_CREDENTIALS}} is false and the API only serves public, non-sensitive data to any origin, a permissive wildcard config may be an intentional and reasonable choice — don't flag it as a finding without that context.
- Pair with `auth-flow-reviewer` (coding, already shipped) when the same API also has authentication logic worth reviewing — that prompt covers login/session/token correctness broadly; this one is narrowly scoped to the cross-origin access-control layer.
- For APIs behind a CDN or API gateway that also sets CORS headers, check both layers — a correct application-level config can be silently overridden or duplicated by an infrastructure-level one, producing a header the app code never intended.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

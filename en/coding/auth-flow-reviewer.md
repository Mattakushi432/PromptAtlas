---
id: auth-flow-reviewer
title: Auth Flow Reviewer
category: coding
tags: [security, authentication, authorization]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Reviews an authentication/authorization flow — login, session management, token refresh, permission checks — for logic weaknesses, not injection or secrets. Distinct from `security-code-review-checklist`'s broad pass: this is a deep, flow-level review of one of the highest-consequence areas of a system.

## When to use it
- Reviewing a new or changed login, session, or permission-check flow before it ships.
- Auditing an existing auth system after a security concern was raised, or as part of a periodic security review.
- Learning common auth vulnerability patterns by seeing them checked against real flow code rather than reading OWASP docs abstractly.

## The Prompt

```
You review an authentication/authorization flow for logic weaknesses — not injection, not secrets management (those have dedicated reviews), but flaws in the auth logic itself.

Flow description and/or code (login, session handling, token issuance/refresh, permission checks — whatever's in scope): {{AUTH_FLOW}}
System context (optional — e.g. "single-page app with JWT", "server-rendered app with server sessions"): {{SYSTEM_CONTEXT}}

Instructions:
1. Check authentication logic: is the password/credential check resistant to timing attacks (constant-time comparison, not `==`/`.equals()` on secrets)? Is there rate limiting or lockout on repeated failed attempts (brute-force protection)? Are error messages on failed login generic enough to not leak whether a username exists (user enumeration risk)?
2. Check session/token management: how are sessions invalidated on logout — server-side (token/session actually revoked) or only client-side (a JWT that remains valid until natural expiry even after "logout")? Is a token refresh flow vulnerable to a stolen refresh token being used indefinitely (no rotation, no reuse detection)? Are session tokens transmitted and stored securely (HttpOnly/Secure cookie flags, not localStorage for sensitive tokens where XSS is a live risk)?
3. Check authorization/permission logic explicitly: is authorization checked on every protected action, or only sometimes (e.g., checked on page load but not on the underlying API call, allowing direct API access to bypass a UI-level check)? Is there any place authorization relies on a client-supplied value (a role or user ID from the request body/params) instead of server-side derived identity — this is a common privilege escalation vector (IDOR: Insecure Direct Object Reference).
4. Check for privilege escalation paths: can a user modify a request to act as a different user ID, or access another user's resources by guessing/enumerating an ID, because the authorization check verifies "is this a valid resource" but not "does this specific user own/have access to this specific resource"?
5. Check password reset / account recovery flow if in scope: is the reset token single-use, time-limited, and sufficiently random (not predictable/short)? Is the reset link/flow itself not leaking the token via referrer headers or logs?
6. Check for session fixation: does the session identifier change on privilege change (e.g., on login, does a pre-login session ID get replaced rather than reused post-authentication)?
7. For each finding, describe the specific attack scenario it enables (a concrete sequence of actions an attacker takes) and the specific fix — not a generic "improve your auth."

Output format: Markdown, one entry per finding, grouped by category (Authentication / Session & Token Management / Authorization / Privilege Escalation / Account Recovery), each with severity, attack scenario, and fix.
```

## Variables
- `{{AUTH_FLOW}}` — the flow description or code to review. Required.
- `{{SYSTEM_CONTEXT}}` — the architecture (SPA/JWT, server sessions, etc.), since correct patterns differ. Optional but sharpens the review significantly.

## Example
**Input:** `{{AUTH_FLOW}}` = an Express API where `GET /api/orders/:id` fetches an order by ID and returns it if the requesting user is authenticated, without checking whether the order belongs to that user.

**Output (excerpt):**
```
### Authorization — CRITICAL (IDOR)
`GET /api/orders/:id` checks that a valid authenticated session exists, but does not check that the authenticated user owns the requested order — any authenticated user can view any other user's order by guessing/incrementing the `:id`.
Attack scenario: User A, logged in, requests `/api/orders/1`, `/api/orders/2`, `/api/orders/3`... and sees other users' order details (potentially including addresses, payment info) without any authorization failure.
Fix: add an explicit ownership check: `if (order.userId !== req.user.id) return res.status(404).send()` (return 404, not 403, to avoid confirming the resource exists for IDs the user doesn't own).
```

## Tips & Variations
- For a multi-tenant system, explicitly add tenant isolation to the review scope — cross-tenant data access is a variant of IDOR with higher typical severity, and it's easy to miss if the reviewer only thinks in terms of per-user checks.
- If reviewing an OAuth/SSO integration specifically, ask it to also check state parameter validation (CSRF protection in the OAuth flow) and redirect URI validation (open redirect risk), which are common OAuth-specific weaknesses this general prompt's checklist doesn't cover by default.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

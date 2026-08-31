---
id: jwt-implementation-reviewer
title: JWT Implementation Reviewer
category: coding
tags: [security, authentication, backend]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Reviews JWT issuance and verification code for the specific implementation bugs that make JWTs a common source of real authentication bypasses — algorithm confusion, missing signature verification, and expiry handling — distinct from `auth-flow-reviewer` (coding, already shipped)'s broader review of the overall login/session flow.

## When to use it
- You're implementing JWT-based authentication (issuing or verifying tokens) and want a focused check on the token-handling code specifically, before it goes near a broader auth-flow review.
- You're integrating a JWT library for the first time and want to confirm you're using it in a way that actually enforces signature verification, not just decoding the payload.
- A security review flagged "JWT vulnerability" in a report and you need to map that to the exact line of code and understand the concrete exploit.

## The Prompt

```
You review JWT issuance and verification code for implementation-level authentication bypasses, not general code quality.

Token issuance code: {{ISSUANCE_CODE}}
Token verification code: {{VERIFICATION_CODE}}
Library/framework used: {{JWT_LIBRARY}}

Instructions:
1. Check the verification code actually verifies the signature using a fixed, server-known key/algorithm — not just decodes the payload (e.g. calling a `decode()` function instead of `verify()`, which returns the claims without checking the signature at all).
2. Check for algorithm confusion: does verification pin the expected algorithm (e.g. explicitly requiring RS256), or does it trust an `alg` value from the token itself? If the library/code accepts whatever algorithm the token header claims, an attacker who knows the server's RSA public key can forge a token signed with HS256 using that public key as the HMAC secret, and a naive verifier will accept it.
3. Check for the `alg: none` case specifically — some libraries and hand-rolled verifiers historically accepted this as "no signature required." Confirm it's explicitly rejected.
4. Check expiry (`exp`) is verified on every check, not just present in the payload — and check for a `nbf`/`iat` check if the application's use case needs one (e.g. rejecting tokens issued before a global logout/key-rotation timestamp).
5. Check where the signing/verification key comes from — a hardcoded secret in source, a low-entropy string, or a key reused across environments (dev key working in prod) are all findings.
6. If refresh tokens are in scope, check that access and refresh tokens are distinguishable (e.g. a `token_type` claim) so a leaked refresh token can't be replayed directly as an access token, and vice versa.
7. Check revocation: since JWTs are typically stateless, confirm there's a way to invalidate a token before its natural expiry (denylist, short expiry + refresh rotation, or a version/generation claim checked against current user state) for cases like a compromised account or logout.

Output format: Markdown. For each finding: the specific code location, the exploit in plain language, severity (critical/high/medium/low), and the concrete fix (with the correct library call if {{JWT_LIBRARY}} is identified). End with an explicit checklist: signature enforced (yes/no), algorithm pinned (yes/no), expiry enforced (yes/no), revocation path (present/absent).
```

## Variables
- `{{ISSUANCE_CODE}}` — the code that creates/signs JWTs. Required.
- `{{VERIFICATION_CODE}}` — the code that verifies/decodes incoming JWTs. Required.
- `{{JWT_LIBRARY}}` — the specific library and version in use, if known, so fixes can reference its actual API. Optional but improves fix specificity.

## Example
**Input:** `{{ISSUANCE_CODE}}` = "Signs with RS256 using the server's private key." `{{VERIFICATION_CODE}}` = "`jwt.verify(token, publicKey)` with no `algorithms` option passed." `{{JWT_LIBRARY}}` = "jsonwebtoken (Node.js)"

**Output (excerpt):**
```
### Finding: algorithm not pinned during verification — HS256 confusion possible
`jwt.verify(token, publicKey)` is called without an `algorithms` option. In jsonwebtoken, omitting this lets the token's own header `alg` value select the verification algorithm. An attacker who obtains the RSA public key (often not secret — it may be published for other purposes) can craft a token signed with HS256, using the public key string as the HMAC secret; the library will use that same public key to "verify" it, and the forged token will pass.
Severity: critical.
Fix: `jwt.verify(token, publicKey, { algorithms: ['RS256'] })` — explicitly restrict accepted algorithms to only the one actually used for issuance.

Checklist: Signature enforced — yes. Algorithm pinned — no (this finding). Expiry enforced — not shown, verify separately. Revocation path — not shown, verify separately.
```

## Tips & Variations
- Run this before or alongside `auth-flow-reviewer` (coding, already shipped): that prompt covers the surrounding login/session/authorization flow; this one is narrowly scoped to whether the token mechanism itself is sound, since a perfect auth flow built on a forgeable token is still broken.
- If the application uses a managed identity provider (Auth0, Cognito, Firebase Auth) rather than hand-issuing tokens, most issuance-side findings won't apply — focus the review on the verification side, since that's still application code even with a managed issuer.
- For high-security contexts, also ask about key rotation: a static, never-rotated signing key means a single key compromise has no time-bounded blast radius — this prompt doesn't check rotation cadence by default since it's an operational rather than code-level property, but it's worth raising explicitly.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

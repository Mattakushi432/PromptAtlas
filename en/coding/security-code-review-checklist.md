---
id: security-code-review-checklist
title: Security Code Review Checklist
category: coding
tags: [security, code-review, owasp]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Runs a code snippet through a fixed checklist of vulnerability classes (injection, auth, crypto, deserialization, SSRF, and more) instead of an open-ended review — for an engineer or reviewer who needs systematic security coverage, not a general quality pass.

## When to use it
- Reviewing code that touches user input, authentication, or sensitive data before it ships.
- Auditing a third-party or legacy module you don't trust and need a structured pass over.
- Preparing evidence for a security sign-off where "we checked X, Y, Z explicitly" matters more than a free-form opinion.

## The Prompt

```
You are an application security reviewer. Evaluate the code below against this fixed checklist of vulnerability classes — do not skip a category even if it looks obviously irrelevant; say "N/A: <one-line reason>" instead.

Language/stack: {{LANGUAGE_OR_STACK}}
Code:
{{CODE_SNIPPET}}

Checklist (evaluate every item):
1. Injection — SQL, NoSQL, command, LDAP, template, or log injection from unsanitized input.
2. Broken authentication/session handling — weak session tokens, missing expiry, credential exposure.
3. Broken access control — missing authorization checks, insecure direct object references (IDOR).
4. Cryptographic failures — weak/deprecated algorithms, hardcoded keys, insufficient randomness, plaintext secrets.
5. Insecure deserialization — untrusted data passed to a deserializer capable of executing code.
6. Server-side request forgery (SSRF) — user-influenced URLs fetched by the server without validation.
7. Input validation gaps — missing length/type/range checks that could enable downstream issues.
8. Sensitive data exposure — secrets, PII, or internal details in logs, error messages, or responses.
9. Security misconfiguration — permissive defaults, verbose errors, missing security headers (if applicable to this snippet).

For every FINDING: quote the exact vulnerable line(s), name the checklist category, give a concrete exploit scenario (an actual malicious input and its effect — not "an attacker could exploit this"), rate severity (CRITICAL/HIGH/MEDIUM/LOW), and give the specific fix as a code snippet.

If the snippet is too small or out of context to judge a category confidently (e.g., no visible auth check because auth happens elsewhere), say so rather than guessing.

Output format: Markdown, one subsection per checklist item in the order above, each marked FINDING(S) or N/A. End with a one-line overall risk rating.
```

## Variables
- `{{CODE_SNIPPET}}` — the code to review. Required.
- `{{LANGUAGE_OR_STACK}}` — e.g. "Node.js / Express", "Java / Spring". Required — vulnerability patterns are language-specific.

## Example
**Input:** `{{LANGUAGE_OR_STACK}}` = "PHP", `{{CODE_SNIPPET}}` = an endpoint that unserializes a user-supplied cookie value directly.

**Output (excerpt):**
```
### 5. Insecure deserialization
FINDING — `unserialize($_COOKIE['session_data'])` passes fully attacker-controlled input to PHP's unserialize().
Exploit: an attacker crafts a serialized object matching a class with a `__wakeup()`/`__destruct()` gadget present elsewhere in the app to achieve remote code execution.
Severity: CRITICAL.
Fix: replace with `json_decode($_COOKIE['session_data'], true)` and validate the resulting structure, or sign the cookie (HMAC) and verify before use.

**Overall risk rating:** CRITICAL — do not ship until finding #5 is fixed.
```

## Tips & Variations
- For a compliance audit trail, ask it to cite the relevant CWE ID next to each finding (e.g., CWE-502 for insecure deserialization).
- Narrow the checklist to a subset (e.g., only items 1, 3, 4) when reviewing a snippet where the other categories are provably out of scope, to save time on N/A noise.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

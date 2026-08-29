---
id: threat-model-kickoff
title: Threat Modeling Kickoff
category: coding
tags: [security, threat-modeling, stride, planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Produces a first-pass STRIDE-style threat model from a feature description before any code is written — the design-time session a security-conscious team runs to design mitigations in from day one. Distinct from scanning already-written code for vulnerabilities: this works from a description of what's being built, not a diff.

## When to use it
- Kicking off design for a feature that touches sensitive data, authentication, payments, or a new trust boundary.
- Preparing talking points for an actual threat-modeling meeting with a team.
- A lightweight substitute when a full security review isn't yet warranted but "did we think about this at all" is.

## The Prompt

```
You are facilitating a first-pass threat model for a feature that hasn't been built yet, using STRIDE. Work from the description given — don't invent implementation details not stated.

Feature description (what's being built, the actors involved, the data flows, and any known trust boundaries): {{FEATURE_DESCRIPTION}}

Data sensitivity (optional — what kind of data is involved, e.g., PII, payment data, none): {{DATA_SENSITIVITY}}

Steps:
1. Restate the trust boundaries and data flows you can identify from the description — who/what talks to whom, and where trust level changes (e.g., client to server, server to third-party API).
2. For each element, apply STRIDE — Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege — and list concrete, plausible threats specific to the actual actors and flows described, not generic textbook examples ("an attacker could spoof identity" is too vague; name which identity, at which boundary, and how).
3. Rate each threat by likelihood × impact (LOW/MEDIUM/HIGH for each).
4. Propose the single highest-leverage mitigation for each MEDIUM+ threat — the design choice that prevents it, not just "add validation."

Output: trust boundary summary, then a STRIDE threat table, then a "top mitigations to design in from day one" list, ranked.

If the description is too vague to identify real trust boundaries or actors, don't guess — list the specific questions that need answers before a threat model is possible.
```

## Variables
- `{{FEATURE_DESCRIPTION}}` — what's being built: actors, data flows, and any known trust boundaries. Required.
- `{{DATA_SENSITIVITY}}` — the kind of data involved, if any. Optional but sharpens the Information Disclosure and impact ratings significantly.

## Example
**Input:** `{{FEATURE_DESCRIPTION}}` = "A public API endpoint lets a logged-in user upload a profile photo, which is stored in S3 and served via a CDN URL returned to the client.", `{{DATA_SENSITIVITY}}` = "user-uploaded images, some may contain identifying information".

**Output (excerpt):**
```
Trust boundaries: client (untrusted input) → API server (validates, authenticates) → S3 (storage) → CDN (public delivery, no auth).

Tampering: the upload endpoint accepts a file with client-supplied content-type/filename — an attacker could upload a file that's actually an HTML/SVG payload disguised as an image, later served from the CDN's origin domain, enabling stored XSS if the CDN serves it inline. Likelihood: MEDIUM, Impact: HIGH.
Mitigation: validate actual file content (magic bytes, not just extension/content-type header) and serve uploaded images from a separate, cookie-less domain so any script execution can't access the main app's session.

Elevation of privilege: no ownership check visible on the upload path — if the endpoint accepts a target user ID rather than inferring it from the session, a user could overwrite another user's photo. Likelihood: MEDIUM, Impact: MEDIUM.
```

## Tips & Variations
- For an already-designed feature where you want retroactive coverage instead of pre-build design input, feed it the design doc or architecture diagram description as `{{FEATURE_DESCRIPTION}}` — same process works.
- Pair this with `secure-coding-checklist-generator` once implementation starts: this prompt sets the mitigations to design in; that one turns them into an implementation-time checklist.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

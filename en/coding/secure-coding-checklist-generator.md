---
id: secure-coding-checklist-generator
title: Secure Coding Checklist Generator
category: coding
tags: [security, checklist, best-practices]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Generates a secure-coding checklist tailored to a specific language/framework — a reference document for a team to use proactively, distinct from `security-code-review-checklist` (which reviews actual code against a fixed checklist). For establishing team standards, onboarding, or a PR template, not for auditing a specific piece of code.

## When to use it
- Onboarding a team onto a new language/framework and wanting a concrete secure-coding reference specific to it, not a generic OWASP list.
- Building a PR review checklist or contributing guide section for security practices specific to the project's stack.
- Establishing a baseline secure-coding standard for a new project before code review habits are set.

## The Prompt

```
You generate a secure-coding checklist tailored to a specific language and framework — concrete, framework-specific guidance, not a generic OWASP Top 10 restatement.

Language/framework: {{LANGUAGE_AND_FRAMEWORK}}
Application type (optional — e.g. "REST API", "server-rendered web app", "CLI tool handling user data"): {{APP_TYPE}}
Team experience level (optional — affects how much explanation each item needs): {{TEAM_LEVEL}}

Instructions:
1. Cover the vulnerability categories relevant to this specific language/framework/app type — skip categories that genuinely don't apply (e.g., skip XSS-specific guidance for a backend-only CLI tool with no HTML rendering) rather than padding the checklist for completeness.
2. For each checklist item, name the SPECIFIC framework mechanism to use, not a generic principle: "use Django's ORM parameterized queries; avoid `.raw()` and `.extra()` with unsanitized input" rather than "prevent SQL injection." A generic item is not actionable enough to be a real checklist.
3. Include framework-specific footguns: known patterns in this specific framework that look safe but aren't (a common source of real vulnerabilities in that ecosystem specifically), not just textbook vulnerability classes.
4. Organize by area (input handling, authentication, authorization, data storage, dependency management, error handling/logging, deployment config) rather than by abstract OWASP category names, so it reads as practical guidance a developer would actually consult.
5. For each item, note whether it's something the framework handles by default (and how to avoid accidentally disabling that protection) versus something the developer must explicitly implement — this distinction matters a lot for prioritization.
6. If {{TEAM_LEVEL}} indicates less experience, add a one-line "why this matters" for each item; for an experienced team, keep items terse and checklist-like without extended explanation.
7. Keep the list realistically sized (aim for the genuinely load-bearing items, not an exhaustive encyclopedia) — a 200-item checklist doesn't get used; a focused 20-30 item one does.

Output format: Markdown checklist, grouped by area, each item as a checkbox with the specific mechanism/pattern named.
```

## Variables
- `{{LANGUAGE_AND_FRAMEWORK}}` — e.g. "Python / Django", "Node.js / Express", "Go / net/http". Required.
- `{{APP_TYPE}}` — what kind of application this is, to scope relevant categories. Optional but improves relevance.
- `{{TEAM_LEVEL}}` — junior/mixed/senior, affects explanation depth. Optional.

## Example
**Input:** `{{LANGUAGE_AND_FRAMEWORK}}` = "Node.js / Express", `{{APP_TYPE}}` = "REST API serving a mobile app".

**Output (excerpt):**
```markdown
## Input Handling
- [ ] Validate request bodies with a schema library (e.g., Zod, Joi) at the route boundary — don't rely on TypeScript types alone, which vanish at runtime and don't validate anything from an actual HTTP request.
- [ ] Use parameterized queries via your DB driver/ORM; never build SQL with string concatenation/template literals from request data.

## Authentication
- [ ] Use `bcrypt`/`argon2` for password hashing, never a fast hash (MD5/SHA-family alone) — Express itself does nothing for you here, this is entirely on your implementation.
- [ ] Set cookies with `httpOnly`, `secure`, and `sameSite` flags explicitly if using cookie-based sessions — Express's default cookie settings are not secure by default.
```

## Tips & Variations
- Once generated, turn this into an actual PR template checklist or a linked doc in `CONTRIBUTING.md` so it gets used rather than read once and forgotten.
- For a compliance-driven context (SOC 2, HIPAA), ask it to add a section mapping checklist items to the specific compliance controls they help satisfy.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

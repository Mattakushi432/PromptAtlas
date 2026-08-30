---
id: mobile-deep-link-routing-validator
title: Mobile Deep Link Routing Validator
category: coding
tags: [mobile, routing, code-review]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Audits a mobile app's deep-link/universal-link route table for coverage gaps and unsafe parameter handling — checks the routing layer specifically, not the screens themselves, and flags routes that could crash, misnavigate, or be exploited from an untrusted external link.

## When to use it
- You're adding a new deep link and want to check it against the existing route table for conflicts or gaps before shipping.
- You're auditing an app's full deep-link surface ahead of a security review, since deep links are a common untrusted-input entry point that's easy to forget is external-facing.
- A user reported a crash or wrong screen from tapping a link, and you suspect a routing/param-handling bug rather than a screen-level bug.

## The Prompt

```
You audit a mobile app's deep-link/universal-link route table for coverage gaps and unsafe parameter handling. You review the routing layer — how incoming links are matched, parsed, and dispatched — not the destination screens' own logic.

Route table / linking code: {{ROUTE_CODE}}
Platform(s): {{PLATFORM}}
Example deep links currently supported: {{EXAMPLE_LINKS}}

Instructions:
1. Check every route pattern for parameters used without validation before being passed to a screen (e.g. an ID used directly in a database/API call, a URL used directly in a WebView) — a deep link is untrusted external input by definition, and unvalidated params are the most common source of crashes or injection from malformed/malicious links.
2. Check for route ambiguity: patterns that could match more than one route, or a catch-all/fallback route that's too permissive and could swallow links meant for a more specific route.
3. Check that every route has an explicit fallback behavior for missing or malformed required parameters (e.g. a link missing an expected `id` param) — the failure mode should be a graceful redirect or error screen, not a crash or an undefined-state screen.
4. Check for authentication/authorization gaps: does any route that should require a logged-in user or specific permission actually enforce that check at the routing layer, or does it navigate first and check later (which can cause a flash of unauthorized content or an inconsistent state)?
5. Cross-check {{EXAMPLE_LINKS}} against the route table to confirm each one actually resolves to the intended route and screen — a route table can look correct in isolation but still mishandle a real link due to a subtle pattern-matching bug.
6. Flag routes that exist in the route table but have no corresponding example/test link, and vice versa — an undocumented route is a common source of drift between what's actually shipped and what's actually tested.

Output format: Markdown, one entry per finding: the route pattern, the specific issue, and the fix. End with a coverage summary (routes checked, routes with no example link, any ambiguous matches found).
```

## Variables
- `{{ROUTE_CODE}}` — the deep-link route table/configuration and the parsing/dispatch logic. Required.
- `{{PLATFORM}}` — iOS, Android, or both (routing mechanisms and conventions differ). Required.
- `{{EXAMPLE_LINKS}}` — a set of real or representative deep links the app is expected to handle. Required — without concrete examples, ambiguity and coverage gaps are much harder to verify against actual behavior.

## Example
**Input:** `{{ROUTE_CODE}}` = "Route patterns: `/product/:id`, `/user/:userId/settings`, `/*` (catch-all → home screen). `:id` is passed directly to `fetchProduct(id)` with no validation." `{{PLATFORM}}` = "iOS (Universal Links)" `{{EXAMPLE_LINKS}}` = "myapp.com/product/123, myapp.com/user/456/settings"

**Output (excerpt):**
```
### Finding: unvalidated `:id` param passed to `fetchProduct`
Route: `/product/:id`. `id` is taken directly from the URL and passed to `fetchProduct(id)` with no type or format check. A malformed link (e.g. `/product/../../admin` or a non-numeric ID depending on the backend's handling) could cause an unexpected API call or crash rather than a controlled error.
Fix: validate `id` matches the expected format (e.g. numeric) before calling `fetchProduct`; on mismatch, route to a "content not found" state instead of calling the API with unvalidated input.

### Finding: catch-all route may swallow malformed intended-route links
Route: `/*` → home screen. A malformed `/product/` (missing ID) or `/user//settings` (missing userId) would fall through to the catch-all rather than surfacing as a clear "invalid link" state, silently hiding that a specific route was intended but broken.
Fix: consider a more specific fallback for malformed versions of known route prefixes (e.g. `/product/*` with no valid ID → "product not found" rather than generic home).

Coverage summary: 3 routes checked. `/user/:userId/settings` has no explicit auth check visible in the provided code — confirm this is intentional or add a login-required check at the route level. 0 ambiguous pattern matches found.
```

## Tips & Variations
- For a large route table, run this prompt in sections grouped by feature area rather than the whole table at once — makes findings easier to review and assign to the right owning team.
- Pair with a fuzzing/malformed-link test suite once findings are fixed — this prompt identifies likely issues from reading the code, but doesn't execute the routes to confirm the fix actually works as intended.
- For Android, note that intent filters can have additional matching subtleties (host/scheme/path combinations) beyond what a simple pattern-string review catches — flag anything that needs a device-level test to fully confirm.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

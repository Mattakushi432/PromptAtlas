---
id: hydration-mismatch-debugger
title: Hydration Mismatch Debugger
category: coding
tags: [frontend, debugging, troubleshooting]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-31
---

## Description
Diagnoses SSR/hydration mismatch errors (React's "Text content did not match", Vue's hydration warnings, and equivalents) by distinguishing among the handful of actual root causes — non-deterministic render output, browser-only APIs accessed during server render, and server/client data divergence — from the error message and component code, rather than generic component debugging.

## When to use it
- You're seeing a hydration mismatch warning/error in a server-rendered React, Vue, or similar app and need to find which of the few actual causes it is, fast, instead of guessing component-by-component.
- A hydration mismatch only reproduces intermittently or only in production, and you suspect it's a non-deterministic render source rather than a straightforward bug.
- You're migrating a client-only component to be server-rendered and want to proactively check it for the patterns that commonly cause mismatches before shipping.

## The Prompt

```
You diagnose a server-side-rendering hydration mismatch by identifying its specific root cause among a known set of causes, not by suggesting generic component refactors.

Framework: {{FRAMEWORK}}
The mismatch error/warning message, verbatim: {{ERROR_MESSAGE}}
The component(s) involved, including any data-fetching/render logic: {{COMPONENT_CODE}}

Instructions:
1. Check for non-deterministic render output first, since it's the most common cause: `Date.now()`, `new Date()`, `Math.random()`, or any value that can differ between the server's render pass and the client's — including locale/timezone-dependent formatting (e.g. `toLocaleDateString()`) that could resolve differently if server and client have different locale/timezone configuration.
2. Check for browser-only API access during what should be server-safe render code: `window`, `document`, `localStorage`, `navigator`, or a conditional like `typeof window !== 'undefined'` used incorrectly, all of which produce different output (or throw, if unguarded) on the server versus the client.
3. Check for server/client data divergence: does the server-rendered HTML use data from one source (e.g. a server-side fetch at request time) while the client's hydration pass uses a different or staler source (e.g. cached/localStorage data, or a client-side fetch that resolves after initial mount)? This is common with auth-dependent or personalized content that isn't consistently available at both render points.
4. Check for invalid HTML nesting that the browser silently "corrects" during initial parse (e.g. a `<div>` inside a `<p>`, or a `<table>` without required structural elements) — the DOM the browser actually builds from the server HTML can differ from what the framework's virtual DOM expects, causing a mismatch even though the server output was byte-correct as written.
5. Check for browser extension or third-party script interference only if the mismatch is reported as happening exclusively in specific users' browsers and not reproducible locally — this is a real but much rarer cause and shouldn't be the first hypothesis.
6. Map the finding to {{ERROR_MESSAGE}}'s specific text/location if the framework's error includes it (e.g. React's mismatch errors often name the specific text or element).

Output format: Markdown. Most-likely-cause first, with the specific line/pattern in {{COMPONENT_CODE}} responsible, why it diverges between server and client, and the concrete fix (make it deterministic, guard it to client-only rendering, or align the data source). List secondary hypotheses only if the primary one doesn't fully explain {{ERROR_MESSAGE}}.
```

## Variables
- `{{FRAMEWORK}}` — the SSR framework/library in use (React/Next.js, Vue/Nuxt, SvelteKit, etc.), since exact APIs and idioms for client-only guarding differ. Required.
- `{{ERROR_MESSAGE}}` — the mismatch error or warning text, verbatim, including any element/text details the framework reports. Required.
- `{{COMPONENT_CODE}}` — the component(s) implicated, including their data-fetching and render logic. Required.

## Example
**Input:** `{{FRAMEWORK}}` = "Next.js (React)" `{{ERROR_MESSAGE}}` = "Text content did not match. Server: \"Posted 3 hours ago\" Client: \"Posted 3 hours ago\" (mismatch reported on re-render, not initial paint — element text changes shortly after load)" `{{COMPONENT_CODE}}` = "`<span>{formatRelativeTime(post.createdAt)}</span>` where `formatRelativeTime` computes a string like \"X hours ago\" from `Date.now() - post.createdAt`."

**Output (excerpt):**
```
### Most likely cause: non-deterministic render output via Date.now()
`formatRelativeTime` computes its output using `Date.now()` at render time. The server renders at request time (say, 14:00:00), producing "3 hours ago"; the client hydrates a few hundred milliseconds to a few seconds later, and `Date.now()` on the client can already differ enough — or more likely, the relative time crosses a rounding boundary — to produce different output on the very next render, which React then reports as a mismatch even though it isn't a true SSR/CSR content mismatch, it's a component that re-renders itself into a different string almost immediately.

Fix: for relative-time display, render a stable, deterministic value on first render (e.g. the raw ISO timestamp, or compute the relative string once using a value passed from the server and frozen for that render), and only start live-updating the relative time client-side after hydration completes (e.g. in a `useEffect` that then triggers subsequent re-renders) — this avoids the server/client render producing different text for the same initial paint.

This is a variant of the general "non-deterministic render output" pattern, but specific to relative-time formatting: the actual divergence isn't server vs. client disagreement about "now," it's the component re-rendering into a different string within the hydration window itself.
```

## Tips & Variations
- If the root cause is browser-only API access, the fix is almost always to guard the access to run only after mount (e.g. read `window`/`localStorage` inside a `useEffect`/`onMounted` and render a server-safe fallback on the initial pass) rather than trying to make the API "work" on the server.
- Distinct from `responsive-layout-debugger` (coding, already shipped): that prompt diagnoses layout/CSS breakage at specific screen sizes; this one diagnoses server/client render-output disagreement, which is unrelated to viewport size.
- If {{ERROR_MESSAGE}} only reproduces in production and not in local dev, check specifically for environment-dependent values (server timezone/locale differing from the deployment region, or a CDN/edge-cached HTML response serving stale server output against a client that fetched fresh data) before assuming it's a code-level render bug at all.

## Changelog
- 1.0.0 (2026-08-31): Initial version.

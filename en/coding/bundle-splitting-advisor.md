---
id: bundle-splitting-advisor
title: Client-Side Bundle Splitting Advisor
category: coding
tags: [frontend, performance, build-tooling]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Recommends code-splitting boundaries for a specific app's route/feature structure — where to introduce dynamic imports so the initial bundle stays small. Distinct from `frontend-performance-auditor`, which audits a page's broader Core Web Vitals bottlenecks (images, fonts, render-blocking resources): this is narrowly about JS bundle structure and split points.

## When to use it
- An app's initial bundle size has grown large and load time is suffering.
- Adding a new heavy feature/library and deciding whether it needs its own split point.
- Reviewing whether existing code-splitting is actually effective or just theoretical.

## The Prompt

```
You are recommending code-splitting boundaries for a frontend app's bundle — where dynamic imports should go so the initial bundle stays small, not a broader performance audit.

App route/feature structure (routes/pages and their rough feature scope): {{APP_ROUTE_STRUCTURE}}

Known heavy dependencies (optional — specific large libraries in use, e.g., a charting library, a rich text editor, a PDF viewer, a syntax highlighter): {{KNOWN_HEAVY_DEPENDENCIES}}

Recommend:
1. Route-level splitting as the default baseline — each route/page as its own chunk, loaded only when navigated to, rather than one monolithic bundle covering the whole app.
2. Feature-level splitting within a route for anything not needed on that route's initial render — a modal that only opens on user action, a rarely-used settings panel, an advanced/optional feature — these should be their own dynamically-imported chunk even within an already-split route.
3. Specifically flag any of the `{{KNOWN_HEAVY_DEPENDENCIES}}` that should be dynamically imported rather than bundled into a main/route chunk, especially ones only needed on a specific user interaction (opening a specific modal, using a specific feature) rather than on initial page load — a heavy library bundled into the main chunk defeats the purpose of splitting even if the routes themselves are split.
4. Check for a common mistake: a dynamic `import()` that's immediately awaited unconditionally at the top of a component that always renders on load — this technically uses dynamic import syntax but still blocks initial render waiting for the chunk to download, providing none of splitting's actual benefit.

Output: recommended split points organized by route/feature, specific dependencies to dynamically import, and a note on verifying actual effectiveness — checking the real built bundle output (bundle analyzer, build stats) rather than assuming a dynamic import worked as intended, since bundler configuration mistakes can silently defeat an otherwise-correct-looking split.

If the app is small enough that initial bundle size genuinely isn't a problem yet, say so rather than recommending splitting for its own sake — premature splitting adds real complexity (loading states, additional network requests, more places for a chunk-load failure to occur) that isn't worth paying for below a certain scale.
```

## Variables
- `{{APP_ROUTE_STRUCTURE}}` — the app's routes/pages and their feature scope. Required.
- `{{KNOWN_HEAVY_DEPENDENCIES}}` — specific large libraries in use. Optional, but sharpens which split points matter most — a heavy dependency is usually the single biggest lever.

## Example
**Input:** `{{APP_ROUTE_STRUCTURE}}` = "Dashboard (default landing route), Reports (has a chart-heavy view), Settings (rarely visited, has an 'export data' feature with a PDF preview)", `{{KNOWN_HEAVY_DEPENDENCIES}}` = "a charting library (~200KB) used only on Reports, a PDF rendering library (~350KB) used only in Settings' export feature".

**Output (excerpt):**
```
Route-level split: Dashboard, Reports, and Settings should each be their own chunk at minimum — since Dashboard is the default landing route, keeping Reports' and Settings' code (and especially their heavy dependencies) out of Dashboard's initial bundle is the highest-value split in this structure.

Dependency-specific split: the charting library (~200KB) should be dynamically imported specifically within the Reports route's chart-rendering component, not just relying on Reports being its own route chunk — if the charting library is imported at the top of Reports' main file, it still loads for anyone visiting Reports even before scrolling to the chart, when it could instead load only when the chart section actually mounts (e.g., via `React.lazy` on the chart component specifically, or an intersection-observer-gated dynamic import if the chart is below the fold).

The PDF library (~350KB) is an even stronger candidate for feature-level (not just route-level) splitting — it's used only within Settings' export feature specifically, which is itself likely a small fraction of Settings visits. Dynamically import it only when the user actually initiates the export action, not anywhere in Settings' initial render.

Verification: after implementing these splits, check the actual build output (e.g., `webpack-bundle-analyzer` or the equivalent for the build tool in use) to confirm the charting and PDF libraries appear in their own separate chunks, not accidentally pulled back into a shared/vendor chunk that still loads eagerly — a common way splitting silently fails to deliver its intended benefit.
```

## Tips & Variations
- For a framework with file-based routing and built-in route-level code splitting (Next.js, Remix, etc.), route-level splitting may already be automatic — focus the analysis on feature-level splitting within routes and heavy-dependency isolation instead, and say so explicitly rather than recommending something the framework already handles.
- If loading states for split chunks aren't well-designed (a blank flash while a chunk loads), note that as a real UX cost of splitting worth addressing alongside the split points themselves, not a separate unrelated concern.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

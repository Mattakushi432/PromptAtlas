---
id: frontend-performance-auditor
title: Frontend Performance Auditor
category: coding
tags: [frontend, performance, core-web-vitals]
target_models: [Claude, GPT-4o, Gemini]
difficulty: advanced
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-29
---

## Description
Audits a page for Core Web Vitals bottlenecks (LCP, INP, CLS) from a description of the page and/or profiling data, and gives specific fixes ranked by impact — for a page with known or suspected performance issues, distinct from backend scalability planning.

## When to use it
- A page is scoring poorly on Core Web Vitals (in Lighthouse, CrUX, or real-user monitoring) and needs a prioritized fix list, not a generic performance checklist.
- Reviewing a new page/feature before launch to catch obvious Core Web Vitals regressions early.
- Explaining to stakeholders why a specific page is slow, in terms tied to the actual metrics that affect SEO/UX, not vague "it feels slow."

## The Prompt

```
You audit a page's Core Web Vitals bottlenecks from the description/data given, and provide specific, ranked fixes — not a generic Core Web Vitals explainer.

Page description (what it renders, key resources — images, fonts, third-party scripts, main content): {{PAGE_DESCRIPTION}}
Profiling data if available (Lighthouse report, CrUX data, performance trace summary): {{PROFILING_DATA}}
Known/suspected problem areas (optional): {{SUSPECTED_ISSUES}}

Instructions:
1. For LCP (Largest Contentful Paint): identify what element is likely the LCP candidate (usually a hero image, large text block, or above-the-fold content) and what's delaying it — render-blocking resources before it, a late-discovered image (not preloaded, loaded via JS instead of a plain `<img>`), missing `fetchpriority="high"`, or slow server response time (TTFB) if inferable.
2. For INP (Interaction to Next Paint): identify likely sources of input delay or long tasks — heavy JS execution blocking the main thread on interaction, large component re-renders, unoptimized event handlers, or third-party scripts monopolizing the main thread.
3. For CLS (Cumulative Layout Shift): identify elements likely causing shift — images/embeds without explicit width/height, web fonts causing a FOIT/FOUT reflow, content injected above existing content (ads, banners, cookie notices) without reserved space, or dynamically loaded content with no placeholder/skeleton.
4. For each finding, cite the specific evidence (from {{PROFILING_DATA}} if provided, or reasoned from {{PAGE_DESCRIPTION}} if not) and give the specific fix — a code-level or resource-loading change, not "optimize images" as a vague directive.
5. Rank findings by expected impact on the actual metric score, not just by ease of fix — a large win that requires more work should still rank above a trivial fix with negligible impact, though note both.
6. If {{PROFILING_DATA}} isn't provided, give your best reasoning-based diagnosis from the page description, and say what specific profiling data (a Lighthouse trace, CrUX field data) would confirm or correct it.

Output format: Markdown with sections per metric (LCP / INP / CLS), each with ranked findings: issue, evidence, fix, expected impact.
```

## Variables
- `{{PAGE_DESCRIPTION}}` — what the page renders and its key resources. Required.
- `{{PROFILING_DATA}}` — actual measurement data (Lighthouse, CrUX, a trace). Optional but turns the audit from inference into diagnosis.
- `{{SUSPECTED_ISSUES}}` — known problem areas to prioritize investigating. Optional.

## Example
**Input:** `{{PAGE_DESCRIPTION}}` = "a product page with a large hero image loaded via a JS-driven image carousel component, plus three render-blocking third-party analytics scripts in the `<head>`", `{{PROFILING_DATA}}` = "Lighthouse: LCP 4.2s, LCP element is the hero image".

**Output (excerpt):**
```
## LCP (4.2s — target under 2.5s)
1. **[High impact] Hero image loaded via JS carousel component, not a plain `<img>`**
   Evidence: Lighthouse identifies the hero image as the LCP element; a JS-rendered image is discovered by the browser's preload scanner much later than a plain `<img src>` in the initial HTML, delaying LCP significantly.
   Fix: render the LCP-candidate hero image as a plain `<img>` (or `<link rel="preload" as="image">` it) in the initial HTML, with the carousel logic layered on top after hydration, not gating the image's existence.

2. **[Medium impact] Three render-blocking analytics scripts in `<head>`**
   Evidence: render-blocking scripts delay first paint and, transitively, LCP.
   Fix: add `async` or `defer` to third-party analytics scripts — they don't need to block rendering.
```

## Tips & Variations
- Paste an actual Lighthouse JSON report or a Chrome DevTools Performance trace summary as `{{PROFILING_DATA}}` for far more precise findings than a page description alone allows.
- For a site with many similar pages (e.g., an e-commerce catalog), run this on one representative page and ask it to note which findings are template-level (fix once, apply everywhere) versus page-specific.

## Changelog
- 1.0.0 (2026-08-29): Initial version.

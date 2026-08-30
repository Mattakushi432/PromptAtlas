---
id: seo-content-brief-generator
title: SEO Content Brief Generator
category: marketing-and-sales
tags: [seo, content-creation, planning]
target_models: [Claude, GPT-4o, Gemini]
difficulty: beginner
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Turns a target keyword and search intent into a structured content brief (suggested headings, questions to answer, search intent notes, internal linking suggestions) for a writer to draft from — a planning tool for the "what should this article cover" stage, distinct from `outline-to-draft-blog-expander` (writing-and-content), which expands an outline into prose once the brief/outline already exists.

## When to use it
- You're briefing a writer (internal or freelance) on a new SEO-targeted article and want a structured brief instead of just handing them a keyword.
- You have a target keyword but haven't researched what a comprehensive, intent-matching article actually needs to cover.
- You're auditing an existing article's structure against what a brief for that keyword should have included, to find content gaps.

## The Prompt

```
You generate an SEO content brief for a target keyword: search intent analysis, a suggested heading structure, specific questions the article should answer, and internal linking suggestions — enough for a writer to draft from without further research on scope.

Target keyword: {{KEYWORD}}
Site/brand context: {{SITE_CONTEXT}}
Existing related pages (for internal linking): {{RELATED_PAGES}}

Instructions:
1. State the likely search intent behind {{KEYWORD}} — informational, commercial-investigation, transactional, or navigational — and what that implies for the article's angle (e.g. a commercial-investigation query needs comparison/evaluation content, not a how-to).
2. Propose a heading structure (H1 + H2s, with H3s where a section clearly needs sub-breakdown) that would comprehensively address the intent — each heading should map to a real sub-topic a searcher with this intent would want covered, not generic filler sections.
3. List specific questions the article should answer, framed the way a real searcher would ask them (not restated keyword variations) — these should map to what someone would actually type into a search bar or ask a colleague.
4. Suggest internal links to {{RELATED_PAGES}} only where there's a genuine topical connection to a specific section of the planned article — do not suggest links just to increase link count.
5. Note a realistic target length range based on intent and competitiveness signals implied by {{KEYWORD}} (a broad, competitive term generally needs more comprehensive coverage than a long-tail, specific one) — but flag this as a rough guide, not a rule, since actual competitive research isn't available to this prompt.
6. If {{KEYWORD}} is ambiguous (multiple plausible search intents), say so and either ask which intent to brief for, or provide brief notes for each plausible intent rather than guessing one.

Output format: Markdown with sections: `## Search Intent`, `## Suggested Heading Structure`, `## Questions to Answer`, `## Internal Linking Suggestions`, `## Target Length`.
```

## Variables
- `{{KEYWORD}}` — the target keyword/phrase. Required.
- `{{SITE_CONTEXT}}` — what the site/brand is and its general audience, so the brief's angle fits (e.g. a brief for a beginner-focused site differs from one for a technical/expert audience). Required.
- `{{RELATED_PAGES}}` — existing pages/URLs with a one-line topic note each, for internal linking suggestions. Optional — omit if not yet available; the brief still works without linking suggestions.

## Example
**Input:** `{{KEYWORD}}` = "best project management software for small teams" · `{{SITE_CONTEXT}}` = "B2B SaaS blog for a project management tool aimed at agencies and small teams" · `{{RELATED_PAGES}}` = "/features/time-tracking, /pricing"

**Output (excerpt):**
```
## Search Intent
Commercial-investigation — the searcher is comparing options before choosing, not looking for a definition or ready to buy a specific named product yet. The article should be a genuine comparison/evaluation, not a single-product pitch disguised as a "best of" list.

## Suggested Heading Structure
- H1: Best Project Management Software for Small Teams in 2026
- H2: What Small Teams Actually Need From PM Software (Different From Enterprise Needs)
- H2: Top Options Compared
  - H3: [Tool category 1 — e.g. simple/lightweight]
  - H3: [Tool category 2 — e.g. feature-rich]
...
```

## Tips & Variations
- Once the brief is ready, hand it to `outline-to-draft-blog-expander` (writing-and-content) as the outline input — the heading structure this prompt produces maps directly to that prompt's `{{OUTLINE}}` variable.
- For a content gap audit on an existing article instead of a new brief, paste the article's current headings as `{{RELATED_PAGES}}`-style context and ask explicitly what the brief would have included that the article is missing.
- This prompt doesn't have access to real search volume, competition, or SERP data — for high-stakes keyword decisions, verify intent and competitiveness against actual SEO tooling before committing significant writing effort.

## Changelog
- 1.0.0 (2026-08-30): Initial version.

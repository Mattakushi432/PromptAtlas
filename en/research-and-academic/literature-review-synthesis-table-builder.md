---
id: literature-review-synthesis-table-builder
title: Literature Review Synthesis Table Builder
category: research-and-academic
tags: [literature-review, academic-writing, research]
target_models: [Claude, GPT-4o, Gemini]
difficulty: intermediate
version: 1.0.0
status: stable
language: en
last_updated: 2026-08-30
---

## Description
Organizes notes/summaries of multiple papers into a structured synthesis table (study, method, key finding, relevance, limitation) that surfaces patterns and gaps across the literature — a synthesis tool for sources already gathered and summarized, not a literature search or citation tool.

## When to use it
- You've read/summarized a set of papers for a literature review and need them organized into a comparable structure rather than a loose pile of separate notes.
- You want to check whether your reading actually reveals a pattern, contradiction, or gap in the literature, rather than assuming one without laying the studies side by side.
- You're drafting the literature review section of a paper/thesis and need a structured intermediate artifact before writing continuous prose.

## The Prompt

```
You organize notes on multiple papers into a structured synthesis table and identify patterns/gaps across them. You work only from what's given in the notes — you do not invent study details, findings, or methods not present in the input.

Paper notes/summaries: {{PAPER_NOTES}}
Research question this review supports: {{RESEARCH_QUESTION}}

Instructions:
1. Build a table with one row per paper: study (author/year), method (design, sample if given), key finding relevant to {{RESEARCH_QUESTION}}, and a noted limitation (only if stated or clearly implied by the notes — otherwise mark `[NOT STATED]` rather than inventing one).
2. After the table, identify genuine patterns across studies: findings that converge, findings that conflict, and methodological patterns (e.g. most studies use a similar design, which is itself a gap if no study uses an alternative approach) — state which specific papers support each pattern, not a vague "the literature suggests."
3. Explicitly flag contradictions between papers rather than smoothing over them into an artificial consensus — a synthesis that hides disagreement in the literature is less useful than one that names it and, if the notes support it, suggests why the studies might diverge (different populations, different methods, different time periods).
4. Identify gaps: what {{RESEARCH_QUESTION}}-relevant angle does no paper in {{PAPER_NOTES}} address? This is often the most valuable output for someone about to design new research, so make it explicit rather than burying it.
5. If the notes on a given paper are too thin to place meaningfully in the synthesis (e.g. missing method details), flag that paper as needing a fuller read rather than filling gaps with plausible-sounding guesses.

Output format: a Markdown synthesis table, followed by `### Convergent Findings`, `### Contradictions`, and `### Gaps` sections.
```

## Variables
- `{{PAPER_NOTES}}` — notes/summaries of each paper being synthesized, as detailed as available. Required — synthesis quality is bounded by the depth of these notes.
- `{{RESEARCH_QUESTION}}` — the question this literature review is meant to support. Required — without it, relevance and gap-identification can't be judged.

## Example
**Input:** `{{PAPER_NOTES}}` = "Smith 2021: survey study, n=200, found remote workers report higher job satisfaction. Jones 2022: interview study, n=15, found remote workers report feeling isolated and less satisfied. Lee 2023: survey, n=500, found satisfaction depends heavily on whether remote work was chosen vs. mandated." `{{RESEARCH_QUESTION}}` = "How does remote work affect employee job satisfaction?"

**Output (excerpt):**
```
| Study | Method | Key Finding | Limitation |
|---|---|---|---|
| Smith 2021 | Survey, n=200 | Remote workers report higher job satisfaction | [NOT STATED] |
| Jones 2022 | Interviews, n=15 | Remote workers report isolation, lower satisfaction | Small sample size limits generalizability (n=15) |
| Lee 2023 | Survey, n=500 | Satisfaction depends on whether remote work was chosen or mandated | [NOT STATED] |

### Convergent Findings
None of the three studies converge cleanly — Smith and Jones report opposite directions of effect.

### Contradictions
Smith 2021 (higher satisfaction) directly conflicts with Jones 2022 (lower satisfaction, isolation). Lee 2023 offers a plausible resolution: satisfaction may depend on choice/mandate status rather than remote work itself being uniformly positive or negative — a moderating variable neither Smith nor Jones's notes indicate they controlled for.

### Gaps
None of the three studies' notes indicate longitudinal design — all appear to be cross-sectional, so causal direction (does remote work affect satisfaction, or does satisfaction affect who chooses/stays remote) isn't addressed by this set of papers.
```

## Tips & Variations
- The "Contradictions" and "Gaps" sections are usually the most useful parts of the output for shaping an actual research contribution — don't skip past them to get to the smoother-sounding "Convergent Findings" section.
- For a very large literature set (30+ papers), consider running this in batches by sub-theme rather than one giant table — a table with too many rows becomes hard to scan for patterns, which defeats its purpose.
- This prompt does not verify citations are real or search for papers — it only organizes and synthesizes notes you provide; verify all source details independently before using this synthesis in a submitted paper.

## Changelog
- 1.0.0 (2026-08-30): Initial version.
